import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import { LEVELS, levelIndex, type CompetencyId, type Level, type UserProfile } from '@/domain/model';

/**
 * O estado de uma pessoa: o que ela diz que sabe, o que quer e o que estudou.
 *
 * Vive no navegador sempre, e também no Postgres quando o banco está ligado (docs/PLANO-FASE4.md
 * §5). Cada pedaço carrega `updatedAt`: quando o mesmo pedaço existe nos dois lados, ganha o mais
 * recente. É a regra mais simples que não perde a escrita de quem estudou offline.
 */

export interface StoredProfile {
  readonly trackId: string;
  readonly emphasisId?: string;
  /** Linguagem de servidor escolhida; só reordena materiais (ADR-0014). */
  readonly technologyId?: string;
  readonly levels: Readonly<Record<string, Level>>;
  readonly updatedAt?: string;
}

/** Autoavaliação vira perfil do domínio. Tudo aqui é `self-report`: a origem da evidência
 *  é o que decide a confiança, e nenhuma tela pode mentir sobre isso (ADR-0003).
 *
 *  A linguagem do servidor fica de fora de propósito. O seletor saiu da trilha (PR #18) e não há
 *  outro lugar para vê-la ou trocá-la; usar o valor antigo reordenava materiais e entrava no prompt
 *  de IA sem a pessoa saber por quê. Ela continua guardada, e volta a contar quando houver onde
 *  escolher (ADR-0014, nota de 2026-10-17). */
export function toUserProfile(profile: StoredProfile, id = 'local'): UserProfile {
  return {
    id,
    trackId: profile.trackId,
    emphasisId: profile.emphasisId,
    competencies: Object.entries(profile.levels)
      .filter(([, level]) => level !== 'L0')
      .map(([competency, level]) => ({ competency, level, evidence: 'self-report' as const })),
  };
}

const targetIn = (trackId: string, competency: CompetencyId): Level | undefined =>
  CATALOG.tracks.get(trackId)?.requirements.find((item) => item.competency === competency)?.targetLevel;

/**
 * Concluir uma estação: a pessoa diz que já faz o que a vaga pede ali, sem precisar ver todos os
 * materiais. É autodeclaração, como as 6 perguntas (ADR-0003), numa competência só: sobe ao
 * nível-alvo e devolve o nível de antes, para o desfazer (ADR-0017). Sem perfil, começa um com
 * essa competência e nada mais. `undefined` quando não há o que mudar.
 */
export function concludeCompetency(
  profile: StoredProfile | undefined,
  competency: CompetencyId,
): { readonly profile: StoredProfile; readonly previous: Level } | undefined {
  const base: StoredProfile = profile ?? { trackId: FIRST_WEB_ROLE.id, levels: {} };
  const target = targetIn(base.trackId, competency);
  if (!target) return undefined;
  const previous = base.levels[competency] ?? 'L0';
  if (levelIndex(previous) >= levelIndex(target)) return undefined;
  return { profile: { ...base, levels: { ...base.levels, [competency]: target } }, previous };
}

/**
 * Reabrir: volta ao nível de antes de concluir. Sem ele (a estação veio concluída pelas 6
 * perguntas, ou o navegador esqueceu), desce um degrau abaixo do alvo, o bastante para a estação
 * voltar a contar como lacuna.
 */
export function reopenCompetency(
  profile: StoredProfile,
  competency: CompetencyId,
  previous?: Level,
): StoredProfile | undefined {
  const target = targetIn(profile.trackId, competency);
  if (!target) return undefined;
  if (levelIndex(profile.levels[competency] ?? 'L0') < levelIndex(target)) return undefined;
  const below = LEVELS[Math.max(0, levelIndex(target) - 1)];
  const back = previous && levelIndex(previous) < levelIndex(target) ? previous : below;
  return { ...profile, levels: { ...profile.levels, [competency]: back } };
}

/** Respondeu as 6 perguntas: toda competência que elas cobrem tem nível guardado. Um perfil
 *  que nasceu de concluir estações tem só as estações concluídas. */
export function answeredEveryQuestion(profile: StoredProfile): boolean {
  const track = CATALOG.tracks.get(profile.trackId);
  return Boolean(
    track?.quickAssessment.every((question) =>
      question.statements.every((statement) => statement.competencies.every((id) => id in profile.levels)),
    ),
  );
}

