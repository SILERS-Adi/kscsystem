"use client";

import { Avatar, Badge } from "@kscsystem/ui";
import { Bell } from "lucide-react";

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-xl px-6">
      <div>
        <h2 className="text-sm font-medium text-gray-400">TechCorp Sp. z o.o.</h2>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="default">Podmiot kluczowy</Badge>

        <button className="relative p-2 rounded-lg hover:bg-surface-100 transition-colors">
          <Bell size={18} className="text-gray-400" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-3">
          <Avatar fallback="JK" size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">Jan Kowalski</p>
            <p className="text-xs text-gray-500">org_admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
