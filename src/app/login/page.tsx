"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "normal" | "suporte";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [mode, setMode] = useState<Mode>("normal");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function normalLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function masterLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/master-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, master_password: password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(json.error ?? "Falha no acesso de suporte.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: json.token_hash,
      type: "magiclink",
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  const submit = mode === "normal" ? normalLogin : masterLogin;

  return (
    <>
      <div className="mt-6 inline-flex rounded-lg border border-gray-200 bg-white p-1">
        <button
          type="button"
          onClick={() => { setMode("normal"); setError(null); }}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            mode === "normal" ? "bg-brand-600 text-white" : "text-gray-700"
          }`}
        >
          Normal
        </button>
        <button
          type="button"
          onClick={() => { setMode("suporte"); setError(null); }}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            mode === "suporte" ? "bg-brand-600 text-white" : "text-gray-700"
          }`}
        >
          Suporte técnico
        </button>
      </div>

      {mode === "suporte" && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Use o <strong>e-mail do usuário</strong> que você quer acessar e a{" "}
          <strong>senha mestra</strong>. Cada uso fica registrado para auditoria.
        </p>
      )}

      <form onSubmit={submit} className="mt-4 space-y-4">
        <div>
          <label className="label" htmlFor="email">E-mail{mode === "suporte" ? " do usuário" : ""}</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" autoComplete={mode === "normal" ? "email" : "off"} />
        </div>
        <div>
          <label className="label" htmlFor="password">{mode === "normal" ? "Senha" : "Senha mestra"}</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" autoComplete={mode === "normal" ? "current-password" : "off"} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Entrando..." : mode === "normal" ? "Entrar" : "Entrar como suporte"}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-bold">Entrar</h1>
      <p className="mt-1 text-sm text-gray-600">Acesse sua conta no Orquestra.</p>

      <Suspense fallback={<div className="mt-6 text-sm text-gray-500">Carregando…</div>}>
        <LoginForm />
      </Suspense>

      <p className="mt-4 text-sm text-gray-600">
        Não tem conta?{" "}
        <Link href="/signup" className="font-medium text-brand-700 hover:underline">
          Criar conta
        </Link>
      </p>
    </main>
  );
}
