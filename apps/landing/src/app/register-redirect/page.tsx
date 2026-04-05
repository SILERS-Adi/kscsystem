import { Suspense } from "react";
import { Logo } from "@kscsystem/ui";
import { Loader2 } from "lucide-react";
import { RedirectClient } from "./redirect-client";

function Fallback() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
      <Logo size="lg" />
      <Loader2 size={24} className="animate-spin text-brand-400" />
      <p className="text-sm text-gray-400">Ładowanie...</p>
    </div>
  );
}

export default function RegisterRedirectPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <RedirectClient />
    </Suspense>
  );
}
