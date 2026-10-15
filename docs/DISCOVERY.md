# Career Gap — Fase 1: Discovery e Arquitetura

Documento de saída da fase de pesquisa. Define **o que construir, como e por quê**.

Prioridade documental: instrução atual do usuário > `INITIAL_SCOPE.md` > `.agents/AGENTS.md` > `SYSTEM_SPEC.md`.
Este documento **detalha e ajusta** `INITIAL_SCOPE.md`; onde houver divergência explícita, o ajuste está marcado como **MUDANÇA**.

Fontes citadas: `docs/research/SOURCES.md`. Decisões formais: `docs/adr/`.

---

## 1. Tese central

Career Gap é um **sistema de recomendação baseado em conhecimento (knowledge-based / constraint-based)** operando sobre uma **estrutura de competências com relações de pré-requisito**, no qual o LLM interpreta, avalia e explica — mas **não decide a ordem**.

Essa classificação não é retórica: ela resolve três problemas de uma vez.

1. **Cold start.** Não teremos dados de interação de usuários. Recomendadores colaborativos são inviáveis; recomendadores baseados em conhecimento são a família correta e não sofrem cold start (Felfernig et al.).
2. **Justificativa acadêmica do "o que vem agora".** A *Competence-based Knowledge Space Theory* (CbKST — Doignon & Falmagne; Heller, Stefanutti, Albert) já formaliza exatamente a pergunta do produto: dado um estado de competência `C ⊆ S` e relações de precedência entre competências, o **outer fringe** é o conjunto do que a pessoa está *pronta para aprender agora*. O produto não precisa inventar teoria — precisa instanciá-la.
3. **Explicabilidade.** A estrutura produz razões estruturais ("está bloqueado por X", "desbloqueia Y, Z") independentes de texto gerado.

**Consequência de projeto:** o motor tem duas etapas separadas, e essa separação é a decisão mais importante de todo o sistema.

```text
ETAPA 1 — ELEGIBILIDADE (estrutural, booleana, indiscutível)
   pré-requisitos satisfeitos? -> available | blocked

ETAPA 2 — RANKING (escore, opinável, versionado e auditável)
   entre os available, qual gap merece atenção primeiro?

ETAPA 3 — POLÍTICA EDITORIAL (apenas rebaixa/exclui, nunca promove)
   regras nomeadas que produzem NOT NOW com motivo legível
```

Misturar 1 e 2 em uma fórmula única é o erro que transformaria o Career Gap em "opinião com aparência de matemática".

---

## 2. O que muda em relação ao que já estava documentado

| # | Estava | **MUDANÇA proposta** | Motivo |
|---|--------|----------------------|--------|
| 1 | BibliotecaDev como fonte de livros | **Remover completamente** | O repositório hospeda cópias digitalizadas não autorizadas de livros comerciais (Casa do Código, Fowler, Martin). Risco jurídico e de integridade acadêmica em um TCC. Ver ADR-0005. |
| 2 | roadmap.sh como possível fonte | **Só como trabalho relacionado / comparação na escrita** | A licença do roadmap.sh proíbe explicitamente redistribuição do conteúdo. Não podemos copiar nós, estruturas ou listas. |
| 3 | `priority = gap × peso × prereq × confiança` | **Filtro de elegibilidade + soma ponderada normalizada + regras de rebaixamento** | Produto de fatores é frágil (um fator ~0 aniquila o escore), tem magnitude sem significado e é difícil de defender na banca. Ver ADR-0002. |
| 4 | Autoavaliação como sinal principal | **Frases "consigo fazer X" + sondagens objetivas curtas nas competências que travam outras** | Autoavaliação correlaciona ~r=.30 com desempenho real (Zell & Krizan). Itens abstratos ("nota 1–5 em React") são os menos confiáveis; itens ancorados em tarefa concreta são os mais confiáveis (literatura CEFR/can-do). Ver ADR-0003. |
| 5 | 4 objetivos (estágio, front, back, full stack) | **1 track + 2 ênfases como *overlay* de pesos sobre o mesmo catálogo** | Quantidade de tracks não é o valor científico (o próprio `INITIAL_SCOPE.md` §9 admite). 1 catálogo bem fundamentado > 4 catálogos rasos. |
| 6 | Níveis L0–L4 | **L0–L3 no MVP** (L4 permanece no enum, sem uso) | L4 (organizacional) é inalcançável para o público-alvo. Escalas ordinais curtas maximizam concordância entre avaliadores humanos e LLM. |
| 7 | Comparação com roadmap estático "se houver tempo" | **Promover a item central da avaliação** | Sem ela o TCC prova "construímos um sistema"; com ela prova "a personalização muda a percepção de relevância". É o resultado avaliável que o orientador pediu. Ver ADR-0007. |
| 8 | "Skill Graph" | **Estrutura de competências com pré-requisitos *duros* apenas** | Aresta só existe quando B é inviável sem A. Preferência de ordem ("melhor antes") vai para o escore, não para o grafo. Sem essa regra o grafo vira depósito de opinião e fica indefensável na banca. Ver ADR-0001. |

