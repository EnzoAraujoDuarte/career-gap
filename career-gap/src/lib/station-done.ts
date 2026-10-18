'use client';

import type { Level } from '@/domain/model';
import { createLocalStore } from './local-store';
import { loadDraft, saveDraft } from './profile-storage';
import { showToast } from './toast';
import { concludeCompetency, reopenCompetency } from './user-state';

/** O nível de antes de cada conclusão, para o "reabrir" voltar exatamente a ele. Só no navegador:
 *  sem ele, reabrir desce um degrau abaixo do alvo, que também devolve a lacuna. */
const before = createLocalStore<Record<string, Level>>('career-gap:antes-de-concluir:v1');

export function concludeStation(competency: string, name: string): void {
  const result = concludeCompetency(loadDraft(), competency);
  if (!result) return;
  before.save({ ...(before.load() ?? {}), [competency]: result.previous });
  saveDraft(result.profile);
  showToast({
    text: `${name}: concluída`,
    action: { label: 'Desfazer', run: () => reopenStation(competency, name, { quiet: true }) },
  });
}

export function reopenStation(competency: string, name: string, { quiet = false } = {}): void {
  const draft = loadDraft();
  if (!draft) return;
  const remembered = before.load() ?? {};
  const next = reopenCompetency(draft, competency, remembered[competency]);
  if (!next) return;
  before.save(Object.fromEntries(Object.entries(remembered).filter(([id]) => id !== competency)));
  saveDraft(next);
  if (!quiet) {
    showToast({
      text: `${name}: reaberta`,
      action: { label: 'Desfazer', run: () => concludeStation(competency, name) },
    });
  }
}
