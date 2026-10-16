import { describe, expect, it } from 'vitest';
import { BUILDS, CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import { assessBuilds, buildsInvolving, buildsUnlockedBy } from '@/domain/builds';
import type { Level } from '@/domain/model';
import { buildPrompt, studyPrompt } from '@/lib/ai-prompt';
import { buildProgressKey, assertProgress } from '@/lib/user-state';
import { ALL_FIXTURES, absoluteBeginner, almostReady } from './fixtures';

const levelsOf = (profile: (typeof ALL_FIXTURES)[number]) => (competency: string): Level =>
  profile.competencies.find((item) => item.competency === competency)?.level ?? 'L0';

describe('construções', () => {
  it('quem nunca programou já tem exatamente uma construção pronta: a porta de entrada', () => {
    const ready = assessBuilds(BUILDS, { levelOf: levelsOf(absoluteBeginner) }).filter(
      (item) => item.status === 'ready',
    );
    expect(ready.map((item) => item.build.id)).toEqual(['pagina-sobre-voce']);
    expect(ready[0].build.requires).toEqual([]);
  });

  it('anota o que falta, na ordem declarada, e separa "falta só uma" de "mais adiante"', () => {
    const assessed = assessBuilds(BUILDS, { levelOf: levelsOf(absoluteBeginner) });
    const byId = new Map(assessed.map((item) => [item.build.id, item]));

    const calculator = byId.get('calculadora-de-parcelas')!;
    expect(calculator.status).toBe('one-away');
    expect(calculator.missing).toEqual([{ competency: 'programming-fundamentals', level: 'L1', currentLevel: 'L0' }]);

    const api = byId.get('sua-propria-api')!;
    expect(api.status).toBe('later');
    expect(api.missing.map((item) => item.competency)).toEqual(['api-development', 'sql-basics', 'http-fundamentals']);
  });

  it('quem está quase pronto tem a maioria das construções ao alcance, e nenhuma delas é um cadeado', () => {
    const assessed = assessBuilds(BUILDS, { levelOf: levelsOf(almostReady) });
    const ready = assessed.filter((item) => item.status === 'ready');
    expect(ready.length).toBeGreaterThanOrEqual(BUILDS.length / 2);
    // Toda construção continua na lista, com motivo; o status só anota (ADR-0009).
    expect(assessed).toHaveLength(BUILDS.length);
    for (const item of assessed) expect(item.status === 'ready' || item.missing.length > 0).toBe(true);
  });

  it('diz o que cada competência destrava sozinha e em que construções ela entra', () => {
    const assessed = assessBuilds(BUILDS, { levelOf: levelsOf(absoluteBeginner) });
    expect(buildsUnlockedBy(assessed, 'programming-fundamentals').map((item) => item.build.id)).toEqual([
      'calculadora-de-parcelas',
    ]);
    expect(buildsUnlockedBy(assessed, 'sql-basics')).toEqual([]);
    expect(buildsInvolving(BUILDS, 'html-semantics').map((build) => build.id)).toContain('pagina-sobre-voce');
    expect(buildsInvolving(BUILDS, 'microservices-architecture')).toEqual([]);
  });

  it('marca como construída a que a pessoa concluiu, acima de qualquer exigência', () => {
    const assessed = assessBuilds(BUILDS, {
      levelOf: levelsOf(absoluteBeginner),
      isBuilt: (id) => id === 'sua-propria-api',
    });
    expect(assessed.find((item) => item.build.id === 'sua-propria-api')?.status).toBe('built');
  });

  it('cada nível da trilha fecha com pelo menos uma construção, na ordem da trilha', () => {
    for (const level of FIRST_WEB_ROLE.path) {
      expect(BUILDS.some((build) => build.levelId === level.id), level.id).toBe(true);
    }
    // A primeira construção de cada nível não pode exigir algo que a trilha só ensina depois.
    const position = new Map(
      FIRST_WEB_ROLE.path.flatMap((level, index) => level.competencies.map((competency) => [competency, index] as const)),
    );
    const levelPosition = new Map(FIRST_WEB_ROLE.path.map((level, index) => [level.id, index]));
    for (const build of BUILDS) {
      for (const requirement of build.requires) {
        expect(position.get(requirement.competency)!, `${build.id} <- ${requirement.competency}`).toBeLessThanOrEqual(
          levelPosition.get(build.levelId)!,
        );
      }
    }
  });

  it('o progresso aceita uma construção concluída e recusa uma inventada', () => {
    const at = '2026-10-16T12:00:00.000Z';
    expect(() => assertProgress(buildProgressKey('pagina-sobre-voce'), { completedAt: at, updatedAt: at })).not.toThrow();
    expect(() => assertProgress(buildProgressKey('inventada'), { completedAt: at, updatedAt: at })).toThrow();
    expect(() => assertProgress('pagina-sobre-voce', { completedAt: at, updatedAt: at })).toThrow();
  });
});

describe('prompt para o assistente de IA', () => {
  it('é montado só com dados do catálogo e pede um tutor, não uma solução', () => {
    const competency = CATALOG.competencies.get('http-fundamentals')!;
    const prompt = studyPrompt(competency, 'L0', 'L2');
    expect(prompt).toContain(competency.name);
    for (const criterion of competency.levels.L2!.exitCriteria) expect(prompt).toContain(criterion);
    expect(prompt).toContain('Não me dê a solução pronta');
    expect(prompt).not.toMatch(/\bL[0-4]\b/);
  });

  it('o prompt de uma construção traz o plano e o critério de pronto', () => {
    const build = BUILDS.find((item) => item.id === 'busca-de-cep')!;
    const prompt = buildPrompt(build, ['Consumo de API']);
    for (const step of build.steps) expect(prompt).toContain(step);
    expect(prompt).toContain(build.doneWhen);
    expect(prompt).toContain('Consumo de API');
  });
});
