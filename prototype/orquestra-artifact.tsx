import React, { useState } from "react";
import {
  Music,
  Users,
  Layers,
  BookOpen,
  Calendar,
  Shield,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Check,
  X as XIcon,
  GraduationCap,
  TrendingUp,
  Sparkles,
} from "lucide-react";

// =====================================================================
// PROTÓTIPO ORQUESTRA — 3 perfis (maestro / aluno / admin).
// Tudo em memória. Recarregar volta ao estado inicial.
// =====================================================================

type Role = "maestro" | "aluno" | "admin";

type Musico = {
  id: string;
  full_name: string;
  email: string;
  instrument: string;
  phone: string;
  start_date: string;
  notes: string;
  level_id: string;
};

type Level = { id: string; name: string; position: number; description: string };

type Lesson = {
  id: string;
  title: string;
  level_id: string;
  subject_id: string;
  position: number;
  content: string;
  materials_url: string;
};

type ClassRow = {
  id: string;
  scheduled_at: string;
  topic: string;
  lesson_id: string | null;
  notes: string;
};

type Assignment = {
  id: string;
  musico_id: string;
  lesson_id: string;
  status: "pendente" | "em_andamento" | "concluida" | "avaliada";
  score: number | null;
  feedback: string | null;
};

const ALUNO_USER_ID = "u4"; // Eduardo Pereira (Iniciante)

const initialMusicos: Musico[] = [
  { id: "u1", full_name: "Ana Beatriz Lima", email: "ana.lima@email.com", instrument: "Violino", phone: "(11) 98765-1234", start_date: "2023-03-15", notes: "Estudou 5 anos em conservatório.", level_id: "l3" },
  { id: "u2", full_name: "Carlos Henrique", email: "carlos.h@email.com", instrument: "Trompete", phone: "(11) 99876-5678", start_date: "2024-01-08", notes: "", level_id: "l2" },
  { id: "u3", full_name: "Daniela Souza", email: "daniela.souza@email.com", instrument: "Piano", phone: "(11) 91234-5678", start_date: "2022-06-20", notes: "Pianista oficial dos cultos.", level_id: "l4" },
  { id: "u4", full_name: "Eduardo Pereira", email: "eduardo.pereira@email.com", instrument: "Violão", phone: "(11) 98123-4567", start_date: "2024-09-01", notes: "Iniciante, muito esforçado.", level_id: "l1" },
  { id: "u5", full_name: "Fernanda Castro", email: "fernanda.c@email.com", instrument: "Flauta", phone: "(11) 97654-3210", start_date: "2023-11-12", notes: "", level_id: "l2" },
  { id: "u6", full_name: "Gabriel Moreira", email: "gabriel.m@email.com", instrument: "Bateria", phone: "(11) 96543-2109", start_date: "2024-02-05", notes: "", level_id: "l2" },
  { id: "u7", full_name: "Helena Rodrigues", email: "helena.r@email.com", instrument: "Violoncelo", phone: "(11) 95432-1098", start_date: "2025-01-15", notes: "", level_id: "l1" },
];

const initialLevels: Level[] = [
  { id: "l1", name: "Iniciante", position: 1, description: "Primeiros contatos com o instrumento e leitura básica." },
  { id: "l2", name: "Básico", position: 2, description: "Leitura rítmica, escalas maiores, postura e afinação." },
  { id: "l3", name: "Intermediário", position: 3, description: "Tonalidades, articulação, repertório do grupo." },
  { id: "l4", name: "Avançado", position: 4, description: "Solos, improvisação, leitura à primeira vista." },
];

const subjects = [
  { id: "s1", name: "Teoria Musical" },
  { id: "s2", name: "Técnica do Instrumento" },
  { id: "s3", name: "Repertório" },
  { id: "s4", name: "Prática em Conjunto" },
];

const lessons: Lesson[] = [
  { id: "a1", title: "Leitura de partitura — clave de sol", level_id: "l1", subject_id: "s1", position: 1, content: "Objetivos:\n• Identificar as 7 notas na clave de sol\n• Ler frases simples no compasso 4/4\n\nExercícios:\n1. Cantar a escala de Dó\n2. Bater compasso enquanto canta\n3. Tocar exercícios 1 a 5 do método", materials_url: "https://exemplo.com/material1.pdf" },
  { id: "a2", title: "Postura e respiração para sopros", level_id: "l1", subject_id: "s2", position: 2, content: "Foco em postura ereta, ombros relaxados e respiração diafragmática.", materials_url: "" },
  { id: "a3", title: "Escalas maiores em todas as tonalidades", level_id: "l2", subject_id: "s2", position: 3, content: "Praticar diariamente as 12 escalas maiores em duas oitavas. Começar pelas tonalidades com até 3 sustenidos/bemóis.", materials_url: "" },
  { id: "a4", title: "Hino 12 — naipe de cordas", level_id: "l2", subject_id: "s3", position: 4, content: "Ensaiar a parte de cordas do hino 12. Atenção à articulação no compasso 16 e à dinâmica do refrão.", materials_url: "" },
  { id: "a5", title: "Improvisação sobre acordes maiores", level_id: "l4", subject_id: "s2", position: 5, content: "Introdução à improvisação modal sobre I-IV-V.", materials_url: "" },
  { id: "a6", title: "Regência básica", level_id: "l3", subject_id: "s4", position: 6, content: "Padrões de marcação 2/4, 3/4 e 4/4. Como entrar e cortar.", materials_url: "" },
];

