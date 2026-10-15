# ADR-0010 — Catálogo no código, estado no Postgres, entrada anônima

**Status:** aceito · **Data:** 2026-10-15 · **Revisa:** `DISCOVERY.md` §9, passo 3

## Contexto

O estado de cada pessoa vivia só no `localStorage`. Para continuar de outro aparelho, para o
piloto e para a trilha de auditoria do TCC, ele precisa ir para um banco. O dono do produto
escolheu Postgres. A entrada não pode voltar a exigir cadastro antes de mostrar valor.

## Decisão

1. **Neon (Postgres gerenciado, plano gratuito).** O Supabase gratuito pausa após uma semana
   sem uso e só volta à mão — a banca pode abrir o link num dia qualquer.
2. **O catálogo continua no código.** É validado por teste (proveniência, suficiência, ordem da
   trilha), revisado por diff e versionado (`CATALOG_VERSION`). O banco guarda só o estado da
   pessoa, com ids do catálogo como texto e a versão vigente em cada gravação.
3. **Drizzle + `pg`.** Esquema em TypeScript, SQL visível nas migrações (`career-gap/drizzle/`).
   O domínio continua sem nenhum import de ORM.
4. **Better Auth com sessão anônima por padrão.** Google e GitHub são opcionais; ao entrar, o
   que a pessoa fez anônima vai junto (`moveUserData`).
5. **Navegador primeiro.** Toda escrita vai para o navegador e, com banco, também para o
   servidor. Cada pedaço carrega `updatedAt`; na sincronização, ganha o mais recente, e o
   servidor recusa escrita mais velha. Sem `DATABASE_URL`, o produto funciona inteiro no
   navegador.
6. **Auditoria:** cada mudança de perfil grava a entrada e a saída do motor
   (`roadmap_snapshot`), com escore e motivos.
7. **LGPD:** dado mínimo, página de privacidade, apagar tudo em cascata a partir da Minha área.
   O IP da sessão é mantido para limitar abuso no login, e declarado.

## Consequências

- Ligar o banco é configuração: `DATABASE_URL` e `pnpm db:migrate` (`PLANO-FASE4.md` §5).
- Mudar o catálogo não exige migração de dados; o snapshot preserva o que valia no dia.
- Uso de dados na pesquisa do TCC (registro de eventos de estudo) fica fora até haver termo de
  consentimento e acordo com o orientador.
