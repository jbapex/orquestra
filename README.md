# Orquestra

Sistema de gestão de aulas de música para grupos de igreja: cadastro de músicos, níveis de aprendizagem, planos de aula, turmas e presença.

Stack: **Next.js 15 (App Router) + TypeScript + Tailwind CSS + Supabase**.

---

## Funcionalidades

- **Autenticação** (e-mail + senha) com dois papéis: `maestro` e `musico`.
- **Cadastro de músicos** — instrumento, contato, data de início, observações.
- **Níveis de aprendizagem** — crie/edite níveis (Iniciante → Avançado), descreva cada um e marque o nível atual de cada músico.
- **Planos de aula** — aulas por nível e assunto, com conteúdo e link de material.
- **Atribuição de aulas** — atribua aulas a músicos individuais e acompanhe status (pendente/em andamento/concluída/avaliada) e nota.
- **Turmas / encontros** — agende aulas coletivas, vincule a um plano de aula e registre a **presença** de cada músico.
- **Painel** com totais e próximos encontros.

Acesso (RLS no banco):

- Maestro: vê e edita tudo.
- Músico: vê seus próprios dados, suas atribuições, sua presença e o catálogo geral de níveis/aulas/turmas. Não vê dados de outros músicos.

---

## 1. Pré-requisitos

- Node.js 20+
- Conta gratuita no [Supabase](https://supabase.com)

## 2. Criar o projeto Supabase

1. Acesse https://supabase.com e crie um novo projeto (free tier serve).
2. Em **Project Settings → API**, copie:
   - `Project URL` → será `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → será `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Em **Authentication → Providers**, deixe **Email** habilitado.
   - Para acelerar o desenvolvimento, em **Authentication → Sign In / Up**, você pode desativar "Confirm email" enquanto testa.
4. Em **SQL Editor**, abra um novo script, cole o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**. Isso cria todas as tabelas, RLS e dados iniciais (níveis e assuntos padrão).

## 3. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 4. Instalar e rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## 5. Criar o primeiro maestro

1. Em http://localhost:3000/signup, crie uma conta com seu e-mail.
2. No Supabase, vá em **Table Editor → profiles**, encontre seu registro e mude `role` de `musico` para `maestro`.
3. Saia e entre de novo. Pronto, você é o maestro.

A partir daí:

- Os músicos criam conta normalmente em `/signup` — eles entram como `musico` por padrão.
- Você (maestro) gerencia tudo em **Músicos**, **Níveis**, **Aulas** e **Turmas**.

---

## Estrutura

```
src/
  app/
    (app)/                 # rotas autenticadas com NavBar
      dashboard/
      musicos/             # lista + detalhe (maestro only)
      niveis/              # leitura para todos, edição só maestro
      aulas/               # planos de aula
      turmas/              # encontros + presença
    login/
    signup/
    page.tsx               # landing
  components/NavBar.tsx
  lib/
    auth.ts                # helpers requireProfile / requireMaestro
    supabase/{client,server,middleware}.ts
    types.ts
  middleware.ts            # protege rotas e mantém sessão
supabase/schema.sql        # rode 1x no Supabase
```

## Comandos

```bash
npm run dev         # desenvolvimento
npm run build       # build de produção
npm run start       # rodar build
npm run typecheck   # checagem de tipos
```

## Próximos passos sugeridos

- Importar repertório (peças/hinos) e ligar a turmas.
- Upload de partituras direto pelo Supabase Storage.
- Notificações por e-mail/WhatsApp para próximas turmas.
- Relatório de presença por período.
