"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Check, AlertTriangle } from "lucide-react";
import { Badge } from "@kscsystem/ui";
import {
  REMEDIATION_STATUS_LABELS,
  REMEDIATION_STATUS_ORDER,
  SEVERITY_LABELS,
  type RemediationStatus,
  type FindingSeverity,
} from "@kscsystem/types";
import { updateRemediationAction } from "../../audit/_actions/audit-actions";

export interface RemediationItem {
  id: string;
  title: string;
  description: string | null;
  severity: string | null;
  status: string;
  sectionCode: string | null;
  responsiblePerson: string | null;
  dueDate: string | null; // yyyy-mm-dd
  evidenceUrl: string | null;
  note: string | null;
  organizationName?: string;
}

const sevVariant: Record<FindingSeverity, "destructive" | "warning" | "default" | "muted"> = {
  critical: "destructive",
  high: "warning",
  medium: "default",
  low: "muted",
};

const statusStyle: Record<RemediationStatus, string> = {
  open: "bg-red-500/15 text-red-300 border-red-500/30",
  in_progress: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  done: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  deferred: "bg-surface-300 text-gray-300 border-border",
  accepted_risk: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
};

export function RemediationRow({ item, showOrg }: { item: RemediationItem; showOrg?: boolean }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(item.status);
  const [responsible, setResponsible] = useState(item.responsiblePerson ?? "");
  const [dueDate, setDueDate] = useState(item.dueDate ?? "");
  const [evidence, setEvidence] = useState(item.evidenceUrl ?? "");
  const [note, setNote] = useState(item.note ?? "");
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  const overdue =
    (status === "open" || status === "in_progress") &&
    !!item.dueDate &&
    new Date(item.dueDate) < new Date(new Date().toDateString());

  function persist(patch: Record<string, string>) {
    setSaved(false);
    start(async () => {
      await updateRemediationAction(item.id, {
        status,
        responsiblePerson: responsible,
        dueDate,
        evidenceUrl: evidence,
        note,
        ...patch,
      });
      setSaved(true);
    });
  }

  const sev = (item.severity ?? "medium") as FindingSeverity;

  return (
    <div className="rounded-lg border border-border bg-surface-50">
      <div className="flex items-start gap-3 p-3">
        <button type="button" onClick={() => setOpen((o) => !o)} className="mt-0.5 text-gray-500 shrink-0">
          <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={sevVariant[sev]}>{SEVERITY_LABELS[sev]}</Badge>
            {showOrg && item.organizationName && (
              <span className="text-xs text-gray-400">{item.organizationName}</span>
            )}
            {overdue && (
              <span className="inline-flex items-center gap-1 text-xs text-red-400">
                <AlertTriangle size={12} /> po terminie
              </span>
            )}
          </div>
          <p className="text-sm text-white mt-1">{item.title}</p>
          {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}

          {/* Statusy */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {REMEDIATION_STATUS_ORDER.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStatus(s);
                  persist({ status: s });
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  status === s ? statusStyle[s] : "bg-surface-200 text-gray-400 border-border hover:text-white"
                }`}
              >
                {REMEDIATION_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {saved && !pending && <span className="text-emerald-400 mt-1"><Check size={14} /></span>}
      </div>

      {open && (
        <div className="border-t border-border p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Odpowiedzialny</label>
            <input
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              onBlur={() => persist({})}
              className="w-full h-9 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Termin</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              onBlur={() => persist({})}
              className="w-full h-9 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs text-gray-400">Dowód wykonania (URL / opis)</label>
            <input
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              onBlur={() => persist({})}
              placeholder="np. link do zrzutu konfiguracji, ticket, notatka"
              className="w-full h-9 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs text-gray-400">Notatka</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => persist({})}
              rows={2}
              className="w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
