import { describe, expect, it } from 'vitest';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import { validateCatalog } from '@/catalog/validate';
import type { Resource } from '@/domain/model';
import { selectResourcesFor } from '@/domain/resources';
import { generateRoadmap } from '@/domain/roadmap';
import { buildRoadmapView } from '@/lib/roadmap-view';
import { ALL_FIXTURES } from './fixtures';

const resource = (id: string, technology: Resource['technology'], levelMin: Resource['levelMin'] = 'L1', actionType: Resource['actionType'] = 'LEARN'): Resource =>
  ({
    id,
    title: id,
    sourceName: 'teste',
    url: `https://exemplo.test/${id}`,
    kind: 'course',
    actionType,
    competencies: ['api-development'],
    levelMin,
    technology,
    cost: 'free',
    ptBrStatus: 'complete',
    requiresSignup: false,
    license: 'teste',
    why: 'teste',
    origin: 'canonical',
  }) as Resource;

describe('caminho independente de stack', () => {
  it('o track oferece linguagens com material no catálogo, e o validador recusa uma sem material', () => {
    expect(FIRST_WEB_ROLE.stacks.map((stack) => stack.technology)).toEqual(['node', 'java']);
    const withDjango = {
      ...CATALOG,
      tracks: new Map([[FIRST_WEB_ROLE.id, { ...FIRST_WEB_ROLE, stacks: [...FIRST_WEB_ROLE.stacks, { technology: 'python-django', name: 'Python', why: 'x' }] }]]),
    };
    expect(validateCatalog(withDjango).map((problem) => problem.rule)).toContain('track-stack');
    expect(validateCatalog(CATALOG).map((problem) => problem.rule)).not.toContain('track-stack');
  });

  it('a linguagem escolhida só desempata entre materiais igualmente acessíveis, e diz por quê', () => {
    const pool = [resource('b-node', 'node'), resource('a-java', 'java'), resource('c-agnostico', 'agnostic'), resource('d-node-basico', 'node', 'L0')];
    const ids = (preferred?: string) => selectResourcesFor('api-development', 'L2', pool, Infinity, preferred).map((item) => item.resource.id);
    // Sem escolha: nível primeiro, depois pontuação e id.
    expect(ids()).toEqual(['d-node-basico', 'a-java', 'b-node', 'c-agnostico']);
    // Com Java: o material básico em Node continua primeiro (acessível antes de tudo); entre os de
    // mesmo nível, Java e agnóstico passam à frente do Node.
    expect(ids('java')).toEqual(['d-node-basico', 'a-java', 'c-agnostico', 'b-node']);
    const picked = selectResourcesFor('api-development', 'L2', pool, Infinity, 'java');
    expect(picked.find((item) => item.resource.id === 'a-java')?.reasons).toContain('YOUR_STACK');
    expect(picked.find((item) => item.resource.id === 'b-node')?.reasons).not.toContain('YOUR_STACK');
  });

  it('a escolha não muda competências, ordem nem lacunas: só os materiais', () => {
    const base = ALL_FIXTURES.find((profile) => profile.id === 'fixture-self-taught-frontend')!;
    const plain = generateRoadmap(base, CATALOG);
    const java = generateRoadmap({ ...base, technologyId: 'java' }, CATALOG);
    expect(java.items.map((item) => item.competency)).toEqual(plain.items.map((item) => item.competency));
    expect(java.excluded.map((item) => item.competency)).toEqual(plain.excluded.map((item) => item.competency));
    expect(java.met).toEqual(plain.met);

    const view = buildRoadmapView(java, CATALOG);
    expect(view.technologyId).toBe('java');
    // Em algum nó do mapa há material em Java, e ele leva o motivo; em nenhum nó o conjunto de
    // materiais mudou de tamanho.
    expect(view.nodes.some((node) => node.resources.some((item) => item.reasons.includes('YOUR_STACK')))).toBe(true);
    const plainView = buildRoadmapView(plain, CATALOG);
    for (const node of view.nodes) {
      expect(node.resources.length, node.id).toBe(plainView.nodes.find((other) => other.id === node.id)!.resources.length);
    }
  });
});
