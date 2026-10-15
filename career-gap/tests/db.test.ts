import { PGlite } from '@electric-sql/pglite';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { beforeAll, describe, expect, it } from 'vitest';
import { CATALOG } from '@/catalog';
import type { Db } from '@/db/client';
import * as schema from '@/db/schema';
import { loadUserState, moveUserData, saveGoals, saveProfile, saveProgress } from '@/db/user-state';
import { buildAuth, configuredProviders } from '@/lib/auth';
import {
  assertGoals,
  assertProfile,
  assertProgress,
  mergeUserState,
  type StoredProfile,
} from '@/lib/user-state';

/**
 * Postgres de verdade, em memória (PGlite), rodando a MESMA migração que vai para o Neon. É o
 * que prova, sem o banco do Enzo, que esquema, gravação e login funcionam juntos.
 */
let db: Db;

beforeAll(async () => {
  db = drizzle({ client: new PGlite(), schema }) as unknown as Db;
  await migrate(db as never, { migrationsFolder: './drizzle' });
});

const RESOURCE = CATALOG.resources[0].id;
const at = (minute: number) => new Date(Date.UTC(2026, 9, 15, 12, minute)).toISOString();
const profile = (minute: number, level: 'L1' | 'L2' = 'L1'): StoredProfile => ({
  trackId: 'first-web-role',
  levels: { 'programming-fundamentals': level, 'html-semantics': 'L0' },
  updatedAt: at(minute),
});
const createUser = (id: string) =>
  db.insert(schema.user).values({ id, name: id, email: `${id}@exemplo.test` });

describe('banco: login', () => {
  it('cria uma sessão anônima nas tabelas da migração', async () => {
    const auth = buildAuth(db, {});
    const result = await auth.api.signInAnonymous({ headers: new Headers() });
    expect(result?.user.id).toBeTruthy();

    const [row] = await db.select().from(schema.user).where(eq(schema.user.id, result!.user.id));
    expect(row.isAnonymous).toBe(true);
    const sessions = await db.select().from(schema.session).where(eq(schema.session.userId, row.id));
    expect(sessions).toHaveLength(1);
  });

  it('só oferece o provedor que tem as duas credenciais no ambiente', () => {
    expect(configuredProviders({})).toEqual([]);
    expect(configuredProviders({ GITHUB_CLIENT_ID: 'x' })).toEqual([]);
    expect(
      configuredProviders({ GOOGLE_CLIENT_ID: 'x', GOOGLE_CLIENT_SECRET: 'y', GITHUB_CLIENT_ID: 'z' }),
    ).toEqual(['google']);
  });
});

describe('banco: estado da pessoa', () => {
  it('grava e lê o perfil, com a trilha de auditoria do motor', async () => {
    await createUser('ana');
    await saveProfile(db, 'ana', profile(1));

    const state = await loadUserState(db, 'ana');
    expect(state.profile).toEqual({ ...profile(1), emphasisId: undefined });

    const snapshots = await db
      .select()
      .from(schema.roadmapSnapshot)
      .where(eq(schema.roadmapSnapshot.userId, 'ana'));
    expect(snapshots).toHaveLength(1);
    expect(snapshots[0].catalogVersion).toBe(CATALOG.version);
    const output = snapshots[0].output as { items: { competency: string; score: number }[] };
    expect(output.items.length).toBeGreaterThan(0);
    expect(output.items[0].score).toBeTypeOf('number');
  });

  it('ignora uma gravação mais velha que a do banco', async () => {
    await saveProfile(db, 'ana', profile(5, 'L2'));
    await saveProfile(db, 'ana', profile(3, 'L1'));
    const state = await loadUserState(db, 'ana');
    expect(state.profile?.levels['programming-fundamentals']).toBe('L2');
    expect(state.profile?.updatedAt).toBe(at(5));
  });

  it('grava metas e progresso pelo mesmo critério', async () => {
    await saveGoals(db, 'ana', { purpose: 'mudar de vida', careerGoal: 'primeira vaga', targetMonth: '2027-06', updatedAt: at(2) });
    await saveProgress(db, 'ana', { [RESOURCE]: { savedAt: at(2), updatedAt: at(2) } });
    await saveProgress(db, 'ana', { [RESOURCE]: { savedAt: at(2), completedAt: at(4), updatedAt: at(4) } });
    await saveProgress(db, 'ana', { [RESOURCE]: { updatedAt: at(3) } });

    const state = await loadUserState(db, 'ana');
    expect(state.goals?.targetMonth).toBe('2027-06');
    expect(state.progress[RESOURCE]).toEqual({
      savedAt: at(2),
      startedAt: undefined,
      completedAt: at(4),
      updatedAt: at(4),
    });
  });

  it('leva junto o que a pessoa fez anônima quando ela entra com uma conta', async () => {
    await createUser('anonima');
    await createUser('conta');
    await saveProfile(db, 'anonima', profile(10, 'L2'));
    await saveProgress(db, 'anonima', { [RESOURCE]: { startedAt: at(10), updatedAt: at(10) } });
    await saveGoals(db, 'conta', { purpose: 'já tinha', careerGoal: '', updatedAt: at(1) });

    await moveUserData(db, 'anonima', 'conta');
    await db.delete(schema.user).where(eq(schema.user.id, 'anonima'));

    const merged = await loadUserState(db, 'conta');
    expect(merged.profile?.levels['programming-fundamentals']).toBe('L2');
    expect(merged.progress[RESOURCE]?.startedAt).toBe(at(10));
    expect(merged.goals?.purpose).toBe('já tinha');
    // Apagar o usuário anônimo leva os dados dele em cascata.
    expect(await loadUserState(db, 'anonima')).toEqual({ profile: undefined, goals: undefined, progress: {} });
  });
});

describe('sincronização', () => {
  it('fica com o mais recente de cada pedaço e só sobe o que o banco não tem', () => {
    const { local, push } = mergeUserState(
      { profile: profile(9), progress: { a: { updatedAt: at(1) }, b: { updatedAt: at(8) } } },
      { profile: profile(2), goals: { purpose: 'x', careerGoal: '', updatedAt: at(5) }, progress: { a: { updatedAt: at(3) } } },
    );
    expect(local.profile?.updatedAt).toBe(at(9));
    expect(local.goals?.purpose).toBe('x');
    expect(local.progress.a.updatedAt).toBe(at(3));
    expect(push.profile?.updatedAt).toBe(at(9));
    expect(push.goals).toBeUndefined();
    expect(Object.keys(push.progress)).toEqual(['b']);
  });
});

describe('validação na entrada do servidor', () => {
  it('recusa competência fora da trilha, nível inventado, recurso desconhecido e mês inválido', () => {
    expect(() => assertProfile({ ...profile(1), levels: { inventada: 'L1' } })).toThrow();
    expect(() => assertProfile({ ...profile(1), levels: { 'programming-fundamentals': 'L9' } })).toThrow();
    expect(() => assertProgress('nao-existe', { updatedAt: at(1) })).toThrow();
    expect(() => assertGoals({ purpose: '', careerGoal: '', targetMonth: '2027-13', updatedAt: at(1) })).toThrow();
    expect(() => assertProfile(profile(1))).not.toThrow();
    expect(() => assertProgress(RESOURCE, { savedAt: at(1), updatedAt: at(1) })).not.toThrow();
  });
});
