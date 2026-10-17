import type { ActionType, CompetencyId, Level, Resource, TechnologyId } from './model';
import { levelIndex } from './model';

/**
 * Seleção de recursos para um nó.
 *
 * Determinística e auditável, como o resto do motor. A razão de um recurso ser o
 * recomendado é um CÓDIGO, não prosa — a interface escolhe as palavras, e o TCC consegue
 * explicar a escolha sem depender de texto gerado.
 */

export type ResourcePickReason =
  | 'PT_BR'
  | 'PT_BR_PARTIAL'
  | 'FREE'
  | 'NO_SIGNUP'
  | 'STARTING_POINT'
  | 'ONLY_OPTION'
  | 'YOUR_STACK';

export interface PickedResource {
  readonly resource: Resource;
  readonly recommended: boolean;
  readonly reasons: readonly ResourcePickReason[];
}

/** Teto de curadoria. Sobrecarga de escolha é o problema que estamos resolvendo: para
 *  iniciante sem preferência formada, mais opções atrasam a decisão em vez de ajudar. */
const MAX_PER_NODE = 3;

const WEIGHTS = { ptBr: 3, ptBrPartial: 1, free: 2, freeCertPaid: 1, noSignup: 1 };

/**
 * Quem ensina abre a lista; quem faz praticar vem depois.
 *
 * Não se pratica o que ainda não se aprendeu: para novatos, estudar exemplo resolvido supera
 * resolver problema (efeito do exemplo trabalhado). Sem esta regra, um desafio de sete dias
 * aparecia como primeiro passo de Git para quem nunca deu um commit.
 */
const TEACHES_FIRST: Record<ActionType, number> = {
  READ: 0, WATCH: 0, LEARN: 0, BUILD: 1, PROVE: 2,
};

/**
 * Recursos do nó, no nível-alvo do TRACK — nunca no nível atual do usuário.
 *
 * Essa escolha é o que mantém as duas condições do experimento comparáveis: o conjunto de
 * recursos por competência é literalmente o mesmo objeto nos dois lados, e só a seleção de
 * quais nós aparecem e em que ordem varia (docs/DECISOES.md §1).
 */
export function selectResourcesFor(
  competency: CompetencyId,
  targetLevel: Level,
  resources: readonly Resource[],
  limit: number = MAX_PER_NODE,
  preferred?: TechnologyId,
): readonly PickedResource[] {
  const eligible = resources.filter(
    (resource) =>
      resource.competencies.includes(competency) &&
      levelIndex(resource.levelMin) <= levelIndex(targetLevel),
  );

  // Ordem PEDAGÓGICA, não ordem de escore: o mais acessível primeiro, para a lista ser lida
  // como progressão. Ordenar pelo nível mais próximo do alvo colocava um desafio de nível
  // final como primeiro passo de quem está em L0.
  const order = pedagogicalOrder(preferred);
  const ordered = [...eligible].map((resource) => ({ resource, score: scoreOf(resource) })).sort(order);

  const ranked = withPracticeSlot(ordered, limit, order);

  return ranked.map(({ resource }, index) => ({
    resource,
    recommended: index === 0,
    reasons: reasonsFor(resource, ranked.length, index === 0, preferred),
  }));
}

interface Scored {
  readonly resource: Resource;
  readonly score: number;
}

/**
 * A linguagem escolhida só desempata entre materiais igualmente acessíveis: o acessível vem
 * primeiro para todo mundo, e entre iguais o material na sua linguagem passa à frente. O
 * agnóstico serve a qualquer escolha, por isso empata com ela. O caminho não muda (ADR-0014).
 */
const stackRank = (resource: Resource, preferred?: TechnologyId): number =>
  !preferred || resource.technology === 'agnostic' || resource.technology === preferred ? 0 : 1;

// Desempate por id mantém a ordem estável entre execuções e entre participantes.
const pedagogicalOrder =
  (preferred?: TechnologyId) =>
  (a: Scored, b: Scored): number =>
    levelIndex(a.resource.levelMin) - levelIndex(b.resource.levelMin) ||
    TEACHES_FIRST[a.resource.actionType] - TEACHES_FIRST[b.resource.actionType] ||
    stackRank(a.resource, preferred) - stackRank(b.resource, preferred) ||
    b.score - a.score ||
    a.resource.id.localeCompare(b.resource.id);

