import { NextRequest, NextResponse } from "next/server";
import { crawlWebsite } from "@/lib/crawler";
import { checkAccessibility } from "@/lib/accessibility";
import { fetchLighthouseMetrics } from "@/lib/lighthouse";
import { generateAiRecommendations } from "@/lib/openai";
import { normalizeUrl, isValidUrl } from "@/lib/utils";
import { AuditReport, AuditScores, AgencyPitch } from "@/types/audit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = body.url;
    const customApiKey = body.customApiKey;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "Zadejte platnou URL adresu webu pro audit." },
        { status: 400 }
      );
    }

    const normalized = normalizeUrl(rawUrl);
    if (!isValidUrl(normalized)) {
      return NextResponse.json(
        { error: `Neplatný formát URL adresy: "${rawUrl}". Zadejte např. "example.com" nebo "https://example.cz".` },
        { status: 400 }
      );
    }

    const startExecution = Date.now();

    // 1. Crawl website & parse SEO, security headers, assets, tech stack
    let crawlResult;
    try {
      crawlResult = await crawlWebsite(normalized);
    } catch (crawlErr: unknown) {
      const errMessage = crawlErr instanceof Error ? crawlErr.message : "Chyba při stahování stránky";
      return NextResponse.json(
        { error: errMessage },
        { status: 502 }
      );
    }

    // 2. Run Accessibility audit
    const accessibilityResult = checkAccessibility(crawlResult.html);

    // 3. Run Lighthouse / Performance audit
    const lighthouseResult = await fetchLighthouseMetrics(
      normalized,
      crawlResult.responseTimeMs,
      crawlResult.html.length
    );

    // 4. Calculate Scores
    const { seo, security, assets } = crawlResult;
    let seoDeduction = 0;
    if (seo.title.status === "fail") seoDeduction += 20;
    else if (seo.title.status === "warn") seoDeduction += 8;

    if (seo.description.status === "fail") seoDeduction += 15;
    else if (seo.description.status === "warn") seoDeduction += 6;

    if (seo.headings.status === "fail") seoDeduction += 15;
    else if (seo.headings.status === "warn") seoDeduction += 6;

    if (seo.canonical.status !== "pass") seoDeduction += 8;
    if (!seo.schemaOrg.hasSchema) seoDeduction += 10;
    if (!seo.openGraph.hasBasicOg) seoDeduction += 8;
    if (!seo.twitterCard.hasCard) seoDeduction += 4;
    if (seo.contentStats.wordCount < 100) seoDeduction += 12;
    else if (seo.contentStats.wordCount < 300) seoDeduction += 5;

    const seoScore = Math.max(25, Math.min(100, 100 - seoDeduction));
    const accessibilityScore = accessibilityResult.score;
    const performanceScore = lighthouseResult.performanceScore;
    const securityScore = security.score;

    // Best practices calculation
    let bpScore = 60;
    if (normalized.startsWith("https://")) bpScore += 20;
    if (seo.contentStats.faviconFound) bpScore += 10;
    if (!seo.robots.isNoindex) bpScore += 10;
    const bestPracticesScore = Math.min(100, bpScore);

    const overallScore = Math.round(
      performanceScore * 0.30 +
      seoScore * 0.25 +
      accessibilityScore * 0.20 +
      securityScore * 0.15 +
      bestPracticesScore * 0.10
    );

    const scores: AuditScores = {
      overall: overallScore,
      performance: performanceScore,
      seo: seoScore,
      accessibility: accessibilityScore,
      security: securityScore,
      bestPractices: bestPracticesScore,
    };

    // 5. Generate AI Recommendations
    const aiRecommendations = await generateAiRecommendations({
      url: normalized,
      scores,
      seo,
      accessibility: accessibilityResult,
      coreWebVitals: lighthouseResult.coreWebVitals,
      customApiKey,
    });

    const executionTimeMs = Date.now() - startExecution;

    // 6. Generate Agency Pitch (Agenturní návrh pro klienta)
    const packages = [];

    if (performanceScore < 85 || lighthouseResult.coreWebVitals.lcp.status !== "good") {
      packages.push({
        name: "Performance & Core Web Vitals Boost",
        description: "Optimalizace LCP, komprese assetů do WebP/AVIF, Edge Caching na Cloudflare a zkrácení doby odezvy serveru.",
        estimatedTime: "2–4 dny",
        roi: "+20–35 % vyšší konverzní poměr a lepší hodnocení v Google vyhledávání.",
      });
    }

    if (seoScore < 90 || !seo.schemaOrg.hasSchema) {
      packages.push({
        name: "Kompletní On-Page SEO & Schema.org balíček",
        description: "Úprava titulků, meta popisků, struktury H1–H3 a nasazení bohatých strukturovaných dat JSON-LD pro hvězdičky a náhledy.",
        estimatedTime: "1–3 dny",
        roi: "Vyšší míra prokliku (CTR) ze SERPu a lepší pozice na klíčová slova.",
      });
    }

    if (accessibilityScore < 85 || accessibilityResult.images.missingAlt > 0) {
      packages.push({
        name: "WCAG 2.1 Audit & Přístupnost (EU Compliance)",
        description: "Doplnění alt popisků, oprava formulářových prvků, sémantických orientačních bodů a splnění směrnice EAA.",
        estimatedTime: "2–3 dny",
        roi: "Ochrana před legislativními pokutami a otevření webu handicapovaným uživatelům.",
      });
    }

    if (securityScore < 90) {
      packages.push({
        name: "Zabezpečení & Hardening HTTP hlaviček",
        description: "Nasazení HSTS, Content-Security-Policy, X-Frame-Options a prevence před útoky typu clickjacking a sniffing.",
        estimatedTime: "1 den",
        roi: "Maximální důvěryhodnost a ochrana klientských dat.",
      });
    }

    const agencyPitch: AgencyPitch = {
      headline: `Auditní zpráva a doporučený plán rozvoje pro ${normalized}`,
      problemSummary: `Při auditu bylo identifikováno ${aiRecommendations.length} oblastí ke zlepšení. Celkové skóre webu je ${overallScore}/100. Níže naleznete návrhy servisních balíčků pro agenturní realizaci.`,
      recommendedPackages: packages.length > 0 ? packages : [
        {
          name: "Průběžná správa & Monitoring",
          description: "Pravidelný týdenní dohled nad rychlostí, SEO změnami a dostupností.",
          estimatedTime: "Průběžně",
          roi: "Prevence výpadků a stabilní pozice.",
        }
      ],
    };

    const summary = `Web dosáhl celkového hodnocení ${overallScore}/100. Výkon dosahuje ${performanceScore}/100, SEO skóre je ${seoScore}/100, přístupnost ${accessibilityScore}/100 a bezpečnost ${securityScore}/100. Bylo identifikováno ${aiRecommendations.length} prioritních doporučení.`;

    const report: AuditReport = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      url: rawUrl,
      normalizedUrl: normalized,
      timestamp: new Date().toISOString(),
      executionTimeMs,
      status: "success",
      scores,
      coreWebVitals: lighthouseResult.coreWebVitals,
      seo,
      accessibility: accessibilityResult,
      security,
      assets,
      agencyPitch,
      aiRecommendations,
      summary,
      techStack: crawlResult.techStack,
    };

    return NextResponse.json(report);
  } catch (error: unknown) {
    console.error("Audit API Error:", error);
    const errMessage = error instanceof Error ? error.message : "Došlo k neočekávané chybě při provádění auditu.";
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
