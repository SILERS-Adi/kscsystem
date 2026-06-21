# Rozpoznanie infrastruktury klienta (Discovery / Onboarding)

Kompletny kwestionariusz rozpoznania środowiska IT/OT przy wejściu do nowej firmy
(lub przy samodzielnym zakładaniu konta przez klienta). Celem jest zebranie **twardych
faktów** o całej infrastrukturze — sieci, urządzeniach, serwerach, kopiach zapasowych,
chmurze, bezpieczeństwie i organizacji — na podstawie których wiadomo o kliencie
praktycznie wszystko, co potrzebne do obsługi, audytu i zgodności (KSC/NIS2, RODO).

> **Różnica względem „Audytu Startowego KSC":** tamten ocenia *dojrzałość* (tak/nie →
> scoring). Ten **inwentaryzuje** (ile, jakie, gdzie, kto, jak skonfigurowane). Oba się
> uzupełniają — rozpoznanie najlepiej robić jako pierwsze.

**Legenda typu odpowiedzi:** `[txt]` tekst · `[num]` liczba · `[tak/nie]` ·
`[lista]` wiele pozycji (tabela) · `[plik]` załącznik/dokument · `[data]`.
Pytania oznaczone 🔴 to dane krytyczne dla bezpieczeństwa/zgodności.

---

## A. KONTEKST ORGANIZACJI

### A1. Dane podstawowe
- Pełna nazwa organizacji, NIP, REGON, KRS `[txt]`
- Adres siedziby i adresy korespondencyjne `[txt]`
- Branża / sektor (PKD) `[txt]`
- Czy podmiot jest objęty KSC/NIS2 (kluczowy / ważny / poza zakresem)? 🔴 `[txt]`
- Liczba pracowników (etaty + współpracownicy) `[num]`
- Liczba użytkowników systemów IT (konta) `[num]`
- Godziny pracy / krytyczne okna działania (np. praca zmianowa, 24/7) `[txt]`
- Sezonowość / okresy szczytu (kiedy przestój boli najbardziej) `[txt]`

### A2. Lokalizacje i oddziały
- Liczba lokalizacji `[num]`
- Lista lokalizacji: adres, rola (siedziba/oddział/magazyn/produkcja), liczba osób, czy jest serwerownia `[lista]`
- Sposób połączenia oddziałów (VPN site-to-site, MPLS, SD-WAN, brak) `[txt]`
- Lokalizacje pracy zdalnej / home office (skala) `[txt]`

### A3. Osoby i role
- Osoba decyzyjna (właściciel/zarząd) — imię, kontakt `[txt]`
- Osoba odpowiedzialna za IT (wewnętrzna) `[txt]`
- Osoba odpowiedzialna za cyberbezpieczeństwo (np. pełnomocnik KSC) 🔴 `[txt]`
- IOD / IODO (RODO) `[txt]`
- Zewnętrzna firma IT / MSP — nazwa, zakres, kontakt, czy nadal współpracuje `[txt]`
- Osoba kontaktowa ds. incydentów + zastępca 🔴 `[txt]`

### A4. Zgodność i regulacje
- Obowiązujące regulacje (KSC/NIS2, RODO, ISO 27001, PCI-DSS, sektorowe) 🔴 `[lista]`
- Przetwarzane dane wrażliwe / szczególne kategorie (zdrowotne, finansowe) 🔴 `[txt]`
- Wymogi umowne klientów dot. bezpieczeństwa `[txt]`
- Wcześniejsze certyfikaty / audyty zgodności `[plik]`

---

## B. ŁĄCZNOŚĆ I SIEĆ

### B1. Łącza internetowe (WAN)
- Lista łączy: operator (ISP), typ (światłowód/LTE/radiowe/xDSL), przepustowość ↓/↑, lokalizacja `[lista]`
- Łącze podstawowe vs zapasowe (redundancja, failover automatyczny?) 🔴 `[txt]`
- Statyczne adresy IP publiczne (ile, zakresy) `[txt]`
- Umowy SLA z ISP (czas naprawy, gwarancje) `[txt]`
- Kto zarządza routerem brzegowym ISP (operator/klient) `[txt]`

