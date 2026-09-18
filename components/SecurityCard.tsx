"use client";

import React from "react";
import { SecurityAuditResult } from "@/types/audit";
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, Lock } from "lucide-react";

interface SecurityCardProps {
  security: SecurityAuditResult;
}

export function SecurityCard({ security }: SecurityCardProps) {
  const getStatusBadge = (status: "pass" | "warn" | "fail") => {
    switch (status) {
      case "pass":
        return {
          label: "Zabezpečeno",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        };
      case "warn":
        return {
          label: "Doporučeno",
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          classes: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        };
      case "fail":
      default:
        return {
          label: "Chybí",
          icon: <XCircle className="w-4 h-4 text-rose-400" />,
          classes: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* SSL / HTTPS banner */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl border ${security.isHttps ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border-rose-500/30"}`}>
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              {security.isHttps ? "Šifrované HTTPS spojení aktivní" : "Nezabezpečené HTTP spojení"}
            </h3>
            <p className="text-xs text-slate-400">
              {security.isHttps ? "Web používá platný SSL/TLS certifikát pro bezpečný přenos klientských dat." : "Web nešifruje data! Hrozí odposlech hesel a penalizace ve vyhledávačích."}
            </p>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${security.isHttps ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-rose-500/15 text-rose-400 border-rose-500/30"}`}>
          {security.isHttps ? "SSL Platné" : "Kritické riziko"}
        </span>
      </div>

      {/* HTTP Security Headers Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">Bezpečnostní HTTP hlavičky (Security Headers)</h3>
          </div>
          <span className="text-xs text-slate-400">Ochrana proti XSS, Clickjackingu & Sniffingu</span>
        </div>

        <div className="space-y-3">
          {security.headers.map((header, idx) => {
            const badge = getStatusBadge(header.status);
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-blue-300">{header.name}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.classes}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{header.description}</p>

                {header.value ? (
                  <div className="pt-1">
                    <span className="text-[11px] text-slate-500">Hodnota na serveru: </span>
                    <code className="text-[11px] font-mono bg-slate-900 px-2 py-0.5 rounded text-emerald-400 break-all">
                      {header.value}
                    </code>
                  </div>
                ) : (
                  <div className="pt-1 text-[11px] text-amber-400/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    <strong>Doporučení:</strong> {header.recommendation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
