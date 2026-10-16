/**
 * O questionário de avaliação com usuários (docs/AVALIACAO-COM-USUARIOS.md).
 *
 * O instrumento é CÓDIGO, como o catálogo: itens com id, construto e fonte, versionados. O banco
 * guarda só as respostas por id (`evaluation_response`), e tudo o que chega do navegador é
 * validado aqui antes de tocar o banco. Mudar um item muda a versão, e uma resposta coletada
 * continua interpretável depois.
 *
 * Itens de escala: as perguntas que o produto promete responder (onde estou, o que já construo, o
 * que vem depois, por quê, o que pode esperar; AGENTS.md) e o que a pessoa descobriu com ele; SUS
 * (Brooke, 1996); um subconjunto do ResQue (Pu, Chen e Hu, RecSys 2011); dois itens de checagem da
 * manipulação; e dois sobre a trilha (INITIAL_SCOPE §19).
 *
 * Cabe em uns cinco minutos, e isso é regra (teste): frase curta, uma ideia por item, e cada item
 * que entra tira outro. Quem testa responde de boa vontade uma vez; um questionário longo perde a
 * segunda metade das respostas.
 * As traduções são do projeto; a versão validada em português do SUS, se o orientador exigir,
 * substitui o texto sem mudar o id.
 */

export const INSTRUMENT_VERSION = '2026.10.16-4';

export interface Choice {
  readonly value: string;
  readonly label: string;
}

export interface ChoiceQuestion {
  readonly id: string;
  readonly label: string;
  readonly choices: readonly Choice[];
}

export type LikertSource = 'career-gap' | 'SUS' | 'ResQue' | 'manipulation-check' | 'roadmap';

export interface LikertItem {
  readonly id: string;
  readonly text: string;
  readonly source: LikertSource;
  /** Construto medido: os do ResQue, os da avaliação do roadmap ou `usability` no SUS. */
  readonly construct: string;
  /** Item invertido: concordar é o resultado ruim. O SUS alterna por desenho. */
  readonly reverse?: boolean;
}

export interface OpenQuestion {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
}

export const LIKERT_SCALE = [
  { value: 1, label: 'Discordo totalmente' },
  { value: 2, label: 'Discordo' },
  { value: 3, label: 'Nem concordo nem discordo' },
  { value: 4, label: 'Concordo' },
  { value: 5, label: 'Concordo totalmente' },
] as const;

const choices = (...pairs: readonly (readonly [string, string])[]): readonly Choice[] =>
  pairs.map(([value, label]) => ({ value, label }));

/** Quem respondeu. Faixas, nunca o dado exato: nada aqui identifica alguém. */
export const PARTICIPANT_QUESTIONS: readonly ChoiceQuestion[] = [
  {
    id: 'age',
    label: 'Sua idade',
    choices: choices(
      ['ate-17', 'até 17'],
      ['18-24', '18 a 24'],
      ['25-34', '25 a 34'],
      ['35-44', '35 a 44'],
      ['45-ou-mais', '45 ou mais'],
      ['prefiro-nao-dizer', 'prefiro não dizer'],
    ),
  },
  {
    id: 'situation',
    label: 'Sua situação hoje',
    choices: choices(
      ['estudando-computacao', 'estudo computação ou área próxima'],
      ['migrando-de-outra-area', 'estou em outra área e quero migrar'],
      ['procurando-primeira-vaga', 'procuro a primeira vaga ou estágio'],
      ['ja-trabalho-com-dev', 'já trabalho com desenvolvimento'],
      ['outra', 'outra'],
    ),
  },
  {
    id: 'experience',
    label: 'Há quanto tempo você programa',
    choices: choices(
      ['nunca', 'nunca programei'],
      ['menos-de-1-ano', 'menos de 1 ano'],
      ['1-a-2-anos', 'de 1 a 2 anos'],
      ['mais-de-2-anos', 'mais de 2 anos'],
    ),
  },
];

/** Quanto usou e quanto demorou a entender o próximo passo: a medida objetiva barata da ADR-0007,
 *  aqui autodeclarada. */
export const USAGE_QUESTIONS: readonly ChoiceQuestion[] = [
  {
    id: 'time-on-site',
    label: 'Quanto tempo você usou o Career Gap?',
    choices: choices(
      ['menos-de-10-min', 'menos de 10 minutos'],
      ['10-a-30-min', 'de 10 a 30 minutos'],
      ['mais-de-30-min', 'mais de 30 minutos'],
      ['varios-dias', 'em vários dias'],
    ),
  },
  {
    id: 'time-to-next-step',
    label: 'Quanto demorou para entender qual é o seu próximo passo?',
    choices: choices(
      ['na-hora', 'entendi na hora'],
      ['poucos-minutos', 'em poucos minutos'],
      ['demorou', 'demorou'],
      ['nao-entendi', 'não cheguei a entender'],
    ),
  },
];

