import type { Build, Competency, Level } from '@/domain/model';
import { LEVEL_NOW } from './reason-text';

/**
 * Um prompt pronto para a pessoa levar ao assistente de IA que ela já usa.
 *
 * Não há IA dentro do Career Gap: o texto é montado por template, só com dados do catálogo
 * e do perfil, e a pessoa decide se e onde usa (ADR-0004: o motor decide, a IA explica). O
 * prompt pede um tutor que faz perguntas e confere o código contra os critérios de saída,
 * em vez de entregar a solução — é o uso de IA que a própria trilha ensina.
 */

const RULES = [
  'Não me dê a solução pronta. Faça uma pergunta de cada vez e espere a minha resposta.',
  'Quando eu mostrar código, confira contra os critérios acima e aponte o que falha, sem corrigir por mim.',
  'Se eu pedir a resposta, me dê uma pista menor primeiro.',
  'Responda em português do Brasil, com exemplos curtos.',
];

export function studyPrompt(competency: Competency, currentLevel: Level, targetLevel: Level): string {
  const target = competency.levels[targetLevel];
  const criteria = (target?.exitCriteria ?? []).map((criterion) => `- ${criterion}`).join('\n');
  return [
    `Quero aprender ${competency.name}: ${competency.summary}`,
    `Hoje eu ${LEVEL_NOW[currentLevel]}. Quero chegar a: "${target?.canDo ?? competency.summary}"`,
    'Vou saber que cheguei quando:',
    criteria,
    'Regras para você, como tutor:',
    ...RULES.map((rule) => `- ${rule}`),
    'Comece me perguntando o que eu já tentei.',
  ].join('\n');
}

export function buildPrompt(build: Build, competencyNames: readonly string[]): string {
  const steps = build.steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
  return [
    `Quero construir isto: ${build.title}. Resultado esperado: ${build.result}`,
    `Isso exercita: ${competencyNames.join(', ')}.`,
    'Meu plano:',
    steps,
    `Está pronto quando: ${build.doneWhen}`,
    'Regras para você, como tutor:',
    ...RULES.map((rule) => `- ${rule}`),
    'Comece me perguntando em que passo eu estou.',
  ].join('\n');
}
