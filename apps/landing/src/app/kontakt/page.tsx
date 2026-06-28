import { Card, CardContent } from "@kscsystem/ui";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { ContactForm } from "./_components/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-surface">
      <LandingNav />

      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-3">Kontakt</h1>
            <p className="text-gray-400">Masz pytania? Chętnie pomożemy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Mail, label: "Email", value: "biuro@silers.pl" },
              { icon: Phone, label: "Telefon", value: "+48 575 662 664" },
              { icon: MapPin, label: "Biuro", value: "Garwolin / Warszawa" },
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 mx-auto mb-3">
                    <item.icon size={20} />
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-white">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="max-w-xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold text-white mb-6">Wyślij wiadomość</h3>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
