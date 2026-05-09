"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Level } from "@/lib/types";

export default function LevelsManager({
  initialLevels,
  countMap,
  canEdit,
}: {
  initialLevels: Level[];
  countMap: Record<string, number>;
  canEdit: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [levels] = useState(initialLevels);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function addLevel(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    const nextPos = (levels[levels.length - 1]?.position ?? 0) + 1;
    const { error } = await supabase
      .from("levels")
      .insert({ name: newName, description: newDesc || null, position: nextPos });
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setNewName("");
    setNewDesc("");
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Remover este nível?")) return;
    const { error } = await supabase.from("levels").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  async function updateField(id: string, patch: Partial<Level>) {
    const { error } = await supabase.from("levels").update(patch).eq("id", id);
    if (error) alert(error.message);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {levels.map((l) => (
          <div key={l.id} className="card">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="badge mb-1">Nível {l.position}</span>
                {canEdit ? (
                  <input
                    defaultValue={l.name}
                    onBlur={(e) => {
                      if (e.target.value !== l.name)
                        updateField(l.id, { name: e.target.value });
                    }}
                    className="input mt-1 font-semibold"
                  />
                ) : (
                  <h3 className="font-semibold">{l.name}</h3>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {countMap[l.id] ?? 0} músicos
              </span>
            </div>

            {canEdit ? (
              <textarea
                defaultValue={l.description ?? ""}
                rows={3}
                onBlur={(e) => {
                  if (e.target.value !== (l.description ?? ""))
                    updateField(l.id, { description: e.target.value || null });
                }}
                className="input mt-3 text-sm"
                placeholder="Descrição do que esse nível representa..."
              />
            ) : (
              <p className="mt-3 text-sm text-gray-600">
                {l.description || "—"}
              </p>
            )}

            {canEdit && (
              <div className="mt-3 flex justify-end">
                <button onClick={() => remove(l.id)} className="text-sm text-red-600 hover:underline">
                  Remover
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {canEdit && (
        <form onSubmit={addLevel} className="card space-y-3">
          <h2 className="font-semibold">Novo nível</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input className="input sm:col-span-1" required placeholder="Nome (ex: Avançado)" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <input className="input sm:col-span-2" placeholder="Descrição (opcional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <div className="flex justify-end">
            <button disabled={saving} className="btn-primary">
              {saving ? "Adicionando..." : "Adicionar nível"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
