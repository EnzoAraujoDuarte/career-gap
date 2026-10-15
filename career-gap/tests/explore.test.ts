import { describe, expect, it } from 'vitest';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import { generateRoadmap } from '@/domain/roadmap';
import { buildExplore, contentTypeOf, creatorOf } from '@/lib/explore-view';
import { buildRoadmapView } from '@/lib/roadmap-view';
import { ALL_FIXTURES } from './fixtures';

const beginner = ALL_FIXTURES.find((profile) => profile.id === 'fixture-absolute-beginner')!;
const beginnerView = buildRoadmapView(generateRoadmap(beginner, CATALOG), CATALOG);
const explore = (filters = {}, view = beginnerView) => buildExplore(CATALOG, FIRST_WEB_ROLE, view, filters);

describe('explorar', () => {
  it('mostra o catálogo inteiro sem filtro, com ou sem perfil', () => {
    expect(explore().items).toHaveLength(CATALOG.resources.length);
    expect(buildExplore(CATALOG, FIRST_WEB_ROLE, undefined, {}).items).toHaveLength(CATALOG.resources.length);
  });

  it('conta cada opção sobre os outros filtros: o número é o que aparece ao clicar', () => {
    const base = { ptBr: true };
    const view = explore(base);
    for (const facet of view.facets.type) {
      expect(explore({ ...base, type: facet.value }).items, facet.value).toHaveLength(facet.count);
    }
    for (const facet of view.facets.competency.slice(0, 5)) {
      expect(explore({ ...base, competency: facet.value }).items, facet.value).toHaveLength(facet.count);
    }
  });

  it('põe o recomendado agora no topo e deixa o "não agora" visível, não escondido', () => {
    const items = explore().items;
    expect(items[0].advice?.kind).toBe('recommended');
    const notNow = explore({ advice: 'not-now' }).items;
    expect(notNow.length).toBeGreaterThan(0);
    expect(notNow.some((item) => item.resource.competencies.includes('ai-assisted-development-basics'))).toBe(true);
  });

  it('não oferece filtro de direção sem perfil', () => {
    expect(buildExplore(CATALOG, FIRST_WEB_ROLE, undefined, {}).facets.advice).toEqual([]);
  });

  it('acha por busca sem acento e sem caixa', () => {
    const found = explore({ query: 'GUANABARA' }).items;
    expect(found.length).toBeGreaterThan(0);
    expect(explore({ query: 'programacao' }).items.length).toBeGreaterThan(0);
  });

  it('separa prática, prova e livro do que é para aprender', () => {
    const at = (actionType: string, kind = 'video') => contentTypeOf({ actionType, kind } as never);
    expect(at('WATCH')).toBe('learn');
    expect(at('BUILD', 'exercise')).toBe('practice');
    expect(at('PROVE', 'exercise')).toBe('prove');
    expect(at('READ', 'book')).toBe('book');
  });

  it('junta o mesmo criador escrito de dois jeitos', () => {
    const named = (sourceName: string) => creatorOf({ sourceName } as never);
    expect(named('cursoemvideo.com')).toBe(named('Gustavo Guanabara (Curso em Vídeo)'));
    const guanabara = explore().facets.creator.find((facet) => facet.value === named('cursoemvideo.com'));
    expect(guanabara?.count).toBeGreaterThanOrEqual(10);
  });
});

describe('ordem do explorar', () => {
  it('começa cada competência pelo mesmo "comece aqui" da trilha', () => {
    const items = explore().items;
    expect(items[0].startHere).toBe(true);
    const fundamentals = items.filter((item) => item.resource.competencies[0] === 'programming-fundamentals');
    expect(fundamentals[0].startHere).toBe(true);
    expect(fundamentals.filter((item) => item.startHere)).toHaveLength(1);
  });
});
