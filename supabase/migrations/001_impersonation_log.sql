-- Rode este script SE você já tinha executado o schema.sql ANTES da feature
-- de senha mestra. Ele só adiciona a tabela de auditoria.

create table if not exists public.impersonation_log (
  id uuid primary key default gen_random_uuid(),
  target_email text not null,
  target_user_id uuid,
  used_at timestamptz not null default now(),
  ip text,
  user_agent text
);

alter table public.impersonation_log enable row level security;

drop policy if exists "imp_log_select_maestro" on public.impersonation_log;
create policy "imp_log_select_maestro" on public.impersonation_log
  for select using (public.is_maestro(auth.uid()));
