export const meta = {
  name: 'career-gap-finalizacao',
  description: 'Verifica os livros e cursos brasileiros e produz o plano final de direção para o Career Gap',
  phases: [
    { title: 'Verificação', detail: 'livros e cursos BR: existe, gratuito, licença, nível, tradução' },
    { title: 'Plano', detail: 'síntese final confrontada com os documentos do projeto' },
    { title: 'Crítica', detail: 'o que fere escopo ou ficou sem fonte' },
  ],
}

// Os itens ficam em arquivo e cada verificador lê a sua fatia — evita carregar 33KB
// pelo canal de args e pelo contexto da sessão.
const SCRATCH = '/private/tmp/claude-501/-Users-enzoaraujoduarte-Desktop-TCC-ROADMAP/63555353-dc9c-4eae-bd1d-0c165df9b891/scratchpad'
const BOOKS_FILE = `${SCRATCH}/livros-slim.json`
const TOTAL_BOOKS = 51
const BATCH_SIZE = 13

phase('Verificação')

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
          url_resolves: { type: 'boolean' },
          is_free: { type: 'boolean', description: 'o CONTEÚDO é gratuito (certificado pago à parte não descaracteriza)' },
          requires_signup: { type: 'boolean' },
          canonical_rights_holder: { type: 'boolean', description: 'página do autor/editora/plataforma oficial — não mirror nem PDF pirata' },
          pt_br_status_actual: { type: 'string', enum: ['none', 'partial', 'complete', 'n/a'] },
          level_appropriate_for_beginner: { type: 'boolean' },
          publication_year: { type: 'string' },
          license: { type: 'string' },
          corrected_url: { type: 'string' },
          keep: { type: 'boolean' },
          notes: { type: 'string' },
        },
        required: ['name', 'url', 'url_resolves', 'is_free', 'requires_signup', 'canonical_rights_holder', 'pt_br_status_actual', 'level_appropriate_for_beginner', 'keep', 'notes'],
      },
    },
  },
  required: ['verdicts'],
}

const batches = []
for (let start = 0; start < TOTAL_BOOKS; start += BATCH_SIZE) {
  batches.push({ start, end: Math.min(start + BATCH_SIZE, TOTAL_BOOKS) })
}
log(`${TOTAL_BOOKS} livros/cursos em ${batches.length} lotes`)

const checked = await parallel(
  batches.map((batch, i) => () =>
    agent(
      `Você é um verificador CÉTICO de um catálogo educacional brasileiro (Career Gap, público iniciante em desenvolvimento web, níveis L0-L2).

PRIMEIRO: leia o arquivo ${BOOKS_FILE} (tool Read) e trabalhe APENAS com os itens de índice ${batch.start} até ${batch.end - 1} do array (contando do zero). Ignore todos os outros — outro verificador cuida deles.

REFUTE cada um dos seus itens abrindo a URL (WebFetch) e pesquisando (WebSearch):

- a URL abre e é o recurso alegado?
- o CONTEÚDO é gratuito? (certificado pago à parte NÃO descaracteriza; paywall no conteúdo sim). Exige cadastro?
- é a página do detentor dos direitos — autor, editora ou plataforma oficial? **Rejeite mirror, repost e PDF pirata.**
- qual o ANO de publicação/atualização? Material de HTML/CSS/JS anterior a ~2019 é pré-flexbox/grid na prática e não serve como recurso principal.
- o nível é adequado a iniciante (L0-L2)? Livro de arquitetura/refatoração costuma ser L2+ e não serve.
- qual o status REAL da tradução pt-BR? **Abra a URL em português e confira o CORPO do conteúdo.** Aprendemos que interface traduzida com corpo em inglês é comum, e que legenda automática de vídeo não é tradução.
- qual a licença declarada?

Na dúvida séria, keep=false. Corrija a URL quando achar a canônica. Em notes diga o que confirmou e o que não conseguiu.

Carregue ferramentas com ToolSearch "select:WebSearch,WebFetch". Responda em português.`,
      { label: `verifica:livros#${i}`, phase: 'Verificação', schema: VERDICT_SCHEMA },
    ),
  ),
)

