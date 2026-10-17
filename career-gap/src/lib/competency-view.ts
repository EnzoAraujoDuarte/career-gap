import type { Catalog } from '@/domain/roadmap';
import type { CareerTrack, CompetencyId, Level, ProfessionalHabit, Resource } from '@/domain/model';
import { levelIndex } from '@/domain/model';
import { selectResourcesFor } from '@/domain/resources';
import type { RoadmapView } from './roadmap-view';
import { adviseCompetencies, type Advice } from './advice';
import { habitsFor } from './roadmap-view';

/**
 * A página de uma competência, como a página de série do Laracasts: o que você vai aprender,
 * por onde começar e TODOS os recursos do nível-alvo — a ficha mostra três; aqui não há teto.
 */

export interface Neighbor {
  readonly id: CompetencyId;
  readonly name: string;
  readonly atLevel: Level;
  /** Só com perfil: a pessoa já tem o nível que a aresta pede. */
  readonly ready?: boolean;
}

export interface CompetencyView {
  readonly id: CompetencyId;
  readonly name: string;
  readonly summary: string;
  readonly targetLevel: Level;
  readonly levelTitle?: string;
  readonly exitCriteria: readonly string[];
  readonly advice?: Advice;
  readonly learn: readonly Resource[];
  readonly practice: readonly Resource[];
  readonly prove: readonly Resource[];
  readonly startId?: string;
  /** "Não se sente pronto? Comece por…" — o desvio da Khan Academy, sem trancar nada. */
  readonly before: readonly Neighbor[];
  readonly opens: readonly Neighbor[];
  readonly habits: readonly ProfessionalHabit[];
}

export function buildCompetencyView(
  catalog: Catalog,
  track: CareerTrack,
  id: CompetencyId,
  view?: RoadmapView,
): CompetencyView | undefined {
  const competency = catalog.competencies.get(id);
  const requirement = track.requirements.find((item) => item.competency === id);
  if (!competency || !requirement) return undefined;

  const target = requirement.targetLevel;
  const all = selectResourcesFor(id, target, catalog.resources, Infinity, view?.technologyId).map((item) => item.resource);
  const nameOf = (other: CompetencyId) => catalog.competencies.get(other)?.name ?? other;
  const levelOf = (other: CompetencyId): Level | undefined => {
    const node = view?.nodes.find((candidate) => candidate.id === other);
    return node && node.currentLevel;
  };

  return {
    id,
    name: competency.name,
    summary: competency.summary,
    targetLevel: target,
    levelTitle: track.path.find((level) => level.competencies.includes(id))?.title,
    exitCriteria: competency.levels[target]?.exitCriteria ?? [],
    advice: view ? adviseCompetencies(view).get(id) : undefined,
    learn: all.filter((resource) => ['READ', 'WATCH', 'LEARN'].includes(resource.actionType)),
    practice: all.filter((resource) => resource.actionType === 'BUILD'),
    prove: all.filter((resource) => resource.actionType === 'PROVE'),
    startId: all.find((resource) => !['BUILD', 'PROVE'].includes(resource.actionType))?.id,
    before: catalog.prerequisites
      .filter((edge) => edge.unlocks === id)
      .map((edge) => {
        const current = levelOf(edge.requires);
        return {
          id: edge.requires,
          name: nameOf(edge.requires),
          atLevel: edge.atLevel,
          ready: current === undefined ? undefined : levelIndex(current) >= levelIndex(edge.atLevel),
        };
      }),
    opens: catalog.prerequisites
      .filter((edge) => edge.requires === id)
      .map((edge) => ({ id: edge.unlocks, name: nameOf(edge.unlocks), atLevel: edge.atLevel })),
    habits: habitsFor(catalog, id),
  };
}
