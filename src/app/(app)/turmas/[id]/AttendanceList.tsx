"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Row = {
  musico_id: string;
  present: boolean;
  notes: string | null;
  profiles: { full_name: string; instrument: string | null } | null;
};

export default function AttendanceList({
  classId,
  rows,
  canEdit,
}: {
  classId: string;
  rows: Row[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [working, setWorking] = useState<string | null>(null);

  async function setPresent(musico_id: string, present: boolean) {
    setWorking(musico_id);
    const { error } = await supabase
      .from("attendance")
      .upsert(
        { class_id: classId, musico_id, present },
        { onConflict: "class_id,musico_id" },
      );
    setWorking(null);
    if (error) return alert(error.message);
    router.refresh();
  }

  async function setNotes(musico_id: string, notes: string) {
    const { error } = await supabase
      .from("attendance")
      .upsert(
        { class_id: classId, musico_id, notes: notes || null, present: rows.find(r => r.musico_id === musico_id)?.present ?? false },
        { onConflict: "class_id,musico_id" },
      );
    if (error) alert(error.message);
    router.refresh();
  }

  if (rows.length === 0) {
    return (
      <div className="card text-sm text-gray-500">
        Nenhum músico cadastrado na turma ainda.
      </div>
    );
  }

  const presentes = rows.filter((r) => r.present).length;

  return (
    <div className="card overflow-x-auto p-0">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="font-semibold">Presença</h2>
        <p className="text-sm text-gray-500">
          {presentes}/{rows.length} presentes
        </p>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="table-th">Músico</th>
            <th className="table-th">Instrumento</th>
            <th className="table-th">Presente</th>
            {canEdit && <th className="table-th">Observação</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((r) => (
            <tr key={r.musico_id}>
              <td className="table-td font-medium">{r.profiles?.full_name ?? "—"}</td>
              <td className="table-td">{r.profiles?.instrument ?? "—"}</td>
              <td className="table-td">
                {canEdit ? (
                  <input
                    type="checkbox"
                    checked={r.present}
                    disabled={working === r.musico_id}
                    onChange={(e) => setPresent(r.musico_id, e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                ) : r.present ? (
                  <span className="text-green-700">Presente</span>
                ) : (
                  <span className="text-gray-500">Ausente</span>
                )}
              </td>
              {canEdit && (
                <td className="table-td">
                  <input
                    className="input"
                    defaultValue={r.notes ?? ""}
                    placeholder="ex: chegou atrasado"
                    onBlur={(e) => {
                      if (e.target.value !== (r.notes ?? "")) {
                        setNotes(r.musico_id, e.target.value);
                      }
                    }}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
