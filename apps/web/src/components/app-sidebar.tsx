import Link from "next/link";
import { Logo, ProgressBar } from "@kscsystem/ui";
import {
  LayoutDashboard,
  ClipboardCheck,
  Building2,
  FileText,
  AlertTriangle,
  Settings,
  LogOut,
} from "lucide-react";
import { getComplianceStats } from "../app/(app)/checklist/_actions/checklist-actions";
import { SidebarNav } from "./sidebar-nav";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Checklista", href: "/checklist", icon: "ClipboardCheck" },
  { label: "Dokumenty", href: "/documents", icon: "FileText" },
  { label: "Incydenty", href: "/incidents", icon: "AlertTriangle" },
  { label: "Profil firmy", href: "/profile", icon: "Building2" },
  { label: "Ustawienia", href: "/settings", icon: "Settings" },
];

export async function AppSidebar() {
  const stats = await getComplianceStats();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface-50 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex h-16 items-center px-5 border-b border-border">
        <Logo size="sm" />
      </div>

      {/* Compliance progress */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">Gotowość KSC</span>
          <span className="text-xs font-bold text-brand-400">{stats.percentage}%</span>
        </div>
        <ProgressBar value={stats.percentage} showLabel={false} variant="brand" />
      </div>

      {/* Navigation */}
      <SidebarNav items={navItems} />

      {/* Footer */}
      <div className="border-t border-border p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-surface-200 transition-colors">
          <LogOut size={18} />
          Wyloguj się
        </button>
      </div>
    </aside>
  );
}
