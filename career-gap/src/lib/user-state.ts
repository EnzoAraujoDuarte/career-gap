import { CATALOG } from '@/catalog';
import { LEVELS, type Level, type UserProfile } from '@/domain/model';

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
  readonly levels: Readonly<Record<string, Level>>;
  readonly updatedAt?: string;
}

/** Autoavaliação vira perfil do domínio. Tudo aqui é `self-report`: a origem da evidência
 *  é o que decide a confiança, e nenhuma tela pode mentir sobre isso (ADR-0003). */
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

export interface UserState {
  readonly profile?: StoredProfile;
  readonly goals?: Goals;
  readonly progress: ProgressMap;
}

/** O que sobe para o banco numa gravação: só os pedaços que mudaram. */
export interface UserStatePatch {
  readonly profile?: StoredProfile;
  readonly goals?: Goals;
  readonly progress?: ProgressMap;
}

const newer = <T extends { readonly updatedAt?: string }>(a?: T, b?: T): T | undefined =>
  !a ? b : !b ? a : (b.updatedAt ?? '') > (a.updatedAt ?? '') ? b : a;

export interface Merge {
  /** O que o navegador deve passar a guardar. */
  readonly local: UserState;
  /** O que o servidor ainda não tem, ou tem mais velho. */
  readonly push: UserStatePatch & { readonly progress: ProgressMap };
}

/** Junta o que está no navegador com o que está no banco, pedaço a pedaço. */
export function mergeUserState(local: UserState, remote: UserState): Merge {
  const profile = newer(remote.profile, local.profile);
  const goals = newer(remote.goals, local.goals);

  const progress: Record<string, ResourceProgress> = { ...remote.progress };
  const pushProgress: Record<string, ResourceProgress> = {};
  for (const [id, entry] of Object.entries(local.progress)) {
    const winner = newer(remote.progress[id], entry)!;
    progress[id] = winner;
    if (winner === entry && entry !== remote.progress[id]) pushProgress[id] = entry;
  }

  return {
    local: { profile, goals, progress },
    push: {
      profile: profile && profile === local.profile && profile !== remote.profile ? profile : undefined,
      goals: goals && goals === local.goals && goals !== remote.goals ? goals : undefined,
      progress: pushProgress,
    },
  };
}

// ---------------------------------------------------------------------------
// Validação: tudo o que chega ao servidor vem do navegador, e o navegador é de quem o usa.
// ---------------------------------------------------------------------------

const MAX_TEXT = 1_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const RESOURCE_IDS = new Set(CATALOG.resources.map((resource) => resource.id));

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
  if (typeof resourceId !== 'string' || !RESOURCE_IDS.has(resourceId)) {
    throw new InvalidUserState('recurso desconhecido');
  }
  const entry = value as ResourceProgress;
  if (!isOptionalDate(entry?.savedAt) || !isOptionalDate(entry.startedAt) || !isOptionalDate(entry.completedAt)) {
    throw new InvalidUserState('data inválida');
  }
  if (!isDate(entry.updatedAt)) throw new InvalidUserState('data inválida');
}
