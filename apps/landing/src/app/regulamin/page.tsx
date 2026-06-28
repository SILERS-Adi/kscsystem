import { LegalShell } from "@/components/legal-shell";

export const metadata = { title: "Regulamin — KSCSYSTEM" };

export default function TermsPage() {
  return (
    <LegalShell title="Regulamin serwisu" updated="czerwiec 2026">
      <p>
        Regulamin określa zasady korzystania z serwisu sprawdzksc.pl oraz aplikacji KSCSYSTEM. Dokument ma
        charakter bazowy i powinien zostać dostosowany do Twojej oferty i zweryfikowany prawnie.
      </p>

      <h2>1. Definicje</h2>
      <p>Usługodawca — Silers (NIP: 8261941094). Usługa — quiz klasyfikacyjny oraz platforma SaaS do zgodności z KSC/NIS2.</p>

      <h2>2. Zakres usług</h2>
      <ul>
        <li>bezpłatny quiz wstępnej klasyfikacji podmiotu;</li>
        <li>panel SaaS: checklista zgodności, dokumenty, rejestr incydentów, audyty;</li>
        <li>plany subskrypcyjne rozliczane miesięcznie lub rocznie.</li>
      </ul>

      <h2>3. Warunki korzystania</h2>
      <p>
        Korzystanie z konta wymaga rejestracji i akceptacji niniejszego regulaminu. Użytkownik zobowiązuje się
        do podawania prawdziwych danych i nieudostępniania konta osobom nieuprawnionym.
      </p>

      <h2>4. Płatności</h2>
      <p>
        Płatności obsługiwane są przez zewnętrznego operatora. Aktywacja planu następuje po potwierdzeniu
        płatności. Szczegóły cen widoczne są w panelu subskrypcji.
      </p>

      <h2>5. Charakter informacyjny</h2>
      <p>
        Wyniki quizu i narzędzia compliance mają charakter pomocniczy i nie zastępują formalnego audytu ani
        porady prawnej. Odpowiedzialność za zgodność z przepisami spoczywa na podmiocie.
      </p>

      <h2>6. Reklamacje i kontakt</h2>
      <p>Reklamacje i pytania: <a href="mailto:biuro@silers.pl">biuro@silers.pl</a>.</p>
    </LegalShell>
  );
}
