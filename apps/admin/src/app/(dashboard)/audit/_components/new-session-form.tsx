"use client";

import { useState } from "react";
import { Button } from "@kscsystem/ui";
import { createAuditSession } from "../_actions/audit-actions";

interface Org {
  id: string;
  name: string;
  nip: string | null;
}
interface Template {
  id: string;
  name: string;
  version: number;
}

export function NewSessionForm({ organizations, templates }: { organizations: Org[]; templates: Template[] }) {
  const [pending, setPending] = useState(false);

  if (organizations.length === 0) {
    return <p className="text-sm text-gray-500">Brak organizacji. Dodaj firmę w „Organizacje", aby rozpocząć audyt.</p>;
  }
  if (templates.length === 0) {
    return <p className="text-sm text-gray-500">Brak szablonu audytu. Uruchom seed: <code>npm run db:seed-audit</code>.</p>;
  }

  return (
    <form
      action={async (fd) => {
        setPending(true);
        await createAuditSession(fd);
      }}
      className="flex flex-col sm:flex-row gap-3 sm:items-end"
    >
      <div className="space-y-1 flex-1">
        <label className="text-sm font-medium text-gray-300">Organizacja</label>
        <select name="organizationId" required className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white">
          <option value="">— wybierz firmę —</option>
          {organizations.map((o) => (
            <option key={o.id} value={o.id}>{o.name}{o.nip ? ` (NIP ${o.nip})` : ""}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1 flex-1">
        <label className="text-sm font-medium text-gray-300">Szablon audytu</label>
        <select name="templateId" required defaultValue={templates[0]?.id} className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white">
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.name} (v{t.version})</option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={pending}>{pending ? "Tworzenie…" : "Rozpocznij audyt"}</Button>
    </form>
  );
}
