"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Level, Profile } from "@/lib/types";

export default function MusicoForm({
  musico,
  levels,
  currentLevelId,
}: {
  musico: Profile;
  levels: Level[];
  currentLevelId: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState(musico.full_name);
  const [instrument, setInstrument] = useState(musico.instrument ?? "");
  const [phone, setPhone] = useState(musico.phone ?? "");
  const [startDate, setStartDate] = useState(musico.start_date ?? "");
  const [notes, setNotes] = useState(musico.notes ?? "");
  const [role, setRole] = useState(musico.role);
  const [levelId, setLevelId] = useState(currentLevelId ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        instrument: instrument || null,
        phone: phone || null,
        start_date: startDate || null,
        notes: notes || null,
        role,
      })
      .eq("id", musico.id);

    if (error) {
      setSaving(false);
      setErr(error.message);
      return;
    }

    if (levelId && levelId !== currentLevelId) {
      const { error: levelErr } = await supabase
        .from("musician_levels")
        .upsert(
          { musico_id: musico.id, level_id: levelId },
          { onConflict: "musico_id,level_id" },
        );
      if (levelErr) {
        setSaving(false);
        setErr(levelErr.message);
        return;
      }
    }

    setSaving(false);
    setMsg("Salvo!");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="card space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Nome completo</label>
          <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div>
          <label className="label">Função</label>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="musico">Músico</option>
            <option value="maestro">Maestro</option>
          </select>
        </div>
        <div>
          <label className="label">Instrumento</label>
          <input className="input" value={instrument} onChange={(e) => setInstrument(e.target.value)} />
        </div>
        <div>
          <label className="label">Contato</label>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="label">Início no grupo</label>
          <input type="date" className="input" value={startDate ?? ""} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="label">Nível atual</label>
          <select className="input" value={levelId} onChange={(e) => setLevelId(e.target.value)}>
            <option value="">— sem nível —</option>
            {levels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Observações</label>
        <textarea className="input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}
      {msg && <p className="text-sm text-green-700">{msg}</p>}

      <div className="flex justify-end">
        <button disabled={saving} className="btn-primary">
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
