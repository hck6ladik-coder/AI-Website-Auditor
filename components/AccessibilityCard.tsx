"use client";

import React from "react";
import { AccessibilityAuditResult, AccessibilityIssue } from "@/types/audit";
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Info,
  Image as ImageIcon,
  Languages,
  Compass,
  FormInput,
} from "lucide-react";

interface AccessibilityCardProps {
  a11y: AccessibilityAuditResult;
}

export function AccessibilityCard({ a11y }: AccessibilityCardProps) {
  const getSeverityBadge = (severity: AccessibilityIssue["severity"]) => {
    switch (severity) {
      case "critical":
        return {
          label: "Kritická",
          icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />,
          classes: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        };
      case "serious":
        return {
          label: "Závažná",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          classes: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        };
      case "moderate":
        return {
          label: "Střední",
          icon: <Info className="w-3.5 h-3.5 text-blue-400" />,
          classes: "bg-blue-500/15 text-blue-400 border-blue-500/30",
        };
      case "minor":
      default:
        return {
          label: "Nízká",
          icon: <Info className="w-3.5 h-3.5 text-slate-400" />,
          classes: "bg-slate-500/15 text-slate-400 border-slate-500/30",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Images Alt */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Alt u obrázků</span>
            <ImageIcon className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {a11y.images.withAlt}/{a11y.images.total}
            </span>
            <span className="text-xs text-slate-400">s popiskem</span>
          </div>
          {a11y.images.missingAlt > 0 ? (
            <p className="text-xs text-rose-400 mt-2 font-medium">
              Chybí u {a11y.images.missingAlt} obrázků
            </p>
          ) : (
            <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Všechny obrázky mají alt
            </p>
          )}
        </div>

        {/* HTML Lang */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Jazyk (HTML lang)</span>
            <Languages className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white uppercase">
              {a11y.htmlLang || "—"}
            </span>
          </div>
          {a11y.hasLangAttribute ? (
            <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Jazyk je správně nastaven
            </p>
          ) : (
            <p className="text-xs text-rose-400 mt-2 font-medium">
              Chybí atribut lang u &lt;html&gt;
            </p>
          )}
        </div>

        {/* Landmarks */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Sémantické body</span>
            <Compass className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xs space-y-1 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">&lt;main&gt;:</span>
              <span className={a11y.hasMainLandmark ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                {a11y.hasMainLandmark ? "Nalezen" : "Chybí"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">&lt;nav&gt;:</span>
              <span className={a11y.hasNavLandmark ? "text-emerald-400 font-medium" : "text-slate-400 font-medium"}>
                {a11y.hasNavLandmark ? "Nalezen" : "Chybí"}
              </span>
            </div>
          </div>
        </div>

        {/* Form Labels */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Popisky formulářů</span>
            <FormInput className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {a11y.formLabels.withLabel}/{a11y.formLabels.total}
            </span>
            <span className="text-xs text-slate-400">označeno</span>
          </div>
          {a11y.formLabels.missingLabel > 0 ? (
            <p className="text-xs text-rose-400 mt-2 font-medium">
              Chybí u {a11y.formLabels.missingLabel} polí
            </p>
          ) : (
            <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Formuláře jsou označené
            </p>
          )}
        </div>
      </div>

      {/* WCAG Issues List */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">
            Nalezené problémy s přístupností ({a11y.issues.length})
          </h3>
          <span className="text-xs text-slate-400">Podle směrnic WCAG 2.1</span>
        </div>

        {a11y.issues.length === 0 ? (
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-emerald-300 font-semibold">Skvělá práce!</p>
            <p className="text-slate-400 text-xs mt-1">
              Nebyly zjištěny žádné běžné chyby přístupnosti.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {a11y.issues.map((issue) => {
              const badge = getSeverityBadge(issue.severity);
              return (
                <div
                  key={issue.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.classes}`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                      <h4 className="font-semibold text-slate-100 text-sm">{issue.title}</h4>
                    </div>
                    {issue.wcagRule && (
                      <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                        {issue.wcagRule}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{issue.description}</p>
                  {issue.element && (
                    <div className="pt-1">
                      <span className="text-[11px] text-slate-500">Zasažené prvky: </span>
                      <code className="text-[11px] bg-slate-900 px-1.5 py-0.5 rounded text-rose-300 font-mono">
                        {issue.element}
                      </code>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
