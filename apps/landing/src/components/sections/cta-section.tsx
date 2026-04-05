import Link from "next/link";
import { Button } from "@kscsystem/ui";
import { ArrowRight, Shield } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28 border-t border-border relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/[0.08] rounded-full blur-[120px]" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white mb-6 shadow-xl shadow-brand-500/30">
          <Shield size={32} />
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Sprawdź swoją firmę teraz
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
          60 sekund quizu. Natychmiastowy wynik. Konkretna lista obowiązków.
          <br />
          Zacznij zanim zacznie się kontrola.
        </p>

        <Button size="xl" asChild>
          <Link href="/quiz">
            Rozpocznij analizę
            <ArrowRight size={20} />
          </Link>
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          Bezpłatnie · Bez rejestracji · Bez zobowiązań
        </p>
      </div>
    </section>
  );
}
