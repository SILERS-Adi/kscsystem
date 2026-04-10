"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo, Button, Input } from "@kscsystem/ui";
import { Loader2 } from "lucide-react";
import { loginUser } from "./_actions/login-actions";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await loginUser(formData);
      if ("error" in result && result.error) {
        setError(result.error);
      } else if ("success" in result) {
        router.push(result.redirect ?? "/dashboard");
        router.refresh();
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <p className="text-sm text-gray-400">Zaloguj się do swojego konta</p>
        </div>

        <form action={handleSubmit}>
          <div className="space-y-4 rounded-xl border border-border bg-surface-100 p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <Input name="email" type="email" placeholder="twoj@email.pl" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Hasło</label>
              <Input name="password" type="password" placeholder="••••••••" required />
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-brand-400 transition-colors">
                Nie pamietasz hasla?
              </Link>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Logowanie...
                </>
              ) : (
                "Zaloguj się"
              )}
            </Button>
          </div>
        </form>

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
