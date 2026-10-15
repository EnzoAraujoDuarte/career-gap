import type { Catalog } from '@/domain/roadmap';
import type { CareerTrack, CompetencyId, PathLevel, Resource } from '@/domain/model';
import { selectResourcesFor } from '@/domain/resources';
import type { RoadmapView } from './roadmap-view';
import { adviseCompetencies, type Advice } from './advice';
import { estimateMinutes } from './resource-duration';

/**
 * A trilha no formato do Laracasts: níveis, e em cada nível o conteúdo concreto — quem
 * ensina, quanto tempo leva — na ordem sugerida, com os livros como ramo opcional.
 *
 * O conteúdo é o mesmo para todos (recursos do nível-alvo do track, como na ficha). O que é
 * pessoal é só a anotação de cada parada, e só existe quando há perfil.
 */

export interface PathStop {
  readonly id: CompetencyId;
  readonly name: string;
  readonly summary: string;
  /** "Comece aqui": o primeiro recurso na ordem pedagógica do seletor. */
  readonly start?: Resource;
  /** A prática do nível-alvo, a mesma que a ficha garante. */
  readonly practice?: Resource;
  /** Total de recursos no nível-alvo; a página da competência mostra todos. */
  readonly resourceCount: number;
  readonly advice?: Advice;
}

export interface PathLevelView {
  readonly level: PathLevel;
  readonly number: number;
  readonly stops: readonly PathStop[];
  /** Soma do "comece aqui" de cada parada: o caminho mínimo, não o catálogo inteiro. */
  readonly minutes: number;
  /** Livros das competências do nível que não são o "comece aqui" de ninguém. */
  readonly books: readonly Resource[];
}

export interface PathView {
  readonly levels: readonly PathLevelView[];
  /** Recomendado agora, na ordem do ranking do motor. Vazio sem perfil. */
  readonly recommended: readonly PathStop[];
  /** Nível do primeiro recomendado: o "você está aqui". */
  readonly hereLevelId?: string;
  /** Competências do catálogo que o track não exige: o "pode ignorar" permanente. */
  readonly outside: readonly { readonly id: CompetencyId; readonly name: string; readonly reason: string }[];
}

const isPractice = (resource: Resource) =>
  resource.actionType === 'BUILD' || resource.actionType === 'PROVE';

export function buildPathView(
  catalog: Catalog,
  track: CareerTrack,
  view?: RoadmapView,
): PathView {
  const advice = view ? adviseCompetencies(view) : new Map<CompetencyId, Advice>();
  const targetOf = new Map(track.requirements.map((item) => [item.competency, item.targetLevel]));
  const startIds = new Set<string>();
  const shownBooks = new Set<string>();

  const stopOf = (id: CompetencyId): PathStop => {
    const competency = catalog.competencies.get(id);
    const target = targetOf.get(id) ?? 'L1';
    // A mesma seleção da ficha, para a trilha e a ficha nunca discordarem do "comece aqui".
    const card = selectResourcesFor(id, target, catalog.resources);
    const start = card.find((item) => !isPractice(item.resource))?.resource;
    if (start) startIds.add(start.id);
    return {
      id,
      name: competency?.name ?? id,
      summary: competency?.summary ?? '',
      start,
      practice: card.find((item) => isPractice(item.resource))?.resource,
      resourceCount: selectResourcesFor(id, target, catalog.resources, Infinity).length,
      advice: advice.get(id),
    };
  };

  const stopsByLevel = track.path.map((level) => level.competencies.map(stopOf));

  const levels = track.path.map((level, index): PathLevelView => {
    const stops = stopsByLevel[index];
    const books = catalog.resources.filter(
      (resource) =>
        resource.kind === 'book' &&
        !startIds.has(resource.id) &&
        !shownBooks.has(resource.id) &&
        resource.competencies.some((id) => level.competencies.includes(id)),
    );
    // Um livro que serve a dois níveis aparece só no primeiro.
    for (const book of books) shownBooks.add(book.id);
    return {
      level,
      number: index + 1,
      stops,
      minutes: stops.reduce((sum, stop) => sum + (stop.start ? estimateMinutes(stop.start) : 0), 0),
      books,
    };
  });

  const rankOf = new Map(view?.nodes.map((node) => [node.id, node.rank ?? Infinity]) ?? []);
  const recommended = stopsByLevel
    .flat()
    .filter((stop) => stop.advice?.kind === 'recommended')
    .sort((a, b) => (rankOf.get(a.id) ?? Infinity) - (rankOf.get(b.id) ?? Infinity));
  const hereLevelId = recommended[0]
    ? track.path.find((level) => level.competencies.includes(recommended[0].id))?.id
    : undefined;

  const outside = [...catalog.competencies.values()]
    .filter((competency) => !targetOf.has(competency.id))
    .map((competency) => ({ id: competency.id, name: competency.name, reason: competency.summary }));

  return { levels, recommended, hereLevelId, outside };
}
