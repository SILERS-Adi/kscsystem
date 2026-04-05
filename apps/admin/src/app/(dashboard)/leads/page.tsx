import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@kscsystem/ui";

const mockLeads = [
  { name: "Jan Kowalski", email: "jan@techcorp.pl", company: "TechCorp", score: 75, classification: "essential", source: "quiz", date: "2026-04-05" },
  { name: "Anna Nowak", email: "anna@secureit.pl", company: "SecureIT S.A.", score: 45, classification: "important", source: "quiz", date: "2026-04-04" },
  { name: "Piotr Wiśniewski", email: "piotr@dataguard.pl", company: "DataGuard", score: 20, classification: "unknown", source: "contact", date: "2026-04-03" },
  { name: "Maria Zielińska", email: "maria@cyberpl.pl", company: "CyberPL", score: 82, classification: "essential", source: "quiz", date: "2026-04-02" },
];

const classColors = {
  essential: "destructive",
  important: "warning",
  unknown: "muted",
} as const;

export default function LeadsPage() {
  return (
    <div>
      <PageHeader title="Leady" description="Leady z quizu sprawdzksc.pl i formularzy kontaktowych" />

      <Card>
        <CardHeader>
          <CardTitle>Wszystkie leady ({mockLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                {mockLeads.map((lead, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-surface-50 transition-colors">
                    <td className="py-3">
                      <p className="font-medium text-white">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </td>
                    <td className="py-3 text-gray-300">{lead.company}</td>
                    <td className="py-3">
                      <span className="font-mono font-bold text-white">{lead.score}</span>
                    </td>
                    <td className="py-3">
                      <Badge variant={classColors[lead.classification as keyof typeof classColors]}>
                        {lead.classification}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline">{lead.source}</Badge>
                    </td>
                    <td className="py-3 text-gray-500">{lead.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
