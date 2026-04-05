import { Card, CardHeader, CardTitle, CardContent, StatCard, Badge } from "@kscsystem/ui";
import { ClipboardCheck, FileText, AlertTriangle, Shield } from "lucide-react";
import { getComplianceStats } from "../checklist/_actions/checklist-actions";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await getComplianceStats();

  const classLabel: Record<string, string> = {
    essential: "Kluczowy",
    important: "Ważny",
    unknown: "Nieokreślony",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">Przegląd stanu zgodności Twojej organizacji z KSC</p>
      </div>

      {/* Main compliance card */}
      <Card className="mb-8 overflow-hidden">
        <div className="relative p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-accent-500/5" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Gotowość na KSC</p>
              <p className="text-5xl font-bold text-gradient mb-3">{stats.percentage}%</p>
              <p className="text-sm text-gray-400">
                {stats.done} z {stats.done + stats.inProgress + stats.todo} obowiązków ukończonych
                {stats.inProgress > 0 && `, ${stats.inProgress} w toku`}
              </p>
            </div>
            <div className="h-32 w-32 rounded-full border-8 border-surface-200 flex items-center justify-center relative">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-300" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray={`${56 * 2 * Math.PI * (stats.percentage / 100)} ${56 * 2 * Math.PI}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
              <Shield size={32} className="text-brand-400" />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Ukończone"
          value={stats.done}
          icon={<ClipboardCheck size={20} />}
        />
        <StatCard
          label="W toku"
          value={stats.inProgress}
          icon={<FileText size={20} />}
        />
        <StatCard
          label="Do zrobienia"
          value={stats.todo}
          icon={<AlertTriangle size={20} />}
        />
        <StatCard
          label="Klasyfikacja"
          value={classLabel[stats.classification] ?? stats.classification}
          icon={<Shield size={20} />}
        />
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Jak liczymy gotowość?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center justify-between py-1 border-b border-border">
                <span>Ukończone</span>
                <Badge variant="accent">100 pkt</Badge>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border">
                <span>W toku</span>
                <Badge variant="warning">50 pkt</Badge>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border">
                <span>Do zrobienia</span>
                <Badge variant="outline">0 pkt</Badge>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Nie dotyczy</span>
                <Badge variant="muted">pomijane</Badge>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Procent gotowości = (suma punktów / maksymalna suma) × 100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Następne kroki</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p className="text-gray-400">
                Przejdź do <a href="/checklist" className="text-brand-400 hover:underline">checklisty compliance</a>,
                aby oznaczyć postęp w realizacji obowiązków KSC.
              </p>
              <p className="text-gray-400">
                Kliknij ikonę statusu przy każdym obowiązku, aby przełączyć jego stan:
                <span className="text-white"> Do zrobienia → W toku → Ukończone → Nie dotyczy</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
