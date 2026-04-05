"use client";

import { useRef } from "react";
import { Button, Input } from "@kscsystem/ui";
import { createChecklistItem, updateChecklistItem } from "../_actions/checklist-actions";

interface ChecklistItemData {
  id: string;
  code: string;
  category: string;
  title: string;
  description: string;
  priority: number;
  appliesToType: string;
  sortOrder: number;
  isActive: boolean;
}

export function ChecklistForm({ item, onDone }: { item?: ChecklistItemData; onDone?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    if (item) {
      await updateChecklistItem(item.id, formData);
    } else {
      await createChecklistItem(formData);
    }
    formRef.current?.reset();
    onDone?.();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Kod</label>
          <Input name="code" defaultValue={item?.code} placeholder="KSC-01" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Kategoria</label>
          <Input name="category" defaultValue={item?.category} placeholder="Zarządzanie ryzykiem" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Dotyczy</label>
          <select
            name="appliesToType"
            defaultValue={item?.appliesToType ?? "all"}
            className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white"
          >
            <option value="all">Wszystkie podmioty</option>
            <option value="essential">Tylko kluczowe</option>
            <option value="important">Tylko ważne</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">Tytuł</label>
        <Input name="title" defaultValue={item?.title} placeholder="Tytuł obowiązku" required />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">Opis</label>
        <textarea
          name="description"
          defaultValue={item?.description}
          placeholder="Szczegółowy opis obowiązku..."
          rows={3}
          required
          className="flex w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Priorytet</label>
          <select
            name="priority"
            defaultValue={item?.priority ?? 1}
            className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white"
          >
            <option value="1">1 — Krytyczny</option>
            <option value="2">2 — Wysoki</option>
            <option value="3">3 — Średni</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Kolejność</label>
          <Input name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
        </div>
        {item && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Aktywny</label>
            <select
              name="isActive"
              defaultValue={item.isActive ? "true" : "false"}
              className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white"
            >
              <option value="true">Tak</option>
              <option value="false">Nie</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit">{item ? "Zapisz zmiany" : "Dodaj obowiązek"}</Button>
        {onDone && <Button type="button" variant="ghost" onClick={onDone}>Anuluj</Button>}
      </div>
    </form>
  );
}
