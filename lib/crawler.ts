import * as cheerio from "cheerio";
import { SeoAuditResult, SecurityAuditResult, AssetsBreakdown, SecurityHeaderCheck } from "@/types/audit";

async function checkRobotsAndSitemap(origin: string): Promise<{ robotsTxtFound: boolean; sitemapFound: boolean }> {
  let robotsTxtFound = false;
  let sitemapFound = false;
  const sitemapUrlsFromRobots: string[] = [];

  // 1. Fetch robots.txt
  try {
    const res = await fetch(`${origin}/robots.txt`, {
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "AI-Website-Auditor/1.0" },
    });
    if (res.ok) {
      const text = await res.text();
      robotsTxtFound = text.toLowerCase().includes("user-agent");

      // Extract Sitemap directives from robots.txt (e.g. Sitemap: https://example.com/sitemap.xml)
      const lines = text.split("\n");
      for (const line of lines) {
        const match = line.match(/^sitemap:\s*(https?:\/\/\S+)/i);
        if (match && match[1]) {
          sitemapUrlsFromRobots.push(match[1].trim());
        }
      }
    }
  } catch {
    // ignore
  }

  // 2. Fetch standard /sitemap.xml
  try {
    const res = await fetch(`${origin}/sitemap.xml`, {
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "AI-Website-Auditor/1.0" },
    });
    if (res.ok) {
      const text = await res.text();
      if (text.includes("<urlset") || text.includes("<sitemapindex")) {
        sitemapFound = true;
      }
    }
  } catch {
    // ignore
  }

  // 3. If standard /sitemap.xml was not found, check sitemap declared in robots.txt
  if (!sitemapFound && sitemapUrlsFromRobots.length > 0) {
    try {
      const res = await fetch(sitemapUrlsFromRobots[0], {
        signal: AbortSignal.timeout(5000),
        headers: { "User-Agent": "AI-Website-Auditor/1.0" },
      });
      if (res.ok) {
        const text = await res.text();
        if (text.includes("<urlset") || text.includes("<sitemapindex")) {
          sitemapFound = true;
        }
      } else {
        // Declaring a sitemap URL in robots.txt is still valid evidence of a sitemap
        sitemapFound = true;
      }
    } catch {
      sitemapFound = true;
    }
  }

  return { robotsTxtFound, sitemapFound };
}

// Computes the accessible name for a heading element (handles text, aria-label, img[alt], svg, etc.)
function getElementAccessibleHeadingText(
  $: cheerio.CheerioAPI,
  el: any
): { text: string; isLogo: boolean; isHidden: boolean } {
  // Check if visually hidden or sr-only
  const classes = ($(el).attr("class") || "").toLowerCase();
  const style = ($(el).attr("style") || "").toLowerCase();
  const hiddenAttr = $(el).attr("hidden");
  const ariaHidden = $(el).attr("aria-hidden");

  const isSrOnlyClass =
    classes.includes("sr-only") ||
    classes.includes("visually-hidden") ||
    classes.includes("hidden") ||
    classes.includes("invisible") ||
    classes.includes("screen-reader");

  const isHiddenStyle =
    style.includes("display:none") ||
    style.includes("display: none") ||
    style.includes("visibility:hidden") ||
    style.includes("visibility: hidden") ||
    style.includes("opacity:0") ||
    style.includes("opacity: 0") ||
    style.includes("left:-9999") ||
    style.includes("clip:rect") ||
    style.includes("clip: rect");

  const isHidden = Boolean(hiddenAttr !== undefined || ariaHidden === "true" || isSrOnlyClass || isHiddenStyle);

  // 1. Direct or nested aria-label
  const ariaLabel = $(el).attr("aria-label")?.trim();
  if (ariaLabel) return { text: ariaLabel, isLogo: false, isHidden };

  // 2. Direct text content
  const directText = $(el).text().replace(/\s+/g, " ").trim();

  // 3. Check for image logo (e.g. <h1><a href="/"><img alt="Seznam.cz - hlavní strana"></a></h1>)
  const imgAlts: string[] = [];
  $(el).find("img[alt]").each((_, img) => {
    const alt = $(img).attr("alt")?.trim();
    if (alt && !imgAlts.includes(alt)) imgAlts.push(alt);
  });

  const svgTitle = $(el).find("svg title").text().trim() || $(el).find("svg[aria-label]").attr("aria-label")?.trim();

  if (imgAlts.length > 0) {
    return { text: imgAlts.join(" "), isLogo: true, isHidden };
  }
  if (svgTitle) {
    return { text: svgTitle, isLogo: true, isHidden };
  }

  // 4. Fallback to title attribute
  const titleAttr = $(el).attr("title")?.trim() || $(el).find("[title]").first().attr("title")?.trim();
  if (!directText && titleAttr) {
    return { text: titleAttr, isLogo: false, isHidden };
  }

  return { text: directText, isLogo: false, isHidden };
}