const initialClasses: ClassRow[] = [
  { id: "c1", scheduled_at: "2026-05-10T19:00", topic: "Ensaio geral — culto de domingo", lesson_id: "a4", notes: "Concentrar nos hinos 12 e 27." },
  { id: "c2", scheduled_at: "2026-05-13T19:30", topic: "Naipe de cordas — leitura à primeira vista", lesson_id: "a3", notes: "" },
  { id: "c3", scheduled_at: "2026-05-17T19:00", topic: "Ensaio geral", lesson_id: null, notes: "" },
  { id: "c4", scheduled_at: "2026-05-03T19:00", topic: "Naipe de sopros — Hino 27", lesson_id: "a2", notes: "Ana faltou (avisou)." },
  { id: "c5", scheduled_at: "2026-04-26T19:00", topic: "Ensaio geral", lesson_id: null, notes: "" },
];

const initialAttendance: Record<string, Record<string, boolean>> = {
  c1: { u1: false, u2: false, u3: false, u4: false, u5: false, u6: false, u7: false },
  c2: { u1: false, u2: false, u3: false, u4: false, u5: false, u6: false, u7: false },
  c3: { u1: false, u2: false, u3: false, u4: false, u5: false, u6: false, u7: false },
  c4: { u1: false, u2: true, u3: true, u4: true, u5: true, u6: true, u7: false },
  c5: { u1: true, u2: true, u3: true, u4: true, u5: false, u6: true, u7: true },
};

const initialAssignments: Assignment[] = [
  { id: "as1", musico_id: "u4", lesson_id: "a1", status: "concluida", score: 8.5, feedback: "Boa evolução, continue praticando o ritmo." },
  { id: "as2", musico_id: "u4", lesson_id: "a2", status: "em_andamento", score: null, feedback: null },
  { id: "as3", musico_id: "u4", lesson_id: "a3", status: "pendente", score: null, feedback: null },
  { id: "as4", musico_id: "u7", lesson_id: "a1", status: "em_andamento", score: null, feedback: null },
  { id: "as5", musico_id: "u1", lesson_id: "a6", status: "concluida", score: 9.0, feedback: null },
  { id: "as6", musico_id: "u3", lesson_id: "a5", status: "avaliada", score: 9.5, feedback: "Excelente improviso." },
];

const auditLog = [
  { id: "al1", target_email: "eduardo.pereira@email.com", used_at: "2026-05-08T14:23", ip: "189.45.67.123", user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)" },
  { id: "al2", target_email: "gabriel.m@email.com", used_at: "2026-04-22T10:15", ip: "189.45.67.123", user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4)" },
];

// =====================================================================

type View =
  | "login"
  | "dashboard"
  | "musicos"
  | "musicoDetail"
  | "niveis"
  | "aulas"
  | "aulaDetail"
  | "turmas"
  | "turmaDetail"
  | "auditoria";

