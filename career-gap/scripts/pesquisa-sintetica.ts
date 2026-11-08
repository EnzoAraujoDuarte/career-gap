import { existsSync } from 'node:fs';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { chromium, devices, type Browser, type Page } from 'playwright';
import { FIRST_WEB_ROLE } from '@/catalog/tracks';
import type { Db } from '@/db/client';
import { listEvaluations } from '@/db/evaluation';
import * as schema from '@/db/schema';
import {
  assertEvaluation,
  CAREER_GAP_ITEMS,
  CHOICE_QUESTIONS,
  LIKERT_ITEMS,
  OPEN_QUESTIONS,
  OUTCOME_QUESTIONS,
  PARTICIPANT_QUESTIONS,
  PATH_ITEMS,
  SUS_ITEMS,
  susScore,
  USAGE_QUESTIONS,
  type ChoiceQuestion,
  type EvaluationAnswers,
  type LikertItem,
} from '@/lib/evaluation';

/**
 * Responde /pesquisa 20 vezes pelo navegador, com personas SINTÉTICAS, para testar o fluxo
 * inteiro (sessão anônima, as 6 perguntas, o termo, o envio) e a exportação antes de haver
 * resposta de gente.
 *
 * Nunca é dado do TCC. Por isso só fala com o servidor local, só roda com o `.env.local` no
 * branch `dev` do Neon, e toda resposta leva `[sintético Sxx]` no texto livre: é por essa marca
 * que se separa na exportação (`pnpm db:respostas`).
 *
 * Uso, de dentro de career-gap/, com `pnpm dev` rodando:  pnpm pesquisa:sintetica
 */

const BASE_URL = 'http://localhost:3000';
const MARK = '[sintético';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL ausente no .env.local');
if (process.env.NEON_BRANCH !== 'dev') {
  throw new Error(`o .env.local aponta para o branch ${process.env.NEON_BRANCH ?? '?'}; resposta sintética só no dev`);
}

/** Posição da frase "consigo…" em cada uma das 6 perguntas; `null` é "Ainda não". */
type Statement = 0 | 1 | 2 | null;
type Trait = 'clareza' | 'ajuste' | 'utilidade' | 'descoberta' | 'motivacao' | 'uso';

interface Persona {
  readonly id: string;
  readonly device: string;
  /** As 6 perguntas e a ênfase. Sem perfil: olhou a trilha e foi direto responder. */
  readonly profile?: { readonly statements: readonly Statement[]; readonly emphasis: 'frontend' | 'backend' | null };
  readonly participant: Readonly<Record<string, string>>;
  /** Atitude de 1 a 5 em cada traço. Cada item da escala sai do traço dele, com ruído. */
  readonly mood: Readonly<Record<Trait, number>>;
  /** Quanto a pessoa oscila em torno da atitude: 0,3 responde quase tudo igual, 0,8 varia muito. */
  readonly spread?: number;
  /** Vazio: deixou a pergunta aberta em branco (a marca vai assim mesmo). */
  readonly comment: string;
}

const TRAIT_OF: Readonly<Record<string, Trait>> = {
  'caminho-claro': 'clareza',
  'lacunas-novas': 'descoberta',
  'onde-estou': 'clareza',
  'construir-agora': 'clareza',
  'proximo-passo': 'clareza',
  'o-que-ignorar': 'clareza',
  'nao-agora-util': 'ajuste',
  'melhor-que-antes': 'utilidade',
  'construcoes-motivam': 'motivacao',
  'topicos-desnecessarios': 'ajuste',
  'recomendado-corresponde': 'ajuste',
  'ja-sabe-bate': 'ajuste',
  'entendi-motivos': 'clareza',
  'eu-decidia': 'uso',
  'ajudou-decidir': 'utilidade',
  confio: 'ajuste',
  satisfeito: 'utilidade',
  indicaria: 'utilidade',
  'feita-para-meu-nivel': 'ajuste',
  'mudaria-com-respostas': 'ajuste',
  'sus-01': 'utilidade',
  'sus-02': 'uso',
  'sus-03': 'uso',
  'sus-04': 'uso',
  'sus-05': 'uso',
  'sus-06': 'uso',
  'sus-07': 'uso',
  'sus-08': 'uso',
  'sus-09': 'uso',
  'sus-10': 'uso',
};

