export const meta = {
  name: 'career-gap-direction-research',
  description: 'Pesquisa multi-lente sobre como dar direção concreta ao roadmap (tecnologias, recursos BR, pessoas, livros) com verificação adversarial',
  phases: [
    { title: 'Pesquisa', detail: '8 lentes em paralelo, cada uma com fontes web' },
    { title: 'Verificação', detail: 'cada pessoa/recurso citado é checado: existe, ativo, relevante, licença' },
    { title: 'Síntese', detail: 'plano de melhoria confrontado com os documentos do projeto' },
    { title: 'Crítica', detail: 'o que ficou faltando' },
  ],
}

const USER_FEEDBACK = `Feedback literal do dono do produto (Enzo, autor do TCC), 2026-09-11:
"estou gostando do visual em si, mas estou sentindo falta de um melhor direcionamento para o usuário. Vejo que no formato que está seria mais útil fazer uma cópia do roadmap.sh — chegaríamos a um lugar melhor — e não é isso que quero sentir. O uso será por brasileiros; devemos citar linguagens e frameworks sim; a ideia é sim parecida com um roadmap.sh, porém mais personalizado, trazendo skills, links de vídeos, pessoas interessantes de se acompanhar, indicação de livros para ler e coisas do tipo."`

const PROJECT = `Contexto do produto Career Gap (TCC de Sistemas de Informação, Brasil):
- Público: estudantes e iniciantes buscando a primeira vaga em desenvolvimento web.
- Motor atual: catálogo de 25 competências CAPABILITY-FIRST (ex.: programming-fundamentals, javascript-essentials, html-semantics, css-layout, dom-and-browser, http-fundamentals, web-accessibility-basics, command-line-basics, version-control-git, reading-documentation, code-readability, debugging, build-an-application, relational-data-modeling, sql-basics, api-consumption, api-development, authentication-basics, automated-testing-basics, code-review-participation, deployment-basics, technical-communication, ai-assisted-development-basics, problem-decomposition, algorithms-and-complexity), níveis L0–L3 definidos por frases "consigo fazer X", pré-requisitos duros, ranking por escore, política editorial que produz NOT NOW.
- Tecnologia é dimensão ortogonal (tag em recurso), não competência. JavaScript/HTML aparecem porque são a plataforma web.
- Restrições legais já verificadas: roadmap.sh proíbe redistribuição de conteúdo (só citar); BibliotecaDev hospeda cópias piratas (não usar); CS50 é CC BY-NC-SA; catálogo só pode LINKAR para a página do detentor dos direitos.
- Interface atual: canvas estilo quadro branco (React Flow + rough.js), nós com nome da competência e nível atual→alvo, painel de detalhe com "por quê", lista NOT NOW. Ainda SEM recursos, SEM tecnologias nomeadas nos nós, SEM pessoas, SEM livros.
- Regra de ouro: o LLM nunca gera URL/recurso; tudo vem de catálogo curado. Cada recurso guarda idioma, custo, licença, fonte, estabilidade (evergreen/volátil).`

