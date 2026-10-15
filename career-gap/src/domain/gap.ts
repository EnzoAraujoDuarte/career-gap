import type {
  CareerTrack,
  Competency,
  CompetencyId,
  Gap,
  Level,
  TrackRequirement,
  UserProfile,
} from './model';
import { CONFIDENCE_BY_EVIDENCE, levelIndex } from './model';
import type { PrerequisiteGraph } from './graph';

/** Competência que trava pelo menos duas outras: erro de estimativa aqui contamina
 *  todo o resto do roadmap, então é onde vale pedir verificação. */
const GATING_UNLOCK_THRESHOLD = 2;

/**
 * Aplica a ênfase escolhida sobre os requisitos do track.
 * Overlay ajusta nível-alvo e criticidade; nunca adiciona nem remove competências,
 * porque ênfases compartilham um único catálogo (ADR do escopo de tracks).
 */
export function resolveRequirements(
  track: CareerTrack,
  emphasisId?: string,
): readonly TrackRequirement[] {
  if (!emphasisId) return track.requirements;

  const emphasis = track.emphases.find((candidate) => candidate.id === emphasisId);
  if (!emphasis) throw new Error(`Ênfase desconhecida no track ${track.id}: ${emphasisId}`);

  const adjustments = new Map(emphasis.adjustments.map((item) => [item.competency, item]));
  return track.requirements.map((requirement) => {
    const adjustment = adjustments.get(requirement.competency);
    if (!adjustment) return requirement;
    return {
      ...requirement,
      targetLevel: adjustment.targetLevel ?? requirement.targetLevel,
      criticality: adjustment.criticality ?? requirement.criticality,
    };
  });
}

/**
 * Diferença entre o estado estimado e o exigido pelo objetivo.
 * Competência sem nenhuma evidência é tratada como L0 — ausência de informação não
 * é evidência de capacidade.
 */
export function computeGaps(
  profile: UserProfile,
  requirements: readonly TrackRequirement[],
  graph: PrerequisiteGraph,
  competencies: ReadonlyMap<CompetencyId, Competency>,
): readonly Gap[] {
  const stated = new Map(profile.competencies.map((item) => [item.competency, item]));

  return requirements.map((requirement) => {
    if (!competencies.has(requirement.competency)) {
      throw new Error(`Requisito aponta para competência inexistente: ${requirement.competency}`);
    }

    const evidence = stated.get(requirement.competency);
    const currentLevel: Level = evidence?.level ?? 'L0';
    const size = Math.max(
      0,
      levelIndex(requirement.targetLevel) - levelIndex(currentLevel),
    );

    const isSelfReported = (evidence?.evidence ?? 'self-report') === 'self-report';
    const isGating =
      graph.directUnlockCount(requirement.competency) >= GATING_UNLOCK_THRESHOLD;

    return {
      competency: requirement.competency,
      currentLevel,
      targetLevel: requirement.targetLevel,
      size,
      criticality: requirement.criticality,
      confidence: CONFIDENCE_BY_EVIDENCE[evidence?.evidence ?? 'self-report'],
      // Só faz sentido verificar o que foi afirmado: quem declara L0 não tem o que provar.
      needsVerification: isSelfReported && isGating && levelIndex(currentLevel) >= 1,
    };
  });
}
