/**
 * Núcleo de domínio do Career Gap.
 *
 * Regra estrutural: este diretório não importa framework, ORM nem cliente de LLM.
 * Todo o raciocínio de carreira precisa rodar e ser testável isoladamente — é isso
 * que sustenta a afirmação de que as regras não dependem de IA (ADR-0004).
 */

/** Escala ordinal operacional definida por descritores observáveis, não por estágios
 *  psicológicos (ADR-0003). Alinhamento aproximado com SFIA 9: L1≈Follow, L2≈Assist/Apply. */
export const LEVELS = ['L0', 'L1', 'L2', 'L3', 'L4'] as const;
export type Level = (typeof LEVELS)[number];

/** L4 existe no enum para o roadmap de longo prazo, mas nenhum track do MVP o utiliza. */
export const MVP_MAX_LEVEL: Level = 'L3';

export const levelIndex = (level: Level): number => LEVELS.indexOf(level);
export const levelAtLeast = (actual: Level, required: Level): boolean =>
  levelIndex(actual) >= levelIndex(required);

export const LEVEL_NAMES: Record<Level, string> = {
  L0: 'Reconhece',
  L1: 'Aplica com apoio',
  L2: 'Aplica sozinho',
  L3: 'Decide no sistema',
  L4: 'Influencia a organização',
};

// ---------------------------------------------------------------------------
// Proveniência — o protocolo de fundamentação do DISCOVERY.md §3
// ---------------------------------------------------------------------------

/** Classes de fonte. A regra do catálogo exige duas classes DIFERENTES por afirmação;
 *  duas referências da mesma classe não satisfazem o protocolo. */
export type SourceClass =
  | 'curriculum'
  | 'competency-framework'
  | 'market-evidence'
  | 'canonical-reference';

export interface Source {
  readonly sourceClass: SourceClass;
  /** Identificador verificável: código de KA, código de skill, título, URL. */
  readonly ref: string;
  readonly note?: string;
}

// ---------------------------------------------------------------------------
// Competências
// ---------------------------------------------------------------------------

export type CompetencyId = string;

export type CompetencyDomain =
  | 'foundations'
  | 'web-platform'
  | 'construction'
  | 'data'
  | 'quality'
  | 'delivery'
  | 'professional'
  | 'ai-assisted'
  | 'horizon';

/** Estabilidade do conhecimento (SYSTEM_SPEC §16). Usada pela política editorial para
 *  impedir que ferramentas voláteis dominem a formação de quem ainda não tem base. */
export type Stability = 'evergreen' | 'volatile';

export interface LevelDescriptor {
  /** Frase observável em primeira pessoa. É simultaneamente item de onboarding,
   *  critério de saída e rubrica de correção (ADR-0003). */
  readonly canDo: string;
  readonly exitCriteria: readonly string[];
}

export interface Competency {
  readonly id: CompetencyId;
  readonly name: string;
  readonly domain: CompetencyDomain;
  readonly summary: string;
  readonly stability: Stability;
  /** Descritores apenas para os níveis efetivamente usados como alvo ou limiar. */
  readonly levels: Partial<Record<Level, LevelDescriptor>>;
  /** Presente apenas quando a competência é inerentemente atada a uma tecnologia
   *  (HTML, JavaScript). A maioria é agnóstica e não declara nada aqui. */
  readonly technologies?: readonly TechnologyId[];
  readonly sources: readonly Source[];
}

// ---------------------------------------------------------------------------
// Tecnologias e ecossistemas
// ---------------------------------------------------------------------------

/**
 * Ecossistema de mercado a que um track pertence.
 *
 * O MVP implementa apenas 'web'. Ecossistemas como SAP/ABAP, Shopify, Magento e TOTVS
 * entram como novos tracks e novas competências — sem alteração de modelo. É esta
 * indireção que evita ter de refatorar o domínio quando o produto expandir.
 */
export type EcosystemId = string;

