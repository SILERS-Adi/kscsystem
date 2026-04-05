import { Logo } from "@kscsystem/ui";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo size="sm" />
            <p className="mt-3 text-sm text-gray-400 max-w-sm">
              Platforma zgodności z ustawą o Krajowym Systemie Cyberbezpieczeństwa. Pomagamy polskim firmom spełnić wymagania KSC.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Produkt</h4>
            <ul className="space-y-2">
              <li><Link href="/quiz" className="text-sm text-gray-400 hover:text-white transition-colors">Quiz klasyfikacyjny</Link></li>
              <li><Link href="https://kscsystem.pl" className="text-sm text-gray-400 hover:text-white transition-colors">Platforma SaaS</Link></li>
              <li><Link href="/kontakt" className="text-sm text-gray-400 hover:text-white transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Informacje</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Polityka prywatności</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Regulamin</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">RODO</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-gray-500">&copy; 2026 KSCSYSTEM by Silers. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}