const isPractice = ({ resource }: Scored): boolean => TEACHES_FIRST[resource.actionType] > 0;

/**
 * Vaga garantida para prática — e é a prática do nível-alvo.
 *
 * Com o teto de três e "quem ensina primeiro", todo nó com três recursos de estudo escondia a
 * prática inteira: a auditoria de 2026-10-15 achou 19 das 24 práticas elegíveis fora da ficha,
 * e o nó virava lista de vídeos.
 *
 * A prática escolhida é a de nível mais alto que não passa do alvo, porque a ficha mostra logo
 * abaixo o critério de saída DO ALVO: é ele que a prática tem de exercitar. O estudo cuida da
 * rampa; a lista começa acessível e termina no alvo. Pegar a prática mais fácil deixava a missão
 * de nível-alvo invisível para todo mundo.
 */
function withPracticeSlot(
  ordered: readonly Scored[],
  limit: number,
  order: (a: Scored, b: Scored) => number,
): readonly Scored[] {
  const practices = ordered.filter(isPractice);
  if (limit < 2 || practices.length === 0) return ordered.slice(0, limit);

  const atTarget = [...practices].sort(
    (a, b) => levelIndex(b.resource.levelMin) - levelIndex(a.resource.levelMin) || order(a, b),
  )[0];
  const study = ordered.filter((item) => !isPractice(item)).slice(0, limit - 1);
  // Pouco estudo disponível: as vagas que sobram vão para as demais práticas, na ordem de sempre.
  const filler = practices.filter((item) => item !== atTarget).slice(0, limit - 1 - study.length);

  return [...study, ...filler, atTarget].sort(order);
}

function scoreOf(resource: Resource): number {
  let score = 0;
  if (resource.ptBrStatus === 'complete') score += WEIGHTS.ptBr;
  else if (resource.ptBrStatus === 'partial') score += WEIGHTS.ptBrPartial;
  if (resource.cost === 'free') score += WEIGHTS.free;
  else if (resource.cost === 'free-content-paid-certificate') score += WEIGHTS.freeCertPaid;
  if (!resource.requiresSignup) score += WEIGHTS.noSignup;
  return score;
}

function reasonsFor(
  resource: Resource,
  poolSize: number,
  isFirst: boolean,
  preferred?: TechnologyId,
): readonly ResourcePickReason[] {
  if (poolSize === 1) return ['ONLY_OPTION'];

  const reasons: ResourcePickReason[] = [];
  if (isFirst) reasons.push('STARTING_POINT');
  if (preferred && resource.technology === preferred) reasons.push('YOUR_STACK');
  if (resource.ptBrStatus === 'complete') reasons.push('PT_BR');
  else if (resource.ptBrStatus === 'partial') reasons.push('PT_BR_PARTIAL');
  if (resource.cost === 'free') reasons.push('FREE');
  if (!resource.requiresSignup) reasons.push('NO_SIGNUP');
  return reasons;
}

/** Um único recurso marcado com uma tecnologia não é sinal — é ruído. Sem este piso, um
 *  recurso de Conventional Commits fazia "Comunicação técnica" aparecer como "com Git". */
const MIN_EVIDENCE_FOR_BADGE = 2;

/**
 * Selo de tecnologia do nó: a tecnologia dominante entre os recursos escolhidos.
 *
 * Atende ao pedido de "citar linguagens e frameworks" sem criar competência por stack. Só
 * aparece quando há evidência real de concentração — a maioria dos nós não tem selo, e isso
 * é correto: fundamentos são agnósticos.
 */
export function technologyBadge(picked: readonly PickedResource[]): string | undefined {
  const counts = new Map<string, number>();
  for (const { resource } of picked) {
    if (resource.technology === 'agnostic') continue;
    counts.set(resource.technology, (counts.get(resource.technology) ?? 0) + 1);
  }
  if (counts.size === 0) return undefined;

  const [top] = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return top[1] >= MIN_EVIDENCE_FOR_BADGE ? top[0] : undefined;
}
