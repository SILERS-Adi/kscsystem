"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, Badge, Button } from "@kscsystem/ui";
import { Plus, Pencil, Trash2, X, Building2 } from "lucide-react";
import {
  createOrganization,
  updateOrganization,
  deleteOrganization,
  type OrgInput,
} from "../_actions/organization-actions";

export interface OrgView {
  id: string;
  name: string;
  nip: string | null;
  sector: string | null;
  size: string | null;
  type: string;
  website: string | null;
  phone: string | null;
  address: string | null;
  users: number;
  audits: number;
  plan: string | null;
}

const typeVariant: Record<string, "destructive" | "warning" | "muted"> = {
  essential: "destructive",
  important: "warning",
  unknown: "muted",
};
const typeLabel: Record<string, string> = {
  essential: "Podmiot kluczowy",
  important: "Podmiot ważny",
  unknown: "Nieokreślony",
};

const inputCls = "w-full h-9 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white";

function OrgForm({ initial, onClose }: { initial?: OrgView; onClose: () => void }) {
  const [f, setF] = useState<OrgInput>({
    name: initial?.name ?? "",
    nip: initial?.nip ?? "",
    sector: initial?.sector ?? "",
    size: initial?.size ?? "",
    type: initial?.type ?? "unknown",
    website: initial?.website ?? "",
    phone: initial?.phone ?? "",
    address: initial?.address ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const set = (k: keyof OrgInput, v: string) => setF((p) => ({ ...p, [k]: v }));

  function save() {
    setError(null);
    start(async () => {
      const res = initial ? await updateOrganization(initial.id, f) : await createOrganization(f);
      if (res.error) setError(res.error);
      else onClose();
    });
  }

  return (
    <div className="rounded-lg border border-brand-500/30 bg-surface-100 p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="text-xs text-gray-400">Nazwa *</label><input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div><label className="text-xs text-gray-400">NIP</label><input className={inputCls} value={f.nip} onChange={(e) => set("nip", e.target.value)} /></div>
        <div><label className="text-xs text-gray-400">Sektor / branża</label><input className={inputCls} value={f.sector} onChange={(e) => set("sector", e.target.value)} /></div>
        <div>
          <label className="text-xs text-gray-400">Klasyfikacja</label>
          <select className={inputCls} value={f.type} onChange={(e) => set("type", e.target.value)}>
            <option value="unknown">Nieokreślony</option>
            <option value="essential">Podmiot kluczowy</option>
            <option value="important">Podmiot ważny</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400">Wielkość</label>
          <select className={inputCls} value={f.size} onChange={(e) => set("size", e.target.value)}>
            <option value="">—</option>
            <option value="micro">Mikro</option>
            <option value="small">Mała</option>
            <option value="medium">Średnia</option>
            <option value="large">Duża</option>
          </select>
        </div>
        <div><label className="text-xs text-gray-400">WWW</label><input className={inputCls} value={f.website} onChange={(e) => set("website", e.target.value)} /></div>
        <div><label className="text-xs text-gray-400">Telefon</label><input className={inputCls} value={f.phone} onChange={(e) => set("phone", e.target.value)} /></div>
        <div><label className="text-xs text-gray-400">Adres</label><input className={inputCls} value={f.address} onChange={(e) => set("address", e.target.value)} /></div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={save} disabled={pending}>{pending ? "Zapisywanie…" : "Zapisz"}</Button>
        <Button size="sm" variant="ghost" onClick={onClose}>Anuluj</Button>
      </div>
    </div>
  );
}

export function OrgManager({ orgs }: { orgs: OrgView[] }) {
  const [mode, setMode] = useState<"new" | string | null>(null);
  const [pending, start] = useTransition();

  function remove(o: OrgView) {
    if (!confirm(`Usunąć organizację „${o.name}"? Tej operacji nie można cofnąć.`)) return;
    start(async () => {
      const res = await deleteOrganization(o.id);
      if (res.error) alert(res.error);
    });
  }

  return (
    <div className="space-y-3">
      {mode === "new" ? (
        <OrgForm onClose={() => setMode(null)} />
      ) : (
        <Button size="sm" onClick={() => setMode("new")}><Plus size={16} /> Dodaj organizację</Button>
      )}

      {orgs.length === 0 && mode !== "new" && (
        <Card><CardContent><p className="py-6 text-center text-sm text-gray-500">Brak organizacji. Dodaj pierwszą.</p></CardContent></Card>
      )}

      {orgs.map((o) =>
        mode === o.id ? (
          <OrgForm key={o.id} initial={o} onClose={() => setMode(null)} />
        ) : (
          <div key={o.id} className="rounded-lg border border-border bg-surface-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 shrink-0"><Building2 size={18} /></div>
                <div className="min-w-0">
                  <p className="font-medium text-white">{o.name}</p>
                  <p className="text-xs text-gray-500">
                    NIP: {o.nip ?? "—"} · {o.sector ?? "—"} · {o.users} użytk. · {o.audits} audyt(ów)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={typeVariant[o.type] ?? "muted"}>{typeLabel[o.type] ?? o.type}</Badge>
                {o.plan && <Badge variant="default">{o.plan}</Badge>}
                <button onClick={() => setMode(o.id)} className="p-1.5 text-gray-400 hover:text-white" title="Edytuj"><Pencil size={15} /></button>
                <button onClick={() => remove(o)} disabled={pending} className="p-1.5 text-gray-400 hover:text-red-400 disabled:opacity-50" title="Usuń"><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
