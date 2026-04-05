"use client";

import { useTransition } from "react";
import { Badge } from "@kscsystem/ui";
import { CheckCircle2, Circle, Clock, MinusCircle, Loader2 } from "lucide-react";
import { updateChecklistStatus } from "../_actions/checklist-actions";

type Status = "todo" | "in_progress" | "done" | "not_applicable";

const statusConfig: Record<Status, { icon: typeof Circle; label: string; color: string; badge: "accent" | "warning" | "outline" | "muted" }> = {
  done: { icon: CheckCircle2, label: "Ukończone", color: "text-accent-400", badge: "accent" },
  in_progress: { icon: Clock, label: "W toku", color: "text-amber-400", badge: "warning" },
  todo: { icon: Circle, label: "Do zrobienia", color: "text-gray-500", badge: "outline" },
  not_applicable: { icon: MinusCircle, label: "Nie dotyczy", color: "text-gray-600", badge: "muted" },
};

const statusOrder: Status[] = ["todo", "in_progress", "done", "not_applicable"];

interface ChecklistItemRowProps {
  itemId: string;
  code: string;
  category: string;
  title: string;
  description: string;
  priority: number;
  status: Status;
  note: string | null;
}

const priorityColors: Record<number, "destructive" | "warning" | "outline"> = { 1: "destructive", 2: "warning", 3: "outline" };
const priorityLabels: Record<number, string> = { 1: "Krytyczny", 2: "Wysoki", 3: "Średni" };

export function ChecklistItemRow({ itemId, code, category, title, description, priority, status, note }: ChecklistItemRowProps) {
  const [isPending, startTransition] = useTransition();
  const config = statusConfig[status];
  const Icon = config.icon;

  function cycleStatus() {
    const currentIndex = statusOrder.indexOf(status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    startTransition(async () => {
      await updateChecklistStatus(itemId, nextStatus);
    });
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4 hover:bg-surface-200/50 transition-colors">
      <button
        onClick={cycleStatus}
        disabled={isPending}
        className="shrink-0 transition-transform hover:scale-110"
        title="Kliknij aby zmienić status"
      >
        {isPending ? (
          <Loader2 size={20} className="text-brand-400 animate-spin" />
        ) : (
          <Icon size={20} className={config.color} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-mono text-gray-500">{code}</span>
          <Badge variant={priorityColors[priority] ?? "outline"}>
            {priorityLabels[priority] ?? `P${priority}`}
          </Badge>
          <Badge variant="outline">{category}</Badge>
        </div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{description}</p>
      </div>

      <Badge variant={config.badge}>{config.label}</Badge>
    </div>
  );
}
