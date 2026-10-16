'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { CATALOG } from '@/catalog';
import type { UserProfile } from '@/domain/model';
import { generateRoadmap } from '@/domain/roadmap';
import { DEMO_PROFILES } from './demo-profiles';
import { useStoredDraft } from './profile-storage';
import { toUserProfile } from './user-state';
import { buildRoadmapView, type RoadmapView } from './roadmap-view';

/**
 * Perfil em uso: o de demonstração (`?perfil=`) ou o rascunho salvo no navegador.
 *
 * Única fonte para a trilha, o explorar e a minha área — todos leem o MESMO estado de
 * competências, e é isso que faz as anotações de direção baterem em todas as telas.
 * `undefined` enquanto o navegador é lido; `null` quando não há perfil.
 */
export function useCurrentProfile(): {
  readonly profile: UserProfile | null | undefined;
  readonly demoId?: string;
} {
  const demoId = useDemoId();
  const draft = useStoredDraft();
  const profile = demoId
    ? (DEMO_PROFILES.find((candidate) => candidate.id === demoId) ?? null)
    : draft === undefined
      ? undefined
      : draft && toUserProfile(draft);
  return { profile, demoId };
}

/** Sufixo que leva o perfil de demonstração junto em cada link interno — sem ele, trocar de
 *  tela trocaria de pessoa. */
export function useProfileSuffix(): string {
  const demoId = useDemoId();
  return demoId ? `?perfil=${encodeURIComponent(demoId)}` : '';
}

const subscribeToHistory = (onChange: () => void) => {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
};
const readDemoId = () => new URLSearchParams(window.location.search).get('perfil') ?? undefined;
const noDemoOnServer = () => undefined;

/**
 * O `?perfil=` da URL, lido sem `useSearchParams`. Com ele, toda página estática caía para
 * renderização só no cliente e chegava em branco (docs do Next: useSearchParams em
 * prerender). No servidor não existe perfil de demonstração; no cliente, o React relê a URL
 * depois de cada navegação. Trocar de perfil no mesmo endereço recarrega a página
 * (`DemoSwitcher`), porque o roteador não avisa quando só a query muda.
 */
function useDemoId(): string | undefined {
  return useSyncExternalStore(subscribeToHistory, readDemoId, noDemoOnServer);
}

/** Roadmap do perfil em uso, já na forma que as telas desenham. */
export function useCurrentRoadmapView(): RoadmapView | null | undefined {
  const { profile } = useCurrentProfile();
  return useMemo(
    () => (profile ? buildRoadmapView(generateRoadmap(profile, CATALOG), CATALOG) : profile),
    [profile],
  );
}
