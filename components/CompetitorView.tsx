"use client";

import React from "react";
import { CompetitorComparison } from "@/types/audit";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Trophy, TrendingUp, TrendingDown, Minus, CheckCircle, ArrowRight } from "lucide-react";

interface CompetitorViewProps {
  comparison: CompetitorComparison;
}

export function CompetitorView({ comparison }: CompetitorViewProps) {
  const { target, competitor, deltas, winnerCategory, comparisonInsights } = comparison;

  const renderDelta = (val: number) => {
    if (val > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          <TrendingUp className="w-3 h-3" /> +{val}
        </span>
      );
    }
    if (val < 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
          <TrendingDown className="w-3 h-3" /> {val}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
        <Minus className="w-3 h-3" /> 0
      </span>
    );
  };

  const getWinnerBadge = (winner: "target" | "competitor" | "tie") => {
    if (winner === "target") {
      return (
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
          <Trophy className="w-3 h-3" /> Váš web vítězí
        </span>
      );
    }
    if (winner === "competitor") {
      return (
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
          Konkurence vede
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
        Vyrovnané
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Comparison Headline Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Target */}
          <div className="flex-1 text-center md:text-left">
            <span className="text-xs font-semibold uppercase text-blue-400 tracking-wider">Váš web</span>
            <h3 className="text-lg font-bold text-white truncate max-w-sm">{target.normalizedUrl}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Odezva: {target.executionTimeMs} ms</p>
          </div>

          {/* VS badge */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-extrabold text-sm shadow-inner">
              VS
            </div>
            <div className="mt-1">{renderDelta(deltas.overall)}</div>
          </div>

          {/* Competitor */}
          <div className="flex-1 text-center md:text-right">
            <span className="text-xs font-semibold uppercase text-purple-400 tracking-wider">Konkurent</span>
            <h3 className="text-lg font-bold text-white truncate max-w-sm ml-auto">{competitor.normalizedUrl}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Odezva: {competitor.executionTimeMs} ms</p>
          </div>
        </div>
      </div>

      {/* Side by side scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-500/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-white text-base truncate">Váš web: {target.normalizedUrl}</h4>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
              Cílový web
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <ScoreGauge score={target.scores.overall} label="Celkem" size="sm" />
            <ScoreGauge score={target.scores.performance} label="Výkon" size="sm" />
            <ScoreGauge score={target.scores.seo} label="SEO" size="sm" />
            <ScoreGauge score={target.scores.accessibility} label="Přístupnost" size="sm" />
          </div>

          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">LCP (Načtení obsahu):</span>
              <span className="font-mono font-medium">{target.coreWebVitals.lcp.displayValue}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">CLS (Stabilita layoutu):</span>
              <span className="font-mono font-medium">{target.coreWebVitals.cls.displayValue}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Počet slov na stránce:</span>
              <span className="font-mono font-medium">{target.seo.contentStats.wordCount}</span>
            </div>
          </div>
        </div>

        {/* Competitor Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-white text-base truncate">Konkurent: {competitor.normalizedUrl}</h4>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold">
              Konkurence
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <ScoreGauge score={competitor.scores.overall} label="Celkem" size="sm" />
            <ScoreGauge score={competitor.scores.performance} label="Výkon" size="sm" />
            <ScoreGauge score={competitor.scores.seo} label="SEO" size="sm" />
            <ScoreGauge score={competitor.scores.accessibility} label="Přístupnost" size="sm" />
          </div>

          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">LCP (Načtení obsahu):</span>
              <span className="font-mono font-medium">{competitor.coreWebVitals.lcp.displayValue}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">CLS (Stabilita layoutu):</span>
              <span className="font-mono font-medium">{competitor.coreWebVitals.cls.displayValue}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Počet slov na stránce:</span>
              <span className="font-mono font-medium">{competitor.seo.contentStats.wordCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h4 className="font-semibold text-white mb-4">Podrobné srovnání kategorií a metrik</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 uppercase bg-slate-950/70 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Kategorie / Metrika</th>
                <th className="py-3 px-4">Váš web</th>
                <th className="py-3 px-4">Konkurence</th>
                <th className="py-3 px-4">Rozdíl (Delta)</th>
                <th className="py-3 px-4">Vítěz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/30 transition-all">
                <td className="py-3 px-4 font-semibold text-white">Celkové skóre</td>
                <td className="py-3 px-4 font-mono font-bold text-blue-400">{target.scores.overall}/100</td>
                <td className="py-3 px-4 font-mono text-purple-400">{competitor.scores.overall}/100</td>
                <td className="py-3 px-4">{renderDelta(deltas.overall)}</td>
                <td className="py-3 px-4">{getWinnerBadge(winnerCategory.overall)}</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-all">
                <td className="py-3 px-4 font-semibold text-white">Rychlost načítání (Performance)</td>
                <td className="py-3 px-4 font-mono font-bold">{target.scores.performance}/100</td>
                <td className="py-3 px-4 font-mono">{competitor.scores.performance}/100</td>
                <td className="py-3 px-4">{renderDelta(deltas.performance)}</td>
                <td className="py-3 px-4">{getWinnerBadge(winnerCategory.performance)}</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-all">
                <td className="py-3 px-4 font-semibold text-white">SEO & Indexovatelnost</td>
                <td className="py-3 px-4 font-mono font-bold">{target.scores.seo}/100</td>
                <td className="py-3 px-4 font-mono">{competitor.scores.seo}/100</td>
                <td className="py-3 px-4">{renderDelta(deltas.seo)}</td>
                <td className="py-3 px-4">{getWinnerBadge(winnerCategory.seo)}</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-all">
                <td className="py-3 px-4 font-semibold text-white">Přístupnost (Accessibility)</td>
                <td className="py-3 px-4 font-mono font-bold">{target.scores.accessibility}/100</td>
                <td className="py-3 px-4 font-mono">{competitor.scores.accessibility}/100</td>
                <td className="py-3 px-4">{renderDelta(deltas.accessibility)}</td>
                <td className="py-3 px-4">{getWinnerBadge(winnerCategory.accessibility)}</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-all">
                <td className="py-3 px-4 font-semibold text-white">LCP (Largest Contentful Paint)</td>
                <td className="py-3 px-4 font-mono">{target.coreWebVitals.lcp.displayValue}</td>
                <td className="py-3 px-4 font-mono">{competitor.coreWebVitals.lcp.displayValue}</td>
                <td className="py-3 px-4">
                  {renderDelta(Math.round((competitor.coreWebVitals.lcp.value - target.coreWebVitals.lcp.value) / 100))} (ms delta)
                </td>
                <td className="py-3 px-4">
                  {target.coreWebVitals.lcp.value < competitor.coreWebVitals.lcp.value ? getWinnerBadge("target") : getWinnerBadge("competitor")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-blue-400" />
          Klíčová zjištění srovnání
        </h4>
        <ul className="space-y-2">
          {comparisonInsights.map((insight, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <ArrowRight className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
