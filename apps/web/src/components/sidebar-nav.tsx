"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@kscsystem/ui";
import {
  LayoutDashboard,
  ClipboardCheck,
  Building2,
  FileText,
  AlertTriangle,
  Settings,
} from "lucide-react";

const iconMap: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard,
  ClipboardCheck,
  Building2,
  FileText,
  AlertTriangle,
  Settings,
};

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = iconMap[item.icon] ?? LayoutDashboard;

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
            <Icon className="shrink-0" size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
