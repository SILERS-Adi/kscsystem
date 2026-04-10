"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, ProgressBar, Logo } from "@kscsystem/ui";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { submitQuiz } from "../_actions/quiz-flow";

interface Question {
  id: string;
  code: string;
  text: string;
  description: string | null;
  category: string | null;
  options: {
    id: string;
    text: string;
    value: string;
    description: string | null;
  }[];
}

export function QuizClient({ questions }: { questions: Question[] }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const isLast = current === questions.length - 1;

  function selectAnswer(optionId: string) {
    setAnswers({ ...answers, [question.id]: optionId });
  }

  function next() {
    if (!isLast) {
      setCurrent(current + 1);
    } else {
      startTransition(async () => {
        const result = await submitQuiz(answers);
        // Store result in sessionStorage for the wynik page
        sessionStorage.setItem("quizResult", JSON.stringify(result));
        router.push("/wynik");
      });
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
          <h2 className="text-2xl font-bold text-white mb-2">{question.text}</h2>
          {question.description && (
            <p className="text-sm text-gray-400 mb-8">{question.description}</p>
          )}

          <div className="space-y-3 mb-10">
            {question.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => selectAnswer(opt.id)}
                className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${
                  answers[question.id] === opt.id
                    ? "border-brand-500 bg-brand-500/10 text-brand-300"
                    : "border-border bg-surface-100 text-gray-300 hover:bg-surface-200 hover:border-border-light"
                }`}
              >
                <span className="text-sm font-medium">{opt.text}</span>
                {opt.description && (
                  <span className="block mt-1 text-xs text-gray-500 font-normal">{opt.description}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={prev} disabled={current === 0}>
              <ArrowLeft size={16} />
              Wstecz
            </Button>
            <Button onClick={next} disabled={!answers[question.id] || isPending}>
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Obliczam wynik...
                </>
              ) : isLast ? (
                "Zobacz wynik"
              ) : (
                "Dalej"
              )}
              {!isPending && <ArrowRight size={16} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
