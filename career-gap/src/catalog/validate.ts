import type { ActionType, CareerTrack, Competency, Level, Source } from '@/domain/model';
import { MVP_MAX_LEVEL, levelIndex } from '@/domain/model';
import { PrerequisiteGraph } from '@/domain/graph';
import { TECHNOLOGY_IDS } from './technologies';
import type { Catalog } from '@/domain/roadmap';

/**
 * Invariantes do catálogo.
 *
 * Existe para que o protocolo de fundamentação (DISCOVERY.md §3) seja um mecanismo
 * verificável e não uma promessa no texto do TCC: se uma competência entrar sem duas
 * classes de fonte, ou se uma aresta criar ciclo, a suíte falha.
 */

export interface CatalogProblem {
  readonly rule: string;
  readonly subject: string;
  readonly detail: string;
}

/** Duas referências da MESMA classe não satisfazem o protocolo. */
const MIN_SOURCE_CLASSES = 2;

/** Mais que isso numa ficha deixa de ser hábito e vira lista de regras. */
const MAX_HABITS_PER_COMPETENCY = 3;

/** Código de nível solto num texto de tela ("para L1"). */
const INTERNAL_LEVEL = /\bL[0-4]\b/;

const LEARN_ACTIONS: ReadonlySet<ActionType> = new Set(['READ', 'WATCH', 'LEARN']);
const PRACTICE_ACTIONS: ReadonlySet<ActionType> = new Set(['BUILD', 'PROVE']);