const RESEARCH_SCHEMA = {
  type: 'object',
  properties: {
    insights: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          claim: { type: 'string' },
          evidence: { type: 'string' },
          source_url: { type: 'string' },
          implication_for_career_gap: { type: 'string' },
        },
        required: ['claim', 'evidence', 'source_url', 'implication_for_career_gap'],
      },
    },
    entries: {
      type: 'array',
      description: 'Pessoas, canais, vídeos, livros, cursos, docs, comunidades, ideias de projeto — concretos, com URL',
      items: {
        type: 'object',
        properties: {
          kind: { type: 'string', enum: ['person', 'channel', 'video', 'playlist', 'book', 'course', 'doc', 'article', 'tool', 'community', 'project-idea', 'dataset', 'platform'] },
          name: { type: 'string' },
          url: { type: 'string' },
          language: { type: 'string', enum: ['pt-BR', 'en', 'pt-BR+en', 'other'] },
          cost: { type: 'string', enum: ['free', 'paid', 'freemium', 'free-to-read'] },
          competencies: { type: 'array', items: { type: 'string' }, description: 'slugs do catálogo Career Gap' },
          level: { type: 'string', enum: ['L0', 'L1', 'L2', 'L3', 'any'] },
          technology: { type: 'string', description: 'ex.: javascript, react, node, php-laravel, python-django, sql, git, agnostic' },
          why: { type: 'string', description: 'por que serve a ESSE gap, não por que é popular' },
          stability: { type: 'string', enum: ['evergreen', 'volatile'] },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'], description: 'sua certeza de que existe, está ativo e é o que você descreve' },
        },
        required: ['kind', 'name', 'url', 'language', 'cost', 'competencies', 'why', 'confidence'],
      },
    },
    open_questions: { type: 'array', items: { type: 'string' } },
  },
  required: ['insights', 'entries', 'open_questions'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          url: { type: 'string' },
          exists: { type: 'boolean' },
          active_or_current: { type: 'boolean', description: 'canal/pessoa ativos nos últimos ~18 meses; livro/doc não obsoleto' },
          relevant_to_stated_competencies: { type: 'boolean' },
          legally_linkable: { type: 'boolean', description: 'página do detentor dos direitos, não cópia pirata/mirror' },
          corrected_url: { type: 'string' },
          notes: { type: 'string' },
          keep: { type: 'boolean' },
        },
        required: ['name', 'url', 'exists', 'active_or_current', 'relevant_to_stated_competencies', 'legally_linkable', 'keep', 'notes'],
      },
    },
  },
  required: ['verdicts'],
}

const TOOLS_HINT = `Ferramentas: você tem WebSearch e WebFetch (carregue com ToolSearch "select:WebSearch,WebFetch" antes de usar). Pesquise DE VERDADE: abra páginas, confirme URLs, datas e existência. Não invente canal, vídeo, livro ou pessoa. Se não tiver certeza, marque confidence=low — será verificado depois. Prefira URLs canônicas (site do autor/editora, canal oficial, documentação oficial). Nunca cite BibliotecaDev, mirrors ou PDFs piratas. Responda em português.`

