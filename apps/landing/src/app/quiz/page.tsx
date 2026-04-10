import { getActiveQuizQuestions } from "./_actions/quiz-flow";
import { QuizClient } from "./_components/quiz-client";

export const dynamic = 'force-dynamic';

export default async function QuizPage() {
  const questions = await getActiveQuizQuestions();

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white mb-2">Quiz nie jest jeszcze dostępny</p>
          <p className="text-sm text-gray-400">Pytania zostaną dodane wkrótce.</p>
        </div>
      </div>
    );
  }

  const serialized = questions.map((q) => ({
    id: q.id,
    code: q.code,
    text: q.text,
    description: q.description,
    category: q.category,
    options: q.options.map((o) => ({
      id: o.id,
      text: o.text,
      value: o.value,
      description: o.description ?? null,
    })),
  }));

  return <QuizClient questions={serialized} />;
}
