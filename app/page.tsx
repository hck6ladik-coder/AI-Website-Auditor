"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/Navbar";
import { UrlInputForm } from "@/components/UrlInputForm";
import { LoadingProgress } from "@/components/LoadingProgress";
import { AuditDashboard } from "@/components/AuditDashboard";
import { CompetitorView } from "@/components/CompetitorView";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { AuditReport, CompetitorComparison } from "@/types/audit";
import {
  getAuditHistory,
  saveAuditToHistory,
  deleteAuditFromHistory,
  clearAuditHistory,
  importHistoryFromJson,
} from "@/lib/storage";
import {
  Sparkles,
  Gauge,
  Search,
  Accessibility,
  Scale,
  Download,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function Home() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [comparison, setComparison] = useState<CompetitorComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUrl, setLoadingUrl] = useState("");
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [history, setHistory] = useState<AuditReport[]>([]);
  const [customApiKey, setCustomApiKey] = useState("");

  // Load history & API key on mount
  useEffect(() => {
    setHistory(getAuditHistory());
    const storedKey = localStorage.getItem("openai_custom_api_key") || "";
    setCustomApiKey(storedKey);
  }, []);

  const handleStartAudit = async (targetUrl: string) => {
    setIsLoading(true);
    setLoadingUrl(targetUrl);
    setErrorMessage(null);
    setReport(null);
    setComparison(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, customApiKey }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Při provádění auditu došlo k chybě.");
      }

      setReport(data);
      saveAuditToHistory(data);
      setHistory(getAuditHistory());

      // Celebration confetti if overall score is great!
      if (data.scores.overall >= 85) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // confetti optional
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Chyba při komunikaci se serverem.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartComparison = async (targetUrl: string, competitorUrl: string) => {
    setIsLoading(true);
    setLoadingUrl(`${targetUrl} vs ${competitorUrl}`);
    setErrorMessage(null);
    setReport(null);
    setComparison(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl, competitorUrl, customApiKey }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Při srovnání webů došlo k chybě.");
      }

      setComparison(data);
      // Also save target report into history
      if (data.target) {
        saveAuditToHistory(data.target);
        setHistory(getAuditHistory());
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Chyba při komunikaci se serverem.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    if (key) {
      localStorage.setItem("openai_custom_api_key", key);
    } else {
      localStorage.removeItem("openai_custom_api_key");
    }
  };

  const handleSelectAudit = (item: AuditReport) => {
    setReport(item);
    setComparison(null);
    setIsComparisonMode(false);
    setErrorMessage(null);
  };

  const handleDeleteAudit = (id: string) => {
    const updated = deleteAuditFromHistory(id);
    setHistory(updated);
    if (report?.id === id) {
      setReport(null);
    }
  };

  const handleClearHistory = () => {
    clearAuditHistory();
    setHistory([]);
  };

  const handleImportHistory = (jsonStr: string) => {
    const ok = importHistoryFromJson(jsonStr);
    if (ok) {
      setHistory(getAuditHistory());
    } else {
      alert("Neplatný formát JSON souboru pro import.");
    }
  };

  const handleResetToHome = () => {
    setReport(null);
    setComparison(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        historyCount={history.length}
        hasCustomApiKey={Boolean(customApiKey)}
        onResetToHome={handleResetToHome}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Hero & Input Section (Always visible or compact) */}
        {!report && !comparison && !isLoading && (
          <div className="text-center max-w-3xl mx-auto space-y-6 pt-4 sm:pt-8 animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Audit webových stránek poháněný umělou inteligencí</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight">
              Zjistěte slabiny webu, zrychlete načítání a{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                ovládněte vyhledávače
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Okamžitý audit rychlosti (Core Web Vitals), kontrola SEO on-page faktorů, přístupnosti podle norem WCAG 2.1 a konkrétní AI návrhy řešení s ukázkami kódu.
            </p>

            {/* Input Form */}
            <div className="pt-2">
              <UrlInputForm
                onStartAudit={handleStartAudit}
                onStartComparison={handleStartComparison}
                isLoading={isLoading}
                isComparisonMode={isComparisonMode}
                setIsComparisonMode={setIsComparisonMode}
                errorMessage={errorMessage}
              />
            </div>

            {/* Features Showcase Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-8 text-left">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <Gauge className="w-5 h-5 text-blue-400 mb-1.5" />
                <h4 className="text-xs font-bold text-white">Lighthouse API</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">LCP, FCP, CLS, TBT metriky</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <Search className="w-5 h-5 text-indigo-400 mb-1.5" />
                <h4 className="text-xs font-bold text-white">SEO Crawler</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Meta tagy, H1–H3, Schema</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <Accessibility className="w-5 h-5 text-purple-400 mb-1.5" />
                <h4 className="text-xs font-bold text-white">Přístupnost (a11y)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">WCAG 2.1, alt, formuláře</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <Sparkles className="w-5 h-5 text-amber-400 mb-1.5" />
                <h4 className="text-xs font-bold text-white">AI Doporučení</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Kód a řešení na míru</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <Scale className="w-5 h-5 text-cyan-400 mb-1.5" />
                <h4 className="text-xs font-bold text-white">Srovnání webů</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Vy vs konkurence</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <Download className="w-5 h-5 text-emerald-400 mb-1.5" />
                <h4 className="text-xs font-bold text-white">Export do PDF</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Kompletní tisk reportu</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 animate-in fade-in duration-300">
            <LoadingProgress targetUrl={loadingUrl} />
          </div>
        )}

        {/* Active Audit Report View */}
        {report && !isLoading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AuditDashboard
              report={report}
              onNewAudit={handleResetToHome}
              onRerunAudit={(url) => handleStartAudit(url)}
            />
          </div>
        )}

        {/* Competitor Comparison View */}
        {comparison && !isLoading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Výsledky srovnání s konkurencí</h2>
              <button
                onClick={handleResetToHome}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white"
              >
                Nové srovnání
              </button>
            </div>
            <CompetitorView comparison={comparison} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-400">
            AI Website Auditor © {new Date().getFullYear()} — Špičkový audit rychlosti, SEO a přístupnosti pro moderní weby.
          </p>
          <p className="text-[11px] text-slate-600">
            Vyvinuto s Next.js 15, TypeScript, Tailwind CSS, Cheerio, Lighthouse & OpenAI.
          </p>
        </div>
      </footer>

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectAudit={handleSelectAudit}
        onDeleteAudit={handleDeleteAudit}
        onClearHistory={handleClearHistory}
        onImportHistory={handleImportHistory}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveKey={handleSaveApiKey}
        currentKey={customApiKey}
      />
    </div>
  );
}
