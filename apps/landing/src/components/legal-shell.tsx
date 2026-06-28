import type { ReactNode } from "react";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";

export function LegalShell({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <LandingNav />
      <div className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          {updated && <p className="text-xs text-gray-500 mb-8">Ostatnia aktualizacja: {updated}</p>}
          <div className="space-y-4 text-sm text-gray-300 leading-relaxed [&_h2]:text-white [&_h2]:font-semibold [&_h2]:text-base [&_h2]:mt-6 [&_h2]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:underline">
            {children}
          </div>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}
