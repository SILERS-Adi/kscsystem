"use client";

import { useTransition } from "react";
import { Badge } from "@kscsystem/ui";
import { AlertTriangle, ShieldCheck, Clock } from "lucide-react";
import {
  INCIDENT_SEVERITY_LABELS,
  INCIDENT_STATUS_LABELS,
  csirtDeadlineStatus,
  KSC_EARLY_WARNING_HOURS,
  type IncidentSeverity,
  type IncidentStatus,
} from "@kscsystem/types";
import { updateIncidentStatus, markCsirtReported } from "../_actions/incident-actions";

export interface IncidentView {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  detectedAt: string | null;
  createdAt: string;
  csirtReportedAt: string | null;
  reportedByName: string | null;
  reportedByEmail: string | null;
}

const sevVariant: Record<IncidentSeverity, "destructive" | "warning" | "default" | "muted"> = {
  critical: "destructive",
  high: "destructive",
  medium: "warning",
  low: "muted",
};
const statusVariant: Record<IncidentStatus, "destructive" | "warning" | "default" | "muted"> = {
  open: "destructive",
  investigating: "warning",
  resolved: "default",
  closed: "muted",
};
const STATUSES: IncidentStatus[] = ["open", "investigating", "resolved", "closed"];

function fmt(iso: string): string {
  return new Date(iso).toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });
}

export function IncidentRow({ inc }: { inc: IncidentView }) {
  const [pending, start] = useTransition();
  const sev = (inc.severity ?? "medium") as IncidentSeverity;
  const status = inc.status as IncidentStatus;
  const active = status === "open" || status === "investigating";
  const basis = new Date(inc.detectedAt ?? inc.createdAt);
  const dl = csirtDeadlineStatus(basis, KSC_EARLY_WARNING_HOURS);
  const absH = Math.abs(Math.round(dl.hoursLeft));

  return (
    <div className="rounded-lg border border-border bg-surface-50 p-4">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400 shrink-0">
          <AlertTriangle size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{inc.title}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{inc.description}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-xs text-gray-500">{inc.reportedByName ?? inc.reportedByEmail ?? "—"}</span>
            <span className="text-xs text-gray-500">· wykryto {fmt(inc.detectedAt ?? inc.createdAt)}</span>
          </div>

          {/* Termin zgłoszenia do CSIRT (24h) */}
          <div className="mt-2">
            {inc.csirtReportedAt ? (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                <ShieldCheck size={13} /> Zgłoszono do CSIRT · {fmt(inc.csirtReportedAt)}
              </span>
            ) : active ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-xs ${dl.overdue ? "text-red-400" : "text-amber-400"}`}>
                  <Clock size={13} />
                  CSIRT 24h: {dl.overdue ? `po terminie o ${absH} h` : `zostało ${absH} h`}
                </span>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => start(async () => { await markCsirtReported(inc.id); })}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium border border-brand-500/40 bg-brand-500/10 text-brand-300 hover:bg-brand-500/20 disabled:opacity-60"
                >
                  Oznacz: zgłoszono do CSIRT
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <Badge variant={sevVariant[sev]}>{INCIDENT_SEVERITY_LABELS[sev]}</Badge>
          <Badge variant={statusVariant[status]}>{INCIDENT_STATUS_LABELS[status]}</Badge>
        </div>
      </div>

      {/* Zmiana statusu */}
      <div className="flex flex-wrap gap-1.5 mt-3 pl-14">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            disabled={pending || s === status}
            onClick={() => start(async () => { await updateIncidentStatus(inc.id, s); })}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors disabled:opacity-50 ${
              s === status
                ? "bg-surface-300 text-white border-border"
                : "bg-surface-200 text-gray-400 border-border hover:text-white"
            }`}
          >
            {INCIDENT_STATUS_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
