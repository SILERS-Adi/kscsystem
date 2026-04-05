import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@kscsystem/ui";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Ustawienia" description="Konfiguracja systemu" />

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Ogólne</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nazwa systemu</label>
              <Input defaultValue="KSCSYSTEM" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email kontaktowy</label>
              <Input defaultValue="kontakt@kscsystem.pl" />
            </div>
            <Button size="sm">Zapisz zmiany</Button>
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
              <Input defaultValue="panel.silers.pl" disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