/** idade, situação, tempo programando, tempo de uso, tempo até o próximo passo, primeiro passo. */
const who = (...values: readonly [string, string, string, string, string, string]) =>
  Object.fromEntries(CHOICE_QUESTIONS.map((question, index) => [question.id, values[index]]));

const mood = (clareza: number, ajuste: number, utilidade: number, descoberta: number, motivacao: number, uso: number) => ({
  clareza,
  ajuste,
  utilidade,
  descoberta,
  motivacao,
  uso,
});

// As 6 perguntas, na ordem: programar, HTML e CSS, JavaScript, terminal e Git, servidor e dados,
// projeto de ponta a ponta. O comentário de cada persona fala de uma lacuna que o perfil dela abre.
const PERSONAS: readonly Persona[] = [
  {
    id: 'S01',
    device: 'Pixel 7',
    profile: { statements: [1, 0, 0, 0, null, null], emphasis: null },
    participant: who('18-24', 'estudando-computacao', 'menos-de-1-ano', '10-a-30-min', 'poucos-minutos', 'estudar-recomendado'),
    mood: mood(4.2, 4.0, 4.2, 4.4, 3.8, 4.1),
    comment: 'Acessibilidade. Achava que era detalhe pra depois, não que já entrava no básico de HTML.',
  },
  {
    id: 'S02',
    device: 'Galaxy S9+',
    profile: { statements: [null, null, null, null, null, null], emphasis: null },
    participant: who('25-34', 'migrando-de-outra-area', 'nunca', 'menos-de-10-min', 'poucos-minutos', 'estudar-recomendado'),
    mood: mood(4.0, 3.6, 4.3, 4.0, 3.4, 3.6),
    comment: 'Pra mim quase tudo é novo, mas não imaginava que terminal e Git vinham logo no começo.',
  },
  {
    id: 'S03',
    device: 'Desktop Chrome',
    profile: { statements: [2, 2, 2, 1, 0, 0], emphasis: 'frontend' },
    participant: who('18-24', 'procurando-primeira-vaga', '1-a-2-anos', 'mais-de-30-min', 'na-hora', 'comecar-construcao'),
    mood: mood(4.6, 4.4, 4.3, 3.9, 4.5, 4.5),
    comment: 'Testes automatizados. Já coloquei uns projetos no ar mas nunca escrevi um teste sequer',
  },
  {
    id: 'S04',
    device: 'Galaxy S9+',
    profile: { statements: [0, 1, 0, 0, null, null], emphasis: null },
    participant: who('35-44', 'migrando-de-outra-area', 'menos-de-1-ano', '10-a-30-min', 'demorou', 'estudar-recomendado'),
    mood: mood(3.0, 3.5, 3.4, 3.8, 3.0, 3.1),
    comment: 'Que depurar é algo que se aprende. Eu ia na tentativa e erro até funcionar.',
  },
  {
    id: 'S05',
    device: 'Desktop Chrome',
    profile: { statements: [2, 1, 1, 2, 2, 1], emphasis: 'backend' },
    participant: who('25-34', 'ja-trabalho-com-dev', 'mais-de-2-anos', 'menos-de-10-min', 'na-hora', 'nada-por-enquanto'),
    mood: mood(4.0, 3.2, 2.9, 2.6, 2.8, 4.2),
    comment: 'Nada muito novo pra mim, mas ficou claro que componentes e estado no front são um buraco meu.',
  },
  {
    id: 'S06',
    device: 'Pixel 5',
    profile: { statements: [0, 0, null, null, null, null], emphasis: null },
    participant: who('ate-17', 'estudando-computacao', 'menos-de-1-ano', 'mais-de-30-min', 'poucos-minutos', 'comecar-construcao'),
    mood: mood(4.3, 4.2, 4.5, 4.5, 4.7, 4.4),
    spread: 0.7,
    comment: 'nao sabia q precisava aprender git antes de fazer projeto kkk achei q era coisa de empresa',
  },
  {
    id: 'S07',
    device: 'Pixel 7',
    profile: { statements: [1, 1, 1, 0, 0, 0], emphasis: 'frontend' },
    participant: who('25-34', 'procurando-primeira-vaga', '1-a-2-anos', '10-a-30-min', 'poucos-minutos', 'estudar-recomendado'),
    mood: mood(3.9, 3.7, 3.8, 4.1, 3.6, 3.8),
    comment: 'Ler a documentação oficial sozinho. No bootcamp a gente só seguia o que o instrutor passava.',
  },
  {
    id: 'S08',
    device: 'Desktop Chrome',
    profile: { statements: [2, 1, 2, 2, 1, 1], emphasis: 'backend' },
    participant: who('18-24', 'estudando-computacao', 'mais-de-2-anos', 'mais-de-30-min', 'na-hora', 'comecar-construcao'),
    mood: mood(4.4, 4.1, 3.9, 3.3, 4.1, 4.6),
    comment: 'Autenticação. Já fiz API com banco, mas login com senha em hash nunca implementei direito.',
  },
  {
    id: 'S09',
    device: 'Galaxy S9+',
    participant: who('45-ou-mais', 'migrando-de-outra-area', 'nunca', 'menos-de-10-min', 'nao-entendi', 'nada-por-enquanto'),
    mood: mood(2.4, 2.5, 2.8, 3.0, 2.5, 2.8),
    comment: '',
  },
  {
    id: 'S10',
    device: 'Pixel 7',
    profile: { statements: [1, 2, 1, 0, null, 0], emphasis: 'frontend' },
    participant: who('18-24', 'procurando-primeira-vaga', 'menos-de-1-ano', '10-a-30-min', 'poucos-minutos', 'comecar-construcao'),
    mood: mood(4.1, 3.9, 4.0, 4.2, 4.4, 4.0),
    comment: 'HTTP: eu usava fetch sem saber o que era método ou status, só copiava do exemplo.',
  },
  {
    id: 'S11',
    device: 'Desktop Chrome',
    profile: { statements: [1, 1, 1, 1, 1, 1], emphasis: null },
    participant: who('25-34', 'ja-trabalho-com-dev', '1-a-2-anos', 'menos-de-10-min', 'na-hora', 'ajustar-o-que-sei'),
    mood: mood(3.8, 3.0, 3.4, 3.0, 3.1, 4.0),
    comment: 'Revisão de código. No trabalho revisam o meu, mas eu nunca revisei o de ninguém.',
  },
  {
    id: 'S12',
    device: 'Pixel 5',
    profile: { statements: [2, 1, 1, 1, 1, null], emphasis: 'backend' },
    participant: who('18-24', 'estudando-computacao', '1-a-2-anos', 'varios-dias', 'na-hora', 'comecar-construcao'),
    mood: mood(4.5, 4.5, 4.6, 4.0, 4.6, 4.5),
    comment: 'Deploy. Fiz um monte de trabalho da faculdade e nenhum está publicado em lugar nenhum.',
  },
  {
    id: 'S13',
    device: 'Desktop Chrome',
    participant: who('35-44', 'outra', 'menos-de-1-ano', 'menos-de-10-min', 'poucos-minutos', 'nada-por-enquanto'),
    mood: mood(3.4, 2.8, 3.2, 2.9, 2.7, 3.9),
    comment: 'Vim conhecer o site para indicar aos meus alunos do técnico, então não respondi as perguntas de nível.',
  },
  {
    id: 'S14',
    device: 'Pixel 7',
    profile: { statements: [0, 2, 0, 0, null, null], emphasis: 'frontend' },
    participant: who('25-34', 'migrando-de-outra-area', 'menos-de-1-ano', '10-a-30-min', 'poucos-minutos', 'estudar-recomendado'),
    mood: mood(4.0, 4.3, 4.1, 4.3, 3.9, 4.3),
    comment: 'Sou designer e achava que HTML e CSS eram o difícil. A lógica de programação é que vai me segurar.',
  },
  {
    id: 'S15',
    device: 'Galaxy S9+',
    profile: { statements: [1, 1, 2, 1, 0, 1], emphasis: 'frontend' },
    participant: who('18-24', 'procurando-primeira-vaga', '1-a-2-anos', 'mais-de-30-min', 'demorou', 'ajustar-o-que-sei'),
    mood: mood(3.2, 3.3, 3.5, 3.6, 3.7, 3.3),
    spread: 0.8,
    comment: 'Modelagem de banco. Mas demorei pra entender por que meu caminho começa em programação se eu já uso React.',
  },
  {
    id: 'S16',
    device: 'Pixel 5',
    profile: { statements: [0, 0, 0, null, null, null], emphasis: null },
    participant: who('25-34', 'estudando-computacao', 'menos-de-1-ano', '10-a-30-min', 'poucos-minutos', 'comecar-construcao'),
    mood: mood(4.1, 4.0, 4.1, 4.0, 4.0, 4.0),
    spread: 0.3,
    comment: 'Linha de comando.',
  },
  {
    id: 'S17',
    device: 'Galaxy S9+',
    profile: { statements: [null, 0, null, null, null, null], emphasis: null },
    participant: who('18-24', 'outra', 'nunca', 'menos-de-10-min', 'poucos-minutos', 'estudar-recomendado'),
    mood: mood(3.7, 3.6, 3.9, 4.0, 3.5, 3.7),
    comment: 'Eu achava que fazer página em HTML já era programar. Lógica é outra coisa e eu nunca tinha visto.',
  },
  {
    id: 'S18',
    device: 'Desktop Chrome',
    profile: { statements: [2, 2, 2, 2, 2, 2], emphasis: 'frontend' },
    participant: who('25-34', 'ja-trabalho-com-dev', 'mais-de-2-anos', 'menos-de-10-min', 'na-hora', 'nada-por-enquanto'),
    mood: mood(4.3, 3.6, 2.6, 1.9, 2.4, 4.6),
    comment: 'Nenhuma, já trabalho na área há uns anos. Teria me ajudado bastante quando comecei.',
  },
  {
    id: 'S19',
    device: 'Pixel 7',
    participant: who('18-24', 'estudando-computacao', 'menos-de-1-ano', '10-a-30-min', 'demorou', 'estudar-recomendado'),
    mood: mood(3.1, 2.9, 3.4, 3.5, 3.4, 3.6),
    comment: 'Não fiz as 6 perguntas, mas olhando a trilha vi que nunca estudei SQL.',
  },
  {
    id: 'S20',
    device: 'Pixel 5',
    profile: { statements: [1, 1, 1, 1, 1, 0], emphasis: 'backend' },
    participant: who('prefiro-nao-dizer', 'procurando-primeira-vaga', '1-a-2-anos', 'varios-dias', 'poucos-minutos', 'comecar-construcao'),
    mood: mood(4.4, 4.2, 4.4, 4.1, 4.3, 4.2),
    comment: 'Comunicação técnica, tipo escrever README e pedir ajuda explicando o que tentei. Achava que era só código.',
  },
];