const LENSES = [
  {
    key: 'roadmapsh',
    prompt: `${PROJECT}\n\n${USER_FEEDBACK}\n\nLENTE: anatomia do roadmap.sh. Por que ele PARECE útil e diretivo? Estude a fundo: estrutura dos nós (nomeia tecnologias concretas? marca "recomendado" vs "alternativa"? como apresenta recursos por nó — artigos, vídeos, docs?), checkboxes de progresso, "project ideas" por roadmap, roadmaps "beginner" vs "role-based", best practices, questões. Depois procure críticas e sentimento de usuários (Hacker News, Reddit r/learnprogramming, r/webdev, artigos): o que elogiam, o que reclamam (overwhelm? falta de ordem? "everything looks equally important"? falta de personalização?). Extraia 8–15 insights sobre O QUE DÁ SENSAÇÃO DE DIREÇÃO e O QUE FALTA, cada um com implicação concreta para o Career Gap. Em 'entries', liste apenas project-ideas ou padrões reutilizáveis (sem copiar conteúdo do roadmap.sh — licença proíbe). ${TOOLS_HINT}`,
  },
  {
    key: 'directive-products',
    prompt: `${PROJECT}\n\n${USER_FEEDBACK}\n\nLENTE: produtos de aprendizagem que são DIRETIVOS ("faça isto, depois isto") e por quê funcionam. Estude: The Odin Project (opinativo, baseado em projetos, uma trilha só, muito elogiado por iniciantes), freeCodeCamp (currículo linear com projetos certificadores), boot.dev, Exercism (tracks + mentoria), Codecademy career paths, Scrimba, Frontend Mentor (desafios), Duolingo/Khan Academy (path UI, mastery, unidades). Para cada um: como estruturam a próxima ação, como nomeiam tecnologias, como equilibram "ver o todo" vs "só o próximo passo", como usam projetos como marco, como lidam com escolha de stack. Busque também depoimentos de aprendizes (Reddit, HN, blogs) sobre por que Odin/fCC funcionam para eles. Extraia padrões de UX/conteúdo reaproveitáveis e os que NÃO cabem num TCC. Em 'entries', liste os produtos/plataformas com URL e as competências que cobrem bem para iniciante. ${TOOLS_HINT}`,
  },
  {
    key: 'br-creators',
    prompt: `${PROJECT}\n\n${USER_FEEDBACK}\n\nLENTE: criadores e canais BRASILEIROS de qualidade para iniciantes em desenvolvimento web, mapeados a competências específicas. Investigue e VERIFIQUE (canal existe, ativo, conteúdo condiz): Fabio Akita/Akitando (encontre vídeos ESPECÍFICOS sobre fundamentos, carreira para iniciante, como estudar, Git, HTTP, bancos, IA — com URL e título exatos, não "assista o canal"), Curso em Vídeo (Gustavo Guanabara — playlists de lógica, HTML5/CSS3, JavaScript, Git), Rocketseat (conteúdo gratuito: Discover, NLW), Loiane Groner (JavaScript, estruturas de dados), Filipe Deschamps, Rafaella Ballerini, Código Fonte TV, Programação Dinâmica, Dev Soutinho/Mario Souto, Lucas Montano, Otávio Miranda, Willian Justen, Erick Wendel (JS/Node), Rodrigo Branas (Clean Code, arquitetura), Full Cycle/Wesley Willians, Matheus Battisti (Hora de Codar), Balta.io, Origamid (André Rafael), Zan Franceschi, Elemar Jr., Hipsters.tech/Alura podcasts, DevNaEstrada, Fabio Vedovelli, Diego Fernandes. Para cada: URL canônica, quais competências do catálogo cobre e em que nível, idioma, custo, estabilidade do conteúdo, e um VÍDEO ou PLAYLIST específico com URL quando possível. Marque confidence honesto. Também identifique QUEM está desatualizado ou vende curso caro sem material gratuito equivalente. Priorize mapeamento para: programming-fundamentals, javascript-essentials, html-semantics, css-layout, http-fundamentals, version-control-git, debugging, automated-testing-basics, sql-basics, api-development, deployment-basics, technical-communication, ai-assisted-development-basics. ${TOOLS_HINT}`,
  },
  {
    key: 'br-books-courses',
    prompt: `${PROJECT}\n\n${USER_FEEDBACK}\n\nLENTE: LIVROS e CURSOS ESTRUTURADOS adequados a iniciantes brasileiros, com situação legal e de idioma verificada. Livros: gratuitos e legais em pt-BR (Pro Git pt-BR em git-scm.com, Eloquent JavaScript tradução braziljs, Pense em Python, "Desenvolvimento Web com HTML, CSS e JavaScript" da Caelum, Dive Into HTML5 pt-BR, apostilas Caelum), livros pagos mas baratos e muito adotados no Brasil (Casa do Código: quais títulos servem a iniciante em JS/HTML/CSS/Git/SQL/testes?), traduções pt-BR de clássicos (Entendendo Algoritmos/Grokking Algorithms, Código Limpo, Refatoração, O Programador Pragmático, Arquitetura Limpa — avalie se são ADEQUADOS a iniciante ou cedo demais) e clássicos em inglês gratuitos (javascript.info, You Don't Know JS, Learn Git Branching, SQLBolt, Use The Index Luke). Cursos gratuitos estruturados: Curso em Vídeo, Alura (o que é grátis?), DIO, freeCodeCamp (tem pt-BR?), Origamid (gratuitos), CS50 (existe versão/legenda pt-BR? licença CC BY-NC-SA), The Odin Project (só en), Programaê, Fundação Bradesco, Ada/Reprograma/{reprograma}. Para cada entrada: URL canônica do detentor, idioma, custo, competências e nível, e um julgamento "cabe para iniciante?" Quando um livro só serve a parte do gap, indique capítulo(s). Regra: linkar só página oficial de autor/editora/plataforma. ${TOOLS_HINT}`,
  },
  {
    key: 'br-market-stacks',
    prompt: `${PROJECT}\n\n${USER_FEEDBACK}\n\nLENTE: quais linguagens/frameworks as vagas de ENTRADA (estágio/júnior) em desenvolvimento web no BRASIL realmente pedem (2024–2026), com fontes verificáveis e datadas. Procure: Stack Overflow Developer Survey (recorte Brasil se houver), relatórios Gupy/Programathor/Revelo/GeekHunter/Coodesh/Impulso/Vagas.com, "Pesquisa Estado do Desenvolvedor Brasileiro", Alura+Google "Panorama de TI", Brasscom, LinkedIn Economic Graph Brasil, GitHub Octoverse (Brasil), JetBrains State of Developer Ecosystem (Brasil), artigos acadêmicos brasileiros que mineraram anúncios de vaga (SBES, SBSI, SBIE, WEI). Objetivo: ranquear stacks para PRIMEIRA vaga web no Brasil — JavaScript/TypeScript + React + Node; Java + Spring; PHP + Laravel; Python + Django/Flask; C# + .NET; Ruby on Rails; Angular; Vue — e dizer quais o Career Gap deve oferecer como "escolha de stack" no MVP (poucas!). Também: quão frequentes são SQL, Git, testes, Docker, cloud, inglês em vagas júnior. Cada afirmação com fonte, ano e limitação metodológica. Se não achar dado brasileiro sólido, DIGA — não invente percentuais. ${TOOLS_HINT}`,
  },
  {
    key: 'people-as-resources',
    prompt: `${PROJECT}\n\n${USER_FEEDBACK}\n\nLENTE: PESSOAS como recurso de aprendizagem — como recomendar sem ser lista de influencer. Pesquise: (1) como produtos/currículos fazem isso (ex.: "who to follow" em plataformas, listas curadas tipo awesome-lists, newsletters, Roadmap.sh não faz); (2) critérios de curadoria defensáveis: pessoa ligada a competência específica, evidência de expertise (obra, projeto, docência), conteúdo gratuito recorrente, atualidade, sinal/ruído, ausência de venda agressiva; (3) riscos: parasocialidade, opinião confundida com consenso, obsolescência, viés de gênero/região (procure ativamente mulheres e pessoas negras da comunidade dev brasileira com conteúdo técnico sólido: ex. Loiane Groner, Rafaella Ballerini, Camila Achutti, Nina da Hora, Iana Chan, Bianca Gonçalves? — VERIFIQUE cada uma e o que ensinam); (4) figuras internacionais ligadas a competências de iniciante: Kevin Powell (CSS), Josh W. Comeau (CSS/React), Dan Abramov (React), Kent C. Dodds (testes/React), Wes Bos, Fireship, ThePrimeagen (carreira/fundamentos?), Kyle Simpson (JS), Martin Fowler (refatoração/testes — nível?), Kent Beck, Julia Evans (redes/HTTP/debugging — zines!), Addy Osmani (web perf). Para cada pessoa: URL canônica (site/canal), competências específicas, nível, idioma, por que (não popularidade), confidence. Proponha uma POLÍTICA de curadoria de pessoas em 5–8 regras. ${TOOLS_HINT}`,
  },
  {
    key: 'canonical-en-resources',
    prompt: `${PROJECT}\n\n${USER_FEEDBACK}\n\nLENTE: recursos CANÔNICOS internacionais, gratuitos, por competência de iniciante — com nota sobre tradução pt-BR quando existir. Para CADA competência do catálogo, ache 1–3 recursos canônicos: MDN (caminhos específicos: Learn web development, HTTP overview, DOM intro — verifique se a página existe em pt-BR), web.dev/learn (CSS, HTML, forms, accessibility), javascript.info (há tradução pt-BR? quão completa?), react.dev (pt-br.react.dev — quão completa?), Pro Git (pt-br), Learn Git Branching (interativo, pt-BR?), SQLBolt, PostgreSQL Tutorial, Use The Index Luke (pt-BR existe), Julia Evans zines (HTTP, debugging), Testing Library / Vitest docs, Kent C. Dodds "Testing Trophy", Martin Fowler "TestPyramid"/"Refactoring" (nível?), The Missing Semester (MIT — linha de comando, Git, debugging; pt-BR existe!), CS50x (pt-BR?), Harvard CS50 Web (Python/JS), freeCodeCamp Responsive Web Design / JS Algorithms, The Odin Project Foundations, roadmap.sh (só citar), OWASP Cheat Sheets (autenticação), 12factor.net (deploy — pt-BR existe), Vercel/Render/Railway docs (deploy grátis), GitHub Docs pt-BR, Conventional Commits pt-BR, Google "Technical Writing" course, README templates. Verifique existência e idioma de cada URL. Marque estabilidade. ${TOOLS_HINT}`,
  },
  {
    key: 'science-of-direction',
    prompt: `${PROJECT}\n\n${USER_FEEDBACK}\n\nLENTE: base ACADÊMICA para "mostrar pouco e dizer o próximo passo" — citável no TCC. Pesquise e traga referências verificáveis (autor, ano, veículo, URL/DOI): sobrecarga de escolha (Iyengar & Lepper 2000; meta-análise Scheibehenne 2010 — quando o efeito existe e quando não), lei de Hick, efeito goal-gradient (Kivetz 2006) e progresso visível, desirable difficulties e prática espaçada/intercalada (Bjork; Dunlosky 2013), aprendizagem baseada em projetos em programação, Zona de Desenvolvimento Proximal / outer fringe (KST) já usada, "expertise reversal effect" (Kalyuga) — iniciante precisa de mais orientação, teoria da carga cognitiva (Sweller) e worked examples em programação, self-regulated learning e "next best action" em sistemas adaptativos, pesquisa sobre roadmaps/currículos de aprendizagem autodirigida (MOOC dropout e falta de estrutura), estudos sobre motivação em iniciantes em programação (autoeficácia, sentimento de pertencimento — Brasil se houver). Para cada referência: o que ela justifica NO DESIGN do Career Gap (ex.: "mostrar 3 próximas ações e não 10", "projeto como marco", "checklist de saída", "explicar o porquê"). Marque o que é sólido vs contestado. ${TOOLS_HINT}`,
  },
]

