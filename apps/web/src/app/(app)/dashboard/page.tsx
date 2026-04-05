import { Card, CardHeader, CardTitle, CardContent, StatCard, ProgressBar, Badge } from "@kscsystem/ui";
import { ClipboardCheck, FileText, AlertTriangle, Shield } from "lucide-react";

export default function DashboardPage() {
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
              <p className="text-5xl font-bold text-gradient mb-3">64%</p>
              <p className="text-sm text-gray-400">12 z 19 obowiązków wypełnionych lub w toku</p>
            </div>
            <div className="h-32 w-32 rounded-full border-8 border-surface-200 flex items-center justify-center relative">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-300" />
                <circle cx="64" cy="64" r="56" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeDasharray={`${64 * 2 * Math.PI * 0.64} ${64 * 2 * Math.PI}`} strokeLinecap="round" />
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
          label="Checklista"
          value="12/19"
          icon={<ClipboardCheck size={20} />}
        />
        <StatCard
          label="Dokumenty"
          value={5}
          icon={<FileText size={20} />}
        />
        <StatCard
          label="Otwarte incydenty"
          value={2}
          icon={<AlertTriangle size={20} />}
        />
        <StatCard
          label="Klasyfikacja"
          value="Kluczowy"
          icon={<Shield size={20} />}
        />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nadchodzące obowiązki</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "Wyznaczenie osoby kontaktowej ds. KSC", status: "todo", priority: "Krytyczny" },
                { title: "Rejestracja w systemie S46", status: "in_progress", priority: "Wysoki" },
                { title: "Opracowanie polityki bezpieczeństwa", status: "in_progress", priority: "Krytyczny" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex-1">
                    <p className="text-sm text-white">{item.title}</p>
                    <Badge variant="destructive" className="mt-1">{item.priority}</Badge>
                  </div>
                  <Badge variant={item.status === "todo" ? "outline" : "warning"}>
                    {item.status === "todo" ? "Do zrobienia" : "W toku"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ostatnia aktywność</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "Dodano dokument: Polityka bezpieczeństwa v2", time: "2 godz. temu", user: "Jan K." },
                { action: "Oznaczono: Analiza ryzyka — ukończone", time: "Wczoraj", user: "Anna N." },
                { action: "Zgłoszono incydent: Phishing attempt", time: "2 dni temu", user: "Jan K." },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm text-white">{item.action}</p>
                    <p className="text-xs text-gray-500">{item.user}</p>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
