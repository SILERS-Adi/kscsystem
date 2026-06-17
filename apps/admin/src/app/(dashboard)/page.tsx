import { prisma } from "@kscsystem/db";
import { StatCard } from "@kscsystem/ui";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@kscsystem/ui";
import Link from "next/link";
import { Users, Building2, ClipboardCheck, Megaphone, HelpCircle, Eye, ClipboardList } from "lucide-react";

export const dynamic = 'force-dynamic';

function readinessColor(r: number | null): string {
  if (r == null) return "text-gray-400";
  if (r >= 75) return "text-emerald-400";
  if (r >= 40) return "text-amber-400";
  return "text-red-400";
}

export default async function AdminDashboardPage() {
  const [orgCount, userCount, leadCount, questionCount, checklistCount, viewCount, recentLeads, recentOrgs, auditAvg, recentAudits] =
    await Promise.all([
      prisma.organization.count(),
      prisma.user.count(),
      prisma.lead.count(),
      prisma.quizQuestion.count({ where: { isActive: true } }),
      prisma.checklistItem.count({ where: { isActive: true } }),
      prisma.pageView.count(),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.organization.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.audit.aggregate({ _avg: { readiness: true }, where: { status: "completed" } }),
      prisma.audit.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { organization: { select: { name: true } } },
      }),
    ]);

  const avgReadiness = auditAvg._avg.readiness != null ? Math.round(auditAvg._avg.readiness) : null;

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
        <StatCard label="Wejścia (landing)" value={viewCount} icon={<Eye size={20} />} />
        <StatCard
          label="Śr. gotowość (audyty)"
          value={avgReadiness != null ? `${avgReadiness}%` : "—"}
          icon={<ClipboardList size={20} />}
        />
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

      {/* Audyty */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Ostatnie audyty</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAudits.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                Brak audytów. Przejdź do zakładki „Audyty", aby przeprowadzić pierwszy.
              </p>
            ) : (
              <div className="space-y-2">
                {recentAudits.map((a) => (
                  <Link
                    key={a.id}
                    href={`/audits/${a.id}`}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface-50 px-4 py-3 hover:bg-surface-100 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{a.organization.name}</p>
                      <p className="text-xs text-gray-500">
                        {a.createdAt.toLocaleDateString("pl-PL")} ·{" "}
                        {a.conductedByType === "self" ? "Samoocena" : "Konsultant"} ·{" "}
                        {a.status === "completed" ? "zakończony" : "szkic"}
                      </p>
                    </div>
                    <span className={`text-base font-bold tabular-nums ${readinessColor(a.readiness)}`}>
                      {a.readiness != null ? `${a.readiness}%` : "—"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
