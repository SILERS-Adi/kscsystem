import { PageHeader } from "@/components/page-header";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@kscsystem/ui";
import { Plus, PanelLeft } from "lucide-react";

const mockContent = [
  { key: "hero_title", section: "landing_hero", title: "Sprawdź czy Twoja firma podlega pod KSC", isPublished: true },
  { key: "hero_subtitle", section: "landing_hero", title: "Bezpłatny quiz klasyfikacyjny", isPublished: true },
  { key: "pricing_title", section: "landing_pricing", title: "Wybierz plan dopasowany do potrzeb", isPublished: true },
  { key: "about_ksc", section: "landing_info", title: "Czym jest ustawa o KSC?", isPublished: false },
  { key: "faq_general", section: "landing_faq", title: "Najczęściej zadawane pytania", isPublished: false },
];

export default function CmsPage() {
  return (
    <div>
      <PageHeader title="CMS — Treści" description="Zarządzanie treściami na stronach landing i aplikacji">
        <Button size="sm">
          <Plus size={16} />
          Dodaj treść
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Treści ({mockContent.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockContent.map((c, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-200 text-gray-500">
                  <PanelLeft size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{c.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-gray-500">{c.key}</span>
                    <Badge variant="outline">{c.section}</Badge>
                  </div>
                </div>
                <Badge variant={c.isPublished ? "accent" : "warning"}>
                  {c.isPublished ? "Opublikowane" : "Szkic"}
                </Badge>
                <Button variant="ghost" size="sm">Edytuj</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