phase('Pesquisa')
log('8 lentes de pesquisa em paralelo; cada uma verifica suas próprias URLs')

// Só os tipos propensos a invenção: docs oficiais, plataformas e comunidades têm URLs
// notórias e não justificam um agente cada.
const VERIFIABLE = new Set(['person', 'channel', 'video', 'playlist', 'book', 'course'])

const verifyBatch = (batch, lensKey, batchIndex) =>
  agent(
    `Você é um verificador CÉTICO. Abaixo estão ${batch.length} recursos/pessoas propostos por um pesquisador para um catálogo educacional brasileiro (Career Gap). Sua missão é REFUTAR: para cada item, abra a URL (WebFetch) e/ou pesquise (WebSearch) e determine: existe de fato? está ativo/atual (canal com vídeos nos últimos ~18 meses; livro/doc não obsoleto)? é relevante para as competências alegadas? a URL é a página do DETENTOR dos direitos (não mirror, não PDF pirata, não BibliotecaDev, não Scribd)? Corrija a URL se achar a canônica. Se qualquer dúvida séria persistir, keep=false. Em notes, registre o que confirmou e o que não conseguiu confirmar. Carregue ferramentas com ToolSearch "select:WebSearch,WebFetch". Responda em português.\n\nITENS:\n${JSON.stringify(batch, null, 1)}`,
    { label: `verify:${lensKey}#${batchIndex}`, phase: 'Verificação', schema: VERDICT_SCHEMA },
  )

