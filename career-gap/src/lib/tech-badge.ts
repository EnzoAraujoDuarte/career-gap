import { TECHNOLOGIES } from '@/catalog/technologies';
import type { PickedResource } from '@/domain/resources';
import { technologyBadge } from '@/domain/resources';

const TECH_NAMES = new Map(TECHNOLOGIES.map((technology) => [technology.id, technology.name]));

export const technologyName = (id: string): string | undefined => TECH_NAMES.get(id);

/**
 * Selo de tecnologia do nó, já descartando o caso redundante.
 *
 * Mora aqui, e não em cada tela, porque a regra foi esquecida uma vez: a condição A chamava
 * `technologyBadge` direto e exibia "HTML semântico — com HTML". Um caminho só para a regra
 * é o que impede isso de voltar.
 */
export function badgeFor(
  picked: readonly PickedResource[],
  competencyName: string,
): string | undefined {
  const technology = technologyBadge(picked);
  if (!technology) return undefined;

  const name = TECH_NAMES.get(technology);
  if (!name) return undefined;

  return competencyName.toLowerCase().includes(name.toLowerCase()) ? undefined : technology;
}
