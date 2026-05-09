import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function POST(req: Request) {
  const master = process.env.MASTER_PASSWORD;
  if (!master) {
    return NextResponse.json(
      { error: "Senha mestra não configurada no servidor." },
      { status: 503 },
    );
  }

  let payload: { email?: string; master_password?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const email = (payload.email || "").trim().toLowerCase();
  const provided = payload.master_password || "";
  if (!email || !provided) {
    return NextResponse.json(
      { error: "Informe o e-mail do usuário e a senha mestra." },
      { status: 400 },
    );
  }

  if (!timingSafeEqual(provided, master)) {
    return NextResponse.json({ error: "Senha mestra inválida." }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: link, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkError || !link?.properties?.hashed_token) {
    return NextResponse.json(
      { error: linkError?.message ?? "Não foi possível gerar acesso para esse e-mail." },
      { status: 400 },
    );
  }

  await admin.from("impersonation_log").insert({
    target_email: email,
    target_user_id: link.user?.id ?? null,
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    user_agent: req.headers.get("user-agent") ?? null,
  });

  return NextResponse.json({
    token_hash: link.properties.hashed_token,
    email,
  });
}
