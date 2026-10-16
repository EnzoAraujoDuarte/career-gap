import type { Build, BuildRequirement, CompetencyId, Level } from './model';
import { levelAtLeast } from './model';

/**
 * O que a pessoa já consegue construir, dado o que declarou saber.
 *
 * Mesma lógica do portão de ferramenta: cada exigência é comparada ao nível atual, e a saída é
 * uma anotação com motivo — "pronta", "falta só X" ou "mais adiante". Nada aqui esconde uma
 * construção; a página abre para todos (ADR-0009). Determinístico, como o resto do motor.
 */

export type BuildStatus = 'built' | 'ready' | 'one-away' | 'later';

export interface MissingRequirement extends BuildRequirement {
  readonly currentLevel: Level;
}

export interface BuildAssessment {
  readonly build: Build;
  readonly status: BuildStatus;
  /** As exigências que o perfil ainda não cumpre, na ordem declarada. */
  readonly missing: readonly MissingRequirement[];
}

export interface BuildAssessmentInput {
  readonly levelOf: (competency: CompetencyId) => Level;
  readonly isBuilt?: (buildId: string) => boolean;
}

export function assessBuilds(
  builds: readonly Build[],
  { levelOf, isBuilt = () => false }: BuildAssessmentInput,
): readonly BuildAssessment[] {
  return builds.map((build) => {
    const missing = build.requires
      .map((requirement) => ({ ...requirement, currentLevel: levelOf(requirement.competency) }))
      .filter((requirement) => !levelAtLeast(requirement.currentLevel, requirement.level));
    const status: BuildStatus = isBuilt(build.id)
      ? 'built'
      : missing.length === 0
        ? 'ready'
        : missing.length === 1
          ? 'one-away'
          : 'later';
    return { build, status, missing };
  });
}

/** Construções que esta competência destrava sozinha: é a única exigência que falta. */
export const buildsUnlockedBy = (
  assessments: readonly BuildAssessment[],
  competency: CompetencyId,
): readonly BuildAssessment[] =>
  assessments.filter(
    (item) => item.status === 'one-away' && item.missing[0].competency === competency,
  );

/** Construções em que a competência entra, como exigência ou como exercício. */
export const buildsInvolving = (
  builds: readonly Build[],
  competency: CompetencyId,
): readonly Build[] =>
  builds.filter(
    (build) =>
      build.exercises.includes(competency) ||
      build.requires.some((requirement) => requirement.competency === competency),
  );
