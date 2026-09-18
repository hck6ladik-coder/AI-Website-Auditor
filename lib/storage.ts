import { AuditReport } from "@/types/audit";

const STORAGE_KEY = "ai_website_auditor_history_v1";
const MAX_HISTORY_ITEMS = 30;

export function getAuditHistory(): AuditReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load audit history from localStorage:", e);
    return [];
  }
}

export function saveAuditToHistory(report: AuditReport): void {
  if (typeof window === "undefined") return;
  try {
    const history = getAuditHistory();
    // Remove if same ID exists already or if same URL audited recently
    const filtered = history.filter((item) => item.id !== report.id);
    const updated = [report, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save audit to history:", e);
  }
}

export function deleteAuditFromHistory(id: string): AuditReport[] {
  if (typeof window === "undefined") return [];
  try {
    const history = getAuditHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to delete audit from history:", e);
    return [];
  }
}

export function clearAuditHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear audit history:", e);
  }
}

export function exportHistoryAsJson(): string {
  const history = getAuditHistory();
  return JSON.stringify(history, null, 2);
}

export function importHistoryFromJson(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.slice(0, MAX_HISTORY_ITEMS)));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
