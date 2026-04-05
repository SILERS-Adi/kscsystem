"use client";

import { useRef } from "react";
import { Button, Input } from "@kscsystem/ui";
import { createQuizQuestion, updateQuizQuestion } from "../_actions/quiz-actions";

interface QuestionFormProps {
  question?: {
    id: string;
    code: string;
    text: string;
    description: string | null;
    type: string;
    category: string | null;
    sortOrder: number;
    isActive: boolean;
  };
  onDone?: () => void;
}

export function QuestionForm({ question, onDone }: QuestionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    if (question) {
      await updateQuizQuestion(question.id, formData);
    } else {
      await createQuizQuestion(formData);
    }
    formRef.current?.reset();
    onDone?.();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Kod</label>
          <Input name="code" defaultValue={question?.code} placeholder="Q001" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Kategoria</label>
          <Input name="category" defaultValue={question?.category ?? ""} placeholder="Sektor" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">Treść pytania</label>
        <Input name="text" defaultValue={question?.text} placeholder="Treść pytania..." required />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">Opis (opcjonalnie)</label>
        <Input name="description" defaultValue={question?.description ?? ""} placeholder="Dodatkowy opis..." />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Typ</label>
          <select
            name="type"
            defaultValue={question?.type ?? "single"}
            className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white"
          >
            <option value="single">Jednokrotny wybór</option>
            <option value="multiple">Wielokrotny wybór</option>
            <option value="scale">Skala</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Kolejność</label>
          <Input name="sortOrder" type="number" defaultValue={question?.sortOrder ?? 0} />
        </div>
        {question && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Aktywne</label>
            <select
              name="isActive"
              defaultValue={question.isActive ? "true" : "false"}
              className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white"
            >
              <option value="true">Tak</option>
              <option value="false">Nie</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit">{question ? "Zapisz zmiany" : "Dodaj pytanie"}</Button>
        {onDone && (
          <Button type="button" variant="ghost" onClick={onDone}>Anuluj</Button>
        )}
      </div>
    </form>
  );
}
