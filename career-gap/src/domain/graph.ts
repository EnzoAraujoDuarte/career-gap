import type { CompetencyId, Level, Prerequisite } from './model';
import { levelAtLeast, levelIndex } from './model';

/**
 * Índice de consulta sobre as arestas de pré-requisito.
 * Construído uma vez por cálculo; todas as buscas viram O(1).
 */
export class PrerequisiteGraph {
  private readonly incoming = new Map<CompetencyId, Prerequisite[]>();
  private readonly outgoing = new Map<CompetencyId, Prerequisite[]>();

  constructor(readonly edges: readonly Prerequisite[]) {
    for (const edge of edges) {
      push(this.incoming, edge.unlocks, edge);
      push(this.outgoing, edge.requires, edge);
    }
  }

  /** Arestas que precisam estar satisfeitas para `competency` ser alcançável. */
  prerequisitesOf(competency: CompetencyId): readonly Prerequisite[] {
    return this.incoming.get(competency) ?? [];
  }

  /** Competências destravadas diretamente por `competency`. Alimenta o componente
   *  `unlockCount` do escore e a explicação "isso desbloqueia X e Y". */
  unlockedBy(competency: CompetencyId): readonly CompetencyId[] {
    return (this.outgoing.get(competency) ?? []).map((edge) => edge.unlocks);
  }

  directUnlockCount(competency: CompetencyId): number {
    return this.unlockedBy(competency).length;
  }

  maxDirectUnlockCount(): number {
    let max = 0;
    for (const edges of this.outgoing.values()) max = Math.max(max, edges.length);
    return max;
  }

  /** Arestas ainda não satisfeitas pelos níveis atuais do usuário. */
  unmetPrerequisites(
    competency: CompetencyId,
    levelOf: (id: CompetencyId) => Level,
  ): readonly Prerequisite[] {
    return this.prerequisitesOf(competency).filter(
      (edge) => !levelAtLeast(levelOf(edge.requires), edge.atLevel),
    );
  }

  /** Ciclos tornariam a elegibilidade indecidível. Usado pelo validador do catálogo. */
  findCycle(): CompetencyId[] | undefined {
    const visiting = new Set<CompetencyId>();
    const done = new Set<CompetencyId>();
    const path: CompetencyId[] = [];

    const walk = (node: CompetencyId): CompetencyId[] | undefined => {
      if (done.has(node)) return undefined;
      if (visiting.has(node)) return [...path.slice(path.indexOf(node)), node];

      visiting.add(node);
      path.push(node);
      for (const edge of this.outgoing.get(node) ?? []) {
        const cycle = walk(edge.unlocks);
        if (cycle) return cycle;
      }
      path.pop();
      visiting.delete(node);
      done.add(node);
      return undefined;
    };

    for (const node of this.outgoing.keys()) {
      const cycle = walk(node);
      if (cycle) return cycle;
    }
    return undefined;
  }
}

/**
 * Onda em que a competência se torna alcançável: 0 = já alcançável agora,
 * k = depois de resolver as ondas anteriores. É o que dá as camadas do canvas.
 */
export function computeWaves(
  competencies: readonly CompetencyId[],
  graph: PrerequisiteGraph,
  currentLevelOf: (id: CompetencyId) => Level,
  targetLevelOf: (id: CompetencyId) => Level | undefined,
): Map<CompetencyId, number> {
  const waves = new Map<CompetencyId, number>();
  const inProgress = new Set<CompetencyId>();

  const waveOf = (id: CompetencyId): number => {
    const cached = waves.get(id);
    if (cached !== undefined) return cached;
    // Guarda defensiva: o validador já rejeita ciclos, mas um cálculo não pode travar.
    if (inProgress.has(id)) return 0;

    inProgress.add(id);
    let wave = 0;
    for (const edge of graph.prerequisitesOf(id)) {
      if (levelAtLeast(currentLevelOf(edge.requires), edge.atLevel)) continue;

      const target = targetLevelOf(edge.requires);
      // O pré-requisito não é exigido pelo track, ou é exigido abaixo do necessário:
      // o bloqueio não se resolve percorrendo este roadmap.
      if (target === undefined || levelIndex(target) < levelIndex(edge.atLevel)) {
        wave = Math.max(wave, 1);
        continue;
      }
      wave = Math.max(wave, waveOf(edge.requires) + 1);
    }
    inProgress.delete(id);
    waves.set(id, wave);
    return wave;
  };

  for (const id of competencies) waveOf(id);
  return waves;
}

function push<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const bucket = map.get(key);
  if (bucket) bucket.push(value);
  else map.set(key, [value]);
}
