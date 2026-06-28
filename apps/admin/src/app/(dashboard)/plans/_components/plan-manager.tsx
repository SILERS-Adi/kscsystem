"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@kscsystem/ui";
import { Plus, Check, Pencil, Trash2 } from "lucide-react";
import {
  createPlan,
  updatePlan,
  togglePlanActive,
  deletePlan,
  type PlanInput,
} from "../_actions/plan-actions";

export interface PlanView {
  id: string;
  name: string;
  code: string;
  description: string | null;
  priceMonthly: number;
  priceYearly: number | null;
  maxUsers: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

const inputCls = "w-full h-9 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white";

function PlanForm({ initial, onClose }: { initial?: PlanView; onClose: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [pcode, setPcode] = useState(initial?.code ?? "");
  const [desc, setDesc] = useState(initial?.description ?? "");
  const [pm, setPm] = useState(String(initial?.priceMonthly ?? ""));
  const [py, setPy] = useState(initial?.priceYearly != null ? String(initial.priceYearly) : "");
  const [mu, setMu] = useState(String(initial?.maxUsers ?? 1));
  const [so, setSo] = useState(String(initial?.sortOrder ?? 0));
  const [feat, setFeat] = useState((initial?.features ?? []).join("\n"));
  const [active, setActive] = useState(initial?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function save() {
    setError(null);
    const input: PlanInput = {
      name,
      code: pcode,
      description: desc,
      priceMonthly: Number(pm),
      priceYearly: py.trim() ? Number(py) : null,
      maxUsers: Number(mu),
      features: feat.split("\n"),
      isActive: active,
      sortOrder: Number(so),
    };
    start(async () => {
      const res = initial ? await updatePlan(initial.id, input) : await createPlan(input);
      if (res.error) setError(res.error);
      else onClose();
    });
  }

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 pt-4">
          <div className="col-span-2"><label className="text-xs text-gray-400">Nazwa *</label><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="text-xs text-gray-400">Kod *</label><input className={inputCls} value={pcode} onChange={(e) => setPcode(e.target.value)} placeholder="np. starter" /></div>
          <div><label className="text-xs text-gray-400">Max użytkowników</label><input type="number" className={inputCls} value={mu} onChange={(e) => setMu(e.target.value)} /></div>
          <div><label className="text-xs text-gray-400">Cena/mies. (PLN)</label><input type="number" className={inputCls} value={pm} onChange={(e) => setPm(e.target.value)} /></div>
          <div><label className="text-xs text-gray-400">Cena/rok (PLN)</label><input type="number" className={inputCls} value={py} onChange={(e) => setPy(e.target.value)} /></div>
          <div><label className="text-xs text-gray-400">Kolejność</label><input type="number" className={inputCls} value={so} onChange={(e) => setSo(e.target.value)} /></div>
          <label className="flex items-center gap-2 mt-5 text-sm text-gray-300"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Aktywny</label>
          <div className="col-span-2"><label className="text-xs text-gray-400">Opis</label><input className={inputCls} value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
          <div className="col-span-2">
            <label className="text-xs text-gray-400">Cechy (jedna na linię)</label>
            <textarea rows={5} className="w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white resize-none" value={feat} onChange={(e) => setFeat(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        <div className="flex items-center gap-2 mt-3">
          <Button size="sm" onClick={save} disabled={pending}>{pending ? "Zapisywanie…" : "Zapisz"}</Button>
          <Button size="sm" variant="ghost" onClick={onClose}>Anuluj</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PlanManager({ plans }: { plans: PlanView[] }) {
  const [mode, setMode] = useState<"new" | string | null>(null);
  const [pending, start] = useTransition();

  function remove(p: PlanView) {
    if (!confirm(`Usunąć plan „${p.name}"?`)) return;
    start(async () => {
      const res = await deletePlan(p.id);
      if (res.error) alert(res.error);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        {mode === "new" ? (
          <PlanForm onClose={() => setMode(null)} />
        ) : (
          <Button size="sm" onClick={() => setMode("new")}><Plus size={16} /> Dodaj plan</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) =>
          mode === p.id ? (
            <div key={p.id} className="md:col-span-3"><PlanForm initial={p} onClose={() => setMode(null)} /></div>
          ) : (
            <Card key={p.id} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{p.name}</CardTitle>
                  <button onClick={() => start(async () => { await togglePlanActive(p.id, !p.isActive); })} disabled={pending} title="Przełącz">
                    <Badge variant={p.isActive ? "default" : "muted"}>{p.isActive ? "Aktywny" : "Nieaktywny"}</Badge>
                  </button>
                </div>
                <p className="text-xs text-gray-500">kod: {p.code}</p>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">{p.priceMonthly}</span>
                  <span className="text-gray-400"> PLN/mies.</span>
                  <p className="text-xs text-gray-500 mt-1">
                    {p.priceYearly != null ? `lub ${p.priceYearly} PLN/rok · ` : ""}do {p.maxUsers} użytkowników
                  </p>
                </div>
                <ul className="space-y-2">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={14} className="text-accent-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-6">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => setMode(p.id)}><Pencil size={14} /> Edytuj</Button>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={() => remove(p)} disabled={pending}><Trash2 size={14} /></Button>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
