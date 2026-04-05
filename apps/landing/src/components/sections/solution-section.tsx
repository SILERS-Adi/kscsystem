import Link from "next/link";
import { Button, Card, CardContent } from "@kscsystem/ui";
import { ArrowRight, ClipboardCheck, BarChart3, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Wypełnij quiz",
    description: "Odpowiedz na 5 pytań o swojej firmie. Bez rejestracji, bez maili — zajmie Ci to 60 sekund.",
    accent: "from-brand-500 to-brand-400",
  },
  {
    number: "02",
    icon: BarChart3,
    title: "Otrzymaj klasyfikację",
    description: "System automatycznie określi, czy jesteś podmiotem kluczowym, ważnym, czy nie podlegasz pod KSC.",
    accent: "from-brand-400 to-accent-500",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Wdrażaj w systemie",
    description: "Załóż konto i otrzymaj spersonalizowaną checklistę obowiązków, szablony dokumentów i tracking postępu.",
    accent: "from-accent-500 to-accent-400",
  },
];

export function SolutionSection() {
  return (
    <section id="jak-dziala" className="py-20 lg:py-28 border-t border-border relative overflow-hidden">
      {/* Subtle bg accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/[0.04] rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3">Rozwiązanie</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Jedno narzędzie, które prowadzi Cię
            <br />
            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">krok po kroku</span>
          </h2>
          <p className="text-gray-400">
            Nie potrzebujesz konsultanta ani prawnika. KSCSYSTEM przeprowadzi
            Cię przez cały proces — od diagnozy po pełną zgodność.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {steps.map((step) => (
            <Card key={step.number} className="relative group hover:border-brand-500/30 transition-all duration-300 overflow-hidden">
              {/* Top gradient line */}
              <div className={`h-1 bg-gradient-to-r ${step.accent}`} />
              <CardContent className="p-7">
                <span className="text-5xl font-black text-surface-300 absolute top-4 right-5 select-none group-hover:text-surface-400 transition-colors duration-300">
                  {step.number}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 mb-5 group-hover:bg-brand-500/20 transition-colors duration-300">
                  <step.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connector line — desktop only */}
        <div className="hidden lg:block max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between px-[calc(16.67%-8px)]">
            <div className="h-3 w-3 rounded-full bg-brand-500 shadow-lg shadow-brand-500/50" />
            <div className="flex-1 h-[2px] bg-gradient-to-r from-brand-500 to-brand-400 mx-2" />
            <div className="h-3 w-3 rounded-full bg-brand-400 shadow-lg shadow-brand-400/50" />
            <div className="flex-1 h-[2px] bg-gradient-to-r from-brand-400 to-accent-500 mx-2" />
            <div className="h-3 w-3 rounded-full bg-accent-500 shadow-lg shadow-accent-500/50" />
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/quiz">
              Rozpocznij analizę — za darmo
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
