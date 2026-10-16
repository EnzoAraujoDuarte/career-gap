import { describe, expect, it } from 'vitest';
import {
  assertEvaluation,
  CAREER_GAP_ITEMS,
  CHOICE_QUESTIONS,
  LIKERT_ITEMS,
  OPEN_QUESTIONS,
  PATH_ITEMS,
  SUS_ITEMS,
  susScore,
} from '@/lib/evaluation';
import { sampleEvaluation } from './fixtures';

describe('questionário: instrumento', () => {
  it('tem ids únicos e os dez itens do SUS, com os pares invertidos', () => {
    const ids = [...CHOICE_QUESTIONS, ...LIKERT_ITEMS, ...OPEN_QUESTIONS].map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(SUS_ITEMS).toHaveLength(10);
    SUS_ITEMS.forEach((item, index) => expect(Boolean(item.reverse), item.id).toBe(index % 2 === 1));
  });

  it('cobre os construtos do ResQue e a checagem da manipulação que a ADR-0007 pede', () => {
    const constructs = new Set(PATH_ITEMS.map((item) => item.construct));
    for (const construct of [
      'perceived-accuracy',
      'transparency',
      'control',
      'perceived-usefulness',
      'confidence',
      'satisfaction',
      'perceived-personalization',
    ]) {
      expect(constructs.has(construct), construct).toBe(true);
    }
    expect(PATH_ITEMS.filter((item) => item.source === 'manipulation-check')).toHaveLength(2);
  });

  it('cabe em uns cinco minutos: poucos itens, frases curtas', () => {
    expect(LIKERT_ITEMS.length).toBeLessThanOrEqual(30);
    expect(CHOICE_QUESTIONS.length).toBeLessThanOrEqual(6);
    expect(OPEN_QUESTIONS.length).toBeLessThanOrEqual(1);
    for (const entry of LIKERT_ITEMS) expect(entry.text.length, entry.id).toBeLessThanOrEqual(80);
    for (const question of CHOICE_QUESTIONS) expect(question.choices.length, question.id).toBeLessThanOrEqual(6);
  });

  it('pergunta direto o que a tese afirma: as cinco perguntas do produto e a descoberta de lacunas', () => {
    const constructs = new Set(CAREER_GAP_ITEMS.map((item) => item.construct));
    for (const construct of ['where-am-i', 'can-build-now', 'next-step-clarity', 'what-to-ignore', 'path-clarity', 'gap-discovery']) {
      expect(constructs.has(construct), construct).toBe(true);
    }
    expect(CAREER_GAP_ITEMS.every((item) => item.source === 'career-gap')).toBe(true);
    expect(OPEN_QUESTIONS.map((question) => question.id)).toContain('lacuna-descoberta');
    expect(CHOICE_QUESTIONS.map((question) => question.id)).toContain('next-action');
  });
});

describe('questionário: escore SUS', () => {
  const sus = (odd: number, even: number) =>
    Object.fromEntries(SUS_ITEMS.map((item, index) => [item.id, index % 2 === 0 ? odd : even]));

  it('vai de 0 a 100 e dá 50 para quem marca o meio em tudo', () => {
    expect(susScore(sus(5, 1))).toBe(100);
    expect(susScore(sus(1, 5))).toBe(0);
    expect(susScore(sus(3, 3))).toBe(50);
    expect(susScore(sus(4, 2))).toBe(75);
  });

  it('não calcula com item faltando', () => {
    const answers = sus(4, 2);
    delete answers['sus-07'];
    expect(susScore(answers)).toBeUndefined();
  });
});

describe('questionário: validação na entrada do servidor', () => {
  const valid = sampleEvaluation();

  it('aceita uma resposta completa', () => {
    expect(() => assertEvaluation(valid)).not.toThrow();
    expect(() => assertEvaluation({ ...valid, comments: {} })).not.toThrow();
  });

  it('recusa sem consentimento, item faltando, nota fora da escala e opção inventada', () => {
    expect(() => assertEvaluation({ ...valid, consent: false })).toThrow(/consentimento/);
    const missing = { ...valid.answers };
    delete missing['sus-01'];
    expect(() => assertEvaluation({ ...valid, answers: missing })).toThrow(/sem resposta/);
    expect(() => assertEvaluation({ ...valid, answers: { ...valid.answers, 'sus-01': 6 } })).toThrow();
    expect(() => assertEvaluation({ ...valid, answers: { ...valid.answers, 'sus-01': 2.5 } })).toThrow();
    expect(() => assertEvaluation({ ...valid, answers: { ...valid.answers, inventado: 3 } })).toThrow(/desconhecido/);
    expect(() => assertEvaluation({ ...valid, participant: { ...valid.participant, age: 'cem' } })).toThrow();
    expect(() => assertEvaluation({ ...valid, participant: { ...valid.participant, extra: 'x' } })).toThrow();
  });

  it('recusa comentário em pergunta inexistente ou longo demais', () => {
    expect(() => assertEvaluation({ ...valid, comments: { inventada: 'x' } })).toThrow();
    expect(() => assertEvaluation({ ...valid, comments: { 'lacuna-descoberta': 'a'.repeat(2_001) } })).toThrow();
  });
});
