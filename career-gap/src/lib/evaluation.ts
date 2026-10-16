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
 * manipulação; e itens sobre a qualidade do roadmap (INITIAL_SCOPE §19).
 * As traduções são do projeto; a versão validada em português do SUS, se o orientador exigir,
 * substitui o texto sem mudar o id.
 */

export const INSTRUMENT_VERSION = '2026.10.16-2';

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
    label: 'Sua faixa etária',
    choices: choices(
      ['ate-17', 'até 17 anos'],
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
      ['estudando-computacao', 'estudo computação ou área próxima (graduação ou técnico)'],
      ['estudando-outra-area', 'estudo outra área'],
      ['trabalhando-outra-area', 'trabalho em outra área e quero migrar'],
      ['procurando-primeira-vaga', 'procuro a primeira vaga ou estágio em desenvolvimento'],
      ['ja-trabalho-com-dev', 'já trabalho com desenvolvimento'],
      ['outra', 'outra situação'],
    ),
  },
  {
    id: 'experience',
    label: 'Há quanto tempo você programa',
    choices: choices(
      ['nunca', 'nunca programei'],
      ['menos-de-6-meses', 'menos de 6 meses'],
      ['6-meses-a-1-ano', 'de 6 meses a 1 ano'],
      ['1-a-2-anos', 'de 1 a 2 anos'],
      ['mais-de-2-anos', 'mais de 2 anos'],
    ),
  },
  {
    id: 'roadmaps',
    label: 'Você já usou outro roadmap ou guia de estudos (roadmap.sh, trilha de curso, lista de um canal)?',
    choices: choices(['nao', 'não'], ['sim-pouco', 'sim, por alto'], ['sim-bastante', 'sim, me guiei por um']),
  },
];

/** O uso que a pessoa fez antes de responder. As duas últimas são as medidas objetivas baratas
 *  da ADR-0007, aqui autodeclaradas: tempo até o próximo passo e itens irrelevantes. */
