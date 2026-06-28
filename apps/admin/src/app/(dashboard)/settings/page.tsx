import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Input } from "@kscsystem/ui";
import { getSettings } from "./_actions/settings-actions";
import { GeneralSettings } from "./_components/general-settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <PageHeader title="Ustawienia" description="Konfiguracja systemu" />

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Ogólne</CardTitle>
          </CardHeader>
          <CardContent>
            <GeneralSettings initial={settings} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Domeny</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Landing (quiz)</label>
              <Input defaultValue="sprawdzksc.pl" disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Aplikacja SaaS</label>
              <Input defaultValue="kscsystem.pl" disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Panel admin</label>
              <Input defaultValue="kscsystem.pl/admin" disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
