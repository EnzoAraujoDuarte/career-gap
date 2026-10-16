/** Os perfis vivem em `src/lib/demo-profiles.ts` porque a aplicação também os usa
 *  na tela de demonstração. Este arquivo mantém o import curto nos testes. */
export * from '@/lib/demo-profiles';

import { CHOICE_QUESTIONS, LIKERT_ITEMS, type EvaluationAnswers } from '@/lib/evaluation';

/** Uma resposta completa ao questionário, com a mesma nota em todos os itens de escala. */
export const sampleEvaluation = (value = 4): EvaluationAnswers => ({
  consent: true,
  participant: Object.fromEntries(CHOICE_QUESTIONS.map((question) => [question.id, question.choices[0].value])),
  answers: Object.fromEntries(LIKERT_ITEMS.map((item) => [item.id, value])),
  comments: { ajudou: 'as construções' },
});
