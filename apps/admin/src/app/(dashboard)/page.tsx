import { prisma } from "@kscsystem/db";
import { StatCard } from "@kscsystem/ui";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@kscsystem/ui";
import { Users, Building2, ClipboardCheck, Megaphone, HelpCircle, Target } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [orgCount, userCount, leadCount, questionCount, checklistCount, ruleCount, recentLeads, recentOrgs] =
    await Promise.all([
      prisma.organization.count(),
      prisma.user.count(),
      prisma.lead.count(),
      prisma.quizQuestion.count({ where: { isActive: true } }),
      prisma.checklistItem.count({ where: { isActive: true } }),
      prisma.scoringRule.count({ where: { isActive: true } }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.organization.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  return (
    <div>
      <PageHeader title="Dashboard" description="Przegląd ekosystemu KSCSYSTEM" />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Organizacje" value={orgCount} icon={<Building2 size={20} />} />
        <StatCard label="Użytkownicy" value={userCount} icon={<Users size={20} />} />
        <StatCard label="Leady" value={leadCount} icon={<Megaphone size={20} />} />
        <StatCard label="Pytania quizu" value={questionCount} icon={<HelpCircle size={20} />} />
        <StatCard label="Checklista" value={checklistCount} icon={<ClipboardCheck size={20} />} />
        <StatCard label="Reguły scoringu" value={ruleCount} icon={<Target size={20} />} />
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ostatnie leady</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">Brak leadów</p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{lead.name ?? lead.email}</p>
                      <p className="text-xs text-gray-500">{lead.company ?? "—"} · score: {lead.score ?? "—"}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {lead.createdAt.toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organizacje</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrgs.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">Brak organizacji</p>
            ) : (
              <div className="space-y-3">
                {recentOrgs.map((org) => (
                  <div key={org.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{org.name}</p>
                      <p className="text-xs text-gray-500">NIP: {org.nip ?? "—"} · {org.sector ?? "—"}</p>
                    </div>
                    <span className="text-xs text-gray-500">{org.type}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
