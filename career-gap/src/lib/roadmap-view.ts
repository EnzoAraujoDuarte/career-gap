import type { Catalog } from '@/domain/roadmap';
import type {
  CompetencyId,
  Criticality,
  Level,
  ProfessionalHabit,
  ReasonCode,
  Roadmap,
  TechnologyId,
} from '@/domain/model';
import type { PickedResource } from '@/domain/resources';
import { selectResourcesFor } from '@/domain/resources';
import { badgeFor } from './tech-badge';

/**
 * Converte o roadmap do domínio na estrutura que o mapa desenha.
 *
 * Módulo puro e testável: a decisão de o que aparece e com que estado não pode morar
 * dentro de um componente React, senão deixa de ser verificável.
 */

export type NodeStatus = 'met' | 'now' | 'available' | 'blocked';

export interface ViewNode {
  readonly id: CompetencyId;
  readonly name: string;
  readonly status: NodeStatus;
  readonly currentLevel: Level;
  readonly targetLevel: Level;
  readonly criticality: Criticality;
  readonly rank?: number;
  /** Onda em que a competência se torna alcançável. É o que converte o DAG em seções
   *  verticais sem mentir sobre a estrutura (um nó costuma ter vários bloqueadores). */
  readonly wave?: number;
  readonly reasonCodes: readonly ReasonCode[];
  readonly blockedBy: readonly string[];
  readonly needsVerification: boolean;
  readonly summary: string;
  /** Recursos do nível-alvo do TRACK — nunca do nível do usuário. É o que mantém as duas
   *  condições do experimento comparáveis (docs/DECISOES.md §1). */
  readonly resources: readonly PickedResource[];
  /** Tecnologia dominante entre os recursos, exibida como selo no nó. */
  readonly techBadge?: string;
  readonly exitCriteria: readonly string[];
  /** Como profissionais trabalham nesta competência. Iguais nas duas condições do experimento. */
  readonly habits: readonly ProfessionalHabit[];
}

/** Única fonte dos hábitos de uma ficha — usada pelo roadmap e pela condição A. */
export const habitsFor = (catalog: Catalog, id: CompetencyId): readonly ProfessionalHabit[] =>
  catalog.habits.filter((habit) => habit.competencies.includes(id));

export interface ViewEdge {
  readonly id: string;
  readonly source: CompetencyId;
  readonly target: CompetencyId;
  /** Aresta ainda não satisfeita: é ela que explica visualmente o bloqueio. */
  readonly unmet: boolean;
}

export interface ViewNotNow {
  readonly id: CompetencyId;
  readonly name: string;
  readonly reasonCode: ReasonCode;
  readonly explanation: string;
}

export interface RoadmapView {
  readonly nodes: readonly ViewNode[];
  readonly edges: readonly ViewEdge[];
  readonly notNow: readonly ViewNotNow[];
  readonly nowId?: CompetencyId;
  /** Linguagem de servidor escolhida: só reordena os materiais (ADR-0014). */
  readonly technologyId?: TechnologyId;
  readonly counts: { readonly met: number; readonly open: number; readonly notNow: number };
}

export function buildRoadmapView(roadmap: Roadmap, catalog: Catalog): RoadmapView {
  const nameOf = (id: CompetencyId) => catalog.competencies.get(id)?.name ?? id;
  const summaryOf = (id: CompetencyId) => catalog.competencies.get(id)?.summary ?? '';
  const exitCriteriaOf = (id: CompetencyId, level: Level) =>
    catalog.competencies.get(id)?.levels[level]?.exitCriteria ?? [];
  const verification = new Set(roadmap.verificationNeeded);
  const nowId = roadmap.nextBestAction?.competency;

  const technologyId = roadmap.inputSnapshot.technologyId;
  const picked = (id: CompetencyId, level: Level) =>
    selectResourcesFor(id, level, catalog.resources, undefined, technologyId);

  // Competências já atingidas permanecem no mapa: sem elas o usuário perde a resposta
  // para "onde estou" e vê só o que falta.
  const metNodes: ViewNode[] = roadmap.met.map((id) => ({
    id,
    name: nameOf(id),
    status: 'met',
    currentLevel: levelOfMet(roadmap, id),
    targetLevel: levelOfMet(roadmap, id),
    criticality: 'core',
    reasonCodes: ['TARGET_ALREADY_MET'],
    blockedBy: [],
    needsVerification: verification.has(id),
    summary: summaryOf(id),
    resources: picked(id, levelOfMet(roadmap, id)),
    techBadge: badgeFor(picked(id, levelOfMet(roadmap, id)), nameOf(id)),
    exitCriteria: exitCriteriaOf(id, levelOfMet(roadmap, id)),
    habits: habitsFor(catalog, id),
  }));

  const openNodes: ViewNode[] = roadmap.items.map((item) => ({
    id: item.competency,
    name: nameOf(item.competency),
    status: item.competency === nowId ? 'now' : item.status === 'blocked' ? 'blocked' : 'available',
    currentLevel: item.gap.currentLevel,
    targetLevel: item.gap.targetLevel,
    criticality: item.gap.criticality,
    rank: item.rank,
    wave: item.wave,
    reasonCodes: item.reasonCodes,
    blockedBy: item.blockedBy.map(nameOf),
    needsVerification: item.gap.needsVerification,
    summary: summaryOf(item.competency),
    resources: picked(item.competency, item.gap.targetLevel),
    techBadge: badgeFor(picked(item.competency, item.gap.targetLevel), nameOf(item.competency)),
    exitCriteria: exitCriteriaOf(item.competency, item.gap.targetLevel),
    habits: habitsFor(catalog, item.competency),
  }));

  const nodes = [...metNodes, ...openNodes];
  const visible = new Set(nodes.map((node) => node.id));
  const blockedPairs = new Set(
    roadmap.items.flatMap((item) => item.blockedBy.map((from) => `${from}->${item.competency}`)),
  );

  const edges: ViewEdge[] = catalog.prerequisites
    .filter((edge) => visible.has(edge.requires) && visible.has(edge.unlocks))
    .map((edge) => ({
      id: `${edge.requires}->${edge.unlocks}`,
      source: edge.requires,
      target: edge.unlocks,
      unmet: blockedPairs.has(`${edge.requires}->${edge.unlocks}`),
    }));

  return {
    nodes,
    edges,
    notNow: roadmap.excluded.map((excluded) => ({
      id: excluded.competency,
      name: nameOf(excluded.competency),
      reasonCode: excluded.reasonCode,
      explanation: excluded.explanation,
    })),
    nowId,
    technologyId,
    counts: {
      met: roadmap.met.length,
      open: roadmap.items.length,
      notNow: roadmap.excluded.length,
    },
  };
}

/** O snapshot guarda o nível declarado; competência atingida não tem gap para consultar. */
function levelOfMet(roadmap: Roadmap, id: CompetencyId): Level {
  return roadmap.inputSnapshot.competencies.find((item) => item.competency === id)?.level ?? 'L0';
}