### B2. Adresacja publiczna, DNS, domeny
- Domeny internetowe (lista, rejestrator, daty wygaśnięcia) 🔴 `[lista]`
- Gdzie hostowany jest DNS (operator, Cloudflare, self-hosted) `[txt]`
- Rekordy publiczne: strona WWW, poczta (MX), inne usługi wystawione do internetu 🔴 `[lista]`
- Certyfikaty SSL/TLS (dostawca, daty ważności, auto-odnawianie) `[lista]`
- Usługi wystawione publicznie (RDP, VPN, kamery, panele) — pełna lista! 🔴 `[lista]`

### B3. Urządzenia brzegowe / firewall
- Firewall/UTM: producent, model, wersja firmware 🔴 `[txt]`
- Czy firewall objęty wsparciem/subskrypcją (IPS, filtrowanie) 🔴 `[tak/nie]`
- Reguły dostępu z zewnątrz (port forwarding) — wykaz 🔴 `[lista]`
- Filtrowanie treści / kategorii WWW `[tak/nie]`
- Logi firewalla (przechowywane, gdzie, jak długo) `[txt]`

### B4. Sieć LAN — przełączniki i okablowanie
- Przełączniki: producent, modele, liczba portów, zarządzalne/niezarządzalne `[lista]`
- Topologia sieci (czy istnieje dokumentacja/schemat) `[plik]`
- Standard okablowania (kat. 5e/6/6a, światłowód między budynkami) `[txt]`
- Szafy/punkty dystrybucyjne (lokalizacje, zabezpieczenie fizyczne) `[txt]`
- PoE (zasilanie urządzeń przez sieć — kamery, AP, telefony) `[tak/nie]`

### B5. Adresacja, VLAN, segmentacja
- Schemat adresacji IP (podsieci, zakresy) `[txt]`
- Serwer DHCP (gdzie, zakresy, rezerwacje) `[txt]`
- Wdrożone VLAN-y (lista i przeznaczenie) 🔴 `[lista]`
- Segmentacja: oddzielne sieci dla serwerów / użytkowników / gości / CCTV / VoIP / OT 🔴 `[txt]`
- Reguły ruchu między segmentami (kto z kim może się komunikować) 🔴 `[txt]`

### B6. Sieć bezprzewodowa (WiFi)
- Punkty dostępowe: producent, modele, liczba, kontroler (chmura/lokalny) `[lista]`
- Sieci SSID i ich przeznaczenie (firmowa, gości, IoT) `[lista]`
- Zabezpieczenie (WPA2/WPA3, Enterprise/802.1X vs hasło współdzielone) 🔴 `[txt]`
- Izolacja sieci gości od firmowej 🔴 `[tak/nie]`
- Pokrycie / problemy z zasięgiem `[txt]`

### B7. Dostęp zdalny / VPN
- Rozwiązanie VPN (typ, producent, klient) 🔴 `[txt]`
- Kto ma dostęp zdalny (pracownicy, dostawcy, serwis) `[txt]`
- MFA na VPN 🔴 `[tak/nie]`
- Wystawione RDP/pulpit zdalny bezpośrednio do internetu? 🔴 `[tak/nie]`
- Narzędzia zdalnego wsparcia (TeamViewer, AnyDesk, RMM) `[lista]`

---

## C. SERWERY, WIRTUALIZACJA, PAMIĘĆ MASOWA

### C1. Serwery i wirtualizacja
- Serwery fizyczne: producent, model, rok, lokalizacja, gwarancja `[lista]`
- Platforma wirtualizacji (Hyper-V, VMware, Proxmox, brak) i wersja `[txt]`
- Maszyny wirtualne: nazwa, rola, system, zasoby (CPU/RAM/dysk) `[lista]`
- Systemy operacyjne serwerów + wersje (uwaga na końce wsparcia!) 🔴 `[lista]`
- Krytyczne role (kontroler domeny, plikowy, aplikacyjny, bazodanowy, terminalowy) 🔴 `[lista]`

### C2. Active Directory / katalog / domena
- Czy jest domena Active Directory (nazwa, poziom funkcjonalny) `[txt]`
- Liczba kontrolerów domeny i ich lokalizacje 🔴 `[txt]`
- Integracja z Entra ID / Azure AD (hybryda) `[txt]`
- Zasady grupowe (GPO) — czy udokumentowane `[tak/nie]`
- DNS/DHCP wewnętrzny (gdzie obsługiwany) `[txt]`

