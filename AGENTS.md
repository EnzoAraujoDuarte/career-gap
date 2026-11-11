# Career Gap

## What this is

A TCC (Sistemas de Informação, UNESC Colatina) that helps people starting in web development
in Brazil find their knowledge gaps and see what to build and study next. The thesis the code
has to keep provable: `assessment → gap → prioritized roadmap → useful recommendation`, with a
deterministic engine that explains itself. Live at https://career-gap-tcc.vercel.app.

## Stack

Next.js 16 (App Router; read `career-gap/node_modules/next/dist/docs/` before using an API),
React 19, TypeScript, Tailwind 4, Vitest. Drizzle + Postgres on Neon, Better Auth. pnpm 12.
The app lives in `career-gap/`; research data in `docs/research/`; decisions in `docs/adr/`.

## Commands

From `career-gap/`. All three must pass before a task is done:

- `pnpm test` — engine, catalog invariants, views and the database on an in-memory Postgres.
- `pnpm lint`
- `pnpm build`

After editing `docs/research/*.json`, run `pnpm build:resources` to regenerate the catalog.

## What the code can't tell you

- **The engine decides; AI only explains.** Order, priority and resources come from
  deterministic rules over structured data (skills, levels, requirements, gaps, reasons).
  Never reduce the product to `answers → LLM → text` (ADR-0004).
- **Nothing is locked.** The system annotates with a reason (you already know this,
  recommended now, missing base, not now) and the person chooses (ADR-0009).
- **The path is stack-independent.** Competencies, order and gaps never change with a language;
  the chosen server language only reorders materials, with the reason shown (ADR-0014). Never add
  a competency, edge or rule that depends on a stack.
- **Catalog of links only.** Resources point to the rights holder's page; nothing is hosted or
  reproduced. Never use BibliotecaDev, roadmap.sh content or freeCodeCamp lesson text
  (`docs/research/SOURCES.md`).
- **Provenance is enforced.** Competencies, prerequisites and habits need two source classes;
  `validate.ts` fails the suite otherwise. Don't weaken a rule to make data fit.
- **TCC scope.** No CV/LinkedIn/GitHub analysis, senior tracks, job scraping, mobile app or
  microservices. Features must stay demonstrable and explainable in the paper.
- **At any point the person must be able to answer:** where am I, what can I build now, what
  comes next, why, and what can I ignore. Reject a change that makes any of these harder.
- **Identity:** paper and ink, hand-written only in the mentor's annotations, never a generic
  SaaS dashboard. Visual direction lives in the ADRs (the latest wins); use the `impeccable`
  skill when it is available.
