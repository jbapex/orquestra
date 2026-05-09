-- =========================================================
-- Orquestra — schema do Supabase
-- Execute este arquivo no SQL Editor do Supabase (uma vez).
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------
do $$ begin
  create type user_role as enum ('maestro', 'musico');
exception when duplicate_object then null; end $$;

do $$ begin
  create type assignment_status as enum ('pendente', 'em_andamento', 'concluida', 'avaliada');
exception when duplicate_object then null; end $$;

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'musico',
  instrument text,
  phone text,
  start_date date default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- LEVELS ----------
create table if not exists public.levels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position int not null,
  description text,
  created_at timestamptz not null default now(),
  unique (position)
);

-- ---------- SUBJECTS ----------
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- ---------- LESSONS (planos de aula) ----------
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level_id uuid references public.levels(id) on delete set null,
  subject_id uuid references public.subjects(id) on delete set null,
  content text,
  materials_url text,
  position int default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- MUSICIAN LEVELS (nível atual de cada músico) ----------
create table if not exists public.musician_levels (
  musico_id uuid references public.profiles(id) on delete cascade,
  level_id uuid references public.levels(id) on delete cascade,
  achieved_at timestamptz not null default now(),
  primary key (musico_id, level_id)
);

-- ---------- CLASSES (turmas/encontros) ----------
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  scheduled_at timestamptz not null,
  topic text not null,
  lesson_id uuid references public.lessons(id) on delete set null,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------- ATTENDANCE ----------
create table if not exists public.attendance (
  class_id uuid references public.classes(id) on delete cascade,
  musico_id uuid references public.profiles(id) on delete cascade,
  present boolean not null default false,
  notes text,
  primary key (class_id, musico_id)
);

-- ---------- ASSIGNMENTS (aula atribuída a um músico) ----------
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  musico_id uuid references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  status assignment_status not null default 'pendente',
  score numeric(4,2),
  feedback text,
  assigned_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (musico_id, lesson_id)
);

-- ---------- IMPERSONATION LOG (auditoria de senha mestra) ----------
create table if not exists public.impersonation_log (
  id uuid primary key default gen_random_uuid(),
  target_email text not null,
  target_user_id uuid,
  used_at timestamptz not null default now(),
  ip text,
  user_agent text
);

-- ---------- HELPERS ----------
create or replace function public.is_maestro(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = uid and role = 'maestro');
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'musico'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------- RLS ----------
alter table public.profiles         enable row level security;
alter table public.levels           enable row level security;
alter table public.subjects         enable row level security;
alter table public.lessons          enable row level security;
alter table public.musician_levels  enable row level security;
alter table public.classes          enable row level security;
alter table public.attendance       enable row level security;
alter table public.assignments      enable row level security;
alter table public.impersonation_log enable row level security;

-- profiles
drop policy if exists "profiles_select_self_or_maestro" on public.profiles;
create policy "profiles_select_self_or_maestro" on public.profiles
  for select using (auth.uid() = id or public.is_maestro(auth.uid()));

drop policy if exists "profiles_update_self_or_maestro" on public.profiles;
create policy "profiles_update_self_or_maestro" on public.profiles
  for update using (auth.uid() = id or public.is_maestro(auth.uid()));

drop policy if exists "profiles_insert_maestro" on public.profiles;
create policy "profiles_insert_maestro" on public.profiles
  for insert with check (public.is_maestro(auth.uid()) or auth.uid() = id);

-- levels / subjects / lessons (todos leem; só maestro escreve)
drop policy if exists "levels_select_all"   on public.levels;
create policy "levels_select_all"   on public.levels   for select using (auth.uid() is not null);
drop policy if exists "levels_write_maestro" on public.levels;
create policy "levels_write_maestro" on public.levels   for all    using (public.is_maestro(auth.uid())) with check (public.is_maestro(auth.uid()));

drop policy if exists "subjects_select_all"   on public.subjects;
create policy "subjects_select_all"   on public.subjects for select using (auth.uid() is not null);
drop policy if exists "subjects_write_maestro" on public.subjects;
create policy "subjects_write_maestro" on public.subjects for all using (public.is_maestro(auth.uid())) with check (public.is_maestro(auth.uid()));

drop policy if exists "lessons_select_all"   on public.lessons;
create policy "lessons_select_all"   on public.lessons  for select using (auth.uid() is not null);
drop policy if exists "lessons_write_maestro" on public.lessons;
create policy "lessons_write_maestro" on public.lessons  for all    using (public.is_maestro(auth.uid())) with check (public.is_maestro(auth.uid()));

-- musician_levels
drop policy if exists "ml_select_self_or_maestro" on public.musician_levels;
create policy "ml_select_self_or_maestro" on public.musician_levels
  for select using (musico_id = auth.uid() or public.is_maestro(auth.uid()));
drop policy if exists "ml_write_maestro" on public.musician_levels;
create policy "ml_write_maestro" on public.musician_levels
  for all using (public.is_maestro(auth.uid())) with check (public.is_maestro(auth.uid()));

-- classes / attendance: todos logados leem; maestro escreve
drop policy if exists "classes_select_all"   on public.classes;
create policy "classes_select_all"   on public.classes for select using (auth.uid() is not null);
drop policy if exists "classes_write_maestro" on public.classes;
create policy "classes_write_maestro" on public.classes for all using (public.is_maestro(auth.uid())) with check (public.is_maestro(auth.uid()));

drop policy if exists "attendance_select_self_or_maestro" on public.attendance;
create policy "attendance_select_self_or_maestro" on public.attendance
  for select using (musico_id = auth.uid() or public.is_maestro(auth.uid()));
drop policy if exists "attendance_write_maestro" on public.attendance;
create policy "attendance_write_maestro" on public.attendance
  for all using (public.is_maestro(auth.uid())) with check (public.is_maestro(auth.uid()));

-- assignments
drop policy if exists "assignments_select_self_or_maestro" on public.assignments;
create policy "assignments_select_self_or_maestro" on public.assignments
  for select using (musico_id = auth.uid() or public.is_maestro(auth.uid()));
drop policy if exists "assignments_write_maestro" on public.assignments;
create policy "assignments_write_maestro" on public.assignments
  for all using (public.is_maestro(auth.uid())) with check (public.is_maestro(auth.uid()));
drop policy if exists "assignments_update_self" on public.assignments;
create policy "assignments_update_self" on public.assignments
  for update using (musico_id = auth.uid()) with check (musico_id = auth.uid());

-- impersonation_log: só o maestro vê. Inserts vêm do servidor com service_role (ignora RLS).
drop policy if exists "imp_log_select_maestro" on public.impersonation_log;
create policy "imp_log_select_maestro" on public.impersonation_log
  for select using (public.is_maestro(auth.uid()));

-- ---------- SEED inicial (níveis e assuntos comuns) ----------
insert into public.levels (name, position, description) values
  ('Iniciante', 1, 'Primeiros contatos com o instrumento e leitura básica.'),
  ('Básico', 2, 'Leitura rítmica, escalas maiores, postura e afinação.'),
  ('Intermediário', 3, 'Tonalidades, articulação, repertório do grupo.'),
  ('Avançado', 4, 'Solos, impro, leitura à primeira vista, liderança de naipe.')
on conflict do nothing;

insert into public.subjects (name, description) values
  ('Teoria Musical', 'Leitura, ritmo, harmonia.'),
  ('Técnica do Instrumento', 'Postura, afinação, exercícios diários.'),
  ('Repertório', 'Peças e hinos do grupo.'),
  ('Prática em Conjunto', 'Ensaio coletivo e regiência.')
on conflict do nothing;