export interface CrawlResult {
  html: string;
  statusCode: number;
  responseTimeMs: number;
  seo: SeoAuditResult;
  security: SecurityAuditResult;
  assets: AssetsBreakdown;
  techStack: string[];
}

export async function crawlWebsite(targetUrl: string): Promise<CrawlResult> {
  const startTime = Date.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 AI-Website-Auditor/1.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "cs,en;q=0.9",
      },
      redirect: "follow",
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const msg = err instanceof Error ? err.message : "Chyba při stahování stránky";
    throw new Error(`Nepodařilo se načíst stránku (${targetUrl}): ${msg}`);
  } finally {
    clearTimeout(timeoutId);
  }

  const responseTimeMs = Date.now() - startTime;
  const html = await response.text();
  const $ = cheerio.load(html);

  // 1. Title Analysis
  const titleText = $("title").first().text().trim();
  const titleLen = titleText.length;
  let titleStatus: "pass" | "warn" | "fail" = "pass";
  let titleRec = "Titulek stránky má optimální délku (30–60 znaků).";

  if (titleLen === 0) {
    titleStatus = "fail";
    titleRec = "Chybí titulek stránky (<title>). Přidejte výstižný titulek obsahující klíčová slova.";
  } else if (titleLen < 30) {
    titleStatus = "warn";
    titleRec = `Titulek je příliš krátký (${titleLen} znaků). Doporučujeme 30–60 znaků pro lepší zobrazení ve vyhledávačích.`;
  } else if (titleLen > 65) {
    titleStatus = "warn";
    titleRec = `Titulek je příliš dlouhý (${titleLen} znaků). Ve vyhledávačích může být oříznut. Zkraťte jej pod 60 znaků.`;
  }

  // 2. Meta Description Analysis
  const metaDesc = $('meta[name="description" i]').attr("content")?.trim() || "";
  const descLen = metaDesc.length;
  let descStatus: "pass" | "warn" | "fail" = "pass";
  let descRec = "Meta description má optimální délku (120–160 znaků).";

  if (descLen === 0) {
    descStatus = "fail";
    descRec = "Chybí meta description. Vyhledávače mohou zobrazit náhodný text z těla stránky.";
  } else if (descLen < 80) {
    descStatus = "warn";
    descRec = `Meta description je příliš krátký (${descLen} znaků). Doporučujeme 120–160 znaků.`;
  } else if (descLen > 165) {
    descStatus = "warn";
    descRec = `Meta description je příliš dlouhý (${descLen} znaků). Může být ve vyhledávači useknut.`;
  }

  // 3. Headings Analysis (accessible name calculation, handles image logos with alt, aria-label, role='heading')
  const h1Elements: string[] = [];
  let isH1Hidden = false;
  let isH1Logo = false;

  $("h1, [role='heading'][aria-level='1']").each((i, el) => {
    const { text, isLogo, isHidden } = getElementAccessibleHeadingText($, el);
    const displayText = text || `(H1 bez textu #${i + 1})`;
    h1Elements.push(displayText);
    if (isHidden) isH1Hidden = true;
    if (isLogo) isH1Logo = true;
  });

  const h2Count = $("h2, [role='heading'][aria-level='2']").length;
  const h3Count = $("h3, [role='heading'][aria-level='3']").length;
  const hasH1 = h1Elements.length > 0;
  const multipleH1 = h1Elements.length > 1;

  let headingsStatus: "pass" | "warn" | "fail" = "pass";
  let headingsRec = "Struktura nadpisů H1–H3 je v pořádku.";

  if (!hasH1) {
    headingsStatus = "fail";
    headingsRec = "Stránce chybí hlavní nadpis H1. Každá stránka by měla mít právě jeden srozumitelný H1 nadpis.";
  } else if (multipleH1) {
    headingsStatus = "warn";
    headingsRec = `Nalezeno více nadpisů H1 (${h1Elements.length}x). Doporučujeme ponechat pouze jeden hlavní H1 pro definici tématu stránky.`;
  } else if (isH1Hidden) {
    headingsStatus = "warn";
    headingsRec = "Hlavní nadpis H1 je v kódu přítomen, ale je vizuálně skrytý (sr-only/CSS). Pro optimální SEO a UX doporučujeme mít hlavní nadpis i viditelně zobrazený.";
  } else if (isH1Logo) {
    headingsStatus = "pass";
    headingsRec = `Hlavní nadpis H1 je definován grafickým logem s alt popisem (${h1Elements[0]}). Doporučujeme zajistit, aby alt text obsahoval výstižná klíčová slova.`;
  }

  // 4. Open Graph
  const ogTitle = $('meta[property="og:title" i]').attr("content")?.trim();
  const ogDescription = $('meta[property="og:description" i]').attr("content")?.trim();
  const ogImage = $('meta[property="og:image" i]').attr("content")?.trim();
  const ogUrl = $('meta[property="og:url" i]').attr("content")?.trim();
  const ogType = $('meta[property="og:type" i]').attr("content")?.trim();
  const hasBasicOg = Boolean(ogTitle && (ogImage || ogDescription));

  // 5. Twitter Card
  const twitterCard = $('meta[name="twitter:card" i]').attr("content")?.trim();
  const twitterTitle = $('meta[name="twitter:title" i]').attr("content")?.trim();
  const twitterDesc = $('meta[name="twitter:description" i]').attr("content")?.trim();
  const twitterImg = $('meta[name="twitter:image" i]').attr("content")?.trim();
  const hasTwitter = Boolean(twitterCard || twitterTitle);

  // 6. Canonical
  const canonicalHref = $('link[rel="canonical" i]').attr("href")?.trim();
  let canonicalStatus: "pass" | "warn" | "fail" = "pass";
  let canonicalRec = "Kanonická URL je správně definována.";
  let matchesTarget = false;

  if (!canonicalHref) {
    canonicalStatus = "warn";
    canonicalRec = "Chybí kanonická značka (<link rel='canonical'>). Pomáhá předcházet problémům s duplicitním obsahem.";
  } else {
    try {
      const parsedCanonical = new URL(canonicalHref, targetUrl).href;
      const parsedTarget = new URL(targetUrl).href;
      matchesTarget = parsedCanonical === parsedTarget;
    } catch {
      matchesTarget = false;
    }
  }

  // 7. Schema.org JSON-LD
  const schemaScripts = $('script[type="application/ld+json"]');
  const schemaTypes: string[] = [];
  schemaScripts.each((_, el) => {
    try {
      const content = $(el).html();
      if (content) {
        const json = JSON.parse(content);
        if (Array.isArray(json)) {
          json.forEach((item) => {
            if (item["@type"]) schemaTypes.push(String(item["@type"]));
          });
        } else if (json["@type"]) {
          schemaTypes.push(String(json["@type"]));
        } else if (json["@graph"] && Array.isArray(json["@graph"])) {
          json["@graph"].forEach((item: { "@type"?: string }) => {
            if (item["@type"]) schemaTypes.push(String(item["@type"]));
          });
        }
      }
    } catch {
      // ignore
    }
  });

  // 8. Robots
  const robotsMeta = $('meta[name="robots" i]').attr("content")?.toLowerCase() || "";
  const isNoindex = robotsMeta.includes("noindex");
  const isNofollow = robotsMeta.includes("nofollow");

  // 8b. Live robots.txt & sitemap.xml verification
  let origin = "";
  try { origin = new URL(targetUrl).origin; } catch { /* ignore */ }
  const { robotsTxtFound, sitemapFound } = origin
    ? await checkRobotsAndSitemap(origin)
    : { robotsTxtFound: false, sitemapFound: false };

  // 9. Hreflang
  const hreflangs: string[] = [];
  $('link[rel="alternate"][hreflang]').each((_, el) => {
    const lang = $(el).attr("hreflang");
    if (lang) hreflangs.push(lang);
  });

  // 10. Content & Links Stats
  // Clone body to count text without destroying DOM for assets
  const textClone = $("body").clone();
  textClone.find("script, style, noscript, svg").remove();
  const bodyText = textClone.text().replace(/\s+/g, " ").trim();
  const words = bodyText ? bodyText.split(" ").length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  let internalLinksCount = 0;
  let externalLinksCount = 0;
  let targetHostname = "";
  try {
    targetHostname = new URL(targetUrl).hostname;
  } catch {
    targetHostname = "";
  }

  const thirdPartyDomainsSet = new Set<string>();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href")?.trim();
    if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }
    try {
      const linkUrl = new URL(href, targetUrl);
      if (linkUrl.hostname === targetHostname) {
        internalLinksCount++;
      } else {
        externalLinksCount++;
        thirdPartyDomainsSet.add(linkUrl.hostname);
      }
    } catch {
      // ignore
    }
  });

  const faviconFound = $('link[rel*="icon" i]').length > 0;

  // 11. Assets & Network Breakdown
  let scriptsExternal = 0;
  let scriptsInline = 0;
  $("script").each((_, el) => {
    const src = $(el).attr("src");
    if (src) {
      scriptsExternal++;
      try {
        const scriptHost = new URL(src, targetUrl).hostname;
        if (scriptHost !== targetHostname) thirdPartyDomainsSet.add(scriptHost);
      } catch {
        // ignore
      }
    } else {
      scriptsInline++;
    }
  });

  let stylesExternal = 0;
  let stylesInline = $("style").length;
  $('link[rel="stylesheet"]').each((_, el) => {
    stylesExternal++;
    const href = $(el).attr("href");
    if (href) {
      try {
        const styleHost = new URL(href, targetUrl).hostname;
        if (styleHost !== targetHostname) thirdPartyDomainsSet.add(styleHost);
      } catch {
        // ignore
      }
    }
  });

  const imagesCount = $("img").length;
  const iframesCount = $("iframe").length;

  // Count render-blocking scripts (no async, defer, or type=module)
  let renderBlockingScripts = 0;
  $("script[src]").each((_, el) => {
    const hasAsync = $(el).attr("async") !== undefined;
    const hasDefer = $(el).attr("defer") !== undefined;
    const typeAttr = $(el).attr("type")?.toLowerCase() || "";
    const isModule = typeAttr === "module";
    if (!hasAsync && !hasDefer && !isModule) {
      renderBlockingScripts++;
    }
  });

  // Count images with lazy loading
  const lazyImagesCount = $('img[loading="lazy"]').length;

  const fontsDetected: string[] = [];
  if (html.includes("fonts.googleapis.com") || html.includes("fonts.gstatic.com")) fontsDetected.push("Google Fonts");
  if (html.includes("use.typekit.net") || html.includes("p.typekit.net")) fontsDetected.push("Adobe Typekit");
  if (html.includes("@font-face")) fontsDetected.push("Vlastní webfonty (@font-face)");

  const htmlSizeBytes = Buffer.byteLength(html, "utf8");
  const htmlSizeFormatted = htmlSizeBytes < 1024
    ? `${htmlSizeBytes} B`
    : `${(htmlSizeBytes / 1024).toFixed(1)} KB`;

  // 12. Security & HTTP Headers
  const isHttps = targetUrl.startsWith("https://");
  const headers = response.headers;
  const securityHeaderChecks: SecurityHeaderCheck[] = [];

  const checkHeader = (name: string, desc: string, rec: string) => {
    const val = headers.get(name.toLowerCase());
    if (val) {
      securityHeaderChecks.push({
        name,
        value: val,
        status: "pass",
        description: desc,
        recommendation: "Hlavička je správně nakonfigurována.",
      });
    } else {
      securityHeaderChecks.push({
        name,
        value: null,
        status: name === "Strict-Transport-Security" || name === "X-Content-Type-Options" ? "fail" : "warn",
        description: desc,
        recommendation: rec,
      });
    }
  };

  checkHeader(
    "Strict-Transport-Security",
    "Vynucuje bezpečné šifrované spojení HTTPS (HSTS) a chrání před útoky typu Man-in-the-Middle.",
    "Doplňte hlavičku 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'."
  );
  checkHeader(
    "X-Content-Type-Options",
    "Zabraňuje prohlížeči v nebezpečném odhadování MIME typu souborů (MIME-sniffing).",
    "Přidejte hlavičku 'X-Content-Type-Options: nosniff'."
  );
  checkHeader(
    "X-Frame-Options",
    "Chrání web před zneužitím v cizím iframe (útoky typu Clickjacking).",
    "Přidejte hlavičku 'X-Frame-Options: SAMEORIGIN' nebo 'DENY'."
  );
  checkHeader(
    "Content-Security-Policy",
    "Omezuje zdroje, ze kterých může prohlížeč stahovat skripty a styly (ochrana proti XSS).",
    "Nakonfigurujte Content-Security-Policy s povolenými doménami."
  );
  checkHeader(
    "Referrer-Policy",
    "Chrání soukromí uživatelů tím, že omezuje odesílání citlivých údajů v hlavičce Referer.",
    "Přidejte hlavičku 'Referrer-Policy: strict-origin-when-cross-origin'."
  );

  let securityDeduction = 0;
  if (!isHttps) securityDeduction += 40;
  securityHeaderChecks.forEach((chk) => {
    if (chk.status === "fail") securityDeduction += 15;
    else if (chk.status === "warn") securityDeduction += 8;
  });
  const securityScore = Math.max(20, Math.min(100, 100 - securityDeduction));

  // 13. Tech Stack Detection
  const techStack: string[] = [];
  const fullHtmlLower = html.toLowerCase();

  if (fullHtmlLower.includes("__next") || fullHtmlLower.includes("_next/static")) techStack.push("Next.js");
  if (fullHtmlLower.includes("react") || fullHtmlLower.includes("__react")) techStack.push("React");
  if (fullHtmlLower.includes("vue") || fullHtmlLower.includes("nuxt")) techStack.push("Vue/Nuxt");
  if (fullHtmlLower.includes("wp-content") || fullHtmlLower.includes("wp-includes")) techStack.push("WordPress");
  if (fullHtmlLower.includes("shopify")) techStack.push("Shopify");
  if (fullHtmlLower.includes("tailwind")) techStack.push("Tailwind CSS");
  if (fullHtmlLower.includes("bootstrap")) techStack.push("Bootstrap");
  if (fullHtmlLower.includes("google-analytics.com") || fullHtmlLower.includes("googletagmanager.com")) techStack.push("Google Analytics / GTM");
  if (headers.get("server")?.toLowerCase().includes("cloudflare") || headers.get("cf-ray")) techStack.push("Cloudflare");
  if (headers.get("x-vercel-id")) techStack.push("Vercel");
  if (headers.get("server")?.toLowerCase().includes("nginx")) techStack.push("Nginx");
  if (headers.get("server")?.toLowerCase().includes("apache")) techStack.push("Apache");

  return {
    html,
    statusCode: response.status,
    responseTimeMs,
    techStack: Array.from(new Set(techStack)),
    security: {
      score: securityScore,
      isHttps,
      headers: securityHeaderChecks,
    },
    assets: {
      htmlSizeBytes,
      htmlSizeFormatted,
      scriptsCount: {
        total: scriptsExternal + scriptsInline,
        external: scriptsExternal,
        inline: scriptsInline,
      },
      stylesCount: {
        total: stylesExternal + stylesInline,
        external: stylesExternal,
        inline: stylesInline,
      },
      imagesCount,
      iframesCount,
      fontsDetected,
      thirdPartyDomains: Array.from(thirdPartyDomainsSet).slice(0, 12),
      renderBlockingScripts,
      lazyImagesCount,
    },
    seo: {
      title: {
        text: titleText,
        length: titleLen,
        status: titleStatus,
        recommendation: titleRec,
      },
      description: {
        text: metaDesc,
        length: descLen,
        status: descStatus,
        recommendation: descRec,
      },
      headings: {
        h1: h1Elements,
        h2Count,
        h3Count,
        hasH1,
        multipleH1,
        status: headingsStatus,
        recommendation: headingsRec,
        isH1Hidden,
        isH1Logo,
      },
      openGraph: {
        hasBasicOg,
        title: ogTitle,
        description: ogDescription,
        image: ogImage,
        url: ogUrl,
        type: ogType,
      },
      twitterCard: {
        hasCard: hasTwitter,
        card: twitterCard,
        title: twitterTitle,
        description: twitterDesc,
        image: twitterImg,
      },
      canonical: {
        url: canonicalHref,
        matchesTarget,
        status: canonicalStatus,
        recommendation: canonicalRec,
      },
      schemaOrg: {
        hasSchema: schemaTypes.length > 0,
        types: Array.from(new Set(schemaTypes)),
        rawCount: schemaScripts.length,
      },
      robots: {
        hasRobotsMeta: Boolean(robotsMeta),
        isNoindex,
        isNofollow,
        robotsTxtFound,
        sitemapFound,
      },
      contentStats: {
        wordCount: words,
        readingTimeMinutes,
        internalLinksCount,
        externalLinksCount,
        faviconFound,
        hreflangs,
      },
    },
  };
}
