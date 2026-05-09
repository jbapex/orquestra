import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import LevelsManager from "./LevelsManager";

export const dynamic = "force-dynamic";

export default async function NiveisPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: levels } = await supabase
    .from("levels")
    .select("*")
    .order("position");

  const { data: counts } = await supabase
    .from("musician_levels")
    .select("level_id");

  const countMap = (counts ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.level_id] = (acc[r.level_id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Níveis de aprendizagem</h1>
        <p className="text-sm text-gray-600">
          {profile.role === "maestro"
            ? "Defina os níveis e ordene como achar melhor."
            : "Os níveis usados no grupo."}
        </p>
      </div>

      <LevelsManager
        initialLevels={levels ?? []}
        countMap={countMap}
        canEdit={profile.role === "maestro"}
      />
    </div>
  );
}