export const USAGE_QUESTIONS: readonly ChoiceQuestion[] = [
  {
    id: 'time-on-site',
    label: 'Quanto tempo você usou o Career Gap antes de responder?',
    choices: choices(
      ['menos-de-10-min', 'menos de 10 minutos'],
      ['10-a-30-min', 'de 10 a 30 minutos'],
      ['30-min-a-1-h', 'de 30 minutos a 1 hora'],
      ['mais-de-1-h', 'mais de 1 hora'],
      ['varios-dias', 'em vários dias'],
    ),
  },
  {
    id: 'time-to-next-step',
    label: 'Em quanto tempo você entendeu qual era o seu próximo passo?',
    choices: choices(
      ['na-hora', 'na hora, assim que a trilha abriu'],
      ['ate-2-min', 'em uns 2 minutos'],
      ['ate-5-min', 'em uns 5 minutos'],
      ['mais-de-5-min', 'demorou mais que isso'],
      ['nao-entendi', 'não cheguei a entender'],
    ),
  },
  {
    id: 'irrelevant-items',
    label: 'Quantos itens da trilha você considerou irrelevantes para você?',
    choices: choices(['nenhum', 'nenhum'], ['1-ou-2', '1 ou 2'], ['3-a-5', 'de 3 a 5'], ['mais-de-5', 'mais de 5']),
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
 * vem depois, por quê e o que posso ignorar. Cada item cobre um desses elos.
 */
export const CAREER_GAP_ITEMS: readonly LikertItem[] = [
  item('career-gap', 'path-clarity', 'caminho-claro', 'No Career Gap, consegui identificar claramente o caminho que tenho de seguir.'),
  item('career-gap', 'gap-discovery', 'lacunas-novas', 'Encontrei lacunas técnicas que eu não conhecia.'),
  item('career-gap', 'gap-coherence', 'gaps-fazem-sentido', 'As lacunas que a trilha apontou fazem sentido para mim.'),
  item('career-gap', 'assessment-fit', 'avaliacao-representou', 'As 6 perguntas representaram bem o que eu sei e o que ainda não sei.'),
  item('career-gap', 'where-am-i', 'onde-estou', 'Entendi em que ponto do caminho eu estou hoje.'),
  item('career-gap', 'can-build-now', 'construir-agora', 'Sei o que já consigo construir com o que sei hoje.'),
  item('career-gap', 'next-step-clarity', 'proximo-passo', 'Depois de usar a trilha, sei dizer qual é o meu próximo passo.'),
  item('career-gap', 'order-clarity', 'ordem-clara', 'A ordem sugerida, o que vem antes e o que vem depois, ficou clara.'),
  item('career-gap', 'what-to-ignore', 'o-que-ignorar', 'Sei o que posso deixar para depois sem prejuízo.'),
  item('career-gap', 'better-than-before', 'melhor-que-antes', 'Comparado com o jeito como eu decidia o que estudar antes, com o Career Gap ficou mais fácil decidir.'),
];

/**
 * Sobre a trilha recebida: qualidade do roadmap, ResQue e a checagem da manipulação por último.
 * Se a percepção de personalização não se mover, nada no ResQue é efeito do motor
 * (docs/DECISOES.md §1).
 */
export const PATH_ITEMS: readonly LikertItem[] = [
  item('roadmap', 'resource-fit', 'materiais-adequados', 'Os materiais indicados (vídeos, textos, exercícios) parecem adequados para o meu nível.'),
  item('roadmap', 'builds', 'construcoes-motivam', 'As construções ("você já consegue construir") me deram vontade de começar algo hoje.'),
  item('roadmap', 'unnecessary-topics', 'topicos-desnecessarios', 'Havia tópicos na trilha que considerei desnecessários para mim.', true),

  item('ResQue', 'perceived-accuracy', 'recomendado-corresponde', 'As competências marcadas como "recomendado agora" correspondem ao que eu preciso estudar.'),
  item('ResQue', 'perceived-accuracy', 'ja-sabe-bate', 'O que apareceu como "você já sabe" bate com o que eu realmente sei.'),
  item('ResQue', 'transparency', 'entendi-motivos', 'Entendi por que cada competência foi marcada como recomendada, "não agora" ou "falta base".'),
  item('ResQue', 'control', 'eu-decidia', 'Senti que eu decidia o que estudar; a trilha só sugeria.'),
  item('ResQue', 'control', 'facil-corrigir', 'Foi fácil corrigir o que o site achou que eu sabia.'),
  item('ResQue', 'information-sufficiency', 'informacao-suficiente', 'A trilha me deu informação suficiente para decidir o que estudar.'),
  item('ResQue', 'perceived-usefulness', 'ajudou-decidir', 'A trilha me ajudou a decidir o que estudar a seguir.'),
  item('ResQue', 'perceived-usefulness', 'menos-tempo-perdido', 'Com a trilha, acho que vou perder menos tempo com conteúdo de que não preciso.'),
  item('ResQue', 'confidence', 'confio', 'Confio nas recomendações da trilha.'),
  item('ResQue', 'satisfaction', 'satisfeito', 'No geral, estou satisfeito com a trilha que recebi.'),
  item('ResQue', 'use-intention', 'voltaria', 'Voltaria a usar o Career Gap para acompanhar meus estudos.'),
  item('ResQue', 'use-intention', 'indicaria', 'Indicaria o Career Gap para alguém começando em desenvolvimento web.'),

  item('manipulation-check', 'perceived-personalization', 'feita-para-meu-nivel', 'A trilha pareceu feita para o meu nível, não uma lista igual para todo mundo.'),
  item('manipulation-check', 'perceived-personalization', 'mudaria-com-respostas', 'As marcas da trilha mudariam se eu tivesse respondido as perguntas de outro jeito.'),
];

/** SUS (Brooke, 1996): dez itens, os pares invertidos. A ordem é parte do instrumento. */
export const SUS_ITEMS: readonly LikertItem[] = [
  item('SUS', 'usability', 'sus-01', 'Acho que gostaria de usar este site com frequência.'),
  item('SUS', 'usability', 'sus-02', 'Achei o site desnecessariamente complexo.', true),
  item('SUS', 'usability', 'sus-03', 'Achei o site fácil de usar.'),
  item('SUS', 'usability', 'sus-04', 'Acho que precisaria da ajuda de alguém com conhecimento técnico para conseguir usar o site.', true),
  item('SUS', 'usability', 'sus-05', 'Achei que as várias partes do site funcionam bem juntas.'),
  item('SUS', 'usability', 'sus-06', 'Achei que o site tem muita inconsistência.', true),
  item('SUS', 'usability', 'sus-07', 'Imagino que a maioria das pessoas aprenderia a usar este site rapidamente.'),
  item('SUS', 'usability', 'sus-08', 'Achei o site muito complicado de usar.', true),
  item('SUS', 'usability', 'sus-09', 'Me senti confiante usando o site.'),
  item('SUS', 'usability', 'sus-10', 'Precisei aprender várias coisas antes de conseguir usar o site.', true),
];

export const LIKERT_ITEMS: readonly LikertItem[] = [...CAREER_GAP_ITEMS, ...PATH_ITEMS, ...SUS_ITEMS];

/** O que a pessoa leva: a intenção depois de usar, que é o que a recomendação existe para mudar. */
export const OUTCOME_QUESTIONS: readonly ChoiceQuestion[] = [
  {
    id: 'next-action',
    label: 'Qual vai ser o seu primeiro passo depois de responder?',
    choices: choices(
      ['comecar-construcao', 'começar uma construção da trilha'],
      ['estudar-recomendado', 'estudar a competência marcada como "recomendado agora"'],
      ['ajustar-o-que-sei', 'ajustar o que eu disse que sei'],
      ['procurar-fora', 'procurar outro material fora do site'],
      ['nada-por-enquanto', 'nada por enquanto'],
    ),
  },
];

export const OPEN_QUESTIONS: readonly OpenQuestion[] = [
  {
    id: 'lacuna-descoberta',
    label: 'Qual lacuna técnica você descobriu que não conhecia?',
    hint: 'Em uma frase. Se não descobriu nenhuma, pode deixar em branco.',
  },
  { id: 'ajudou', label: 'O que mais ajudou você?' },
  { id: 'faltou', label: 'O que faltou, confundiu ou atrapalhou?' },
  { id: 'mais', label: 'Algo mais que queira dizer?', hint: 'Opcional.' },
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