O resto de `INITIAL_SCOPE.md` e `SYSTEM_SPEC.md` permanece válido e não será repetido aqui.

---

## 3. Modelo de domínio (núcleo)

Sete conceitos. Nada além disso no MVP.

```text
competency          id, slug, nome, descrição, domínio, estabilidade(evergreen|volatile), sources[]
competency_level    competency_id, level(L0..L3), can_do_statement, exit_criteria[]
prerequisite        source_competency, min_level, target_competency, rationale, sources[]   # DURO apenas
career_track        id, nome, descrição, emphasis_overlays
track_requirement   track_id, competency_id, target_level, criticality(core|supporting|optional), sources[]
user_competency     user_id, competency_id, estimated_level, confidence, evidence_source, updated_at
resource            tipo, título, url_canônica, competency_id, level, action_type, idioma, custo, duração, licença, fonte
```

Derivados (calculados, persistidos com trace):

```text
gap                 competency, current_level, target_level, size, status(blocked|available|met), confidence
roadmap             user_id, track_id, catalog_version, created_at, input_snapshot
roadmap_item        roadmap_id, competency_id, phase, rank, status, score_breakdown{}, reason_codes[], resources[]
excluded_item       roadmap_id, competency_id, reason_code, explanation   # o NOT NOW
```

**Decisões estruturais caras de corrigir depois — fazer desde o início:**

- `catalog_version` em todo roadmap gerado → reprodutibilidade dos resultados citados no TCC.
- `score_breakdown` e `reason_codes` persistidos por item → a explicação nunca é reconstruída, é lida.
- `input_snapshot` do perfil no momento da geração → permite mostrar o *diff* na reavaliação.
- `sources[]` em competency, prerequisite e track_requirement → responde diretamente à questão crítica do `INITIAL_SCOPE.md` §22.

### Protocolo de fundamentação (responde à §22)

Nenhuma competência, nível-alvo ou aresta de pré-requisito entra no catálogo sem **pelo menos duas fontes de classes diferentes**:

1. **Padrão curricular** — ACM/IEEE CS2023 (CS Core), SWEBOK v4 (18 KAs).
2. **Framework de competência** — SFIA 9, e-CF/ESCO.
3. **Evidência de mercado** — análise de anúncios de vaga para nível de entrada (amostra própria, datada e documentada).
4. **Referência canônica reconhecida** — documentação oficial, literatura clássica revisada.

O campo `rationale` registra *por que* a aresta existe. Esse protocolo é, por si só, uma contribuição metodológica descrevível no capítulo de método.

---

## 4. Avaliação do estado atual (o ponto mais frágil do produto)

