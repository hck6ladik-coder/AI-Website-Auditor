"use client";

import React, { useState } from "react";
import { AiRecommendation } from "@/types/audit";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Copy,
  Check,
  Code2,
  Filter,
} from "lucide-react";

interface AiRecommendationsProps {
  recommendations: AiRecommendation[];
}

export function AiRecommendations({ recommendations }: AiRecommendationsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { key: "All", label: "Všechny návrhy" },
    { key: "Performance", label: "Rychlost & Výkon" },
    { key: "SEO", label: "SEO & SERP" },
    { key: "Accessibility", label: "Přístupnost" },
    { key: "Best Practices", label: "Osvědčené postupy" },
  ];

  const filtered = activeCategory === "All"
    ? recommendations
    : recommendations.filter((r) => r.category.toLowerCase() === activeCategory.toLowerCase());

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getPriorityBadge = (priority: AiRecommendation["priority"]) => {
    switch (priority) {
      case "high":
        return {
          label: "Vysoká priorita",
          classes: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        };
      case "medium":
        return {
          label: "Střední priorita",
          classes: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        };
      case "low":
      default:
        return {
          label: "Nízká priorita",
          classes: "bg-blue-500/15 text-blue-400 border-blue-500/30",
        };
    }
  };

  const getEffortLabel = (effort: AiRecommendation["effort"]) => {
    switch (effort) {
      case "low":
        return "Snadná oprava (< 30 min)";
      case "medium":
        return "Střední náročnost (1–2 hod)";
      case "high":
        return "Komplexní zásah";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 shadow-xl backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-inner">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">
              AI Doporučení a akční plán
            </h3>
            <p className="text-xs text-slate-300">
              Personalizovaná analýza nedostatků a konkrétní ukázky kódu pro okamžitou nápravu.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 self-start sm:self-auto">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{recommendations.length} nalezených příležitostí</span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filtr:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === cat.key
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {filtered.map((rec) => {
          const priority = getPriorityBadge(rec.priority);
          return (
            <div
              key={rec.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-all shadow-md space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priority.classes}`}
                    >
                      {priority.label}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {rec.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-white pt-1">{rec.title}</h4>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    <TrendingUp className="w-3.5 h-3.5" /> {rec.impact}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5" /> {getEffortLabel(rec.effort)}
                  </span>
                </div>
              </div>

              {/* Description & Solution */}
              <div className="space-y-2 text-xs leading-relaxed">
                <div>
                  <span className="font-semibold text-slate-400 block mb-0.5">Problém:</span>
                  <p className="text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                    {rec.description}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 block mb-0.5">Doporučené řešení:</span>
                  <p className="text-slate-200 bg-blue-950/20 p-2.5 rounded-lg border border-blue-900/30 font-medium">
                    {rec.solution}
                  </p>
                </div>
              </div>

              {/* Code Snippet Box */}
              {rec.codeSnippet && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Code2 className="w-3.5 h-3.5 text-blue-400" /> Ukázka implementace
                    </span>
                    <button
                      onClick={() => handleCopyCode(rec.id, rec.codeSnippet!)}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-all"
                    >
                      {copiedId === rec.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Zkopírováno</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Kopírovat</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
                    {rec.codeSnippet}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
