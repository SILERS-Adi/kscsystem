"use client";

import { useState } from "react";
import { Button } from "@kscsystem/ui";
import { runSelfAudit } from "../_actions/audit-actions";

export function RunAuditButton() {
  const [pending, setPending] = useState(false);
  return (
    <form
      action={async () => {
        setPending(true);
        await runSelfAudit();
        setPending(false);
      }}
    >
      <Button type="submit" disabled={pending}>
        {pending ? "Zapisywanie…" : "Wykonaj samoocenę (migawka)"}
      </Button>
    </form>
  );
}
