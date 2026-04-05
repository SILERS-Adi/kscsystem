import { Card, CardContent } from "@kscsystem/ui";
import { HelpCircle, Banknote, FileX, Zap } from "lucide-react";

const problems = [
  {
    icon: HelpCircle,
    title: "Nie wiesz, czy podlegasz",
    description: "Nowelizacja KSC rozszerzyła zakres o setki firm. Możesz podlegać, nawet o tym nie wiedząc.",
  },
  {
    icon: Banknote,
    title: "Kary do 10 mln EUR",
    description: "Za brak zgodności grożą kary finansowe do 10 milionów EUR lub 2% rocznego obrotu.",
  },
  {
    icon: FileX,
    title: "Brak dokumentów i procedur",
    description: "Wymagane polityki, rejestry i procedury — a Twoja firma nie ma nawet szablonów.",
  },
  {
    icon: Zap,
    title: "Chaos informacyjny",
    description: "Dziesiątki stron przepisów, interpretacji i wytycznych. Nikt nie wie od czego zacząć.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 lg:py-28 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">Problem</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Nowa ustawa KSC wprowadza
            <br />
            <span className="text-red-400">realne obowiązki dla firm</span>
          </h2>
          <p className="text-gray-400">
            Od 2025 roku tysiące polskich firm muszą spełnić nowe wymagania cyberbezpieczeństwa.
            Większość nie jest na to gotowa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((p, i) => (
            <Card key={i} className="group hover:border-red-500/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400 mb-4 group-hover:bg-red-500/20 transition-colors duration-300">
                  <p.icon size={22} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
