"use client";

import Link from "next/link";
import { Button, Card, CardContent, Badge, Input, Logo } from "@kscsystem/ui";
import { Shield, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function WynikPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center">
          <Logo size="sm" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Result */}
        <div className="text-center mb-12">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 mb-6">
            <AlertTriangle size={40} />
          </div>

          <Badge variant="destructive" className="mb-4">Podmiot kluczowy</Badge>

          <h1 className="text-3xl font-bold text-white mb-3">
            Twoja firma podlega pod KSC
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Na podstawie Twoich odpowiedzi, Twoja organizacja zostanie sklasyfikowana jako
            <strong className="text-white"> podmiot kluczowy</strong> w rozumieniu nowelizacji ustawy o KSC.
          </p>
        </div>

        {/* Score */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-400">Wynik klasyfikacji</span>
              <span className="text-3xl font-bold text-gradient">75 / 100</span>
            </div>

            <div className="space-y-3">
              {[
                { label: "Sektor kluczowy (energia)", points: 30, icon: CheckCircle2 },
                { label: "Wielkość organizacji (250+)", points: 20, icon: CheckCircle2 },
                { label: "Obrót powyżej 50M EUR", points: 20, icon: CheckCircle2 },
                { label: "Brak wdrożonego ISMS", points: 5, icon: AlertTriangle },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    <item.icon size={14} className="text-brand-400" />
                    <span className="text-sm text-gray-300">{item.label}</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-white">+{item.points}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Obligations preview */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-white mb-4">Twoje główne obowiązki</h3>
            <ul className="space-y-3">
              {[
                "Wdrożenie systemu zarządzania ryzykiem",
                "Zgłaszanie incydentów do CSIRT w ciągu 24h",
                "Wyznaczenie osoby kontaktowej ds. cyberbezpieczeństwa",
                "Przeprowadzanie regularnych audytów bezpieczeństwa",
                "Opracowanie planu ciągłości działania",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <Shield size={16} className="text-brand-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Lead capture */}
        <Card className="overflow-hidden">
          <div className="h-1 gradient-brand" />
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-white mb-2">
              Otrzymaj pełny raport i plan działania
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Podaj swoje dane, a wyślemy Ci szczegółowy raport z listą obowiązków i rekomendowanym harmonogramem wdrożenia.
            </p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Imię i nazwisko" />
                <Input placeholder="Nazwa firmy" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input type="email" placeholder="Email" />
                <Input placeholder="Telefon (opcjonalnie)" />
              </div>
              <Button className="w-full">
                Pobierz raport
                <ArrowRight size={16} />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Twoje dane są bezpieczne. Nie udostępniamy ich podmiotom trzecim.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-400 mb-4">Chcesz od razu zarządzać zgodnością?</p>
          <Button variant="outline" asChild>
            <Link href="https://kscsystem.pl/register">
              Załóż konto w KSCSYSTEM
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