export type TechnologyId = string;

/**
 * Tecnologia é dimensão ORTOGONAL à competência, não um tipo dela.
 *
 * "Construção de API" é a mesma capacidade em Laravel, Node ou ABAP: o que muda é o
 * recurso que atende o gap, não o gap. Criar uma competência por tecnologia
 * reproduziria o problema dos roadmaps por stack — dezenas de mapas paralelos
 * repetindo "aprenda testes" e "aprenda Git".
 */
export interface Technology {
  readonly id: TechnologyId;
  readonly name: string;
  readonly ecosystem: EcosystemId;
  readonly stability: Stability;
}

// ---------------------------------------------------------------------------
// Pré-requisitos — apenas DUROS (ADR-0001)
// ---------------------------------------------------------------------------

/**
 * Uma aresta só existe quando `unlocks` é inviável ou incompreensível sem `requires`
 * no nível `atLevel`. "É melhor aprender antes" NÃO é aresta — é peso no escore.
 */
export interface Prerequisite {
  readonly requires: CompetencyId;
  readonly atLevel: Level;
  readonly unlocks: CompetencyId;
  readonly rationale: string;
  readonly sources: readonly Source[];
}

// ---------------------------------------------------------------------------
// Tracks
// ---------------------------------------------------------------------------

export type Criticality = 'core' | 'supporting' | 'optional';

export const CRITICALITY_WEIGHT: Record<Criticality, number> = {
  core: 1,
  supporting: 0.6,
  optional: 0.3,
};

export interface TrackRequirement {
  readonly competency: CompetencyId;
  readonly targetLevel: Level;
  readonly criticality: Criticality;
  readonly sources: readonly Source[];
}

/** Ênfase é overlay de peso sobre o MESMO catálogo, nunca um catálogo paralelo. */
export interface EmphasisOverlay {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly adjustments: readonly {
    readonly competency: CompetencyId;
    readonly targetLevel?: Level;
    readonly criticality?: Criticality;
  }[];
}

/**
 * Nível da trilha: agrupamento editorial para navegar, como os níveis do Laracasts.
 *
 * O motor não lê. A trilha é a mesma para todos; o que é pessoal é a anotação por cima dela
 * (já sabe, recomendado agora, falta base, não agora). A ordem é verificada contra os
 * pré-requisitos (`validate.ts`), então o editorial não pode contradizer o grafo.
 */
export interface PathLevel {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  /** "Você vai aprender": resultados observáveis, não nomes de competência. */
  readonly outcomes: readonly string[];
  /** Na ordem sugerida. */
  readonly competencies: readonly CompetencyId[];
}

/**
 * Uma frase da avaliação rápida. Declara EXPLICITAMENTE o que afirma: escolher a frase põe
 * cada competência listada no nível da frase (limitado ao alvo do track). O que não está
 * listado fica em L0 — subestimar custa pouco num catálogo aberto; superestimar esconde
 * conteúdo e destrava o que vem depois (ADR-0003).
 */
export interface QuickStatement {
  readonly level: Level;
  readonly canDo: string;
  readonly competencies: readonly CompetencyId[];
}

/** Pergunta da avaliação rápida: um tema, frases "consigo…" da menor para a maior. */
export interface QuickQuestion {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly statements: readonly QuickStatement[];
}

/**
 * Uma linguagem de servidor que a pessoa pode escolher a partir do terceiro nível. O caminho é
 * INDEPENDENTE de stack: competências, ordem e lacunas não mudam com a escolha; só os materiais
 * passam a preferir a linguagem escolhida, com o motivo dito (ADR-0014).
 */
export interface StackOption {
  readonly technology: TechnologyId;
  readonly name: string;
  readonly why: string;
}

