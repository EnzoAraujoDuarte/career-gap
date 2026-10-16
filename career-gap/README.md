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

**Dois branches no Neon.** O ambiente local usa o branch `dev`, criado só com a estrutura das
tabelas (nenhum dado de produção); o site publicado usa o `main`. Migração nova: aplique no `dev`
com `pnpm db:migrate`, depois no `main` antes do envio que depende dela — sempre de dentro de
`career-gap/`, onde estão o `.neon` e o `package.json`:

```bash
cd career-gap && npx neon@latest checkout main && pnpm db:migrate && npx neon@latest checkout dev
```

O `checkout` troca só as variáveis do Neon no `.env.local`.

## Publicação (Vercel)

Cada envio à `main` publica em https://career-gap-tcc.vercel.app; as prévias de outros envios
ficam protegidas pelo login da Vercel e rodam sem banco. O `vercel.json` fixa o pnpm 12 — a
Vercel só escolhe sozinha até o 10. As variáveis de produção ficam no painel do projeto
(`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`); migração
nova se aplica a partir da máquina, com `pnpm db:migrate`, antes do envio que depende dela.

## Demonstração

O seletor de perfis de demonstração fica escondido de quem usa o site. Para apresentar, abra a
trilha com um perfil sintético na URL, e o seletor aparece no rodapé:
`/trilha?perfil=fixture-absolute-beginner` (outros: `fixture-self-taught-frontend`,
`fixture-cs-student`, `fixture-bootcamp-graduate`, `fixture-almost-ready`,
`fixture-inflated-self-report`). O perfil viaja junto em todos os links internos.

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
| `pnpm db:anonimos` | Lista usuários anônimos sem nada guardado; `--apagar` remove, `--dias=N` define a idade mínima |

## Estrutura

| Pasta | Regra |
|---|---|
| `src/domain/` | O motor. TypeScript puro: **nenhum** import de framework, ORM ou modelo de linguagem |
| `src/catalog/` | Competências, trilha, recursos, hábitos, ferramentas e construções. `validate.ts` reprova o catálogo que perder proveniência, ordem ou cobertura |
| `src/lib/` | Camadas de visão (trilha, explorar, direção) e estado do usuário (navegador e sincronização) |
| `src/db/` | Esquema e repositório do Postgres. Guarda só o estado da pessoa, nunca o catálogo |
| `src/server/` | Server actions: o usuário sai sempre da sessão, a entrada é validada contra o catálogo |
| `src/app/` | Rotas: `/trilha`, `/construir/[id]`, `/explorar`, `/minha-area`, `/competencias/[id]`, `/avaliacao`, `/privacidade`; `robots.ts` e `sitemap.ts` |
| `tests/` | Vitest |

`/mapa` e `/catalogo` são as duas condições do experimento antigo e saem da navegação até o
desenho ser revisto com o orientador. `/estilos` e `/entrada` são registros do método (as
direções visuais e os modelos de primeira tela comparados). As quatro ficam fora da busca.
