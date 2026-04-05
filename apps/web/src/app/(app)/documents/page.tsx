import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@kscsystem/ui";
import { Plus, FileText, Download } from "lucide-react";

const mockDocuments = [
  { name: "Polityka bezpieczeństwa informacji", type: "policy", version: 2, status: "published", updatedAt: "2026-04-03" },
  { name: "Procedura reagowania na incydenty", type: "procedure", version: 1, status: "published", updatedAt: "2026-04-01" },
  { name: "Analiza ryzyka 2026", type: "report", version: 1, status: "draft", updatedAt: "2026-03-28" },
  { name: "Plan ciągłości działania", type: "plan", version: 1, status: "draft", updatedAt: "2026-03-25" },
  { name: "Rejestr aktywów IT", type: "report", version: 3, status: "published", updatedAt: "2026-03-20" },
];

const statusVariant = { published: "accent", draft: "warning", archived: "muted" } as const;
const statusLabel = { published: "Opublikowany", draft: "Szkic", archived: "Zarchiwizowany" };

export default function DocumentsPage() {
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dokumenty</h1>
          <p className="mt-1 text-sm text-gray-400">Dokumentacja zgodności KSC Twojej organizacji</p>
        </div>
        <Button size="sm">
          <Plus size={16} />
          Nowy dokument
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wszystkie dokumenty ({mockDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockDocuments.map((doc, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4 hover:bg-surface-200 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 shrink-0">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{doc.type}</Badge>
                    <span className="text-xs text-gray-500">v{doc.version}</span>
                    <span className="text-xs text-gray-500">· {doc.updatedAt}</span>
                  </div>
                </div>
                <Badge variant={statusVariant[doc.status as keyof typeof statusVariant]}>
                  {statusLabel[doc.status as keyof typeof statusLabel]}
                </Badge>
                <Button variant="ghost" size="icon">
                  <Download size={16} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
