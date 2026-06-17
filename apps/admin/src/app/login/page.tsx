"use client";

import { Suspense } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Logo, Button, Input } from "@kscsystem/ui";
import { loginAdmin, type LoginState } from "./_actions/login-actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAdmin, {});

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border bg-surface-100 p-6">
      <input type="hidden" name="redirect" value={redirectTo} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Email</label>
        <Input type="email" name="email" placeholder="admin@silers.pl" required autoComplete="email" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hasło</label>
        <Input type="password" name="password" placeholder="••••••••" required autoComplete="current-password" />
      </div>

      {state.error && (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Logowanie…" : "Zaloguj się"}
      </Button>
    </form>
  );
}

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

        <Suspense fallback={<div className="h-64 rounded-xl border border-border bg-surface-100" />}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-gray-500">Dostęp tylko dla administratorów systemu</p>
      </div>
    </div>
  );
}
