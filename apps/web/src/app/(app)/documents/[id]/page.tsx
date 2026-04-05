import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, Badge, Button } from "@kscsystem/ui";
import { ArrowLeft, FileText } from "lucide-react";
import { getDocument } from "../_actions/document-actions";
import { DocumentStatusButtons } from "./status-buttons";

export const dynamic = "force-dynamic";

const statusVariant = { published: "accent", draft: "warning", archived: "muted" } as const;
const statusLabel: Record<string, string> = { published: "Opublikowany", draft: "Szkic", archived: "Zarchiwizowany" };

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await getDocument(id);

  if (!doc) notFound();

  return (
    <div>
      <div className="mb-4">
        <Link href="/documents" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          Powrót do dokumentów
        </Link>
      </div>

      {/* Document header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{doc.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{doc.type}</Badge>
              <Badge variant={statusVariant[doc.status as keyof typeof statusVariant] ?? "muted"}>
                {statusLabel[doc.status] ?? doc.status}
              </Badge>
              <span className="text-xs text-gray-500">v{doc.version}</span>
              <span className="text-xs text-gray-500">
                · {doc.createdAt.toLocaleDateString("pl-PL")}
              </span>
            </div>
          </div>
        </div>

        <DocumentStatusButtons docId={doc.id} currentStatus={doc.status} />
      </div>

      {/* Document content */}
      <Card>
        <CardContent className="p-0">
          <div
            className="prose prose-invert max-w-none p-8 bg-white text-black rounded-xl"
            dangerouslySetInnerHTML={{ __html: doc.content ?? "" }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
