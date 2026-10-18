import { describe, expect, it } from 'vitest';
import { CATALOG } from '@/catalog';
import { buildPrompt, exercisePrompt, habitsFor, studyPrompt } from '@/lib/ai-prompt';
import { toUserProfile } from '@/lib/user-state';

const fundamentals = CATALOG.competencies.get('programming-fundamentals')!;
const mission = CATALOG.resources.find((resource) => resource.task && resource.competencies.includes(fundamentals.id))!;
const calculator = CATALOG.builds.find((build) => build.id === 'calculadora-de-parcelas')!;
const names = calculator.exercises.map((id) => CATALOG.competencies.get(id)!.name);
const all = [
  studyPrompt(fundamentals, 'L1', 'L2'),
  exercisePrompt(fundamentals, 'L1', 'L2', mission),
  exercisePrompt(fundamentals, 'L1', 'L2'),
  buildPrompt(calculator, names),
];

describe('os prompts de IA (ADR-0018)', () => {
  it('falam em primeira pessoa, com as frases do próprio nível', () => {
    const prompt = studyPrompt(fundamentals, 'L1', 'L2');
    expect(prompt).toContain(`O que eu já faço: "${fundamentals.levels.L1!.canDo}"`);
    expect(prompt).toContain(`Quero chegar a este ponto: "${fundamentals.levels.L2!.canDo}"`);
    expect(prompt).not.toMatch(/Hoje eu (faz|já faz|ainda não faz)/);
    expect(prompt).not.toContain('Nunca estudei este assunto');
    expect(studyPrompt(fundamentals, 'L2', 'L2')).toContain('Já faço o que a vaga pede aqui.');
  });

  it('no zero, dizem que a pessoa está começando no assunto, e pedem o jeito mais simples', () => {
    for (const prompt of [studyPrompt(fundamentals, 'L0', 'L2'), exercisePrompt(fundamentals, 'L0', 'L2')]) {
      expect(prompt).toContain('Nunca estudei este assunto: explique como para quem está começando.');
      expect(prompt).not.toContain('O que eu já faço');
    }
    for (const prompt of all) expect(prompt).toContain('Explique do jeito mais simples que der');
  });

  it('citam só hábitos do catálogo, com a fonte conferida, no máximo dois, e nenhum sobre como usar a IA', () => {
    const habits = habitsFor([fundamentals.id]);
    expect(habits.length).toBeGreaterThan(0);
    expect(habits.length).toBeLessThanOrEqual(2);
    expect(habits.some((habit) => habit.tradition === 'ai-tutor')).toBe(false);
    const prompt = all[0];
    for (const habit of habits) expect(prompt).toContain(`Fonte: ${habit.credit}.`);
    const cited = prompt.split('\n').filter((line) => line.includes('Fonte: '));
    expect(cited).toHaveLength(habits.length);
  });

  it('o hábito da IA tutora não proíbe mais a solução: pede código explicado', () => {
    const habit = CATALOG.habits.find((item) => item.id === 'ai-as-tutor')!;
    expect(habit.detail).not.toMatch(/Não peça a solução/);
    expect(habit.detail).toMatch(/código junto com a explicação/);
  });

  it('não afirmam linguagem nenhuma: só o que a pessoa já estudou, e a regra para escolher', () => {
    // Antes todo mundo recebia "Programo em JavaScript", inclusive quem nunca programou.
    const done = CATALOG.resources.filter((resource) => resource.competencies.includes(fundamentals.id)).slice(0, 4);
    const prompt = studyPrompt(fundamentals, 'L1', 'L2', { done });
    for (const resource of done.slice(0, 3)) expect(prompt).toContain(`"${resource.title}"`);
    expect(prompt).not.toContain(`"${done[3].title}"`);
    expect(studyPrompt(fundamentals, 'L1', 'L2')).not.toContain('Já estudei');
    for (const item of all) {
      expect(item).not.toMatch(/Programo em/);
      expect(item).toContain('use a linguagem que o assunto pede; quando tanto faz, JavaScript');
    }
  });

  it('apresentam o vocabulário da área aos poucos, com as palavras novas explicadas no fim', () => {
    for (const prompt of all) {
      expect(prompt).toContain('Use os termos da área aos poucos');
      expect(prompt).toContain('em "Palavras novas"');
      expect(prompt).toContain('sem repetir os já explicados');
    }
  });

  it('a linguagem guardada de quando havia seletor não chega ao motor (ADR-0014)', () => {
    const profile = toUserProfile({ trackId: 'first-web-role', technologyId: 'java', levels: {} });
    expect(profile.technologyId).toBeUndefined();
  });

  it('o exercício traz a missão do Career Gap pronta, e o de fora vem com o lugar para colar', () => {
    const withMission = exercisePrompt(fundamentals, 'L1', 'L2', mission);
    expect(withMission).toContain(mission.task!);
    expect(withMission).toContain(mission.url);
    expect(withMission).toContain('O que eu acho que está errado: [escreva aqui]');
    const external = exercisePrompt(fundamentals, 'L1', 'L2');
    expect(external).toContain('Enunciado: [cole aqui o enunciado ou o link]');
    expect(external).toContain('Meu código até agora: [cole aqui]');
  });

  it('a construção traz o plano, o critério de pronto e os hábitos das competências que exercita', () => {
    const prompt = all[3];
    for (const step of calculator.steps) expect(prompt).toContain(step);
    expect(prompt).toContain(calculator.doneWhen);
    for (const habit of habitsFor(calculator.exercises)) expect(prompt).toContain(habit.title);
  });

  it('pedem o mesmo jeito de ajudar nos três: direto, com exemplo do dia a dia e código explicado', () => {
    for (const prompt of all) {
      expect(prompt).toContain('sem introdução, sem elogios e sem resumo no fim');
      expect(prompt).toContain('exemplos do dia a dia no Brasil');
      expect(prompt).toContain('explique as decisões');
      expect(prompt).not.toMatch(/\bL[0-4]\b/);
    }
  });

  it('ficam curtos em todo o catálogo: menos de 40 linhas e 3.500 caracteres', () => {
    // Os guias dizem que prompt longo e lista grande de regras pioram a resposta. O teto vale para
    // toda estação e toda construção, no caso mais longo (no zero, com a missão); passar dele pede
    // cortar, não aumentar o teto.
    const every = [
      ...[...CATALOG.competencies.values()].flatMap((competency) => {
        const own = CATALOG.resources.find((resource) => resource.task && resource.competencies.includes(competency.id));
        return [studyPrompt(competency, 'L0', 'L2'), exercisePrompt(competency, 'L0', 'L2', own)];
      }),
      ...CATALOG.builds.map((build) =>
        buildPrompt(build, build.exercises.map((id) => CATALOG.competencies.get(id)?.name ?? id)),
      ),
    ];
    for (const prompt of every) {
      expect(prompt.split('\n').length).toBeLessThan(40);
      expect(prompt.length).toBeLessThan(3500);
    }
  });
});
