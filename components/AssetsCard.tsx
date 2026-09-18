"use client";

import React from "react";
import { AssetsBreakdown } from "@/types/audit";
import { FileCode, Code, Palette, Image as ImageIcon, ExternalLink, Type, Globe } from "lucide-react";

interface AssetsCardProps {
  assets: AssetsBreakdown;
}

export function AssetsCard({ assets }: AssetsCardProps) {
  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400">Velikost HTML</span>
            <FileCode className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">{assets.htmlSizeFormatted}</span>
          <p className="text-[11px] text-slate-500 mt-1">Nekomprimovaný kód</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400">Skripty (&lt;script&gt;)</span>
            <Code className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">{assets.scriptsCount.total}</span>
          <p className="text-[11px] text-slate-500 mt-1">
            {assets.scriptsCount.external} externích, {assets.scriptsCount.inline} inline
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400">Styly (CSS)</span>
            <Palette className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">{assets.stylesCount.total}</span>
          <p className="text-[11px] text-slate-500 mt-1">
            {assets.stylesCount.external} souborů, {assets.stylesCount.inline} inline
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400">Obrázky &amp; Iframy</span>
            <ImageIcon className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">
            {assets.imagesCount} / {assets.iframesCount}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">
            {assets.lazyImagesCount} lazy-load, {assets.imagesCount} celkem
          </p>
        </div>
      </div>

      {/* Render Blocking & Optimization Diagnostics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          assets.renderBlockingScripts === 0
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
            : "bg-amber-500/5 border-amber-500/20 text-amber-300"
        }`}>
          <div className="mt-0.5">
            {assets.renderBlockingScripts === 0 ? (
              <span className="inline-flex p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs">OK</span>
            ) : (
              <span className="inline-flex p-1.5 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs">POZOR</span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              {assets.renderBlockingScripts === 0
                ? "Žádné render-blocking skripty"
                : `${assets.renderBlockingScripts} skriptů blokuje vykreslování`}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {assets.renderBlockingScripts === 0
                ? "Všechny externí skripty využívají async, defer nebo type='module'."
                : "Externí skripty bez async/defer zdržují First Contentful Paint (FCP)."}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <div className="mt-0.5">
            <span className="inline-flex p-1.5 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs">INFO</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              Lazy Loading obrázků: {assets.lazyImagesCount} z {assets.imagesCount}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {assets.imagesCount > 0
                ? `${Math.round((assets.lazyImagesCount / assets.imagesCount) * 100)} % obrázků má nastaven atribut loading='lazy'.`
                : "Stránka neobsahuje obrázky k odloženému načítání."}
            </p>
          </div>
        </div>
      </div>

      {/* Fonts & Third Party Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fonts Detected */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white">Detekované webové fonty</h3>
          </div>
          {assets.fontsDetected.length === 0 ? (
            <p className="text-xs text-slate-500">Používají se standardní systémové fonty (žádné externí fonty nezatěžují síť).</p>
          ) : (
            <div className="space-y-2">
              {assets.fontsDetected.map((font, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-medium text-slate-200 flex items-center justify-between"
                >
                  <span>{font}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Aktivní</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Third Party Domains */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold text-white">Volané externí domény ({assets.thirdPartyDomains.length})</h3>
            </div>
          </div>
          {assets.thirdPartyDomains.length === 0 ? (
            <p className="text-xs text-slate-500">Nebyly detekovány žádné externí skripty třetích stran.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {assets.thirdPartyDomains.map((domain, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]"
                >
                  {domain}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
