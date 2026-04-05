"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Button, Card, CardContent, Badge, Input, Logo } from "@kscsystem/ui";
import { Shield, ArrowRight, AlertTriangle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { saveLead } from "../quiz/_actions/quiz-flow";

interface QuizResult {
  sessionId: string;
  score: number;
  classification: string;
  answers: {
    question: string;
    category: string | null;
    answer: string;
    weight: number;
  }[];
}

const classificationConfig = {
  essential: {
    label: "Podmiot kluczowy",
    badge: "destructive" as const,
    icon: AlertTriangle,
    iconColor: "text-red-400",
    bgColor: "bg-red-500/10",
    description: "Twoja organizacja zostanie sklasyfikowana jako podmiot kluczowy w rozumieniu nowelizacji ustawy o KSC. Oznacza to najszerszy zakres obowiązków.",
  },
  important: {
    label: "Podmiot ważny",
    badge: "warning" as const,
    icon: Info,
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    description: "Twoja organizacja zostanie sklasyfikowana jako podmiot ważny. Masz obowiązki compliance, ale w nieco mniejszym zakresie niż podmioty kluczowe.",
  },
  not_applicable: {
    label: "Nie podlega pod KSC",
    badge: "accent" as const,
    icon: CheckCircle2,
    iconColor: "text-accent-400",
    bgColor: "bg-accent-500/10",
    description: "Na podstawie Twoich odpowiedzi, Twoja organizacja prawdopodobnie nie podlega pod ustawę o KSC. Zalecamy jednak konsultację ze specjalistą.",
  },
};

export default function WynikPage() {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [leadSaved, setLeadSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const stored = sessionStorage.getItem("quizResult");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white mb-2">Brak wyników</p>
          <p className="text-sm text-gray-400 mb-6">Najpierw wypełnij quiz, aby zobaczyć wynik.</p>
          <Button asChild>
            <Link href="/quiz">Przejdź do quizu</Link>
          </Button>
        </div>
      </div>
    );
  }

  const config = classificationConfig[result.classification as keyof typeof classificationConfig]
    ?? classificationConfig.not_applicable;
  const Icon = config.icon;

  function handleLeadSubmit(formData: FormData) {
    startTransition(async () => {
      await saveLead({
        sessionId: result!.sessionId,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        company: (formData.get("company") as string) || undefined,
        phone: (formData.get("phone") as string) || undefined,
      });
      setLeadSaved(true);
    });
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center">
          <Logo size="sm" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Result */}
        <div className="text-center mb-12">
          <div className={`inline-flex h-20 w-20 items-center justify-center rounded-2xl ${config.bgColor} ${config.iconColor} mb-6`}>
            <Icon size={40} />
          </div>

          <Badge variant={config.badge} className="mb-4">{config.label}</Badge>

          <h1 className="text-3xl font-bold text-white mb-3">
            {result.classification === "not_applicable"
              ? "Twoja firma prawdopodobnie nie podlega pod KSC"
              : "Twoja firma podlega pod KSC"}
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">{config.description}</p>
        </div>

        {/* Score breakdown */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-400">Wynik klasyfikacji</span>
              <span className="text-3xl font-bold text-gradient">{result.score} / 100</span>
            </div>

            <div className="space-y-3">
              {result.answers
                .filter((a) => a.weight > 0)
                .map((a, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-brand-400" />
                      <span className="text-sm text-gray-300">{a.answer}</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-white">+{a.weight}</span>
                  </div>
                ))}
              {result.answers.filter((a) => a.weight > 0).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">Żadna z odpowiedzi nie generuje punktów.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lead capture */}
        <Card className="overflow-hidden">
          <div className="h-1 gradient-brand" />
          <CardContent className="p-8">
            {leadSaved ? (
              <div className="text-center py-4">
                <CheckCircle2 size={32} className="text-accent-400 mx-auto mb-3" />
                <p className="text-lg font-semibold text-white mb-1">Dziękujemy!</p>
                <p className="text-sm text-gray-400">Raport zostanie wysłany na podany adres email.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Otrzymaj pełny raport i plan działania
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Podaj swoje dane, a wyślemy Ci szczegółowy raport z listą obowiązków i rekomendowanym harmonogramem wdrożenia.
                </p>
                <form action={handleLeadSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input name="name" placeholder="Imię i nazwisko" required />
                    <Input name="company" placeholder="Nazwa firmy" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input name="email" type="email" placeholder="Email" required />
                    <Input name="phone" placeholder="Telefon (opcjonalnie)" />
                  </div>
                  <Button className="w-full" type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Zapisuję...
                      </>
                    ) : (
                      <>
                        Pobierz raport
                        <ArrowRight size={16} />
                      </>
                    )}
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-3">
                  Twoje dane są bezpieczne. Nie udostępniamy ich podmiotom trzecim.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* CTA — main onboarding */}
        <Card className="overflow-hidden mt-8">
          <div className="h-1 gradient-accent" />
          <CardContent className="p-8 text-center">
            <Shield size={32} className="text-accent-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">
              Zacznij zarządzać zgodnością z KSC
            </h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
              Załóż bezpłatne konto i otrzymaj spersonalizowaną checklistę obowiązków,
              szablony dokumentów i śledzenie postępu — wszystko gotowe od razu.
            </p>
            <Button size="lg" className="w-full max-w-xs" asChild>
              <Link href={`/register-redirect?session=${result.sessionId}`}>
                Załóż konto — 14 dni za darmo
                <ArrowRight size={18} />
              </Link>
            </Button>
            <p className="text-xs text-gray-500 mt-3">Bez karty kredytowej · Konto w 30 sekund</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
