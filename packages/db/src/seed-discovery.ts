/**
 * Seed szablonu "Rozpoznanie infrastruktury" (Discovery / Onboarding).
 * Inwentaryzacja środowiska klienta przy wejściu do firmy — dane tekstowe/liczbowe,
 * NIE scoring dojrzałości (to robi "Audyt Startowy KSC"). Oba szablony się uzupełniają.
 * Uruchom: npm run db:seed-discovery  (lub importowany z deployu).
 *
 * Patrz: docs/rozpoznanie-klienta-infrastruktura.md
 */
import { prisma } from "./index";

type Input = "status" | "number" | "text";

interface Q {
  code: string;
  text: string;
  input?: Input; // domyślnie "text" (rozpoznanie = zbieranie faktów)
  help?: string;
  severity?: "critical" | "high" | "medium" | "low";
}
interface S {
  code: string;
  title: string;
  description?: string;
  questions: Q[];
}

const TEMPLATE_NAME = "Rozpoznanie infrastruktury";
const TEMPLATE_VERSION = 1;

// input domyślnie "text"; severity tylko informacyjne (rozpoznanie nie liczy scoringu)
const SECTIONS: S[] = [
  // ---------------- A. KONTEKST ORGANIZACJI ----------------
  {
    code: "disc_org",
    title: "A1. Dane podstawowe organizacji",
    questions: [
      { code: "d_org_name", text: "Pełna nazwa, NIP, REGON, KRS" },
      { code: "d_org_address", text: "Adres siedziby i adresy korespondencyjne" },
      { code: "d_org_pkd", text: "Branża / sektor (PKD)" },
      { code: "d_org_ksc_scope", text: "Czy podmiot objęty KSC/NIS2 (kluczowy / ważny / poza)?", severity: "high" },
      { code: "d_org_employees", text: "Liczba pracowników (etaty + współpracownicy)", input: "number" },
      { code: "d_org_users", text: "Liczba użytkowników systemów IT (konta)", input: "number" },
      { code: "d_org_hours", text: "Godziny pracy / krytyczne okna działania (np. 24/7)" },
      { code: "d_org_peak", text: "Sezonowość / okresy szczytu" },
    ],
  },
  {
    code: "disc_sites",
    title: "A2. Lokalizacje i oddziały",
    questions: [
      { code: "d_sites_count", text: "Liczba lokalizacji", input: "number" },
      { code: "d_sites_list", text: "Lista lokalizacji: adres, rola, liczba osób, czy serwerownia" },
      { code: "d_sites_link", text: "Sposób połączenia oddziałów (VPN site-to-site, MPLS, SD-WAN, brak)" },
      { code: "d_sites_remote", text: "Lokalizacje pracy zdalnej / home office (skala)" },
    ],
  },
  {
    code: "disc_people",
    title: "A3. Osoby i role",
    questions: [
      { code: "d_ppl_owner", text: "Osoba decyzyjna (właściciel/zarząd) — imię, kontakt" },
      { code: "d_ppl_it", text: "Osoba odpowiedzialna za IT (wewnętrzna)" },
      { code: "d_ppl_security", text: "Osoba odpowiedzialna za cyberbezpieczeństwo (pełnomocnik KSC)", severity: "high" },
      { code: "d_ppl_dpo", text: "IOD / IODO (RODO)" },
      { code: "d_ppl_msp", text: "Zewnętrzna firma IT / MSP — nazwa, zakres, kontakt" },
      { code: "d_ppl_incident", text: "Osoba kontaktowa ds. incydentów + zastępca", severity: "high" },
    ],
  },
  {
    code: "disc_compliance",
    title: "A4. Zgodność i regulacje",
    questions: [
      { code: "d_cmp_regs", text: "Obowiązujące regulacje (KSC/NIS2, RODO, ISO 27001, PCI-DSS, sektorowe)", severity: "high" },
      { code: "d_cmp_sensitive", text: "Przetwarzane dane wrażliwe / szczególne kategorie", severity: "high" },
      { code: "d_cmp_contract", text: "Wymogi umowne klientów dot. bezpieczeństwa" },
      { code: "d_cmp_certs", text: "Wcześniejsze certyfikaty / audyty zgodności" },
    ],
  },

  // ---------------- B. ŁĄCZNOŚĆ I SIEĆ ----------------
  {
    code: "disc_wan",
    title: "B1. Łącza internetowe (WAN)",
    questions: [
      { code: "d_wan_list", text: "Lista łączy: operator, typ, przepustowość ↓/↑, lokalizacja" },
      { code: "d_wan_redundancy", text: "Łącze podstawowe vs zapasowe (failover automatyczny?)", severity: "high" },
      { code: "d_wan_staticip", text: "Statyczne adresy IP publiczne (ile, zakresy)" },
      { code: "d_wan_sla", text: "Umowy SLA z ISP (czas naprawy, gwarancje)" },
      { code: "d_wan_router_owner", text: "Kto zarządza routerem brzegowym ISP (operator/klient)" },
    ],
  },
  {
    code: "disc_dns",
    title: "B2. Adresacja publiczna, DNS, domeny",
    questions: [
      { code: "d_dns_domains", text: "Domeny (lista, rejestrator, daty wygaśnięcia)", severity: "high" },
      { code: "d_dns_host", text: "Gdzie hostowany DNS (operator, Cloudflare, self-hosted)" },
      { code: "d_dns_public", text: "Rekordy publiczne: WWW, MX, inne usługi wystawione", severity: "high" },
      { code: "d_dns_ssl", text: "Certyfikaty SSL/TLS (dostawca, ważność, auto-odnawianie)" },
      { code: "d_dns_exposed", text: "Usługi wystawione publicznie (RDP, VPN, kamery, panele) — pełna lista", severity: "critical" },
    ],
  },
  {
    code: "disc_fw",
    title: "B3. Urządzenia brzegowe / firewall",
    questions: [
      { code: "d_fw_model", text: "Firewall/UTM: producent, model, wersja firmware", severity: "high" },
      { code: "d_fw_subscription", text: "Czy firewall objęty wsparciem/subskrypcją (IPS, filtrowanie)?", input: "status", severity: "high" },
      { code: "d_fw_portfwd", text: "Reguły dostępu z zewnątrz (port forwarding) — wykaz", severity: "high" },
      { code: "d_fw_webfilter", text: "Filtrowanie treści / kategorii WWW?", input: "status" },
      { code: "d_fw_logs", text: "Logi firewalla (gdzie, jak długo)" },
    ],
  },
  {
    code: "disc_lan",
    title: "B4. Sieć LAN — przełączniki i okablowanie",
    questions: [
      { code: "d_lan_switches", text: "Przełączniki: producent, modele, liczba portów, zarządzalne?" },
      { code: "d_lan_topology", text: "Topologia sieci (czy istnieje schemat/dokumentacja)" },
      { code: "d_lan_cabling", text: "Standard okablowania (kat. 5e/6/6a, światłowód między budynkami)" },
      { code: "d_lan_racks", text: "Szafy/punkty dystrybucyjne (lokalizacje, zabezpieczenie fizyczne)" },
      { code: "d_lan_poe", text: "PoE (zasilanie urządzeń przez sieć)?", input: "status" },
    ],
  },
  {
    code: "disc_vlan",
    title: "B5. Adresacja, VLAN, segmentacja",
    questions: [
      { code: "d_vlan_ip", text: "Schemat adresacji IP (podsieci, zakresy)" },
      { code: "d_vlan_dhcp", text: "Serwer DHCP (gdzie, zakresy, rezerwacje)" },
      { code: "d_vlan_list", text: "Wdrożone VLAN-y (lista i przeznaczenie)", severity: "high" },
      { code: "d_vlan_segments", text: "Segmentacja: oddzielne sieci dla serwerów / użytkowników / gości / CCTV / VoIP / OT", severity: "high" },
      { code: "d_vlan_rules", text: "Reguły ruchu między segmentami (kto z kim)", severity: "high" },
    ],
  },
  {
    code: "disc_wifi",
    title: "B6. Sieć bezprzewodowa (WiFi)",
    questions: [
      { code: "d_wifi_ap", text: "Punkty dostępowe: producent, modele, liczba, kontroler" },
      { code: "d_wifi_ssid", text: "Sieci SSID i ich przeznaczenie (firmowa, gości, IoT)" },
      { code: "d_wifi_auth", text: "Zabezpieczenie (WPA2/WPA3, Enterprise/802.1X vs hasło)", severity: "high" },
      { code: "d_wifi_guest_iso", text: "Izolacja sieci gości od firmowej?", input: "status", severity: "high" },
      { code: "d_wifi_coverage", text: "Pokrycie / problemy z zasięgiem" },
    ],
  },
  {
    code: "disc_remote",
    title: "B7. Dostęp zdalny / VPN",
    questions: [
      { code: "d_rem_vpn", text: "Rozwiązanie VPN (typ, producent, klient)", severity: "high" },
      { code: "d_rem_who", text: "Kto ma dostęp zdalny (pracownicy, dostawcy, serwis)" },
      { code: "d_rem_mfa", text: "MFA na VPN?", input: "status", severity: "high" },
      { code: "d_rem_rdp", text: "Wystawione RDP/pulpit zdalny bezpośrednio do internetu?", input: "status", severity: "critical" },
      { code: "d_rem_tools", text: "Narzędzia zdalnego wsparcia (TeamViewer, AnyDesk, RMM)" },
    ],
  },

  // ---------------- C. SERWERY, WIRTUALIZACJA, STORAGE ----------------
  {
    code: "disc_servers",
    title: "C1. Serwery i wirtualizacja",
    questions: [
      { code: "d_srv_physical", text: "Serwery fizyczne: producent, model, rok, lokalizacja, gwarancja" },
      { code: "d_srv_hypervisor", text: "Platforma wirtualizacji (Hyper-V, VMware, Proxmox) i wersja" },
      { code: "d_srv_vms", text: "Maszyny wirtualne: nazwa, rola, system, zasoby" },
      { code: "d_srv_os", text: "Systemy operacyjne serwerów + wersje (uwaga na EOL)", severity: "high" },
      { code: "d_srv_roles", text: "Krytyczne role (AD, plikowy, aplikacyjny, bazodanowy, terminalowy)", severity: "high" },
    ],
  },
  {
    code: "disc_ad",
    title: "C2. Active Directory / katalog / domena",
    questions: [
      { code: "d_ad_domain", text: "Czy jest domena AD (nazwa, poziom funkcjonalny)" },
      { code: "d_ad_dc", text: "Liczba kontrolerów domeny i ich lokalizacje", severity: "high" },
      { code: "d_ad_entra", text: "Integracja z Entra ID / Azure AD (hybryda)" },
      { code: "d_ad_gpo", text: "Zasady grupowe (GPO) — czy udokumentowane?", input: "status" },
      { code: "d_ad_dnsdhcp", text: "DNS/DHCP wewnętrzny (gdzie obsługiwany)" },
    ],
  },
  {
    code: "disc_storage",
    title: "C3. Pamięć masowa / NAS / SAN",
    questions: [
      { code: "d_st_devices", text: "NAS/SAN: producent, model, pojemność, RAID, lokalizacja" },
      { code: "d_st_purpose", text: "Przeznaczenie (pliki, backup, CCTV, archiwum)" },
      { code: "d_st_share", text: "Sposób udostępniania (SMB/NFS/iSCSI) i uprawnienia" },
      { code: "d_st_exposed", text: "Czy NAS wystawiony do internetu?", input: "status", severity: "high" },
      { code: "d_st_capacity", text: "Wykorzystanie pojemności / przewidywany przyrost" },
    ],
  },
  {
    code: "disc_db",
    title: "C4. Bazy danych",
    questions: [
      { code: "d_db_engines", text: "Silniki baz (MS SQL, PostgreSQL, MySQL, Oracle) + wersje" },
      { code: "d_db_apps", text: "Aplikacje korzystające z baz" },
      { code: "d_db_where", text: "Gdzie działają (serwer fizyczny/VM/chmura)" },
      { code: "d_db_backup", text: "Backup baz (sposób, częstotliwość)", severity: "high" },
      { code: "d_db_encrypt", text: "Szyfrowanie danych w bazie?", input: "status" },
    ],
  },

  // ---------------- D. STACJE, URZĄDZENIA, PERYFERIA ----------------
  {
    code: "disc_endpoints",
    title: "D1. Stacje robocze i laptopy",
    questions: [
      { code: "d_ep_count", text: "Liczba stacji stacjonarnych i laptopów", input: "number" },
      { code: "d_ep_os", text: "Systemy operacyjne i wersje (Win 10/11, macOS, Linux)", severity: "high" },
      { code: "d_ep_eol", text: "Najstarszy sprzęt / urządzenia poza wsparciem" },
      { code: "d_ep_mgmt", text: "Model zarządzania (domena, Intune/MDM, ręcznie)" },
      { code: "d_ep_localadmin", text: "Czy użytkownicy mają uprawnienia administratora lokalnego?", input: "status", severity: "high" },
    ],
  },
  {
    code: "disc_mobile",
    title: "D2. Urządzenia mobilne / BYOD",
    questions: [
      { code: "d_mob_devices", text: "Telefony/tablety służbowe (liczba, systemy)" },
      { code: "d_mob_mdm", text: "Zarządzanie (MDM/MAM — Intune, inne)" },
      { code: "d_mob_byod", text: "Dostęp do poczty/danych z urządzeń prywatnych (BYOD)?", input: "status", severity: "high" },
      { code: "d_mob_wipe", text: "Polityka zdalnego wymazania przy utracie urządzenia?", input: "status" },
    ],
  },
  {
    code: "disc_print",
    title: "D3. Drukarki i urządzenia wielofunkcyjne",
    questions: [
      { code: "d_pr_list", text: "Lista urządzeń: producent, model, sieciowe/lokalne, lokalizacja" },
      { code: "d_pr_scan", text: "Skanowanie do e-mail/folderu (konfiguracja, poświadczenia)" },
      { code: "d_pr_disk", text: "Dyski w MFP (szyfrowanie, kasowanie)" },
      { code: "d_pr_service", text: "Serwis/dzierżawa (dostawca, umowa)" },
    ],
  },
  {
    code: "disc_voip",
    title: "D4. Telefonia / VoIP",
    questions: [
      { code: "d_voip_system", text: "System telefoniczny (IP-PBX, chmura, operator)" },
      { code: "d_voip_numbers", text: "Liczba numerów/linii i aparatów" },
      { code: "d_voip_vlan", text: "Oddzielna sieć/VLAN dla VoIP?", input: "status" },
      { code: "d_voip_provider", text: "Dostawca usług głosowych i SLA" },
    ],
  },

  // ---------------- E. CHMURA, POCZTA, APLIKACJE ----------------
  {
    code: "disc_cloudid",
    title: "E1. Tożsamość chmurowa (M365 / Google Workspace)",
    questions: [
      { code: "d_cid_provider", text: "Główny dostawca produktywności (M365, Google Workspace, inny)" },
      { code: "d_cid_licenses", text: "Liczba i typy licencji" },
      { code: "d_cid_admins", text: "Konto administratora globalnego — kto, ile kont admina", severity: "high" },
      { code: "d_cid_mfa", text: "MFA wymuszone dla wszystkich / dla adminów?", input: "status", severity: "high" },
      { code: "d_cid_ca", text: "Polityki dostępu warunkowego (Conditional Access)?", input: "status" },
    ],
  },
  {
    code: "disc_email",
    title: "E2. Poczta e-mail",
    questions: [
      { code: "d_em_host", text: "Gdzie hostowana poczta (Exchange Online, Google, własny serwer)", severity: "high" },
      { code: "d_em_spf", text: "Rekordy SPF / DKIM / DMARC skonfigurowane?", input: "status", severity: "high" },
      { code: "d_em_antispam", text: "Ochrona antyspam/antyphishing (rozwiązanie)" },
      { code: "d_em_archive", text: "Archiwizacja poczty / retencja" },
      { code: "d_em_forward", text: "Reguły przekierowań na zewnątrz (wektor wycieku)", severity: "high" },
    ],
  },
  {
    code: "disc_cloud",
    title: "E3. Usługi chmurowe, hosting, WWW",
    questions: [
      { code: "d_cl_www", text: "Strona WWW (gdzie hostowana, CMS, kto utrzymuje)" },
      { code: "d_cl_iaas", text: "Usługi IaaS/PaaS (Azure, AWS, GCP, OVH) i przeznaczenie" },
      { code: "d_cl_saas", text: "Aplikacje SaaS używane w firmie (lista, dane w nich)", severity: "high" },
      { code: "d_cl_access", text: "Kto zarządza dostępami do usług chmurowych" },
    ],
  },
  {
    code: "disc_lob",
    title: "E4. Aplikacje biznesowe (LoB)",
    questions: [
      { code: "d_lob_erp", text: "System ERP / księgowość / kadry (nazwa, dostawca, lokalna/chmura)", severity: "high" },
      { code: "d_lob_crm", text: "CRM / aplikacje branżowe" },
      { code: "d_lob_critical", text: "Aplikacje krytyczne dla działania firmy", severity: "high" },
      { code: "d_lob_license", text: "Sposób licencjonowania i wsparcie producenta" },
      { code: "d_lob_integrations", text: "Integracje między systemami" },
    ],
  },

  // ---------------- F. BEZPIECZEŃSTWO ----------------
  {
    code: "disc_av",
    title: "F1. Ochrona stacji i serwerów",
    questions: [
      { code: "d_av_product", text: "Antywirus/EDR: produkt, wersja, czy centralnie zarządzany", severity: "high" },
      { code: "d_av_coverage", text: "Pokrycie (wszystkie stacje i serwery?)", severity: "high" },
      { code: "d_av_edr", text: "EDR/XDR z reakcją czy klasyczny AV?" },
      { code: "d_av_monitor", text: "Kto monitoruje alerty (wewnętrznie / SOC / MSP)" },
    ],
  },
  {
    code: "disc_patch",
    title: "F2. Zarządzanie aktualizacjami",
    questions: [
      { code: "d_pt_os", text: "Sposób aktualizacji systemów (WSUS, Intune, ręcznie, brak)", severity: "high" },
      { code: "d_pt_thirdparty", text: "Aktualizacje oprogramowania firm trzecich" },
      { code: "d_pt_firmware", text: "Aktualizacje firmware (firewall, switche, NAS, drukarki)" },
      { code: "d_pt_eol", text: "Systemy poza wsparciem producenta (EOL)", severity: "high" },
    ],
  },
  {
    code: "disc_identity",
    title: "F3. Tożsamość, konta, hasła",
    questions: [
      { code: "d_idn_individual", text: "Konta indywidualne czy współdzielone?", severity: "high" },
      { code: "d_idn_policy", text: "Polityka haseł (długość, złożoność, rotacja)" },
      { code: "d_idn_manager", text: "Menedżer haseł (firmowy)" },
      { code: "d_idn_privileged", text: "Konta uprzywilejowane — ile, kto, oddzielone od codziennych?", severity: "high" },
      { code: "d_idn_jml", text: "Proces nadawania/odbierania dostępu (onboarding/offboarding)", severity: "high" },
      { code: "d_idn_service", text: "Konta serwisowe i techniczne (inwentaryzacja)" },
    ],
  },
  {
    code: "disc_crypto",
    title: "F4. Szyfrowanie",
    questions: [
      { code: "d_cr_disk", text: "Szyfrowanie dysków stacji/laptopów (BitLocker/FileVault)?", input: "status", severity: "high" },
      { code: "d_cr_server", text: "Szyfrowanie serwerów / nośników kopii?", input: "status" },
      { code: "d_cr_removable", text: "Szyfrowanie nośników wymiennych / pendrive" },
      { code: "d_cr_keys", text: "Zarządzanie kluczami odzyskiwania" },
    ],
  },
  {
    code: "disc_monitor",
    title: "F5. Monitorowanie i logowanie",
    questions: [
      { code: "d_mon_rmm", text: "Narzędzie RMM / monitoringu infrastruktury" },
      { code: "d_mon_siem", text: "Centralne zbieranie logów / SIEM", severity: "high" },
      { code: "d_mon_what", text: "Co jest monitorowane (dostępność, wydajność, zdarzenia)" },
      { code: "d_mon_retention", text: "Retencja logów (jak długo)", severity: "high" },
      { code: "d_mon_alerts", text: "Alerty i kto na nie reaguje" },
    ],
  },
  {
    code: "disc_backup",
    title: "F6. Kopie zapasowe i odtwarzanie",
    description: "Sekcja krytyczna — odporność na awarię i ransomware.",
    questions: [
      { code: "d_bk_scope", text: "Co jest backupowane (serwery, VM, bazy, pliki, M365, stacje)" },
      { code: "d_bk_solution", text: "Rozwiązanie do backupu (produkt, wersja)" },
      { code: "d_bk_schedule", text: "Harmonogram i typy kopii (pełne/przyrostowe, częstotliwość)" },
      { code: "d_bk_321", text: "Zasada 3-2-1 (3 kopie, 2 nośniki, 1 offsite)?", input: "status", severity: "high" },
      { code: "d_bk_immutable", text: "Kopia offline / immutable (odporna na ransomware)?", input: "status", severity: "critical" },
      { code: "d_bk_location", text: "Lokalizacja kopii (lokalnie, NAS, chmura, taśmy, offsite)" },
      { code: "d_bk_encrypt", text: "Szyfrowanie kopii?", input: "status" },
      { code: "d_bk_restore", text: "Testy odtwarzania — czy i jak często wykonywane", severity: "critical" },
      { code: "d_bk_rporto", text: "RPO (akceptowalna utrata danych) i RTO (czas odtworzenia)", severity: "high" },
      { code: "d_bk_owner", text: "Kto odpowiada za monitorowanie powodzenia backupów" },
    ],
  },

  // ---------------- G. INFRASTRUKTURA FIZYCZNA / OT ----------------
  {
    code: "disc_serverroom",
    title: "G1. Serwerownia / środowisko",
    questions: [
      { code: "d_sr_location", text: "Lokalizacja i zabezpieczenie pomieszczenia serwerowni", severity: "high" },
      { code: "d_sr_ups", text: "Zasilanie awaryjne UPS (model, podtrzymanie, testowane)" },
      { code: "d_sr_generator", text: "Agregat prądotwórczy?", input: "status" },
      { code: "d_sr_cooling", text: "Klimatyzacja / chłodzenie i monitoring temperatury" },
      { code: "d_sr_sensors", text: "Czujniki (zalanie, dym, temperatura, otwarcie)" },
    ],
  },
  {
    code: "disc_cctv",
    title: "G2. Monitoring wizyjny i kontrola dostępu",
    questions: [
      { code: "d_cc_system", text: "CCTV: kamery (liczba), rejestrator NVR/DVR, producent", severity: "high" },
      { code: "d_cc_vlan", text: "Czy CCTV w oddzielnej sieci/VLAN?", input: "status", severity: "high" },
      { code: "d_cc_exposed", text: "Czy rejestrator/kamery wystawione do internetu?", input: "status", severity: "high" },
      { code: "d_cc_retention", text: "Retencja nagrań (dni) i zgodność z RODO" },
      { code: "d_cc_access", text: "Kontrola dostępu (karty, kody), systemy alarmowe" },
    ],
  },
  {
    code: "disc_ot",
    title: "G3. OT / ICS / systemy przemysłowe / IoT",
    questions: [
      { code: "d_ot_present", text: "Czy występują systemy produkcyjne/sterujące (PLC, SCADA, maszyny)?", input: "status", severity: "high" },
      { code: "d_ot_list", text: "Lista systemów OT i ich sieci" },
      { code: "d_ot_separation", text: "Separacja OT od IT", severity: "high" },
      { code: "d_ot_vendor", text: "Zdalny dostęp serwisu producenta do maszyn", severity: "high" },
      { code: "d_ot_iot", text: "Urządzenia IoT (czujniki, sterowniki, smart) i ich sieć" },
    ],
  },

  // ---------------- H. ORGANIZACJA, PROCESY, DOSTAWCY ----------------
  {
    code: "disc_suppliers",
    title: "H1. Dostawcy i łańcuch dostaw",
    questions: [
      { code: "d_sup_list", text: "Lista dostawców IT/usług (nazwa, zakres, krytyczność)", severity: "high" },
      { code: "d_sup_sla", text: "Umowy i SLA (czasy reakcji, dostępność)" },
      { code: "d_sup_access", text: "Dostęp dostawców do systemów (co, jak, kontrola)", severity: "high" },
      { code: "d_sup_emergency", text: "Procedury awaryjne przy awarii dostawcy" },
      { code: "d_sup_operators", text: "Operatorzy usług kluczowych / podwykonawcy" },
    ],
  },
  {
    code: "disc_docs",
    title: "H2. Dokumentacja i polityki",
    questions: [
      { code: "d_doc_secpolicy", text: "Polityka bezpieczeństwa informacji (jest/brak)" },
      { code: "d_doc_assets", text: "Rejestr aktywów (sprzęt, oprogramowanie, dane)", severity: "high" },
      { code: "d_doc_backup", text: "Polityka kopii zapasowych" },
      { code: "d_doc_network", text: "Schematy sieci i dokumentacja techniczna" },
      { code: "d_doc_registers", text: "Rejestr dostawców i rejestr incydentów" },
      { code: "d_doc_rodo", text: "Rejestr czynności przetwarzania (RODO)" },
    ],
  },
  {
    code: "disc_incidents",
    title: "H3. Zarządzanie incydentami",
    questions: [
      { code: "d_in_proc", text: "Procedura obsługi i zgłaszania incydentów (jest/brak)", severity: "high" },
      { code: "d_in_deadlines", text: "Znajomość ustawowych terminów zgłoszeń (24h / 72h)?", input: "status", severity: "high" },
      { code: "d_in_csirt", text: "Punkt kontaktowy do CSIRT (sektorowy/NASK)" },
      { code: "d_in_escalation", text: "Ścieżka eskalacji i osoby odpowiedzialne" },
      { code: "d_in_history", text: "Historia incydentów (ostatnie 24 mies.)" },
    ],
  },
  {
    code: "disc_continuity",
    title: "H4. Ciągłość działania (BCP/DRP)",
    questions: [
      { code: "d_co_bcp", text: "Plan ciągłości działania (BCP) — jest/brak", severity: "high" },
      { code: "d_co_drp", text: "Plan odtwarzania po awarii (DRP) — jest/brak", severity: "high" },
      { code: "d_co_rto", text: "Zdefiniowane RTO/RPO dla kluczowych usług" },
      { code: "d_co_emergency", text: "Procedury awaryjne (brak prądu, internetu, ransomware)" },
      { code: "d_co_tested", text: "Czy plany były testowane?", input: "status" },
    ],
  },
  {
    code: "disc_training",
    title: "H5. Szkolenia i świadomość",
    questions: [
      { code: "d_tr_employees", text: "Szkolenia pracowników z cyberbezpieczeństwa (częstotliwość)" },
      { code: "d_tr_mgmt", text: "Szkolenia kadry zarządzającej?", input: "status" },
      { code: "d_tr_phishing", text: "Kampanie testów phishingowych?", input: "status" },
      { code: "d_tr_register", text: "Rejestr szkoleń" },
    ],
  },
  {
    code: "disc_licenses",
    title: "H6. Licencje i zasoby oprogramowania",
    questions: [
      { code: "d_lic_inventory", text: "Inwentaryzacja licencji (system, aplikacje, CAL)" },
      { code: "d_lic_shadow", text: "Oprogramowanie nielicencjonowane / shadow IT", severity: "high" },
      { code: "d_lic_renewals", text: "Daty odnowień subskrypcji" },
    ],
  },
  {
    code: "disc_history",
    title: "H7. Historia i stan obecny",
    questions: [
      { code: "d_hi_prev_audit", text: "Poprzednie audyty bezpieczeństwa (data, zakres, wykonawca)" },
      { code: "d_hi_recommendations", text: "Status realizacji wcześniejszych zaleceń" },
      { code: "d_hi_pains", text: "Znane problemy / „bolączki" zgłaszane przez klienta", severity: "high" },
      { code: "d_hi_plans", text: "Planowane zmiany/inwestycje IT w najbliższym roku" },
    ],
  },
];

export async function seedDiscovery() {
  const template = await prisma.auditTemplate.upsert({
    where: { name_version: { name: TEMPLATE_NAME, version: TEMPLATE_VERSION } },
    update: { description: "Rozpoznanie / inwentaryzacja infrastruktury klienta (Discovery)." },
    create: {
      name: TEMPLATE_NAME,
      version: TEMPLATE_VERSION,
      description: "Rozpoznanie / inwentaryzacja infrastruktury klienta (Discovery).",
    },
  });

  const existing = await prisma.auditSection.count({ where: { templateId: template.id } });
  if (existing > 0) {
    console.log(`✓ Rozpoznanie: szablon "${TEMPLATE_NAME}" v${TEMPLATE_VERSION} już zaseedowany (${existing} sekcji) — pomijam`);
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
            weight: 1,
            severity: q.severity ?? "medium",
            inputType: q.input ?? "text",
            sortOrder: i + 1,
          })),
        },
      },
    });
  }

  const qCount = SECTIONS.reduce((n, s) => n + s.questions.length, 0);
  console.log(`✓ Rozpoznanie: szablon "${TEMPLATE_NAME}" v${TEMPLATE_VERSION} — ${SECTIONS.length} sekcji, ${qCount} pytań`);
}

if (process.argv[1] && process.argv[1].includes("seed-discovery")) {
  seedDiscovery()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
