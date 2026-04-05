"use client";

import { useTransition } from "react";
import { Button } from "@kscsystem/ui";
import { CheckCircle2, Archive, Loader2 } from "lucide-react";
import { updateDocumentStatus } from "../_actions/document-actions";

export function DocumentStatusButtons({ docId, currentStatus }: { docId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  function setStatus(status: "draft" | "published" | "archived") {
    startTransition(() => updateDocumentStatus(docId, status));
  }

  return (
    <div className="flex items-center gap-2">
      {isPending && <Loader2 size={16} className="animate-spin text-brand-400" />}

      {currentStatus === "draft" && (
        <Button variant="accent" size="sm" onClick={() => setStatus("published")} disabled={isPending}>
          <CheckCircle2 size={14} />
          Opublikuj
        </Button>
      )}
      {currentStatus === "published" && (
        <Button variant="secondary" size="sm" onClick={() => setStatus("archived")} disabled={isPending}>
          <Archive size={14} />
          Archiwizuj
        </Button>
      )}
      {currentStatus === "archived" && (
        <Button variant="secondary" size="sm" onClick={() => setStatus("draft")} disabled={isPending}>
          Przywróć jako szkic
        </Button>
      )}
    </div>
  );
}
