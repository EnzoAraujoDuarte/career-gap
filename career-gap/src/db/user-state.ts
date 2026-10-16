import { and, eq, sql } from 'drizzle-orm';
import { CATALOG } from '@/catalog';
import type { Level } from '@/domain/model';
import { generateRoadmap } from '@/domain/roadmap';
import {
  criteriaKey,
  mergeUserState,
  toUserProfile,
  type CriteriaChecks,
  type CriteriaMap,
  type Goals,
  type ProgressMap,
  type ResourceProgress,
  type StoredProfile,
  type UserState,
} from '@/lib/user-state';
import type { Db } from './client';
import { competencyLevel, criteriaCheck, learner, resourceProgress, roadmapSnapshot } from './schema';

/**
 * Leitura e gravação do estado de uma pessoa. Recebe o `userId` já autenticado — nunca um id
 * vindo do navegador — e entrada já validada (`lib/user-state.ts`).
 *
 * Toda gravação respeita `updatedAt`: uma escrita mais velha que a do banco é ignorada. Sem
 * isso, um segundo aparelho desatualizado apagaria o que a pessoa fez no primeiro.
 */

const iso = (date: Date | null | undefined) => date?.toISOString();

/**
 * Serializa as gravações de uma mesma pessoa dentro da transação. Sem isso, duas abas (ou o
 * efeito duplo do React em desenvolvimento) leem "nada gravado" ao mesmo tempo, as duas passam
 * pela checagem de `updatedAt` e o motor grava dois snapshots da mesma mudança.
 */
const lockUser = (tx: Pick<Db, 'execute'>, userId: string) =>
  tx.execute(sql`select pg_advisory_xact_lock(hashtext(${userId}))`);
const date = (value: string | undefined) => (value ? new Date(value) : null);

export async function loadUserState(db: Db, userId: string): Promise<UserState> {
  const [row] = await db.select().from(learner).where(eq(learner.userId, userId));
  const levels = await db.select().from(competencyLevel).where(eq(competencyLevel.userId, userId));
  const progressRows = await db.select().from(resourceProgress).where(eq(resourceProgress.userId, userId));
  const criteriaRows = await db.select().from(criteriaCheck).where(eq(criteriaCheck.userId, userId));

  const profile: StoredProfile | undefined =
    row?.trackId && row.profileUpdatedAt
      ? {
          trackId: row.trackId,
          emphasisId: row.emphasisId ?? undefined,
          levels: Object.fromEntries(levels.map((item) => [item.competencyId, item.level as Level])),
          updatedAt: iso(row.profileUpdatedAt),
        }
      : undefined;
  const goals: Goals | undefined =
    row?.goalsUpdatedAt
      ? {
          purpose: row.purpose ?? '',
          careerGoal: row.careerGoal ?? '',
          targetMonth: row.targetMonth ?? undefined,
          updatedAt: iso(row.goalsUpdatedAt)!,
        }
      : undefined;
  const progress: Record<string, ResourceProgress> = {};
  for (const item of progressRows) {
    progress[item.resourceId] = {
      savedAt: iso(item.savedAt),
      startedAt: iso(item.startedAt),
      completedAt: iso(item.completedAt),
      updatedAt: iso(item.updatedAt)!,
    };
  }
  const criteria: Record<string, CriteriaChecks> = {};
  for (const item of criteriaRows) {
    criteria[criteriaKey(item.competencyId, item.level as Level)] = {
      checked: item.checked,
      updatedAt: iso(item.updatedAt)!,
    };
  }
  return { profile, goals, progress, criteria };
}

/** Grava o perfil e, junto, a entrada e a saída do motor — a trilha de auditoria do TCC. */
export async function saveProfile(db: Db, userId: string, profile: StoredProfile): Promise<void> {
  const updatedAt = date(profile.updatedAt) ?? new Date();
  await db.transaction(async (tx) => {
    await lockUser(tx, userId);
    const [current] = await tx
      .select({
        profileUpdatedAt: learner.profileUpdatedAt,
        trackId: learner.trackId,
        emphasisId: learner.emphasisId,
        catalogVersion: learner.catalogVersion,
      })
      .from(learner)
      .where(eq(learner.userId, userId));
    if (current?.profileUpdatedAt && current.profileUpdatedAt >= updatedAt) return;

    // Mesmas respostas e mesmo catálogo dão a mesma trilha: só a data muda. Sem isso, refazer as
    // perguntas com as mesmas respostas gravava outro snapshot idêntico e poluía a auditoria.
    if (current?.profileUpdatedAt) {
      const stored = await tx
        .select({ competencyId: competencyLevel.competencyId, level: competencyLevel.level })
        .from(competencyLevel)
        .where(eq(competencyLevel.userId, userId));
      const unchanged =
        current.trackId === profile.trackId &&
        (current.emphasisId ?? undefined) === profile.emphasisId &&
        current.catalogVersion === CATALOG.version &&
        sameLevels(stored, profile.levels);
      if (unchanged) {
        await tx.update(learner).set({ profileUpdatedAt: updatedAt }).where(eq(learner.userId, userId));
        return;
      }
    }

    const values = {
      trackId: profile.trackId,
      emphasisId: profile.emphasisId ?? null,
      catalogVersion: CATALOG.version,
      profileUpdatedAt: updatedAt,
    };
    await tx
      .insert(learner)
      .values({ userId, ...values })
      .onConflictDoUpdate({ target: learner.userId, set: values });

    await tx.delete(competencyLevel).where(eq(competencyLevel.userId, userId));
    const levels = Object.entries(profile.levels);
    if (levels.length > 0) {
      await tx
        .insert(competencyLevel)
        .values(levels.map(([competencyId, level]) => ({ userId, competencyId, level, updatedAt })));
    }

    const { inputSnapshot, ...output } = generateRoadmap(toUserProfile(profile, userId), CATALOG, {
      now: updatedAt,
    });
    await tx.insert(roadmapSnapshot).values({
      userId,
      catalogVersion: CATALOG.version,
      input: inputSnapshot,
      output,
    });
  });
}

