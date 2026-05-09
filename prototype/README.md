# Orquestra — Protótipo para Artefato (Claude.ai)

Este é um arquivo único `.tsx` que você pode colar num Artefato da Claude.ai pra ver as telas do app funcionando como **protótipo visual**. Os dados são **fictícios** e **não persistem** (recarregar volta tudo ao estado inicial).

## Como usar

1. Abra https://claude.ai e inicie uma nova conversa.
2. Envie a mensagem:

   > Crie um artifact React chamado "Orquestra" com o código abaixo:
   >
   > (cole o conteúdo de `orquestra-artifact.tsx` aqui)

3. A Claude vai abrir o painel do Artefato com o protótipo navegável.

## O que tem no protótipo

A tela de login mostra **3 perfis de demonstração**:

| Perfil      | Quem é                        | O que vê                                                            |
| ----------- | ----------------------------- | ------------------------------------------------------------------- |
| **Maestro** | Pr. João Silva                | Cadastro de músicos, níveis, criação de aulas, marcação de presença |
| **Aluno**   | Eduardo Pereira (Iniciante)   | Próprio dashboard com nível, aulas atribuídas, frequência, turmas   |
| **Admin**   | Suporte técnico               | Tudo que o maestro vê + página de Auditoria (senha mestra)          |

Clique no card do perfil que quiser testar. O botão **Sair** (canto superior direito) volta para a tela de login para alternar.

### Telas por perfil

- **Login** com 3 cards de perfis
- **Dashboard** — versão diferente para cada papel:
  - Maestro/Admin: totais, próximas turmas, distribuição por nível
  - Aluno: nível atual com barra de progresso, aulas atribuídas, próximas turmas, % de presença
- **Músicos** (maestro/admin) — lista + detalhe com troca de nível e histórico
- **Níveis** — todos veem; só maestro/admin pode adicionar; aluno vê o seu destacado
- **Aulas** — maestro cria/atribui; aluno vê catálogo com as suas aulas em destaque + nota e feedback
- **Turmas** — maestro marca presença; aluno vê só sua própria participação
- **Auditoria** — só admin


## O que NÃO tem (e por quê)

- **Banco de dados**: Artefatos não acessam banco. Tudo está em `useState` no componente.
- **Login real**: o botão Entrar só muda de tela.
- **Senha mestra real**: a aba "Suporte técnico" é só visual.
- **Persistência**: refresh apaga tudo.

Pra ter o sistema **real** rodando, use o app principal (Next.js + Supabase) com `npm run dev` ou faça deploy na Vercel — instruções no README da raiz do repositório.
