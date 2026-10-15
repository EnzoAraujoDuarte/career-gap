import type { Catalog } from '@/domain/roadmap';
import type { CareerTrack, CompetencyId, Resource } from '@/domain/model';
import { selectResourcesFor } from '@/domain/resources';
import type { RoadmapView } from './roadmap-view';
import { adviseCompetencies, type Advice, type AdviceKind } from './advice';

/**
 * O catálogo inteiro, aberto, como o "All Series" do Laracasts: filtra por tipo, competência,
 * criador, idioma, custo e — com perfil — pela direção. Nada some por causa do perfil; a
 * direção é um filtro que a pessoa escolhe usar, não um que o sistema aplica por ela.
 */

export type ContentType = 'learn' | 'practice' | 'prove' | 'book';

export const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  learn: 'Aprender',
  practice: 'Praticar',
  prove: 'Provar',
  book: 'Livros',
};

export const ADVICE_LABEL: Record<AdviceKind, string> = {
  recommended: 'Recomendado agora',
  'missing-base': 'Falta base',
  'not-now': 'Não agora',
  met: 'Você já sabe',
};

/** Com perfil, o recomendado sobe; o que a pessoa já sabe desce. Sem perfil, vale a trilha. */
const ADVICE_ORDER: Record<AdviceKind | 'none', number> = {
  recommended: 0,
  none: 1,
  'missing-base': 2,
  'not-now': 3,
  met: 4,
};

const TYPE_ORDER: Record<ContentType, number> = { learn: 0, practice: 1, prove: 2, book: 3 };

export const contentTypeOf = (resource: Resource): ContentType =>
  resource.kind === 'book'
    ? 'book'
    : resource.actionType === 'PROVE'
      ? 'prove'
      : resource.actionType === 'BUILD'
        ? 'practice'
        : 'learn';

/**
 * A mesma pessoa ou casa aparece com nomes diferentes no catálogo ("cursoemvideo.com" e
 * "Gustavo Guanabara (Curso em Vídeo)"). Sem unificar, o filtro por criador mostraria a mesma
 * gente duas vezes com contagens erradas.
 */
const CREATOR_ALIASES: Readonly<Record<string, string>> = {
  'cursoemvideo.com': 'Curso em Vídeo · Gustavo Guanabara',
  'Gustavo Guanabara (Curso em Vídeo)': 'Curso em Vídeo · Gustavo Guanabara',
  'MDN Web Docs (Mozilla)': 'MDN (Mozilla)',
  'developer.mozilla.org': 'MDN (Mozilla)',
  'casadocodigo.com.br': 'Casa do Código',
  'web.dev (Google / Chrome team)': 'Google',
  'web.dev': 'Google',
  'Google / Chrome for Developers': 'Google',
  'Chrome for Developers (Google)': 'Google',
  'Google for Developers': 'Google',
  'Google (google/eng-practices)': 'Google',
  'origamid.com': 'Origamid',
  'ev.org.br': 'Fundação Bradesco · Escola Virtual',
  'Missão Career Gap · BrasilAPI': 'Missões Career Gap',
  'Missão Career Gap · Receita Federal': 'Missões Career Gap',
  'freecodecamp.org': 'freeCodeCamp',
  'freeCodeCamp (Richard Reis; tradução de Afonso Branco)': 'freeCodeCamp',
  'Martin Fowler / refactoring.com': 'Martin Fowler',
  'Thoughtworks / Martin Fowler': 'Martin Fowler',
  'Kent C. Dodds': 'Kent C. Dodds',
  'Testing Library (Kent C. Dodds e contribuidores)': 'Kent C. Dodds',
  'alura.com.br': 'Alura',
  '7daysofcode.io': 'Alura',
};

export const creatorOf = (resource: Resource): string =>
  CREATOR_ALIASES[resource.sourceName] ?? resource.sourceName;

/** Abaixo disso o criador é achado pela busca; uma lista de 90 nomes com "1" ao lado é ruído. */
const MIN_CREATOR_ITEMS = 2;

export interface ExploreFilters {
  readonly type?: ContentType;
  readonly competency?: CompetencyId;
  readonly creator?: string;
  readonly advice?: AdviceKind;
  readonly ptBr?: boolean;
  readonly free?: boolean;
  readonly query?: string;
}

export interface ExploreItem {
  readonly resource: Resource;
  readonly type: ContentType;
  readonly creator: string;
  readonly competencies: readonly { readonly id: CompetencyId; readonly name: string }[];
  /** Anotação da competência principal do recurso — a primeira que ele declara. */
  readonly advice?: Advice;
  /** O mesmo "comece aqui" da trilha e da página da competência principal. */
  readonly startHere: boolean;
}

export interface Facet<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly count: number;
}

export interface ExploreView {
  readonly items: readonly ExploreItem[];
  readonly total: number;
  readonly facets: {
    readonly type: readonly Facet<ContentType>[];
    readonly competency: readonly Facet<CompetencyId>[];
    readonly creator: readonly Facet<string>[];
    readonly advice: readonly Facet<AdviceKind>[];
    readonly ptBr: number;
    readonly free: number;
  };
}

