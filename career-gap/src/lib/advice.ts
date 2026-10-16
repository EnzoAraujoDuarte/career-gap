import type { CompetencyId } from '@/domain/model';
import type { RoadmapView } from './roadmap-view';
import { LEVEL_ASKED, LEVEL_NOW } from './reason-text';

/**
 * A camada de direção: o que o motor diz vira ANOTAÇÃO sobre um catálogo aberto, nunca
 * cadeado (docs/PLANO-FASE4.md §4). A pessoa estuda o que quiser; o sistema diz o que vale
 * agora, o que falta de base e o que pode esperar — sempre com o motivo.
 *
 * Nenhuma anotação desabilita link nem esconde recurso. Este módulo só classifica.
 */

export type AdviceKind = 'met' | 'recommended' | 'missing-base' | 'not-now';

export interface Advice {
  readonly kind: AdviceKind;
  /** O motivo, sempre presente: aviso sem motivo é cadeado disfarçado. */
  readonly reason: string;
  /** O motivo só repete a marca ("já está no nível"). A visão fechada pode omiti-lo: a regra de
   *  ruído da ADR-0008 mostra só razões que diferenciam. */
  readonly redundant?: boolean;
}

/**
 * Um foco único vira trilho; vinte e cinco recomendações viram ruído. Três dá escolha sem
 * paralisia, e cabe numa tela de celular.
 */
export const RECOMMENDED_LIMIT = 3;

export function adviseCompetencies(view: RoadmapView): ReadonlyMap<CompetencyId, Advice> {
  const advice = new Map<CompetencyId, Advice>();

  for (const node of view.nodes) {
    if (node.status === 'met') {
      advice.set(node.id, {
        kind: 'met',
        reason: node.needsVerification
          ? 'Você declarou que já sabe. Vale conferir pelos critérios de saída.'
          : 'Você já está no nível que a vaga pede.',
        redundant: !node.needsVerification,
      });
    } else if (node.status === 'blocked') {
      advice.set(node.id, {
        kind: 'missing-base',
        reason: `Recomendamos antes: ${node.blockedBy.join(', ')}. Sem essa base, este passo fica bem mais difícil.`,
      });
    }
  }

  const recommended = view.nodes
    .filter((node) => node.status === 'now' || node.status === 'available')
    .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
    .slice(0, RECOMMENDED_LIMIT);
  // "Destrava outras etapas" repetido em três itens seguidos não diferencia nada. O motivo diz
  // QUANTAS e a distância de nível — os mesmos números que o motor usou no ranking.
  const open = new Set(view.nodes.filter((node) => node.status !== 'met').map((node) => node.id));
  for (const node of recommended) {
    const unlocks = view.edges.filter((edge) => edge.source === node.id && open.has(edge.target)).length;
    const why =
      unlocks > 0
        ? `Base para ${unlocks} ${unlocks === 1 ? 'competência' : 'competências'} que você ainda vai estudar.`
        : node.criticality === 'core'
          ? 'Essencial para a vaga.'
          : 'Ajuda na vaga, sem ser condição para ela.';
    advice.set(node.id, {
      kind: 'recommended',
      reason: `${why} Hoje você ${LEVEL_NOW[node.currentLevel]}; a vaga pede que ${LEVEL_ASKED[node.targetLevel]}.`,
    });
  }

  for (const item of view.notNow) {
    advice.set(item.id, { kind: 'not-now', reason: item.explanation });
  }

  return advice;
}
