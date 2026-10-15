import { describe, expect, it } from 'vitest';
import { CATALOG } from '@/catalog';
import { generateRoadmap } from '@/domain/roadmap';
import { buildRoadmapView } from '@/lib/roadmap-view';
import { almostReady, absoluteBeginner, selfTaughtFrontend } from './fixtures';

const NOW = new Date('2026-09-10T12:00:00.000Z');
const viewOf = (profile: Parameters<typeof generateRoadmap>[0]) =>
  buildRoadmapView(generateRoadmap(profile, CATALOG, { now: NOW }), CATALOG);

describe('modelo de visualização', () => {
  it('marca exatamente um nó como o foco atual', () => {
    const view = viewOf(absoluteBeginner);
    expect(view.nodes.filter((node) => node.status === 'now')).toHaveLength(1);
    expect(view.nowId).toBeDefined();
  });

  it('mantém as competências já atingidas no mapa, para responder "onde estou"', () => {
    const view = viewOf(almostReady);
    const met = view.nodes.filter((node) => node.status === 'met');
    expect(met.length).toBe(19);
    expect(met.map((node) => node.id)).toContain('build-an-application');
  });

  it('só desenha aresta entre nós visíveis', () => {
    for (const profile of [absoluteBeginner, selfTaughtFrontend, almostReady]) {
      const view = viewOf(profile);
      const visible = new Set(view.nodes.map((node) => node.id));
      for (const edge of view.edges) {
        expect(visible.has(edge.source)).toBe(true);
        expect(visible.has(edge.target)).toBe(true);
      }
    }
  });

  it('marca como não satisfeita a aresta que explica um bloqueio', () => {
    const view = viewOf(absoluteBeginner);
    const blocked = view.nodes.find((node) => node.status === 'blocked');
    expect(blocked).toBeDefined();

    const incomingUnmet = view.edges.filter(
      (edge) => edge.target === blocked?.id && edge.unmet,
    );
    expect(incomingUnmet.length).toBeGreaterThan(0);
  });

  it('nunca mostra o mesmo item como recomendado e como adiado', () => {
    const view = viewOf(selfTaughtFrontend);
    const onMap = new Set(view.nodes.map((node) => node.id));
    for (const item of view.notNow) expect(onMap.has(item.id)).toBe(false);
  });
});
