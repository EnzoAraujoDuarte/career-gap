'use server';

import { CATALOG } from '@/catalog';
import { generateRoadmap } from '@/domain/roadmap';
import { loadEvaluation, saveEvaluation, type EvaluationContext, type StoredEvaluation } from '@/db/evaluation';
import { loadUserState } from '@/db/user-state';
import { assertEvaluation, INSTRUMENT_VERSION, InvalidEvaluation } from '@/lib/evaluation';
import { buildPathView } from '@/lib/path-view';
import { buildRoadmapView } from '@/lib/roadmap-view';
import { BUILD_PROGRESS_PREFIX, toUserProfile, type UserState } from '@/lib/user-state';
import type { Db } from '@/db/client';
import { currentUser } from './session';

/**
 * O questionário da pesquisa. Precisa de sessão (a anônima serve) e do termo aceito; o que a
 * pessoa via na hora vem do estado dela no banco, nunca do navegador.
 */

export type SubmitResult =
  | { readonly ok: true; readonly submittedAt: string }
  | { readonly ok: false; readonly reason: 'no-session' | 'invalid' };

export async function submitEvaluation(input: unknown): Promise<SubmitResult> {
  const current = await currentUser();
  if (!current) return { ok: false, reason: 'no-session' };
  try {
    assertEvaluation(input);
  } catch (error) {
    if (error instanceof InvalidEvaluation) return { ok: false, reason: 'invalid' };
    throw error;
  }

  const now = new Date().toISOString();
  await saveEvaluation(current.db, current.userId, {
    instrumentVersion: INSTRUMENT_VERSION,
    catalogVersion: CATALOG.version,
    consentAt: now,
    submittedAt: now,
    participant: input.participant,
    answers: input.answers,
    comments: Object.fromEntries(
      Object.entries(input.comments)
        .map(([id, text]) => [id, text.trim()])
        .filter(([, text]) => text.length > 0),
    ),
    context: await contextOf(current.db, current.userId),
  });
  return { ok: true, submittedAt: now };
}

/** `null` sem sessão ou sem resposta: o formulário começa em branco. */
export async function myEvaluation(): Promise<StoredEvaluation | null> {
  const current = await currentUser();
  if (!current) return null;
  return (await loadEvaluation(current.db, current.userId)) ?? null;
}

/** A trilha como a pessoa a via: os mesmos cálculos das telas, a partir do estado no banco. */
async function contextOf(db: Db, userId: string): Promise<EvaluationContext> {
  const state = await loadUserState(db, userId);
  const progress = Object.entries(state.progress).filter(([, entry]) => entry.completedAt);
  const built = progress.filter(([id]) => id.startsWith(BUILD_PROGRESS_PREFIX)).length;
  const base = { built, completedResources: progress.length - built };

  const track = state.profile && CATALOG.tracks.get(state.profile.trackId);
  if (!state.profile || !track) return { ...base, hasProfile: false, levels: {}, recommended: [] };

  const view = buildRoadmapView(generateRoadmap(toUserProfile(state.profile, userId), CATALOG), CATALOG);
  const path = buildPathView(CATALOG, track, view);
  return {
    ...base,
    hasProfile: true,
    levels: levelsOf(state),
    emphasisId: state.profile.emphasisId,
    hereId: path.hereId,
    recommended: path.recommended.map((stop) => stop.id),
    counts: view.counts,
  };
}

const levelsOf = (state: UserState): Record<string, string> =>
  Object.fromEntries(Object.entries(state.profile?.levels ?? {}).filter(([, level]) => level !== 'L0'));
