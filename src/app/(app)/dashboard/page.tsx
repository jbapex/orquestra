import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const isMaestro = profile.role === "maestro";

  const [{ count: musicosCount }, { count: aulasCount }, { count: turmasCount }] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "musico"),
      supabase.from("lessons").select("id", { count: "exact", head: true }),
      supabase.from("classes").select("id", { count: "exact", head: true }),
    ]);

  const { data: proximas } = await supabase
    .from("classes")
    .select("id, scheduled_at, topic")
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(5);

  const { data: meuNivel } = !isMaestro
    ? await supabase
        .from("musician_levels")
        .select("achieved_at, levels(name, position)")
        .eq("musico_id", profile.id)
        .order("achieved_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {profile.full_name.split(" ")[0]}!
        </h1>
        <p className="text-sm text-gray-600">
          {isMaestro
            ? "Visão geral do grupo de música."
            : "Acompanhe suas aulas e seu progresso."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Músicos cadastrados" value={musicosCount ?? 0} href="/musicos" maestroOnly={!isMaestro} />
        <Stat label="Planos de aula" value={aulasCount ?? 0} href="/aulas" />
        <Stat label="Turmas" value={turmasCount ?? 0} href="/turmas" />
      </div>

      {!isMaestro && meuNivel?.levels && (
        <div className="card">
          <h2 className="font-semibold">Seu nível atual</h2>
          <p className="mt-1 text-sm text-gray-600">
            <span className="badge mr-2">{(meuNivel.levels as any).name}</span>
            Conquistado em{" "}
            {new Date(meuNivel.achieved_at).toLocaleDateString("pt-BR")}.
          </p>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Próximas turmas</h2>
          <Link href="/turmas" className="text-sm text-brand-700 hover:underline">
            Ver todas
          </Link>
        </div>
        {proximas && proximas.length > 0 ? (
          <ul className="mt-3 divide-y divide-gray-100">
            {proximas.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2 text-sm">
                <span>{c.topic}</span>
                <span className="text-gray-500">
                  {new Date(c.scheduled_at).toLocaleString("pt-BR")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">Nenhuma turma agendada.</p>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  maestroOnly,
}: {
  label: string;
  value: number;
  href: string;
  maestroOnly?: boolean;
}) {
  if (maestroOnly) {
    return (
      <div className="card">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
      </div>
    );
  }
  return (
    <Link href={href} className="card transition-shadow hover:shadow-md">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </Link>
  );
}