/** Sorteio com semente (mulberry32): a mesma persona responde igual a cada execução. */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function traitOf(item: LikertItem): Trait {
  const trait = TRAIT_OF[item.id];
  if (!trait) throw new Error(`item sem traço: ${item.id} (o instrumento mudou?)`);
  return trait;
}

function payloadOf(persona: Persona, random: () => number): EvaluationAnswers {
  const spread = persona.spread ?? 0.6;
  const answers = Object.fromEntries(
    LIKERT_ITEMS.map((item) => {
      const attitude = persona.mood[traitOf(item)];
      const leaning = item.reverse ? 6 - attitude : attitude;
      const value = Math.round(leaning + (random() * 2 - 1) * spread);
      return [item.id, Math.min(5, Math.max(1, value))];
    }),
  );
  const comment = `${MARK} ${persona.id}] ${persona.comment}`.trim();
  return {
    consent: true,
    participant: persona.participant,
    answers,
    comments: Object.fromEntries(OPEN_QUESTIONS.map((question) => [question.id, comment])),
  };
}

const pause = (page: Page, random: () => number, min: number, max: number) =>
  page.waitForTimeout(min + random() * (max - min));

async function answerProfile(page: Page, profile: NonNullable<Persona['profile']>, random: () => number) {
  await page.getByRole('link', { name: 'Responder as 6 perguntas' }).first().click();
  await page.waitForURL('**/avaliacao');
  await page.waitForLoadState('networkidle');
  for (const [index, question] of FIRST_WEB_ROLE.quickAssessment.entries()) {
    await page.getByRole('heading', { name: question.title, exact: true }).waitFor();
    await pause(page, random, 700, 2200);
    const chosen = profile.statements[index];
    const label = chosen === null || chosen === undefined ? 'Ainda não' : question.statements[chosen]?.canDo;
    if (!label) throw new Error(`a pergunta ${question.title} não tem a frase ${chosen}`);
    await page.getByRole('button', { name: label, exact: true }).click();
  }

  await page.getByRole('heading', { name: 'Já tem ideia de qual lado quer seguir?' }).waitFor();
  await pause(page, random, 900, 2500);
  const emphasis = FIRST_WEB_ROLE.emphases.find((entry) => entry.id === profile.emphasis);
  const label = emphasis ? emphasis.name.replace('Ênfase em ', '') : 'Ainda não sei';
  await page.getByRole('button').filter({ has: page.getByText(label, { exact: true }) }).click();
  await page.waitForURL('**/trilha');
  // Cada resposta sobe ao banco; a pesquisa lê o perfil de lá, então a subida termina antes.
  await page.waitForLoadState('networkidle');
}