const verdicts = checked.filter(Boolean).flatMap((v) => v.verdicts)
log(`Livros/cursos: ${verdicts.filter((v) => v.keep).length} mantidos, ${verdicts.filter((v) => !v.keep).length} rejeitados`)

phase('Plano')

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    books_catalog: {
      type: 'array',
      description: 'SOMENTE keep=true',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' }, url: { type: 'string' }, kind: { type: 'string' },
          competencies: { type: 'array', items: { type: 'string' } }, level_min: { type: 'string' },
          cost: { type: 'string' }, pt_br_status: { type: 'string' }, license: { type: 'string' },
          chapters: { type: 'string', description: 'capítulos específicos quando só parte serve' },
          action_type: { type: 'string', enum: ['LEARN', 'READ', 'WATCH', 'BUILD', 'PROVE'] }, why: { type: 'string' },
        },
        required: ['name', 'url', 'competencies', 'level_min', 'cost', 'pt_br_status', 'action_type', 'why'],
      },
    },
    diagnosis: { type: 'string', description: 'por que a experiência atual não dá direção, em 1 parágrafo preciso' },
    principles: { type: 'array', items: { type: 'string' }, description: '5-8 princípios de design que decorrem da pesquisa' },
    node_card_spec: { type: 'string', description: 'especificação markdown da FICHA DO NÓ: seções, campos e um exemplo REAL preenchido com recursos verificados (use um nó concreto, ex.: http-fundamentals ou api-consumption)' },
    stack_choice_spec: { type: 'string', description: 'markdown: quais opções de stack, quando perguntar, como afeta títulos e recursos — fundamentado no mercado BR' },
    changes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          priority: { type: 'number' }, title: { type: 'string' }, what: { type: 'string' }, why: { type: 'string' },
          effort: { type: 'string', enum: ['S', 'M', 'L'] }, scope_risk: { type: 'string', enum: ['low', 'medium', 'high'] },
          touches: { type: 'array', items: { type: 'string' } },
        },
        required: ['priority', 'title', 'what', 'why', 'effort', 'scope_risk', 'touches'],
      },
    },
    schema_changes: { type: 'array', items: { type: 'string' }, description: 'campos novos que o modelo de Resource/Competency precisa, com justificativa de uma linha' },
    user_suggestions_review: {
      type: 'array',
      items: { type: 'object', properties: { suggestion: { type: 'string' }, verdict: { type: 'string', enum: ['adotar', 'adotar-com-ajuste', 'adiar', 'rejeitar'] }, why: { type: 'string' } }, required: ['suggestion', 'verdict', 'why'] },
    },
    report_markdown: { type: 'string', description: 'seção final em português para docs/research/DIRECAO.md, com o plano completo' },
  },
  required: ['books_catalog', 'diagnosis', 'principles', 'node_card_spec', 'stack_choice_spec', 'changes', 'schema_changes', 'user_suggestions_review', 'report_markdown'],
}

