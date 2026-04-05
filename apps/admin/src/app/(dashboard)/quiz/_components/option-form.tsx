"use client";

import { useRef } from "react";
import { Button, Input } from "@kscsystem/ui";
import { createQuizOption, updateQuizOption } from "../_actions/quiz-actions";

interface OptionFormProps {
  questionId: string;
  option?: {
    id: string;
    text: string;
    value: string;
    weight: number;
    sortOrder: number;
  };
  onDone?: () => void;
}

export function OptionForm({ questionId, option, onDone }: OptionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    if (option) {
      await updateQuizOption(option.id, formData);
    } else {
      formData.set("questionId", questionId);
      await createQuizOption(formData);
    }
    formRef.current?.reset();
    onDone?.();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1 space-y-1">
        <label className="text-xs text-gray-400">Tekst odpowiedzi</label>
        <Input name="text" defaultValue={option?.text} placeholder="Tekst opcji" required />
      </div>
      <div className="w-32 space-y-1">
        <label className="text-xs text-gray-400">Wartość (key)</label>
        <Input name="value" defaultValue={option?.value} placeholder="energy" required />
      </div>
      <div className="w-24 space-y-1">
        <label className="text-xs text-gray-400">Waga</label>
        <Input name="weight" type="number" step="0.1" defaultValue={option?.weight ?? 0} />
      </div>
      <div className="w-20 space-y-1">
        <label className="text-xs text-gray-400">Kolejność</label>
        <Input name="sortOrder" type="number" defaultValue={option?.sortOrder ?? 0} />
      </div>
      <Button type="submit" size="sm">{option ? "Zapisz" : "Dodaj"}</Button>
      {onDone && (
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>Anuluj</Button>
      )}
    </form>
  );
}
