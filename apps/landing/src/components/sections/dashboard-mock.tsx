import { Badge } from "@kscsystem/ui";
import { CheckCircle2, Circle, Clock, Shield, FileText, AlertTriangle } from "lucide-react";

export function DashboardMock() {
  return (
    <div className="relative w-full max-w-lg">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 via-accent-500/10 to-brand-500/20 rounded-3xl blur-2xl" />

      <div className="relative rounded-2xl border border-border bg-surface-100/90 backdrop-blur-xl overflow-hidden shadow-2xl shadow-brand-500/10">
        {/* Mock topbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center text-[7px] font-bold text-white">KSC</div>
            <span className="text-xs font-semibold text-white">KSCSYSTEM</span>
          </div>
          <Badge variant="destructive">Podmiot kluczowy</Badge>
        </div>

        {/* Mock content */}
        <div className="p-5 space-y-4">
          {/* Progress card */}
          <div className="rounded-xl border border-border bg-surface-50/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Gotowość na KSC</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">64%</p>
              </div>
              <div className="h-14 w-14 rounded-full border-[3px] border-surface-300 flex items-center justify-center relative">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="3" className="text-surface-300" />
                  <circle cx="28" cy="28" r="24" fill="none" stroke="url(#mg)" strokeWidth="3"
                    strokeDasharray={`${24 * 2 * Math.PI * 0.64} ${24 * 2 * Math.PI}`}
                    strokeLinecap="round" />
                  <defs>
                    <linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                </svg>
                <Shield size={16} className="text-brand-400" />
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-surface-300 overflow-hidden">
              <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Ukończone", value: "8", icon: CheckCircle2, color: "text-accent-400" },
              { label: "W toku", value: "4", icon: Clock, color: "text-amber-400" },
              { label: "Dokumenty", value: "3", icon: FileText, color: "text-brand-400" },
            ].map((s, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface-200/50 p-2.5 text-center">
                <s.icon size={14} className={`${s.color} mx-auto mb-1`} />
                <p className="text-sm font-bold text-white">{s.value}</p>
                <p className="text-[9px] text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Mini checklist */}
          <div className="space-y-1.5">
            {[
              { text: "Polityka bezpieczeństwa", icon: CheckCircle2, color: "text-accent-400" },
              { text: "Analiza ryzyka", icon: CheckCircle2, color: "text-accent-400" },
              { text: "Procedura incydentów", icon: Clock, color: "text-amber-400" },
              { text: "Rejestracja w S46", icon: Circle, color: "text-gray-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-lg bg-surface-200/30 px-3 py-2">
                <item.icon size={13} className={item.color} />
                <span className="text-xs text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