export interface Goals {
  /** Por que a pessoa está fazendo isso, com as palavras dela. */
  readonly purpose: string;
  /** Aonde quer chegar — meta de carreira, em texto livre. */
  readonly careerGoal: string;
  /** AAAA-MM. */
  readonly targetMonth?: string;
  readonly updatedAt: string;
}

/** Um recurso que a pessoa guardou, abriu ou concluiu. Datas ISO; ausente = não aconteceu. */
export interface ResourceProgress {
  readonly savedAt?: string;
  readonly startedAt?: string;
  readonly completedAt?: string;
  readonly updatedAt: string;
}

export type ProgressMap = Readonly<Record<string, ResourceProgress>>;

/**
 * Critérios de saída que a pessoa marcou numa competência, num nível. Marcar NUNCA muda o nível
 * (docs/DECISOES.md §3): torna o progresso visível, e o nível só muda pela autoavaliação.
 */
export interface CriteriaChecks {
  /** Índices em `exitCriteria` do nível. */
  readonly checked: readonly number[];
  readonly updatedAt: string;
}

/** Chave `competência@nível`: o mesmo critério não vale para outro nível-alvo. */
export type CriteriaMap = Readonly<Record<string, CriteriaChecks>>;

export const criteriaKey = (competency: string, level: Level) => `${competency}@${level}`;

/** Os passos marcados de uma construção moram no mesmo mapa, com a chave `build:<id>@steps`:
 *  a tabela guarda "índices marcados numa lista do catálogo", e é isso que um passo é. */
export const buildStepsKey = (buildId: string) => `${BUILD_PROGRESS_PREFIX}${buildId}@steps`;

export interface UserState {
  readonly profile?: StoredProfile;
  readonly goals?: Goals;
  readonly progress: ProgressMap;
  readonly criteria: CriteriaMap;
}

/** O que sobe para o banco numa gravação: só os pedaços que mudaram. */
export interface UserStatePatch {
  readonly profile?: StoredProfile;
  readonly goals?: Goals;
  readonly progress?: ProgressMap;
  readonly criteria?: CriteriaMap;
}

const newer = <T extends { readonly updatedAt?: string }>(a?: T, b?: T): T | undefined =>
  !a ? b : !b ? a : (b.updatedAt ?? '') > (a.updatedAt ?? '') ? b : a;

export interface Merge {
  /** O que o navegador deve passar a guardar. */
  readonly local: UserState;
  /** O que o servidor ainda não tem, ou tem mais velho. */
  readonly push: UserStatePatch & { readonly progress: ProgressMap; readonly criteria: CriteriaMap };
}

/** Mapa chave → pedaço com `updatedAt`: ganha o mais recente de cada chave. */
function mergeMap<T extends { readonly updatedAt: string }>(
  local: Readonly<Record<string, T>>,
  remote: Readonly<Record<string, T>>,
) {
  const merged: Record<string, T> = { ...remote };
  const push: Record<string, T> = {};
  for (const [key, entry] of Object.entries(local)) {
    const winner = newer(remote[key], entry)!;
    merged[key] = winner;
    if (winner === entry && entry !== remote[key]) push[key] = entry;
  }
  return { merged, push };
}

/** Junta o que está no navegador com o que está no banco, pedaço a pedaço. */
export function mergeUserState(local: UserState, remote: UserState): Merge {
  const profile = newer(remote.profile, local.profile);
  const goals = newer(remote.goals, local.goals);
  const progress = mergeMap(local.progress, remote.progress);
  const criteria = mergeMap(local.criteria, remote.criteria);

  return {
    local: { profile, goals, progress: progress.merged, criteria: criteria.merged },
    push: {
      profile: profile && profile === local.profile && profile !== remote.profile ? profile : undefined,
      goals: goals && goals === local.goals && goals !== remote.goals ? goals : undefined,
      progress: progress.push,
      criteria: criteria.push,
    },
  };
}

// ---------------------------------------------------------------------------
// Validação: tudo o que chega ao servidor vem do navegador, e o navegador é de quem o usa.
// ---------------------------------------------------------------------------

