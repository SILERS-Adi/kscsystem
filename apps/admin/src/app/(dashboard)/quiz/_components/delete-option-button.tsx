"use client";

import { useTransition } from "react";
import { Button } from "@kscsystem/ui";
import { Trash2, Loader2 } from "lucide-react";
import { deleteQuizOption } from "../_actions/quiz-actions";

export function DeleteOptionButton({ optionId }: { optionId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-red-400 hover:text-red-300"
      disabled={isPending}
      onClick={() => startTransition(() => deleteQuizOption(optionId))}
    >
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </Button>
  );
}
