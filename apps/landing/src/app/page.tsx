import Link from "next/link";
import { Button, Card, CardContent, Badge } from "@kscsystem/ui";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { Shield, ClipboardCheck, FileText, ArrowRight, CheckCircle2, Zap, Lock, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <LandingNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Badge variant="default" className="mb-6">
            Nowelizacja ustawy o KSC 2025
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Sprawdź, czy Twoja firma{" "}
            <span className="text-gradient">podlega pod KSC</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            Bezpłatny quiz klasyfikacyjny. W 2 minuty dowiesz się, czy Twoja organizacja
            jest podmiotem kluczowym lub ważnym w rozumieniu ustawy o Krajowym Systemie Cyberbezpieczeństwa.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button size="xl" asChild>
              <Link href="/quiz">
                Rozpocznij quiz
                <ArrowRight size={20} />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="#o-ksc">Dowiedz się więcej</Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-gray-500">Bez rejestracji · Bezpłatnie · Wynik natychmiast</p>
        </div>
      </section>

      {/* How it works */}
      <section id="jak-dziala" className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Jak to działa?</h2>
            <p className="text-gray-400">Trzy proste kroki do pełnej zgodności z KSC</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: ClipboardCheck,
                title: "Wypełnij quiz",
                description: "Odpowiedz na kilka pytań o swojej organizacji. Quiz trwa około 2 minut.",
              },
              {
                step: "02",
                icon: BarChart3,
                title: "Otrzymaj klasyfikację",
                description: "System automatycznie określi, czy Twoja firma jest podmiotem kluczowym, ważnym, czy nie podlega pod KSC.",
              },
              {
                step: "03",
                icon: Shield,
                title: "Zarządzaj zgodnością",
                description: "Skorzystaj z platformy KSCSYSTEM, aby spełnić wszystkie wymagania ustawy krok po kroku.",
              },
            ].map((item) => (
              <Card key={item.step} className="relative overflow-hidden group hover:border-brand-500/30 transition-colors">
                <CardContent className="p-8">
                  <span className="text-5xl font-bold text-surface-300 absolute top-4 right-6">{item.step}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 mb-5">
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border bg-surface-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Platforma KSCSYSTEM</h2>
            <p className="text-gray-400">Wszystko czego potrzebujesz do zgodności z KSC w jednym miejscu</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ClipboardCheck, title: "Checklista obowiązków", desc: "Interaktywna lista wymagań z śledzeniem postępu" },
              { icon: FileText, title: "Szablony dokumentów", desc: "Gotowe szablony polityk i procedur bezpieczeństwa" },
              { icon: Zap, title: "Rejestr incydentów", desc: "Dokumentowanie i zarządzanie incydentami" },
              { icon: Lock, title: "Bezpieczna platforma", desc: "Dane chronione zgodnie z najwyższymi standardami" },
            ].map((f, i) => (
              <Card key={i} className="group hover:border-brand-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 mb-4 group-hover:bg-brand-500/20 transition-colors">
                    <f.icon size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About KSC */}
      <section id="o-ksc" className="py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Czym jest ustawa o KSC?</h2>
          </div>

          <Card>
            <CardContent className="p-8 space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                <strong className="text-white">Krajowy System Cyberbezpieczeństwa (KSC)</strong> to polski odpowiednik
                europejskiej dyrektywy NIS2. Nowelizacja ustawy z 2025 roku znacząco rozszerza zakres podmiotów
                objętych obowiązkami cyberbezpieczeństwa.
              </p>
              <p>
                Podmioty kluczowe i ważne muszą m.in. wdrożyć system zarządzania ryzykiem,
                zgłaszać incydenty do CSIRT, przeprowadzać audyty bezpieczeństwa oraz prowadzić
                dokumentację zgodności.
              </p>
              <p>
                Za nieprzestrzeganie przepisów grożą kary finansowe do <strong className="text-white">10 milionów EUR</strong> lub
                <strong className="text-white"> 2% rocznego obrotu</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Nie czekaj na kontrolę</h2>
          <p className="text-gray-400 mb-8">
            Sprawdź status swojej firmy i zacznij działać zanim będzie za późno.
          </p>
          <Button size="xl" asChild>
            <Link href="/quiz">
              Sprawdź za darmo
              <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