const item = (
  source: LikertSource,
  construct: string,
  id: string,
  text: string,
  reverse = false,
): LikertItem => ({ id, text, source, construct, ...(reverse ? { reverse } : {}) });

/**
 * O que o TCC afirma, perguntado direto: a tese é avaliação → lacuna → caminho priorizado →
 * recomendação útil, e o produto promete responder onde estou, o que já consigo construir, o que
 * vem depois e o que posso ignorar. Um item por elo.
 */
export const CAREER_GAP_ITEMS: readonly LikertItem[] = [
  item('career-gap', 'path-clarity', 'caminho-claro', 'Consegui ver claramente o caminho que preciso seguir.'),
  item('career-gap', 'gap-discovery', 'lacunas-novas', 'Descobri lacunas técnicas que eu não conhecia.'),
  item('career-gap', 'where-am-i', 'onde-estou', 'Entendi em que ponto do caminho eu estou.'),
  item('career-gap', 'can-build-now', 'construir-agora', 'Sei o que já consigo construir hoje.'),
  item('career-gap', 'next-step-clarity', 'proximo-passo', 'Sei qual é o meu próximo passo.'),
  item('career-gap', 'what-to-ignore', 'o-que-ignorar', 'Sei o que posso deixar para depois.'),
  item('career-gap', 'better-than-before', 'melhor-que-antes', 'Ficou mais fácil decidir o que estudar do que antes.'),
];

/**
 * Sobre a trilha recebida: construções e tópicos desnecessários, o ResQue e, por último, a
 * checagem da manipulação. Se a percepção de personalização não se mover, nada no ResQue é efeito
 * do motor (docs/DECISOES.md §1).
 */
export const PATH_ITEMS: readonly LikertItem[] = [
  item('roadmap', 'builds', 'construcoes-motivam', 'As construções me deram vontade de começar algo hoje.'),
  item('roadmap', 'unnecessary-topics', 'topicos-desnecessarios', 'Havia tópicos desnecessários para mim.', true),

  item('ResQue', 'perceived-accuracy', 'recomendado-corresponde', 'O que foi marcado como "recomendado agora" é o que eu preciso estudar.'),
  item('ResQue', 'perceived-accuracy', 'ja-sabe-bate', 'O que foi marcado como "você já sabe" bate com o que eu sei.'),
  item('ResQue', 'transparency', 'entendi-motivos', 'Entendi por que cada coisa foi marcada assim.'),
  item('ResQue', 'control', 'eu-decidia', 'Eu decidia o que estudar; o site só sugeria.'),
  item('ResQue', 'perceived-usefulness', 'ajudou-decidir', 'A trilha me ajudou a decidir o que estudar.'),
  item('ResQue', 'confidence', 'confio', 'Confio nas recomendações.'),
  item('ResQue', 'satisfaction', 'satisfeito', 'Estou satisfeito com a trilha que recebi.'),
  item('ResQue', 'use-intention', 'indicaria', 'Indicaria o Career Gap para alguém começando.'),

  item('manipulation-check', 'perceived-personalization', 'feita-para-meu-nivel', 'A trilha pareceu feita para o meu nível.'),
  item('manipulation-check', 'perceived-personalization', 'mudaria-com-respostas', 'Se eu tivesse respondido diferente, a trilha seria diferente.'),
];

/** SUS (Brooke, 1996): dez itens, os pares invertidos. A ordem é parte do instrumento. */
export const SUS_ITEMS: readonly LikertItem[] = [
  item('SUS', 'usability', 'sus-01', 'Gostaria de usar este site com frequência.'),
  item('SUS', 'usability', 'sus-02', 'Achei o site desnecessariamente complexo.', true),
  item('SUS', 'usability', 'sus-03', 'Achei o site fácil de usar.'),
  item('SUS', 'usability', 'sus-04', 'Precisaria da ajuda de alguém técnico para usar o site.', true),
  item('SUS', 'usability', 'sus-05', 'As partes do site funcionam bem juntas.'),
  item('SUS', 'usability', 'sus-06', 'O site tem muita inconsistência.', true),
  item('SUS', 'usability', 'sus-07', 'A maioria das pessoas aprenderia a usar o site rapidamente.'),
  item('SUS', 'usability', 'sus-08', 'Achei o site muito complicado de usar.', true),
  item('SUS', 'usability', 'sus-09', 'Me senti confiante usando o site.'),
  item('SUS', 'usability', 'sus-10', 'Precisei aprender muita coisa antes de conseguir usar o site.', true),
];