const sameLevels = (
  stored: readonly { competencyId: string; level: string }[],
  levels: StoredProfile['levels'],
): boolean =>
  stored.length === Object.keys(levels).length &&
  stored.every((item) => levels[item.competencyId] === item.level);

export async function saveGoals(db: Db, userId: string, goals: Goals): Promise<void> {
  const updatedAt = new Date(goals.updatedAt);
  await db.transaction(async (tx) => {
    await lockUser(tx, userId);
    const [current] = await tx
      .select({ goalsUpdatedAt: learner.goalsUpdatedAt })
      .from(learner)
      .where(eq(learner.userId, userId));
    if (current?.goalsUpdatedAt && current.goalsUpdatedAt >= updatedAt) return;

    const values = {
      purpose: goals.purpose,
      careerGoal: goals.careerGoal,
      targetMonth: goals.targetMonth ?? null,
      goalsUpdatedAt: updatedAt,
    };
    await tx
      .insert(learner)
      .values({ userId, ...values })
      .onConflictDoUpdate({ target: learner.userId, set: values });
  });
}

export async function saveProgress(db: Db, userId: string, progress: ProgressMap): Promise<void> {
  for (const [resourceId, entry] of Object.entries(progress)) {
    const values = {
      savedAt: date(entry.savedAt),
      startedAt: date(entry.startedAt),
      completedAt: date(entry.completedAt),
      updatedAt: new Date(entry.updatedAt),
    };
    const [current] = await db
      .select({ updatedAt: resourceProgress.updatedAt })
      .from(resourceProgress)
      .where(and(eq(resourceProgress.userId, userId), eq(resourceProgress.resourceId, resourceId)));
    if (current && current.updatedAt >= values.updatedAt) continue;
    await db
      .insert(resourceProgress)
      .values({ userId, resourceId, ...values })
      .onConflictDoUpdate({ target: [resourceProgress.userId, resourceProgress.resourceId], set: values });
  }
}

export async function saveCriteria(db: Db, userId: string, criteria: CriteriaMap): Promise<void> {
  for (const [key, entry] of Object.entries(criteria)) {
    const [competencyId, level] = key.split('@');
    const values = { checked: [...entry.checked], updatedAt: new Date(entry.updatedAt) };
    const where = and(
      eq(criteriaCheck.userId, userId),
      eq(criteriaCheck.competencyId, competencyId),
      eq(criteriaCheck.level, level),
    );
    const [current] = await db.select({ updatedAt: criteriaCheck.updatedAt }).from(criteriaCheck).where(where);
    if (current && current.updatedAt >= values.updatedAt) continue;
    await db
      .insert(criteriaCheck)
      .values({ userId, competencyId, level, ...values })
      .onConflictDoUpdate({
        target: [criteriaCheck.userId, criteriaCheck.competencyId, criteriaCheck.level],
        set: values,
      });
  }
}

/** Grava o que o `mergeUserState` mandou subir. */
export async function saveUserState(
  db: Db,
  userId: string,
  patch: {
    readonly profile?: StoredProfile;
    readonly goals?: Goals;
    readonly progress?: ProgressMap;
    readonly criteria?: CriteriaMap;
  },
): Promise<void> {
  if (patch.profile) await saveProfile(db, userId, patch.profile);
  if (patch.goals) await saveGoals(db, userId, patch.goals);
  if (patch.progress) await saveProgress(db, userId, patch.progress);
  if (patch.criteria) await saveCriteria(db, userId, patch.criteria);
}

/**
 * Quem começou anônimo e depois entrou com Google ou GitHub não pode perder o que fez. Se a
 * conta já tinha dados (entrou antes em outro aparelho), junta pedaço a pedaço pelo mais
 * recente. O usuário anônimo é apagado depois pelo Better Auth, e os dados dele em cascata.
 */
export async function moveUserData(db: Db, fromUserId: string, toUserId: string): Promise<void> {
  const [from, to] = await Promise.all([loadUserState(db, fromUserId), loadUserState(db, toUserId)]);
  const { push } = mergeUserState(from, to);
  await saveUserState(db, toUserId, push);
}
