import { Logo } from "@kscsystem/ui";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <p className="text-sm text-gray-400">Reset hasla</p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
