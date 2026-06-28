"use client";

import { useState, useTransition } from "react";
import { Button, Input } from "@kscsystem/ui";
import { CheckCircle2 } from "lucide-react";
import { submitContact } from "../_actions/contact-actions";

export function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  function send() {
    setError(null);
    start(async () => {
      const res = await submitContact({
        name: `${firstName} ${lastName}`.trim(),
        email,
        message,
      });
      if (res.error) setError(res.error);
      else setDone(true);
    });
  }

  if (done) {
    return (
      <div className="py-8 text-center">
        <CheckCircle2 size={36} className="mx-auto text-emerald-400 mb-3" />
        <p className="text-white font-medium">Dziękujemy — wiadomość wysłana.</p>
        <p className="text-sm text-gray-400 mt-1">Odezwiemy się najszybciej jak to możliwe.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Imię</label>
          <Input placeholder="Jan" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Nazwisko</label>
          <Input placeholder="Kowalski" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Email *</label>
        <Input type="email" placeholder="twoj@email.pl" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Wiadomość *</label>
        <textarea
          rows={4}
          placeholder="Twoja wiadomość..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex w-full rounded-lg border border-border bg-surface-200 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:border-brand-500/50 transition-colors resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button className="w-full" onClick={send} disabled={pending}>
        {pending ? "Wysyłanie…" : "Wyślij wiadomość"}
      </Button>
      <p className="text-xs text-gray-500 text-center">
        Wysyłając, akceptujesz <a href="/polityka-prywatnosci" className="underline hover:text-gray-300">politykę prywatności</a>.
      </p>
    </div>
  );
}
