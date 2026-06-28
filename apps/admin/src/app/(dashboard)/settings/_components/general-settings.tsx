"use client";

import { useState, useTransition } from "react";
import { Button, Input } from "@kscsystem/ui";
import { Check } from "lucide-react";
import { saveSettings } from "../_actions/settings-actions";

export function GeneralSettings({ initial }: { initial: Record<string, string> }) {
  const [systemName, setSystemName] = useState(initial.system_name ?? "KSCSYSTEM");
  const [contactEmail, setContactEmail] = useState(initial.contact_email ?? "biuro@silers.pl");
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  function save() {
    setSaved(false);
    start(async () => {
      await saveSettings({ system_name: systemName.trim(), contact_email: contactEmail.trim() });
      setSaved(true);
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Nazwa systemu</label>
        <Input value={systemName} onChange={(e) => setSystemName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Email kontaktowy</label>
        <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={save} disabled={pending}>{pending ? "Zapisywanie…" : "Zapisz zmiany"}</Button>
        {saved && !pending && <span className="inline-flex items-center gap-1 text-xs text-emerald-400"><Check size={14} /> Zapisano</span>}
      </div>
    </div>
  );
}
