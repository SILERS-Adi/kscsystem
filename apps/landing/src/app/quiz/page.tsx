"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, ProgressBar, Logo } from "@kscsystem/ui";
import { ArrowLeft, ArrowRight } from "lucide-react";

const questions = [
  {
    id: 1,
    text: "W jakim sektorze działa Twoja organizacja?",
    options: [
      { label: "Energia", value: "energy" },
      { label: "Transport", value: "transport" },
      { label: "Zdrowie", value: "health" },
      { label: "Infrastruktura cyfrowa", value: "digital" },
      { label: "Bankowość / Finanse", value: "finance" },
      { label: "Administracja publiczna", value: "public" },
      { label: "Inny", value: "other" },
    ],
  },
  {
    id: 2,
    text: "Ile osób zatrudnia Twoja organizacja?",
    options: [
      { label: "Mniej niż 50", value: "micro" },
      { label: "50-249", value: "medium" },
      { label: "250 i więcej", value: "large" },
    ],
  },
  {
    id: 3,
    text: "Jaki jest roczny obrót Twojej organizacji?",
    options: [
      { label: "Poniżej 10 mln EUR", value: "small" },
      { label: "10-50 mln EUR", value: "medium" },
      { label: "Powyżej 50 mln EUR", value: "large" },
    ],
  },
  {
    id: 4,
    text: "Czy Twoja organizacja świadczy usługi wymienione w załączniku nr 1 lub 2 do ustawy o KSC?",
    options: [
      { label: "Tak, załącznik nr 1 (usługi kluczowe)", value: "annex1" },
      { label: "Tak, załącznik nr 2 (usługi ważne)", value: "annex2" },
      { label: "Nie jestem pewien", value: "unsure" },
      { label: "Nie", value: "no" },
    ],
  },
  {
    id: 5,
    text: "Czy posiadasz wdrożony system zarządzania bezpieczeństwem informacji (np. ISO 27001)?",
    options: [
      { label: "Tak, certyfikowany", value: "certified" },
      { label: "Tak, bez certyfikacji", value: "implemented" },
      { label: "W trakcie wdrażania", value: "in_progress" },
      { label: "Nie", value: "no" },
    ],
  },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const router = useRouter();

  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  function selectAnswer(value: string) {
    setAnswers({ ...answers, [question.id]: value });
  }

  function next() {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      router.push("/wynik");
    }
  }

  function prev() {
    if (current > 0) setCurrent(current - 1);
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <span className="text-sm text-gray-400">
            Pytanie {current + 1} z {questions.length}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto w-full px-6 pt-6">
        <ProgressBar value={progress} showLabel={false} variant="brand" />
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-8">{question.text}</h2>

          <div className="space-y-3 mb-10">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => selectAnswer(opt.value)}
                className={`w-full text-left rounded-xl border p-4 text-sm font-medium transition-all duration-200 ${
                  answers[question.id] === opt.value
                    ? "border-brand-500 bg-brand-500/10 text-brand-300"
                    : "border-border bg-surface-100 text-gray-300 hover:bg-surface-200 hover:border-border-light"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prev}
              disabled={current === 0}
            >
              <ArrowLeft size={16} />
              Wstecz
            </Button>
            <Button
              onClick={next}
              disabled={!answers[question.id]}
            >
              {current < questions.length - 1 ? "Dalej" : "Zobacz wynik"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
