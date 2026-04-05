"use client";

import Link from "next/link";
import { Logo, Button } from "@kscsystem/ui";

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo size="sm" />

        <div className="hidden md:flex items-center gap-8">
          <Link href="#jak-dziala" className="text-sm text-gray-400 hover:text-white transition-colors">
            Jak to działa
          </Link>
          <Link href="#o-ksc" className="text-sm text-gray-400 hover:text-white transition-colors">
            O ustawie KSC
          </Link>
          <Link href="/kontakt" className="text-sm text-gray-400 hover:text-white transition-colors">
            Kontakt
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="https://kscsystem.pl/login">Zaloguj się</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/quiz">Sprawdź teraz</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
