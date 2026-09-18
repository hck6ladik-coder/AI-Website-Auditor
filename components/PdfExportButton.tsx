"use client";

import React, { useState } from "react";
import { Download, Printer, Check } from "lucide-react";

interface PdfExportButtonProps {
  targetUrl: string;
}

export function PdfExportButton({ targetUrl }: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    setIsExporting(true);
    const originalTitle = document.title;
    try {
      const cleanUrl = targetUrl.replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9]/g, "-");
      document.title = `Audit-Report-${cleanUrl}-${new Date().toISOString().slice(0, 10)}`;
      window.print();
    } finally {
      document.title = originalTitle;
      setTimeout(() => setIsExporting(false), 1500);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      disabled={isExporting}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-blue-500/50 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 disabled:opacity-50"
      title="Uložit kompletní report do PDF nebo vytisknout"
    >
      {isExporting ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Generování...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-blue-400" />
          <span>Export do PDF</span>
        </>
      )}
    </button>
  );
}
