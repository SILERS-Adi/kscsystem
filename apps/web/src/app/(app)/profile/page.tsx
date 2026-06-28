import { Card, CardHeader, CardTitle, CardContent, Badge } from "@kscsystem/ui";
import { Building2 } from "lucide-react";
import { getMyOrg } from "./_actions/profile-actions";
import { OrgProfileForm } from "./_components/org-profile-form";

export const dynamic = "force-dynamic";

const classLabel: Record<string, string> = {
  essential: "Podmiot kluczowy",
  important: "Podmiot ważny",
  unknown: "Nieokreślony",
};

export default async function ProfilePage() {
  const org = await getMyOrg();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Profil firmy</h1>
        <p className="mt-1 text-sm text-gray-400">Dane organizacji i klasyfikacja KSC</p>
      </div>

      {!org ? (
        <Card><CardContent><p className="py-8 text-center text-sm text-gray-500">Brak przypisanej organizacji.</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Dane firmy</CardTitle></CardHeader>
              <CardContent>
                <OrgProfileForm
                  initial={{
                    name: org.name,
                    nip: org.nip ?? "",
                    sector: org.sector ?? "",
                    size: org.size ?? "",
                    website: org.website ?? "",
                    phone: org.phone ?? "",
                    address: org.address ?? "",
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Klasyfikacja KSC</p>
                    <p className="text-lg font-bold text-white">{classLabel[org.type] ?? org.type}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Sektor</span><span className="text-white">{org.sector ?? "—"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Użytkownicy</span><span className="text-white">{org._count.users}</span></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-white mb-3">Plan subskrypcji</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Plan</span>
                    <Badge variant="default">{org.subscription?.plan?.name ?? "Brak / trial"}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className="text-white">{org.subscription?.status ?? "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Odnowienie</span>
                    <span className="text-white">{org.subscription?.currentPeriodEnd ? org.subscription.currentPeriodEnd.toLocaleDateString("pl-PL") : "—"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
