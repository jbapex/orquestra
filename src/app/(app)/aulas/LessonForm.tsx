"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Lesson, Level, Subject } from "@/lib/types";

export default function LessonForm({
  lesson,
  levels,
  subjects,
}: {
  lesson?: Lesson;
  levels: Level[];
  subjects: Subject[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [levelId, setLevelId] = useState(lesson?.level_id ?? "");
  const [subjectId, setSubjectId] = useState(lesson?.subject_id ?? "");
  const [content, setContent] = useState(lesson?.content ?? "");
  const [materialsUrl, setMaterialsUrl] = useState(lesson?.materials_url ?? "");
  const [position, setPosition] = useState(String(lesson?.position ?? 0));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    const payload = {
      title,
      level_id: levelId || null,
      subject_id: subjectId || null,
      content: content || null,
      materials_url: materialsUrl || null,
      position: Number(position) || 0,
    };

    const { data, error } = lesson
      ? await supabase.from("lessons").update(payload).eq("id", lesson.id).select().single()
      : await supabase.from("lessons").insert(payload).select().single();

    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push(`/aulas/${(data as any).id}`);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="card space-y-4">
      <div>
        <label className="label">Título</label>
        <input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Nível</label>
          <select className="input" value={levelId} onChange={(e) => setLevelId(e.target.value)}>
            <option value="">— sem nível —</option>
            {levels.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Assunto</label>
          <select className="input" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="">— sem assunto —</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Ordem</label>
          <input type="number" className="input" value={position} onChange={(e) => setPosition(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label">Conteúdo da aula</label>
        <textarea className="input" rows={8} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Objetivos, exercícios, observações..." />
      </div>

      <div>
        <label className="label">Link do material (opcional)</label>
        <input className="input" type="url" value={materialsUrl} onChange={(e) => setMaterialsUrl(e.target.value)} placeholder="https://..." />
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Cancelar
        </button>
        <button disabled={saving} className="btn-primary">
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
