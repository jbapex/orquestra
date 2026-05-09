import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function TurmasPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: classes } = await supabase
    .from("classes")
    .select("id, scheduled_at, topic, lessons(title)")
    .order("scheduled_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Turmas / encontros</h1>
          <p className="text-sm text-gray-600">
            Cada turma tem data, tema e lista de presença.
          </p>
        </div>
        {profile.role === "maestro" && (
          <Link href="/turmas/nova" className="btn-primary">
            Nova turma
          </Link>
        )}
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-th">Data</th>
              <th className="table-th">Tema</th>
              <th className="table-th">Aula vinculada</th>
              <th className="table-th"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {(classes ?? []).map((c) => (
              <tr key={c.id}>
                <td className="table-td">
                  {new Date(c.scheduled_at).toLocaleString("pt-BR")}
                </td>
                <td className="table-td font-medium">{c.topic}</td>
                <td className="table-td">{(c.lessons as any)?.title ?? "—"}</td>
                <td className="table-td">
                  <Link href={`/turmas/${c.id}`} className="text-brand-700 hover:underline">
                    Abrir
                  </Link>
                </td>
              </tr>
            ))}
            {(!classes || classes.length === 0) && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-sm text-gray-500">
                  Nenhuma turma registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
