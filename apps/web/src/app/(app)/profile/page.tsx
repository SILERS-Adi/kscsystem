import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from "@kscsystem/ui";
import { Building2 } from "lucide-react";

export default function ProfilePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Profil firmy</h1>
        <p className="mt-1 text-sm text-gray-400">Dane organizacji i klasyfikacja KSC</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dane firmy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nazwa firmy</label>
                  <Input defaultValue="TechCorp Sp. z o.o." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">NIP</label>
                  <Input defaultValue="1234567890" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Sektor</label>
                  <Input defaultValue="Energia" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Wielkość</label>
                  <Input defaultValue="Średnie (50-249 pracowników)" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Strona www</label>
                <Input defaultValue="https://techcorp.pl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Adres</label>
                <Input defaultValue="ul. Marszałkowska 1, 00-001 Warszawa" />
              </div>
              <Button size="sm">Zapisz zmiany</Button>
            </CardContent>
          </Card>
        </div>

        {/* Classification */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                  <Building2 size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Klasyfikacja KSC</p>
                  <p className="text-lg font-bold text-white">Podmiot kluczowy</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sektor</span>
                  <span className="text-white">Energia</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wynik quizu</span>
                  <span className="text-white font-mono">75 pkt</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <Badge variant="default">Zweryfikowany</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-white mb-3">Plan subskrypcji</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Plan</span>
                  <Badge variant="accent">Professional</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Użytkownicy</span>
                  <span className="text-white">5 / 10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Odnowienie</span>
                  <span className="text-white">2026-05-01</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