### C3. Pamięć masowa / NAS / SAN
- Urządzenia NAS/SAN: producent, model, pojemność, RAID, lokalizacja `[lista]`
- Przeznaczenie (pliki, backup, monitoring CCTV, archiwum) `[txt]`
- Sposób udostępniania (SMB/NFS/iSCSI) i uprawnienia `[txt]`
- Czy NAS jest wystawiony do internetu? 🔴 `[tak/nie]`
- Wykorzystanie pojemności / przewidywany przyrost `[txt]`

### C4. Bazy danych
- Silniki baz (MS SQL, PostgreSQL, MySQL, Oracle, inne) + wersje `[lista]`
- Aplikacje korzystające z baz `[txt]`
- Gdzie działają (serwer fizyczny/VM/chmura) `[txt]`
- Backup baz (sposób, częstotliwość) 🔴 `[txt]`
- Szyfrowanie danych w bazie `[tak/nie]`

---

## D. STACJE ROBOCZE, URZĄDZENIA KOŃCOWE, PERYFERIA

### D1. Stacje robocze i laptopy
- Liczba stacji stacjonarnych i laptopów `[num]`
- Systemy operacyjne i wersje (Windows 10/11, macOS, Linux) 🔴 `[lista]`
- Najstarszy sprzęt / urządzenia poza wsparciem `[txt]`
- Model zarządzania (domena, Intune/MDM, ręcznie) `[txt]`
- Czy użytkownicy mają uprawnienia administratora lokalnego? 🔴 `[tak/nie]`

### D2. Urządzenia mobilne / BYOD
- Telefony/tablety służbowe (liczba, systemy) `[txt]`
- Zarządzanie (MDM/MAM — Intune, inne) `[txt]`
- Dostęp do poczty/danych z urządzeń prywatnych (BYOD) 🔴 `[tak/nie]`
- Polityka wymazania zdalnego przy utracie urządzenia `[tak/nie]`

### D3. Drukarki i urządzenia wielofunkcyjne
- Lista urządzeń: producent, model, sieciowe/lokalne, lokalizacja `[lista]`
- Skanowanie do e-mail/folderu (konfiguracja, poświadczenia) `[txt]`
- Dyski w urządzeniach MFP (szyfrowanie, kasowanie) `[txt]`
- Serwis/dzierżawa (dostawca, umowa) `[txt]`

### D4. Telefonia / VoIP
- System telefoniczny (centrala IP-PBX, chmura, operator) `[txt]`
- Liczba numerów/linii i aparatów `[txt]`
- Oddzielna sieć/VLAN dla VoIP `[tak/nie]`
- Dostawca usług głosowych i SLA `[txt]`

---

## E. CHMURA, POCZTA, APLIKACJE

### E1. Tożsamość chmurowa (M365 / Google Workspace)
- Główny dostawca produktywności (Microsoft 365, Google Workspace, inny) `[txt]`
- Liczba i typy licencji `[txt]`
- Konto administratora globalnego — kto, ile kont admina 🔴 `[txt]`
- MFA wymuszone dla wszystkich / dla adminów 🔴 `[tak/nie]`
- Polityki dostępu warunkowego (Conditional Access) `[tak/nie]`

### E2. Poczta e-mail
- Gdzie hostowana poczta (Exchange Online, Google, własny serwer, hosting) 🔴 `[txt]`
- Rekordy SPF / DKIM / DMARC skonfigurowane? 🔴 `[tak/nie]`
- Ochrona antyspam/antyphishing (rozwiązanie) `[txt]`
- Archiwizacja poczty / retencja `[txt]`
- Reguły przekierowań na zewnątrz (audyt — częsty wektor wycieku) 🔴 `[txt]`

### E3. Usługi chmurowe, hosting, WWW
- Strona WWW (gdzie hostowana, CMS, kto utrzymuje) `[txt]`
- Usługi IaaS/PaaS (Azure, AWS, GCP, OVH) i ich przeznaczenie `[lista]`
- Aplikacje SaaS używane w firmie (lista, dane w nich przechowywane) 🔴 `[lista]`
- Kto zarządza dostępami do usług chmurowych `[txt]`

### E4. Aplikacje biznesowe (LoB)
- System ERP / księgowość / kadry (nazwa, dostawca, lokalna/chmura) 🔴 `[txt]`
- CRM / aplikacje branżowe `[lista]`
- Aplikacje krytyczne dla działania firmy (bez nich firma stoi) 🔴 `[lista]`
- Sposób licencjonowania i wsparcie producenta `[txt]`
- Integracje między systemami `[txt]`

