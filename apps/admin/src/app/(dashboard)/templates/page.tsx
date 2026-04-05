import { PageHeader } from "@/components/page-header";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@kscsystem/ui";
import { Plus, FileText } from "lucide-react";

const mockTemplates = [
  { name: "Polityka bezpieczeństwa informacji", type: "policy", version: 3, status: "published" },
  { name: "Procedura reagowania na incydenty", type: "procedure", version: 2, status: "published" },
  { name: "Plan ciągłości działania", type: "plan", version: 1, status: "draft" },
  { name: "Raport z audytu bezpieczeństwa", type: "report", version: 1, status: "draft" },
];

const statusVariant = { published: "accent", draft: "warning", archived: "muted" } as const;

export default function TemplatesPage() {
  return (
    <div>
      <PageHeader title="Szablony dokumentów" description="Szablony z wersjonowaniem dla organizacji">
        <Button size="sm">
          <Plus size={16} />
          Dodaj szablon
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockTemplates.map((t, i) => (
          <Card key={i} className="hover:border-brand-500/30 transition-colors cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 shrink-0">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white mb-1">{t.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{t.type}</Badge>
                    <Badge variant={statusVariant[t.status as keyof typeof statusVariant]}>
                      {t.status}
                    </Badge>
                    <span className="text-xs text-gray-500">v{t.version}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