const plan = await agent(
  `Você é arquiteto de produto sênior do Career Gap. Produza o PLANO FINAL que responde ao feedback do dono do produto:

> "Gostei do visual, mas sinto falta de direcionamento. No formato atual seria mais útil copiar o roadmap.sh — e não é isso que quero sentir. O uso será por brasileiros, devemos citar linguagens e frameworks sim, a ideia é parecida com roadmap.sh porém personalizada, trazendo skills, links de vídeos, pessoas para acompanhar, indicação de livros."

ANTES de escrever, LEIA (tool Read) — é obrigatório, para não propor o que já existe nem violar decisões tomadas:
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/docs/research/DIRECAO.md  (pesquisa completa: §1-§8)
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/INITIAL_SCOPE.md
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/docs/adr/0001-estrutura-de-competencias.md
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/docs/adr/0002-priorizacao-em-duas-etapas.md
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/docs/adr/0004-fronteiras-da-ia.md
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/career-gap/src/domain/model.ts
- /Users/enzoaraujoduarte/Desktop/TCC_ROADMAP/career-gap/src/catalog/competencies.ts

Os recursos já verificados estão em (leia também):
- ${SCRATCH}/recursos-br-verificados.json  (38 artefatos de criadores brasileiros)
- ${SCRATCH}/recursos-canonicos-verificados.json  (57 recursos canônicos internacionais)

E abaixo os vereditos dos livros/cursos brasileiros desta rodada.

TESE A EXECUTAR (pode refutar partes, com argumento):
A competência continua sendo a espinha do motor (elegibilidade, ranking, NOT NOW). O que muda é a EXPERIÊNCIA: (a) cada nó vira uma FICHA com tarefa ordenada em verbos — Leia/Assista/Faça — apontando para recursos verificados, preferindo pt-BR e avisando quando for inglês; (b) tecnologia aparece como SELO vindo dos recursos ("Construção de API — com Node + Express"), não como competência; (c) um passo dominante em vez de dez nós de peso igual; (d) projeto como marco a cada ~4 itens de leitura, com escopo fechado e checklist de saída.

REGRAS:
- books_catalog: SOMENTE keep=true. Quando só parte do livro serve, diga os capítulos.
- node_card_spec: dê um exemplo REAL e preenchido, usando recursos que estão nos JSONs verificados. Não invente URL.
- changes: ordene por (impacto na sensação de direção ÷ esforço). Marque scope_risk contra o TCC — o orientador pediu escopo controlado e a avaliação com usuários é o núcleo do trabalho.
- user_suggestions_review: avalie cada sugestão do dono do produto (citar linguagens/frameworks; vídeos; pessoas; livros; parecer com roadmap.sh porém personalizado). Discorde quando a pesquisa contradisser — ex.: pessoas entram via artefato, nunca como "siga fulano".
- schema_changes: campos que o modelo precisa (published_at, pt_br_status, requires_signup, formato pedagógico, content_type, license, estimated_time...), cada um com uma linha de justificativa.
- Escreva em português, direto, sem enfeite. Toda afirmação factual com URL ou referência.

VEREDITOS DOS LIVROS/CURSOS:
${JSON.stringify(verdicts, null, 1)}`,
  { label: 'plano', phase: 'Plano', schema: PLAN_SCHEMA, effort: 'high' },
)

phase('Crítica')
const critique = await agent(
  `Você é ao mesmo tempo crítico de completude e avaliador de banca de TCC. Leia o plano abaixo e responda em português, no máximo 20 linhas, SÓ o que está errado ou faltando:

1. Alguma mudança fere o escopo do orientador (público de início de carreira, escopo controlado, avaliação com usuários como núcleo) ou as ADRs (motor determinístico; LLM não gera recursos nem ordena; catálogo só-links)?
2. Alguma afirmação factual sem fonte, ou recurso que não passou por verificação?
3. A "ficha do nó" resolve de fato a queixa "não sinto direção", ou só adiciona links?
4. O que um avaliador de sistemas de recomendação ou de educação questionaria?

Termine com as 3 perguntas que o Enzo precisa responder antes de implementar.

PLANO:
${JSON.stringify({ diagnosis: plan?.diagnosis, principles: plan?.principles, node_card: plan?.node_card_spec, stack: plan?.stack_choice_spec, changes: plan?.changes, schema: plan?.schema_changes, review: plan?.user_suggestions_review, books: plan?.books_catalog?.length }, null, 1)}`,
  { label: 'critica', phase: 'Crítica', effort: 'high' },
)

return {
  books: { kept: verdicts.filter((v) => v.keep).length, rejected: verdicts.filter((v) => !v.keep).length },
  rejected_books: verdicts.filter((v) => !v.keep).map((v) => ({ name: v.name, notes: v.notes })),
  plan,
  critique,
}