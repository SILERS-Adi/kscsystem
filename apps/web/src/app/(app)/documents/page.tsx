import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@kscsystem/ui";
import { FileText, Eye } from "lucide-react";
import { getAvailableTemplates, getOrganizationDocuments } from "./_actions/document-actions";
import { GenerateButton } from "./_components/generate-button";
import { DeleteDocButton } from "./_components/delete-doc-button";

export const dynamic = "force-dynamic";

const statusVariant = { published: "accent", draft: "warning", archived: "muted" } as const;
const statusLabel: Record<string, string> = { published: "Opublikowany", draft: "Szkic", archived: "Zarchiwizowany" };

export default async function DocumentsPage() {
  const [templates, documents] = await Promise.all([
    getAvailableTemplates(),
    getOrganizationDocuments(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dokumenty</h1>
        <p className="mt-1 text-sm text-gray-400">Generuj dokumenty zgodności KSC na podstawie szablonów</p>
      </div>

      {/* Available templates */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Dostępne szablony</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 mb-4">
            Kliknij „Generuj" aby utworzyć dokument wypełniony danymi Twojej organizacji.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {templates.map((t) => (
              <div key={t.id} className="rounded-lg border border-border bg-surface-50 p-4 flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{t.type}</Badge>
                      <span className="text-xs text-gray-500">v{t.version}</span>
                    </div>
                  </div>
                </div>
                {t.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{t.description}</p>
                )}
                <div className="mt-auto">
                  <GenerateButton templateId={t.id} />
                </div>
              </div>
            ))}
            {templates.length === 0 && (
              <p className="text-sm text-gray-500 col-span-full py-4 text-center">
                Brak dostępnych szablonów. Administrator musi je dodać w panelu.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* My documents */}
      <Card>
        <CardHeader>
          <CardTitle>Moje dokumenty ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4 hover:bg-surface-200/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 shrink-0">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{doc.type}</Badge>
                    <span className="text-xs text-gray-500">v{doc.version}</span>
                    <span className="text-xs text-gray-500">
                      · {doc.createdAt.toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                </div>
                <Badge variant={statusVariant[doc.status as keyof typeof statusVariant] ?? "muted"}>
                  {statusLabel[doc.status] ?? doc.status}
                </Badge>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/documents/${doc.id}`}>
                    <Eye size={14} />
                    Podgląd
                  </Link>
                </Button>
                <DeleteDocButton docId={doc.id} />
              </div>
            ))}
            {documents.length === 0 && (
              <p className="text-sm text-gray-500 py-8 text-center">
                Nie masz jeszcze żadnych dokumentów. Wygeneruj pierwszy z szablonu powyżej.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
