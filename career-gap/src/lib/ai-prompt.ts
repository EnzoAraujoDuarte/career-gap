import { CATALOG } from '@/catalog';
import type { Build, Competency, CompetencyId, Level, ProfessionalHabit, Resource } from '@/domain/model';
import { levelAtLeast } from '@/domain/model';
import { LEVEL_ASKED } from './reason-text';

/**
 * Os prompts prontos que a pessoa leva ao assistente de IA que ela já usa: estudar uma estação,
 * resolver um exercício e construir um projeto.
 *
 * Não há IA dentro do Career Gap: o texto é montado por template, só com dados do catálogo e do
 * perfil, e a pessoa decide se e onde usa (ADR-0004: o motor decide, a IA explica).
 *
 * O código é permitido, sempre explicado (ADR-0018). No ensaio de Shen e Tamkin (2026), pedir
 * código junto com a explicação, ou gerar e depois perguntar até entender, preservou o
 * aprendizado; delegar sem entender, não. No de Eastwood e outros (2026), o tutor que só fazia
 * perguntas foi o pior avaliado e levou mais gente a usar outra IA. Os guias da Anthropic, da
 * OpenAI e do Google pedem o mesmo formato: contexto em seções, o motivo de cada pedido, o que
 * fazer em vez do que evitar, e prompt curto.
 */

/** O que o site sabe e a IA não. A linguagem não entra: o prompt não afirma o que a pessoa sabe
 *  além do que ela declarou, e quem nunca programou não pode receber "programo em JavaScript". */
export interface PromptContext {
  /** Materiais desta estação que a pessoa marcou como concluídos. */
  readonly done?: readonly Resource[];
}

/** Mais que isso e o bloco de hábitos vira lista de regras, que os guias dizem piorar a resposta. */
const MAX_HABITS = 2;
const MAX_DONE = 3;

/** Os hábitos do catálogo ligados a estas competências, com a fonte já conferida: a IA cita o
 *  que está aqui, e não um número de dica que ela lembra errado. Os da tradição "IA tutora"
 *  ficam de fora: dizem à pessoa como usar a IA, e o próprio pedido já faz isso. */
export function habitsFor(competencies: readonly CompetencyId[]): ProfessionalHabit[] {
  return CATALOG.habits
    .filter((habit) => habit.tradition !== 'ai-tutor' && habit.competencies.some((id) => competencies.includes(id)))
    .slice(0, MAX_HABITS);
}

/** `newToSubject`: a pessoa está no zero neste assunto. Fala do assunto, não da pessoa inteira:
 *  dá para estar começando em SQL e já saber JavaScript. */
function whoIAm({ done = [] }: PromptContext, newToSubject = false): string[] {
  const studied = done
    .slice(0, MAX_DONE)
    .map((resource) => `"${resource.title}", de ${resource.sourceName}`)
    .join('; ');
  return [
    '## Quem sou',
    'Estou estudando sozinho para a primeira vaga em desenvolvimento web, pelo Career Gap.',
    ...(newToSubject ? ['Nunca estudei este assunto: explique como para quem está começando.'] : []),
    ...(studied ? [`Já estudei: ${studied}.`] : []),
  ];
}

/** Como a IA ajuda, igual nos três prompts. Cada linha diz o que fazer e, quando não é óbvio,
 *  por quê: o modelo generaliza a partir do motivo. */
function howYouHelp(habits: readonly ProfessionalHabit[]): string[] {
  return [
    'Fale comigo como um colega mais experiente: frases curtas, direto ao ponto, sem introdução, sem elogios e sem resumo no fim.',
    'Explique do jeito mais simples que der, e só suba o nível quando eu mostrar que acompanho.',
    'Gaste o esforço no que eu pedi. Se eu pedir uma explicação, explique bem e só isso. Se eu pedir código, escreva o código e explique as decisões.',
    'Use exemplos do dia a dia no Brasil, no meu nível: uma compra parcelada, um CEP, um pedido de delivery.',
    'Se precisar de código, use a linguagem que o assunto pede; quando tanto faz, JavaScript, até eu dizer que uso outra.',
    'No código: nomes que dizem o que guardam, funções pequenas, erros tratados, só as bibliotecas que eu pedir, e como rodar e testar.',
    // O vocabulário da área é barreira para quem começa, e a pessoa vai ouvi-lo na entrevista:
    // a IA o apresenta aos poucos, sem despejar um glossário inteiro a cada resposta.
    'Use os termos da área aos poucos, porque vou ouvi-los no trabalho. No fim da resposta, em "Palavras novas", explique numa frase simples cada termo novo, como deploy, debugar ou hardcoded, sem repetir os já explicados.',
    'Quero aprender, não só receber pronto. Quando fizer sentido, termine com uma pergunta curta que confira se entendi, ou me peça para mudar algo no código.',
    ...(habits.length > 0
      ? [
          'Se um destes hábitos couber, cite:',
          ...habits.map((habit) => `- ${habit.title}. ${habit.detail} Fonte: ${habit.credit}.`),
        ]
      : []),
    'Se não tiver certeza de algo, diga, e me indique a documentação oficial.',
    'Responda em português do Brasil.',
  ];
}

