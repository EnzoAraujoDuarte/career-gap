import { describe, expect, it } from 'vitest';
import { CATALOG, TOOLS } from '@/catalog';
import type { Resource } from '@/domain/model';
import { assessTools } from '@/domain/tools';
import { habitsFor } from '@/lib/roadmap-view';
import { estimateMinutes } from '@/lib/resource-duration';
import { ALL_FIXTURES } from './fixtures';

const beginner = ALL_FIXTURES.find((profile) => profile.id === 'fixture-absolute-beginner')!;

describe('kit de ferramentas', () => {
  it('dá ao iniciante absoluto só o que serve no primeiro dia', () => {
    const ready = assessTools(TOOLS, beginner)
      .filter((item) => item.missing.length === 0)
      .map((item) => item.tool.id);
    expect(ready).toEqual(['vscode', 'git']);
  });

  it('nunca libera ferramenta de IA para quem ainda não depura', () => {
    // A ferramenta não pode chegar antes da competência que a torna segura (Shen e Tamkin, 2026).
    for (const profile of ALL_FIXTURES) {
      const debugs = profile.competencies.some(
        (item) => item.competency === 'debugging' && item.level !== 'L0',
      );
      if (debugs) continue;
      for (const { tool, missing } of assessTools(TOOLS, profile)) {
        if (tool.category === 'ai') expect(missing.length, `${profile.id}: ${tool.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('prende toda ferramenta de IA a depuração ou à competência de IA, que já exige depuração', () => {
    for (const tool of TOOLS.filter((item) => item.category === 'ai')) {
      const gates = tool.unlockedBy.map((gate) => gate.competency);
      expect(
        gates.includes('debugging') || gates.includes('ai-assisted-development-basics'),
        tool.id,
      ).toBe(true);
    }
  });
});

describe('hábitos de postura geral', () => {
  it('ficam fora das fichas e aparecem só na aba de hábitos', () => {
    const general = CATALOG.habits.filter((habit) => habit.competencies.length === 0);
    expect(general.length).toBeGreaterThan(0);
    for (const competency of CATALOG.competencies.keys()) {
      for (const habit of habitsFor(CATALOG, competency)) {
        expect(habit.competencies.length, habit.id).toBeGreaterThan(0);
      }
    }
  });
});

describe('hábitos de carreira', () => {
  it('indicam publicar o que aprendeu, conviver com outros devs e manter currículo e LinkedIn em dia', () => {
    const career = CATALOG.habits.filter((habit) => habit.theme === 'career');
    expect(career.map((habit) => habit.id)).toEqual(['share-what-you-learn', 'kindred-spirits', 'keep-profile-current']);
    for (const habit of career) {
      expect(habit.tradition, habit.id).toBe('apprenticeship-patterns');
      // Aparecem na ficha de uma competência, não só na aba: carreira é parte do estudo.
      expect(habit.competencies.length, habit.id).toBeGreaterThan(0);
    }
  });
});

describe('duração dos recursos', () => {
  const resource = (estimatedTime: string | undefined, kind: Resource['kind'] = 'video') =>
    ({ estimatedTime, kind }) as Resource;

  it.each([
    ['30 min', 30],
    ['1 h 30 min', 90],
    ['1–2 h', 90],
    ['20-30 min por memo (série viva, 25+ memos)', 25],
    ['~2 h (guias A e B; módulo inteiro tem 10 h)', 120],
    ['8 h (usar unidades de busca binária e notação assintótica, ~2 h)', 120],
    ['2 h (usar fatores I–V e XI, ~45 min)', 45],
    ['150 h (partes 0-5, ~60 h)', 3600],
  ])('lê "%s" como %i minutos', (text, minutes) => {
    expect(estimateMinutes(resource(text))).toBe(minutes);
  });

  it('lê a duração do título quando o recurso não declara tempo', () => {
    const titled = (title: string) => ({ ...resource(undefined), title }) as Resource;
    expect(estimateMinutes(titled('Lógica de Programação – Aprenda em 3 Horas'))).toBe(180);
    expect(estimateMinutes(titled('Curso de Algoritmos [40 Horas]'))).toBe(2400);
  });

  it('usa o padrão do tipo quando o recurso não declara tempo', () => {
    expect(estimateMinutes(resource(undefined, 'video'))).toBe(20);
    expect(estimateMinutes(resource(undefined, 'exercise'))).toBe(45);
  });
});