async function choose(page: Page, question: ChoiceQuestion, value: string, random: () => number) {
  await pause(page, random, 400, 1400);
  await page.locator(`input[name="p:${question.id}"][value="${value}"]`).check();
}

async function rate(page: Page, items: readonly LikertItem[], answers: Readonly<Record<string, number>>, random: () => number) {
  for (const item of items) {
    await pause(page, random, 120, 600);
    await page.locator(`label:has(input[name="a:${item.id}"][value="${answers[item.id]}"])`).click();
  }
}

/** Preenche na ordem da tela e só volta depois do "Obrigado.": a próxima persona espera esta. */
async function answerEvaluation(page: Page, payload: EvaluationAnswers, random: () => number) {
  await page.goto(`${BASE_URL}/pesquisa`, { waitUntil: 'networkidle' });
  const consent = page.locator('input[name="consent"]');
  await consent.waitFor();
  await pause(page, random, 1500, 4000);
  await consent.check();

  for (const question of [...PARTICIPANT_QUESTIONS, ...USAGE_QUESTIONS]) {
    await choose(page, question, payload.participant[question.id], random);
  }
  await rate(page, CAREER_GAP_ITEMS, payload.answers, random);
  for (const question of OUTCOME_QUESTIONS) await choose(page, question, payload.participant[question.id], random);
  await rate(page, PATH_ITEMS, payload.answers, random);
  await rate(page, SUS_ITEMS, payload.answers, random);

  for (const question of OPEN_QUESTIONS) {
    await pause(page, random, 800, 2500);
    await page
      .locator(`textarea[name="c:${question.id}"]`)
      .pressSequentially(payload.comments[question.id], { delay: 30 + random() * 50 });
  }

  await pause(page, random, 500, 1500);
  await page.getByRole('button', { name: 'Enviar respostas' }).click();
  const thanks = page.getByRole('heading', { name: 'Obrigado.' });
  // Só o alerta do formulário: o anunciador de rota do Next também tem papel de alerta.
  const problem = page.locator('form').getByRole('alert');
  await thanks.or(problem).waitFor();
  if (await problem.isVisible()) throw new Error(`o envio falhou: ${await problem.innerText()}`);
}

