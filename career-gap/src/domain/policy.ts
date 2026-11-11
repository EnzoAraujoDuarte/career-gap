import type {
  Competency,
  CompetencyId,
  ExcludedItem,
  Gap,
  ReasonCode,
  TrackRequirement,
} from './model';

/**
 * Política editorial (ADR-0002, etapa 3).
 *
 * Regras aqui só REBAIXAM ou EXCLUEM. Nenhuma regra promove um item — promoção é
 * responsabilidade exclusiva do escore, que é auditável. Cada exclusão carrega um
 * código e uma explicação legível, porque dizer "isto não agora, e por quê" é parte
 * do produto, não um detalhe de UI.
 */

export interface PolicyContext {
  readonly gaps: readonly Gap[];
  readonly competencies: ReadonlyMap<CompetencyId, Competency>;
  readonly requirements: readonly TrackRequirement[];
}

export interface PolicyVerdict {
  readonly competency: CompetencyId;
  readonly reasonCode: ReasonCode;
  readonly explanation: string;
}

/** A partir de quantos gaps core pendentes um item opcional vira ruído. */
const OPTIONAL_NOISE_THRESHOLD = 3;

type PolicyRule = (context: PolicyContext) => readonly PolicyVerdict[];

/** Tecnologia volátil não pode competir com fundamento pendente pela atenção de quem
 *  está começando. */
const prematureSpecialization: PolicyRule = ({ gaps, competencies }) => {
  const hasCoreFoundationGap = gaps.some(
    (gap) =>
      gap.size > 0 &&
      gap.criticality === 'core' &&
      isFoundational(competencies.get(gap.competency)),
  );
  if (!hasCoreFoundationGap) return [];

  return gaps
    .filter((gap) => gap.size > 0 && competencies.get(gap.competency)?.stability === 'volatile')
    .map((gap) => ({
      competency: gap.competency,
      reasonCode: 'PREMATURE_SPECIALIZATION' as const,
      explanation:
        'Ferramenta específica e de vida curta, enquanto ainda há fundamento pendente. ' +
        'Ela muda mais rápido do que você vai precisar dela.',
    }));
};

/** Item opcional no meio de vários gaps core é distração, não oportunidade. */
const lowImpactForTarget: PolicyRule = ({ gaps }) => {
  const coreGapCount = gaps.filter((gap) => gap.size > 0 && gap.criticality === 'core').length;
  if (coreGapCount < OPTIONAL_NOISE_THRESHOLD) return [];

  return gaps
    .filter((gap) => gap.size > 0 && gap.criticality === 'optional')
    .map((gap) => ({
      competency: gap.competency,
      reasonCode: 'LOW_IMPACT_FOR_TARGET' as const,
      explanation:
        `Impacto pequeno para o seu objetivo atual, e há ${coreGapCount} lacunas ` +
        'essenciais abertas. Volta a fazer sentido depois delas.',
    }));
};

export const POLICY_RULES: readonly { id: string; rule: PolicyRule }[] = [
  { id: 'premature-specialization', rule: prematureSpecialization },
  { id: 'low-impact-for-target', rule: lowImpactForTarget },
];

export function applyPolicies(context: PolicyContext): readonly PolicyVerdict[] {
  const verdicts = new Map<CompetencyId, PolicyVerdict>();
  for (const { rule } of POLICY_RULES) {
    // Primeira regra a vetar é a que explica: evita empilhar justificativas conflitantes.
    for (const verdict of rule(context)) {
      if (!verdicts.has(verdict.competency)) verdicts.set(verdict.competency, verdict);
    }
  }
  return [...verdicts.values()];
}

/**
 * Competências que existem no catálogo mas o objetivo atual não exige.
 * É daqui que sai a maior parte do NOT NOW: o usuário ouve falar de Kubernetes e
 * microservices o tempo todo e precisa de permissão explícita para ignorá-los agora.
 */
export function competenciesOutOfTrackScope(
  competencies: ReadonlyMap<CompetencyId, Competency>,
  requirements: readonly TrackRequirement[],
  limit: number,
): readonly ExcludedItem[] {
  const required = new Set(requirements.map((requirement) => requirement.competency));

  return [...competencies.values()]
    .filter((competency) => !required.has(competency.id))
    .slice(0, limit)
    .map((competency) => ({
      competency: competency.id,
      reasonCode: 'OUT_OF_TRACK_SCOPE' as const,
      explanation: `Não é exigido para o seu objetivo atual. ${competency.summary}`,
    }));
}

const FOUNDATIONAL_DOMAINS = new Set(['foundations', 'construction', 'web-platform']);
const isFoundational = (competency?: Competency): boolean =>
  competency !== undefined && FOUNDATIONAL_DOMAINS.has(competency.domain);
