"use client";

import React from "react";
import { MetricItem } from "@/types/audit";
import { getScoreColor } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

interface MetricCardProps {
  metric: MetricItem;
}

export function MetricCard({ metric }: MetricCardProps) {
  const colors = getScoreColor(metric.score);

  const getStatusBadge = () => {
    switch (metric.status) {
      case "good":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          label: "Dobrý",
          bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        };
      case "needs-improvement":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          label: "Vyžaduje zlepšení",
          bg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        };
      case "poor":
      default:
        return {
          icon: <XCircle className="w-4 h-4 text-rose-400" />,
          label: "Špatný",
          bg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-md">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white">{metric.name}</span>
              <span className="text-xs text-slate-400 hidden sm:inline">({metric.label})</span>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.bg}`}
          >
            {badge.icon}
            {badge.label}
          </span>
        </div>

        <div className="flex items-baseline gap-2 my-2">
          <span className={`text-3xl font-bold font-mono ${colors.text}`}>
            {metric.displayValue}
          </span>
          <span className="text-xs text-slate-400">skóre {metric.score}/100</span>
        </div>

        {/* Threshold bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden my-3">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              metric.status === "good"
                ? "bg-emerald-500"
                : metric.status === "needs-improvement"
                ? "bg-amber-500"
                : "bg-rose-500"
            }`}
            style={{ width: `${Math.max(5, Math.min(100, metric.score))}%` }}
          />
        </div>
      </div>

      <div className="flex items-start gap-1.5 pt-2 border-t border-slate-800/60 text-slate-400 text-xs mt-1">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-500" />
        <p className="line-clamp-2 leading-relaxed">{metric.description}</p>
      </div>
    </div>
  );
}
