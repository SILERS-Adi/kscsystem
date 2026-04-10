"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@kscsystem/ui";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { resetPassword } from "./_actions/reset-password-actions";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!token) {
    return (
      <div className="rounded-xl border border-border bg-surface-100 p-6 text-center space-y-4">
        <AlertTriangle size={32} className="text-amber-400 mx-auto" />
        <div>
          <p className="text-white font-medium mb-1">Brak tokenu</p>
          <p className="text-sm text-gray-400">
            Link jest nieprawidlowy. Sprobuj ponownie zresetowac haslo.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/forgot-password">Wyslij nowy link</Link>
        </Button>
      </div>
    );
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("token", token!);
    startTransition(async () => {
      const result = await resetPassword(formData);
      if ("error" in result && result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  }

  if (success) {
    return (
      <div className="rounded-xl border border-border bg-surface-100 p-6 text-center space-y-4">
        <CheckCircle2 size={32} className="text-accent-400 mx-auto" />
        <div>
          <p className="text-white font-medium mb-1">Haslo zmienione</p>
          <p className="text-sm text-gray-400">
            Mozesz sie teraz zalogowac nowym haslem.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/login">Zaloguj sie</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={handleSubmit}>
      <div className="space-y-4 rounded-xl border border-border bg-surface-100 p-6">
        <p className="text-sm text-gray-400">
          Ustaw nowe haslo do swojego konta.
        </p>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Nowe haslo</label>
          <Input name="password" type="password" placeholder="Minimum 8 znakow" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Powtorz haslo</label>
          <Input name="confirmPassword" type="password" placeholder="Powtorz haslo" required />
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
              Zapisywanie...
            </>
          ) : (
            "Ustaw nowe haslo"
          )}
        </Button>
      </div>
    </form>
  );
}
