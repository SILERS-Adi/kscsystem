/**
 * Seed modułu "Audyt Startowy" (Gap Analysis).
 * Tworzy szablon audytu z 14 sekcjami i pytaniami.
 * Uruchom: npm run db:seed-audit  (lub importowany z seed.ts)
 */
import { prisma } from "./index";

type Sev = "critical" | "high" | "medium" | "low";
type Input = "status" | "number" | "text";

interface Q {
  code: string;
  text: string;
  weight?: number;
  severity?: Sev;
  input?: Input;
  help?: string;
  rec?: string;
}
interface S {
  code: string;
  title: string;
  description?: string;
  questions: Q[];
}

const TEMPLATE_NAME = "Audyt Startowy KSC";
const TEMPLATE_VERSION = 1;

const SECTIONS: S[] = [
  {
    code: "org_info",
    title: "Informacje o organizacji",
    description: "Podstawowe dane kontekstowe — nie wpływają na scoring dojrzałości.",
    questions: [
      { code: "org_employees", text: "Liczba pracowników", input: "number" },
      { code: "org_locations", text: "Liczba lokalizacji", input: "number" },
      { code: "org_industry", text: "Branża", input: "text" },
      { code: "org_external_it", text: "Zewnętrzna firma IT (nazwa lub „—")", input: "text" },
      { code: "org_security_owner", text: "Osoba odpowiedzialna za cyberbezpieczeństwo", input: "text" },
    ],
  },
  {
    code: "assets",
    title: "Inwentaryzacja zasobów",
    description: "Czy zasoby są zinwentaryzowane i objęte nadzorem.",
    questions: [
      { code: "assets_computers", text: "Zinwentaryzowane stacje robocze / komputery", severity: "medium" },
      { code: "assets_servers", text: "Zinwentaryzowane serwery", severity: "high" },
      { code: "assets_nas", text: "Zinwentaryzowane urządzenia NAS", severity: "medium" },
      { code: "assets_m365", text: "Wykorzystywany i nadzorowany Microsoft 365", severity: "medium" },
      { code: "assets_gworkspace", text: "Wykorzystywany i nadzorowany Google Workspace", severity: "low" },
      { code: "assets_network", text: "Zinwentaryzowane urządzenia sieciowe", severity: "medium" },
      { code: "assets_cameras", text: "Zinwentaryzowane kamery (CCTV)", severity: "low" },
      { code: "assets_nvr", text: "Zinwentaryzowane rejestratory (NVR/DVR)", severity: "low" },
    ],
  },
  {
    code: "network",
    title: "Architektura sieci",
    questions: [
      { code: "net_vlan", text: "Wdrożone VLAN-y", severity: "medium" },
      { code: "net_segmentation", text: "Segmentacja sieci", severity: "high", rec: "Wdrożyć segmentację sieci oddzielającą krytyczne systemy." },
      { code: "net_cctv_sep", text: "Oddzielna sieć dla CCTV", severity: "medium" },
      { code: "net_guest_wifi", text: "Oddzielna sieć dla WiFi gości", severity: "low" },
      { code: "net_voip_sep", text: "Oddzielna sieć dla VoIP", severity: "low" },
      { code: "net_ot_sep", text: "Oddzielna sieć dla systemów produkcyjnych (OT)", severity: "high" },
      { code: "net_vpn", text: "Dostęp przez VPN", severity: "medium" },
      { code: "net_remote", text: "Kontrolowany dostęp zdalny", severity: "high", rec: "Zabezpieczyć dostęp zdalny (VPN + MFA, ograniczenie ekspozycji)." },
    ],
  },
  {
    code: "identity",
    title: "Zarządzanie tożsamością",
    questions: [
      { code: "id_individual_accounts", text: "Indywidualne konta użytkowników", severity: "high" },
      { code: "id_admin_accounts", text: "Wydzielone konta administratorów", severity: "high" },
      { code: "id_mfa", text: "MFA (uwierzytelnianie wieloskładnikowe)", weight: 2, severity: "critical", rec: "Włączyć MFA dla wszystkich kont, priorytetowo administracyjnych i poczty." },
      { code: "id_password_policy", text: "Polityka haseł", severity: "high" },
      { code: "id_password_manager", text: "Menedżer haseł", severity: "medium" },
    ],
  },
  {
    code: "endpoint",
    title: "Bezpieczeństwo stacji roboczych",
    questions: [
      { code: "ep_antivirus", text: "Antywirus na stacjach", weight: 2, severity: "critical", rec: "Wdrożyć i monitorować ochronę antywirusową na wszystkich stacjach." },
      { code: "ep_edr", text: "EDR (Endpoint Detection & Response)", severity: "high" },
      { code: "ep_updates", text: "Regularne aktualizacje systemów i oprogramowania", weight: 2, severity: "high", rec: "Wdrożyć proces zarządzania aktualizacjami (patch management)." },
      { code: "ep_bitlocker", text: "Szyfrowanie dysków (BitLocker)", severity: "high" },
      { code: "ep_firewall", text: "Firewall na stacjach", severity: "medium" },
    ],
  },
  {
    code: "backup",
    title: "Kopie zapasowe",
    questions: [
      { code: "bk_servers", text: "Backup serwerów", weight: 2, severity: "critical", rec: "Wdrożyć regularny, monitorowany backup serwerów." },
      { code: "bk_m365", text: "Backup Microsoft 365", severity: "high", rec: "Wdrożyć backup danych Microsoft 365 (poczta, OneDrive, SharePoint)." },
      { code: "bk_databases", text: "Backup baz danych", severity: "high" },
      { code: "bk_321", text: "Zasada 3-2-1 (3 kopie, 2 nośniki, 1 offsite)", severity: "high" },
      { code: "bk_restore_test", text: "Testy odtwarzania kopii", weight: 2, severity: "critical", rec: "Wprowadzić cykliczne testy odtwarzania kopii zapasowych." },
    ],
  },
  {
    code: "risk",
    title: "Zarządzanie ryzykiem",
    questions: [
      { code: "rk_analysis", text: "Przeprowadzona analiza ryzyka", weight: 2, severity: "high", rec: "Przeprowadzić formalną analizę ryzyka cyberbezpieczeństwa." },
      { code: "rk_methodology", text: "Przyjęta metodologia analizy ryzyka", severity: "medium" },
      { code: "rk_register", text: "Prowadzony rejestr ryzyk", severity: "medium" },
      { code: "rk_treatment", text: "Plan postępowania z ryzykiem", severity: "high" },
    ],
  },
  {
    code: "docs",
    title: "Dokumentacja",
    questions: [
      { code: "doc_security_policy", text: "Polityka bezpieczeństwa informacji", weight: 2, severity: "high", rec: "Opracować i zatwierdzić politykę bezpieczeństwa informacji." },
      { code: "doc_incident_proc", text: "Procedura obsługi incydentów", weight: 2, severity: "critical", rec: "Opracować procedurę obsługi i zgłaszania incydentów." },
      { code: "doc_bcp", text: "Plan ciągłości działania (BCP)", severity: "high" },
      { code: "doc_drp", text: "Plan odtwarzania po awarii (DRP)", severity: "high" },
      { code: "doc_backup_policy", text: "Polityka kopii zapasowych", severity: "medium" },
      { code: "doc_asset_register", text: "Rejestr aktywów", severity: "medium" },
      { code: "doc_supplier_register", text: "Rejestr dostawców", severity: "low" },
      { code: "doc_incident_register", text: "Rejestr incydentów", severity: "medium" },
    ],
  },
  {
    code: "continuity",
    title: "Ciągłość działania",
    questions: [
      { code: "co_ups", text: "Zasilanie awaryjne (UPS)", severity: "medium" },
      { code: "co_internet_redundancy", text: "Redundancja łącza internetowego", severity: "medium" },
      { code: "co_ha", text: "Wysoka dostępność kluczowych systemów (HA)", severity: "medium" },
      { code: "co_rto", text: "Określony czas odtworzenia usług (RTO)", severity: "high" },
    ],
  },
  {
    code: "supply_chain",
    title: "Łańcuch dostaw",
    questions: [
      { code: "sc_it_suppliers", text: "Zidentyfikowani dostawcy IT", severity: "medium" },
      { code: "sc_operators", text: "Zidentyfikowani operatorzy / usługodawcy", severity: "low" },
      { code: "sc_sla", text: "Umowy SLA z dostawcami", severity: "medium" },
      { code: "sc_emergency", text: "Procedury awaryjne wobec dostawców", severity: "medium" },
    ],
  },
  {
    code: "incidents",
    title: "Obsługa incydentów",
    questions: [
      { code: "in_report_proc", text: "Procedura zgłaszania incydentów", weight: 2, severity: "critical", rec: "Opracować procedurę zgłaszania incydentów (wewnętrzną i do CSIRT)." },
      { code: "in_contact_person", text: "Wyznaczona osoba kontaktowa ds. incydentów", severity: "high" },
      { code: "in_escalation", text: "Zdefiniowana ścieżka eskalacji", severity: "medium" },
      { code: "in_deadlines", text: "Znajomość terminów zgłoszeń (24h / 72h)", weight: 2, severity: "high", rec: "Przeszkolić zespół ze ustawowych terminów zgłaszania incydentów (24h/72h)." },
    ],
  },
  {
    code: "training",
    title: "Szkolenia",
    questions: [
      { code: "tr_employees", text: "Szkolenia pracowników z cyberbezpieczeństwa", weight: 2, severity: "high", rec: "Wprowadzić cykliczne szkolenia pracowników." },
      { code: "tr_management", text: "Szkolenia kadry zarządzającej", severity: "medium" },
      { code: "tr_phishing", text: "Kampanie phishing awareness", severity: "medium" },
      { code: "tr_register", text: "Rejestr szkoleń", severity: "low" },
    ],
  },
  {
    code: "prev_audits",
    title: "Audyty",
    questions: [
      { code: "au_last", text: "Przeprowadzony poprzedni audyt bezpieczeństwa", severity: "medium", input: "text", help: "Data / zakres ostatniego audytu lub „brak”." },
      { code: "au_recommendations", text: "Zalecenia z poprzedniego audytu są udokumentowane", severity: "medium" },
      { code: "au_status", text: "Status realizacji zaleceń jest monitorowany", severity: "medium" },
    ],
  },
  {
    code: "tech_verification",
    title: "Weryfikacja techniczna",
    description: "Sekcja przygotowana pod przyszłą automatyczną weryfikację przez agenta InfraDesk. Na razie ocena ręczna.",
    questions: [
      { code: "tv_defender", text: "Microsoft Defender aktywny", severity: "high" },
      { code: "tv_bitlocker", text: "BitLocker włączony", severity: "high" },
      { code: "tv_firewall", text: "Firewall włączony", severity: "medium" },
      { code: "tv_updates", text: "Aktualizacje zainstalowane", severity: "high" },
      { code: "tv_backup", text: "Backup działa i jest weryfikowany", severity: "critical" },
      { code: "tv_mfa", text: "MFA wymuszone technicznie", severity: "critical" },
      { code: "tv_ad", text: "Active Directory skonfigurowane bezpiecznie", severity: "high" },
      { code: "tv_vpn", text: "VPN skonfigurowany", severity: "medium" },
      { code: "tv_vlan", text: "VLAN-y skonfigurowane", severity: "medium" },
      { code: "tv_network_devices", text: "Urządzenia sieciowe zaktualizowane i zabezpieczone", severity: "medium" },
    ],
  },
];

