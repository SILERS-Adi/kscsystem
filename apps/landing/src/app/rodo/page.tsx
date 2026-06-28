import { LegalShell } from "@/components/legal-shell";

export const metadata = { title: "RODO — Obowiązek informacyjny — KSCSYSTEM" };

export default function RodoPage() {
  return (
    <LegalShell title="Obowiązek informacyjny (RODO)" updated="czerwiec 2026">
      <p>
        Zgodnie z art. 13 RODO informujemy o zasadach przetwarzania danych osobowych przekazanych w serwisie
        sprawdzksc.pl i aplikacji KSCSYSTEM.
      </p>

      <h2>Administrator</h2>
      <p>Silers (NIP: 8261941094), kontakt: <a href="mailto:biuro@silers.pl">biuro@silers.pl</a>.</p>

      <h2>Cele i podstawy prawne</h2>
      <ul>
        <li>obsługa zapytań i quizu — uzasadniony interes administratora (art. 6 ust. 1 lit. f);</li>
        <li>realizacja umowy/usługi — art. 6 ust. 1 lit. b;</li>
        <li>obowiązki prawne (np. rozliczenia) — art. 6 ust. 1 lit. c.</li>
      </ul>

      <h2>Prawa osoby, której dane dotyczą</h2>
      <ul>
        <li>dostęp do danych i ich kopii;</li>
        <li>sprostowanie, usunięcie, ograniczenie przetwarzania;</li>
        <li>przenoszenie danych i sprzeciw;</li>
        <li>skarga do Prezesa Urzędu Ochrony Danych Osobowych.</li>
      </ul>

      <h2>Dobrowolność podania danych</h2>
      <p>Podanie danych jest dobrowolne, lecz niezbędne do skorzystania z odpowiednich funkcji serwisu.</p>

      <h2>Kontakt w sprawie danych</h2>
      <p>Wnioski dotyczące danych osobowych prosimy kierować na <a href="mailto:biuro@silers.pl">biuro@silers.pl</a>.</p>

      <p className="text-xs text-gray-500">
        Dokument bazowy — przed publikacją produkcyjną zalecana weryfikacja przez specjalistę ds. ochrony danych.
      </p>
    </LegalShell>
  );
}
