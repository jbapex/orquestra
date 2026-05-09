import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import AssignToMusicos from "./AssignToMusicos";

export const dynamic = "force-dynamic";

export default async function AulaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireProfile();
  const { id } = await params;
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*, levels(name), subjects(name)")
    .eq("id", id)
    .single();

  if (!lesson) notFound();

  const isMaestro = profile.role === "maestro";

  const { data: musicos } = isMaestro
    ? await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "musico")
        .order("full_name")
    : { data: [] };

  const { data: assignments } = await supabase
    .from("assignments")
    .select("musico_id, status, score, profiles(full_name)")
    .eq("lesson_id", id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            {(lesson.levels as any)?.name && (
              <span className="badge">{(lesson.levels as any).name}</span>
            )}
            {(lesson.subjects as any)?.name && (
              <span className="badge">{(lesson.subjects as any).name}</span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold">{lesson.title}</h1>
        </div>
        {isMaestro && (
          <Link href={`/aulas/${id}/editar`} className="btn-secondary">
            Editar
          </Link>
        )}
      </div>

      {lesson.content && (
        <div className="card whitespace-pre-wrap text-sm leading-relaxed">
          {lesson.content}
        </div>
      )}

      {lesson.materials_url && (
        <div className="card">
          <p className="text-sm">
            Material:{" "}
            <a className="text-brand-700 hover:underline" href={lesson.materials_url} target="_blank" rel="noreferrer">
              {lesson.materials_url}
            </a>
          </p>
        </div>
      )}

      {isMaestro && (
        <AssignToMusicos
          lessonId={id}
          musicos={musicos ?? []}
          assignments={(assignments ?? []) as any}
        />
      )}
    </div>
  );
}
