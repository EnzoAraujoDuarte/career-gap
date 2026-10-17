'use client';

import { createLocalStore } from './local-store';
import { pushRemote } from './remote-push';
import type { StoredProfile } from './user-state';

/** Perfil autoavaliado. Sempre no navegador; também no banco quando ele está ligado. */
export type DraftProfile = StoredProfile;

const store = createLocalStore<StoredProfile>('career-gap:profile:v1');

export function saveDraft(draft: DraftProfile): void {
  const stamped = { ...draft, updatedAt: new Date().toISOString() };
  store.save(stamped);
  pushRemote({ profile: stamped });
}

export const loadDraft = (): DraftProfile | undefined => store.load();
export const clearDraft = (): void => store.clear();
export const useStoredDraft = (): DraftProfile | null | undefined => store.useValue();
/** Só para a sincronização: grava o que veio do banco sem mandar de volta. */
export const replaceDraft = (profile: StoredProfile): void => store.save(profile);

/** Troca só a linguagem do servidor. Sem perfil não há onde guardar, e a tela diz isso. */
export function saveTechnology(technologyId: string | undefined): boolean {
  const draft = store.load();
  if (!draft) return false;
  saveDraft({ ...draft, technologyId });
  return true;
}
