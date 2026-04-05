import Link from "next/link";
import { Button, Badge } from "@kscsystem/ui";
import { ArrowRight, Play } from "lucide-react";
import { DashboardMock } from "./dashboard-mock";

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-500/[0.03] via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-500/[0.07] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-500/[0.05] rounded-full blur-[100px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div>
            <Badge variant="default" className="mb-6">
              Nowelizacja ustawy o KSC 2025
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Sprawdź w 60 sekund
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-accent-400 bg-clip-text text-transparent">
                czy Twoja firma podlega KSC
              </span>
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-xl">
              Odpowiedz na kilka pytań i dowiedz się, jakie obowiązki musisz
              spełnić — bez konsultantów i skomplikowanego prawa.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Button size="xl" asChild>
                <Link href="/quiz">
                  Rozpocznij analizę
                  <ArrowRight size={20} />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="#jak-dziala">
                  <Play size={16} className="text-brand-400" />
                  Zobacz jak to działa
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                Bezpłatnie
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                Bez rejestracji
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                Wynik natychmiast
              </span>
            </div>
          </div>

          {/* Right — dashboard mock */}
          <div className="hidden lg:flex justify-end">
            <DashboardMock />
          </div>
        </div>
      </div>
    </section>
  );
}
