import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@kscsystem/ui";
import { getCmsContent } from "./_actions/cms-actions";
import { CmsManager, type CmsView } from "./_components/cms-manager";

export const dynamic = "force-dynamic";

export default async function CmsPage() {
  const content = await getCmsContent();
  const items: CmsView[] = content.map((c) => ({
    id: c.id,
    key: c.key,
    section: c.section,
    title: c.title,
    content: c.content,
    isPublished: c.isPublished,
  }));

  return (
    <div>
      <PageHeader title="CMS — Treści" description="Zarządzanie treściami na stronach landing i aplikacji" />
      <Card>
        <CardHeader>
          <CardTitle>Treści ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <CmsManager items={items} />
        </CardContent>
      </Card>
    </div>
  );
}
