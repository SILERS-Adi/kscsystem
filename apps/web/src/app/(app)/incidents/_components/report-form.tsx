"use client";

import { useState, useTransition } from "react";
import { Button } from "@kscsystem/ui";
import { Plus, X } from "lucide-react";
import { INCIDENT_SEVERITY_LABELS, type IncidentSeverity } from "@kscsystem/types";
import { createIncident } from "../_actions/incident-actions";

const SEVERITIES: IncidentSeverity[] = ["low", "medium", "high", "critical"];

export function ReportForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<IncidentSeverity>("medium");
  const [detectedAt, setDetectedAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit() {
    setError(null);
    start(async () => {
      const res = await createIncident({ title, description, severity, detectedAt: detectedAt || undefined });
      if (res.error) {
        setError(res.error);
        return;
      }
      setTitle("");
      setDescription("");
      setSeverity("medium");
      setDetectedAt("");
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus size={16} /> Zgłoś incydent
      </Button>
    );
  }

  return (
    <div className="w-full rounded-xl border border-border bg-surface-50 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Nowy incydent</h3>
        <button type="button" onClick={() => setOpen(false)} className="text-gray-500 hover:text-white">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Tytuł *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="np. Próba phishingu — dział HR"
            className="w-full h-10 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400">Opis *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Co się stało, jakie systemy/dane, podjęte działania…"
            className="w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Istotność</label>
            <div className="flex flex-wrap gap-1.5">
              {SEVERITIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    severity === s
                      ? "bg-brand-500/15 text-brand-300 border-brand-500/40"
                      : "bg-surface-200 text-gray-400 border-border hover:text-white"
                  }`}
                >
                  {INCIDENT_SEVERITY_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Wykryto (start zegara 24h/72h)</label>
            <input
              type="datetime-local"
              value={detectedAt}
              onChange={(e) => setDetectedAt(e.target.value)}
              className="w-full h-10 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white"
            />
            <p className="text-[11px] text-gray-500">Puste = teraz.</p>
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex items-center gap-2 pt-1">
          <Button size="sm" onClick={submit} disabled={pending}>
            {pending ? "Zapisywanie…" : "Zgłoś incydent"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Anuluj</Button>
        </div>
      </div>
    </div>
  );
}
