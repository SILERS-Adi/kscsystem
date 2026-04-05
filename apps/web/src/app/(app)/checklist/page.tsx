"use client";

import { Card, CardHeader, CardTitle, CardContent, Badge, ProgressBar, Button } from "@kscsystem/ui";
import { CheckCircle2, Circle, Clock, MinusCircle } from "lucide-react";

const statusConfig = {
  done: { icon: CheckCircle2, label: "Ukończone", color: "text-accent-400", badge: "accent" as const },
  in_progress: { icon: Clock, label: "W toku", color: "text-amber-400", badge: "warning" as const },
  todo: { icon: Circle, label: "Do zrobienia", color: "text-gray-500", badge: "outline" as const },
  not_applicable: { icon: MinusCircle, label: "Nie dotyczy", color: "text-gray-600", badge: "muted" as const },
};

const mockChecklist = [
  { code: "KSC-01", category: "Zarządzanie ryzykiem", title: "Wdrożenie systemu zarządzania ryzykiem", status: "done" as const, priority: 1 },
  { code: "KSC-02", category: "Zarządzanie ryzykiem", title: "Przeprowadzenie analizy ryzyka", status: "done" as const, priority: 1 },
  { code: "KSC-03", category: "Zarządzanie ryzykiem", title: "Plan postępowania z ryzykiem", status: "in_progress" as const, priority: 2 },
  { code: "KSC-04", category: "Bezpieczeństwo", title: "Polityka bezpieczeństwa informacji", status: "in_progress" as const, priority: 1 },
  { code: "KSC-05", category: "Bezpieczeństwo", title: "Polityka kontroli dostępu", status: "todo" as const, priority: 2 },
  { code: "KSC-06", category: "Incydenty", title: "Procedura zgłaszania incydentów do CSIRT", status: "todo" as const, priority: 1 },
  { code: "KSC-07", category: "Incydenty", title: "Rejestr incydentów bezpieczeństwa", status: "done" as const, priority: 2 },
  { code: "KSC-08", category: "Audyt", title: "Przeprowadzenie audytu bezpieczeństwa", status: "todo" as const, priority: 3 },
  { code: "KSC-09", category: "Ciągłość", title: "Plan ciągłości działania", status: "todo" as const, priority: 2 },
];

const doneCount = mockChecklist.filter(i => i.status === "done").length;
const inProgressCount = mockChecklist.filter(i => i.status === "in_progress").length;

export default function ChecklistPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Checklista compliance</h1>
        <p className="mt-1 text-sm text-gray-400">Obowiązki wynikające z ustawy o KSC dla Twojej organizacji</p>
      </div>

      {/* Progress summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">Ukończone</p>
          <p className="text-2xl font-bold text-accent-400">{doneCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">W toku</p>
          <p className="text-2xl font-bold text-amber-400">{inProgressCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">Do zrobienia</p>
          <p className="text-2xl font-bold text-white">{mockChecklist.length - doneCount - inProgressCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">Postęp</p>
          <ProgressBar value={doneCount} max={mockChecklist.length} variant="accent" className="mt-2" />
        </Card>
      </div>

      {/* Checklist items */}
      <Card>
        <CardHeader>
          <CardTitle>Obowiązki ({mockChecklist.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockChecklist.map((item) => {
              const config = statusConfig[item.status];
              const Icon = config.icon;

              return (
                <div key={item.code} className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4 hover:bg-surface-200 transition-colors">
                  <Icon size={20} className={config.color} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-gray-500">{item.code}</span>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <p className="text-sm text-white">{item.title}</p>
                  </div>
                  <Badge variant={config.badge}>{config.label}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
