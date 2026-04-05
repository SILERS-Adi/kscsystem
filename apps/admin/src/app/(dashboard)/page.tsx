import { StatCard } from "@kscsystem/ui";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@kscsystem/ui";
import { Users, Building2, ClipboardCheck, Megaphone } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Przegląd ekosystemu KSCSYSTEM"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Organizacje"
          value={42}
          change={12}
          changeLabel="vs. poprzedni miesiąc"
          icon={<Building2 size={20} />}
        />
        <StatCard
          label="Użytkownicy"
          value={156}
          change={8}
          changeLabel="vs. poprzedni miesiąc"
          icon={<Users size={20} />}
        />
        <StatCard
          label="Leady"
          value={89}
          change={24}
          changeLabel="vs. poprzedni miesiąc"
          icon={<Megaphone size={20} />}
        />
        <StatCard
          label="Compliance avg."
          value="64%"
          change={5}
          changeLabel="vs. poprzedni miesiąc"
          icon={<ClipboardCheck size={20} />}
        />
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ostatnie leady</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Jan Kowalski", company: "TechCorp Sp. z o.o.", time: "2 min temu" },
                { name: "Anna Nowak", company: "SecureIT S.A.", time: "15 min temu" },
                { name: "Piotr Wiśniewski", company: "DataGuard Sp. z o.o.", time: "1 godz. temu" },
              ].map((lead, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.company}</p>
                  </div>
                  <span className="text-xs text-gray-500">{lead.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ostatnie rejestracje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "CyberSec Polska", plan: "Professional", date: "Dzisiaj" },
                { name: "InfoGuard S.A.", plan: "Enterprise", date: "Wczoraj" },
                { name: "NetProtect Sp. z o.o.", plan: "Starter", date: "2 dni temu" },
              ].map((org, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{org.name}</p>
                    <p className="text-xs text-gray-500">Plan: {org.plan}</p>
                  </div>
                  <span className="text-xs text-gray-500">{org.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
