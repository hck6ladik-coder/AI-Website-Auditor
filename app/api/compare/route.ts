import { NextRequest, NextResponse } from "next/server";
import { normalizeUrl, isValidUrl } from "@/lib/utils";
import { AuditReport, CompetitorComparison } from "@/types/audit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetUrl, competitorUrl, customApiKey } = body;

    if (!targetUrl || !competitorUrl) {
      return NextResponse.json(
        { error: "Zadejte obě URL adresy (Váš web i web konkurence)." },
        { status: 400 }
      );
    }

    const normTarget = normalizeUrl(targetUrl);
    const normComp = normalizeUrl(competitorUrl);

    if (!isValidUrl(normTarget) || !isValidUrl(normComp)) {
      return NextResponse.json(
        { error: "Jedna nebo obě zadané adresy mají neplatný formát URL." },
        { status: 400 }
      );
    }

    // Call internal audit endpoint or perform audit logic
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const auditApiUrl = `${protocol}://${host}/api/audit`;

    const [targetRes, competitorRes] = await Promise.all([
      fetch(auditApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normTarget, customApiKey }),
      }),
      fetch(auditApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normComp, customApiKey }),
      }),
    ]);

    if (!targetRes.ok) {
      const err = await targetRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: `Chyba při auditu Vašeho webu: ${err.error || targetRes.statusText}` },
        { status: targetRes.status }
      );
    }

    if (!competitorRes.ok) {
      const err = await competitorRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: `Chyba při auditu konkurence: ${err.error || competitorRes.statusText}` },
        { status: competitorRes.status }
      );
    }

    const target: AuditReport = await targetRes.json();
    const competitor: AuditReport = await competitorRes.json();

    const deltas = {
      overall: target.scores.overall - competitor.scores.overall,
      performance: target.scores.performance - competitor.scores.performance,
      seo: target.scores.seo - competitor.scores.seo,
      accessibility: target.scores.accessibility - competitor.scores.accessibility,
      security: target.scores.security - competitor.scores.security,
      bestPractices: target.scores.bestPractices - competitor.scores.bestPractices,
    };

    const getWinner = (val: number): "target" | "competitor" | "tie" => {
      if (val > 3) return "target";
      if (val < -3) return "competitor";
      return "tie";
    };

    const winnerCategory = {
      overall: getWinner(deltas.overall),
      performance: getWinner(deltas.performance),
      seo: getWinner(deltas.seo),
      accessibility: getWinner(deltas.accessibility),
      security: getWinner(deltas.security),
    };

    const insights: string[] = [];

    if (deltas.overall > 0) {
      insights.push(`Váš web má celkově o ${deltas.overall} bodů lepší skóre než konkurence!`);
    } else if (deltas.overall < 0) {
      insights.push(`Konkurence má o ${Math.abs(deltas.overall)} bodů lepší celkové hodnocení.`);
    } else {
      insights.push("Oba weby dosahují vyrovnaného celkového skóre.");
    }

    if (deltas.performance > 5) {
      insights.push(`Výrazná výhoda v rychlosti: Váš web načítá o ${deltas.performance} bodů rychleji.`);
    } else if (deltas.performance < -5) {
      insights.push(`Pozor: Konkurence je v rychlosti načítání o ${Math.abs(deltas.performance)} bodů napřed.`);
    }

    if (deltas.seo > 5) {
      insights.push(`Váš web má lépe zvládnuté on-page SEO a strukturu nadpisů.`);
    } else if (deltas.seo < -5) {
      insights.push(`Konkurence má silnější on-page SEO optimalizaci a meta tagy.`);
    }

    if (deltas.accessibility > 5) {
      insights.push(`Váš web poskytuje výrazně lepší přístupnost pro uživatele (WCAG).`);
    } else if (deltas.accessibility < -5) {
      insights.push(`Konkurence má méně bariér v přístupnosti (alt popisy, formuláře).`);
    }

    const comparison: CompetitorComparison = {
      target,
      competitor,
      deltas,
      winnerCategory,
      comparisonInsights: insights,
    };

    return NextResponse.json(comparison);
  } catch (error: unknown) {
    console.error("Comparison API Error:", error);
    const errMessage = error instanceof Error ? error.message : "Chyba při porovnávání webů.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
