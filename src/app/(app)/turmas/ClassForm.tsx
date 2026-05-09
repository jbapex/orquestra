"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type LessonOpt = { id: string; title: string };

export default function ClassForm({ lessons }: { lessons: LessonOpt[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [topic, setTopic] = useState("");
  const [scheduledAt, setScheduledAt] = useState(
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16),
  );
  const [lessonId, setLessonId] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    const { data, error } = await supabase
      .from("classes")
      .insert({
        topic,
        scheduled_at: new Date(scheduledAt).toISOString(),
        lesson_id: lessonId || null,
        notes: notes || null,
      })
      .select()
      .single();
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }

    const { data: musicos } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "musico");
    if (musicos && musicos.length > 0) {
      await supabase.from("attendance").insert(
        musicos.map((m) => ({
          class_id: (data as any).id,
          musico_id: m.id,
          present: false,
        })),
      );
    }

    router.push(`/turmas/${(data as any).id}`);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="card space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Data e hora</label>
          <input type="datetime-local" required className="input" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
        </div>
        <div>
          <label className="label">Aula vinculada (opcional)</label>
          <select className="input" value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
            <option value="">— nenhuma —</option>
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Tema do encontro</label>
        <input className="input" required value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: Ensaio do hino 12 — naipe de sopros" />
      </div>
      <div>
        <label className="label">Observações</label>
        <textarea className="input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="flex justify-end">
        <button disabled={saving} className="btn-primary">
          {saving ? "Salvando..." : "Criar turma"}
        </button>
      </div>
    </form>
  );
}
