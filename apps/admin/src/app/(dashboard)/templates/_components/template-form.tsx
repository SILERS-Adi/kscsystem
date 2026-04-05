"use client";

import { useRef } from "react";
import { Button, Input } from "@kscsystem/ui";
import { createDocumentTemplate, updateDocumentTemplate } from "../_actions/template-actions";

interface TemplateData {
  id: string;
  name: string;
  type: string;
  description: string | null;
  content: string;
  version: number;
  status: string;
}

export function TemplateForm({ template, onDone }: { template?: TemplateData; onDone?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    if (template) {
      await updateDocumentTemplate(template.id, formData);
    } else {
      await createDocumentTemplate(formData);
    }
    formRef.current?.reset();
    onDone?.();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Nazwa szablonu</label>
          <Input name="name" defaultValue={template?.name} placeholder="Polityka bezpieczeństwa" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Typ</label>
          <select
            name="type"
            defaultValue={template?.type ?? "policy"}
            className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white"
          >
            <option value="policy">Polityka</option>
            <option value="procedure">Procedura</option>
            <option value="register">Rejestr</option>
            <option value="plan">Plan</option>
            <option value="report">Raport</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">Opis</label>
        <Input name="description" defaultValue={template?.description ?? ""} placeholder="Krótki opis szablonu..." />
      </div>

      {template && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Status</label>
            <select
              name="status"
              defaultValue={template.status}
              className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white"
            >
              <option value="draft">Szkic</option>
              <option value="published">Opublikowany</option>
              <option value="archived">Zarchiwizowany</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Wersja</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white font-mono">v{template.version}</span>
              <label className="flex items-center gap-1.5 text-xs text-gray-400">
                <input type="checkbox" name="bumpVersion" value="true" className="rounded" />
                Podnieś wersję
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">
          Treść szablonu <span className="text-gray-500">(HTML — użyj {"{{orgName}}"}, {"{{nip}}"}, {"{{sector}}"}, {"{{date}}"} jako placeholdery)</span>
        </label>
        <textarea
          name="content"
          defaultValue={template?.content}
          placeholder="<h1>Polityka bezpieczeństwa — {{orgName}}</h1>..."
          rows={12}
          required
          className="flex w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 transition-colors resize-y font-mono"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">{template ? "Zapisz zmiany" : "Dodaj szablon"}</Button>
        {onDone && <Button type="button" variant="ghost" onClick={onDone}>Anuluj</Button>}
      </div>
    </form>
  );
}