export default function OrquestraPrototype() {
  const [role, setRole] = useState<Role | null>(null);
  const [view, setView] = useState<View>("login");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [musicos, setMusicos] = useState(initialMusicos);
  const [levels, setLevels] = useState(initialLevels);
  const [classes] = useState(initialClasses);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [assignments, setAssignments] = useState(initialAssignments);

  function loginAs(r: Role) {
    setRole(r);
    setView("dashboard");
  }

  function logout() {
    setRole(null);
    setView("login");
    setSelectedId(null);
  }

  function go(v: View, id: string | null = null) {
    setView(v);
    setSelectedId(id);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }

  if (!role) return <LoginScreen onLoginAs={loginAs} />;

  const currentUser =
    role === "aluno"
      ? musicos.find((m) => m.id === ALUNO_USER_ID)!
      : null;
  const userName =
    role === "aluno"
      ? currentUser!.full_name
      : role === "admin"
        ? "Suporte Técnico"
        : "Pr. João Silva";

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <NavBar role={role} view={view} onNav={(v) => go(v)} onLogout={logout} userName={userName} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        {role === "aluno" && view === "dashboard" && (
          <AlunoDashboard
            user={currentUser!}
            levels={levels}
            classes={classes}
            assignments={assignments.filter((a) => a.musico_id === ALUNO_USER_ID)}
            attendance={attendance}
            go={go}
          />
        )}
        {role !== "aluno" && view === "dashboard" && (
          <MaestroDashboard role={role} musicos={musicos} classes={classes} levels={levels} go={go} />
        )}

        {view === "musicos" && role !== "aluno" && (
          <MusicosList musicos={musicos} levels={levels} go={go} />
        )}
        {view === "musicoDetail" && role !== "aluno" && selectedId && (
          <MusicoDetail
            musico={musicos.find((m) => m.id === selectedId)!}
            levels={levels}
            classes={classes}
            attendance={attendance}
            assignments={assignments.filter((a) => a.musico_id === selectedId)}
            onSaveLevel={(levelId) =>
              setMusicos((all) => all.map((m) => (m.id === selectedId ? { ...m, level_id: levelId } : m)))
            }
            goBack={() => go("musicos")}
          />
        )}

        {view === "niveis" && (
          <NiveisScreen
            levels={levels}
            musicos={musicos}
            currentUserLevelId={currentUser?.level_id ?? null}
            readonly={role === "aluno"}
            onAdd={(name, desc) =>
              setLevels((arr) => [
                ...arr,
                { id: `l${arr.length + 1}`, name, description: desc, position: arr.length + 1 },
              ])
            }
          />
        )}

        {view === "aulas" && (
          <AulasList
            assignments={assignments}
            currentUserId={role === "aluno" ? ALUNO_USER_ID : null}
            readonly={role === "aluno"}
            go={go}
          />
        )}
        {view === "aulaDetail" && selectedId && (
          <AulaDetail
            lesson={lessons.find((a) => a.id === selectedId)!}
            musicos={musicos}
            assignments={assignments.filter((a) => a.lesson_id === selectedId)}
            myAssignment={
              role === "aluno"
                ? assignments.find((a) => a.lesson_id === selectedId && a.musico_id === ALUNO_USER_ID) ?? null
                : null
            }
            readonly={role === "aluno"}
            onAssign={(musicoId) =>
              setAssignments((arr) => [
                ...arr,
                { id: `as${arr.length + 1}`, musico_id: musicoId, lesson_id: selectedId, status: "pendente", score: null, feedback: null },
              ])
            }
            onUpdate={(id, patch) =>
              setAssignments((arr) => arr.map((a) => (a.id === id ? { ...a, ...patch } : a)))
            }
            goBack={() => go("aulas")}
          />
        )}

        {view === "turmas" && (
          <TurmasList
            classes={classes}
            attendance={attendance}
            currentUserId={role === "aluno" ? ALUNO_USER_ID : null}
            readonly={role === "aluno"}
            go={go}
          />
        )}
        {view === "turmaDetail" && selectedId && (
          <TurmaDetail
            classRow={classes.find((c) => c.id === selectedId)!}
            musicos={musicos}
            attendance={attendance[selectedId] ?? {}}
            currentUserId={role === "aluno" ? ALUNO_USER_ID : null}
            readonly={role === "aluno"}
            onTogglePresent={(musicoId, present) =>
              setAttendance((a) => ({ ...a, [selectedId]: { ...a[selectedId], [musicoId]: present } }))
            }
            goBack={() => go("turmas")}
          />
        )}

        {view === "auditoria" && role === "admin" && <AuditoriaScreen />}
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-6 pt-2 text-center text-xs text-gray-400">
        Protótipo visual · dados são fictícios e não persistem
      </footer>
    </div>
  );
}

