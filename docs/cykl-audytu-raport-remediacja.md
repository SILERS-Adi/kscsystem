# Cykl audytu: rozpoznanie → audyt → raport → remediacja → re-audyt

Pełna, zamknięta pętla ciągłego doskonalenia bezpieczeństwa klienta (model PDCA).
Dokument opisuje etapy **po** rozpoznaniu i audycie: **raport (co i jak zmienić)**,
**realizację punkt po punkcie** oraz **ponowny audyt z weryfikacją**.

Powiązane: [`rozpoznanie-klienta-infrastruktura.md`](./rozpoznanie-klienta-infrastruktura.md) (etap 1).

---

## Przegląd pętli

```
 [1] ROZPOZNANIE         →  inwentaryzacja infrastruktury (kwestionariusz discovery)
        ↓
 [2] AUDYT (sesja #N)    →  ocena dojrzałości (tak/nie + wagi) → maturityScore
        ↓
 [3] RAPORT              →  findings + zalecenia: co zmienić, jak, priorytet, kto, do kiedy
        ↓
 [4] REMEDIACJA          →  realizacja punkt po punkcie (open → in_progress → done)
        ↓
 [5] RE-AUDYT (sesja #N+1) →  ponowna ocena + PORÓWNANIE z #N → co poprawione, co zostało
        ↓
        └──────────────  powrót do [3] dla pozostałych punktów  ──────────────┘
```

Każdy obrót pętli podnosi `maturityScore` i zamyka kolejne findings. Historia sesji
audytu daje wykres postępu w czasie.

---

## Etap 2 — Audyt (istniejący)

- Szablon „Audyt Startowy KSC" (14 sekcji, ~70 pytań), model `AuditTemplate → AuditSection → AuditQuestion`.
- Odpowiedzi (`AuditAnswer.status`): `yes` / `no` / `partial` / `na`.
- Scoring: każde pytanie ma `weight` i `severity`; `maturityScore` (0–100) i `maturityLevel`.
- Wynik: dla każdej odpowiedzi `no`/`partial` powstaje **finding** + **zalecenie** (z `recommendation` pytania).

**Reguła generowania findings (proponowana, spójna z danymi):**
| Odpowiedź | Finding? | Severity findingu |
|-----------|----------|-------------------|
| `yes` | nie | — |
| `partial` | tak | o stopień niżej niż `severity` pytania |
| `no` | tak | = `severity` pytania |
| `na` | nie | (udokumentować uzasadnienie) |

---

## Etap 3 — Raport (co i jak zmienić)

Raport to uporządkowana lista **findings → zaleceń**, posortowana wg priorytetu
(severity × weight). Każdy punkt raportu zawiera komplet informacji potrzebnych do działania.

### Struktura pojedynczego punktu raportu

| Pole | Źródło w modelu | Opis |
|------|-----------------|------|
| **Obszar / sekcja** | `AuditFinding.sectionCode` | np. „Kopie zapasowe" |
| **Stwierdzenie (co jest nie tak)** | `AuditFinding.title/description` | stan obecny |
| **Ryzyko / skutek** | (opis zalecenia) | dlaczego to ważne, co grozi |
| **Zalecenie (co zrobić)** | `AuditRecommendation.title` | docelowy stan |
| **Jak wdrożyć (kroki)** | `AuditRecommendation.description` | konkretne działania |
| **Priorytet** | `AuditRecommendation.priority` | 1 = krytyczny … |
| **Pracochłonność / koszt** | (pole do dodania, opcjonalne) | szacunek |
| **Odpowiedzialny** | `AuditRecommendation.responsiblePerson` | kto realizuje |
| **Termin** | `AuditRecommendation.dueDate` | do kiedy |
| **Status** | `AuditRecommendation.status` | open / in_progress / done |

### Przykład punktu (gotowy wzorzec treści)

> **[KRYTYCZNY] Kopie zapasowe — brak testów odtwarzania**
> **Stan obecny:** Backup serwerów wykonywany, ale odtwarzanie nigdy nie było testowane.
> **Ryzyko:** Kopie mogą być niekompletne/uszkodzone — w razie awarii lub ransomware
> odtworzenie może się nie powieść (realne zatrzymanie firmy).
> **Zalecenie:** Wdrożyć cykliczne, udokumentowane testy odtwarzania.
> **Jak wdrożyć:** 1) zdefiniować zakres testu (krytyczne VM + baza), 2) przywrócić do
> środowiska izolowanego, 3) zweryfikować integralność i czas (RTO), 4) harmonogram
> kwartalny + rejestr testów.
> **Priorytet:** 1 · **Odpowiedzialny:** [IT/MSP] · **Termin:** 30 dni · **Status:** open