export interface CareerTrack {
  readonly id: string;
  readonly ecosystem: EcosystemId;
  readonly name: string;
  readonly description: string;
  readonly requirements: readonly TrackRequirement[];
  readonly emphases: readonly EmphasisOverlay[];
  readonly path: readonly PathLevel[];
  readonly quickAssessment: readonly QuickQuestion[];
  /** Linguagens de servidor oferecidas. Vazio = o track não pede essa escolha. */
  readonly stacks: readonly StackOption[];
}

// ---------------------------------------------------------------------------
// Recursos
// ---------------------------------------------------------------------------

export type ResourceKind =
  | 'video' | 'playlist' | 'course' | 'series' | 'doc' | 'guide' | 'tutorial'
  | 'interactive' | 'book' | 'article' | 'reference' | 'exercise' | 'community';

/** O verbo que abre a linha na ficha. Sem ele a lista vira bullet sem direção. */
export type ActionType = 'READ' | 'WATCH' | 'LEARN' | 'BUILD' | 'PROVE';

export const ACTION_VERB: Record<ActionType, string> = {
  READ: 'LEIA',
  WATCH: 'ASSISTA',
  LEARN: 'ESTUDE',
  BUILD: 'FAÇA',
  PROVE: 'PROVE',
};

/** Certificado pago não descaracteriza conteúdo gratuito — mas precisa ser dito. */
export type ResourceCost = 'free' | 'free-content-paid-certificate' | 'paid';

/**
 * Status da tradução. Mede o CORPO do conteúdo, nunca a interface nem legenda de vídeo:
 * a verificação encontrou 11 casos em que o site traduz o menu e mantém o texto em inglês
 * (Jest, MIT Missing Semester) ou em que legenda automática foi tomada por tradução (CS50).
 */
export type PtBrStatus = 'complete' | 'partial' | 'none';

export interface Resource {
  readonly id: string;
  readonly title: string;
  readonly sourceName: string;
  /** URL canônica da página do detentor dos direitos. Nada é hospedado (ADR-0005). */
  readonly url: string;
  readonly kind: ResourceKind;
  readonly actionType: ActionType;
  readonly competencies: readonly CompetencyId[];
  readonly levelMin: Level;
  readonly technology: TechnologyId | 'agnostic';
  readonly cost: ResourceCost;
  readonly costNote?: string;
  readonly ptBrStatus: PtBrStatus;
  readonly requiresSignup: boolean;
  readonly license: string;
  readonly estimatedTime?: string;
  /** Quando só parte do livro serve ao nível — recomendar o volume inteiro é ruído. */
  readonly chapters?: string;
  readonly why: string;
  /**
   * Enunciado de missão. Só existe em recurso de `origin: 'mission'`: o texto é do projeto,
   * a URL aponta para a documentação pública que a missão usa. O "você terminou quando" é o
   * próprio critério de saída da competência — a missão não inventa critério paralelo.
   */
  readonly task?: string;
  readonly origin: 'br-creator' | 'canonical' | 'book' | 'practice' | 'mission';
  /**
   * Ordem curada: estes vídeos abrem a estação da competência, nesta posição (1 primeiro).
   * Escolha do autor sobre a busca de 2026-10-17 (docs/research/videos-pt-verificados.json).
   */
  readonly featured?: Readonly<Record<CompetencyId, number>>;
}

// ---------------------------------------------------------------------------
// Construções — o que a pessoa consegue fazer com o que sabe
// ---------------------------------------------------------------------------

/** A forma do resultado: é o que o desenho da construção mostra antes de a pessoa começar. */
export type BuildKind = 'page' | 'terminal' | 'link' | 'widget' | 'form' | 'server' | 'app' | 'pull-request';

export interface BuildRequirement {
  readonly competency: CompetencyId;
  readonly level: Level;
}

