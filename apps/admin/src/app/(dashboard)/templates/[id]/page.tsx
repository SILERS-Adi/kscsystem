import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@kscsystem/ui";
import { getDocumentTemplate } from "../_actions/template-actions";
import { TemplateForm } from "../_components/template-form";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = { draft: "Szkic", published: "Opublikowany", archived: "Zarchiwizowany" };

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getDocumentTemplate(id);
  if (!t) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Link href="/templates" className="text-gray-400 hover:text-white"><ArrowLeft size={18} /></Link>
        <PageHeader title={`Edycja: ${t.name}`} description={`Typ: ${t.type} · v${t.version} · ${statusLabel[t.status] ?? t.status}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Edytuj szablon</CardTitle></CardHeader>
          <CardContent>
            <TemplateForm
              template={{ id: t.id, name: t.name, type: t.type, description: t.description, content: t.content, version: t.version, status: t.status }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Podgląd treści</CardTitle></CardHeader>
          <CardContent>
            <div
              className="bg-white text-black rounded-lg p-5 max-h-[640px] overflow-auto text-sm leading-relaxed"
              // Treść szablonu jest autorstwa super admina (zaufana).
              dangerouslySetInnerHTML={{ __html: t.content }}
            />
            <p className="text-xs text-gray-500 mt-2">Podgląd surowego szablonu; placeholdery (np. {"{{orgName}}"}) wypełniają się przy generowaniu u klienta.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
