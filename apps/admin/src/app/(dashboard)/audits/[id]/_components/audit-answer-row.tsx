"use client";

import { useState, useTransition } from "react";
import { Badge } from "@kscsystem/ui";
import { Check, ChevronDown } from "lucide-react";
import { AUDIT_STATUS_LABELS, type ChecklistStatus } from "@kscsystem/types";
import { saveAuditAnswer } from "../../_actions/audit-actions";

interface AnswerData {
  id: string;
  status: ChecklistStatus;
  note: string | null;
  evidenceUrl: string | null;
  responsibleName: string | null;
  dueDate: string | null; // yyyy-mm-dd
}

interface ItemData {
  code: string;
  title: string;
  description: string;
  category: string;
  priority: number;
}

const statusBadge: Record<ChecklistStatus, "default" | "warning" | "destructive" | "muted"> = {
  done: "default",
  in_progress: "warning",
  todo: "destructive",
  not_applicable: "muted",
};

const priorityLabels: Record<number, string> = { 1: "Krytyczny", 2: "Wysoki", 3: "Średni" };

export function AuditAnswerRow({
  answer,
  item,
  readOnly,
}: {
  answer: AnswerData;
  item: ItemData;
  readOnly: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ChecklistStatus>(answer.status);
  const [note, setNote] = useState(answer.note ?? "");
  const [evidenceUrl, setEvidenceUrl] = useState(answer.evidenceUrl ?? "");
  const [responsibleName, setResponsibleName] = useState(answer.responsibleName ?? "");
  const [dueDate, setDueDate] = useState(answer.dueDate ?? "");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function persist(next?: Partial<AnswerData>) {
    if (readOnly) return;
    setSaved(false);
    startTransition(async () => {
      await saveAuditAnswer(answer.id, {
        status: next?.status ?? status,
        note,
        evidenceUrl,
        responsibleName,
        dueDate,
      });
      setSaved(true);
    });
  }

  return (
    <div className="rounded-lg border border-border bg-surface-50">
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-3 min-w-0 text-left"
        >
          <ChevronDown
            size={16}
            className={`shrink-0 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-500">{item.code}</span>
              <Badge variant="outline">{item.category}</Badge>
              <span className="text-[10px] text-gray-500">{priorityLabels[item.priority] ?? `P${item.priority}`}</span>
            </div>
            <p className="text-sm font-medium text-white truncate">{item.title}</p>
          </div>
        </button>

        {readOnly ? (
          <Badge variant={statusBadge[status]}>{AUDIT_STATUS_LABELS[status]}</Badge>
        ) : (
          <select
            value={status}
            onChange={(e) => {
              const v = e.target.value as ChecklistStatus;
              setStatus(v);
              persist({ status: v });
            }}
            className="h-9 rounded-lg border border-border bg-surface-200 px-2 text-sm text-white"
          >
            <option value="done">Mamy</option>
            <option value="in_progress">Częściowo</option>
            <option value="todo">Nie mamy</option>
            <option value="not_applicable">Nie dotyczy</option>
          </select>
        )}
      </div>

      {open && (
        <div className="border-t border-border p-4 space-y-3">
          <p className="text-xs text-gray-400">{item.description}</p>

          {readOnly ? (
            <div className="grid gap-2 text-sm">
              <p className="text-gray-300"><span className="text-gray-500">Notatka:</span> {note || "—"}</p>
              <p className="text-gray-300"><span className="text-gray-500">Dowód:</span> {evidenceUrl || "—"}</p>
              <p className="text-gray-300"><span className="text-gray-500">Odpowiedzialny:</span> {responsibleName || "—"}</p>
              <p className="text-gray-300"><span className="text-gray-500">Termin:</span> {dueDate || "—"}</p>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">Notatka / uzasadnienie</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Dowód (link)</label>
                  <input
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder="np. link do polityki"
                    className="w-full h-9 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Odpowiedzialny</label>
                  <input
                    value={responsibleName}
                    onChange={(e) => setResponsibleName(e.target.value)}
                    placeholder="np. Jan Kowalski"
                    className="w-full h-9 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Termin</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => persist()}
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 px-3 py-1.5 text-sm font-medium hover:bg-brand-500/20 transition-colors disabled:opacity-50"
                >
                  {pending ? "Zapisywanie…" : "Zapisz szczegóły"}
                </button>
                {saved && !pending && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                    <Check size={14} /> Zapisano
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