/**
 * Algo concreto que a pessoa constrói e mostra — a unidade que liga saber a conseguir fazer.
 *
 * O roadmap só com competências dizia o que estudar; a construção diz o que você já pode criar
 * com o que sabe e o que cada competência destrava (docs/COMPARACAO-CURRICULOS.md, Hyperskill e
 * Frontend Mentor organizam o estudo assim). `requires` é avaliado contra o perfil da mesma forma
 * que o portão de uma ferramenta: declarado, verificável e sem cadeado — a página abre para
 * todos; o que muda é a anotação (ADR-0009). O texto é do projeto; os recursos são links.
 */
/**
 * O que uma construção prova a quem contrata. É a régua do portfólio: variedade (front-end,
 * back-end, design, IA, colaboração) vale mais que quantidade, porque é o que a entrevista
 * pergunta. O validador exige pelo menos uma construção por faceta.
 */
export type PortfolioFacet = 'fundamentals' | 'frontend' | 'backend' | 'design' | 'ai' | 'collaboration';
export const PORTFOLIO_FACETS: readonly PortfolioFacet[] = ['fundamentals', 'frontend', 'backend', 'design', 'ai', 'collaboration'];

export interface Build {
  readonly id: string;
  readonly title: string;
  /** O que a pessoa tem na mão quando termina, em uma frase concreta. */
  readonly result: string;
  /** O que a construção prova no portfólio. */
  readonly shows: readonly PortfolioFacet[];
  /** A frase para o currículo e o LinkedIn, em primeira pessoa, no passado. */
  readonly pitch: string;
  readonly kind: BuildKind;
  /** Nível da trilha em que a construção fecha. */
  readonly levelId: string;
  /** Vazio = dá para fazer sem saber nada ainda: é a porta de entrada. */
  readonly requires: readonly BuildRequirement[];
  /** O que a construção exercita; pode incluir competências de níveis adiante, como um gosto. */
  readonly exercises: readonly CompetencyId[];
  readonly steps: readonly string[];
  /** O critério observável de pronto. */
  readonly doneWhen: string;
  /** Recursos do catálogo que apoiam a construção. */
  readonly resources: readonly string[];
  /** Ferramentas do kit que a pessoa precisa ter em mãos antes do passo 1. */
  readonly tools: readonly string[];
  readonly estimatedMinutes: number;
}

// ---------------------------------------------------------------------------
// Hábitos profissionais
// ---------------------------------------------------------------------------

export type HabitTradition = 'pragmatic-programmer' | 'extreme-programming' | 'ai-tutor' | 'apprenticeship-patterns';

/** Agrupamento do espaço comportamental. É organização para leitura, não taxonomia teórica. */
export type HabitTheme = 'learn' | 'verify' | 'craft' | 'deliver' | 'collaborate' | 'attitude' | 'career';

/**
 * Forma de trabalhar que acompanha a técnica.
 *
 * Não é competência: não tem nível, não entra no escore e não muda a ordem do roadmap. É
 * conteúdo, como o recurso — aparece na ficha desde a primeira competência para que o
 * iniciante aprenda o hábito junto com a técnica, e não num capítulo de boas práticas para
 * depois. Segue o mesmo protocolo de fundamentação: duas classes de fonte.
 */
export interface ProfessionalHabit {
  readonly id: string;
  readonly title: string;
  /** Paráfrase própria. Da obra citada só entra o título curto da dica ou da prática. */
  readonly detail: string;
  readonly tradition: HabitTradition;
  readonly theme: HabitTheme;
  /** Atribuição curta para a ficha; a proveniência completa está em `sources`. */
  readonly credit: string;
  /** Vazio = hábito de postura geral: aparece no espaço comportamental, não em ficha de nó. */
  readonly competencies: readonly CompetencyId[];
  readonly sources: readonly Source[];
}

// ---------------------------------------------------------------------------
// Kit — ferramentas do dev de 2026
// ---------------------------------------------------------------------------

export type ToolCategory =
  | 'editor'
  | 'version-control'
  | 'browser'
  | 'http'
  | 'quality'
  | 'ai'
  | 'delivery';