---

## F. BEZPIECZEŃSTWO

### F1. Ochrona stacji i serwerów
- Antywirus/EDR: produkt, wersja, czy centralnie zarządzany 🔴 `[txt]`
- Pokrycie (wszystkie stacje i serwery?) 🔴 `[txt]`
- EDR/XDR z reakcją na zagrożenia czy klasyczny AV? `[txt]`
- Kto monitoruje alerty (wewnętrznie / SOC / MSP) `[txt]`

### F2. Zarządzanie aktualizacjami (patch management)
- Sposób aktualizacji systemów (WSUS, Intune, ręcznie, brak) 🔴 `[txt]`
- Aktualizacje oprogramowania firm trzecich (przeglądarki, Java, itp.) `[txt]`
- Aktualizacje firmware (firewall, switche, NAS, drukarki) `[txt]`
- Systemy poza wsparciem producenta (EOL) 🔴 `[lista]`

### F3. Tożsamość, konta, hasła
- Konta indywidualne czy współdzielone? 🔴 `[txt]`
- Polityka haseł (długość, złożoność, rotacja) `[txt]`
- Menedżer haseł (firmowy) `[txt]`
- Konta uprzywilejowane — ile, kto, czy oddzielone od kont codziennych 🔴 `[txt]`
- Proces nadawania/odbierania dostępu (onboarding/offboarding) 🔴 `[txt]`
- Konta serwisowe i techniczne (inwentaryzacja) `[txt]`

### F4. Szyfrowanie
- Szyfrowanie dysków stacji/laptopów (BitLocker/FileVault) 🔴 `[tak/nie]`
- Szyfrowanie serwerów / nośników kopii `[tak/nie]`
- Szyfrowanie nośników wymiennych / pendrive `[txt]`
- Zarządzanie kluczami odzyskiwania `[txt]`

### F5. Monitorowanie i logowanie
- Narzędzie RMM / monitoringu infrastruktury `[txt]`
- Centralne zbieranie logów / SIEM 🔴 `[txt]`
- Co jest monitorowane (dostępność, wydajność, zdarzenia bezpieczeństwa) `[txt]`
- Retencja logów (jak długo) 🔴 `[txt]`
- Alerty i kto na nie reaguje `[txt]`

### F6. Kopie zapasowe i odtwarzanie 🔴
- Co jest backupowane (serwery, VM, bazy, pliki, M365, stacje) `[lista]`
- Rozwiązanie do backupu (produkt, wersja) `[txt]`
- Harmonogram i typy kopii (pełne/przyrostowe, częstotliwość) `[txt]`
- Zasada 3-2-1 (3 kopie, 2 nośniki, 1 poza lokalizacją) 🔴 `[txt]`
- Kopia offline / immutable (odporna na ransomware) 🔴 `[tak/nie]`
- Lokalizacja kopii (lokalnie, NAS, chmura, taśmy, offsite) `[txt]`
- Szyfrowanie kopii `[tak/nie]`
- **Testy odtwarzania — czy i jak często wykonywane** 🔴 `[txt]`
- RPO (akceptowalna utrata danych) i RTO (czas odtworzenia) 🔴 `[txt]`
- Kto odpowiada za monitorowanie powodzenia backupów `[txt]`

---

## G. INFRASTRUKTURA FIZYCZNA I OT

### G1. Serwerownia / środowisko
- Lokalizacja i zabezpieczenie pomieszczenia serwerowni 🔴 `[txt]`
- Zasilanie awaryjne UPS (model, podtrzymanie, testowane) `[txt]`
- Agregat prądotwórczy `[tak/nie]`
- Klimatyzacja / chłodzenie i monitoring temperatury `[txt]`
- Czujniki (zalanie, dym, temperatura, otwarcie) `[txt]`

### G2. Monitoring wizyjny i kontrola dostępu
- System CCTV: kamery (liczba), rejestrator NVR/DVR, producent 🔴 `[txt]`
- Czy CCTV w oddzielnej sieci/VLAN 🔴 `[tak/nie]`
- Czy rejestrator/kamery wystawione do internetu 🔴 `[tak/nie]`
- Retencja nagrań (dni) i zgodność z RODO `[txt]`
- Kontrola dostępu (karty, kody), systemy alarmowe `[txt]`

