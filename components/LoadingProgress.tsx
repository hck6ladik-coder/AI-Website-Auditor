"use client";

import React, { useEffect, useState } from "react";
import { Globe, Search, Accessibility, Gauge, Sparkles, CheckCircle2, Loader2 } from "lucide-react";

interface LoadingProgressProps {
  targetUrl: string;
}

const STEPS = [
  { id: 1, label: "Navazování spojení & stahování HTML", icon: Globe, duration: 1800 },
  { id: 2, label: "SEO Crawler & Meta tag analýza", icon: Search, duration: 2200 },
  { id: 3, label: "Kontrola přístupnosti a WCAG 2.1 pravidel", icon: Accessibility, duration: 2000 },
  { id: 4, label: "Měření Core Web Vitals & odezvy serveru", icon: Gauge, duration: 2500 },
  { id: 5, label: "Generování AI doporučení & optimalizací", icon: Sparkles, duration: 3000 },
];

export function LoadingProgress({ targetUrl }: LoadingProgressProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let accumulated = 0;
    STEPS.forEach((step, idx) => {
      accumulated += step.duration;
      const timeout = setTimeout(() => {
        setCurrentStep((prev) => Math.max(prev, idx + 1));
      }, accumulated);
      return () => clearTimeout(timeout);
    });
  }, []);

  const progressPercent = Math.min(95, Math.round((currentStep / STEPS.length) * 100));

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-blue-500/20 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Probíhá hloubková analýza ({seconds}s)
        </div>
        <h3 className="text-xl font-bold text-white">Provádíme kompletní audit webu</h3>
        <p className="text-xs text-slate-400 font-mono truncate max-w-md mx-auto">{targetUrl}</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-slate-400">
          <span>Stav zpracování</span>
          <span className="font-mono text-blue-400 font-semibold">{progressPercent} %</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3 pt-2">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isCurrent
                  ? "bg-blue-950/30 border-blue-500/50 shadow-md shadow-blue-500/5"
                  : isDone
                  ? "bg-slate-900/60 border-slate-800/80"
                  : "bg-slate-950/40 border-slate-900 opacity-40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isCurrent
                      ? "bg-blue-500/20 text-blue-400"
                      : isDone
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs md:text-sm font-medium ${
                    isCurrent ? "text-white font-semibold" : isDone ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              <div>
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isCurrent && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
