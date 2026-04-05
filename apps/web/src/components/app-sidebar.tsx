"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, cn, ProgressBar } from "@kscsystem/ui";
import {
  LayoutDashboard,
  ClipboardCheck,
  Building2,
  FileText,
  AlertTriangle,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Checklista", href: "/checklist", icon: ClipboardCheck },
  { label: "Dokumenty", href: "/documents", icon: FileText },
  { label: "Incydenty", href: "/incidents", icon: AlertTriangle },
  { label: "Profil firmy", href: "/profile", icon: Building2 },
  { label: "Ustawienia", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

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
          <span className="text-xs font-bold text-brand-400">64%</span>
        </div>
        <ProgressBar value={64} showLabel={false} variant="brand" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                  : "text-gray-400 hover:text-white hover:bg-surface-200"
              )}
            >
              <item.icon className="shrink-0" size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

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
