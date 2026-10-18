import { describe, expect, it } from 'vitest';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import type { Level } from '@/domain/model';
import { generateRoadmap } from '@/domain/roadmap';
import { buildPathView } from '@/lib/path-view';
import { applyAnswer } from '@/lib/quick-assessment';
import { buildRoadmapView } from '@/lib/roadmap-view';
import {
  answeredEveryQuestion,
  assertProfile,
  concludeCompetency,
  reopenCompetency,
  toUserProfile,
  type StoredProfile,
} from '@/lib/user-state';

const targetOf = (id: string) => FIRST_WEB_ROLE.requirements.find((item) => item.competency === id)!.targetLevel;

/** Quem respondeu "ainda não" em tudo: as 25 competências das perguntas no zero. */
const beginner: StoredProfile = {
  trackId: FIRST_WEB_ROLE.id,
  levels: FIRST_WEB_ROLE.quickAssessment.reduce(
    (levels, question) => applyAnswer(FIRST_WEB_ROLE, levels, question, undefined),
    {} as Record<string, Level>,
  ),
};

const hereOf = (profile: StoredProfile) =>
  buildPathView(CATALOG, FIRST_WEB_ROLE, buildRoadmapView(generateRoadmap(toUserProfile(profile), CATALOG), CATALOG))
    .hereId;

describe('concluir uma estação (ADR-0017)', () => {
  it('sobe só aquela competência ao nível que a vaga pede, e o servidor aceita', () => {
    const result = concludeCompetency(beginner, 'html-semantics')!;
    expect(result.profile.levels['html-semantics']).toBe(targetOf('html-semantics'));
    expect(result.previous).toBe('L0');
    const changed = Object.keys(result.profile.levels).filter(
      (id) => result.profile.levels[id] !== beginner.levels[id],
    );
    expect(changed).toEqual(['html-semantics']);
    expect(() => assertProfile(result.profile)).not.toThrow();
  });

  it('não mexe em quem já está no nível pedido', () => {
    const done = concludeCompetency(beginner, 'css-layout')!.profile;
    expect(concludeCompetency(done, 'css-layout')).toBeUndefined();
  });

  it('faz o "você está aqui" andar para a próxima lacuna', () => {
    const here = hereOf(beginner)!;
    const after = concludeCompetency(beginner, here)!.profile;
    expect(hereOf(after)).toBeDefined();
    expect(hereOf(after)).not.toBe(here);
  });

  it('sem perfil, começa um só com a estação concluída, e avisa que faltam as perguntas', () => {
    const result = concludeCompetency(undefined, 'programming-fundamentals')!;
    expect(result.profile).toEqual({
      trackId: FIRST_WEB_ROLE.id,
      levels: { 'programming-fundamentals': targetOf('programming-fundamentals') },
    });
    expect(() => assertProfile(result.profile)).not.toThrow();
    expect(answeredEveryQuestion(result.profile)).toBe(false);
    expect(answeredEveryQuestion(beginner)).toBe(true);
  });

  it('recusa competência fora da trilha', () => {
    expect(concludeCompetency(beginner, 'microservices-architecture')).toBeUndefined();
  });
});

describe('reabrir uma estação', () => {
  it('volta ao nível de antes de concluir', () => {
    const start: StoredProfile = { ...beginner, levels: { ...beginner.levels, 'version-control-git': 'L1' } };
    const { profile, previous } = concludeCompetency(start, 'version-control-git')!;
    expect(reopenCompetency(profile, 'version-control-git', previous)!.levels['version-control-git']).toBe('L1');
  });

  it('sem o nível de antes, desce um degrau abaixo do alvo, e a estação volta a ser lacuna', () => {
    const done = concludeCompetency(beginner, 'debugging')!.profile;
    const reopened = reopenCompetency(done, 'debugging')!;
    const target = targetOf('debugging');
    expect(reopened.levels.debugging).not.toBe(target);
    expect(concludeCompetency(reopened, 'debugging')).toBeDefined();
    expect(() => assertProfile(reopened)).not.toThrow();
  });

  it('não reabre o que ainda está aberto', () => {
    expect(reopenCompetency(beginner, 'sql-basics')).toBeUndefined();
  });
});