export const LIKERT_ITEMS: readonly LikertItem[] = [...CAREER_GAP_ITEMS, ...PATH_ITEMS, ...SUS_ITEMS];

/** O que a pessoa leva: a intenção depois de usar, que é o que a recomendação existe para mudar. */
export const OUTCOME_QUESTIONS: readonly ChoiceQuestion[] = [
  {
    id: 'next-action',
    label: 'Qual vai ser o seu primeiro passo agora?',
    choices: choices(
      ['comecar-construcao', 'começar uma construção da trilha'],
      ['estudar-recomendado', 'estudar o que foi marcado como "recomendado agora"'],
      ['ajustar-o-que-sei', 'ajustar o que eu disse que sei'],
      ['nada-por-enquanto', 'nada por enquanto'],
    ),
  },
];

/** Uma só, e opcional: a frase da pessoa sobre a lacuna que descobriu é a única evidência que uma
 *  escala não captura. O resto do método sai das escalas. */
export const OPEN_QUESTIONS: readonly OpenQuestion[] = [
  {
    id: 'lacuna-descoberta',
    label: 'Qual lacuna técnica você descobriu que não conhecia?',
    hint: 'Opcional, em uma frase.',
  },
];

export const CHOICE_QUESTIONS: readonly ChoiceQuestion[] = [...PARTICIPANT_QUESTIONS, ...USAGE_QUESTIONS, ...OUTCOME_QUESTIONS];

/** O que chega do navegador. `consent` precisa ser `true`: sem termo aceito, nada é gravado. */
export interface EvaluationAnswers {
  readonly consent: boolean;
  readonly participant: Readonly<Record<string, string>>;
  readonly answers: Readonly<Record<string, number>>;
  readonly comments: Readonly<Record<string, string>>;
}

export const MAX_COMMENT = 2_000;

export class InvalidEvaluation extends Error {}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function assertEvaluation(value: unknown): asserts value is EvaluationAnswers {
  if (!isRecord(value)) throw new InvalidEvaluation('resposta inválida');
  if (value.consent !== true) throw new InvalidEvaluation('sem consentimento');

  const participant = value.participant;
  if (!isRecord(participant)) throw new InvalidEvaluation('perfil inválido');
  for (const key of Object.keys(participant)) {
    if (!CHOICE_QUESTIONS.some((question) => question.id === key)) throw new InvalidEvaluation(`pergunta desconhecida: ${key}`);
  }
  for (const question of CHOICE_QUESTIONS) {
    const chosen = participant[question.id];
    if (!question.choices.some((choice) => choice.value === chosen)) {
      throw new InvalidEvaluation(`resposta inválida em ${question.id}`);
    }
  }

  const answers = value.answers;
  if (!isRecord(answers)) throw new InvalidEvaluation('escala inválida');
  for (const key of Object.keys(answers)) {
    if (!LIKERT_ITEMS.some((entry) => entry.id === key)) throw new InvalidEvaluation(`item desconhecido: ${key}`);
  }
  for (const entry of LIKERT_ITEMS) {
    const chosen = answers[entry.id];
    if (!Number.isInteger(chosen) || (chosen as number) < 1 || (chosen as number) > 5) {
      throw new InvalidEvaluation(`item sem resposta: ${entry.id}`);
    }
  }

  const comments = value.comments;
  if (!isRecord(comments)) throw new InvalidEvaluation('comentários inválidos');
  for (const [key, text] of Object.entries(comments)) {
    if (!OPEN_QUESTIONS.some((question) => question.id === key)) throw new InvalidEvaluation(`pergunta desconhecida: ${key}`);
    if (typeof text !== 'string' || text.length > MAX_COMMENT) throw new InvalidEvaluation(`comentário inválido: ${key}`);
  }
}

/**
 * Escore SUS, de 0 a 100 (Brooke, 1996): nos ímpares conta `resposta − 1`, nos pares
 * `5 − resposta`; a soma vai vezes 2,5. `undefined` quando falta algum dos dez itens.
 */
export function susScore(answers: Readonly<Record<string, number>>): number | undefined {
  let sum = 0;
  for (const [index, entry] of SUS_ITEMS.entries()) {
    const value = answers[entry.id];
    if (!Number.isInteger(value)) return undefined;
    sum += index % 2 === 0 ? value - 1 : 5 - value;
  }
  return sum * 2.5;
}
