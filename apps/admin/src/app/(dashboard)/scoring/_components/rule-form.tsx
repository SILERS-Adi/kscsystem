"use client";

import { useRef } from "react";
import { Button, Input } from "@kscsystem/ui";
import { createScoringRule, updateScoringRule } from "../_actions/scoring-actions";

interface ScoringRuleData {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  score: number;
  sortOrder: number;
  isActive: boolean;
  condition: unknown;
}

export function RuleForm({ rule, onDone }: { rule?: ScoringRuleData; onDone?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const cond = (rule?.condition ?? { field: "totalScore", operator: "gte", value: 0 }) as {
    field: string;
    operator: string;
    value: number;
  };

  async function handleSubmit(formData: FormData) {
    if (rule) {
      await updateScoringRule(rule.id, formData);
    } else {
      await createScoringRule(formData);
    }
    formRef.current?.reset();
    onDone?.();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Nazwa reguły</label>
          <Input name="name" defaultValue={rule?.name} placeholder="Podmiot kluczowy" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Kategoria</label>
          <Input name="category" defaultValue={rule?.category ?? ""} placeholder="classification" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">Opis</label>
        <Input name="description" defaultValue={rule?.description ?? ""} placeholder="Opis reguły..." />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Pole warunku</label>
          <Input name="conditionField" defaultValue={cond.field} placeholder="totalScore" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Operator</label>
          <select
            name="conditionOperator"
            defaultValue={cond.operator}
            className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white"
          >
            <option value="gte">&gt;= (większe lub równe)</option>
            <option value="gt">&gt; (większe)</option>
            <option value="lte">&lt;= (mniejsze lub równe)</option>
            <option value="lt">&lt; (mniejsze)</option>
            <option value="eq">= (równe)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Wartość</label>
          <Input name="conditionValue" type="number" defaultValue={cond.value} required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Score (punkty)</label>
          <Input name="score" type="number" step="0.1" defaultValue={rule?.score ?? 0} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Kolejność</label>
          <Input name="sortOrder" type="number" defaultValue={rule?.sortOrder ?? 0} />
        </div>
        {rule && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Aktywna</label>
            <select
              name="isActive"
              defaultValue={rule.isActive ? "true" : "false"}
              className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white"
            >
              <option value="true">Tak</option>
              <option value="false">Nie</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit">{rule ? "Zapisz zmiany" : "Dodaj regułę"}</Button>
        {onDone && <Button type="button" variant="ghost" onClick={onDone}>Anuluj</Button>}
      </div>
    </form>
  );
}