/**
 * Como se passa a ter a ferramenta. Sem isto a lista dizia o que cada uma era e calava sobre o
 * óbvio para quem começa: o DevTools já está no navegador; o Prettier entra no projeto; o
 * Context7 é um plugin do assistente.
 */
export type ToolSetupKind =
  | 'built-in'
  | 'account'
  | 'install'
  | 'project-dependency'
  | 'repository-file'
  | 'claude-plugin';

export interface ToolSetup {
  readonly kind: ToolSetupKind;
  /** Uma frase para quem nunca fez isso. */
  readonly note: string;
  /** O comando, quando um comando resolve; copiável na tela. */
  readonly command?: string;
}

/** Competência mínima para a ferramenta fazer sentido. */
export interface ToolGate {
  readonly competency: CompetencyId;
  readonly atLevel: Level;
}

/**
 * Ferramenta do kit.
 *
 * Segue a mesma lógica do roadmap: aparece para todos, mas é DESTRAVADA pelo estado de
 * competências, com o motivo dito. Ferramenta antes da base vira muleta — é o mesmo argumento
 * da aresta depuração → IA, aplicado ao que o dev instala. O portão é um pré-requisito
 * declarado, não uma recomendação de ordem, e por isso é verificável.
 */
export interface Tool {
  readonly id: string;
  readonly name: string;
  readonly category: ToolCategory;
  /** Para que serve, numa linha. */
  readonly use: string;
  /** Por que adotar — e por que neste momento, e não antes. */
  readonly why: string;
  /** Página oficial da ferramenta (ADR-0005: só link). */
  readonly url: string;
  readonly cost: ResourceCost;
  readonly costNote?: string;
  /** Situação da DOCUMENTAÇÃO em português, não da interface. */
  readonly ptBrStatus: PtBrStatus;
  readonly stability: Stability;
  /** Vazio = desde o primeiro dia. */
  readonly unlockedBy: readonly ToolGate[];
  readonly setup: ToolSetup;
  /** Ferramenta muda rápido; sem data, a recomendação envelhece sem ninguém perceber. */
  readonly verifiedAt: string;
}

// ---------------------------------------------------------------------------
// Pessoas — quem vale seguir
// ---------------------------------------------------------------------------

/**
 * Uma pessoa, ou um canal com rosto, que publica em português para quem está começando. Escolha
 * editorial do autor, com a página oficial conferida (ADR-0005: só link). O portão diz quando
 * acompanhar passa a render, pela mesma régua das ferramentas; nada é trancado (ADR-0009).
 */
export interface Person {
  readonly id: string;
  readonly name: string;
  /** Página oficial da pessoa ou do canal. */
  readonly url: string;
  /** O que publica, numa linha. */
  readonly publishes: string;
  /** Por que vale seguir para quem está começando, e por onde começar. */
  readonly why: string;
  /** Competências em que ajuda. */
  readonly competencies: readonly CompetencyId[];
  /** Vazio = desde o primeiro dia. */
  readonly unlockedBy: readonly ToolGate[];
  readonly verifiedAt: string;
}

// ---------------------------------------------------------------------------
// Estado do usuário
// ---------------------------------------------------------------------------

export type EvidenceSource = 'self-report' | 'probe' | 'artifact';
export type Confidence = 'low' | 'medium' | 'high';

/** Confiança é derivada da origem da evidência, nunca informada solta — evita que
 *  duas partes do sistema discordem sobre quanto confiar no mesmo dado. */
export const CONFIDENCE_BY_EVIDENCE: Record<EvidenceSource, Confidence> = {
  'self-report': 'low',
  probe: 'medium',
  artifact: 'medium',
};

export interface UserCompetency {
  readonly competency: CompetencyId;
  readonly level: Level;
  readonly evidence: EvidenceSource;
}

