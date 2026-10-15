# career-gap — o sistema

Next.js 16 · React 19 · TypeScript · Tailwind 4 · Drizzle + Postgres (Neon) · Better Auth.
Visão geral do projeto: [`../README.md`](../README.md).

## Rodar

```bash
pnpm install
pnpm dev
```

Abre em http://localhost:3000. **Funciona sem banco**: tudo fica no navegador.

## Ligar o banco (opcional)

1. `cp .env.example .env.local` e preencher. Com o CLI do Neon logado,
   `npx neon@latest env pull --file .env.local` escreve as URLs sem você copiar senha.
2. `pnpm db:migrate` — aplica as migrações de `drizzle/` pela conexão direta.
3. Reiniciar o `pnpm dev`.

Login com Google ou GitHub é opcional: o botão aparece só para o provedor com as duas
credenciais no `.env.local`. Passo a passo completo em `../docs/PLANO-FASE4.md` §5.

## Comandos

| Comando | O que faz |
|---|---|
| `pnpm test` | Toda a suíte, inclusive o banco num Postgres em memória (PGlite) |
| `pnpm lint` | ESLint |
| `pnpm build` | Build de produção |
| `pnpm build:resources` | Regera `src/catalog/resources.ts` a partir de `../docs/research/*.json` |
| `pnpm inspect:roadmaps` | Imprime o roadmap dos perfis de teste, para revisar o motor |
| `pnpm db:generate` | Gera uma migração nova a partir de `src/db/schema.ts` |
| `pnpm db:migrate` | Aplica as migrações no banco do `.env.local` |

## Estrutura

| Pasta | Regra |
|---|---|
| `src/domain/` | O motor. TypeScript puro: **nenhum** import de framework, ORM ou modelo de linguagem |
| `src/catalog/` | Competências, trilha, recursos, hábitos e ferramentas. `validate.ts` reprova o catálogo que perder proveniência, ordem ou cobertura |
| `src/lib/` | Camadas de visão (trilha, explorar, direção) e estado do usuário (navegador e sincronização) |
| `src/db/` | Esquema e repositório do Postgres. Guarda só o estado da pessoa, nunca o catálogo |
| `src/server/` | Server actions: o usuário sai sempre da sessão, a entrada é validada contra o catálogo |
| `src/app/` | Rotas: `/trilha`, `/explorar`, `/minha-area`, `/competencias/[id]`, `/avaliacao`, `/privacidade` |
| `tests/` | Vitest |

`/mapa` e `/catalogo` são as duas condições do experimento antigo e saem da navegação até o
desenho ser revisto com o orientador.
