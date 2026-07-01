"use client";

import type { ReactNode } from "react";
import { buttonVariants, cn } from "@kscsystem/ui";

/**
 * Przycisk submit w formularzu server-action, który przed wysłaniem pyta o
 * potwierdzenie (window.confirm). Anulowanie blokuje submit.
 */
export function ConfirmSubmit({
  message,
  children,
  className,
  variant = "ghost",
  size = "icon",
}: {
  message: string;
  children: ReactNode;
  className?: string;
  variant?: "ghost" | "secondary" | "outline" | "destructive";
  size?: "icon" | "sm" | "default";
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </button>
  );
}
