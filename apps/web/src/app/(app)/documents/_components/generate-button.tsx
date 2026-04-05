"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@kscsystem/ui";
import { Loader2, Plus } from "lucide-react";
import { generateDocument } from "../_actions/document-actions";

export function GenerateButton({ templateId }: { templateId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateDocument(templateId);
      if ("documentId" in result && result.documentId) {
        router.push(`/documents/${result.documentId}`);
      }
    });
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleGenerate} disabled={isPending}>
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
      Generuj
    </Button>
  );
}