const results = await pipeline(
  LENSES,
  (lens) => agent(lens.prompt, { label: `pesquisa:${lens.key}`, phase: 'Pesquisa', schema: RESEARCH_SCHEMA }),
  async (research, lens) => {
    if (!research) return null
    const toVerify = research.entries.filter((e) => VERIFIABLE.has(e.kind))
    const batches = []
    for (let i = 0; i < toVerify.length; i += 20) batches.push(toVerify.slice(i, i + 20))
    if (batches.length === 0) return { lens: lens.key, research, verdicts: [] }
    log(`${lens.key}: ${toVerify.length} itens para verificar em ${batches.length} lote(s)`)
    const verified = await parallel(batches.map((batch, i) => () => verifyBatch(batch, lens.key, i)))
    const verdicts = verified.filter(Boolean).flatMap((v) => v.verdicts)
    return { lens: lens.key, research, verdicts }
  },
)

const complete = results.filter(Boolean)
const dropped = LENSES.length - complete.length
if (dropped > 0) log(`ATENÇÃO: ${dropped} lente(s) falharam e não entram na síntese`)

const kept = complete.flatMap((r) => r.verdicts.filter((v) => v.keep).length).reduce((a, b) => a + b, 0)
const rejected = complete.flatMap((r) => r.verdicts.filter((v) => !v.keep).length).reduce((a, b) => a + b, 0)
log(`Verificação: ${kept} itens mantidos, ${rejected} rejeitados`)

