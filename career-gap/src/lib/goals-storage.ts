'use client';

import { createLocalStore } from './local-store';
import { pushRemote } from './remote-push';
import type { Goals } from './user-state';

/**
 * Propósito e meta, escritos pela pessoa. Meta que a pessoa não formula é meta que ela não
 * sustenta — e a agenda que o sistema montava saiu: quando estudar é decisão dela.
 */
const store = createLocalStore<Goals>('career-gap:goals:v1');

export function saveGoals(goals: Omit<Goals, 'updatedAt'>): void {
  const stamped = { ...goals, updatedAt: new Date().toISOString() };
  store.save(stamped);
  pushRemote({ goals: stamped });
}

export const loadGoals = (): Goals | undefined => store.load();
export const useGoals = (): Goals | null | undefined => store.useValue();
export const clearGoals = (): void => store.clear();
/** Só para a sincronização: grava o que veio do banco sem mandar de volta. */
export const replaceGoals = (goals: Goals): void => store.save(goals);
