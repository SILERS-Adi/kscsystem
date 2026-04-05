"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, cn } from "@kscsystem/ui";
import {
  LayoutDashboard,
  HelpCircle,
  Target,
  ClipboardCheck,
  FileText,
  Users,
  Building2,
  CreditCard,
  PanelLeft,
  Settings,
  Megaphone,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Quiz", href: "/quiz", icon: HelpCircle },
  { label: "Scoring", href: "/scoring", icon: Target },
  { label: "Checklista", href: "/checklist", icon: ClipboardCheck },
  { label: "Szablony", href: "/templates", icon: FileText },
  { label: "Leady", href: "/leads", icon: Megaphone },
  { label: "Organizacje", href: "/organizations", icon: Building2 },
  { label: "Użytkownicy", href: "/users", icon: Users },
  { label: "Plany", href: "/plans", icon: CreditCard },
  { label: "CMS", href: "/cms", icon: PanelLeft },
  { label: "Ustawienia", href: "/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface-50 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-5 border-b border-border">
        <Logo size="sm" />
        <span className="ml-auto text-[10px] font-medium text-gray-500 bg-surface-200 px-2 py-0.5 rounded">
          ADMIN
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

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
              <item.icon className="h-4.5 w-4.5 shrink-0" size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="text-xs text-gray-500">
          <p>KSCSYSTEM Admin</p>
          <p className="text-gray-600">panel.silers.pl</p>
        </div>
      </div>
    </aside>
  );
}