export function validateCatalog(catalog: Catalog): readonly CatalogProblem[] {
  const problems: CatalogProblem[] = [];
  const competencies = catalog.competencies;
  const report = (rule: string, subject: string, detail: string) =>
    problems.push({ rule, subject, detail });

  for (const competency of competencies.values()) {
    if (distinctSourceClasses(competency.sources) < MIN_SOURCE_CLASSES) {
      report(
        'provenance',
        competency.id,
        `precisa de ${MIN_SOURCE_CLASSES} classes de fonte distintas, tem ${distinctSourceClasses(competency.sources)}`,
      );
    }
    for (const technology of competency.technologies ?? []) {
      if (!TECHNOLOGY_IDS.has(technology)) {
        report('technology-exists', competency.id, `tecnologia desconhecida: ${technology}`);
      }
    }
    for (const [level, descriptor] of Object.entries(competency.levels)) {
      if (!descriptor?.canDo?.trim()) {
        report('can-do-statement', `${competency.id}@${level}`, 'descritor vazio');
      }
    }
  }

  for (const edge of catalog.prerequisites) {
    const label = `${edge.requires}@${edge.atLevel} -> ${edge.unlocks}`;
    if (!competencies.has(edge.requires)) {
      report('edge-target-exists', label, `competência de origem inexistente: ${edge.requires}`);
    }
    if (!competencies.has(edge.unlocks)) {
      report('edge-target-exists', label, `competência destravada inexistente: ${edge.unlocks}`);
    }
    if (!edge.rationale.trim()) {
      report('edge-rationale', label, 'aresta sem justificativa registrada');
    }
    if (distinctSourceClasses(edge.sources) < MIN_SOURCE_CLASSES) {
      report('provenance', label, 'aresta precisa de duas classes de fonte distintas');
    }
    if (edge.requires === edge.unlocks) {
      report('edge-self-loop', label, 'competência não pode ser pré-requisito de si mesma');
    }
    requireDescriptor(competencies.get(edge.requires), edge.atLevel, label, report);
  }

  for (const resource of catalog.resources) {
    for (const competency of resource.competencies) {
      if (!competencies.has(competency)) {
        report('resource-competency', resource.id, `competência inexistente: ${competency}`);
      }
    }
    if (resource.technology !== 'agnostic' && !TECHNOLOGY_IDS.has(resource.technology)) {
      report('resource-technology', resource.id, `tecnologia desconhecida: ${resource.technology}`);
    }
    if (!resource.url.startsWith('https://')) {
      report('resource-url', resource.id, 'URL precisa ser https do detentor dos direitos');
    }
    if (!resource.why.trim()) {
      report('resource-why', resource.id, 'recurso sem justificativa de escolha');
    }
    // Missão sem enunciado é link solto; enunciado fora de missão é texto nosso atribuído a terceiro.
    if ((resource.origin === 'mission') !== Boolean(resource.task?.trim())) {
      report('mission-task', resource.id, 'enunciado existe se e somente se o recurso é missão');
    }
    // `chapters` e `task` vão para a tela; nota de curador com id interno ("atende
    // dom-and-browser L1") já vazou para a página da competência uma vez.
    for (const text of [resource.chapters, resource.task]) {
      if (text && (INTERNAL_LEVEL.test(text) || [...competencies.keys()].some((id) => text.includes(id)))) {
        report('resource-text', resource.id, `texto exibido com código interno: "${text}"`);
      }
    }
  }

  const habitIds = new Set<string>();
  const habitsPerCompetency = new Map<string, number>();
  for (const habit of catalog.habits) {
    if (habitIds.has(habit.id)) report('habit-unique', habit.id, 'id de hábito repetido');
    habitIds.add(habit.id);
    if (!habit.title.trim() || !habit.detail.trim() || !habit.credit.trim()) {
      report('habit-text', habit.id, 'hábito precisa de título, detalhe e atribuição');
    }
    if (distinctSourceClasses(habit.sources) < MIN_SOURCE_CLASSES) {
      report('provenance', habit.id, 'hábito precisa de duas classes de fonte distintas');
    }
    for (const competency of habit.competencies) {
      if (!competencies.has(competency)) {
        report('habit-competency', habit.id, `competência inexistente: ${competency}`);
      }
      habitsPerCompetency.set(competency, (habitsPerCompetency.get(competency) ?? 0) + 1);
    }
  }
  for (const [competency, count] of habitsPerCompetency) {
    if (count > MAX_HABITS_PER_COMPETENCY) {
      report('habit-limit', competency, `${count} hábitos; o teto é ${MAX_HABITS_PER_COMPETENCY}`);
    }
  }

  const toolIds = new Set<string>();
  for (const tool of catalog.tools) {
    if (toolIds.has(tool.id)) report('tool-unique', tool.id, 'id de ferramenta repetido');
    toolIds.add(tool.id);
    if (!tool.url.startsWith('https://')) {
      report('tool-url', tool.id, 'URL precisa ser https da página oficial');
    }
    if (!tool.use.trim() || !tool.why.trim()) {
      report('tool-text', tool.id, 'ferramenta precisa dizer para que serve e por que agora');
    }
    // Ferramenta envelhece rápido; recomendação sem data de verificação não se audita.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tool.verifiedAt)) {
      report('tool-verified', tool.id, 'data de verificação ausente ou fora de AAAA-MM-DD');
    }
    // Quem começa precisa saber se é algo que já tem, que cria, que instala ou que adiciona ao
    // projeto; plugin e dependência sem comando viram "procure por aí".
    if (!tool.setup?.note.trim()) {
      report('tool-setup', tool.id, 'ferramenta precisa dizer como se passa a tê-la');
    }
    if (['claude-plugin', 'project-dependency'].includes(tool.setup?.kind) && !tool.setup.command?.trim()) {
      report('tool-setup', tool.id, 'plugin e dependência de projeto precisam do comando');
    }
    for (const gate of tool.unlockedBy) {
      const label = `${tool.id} <- ${gate.competency}@${gate.atLevel}`;
      if (!competencies.has(gate.competency)) {
        report('tool-gate', label, `competência inexistente: ${gate.competency}`);
      }
      requireDescriptor(competencies.get(gate.competency), gate.atLevel, label, report);
    }
  }

  validateBuilds(catalog, report);

  const cycle = new PrerequisiteGraph(catalog.prerequisites).findCycle();
  if (cycle) {
    report('acyclic', cycle.join(' -> '), 'ciclo torna a elegibilidade indecidível');
  }

  for (const track of catalog.tracks.values()) {
    validateTrack(track, catalog, report);
  }

  return problems;
}

