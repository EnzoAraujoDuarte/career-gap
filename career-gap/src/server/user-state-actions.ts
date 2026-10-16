'use server';

import { eq } from 'drizzle-orm';
import { CATALOG } from '@/catalog';
import { LEVELS } from '@/domain/model';
import { user } from '@/db/schema';
import { loadUserState, saveUserState } from '@/db/user-state';
import {
  assertCriteria,
  assertGoals,
  assertProfile,
  assertProgress,
  InvalidUserState,
  PROGRESS_ID_COUNT,
  type UserState,
  type UserStatePatch,
} from '@/lib/user-state';
import { currentUser } from './session';

/**
 * As duas portas do estado da pessoa no servidor. O `userId` sai da sessão (`session.ts`), e
 * tudo o que chega é validado contra o catálogo antes de tocar o banco.
 */

/** `null` sem banco ou sem sessão: o navegador segue sozinho. */
export async function pullUserState(): Promise<UserState | null> {
  const current = await currentUser();
  return current ? loadUserState(current.db, current.userId) : null;
}

export async function pushUserState(patch: UserStatePatch): Promise<void> {
  const current = await currentUser();
  if (!current) return;

  if (patch.profile !== undefined) assertProfile(patch.profile);
  if (patch.goals !== undefined) assertGoals(patch.goals);
  const progress = Object.entries(patch.progress ?? {});
  if (progress.length > PROGRESS_ID_COUNT) throw new InvalidUserState('progresso grande demais');
  for (const [resourceId, entry] of progress) assertProgress(resourceId, entry);
  const criteria = Object.entries(patch.criteria ?? {});
  if (criteria.length > CATALOG.competencies.size * LEVELS.length) throw new InvalidUserState('critérios demais');
  for (const [key, entry] of criteria) assertCriteria(key, entry);

  await saveUserState(current.db, current.userId, patch);
}

/**
 * Direito de eliminação (LGPD, art. 18, VI). Apaga o usuário; perfil, metas, progresso,
 * critérios, registros do motor, sessões e contas vinculadas saem em cascata.
 */
export async function deleteMyData(): Promise<void> {
  const current = await currentUser();
  if (!current) return;
  await current.db.delete(user).where(eq(user.id, current.userId));
}
