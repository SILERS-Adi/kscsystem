"use client";

import { useState, useTransition } from "react";
import { Button, Input } from "@kscsystem/ui";
import { Check } from "lucide-react";
import { updateMyName, changeMyPassword } from "../_actions/account-actions";

export function NameForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Imię i nazwisko</label>
        <Input value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} />
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" disabled={pending} onClick={() => start(async () => { await updateMyName(name); setSaved(true); })}>
          {pending ? "Zapisywanie…" : "Zapisz zmiany"}
        </Button>
        {saved && !pending && <span className="inline-flex items-center gap-1 text-xs text-emerald-400"><Check size={14} /> Zapisano</span>}
      </div>
    </div>
  );
}

export function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Obecne hasło</label>
        <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="••••••••" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Nowe hasło</label>
        <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="Min. 8 znaków" />
      </div>
      {msg?.error && <p className="text-sm text-red-400">{msg.error}</p>}
      {msg?.ok && <p className="inline-flex items-center gap-1 text-sm text-emerald-400"><Check size={14} /> Hasło zmienione</p>}
      <Button
        size="sm"
        variant="secondary"
        disabled={pending || !current || !next}
        onClick={() => start(async () => {
          const res = await changeMyPassword(current, next);
          setMsg(res);
          if (res.ok) { setCurrent(""); setNext(""); }
        })}
      >
        {pending ? "Zmienianie…" : "Zmień hasło"}
      </Button>
    </div>
  );
}
