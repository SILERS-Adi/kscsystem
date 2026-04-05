import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@kscsystem/ui";
import { Plus, AlertTriangle } from "lucide-react";

const mockIncidents = [
  { title: "Próba phishingu — dział HR", severity: "high", status: "investigating", reportedBy: "Jan K.", date: "2026-04-04" },
  { title: "Nieautoryzowany dostęp do serwera testowego", severity: "critical", status: "open", reportedBy: "Anna N.", date: "2026-04-03" },
  { title: "Wyciek danych — fałszywy alarm", severity: "medium", status: "resolved", reportedBy: "Jan K.", date: "2026-03-28" },
  { title: "Atak DDoS na stronę www", severity: "high", status: "closed", reportedBy: "Piotr W.", date: "2026-03-15" },
];

const severityVariant = {
  low: "outline",
  medium: "warning",
  high: "destructive",
  critical: "destructive",
} as const;

const statusVariant = {
  open: "destructive",
  investigating: "warning",
  resolved: "accent",
  closed: "muted",
} as const;

const statusLabel = {
  open: "Otwarty",
  investigating: "Badany",
  resolved: "Rozwiązany",
  closed: "Zamknięty",
};

export default function IncidentsPage() {
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Incydenty</h1>
          <p className="mt-1 text-sm text-gray-400">Rejestr incydentów bezpieczeństwa</p>
        </div>
        <Button size="sm">
          <Plus size={16} />
          Zgłoś incydent
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incydenty ({mockIncidents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockIncidents.map((inc, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4 hover:bg-surface-200 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400 shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{inc.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{inc.reportedBy}</span>
                    <span className="text-xs text-gray-500">· {inc.date}</span>
                  </div>
                </div>
                <Badge variant={severityVariant[inc.severity as keyof typeof severityVariant]}>
                  {inc.severity}
                </Badge>
                <Badge variant={statusVariant[inc.status as keyof typeof statusVariant]}>
                  {statusLabel[inc.status as keyof typeof statusLabel]}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
