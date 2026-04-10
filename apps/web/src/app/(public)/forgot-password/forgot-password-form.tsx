"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button, Input } from "@kscsystem/ui";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { requestPasswordReset } from "./_actions/forgot-password-actions";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await requestPasswordReset(formData);
      if ("error" in result && result.error) {
        setError(result.error);
      } else {
        setSent(true);
      }
    });
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-surface-100 p-6 text-center space-y-4">
        <CheckCircle2 size={32} className="text-accent-400 mx-auto" />
        <div>
          <p className="text-white font-medium mb-1">Email wyslany</p>
          <p className="text-sm text-gray-400">
            Jesli konto z podanym adresem istnieje, wyslalismy link do zresetowania hasla. Sprawdz skrzynke (takze folder spam).
          </p>
        </div>
        <Button variant="ghost" asChild className="w-full">
          <Link href="/login">
            <ArrowLeft size={16} />
            Powrot do logowania
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <form action={handleSubmit}>
        <div className="space-y-4 rounded-xl border border-border bg-surface-100 p-6">
          <p className="text-sm text-gray-400">
            Podaj adres email powiazany z Twoim kontem. Wyslemy Ci link do ustawienia nowego hasla.
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <Input name="email" type="email" placeholder="twoj@email.pl" required />
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
                Wysylanie...
              </>
            ) : (
              "Wyslij link resetujacy"
            )}
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-400">
        <Link href="/login" className="text-brand-400 hover:underline font-medium">
          <ArrowLeft size={14} className="inline mr-1" />
          Powrot do logowania
        </Link>
      </p>
    </>
  );
}