Restrição dura: o onboarding precisa caber em **6–8 minutos**, senão não há teste com usuários. Workera gasta ~20 questões adaptativas por *um único* domínio — inviável aqui e desnecessário.

Modelo de três sinais, com confiança explícita:

| Sinal | Como | Confiança |
|-------|------|-----------|
| `SELF_REPORT` | Frases "consigo fazer X sem ajuda" derivadas do `can_do_statement` do nível | baixa |
| `PROBE` | 1–3 itens auto-corrigíveis, **só** nas competências que são pré-requisito de muitas outras | média |
| `ARTIFACT` | Resposta aberta avaliada por rubrica (LLM como um avaliador, não como juiz final) | média |

Regras:

- Nunca perguntar "dê uma nota de 1 a 5 para seu conhecimento em X".
- Nunca rebaixar silenciosamente o que o usuário declarou. Quando a confiança é baixa **e** a competência trava outras, o item entra no roadmap marcado como `needs_verification` com um passo barato de verificação. Isso preserva explicabilidade e transparência.
- O perfil inferido é **confirmado pelo usuário** antes de virar estado (tela 4 do `INITIAL_SCOPE.md` §18 já prevê isso — ela é obrigatória, não opcional).

---

## 5. Fronteiras da IA

Três usos, cada um atrás de um adapter, com schema validado e **fallback determinístico**:

1. **Interpretar** texto livre do onboarding → sinais estruturados candidatos (competência + nível sugerido + trecho citado como evidência) → **usuário confirma**.
2. **Avaliar** resposta aberta contra rubrica → um sinal de evidência com confiança, jamais autoridade final.
3. **Explicar** uma recomendação **já calculada**, recebendo os `reason_codes` estruturados.

Proibido, sem exceção:

- LLM definir ordem, prioridade ou composição do roadmap;
- LLM **gerar recursos/URLs** (alucinação de links é o modo de falha mais provável e mais destrutivo para a credibilidade) — recursos vêm apenas do catálogo;
- LLM ser a única fonte de um nível de competência.

Com o LLM desligado o sistema inteiro continua funcionando, com texto de explicação em template. Isso é testável e vira um argumento forte na defesa.

---

## 6. Recursos

Regra única: **o catálogo guarda metadados e um link canônico para a página do detentor dos direitos. Nada é hospedado, espelhado ou reproduzido.**

Fontes permitidas: documentação oficial (incluindo pt-BR: `pt-br.react.dev`, MDN, Pro Git), free-programming-books (índice CC BY — usar para *descobrir*, linkar sempre a fonte autoritativa), CS50 (CC BY-NC-SA, link), Fowler, refactoring.guru (link; sem reuso de imagens).

Fonte proibida: BibliotecaDev.

Dimensionamento do recurso pelo tamanho do gap (ideia do usuário, mantida):

```text
gap pequeno       -> documentação / artigo / aula curta
gap intermediário -> sequência curta + exercício
gap fundamental   -> curso estruturado + projeto
```

Meta MVP: **40–60 recursos**, não mais. Cobertura em português é desigual (testes tem ~1 entrada em pt-BR) — o catálogo registra `idioma` e a UI informa quando o recurso está em inglês.

Escada de ação: **LEARN → PRACTICE → BUILD → PROVE**. Tem lastro pedagógico (Use-Modify-Create; PRIMM). `EXPERIENCE` do `SYSTEM_SPEC.md` §13 fica fora do MVP: pressupõe ambiente profissional que o público-alvo ainda não tem.

---

## 7. Interface

Stack visual: **React Flow (MIT) + @dagrejs/dagre + rough.js com `seed` fixo + Excalifont (OFL-1.1)**.

