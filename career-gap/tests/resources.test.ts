import { describe, expect, it } from 'vitest';
import { CATALOG, COMPETENCIES, FIRST_WEB_ROLE, RESOURCES } from '@/catalog';
import { selectResourcesFor, technologyBadge } from '@/domain/resources';
import { buildRoadmapView } from '@/lib/roadmap-view';
import { badgeFor } from '@/lib/tech-badge';
import { generateRoadmap } from '@/domain/roadmap';
import { TECHNOLOGIES } from '@/catalog/technologies';
import type { ActionType, Resource } from '@/domain/model';
import { levelIndex } from '@/domain/model';
import { ALL_FIXTURES } from './fixtures';

/** Recurso mínimo para testar a seleção sem depender do catálogo real. */
const synthetic = (id: string, actionType: ActionType): Resource => ({
  id,
  title: id,
  sourceName: 'teste',
  url: `https://example.org/${id}`,
  kind: 'article',
  actionType,
  competencies: ['x'],
  levelMin: 'L1',
  technology: 'agnostic',
  cost: 'free',
  ptBrStatus: 'complete',
  requiresSignup: false,
  license: 'teste',
  why: 'teste',
  origin: 'canonical',
});

describe('catálogo de recursos', () => {
  it('não repete a mesma URL', () => {
    const urls = RESOURCES.map((resource) => resource.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('aponta apenas para https do detentor dos direitos', () => {
    for (const resource of RESOURCES) {
      expect(resource.url.startsWith('https://'), resource.id).toBe(true);
      // O catálogo guarda link, nunca cópia (ADR-0005).
      expect(/scribd|bibliotecadev|drive\.google|mega\.nz/i.test(resource.url)).toBe(false);
    }
  });

  it('usa apenas tecnologias registradas', () => {
    const known = new Set([...TECHNOLOGIES.map((t) => t.id), 'agnostic']);
    for (const resource of RESOURCES) {
      expect(known.has(resource.technology), `${resource.id}: ${resource.technology}`).toBe(true);
    }
  });

  it('cobre todo requisito do track no nível-alvo', () => {
    for (const requirement of FIRST_WEB_ROLE.requirements) {
      const picked = selectResourcesFor(
        requirement.competency,
        requirement.targetLevel,
        RESOURCES,
      );
      expect(picked.length, requirement.competency).toBeGreaterThan(0);
    }
  });
});

describe('seleção de recursos', () => {
  it('marca exatamente um recomendado e no máximo três itens', () => {
    for (const requirement of FIRST_WEB_ROLE.requirements) {
      const picked = selectResourcesFor(requirement.competency, requirement.targetLevel, RESOURCES);
      expect(picked.length).toBeLessThanOrEqual(3);
      expect(picked.filter((item) => item.recommended)).toHaveLength(1);
    }
  });

  it('é determinística', () => {
    const once = selectResourcesFor('http-fundamentals', 'L2', RESOURCES);
    const twice = selectResourcesFor('http-fundamentals', 'L2', RESOURCES);
    expect(once.map((r) => r.resource.id)).toEqual(twice.map((r) => r.resource.id));
  });

  it('nunca oferece recurso acima do nível-alvo', () => {
    const picked = selectResourcesFor('programming-fundamentals', 'L1', RESOURCES);
    for (const { resource } of picked) expect(resource.levelMin).not.toBe('L2');
  });

  it('abre pelo recurso mais acessível, em ordem pedagógica', () => {
    for (const requirement of FIRST_WEB_ROLE.requirements) {
      const picked = selectResourcesFor(requirement.competency, requirement.targetLevel, RESOURCES);
      const levels = picked.map((item) => item.resource.levelMin);
      expect([...levels].sort(), requirement.competency).toEqual(levels);
    }
  });

  it('nunca abre uma competência por um item de prática', () => {
    // Praticar antes de aprender é a inversão que a regra do exemplo trabalhado desfaz.
    for (const requirement of FIRST_WEB_ROLE.requirements) {
      const [first, ...rest] = selectResourcesFor(
        requirement.competency,
        requirement.targetLevel,
        RESOURCES,
      );
      const teaches = ['READ', 'WATCH', 'LEARN'];
      const anyTeaching = [first, ...rest].some((item) => teaches.includes(item.resource.actionType));
      if (anyTeaching) {
        expect(teaches, `${requirement.competency} abre com prática`).toContain(
          first.resource.actionType,
        );
      }
    }
  });

  it('mostra prática em toda ficha cuja competência tem prática no nível-alvo', () => {
    // O teto de três com "quem ensina primeiro" escondia 19 das 24 práticas elegíveis.
    const practice = new Set(['BUILD', 'PROVE']);
    for (const requirement of FIRST_WEB_ROLE.requirements) {
      const exists = RESOURCES.some(
        (resource) =>
          resource.competencies.includes(requirement.competency) &&
          practice.has(resource.actionType) &&
          levelIndex(resource.levelMin) <= levelIndex(requirement.targetLevel),
      );
      if (!exists) continue;
      const picked = selectResourcesFor(requirement.competency, requirement.targetLevel, RESOURCES);
      expect(
        picked.some((item) => practice.has(item.resource.actionType)),
        `${requirement.competency} esconde a prática`,
      ).toBe(true);
    }
  });

  it('cede a última vaga de estudo para a prática, que continua vindo depois', () => {
    const study = ['a', 'b', 'c', 'd'].map((id) => synthetic(id, 'READ'));
    const picked = selectResourcesFor('x', 'L1', [...study, synthetic('z', 'BUILD')]);
    expect(picked.map((item) => item.resource.id)).toEqual(['a', 'b', 'z']);
    expect(picked[0].recommended).toBe(true);
  });

  it('escolhe a prática do nível-alvo, que exercita o critério de saída mostrado na ficha', () => {
    const atLevel = (id: string, actionType: ActionType, levelMin: 'L1' | 'L2'): Resource => ({
      ...synthetic(id, actionType),
      levelMin,
    });
    const picked = selectResourcesFor('x', 'L2', [
      atLevel('a', 'READ', 'L1'),
      atLevel('b', 'READ', 'L1'),
      atLevel('facil', 'BUILD', 'L1'),
      atLevel('alvo', 'BUILD', 'L2'),
    ]);
    expect(picked.map((item) => item.resource.id)).toEqual(['a', 'b', 'alvo']);
  });

  it('não reserva vaga de prática quando só cabe um recurso', () => {
    const picked = selectResourcesFor('x', 'L1', [synthetic('a', 'READ'), synthetic('z', 'BUILD')], 1);
    expect(picked.map((item) => item.resource.id)).toEqual(['a']);
  });

  it('nunca vaza nota interna de curadoria no lugar de referência de trecho', () => {
    for (const resource of RESOURCES) {
      if (!resource.chapters) continue;
      expect(/n[ãa]o mapear|confirmad|TODO/i.test(resource.chapters), resource.id).toBe(false);
      expect(resource.chapters.length).toBeLessThan(161);
    }
  });

  it('prefere português quando existe alternativa equivalente', () => {
    const picked = selectResourcesFor('http-fundamentals', 'L2', RESOURCES);
    expect(picked[0].resource.ptBrStatus).toBe('complete');
  });

  it('acompanha o recomendado de razões estruturadas, não de prosa', () => {
    for (const requirement of FIRST_WEB_ROLE.requirements) {
      const [top] = selectResourcesFor(requirement.competency, requirement.targetLevel, RESOURCES);
      expect(top.reasons.length).toBeGreaterThan(0);
    }
  });
});

describe('selo de tecnologia', () => {
  it('exige mais de um recurso para afirmar a tecnologia', () => {
    // Um único recurso marcado como git fazia "Comunicação técnica" virar "com Git".
    const single = [{ resource: RESOURCES[0], recommended: true, reasons: [] as never[] }];
    const badge = technologyBadge(single);
    expect(badge).toBeUndefined();
  });

  it('aplica a regra de redundância também na condição A do experimento', () => {
    // A condição A já exibiu "HTML semântico — com HTML" por chamar technologyBadge direto.
    // O selo das duas condições precisa sair do mesmo caminho.
    for (const requirement of FIRST_WEB_ROLE.requirements) {
      const competency = COMPETENCIES.find((c) => c.id === requirement.competency)!;
      const picked = selectResourcesFor(requirement.competency, requirement.targetLevel, RESOURCES);
      const badge = badgeFor(picked, competency.name);
      if (!badge) continue;

      const tech = TECHNOLOGIES.find((t) => t.id === badge)!;
      expect(
        competency.name.toLowerCase().includes(tech.name.toLowerCase()),
        `${competency.id} + ${tech.name}`,
      ).toBe(false);
    }
  });

  it('nunca repete no selo uma tecnologia já presente no nome da competência', () => {
    const names = new Map(COMPETENCIES.map((c) => [c.id, c.name.toLowerCase()]));
    const techNames = new Map(TECHNOLOGIES.map((t) => [t.id, t.name.toLowerCase()]));

    for (const profile of ALL_FIXTURES) {
      const view = buildRoadmapView(generateRoadmap(profile, CATALOG), CATALOG);
      for (const node of view.nodes) {
        if (!node.techBadge) continue;
        const tech = techNames.get(node.techBadge);
        expect(names.get(node.id)?.includes(tech ?? '###'), `${node.id} + ${tech}`).toBe(false);
      }
    }
  });
});

describe('ficha do nó', () => {
  it('entrega recursos e critério de saída em todo item recomendado', () => {
    for (const profile of ALL_FIXTURES) {
      const view = buildRoadmapView(generateRoadmap(profile, CATALOG), CATALOG);
      const focus = view.nodes.find((node) => node.status === 'now');
      if (!focus) continue;
      expect(focus.resources.length, `${profile.id}: foco sem recursos`).toBeGreaterThan(0);
      expect(focus.exitCriteria.length, `${profile.id}: foco sem critério`).toBeGreaterThan(0);
    }
  });

  it('mostra os mesmos recursos nas duas condições do experimento', () => {
    // A condição A usa o nível-alvo do TRACK; a B também. Se a seleção dependesse do nível
    // do usuário, os conjuntos divergiriam e o experimento mediria curadoria, não
    // personalização (docs/DECISOES.md §1).
    const requirement = FIRST_WEB_ROLE.requirements.find((r) => r.competency === 'sql-basics')!;
    const baseline = selectResourcesFor(requirement.competency, requirement.targetLevel, RESOURCES);

    for (const profile of ALL_FIXTURES) {
      const view = buildRoadmapView(generateRoadmap(profile, CATALOG), CATALOG);
      const node = view.nodes.find((n) => n.id === 'sql-basics');
      if (!node || node.status === 'met') continue;
      expect(node.resources.map((r) => r.resource.id)).toEqual(
        baseline.map((r) => r.resource.id),
      );
    }
  });
});
