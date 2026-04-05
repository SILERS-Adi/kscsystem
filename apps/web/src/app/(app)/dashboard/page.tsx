import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, StatCard, Badge, Button, ProgressBar } from "@kscsystem/ui";
import { ClipboardCheck, FileText, AlertTriangle, Shield, ArrowRight, Clock, Circle, CheckCircle2, Sparkles } from "lucide-react";
import { getDashboardData } from "./_actions/dashboard-actions";

export const dynamic = "force-dynamic";

const classLabels: Record<string, string> = { essential: "Kluczowy", important: "Ważny", unknown: "Nieokreślony" };
const classVariants: Record<string, "destructive" | "warning" | "outline"> = { essential: "destructive", important: "warning", unknown: "outline" };

const statusIcons: Record<string, typeof Circle> = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
};
const statusColors: Record<string, string> = {
  todo: "text-gray-500",
  in_progress: "text-amber-400",
  done: "text-accent-400",
};

export default async function DashboardPage() {
  const { org, stats, nextSteps, gaps, documentCount, subscription } = await getDashboardData();

  return (
    <div>
      {/* Welcome banner for new users */}
      {stats.percentage === 0 && (
        <Card className="mb-6 overflow-hidden">
          <div className="h-1 gradient-brand" />
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Witaj w KSCSYSTEM!</h2>
                <p className="text-sm text-gray-400 mb-3">
                  Twoja spersonalizowana checklista compliance jest gotowa. Zacznij od przeglądnięcia
                  obowiązków i oznaczania postępu — system będzie śledził Twoją gotowość na KSC.
                </p>
                <Button size="sm" asChild>
                  <Link href="/checklist">
                    Przejdź do checklisty
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">Przegląd stanu zgodności {org?.name ?? "Twojej organizacji"} z KSC</p>
      </div>

      {/* Main compliance card */}
      <Card className="mb-8 overflow-hidden">
        <div className="relative p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-accent-500/5" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant={classVariants[org?.type ?? "unknown"]}>
                  {classLabels[org?.type ?? "unknown"]}
                </Badge>
                {subscription && (
                  <Badge variant="outline">
                    {subscription.plan} · {subscription.status === "trial" ? "Trial" : subscription.status}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-1">Gotowość na KSC</p>
              <p className="text-5xl font-bold text-gradient mb-3">{stats.percentage}%</p>
              <p className="text-sm text-gray-400">
                {stats.done} ukończonych · {stats.inProgress} w toku · {stats.todo} do zrobienia
              </p>
            </div>
            <div className="h-32 w-32 rounded-full border-8 border-surface-200 flex items-center justify-center relative">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-300" />
                <circle cx="64" cy="64" r="56" fill="none" stroke="url(#gradient)" strokeWidth="8"
                  strokeDasharray={`${56 * 2 * Math.PI * (stats.percentage / 100)} ${56 * 2 * Math.PI}`}
                  strokeLinecap="round" />
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

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Ukończone" value={stats.done} icon={<CheckCircle2 size={20} />} />
        <StatCard label="W toku" value={stats.inProgress} icon={<Clock size={20} />} />
        <StatCard label="Krytyczne braki" value={stats.critical} icon={<AlertTriangle size={20} />} />
        <StatCard label="Dokumenty" value={documentCount} icon={<FileText size={20} />} />
      </div>

      {/* Action panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next steps */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Najbliższe kroki</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/checklist">
                Zobacz wszystko
                <ArrowRight size={14} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {nextSteps.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle2 size={32} className="text-accent-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Wszystko na bieżąco! Brak pilnych zadań.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {nextSteps.map((item) => {
                  const Icon = statusIcons[item.status] ?? Circle;
                  return (
                    <Link
                      key={item.id}
                      href="/checklist"
                      className="flex items-center gap-3 rounded-lg border border-border bg-surface-50 p-3 hover:bg-surface-200/50 transition-colors"
                    >
                      <Icon size={16} className={statusColors[item.status] ?? "text-gray-500"} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono text-gray-500">{item.code}</span>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                      </div>
                      {item.priority === 1 && <Badge variant="destructive">Krytyczny</Badge>}
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gaps */}
        <Card>
          <CardHeader>
            <CardTitle>Braki wymagające uwagi</CardTitle>
          </CardHeader>
          <CardContent>
            {gaps.length === 0 ? (
              <div className="text-center py-6">
                <Shield size={32} className="text-accent-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Brak krytycznych braków! Świetna robota.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {gaps.map((item) => (
                  <Link
                    key={item.id}
                    href="/checklist"
                    className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3 hover:bg-red-500/10 transition-colors"
                  >
                    <AlertTriangle size={16} className="text-red-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.title}</p>
                      <span className="text-xs text-gray-500">{item.code} · {item.category}</span>
                    </div>
                  </Link>
                ))}
                <div className="pt-2">
                  <p className="text-xs text-gray-500">
                    {gaps.length} krytycznych obowiązków wymaga Twojej uwagi.
                    Rozpocznij od najważniejszych, aby uniknąć kar.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Link href="/checklist">
          <Card className="p-5 hover:border-brand-500/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 group-hover:bg-brand-500/20 transition-colors">
                <ClipboardCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Checklista</p>
                <p className="text-xs text-gray-500">{stats.done + stats.inProgress}/{stats.total} zadań</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/documents">
          <Card className="p-5 hover:border-brand-500/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 group-hover:bg-brand-500/20 transition-colors">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Dokumenty</p>
                <p className="text-xs text-gray-500">{documentCount} dokumentów</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/profile">
          <Card className="p-5 hover:border-brand-500/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 group-hover:bg-brand-500/20 transition-colors">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Profil firmy</p>
                <p className="text-xs text-gray-500">{org?.sector ?? "Uzupełnij dane"}</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