async function answerAs(browser: Browser, persona: Persona, payload: EvaluationAnswers, random: () => number) {
  const descriptor = devices[persona.device];
  if (!descriptor) throw new Error(`aparelho desconhecido: ${persona.device}`);
  // Um contexto por persona: cookies e localStorage novos, então cada uma vira uma sessão anônima.
  const context = await browser.newContext({ ...descriptor, locale: 'pt-BR', timezoneId: 'America/Sao_Paulo' });
  const page = await context.newPage();
  page.setDefaultTimeout(30_000);
  try {
    await page.goto(`${BASE_URL}/trilha`, { waitUntil: 'networkidle' });
    await pause(page, random, 1200, 3500);
    if (persona.profile) await answerProfile(page, persona.profile, random);
    await answerEvaluation(page, payload, random);
  } finally {
    await context.close();
  }
}

/** Confere no banco cada resposta enviada nesta execução, pela marca da persona. */
async function verify(sent: ReadonlyMap<string, EvaluationAnswers>, since: Date): Promise<number> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const db = drizzle({ client: pool, schema }) as unknown as Db;
    const [open] = OPEN_QUESTIONS;
    const stored = (await listEvaluations(db)).filter(
      (response) => new Date(response.submittedAt) >= since && response.comments[open.id]?.startsWith(MARK),
    );
    let problems = 0;
    for (const persona of PERSONAS) {
      const payload = sent.get(persona.id);
      if (!payload) continue;
      const matches = stored.filter((response) => response.comments[open.id].startsWith(`${MARK} ${persona.id}]`));
      const response = matches.at(-1);
      const differences = !response
        ? ['não está no banco']
        : [
            ...(matches.length > 1 ? [`${matches.length} linhas`] : []),
            ...CHOICE_QUESTIONS.filter((question) => response.participant[question.id] !== payload.participant[question.id]).map(
              (question) => question.id,
            ),
            ...LIKERT_ITEMS.filter((item) => response.answers[item.id] !== payload.answers[item.id]).map((item) => item.id),
            ...(response.comments[open.id] === payload.comments[open.id] ? [] : [open.id]),
            ...(response.context.hasProfile === Boolean(persona.profile) ? [] : ['tem_perfil']),
            ...(response.context.emphasisId === (persona.profile?.emphasis ?? undefined) ? [] : ['enfase']),
          ];
      if (differences.length > 0) problems += 1;
      console.log(
        `${persona.id} ${differences.length === 0 ? 'confere' : `DIFERE: ${differences.join(', ')}`}` +
          (response ? ` · perfil ${response.context.hasProfile ? 'sim' : 'não'} · SUS ${susScore(response.answers)}` : ''),
      );
    }
    return problems;
  } finally {
    await pool.end();
  }
}

async function main() {
  const payloads = new Map(PERSONAS.map((persona, index) => [persona.id, payloadOf(persona, seeded(index + 1))]));
  // Valida com a mesma regra do servidor antes de abrir o navegador: persona errada para aqui.
  for (const payload of payloads.values()) assertEvaluation(payload);

  const since = new Date();
  const browser = await chromium.launch();
  const sent = new Map<string, EvaluationAnswers>();
  try {
    for (const [index, persona] of PERSONAS.entries()) {
      const payload = payloads.get(persona.id)!;
      const started = Date.now();
      await answerAs(browser, persona, payload, seeded(1000 + index));
      sent.set(persona.id, payload);
      console.log(`${persona.id} enviada (${persona.device}, ${Math.round((Date.now() - started) / 1000)} s)`);
    }
  } finally {
    await browser.close();
  }

  console.log(`\nconferindo no branch ${process.env.NEON_BRANCH}:`);
  const problems = await verify(sent, since);
  console.log(problems === 0 ? `${sent.size} de ${PERSONAS.length} respostas conferem.` : `${problems} resposta(s) não conferem.`);
  if (problems > 0) process.exitCode = 1;
}

main();
