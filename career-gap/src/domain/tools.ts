import type { CompetencyId, Level, Tool, ToolGate, UserProfile } from './model';
import { levelAtLeast } from './model';

export interface ToolReadiness {
  readonly tool: Tool;
  /** Portões ainda não cumpridos. Vazio = pode adotar agora. */
  readonly missing: readonly ToolGate[];
}

/**
 * Situação de cada ferramenta do kit para um perfil.
 *
 * Determinística, como o resto do motor. Ausência de informação conta como L0 — a mesma regra
 * do cálculo de lacuna: o silêncio do usuário não autoriza presumir competência.
 */
export function assessTools(
  tools: readonly Tool[],
  profile: UserProfile | undefined,
): readonly ToolReadiness[] {
  const levels = new Map<CompetencyId, Level>(
    (profile?.competencies ?? []).map((item) => [item.competency, item.level]),
  );
  return tools.map((tool) => ({
    tool,
    missing: tool.unlockedBy.filter(
      (gate) => !levelAtLeast(levels.get(gate.competency) ?? 'L0', gate.atLevel),
    ),
  }));
}
