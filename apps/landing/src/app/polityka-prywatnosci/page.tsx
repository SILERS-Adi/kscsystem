import { LegalShell } from "@/components/legal-shell";

export const metadata = { title: "Polityka prywatności — KSCSYSTEM" };

export default function PrivacyPage() {
  return (
    <LegalShell title="Polityka prywatności" updated="czerwiec 2026">
      <p>
        Niniejsza polityka opisuje zasady przetwarzania danych osobowych użytkowników serwisu sprawdzksc.pl
        oraz aplikacji KSCSYSTEM. Dokument ma charakter informacyjny i powinien zostać zweryfikowany pod kątem
        Twojej działalności.
      </p>

      <h2>1. Administrator danych</h2>
      <p>Administratorem danych jest Silers (NIP: 8261941094). Kontakt: <a href="mailto:biuro@silers.pl">biuro@silers.pl</a>.</p>

      <h2>2. Jakie dane przetwarzamy</h2>
      <ul>
        <li>dane podane w quizie i formularzu kontaktowym (imię, e-mail, dane firmy);</li>
        <li>dane konta w aplikacji (e-mail, imię i nazwisko, organizacja);</li>
        <li>dane techniczne (adres IP, identyfikator sesji, informacje o przeglądarce) na potrzeby analityki.</li>
      </ul>

      <h2>3. Cele i podstawy przetwarzania</h2>
      <ul>
        <li>realizacja usługi i obsługa konta (art. 6 ust. 1 lit. b RODO);</li>
        <li>kontakt i odpowiedź na zapytania (art. 6 ust. 1 lit. f RODO — uzasadniony interes);</li>
        <li>analityka i rozwój serwisu (art. 6 ust. 1 lit. f RODO).</li>
      </ul>

      <h2>4. Okres przechowywania</h2>
      <p>Dane przechowujemy przez czas niezbędny do realizacji celów oraz wynikający z przepisów prawa.</p>

      <h2>5. Twoje prawa</h2>
      <p>
        Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia,
        sprzeciwu oraz wniesienia skargi do Prezesa UODO. Aby skorzystać z praw, napisz na
        <a href="mailto:biuro@silers.pl"> biuro@silers.pl</a>.
      </p>

      <h2>6. Powierzenie i odbiorcy</h2>
      <p>
        Dane mogą być przetwarzane przez zaufanych dostawców (hosting, poczta, obsługa płatności) na podstawie
        umów powierzenia, wyłącznie w zakresie niezbędnym do świadczenia usługi.
      </p>

      <h2>7. Pliki cookies</h2>
      <p>Serwis wykorzystuje cookies oraz lokalny magazyn przeglądarki do analityki i utrzymania sesji.</p>
    </LegalShell>
  );
}
