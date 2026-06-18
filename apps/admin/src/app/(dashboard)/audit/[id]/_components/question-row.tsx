"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { AuditAnswerStatus } from "@kscsystem/types";
import { saveAuditAnswer, type AnswerInput } from "../../_actions/audit-actions";

interface Question {
  id: string;
  text: string;
  helpText: string | null;
  inputType: string;
  severity: string;
}
interface Answer {
  status: AuditAnswerStatus | null;
  valueText: string | null;
  note: string | null;
  responsiblePerson: string | null;
  dueDate: string | null;
}

const STATUS_OPTS: { value: AuditAnswerStatus; label: string; active: string }[] = [
  { value: "yes", label: "Posiada", active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  { value: "partial", label: "Częściowo", active: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  { value: "no", label: "Brak", active: "bg-red-500/20 text-red-300 border-red-500/40" },
  { value: "not_applicable", label: "Nie dotyczy", active: "bg-surface-300 text-gray-300 border-border" },
];

export function QuestionRow({
  sessionId,
  question,
  answer,
  readOnly,
}: {
  sessionId: string;
  question: Question;
  answer: Answer | undefined;
  readOnly: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<AuditAnswerStatus | null>(answer?.status ?? null);
  const [valueText, setValueText] = useState(answer?.valueText ?? "");
  const [note, setNote] = useState(answer?.note ?? "");
  const [responsible, setResponsible] = useState(answer?.responsiblePerson ?? "");
  const [dueDate, setDueDate] = useState(answer?.dueDate ?? "");
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  const isStatus = question.inputType === "status";

  function persist(patch?: Partial<AnswerInput>) {
    if (readOnly) return;
    setSaved(false);
    start(async () => {
      await saveAuditAnswer(sessionId, question.id, {
        status,
        valueText,
        note,
        responsiblePerson: responsible,
        dueDate,
        ...patch,
      });
      setSaved(true);
    });
  }

  return (
    <div className="rounded-lg border border-border bg-surface-50">
      <div className="flex items-start gap-3 p-3">
        <button type="button" onClick={() => setOpen((o) => !o)} className="mt-0.5 text-gray-500 shrink-0">
          <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white">{question.text}</p>
          {question.helpText && <p className="text-xs text-gray-500 mt-0.5">{question.helpText}</p>}

          {isStatus ? (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {STATUS_OPTS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  disabled={readOnly}
                  onClick={() => {
                    setStatus(o.value);
                    persist({ status: o.value });
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors disabled:opacity-60 ${
                    status === o.value ? o.active : "bg-surface-200 text-gray-400 border-border hover:text-white"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          ) : (
            <input
              type={question.inputType === "number" ? "number" : "text"}
              value={valueText}
              disabled={readOnly}
              onChange={(e) => setValueText(e.target.value)}
              onBlur={() => persist()}
              placeholder="Wpisz wartość…"
              className="mt-2 h-9 w-full max-w-xs rounded-lg border border-border bg-surface-200 px-3 text-sm text-white"
            />
          )}
        </div>
        {saved && !pending && <span className="text-emerald-400 mt-1"><Check size={14} /></span>}
      </div>

      {open && !readOnly && (
        <div className="border-t border-border p-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-3 space-y-1">
            <label className="text-xs text-gray-400">Notatka</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => persist()} rows={2}
              className="w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Odpowiedzialny</label>
            <input value={responsible} onChange={(e) => setResponsible(e.target.value)} onBlur={() => persist()}
              className="w-full h-9 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Termin</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} onBlur={() => persist()}
              className="w-full h-9 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white" />
          </div>
        </div>
      )}

      {open && readOnly && (
        <div className="border-t border-border p-3 text-sm space-y-1">
          <p className="text-gray-300"><span className="text-gray-500">Notatka:</span> {note || "—"}</p>
          <p className="text-gray-300"><span className="text-gray-500">Odpowiedzialny:</span> {responsible || "—"}</p>
          <p className="text-gray-300"><span className="text-gray-500">Termin:</span> {dueDate || "—"}</p>
        </div>
      )}
    </div>
  );
}