function validateTrack(
  track: CareerTrack,
  catalog: Catalog,
  report: (rule: string, subject: string, detail: string) => void,
): void {
  const required = new Map(track.requirements.map((item) => [item.competency, item]));

  for (const item of track.requirements) {
    const subject = `${track.id}:${item.competency}`;
    const competency = catalog.competencies.get(item.competency);
    if (!competency) {
      report('requirement-exists', subject, 'requisito aponta para competência inexistente');
      continue;
    }
    if (distinctSourceClasses(item.sources) < MIN_SOURCE_CLASSES) {
      report('provenance', subject, 'nível-alvo precisa de duas classes de fonte distintas');
    }
    if (levelIndex(item.targetLevel) > levelIndex(MVP_MAX_LEVEL)) {
      report('mvp-level-ceiling', subject, `MVP não usa níveis acima de ${MVP_MAX_LEVEL}`);
    }
    requireDescriptor(competency, item.targetLevel, subject, report);
  }

  // Sem esta invariante um item pode ficar eternamente bloqueado: o pré-requisito não
  // estaria no roadmap, então nada no percurso o resolveria.
  for (const edge of catalog.prerequisites) {
    if (!required.has(edge.unlocks)) continue;

    const source = required.get(edge.requires);
    const subject = `${track.id}:${edge.requires} -> ${edge.unlocks}`;
    if (!source) {
      report(
        'prerequisite-reachable',
        subject,
        'pré-requisito de um item do track precisa ser exigido pelo próprio track',
      );
      continue;
    }
    if (levelIndex(source.targetLevel) < levelIndex(edge.atLevel)) {
      report(
        'prerequisite-reachable',
        subject,
        `track exige ${edge.requires} em ${source.targetLevel}, abaixo do ${edge.atLevel} que a aresta requer`,
      );
    }
  }

  // Sem recurso no nível-alvo, o nó não tem o que mostrar na ficha e a recomendação
  // volta a ser um nome abstrato de competência — o problema que a ficha existe para resolver.
  for (const item of track.requirements) {
    const subject = `${track.id}:${item.competency}`;
    const available = catalog.resources.filter(
      (resource) =>
        resource.competencies.includes(item.competency) &&
        levelIndex(resource.levelMin) <= levelIndex(item.targetLevel),
    );
    if (available.length === 0) {
      report('resource-coverage', subject, 'nenhum recurso no nível-alvo');
    }

    // Regra de suficiência (PLANO-FASE3 §9): só consumir não forma ninguém. Toda competência
    // core precisa de algo para aprender em português E de algo para praticar.
    if (item.criticality !== 'core') continue;
    if (!available.some((r) => LEARN_ACTIONS.has(r.actionType) && r.ptBrStatus === 'complete')) {
      report('learn-coverage', subject, 'competência core sem recurso de aprender em pt-BR');
    }
    if (!available.some((r) => PRACTICE_ACTIONS.has(r.actionType))) {
      report('practice-coverage', subject, 'competência core sem prática no nível-alvo');
    }
  }

  // A trilha é editorial, mas não pode contradizer o grafo: cada exigência do track aparece
  // uma vez, e nenhum pré-requisito vem depois de quem ele destrava.
  const position = new Map<string, number>();
  for (const competency of track.path.flatMap((level) => level.competencies)) {
    if (position.has(competency)) {
      report('path-unique', `${track.id}:${competency}`, 'competência repetida na trilha');
    }
    if (!required.has(competency)) {
      report('path-scope', `${track.id}:${competency}`, 'trilha só lista exigências do track');
    }
    position.set(competency, position.size);
  }
  for (const item of track.requirements) {
    if (!position.has(item.competency)) {
      report('path-coverage', `${track.id}:${item.competency}`, 'exigência do track fora da trilha');
    }
  }
  for (const edge of catalog.prerequisites) {
    const before = position.get(edge.requires);
    const after = position.get(edge.unlocks);
    if (before !== undefined && after !== undefined && before > after) {
      report(
        'path-order',
        `${track.id}:${edge.requires} -> ${edge.unlocks}`,
        'pré-requisito aparece depois do que ele destrava',
      );
    }
  }

  // Avaliação rápida: cada competência responde a uma pergunta só, e a frase maior afirma
  // tudo o que a menor afirma — senão subir de resposta poderia baixar um nível.
  const askedIn = new Map<string, string>();
  for (const question of track.quickAssessment) {
    const subject = `${track.id}:${question.id}`;
    for (const competency of new Set(question.statements.flatMap((s) => s.competencies))) {
      if (!required.has(competency)) {
        report('quick-scope', `${subject}:${competency}`, 'pergunta só declara exigências do track');
      }
      if (askedIn.has(competency)) {
        report('quick-unique', `${subject}:${competency}`, `já declarada em ${askedIn.get(competency)}`);
      }
      askedIn.set(competency, question.id);
    }
    question.statements.forEach((statement, index) => {
      if (!statement.canDo.trim()) report('quick-text', subject, 'frase vazia');
      const previous = question.statements[index - 1];
      if (!previous) return;
      if (levelIndex(statement.level) <= levelIndex(previous.level)) {
        report('quick-monotonic', subject, 'frases devem subir de nível');
      }
      if (previous.competencies.some((competency) => !statement.competencies.includes(competency))) {
        report('quick-monotonic', subject, `${statement.level} deixa de afirmar o que ${previous.level} afirma`);
      }
    });
  }

  for (const emphasis of track.emphases) {
    for (const adjustment of emphasis.adjustments) {
      const subject = `${track.id}:${emphasis.id}:${adjustment.competency}`;
      const base = required.get(adjustment.competency);
      if (!base) {
        report(
          'emphasis-scope',
          subject,
          'ênfase só ajusta peso de competências já exigidas; não adiciona nem remove',
        );
        continue;
      }
      if (adjustment.targetLevel) {
        requireDescriptor(
          catalog.competencies.get(adjustment.competency),
          adjustment.targetLevel,
          subject,
          report,
        );
      }
    }
  }
}

