"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Musico = { id: string; full_name: string };
type Assignment = {
  musico_id: string;
  status: string;
  score: number | null;
  profiles: { full_name: string } | null;
};

export default function AssignToMusicos({
  lessonId,
  musicos,
  assignments,
}: {
  lessonId: string;
  musicos: Musico[];
  assignments: Assignment[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const assigned = new Set(assignments.map((a) => a.musico_id));
  const [selected, setSelected] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function assign() {
    if (!selected) return;
    setBusy(true);
    const { error } = await supabase
      .from("assignments")
      .insert({ lesson_id: lessonId, musico_id: selected });
    setBusy(false);
    if (error) return alert(error.message);
    setSelected("");
    router.refresh();
  }

  async function updateAssignment(musicoId: string, patch: { status?: string; score?: number | null }) {
    const { error } = await supabase
      .from("assignments")
      .update(patch)
      .eq("lesson_id", lessonId)
      .eq("musico_id", musicoId);
    if (error) alert(error.message);
    router.refresh();
  }

  async function remove(musicoId: string) {
    if (!confirm("Remover atribuição?")) return;
    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("lesson_id", lessonId)
      .eq("musico_id", musicoId);
    if (error) alert(error.message);
    router.refresh();
  }

  const disponiveis = musicos.filter((m) => !assigned.has(m.id));

  return (
    <div className="card">
      <h2 className="font-semibold">Atribuir esta aula a músicos</h2>

      <div className="mt-3 flex gap-2">
        <select className="input flex-1" value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">— selecionar músico —</option>
          {disponiveis.map((m) => (
            <option key={m.id} value={m.id}>{m.full_name}</option>
          ))}
        </select>
        <button onClick={assign} disabled={!selected || busy} className="btn-primary">
          Atribuir
        </button>
      </div>

      {assignments.length > 0 && (
        <table className="mt-4 min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="table-th">Músico</th>
              <th className="table-th">Status</th>
              <th className="table-th">Nota</th>
              <th className="table-th"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assignments.map((a) => (
              <tr key={a.musico_id}>
                <td className="table-td">{a.profiles?.full_name ?? "—"}</td>
                <td className="table-td">
                  <select
                    defaultValue={a.status}
                    onChange={(e) => updateAssignment(a.musico_id, { status: e.target.value })}
                    className="input"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="avaliada">Avaliada</option>
                  </select>
                </td>
                <td className="table-td">
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step="0.1"
                    defaultValue={a.score ?? ""}
                    onBlur={(e) =>
                      updateAssignment(a.musico_id, {
                        score: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    className="input w-24"
                  />
                </td>
                <td className="table-td">
                  <button onClick={() => remove(a.musico_id)} className="text-sm text-red-600 hover:underline">
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
