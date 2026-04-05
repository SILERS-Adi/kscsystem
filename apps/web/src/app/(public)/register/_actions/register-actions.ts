"use server";

import { prisma } from "@kscsystem/db";
import { cookies } from "next/headers";
import type { OrganizationType } from "@prisma/client";
import { hashPassword, createSession } from "@/lib/auth";

export async function getQuizSessionData(sessionId: string) {
  const session = await prisma.quizSession.findUnique({
    where: { id: sessionId },
    include: { lead: true },
  });
  if (!session) return null;

  return {
    sessionId: session.id,
    score: session.score,
    classification: session.classification,
    leadName: session.lead?.name ?? null,
    leadEmail: session.lead?.email ?? null,
    leadCompany: session.lead?.company ?? null,
    leadPhone: session.lead?.phone ?? null,
    leadNip: session.lead?.nip ?? null,
  };
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const companyName = formData.get("companyName") as string;
  const nip = (formData.get("nip") as string) || null;
  const sector = (formData.get("sector") as string) || null;
  const sessionId = (formData.get("sessionId") as string) || null;

  if (!password || password.length < 8) {
    return { error: "Hasło musi mieć minimum 8 znaków." };
  }

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Użytkownik z tym adresem email już istnieje." };
  }

  // Determine classification from quiz session
  let classification: OrganizationType = "unknown";
  let quizScore: number | null = null;

  if (sessionId) {
    const session = await prisma.quizSession.findUnique({ where: { id: sessionId } });
    if (session) {
      quizScore = session.score;
      if (session.classification === "essential") classification = "essential";
      else if (session.classification === "important") classification = "important";
    }
  }

  // Create organization
  const org = await prisma.organization.create({
    data: {
      name: companyName,
      nip,
      sector,
      type: classification,
    },
  });

  // Create user as org_admin
  const pwHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email: email.trim().toLowerCase(),
      name,
      passwordHash: pwHash,
      role: "org_admin",
      organizationId: org.id,
    },
  });

  // Link quiz session to user if exists
  if (sessionId) {
    await prisma.quizSession.update({
      where: { id: sessionId },
      data: { userId: user.id },
    }).catch(() => {}); // ignore if session doesn't exist
  }

  // Assign checklist items based on classification
  const applicableItems = await prisma.checklistItem.findMany({
    where: {
      isActive: true,
      OR: [
        { appliesToType: "all" },
        ...(classification !== "unknown"
          ? [{ appliesToType: classification }]
          : []),
      ],
    },
  });

  // Create initial ChecklistProgress for each applicable item
  if (applicableItems.length > 0) {
    await prisma.checklistProgress.createMany({
      data: applicableItems.map((item) => ({
        organizationId: org.id,
        itemId: item.id,
        status: "todo" as const,
      })),
    });
  }

  // Create trial subscription with starter plan
  const starterPlan = await prisma.plan.findUnique({ where: { code: "starter" } });
  if (starterPlan) {
    await prisma.subscription.create({
      data: {
        organizationId: org.id,
        planId: starterPlan.id,
        status: "trial",
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      },
    });
  }

  // Create auth session
  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name ?? "",
    role: user.role,
    orgId: org.id,
  });

  return {
    success: true,
    userId: user.id,
    orgId: org.id,
    orgType: classification,
    checklistCount: applicableItems.length,
  };
}