phase('Síntese')

const SYNTHESIS_SCHEMA = {
  type: 'object',
  properties: {
    diagnosis: { type: 'string', description: 'por que a experiência atual parece menos útil que roadmap.sh, em termos precisos' },
    principles: { type: 'array', items: { type: 'string' } },
    changes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          priority: { type: 'number' },
          title: { type: 'string' },
          what: { type: 'string' },
          why: { type: 'string' },
          evidence: { type: 'string', description: 'insights/refs da pesquisa que sustentam' },
          effort: { type: 'string', enum: ['S', 'M', 'L'] },
          scope_risk: { type: 'string', enum: ['low', 'medium', 'high'], description: 'risco de ferir INITIAL_SCOPE/ADRs' },
          touches: { type: 'array', items: { type: 'string' }, description: 'modelo, catálogo, UI, docs…' },
        },
        required: ['priority', 'title', 'what', 'why', 'evidence', 'effort', 'scope_risk', 'touches'],
      },
    },
    node_card_spec_markdown: { type: 'string', description: 'especificação da "ficha" de um nó concreto (ex.: Construir sua primeira API com Node+Express): seções, campos, exemplo preenchido com recursos VERIFICADOS' },
    stack_choice_spec_markdown: { type: 'string', description: 'como o usuário escolhe stack (quais opções, quando, como afeta nós/recursos) — fundamentado no mercado BR' },
    people_policy: { type: 'array', items: { type: 'string' } },
    resource_curation_rules: { type: 'array', items: { type: 'string' } },
    verified_seed_entries: {
      type: 'array',
      description: 'os melhores itens VERIFICADOS (keep=true) prontos para virar seed do catálogo — no máximo 60, distribuídos entre competências',
      items: {
        type: 'object',
        properties: {
          kind: { type: 'string' }, name: { type: 'string' }, url: { type: 'string' }, language: { type: 'string' }, cost: { type: 'string' },
          competencies: { type: 'array', items: { type: 'string' } }, level: { type: 'string' }, technology: { type: 'string' }, action_type: { type: 'string', enum: ['LEARN', 'READ', 'WATCH', 'BUILD', 'PROVE', 'FOLLOW'] }, why: { type: 'string' },
        },
        required: ['kind', 'name', 'url', 'language', 'cost', 'competencies', 'action_type', 'why'],
      },
    },
    coverage_gaps: { type: 'array', items: { type: 'string' }, description: 'competências para as quais NÃO se achou recurso pt-BR verificado' },
    user_suggestions_review: {
      type: 'array',
      items: { type: 'object', properties: { suggestion: { type: 'string' }, verdict: { type: 'string', enum: ['adotar', 'adotar-com-ajuste', 'adiar', 'rejeitar'] }, why: { type: 'string' } }, required: ['suggestion', 'verdict', 'why'] },
    },
    academic_refs: { type: 'array', items: { type: 'object', properties: { ref: { type: 'string' }, justifies: { type: 'string' } }, required: ['ref', 'justifies'] } },
    report_markdown: { type: 'string', description: 'relatório completo em português para docs/research/DIRECAO.md — organizado, com URLs, sem prolixidade' },
  },
  required: ['diagnosis', 'principles', 'changes', 'node_card_spec_markdown', 'stack_choice_spec_markdown', 'people_policy', 'resource_curation_rules', 'verified_seed_entries', 'coverage_gaps', 'user_suggestions_review', 'academic_refs', 'report_markdown'],
}