/** Passos demais viram tutorial; de menos, a construção não guia. */
const BUILD_STEPS = { min: 3, max: 6 };

/**
 * Construções: cada exigência existe e não passa do alvo do track; o nível da trilha existe e
 * nenhuma exigência vem de um nível depois do da construção (senão ela nunca fica pronta na
 * ordem sugerida); cada nível tem o que construir; e existe exatamente uma porta de entrada,
 * sem exigências, no primeiro nível — a prova de que dá para começar sem saber nada.
 */
function validateBuilds(
  catalog: Catalog,
  report: (rule: string, subject: string, detail: string) => void,
): void {
  const resourceIds = new Set(catalog.resources.map((resource) => resource.id));
  const toolIds = new Set(catalog.tools.map((tool) => tool.id));
  const buildIds = new Set<string>();
  const competencyIds = [...catalog.competencies.keys()];

  for (const track of catalog.tracks.values()) {
    const targetOf = new Map(track.requirements.map((item) => [item.competency, item.targetLevel]));
    const levelPosition = new Map(track.path.map((level, index) => [level.id, index]));
    const competencyPosition = new Map(
      track.path.flatMap((level, index) => level.competencies.map((competency) => [competency, index] as const)),
    );
    const buildsPerLevel = new Map<string, number>();
    let doorways = 0;

    for (const build of catalog.builds) {
      if (buildIds.has(build.id)) report('build-unique', build.id, 'id de construção repetido');
      buildIds.add(build.id);

      const levelIndexOf = levelPosition.get(build.levelId);
      if (levelIndexOf === undefined) {
        report('build-level', build.id, `nível da trilha inexistente: ${build.levelId}`);
        continue;
      }
      buildsPerLevel.set(build.levelId, (buildsPerLevel.get(build.levelId) ?? 0) + 1);
      if (build.requires.length === 0) {
        doorways += 1;
        if (levelIndexOf !== 0) report('build-doorway', build.id, 'a porta de entrada fica no primeiro nível');
      }

      for (const requirement of build.requires) {
        const target = targetOf.get(requirement.competency);
        const label = `${build.id} <- ${requirement.competency}@${requirement.level}`;
        if (!target) {
          report('build-requires', label, 'exigência fora do track');
          continue;
        }
        if (levelIndex(requirement.level) > levelIndex(target)) {
          report('build-requires', label, 'exige mais que o alvo do track');
        }
        if ((competencyPosition.get(requirement.competency) ?? Infinity) > levelIndexOf) {
          report('build-order', label, 'exigência de um nível posterior ao da construção');
        }
        requireDescriptor(catalog.competencies.get(requirement.competency), requirement.level, label, report);
      }
      for (const competency of build.exercises) {
        if (!catalog.competencies.has(competency)) {
          report('build-exercises', build.id, `competência inexistente: ${competency}`);
        }
      }
      for (const resource of build.resources) {
        if (!resourceIds.has(resource)) report('build-resource', build.id, `recurso inexistente: ${resource}`);
      }
      for (const tool of build.tools) {
        if (!toolIds.has(tool)) report('build-tool', build.id, `ferramenta inexistente: ${tool}`);
      }
      if (build.tools.length === 0) report('build-tool', build.id, 'construção precisa dizer o que a pessoa precisa ter em mãos');
      if (build.steps.length < BUILD_STEPS.min || build.steps.length > BUILD_STEPS.max) {
        report('build-steps', build.id, `${build.steps.length} passos; o intervalo é ${BUILD_STEPS.min} a ${BUILD_STEPS.max}`);
      }
      if (!build.result.trim() || !build.doneWhen.trim()) {
        report('build-text', build.id, 'construção precisa dizer o resultado e quando está pronta');
      }
      for (const text of [build.title, build.result, build.doneWhen, ...build.steps]) {
        if (INTERNAL_LEVEL.test(text) || competencyIds.some((id) => text.includes(id))) {
          report('build-text', build.id, `texto exibido com código interno: "${text}"`);
        }
      }
    }

    for (const level of track.path) {
      if (!buildsPerLevel.get(level.id)) report('build-coverage', `${track.id}:${level.id}`, 'nível sem construção');
    }
    if (doorways !== 1) report('build-doorway', track.id, `${doorways} construções sem exigência; precisa ser exatamente 1`);
  }
}

function requireDescriptor(
  competency: Competency | undefined,
  level: Level,
  subject: string,
  report: (rule: string, subject: string, detail: string) => void,
): void {
  if (competency && !competency.levels[level]) {
    report(
      'level-descriptor',
      subject,
      `nível ${level} é usado mas não tem descritor "can do" em ${competency.id}`,
    );
  }
}

const distinctSourceClasses = (sources: readonly Source[]): number =>
  new Set(sources.map((source) => source.sourceClass)).size;

/** Usado no seed e no boot: falhar cedo é melhor que gerar roadmap sobre catálogo quebrado. */
export function assertCatalogIsValid(catalog: Catalog): void {
  const problems = validateCatalog(catalog);
  if (problems.length === 0) return;

  const lines = problems.map((p) => `  [${p.rule}] ${p.subject}: ${p.detail}`);
  throw new Error(`Catálogo inválido (${problems.length} problemas):\n${lines.join('\n')}`);
}
