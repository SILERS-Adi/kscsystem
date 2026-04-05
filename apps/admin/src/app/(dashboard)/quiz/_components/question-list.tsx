"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Badge, Button } from "@kscsystem/ui";
import { toggleQuizQuestion, deleteQuizQuestion } from "../_actions/quiz-actions";
import { Trash2, Eye, EyeOff, Loader2 } from "lucide-react";

interface Question {
  id: string;
  code: string;
  text: string;
  type: string;
  category: string | null;
  sortOrder: number;
  isActive: boolean;
  options: { id: string }[];
}

function QuestionRow({ q }: { q: Question }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4 hover:bg-surface-200/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-gray-500">{q.code}</span>
          <Badge variant={q.isActive ? "default" : "muted"}>
            {q.isActive ? "Aktywne" : "Nieaktywne"}
          </Badge>
          {q.category && <Badge variant="outline">{q.category}</Badge>}
          <span className="text-xs text-gray-500">{q.options.length} opcji</span>
        </div>
        <p className="text-sm text-white truncate">{q.text}</p>
      </div>

      <div className="flex items-center gap-1">
        {isPending ? (
          <Loader2 size={16} className="animate-spin text-brand-400 mx-2" />
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              title={q.isActive ? "Dezaktywuj" : "Aktywuj"}
              onClick={() => startTransition(() => toggleQuizQuestion(q.id, !q.isActive))}
            >
              {q.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href={`/quiz/${q.id}`}>Edytuj</Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-red-400 hover:text-red-300"
              onClick={() => startTransition(() => deleteQuizQuestion(q.id))}
            >
              <Trash2 size={16} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function QuestionList({ questions }: { questions: Question[] }) {
  return (
    <div className="space-y-2">
      {questions.map((q) => (
        <QuestionRow key={q.id} q={q} />
      ))}
      {questions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">Brak pytań. Dodaj pierwsze pytanie quizu.</p>
        </div>
      )}
    </div>
  );
}
