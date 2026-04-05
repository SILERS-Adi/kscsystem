import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const templates = [
  {
    name: "Polityka bezpieczeństwa informacji",
    type: "policy",
    description: "Główna polityka bezpieczeństwa informacji organizacji zgodna z wymaganiami KSC",
    content: `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
<h1 style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px;">POLITYKA BEZPIECZEŃSTWA INFORMACJI</h1>
<p style="text-align: center; color: #666;">{{orgName}}<br/>NIP: {{nip}}<br/>Sektor: {{sector}}</p>
<p style="text-align: center; color: #999; font-size: 12px;">Data sporządzenia: {{date}}</p>

<h2>1. CEL DOKUMENTU</h2>
<p>Niniejsza Polityka Bezpieczeństwa Informacji (zwana dalej „Polityką") określa zasady, cele i zakres zarządzania bezpieczeństwem informacji w organizacji {{orgName}}, zgodnie z wymaganiami ustawy o Krajowym Systemie Cyberbezpieczeństwa.</p>

<h2>2. ZAKRES STOSOWANIA</h2>
<p>Polityka obowiązuje wszystkich pracowników, współpracowników, kontrahentów oraz podmioty trzecie mające dostęp do systemów informacyjnych organizacji.</p>

<h2>3. CELE BEZPIECZEŃSTWA</h2>
<ul>
<li>Zapewnienie poufności, integralności i dostępności informacji</li>
<li>Ochrona przed zagrożeniami wewnętrznymi i zewnętrznymi</li>
<li>Zgodność z ustawą o KSC i innymi regulacjami</li>
<li>Minimalizacja ryzyka incydentów bezpieczeństwa</li>
<li>Ciągłość działania kluczowych usług</li>
</ul>

<h2>4. ZASADY OGÓLNE</h2>
<p>4.1. Wszystkie aktywa informacyjne podlegają klasyfikacji i ochronie adekwatnej do ich wartości.</p>
<p>4.2. Dostęp do informacji odbywa się na zasadzie minimalnych uprawnień (least privilege).</p>
<p>4.3. Wszystkie incydenty bezpieczeństwa muszą być niezwłocznie zgłaszane zgodnie z procedurą zgłaszania incydentów.</p>
<p>4.4. Regularnie przeprowadzane są szkolenia z zakresu cyberbezpieczeństwa.</p>

<h2>5. ODPOWIEDZIALNOŚĆ</h2>
<p>5.1. Zarząd organizacji zatwierdza i nadzoruje realizację Polityki.</p>
<p>5.2. Osoba kontaktowa ds. KSC odpowiada za koordynację działań w zakresie cyberbezpieczeństwa.</p>
<p>5.3. Każdy pracownik jest odpowiedzialny za przestrzeganie zasad bezpieczeństwa w swoim zakresie obowiązków.</p>

<h2>6. PRZEGLĄD I AKTUALIZACJA</h2>
<p>Polityka podlega przeglądowi nie rzadziej niż raz na rok oraz po każdym istotnym incydencie bezpieczeństwa.</p>

<div style="margin-top: 60px; border-top: 1px solid #ccc; padding-top: 20px;">
<p><strong>Zatwierdził:</strong> ___________________________</p>
<p><strong>Data:</strong> {{date}}</p>
<p><strong>Organizacja:</strong> {{orgName}}</p>
</div>
</div>`,
  },
  {
    name: "Procedura reagowania na incydenty",
    type: "procedure",
    description: "Procedura zgłaszania i obsługi incydentów bezpieczeństwa zgodna z KSC (24h/72h)",
    content: `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
<h1 style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px;">PROCEDURA REAGOWANIA NA INCYDENTY BEZPIECZEŃSTWA</h1>
<p style="text-align: center; color: #666;">{{orgName}} · NIP: {{nip}}</p>
<p style="text-align: center; color: #999; font-size: 12px;">Data: {{date}}</p>

<h2>1. CEL</h2>
<p>Procedura określa zasady wykrywania, zgłaszania, analizowania i reagowania na incydenty bezpieczeństwa w {{orgName}}.</p>

<h2>2. DEFINICJE</h2>
<p><strong>Incydent</strong> — zdarzenie, które ma lub może mieć niekorzystny wpływ na cyberbezpieczeństwo.</p>
<p><strong>Incydent poważny</strong> — incydent powodujący lub mogący spowodować poważne zakłócenie świadczenia usługi kluczowej.</p>

<h2>3. KLASYFIKACJA INCYDENTÓW</h2>
<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
<tr style="background: #f5f5f5;"><th style="border: 1px solid #ddd; padding: 8px;">Poziom</th><th style="border: 1px solid #ddd; padding: 8px;">Opis</th><th style="border: 1px solid #ddd; padding: 8px;">Czas reakcji</th></tr>
<tr><td style="border: 1px solid #ddd; padding: 8px; color: red; font-weight: bold;">Krytyczny</td><td style="border: 1px solid #ddd; padding: 8px;">Pełna utrata usługi / wyciek danych</td><td style="border: 1px solid #ddd; padding: 8px;">Natychmiast</td></tr>
<tr><td style="border: 1px solid #ddd; padding: 8px; color: orange; font-weight: bold;">Wysoki</td><td style="border: 1px solid #ddd; padding: 8px;">Częściowa utrata / próba włamania</td><td style="border: 1px solid #ddd; padding: 8px;">1 godzina</td></tr>
<tr><td style="border: 1px solid #ddd; padding: 8px; color: #cc0;">Średni</td><td style="border: 1px solid #ddd; padding: 8px;">Podatność / anomalia</td><td style="border: 1px solid #ddd; padding: 8px;">4 godziny</td></tr>
<tr><td style="border: 1px solid #ddd; padding: 8px;">Niski</td><td style="border: 1px solid #ddd; padding: 8px;">Podejrzana aktywność</td><td style="border: 1px solid #ddd; padding: 8px;">24 godziny</td></tr>
</table>

<h2>4. PROCEDURA ZGŁASZANIA</h2>
<p>4.1. Każdy pracownik po wykryciu incydentu natychmiast informuje osobę kontaktową ds. KSC.</p>
<p>4.2. Wstępne zgłoszenie do CSIRT — <strong>w ciągu 24 godzin</strong> od wykrycia incydentu poważnego.</p>
<p>4.3. Pełny raport do CSIRT — <strong>w ciągu 72 godzin</strong> od zgłoszenia wstępnego.</p>

<h2>5. ETAPY REAGOWANIA</h2>
<ol>
<li><strong>Wykrycie</strong> — identyfikacja i wstępna ocena zdarzenia</li>
<li><strong>Powstrzymanie</strong> — izolacja zagrożenia, minimalizacja szkód</li>
<li><strong>Analiza</strong> — określenie przyczyny, zakresu i wpływu</li>
<li><strong>Eradykacja</strong> — usunięcie przyczyny incydentu</li>
<li><strong>Odtworzenie</strong> — przywrócenie normalnego działania</li>
<li><strong>Wnioski</strong> — dokumentacja i wdrożenie usprawnień</li>
</ol>

<div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px;">
<p><strong>Zatwierdził:</strong> ___________________________ <strong>Data:</strong> {{date}}</p>
</div>
</div>`,
  },
  {
    name: "Rejestr ryzyk",
    type: "register",
    description: "Szablon rejestru ryzyk cyberbezpieczeństwa organizacji",
    content: `<div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px;">
<h1 style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px;">REJESTR RYZYK CYBERBEZPIECZEŃSTWA</h1>
<p style="text-align: center; color: #666;">{{orgName}} · NIP: {{nip}} · Sektor: {{sector}}</p>
<p style="text-align: center; color: #999; font-size: 12px;">Data aktualizacji: {{date}}</p>

<h2>1. WSTĘP</h2>
<p>Niniejszy rejestr zawiera zidentyfikowane ryzyka cyberbezpieczeństwa dla {{orgName}} wraz z oceną prawdopodobieństwa, wpływu oraz planowanymi środkami zaradczymi.</p>

<h2>2. METODOLOGIA</h2>
<p>Ocena ryzyka: Prawdopodobieństwo (1-5) × Wpływ (1-5) = Poziom ryzyka</p>
<p>Akceptowalny poziom ryzyka: ≤ 8 | Wymagający działania: 9-15 | Krytyczny: 16-25</p>

<h2>3. REJESTR RYZYK</h2>
<table style="width: 100%; border-collapse: collapse; font-size: 13px;">
<tr style="background: #2563eb; color: white;">
<th style="border: 1px solid #ddd; padding: 8px;">ID</th>
<th style="border: 1px solid #ddd; padding: 8px;">Ryzyko</th>
<th style="border: 1px solid #ddd; padding: 8px;">Kategoria</th>
<th style="border: 1px solid #ddd; padding: 8px;">P</th>
<th style="border: 1px solid #ddd; padding: 8px;">W</th>
<th style="border: 1px solid #ddd; padding: 8px;">Poziom</th>
<th style="border: 1px solid #ddd; padding: 8px;">Środek zaradczy</th>
<th style="border: 1px solid #ddd; padding: 8px;">Status</th>
</tr>
<tr><td style="border: 1px solid #ddd; padding: 6px;">R-001</td><td style="border: 1px solid #ddd; padding: 6px;">Atak ransomware na systemy krytyczne</td><td style="border: 1px solid #ddd; padding: 6px;">Techniczny</td><td style="border: 1px solid #ddd; padding: 6px; text-align:center;">3</td><td style="border: 1px solid #ddd; padding: 6px; text-align:center;">5</td><td style="border: 1px solid #ddd; padding: 6px; text-align:center; background:#fee2e2;">15</td><td style="border: 1px solid #ddd; padding: 6px;">Backup, segmentacja sieci, EDR</td><td style="border: 1px solid #ddd; padding: 6px;">W realizacji</td></tr>
<tr><td style="border: 1px solid #ddd; padding: 6px;">R-002</td><td style="border: 1px solid #ddd; padding: 6px;">Phishing — wyłudzenie danych dostępowych</td><td style="border: 1px solid #ddd; padding: 6px;">Ludzki</td><td style="border: 1px solid #ddd; padding: 6px; text-align:center;">4</td><td style="border: 1px solid #ddd; padding: 6px; text-align:center;">3</td><td style="border: 1px solid #ddd; padding: 6px; text-align:center; background:#fef9c3;">12</td><td style="border: 1px solid #ddd; padding: 6px;">Szkolenia, MFA, filtr email</td><td style="border: 1px solid #ddd; padding: 6px;">Wdrożone</td></tr>
<tr><td style="border: 1px solid #ddd; padding: 6px;">R-003</td><td style="border: 1px solid #ddd; padding: 6px;">Utrata dostępu do usługi chmurowej</td><td style="border: 1px solid #ddd; padding: 6px;">Dostawca</td><td style="border: 1px solid #ddd; padding: 6px; text-align:center;">2</td><td style="border: 1px solid #ddd; padding: 6px; text-align:center;">4</td><td style="border: 1px solid #ddd; padding: 6px; text-align:center; background:#fef9c3;">8</td><td style="border: 1px solid #ddd; padding: 6px;">Multi-cloud, BCP</td><td style="border: 1px solid #ddd; padding: 6px;">Planowane</td></tr>
<tr><td style="border: 1px solid #ddd; padding: 6px;" colspan="8"><em>Dodaj kolejne ryzyka...</em></td></tr>
</table>

<div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px;">
<p><strong>Sporządził:</strong> ___________________________ <strong>Data:</strong> {{date}}</p>
</div>
</div>`,
  },
  {
    name: "Rejestr dostawców",
    type: "register",
    description: "Rejestr dostawców usług ICT z oceną bezpieczeństwa łańcucha dostaw",
    content: `<div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px;">
<h1 style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px;">REJESTR DOSTAWCÓW USŁUG ICT</h1>
<p style="text-align: center; color: #666;">{{orgName}} · NIP: {{nip}}</p>
<p style="text-align: center; color: #999; font-size: 12px;">Data aktualizacji: {{date}}</p>

<h2>1. CEL</h2>
<p>Rejestr dostawców usług ICT stanowi element zarządzania bezpieczeństwem łańcucha dostaw w {{orgName}}, zgodnie z wymogami ustawy o KSC.</p>

<h2>2. REJESTR DOSTAWCÓW</h2>
<table style="width: 100%; border-collapse: collapse; font-size: 13px;">
<tr style="background: #2563eb; color: white;">
<th style="border: 1px solid #ddd; padding: 8px;">Dostawca</th>
<th style="border: 1px solid #ddd; padding: 8px;">Usługa</th>
<th style="border: 1px solid #ddd; padding: 8px;">Krytyczność</th>
<th style="border: 1px solid #ddd; padding: 8px;">Certyfikaty</th>
<th style="border: 1px solid #ddd; padding: 8px;">Umowa SLA</th>
<th style="border: 1px solid #ddd; padding: 8px;">Ocena ryzyka</th>
<th style="border: 1px solid #ddd; padding: 8px;">Przegląd</th>
</tr>
<tr><td style="border: 1px solid #ddd; padding: 6px;">[Nazwa dostawcy]</td><td style="border: 1px solid #ddd; padding: 6px;">[Hosting / Cloud]</td><td style="border: 1px solid #ddd; padding: 6px;">Wysoka</td><td style="border: 1px solid #ddd; padding: 6px;">ISO 27001</td><td style="border: 1px solid #ddd; padding: 6px;">99.9%</td><td style="border: 1px solid #ddd; padding: 6px;">Niskie</td><td style="border: 1px solid #ddd; padding: 6px;">{{date}}</td></tr>
<tr><td style="border: 1px solid #ddd; padding: 6px;" colspan="7"><em>Dodaj kolejnych dostawców...</em></td></tr>
</table>

<h2>3. KRYTERIA OCENY</h2>
<ul>
<li>Posiadanie certyfikatów bezpieczeństwa (ISO 27001, SOC 2)</li>
<li>Lokalizacja przetwarzania danych (UE/EOG)</li>
<li>Warunki SLA i gwarancje dostępności</li>
<li>Procedury reagowania na incydenty dostawcy</li>
<li>Wyniki audytów bezpieczeństwa</li>
</ul>

<div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px;">
<p><strong>Sporządził:</strong> ___________________________ <strong>Data:</strong> {{date}}</p>
</div>
</div>`,
  },
  {
    name: "Polityka kopii zapasowych",
    type: "policy",
    description: "Polityka tworzenia i zarządzania kopiami zapasowymi systemów informacyjnych",
    content: `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
<h1 style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px;">POLITYKA KOPII ZAPASOWYCH</h1>
<p style="text-align: center; color: #666;">{{orgName}} · NIP: {{nip}} · Sektor: {{sector}}</p>
<p style="text-align: center; color: #999; font-size: 12px;">Data: {{date}}</p>

<h2>1. CEL</h2>
<p>Polityka określa zasady tworzenia, przechowywania i odtwarzania kopii zapasowych w {{orgName}}, zapewniając ciągłość działania i ochronę danych.</p>

<h2>2. ZASADY TWORZENIA KOPII</h2>
<p><strong>Strategia 3-2-1:</strong></p>
<ul>
<li><strong>3</strong> kopie danych (oryginał + 2 kopie)</li>
<li><strong>2</strong> różne nośniki (dysk + chmura/taśma)</li>
<li><strong>1</strong> kopia off-site (poza siedzibą)</li>
</ul>

<h2>3. HARMONOGRAM</h2>
<table style="width: 100%; border-collapse: collapse;">
<tr style="background: #f5f5f5;"><th style="border: 1px solid #ddd; padding: 8px;">Typ kopii</th><th style="border: 1px solid #ddd; padding: 8px;">Częstotliwość</th><th style="border: 1px solid #ddd; padding: 8px;">Retencja</th><th style="border: 1px solid #ddd; padding: 8px;">Lokalizacja</th></tr>
<tr><td style="border: 1px solid #ddd; padding: 8px;">Pełna</td><td style="border: 1px solid #ddd; padding: 8px;">Co tydzień (niedziela)</td><td style="border: 1px solid #ddd; padding: 8px;">90 dni</td><td style="border: 1px solid #ddd; padding: 8px;">On-site + off-site</td></tr>
<tr><td style="border: 1px solid #ddd; padding: 8px;">Przyrostowa</td><td style="border: 1px solid #ddd; padding: 8px;">Codziennie</td><td style="border: 1px solid #ddd; padding: 8px;">30 dni</td><td style="border: 1px solid #ddd; padding: 8px;">On-site</td></tr>
<tr><td style="border: 1px solid #ddd; padding: 8px;">Baza danych</td><td style="border: 1px solid #ddd; padding: 8px;">Co 6 godzin</td><td style="border: 1px solid #ddd; padding: 8px;">14 dni</td><td style="border: 1px solid #ddd; padding: 8px;">On-site + chmura</td></tr>
</table>

<h2>4. TESTOWANIE ODTWARZANIA</h2>
<p>Testy odtwarzania przeprowadzane są co najmniej raz na kwartał. Wyniki testów dokumentowane w rejestrze testów odtwarzania.</p>

<h2>5. SZYFROWANIE</h2>
<p>Wszystkie kopie zapasowe przechowywane off-site lub w chmurze muszą być zaszyfrowane algorytmem AES-256.</p>

<div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px;">
<p><strong>Zatwierdził:</strong> ___________________________ <strong>Data:</strong> {{date}}</p>
</div>
</div>`,
  },
];

async function main() {
  console.log("Seeding document templates...");

  for (const t of templates) {
    const existing = await prisma.documentTemplate.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.documentTemplate.create({
        data: { ...t, status: "published" },
      });
      console.log(`  ✓ ${t.name}`);
    } else {
      console.log(`  – ${t.name} (already exists)`);
    }
  }

  console.log("✅ Document templates seeded!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
