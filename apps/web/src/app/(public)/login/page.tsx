"use client";

import Link from "next/link";
import { Logo, Button, Input } from "@kscsystem/ui";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <p className="text-sm text-gray-400">Zaloguj się do swojego konta</p>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-surface-100 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <Input type="email" placeholder="twoj@email.pl" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Hasło</label>
              <Link href="#" className="text-xs text-brand-400 hover:underline">Zapomniałeś hasła?</Link>
            </div>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Zaloguj się</Button>
        </div>

        <p className="text-center text-sm text-gray-400">
          Nie masz konta?{" "}
          <Link href="/register" className="text-brand-400 hover:underline font-medium">
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
}
