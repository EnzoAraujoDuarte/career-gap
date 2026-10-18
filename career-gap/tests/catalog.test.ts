import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { CATALOG, COMPETENCIES, FIRST_WEB_ROLE, PREREQUISITES } from '@/catalog';
import { validateCatalog } from '@/catalog/validate';
import { PrerequisiteGraph } from '@/domain/graph';

describe('invariantes do catálogo', () => {
  it('não viola nenhuma regra estrutural nem de proveniência', () => {
    // Falha aqui significa catálogo indefensável, não teste quebrado.
    expect(validateCatalog(CATALOG)).toEqual([]);
  });
});

/**
 * As regras abaixo passam no catálogo real; estes testes provam que elas FALHAM quando
 * deveriam. Sem isso, uma regra que nunca dispara é indistinguível de uma regra correta.
 */
describe('regras de suficiência e de hábitos', () => {
  const rulesOf = (catalog: typeof CATALOG) =>
    validateCatalog(catalog).map((problem) => `${problem.rule} ${problem.subject}`);

  it('rejeita competência core sem prática no nível-alvo', () => {
    const withoutPractice = {
      ...CATALOG,
      resources: CATALOG.resources.filter(
        (resource) =>
          !(resource.competencies.includes('debugging') && resource.actionType === 'BUILD'),
      ),
    };
    expect(rulesOf(withoutPractice)).toContain('practice-coverage first-web-role:debugging');
  });

  it('rejeita trilha que põe um pré-requisito depois do que ele destrava', () => {
    const [first, second, ...rest] = FIRST_WEB_ROLE.path;
    const swapped = {
      ...CATALOG,
      tracks: new Map([[FIRST_WEB_ROLE.id, { ...FIRST_WEB_ROLE, path: [second, first, ...rest] }]]),
    };
    expect(rulesOf(swapped)).toContain(
      'path-order first-web-role:programming-fundamentals -> javascript-essentials',
    );
  });

  it('rejeita trilha que deixa exigência do track de fora', () => {
    const [first, ...rest] = FIRST_WEB_ROLE.path;
    const shortened = {
      ...CATALOG,
      tracks: new Map([
        [
          FIRST_WEB_ROLE.id,
          {
            ...FIRST_WEB_ROLE,
            path: [{ ...first, competencies: first.competencies.slice(1) }, ...rest],
          },
        ],
      ]),
    };
    expect(rulesOf(shortened)).toContain('path-coverage first-web-role:programming-fundamentals');
  });

  it('rejeita nota de curador com código interno em texto exibido', () => {
    const [first, ...rest] = CATALOG.resources;
    const leaked = {
      ...CATALOG,
      resources: [{ ...first, chapters: 'módulo C atende dom-and-browser L1' }, ...rest],
    };
    expect(rulesOf(leaked)).toContain(`resource-text ${first.id}`);
  });

  it('exige enunciado em toda missão', () => {
    const mission = CATALOG.resources.find((resource) => resource.origin === 'mission')!;
    const broken = {
      ...CATALOG,
      resources: CATALOG.resources.map((resource) =>
        resource === mission ? { ...resource, task: undefined } : resource,
      ),
    };
    expect(rulesOf(broken)).toContain(`mission-task ${mission.id}`);
  });

  it('rejeita mais de três hábitos na mesma ficha', () => {
    const extra = { ...CATALOG.habits[0], id: 'extra', competencies: ['debugging'] };
    expect(rulesOf({ ...CATALOG, habits: [...CATALOG.habits, extra] })).toContain(
      'habit-limit debugging',
    );
  });

  it('rejeita hábito apoiado numa só classe de fonte', () => {
    const habit = CATALOG.habits[0];
    const weak = { ...habit, sources: habit.sources.slice(0, 1) };
    const catalog = {
      ...CATALOG,
      habits: CATALOG.habits.map((item) => (item === habit ? weak : item)),
    };
    expect(rulesOf(catalog)).toContain(`provenance ${habit.id}`);
  });

  it('põe a IA como tutora já na primeira competência do mapa', () => {
    // Decisão de 2026-10-15: IA desde o começo, mas pedindo explicação, não solução.
    const tutor = CATALOG.habits.find((habit) => habit.id === 'ai-as-tutor');
    expect(tutor?.competencies).toContain('programming-fundamentals');
  });
});

