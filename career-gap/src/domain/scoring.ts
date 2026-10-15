import type { Gap, ScoreBreakdown, ScoreComponent } from './model';
import { CRITICALITY_WEIGHT, LEVELS } from './model';
import type { PrerequisiteGraph } from './graph';

/**
 * Pesos do ranking. Soma 1 e são publicados junto com o catálogo: o TCC precisa poder
 * exibir a fórmula e reproduzir qualquer escore já coletado (ADR-0002).
 *
 * Soma ponderada, não produto: num produto, um fator próximo de zero aniquila o escore
 * e esconde gaps relevantes, além de produzir magnitudes sem significado interpretável.
 */
export const SCORING_WEIGHTS = {
  gapSize: 0.4,
  criticality: 0.4,
  unlockCount: 0.2,
} as const;

/** Maior distância possível entre dois níveis (L0→L4), usada para normalizar o gap. */
const MAX_LEVEL_SPAN = LEVELS.length - 1;

/**
 * Confiança NÃO entra no escore. Incerteza de medida não é falta de importância —
 * multiplicá-la puniria o usuário por não termos medido bem. Ela vira a flag
 * `needsVerification` no gap e um passo de verificação no roadmap (ADR-0003).
 */
export function scoreGap(gap: Gap, graph: PrerequisiteGraph): ScoreBreakdown {
  const maxUnlocks = graph.maxDirectUnlockCount();
  const unlocks = graph.directUnlockCount(gap.competency);

  const gapSize = component(gap.size, gap.size / MAX_LEVEL_SPAN, SCORING_WEIGHTS.gapSize);
  const criticality = component(
    CRITICALITY_WEIGHT[gap.criticality],
    CRITICALITY_WEIGHT[gap.criticality],
    SCORING_WEIGHTS.criticality,
  );
  const unlockCount = component(
    unlocks,
    maxUnlocks === 0 ? 0 : unlocks / maxUnlocks,
    SCORING_WEIGHTS.unlockCount,
  );

  return {
    gapSize,
    criticality,
    unlockCount,
    total: round(gapSize.contribution + criticality.contribution + unlockCount.contribution),
  };
}

function component(raw: number, normalized: number, weight: number): ScoreComponent {
  const clamped = Math.min(1, Math.max(0, normalized));
  return {
    raw,
    normalized: round(clamped),
    weight,
    contribution: round(clamped * weight),
  };
}

const round = (value: number): number => Math.round(value * 1e6) / 1e6;
