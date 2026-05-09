import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
      <span className="badge mb-4">Para grupos de música da igreja</span>
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Orquestra
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600">
        Cadastre seus músicos, defina níveis de aprendizagem, crie planos de
        aula e acompanhe a presença e o progresso de cada um.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/login" className="btn-primary">
          Entrar
        </Link>
        <Link href="/signup" className="btn-secondary">
          Criar conta
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard title="Cadastro de músicos" body="Lista completa com instrumento, contato e data de início." />
        <FeatureCard title="Níveis e progresso" body="Iniciante, básico, intermediário, avançado — você define." />
        <FeatureCard title="Planos de aula" body="Aulas por assunto e nível, com material de apoio." />
        <FeatureCard title="Presença e histórico" body="Registre cada encontro e veja o que cada músico já estudou." />
      </div>
    </main>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{body}</p>
    </div>
  );
}
