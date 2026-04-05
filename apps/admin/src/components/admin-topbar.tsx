"use client";

import { Avatar } from "@kscsystem/ui";
import { Bell, Search } from "lucide-react";

export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-xl px-6">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Szukaj..."
          className="w-full h-9 rounded-lg border border-border bg-surface-100 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-colors"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-surface-100 transition-colors">
          <Bell className="h-4.5 w-4.5 text-gray-400" size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-3">
          <Avatar fallback="SA" size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">Super Admin</p>
            <p className="text-xs text-gray-500">superadmin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