- tldraw está descartado: desde a SDK 3.x exige licença comercial ou marca d'água. Excalidraw é um *editor*, não um renderizador de diagrama.
- `seed` determinístico por nó/aresta é obrigatório: sem isso o traçado "à mão" se redesenha a cada render e o mapa parece instável.
- **Mobile recebe a visão em lista/stepper por padrão**, não o canvas. Pan/zoom em tela pequena atrapalha a única pergunta que importa ("o que faço agora?"). A lista também é a alternativa acessível ao canvas.

A tela precisa responder, sem interação: onde estou, para onde vou, o que vem agora, por quê, e o que posso ignorar.

---

## 8. Avaliação acadêmica

Três instrumentos combinados:

1. **Comparação intra-sujeito, ordem contrabalançada.** Mesmo participante vê (A) o catálogo completo do track, sem filtragem nem ordenação, e (B) o roadmap personalizado. O controle usa **o nosso próprio catálogo** — isso isola a personalização como variável independente e evita tanto o problema de licença do roadmap.sh quanto o confundimento de conteúdo.
2. **ResQue** (Pu, Chen & Hu, 2011) — subconjunto de ~15–20 itens: acurácia percebida, transparência, controle, utilidade, confiança, satisfação. É o instrumento padrão para avaliação centrada no usuário de recomendadores. **SUS** (10 itens) para usabilidade.
3. **Painel de especialistas** — 3 a 5 desenvolvedores experientes avaliam a coerência dos roadmaps gerados para N perfis sintéticos. Custa pouco e responde "os gaps são coerentes?" sem depender da percepção de quem está aprendendo.

Métricas objetivas baratas: tempo até identificar o próximo passo; número de itens que o participante marca como "não é relevante para mim" em A vs. B.

Limite honesto a declarar no texto: mede-se **percepção de utilidade e coerência**, não ganho de carreira (exigiria estudo longitudinal).

---

## 9. Ordem de construção (Fase 2)

O risco maior não é código, é **conteúdo**: se o catálogo for raso, nenhuma engenharia salva o TCC. Por isso a ordem começa por dados e valida o motor antes de qualquer tela.

```text
1. Catálogo   ~25 competências, can-do por nível usado, arestas duras, provenance  [FEITO]
2. Núcleo     domínio puro + testes: gap, elegibilidade, escore, políticas, montagem  [FEITO]
              -> validado com 6 perfis-fixture antes de existir UI
3. Dados      Postgres + migrations + seed versionado do catálogo                  <- próximo
4. Onboarding can-do + probes -> tela de confirmação do perfil
5. Canvas     roadmap + foco + NOT NOW
6. IA         adapters interpretar/explicar, atrás de flag
7. Avaliação  instrumentação, piloto com 2-3 pessoas, então a coleta
```

O passo 2 é o ponto de verdade: com perfis-fixture dá para ver se o motor produz sequências sensatas **antes** de investir em interface.

### Estado da implementação (2026-09-10)

Código em `career-gap/` (o npm recusa o nome do diretório raiz por conter maiúsculas);
documentos acadêmicos permanecem na raiz. Stack: Next.js 16 + React 19 + TypeScript 5.9.

| Artefato | Onde |
|---|---|
| Modelo e motor | `career-gap/src/domain/` — TS puro, sem framework/ORM/LLM |
| Catálogo v`2026.09.10-1` | `career-gap/src/catalog/` — 30 competências (25 do track + 5 de horizonte), 22 arestas duras |
| Invariantes executáveis | `career-gap/src/catalog/validate.ts` |
| Perfis-fixture | `career-gap/tests/fixtures.ts` |
| Exemplo trabalhado | `pnpm inspect:roadmaps --full` |

**O validador pagou-se na primeira execução:** reprovou sete afirmações em que eu havia
citado CS2023 e SWEBOK como se fossem fontes independentes — ambas são da classe
`curriculum`. É o tipo de falha que passa despercebida em revisão manual e que
invalidaria o argumento de fundamentação no texto do TCC. O protocolo só vale porque é
verificado a cada execução da suíte.

