import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@kscsystem/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path.slice(0, 512) : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 512) : null;
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 64) : null;

    await prisma.pageView.create({
      data: {
        path,
        referrer: referrer || null,
        sessionId,
        source: "landing",
        userAgent: req.headers.get("user-agent")?.slice(0, 512) ?? null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Nie blokuj UX, jeśli tracking padnie
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
