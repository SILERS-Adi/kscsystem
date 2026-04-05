import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@kscsystem/ui";
import { ArrowLeft } from "lucide-react";
import { getQuizQuestion, deleteQuizOption } from "../_actions/quiz-actions";
import { QuestionForm } from "../_components/question-form";
import { OptionForm } from "../_components/option-form";
import { DeleteOptionButton } from "../_components/delete-option-button";

export const dynamic = 'force-dynamic';

export default async function QuizQuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = await getQuizQuestion(id);

  if (!question) notFound();

  return (
    <div>
      <div className="mb-4">
        <Link href="/quiz" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          Powrót do listy
        </Link>
      </div>

      <PageHeader
        title={`${question.code}: ${question.text}`}
        description="Edytuj pytanie i zarządzaj opcjami odpowiedzi"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edytuj pytanie</CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionForm question={question} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opcje odpowiedzi ({question.options.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface-50 p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{opt.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{opt.value}</Badge>
                      <span className="text-xs text-gray-500">
                        waga: <span className="font-mono font-bold text-brand-400">{opt.weight}</span>
                      </span>
                      <span className="text-xs text-gray-500">kolejność: {opt.sortOrder}</span>
                    </div>
                  </div>
                  <DeleteOptionButton optionId={opt.id} />
                </div>
              ))}

              {question.options.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">Brak opcji. Dodaj pierwszą opcję poniżej.</p>
              )}

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-sm font-medium text-gray-300 mb-3">Dodaj nową opcję</p>
                <OptionForm questionId={question.id} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
