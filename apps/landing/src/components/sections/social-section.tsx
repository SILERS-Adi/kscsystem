import { Card, CardContent } from "@kscsystem/ui";
import { TrendingUp, Building2, Shield, Users } from "lucide-react";

const stats = [
  { value: "120+", label: "Analiz wykonanych", icon: TrendingUp },
  { value: "40+", label: "Firm w trakcie wdrożenia", icon: Building2 },
  { value: "98%", label: "Dokładność klasyfikacji", icon: Shield },
  { value: "5 min", label: "Średni czas do wyniku", icon: Users },
];

export function SocialSection() {
  return (
    <section className="py-20 lg:py-28 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-500/[0.02] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3">Zaufanie</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Firmy już przygotowują się z KSCSYSTEM
          </h2>
          <p className="text-gray-400">
            Dołącz do organizacji, które nie czekają na kontrolę.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
          {stats.map((s, i) => (
            <Card key={i} className="text-center group hover:border-brand-500/30 transition-all duration-300">
              <CardContent className="p-6 lg:p-8">
                <s.icon size={20} className="text-brand-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-3xl lg:text-4xl font-extrabold text-white mb-1">{s.value}</p>
                <p className="text-xs lg:text-sm text-gray-500">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonial placeholder */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-surface-100/50 backdrop-blur-xl border-brand-500/20">
            <CardContent className="p-8 lg:p-10 text-center">
              <p className="text-lg lg:text-xl text-gray-300 italic leading-relaxed mb-6">
                &ldquo;Dzięki KSCSYSTEM w tydzień przeszliśmy od zera do 70% gotowości na KSC.
                Checklista i generator dokumentów zaoszczędziły nam tygodni pracy.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-white">Marek Wiśniewski</p>
                <p className="text-xs text-gray-500">CTO, SecureNet Polska</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
