"use client";

import React, { useState } from "react";
import { AgencyPitch } from "@/types/audit";
import { Briefcase, Copy, Check, Clock, TrendingUp, Sparkles, Send } from "lucide-react";

interface AgencyPitchCardProps {
  pitch: AgencyPitch;
  targetUrl: string;
}

export function AgencyPitchCard({ pitch, targetUrl }: AgencyPitchCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPitch = () => {
    let emailText = `Dobrý den,\n\nprovedli jsme technický a SEO audit Vašeho webu ${targetUrl}.\n\n${pitch.problemSummary}\n\nNavrhujeme následující postup realizace:\n`;
    pitch.recommendedPackages.forEach((pkg, i) => {
      emailText += `\n${i + 1}. ${pkg.name}\n   - Co vyřešíme: ${pkg.description}\n   - Časová náročnost: ${pkg.estimatedTime}\n   - Očekávaný přínos (ROI): ${pkg.roi}\n`;
    });
    emailText += `\nRádi s Vámi probereme detaily na krátkém online callu nebo osobně v Praze.\n\nS pozdravem,\nTým Webforte`;

    navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-indigo-900/40 border border-blue-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-white">Agenturní návrh pro klienta</h3>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Lead-Gen Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Automaticky vygenerovaná struktura nabídky a servisních balíčků připravená k odeslání klientovi.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyPitch}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Zkopírováno do schránky</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Zkopírovat e-mail pro klienta</span>
            </>
          )}
        </button>
      </div>

      {/* Package cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pitch.recommendedPackages.map((pkg, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Balíček #{idx + 1}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {pkg.estimatedTime}
                </span>
              </div>
              <h4 className="font-bold text-base text-white">{pkg.name}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{pkg.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
                <span>ROI: {pkg.roi}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
