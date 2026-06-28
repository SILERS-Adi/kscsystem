import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from "@kscsystem/ui";
import { CreditCard, ArrowRight } from "lucide-react";
import { getMyAccount } from "./_actions/account-actions";
import { NameForm, PasswordForm } from "./_components/account-forms";

export const dynamic = "force-dynamic";

const roleLabel: Record<string, string> = { superadmin: "Super admin", org_admin: "Admin firmy", member: "Użytkownik" };

export default async function SettingsPage() {
  const account = await getMyAccount();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ustawienia</h1>
        <p className="mt-1 text-sm text-gray-400">Ustawienia konta i preferencje</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Profil użytkownika</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <NameForm initialName={account?.name ?? ""} />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <Input defaultValue={account?.email ?? ""} disabled />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Rola:</span>
              <Badge variant="default">{roleLabel[account?.role ?? "member"] ?? account?.role}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Zmiana hasła</CardTitle></CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Subskrypcja i płatności</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">
              Zarządzaj swoim planem, metodą płatności i przeglądaj historię transakcji.
            </p>
            <Button size="sm" asChild>
              <Link href="/settings/billing">
                <CreditCard size={16} />
                Zarządzaj subskrypcją
                <ArrowRight size={16} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