const MAX_TEXT = 1_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
/** Progresso guarda recursos e construções na mesma tabela; a construção leva prefixo. */
export const BUILD_PROGRESS_PREFIX = 'build:';
export const buildProgressKey = (buildId: string) => `${BUILD_PROGRESS_PREFIX}${buildId}`;
const PROGRESS_IDS = new Set([
  ...CATALOG.resources.map((resource) => resource.id),
  ...CATALOG.builds.map((build) => buildProgressKey(build.id)),
]);
export const PROGRESS_ID_COUNT = PROGRESS_IDS.size;

const isDate = (value: unknown): value is string => typeof value === 'string' && ISO_DATE.test(value);
const isOptionalDate = (value: unknown) => value === undefined || value === null || isDate(value);
const isText = (value: unknown): value is string => typeof value === 'string' && value.length <= MAX_TEXT;

export class InvalidUserState extends Error {}

export function assertProfile(value: unknown): asserts value is StoredProfile {
  const profile = value as StoredProfile;
  const track = CATALOG.tracks.get(profile?.trackId);
  if (!track) throw new InvalidUserState('trilha desconhecida');
  if (profile.emphasisId && !track.emphases.some((emphasis) => emphasis.id === profile.emphasisId)) {
    throw new InvalidUserState('ênfase desconhecida');
  }
  if (profile.technologyId && !track.stacks.some((stack) => stack.technology === profile.technologyId)) {
    throw new InvalidUserState('linguagem desconhecida');
  }
  if (!isOptionalDate(profile.updatedAt)) throw new InvalidUserState('data inválida');
  const required = new Set(track.requirements.map((item) => item.competency));
  for (const [competency, level] of Object.entries(profile.levels ?? {})) {
    if (!required.has(competency)) throw new InvalidUserState(`competência fora da trilha: ${competency}`);
    if (!LEVELS.includes(level)) throw new InvalidUserState(`nível inválido: ${level}`);
  }
}

export function assertGoals(value: unknown): asserts value is Goals {
  const goals = value as Goals;
  if (!isText(goals?.purpose) || !isText(goals.careerGoal)) throw new InvalidUserState('texto inválido');
  if (goals.targetMonth !== undefined && goals.targetMonth !== null && !MONTH.test(goals.targetMonth)) {
    throw new InvalidUserState('mês inválido');
  }
  if (!isDate(goals.updatedAt)) throw new InvalidUserState('data inválida');
}

export function assertProgress(resourceId: unknown, value: unknown): asserts value is ResourceProgress {
  if (typeof resourceId !== 'string' || !PROGRESS_IDS.has(resourceId)) {
    throw new InvalidUserState('recurso desconhecido');
  }
  const entry = value as ResourceProgress;
  if (!isOptionalDate(entry?.savedAt) || !isOptionalDate(entry.startedAt) || !isOptionalDate(entry.completedAt)) {
    throw new InvalidUserState('data inválida');
  }
  if (!isDate(entry.updatedAt)) throw new InvalidUserState('data inválida');
}

/** A lista do catálogo que uma chave de critério aponta: critérios de saída ou passos. */
function criteriaListOf(key: unknown): readonly string[] | undefined {
  if (typeof key !== 'string') return undefined;
  const [subject, level] = key.split('@');
  if (subject.startsWith(BUILD_PROGRESS_PREFIX)) {
    const build = CATALOG.builds.find((candidate) => candidate.id === subject.slice(BUILD_PROGRESS_PREFIX.length));
    return level === 'steps' ? build?.steps : undefined;
  }
  return CATALOG.competencies.get(subject)?.levels[level as Level]?.exitCriteria;
}

export function assertCriteria(key: unknown, value: unknown): asserts value is CriteriaChecks {
  const criteria = criteriaListOf(key);
  if (!criteria) throw new InvalidUserState('critério desconhecido');
  const entry = value as CriteriaChecks;
  const checked = Array.isArray(entry?.checked) ? entry.checked : undefined;
  const valid =
    checked !== undefined &&
    new Set(checked).size === checked.length &&
    checked.every((index) => Number.isInteger(index) && index >= 0 && index < criteria.length);
  if (!valid) throw new InvalidUserState('critério fora do intervalo');
  if (!isDate(entry.updatedAt)) throw new InvalidUserState('data inválida');
}
