'use client';

import { pullUserState, pushUserState } from '@/server/user-state-actions';
import { loadGoals, replaceGoals } from './goals-storage';
import { loadDraft, replaceDraft } from './profile-storage';
import { loadProgress, replaceProgress } from './progress-storage';
import { enableRemote } from './remote-push';
import { mergeUserState } from './user-state';

let resyncPending = false;

/**
 * Junta o que está no navegador com o que está no banco e grava o resultado nos dois lados.
 * Devolve `false` quando o servidor não tem sessão — aí tudo segue só no navegador.
 */
export async function syncNow(): Promise<boolean> {
  const remote = await pullUserState();
  if (!remote) return false;
  const { local, push } = mergeUserState(
    { profile: loadDraft(), goals: loadGoals(), progress: loadProgress() },
    remote,
  );
  if (local.profile) replaceDraft(local.profile);
  if (local.goals) replaceGoals(local.goals);
  replaceProgress(local.progress);
  if (push.profile || push.goals || Object.keys(push.progress).length > 0) await pushUserState(push);
  enableRemote(scheduleResync);
  return true;
}

/** Falhou uma subida: tenta de novo quando a pessoa voltar à aba ou a rede voltar. */
function scheduleResync() {
  if (resyncPending) return;
  resyncPending = true;
  const retry = () => {
    if (document.visibilityState !== 'visible') return;
    window.removeEventListener('online', retry);
    document.removeEventListener('visibilitychange', retry);
    resyncPending = false;
    syncNow().catch(scheduleResync);
  };
  window.addEventListener('online', retry);
  document.addEventListener('visibilitychange', retry);
}
