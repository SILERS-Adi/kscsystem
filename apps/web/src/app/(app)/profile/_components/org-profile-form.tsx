"use client";

import { useState, useTransition } from "react";
import { Button, Input } from "@kscsystem/ui";
import { Check } from "lucide-react";
import { updateMyOrg, type OrgProfileInput } from "../_actions/profile-actions";

const sizeOptions = [
  { v: "", l: "—" },
  { v: "micro", l: "Mikro (<50)" },
  { v: "small", l: "Mała (<50)" },
  { v: "medium", l: "Średnia (50–249)" },
  { v: "large", l: "Duża (250+)" },
];

export function OrgProfileForm({ initial }: { initial: OrgProfileInput }) {
  const [f, setF] = useState<OrgProfileInput>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const set = (k: keyof OrgProfileInput, v: string) => setF((p) => ({ ...p, [k]: v }));

  function save() {
    setError(null);
    setSaved(false);
    start(async () => {
      const res = await updateMyOrg(f);
      if (res.error) setError(res.error);
      else setSaved(true);
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Nazwa firmy</label>
          <Input value={f.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">NIP</label>
          <Input value={f.nip ?? ""} onChange={(e) => set("nip", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Sektor</label>
          <Input value={f.sector ?? ""} onChange={(e) => set("sector", e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Wielkość</label>
          <select
            value={f.size ?? ""}
            onChange={(e) => set("size", e.target.value)}
            className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white"
          >
            {sizeOptions.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Strona www</label>
        <Input value={f.website ?? ""} onChange={(e) => set("website", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Telefon</label>
          <Input value={f.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Adres</label>
          <Input value={f.address ?? ""} onChange={(e) => set("address", e.target.value)} />
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={save} disabled={pending}>{pending ? "Zapisywanie…" : "Zapisz zmiany"}</Button>
        {saved && !pending && <span className="inline-flex items-center gap-1 text-xs text-emerald-400"><Check size={14} /> Zapisano</span>}
      </div>
    </div>
  );
}
