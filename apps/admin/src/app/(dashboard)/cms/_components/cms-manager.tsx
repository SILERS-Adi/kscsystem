"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, Badge, Button } from "@kscsystem/ui";
import { Plus, Pencil, Trash2, PanelLeft } from "lucide-react";
import {
  createCmsContent,
  updateCmsContent,
  toggleCmsPublished,
  deleteCmsContent,
  type CmsInput,
} from "../_actions/cms-actions";

export interface CmsView {
  id: string;
  key: string;
  section: string;
  title: string | null;
  content: string | null;
  isPublished: boolean;
}

const inputCls = "w-full h-9 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white";

function CmsForm({ initial, onClose }: { initial?: CmsView; onClose: () => void }) {
  const [f, setF] = useState<CmsInput>({
    key: initial?.key ?? "",
    section: initial?.section ?? "",
    title: initial?.title ?? "",
    content: initial?.content ?? "",
    isPublished: initial?.isPublished ?? false,
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const set = (k: keyof CmsInput, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  function save() {
    setError(null);
    start(async () => {
      const res = initial ? await updateCmsContent(initial.id, f) : await createCmsContent(f);
      if (res.error) setError(res.error);
      else onClose();
    });
  }

  return (
    <div className="rounded-lg border border-brand-500/30 bg-surface-100 p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="text-xs text-gray-400">Klucz *</label><input className={inputCls} value={f.key} onChange={(e) => set("key", e.target.value)} placeholder="np. hero_title" /></div>
        <div><label className="text-xs text-gray-400">Sekcja *</label><input className={inputCls} value={f.section} onChange={(e) => set("section", e.target.value)} placeholder="np. landing_hero" /></div>
        <div className="sm:col-span-2"><label className="text-xs text-gray-400">Tytuł</label><input className={inputCls} value={f.title} onChange={(e) => set("title", e.target.value)} /></div>
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-400">Treść</label>
          <textarea rows={4} className="w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white resize-none" value={f.content} onChange={(e) => set("content", e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" checked={f.isPublished} onChange={(e) => set("isPublished", e.target.checked)} /> Opublikowane</label>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={save} disabled={pending}>{pending ? "Zapisywanie…" : "Zapisz"}</Button>
        <Button size="sm" variant="ghost" onClick={onClose}>Anuluj</Button>
      </div>
    </div>
  );
}

export function CmsManager({ items }: { items: CmsView[] }) {
  const [mode, setMode] = useState<"new" | string | null>(null);
  const [pending, start] = useTransition();

  function remove(c: CmsView) {
    if (!confirm(`Usunąć treść „${c.key}"?`)) return;
    start(async () => {
      const res = await deleteCmsContent(c.id);
      if (res.error) alert(res.error);
    });
  }

  return (
    <div className="space-y-3">
      {mode === "new" ? (
        <CmsForm onClose={() => setMode(null)} />
      ) : (
        <Button size="sm" onClick={() => setMode("new")}><Plus size={16} /> Dodaj treść</Button>
      )}

      {items.length === 0 && mode !== "new" && (
        <Card><CardContent><p className="py-6 text-center text-sm text-gray-500">Brak treści.</p></CardContent></Card>
      )}

      {items.map((c) =>
        mode === c.id ? (
          <CmsForm key={c.id} initial={c} onClose={() => setMode(null)} />
        ) : (
          <div key={c.id} className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-200 text-gray-500 shrink-0"><PanelLeft size={16} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{c.title ?? c.key}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-gray-500">{c.key}</span>
                <Badge variant="muted">{c.section}</Badge>
              </div>
            </div>
            <button onClick={() => start(async () => { await toggleCmsPublished(c.id, !c.isPublished); })} disabled={pending} title="Przełącz publikację">
              <Badge variant={c.isPublished ? "default" : "warning"}>{c.isPublished ? "Opublikowane" : "Szkic"}</Badge>
            </button>
            <button onClick={() => setMode(c.id)} className="p-1.5 text-gray-400 hover:text-white" title="Edytuj"><Pencil size={15} /></button>
            <button onClick={() => remove(c)} disabled={pending} className="p-1.5 text-gray-400 hover:text-red-400 disabled:opacity-50" title="Usuń"><Trash2 size={15} /></button>
          </div>
        )
      )}
    </div>
  );
}
