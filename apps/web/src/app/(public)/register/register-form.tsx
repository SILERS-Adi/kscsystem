"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo, Button, Input, Badge, Card, CardContent } from "@kscsystem/ui";
import { Shield, Loader2, CheckCircle2 } from "lucide-react";
import { getQuizSessionData, registerUser } from "./_actions/register-actions";

const classLabels: Record<string, string> = {
  essential: "Podmiot kluczowy",
  important: "Podmiot ważny",
  not_applicable: "Nie podlega",
};

const classVariants: Record<string, "destructive" | "warning" | "accent"> = {
  essential: "destructive",
  important: "warning",
  not_applicable: "accent",
};

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const [quizData, setQuizData] = useState<{
    score: number | null;
    classification: string | null;
    leadName: string | null;
    leadEmail: string | null;
    leadCompany: string | null;
    leadNip: string | null;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (sessionId) {
      getQuizSessionData(sessionId).then((data) => {
        if (data) setQuizData(data);
      });
    }
  }, [sessionId]);

  function handleSubmit(formData: FormData) {
    if (sessionId) formData.set("sessionId", sessionId);
    setError(null);

    startTransition(async () => {
      const result = await registerUser(formData);
      if ("error" in result && result.error) {
        setError(result.error);
      } else if ("success" in result && result.success) {
        // Store org info for demo session (no real auth yet)
        sessionStorage.setItem("kscsystem_org", JSON.stringify({
          orgId: result.orgId,
          orgType: result.orgType,
          checklistCount: result.checklistCount,
        }));
        router.push("/dashboard?welcome=1");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <p className="text-sm text-gray-400">Utwórz konto i zacznij zarządzać zgodnością</p>
        </div>

        {/* Quiz result badge */}
        {quizData?.classification && (
          <Card className="overflow-hidden">
            <div className="h-1 gradient-brand" />
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 shrink-0">
                  <Shield size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Wynik quizu klasyfikacyjnego</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={classVariants[quizData.classification] ?? "outline"}>
                      {classLabels[quizData.classification] ?? quizData.classification}
                    </Badge>
                    <span className="text-xs text-gray-500">{quizData.score} pkt</span>
                  </div>
                </div>
                <CheckCircle2 size={16} className="text-accent-400" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration form */}
        <form action={handleSubmit}>
          <div className="space-y-4 rounded-xl border border-border bg-surface-100 p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Imię i nazwisko</label>
                <Input name="name" defaultValue={quizData?.leadName ?? ""} placeholder="Jan Kowalski" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <Input name="email" type="email" defaultValue={quizData?.leadEmail ?? ""} placeholder="twoj@email.pl" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nazwa firmy</label>
              <Input name="companyName" defaultValue={quizData?.leadCompany ?? ""} placeholder="Twoja Firma Sp. z o.o." required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">NIP</label>
                <Input name="nip" defaultValue={quizData?.leadNip ?? ""} placeholder="1234567890" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Sektor</label>
                <select
                  name="sector"
                  className="flex h-10 w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white"
                  defaultValue=""
                >
                  <option value="">Wybierz sektor...</option>
                  <option value="Energia">Energia</option>
                  <option value="Transport">Transport</option>
                  <option value="Bankowość">Bankowość i finanse</option>
                  <option value="Zdrowie">Ochrona zdrowia</option>
                  <option value="Infrastruktura cyfrowa">Infrastruktura cyfrowa</option>
                  <option value="Administracja">Administracja publiczna</option>
                  <option value="Woda">Woda i ścieki</option>
                  <option value="Produkcja">Produkcja</option>
                  <option value="Inny">Inny</option>
                </select>
              </div>
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
                  Tworzę konto...
                </>
              ) : (
                "Utwórz konto i rozpocznij"
              )}
            </Button>
          </div>
        </form>

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
