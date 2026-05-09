import { requireMaestro } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ClassForm from "../ClassForm";

export const dynamic = "force-dynamic";

export default async function NovaTurmaPage() {
  await requireMaestro();
  const supabase = await createClient();
  const { data: lessons } = await supabase.from("lessons").select("id, title").order("title");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nova turma</h1>
      <ClassForm lessons={lessons ?? []} />
    </div>
  );
}