const synthesis = await agent(
  `Você é arquiteto de produto sênior + pesquisador do Career Gap. Recebe abaixo a pesquisa de ${complete.length} lentes e os vereditos de verificação de cada pessoa/recurso citado. Sua tarefa: produzir o PLANO DE MELHORIA que dá DIREÇÃO CONCRETA ao usuário sem abandonar o modelo capability-first do motor.

ANTES de escrever, LEIA (tool Read) estes arquivos do projeto para não propor o que já existe nem violar decisões:
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/INITIAL_SCOPE.md
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/docs/DISCOVERY.md
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/docs/adr/0001-estrutura-de-competencias.md
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/docs/adr/0004-fronteiras-da-ia.md
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/docs/adr/0005-catalogo-de-recursos-apenas-links.md
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/career-gap/src/catalog/competencies.ts (nomes, slugs, níveis)
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/career-gap/src/domain/model.ts

${USER_FEEDBACK}

Tese a testar (você pode refutá-la): a competência deve continuar sendo a ESPINHA do motor (elegibilidade, ranking, NOT NOW), mas a EXPERIÊNCIA deve ser concreta — o usuário vê "Construa sua primeira API com Node.js + Express" e não "Construção de API"; cada nó vira uma FICHA com LEARN/WATCH/READ/BUILD/PROVE/FOLLOW usando recursos verificados, preferindo pt-BR; o usuário escolhe uma stack (poucas opções, fundamentadas no mercado BR) que especializa títulos e recursos; o "próximo passo" vira um plano de ação com 1–3 itens e critério de saída, não 10 nós disponíveis.

Regras: use SOMENTE itens com keep=true em verified_seed_entries (máx. 60, cobrindo o máximo de competências; indique action_type). Liste coverage_gaps honestamente. Em user_suggestions_review, avalie cada sugestão do Enzo (citar linguagens/frameworks; vídeos; pessoas; livros; parecer com roadmap.sh porém personalizado) — pode discordar com argumento. Em changes, ordene por impacto na sensação de direção ÷ esforço, e marque scope_risk contra o TCC (o orientador pediu escopo controlado; comparação A/B e avaliação com usuários são o núcleo). Toda afirmação em report_markdown deve ter URL ou referência. Escreva em português, direto, sem enfeite.

PESQUISA + VEREDITOS:
${JSON.stringify(complete, null, 1)}`,
  { label: 'sintese', phase: 'Síntese', schema: SYNTHESIS_SCHEMA, effort: 'high' },
)

phase('Crítica')
const critique = await agent(
  `Você é um crítico de completude e um avaliador de banca de TCC ao mesmo tempo. Leia o plano abaixo e responda em português, em no máximo 25 linhas, apenas o que FALTA ou está ERRADO: (1) alguma mudança proposta fere o escopo do orientador (público de entrada, escopo controlado, avaliação com usuários como núcleo) ou as ADRs (motor determinístico; LLM não gera recursos; catálogo só-links)? (2) alguma afirmação factual sem fonte ou pessoa/recurso que parece não ter passado por verificação? (3) competências importantes ficaram sem recurso pt-BR e o plano não diz o que fazer? (4) a "ficha do nó" resolve de fato a queixa "não sinto direção" — ou só adiciona links? (5) o que um avaliador de RecSys/educação questionaria? Termine com 3 perguntas que o Enzo precisa responder antes de implementar.

PLANO:
${JSON.stringify({ diagnosis: synthesis?.diagnosis, principles: synthesis?.principles, changes: synthesis?.changes, node_card: synthesis?.node_card_spec_markdown, stack: synthesis?.stack_choice_spec_markdown, people_policy: synthesis?.people_policy, rules: synthesis?.resource_curation_rules, coverage_gaps: synthesis?.coverage_gaps, seeds_count: synthesis?.verified_seed_entries?.length, review: synthesis?.user_suggestions_review }, null, 1)}`,
  { label: 'critica', phase: 'Crítica', effort: 'high' },
)

return {
  lenses_completed: complete.map((r) => r.lens),
  verification: { kept, rejected },
  synthesis,
  critique,
  raw_research: complete.map((r) => ({ lens: r.lens, insights: r.research.insights, open_questions: r.research.open_questions, verdicts: r.verdicts })),
}