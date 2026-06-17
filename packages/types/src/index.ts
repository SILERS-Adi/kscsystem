// ============================================================
// KSCSYSTEM — Shared Types
// ============================================================

// --- Enums ---

export type UserRole = "superadmin" | "org_admin" | "member";

export type ChecklistStatus = "todo" | "in_progress" | "done" | "not_applicable";

export type DocumentStatus = "draft" | "published" | "archived";

export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export type IncidentStatus = "open" | "investigating" | "resolved" | "closed";

export type SubscriptionStatus = "active" | "trial" | "cancelled" | "expired";

export type QuizQuestionType = "single" | "multiple" | "scale";

// --- Navigation ---

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
}

// --- API ---

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// --- Dashboard ---

export interface StatCard {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
}

// --- CMS ---

export interface CmsContent {
  key: string;
  section: string;
  title: string;
  content: string;
  jsonData: Record<string, unknown> | null;
  isPublished: boolean;
}

// --- Checklist ---

export interface ChecklistItemView {
  id: string;
  code: string;
  category: string;
  title: string;
  description: string;
  priority: number;
  appliesToType: string;
  sortOrder: number;
  status?: ChecklistStatus;
  completedAt?: Date | null;
  note?: string | null;
}

// --- Audyt: scoring i etykiety ---

/** Etykiety statusów po polsku (do UI/PDF). */
export const AUDIT_STATUS_LABELS: Record<ChecklistStatus, string> = {
  done: "Mamy",
  in_progress: "Częściowo",
  todo: "Nie mamy",
  not_applicable: "Nie dotyczy",
};

/** Waga punktu wg priorytetu (1 = najważniejszy). */
export function priorityWeight(priority: number): number {
  switch (priority) {
    case 1:
      return 3;
    case 2:
      return 2;
    case 3:
      return 1;
    default:
      return 1;
  }
}

/** Wartość spełnienia statusu: mamy = 1, częściowo = 0.5, reszta = 0. */
export function statusValue(status: ChecklistStatus): number {
  if (status === "done") return 1;
  if (status === "in_progress") return 0.5;
  return 0; // todo
}

export interface ScoredAnswer {
  priority: number;
  status: ChecklistStatus;
}

export interface ReadinessResult {
  /** % ważony priorytetem (0-100) */
  readiness: number;
  /** % surowy bez wag (0-100) */
  readinessRaw: number;
  /** liczba punktów branych pod uwagę (bez "nie dotyczy") */
  itemsTotal: number;
  /** liczba punktów ze statusem "mamy" */
  itemsDone: number;
}

/**
 * Liczy gotowość zgodności na podstawie odpowiedzi audytu.
 * Punkty "nie dotyczy" są wyłączane z mianownika.
 */
export function computeReadiness(answers: ScoredAnswer[]): ReadinessResult {
  const applicable = answers.filter((a) => a.status !== "not_applicable");

  if (applicable.length === 0) {
    return { readiness: 0, readinessRaw: 0, itemsTotal: 0, itemsDone: 0 };
  }

  let weightedSum = 0;
  let weightTotal = 0;
  let rawSum = 0;

  for (const a of applicable) {
    const w = priorityWeight(a.priority);
    const v = statusValue(a.status);
    weightedSum += w * v;
    weightTotal += w;
    rawSum += v;
  }

  const round1 = (n: number) => Math.round(n * 10) / 10;

  return {
    readiness: round1((weightedSum / weightTotal) * 100),
    readinessRaw: round1((rawSum / applicable.length) * 100),
    itemsTotal: applicable.length,
    itemsDone: applicable.filter((a) => a.status === "done").length,
  };
}
