import { drizzle } from 'drizzle-orm/node-postgres';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import { Pool } from 'pg';
import * as schema from './schema';

/** Qualquer Postgres via Drizzle: `pg` em produção, PGlite nos testes. */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

// O recarregamento do `next dev` reavalia este módulo; sem guardar o pool no global, cada
// edição abriria conexões novas até esgotar o limite do Neon.
const globalForDb = globalThis as { careerGapDb?: Db };

/**
 * O banco, ou `undefined` enquanto `DATABASE_URL` não existe. Sem banco o produto continua
 * inteiro no navegador — ligar o Postgres é só definir a variável e rodar `pnpm db:migrate`.
 */
export function getDb(): Db | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  globalForDb.careerGapDb ??= drizzle({ client: new Pool({ connectionString: url }), schema });
  return globalForDb.careerGapDb;
}