export async function seedAudit() {
  const template = await prisma.auditTemplate.upsert({
    where: { name_version: { name: TEMPLATE_NAME, version: TEMPLATE_VERSION } },
    update: { description: "Startowy audyt cyberbezpieczeństwa organizacji (Gap Analysis)." },
    create: {
      name: TEMPLATE_NAME,
      version: TEMPLATE_VERSION,
      description: "Startowy audyt cyberbezpieczeństwa organizacji (Gap Analysis).",
    },
  });

  // Idempotencja: jeśli szablon ma już sekcje, nie ruszamy (bezpieczne w deployu).
  const existing = await prisma.auditSection.count({ where: { templateId: template.id } });
  if (existing > 0) {
    console.log(`✓ Audyt: szablon "${TEMPLATE_NAME}" v${TEMPLATE_VERSION} już zaseedowany (${existing} sekcji) — pomijam`);
    return;
  }

  let sIdx = 0;
  for (const section of SECTIONS) {
    sIdx++;
    await prisma.auditSection.create({
      data: {
        templateId: template.id,
        code: section.code,
        title: section.title,
        description: section.description ?? null,
        sortOrder: sIdx,
        questions: {
          create: section.questions.map((q, i) => ({
            code: q.code,
            text: q.text,
            helpText: q.help ?? null,
            weight: q.weight ?? 1,
            severity: q.severity ?? "medium",
            inputType: q.input ?? "status",
            recommendation: q.rec ?? null,
            sortOrder: i + 1,
          })),
        },
      },
    });
  }

  const qCount = SECTIONS.reduce((n, s) => n + s.questions.length, 0);
  console.log(`✓ Audyt: szablon "${TEMPLATE_NAME}" v${TEMPLATE_VERSION} — ${SECTIONS.length} sekcji, ${qCount} pytań`);
}

// Pozwól uruchomić samodzielnie
if (process.argv[1] && process.argv[1].includes("seed-audit")) {
  seedAudit()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
