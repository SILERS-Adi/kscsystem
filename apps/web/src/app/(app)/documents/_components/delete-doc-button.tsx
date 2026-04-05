"use client";

import { useTransition } from "react";
import { Button } from "@kscsystem/ui";
import { Trash2, Loader2 } from "lucide-react";
import { deleteDocument } from "../_actions/document-actions";

export function DeleteDocButton({ docId }: { docId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-red-400 hover:text-red-300"
      disabled={isPending}
      onClick={() => startTransition(() => deleteDocument(docId))}
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </Button>
  );
}
