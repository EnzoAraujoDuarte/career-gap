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
  return tools.map((tool) => ({ tool, missing: missingGates(tool.unlockedBy, profile) }));
}

/** Os portões que o perfil ainda não cumpre. A mesma régua para ferramentas e pessoas. */
export function missingGates(gates: readonly ToolGate[], profile: UserProfile | undefined): readonly ToolGate[] {
  const levels = new Map<CompetencyId, Level>(
    (profile?.competencies ?? []).map((item) => [item.competency, item.level]),
  );
  return gates.filter((gate) => !levelAtLeast(levels.get(gate.competency) ?? 'L0', gate.atLevel));
}
