"use client";

import Link from "next/link";
import { Logo, Button, Input } from "@kscsystem/ui";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <p className="text-sm text-gray-400">Utwórz konto i zacznij zarządzać zgodnością</p>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-surface-100 p-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Imię</label>
              <Input placeholder="Jan" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nazwisko</label>
              <Input placeholder="Kowalski" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nazwa firmy</label>
            <Input placeholder="Twoja Firma Sp. z o.o." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">NIP</label>
            <Input placeholder="1234567890" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <Input type="email" placeholder="twoj@email.pl" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Hasło</label>
            <Input type="password" placeholder="Min. 8 znaków" />
          </div>
          <Button className="w-full">Utwórz konto</Button>
        </div>

        <p className="text-center text-sm text-gray-400">
          Masz już konto?{" "}
          <Link href="/login" className="text-brand-400 hover:underline font-medium">
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
}
