'use client';

import type { Level } from '@/domain/model';
import { createLocalStore } from './local-store';
import { pushRemote } from './remote-push';
import { criteriaKey, type CriteriaMap } from './user-state';

/**
 * Critérios de saída marcados. Antes viviam só na memória da tela e sumiam ao recarregar.
 * Marcar não muda o nível — mostra o progresso dentro da competência.
 */
const store = createLocalStore<CriteriaMap>('career-gap:criteria:v1');

export const useCriteria = (): CriteriaMap | null | undefined => store.useValue();
export const loadCriteria = (): CriteriaMap => store.load() ?? {};
export const clearCriteria = (): void => store.clear();
/** Só para a sincronização: grava o que veio do banco sem mandar de volta. */
export const replaceCriteria = (criteria: CriteriaMap): void => store.save(criteria);

export function toggleCriterion(competency: string, level: Level, index: number): void {
  toggleCriterionKey(criteriaKey(competency, level), index);
}

/** A mesma marcação para qualquer lista do catálogo: critérios de saída ou passos de construção. */
export function toggleCriterionKey(key: string, index: number): void {
  const current = loadCriteria();
  const checked = new Set(current[key]?.checked ?? []);
  if (checked.has(index)) checked.delete(index);
  else checked.add(index);
  const entry = { checked: [...checked].sort((a, b) => a - b), updatedAt: new Date().toISOString() };
  store.save({ ...current, [key]: entry });
  pushRemote({ criteria: { [key]: entry } });
}
