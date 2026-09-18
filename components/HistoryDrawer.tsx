"use client";

import React, { useState, useRef } from "react";
import { AuditReport } from "@/types/audit";
import {
  X,
  History,
  Trash2,
  Download,
  Upload,
  Search,
  ExternalLink,
  Calendar,
  Layers,
} from "lucide-react";
import { formatDate, getScoreColor } from "@/lib/utils";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AuditReport[];
  onSelectAudit: (report: AuditReport) => void;
  onDeleteAudit: (id: string) => void;
  onClearHistory: () => void;
  onImportHistory: (json: string) => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectAudit,
  onDeleteAudit,
  onClearHistory,
  onImportHistory,
}: HistoryDrawerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) =>
    item.normalizedUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `audits_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportHistory(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden history-drawer">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-lg text-white">Historie auditů</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                {history.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar & Actions */}
          <div className="p-4 border-b border-slate-800/80 space-y-3 bg-slate-950/40">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrovat podle URL..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExport}
                  disabled={history.length === 0}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-all flex items-center gap-1"
                  title="Exportovat historii do JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-1"
                  title="Importovat historii z JSON"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="px-2 py-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-all flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3 h-3" />
                  Smazat vše
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                {searchTerm ? "Žádný audit neodpovídá vyhledávání." : "Zatím jste neprovedli žádný audit. Zadejte URL adresu na hlavní stránce!"}
              </div>
            ) : (
              filteredHistory.map((item) => {
                const color = getScoreColor(item.scores.overall);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-950 transition-all group relative cursor-pointer"
                    onClick={() => {
                      onSelectAudit(item);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white truncate max-w-[200px]">
                            {item.normalizedUrl.replace(/^https?:\/\//, "")}
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{formatDate(item.timestamp)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold font-mono text-sm ${color.border} ${color.bg} ${color.text}`}
                        >
                          {item.scores.overall}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteAudit(item.id);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                          title="Smazat audit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Small category badges */}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/50 text-[10px]">
                      <span className="text-slate-400">Výkon: <strong className="text-slate-200">{item.scores.performance}</strong></span>
                      <span className="text-slate-400">• SEO: <strong className="text-slate-200">{item.scores.seo}</strong></span>
                      <span className="text-slate-400">• A11y: <strong className="text-slate-200">{item.scores.accessibility}</strong></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
