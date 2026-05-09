import Link from "next/link";
import { requireMaestro } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MusicosPage() {
  await requireMaestro();
  const supabase = await createClient();

  const { data: musicos } = await supabase
    .from("profiles")
    .select("id, full_name, instrument, phone, start_date, role")
    .order("full_name");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Músicos</h1>
          <p className="text-sm text-gray-600">
            Lista de todos os cadastrados no grupo.
          </p>
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-th">Nome</th>
              <th className="table-th">Função</th>
              <th className="table-th">Instrumento</th>
              <th className="table-th">Contato</th>
              <th className="table-th">Início</th>
              <th className="table-th"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {(musicos ?? []).map((m) => (
              <tr key={m.id}>
                <td className="table-td font-medium">{m.full_name}</td>
                <td className="table-td capitalize">{m.role}</td>
                <td className="table-td">{m.instrument || "—"}</td>
                <td className="table-td">{m.phone || "—"}</td>
                <td className="table-td">
                  {m.start_date
                    ? new Date(m.start_date).toLocaleDateString("pt-BR")
                    : "—"}
                </td>
                <td className="table-td">
                  <Link href={`/musicos/${m.id}`} className="text-brand-700 hover:underline">
                    Detalhes
                  </Link>
                </td>
              </tr>
            ))}
            {(!musicos || musicos.length === 0) && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-sm text-gray-500">
                  Ninguém cadastrado ainda. Peça para os músicos criarem conta em /signup.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
