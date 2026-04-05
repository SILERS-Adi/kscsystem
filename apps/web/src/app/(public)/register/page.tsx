import { Suspense } from "react";
import { RegisterForm } from "./register-form";
import { Logo } from "@kscsystem/ui";
import { Loader2 } from "lucide-react";

function RegisterFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <Logo size="lg" />
        <Loader2 size={24} className="animate-spin text-brand-400 mx-auto mt-4" />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterForm />
    </Suspense>
  );
}
