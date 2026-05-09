import { requireMaestro } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import LessonForm from "../LessonForm";

export const dynamic = "force-dynamic";

export default async function NovaAulaPage() {
  await requireMaestro();
  const supabase = await createClient();
  const [{ data: levels }, { data: subjects }] = await Promise.all([
    supabase.from("levels").select("*").order("position"),
    supabase.from("subjects").select("*").order("name"),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nova aula</h1>
      <LessonForm levels={levels ?? []} subjects={subjects ?? []} />
    </div>
  );
}
