import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@kscsystem/ui";
import { FileText, Trash2 } from "lucide-react";
import { getDocumentTemplates, deleteDocumentTemplate } from "./_actions/template-actions";
import { TemplateForm } from "./_components/template-form";

export const dynamic = "force-dynamic";

const statusVariant = { published: "accent", draft: "warning", archived: "muted" } as const;

export default async function TemplatesPage() {
  const templates = await getDocumentTemplates();

  return (
    <div>
      <PageHeader title="Szablony dokumentów" description="Szablony z wersjonowaniem dla organizacji" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dodaj szablon</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Szablony ({templates.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {templates.map((t) => (
                <div key={t.id} className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{t.type}</Badge>
                      <Badge variant={statusVariant[t.status as keyof typeof statusVariant] ?? "muted"}>
                        {t.status}
                      </Badge>
                      <span className="text-xs text-gray-500">v{t.version}</span>
                    </div>
                  </div>
                  <form action={async () => { "use server"; await deleteDocumentTemplate(t.id); }}>
                    <Button variant="ghost" size="icon" type="submit" className="text-red-400 hover:text-red-300">
                      <Trash2 size={16} />
                    </Button>
                  </form>
                </div>
              ))}
              {templates.length === 0 && (
                <p className="text-sm text-gray-500 py-8 text-center">Brak szablonów. Dodaj pierwszy szablon.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