describe('invariantes do catálogo — estrutura', () => {

  it('mantém ids únicos', () => {
    const ids = COMPETENCIES.map((competency) => competency.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('exige exatamente as competências do track e mantém as de horizonte fora dele', () => {
    const required = new Set(FIRST_WEB_ROLE.requirements.map((item) => item.competency));
    const horizon = COMPETENCIES.filter((competency) => competency.domain === 'horizon');

    // 26 desde a competência de interface com componentes (docs/COMPARACAO-CURRICULOS.md §4).
    expect(required.size).toBe(26);
    expect(horizon.length).toBeGreaterThanOrEqual(3);
    for (const competency of horizon) {
      expect(required.has(competency.id)).toBe(false);
    }
  });

  it('mantém o grafo de pré-requisitos acíclico e esparso', () => {
    const graph = new PrerequisiteGraph(PREREQUISITES);
    expect(graph.findCycle()).toBeUndefined();

    // Um grafo dense seria opinião disfarçada de estrutura (ADR-0001).
    const requiredCount = FIRST_WEB_ROLE.requirements.length;
    expect(PREREQUISITES.length).toBeLessThan(requiredCount * 2);
  });

  it('registra justificativa em toda aresta', () => {
    for (const edge of PREREQUISITES) {
      expect(edge.rationale.length).toBeGreaterThan(20);
    }
  });

  it('escreve todo descritor de nível como frase observável em primeira pessoa', () => {
    const forbidden = /\b(conhece|sabe sobre|tem conhecimento|entende bem)\b/i;
    for (const competency of COMPETENCIES) {
      for (const [level, descriptor] of Object.entries(competency.levels)) {
        expect(
          forbidden.test(descriptor.canDo),
          `${competency.id}@${level} usa formulação vaga: "${descriptor.canDo}"`,
        ).toBe(false);
      }
    }
  });
});

describe('ordem curada dos vídeos', () => {
  it('recusa posição numa competência que o recurso não lista e posição repetida', () => {
    const [video, other] = CATALOG.resources.filter((resource) => resource.featured?.['sql-basics']);
    const rules = (resources: typeof CATALOG.resources) => validateCatalog({ ...CATALOG, resources }).map((problem) => problem.rule);
    const swap = (changed: (typeof CATALOG.resources)[number]) =>
      CATALOG.resources.map((resource) => (resource.id === changed.id ? changed : resource));
    expect(rules(CATALOG.resources)).not.toContain('resource-featured');
    expect(rules(swap({ ...video, featured: { 'css-layout': 1 } }))).toContain('resource-featured');
    expect(rules(swap({ ...other, featured: { 'sql-basics': video.featured!['sql-basics'] } }))).toContain('resource-featured');
  });

  it('põe os vídeos de cada competência do mais novo para o mais antigo, e recusa o contrário', () => {
    const curated = new Map<string, { position: number; published: string }[]>();
    for (const resource of CATALOG.resources) {
      for (const [competency, position] of Object.entries(resource.featured ?? {})) {
        curated.set(competency, [...(curated.get(competency) ?? []), { position, published: resource.published! }]);
      }
    }
    for (const [competency, items] of curated) {
      const dates = [...items].sort((a, b) => a.position - b.position).map((item) => item.published);
      expect(dates, competency).toEqual([...dates].sort().reverse());
    }
    const [newest] = CATALOG.resources.filter((resource) => resource.featured?.['sql-basics'] === 1);
    const older = { ...newest, published: '2000-01-01' };
    const rules = validateCatalog({ ...CATALOG, resources: CATALOG.resources.map((r) => (r.id === newest.id ? older : r)) }).map((p) => p.rule);
    expect(rules).toContain('resource-featured-order');
  });
});

describe('livros', () => {
  // Só a página do detentor dos direitos (ADR-0005): editora, nunca loja nem cópia.
  const RETAILERS = /amazon\.|mercadolivre|submarino|americanas|magazineluiza|estantevirtual|\.pdf$/i;

  it('os de carreira apontam para a editora, por https, sem repetir', async () => {
    const { CAREER_BOOKS } = await import('@/catalog/career-books');
    expect(CAREER_BOOKS.length).toBeGreaterThan(0);
    expect(new Set(CAREER_BOOKS.map((book) => book.id)).size).toBe(CAREER_BOOKS.length);
    for (const book of CAREER_BOOKS) {
      expect(book.url, book.id).toMatch(/^https:\/\//);
      expect(book.url, book.id).not.toMatch(RETAILERS);
      expect(book.why.length, book.id).toBeGreaterThan(40);
    }
  });

  it('nenhum livro do catálogo aponta para loja', () => {
    for (const book of CATALOG.resources.filter((resource) => resource.kind === 'book')) {
      expect(book.url, book.id).not.toMatch(RETAILERS);
    }
  });

  it('os de depois da primeira vaga ficam fora da estrada', () => {
    // Microsserviços e system design não têm estação: o livro aparece só no Explorar, com "não agora".
    const onThePath = new Set(FIRST_WEB_ROLE.requirements.map((requirement) => requirement.competency));
    const later = CATALOG.resources.filter(
      (resource) => resource.kind === 'book' && resource.competencies.every((id) => !onThePath.has(id)),
    );
    expect(later.length).toBeGreaterThan(0);
    for (const book of later) {
      for (const id of book.competencies) expect(CATALOG.competencies.has(id), `${book.id} → ${id}`).toBe(true);
    }
  });
});

describe('versão do catálogo', () => {
  /**
   * O conteúdo que cada versão descreve. Uma resposta da pesquisa grava `CATALOG_VERSION` para
   * dizer qual catálogo a pessoa viu; em 2026-10-17 o catálogo mudou três vezes (vídeo de
   * abertura, ordem dos vídeos, livros) sem a versão mudar, e as respostas apontariam para um
   * catálogo que não existia mais.
   */
  const FINGERPRINT = { version: '2026.10.17-1', sha256: '382ebaddee5f742f037239103511ddf966a46680f8c183a06a8564f967172a52' };

  it('muda quando o conteúdo muda', () => {
    const { version, ...content } = CATALOG;
    const sha256 = createHash('sha256')
      .update(JSON.stringify(content, (_key, value: unknown) => (value instanceof Map ? [...value.entries()] : value)))
      .digest('hex');
    expect(
      { version, sha256 },
      'O conteúdo do catálogo mudou: suba CATALOG_VERSION em src/catalog/index.ts e registre aqui a versão e a nova impressão.',
    ).toEqual(FINGERPRINT);
  });
});
