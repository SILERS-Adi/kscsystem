import { prisma } from "@kscsystem/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge, StatCard } from "@kscsystem/ui";
import { Megaphone, ClipboardList, CheckCircle2, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

const classColors = {
  essential: "destructive",
  important: "warning",
  not_applicable: "muted",
  unknown: "muted",
} as const;

const classLabels: Record<string, string> = {
  essential: "Podmiot kluczowy",
  important: "Podmiot ważny",
  not_applicable: "Nie podlega",
  unknown: "Nieznana",
};

function classKey(c: string | null): keyof typeof classColors {
  if (c && c in classColors) return c as keyof typeof classColors;
  return "unknown";
}

export default async function LeadsPage() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    leads,
    quizSessionsTotal,
    quizSessionsCompleted,
    pageViewsTotal,
    pageViews7d,
    uniqueVisitors,
  ] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.quizSession.count(),
    prisma.quizSession.count({ where: { completedAt: { not: null } } }),
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.pageView.findMany({
      where: { sessionId: { not: null } },
      distinct: ["sessionId"],
      select: { sessionId: true },
    }),
  ]);

  // Konwersja: ilu odwiedzających, którzy ukończyli quiz, zostawiło leada
  const conversion =
    quizSessionsCompleted > 0
      ? Math.round((leads.filter((l) => l.source === "quiz").length / quizSessionsCompleted) * 100)
      : 0;

  return (
    <div>
      <PageHeader title="Leady" description="Leady z quizu sprawdzksc.pl i formularzy kontaktowych" />

      {/* Statystyki ruchu i quizu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Wejścia na landing"
          value={pageViewsTotal}
          changeLabel={`${pageViews7d} w ost. 7 dni · ${uniqueVisitors.length} unikalnych`}
          icon={<Eye size={20} />}
        />
        <StatCard
          label="Wypełnione quizy"
          value={`${quizSessionsCompleted} / ${quizSessionsTotal}`}
          icon={<ClipboardList size={20} />}
        />
        <StatCard label="Leady (wszystkie)" value={leads.length} icon={<Megaphone size={20} />} />
        <StatCard
          label="Konwersja quiz → lead"
          value={`${conversion}%`}
          icon={<CheckCircle2 size={20} />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wszystkie leady ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              Brak leadów. Gdy ktoś wypełni quiz lub formularz na sprawdzksc.pl, pojawi się tutaj.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-gray-400 font-medium">Osoba</th>
                    <th className="pb-3 text-gray-400 font-medium">Firma</th>
                    <th className="pb-3 text-gray-400 font-medium">Score</th>
                    <th className="pb-3 text-gray-400 font-medium">Klasyfikacja</th>
                    <th className="pb-3 text-gray-400 font-medium">Źródło</th>
                    <th className="pb-3 text-gray-400 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-border last:border-0 hover:bg-surface-50 transition-colors"
                    >
                      <td className="py-3">
                        <p className="font-medium text-white">{lead.name ?? "—"}</p>
                        <p className="text-xs text-gray-500">{lead.email}</p>
                      </td>
                      <td className="py-3 text-gray-300">{lead.company ?? "—"}</td>
                      <td className="py-3">
                        <span className="font-mono font-bold text-white">{lead.score ?? "—"}</span>
                      </td>
                      <td className="py-3">
                        <Badge variant={classColors[classKey(lead.classification)]}>
                          {classLabels[classKey(lead.classification)]}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant="outline">{lead.source ?? "—"}</Badge>
                      </td>
                      <td className="py-3 text-gray-500">
                        {lead.createdAt.toLocaleDateString("pl-PL")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
