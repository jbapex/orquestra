import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import AttendanceList from "./AttendanceList";

export const dynamic = "force-dynamic";

export default async function TurmaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireProfile();
  const { id } = await params;
  const supabase = await createClient();

  const { data: classRow } = await supabase
    .from("classes")
    .select("*, lessons(id, title)")
    .eq("id", id)
    .single();

  if (!classRow) notFound();

  const { data: attendance } = await supabase
    .from("attendance")
    .select("musico_id, present, notes, profiles(full_name, instrument)")
    .eq("class_id", id);

  const sorted = (attendance ?? []).sort((a, b) =>
    ((a.profiles as any)?.full_name ?? "").localeCompare(
      (b.profiles as any)?.full_name ?? "",
    ),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{classRow.topic}</h1>
        <p className="text-sm text-gray-600">
          {new Date(classRow.scheduled_at).toLocaleString("pt-BR")}
          {(classRow.lessons as any)?.title && (
            <>
              {" "}· Aula:{" "}
              <span className="text-brand-700">
                {(classRow.lessons as any).title}
              </span>
            </>
          )}
        </p>
        {classRow.notes && (
          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
            {classRow.notes}
          </p>
        )}
      </div>

      <AttendanceList
        classId={id}
        rows={sorted as any}
        canEdit={profile.role === "maestro"}
      />
    </div>
  );
}
