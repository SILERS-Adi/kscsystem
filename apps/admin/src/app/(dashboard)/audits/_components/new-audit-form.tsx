"use client";

import { useState } from "react";
import { Button } from "@kscsystem/ui";
import { createAudit } from "../_actions/audit-actions";

interface Org {
  id: string;
  name: string;
  nip: string | null;
  type: string;
}

export function NewAuditForm({ organizations }: { organizations: Org[] }) {
  const [pending, setPending] = useState(false);

  if (organizations.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Brak organizacji w bazie. Dodaj firmę w zakładce „Organizacje", aby przeprowadzić audyt.
      </p>
    );
  }

  return (
    <form
      action={async (fd) => {
        setPending(true);
        await createAudit(fd);
      }}
      className="flex flex-col sm:flex-row gap-3 sm:items-end"
    >
      <div className="space-y-1 flex-1">
        <label className="text-sm font-medium text-gray-300">Organizacja</label>
        <select
          name="organizationId"
          required
          className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white"
        >
          <option value="">— wybierz firmę —</option>
          {organizations.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
              {o.nip ? ` (NIP ${o.nip})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">Typ audytu</label>
        <select
          name="conductedByType"
          defaultValue="consultant"
          className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white"
        >
          <option value="consultant">Konsultant</option>
          <option value="self">Samoocena klienta</option>
        </select>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Tworzenie…" : "Rozpocznij audyt"}
      </Button>
    </form>
  );
}