### Sekcje raportu (układ dokumentu)
1. **Podsumowanie zarządcze** — `maturityScore`, poziom dojrzałości, mapa ciepła sekcji, liczba findings wg severity.
2. **Top ryzyka (krytyczne/wysokie)** — pierwsze do realizacji.
3. **Szczegółowe findings i zalecenia** — pełna lista punktów (jw.), pogrupowana sekcjami.
4. **Plan działań (roadmapa)** — zalecenia z priorytetem, odpowiedzialnym i terminem (≈ harmonogram).
5. **Załączniki** — dane z rozpoznania, dowody, wymagane dokumenty do opracowania.

---

## Etap 4 — Remediacja (realizacja punkt po punkcie)

Klient/MSP realizuje zalecenia i odhacza postęp. Każde zalecenie przechodzi cykl statusu:

```
open  →  in_progress  →  done   (opcjonalnie: deferred / accepted-risk)
```

Dla każdego punktu rejestrujemy: **kto** (`responsiblePerson`), **do kiedy**
(`dueDate`), **dowód wykonania** (załącznik/notatka), **datę zamknięcia**.

> Widok operacyjny: „Rejestr działań" = lista wszystkich zaleceń organizacji z filtrem
> po statusie/odpowiedzialnym/terminie + przeterminowane (overdue) na czerwono.

---

## Etap 5 — Re-audyt i weryfikacja

Kolejny audyt = **nowa `AuditSession`** dla tej samej organizacji (ten sam szablon,
`templateVersion`). Po wypełnieniu odpowiedzi system **porównuje** sesję #N+1 z #N
i pokazuje postęp **punkt po punkcie**:

| Pytanie / punkt | Audyt #N | Audyt #N+1 | Status |
|-----------------|----------|------------|--------|
| MFA wymuszone | `no` | `yes` | ✅ poprawione |
| Testy odtwarzania | `no` | `partial` | 🟡 w toku |
| Segmentacja sieci | `no` | `no` | 🔴 nadal otwarte |
| Szyfrowanie dysków | `yes` | `yes` | ➖ utrzymane |

**Wynik re-audytu:**
- Delta `maturityScore` (#N → #N+1) — wymierny postęp.
- Lista **zamkniętych** findings (zweryfikowane jako wykonane).
- Lista **nadal otwartych** → wracają do raportu (etap 3) na kolejny obrót.
- **Regresje** (było `yes`, jest `no`) — wyłapane i podświetlone.

Weryfikacja techniczna (sekcja `tech_verification` w szablonie) docelowo automatyczna
(agent InfraDesk) — potwierdza stan faktycznie, nie tylko deklaratywnie.

---

## Luka w modelu i propozycja (do decyzji)

Obecnie `AuditFinding` i `AuditRecommendation` są przypięte do **sesji**. To dobrze
opisuje pojedynczy audyt, ale **realizacja punktu rozciąga się między audytami** —
zalecenie z #N jest weryfikowane dopiero w #N+1. Dziś trzeba je „ręcznie" zmapować po
treści/kodzie pytania.

**Minimalna, bezpieczna zmiana** (addytywna, bez ruszania istniejących pól):

1. **Trwały rejestr działań na poziomie organizacji** — nowy model
   `RemediationAction` (organizationId, questionCode, title, jak-wdrożyć, priority,
   status, responsiblePerson, dueDate, evidence, sourceSessionId, closedSessionId).
   Zalecenia z audytu „promują się" do tego rejestru; re-audyt zamyka je po weryfikacji.
2. **Linkowanie między audytami po `questionCode`** — porównanie #N↔#N+1 i wykres postępu
   (nie wymaga zmian schematu, tylko logiki/widoku).
3. (Opcjonalnie) pola na zaleceniu: `effortEstimate`, `costEstimate`, `evidenceUrl`,
   status `deferred` / `accepted_risk`.

Alternatywa bez nowego modelu: dołożyć do `AuditRecommendation` pola
`carriedFromRecommendationId` + `verifiedInSessionId` — taniej, ale słabszy „rejestr".

---

## Co można zbudować dalej (propozycja kolejności)

1. **Generator findings/zaleceń** z odpowiedzi audytu (reguła z etapu 2) — zasila raport.
2. **Widok/eksport raportu** (HTML/PDF) wg struktury z etapu 3.
3. **Rejestr działań (remediacja)** — `RemediationAction` + widok z filtrami i overdue.
4. **Porównanie audytów** (#N vs #N+1) + wykres `maturityScore` w czasie.
5. **Automatyczna weryfikacja techniczna** (InfraDesk) dla sekcji `tech_verification`.