/**
 * Critério de saída que o usuário declarou cumprir.
 *
 * Marcar NUNCA promove o nível (docs/DECISOES.md §3). Registra a afirmação e torna o
 * progresso visível; quem promove é evidência — sondagem ou reavaliação. A proposta
 * anterior, de confiança agregada com pesos, promovia 16 das 25 competências com um
 * clique, e um checklist que se autopromove é o mecanismo de gaming mais barato que existe.
 */
export interface CriterionAssertion {
  readonly competency: CompetencyId;
  readonly level: Level;
  readonly criterionIndex: number;
  readonly assertedAt: string;
}

export interface UserProfile {
  readonly id: string;
  readonly trackId: string;
  readonly emphasisId?: string;
  /** Linguagem de servidor escolhida (uma das `stacks` do track). Só reordena materiais. */
  readonly technologyId?: TechnologyId;
  readonly competencies: readonly UserCompetency[];
  readonly assertions?: readonly CriterionAssertion[];
}

// ---------------------------------------------------------------------------
// Saídas calculadas
// ---------------------------------------------------------------------------

export type GapStatus = 'met' | 'available' | 'blocked';

export interface Gap {
  readonly competency: CompetencyId;
  readonly currentLevel: Level;
  readonly targetLevel: Level;
  /** Distância em níveis. Zero significa alvo atingido. */
  readonly size: number;
  readonly criticality: Criticality;
  readonly confidence: Confidence;
  /** Autoavaliação baixa em competência que trava outras: o roadmap pede verificação
   *  em vez de rebaixar o nível declarado pelo usuário (ADR-0003). */
  readonly needsVerification: boolean;
}

export type ReasonCode =
  | 'CORE_GAP_FOR_TARGET'
  | 'SUPPORTS_TARGET'
  | 'UNLOCKS_OTHER_COMPETENCIES'
  | 'LARGE_GAP'
  | 'BLOCKED_BY_PREREQUISITE'
  | 'NEEDS_VERIFICATION'
  | 'PREMATURE_SPECIALIZATION'
  | 'LOW_IMPACT_FOR_TARGET'
  | 'OUT_OF_TRACK_SCOPE'
  | 'TARGET_ALREADY_MET';

export interface ScoreComponent {
  readonly raw: number;
  readonly normalized: number;
  readonly weight: number;
  readonly contribution: number;
}

export interface ScoreBreakdown {
  readonly gapSize: ScoreComponent;
  readonly criticality: ScoreComponent;
  readonly unlockCount: ScoreComponent;
  readonly total: number;
}

export type ItemStatus = 'available' | 'blocked';

export interface RoadmapItem {
  readonly competency: CompetencyId;
  readonly status: ItemStatus;
  readonly rank: number;
  /** Onda em que a competência se torna alcançável: 0 = agora, k = após as ondas anteriores. */
  readonly wave: number;
  readonly gap: Gap;
  readonly score: number;
  readonly breakdown: ScoreBreakdown;
  readonly reasonCodes: readonly ReasonCode[];
  readonly blockedBy: readonly CompetencyId[];
}

export interface ExcludedItem {
  readonly competency: CompetencyId;
  readonly reasonCode: ReasonCode;
  readonly explanation: string;
}

export interface Roadmap {
  readonly trackId: string;
  readonly emphasisId?: string;
  readonly catalogVersion: string;
  readonly generatedAt: string;
  /** Snapshot do perfil usado. Permite reproduzir o resultado e mostrar o diff na
   *  reavaliação sem depender do estado atual do usuário. */
  readonly inputSnapshot: UserProfile;
  readonly items: readonly RoadmapItem[];
  readonly met: readonly CompetencyId[];
  /** Competências cujo nível foi autodeclarado e que travam outras — inclusive as já
   *  dadas como atingidas. Uma falsa "já sei" é mais cara que um gap: ela some do
   *  roadmap E destrava indevidamente o que vem depois (ADR-0003). */
  readonly verificationNeeded: readonly CompetencyId[];
  readonly excluded: readonly ExcludedItem[];
  readonly nextBestAction?: RoadmapItem;
}