// ---------- LOGIN ----------
function LoginScreen({ onLoginAs }: { onLoginAs: (r: Role) => void }) {
  const profiles: { role: Role; title: string; subtitle: string; bullets: string[]; Icon: any; color: string }[] = [
    {
      role: "maestro",
      title: "Maestro",
      subtitle: "Pr. João Silva",
      bullets: ["Cadastra músicos e níveis", "Cria planos de aula", "Marca presença nas turmas"],
      Icon: Music,
      color: "violet",
    },
    {
      role: "aluno",
      title: "Aluno",
      subtitle: "Eduardo Pereira (Iniciante)",
      bullets: ["Vê aulas atribuídas a ele", "Acompanha seu nível e progresso", "Consulta presença e turmas"],
      Icon: GraduationCap,
      color: "emerald",
    },
    {
      role: "admin",
      title: "Admin",
      subtitle: "Suporte técnico",
      bullets: ["Tudo que o maestro faz", "Acesso à auditoria", "Pode usar a senha mestra"],
      Icon: Shield,
      color: "amber",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12 font-sans">
      <div className="mb-6 flex items-center gap-2 text-violet-700">
        <Music className="h-7 w-7" />
        <span className="text-xl font-bold">Orquestra</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Escolha um perfil de demonstração</h1>
      <p className="mt-1 text-sm text-gray-600">
        Cada perfil enxerga o sistema de forma diferente. Clique para entrar.
      </p>

      <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
        {profiles.map((p) => (
          <button
            key={p.role}
            onClick={() => onLoginAs(p.role)}
            className={`group flex flex-col rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg`}
          >
            <div
              className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                p.color === "violet" ? "bg-violet-100 text-violet-700" : p.color === "emerald" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              <p.Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Entrar como {p.title}</h3>
            <p className="text-sm text-gray-500">{p.subtitle}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
              {p.bullets.map((b) => (
                <li key={b} className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-gray-400" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center text-sm font-medium text-violet-700 group-hover:underline">
              Acessar <ChevronRight className="ml-0.5 h-4 w-4" />
            </div>
          </button>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-center text-xs text-gray-500">
        Protótipo visual — dados são fictícios e não persistem. No app real, o login é com e-mail e senha; o Admin
        também pode entrar como qualquer usuário usando a <strong>senha mestra</strong> de suporte.
      </p>
    </div>
  );
}

// ---------- NAVBAR ----------
function NavBar({
  role,
  view,
  onNav,
  onLogout,
  userName,
}: {
  role: Role;
  view: View;
  onNav: (v: View) => void;
  onLogout: () => void;
  userName: string;
}) {
  const all: { view: View; label: string; Icon: any; roles: Role[] }[] = [
    { view: "dashboard", label: "Início", Icon: Music, roles: ["maestro", "aluno", "admin"] },
    { view: "musicos", label: "Músicos", Icon: Users, roles: ["maestro", "admin"] },
    { view: "niveis", label: "Níveis", Icon: Layers, roles: ["maestro", "aluno", "admin"] },
    { view: "aulas", label: role === "aluno" ? "Minhas aulas" : "Aulas", Icon: BookOpen, roles: ["maestro", "aluno", "admin"] },
    { view: "turmas", label: "Turmas", Icon: Calendar, roles: ["maestro", "aluno", "admin"] },
    { view: "auditoria", label: "Auditoria", Icon: Shield, roles: ["admin"] },
  ];
  const items = all.filter((i) => i.roles.includes(role));

  const roleLabel = role === "maestro" ? "Maestro" : role === "aluno" ? "Aluno" : "Admin";
  const roleColor =
    role === "maestro" ? "bg-violet-100 text-violet-700" : role === "aluno" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <button onClick={() => onNav("dashboard")} className="flex items-center gap-2 text-violet-700">
          <Music className="h-5 w-5" />
          <span className="text-lg font-bold">Orquestra</span>
        </button>

        <nav className="hidden flex-wrap gap-1 sm:flex">
          {items.map((it) => {
            const active =
              view === it.view ||
              (it.view === "musicos" && view === "musicoDetail") ||
              (it.view === "aulas" && view === "aulaDetail") ||
              (it.view === "turmas" && view === "turmaDetail");
            return (
              <button
                key={it.view}
                onClick={() => onNav(it.view)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${
                  active ? "bg-violet-50 text-violet-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <it.Icon className="h-4 w-4" />
                {it.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <span className="text-sm text-gray-600">{userName}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleColor}`}>{roleLabel}</span>
          </div>
          <button onClick={onLogout} className={btnSecondary} title="Sair">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-gray-100 px-4 py-2 sm:hidden">
        {items.map((it) => (
          <button
            key={it.view}
            onClick={() => onNav(it.view)}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ${
              view === it.view ? "bg-violet-50 text-violet-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {it.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

// ---------- DASHBOARDS ----------
function MaestroDashboard({
  role,
  musicos,
  classes,
  levels,
  go,
}: {
  role: Role;
  musicos: Musico[];
  classes: ClassRow[];
  levels: Level[];
  go: (v: View, id?: string | null) => void;
}) {
  const proximas = classes
    .filter((c) => new Date(c.scheduled_at) >= new Date("2026-05-09"))
    .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {role === "admin" ? "Painel administrativo" : "Olá, João!"}
        </h1>
        <p className="text-sm text-gray-600">Visão geral do grupo de música.</p>
      </div>

      {role === "admin" && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <Sparkles className="mt-0.5 h-5 w-5 flex-none" />
          <div>
            Você está como <strong>Admin</strong>. Tem acesso a tudo mais a página{" "}
            <button onClick={() => go("auditoria")} className="font-medium underline">
              Auditoria
            </button>{" "}
            e pode usar a senha mestra para entrar como qualquer usuário.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Músicos cadastrados" value={musicos.length} onClick={() => go("musicos")} />
        <StatCard label="Planos de aula" value={lessons.length} onClick={() => go("aulas")} />
        <StatCard label="Turmas" value={classes.length} onClick={() => go("turmas")} />
      </div>

      <div className={cardCls}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Próximas turmas</h2>
          <button onClick={() => go("turmas")} className="text-sm text-violet-700 hover:underline">
            Ver todas
          </button>
        </div>
        {proximas.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {proximas.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => go("turmaDetail", c.id)}
                  className="flex w-full items-center justify-between py-2 text-left text-sm hover:bg-gray-50"
                >
                  <span>{c.topic}</span>
                  <span className="text-gray-500">{fmtDateTime(c.scheduled_at)}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Nenhuma turma agendada.</p>
        )}
      </div>

      <div className={cardCls}>
        <h2 className="mb-3 font-semibold">Distribuição por nível</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          {levels.map((l) => {
            const count = musicos.filter((m) => m.level_id === l.id).length;
            return (
              <div key={l.id} className="rounded-lg border border-gray-200 p-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">Nível {l.position}</p>
                <p className="mt-1 font-semibold">{l.name}</p>
                <p className="mt-1 text-2xl font-bold text-violet-700">{count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AlunoDashboard({
  user,
  levels,
  classes,
  assignments,
  attendance,
  go,
}: {
  user: Musico;
  levels: Level[];
  classes: ClassRow[];
  assignments: Assignment[];
  attendance: Record<string, Record<string, boolean>>;
  go: (v: View, id?: string | null) => void;
}) {
  const myLevel = levels.find((l) => l.id === user.level_id);
  const proximas = classes
    .filter((c) => new Date(c.scheduled_at) >= new Date("2026-05-09"))
    .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))
    .slice(0, 3);

  const passadas = classes.filter((c) => new Date(c.scheduled_at) < new Date("2026-05-09"));
  const presentes = passadas.filter((c) => attendance[c.id]?.[user.id]).length;
  const taxaPresenca = passadas.length > 0 ? Math.round((presentes / passadas.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Olá, {user.full_name.split(" ")[0]}!</h1>
        <p className="text-sm text-gray-600">
          {user.instrument} · entrou em {fmtDate(user.start_date)}
        </p>
      </div>

      {/* Nível atual */}
      <div className={cardCls}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Seu nível atual</p>
            <h2 className="mt-1 text-xl font-bold">
              <span className={badgeCls + " mr-2 align-middle"}>Nível {myLevel?.position}</span>
              {myLevel?.name}
            </h2>
            <p className="mt-2 text-sm text-gray-600">{myLevel?.description}</p>
          </div>
          <TrendingUp className="h-6 w-6 flex-none text-emerald-600" />
        </div>
        <div className="mt-4 flex items-center gap-1">
          {levels.map((l) => {
            const reached = l.position <= (myLevel?.position ?? 0);
            return (
              <div key={l.id} className="flex flex-1 flex-col items-center">
                <div
                  className={`h-2 w-full rounded-full ${reached ? "bg-emerald-500" : "bg-gray-200"}`}
                />
                <span className={`mt-1 text-xs ${reached ? "font-medium text-emerald-700" : "text-gray-400"}`}>
                  {l.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Aulas atribuídas */}
      <div className={cardCls}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Minhas aulas</h2>
          <button onClick={() => go("aulas")} className="text-sm text-violet-700 hover:underline">
            Ver todas
          </button>
        </div>
        {assignments.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma aula atribuída ainda.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {assignments.map((a) => {
              const lesson = lessons.find((l) => l.id === a.lesson_id);
              return (
                <li key={a.id}>
                  <button
                    onClick={() => go("aulaDetail", a.lesson_id)}
                    className="flex w-full items-center justify-between gap-3 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    <span className="flex-1">{lesson?.title}</span>
                    <StatusBadge status={a.status} />
                    {a.score != null && <span className="text-xs text-gray-500">Nota {a.score}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Próximas turmas */}
      <div className={cardCls}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Próximas turmas</h2>
          <button onClick={() => go("turmas")} className="text-sm text-violet-700 hover:underline">
            Ver todas
          </button>
        </div>
        {proximas.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma turma agendada.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {proximas.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => go("turmaDetail", c.id)}
                  className="flex w-full items-center justify-between py-2 text-left text-sm hover:bg-gray-50"
                >
                  <span>{c.topic}</span>
                  <span className="text-gray-500">{fmtDateTime(c.scheduled_at)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Frequência */}
      <div className={cardCls}>
        <h2 className="mb-3 font-semibold">Minha frequência</h2>
        <p className="text-sm text-gray-600">
          {presentes} de {passadas.length} turmas registradas — <strong>{taxaPresenca}%</strong>
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div className="h-full bg-emerald-500" style={{ width: `${taxaPresenca}%` }} />
        </div>
      </div>
    </div>
  );
}

// ---------- MÚSICOS ----------
function MusicosList({ musicos, levels, go }: { musicos: Musico[]; levels: Level[]; go: (v: View, id?: string | null) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Músicos</h1>
          <p className="text-sm text-gray-600">Lista de todos os cadastrados no grupo.</p>
        </div>
      </div>

      <div className={cardCls + " overflow-x-auto p-0"}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={thCls}>Nome</th>
              <th className={thCls}>Instrumento</th>
              <th className={thCls}>Nível</th>
              <th className={thCls}>Contato</th>
              <th className={thCls}>Início</th>
              <th className={thCls}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {musicos.map((m) => {
              const level = levels.find((l) => l.id === m.level_id);
              return (
                <tr key={m.id}>
                  <td className={tdCls + " font-medium"}>{m.full_name}</td>
                  <td className={tdCls}>{m.instrument}</td>
                  <td className={tdCls}>{level && <span className={badgeCls}>{level.name}</span>}</td>
                  <td className={tdCls}>{m.phone}</td>
                  <td className={tdCls}>{fmtDate(m.start_date)}</td>
                  <td className={tdCls}>
                    <button onClick={() => go("musicoDetail", m.id)} className="text-violet-700 hover:underline">
                      Detalhes
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MusicoDetail({
  musico,
  levels,
  classes,
  attendance,
  assignments,
  onSaveLevel,
  goBack,
}: {
  musico: Musico;
  levels: Level[];
  classes: ClassRow[];
  attendance: Record<string, Record<string, boolean>>;
  assignments: Assignment[];
  onSaveLevel: (levelId: string) => void;
  goBack: () => void;
}) {
  const [levelId, setLevelId] = useState(musico.level_id);
  const [saved, setSaved] = useState(false);

  const presencas = classes
    .map((c) => ({ classe: c, present: attendance[c.id]?.[musico.id] ?? false }))
    .filter((r) => new Date(r.classe.scheduled_at) <= new Date("2026-05-09"));

  return (
    <div className="space-y-6">
      <button onClick={goBack} className="flex items-center gap-1 text-sm text-violet-700 hover:underline">
        <ChevronLeft className="h-4 w-4" /> Voltar
      </button>

      <div>
        <h1 className="text-2xl font-bold">{musico.full_name}</h1>
        <p className="text-sm text-gray-600">{musico.email}</p>
      </div>

      <div className={cardCls + " space-y-4"}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Instrumento">
            <input className={inputCls} defaultValue={musico.instrument} />
          </Field>
          <Field label="Contato">
            <input className={inputCls} defaultValue={musico.phone} />
          </Field>
          <Field label="Início no grupo">
            <input type="date" className={inputCls} defaultValue={musico.start_date} />
          </Field>
          <Field label="Nível atual">
            <select
              className={inputCls}
              value={levelId}
              onChange={(e) => {
                setLevelId(e.target.value);
                setSaved(false);
              }}
            >
              {levels.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Observações">
          <textarea className={inputCls} rows={2} defaultValue={musico.notes} />
        </Field>
        <div className="flex items-center justify-end gap-3">
          {saved && <span className="text-sm text-green-700">Salvo!</span>}
          <button
            className={btnPrimary}
            onClick={() => {
              onSaveLevel(levelId);
              setSaved(true);
            }}
          >
            Salvar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className={cardCls}>
          <h2 className="mb-3 font-semibold">Aulas atribuídas</h2>
          {assignments.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma aula atribuída.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {assignments.map((a) => {
                const lesson = lessons.find((l) => l.id === a.lesson_id);
                return (
                  <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="flex-1">{lesson?.title}</span>
                    <StatusBadge status={a.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className={cardCls}>
          <h2 className="mb-3 font-semibold">Presença recente</h2>
          {presencas.length === 0 ? (
            <p className="text-sm text-gray-500">Sem registros.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {presencas.map(({ classe, present }) => (
                <li key={classe.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="truncate">{classe.topic}</span>
                  <span className={present ? "text-green-700" : "text-red-600"}>{present ? "Presente" : "Ausente"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- NÍVEIS ----------
function NiveisScreen({
  levels,
  musicos,
  currentUserLevelId,
  readonly,
  onAdd,
}: {
  levels: Level[];
  musicos: Musico[];
  currentUserLevelId: string | null;
  readonly: boolean;
  onAdd: (name: string, desc: string) => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Níveis de aprendizagem</h1>
        <p className="text-sm text-gray-600">
          {readonly ? "Os níveis usados no grupo. Seu nível atual está destacado." : "Defina os níveis e ordene como achar melhor."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {levels.map((l) => {
          const count = musicos.filter((m) => m.level_id === l.id).length;
          const isCurrent = currentUserLevelId === l.id;
          return (
            <div
              key={l.id}
              className={`rounded-xl border p-5 shadow-sm ${
                isCurrent ? "border-emerald-300 bg-emerald-50" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={badgeCls}>Nível {l.position}</span>
                {isCurrent ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    <Sparkles className="h-3 w-3" /> Você está aqui
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">{count} músicos</span>
                )}
              </div>
              <h3 className="mt-2 font-semibold">{l.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{l.description}</p>
            </div>
          );
        })}
      </div>

      {!readonly && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name) return;
            onAdd(name, desc);
            setName("");
            setDesc("");
          }}
          className={cardCls + " space-y-3"}
        >
          <h2 className="font-semibold">Novo nível</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input className={inputCls} placeholder="Nome (ex: Profissional)" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className={inputCls + " sm:col-span-2"} placeholder="Descrição (opcional)" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <button className={btnPrimary} type="submit">
              <Plus className="h-4 w-4" />
              Adicionar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ---------- AULAS ----------
function AulasList({
  assignments,
  currentUserId,
  readonly,
  go,
}: {
  assignments: Assignment[];
  currentUserId: string | null;
  readonly: boolean;
  go: (v: View, id?: string | null) => void;
}) {
  const myAssignments = currentUserId ? assignments.filter((a) => a.musico_id === currentUserId) : [];
  const isAssigned = (lessonId: string) => myAssignments.some((a) => a.lesson_id === lessonId);
  const myStatus = (lessonId: string) => myAssignments.find((a) => a.lesson_id === lessonId)?.status;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{readonly ? "Catálogo de aulas" : "Planos de aula"}</h1>
          <p className="text-sm text-gray-600">
            {readonly ? "Aulas atribuídas a você aparecem destacadas." : "Aulas organizadas por nível e assunto."}
          </p>
        </div>
        {!readonly && (
          <button className={btnPrimary}>
            <Plus className="h-4 w-4" />
            Nova aula
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l) => {
          const level = initialLevels.find((x) => x.id === l.level_id);
          const subj = subjects.find((x) => x.id === l.subject_id);
          const assigned = readonly && isAssigned(l.id);
          return (
            <button
              key={l.id}
              onClick={() => go("aulaDetail", l.id)}
              className={`rounded-xl border p-5 text-left shadow-sm transition-shadow hover:shadow-md ${
                assigned ? "border-emerald-300 bg-emerald-50" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex flex-wrap gap-2">
                {level && <span className={badgeCls}>{level.name}</span>}
                {subj && <span className={badgeCls}>{subj.name}</span>}
                {assigned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    <Sparkles className="h-3 w-3" /> Atribuída a você
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-semibold">{l.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-gray-600">{l.content}</p>
              {assigned && myStatus(l.id) && (
                <div className="mt-3">
                  <StatusBadge status={myStatus(l.id)!} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AulaDetail({
  lesson,
  musicos,
  assignments,
  myAssignment,
  readonly,
  onAssign,
  onUpdate,
  goBack,
}: {
  lesson: Lesson;
  musicos: Musico[];
  assignments: Assignment[];
  myAssignment: Assignment | null;
  readonly: boolean;
  onAssign: (musicoId: string) => void;
  onUpdate: (id: string, patch: Partial<Assignment>) => void;
  goBack: () => void;
}) {
  const level = initialLevels.find((l) => l.id === lesson.level_id);
  const subj = subjects.find((s) => s.id === lesson.subject_id);
  const [pick, setPick] = useState("");

  return (
    <div className="space-y-6">
      <button onClick={goBack} className="flex items-center gap-1 text-sm text-violet-700 hover:underline">
        <ChevronLeft className="h-4 w-4" /> Voltar
      </button>

      <div>
        <div className="flex flex-wrap gap-2">
          {level && <span className={badgeCls}>{level.name}</span>}
          {subj && <span className={badgeCls}>{subj.name}</span>}
        </div>
        <h1 className="mt-2 text-2xl font-bold">{lesson.title}</h1>
      </div>

      {readonly && myAssignment && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-700">Status da sua aula</p>
            <div className="mt-1 flex items-center gap-3">
              <StatusBadge status={myAssignment.status} />
              {myAssignment.score != null && (
                <span className="text-sm text-emerald-800">
                  Nota: <strong>{myAssignment.score}</strong>
                </span>
              )}
            </div>
            {myAssignment.feedback && (
              <p className="mt-2 text-sm italic text-emerald-900">"{myAssignment.feedback}"</p>
            )}
          </div>
          <Sparkles className="h-6 w-6 text-emerald-600" />
        </div>
      )}

      <div className={cardCls + " whitespace-pre-wrap text-sm leading-relaxed"}>{lesson.content}</div>

      {lesson.materials_url && (
        <div className={cardCls + " text-sm"}>
          Material:{" "}
          <a href="#" className="inline-flex items-center gap-1 text-violet-700 hover:underline">
            {lesson.materials_url}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {!readonly && (
        <div className={cardCls}>
          <h2 className="font-semibold">Atribuir esta aula a músicos</h2>
          <div className="mt-3 flex gap-2">
            <select className={inputCls + " flex-1"} value={pick} onChange={(e) => setPick(e.target.value)}>
              <option value="">— selecionar músico —</option>
              {musicos
                .filter((m) => !assignments.find((a) => a.musico_id === m.id))
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name}
                  </option>
                ))}
            </select>
            <button
              className={btnPrimary}
              disabled={!pick}
              onClick={() => {
                onAssign(pick);
                setPick("");
              }}
            >
              Atribuir
            </button>
          </div>

          {assignments.length > 0 && (
            <table className="mt-4 min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className={thCls}>Músico</th>
                  <th className={thCls}>Status</th>
                  <th className={thCls}>Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assignments.map((a) => {
                  const m = musicos.find((x) => x.id === a.musico_id);
                  return (
                    <tr key={a.id}>
                      <td className={tdCls}>{m?.full_name ?? "—"}</td>
                      <td className={tdCls}>
                        <select
                          className={inputCls}
                          value={a.status}
                          onChange={(e) => onUpdate(a.id, { status: e.target.value as Assignment["status"] })}
                        >
                          <option value="pendente">Pendente</option>
                          <option value="em_andamento">Em andamento</option>
                          <option value="concluida">Concluída</option>
                          <option value="avaliada">Avaliada</option>
                        </select>
                      </td>
                      <td className={tdCls}>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          className={inputCls + " w-20"}
                          defaultValue={a.score ?? ""}
                          onBlur={(e) => onUpdate(a.id, { score: e.target.value === "" ? null : Number(e.target.value) })}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- TURMAS ----------
function TurmasList({
  classes,
  attendance,
  currentUserId,
  readonly,
  go,
}: {
  classes: ClassRow[];
  attendance: Record<string, Record<string, boolean>>;
  currentUserId: string | null;
  readonly: boolean;
  go: (v: View, id?: string | null) => void;
}) {
  const sorted = [...classes].sort((a, b) => b.scheduled_at.localeCompare(a.scheduled_at));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Turmas / encontros</h1>
          <p className="text-sm text-gray-600">
            {readonly ? "Encontros do grupo. Sua presença em cada um aparece à direita." : "Cada turma tem data, tema e lista de presença."}
          </p>
        </div>
        {!readonly && (
          <button className={btnPrimary}>
            <Plus className="h-4 w-4" />
            Nova turma
          </button>
        )}
      </div>

      <div className={cardCls + " overflow-x-auto p-0"}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={thCls}>Data</th>
              <th className={thCls}>Tema</th>
              <th className={thCls}>Aula vinculada</th>
              {readonly && <th className={thCls}>Sua presença</th>}
              <th className={thCls}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sorted.map((c) => {
              const lesson = lessons.find((l) => l.id === c.lesson_id);
              const isPast = new Date(c.scheduled_at) < new Date("2026-05-09");
              const myPresent = currentUserId ? attendance[c.id]?.[currentUserId] : false;
              return (
                <tr key={c.id}>
                  <td className={tdCls}>{fmtDateTime(c.scheduled_at)}</td>
                  <td className={tdCls + " font-medium"}>{c.topic}</td>
                  <td className={tdCls}>{lesson?.title ?? "—"}</td>
                  {readonly && (
                    <td className={tdCls}>
                      {!isPast ? (
                        <span className="text-gray-400">—</span>
                      ) : myPresent ? (
                        <span className="text-green-700">Presente</span>
                      ) : (
                        <span className="text-red-600">Ausente</span>
                      )}
                    </td>
                  )}
                  <td className={tdCls}>
                    <button onClick={() => go("turmaDetail", c.id)} className="text-violet-700 hover:underline">
                      Abrir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TurmaDetail({
  classRow,
  musicos,
  attendance,
  currentUserId,
  readonly,
  onTogglePresent,
  goBack,
}: {
  classRow: ClassRow;
  musicos: Musico[];
  attendance: Record<string, boolean>;
  currentUserId: string | null;
  readonly: boolean;
  onTogglePresent: (musicoId: string, present: boolean) => void;
  goBack: () => void;
}) {
  const lesson = lessons.find((l) => l.id === classRow.lesson_id);
  const sorted = [...musicos].sort((a, b) => a.full_name.localeCompare(b.full_name));
  const presentes = sorted.filter((m) => attendance[m.id]).length;

  return (
    <div className="space-y-6">
      <button onClick={goBack} className="flex items-center gap-1 text-sm text-violet-700 hover:underline">
        <ChevronLeft className="h-4 w-4" /> Voltar
      </button>

      <div>
        <h1 className="text-2xl font-bold">{classRow.topic}</h1>
        <p className="text-sm text-gray-600">
          {fmtDateTime(classRow.scheduled_at)}
          {lesson && (
            <>
              {" "}· Aula: <span className="text-violet-700">{lesson.title}</span>
            </>
          )}
        </p>
        {classRow.notes && <p className="mt-2 text-sm text-gray-700">{classRow.notes}</p>}
      </div>

      <div className={cardCls + " p-0"}>
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="font-semibold">{readonly ? "Quem participa" : "Presença"}</h2>
          <p className="text-sm text-gray-500">
            {presentes}/{sorted.length} presentes
          </p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={thCls}>Músico</th>
              <th className={thCls}>Instrumento</th>
              <th className={thCls}>{readonly ? "Status" : "Presente"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sorted.map((m) => {
              const isMe = currentUserId === m.id;
              return (
                <tr key={m.id} className={isMe ? "bg-emerald-50" : ""}>
                  <td className={tdCls + " font-medium"}>
                    {m.full_name}
                    {isMe && <span className="ml-2 text-xs text-emerald-700">(você)</span>}
                  </td>
                  <td className={tdCls}>{m.instrument}</td>
                  <td className={tdCls}>
                    {readonly ? (
                      attendance[m.id] ? (
                        <span className="text-green-700">Presente</span>
                      ) : (
                        <span className="text-gray-400">Ausente</span>
                      )
                    ) : (
                      <button
                        onClick={() => onTogglePresent(m.id, !attendance[m.id])}
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-md border ${
                          attendance[m.id] ? "border-green-300 bg-green-50 text-green-700" : "border-gray-300 bg-white text-gray-300"
                        }`}
                        aria-label="Marcar presença"
                      >
                        {attendance[m.id] ? <Check className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- AUDITORIA ----------
function AuditoriaScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Auditoria — login de suporte</h1>
        <p className="text-sm text-gray-600">
          Cada vez que a senha mestra é usada para acessar a conta de algum usuário, fica registrado aqui.
        </p>
      </div>

      <div className={cardCls + " overflow-x-auto p-0"}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={thCls}>Quando</th>
              <th className={thCls}>E-mail acessado</th>
              <th className={thCls}>IP</th>
              <th className={thCls}>User-Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {auditLog.map((l) => (
              <tr key={l.id}>
                <td className={tdCls}>{fmtDateTime(l.used_at)}</td>
                <td className={tdCls + " font-medium"}>{l.target_email}</td>
                <td className={tdCls}>{l.ip}</td>
                <td className={tdCls + " max-w-xs truncate text-gray-500"}>{l.user_agent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- HELPERS ----------
function StatCard({ label, value, onClick }: { label: string; value: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cardCls + " text-left transition-shadow hover:shadow-md"}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: Assignment["status"] }) {
  const map: Record<Assignment["status"], { label: string; cls: string }> = {
    pendente: { label: "Pendente", cls: "bg-gray-100 text-gray-700" },
    em_andamento: { label: "Em andamento", cls: "bg-blue-100 text-blue-700" },
    concluida: { label: "Concluída", cls: "bg-emerald-100 text-emerald-700" },
    avaliada: { label: "Avaliada", cls: "bg-violet-100 text-violet-700" },
  };
  const { label, cls } = map[status];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500";
const cardCls = "rounded-xl border border-gray-200 bg-white p-5 shadow-sm";
const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50";
const btnSecondary =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-300 transition-colors hover:bg-gray-50";
const badgeCls = "inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700";
const thCls = "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500";
const tdCls = "px-3 py-2 text-sm text-gray-800";
