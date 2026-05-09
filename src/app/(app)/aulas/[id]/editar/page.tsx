import { notFound } from "next/navigation";
import { requireMaestro } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import LessonForm from "../../LessonForm";

export const dynamic = "force-dynamic";

export default async function EditarAulaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireMaestro();
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: lesson }, { data: levels }, { data: subjects }] = await Promise.all([
    supabase.from("lessons").select("*").eq("id", id).single(),
    supabase.from("levels").select("*").order("position"),
    supabase.from("subjects").select("*").order("name"),
  ]);

  if (!lesson) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar aula</h1>
      <LessonForm lesson={lesson as any} levels={levels ?? []} subjects={subjects ?? []} />
    </div>
  );
}
