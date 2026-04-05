"use client";

import { Logo } from "@kscsystem/ui";
import { Button } from "@kscsystem/ui";
import { Input } from "@kscsystem/ui";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <p className="text-sm text-gray-400">Panel Administracyjny</p>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-surface-100 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <Input type="email" placeholder="admin@silers.pl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Hasło</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Zaloguj się</Button>
        </div>

        <p className="text-center text-xs text-gray-500">
          Dostęp tylko dla administratorów systemu
        </p>
      </div>
    </div>
  );
}
