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
