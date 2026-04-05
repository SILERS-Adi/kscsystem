import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@kscsystem/ui";
import { getQuizQuestions } from "./_actions/quiz-actions";
import { QuestionList } from "./_components/question-list";
import { QuestionForm } from "./_components/question-form";

export const dynamic = 'force-dynamic';

export default async function QuizPage() {
  const questions = await getQuizQuestions();

  return (
    <div>
      <PageHeader title="Quiz Manager" description="Zarządzaj pytaniami quizu klasyfikacyjnego" />

      <div className="space-y-6">
        {/* Add new question */}
        <Card>
          <CardHeader>
            <CardTitle>Dodaj pytanie</CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionForm />
          </CardContent>
        </Card>

        {/* Questions list */}
        <Card>
          <CardHeader>
            <CardTitle>Pytania ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionList questions={questions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
