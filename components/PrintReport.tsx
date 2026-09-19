import React from "react";
import Image from "next/image";
import { AuditReport } from "@/types/audit";
import { formatDate } from "@/lib/utils";

interface PrintReportProps {
  report: AuditReport;
}

export function PrintReport({ report }: PrintReportProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-700 bg-emerald-50 border-emerald-300";
    if (score >= 70) return "text-amber-700 bg-amber-50 border-amber-300";
    return "text-rose-700 bg-rose-50 border-rose-300";
  };

  const getStatusBadge = (status: "good" | "needs-improvement" | "poor" | "pass" | "warn" | "fail") => {
    switch (status) {
      case "good":
      case "pass":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">V pořádku</span>;
      case "needs-improvement":
      case "warn":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">Upozornění</span>;
      case "poor":
      case "fail":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">Kritické</span>;
    }
  };

  return (
    <div className="print-report text-slate-900 bg-white font-sans text-xs leading-normal p-4 sm:p-8 space-y-6">
      {/* Header & Meta */}
      <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Logo"
            width={56}
            height={56}
            className="w-14 h-14 object-contain rounded-xl border border-slate-300 p-1 bg-slate-950 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-xs tracking-wider uppercase bg-slate-900 text-white px-2.5 py-0.5 rounded">
                AI Website Auditor
              </span>
              <span className="text-slate-500 font-medium text-xs">Kompletní technický audit webu</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight break-all">
              {report.normalizedUrl}
            </h1>
            <p className="text-slate-600 mt-0.5 text-xs">
              Audit proveden: {formatDate(report.timestamp)} • Doba analýzy: {report.executionTimeMs} ms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`px-4 py-2.5 rounded-xl border-2 text-center min-w-[110px] ${getScoreColor(report.scores.overall)}`}>
            <span className="text-3xl font-black block leading-none">{report.scores.overall}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1 block">Celkové skóre</span>
          </div>
        </div>
      </div>

      {/* Score Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 print-avoid-break">
        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-center">
          <span className="text-[11px] font-semibold text-slate-500 block">Výkon</span>
          <span className="text-xl font-bold text-slate-900">{report.scores.performance}%</span>
        </div>
        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-center">
          <span className="text-[11px] font-semibold text-slate-500 block">SEO & Indexace</span>
          <span className="text-xl font-bold text-slate-900">{report.scores.seo}%</span>
        </div>
        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-center">
          <span className="text-[11px] font-semibold text-slate-500 block">Přístupnost</span>
          <span className="text-xl font-bold text-slate-900">{report.scores.accessibility}%</span>
        </div>
        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-center">
          <span className="text-[11px] font-semibold text-slate-500 block">Bezpečnost</span>
          <span className="text-xl font-bold text-slate-900">{report.scores.security}%</span>
        </div>
        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-center">
          <span className="text-[11px] font-semibold text-slate-500 block">Standardy</span>
          <span className="text-xl font-bold text-slate-900">{report.scores.bestPractices}%</span>
        </div>
        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-center">
          <span className="text-[11px] font-semibold text-slate-500 block">HTML Velikost</span>
          <span className="text-xl font-bold text-slate-900">{report.assets.htmlSizeFormatted}</span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 print-avoid-break">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
          Manažerské shrnutí auditu
        </h2>
        <p className="text-slate-700 text-xs leading-relaxed">{report.summary}</p>
        {report.techStack.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-600">Detekované technologie:</span>
            {report.techStack.map((tech, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-medium text-[11px]">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 1. Core Web Vitals & Rychlost */}
      <div className="print-section print-avoid-break">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
          1. Výkon & Core Web Vitals
        </h2>
        <table className="w-full text-left border-collapse border border-slate-200 text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="p-2 border border-slate-200 font-bold">Metrika</th>
              <th className="p-2 border border-slate-200 font-bold">Naměřená hodnota</th>
              <th className="p-2 border border-slate-200 font-bold">Hodnocení</th>
              <th className="p-2 border border-slate-200 font-bold">Popis a doporučení</th>
            </tr>
          </thead>
          <tbody>
            {[
              report.coreWebVitals.lcp,
              report.coreWebVitals.fcp,
              report.coreWebVitals.cls,
              report.coreWebVitals.tbt,
              report.coreWebVitals.ttfb,
              report.coreWebVitals.speedIndex,
            ].map((metric) => (
              <tr key={metric.name} className="border-b border-slate-200">
                <td className="p-2 font-bold text-slate-900 border border-slate-200">
                  {metric.label} ({metric.name.toUpperCase()})
                </td>
                <td className="p-2 font-mono font-bold text-slate-800 border border-slate-200">
                  {metric.displayValue}
                </td>
                <td className="p-2 border border-slate-200">
                  {getStatusBadge(metric.status)}
                </td>
                <td className="p-2 text-slate-600 border border-slate-200">
                  {metric.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. SEO & On-Page Analýza */}
      <div className="print-section print-avoid-break">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
          2. SEO & Indexovatelnost
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {/* Titulek */}
          <div className="p-3 border border-slate-200 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-900">Titulek stránky (&lt;title&gt;)</span>
              {getStatusBadge(report.seo.title.status)}
            </div>
            <p className="font-mono text-[11px] text-slate-800 bg-slate-100 p-1.5 rounded mb-1">
              {report.seo.title.text || "(Prázdné)"}
            </p>
            <p className="text-[11px] text-slate-600">
              Délka: <strong>{report.seo.title.length} znaků</strong> (ideálně 30–60). {report.seo.title.recommendation}
            </p>
          </div>

          {/* Meta Description */}
          <div className="p-3 border border-slate-200 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-900">Meta popis (&lt;meta description&gt;)</span>
              {getStatusBadge(report.seo.description.status)}
            </div>
            <p className="font-mono text-[11px] text-slate-800 bg-slate-100 p-1.5 rounded mb-1">
              {report.seo.description.text || "(Chybí)"}
            </p>
            <p className="text-[11px] text-slate-600">
              Délka: <strong>{report.seo.description.length} znaků</strong> (ideálně 120–160). {report.seo.description.recommendation}
            </p>
          </div>
        </div>

        {/* Indexace a technické parametry */}
        <table className="w-full text-left border-collapse border border-slate-200 mb-2 text-xs">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="p-2 font-semibold text-slate-800 border border-slate-200 w-1/3">Nadpisy H1:</td>
              <td className="p-2 text-slate-700 border border-slate-200">
                {report.seo.headings.h1.length === 0 ? (
                  <span className="text-rose-700 font-bold">Chybí hlavní nadpis H1!</span>
                ) : (
                  <span>
                    Nalezeno {report.seo.headings.h1.length}x H1: &ldquo;{report.seo.headings.h1.join("; ")}&rdquo;
                    {report.seo.headings.isH1Logo ? " (Grafické logo s alt popisem)" : ""}
                    {report.seo.headings.isH1Hidden ? " (Vizuálně skryto / sr-only)" : ""}
                    {" • "}H2: {report.seo.headings.h2Count}, H3: {report.seo.headings.h3Count}
                  </span>
                )}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-2 font-semibold text-slate-800 border border-slate-200">Robots & Indexace:</td>
              <td className="p-2 text-slate-700 border border-slate-200">
                Direktiva: <strong>{report.seo.robots.isNoindex ? "NOINDEX (Blokováno)" : "Povoleno k indexaci"}</strong> | 
                Soubor robots.txt: <strong>{report.seo.robots.robotsTxtFound ? "✓ Nalezen" : "✕ Nenalezen"}</strong> | 
                Mapa webu sitemap.xml: <strong>{report.seo.robots.sitemapFound ? "✓ Nalezena" : "✕ Nenalezena"}</strong>
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-2 font-semibold text-slate-800 border border-slate-200">Kanonická URL:</td>
              <td className="p-2 text-slate-700 border border-slate-200 font-mono text-[11px]">
                {report.seo.canonical.url || "Nenastavena"} ({report.seo.canonical.matchesTarget ? "Odpovídá cíli" : "Neshoduje se"})
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-2 font-semibold text-slate-800 border border-slate-200">Strukturovaná data (Schema.org):</td>
              <td className="p-2 text-slate-700 border border-slate-200">
                {report.seo.schemaOrg.hasSchema
                  ? `Nalezeno ${report.seo.schemaOrg.rawCount} schémat (@${report.seo.schemaOrg.types.join(", @")})`
                  : "Žádná strukturovaná data nebyla detekována."}
              </td>
            </tr>
            <tr>
              <td className="p-2 font-semibold text-slate-800 border border-slate-200">Statistika obsahu:</td>
              <td className="p-2 text-slate-700 border border-slate-200">
                Počet slov: <strong>{report.seo.contentStats.wordCount.toLocaleString()}</strong> (~{report.seo.contentStats.readingTimeMinutes} min čtení) | 
                Interní odkazy: <strong>{report.seo.contentStats.internalLinksCount}</strong> | 
                Externí odkazy: <strong>{report.seo.contentStats.externalLinksCount}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. Bezpečnost & HTTP Hlavičky */}
      <div className="print-section print-avoid-break">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
          3. Zabezpečení (Security Headers & SSL) – Skóre: {report.security.score}/100
        </h2>
        <table className="w-full text-left border-collapse border border-slate-200 text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="p-2 border border-slate-200 font-bold">Bezpečnostní prvek / Hlavička</th>
              <th className="p-2 border border-slate-200 font-bold">Stav</th>
              <th className="p-2 border border-slate-200 font-bold">Hodnota / Doporučení</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="p-2 font-bold text-slate-900 border border-slate-200">Šifrování HTTPS</td>
              <td className="p-2 border border-slate-200">
                {report.security.isHttps ? getStatusBadge("pass") : getStatusBadge("fail")}
              </td>
              <td className="p-2 text-slate-700 border border-slate-200">
                {report.security.isHttps ? "Spojení je zabezpečeno platným SSL/TLS certifikátem." : "Web nepoužívá HTTPS! Veškerý provoz probíhá nešifrovaně."}
              </td>
            </tr>
            {report.security.headers.map((h) => (
              <tr key={h.name} className="border-b border-slate-200">
                <td className="p-2 font-mono font-semibold text-slate-900 border border-slate-200">
                  {h.name}
                </td>
                <td className="p-2 border border-slate-200">
                  {getStatusBadge(h.status)}
                </td>
                <td className="p-2 text-slate-700 border border-slate-200">
                  {h.value ? (
                    <span className="font-mono text-[10px] break-all text-slate-800">{h.value.slice(0, 100)}...</span>
                  ) : (
                    <span className="text-slate-600">{h.recommendation}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Přístupnost (Accessibility & WCAG 2.1) */}
      <div className="print-section print-avoid-break">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
          4. Přístupnost (Accessibility & WCAG 2.1) – Skóre: {report.accessibility.score}/100
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div className="p-2 border border-slate-200 rounded text-center">
            <span className="text-[10px] text-slate-500 block">Jazyk (lang)</span>
            <span className="font-bold text-slate-900">{report.accessibility.hasLangAttribute ? `✓ ${report.accessibility.htmlLang}` : "✕ Chybí"}</span>
          </div>
          <div className="p-2 border border-slate-200 rounded text-center">
            <span className="text-[10px] text-slate-500 block">Obrázky bez alt</span>
            <span className={`font-bold ${report.accessibility.images.missingAlt > 0 ? "text-rose-700" : "text-emerald-700"}`}>
              {report.accessibility.images.missingAlt} z {report.accessibility.images.total}
            </span>
          </div>
          <div className="p-2 border border-slate-200 rounded text-center">
            <span className="text-[10px] text-slate-500 block">Pole bez popisku</span>
            <span className={`font-bold ${report.accessibility.formLabels.missingLabel > 0 ? "text-rose-700" : "text-emerald-700"}`}>
              {report.accessibility.formLabels.missingLabel} z {report.accessibility.formLabels.total}
            </span>
          </div>
          <div className="p-2 border border-slate-200 rounded text-center">
            <span className="text-[10px] text-slate-500 block">Sémantika &lt;main&gt;</span>
            <span className="font-bold text-slate-900">{report.accessibility.hasMainLandmark ? "✓ Přítomen" : "✕ Chybí"}</span>
          </div>
        </div>

        {report.accessibility.issues.length > 0 ? (
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 text-xs block mb-1">Nalezené WCAG incidenty:</span>
            {report.accessibility.issues.map((issue) => (
              <div key={issue.id} className="p-2 rounded border border-slate-200 bg-slate-50 flex items-start gap-2">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  issue.severity === "critical"
                    ? "bg-rose-100 text-rose-800"
                    : issue.severity === "serious"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {issue.severity}
                </span>
                <div className="flex-1">
                  <span className="font-bold text-slate-900 text-xs block">{issue.title}</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">{issue.description}</p>
                  {issue.wcagRule && (
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{issue.wcagRule}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-emerald-700 font-semibold p-2 bg-emerald-50 rounded border border-emerald-200">
            Nebyly nalezeny žádné závažné nedostatky v přístupnosti.
          </p>
        )}
      </div>

      {/* 5. Assety & Datová zátěž */}
      <div className="print-section print-avoid-break">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
          5. Assety, Skripty a Síťový přenos
        </h2>
        <table className="w-full text-left border-collapse border border-slate-200 text-xs">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="p-2 font-semibold text-slate-800 border border-slate-200 w-1/3">Skripty (JS):</td>
              <td className="p-2 text-slate-700 border border-slate-200">
                Celkem: <strong>{report.assets.scriptsCount.total}</strong> ({report.assets.scriptsCount.external} externích, {report.assets.scriptsCount.inline} inline) | 
                Blokující vykreslení: <strong className={report.assets.renderBlockingScripts > 0 ? "text-amber-700" : "text-emerald-700"}>{report.assets.renderBlockingScripts}</strong>
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-2 font-semibold text-slate-800 border border-slate-200">Kaskádové styly (CSS):</td>
              <td className="p-2 text-slate-700 border border-slate-200">
                Celkem: <strong>{report.assets.stylesCount.total}</strong> ({report.assets.stylesCount.external} externích souborů, {report.assets.stylesCount.inline} inline)
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-2 font-semibold text-slate-800 border border-slate-200">Obrázky & Odložené načítání:</td>
              <td className="p-2 text-slate-700 border border-slate-200">
                Celkem obrázků: <strong>{report.assets.imagesCount}</strong> (Iframů: {report.assets.iframesCount}) | 
                Lazy loading: <strong>{report.assets.lazyImagesCount}</strong> obrázků ({report.assets.imagesCount > 0 ? Math.round((report.assets.lazyImagesCount / report.assets.imagesCount) * 100) : 0} %)
              </td>
            </tr>
            <tr>
              <td className="p-2 font-semibold text-slate-800 border border-slate-200">Externí domény 3. stran:</td>
              <td className="p-2 text-slate-700 border border-slate-200 font-mono text-[10px]">
                {report.assets.thirdPartyDomains.length > 0 ? report.assets.thirdPartyDomains.join(", ") : "Žádné externí domény"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 6. AI Doporučení pro vývojáře */}
      <div className="print-section">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
          6. Prioritní AI doporučení k implementaci ({report.aiRecommendations.length})
        </h2>
        <div className="space-y-3">
          {report.aiRecommendations.map((rec, index) => (
            <div key={rec.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/70 print-avoid-break">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">
                    #{index + 1} {rec.title}
                  </span>
                  <span className="px-2 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-semibold">
                    {rec.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    rec.priority === "high"
                      ? "bg-rose-100 text-rose-800"
                      : rec.priority === "medium"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-200 text-slate-700"
                  }`}>
                    Priorita: {rec.priority}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Dopad: {rec.impact}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-[11px] mb-1">{rec.description}</p>
              <div className="p-2 bg-white rounded border border-slate-200 text-slate-800 text-[11px] font-medium mb-1.5">
                <strong>Řešení:</strong> {rec.solution}
              </div>
              {rec.codeSnippet && (
                <div className="mt-1">
                  <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Doporučený kód:</span>
                  <pre className="p-2 bg-slate-900 text-slate-100 rounded text-[10px] font-mono overflow-x-auto whitespace-pre-wrap">
                    {rec.codeSnippet}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7. Agenturní nabídka (Agency Pitch) */}
      <div className="print-section print-avoid-break">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
          7. Návrh dalšího postupu & Implementační balíčky
        </h2>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
          <h3 className="font-bold text-blue-950 text-xs mb-0.5">{report.agencyPitch.headline}</h3>
          <p className="text-blue-900 text-[11px]">{report.agencyPitch.problemSummary}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {report.agencyPitch.recommendedPackages.map((pkg, i) => (
            <div key={i} className="p-3 border border-slate-200 rounded-lg bg-white">
              <h4 className="font-bold text-slate-900 text-xs mb-1">{pkg.name}</h4>
              <p className="text-slate-600 text-[11px] mb-2">{pkg.description}</p>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px]">
                <span className="text-slate-500">Čas: <strong>{pkg.estimatedTime}</strong></span>
                <span className="text-emerald-700 font-bold">ROI: {pkg.roi}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-300 text-center text-slate-500 text-[10px] print-avoid-break">
        <p>AI Website Auditor • Technický audit a doporučení optimalizace podle standardů Google PSI & WCAG 2.1</p>
        <p className="mt-0.5">Vygenerováno pro portfolio | Webforte.cz</p>
      </div>
    </div>
  );
}
