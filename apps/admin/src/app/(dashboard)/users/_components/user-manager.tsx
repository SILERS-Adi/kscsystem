"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, Badge, Button, Avatar } from "@kscsystem/ui";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  createUser,
  updateUser,
  toggleUserActive,
  deleteUser,
  type UserInput,
} from "../_actions/user-actions";

export interface UserView {
  id: string;
  email: string;
  name: string | null;
  role: string;
  organizationId: string | null;
  isActive: boolean;
  orgName: string | null;
}
export interface OrgOpt { id: string; name: string }

const roleVariant: Record<string, "destructive" | "default" | "muted"> = {
  superadmin: "destructive",
  org_admin: "default",
  member: "muted",
};
const roleLabel: Record<string, string> = { superadmin: "Super admin", org_admin: "Admin firmy", member: "Użytkownik" };
const inputCls = "w-full h-9 rounded-lg border border-border bg-surface-200 px-3 text-sm text-white";

function UserForm({ initial, orgs, onClose }: { initial?: UserView; orgs: OrgOpt[]; onClose: () => void }) {
  const [f, setF] = useState<UserInput>({
    email: initial?.email ?? "",
    name: initial?.name ?? "",
    role: initial?.role ?? "member",
    organizationId: initial?.organizationId ?? "",
    isActive: initial?.isActive ?? true,
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const set = (k: keyof UserInput, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  function save() {
    setError(null);
    start(async () => {
      const res = initial ? await updateUser(initial.id, f) : await createUser(f);
      if (res.error) setError(res.error);
      else onClose();
    });
  }

  return (
    <div className="rounded-lg border border-brand-500/30 bg-surface-100 p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="text-xs text-gray-400">Email *</label><input className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
        <div><label className="text-xs text-gray-400">Imię i nazwisko</label><input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div>
          <label className="text-xs text-gray-400">Rola</label>
          <select className={inputCls} value={f.role} onChange={(e) => set("role", e.target.value)}>
            <option value="member">Użytkownik</option>
            <option value="org_admin">Admin firmy</option>
            <option value="superadmin">Super admin</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400">Organizacja</label>
          <select className={inputCls} value={f.organizationId} onChange={(e) => set("organizationId", e.target.value)}>
            <option value="">— brak —</option>
            {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400">{initial ? "Nowe hasło (puste = bez zmiany)" : "Hasło (opcjonalne)"}</label>
          <input type="password" className={inputCls} value={f.password} onChange={(e) => set("password", e.target.value)} />
        </div>
        <label className="flex items-center gap-2 mt-5 text-sm text-gray-300">
          <input type="checkbox" checked={f.isActive} onChange={(e) => set("isActive", e.target.checked)} /> Aktywny
        </label>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={save} disabled={pending}>{pending ? "Zapisywanie…" : "Zapisz"}</Button>
        <Button size="sm" variant="ghost" onClick={onClose}>Anuluj</Button>
      </div>
    </div>
  );
}

export function UserManager({ users, orgs }: { users: UserView[]; orgs: OrgOpt[] }) {
  const [mode, setMode] = useState<"new" | string | null>(null);
  const [pending, start] = useTransition();

  function remove(u: UserView) {
    if (!confirm(`Usunąć użytkownika ${u.email}?`)) return;
    start(async () => {
      const res = await deleteUser(u.id);
      if (res.error) alert(res.error);
    });
  }

  return (
    <div className="space-y-3">
      {mode === "new" ? (
        <UserForm orgs={orgs} onClose={() => setMode(null)} />
      ) : (
        <Button size="sm" onClick={() => setMode("new")}><Plus size={16} /> Dodaj użytkownika</Button>
      )}

      {users.length === 0 && mode !== "new" && (
        <Card><CardContent><p className="py-6 text-center text-sm text-gray-500">Brak użytkowników.</p></CardContent></Card>
      )}

      {users.map((u) =>
        mode === u.id ? (
          <UserForm key={u.id} initial={u} orgs={orgs} onClose={() => setMode(null)} />
        ) : (
          <div key={u.id} className="flex items-center gap-4 rounded-lg border border-border bg-surface-50 p-4">
            <Avatar fallback={u.name ?? u.email} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{u.name ?? "—"}</p>
              <p className="text-xs text-gray-500">{u.email}</p>
            </div>
            <span className="text-xs text-gray-500 hidden sm:block">{u.orgName ?? "—"}</span>
            <Badge variant={roleVariant[u.role] ?? "muted"}>{roleLabel[u.role] ?? u.role}</Badge>
            <button
              onClick={() => start(async () => { await toggleUserActive(u.id, !u.isActive); })}
              disabled={pending}
              title="Przełącz aktywność"
            >
              <Badge variant={u.isActive ? "default" : "muted"}>{u.isActive ? "Aktywny" : "Nieaktywny"}</Badge>
            </button>
            <button onClick={() => setMode(u.id)} className="p-1.5 text-gray-400 hover:text-white" title="Edytuj"><Pencil size={15} /></button>
            <button onClick={() => remove(u)} disabled={pending} className="p-1.5 text-gray-400 hover:text-red-400 disabled:opacity-50" title="Usuń"><Trash2 size={15} /></button>
          </div>
        )
      )}
    </div>
  );
}
