import { requireMaestro } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AuditoriaPage() {
  await requireMaestro();
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("impersonation_log")
    .select("*")
    .order("used_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Auditoria — login de suporte</h1>
        <p className="text-sm text-gray-600">
          Cada vez que a senha mestra é usada para acessar a conta de algum
          usuário, fica registrado aqui.
        </p>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-th">Quando</th>
              <th className="table-th">E-mail acessado</th>
              <th className="table-th">IP</th>
              <th className="table-th">User-Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {(logs ?? []).map((l) => (
              <tr key={l.id}>
                <td className="table-td">
                  {new Date(l.used_at).toLocaleString("pt-BR")}
                </td>
                <td className="table-td font-medium">{l.target_email}</td>
                <td className="table-td">{l.ip || "—"}</td>
                <td className="table-td max-w-xs truncate text-gray-500">
                  {l.user_agent || "—"}
                </td>
              </tr>
            ))}
            {(!logs || logs.length === 0) && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-sm text-gray-500">
                  Nenhum acesso de suporte registrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
