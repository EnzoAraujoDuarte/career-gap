import { describe, expect, it } from 'vitest';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import { generateRoadmap } from '@/domain/roadmap';
import { levelIndex, type Level } from '@/domain/model';
import { validateCatalog } from '@/catalog/validate';
import { answeredStatement, applyAnswer } from '@/lib/quick-assessment';
import { adviseCompetencies, RECOMMENDED_LIMIT } from '@/lib/advice';
import { buildCompetencyView } from '@/lib/competency-view';
import { buildPathView } from '@/lib/path-view';
import { buildRoadmapView } from '@/lib/roadmap-view';
import { ALL_FIXTURES } from './fixtures';

const viewOf = (profile: (typeof ALL_FIXTURES)[number]) =>
  buildRoadmapView(generateRoadmap(profile, CATALOG), CATALOG);
const beginner = ALL_FIXTURES.find((profile) => profile.id === 'fixture-absolute-beginner')!;

describe('camada de direção', () => {
  it('recomenda no máximo três por vez, seguindo o ranking do motor', () => {
    for (const profile of ALL_FIXTURES) {
      const view = viewOf(profile);
      const advice = adviseCompetencies(view);
      const recommended = [...advice].filter(([, item]) => item.kind === 'recommended');
      expect(recommended.length, profile.id).toBeLessThanOrEqual(RECOMMENDED_LIMIT);
      if (view.nowId) expect(advice.get(view.nowId)?.kind, profile.id).toBe('recommended');
    }
  });

  it('dá motivo a toda anotação', () => {
    for (const profile of ALL_FIXTURES) {
      for (const [id, item] of adviseCompetencies(viewOf(profile))) {
        expect(item.reason.trim().length, `${profile.id}:${id}`).toBeGreaterThan(0);
      }
    }
  });

  it('nomeia a base que falta, em vez de trancar', () => {
    const advice = adviseCompetencies(viewOf(beginner));
    const dom = advice.get('dom-and-browser');
    expect(dom?.kind).toBe('missing-base');
    expect(dom?.reason).toContain('HTML semântico');
  });
});

describe('trilha', () => {
  it('mostra conteúdo concreto em toda parada, mesmo no que é "não agora"', () => {
    const path = buildPathView(CATALOG, FIRST_WEB_ROLE, viewOf(beginner));
    const stops = path.levels.flatMap((level) => level.stops);
    expect(stops).toHaveLength(FIRST_WEB_ROLE.requirements.length);
    for (const stop of stops) expect(stop.start, stop.id).toBeDefined();

    // Antes, "não agora" aparecia riscado e sem recurso nenhum: era o único bloqueio real.
    const ai = stops.find((stop) => stop.id === 'ai-assisted-development-basics')!;
    expect(ai.advice?.kind).toBe('not-now');
    expect(ai.resourceCount).toBeGreaterThan(0);
  });

  it('é a mesma para todos; só as anotações mudam', () => {
    const content = (profile?: (typeof ALL_FIXTURES)[number]) =>
      buildPathView(CATALOG, FIRST_WEB_ROLE, profile && viewOf(profile)).levels.map((level) =>
        level.stops.map((stop) => [stop.id, stop.start?.id, stop.practice?.id]),
      );
    for (const profile of ALL_FIXTURES) expect(content(profile), profile.id).toEqual(content());
  });

  it('marca "você está aqui" na primeira parada que ainda pede estudo', () => {
    const path = buildPathView(CATALOG, FIRST_WEB_ROLE, viewOf(beginner));
    expect(path.recommended[0].id).toBe('programming-fundamentals');
    expect(path.hereId).toBe('programming-fundamentals');
    expect(path.hereLevelId).toBe('fundamentals');

    // O que a pessoa já sabe ou pode deixar para depois fica para trás; uma lacuna no primeiro
    // nível segura o "você está aqui" ali, mesmo que o ranking recomende algo mais adiante.
    for (const profile of ALL_FIXTURES) {
      const view = buildPathView(CATALOG, FIRST_WEB_ROLE, viewOf(profile));
      const stops = view.levels.flatMap((level) => level.stops);
      const index = stops.findIndex((stop) => stop.id === view.hereId);
      const behind = index < 0 ? stops : stops.slice(0, index);
      for (const stop of behind) expect(['met', 'not-now'], profile.id).toContain(stop.advice?.kind);
    }
  });

  it('não anota nada sem perfil', () => {
    const path = buildPathView(CATALOG, FIRST_WEB_ROLE);
    expect(path.recommended).toEqual([]);
    expect(path.hereId).toBeUndefined();
    expect(path.levels.flatMap((level) => level.stops).every((stop) => !stop.advice)).toBe(true);
  });

  it('concorda com a página da competência no "comece aqui" e na contagem de recursos', () => {
    const path = buildPathView(CATALOG, FIRST_WEB_ROLE);
    for (const stop of path.levels.flatMap((level) => level.stops)) {
      const page = buildCompetencyView(CATALOG, FIRST_WEB_ROLE, stop.id)!;
      expect(page.startId, stop.id).toBe(stop.start?.id);
      expect(page.learn.length + page.practice.length + page.prove.length, stop.id).toBe(
        stop.resourceCount,
      );
    }
  });

  it('mostra a base que falta como caminho de volta, não como cadeado', () => {
    const page = buildCompetencyView(CATALOG, FIRST_WEB_ROLE, 'dom-and-browser', viewOf(beginner))!;
    expect(page.advice?.kind).toBe('missing-base');
    expect(page.before.map((item) => [item.id, item.ready])).toEqual([
      ['html-semantics', false],
      ['javascript-essentials', false],
    ]);
    expect(page.learn.length).toBeGreaterThan(0);
  });

  it('põe cada livro num só nível e deixa fora da trilha o que o track não exige', () => {
    const path = buildPathView(CATALOG, FIRST_WEB_ROLE);
    const books = path.levels.flatMap((level) => level.books.map((book) => book.id));
    expect(new Set(books).size).toBe(books.length);
    expect(path.outside.map((item) => item.id)).toContain('container-orchestration');
  });
});

