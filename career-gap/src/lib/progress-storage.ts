'use client';

import { createLocalStore } from './local-store';
import { pushRemote } from './remote-push';
import type { ProgressMap, ResourceProgress } from './user-state';

/**
 * O que a pessoa guardou, abriu e concluiu — Minha lista, Continuar e Concluídos.
 *
 * Concluir um recurso NÃO muda o nível da competência: consumir não é saber fazer. O nível só
 * muda pela autoavaliação (docs/DECISOES.md §3).
 */
const store = createLocalStore<ProgressMap>('career-gap:progress:v1');

export const useProgress = (): ProgressMap | null | undefined => store.useValue();
export const loadProgress = (): ProgressMap => store.load() ?? {};
export const clearProgress = (): void => store.clear();
/** Só para a sincronização: grava o que veio do banco sem mandar de volta. */
export const replaceProgress = (progress: ProgressMap): void => store.save(progress);

function update(resourceId: string, change: (entry: ResourceProgress | undefined, now: string) => Partial<ResourceProgress>) {
  const now = new Date().toISOString();
  const current = loadProgress();
  const entry: ResourceProgress = { ...current[resourceId], ...change(current[resourceId], now), updatedAt: now };
  store.save({ ...current, [resourceId]: entry });
  pushRemote({ progress: { [resourceId]: entry } });
}

export const toggleSaved = (resourceId: string) =>
  update(resourceId, (entry, now) => ({ savedAt: entry?.savedAt ? undefined : now }));

export const toggleCompleted = (resourceId: string) =>
  update(resourceId, (entry, now) => ({ completedAt: entry?.completedAt ? undefined : now }));

/** Abrir o link conta como começar; a primeira vez é a que vale para "Continuar". */
export function markStarted(resourceId: string): void {
  if (loadProgress()[resourceId]?.startedAt) return;
  update(resourceId, (_, now) => ({ startedAt: now }));
}
