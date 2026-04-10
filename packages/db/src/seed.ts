import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // --- Quiz Questions & Options ---
  const q1 = await prisma.quizQuestion.upsert({
    where: { code: "Q001" },
    update: {},
    create: {
      code: "Q001",
      text: "W jakim sektorze działa Twoja organizacja?",
      description: "Sektor działalności wpływa na klasyfikację podmiotu w KSC",
      type: "single",
      category: "Sektor",
      sortOrder: 1,
      options: {
        create: [
          { text: "Energia", description: "Wytwarzanie, przesyłanie i dystrybucja energii elektrycznej, gazu, ropy naftowej, ciepła", value: "energy", weight: 30, sortOrder: 1 },
          { text: "Transport", description: "Lotniczy, kolejowy, wodny, drogowy — przewoźnicy, zarządcy infrastruktury, porty", value: "transport", weight: 30, sortOrder: 2 },
          { text: "Bankowość i finanse", description: "Banki, instytucje kredytowe, giełdy, izby rozliczeniowe, ubezpieczenia", value: "finance", weight: 30, sortOrder: 3 },
          { text: "Ochrona zdrowia", description: "Szpitale, kliniki, laboratoria, producenci leków i wyrobów medycznych", value: "health", weight: 25, sortOrder: 4 },
          { text: "Woda i ścieki", description: "Dostawcy wody pitnej, oczyszczalnie ścieków, wodociągi", value: "water", weight: 25, sortOrder: 5 },
          { text: "Infrastruktura cyfrowa", description: "Operatorzy DNS, IXP, dostawcy chmury, data center, sieci CDN, rejestry domen", value: "digital", weight: 30, sortOrder: 6 },
          { text: "Administracja publiczna", description: "Urzędy, ministerstwa, jednostki samorządu terytorialnego", value: "public", weight: 20, sortOrder: 7 },
          { text: "Przestrzeń kosmiczna", description: "Operatorzy naziemnej infrastruktury satelitarnej", value: "space", weight: 25, sortOrder: 8 },
          { text: "Poczta i usługi kurierskie", description: "Operatorzy pocztowi, firmy kurierskie", value: "postal", weight: 15, sortOrder: 9 },
          { text: "Odpady", description: "Firmy zajmujące się zbieraniem, przetwarzaniem i utylizacją odpadów", value: "waste", weight: 15, sortOrder: 10 },
          { text: "Chemia", description: "Produkcja, wytwarzanie lub dystrybucja substancji chemicznych", value: "chemicals", weight: 15, sortOrder: 11 },
          { text: "Żywność", description: "Przetwórstwo, dystrybucja, handel hurtowy żywnością", value: "food", weight: 15, sortOrder: 12 },
          { text: "Produkcja przemysłowa", description: "Urządzenia medyczne, komputery, elektronika, maszyny, pojazdy samochodowe", value: "manufacturing", weight: 15, sortOrder: 13 },
          { text: "Usługi cyfrowe", description: "Platformy marketplace, wyszukiwarki internetowe, portale społecznościowe", value: "digital_services", weight: 20, sortOrder: 14 },
          { text: "Badania naukowe", description: "Instytuty badawcze, uczelnie wyższe, jednostki naukowe", value: "research", weight: 10, sortOrder: 15 },
          { text: "Inny sektor", description: "Twoja branża nie pasuje do powyższych — możesz nadal podlegać ustawie", value: "other", weight: 0, sortOrder: 16 },
        ],
      },
    },
  });

  const q2 = await prisma.quizQuestion.upsert({
    where: { code: "Q002" },
    update: {},
    create: {
      code: "Q002",
      text: "Ile osób zatrudnia Twoja organizacja?",
      description: "Wielkość organizacji jest jednym z kryteriów klasyfikacji",
      type: "single",
      category: "Rozmiar",
      sortOrder: 2,
      options: {
        create: [
          { text: "Mniej niż 50 pracowników", value: "micro", weight: 0, sortOrder: 1 },
          { text: "50–249 pracowników", value: "medium", weight: 15, sortOrder: 2 },
          { text: "250 i więcej pracowników", value: "large", weight: 25, sortOrder: 3 },
        ],
      },
    },
  });

  const q3 = await prisma.quizQuestion.upsert({
    where: { code: "Q003" },
    update: {},
    create: {
      code: "Q003",
      text: "Jaki jest roczny obrót Twojej organizacji?",
      description: "Obrót decyduje o klasyfikacji jako podmiot kluczowy lub ważny",
      type: "single",
      category: "Rozmiar",
      sortOrder: 3,
      options: {
        create: [
          { text: "Poniżej 10 mln EUR", value: "small", weight: 0, sortOrder: 1 },
          { text: "10–50 mln EUR", value: "medium", weight: 15, sortOrder: 2 },
          { text: "Powyżej 50 mln EUR", value: "large", weight: 25, sortOrder: 3 },
        ],
      },
    },
  });

  const q4 = await prisma.quizQuestion.upsert({
    where: { code: "Q004" },
    update: {},
    create: {
      code: "Q004",
      text: "Czy Twoja organizacja świadczy usługi z poniższych kategorii?",
      description: "Ustawa o KSC dzieli usługi na kluczowe i ważne. Sprawdź, czy Twoja działalność pasuje do jednej z nich.",
      type: "single",
      category: "Klasyfikacja",
      sortOrder: 4,
      options: {
        create: [
          {
            text: "Tak — usługi kluczowe",
            description: "Energia (prąd, gaz, ropa), transport (lotniczy, kolejowy, wodny, drogowy), bankowość i finanse, ochrona zdrowia (szpitale, laboratoria), woda pitna i ścieki, infrastruktura cyfrowa (DNS, IXP, chmura, data center), administracja publiczna",
            value: "annex1", weight: 20, sortOrder: 1,
          },
          {
            text: "Tak — usługi ważne",
            description: "Usługi pocztowe i kurierskie, gospodarowanie odpadami, produkcja chemikaliów, przetwórstwo żywności, produkcja (urządzenia medyczne, elektronika, maszyny, pojazdy), usługi cyfrowe (marketplace, wyszukiwarki, social media), badania naukowe",
            value: "annex2", weight: 10, sortOrder: 2,
          },
          {
            text: "Nie jestem pewien/pewna",
            description: "Nic nie szkodzi — pomożemy Ci to ustalić po wypełnieniu quizu",
            value: "unsure", weight: 5, sortOrder: 3,
          },
          {
            text: "Nie, żadna z powyższych",
            description: "Twoja organizacja może nadal podlegać ustawie z innych powodów",
            value: "no", weight: 0, sortOrder: 4,
          },
        ],
      },
    },
  });

  const q5 = await prisma.quizQuestion.upsert({
    where: { code: "Q005" },
    update: {},
    create: {
      code: "Q005",
      text: "Czy posiadasz wdrożony system zarządzania bezpieczeństwem informacji (np. ISO 27001)?",
      description: "Obecny stan cyberbezpieczeństwa organizacji",
      type: "single",
      category: "Gotowość",
      sortOrder: 5,
      options: {
        create: [
          { text: "Tak, certyfikowany", value: "certified", weight: 0, sortOrder: 1 },
          { text: "Tak, bez certyfikacji", value: "implemented", weight: 0, sortOrder: 2 },
          { text: "W trakcie wdrażania", value: "in_progress", weight: 0, sortOrder: 3 },
          { text: "Nie", value: "no", weight: 0, sortOrder: 4 },
        ],
      },
    },
  });

  console.log("✓ Quiz questions created");

  // --- Scoring Rules ---
  const scoringRules = [
    { name: "Podmiot kluczowy", description: "Score >= 60 → podmiot kluczowy (essential)", condition: { field: "totalScore", operator: "gte", value: 60 }, score: 0, category: "classification", sortOrder: 1 },
    { name: "Podmiot ważny", description: "Score >= 30 → podmiot ważny (important)", condition: { field: "totalScore", operator: "gte", value: 30 }, score: 0, category: "classification", sortOrder: 2 },
    { name: "Nie podlega", description: "Score < 30 → nie podlega", condition: { field: "totalScore", operator: "lt", value: 30 }, score: 0, category: "classification", sortOrder: 3 },
  ];

  // Clear existing rules and recreate
  await prisma.scoringRule.deleteMany({});
  for (const rule of scoringRules) {
    await prisma.scoringRule.create({ data: rule });
  }
  console.log("✓ Scoring rules created");

  // --- Checklist Items ---
  const checklistItems = [
    { code: "KSC-01", category: "Zarządzanie ryzykiem", title: "Wdrożenie systemu zarządzania ryzykiem", description: "Podmiot kluczowy lub ważny wdraża system zarządzania ryzykiem w zakresie cyberbezpieczeństwa, obejmujący identyfikację, analizę, ocenę i postępowanie z ryzykiem.", priority: 1, appliesToType: "all", sortOrder: 1 },
    { code: "KSC-02", category: "Zarządzanie ryzykiem", title: "Przeprowadzenie analizy ryzyka", description: "Regularna analiza ryzyka obejmująca aktywa informacyjne, zagrożenia, podatności oraz prawdopodobieństwo i skutki incydentów.", priority: 1, appliesToType: "all", sortOrder: 2 },
    { code: "KSC-03", category: "Zarządzanie ryzykiem", title: "Plan postępowania z ryzykiem", description: "Opracowanie i wdrożenie planu postępowania z ryzykiem, uwzględniającego środki techniczne i organizacyjne.", priority: 2, appliesToType: "all", sortOrder: 3 },
    { code: "KSC-04", category: "Bezpieczeństwo", title: "Polityka bezpieczeństwa informacji", description: "Opracowanie i wdrożenie polityki bezpieczeństwa systemów informacyjnych, zatwierdzonej przez kierownictwo podmiotu.", priority: 1, appliesToType: "all", sortOrder: 4 },
    { code: "KSC-05", category: "Bezpieczeństwo", title: "Polityka kontroli dostępu", description: "Wdrożenie zasad kontroli dostępu do systemów informacyjnych, w tym zarządzanie uprawnieniami i uwierzytelnianie.", priority: 2, appliesToType: "all", sortOrder: 5 },
    { code: "KSC-06", category: "Bezpieczeństwo", title: "Bezpieczeństwo łańcucha dostaw", description: "Ocena i zarządzanie ryzykiem w łańcuchu dostaw, w tym wymagania bezpieczeństwa wobec dostawców.", priority: 2, appliesToType: "essential", sortOrder: 6 },
    { code: "KSC-07", category: "Incydenty", title: "Procedura zgłaszania incydentów do CSIRT", description: "Opracowanie procedury zgłaszania poważnych incydentów do właściwego CSIRT w ciągu 24 godzin od wykrycia.", priority: 1, appliesToType: "all", sortOrder: 7 },
    { code: "KSC-08", category: "Incydenty", title: "Rejestr incydentów bezpieczeństwa", description: "Prowadzenie rejestru incydentów bezpieczeństwa z dokumentacją przebiegu, podjętych działań i wyciągniętych wniosków.", priority: 2, appliesToType: "all", sortOrder: 8 },
    { code: "KSC-09", category: "Incydenty", title: "Wyznaczenie osoby kontaktowej ds. KSC", description: "Wyznaczenie osoby odpowiedzialnej za kontakt z organami właściwymi ds. cyberbezpieczeństwa.", priority: 1, appliesToType: "all", sortOrder: 9 },
    { code: "KSC-10", category: "Ciągłość działania", title: "Plan ciągłości działania", description: "Opracowanie planów ciągłości działania i odzyskiwania po awarii (BCP/DRP) dla kluczowych usług.", priority: 2, appliesToType: "all", sortOrder: 10 },
    { code: "KSC-11", category: "Ciągłość działania", title: "Kopie zapasowe i redundancja", description: "Wdrożenie systemu tworzenia kopii zapasowych i zapewnienie redundancji kluczowych systemów.", priority: 2, appliesToType: "all", sortOrder: 11 },
    { code: "KSC-12", category: "Audyt", title: "Przeprowadzenie audytu bezpieczeństwa", description: "Przeprowadzenie audytu bezpieczeństwa systemów informacyjnych co najmniej raz na 2 lata.", priority: 3, appliesToType: "essential", sortOrder: 12 },
    { code: "KSC-13", category: "Szkolenia", title: "Szkolenia z cyberbezpieczeństwa", description: "Regularne szkolenia pracowników z zakresu cyberbezpieczeństwa i higieny cyfrowej.", priority: 2, appliesToType: "all", sortOrder: 13 },
    { code: "KSC-14", category: "Szkolenia", title: "Szkolenia kadry zarządzającej", description: "Szkolenia kadry zarządzającej z zakresu nadzoru nad cyberbezpieczeństwem podmiotu.", priority: 2, appliesToType: "essential", sortOrder: 14 },
    { code: "KSC-15", category: "Rejestracja", title: "Rejestracja w systemie teleinformatycznym", description: "Rejestracja podmiotu w systemie teleinformatycznym organu właściwego (system S46).", priority: 1, appliesToType: "all", sortOrder: 15 },
  ];

  for (const item of checklistItems) {
    await prisma.checklistItem.upsert({
      where: { code: item.code },
      update: {},
      create: item,
    });
  }
  console.log("✓ Checklist items created");

  // --- Test Organization + User ---
  const org = await prisma.organization.upsert({
    where: { nip: "1234567890" },
    update: {},
    create: {
      name: "TechCorp Sp. z o.o.",
      nip: "1234567890",
      sector: "Energia",
      size: "medium",
      type: "essential",
      website: "https://techcorp.pl",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@silers.pl" },
    update: {},
    create: {
      email: "admin@silers.pl",
      name: "Super Admin",
      role: "superadmin",
    },
  });

  await prisma.user.upsert({
    where: { email: "jan@techcorp.pl" },
    update: {},
    create: {
      email: "jan@techcorp.pl",
      name: "Jan Kowalski",
      role: "org_admin",
      organizationId: org.id,
    },
  });

  console.log("✓ Test organization and users created");

  // --- Plans ---
  const plans = [
    { name: "Starter", code: "starter", priceMonthly: 199, priceYearly: 1990, maxUsers: 3, features: ["Checklista compliance", "Profil firmy", "1 szablon dokumentu", "Email support"], sortOrder: 1 },
    { name: "Professional", code: "professional", priceMonthly: 499, priceYearly: 4990, maxUsers: 10, features: ["Wszystko ze Starter", "Pełna checklista", "Wszystkie szablony", "Rejestr incydentów", "Priority support"], sortOrder: 2 },
    { name: "Enterprise", code: "enterprise", priceMonthly: 999, priceYearly: 9990, maxUsers: 50, features: ["Wszystko z Professional", "Dedykowany opiekun", "Custom integracje", "SLA 99.9%", "Onboarding"], sortOrder: 3 },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: {},
      create: plan,
    });
  }
  console.log("✓ Plans created");

  console.log("\n✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
