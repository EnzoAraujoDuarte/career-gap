import { existsSync } from 'node:fs';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

/**
 * Usuários anônimos sem nada guardado: visitas que abriram o site e saíram, e robôs, de antes
 * da sessão sob demanda. Lista por padrão; apaga só com `--apagar` (sessões saem em cascata).
 *
 * Uso, de dentro de career-gap/:  pnpm db:anonimos [--apagar] [--dias=1]
 * Vale para o branch do Neon que o .env.local aponta (dev, por padrão).
 */

if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL ausente no .env.local');

const erase = process.argv.includes('--apagar');
const days = Number(process.argv.find((arg) => arg.startsWith('--dias='))?.split('=')[1] ?? 1);
if (!Number.isFinite(days) || days < 0) throw new Error('--dias precisa ser um número >= 0');

const pool = new Pool({ connectionString: url });
const db = drizzle({ client: pool });

const empty = sql`
  select u.id from "user" u
  where u.is_anonymous = true
    and u.created_at < now() - make_interval(days => ${days})
    and not exists (select 1 from learner l where l.user_id = u.id)
    and not exists (select 1 from resource_progress p where p.user_id = u.id)
    and not exists (select 1 from criteria_check c where c.user_id = u.id)`;

async function main() {
  const total = (await db.execute(sql`select count(*)::int as n from "user"`)).rows[0].n;
  const found = (await db.execute(empty)).rows.length;
  console.log(`branch ${process.env.NEON_BRANCH ?? '?'}: ${total} usuários, ${found} anônimos vazios há mais de ${days} dia(s)`);
  if (erase && found > 0) {
    const removed = await db.execute(sql`delete from "user" where id in (${empty})`);
    console.log(`apagados: ${removed.rowCount}`);
  } else if (found > 0) {
    console.log('nada apagado; rode com --apagar para remover');
  }
}

main().finally(() => pool.end());
