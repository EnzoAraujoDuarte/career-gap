import type {
  CareerTrack,
  Competency,
  CompetencyId,
  ExcludedItem,
  Gap,
  Level,
  Prerequisite,
  ProfessionalHabit,
  ReasonCode,
  Resource,
  Tool,
  TrackRequirement,
  Roadmap,
  RoadmapItem,
  UserProfile,
} from './model';
import { PrerequisiteGraph, computeWaves } from './graph';
import { computeGaps, resolveRequirements } from './gap';
import { scoreGap } from './scoring';
import type { PolicyVerdict } from './policy';
import { applyPolicies, competenciesOutOfTrackScope } from './policy';

export interface Catalog {
  readonly version: string;
  readonly competencies: ReadonlyMap<CompetencyId, Competency>;
  readonly prerequisites: readonly Prerequisite[];
  readonly resources: readonly Resource[];
  /** Conteúdo da ficha, como os recursos: o motor não lê, a seleção e a ordem não mudam. */
  readonly habits: readonly ProfessionalHabit[];
  /** Kit de ferramentas. Também fora do motor: só é avaliado contra o perfil, nunca ordenado. */
  readonly tools: readonly Tool[];
  readonly tracks: ReadonlyMap<string, CareerTrack>;
}

export interface RoadmapOptions {
  /** Injetável para que os testes e os resultados citados no TCC sejam determinísticos. */
  readonly now?: Date;
  readonly notNowLimit?: number;
}

const DEFAULT_NOT_NOW_LIMIT = 6;
/** Vagas garantidas para temas fora do objetivo (Kubernetes e afins). Sem reserva, as
 *  regras editoriais lotam a lista e o usuário perde justamente a mensagem que mais
 *  reduz ansiedade: a permissão explícita de ignorar o que não é para agora. */
const RESERVED_HORIZON_SLOTS = 2;
/** Gap de dois níveis ou mais já não se resolve com um artigo. */
const LARGE_GAP_THRESHOLD = 2;

/**
 * Monta o roadmap a partir do estado do usuário e do catálogo.
 *
 * Três etapas separadas e nesta ordem (ADR-0002):
 *   1. elegibilidade — estrutural e booleana, vinda dos pré-requisitos duros;
 *   2. ranking — soma ponderada auditável entre os elegíveis;
 *   3. política editorial — regras nomeadas que só rebaixam, produzindo o NOT NOW.
 *
 * Nenhuma etapa consulta LLM. A IA entra depois, para explicar o que já foi decidido.
 */
export function generateRoadmap(
  profile: UserProfile,
  catalog: Catalog,
  options: RoadmapOptions = {},
): Roadmap {
  const track = requireTrack(catalog, profile.trackId);
  const requirements = resolveRequirements(track, profile.emphasisId);
  const graph = new PrerequisiteGraph(catalog.prerequisites);

  const gaps = computeGaps(profile, requirements, graph, catalog.competencies);
  const met = gaps.filter((gap) => gap.size === 0).map((gap) => gap.competency);
  const open = gaps.filter((gap) => gap.size > 0);

  const vetoes = applyPolicies({ gaps, competencies: catalog.competencies, requirements });
  const vetoedIds = new Set(vetoes.map((verdict) => verdict.competency));
  const candidates = open.filter((gap) => !vetoedIds.has(gap.competency));

  const currentLevelOf = levelLookup(profile);
  const targetLevelOf = targetLookup(requirements);
  const waves = computeWaves(
    candidates.map((gap) => gap.competency),
    graph,
    currentLevelOf,
    targetLevelOf,
  );

  const items = candidates
    .map((gap) => buildItem(gap, graph, currentLevelOf, waves.get(gap.competency) ?? 0))
    .sort(byWaveThenScore)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  return {
    trackId: track.id,
    emphasisId: profile.emphasisId,
    catalogVersion: catalog.version,
    generatedAt: (options.now ?? new Date()).toISOString(),
    inputSnapshot: profile,
    items,
    met,
    verificationNeeded: gaps
      .filter((gap) => gap.needsVerification)
      .map((gap) => gap.competency),
    excluded: collectExcluded(vetoes, catalog, requirements, options.notNowLimit),
    nextBestAction: items.find((item) => item.status === 'available'),
  };
}

function buildItem(
  gap: Gap,
  graph: PrerequisiteGraph,
  currentLevelOf: (id: CompetencyId) => Level,
  wave: number,
): RoadmapItem {
  const unmet = graph.unmetPrerequisites(gap.competency, currentLevelOf);
  const blockedBy = unmet.map((edge) => edge.requires);
  const breakdown = scoreGap(gap, graph);

  return {
    competency: gap.competency,
    status: blockedBy.length > 0 ? 'blocked' : 'available',
    rank: 0, // atribuído após a ordenação
    wave,
    gap,
    score: breakdown.total,
    breakdown,
    reasonCodes: reasonsFor(gap, graph, blockedBy.length > 0),
    blockedBy,
  };
}

/** Códigos estruturados; o texto para o usuário é derivado deles, nunca o contrário.
 *  É isso que permite explicar a recomendação sem depender de prosa gerada. */
function reasonsFor(
  gap: Gap,
  graph: PrerequisiteGraph,
  isBlocked: boolean,
): readonly ReasonCode[] {
  const codes: ReasonCode[] = [];
  codes.push(gap.criticality === 'core' ? 'CORE_GAP_FOR_TARGET' : 'SUPPORTS_TARGET');
  if (graph.directUnlockCount(gap.competency) > 0) codes.push('UNLOCKS_OTHER_COMPETENCIES');
  if (gap.size >= LARGE_GAP_THRESHOLD) codes.push('LARGE_GAP');
  if (isBlocked) codes.push('BLOCKED_BY_PREREQUISITE');
  if (gap.needsVerification) codes.push('NEEDS_VERIFICATION');
  return codes;
}

/** Ordem determinística: onda, depois escore, depois id. O desempate por id evita que
 *  dois participantes com o mesmo perfil vejam roadmaps em ordens diferentes. */
function byWaveThenScore(a: RoadmapItem, b: RoadmapItem): number {
  if (a.wave !== b.wave) return a.wave - b.wave;
  if (b.score !== a.score) return b.score - a.score;
  return a.competency.localeCompare(b.competency);
}

function collectExcluded(
  vetoes: readonly PolicyVerdict[],
  catalog: Catalog,
  requirements: readonly TrackRequirement[],
  limit = DEFAULT_NOT_NOW_LIMIT,
): readonly ExcludedItem[] {
  const vetoBudget = Math.max(0, limit - RESERVED_HORIZON_SLOTS);
  const shown = vetoes.slice(0, vetoBudget);
  const outOfScope = competenciesOutOfTrackScope(
    catalog.competencies,
    requirements,
    Math.max(0, limit - shown.length),
  );
  return [...shown, ...outOfScope];
}

function levelLookup(profile: UserProfile): (id: CompetencyId) => Level {
  const levels = new Map(profile.competencies.map((item) => [item.competency, item.level]));
  return (id) => levels.get(id) ?? 'L0';
}

function targetLookup(
  requirements: readonly { competency: CompetencyId; targetLevel: Level }[],
): (id: CompetencyId) => Level | undefined {
  const targets = new Map(requirements.map((item) => [item.competency, item.targetLevel]));
  return (id) => targets.get(id);
}

function requireTrack(catalog: Catalog, trackId: string): CareerTrack {
  const track = catalog.tracks.get(trackId);
  if (!track) throw new Error(`Track desconhecido: ${trackId}`);
  return track;
}
