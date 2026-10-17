import type { Catalog } from '@/domain/roadmap';
import type { Build, CareerTrack, CompetencyId, Level, PathLevel, PortfolioFacet, UserProfile } from '@/domain/model';
import { PORTFOLIO_FACETS } from '@/domain/model';
import { assessBuilds, type BuildAssessment, type BuildStatus } from '@/domain/builds';
import { buildProgressKey, type ProgressMap } from './user-state';

/**
 * As construções da trilha, avaliadas contra o perfil e o progresso: o que a pessoa já
 * consegue fazer, o que fica a um passo e o que cada competência destrava.
 *
 * Sem perfil, nada é anotado além da porta de entrada, que não exige nada: é o que a pessoa
 * vê no primeiro acesso.
 */

export interface BuildView extends BuildAssessment {
  readonly level: PathLevel;
  readonly levelNumber: number;
  readonly missingNames: readonly { readonly id: CompetencyId; readonly name: string; readonly level: Level }[];
}

export interface BuildsView {
  readonly all: readonly BuildView[];
  readonly doorway: BuildView;
  readonly ready: readonly BuildView[];
  readonly oneAway: readonly BuildView[];
  readonly built: readonly BuildView[];
  readonly byLevel: ReadonlyMap<string, readonly BuildView[]>;
  /** Construções em que a competência é a única exigência que falta. */
  readonly unlockedBy: ReadonlyMap<CompetencyId, readonly BuildView[]>;
}

export function buildBuildsView(
  catalog: Catalog,
  track: CareerTrack,
  profile?: UserProfile | null,
  progress?: ProgressMap | null,
): BuildsView {
  const levelOf = (competency: CompetencyId): Level =>
    profile?.competencies.find((item) => item.competency === competency)?.level ?? 'L0';
  const isBuilt = (id: string) => Boolean(progress?.[buildProgressKey(id)]?.completedAt);
  const nameOf = (id: CompetencyId) => catalog.competencies.get(id)?.name ?? id;

  const all = assessBuilds(catalog.builds, { levelOf, isBuilt }).map((item): BuildView => {
    const index = track.path.findIndex((level) => level.id === item.build.levelId);
    return {
      ...item,
      // Sem perfil, a avaliação é a de quem não sabe nada ainda; só a porta de entrada aparece
      // como pronta, e o resto fica sem anotação em vez de "falta tudo".
      status: profile ? item.status : item.build.requires.length === 0 ? 'ready' : 'later',
      level: track.path[index],
      levelNumber: index + 1,
      missingNames: item.missing.map((missing) => ({
        id: missing.competency,
        name: nameOf(missing.competency),
        level: missing.level,
      })),
    };
  });

  const withStatus = (status: BuildStatus) => all.filter((item) => item.status === status);
  const byLevel = new Map<string, BuildView[]>();
  const unlockedBy = new Map<CompetencyId, BuildView[]>();
  for (const item of all) {
    byLevel.set(item.build.levelId, [...(byLevel.get(item.build.levelId) ?? []), item]);
    if (profile && item.status === 'one-away') {
      const competency = item.missing[0].competency;
      unlockedBy.set(competency, [...(unlockedBy.get(competency) ?? []), item]);
    }
  }

  return {
    all,
    doorway: all.find((item) => item.build.requires.length === 0)!,
    ready: withStatus('ready'),
    oneAway: withStatus('one-away'),
    built: withStatus('built'),
    byLevel,
    unlockedBy,
  };
}

export const findBuild = (catalog: Catalog, id: string): Build | undefined =>
  catalog.builds.find((build) => build.id === id);

/** Uma faceta do portfólio: o que já prova e, se nada ainda, a construção mais perto de provar. */
export interface PortfolioGroup {
  readonly facet: PortfolioFacet;
  readonly built: readonly BuildView[];
  readonly next?: BuildView;
}

const NEXT_ORDER: readonly BuildStatus[] = ['ready', 'one-away', 'later'];

/**
 * O portfólio pelo que cada construção prova. Variedade é a régua: quem contrata pergunta
 * "você já fez back-end? e design?", e a resposta tem de ser uma coisa que dá para abrir.
 * Nada aqui tranca: é anotação do que falta mostrar, com a construção mais perto apontada.
 */
export function portfolioView(view: BuildsView): readonly PortfolioGroup[] {
  return PORTFOLIO_FACETS.map((facet) => {
    const proving = view.all.filter((item) => item.build.shows.includes(facet));
    const built = proving.filter((item) => item.status === 'built');
    const next = NEXT_ORDER.map((status) => proving.find((item) => item.status === status)).find(Boolean);
    return { facet, built, next: built.length > 0 ? undefined : next };
  });
}
