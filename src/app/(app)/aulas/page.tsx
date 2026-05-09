import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AulasPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, content, levels(name, position), subjects(name)")
    .order("position", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Planos de aula</h1>
          <p className="text-sm text-gray-600">
            Aulas organizadas por nível e assunto.
          </p>
        </div>
        {profile.role === "maestro" && (
          <Link href="/aulas/nova" className="btn-primary">
            Nova aula
          </Link>
        )}
      </div>

      {lessons && lessons.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((l) => (
            <Link key={l.id} href={`/aulas/${l.id}`} className="card transition-shadow hover:shadow-md">
              <div className="flex flex-wrap gap-2">
                {(l.levels as any)?.name && (
                  <span className="badge">{(l.levels as any).name}</span>
                )}
                {(l.subjects as any)?.name && (
                  <span className="badge">{(l.subjects as any).name}</span>
                )}
              </div>
              <h3 className="mt-3 font-semibold">{l.title}</h3>
              {l.content && (
                <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                  {l.content}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-sm text-gray-500">
          Nenhuma aula criada ainda.
          {profile.role === "maestro" && (
            <>
              {" "}
              <Link href="/aulas/nova" className="text-brand-700 hover:underline">
                Criar a primeira
              </Link>
              .
            </>
          )}
        </div>
      )}
    </div>
  );
}