/** Busca sem acento e sem caixa: "programacao" acha "Programação". */
const normalize = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function buildExplore(
  catalog: Catalog,
  track: CareerTrack,
  view: RoadmapView | undefined,
  filters: ExploreFilters,
): ExploreView {
  const advice = view ? adviseCompetencies(view) : new Map<CompetencyId, Advice>();
  const pathOrder = new Map(
    track.path.flatMap((level) => level.competencies).map((id, index) => [id, index]),
  );
  const nameOf = (id: CompetencyId) => catalog.competencies.get(id)?.name ?? id;

  // Dentro de uma competência vale a ordem pedagógica do seletor, a mesma da página dela: sem
  // isso, a ordem alfabética punha uma trilha longa e opcional antes do ponto de partida.
  const targetOf = new Map(track.requirements.map((item) => [item.competency, item.targetLevel]));
  const pedagogical = new Map<CompetencyId, readonly string[]>();
  const orderIn = (competency: CompetencyId): readonly string[] => {
    if (!pedagogical.has(competency)) {
      const picked = selectResourcesFor(competency, targetOf.get(competency) ?? 'L1', catalog.resources, Infinity);
      pedagogical.set(competency, picked.map((item) => item.resource.id));
    }
    return pedagogical.get(competency)!;
  };
  const byId = new Map(catalog.resources.map((resource) => [resource.id, resource]));
  const isStudy = (id: string) => contentTypeOf(byId.get(id)!) !== 'practice' && contentTypeOf(byId.get(id)!) !== 'prove';
  const startOf = (competency: CompetencyId) => orderIn(competency).find(isStudy);

  const primaryOf = (resource: Resource) =>
    resource.competencies.find((id) => pathOrder.has(id)) ?? resource.competencies[0];

  const all: ExploreItem[] = catalog.resources.map((resource) => {
    const primary = primaryOf(resource);
    return {
      resource,
      type: contentTypeOf(resource),
      creator: creatorOf(resource),
      competencies: resource.competencies.map((id) => ({ id, name: nameOf(id) })),
      advice: advice.get(primary),
      startHere: startOf(primary) === resource.id,
    };
  });

  const query = filters.query ? normalize(filters.query.trim()) : '';
  const matches = (item: ExploreItem, skip?: keyof ExploreFilters): boolean =>
    (skip === 'type' || !filters.type || item.type === filters.type) &&
    (skip === 'competency' || !filters.competency || item.resource.competencies.includes(filters.competency)) &&
    (skip === 'creator' || !filters.creator || item.creator === filters.creator) &&
    (skip === 'advice' || !filters.advice || item.advice?.kind === filters.advice) &&
    (skip === 'ptBr' || !filters.ptBr || item.resource.ptBrStatus === 'complete') &&
    (skip === 'free' || !filters.free || item.resource.cost !== 'paid') &&
    (!query ||
      normalize(
        [item.resource.title, item.creator, item.resource.sourceName, ...item.competencies.map((c) => c.name)].join(' '),
      ).includes(query));

  // Contagem facetada: cada filtro conta sobre o resultado dos OUTROS filtros, como numa loja —
  // assim o número ao lado da opção é exatamente o que aparece ao clicar nela.
  const countBy = <T extends string>(skip: keyof ExploreFilters, key: (item: ExploreItem) => T[]) => {
    const counts = new Map<T, number>();
    for (const item of all) {
      if (!matches(item, skip)) continue;
      for (const value of key(item)) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return counts;
  };

  const types = countBy('type', (item) => [item.type]);
  const competencies = countBy('competency', (item) => [...item.resource.competencies]);
  const creators = countBy('creator', (item) => [item.creator]);
  const advices = countBy('advice', (item) => (item.advice ? [item.advice.kind] : []));

  const rank = (item: ExploreItem) => ADVICE_ORDER[item.advice?.kind ?? 'none'];
  const position = (item: ExploreItem) => pathOrder.get(primaryOf(item.resource)) ?? Infinity;
  const pedagogicalIndex = (item: ExploreItem) => {
    const index = orderIn(primaryOf(item.resource)).indexOf(item.resource.id);
    return index < 0 ? Infinity : index;
  };
  const items = all
    .filter((item) => matches(item))
    .sort(
      (a, b) =>
        rank(a) - rank(b) ||
        position(a) - position(b) ||
        pedagogicalIndex(a) - pedagogicalIndex(b) ||
        TYPE_ORDER[a.type] - TYPE_ORDER[b.type] ||
        a.resource.title.localeCompare(b.resource.title, 'pt-BR'),
    );

  return {
    items,
    total: all.length,
    facets: {
      type: (Object.keys(CONTENT_TYPE_LABEL) as ContentType[]).map((value) => ({
        value,
        label: CONTENT_TYPE_LABEL[value],
        count: types.get(value) ?? 0,
      })),
      competency: [...pathOrder.keys()].map((value) => ({
        value,
        label: nameOf(value),
        count: competencies.get(value) ?? 0,
      })),
      creator: [...creators]
        .filter(([value, count]) => count >= MIN_CREATOR_ITEMS || value === filters.creator)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR'))
        .map(([value, count]) => ({ value, label: value, count })),
      advice: view
        ? (Object.keys(ADVICE_LABEL) as AdviceKind[]).map((value) => ({
            value,
            label: ADVICE_LABEL[value],
            count: advices.get(value) ?? 0,
          }))
        : [],
      ptBr: all.filter((item) => matches(item, 'ptBr') && item.resource.ptBrStatus === 'complete').length,
      free: all.filter((item) => matches(item, 'free') && item.resource.cost !== 'paid').length,
    },
  };
}
