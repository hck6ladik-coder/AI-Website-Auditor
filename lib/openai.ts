import {
  AiRecommendation,
  SeoAuditResult,
  AccessibilityAuditResult,
  CoreWebVitals,
  AuditScores,
} from "@/types/audit";

interface GenerateAiRecommendationsParams {
  url: string;
  scores: AuditScores;
  seo: SeoAuditResult;
  accessibility: AccessibilityAuditResult;
  coreWebVitals: CoreWebVitals;
  customApiKey?: string;
}

export async function generateAiRecommendations({
  url,
  scores,
  seo,
  accessibility,
  coreWebVitals,
  customApiKey,
}: GenerateAiRecommendationsParams): Promise<AiRecommendation[]> {
  const apiKey = customApiKey || process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const prompt = `
Jsi špičkový webový auditor a SEO/Web Performance specialista.
Analyzuj výsledky auditu webu "${url}":

1. Skóre:
   - Celkem: ${scores.overall}/100
   - Performance: ${scores.performance}/100
   - SEO: ${scores.seo}/100
   - Přístupnost: ${scores.accessibility}/100
   - Best Practices: ${scores.bestPractices}/100

2. Core Web Vitals:
   - LCP: ${coreWebVitals.lcp.displayValue} (${coreWebVitals.lcp.status})
   - FCP: ${coreWebVitals.fcp.displayValue} (${coreWebVitals.fcp.status})
   - CLS: ${coreWebVitals.cls.displayValue} (${coreWebVitals.cls.status})
   - TBT: ${coreWebVitals.tbt.displayValue} (${coreWebVitals.tbt.status})
   - TTFB: ${coreWebVitals.ttfb.displayValue} (${coreWebVitals.ttfb.status})

3. SEO zjištění:
   - Titulek: "${seo.title.text}" (${seo.title.status}, délka: ${seo.title.length})
   - Meta description: "${seo.description.text}" (${seo.description.status}, délka: ${seo.description.length})
   - H1: ${seo.headings.h1.join(" | ") || "Chybí"} (status: ${seo.headings.status})
   - OpenGraph: ${seo.openGraph.hasBasicOg ? "Ano" : "Chybí základní OG tagy"}
   - Schema.org: ${seo.schemaOrg.hasSchema ? seo.schemaOrg.types.join(", ") : "Chybí strukturovaná data"}

4. Přístupnost:
   - Chybějící alt: ${accessibility.images.missingAlt} z ${accessibility.images.total} obrázků
   - Lang atribut: ${accessibility.hasLangAttribute ? accessibility.htmlLang : "Chybí"}
   - Landmarks: Main=${accessibility.hasMainLandmark}, Nav=${accessibility.hasNavLandmark}
   - Formuláře bez labelu: ${accessibility.formLabels.missingLabel}

Vrať pole 4 až 6 konkrétních, vysoce relevantních doporučení ve formátu JSON. Každý objekt musí mít přesně tyto klíče:
- id: string (např. "rec-1")
- title: string (výstižný název problému v češtině)
- category: "Performance" | "SEO" | "Accessibility" | "Best Practices" | "Security"
- priority: "high" | "medium" | "low"
- impact: string (např. "+15 bodů v Performance", "Lepší pozice ve vyhledávání")
- effort: "low" | "medium" | "high"
- description: string (proč je to problém)
- solution: string (jak přesně problém vyřešit)
- codeSnippet?: string (volitelný ukázkový kód v HTML/CSS/JS)

Vrať POUZE platný JSON (pole objektů).
`;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "Jsi expertní auditor webů. Výstup vždy generuj jako JSON s klíčem 'recommendations'.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          const list = Array.isArray(parsed)
            ? parsed
            : parsed.recommendations || [];
          if (list.length > 0) {
            return list.map((item: Partial<AiRecommendation>, idx: number) => ({
              id: item.id || `rec-ai-${idx + 1}`,
              title: item.title || "Optimalizace webu",
              category: item.category || "Best Practices",
              priority: item.priority || "medium",
              impact: item.impact || "Zlepšení uživatelského zážitku",
              effort: item.effort || "medium",
              description: item.description || "",
              solution: item.solution || "",
              codeSnippet: item.codeSnippet,
            }));
          }
        }
      }
    } catch (e) {
      console.warn("OpenAI API call failed, falling back to heuristic engine:", e);
    }
  }

  // Smart Heuristic Engine (produces customized, deep, high-value AI recommendations)
  const recs: AiRecommendation[] = [];

  // LCP / Performance
  if (coreWebVitals.lcp.status !== "good") {
    recs.push({
      id: "rec-perf-lcp",
      title: "Optimalizujte Largest Contentful Paint (LCP)",
      category: "Performance",
      priority: "high",
      impact: "+15–25 bodů v Google PageSpeed",
      effort: "medium",
      description: `Váš LCP je ${coreWebVitals.lcp.displayValue}, což překračuje doporučený limit 2.5 s. Uživatelé čekají příliš dlouho na zobrazení hlavního obsahu (často hrdinský obrázek nebo velký textový blok).`,
      solution:
        "Použijte formát WebP/AVIF s patřičnou kompresí, přednačtěte kritický obrázek pomocí <link rel='preload'> a vypněte pro něj lazy loading.",
      codeSnippet: `<!-- Do sekce <head> přidejte preload pro klíčový obrázek -->\n<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />\n\n<!-- Pro <img> nastavte správné rozměry a prioritu -->\n<img src="/hero.webp" alt="Hero banner" width="1200" height="600" fetchpriority="high" decoding="async" />`,
    });
  }

  // TTFB / Caching
  if (coreWebVitals.ttfb.status !== "good") {
    recs.push({
      id: "rec-perf-ttfb",
      title: "Zrychlete odezvu serveru (Time to First Byte)",
      category: "Performance",
      priority: "high",
      impact: "+10–20 bodů v celkové rychlosti",
      effort: "medium",
      description: `Doba odezvy serveru je ${coreWebVitals.ttfb.displayValue}. Zpoždění brzdí stahování veškerých dalších stylů a skriptů.`,
      solution:
        "Nasaďte CDN (např. Cloudflare), zapněte Edge Caching pro statické i dynamické stránky a zkontrolujte pomalé dotazy do databáze na backendu.",
      codeSnippet: `// Příklad HTTP hlavičky pro Edge Cache v Next.js nebo Nginx:\nCache-Control: public, s-maxage=3600, stale-while-revalidate=59`,
    });
  }

  // Missing Title / Poor Title
  if (seo.title.status !== "pass") {
    recs.push({
      id: "rec-seo-title",
      title: "Opravte titulek stránky (<title>)",
      category: "SEO",
      priority: "high",
      impact: "Výrazné zvýšení míry prokliku (CTR) z vyhledávačů",
      effort: "low",
      description: seo.title.recommendation,
      solution:
        "Vytvořte lákavý titulek o délce 50–60 znaků, který začíná primárním klíčovým slovem a končí názvem vaší značky.",
      codeSnippet: `<title>Hlavní klíčové slovo | Název Vaší Značky</title>`,
    });
  }

  // Meta Description
  if (seo.description.status !== "pass") {
    recs.push({
      id: "rec-seo-desc",
      title: "Doplňte lákavý Meta Description",
      category: "SEO",
      priority: "medium",
      impact: "+5–15% vyšší návštěvnost ze SERP",
      effort: "low",
      description: seo.description.recommendation,
      solution:
        "Napište poutavý popis dlouhý 130–155 znaků s jasnou výzvou k akci (CTA) jako 'Zjistěte více', 'Vyzkoušejte zdarma'.",
      codeSnippet: `<meta name="description" content="Kompletní audit a diagnostika vašeho webu během několika sekund. Zjistěte chyby v SEO a zrychlete načítání!" />`,
    });
  }

  // Headings H1 (differentiates missing vs hidden vs multiple H1s)
  if (!seo.headings.hasH1) {
    recs.push({
      id: "rec-seo-h1-missing",
      title: "Doplňte chybějící hlavní nadpis H1",
      category: "SEO",
      priority: "high",
      impact: "Zásadní signál pro vyhledávače i čtečky obrazovky o tématu stránky",
      effort: "low",
      description: seo.headings.recommendation,
      solution:
        "Doplňte do šablony stránky právě jeden nadpis <h1> obsahující primární klíčové slovo.",
      codeSnippet: `<h1>Váš hlavní nadpis stránky s klíčovým slovem</h1>`,
    });
  } else if (seo.headings.isH1Hidden) {
    recs.push({
      id: "rec-seo-h1-hidden",
      title: "Zviditelněte skrytý nadpis H1",
      category: "SEO",
      priority: "medium",
      impact: "Lepší uživatelská přístupnost a silnější SEO relevance",
      effort: "low",
      description: seo.headings.recommendation,
      solution:
        "Nadpis H1 je v kódu přítomen, ale je skrytý pomocí CSS (sr-only/display:none). Zvažte zobrazení výstižného nadpisu i pro běžné návštěvníky.",
      codeSnippet: `<!-- Místo skrytého H1 zobrazte přirozený nadpis -->\n<h1 class="text-3xl font-bold text-slate-900">\n  Výstižný hlavní nadpis stránky\n</h1>`,
    });
  } else if (seo.headings.multipleH1) {
    recs.push({
      id: "rec-seo-h1-multiple",
      title: "Sjednoťte vícenásobné H1 nadpisy na jeden",
      category: "SEO",
      priority: "medium",
      impact: "Vyjasnění sémantické hierarchie pro Google a indexovací roboty",
      effort: "low",
      description: seo.headings.recommendation,
      solution:
        "Ponechte pouze jeden hlavní H1 pro tělo stránky. Pokud máte H1 také v hlavičce nebo logu, nahraďte jej obecným prvkem <div> nebo <span>.",
      codeSnippet: `<!-- V hlavičce použijte span/div -->\n<div class="logo">\n  <a href="/"><img src="/logo.svg" alt="Název webu" /></a>\n</div>\n\n<!-- Jediný H1 ponechte pro obsah stránky -->\n<main>\n  <h1>Hlavní nadpis stránky</h1>\n</main>`,
    });
  }

  // Open Graph / Social Sharing
  if (!seo.openGraph.hasBasicOg) {
    recs.push({
      id: "rec-seo-og",
      title: "Nakonfigurujte Open Graph meta tagy pro sociální sítě",
      category: "SEO",
      priority: "medium",
      impact: "Profesionální náhled při sdílení na LinkedIn, Facebooku a Slacku",
      effort: "low",
      description:
        "Chybí základní OpenGraph tagy (og:title, og:description, og:image). Odkazy sdílené na sociálních sítích budou bez poutavého náhledu.",
      solution:
        "Přidejte do hlavičky tagy specifikující titulek, popis a obrázek s rozlišením 1200x630 px.",
      codeSnippet: `<meta property="og:title" content="Váš titulek pro sdílení" />\n<meta property="og:description" content="Výstižný popis toho, co uživatel na stránce najde." />\n<meta property="og:image" content="https://vasedomena.cz/og-image.jpg" />\n<meta property="og:type" content="website" />`,
    });
  }

  // Schema.org Structured Data
  if (!seo.schemaOrg.hasSchema) {
    recs.push({
      id: "rec-seo-schema",
      title: "Implementujte strukturovaná data Schema.org (JSON-LD)",
      category: "SEO",
      priority: "medium",
      impact: "Bohaté úryvky (Rich Snippets) a hvězdičková hodnocení v Google",
      effort: "medium",
      description:
        "Stránka neobsahuje žádná strukturovaná data JSON-LD. Přicházíte o možnost získat rozšířené výsledky vyhledávání.",
      solution:
        "Vložte do hlavičky nebo těla stránky skript s typem Organization, WebSite nebo Product.",
      codeSnippet: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Název firmy",\n  "url": "${url}",\n  "logo": "${url}/logo.png"\n}\n</script>`,
    });
  }

  // Accessibility - Missing ALT
  if (accessibility.images.missingAlt > 0) {
    recs.push({
      id: "rec-a11y-alt",
      title: `Doplňte chybějící alt popisy u ${accessibility.images.missingAlt} obrázků`,
      category: "Accessibility",
      priority: "high",
      impact: "Splnění normy WCAG 2.1 Level A a lepší indexace obrázků",
      effort: "low",
      description:
        "Obrázky bez atributu alt brání nevidomým uživatelům pochopit obsah grafiky a poškozují hodnocení přístupnosti.",
      solution:
        "Přidejte ke každému tagu <img> atribut alt popisující obsah obrázku. Pokud je obrázek čistě dekorativní, nastavte alt=''.",
      codeSnippet: `<!-- Příklad správného označení -->\n<img src="/hero-laptop.jpg" alt="Mladý vývojář pracující na laptopu v kanceláři" />`,
    });
  }

  // Accessibility - HTML Lang
  if (!accessibility.hasLangAttribute) {
    recs.push({
      id: "rec-a11y-lang",
      title: "Definujte atribut lang u elementu <html>",
      category: "Accessibility",
      priority: "medium",
      impact: "Správná výslovnost čteček obrazovky a lokalizace",
      effort: "low",
      description:
        "Element <html> nemá definovaný jazyk stránky (např. lang='cs' pro češtinu nebo lang='en' pro angličtinu).",
      solution: "Doplňte atribut lang přímo do otevíracího tagu <html>.",
      codeSnippet: `<html lang="cs">\n  <head>...</head>\n</html>`,
    });
  }

  // Accessibility - Form Labels
  if (accessibility.formLabels.missingLabel > 0) {
    recs.push({
      id: "rec-a11y-forms",
      title: `Propojte ${accessibility.formLabels.missingLabel} formulářových polí s popisky <label>`,
      category: "Accessibility",
      priority: "high",
      impact: "Pohodlnější ovládání formulářů pro všechny návštěvníky",
      effort: "low",
      description:
        "Formulářová pole bez <label> nebo aria-label jsou pro uživatele se speciálními potřebami nepřehledná.",
      solution:
        "Ujistěte se, že každé pole <input> má odpovídající <label for='id_pole'> nebo atribut aria-label.",
      codeSnippet: `<label for="email-field" class="font-medium">Váš e-mail</label>\n<input id="email-field" type="email" placeholder="jan@novak.cz" />`,
    });
  }

  // CLS
  if (coreWebVitals.cls.status !== "good") {
    recs.push({
      id: "rec-perf-cls",
      title: "Zabraňte posunům rozvržení (Cumulative Layout Shift)",
      category: "Performance",
      priority: "medium",
      impact: "Zamezení náhodným kliknutím a frustraci uživatelů",
      effort: "low",
      description: `Hodnota CLS je ${coreWebVitals.cls.displayValue}. Během načítání dochází k nechtěnému posunu prvků.`,
      solution:
        "Vždy specifikujte atributy width a height nebo CSS aspect-ratio u všech obrázků, videí a iframe bannerů.",
      codeSnippet: `/* Rezervujte prostor v CSS */\n.banner-container {\n  aspect-ratio: 16 / 9;\n  width: 100%;\n}`,
    });
  }

  // Ensure we have at least 4 strong recommendations
  if (recs.length < 4) {
    recs.push({
      id: "rec-best-security",
      title: "Nastavte bezpečnostní HTTP hlavičky (Security Headers)",
      category: "Best Practices",
      priority: "medium",
      impact: "Ochrana proti XSS, clickjackingu a MIME sniffingu",
      effort: "low",
      description:
        "Moderní webové aplikace by měly posílat Content-Security-Policy, X-Frame-Options a Strict-Transport-Security.",
      solution:
        "Nakonfigurujte hlavičky v next.config.js, Cloudflare nebo na webovém serveru.",
      codeSnippet: `// next.config.mjs headers\n{\n  key: 'X-Frame-Options',\n  value: 'DENY'\n},\n{\n  key: 'X-Content-Type-Options',\n  value: 'nosniff'\n}`,
    });
  }

  return recs;
}
