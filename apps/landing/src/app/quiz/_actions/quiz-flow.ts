"use server";

import { prisma } from "@kscsystem/db";

export async function getActiveQuizQuestions() {
  return prisma.quizQuestion.findMany({
    where: { isActive: true },
    include: {
      options: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function submitQuiz(answers: Record<string, string>) {
  // 1. Create quiz session
  const session = await prisma.quizSession.create({ data: {} });

  // 2. Save answers and calculate total score from option weights
  let totalScore = 0;
  const questionIds = Object.keys(answers);

  for (const questionId of questionIds) {
    const optionId = answers[questionId];

    const option = await prisma.quizOption.findUnique({
      where: { id: optionId },
    });

    await prisma.quizAnswer.create({
      data: {
        sessionId: session.id,
        questionId,
        optionId,
      },
    });

    if (option) {
      totalScore += option.weight;
    }
  }

  // 3. Determine classification based on score thresholds
  let classification: string;
  if (totalScore >= 60) {
    classification = "essential";
  } else if (totalScore >= 30) {
    classification = "important";
  } else {
    classification = "not_applicable";
  }

  // 4. Update session with score and classification
  await prisma.quizSession.update({
    where: { id: session.id },
    data: {
      score: totalScore,
      classification,
      completedAt: new Date(),
    },
  });

  // 5. Fetch answer details for the result page
  const sessionWithDetails = await prisma.quizSession.findUnique({
    where: { id: session.id },
    include: {
      answers: {
        include: {
          question: true,
          option: true,
        },
      },
    },
  });

  return {
    sessionId: session.id,
    score: totalScore,
    classification,
    answers: sessionWithDetails?.answers.map((a) => ({
      question: a.question.text,
      category: a.question.category,
      answer: a.option?.text ?? "",
      weight: a.option?.weight ?? 0,
    })) ?? [],
  };
}

export async function saveLead(data: {
  sessionId: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  nip?: string;
}) {
  const session = await prisma.quizSession.findUnique({
    where: { id: data.sessionId },
  });

  const lead = await prisma.lead.create({
    data: {
      email: data.email,
      name: data.name,
      company: data.company || null,
      phone: data.phone || null,
      nip: data.nip || null,
      source: "quiz",
      score: session?.score ?? null,
      classification: session?.classification ?? null,
    },
  });

  // Link lead to quiz session
  await prisma.quizSession.update({
    where: { id: data.sessionId },
    data: { leadId: lead.id },
  });

  return { leadId: lead.id };
}
