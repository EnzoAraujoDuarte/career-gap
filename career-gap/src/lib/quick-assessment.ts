import type { CareerTrack, CompetencyId, Level, QuickQuestion } from '@/domain/model';
import { levelIndex } from '@/domain/model';

/**
 * Avaliação rápida: seis temas em vez de vinte e cinco telas.
 *
 * Responder uma pergunta REESCREVE tudo o que ela declara: primeiro zera as competências da
 * pergunta, depois aplica a frase escolhida. Assim, voltar e escolher uma frase menor não deixa
 * resto da resposta anterior.
 */
export function applyAnswer(
  track: CareerTrack,
  levels: Readonly<Record<CompetencyId, Level>>,
  question: QuickQuestion,
  statementIndex: number | undefined,
): Record<CompetencyId, Level> {
  const target = new Map(track.requirements.map((item) => [item.competency, item.targetLevel]));
  const next: Record<CompetencyId, Level> = { ...levels };
  for (const statement of question.statements) {
    for (const competency of statement.competencies) next[competency] = 'L0';
  }
  const chosen = statementIndex === undefined ? undefined : question.statements[statementIndex];
  for (const competency of chosen?.competencies ?? []) {
    const cap = target.get(competency) ?? chosen!.level;
    // Limitado ao alvo: a frase não pode afirmar um nível que a competência não descreve.
    next[competency] = levelIndex(chosen!.level) < levelIndex(cap) ? chosen!.level : cap;
  }
  return next;
}

/** Qual frase está marcada, lida dos níveis salvos: a maior cujas competências batem. */
export function answeredStatement(
  track: CareerTrack,
  levels: Readonly<Record<CompetencyId, Level>>,
  question: QuickQuestion,
): number | undefined {
  for (let index = question.statements.length - 1; index >= 0; index--) {
    const expected = applyAnswer(track, {}, question, index);
    const matches = question.statements[index].competencies.every(
      (competency) => levels[competency] === expected[competency],
    );
    if (matches) return index;
  }
  return undefined;
}