Duas decisões de projeto surgiram da validação com os fixtures e estão implementadas:

1. **Verificação também para o que foi declarado como já atingido.** Uma falsa afirmação
   de "já sei" é mais cara que um gap: some do roadmap *e* destrava indevidamente o que
   vem depois. O roadmap expõe `verificationNeeded` separado de `items`.
2. **Vagas reservadas no NOT NOW para temas fora do objetivo.** Sem reserva, as regras
   editoriais lotavam a lista e o usuário perdia a mensagem que mais reduz ansiedade.

---

## 10. Riscos

| Risco | Mitigação |
|-------|-----------|
| Catálogo vira opinião dos autores | Protocolo de 2 fontes + `rationale` por aresta + painel de especialistas |
| Onboarding longo demais → ninguém completa o teste | Orçamento de 6–8 min medido no piloto; probes só em competências que travam outras |
| Autoavaliação inflada distorce o roadmap | `needs_verification` + probes em pontos de trava + confiança explícita |
| LLM alucina recurso/URL | Recursos só do catálogo; LLM nunca emite links |
| Canvas consome o cronograma | Lista primeiro, canvas depois; lista é fallback acessível e entregável |
| n baixo na avaliação | Desenho intra-sujeito (cada participante gera dois pontos) + painel de especialistas |

---

## 10b. Alinhamento com o orientador

E-mail de aprovação do orientador (Riciere Massariol) pede escopo controlado e, para a
próxima orientação, sete frentes. Onde cada uma já está respondida:

| Prioridade do orientador | Onde está |
|---|---|
| 1. Delimitação do público-alvo | `INITIAL_SCOPE.md` §3; track único `first-web-role` |
| 2. Problema de pesquisa | `INITIAL_SCOPE.md` §4 |
| 3. Objetivo geral e específicos | `INITIAL_SCOPE.md` §5–6 |
| 4. Como as lacunas são identificadas | ADR-0001 (estrutura), ADR-0003 (avaliação can-do + sondagens), `src/domain/gap.ts` |
| 5. Como o roadmap é gerado | ADR-0002 (três etapas), `src/domain/roadmap.ts`, `pnpm inspect:roadmaps --full` |
| 6. Metodologia de avaliação com usuários | ADR-0007 (A/B intra-sujeito + ResQue + SUS + painel de especialistas) — **a validar com ele** |
| 7. Referencial teórico | `docs/research/SOURCES.md` |

Ele também disse que "os demais níveis poderão aparecer posteriormente como possibilidade de
evolução da plataforma". Isso autoriza documentar — não implementar — ecossistemas não
convencionais (Shopify, SAP/ABAP, Magento, TOTVS) como evolução futura; está em
`SYSTEM_SPEC.md` §32.

## 11. Decisões tomadas pelo usuário (2026-09-10)

1. **Stack: Next.js + TypeScript + PostgreSQL.** `src/domain` em TypeScript puro, **sem
   nenhum import de framework, de ORM ou de cliente de LLM** — é a regra que mantém o núcleo
   testável isoladamente e sustenta a defesa de que as regras de carreira não dependem de IA.
   Persistência e HTTP ficam nas bordas, conversando com o domínio por funções puras.
2. **Escopo: 1 track + 2 ênfases.** Track único "primeira vaga em desenvolvimento web";
   frontend e backend são *overlays de peso* sobre o mesmo catálogo (alteram `criticality` e
   `target_level` de um subconjunto de competências), nunca catálogos paralelos.
3. **Avaliação: comparação A/B intra-sujeito é núcleo**, conforme ADR-0007. Confirmar o
   desenho com o orientador antes da coleta; a instrumentação é o último passo da Fase 2,
   então isso não bloqueia nada.

Consequência para o passo 1 do roadmap de construção: o catálogo é **um só**, e as ênfases
entram como duas pequenas tabelas de overlay — não como duplicação de conteúdo.
