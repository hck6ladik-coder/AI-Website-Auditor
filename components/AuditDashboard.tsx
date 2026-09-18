"use client";

import React, { useState } from "react";
import { AuditReport } from "@/types/audit";
import { ScoreGauge } from "@/components/ScoreGauge";
import { MetricCard } from "@/components/MetricCard";
import { SeoCard } from "@/components/SeoCard";
import { AccessibilityCard } from "@/components/AccessibilityCard";
import { SecurityCard } from "@/components/SecurityCard";
import { AssetsCard } from "@/components/AssetsCard";
import { AgencyPitchCard } from "@/components/AgencyPitchCard";
import { AiRecommendations } from "@/components/AiRecommendations";
import { PdfExportButton } from "@/components/PdfExportButton";
import { PrintReport } from "@/components/PrintReport";
import {
  Sparkles,
  Gauge,
  Search,
  Accessibility,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Cpu,
  Clock,
  Layers,
  ShieldCheck,
  Package,
  Briefcase,
  FileText,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AuditDashboardProps {
  report: AuditReport;
  onNewAudit: () => void;
  onRerunAudit: (url: string) => void;
}

type TabType =
  | "overview"
  | "performance"
  | "seo"
  | "accessibility"
  | "security"
  | "assets"
  | "pitch"
  | "ai"
  | "tech"
  | "full";

export function AuditDashboard({
  report,
  onNewAudit,
  onRerunAudit,
}: AuditDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const tabs: { id: TabType; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: "overview", label: "Přehled", icon: Layers },
    { id: "performance", label: "Rychlost & Vitals", icon: Gauge, badge: `${report.scores.performance}%` },
    { id: "seo", label: "SEO Analýza", icon: Search, badge: `${report.scores.seo}%` },
    { id: "accessibility", label: "Přístupnost", icon: Accessibility, badge: `${report.scores.accessibility}%` },
    { id: "security", label: "Bezpečnost & SSL", icon: ShieldCheck, badge: `${report.scores.security}%` },
    { id: "assets", label: "Assety & Payload", icon: Package, badge: report.assets.htmlSizeFormatted },
    { id: "pitch", label: "Agenturní nabídka", icon: Briefcase },
    { id: "ai", label: "AI Doporučení", icon: Sparkles, badge: report.aiRecommendations.length },
    { id: "tech", label: "Technologie", icon: Cpu, badge: report.techStack.length },
    { id: "full", label: "Celý report (PDF)", icon: FileText, badge: "Kompletní" },
  ];

  const topRecommendations = report.aiRecommendations.slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 print-container">
      {/* Interactive Screen Dashboard (Hidden when printing to PDF) */}
      <div className="print:hidden space-y-6">
        {/* Top Header Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Výsledky auditu
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(report.timestamp)} ({report.executionTimeMs} ms)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white truncate max-w-xl">
              {report.normalizedUrl}
            </h2>
            <a
              href={report.normalizedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 p-1 transition-colors"
              title="Otevřít web v novém okně"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            type="button"
            onClick={() => onRerunAudit(report.normalizedUrl)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs sm:text-sm font-semibold transition-all border border-slate-700/60"
            title="Spustit audit této URL znovu"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Znovu otestovat</span>
          </button>

          <PdfExportButton targetUrl={report.normalizedUrl} />

          <button
            type="button"
            onClick={onNewAudit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 transition-all"
          >
            Nový audit
          </button>
        </div>
      </div>

      {/* Main Score Gauges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <ScoreGauge
          score={report.scores.overall}
          label="Celkové hodnocení"
          sublabel="Vážený průměr"
          size="sm"
        />
        <ScoreGauge
          score={report.scores.performance}
          label="Výkon (Performance)"
          sublabel="Core Web Vitals"
          size="sm"
        />
        <ScoreGauge
          score={report.scores.seo}
          label="SEO & Indexace"
          sublabel="On-page & Meta"
          size="sm"
        />
        <ScoreGauge
          score={report.scores.accessibility}
          label="Přístupnost (a11y)"
          sublabel="WCAG 2.1 normy"
          size="sm"
        />
        <ScoreGauge
          score={report.scores.security}
          label="Bezpečnost (Security)"
          sublabel="SSL & Hlavičky"
          size="sm"
        />
        <ScoreGauge
          score={report.scores.bestPractices}
          label="Best Practices"
          sublabel="Standardy & Mobilita"
          size="sm"
        />
      </div>

      {/* Navigation Tabs (Hidden in Print) */}
      <div className="no-print flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/20 shadow-lg">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Manažerské shrnutí auditu</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">{report.summary}</p>
          </div>

          {/* Quick Metrics Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base text-white">Core Web Vitals přehled</h3>
              <button
                onClick={() => setActiveTab("performance")}
                className="text-xs text-blue-400 hover:underline"
              >
                Zobrazit všechny metriky &rarr;
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard metric={report.coreWebVitals.lcp} />
              <MetricCard metric={report.coreWebVitals.cls} />
              <MetricCard metric={report.coreWebVitals.fcp} />
            </div>
          </div>

          {/* Top AI Recommendations Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Prioritní AI doporučení</h3>
              <button
                onClick={() => setActiveTab("ai")}
                className="text-xs text-blue-400 hover:underline"
              >
                Zobrazit všech {report.aiRecommendations.length} návrhů &rarr;
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => setActiveTab("ai")}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {rec.category}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold">{rec.impact}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{rec.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Performance */}
      {activeTab === "performance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard metric={report.coreWebVitals.fcp} />
            <MetricCard metric={report.coreWebVitals.lcp} />
            <MetricCard metric={report.coreWebVitals.cls} />
            <MetricCard metric={report.coreWebVitals.tbt} />
            <MetricCard metric={report.coreWebVitals.ttfb} />
            <MetricCard metric={report.coreWebVitals.speedIndex} />
          </div>
        </div>
      )}

      {/* Tab 3: SEO */}
      {activeTab === "seo" && (
        <SeoCard seo={report.seo} targetUrl={report.normalizedUrl} />
      )}

      {/* Tab 4: Accessibility */}
      {activeTab === "accessibility" && (
        <AccessibilityCard a11y={report.accessibility} />
      )}

      {/* Tab 5: Security */}
      {activeTab === "security" && (
        <SecurityCard security={report.security} />
      )}

      {/* Tab 6: Assets */}
      {activeTab === "assets" && (
        <AssetsCard assets={report.assets} />
      )}

      {/* Tab 7: Agency Pitch */}
      {activeTab === "pitch" && (
        <AgencyPitchCard pitch={report.agencyPitch} targetUrl={report.normalizedUrl} />
      )}

      {/* Tab 8: AI Recommendations */}
      {activeTab === "ai" && (
        <AiRecommendations recommendations={report.aiRecommendations} />
      )}

      {/* Tab 9: Tech Stack */}
      {activeTab === "tech" && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="font-bold text-lg text-white">Detekované technologie</h3>
          <p className="text-xs text-slate-400">
            Následující technologie a frameworky byly detekovány v hlavičkách a struktuře HTML kódu:
          </p>
          {report.techStack.length === 0 ? (
            <p className="text-xs text-slate-500">Žádný běžný framework nebyl explicitně detekován.</p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-2">
              {report.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/25 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 10: Full Complete Report Preview */}
      {activeTab === "full" && (
        <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-2xl border border-slate-700 text-slate-900">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900 rounded-2xl mb-6 text-white no-print">
            <div>
              <h3 className="font-bold text-base">Náhled kompletního auditu celé kontroly</h3>
              <p className="text-xs text-slate-400">
                Tento ucelený dokument obsahuje všechny sekce naráz a v této podobě se vyexportuje do PDF.
              </p>
            </div>
            <PdfExportButton targetUrl={report.normalizedUrl} />
          </div>
          <PrintReport report={report} />
        </div>
      )}
      </div>

      {/* Dedicated Print View (Rendered exclusively when printing or saving as PDF) */}
      <div className="hidden print:block w-full">
        <PrintReport report={report} />
      </div>
    </div>
  );
}
