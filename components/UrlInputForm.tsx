"use client";

import React, { useState } from "react";
import { Search, ArrowRight, Sparkles, Scale, AlertCircle } from "lucide-react";
import { isValidUrl, normalizeUrl } from "@/lib/utils";

interface UrlInputFormProps {
  onStartAudit: (url: string) => void;
  onStartComparison: (targetUrl: string, competitorUrl: string) => void;
  isLoading: boolean;
  isComparisonMode: boolean;
  setIsComparisonMode: (mode: boolean) => void;
  errorMessage?: string | null;
}

const PRESET_URLS = [
  { label: "Webforte.cz (Demo)", url: "https://webforte.cz" },
  { label: "Seznam.cz", url: "https://www.seznam.cz" },
  { label: "Wikipedia.org", url: "https://www.wikipedia.org" },
  { label: "Vercel.com", url: "https://vercel.com" },
];

export function UrlInputForm({
  onStartAudit,
  onStartComparison,
  isLoading,
  isComparisonMode,
  setIsComparisonMode,
  errorMessage,
}: UrlInputFormProps) {
  const [url, setUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const normTarget = normalizeUrl(url);
    if (!normTarget || !isValidUrl(normTarget)) {
      setLocalError("Zadejte prosím platnou URL adresu (např. https://vasedomena.cz nebo jen vasedomena.cz).");
      return;
    }

    if (isComparisonMode) {
      const normComp = normalizeUrl(competitorUrl);
      if (!normComp || !isValidUrl(normComp)) {
        setLocalError("Zadejte prosím platnou URL adresu konkurenta.");
        return;
      }
      onStartComparison(normTarget, normComp);
    } else {
      onStartAudit(normTarget);
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrl(presetUrl);
    setLocalError(null);
  };

  const displayError = localError || errorMessage;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Mode tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsComparisonMode(false);
            setLocalError(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            !isComparisonMode
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Search className="w-4 h-4" />
          Jednotlivý audit
        </button>

        <button
          type="button"
          onClick={() => {
            setIsComparisonMode(true);
            setLocalError(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            isComparisonMode
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Scale className="w-4 h-4" />
          Porovnání s konkurencí
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative space-y-3">
        <div className="space-y-3">
          {/* Target URL Input */}
          <div className="relative flex items-center">
            <div className="absolute left-4 pointer-events-none text-slate-500">
              <Search className="w-5 h-5 text-blue-400" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (localError) setLocalError(null);
              }}
              placeholder={isComparisonMode ? "Zadejte URL Vašeho webu (např. mujweb.cz)" : "Zadejte URL webu k auditu (např. https://vasedomena.cz)"}
              disabled={isLoading}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-xl transition-all disabled:opacity-50"
            />
          </div>

          {/* Competitor URL Input if in comparison mode */}
          {isComparisonMode && (
            <div className="relative flex items-center animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="absolute left-4 pointer-events-none text-slate-500">
                <Scale className="w-5 h-5 text-purple-400" />
              </div>
              <input
                type="text"
                value={competitorUrl}
                onChange={(e) => {
                  setCompetitorUrl(e.target.value);
                  if (localError) setLocalError(null);
                }}
                placeholder="Zadejte URL konkurence (např. konkurent.cz)"
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-xl transition-all disabled:opacity-50"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !url.trim() || (isComparisonMode && !competitorUrl.trim())}
          className={`w-full py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 text-white shadow-xl transition-all ${
            isComparisonMode
              ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-600/25"
              : "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/25"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Sparkles className="w-5 h-5" />
          <span>{isComparisonMode ? "Spustit porovnávací audit obou webů" : "Spustit kompletní audit webu zdarma"}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      {/* Error alert */}
      {displayError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">{displayError}</div>
        </div>
      )}

      {/* Quick Presets Chips */}
      {!isComparisonMode && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-400">
          <span className="font-medium">Rychle vyzkoušet:</span>
          {PRESET_URLS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleSelectPreset(preset.url)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-slate-200 transition-all font-mono text-[11px]"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