### G3. OT / ICS / systemy przemysłowe / IoT
- Czy występują systemy produkcyjne/sterujące (PLC, SCADA, maszyny) 🔴 `[tak/nie]`
- Lista systemów OT i ich sieci `[lista]`
- Separacja OT od IT 🔴 `[txt]`
- Zdalny dostęp serwisu producenta do maszyn 🔴 `[txt]`
- Urządzenia IoT (czujniki, sterowniki, smart) i ich sieć `[txt]`

---

## H. ORGANIZACJA, PROCESY, DOSTAWCY

### H1. Dostawcy i łańcuch dostaw
- Lista dostawców IT/usług (nazwa, zakres, krytyczność) 🔴 `[lista]`
- Umowy i SLA (czasy reakcji, dostępność) `[lista]`
- Dostęp dostawców do systemów (co, jak, kontrola) 🔴 `[txt]`
- Procedury awaryjne przy awarii dostawcy `[txt]`
- Operatorzy usług kluczowych / podwykonawcy `[txt]`

### H2. Dokumentacja i polityki
- Polityka bezpieczeństwa informacji `[plik]`
- Rejestr aktywów (sprzęt, oprogramowanie, dane) 🔴 `[plik]`
- Polityka kopii zapasowych `[plik]`
- Schematy sieci i dokumentacja techniczna `[plik]`
- Rejestr dostawców i rejestr incydentów `[plik]`
- Rejestr czynności przetwarzania (RODO) `[plik]`

### H3. Zarządzanie incydentami
- Procedura obsługi i zgłaszania incydentów 🔴 `[plik]`
- Znajomość ustawowych terminów zgłoszeń (24h / 72h) 🔴 `[tak/nie]`
- Punkt kontaktowy do CSIRT (sektorowy/NASK) `[txt]`
- Ścieżka eskalacji i osoby odpowiedzialne `[txt]`
- Historia incydentów (ostatnie 24 mies.) `[txt]`

### H4. Ciągłość działania (BCP/DRP)
- Plan ciągłości działania (BCP) 🔴 `[plik]`
- Plan odtwarzania po awarii (DRP) 🔴 `[plik]`
- Zdefiniowane RTO/RPO dla kluczowych usług `[txt]`
- Procedury awaryjne (brak prądu, internetu, ransomware) `[txt]`
- Czy plany były testowane `[tak/nie]`

### H5. Szkolenia i świadomość
- Szkolenia pracowników z cyberbezpieczeństwa (częstotliwość) `[txt]`
- Szkolenia kadry zarządzającej `[tak/nie]`
- Kampanie testów phishingowych `[tak/nie]`
- Rejestr szkoleń `[plik]`

### H6. Licencje i zasoby oprogramowania
- Inwentaryzacja licencji (system operacyjny, aplikacje, CAL) `[plik]`
- Oprogramowanie nielicencjonowane / niezatwierdzone (shadow IT) 🔴 `[txt]`
- Daty odnowień subskrypcji `[lista]`

### H7. Historia i stan obecny
- Poprzednie audyty bezpieczeństwa (data, zakres, wykonawca) `[txt]`
- Status realizacji wcześniejszych zaleceń `[txt]`
- Znane problemy / „bolączki" zgłaszane przez klienta 🔴 `[txt]`
- Planowane zmiany/inwestycje IT w najbliższym roku `[txt]`

---

## Jak to wykorzystać

1. **Onboarding nowego klienta** — wypełniane wspólnie na spotkaniu rozpoznawczym (handlowiec/inżynier + klient).
2. **Samodzielna rejestracja** — klient wypełnia sekcje A–E sam, sekcje techniczne (B3–B7, C, F) uzupełnia inżynier po wizycie.
3. **Wejście do raportu** — zebrane dane → rejestr aktywów + baza do „Audytu Startowego KSC" (ocena dojrzałości) → raport gap-analysis i plan działań.

> **Priorytety przy ograniczonym czasie** (pozycje 🔴): zakres KSC/NIS2, usługi wystawione
> do internetu, firewall, segmentacja, MFA, konta uprzywilejowane, kopie zapasowe + testy
> odtwarzania, EOL systemy, separacja CCTV/OT, procedura incydentów. To one decydują o
> rzeczywistym ryzyku.
