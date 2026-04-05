import { Card, CardContent } from "@kscsystem/ui";
import { ClipboardCheck, FileText, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    title: "Checklista obowiązków",
    description: "Interaktywna lista wymagań KSC dopasowana do Twojej klasyfikacji. Oznaczaj postęp, śledź status każdego obowiązku.",
    highlight: "Spersonalizowana pod Twoją firmę",
  },
  {
    icon: FileText,
    title: "Generator dokumentów",
    description: "Gotowe szablony polityk i procedur wypełnione danymi Twojej organizacji. Wygeneruj w minutę, nie w tygodnie.",
    highlight: "Polityki, procedury, rejestry",
  },
  {
    icon: BarChart3,
    title: "Dashboard gotowości",
    description: "Jeden widok na cały stan zgodności. Procent gotowości, krytyczne braki, najbliższe kroki — wszystko na raz.",
    highlight: "Realtme tracking postępu",
  },
  {
    icon: Shield,
    title: "Przygotowanie do audytu",
    description: "Dokumentacja w jednym miejscu, historia zmian, dowody wdrożenia. Gotowość na kontrolę organu właściwego.",
    highlight: "Wszystko udokumentowane",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 border-t border-border bg-surface-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold text-accent-400 uppercase tracking-wider mb-3">Funkcje</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Co dostajesz w KSCSYSTEM?
          </h2>
          <p className="text-gray-400">
            Wszystko, czego potrzebujesz do zgodności z KSC — w jednym narzędziu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <Card key={i} className="group hover:border-brand-500/30 transition-all duration-300 overflow-hidden">
              <CardContent className="p-7">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 shrink-0 group-hover:bg-brand-500/20 group-hover:scale-110 transition-all duration-300">
                    <f.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-3">{f.description}</p>
                    <span className="inline-flex items-center text-xs font-medium text-brand-400 bg-brand-500/10 rounded-full px-3 py-1">
                      {f.highlight}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
