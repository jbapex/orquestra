import { notFound } from "next/navigation";
import { requireMaestro } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import MusicoForm from "./MusicoForm";

export const dynamic = "force-dynamic";

export default async function MusicoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireMaestro();
  const { id } = await params;
  const supabase = await createClient();

  const { data: musico } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!musico) notFound();

  const { data: levels } = await supabase
    .from("levels")
    .select("*")
    .order("position");

  const { data: levelHistory } = await supabase
    .from("musician_levels")
    .select("achieved_at, levels(id, name, position)")
    .eq("musico_id", id)
    .order("achieved_at", { ascending: false });

  const { data: assignments } = await supabase
    .from("assignments")
    .select("id, status, score, completed_at, lessons(id, title)")
    .eq("musico_id", id)
    .order("assigned_at", { ascending: false });

  const { data: attendance } = await supabase
    .from("attendance")
    .select("present, classes(id, scheduled_at, topic)")
    .eq("musico_id", id)
    .order("classes(scheduled_at)", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{musico.full_name}</h1>
        <p className="text-sm text-gray-600 capitalize">{musico.role}</p>
      </div>

      <MusicoForm musico={musico} levels={levels ?? []} currentLevelId={(levelHistory?.[0]?.levels as any)?.id ?? null} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="font-semibold">Histórico de níveis</h2>
          {levelHistory && levelHistory.length > 0 ? (
            <ul className="mt-3 divide-y divide-gray-100">
              {levelHistory.map((h, i) => (
                <li key={i} className="flex items-center justify-between py-2 text-sm">
                  <span>{(h.levels as any).name}</span>
                  <span className="text-gray-500">
                    {new Date(h.achieved_at).toLocaleDateString("pt-BR")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">Nenhum nível registrado.</p>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold">Aulas atribuídas</h2>
          {assignments && assignments.length > 0 ? (
            <ul className="mt-3 divide-y divide-gray-100">
              {assignments.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{(a.lessons as any)?.title ?? "—"}</span>
                  <span className="badge">{a.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">Nenhuma aula atribuída.</p>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold">Presença recente</h2>
        {attendance && attendance.length > 0 ? (
          <ul className="mt-3 divide-y divide-gray-100">
            {attendance.map((a, i) => (
              <li key={i} className="flex items-center justify-between py-2 text-sm">
                <span>
                  {(a.classes as any)?.topic} —{" "}
                  <span className="text-gray-500">
                    {new Date((a.classes as any)?.scheduled_at).toLocaleString("pt-BR")}
                  </span>
                </span>
                <span className={a.present ? "text-green-700" : "text-red-600"}>
                  {a.present ? "Presente" : "Ausente"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">Sem registros de presença.</p>
        )}
      </div>
    </div>
  );
}
