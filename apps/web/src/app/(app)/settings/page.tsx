import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from "@kscsystem/ui";
import { CreditCard, ArrowRight } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ustawienia</h1>
        <p className="mt-1 text-sm text-gray-400">Ustawienia konta i preferencje</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profil użytkownika</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Imię</label>
                <Input defaultValue="Jan" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Nazwisko</label>
                <Input defaultValue="Kowalski" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <Input defaultValue="jan@techcorp.pl" disabled />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Rola:</span>
              <Badge variant="default">org_admin</Badge>
            </div>
            <Button size="sm">Zapisz zmiany</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zmiana hasła</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Obecne hasło</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nowe hasło</label>
              <Input type="password" placeholder="Min. 8 znaków" />
            </div>
            <Button size="sm" variant="secondary">Zmień hasło</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subskrypcja i platnosci</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">
              Zarzadzaj swoim planem, metoda platnosci i przegladaj historie transakcji.
            </p>
            <Button size="sm" asChild>
              <Link href="/settings/billing">
                <CreditCard size={16} />
                Zarzadzaj subskrypcja
                <ArrowRight size={16} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
