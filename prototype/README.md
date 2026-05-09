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

- Tela de **Login** (com aba "Suporte técnico" — qualquer valor entra)
- **Dashboard** com totais e próximas turmas
- **Músicos** (lista + detalhe com troca de nível e histórico de presença)
- **Níveis** (com possibilidade de adicionar novo)
- **Aulas** (lista + detalhe com atribuição a músicos)
- **Turmas** (lista + presença interativa)
- **Auditoria** (log de uso da senha mestra)

## O que NÃO tem (e por quê)

- **Banco de dados**: Artefatos não acessam banco. Tudo está em `useState` no componente.
- **Login real**: o botão Entrar só muda de tela.
- **Senha mestra real**: a aba "Suporte técnico" é só visual.
- **Persistência**: refresh apaga tudo.

Pra ter o sistema **real** rodando, use o app principal (Next.js + Supabase) com `npm run dev` ou faça deploy na Vercel — instruções no README da raiz do repositório.
