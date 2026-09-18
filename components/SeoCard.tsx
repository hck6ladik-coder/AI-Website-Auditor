"use client";

import React from "react";
import { SeoAuditResult } from "@/types/audit";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Share2,
  FileCode,
  Layers,
  Link2,
  BookOpen,
} from "lucide-react";

interface SeoCardProps {
  seo: SeoAuditResult;
  targetUrl: string;
}

export function SeoCard({ seo, targetUrl }: SeoCardProps) {
  const getStatusIcon = (status: "pass" | "warn" | "fail") => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />;
      case "warn":
        return <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Google SERP Preview Simulation */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2 mb-3 text-slate-300 font-semibold text-sm">
          <Search className="w-4 h-4 text-blue-400" />
          <span>Náhled ve výsledcích Google (SERP Preview)</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 max-w-2xl font-sans">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">🌐</span>
            <span className="truncate">{targetUrl}</span>
          </div>
          <h3 className="text-blue-400 hover:underline cursor-pointer text-lg font-medium leading-snug truncate">
            {seo.title.text || "Bez titulku"}
          </h3>
          <p className="text-slate-300 text-sm mt-1 leading-relaxed line-clamp-2">
            {seo.description.text || "Žádný meta description nebyl nalezen. Google pravděpodobně zobrazí náhodný úryvek z textu na stránce."}
          </p>
        </div>
      </div>

      {/* Meta Tags & Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title Tag */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-semibold text-white">Titulek stránky (&lt;title&gt;)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {seo.title.length} znaků (doporučeno 30–60)
              </span>
            </div>
            <p className="text-sm font-medium text-slate-200 bg-slate-950/60 p-3 rounded-lg border border-slate-800/50 mb-3 break-words">
              {seo.title.text || "— Nenalezeno —"}
            </p>
          </div>
          <div className="flex items-start gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
            {getStatusIcon(seo.title.status)}
            <span>{seo.title.recommendation}</span>
          </div>
        </div>

        {/* Meta Description */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-semibold text-white">Meta Description</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {seo.description.length} znaků (doporučeno 120–160)
              </span>
            </div>
            <p className="text-sm font-medium text-slate-200 bg-slate-950/60 p-3 rounded-lg border border-slate-800/50 mb-3 break-words">
              {seo.description.text || "— Nenalezeno —"}
            </p>
          </div>
          <div className="flex items-start gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
            {getStatusIcon(seo.description.status)}
            <span>{seo.description.recommendation}</span>
          </div>
        </div>
      </div>

      {/* Headings Hierarchy */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white">Hierarchie a struktura nadpisů</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
              H1: {seo.headings.h1.length}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
              H2: {seo.headings.h2Count}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold">
              H3: {seo.headings.h3Count}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {seo.headings.h1.length === 0 ? (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Chybí hlavní nadpis H1! Doplňte právě jeden element &lt;h1&gt;.</span>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">Nalezené H1 nadpisy:</span>
              {seo.headings.h1.map((h1, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-sm text-slate-200 flex items-center gap-2"
                >
                  <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">H1</span>
                  <span className="truncate">{h1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Social Preview & Structured Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OpenGraph & Social Sharing */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white">Sociální sítě & Open Graph</h3>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">Open Graph stav:</span>
              <span className={seo.openGraph.hasBasicOg ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                {seo.openGraph.hasBasicOg ? "Aktivní (og:title, image)" : "Neúplné"}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">Twitter Card:</span>
              <span className={seo.twitterCard.hasCard ? "text-emerald-400 font-medium" : "text-slate-400 font-medium"}>
                {seo.twitterCard.hasCard ? seo.twitterCard.card || "Aktivní" : "Nenastaveno"}
              </span>
            </div>
            {seo.openGraph.image && (
              <div className="mt-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block mb-1">OG Obrázek:</span>
                <span className="text-blue-400 truncate block font-mono text-[11px]">
                  {seo.openGraph.image}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Schema.org & Canonical */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Strukturovaná data & Indexace</h3>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">Schema.org (JSON-LD):</span>
              <span className={seo.schemaOrg.hasSchema ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                {seo.schemaOrg.hasSchema ? `${seo.schemaOrg.rawCount} schémat` : "Nenalezeno"}
              </span>
            </div>
            {seo.schemaOrg.types.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {seo.schemaOrg.types.map((type, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]"
                  >
                    @{type}
                  </span>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">Kanonická URL:</span>
              <span className={seo.canonical.status === "pass" ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                {seo.canonical.url ? "Definována" : "Chybí"}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">Robots direktiva:</span>
              <span className={seo.robots.isNoindex ? "text-rose-400 font-bold" : "text-emerald-400 font-medium"}>
                {seo.robots.isNoindex ? "NOINDEX (Blokováno)" : "Indexovatelné"}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">Soubor robots.txt:</span>
              <span className={seo.robots.robotsTxtFound ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                {seo.robots.robotsTxtFound ? "✓ Nalezen" : "✕ Nenalezen"}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">Mapa webu (sitemap.xml):</span>
              <span className={seo.robots.sitemapFound ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                {seo.robots.sitemapFound ? "✓ Nalezena" : "✕ Nenalezena"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content & Links Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70 text-center">
          <BookOpen className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <span className="text-2xl font-bold font-mono text-white">
            {seo.contentStats.wordCount.toLocaleString()}
          </span>
          <p className="text-xs text-slate-400 mt-1">Počet slov</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70 text-center">
          <span className="text-2xl font-bold font-mono text-cyan-400">
            ~{seo.contentStats.readingTimeMinutes} min
          </span>
          <p className="text-xs text-slate-400 mt-1">Doba čtení</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70 text-center">
          <Link2 className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
          <span className="text-2xl font-bold font-mono text-white">
            {seo.contentStats.internalLinksCount}
          </span>
          <p className="text-xs text-slate-400 mt-1">Interní odkazy</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70 text-center">
          <Share2 className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <span className="text-2xl font-bold font-mono text-white">
            {seo.contentStats.externalLinksCount}
          </span>
          <p className="text-xs text-slate-400 mt-1">Externí odkazy</p>
        </div>
      </div>
    </div>
  );
}