describe('avaliação rápida', () => {
  const questions = FIRST_WEB_ROLE.quickAssessment;
  const answerAll = (pick: (question: (typeof questions)[number]) => number | undefined) =>
    questions.reduce<Record<string, Level>>(
      (levels, question) => applyAnswer(FIRST_WEB_ROLE, levels, question, pick(question)),
      {},
    );

  it('cabe em seis perguntas e nunca passa do alvo do track', () => {
    expect(questions).toHaveLength(6);
    const target = new Map(FIRST_WEB_ROLE.requirements.map((item) => [item.competency, item.targetLevel]));
    const all = answerAll((question) => question.statements.length - 1);
    for (const [competency, level] of Object.entries(all)) {
      expect(levelIndex(level), competency).toBeLessThanOrEqual(levelIndex(target.get(competency)!));
    }
  });

  it('só declara depuração — e portanto só aproxima a IA — para quem programa sozinho', () => {
    const tutorial = answerAll(() => 0);
    expect(tutorial['debugging']).toBe('L0');
    const roadmap = generateRoadmap(
      { id: 't', trackId: FIRST_WEB_ROLE.id, competencies: toProfile(tutorial) },
      CATALOG,
    );
    expect(roadmap.excluded.map((item) => item.competency)).toContain('ai-assisted-development-basics');
  });

  it('reescreve a resposta anterior em vez de acumular', () => {
    const programming = questions.find((question) => question.id === 'programming')!;
    const high = applyAnswer(FIRST_WEB_ROLE, {}, programming, 1);
    const lowered = applyAnswer(FIRST_WEB_ROLE, high, programming, 0);
    expect(lowered['debugging']).toBe('L0');
    expect(lowered['programming-fundamentals']).toBe('L1');
    expect(answeredStatement(FIRST_WEB_ROLE, lowered, programming)).toBe(0);
    expect(answeredStatement(FIRST_WEB_ROLE, high, programming)).toBe(1);
  });

  it('rejeita competência declarada em duas perguntas', () => {
    const [first, second, ...rest] = questions;
    const duplicated = {
      ...first,
      statements: first.statements.map((statement) => ({
        ...statement,
        competencies: [...statement.competencies, second.statements[0].competencies[0]],
      })),
    };
    const catalog = {
      ...CATALOG,
      tracks: new Map([[FIRST_WEB_ROLE.id, { ...FIRST_WEB_ROLE, quickAssessment: [duplicated, second, ...rest] }]]),
    };
    expect(validateCatalog(catalog).map((problem) => problem.rule)).toContain('quick-unique');
  });
});

const toProfile = (levels: Record<string, Level>) =>
  Object.entries(levels)
    .filter(([, level]) => level !== 'L0')
    .map(([competency, level]) => ({ competency, level, evidence: 'self-report' as const }));
