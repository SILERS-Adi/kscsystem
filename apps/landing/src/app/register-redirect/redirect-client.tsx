"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Logo } from "@kscsystem/ui";
import { Loader2 } from "lucide-react";

export function RedirectClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  useEffect(() => {
    const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
    const url = sessionId
      ? `${webUrl}/register?session=${sessionId}`
      : `${webUrl}/register`;
    window.location.href = url;
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
      <Logo size="lg" />
      <Loader2 size={24} className="animate-spin text-brand-400" />
      <p className="text-sm text-gray-400">Przekierowanie do rejestracji...</p>
    </div>
  );
}