const criteriaOf = (competency: Competency, level: Level) =>
  (competency.levels[level]?.exitCriteria ?? []).map((criterion) => `- ${criterion}`);

/** Onde a pessoa está e aonde vai, nas frases do próprio nível ("Escrevo funções..."). */
function whereIAm(competency: Competency, current: Level, target: Level): string[] {
  if (levelAtLeast(current, target)) {
    return ['Já faço o que a vaga pede aqui. Quero revisar e ir um pouco além.'];
  }
  const now = competency.levels[current]?.canDo;
  const goal = competency.levels[target]?.canDo ?? competency.summary;
  // No zero não há "o que eu já faço": o "Quem sou" já diz que a pessoa está começando.
  return [...(now ? [`O que eu já faço: "${now}"`] : []), `Quero chegar a este ponto: "${goal}"`];
}

/** Estudar uma estação: a IA ensina a partir do que a pessoa já sabe. */
export function studyPrompt(
  competency: Competency,
  currentLevel: Level,
  targetLevel: Level,
  context: PromptContext = {},
): string {
  return [
    ...whoIAm(context, currentLevel === 'L0'),
    '',
    '## O que quero aprender',
    `${competency.name}. ${competency.summary}`,
    ...whereIAm(competency, currentLevel, targetLevel),
    '',
    '## Vou saber que cheguei quando',
    ...criteriaOf(competency, targetLevel),
    '',
    '## Como você me ajuda',
    'Comece com uma ou duas perguntas curtas para ver o que eu já sei, e ensine a partir daí, um conceito por vez.',
    ...howYouHelp(habitsFor([competency.id])),
  ].join('\n');
}

/**
 * Resolver um exercício com ajuda. A missão do próprio Career Gap vem com o enunciado, porque o
 * texto é nosso; o exercício de outro site, a pessoa cola, porque o catálogo só aponta para a
 * página dele (ADR-0005). "O que eu acho que está errado" vem antes da ajuda de propósito: usar a
 * IA só para depurar foi um dos jeitos que mais derrubaram o aprendizado no ensaio.
 */
export function exercisePrompt(
  competency: Competency,
  currentLevel: Level,
  targetLevel: Level,
  mission?: Resource,
  context: PromptContext = {},
): string {
  const statement = mission?.task
    ? [
        `${mission.title}.`,
        mission.task,
        `Documento oficial: ${mission.url}`,
        'Se for outro exercício, troque esta missão pelo enunciado dele.',
      ]
    : ['Enunciado: [cole aqui o enunciado ou o link]'];
  return [
    ...whoIAm(context, currentLevel === 'L0'),
    '',
    '## O exercício',
    `Estação: ${competency.name}. A vaga pede que eu ${LEVEL_ASKED[targetLevel]}.`,
    ...statement,
    'Meu código até agora: [cole aqui]',
    'O que eu acho que está errado: [escreva aqui]',
    '',
    '## O que a estação pede de mim',
    ...criteriaOf(competency, targetLevel),
    '',
    '## Como você me ajuda',
    'Quero resolver este exercício eu mesmo, porque preciso saber explicar a solução.',
    'Olhe primeiro o que eu tentei e o que eu acho que está errado. Me dê pistas em degraus: o conceito, depois onde olhar, depois um trecho de código.',
    'Se eu pedir a solução, mostre o código completo, explique cada parte e me peça para reescrever sem olhar.',
    'Quando eu mandar código, compare com o enunciado e com o que a estação pede: o que está bom, o que falha e por quê.',
    ...howYouHelp(habitsFor([competency.id])),
  ].join('\n');
}

/** Construir um projeto do portfólio: a IA programa junto, um passo por vez. */
export function buildPrompt(build: Build, competencyNames: readonly string[], context: PromptContext = {}): string {
  return [
    ...whoIAm(context),
    '',
    '## O que vou construir',
    `${build.title}. ${build.result}`,
    `Isso exercita: ${competencyNames.join(', ')}.`,
    '',
    '## Meu plano',
    ...build.steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    '## Está pronto quando',
    build.doneWhen,
    '',
    '## Como você me ajuda',
    'Este projeto vai para o meu portfólio, então preciso conseguir explicar cada decisão.',
    'Trabalhe um passo por vez: veja o que eu já fiz, me deixe tentar, e se eu pedir, mostre o código do passo explicado.',
    'Antes de dizer que terminou, confira os critérios de pronto um a um.',
    ...howYouHelp(habitsFor(build.exercises)),
  ].join('\n');
}
