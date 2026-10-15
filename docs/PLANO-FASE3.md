# Plano da Fase 3 — produto testável e diferenciação

Data: 2026-10-15. Estende `PLANO-DIRECAO.md` e `DECISOES.md`; não substitui nenhum dos dois.

## 1. O que a pesquisa encontrou

| achado | evidência | consequência |
|---|---|---|
| O roadmap.sh já personaliza | AI Tutor gratuito com limite; cursos gerados "sob medida"; editor de roadmap por IA no plano de US$ 10/mês; progresso marcado à mão | "eles não personalizam" deixou de ser verdade. O diferencial passa a ser **como**: reprodutível, auditável, com motivo e com adiamento |
| IA explodiu nas vagas — acima do júnior | `frontendbr/vagas` + `backend-br/vagas`, 12 meses: pleno/sênior de 14,4% para **45,2%** citando IA (3,1×). Estágio+júnior: 9,3% → 14,3% | IA entra no mapa como **destino visível**, não como primeiro passo |
| As vagas de entrada encolheram | estágio+júnior: 75 → 42 (−44%); fatia de entrada no total: 14,9% → 10,6% | o público precisa chegar mais perto do pleno — reforça o problema do TCC |
| Aprender com IA sem saber verificar prejudica | Shen e Tamkin (Anthropic, 2026), ensaio randomizado, n = 52: −17% no quiz, **maior perda em depuração**; quem usou IA para pedir explicação não perdeu | a aresta `debugging → ai-assisted-development-basics` já existia com essa justificativa; agora tem ensaio randomizado |
| IA amplia a distância entre iniciantes | Prather et al., ICER 2024: ajuda quem já vai bem, atrapalha quem tem dificuldade; "ilusão de competência" | sequência importa — é a tese do TCC aplicada ao tema mais atual |
| O mercado usa, mas não confia | Stack Overflow 2025: 84% usam ou vão usar; 46% desconfiam da precisão; 66% recebem resposta "quase certa"; 45% perdem tempo depurando código gerado | a competência não é "usar IA", é **verificar** o que ela gera |
| O questionário pode encolher | "Fundamentos de programação" destrava 12 das 25 competências (fecho transitivo); ALEKS determina o estado em centenas de tópicos com menos de 30 perguntas, usando a mesma teoria | três telas em vez de 25 |

**Ressalvas sobre os dados de vagas** (`docs/research/vagas-ia-2026.json`): busca por expressão regular; amostra de comunidade, com viés para empresas de tecnologia; n de júnior pequeno; 1 de 6 trechos conferidos era falso positivo (recrutador que *usa* IA, não exige), então 14,3% é teto. A tendência de pleno/sênior (3×) resiste a esse erro.

## 2. Tese de diferenciação

O roadmap.sh responde *o que existe nesta área*. Um modelo de linguagem responde *me dê um plano* — com texto diferente a cada vez. O Career Gap responde: **dado o que você já faz, qual é o menor próximo passo, por que ele vem antes, e o que você pode ignorar por enquanto.**

| | roadmap.sh | plano gerado por LLM | Career Gap |
|---|---|---|---|
| ponto de partida | mapa inteiro, igual para todos | texto livre do usuário | o que falta, calculado |
| o que ignorar | você decide sozinho ("skip") | raramente diz | **"não agora", com motivo** |
| por que esta ordem | não explica | prosa plausível, não verificável | motivo registrado e auditável |
| mesma entrada → mesmo caminho | sim (estático) | **não** | sim (48 testes) |
| recursos | links em inglês | podem não existir | 125 verificados, 83 em pt-BR |
| contexto brasileiro | não | genérico | desafios de empresas BR, código BR, dados BR |
| IA | tutor de IA ensina tudo | "use IA para aprender" | visível desde o início, **na posição certa da sequência** |

**O experimento do TCC já mede isso de forma justa.** A condição A (catálogo inteiro, sem filtro nem ordem) é a apresentação estilo roadmap.sh, com o mesmo conteúdo. Comparar com o roadmap.sh diretamente confundiria conteúdo com mecanismo e esbarra na licença — já decidido em `DECISOES.md`.

**Evidência barata e forte, opcional:** rodar os 6 perfis de referência 5 vezes cada num LLM com prompt fixo e medir (a) concordância no primeiro passo entre execuções, (b) proporção de links que abrem, (c) proporção em pt-BR. O Career Gap tem 100% em (a) e (b) por construção. Uma tarde de trabalho; vira tabela no TCC.

## 3. Entrada em três toques

1. **Você já programou?** nunca · segui tutoriais · já construí algo sozinho · já trabalho com isso → nível de Fundamentos de programação. Sozinha, essa resposta decide o destino de 12 das 25 competências.
2. **Para onde?** front-end · back-end · ainda não sei → ênfase.
3. **Toque no que você já faz sozinho** (opcional, 8 opções): HTML · CSS · JavaScript · Git · terminal · consumir uma API · SQL · testes. Cada toque registra L2 declarado; os pré-requisitos daquela competência ficam marcados como **inferido de X — confere?**, nunca em silêncio.

O mapa aparece na hora. Cada nó ganha *já sei isso / ainda não*, e o caminho recalcula. O mapa vira o resto do questionário, respondido só onde a pessoa se importa. O que não foi respondido vale L0 — regra já existente.

No topo, um resultado concreto — **Esta semana**: uma competência, um recurso para começar (idioma, custo, tempo) e um critério de pronto. Abaixo, recolhido: **pode ignorar por enquanto: N itens**.

O estado vai na URL (hash), sem banco e sem login: a pessoa compartilha o próprio plano com um link.

**Risco:** inferir pré-requisitos propaga uma superestimação. Mitigação já existente: o inferido entra com confiança baixa e dispara `verificationNeeded` quando condiciona outras competências.

## 4. IA no lugar certo

1. **Desde a primeira tela, como método de estudo.** Aviso fixo em "Esta semana": *use IA para pedir explicação e o porquê, não para escrever por você.* É o uso que, no ensaio da Anthropic, preservou o aprendizado.
2. **Visível no mapa como destino**, com o "não agora" explicado: *IA no desenvolvimento — depois de depuração. Quem ainda não depura não consegue verificar o que a IA gera.*
3. **`ai-assisted-development-basics`: criticidade `supporting` → `core`.** Acrescentar L2: *uso assistente em tarefas inteiras e verifico a saída com testes antes de aceitar* (pré-requisito: `automated-testing-basics` L1). A meta da trilha continua L1.

**A avaliar, não decidido:** competência nova "integrar IA numa aplicação via API", atrás de Consumo de API. Uma vaga júnior de "agentes de IA" apareceu na amostra, mas é um caso só; o protocolo de proveniência exige duas classes de fonte.

## 5. Conteúdo brasileiro (tudo só link — ADR-0005)

Verificado em 2026-10-15 pela API autenticada do GitHub e por requisição HTTP.

| tipo | recurso | por que | dados |
|---|---|---|---|
| desafio de empresa real | `felipefialho/frontend-challenges` | testes técnicos de empresas brasileiras | 15k★, MIT, ativo out/26 |
| desafio de empresa real | `backend-br/desafios` | idem, back-end | 2,7k★, MIT, ativo set/26 |
| contribua | `okfn-brasil/querido-diario` | **25 issues abertas para iniciante**; PR aceito é evidência real de Git, code review e comunicação | 1,4k★, MIT, ativo out/26 |
| contribua | `turicas/brasil.io` | 21 issues "help wanted" | 1k★, GPL-3.0, ativo set/26 |
| leia código real | `filipedeschamps/tabnews.com.br` | Next.js + Postgres, a mesma pilha da trilha | 6,4k★, MIT, no ar |
| leia código real | `BrasilAPI/BrasilAPI` | endpoints pequenos — bom para Construção de API | 11k★, MIT, ativo out/26 |
| pratique com dado brasileiro | IBGE (localidades), ViaCEP, SGS do Banco Central, BrasilAPI | consumo de API sem chave | todas responderam 200 |
| trilha complementar | `Universidade-Livre/ciencia-da-computacao` | currículo de Ciência da Computação gratuito em pt-BR | 21k★, MIT |

**Descartados:** Serenata de Amor (parado desde jan/2024); He4rt bot (arquivado); TabNews como "contribua" (zero issues marcadas para iniciante hoje — serve para leitura).

**Bônus metodológico:** `frontend-challenges` e `backend-br/desafios` registram o que empresas brasileiras de fato testam. Entram como fonte da classe *market-evidence* no protocolo de proveniência.

**Modelo de domínio:** novos valores de `kind` — `challenge`, `codebase`, `open-issue`, `public-api` — com os `actionType` que já existem (BUILD, READ, PROVE). Nenhum esquema novo.

## 6. Como fechar para gente testar

Em ordem; cada passo destrava o seguinte.

1. **Entrada em três toques + edição no mapa + cartão "Esta semana" + estado na URL.** ~3–4 dias.
2. **Mudanças de IA (seção 4) e conteúdo brasileiro (seção 5)**, com proveniência e testes. ~2–3 dias.
3. **Publicar na Vercel** (gratuito, nativo de Next.js). Sem banco: perfil no navegador e na URL. ~1 hora — precisa da conta do Enzo.
4. **Uma pergunta no fim do mapa:** *isto te ajudou a saber o que fazer amanhã?* sim · mais ou menos · não + campo livre. Só para o piloto.
5. **Piloto com 5 pessoas** → corrigir → estudo formal com 24 (ResQue + SUS, já desenhado).

Fica de fora até depois do piloto: Neon/Postgres (não é necessário para testar), sondagens objetivas, qualquer recurso com LLM.

Total: ~1,5–2 semanas até ter link público.

## 7. Impacto no texto do TCC

- **Problema (seção 1):** reformular. Materiais públicos ou apresentam o campo inteiro, igual para todos, ou geram planos por modelo de linguagem que não se reproduzem nem se verificam; nenhum dos dois explicita o que adiar nem por que um passo precede outro.
- **3.1:** a estimativa passa a ser em três toques, com inferência pela relação de precedência e correção no próprio mapa.
- **4.1:** entra a dimensão de IA na lacuna formação–indústria — dados das vagas, Prather et al. (2024), Shen e Tamkin (2026). É IA como conteúdo e como demanda de mercado, não como componente do sistema; coerente com a remoção do eixo 4.5.
- **4.3:** ALEKS como exemplo da avaliação adaptativa da Teoria dos Espaços de Conhecimento.

## 8. Decisões que dependem do Enzo

1. **Prazo:** a defesa é neste semestre? Se for, o estudo com 24 pessoas precisa começar em semanas e o passo 2 da seção 6 encolhe.
2. **Publicar na Vercel** em nome dele.
3. **Rodar ou não** o teste de reprodutibilidade contra LLM (seção 2).

## Fontes

- roadmap.sh/premium; anúncios do AI Tutor em x.com/roadmapsh (mai/2025 e jan/2026).
- PRATHER, J. et al. The widening gap: the benefits and harms of generative AI for novice programmers. In: ICER 2024. New York: ACM, 2024. p. 469-486. DOI 10.1145/3632620.3671116.
- SHEN, J. H.; TAMKIN, A. How AI assistance impacts the formation of coding skills. arXiv:2601.20245, 2026. *Preprint*; citar como tal.
- STACK OVERFLOW. Developer Survey 2025: AI. survey.stackoverflow.co/2025/ai.
- ALEKS. Student Module Reference Guide — Initial Knowledge Check com menos de 30 perguntas.
- Dados próprios: `docs/research/vagas-ia-2026.json` (GitHub Search API, 2026-10-15).

---

## 9. Decisão de 2026-10-15 — conteúdo primeiro, sem IA no começo

**Decidido pelo Enzo:** nada de IA no início. Sai o aviso de IA na primeira tela (§4.1) e sai o
teste contra ChatGPT (§2), por ora. O produto continua sem componente de IA — já era assim.

**Mantido:** a competência `ai-assisted-development-basics` fica no catálogo, onde está (depois
de depuração, criticidade `supporting`). É conteúdo que um dev precisa — 45% das vagas
pleno/sênior pedem —, e tirá-la contradiz a meta de cobrir "tudo o necessário". A promoção para
`core` (§4.3) fica para depois.

### Auditoria do catálogo (2026-10-15)

Recursos aplicáveis a cada competência da trilha no nível-alvo, por tipo de ação:

| medida | resultado |
|---|---|
| catálogo inteiro | 109 de 125 recursos (87%) são ler/assistir; 16 são praticar ou provar |
| competências com recurso de aprender em pt-BR | **25 de 25** |
| competências **sem nenhuma prática** | **12 de 25** — 7 delas `core` |
| competências sem nada que **prove** a competência | 17 de 25 |

As 7 `core` sem prática: Fundamentos de programação, Decomposição de problemas, Depuração,
Testes automatizados, Legibilidade de código, Fundamentos de HTTP, Leitura de documentação.

**Conclusão:** o ponto fraco não é falta de vídeo ou texto — é falta de prática. "Apenas
consumindo" não forma dev, e o catálogo atual já é um catálogo de consumo. O referencial já
sustenta isso: PRIMM (Sentance et al., 2019) progride de ler para modificar e criar; os padrões
*Practice, Practice, Practice* e *Breakable Toys* de Hoover e Oshineye (2009) dizem o mesmo.

### Regra de suficiência

Para cada competência `core` da trilha, no nível-alvo:

1. ≥ 1 recurso de **aprender** em pt-BR — hoje 25/25;
2. ≥ 1 recurso de **praticar** (BUILD) — hoje falha em 7 `core`;
3. coberta por ≥ 1 **marco de prova** (PROVE).

Vira teste automatizado, como o protocolo de proveniência: o catálogo é rejeitado se uma
competência `core` ficar sem prática. Segundo passo, depois: cada critério de saída coberto por
pelo menos uma prática.

### Como preencher

**Prática externa verificada (HTTP 200, 2026-10-15):**

| competência `core` sem prática | prática | idioma |
|---|---|---|
| Fundamentos de programação; Decomposição de problemas | Neps Academy; OBI — problemas anteriores | pt-BR |
| Fundamentos de programação | Exercism, trilha JavaScript | inglês |
| Depuração | Chrome DevTools — depurar JavaScript (tutorial interativo) | inglês |
| Testes automatizados; Legibilidade de código | Gilded Rose Refactoring Kata (4,3k★, MIT) — escrever testes, depois refatorar | inglês |
| Linha de comando (`supporting`) | OverTheWire Bandit | inglês |

Pendente: **Beecrowd** (juiz online brasileiro) bloqueia requisição automática — conferir no
navegador antes de incluir.

**Missões próprias** — enunciado curto escrito pelo projeto, usando recurso brasileiro por link,
com o critério de saída da competência como "você terminou quando". Conteúdo original, permitido
pela ADR-0005.

| competência | missão | recurso |
|---|---|---|
| Fundamentos de HTTP | fazer requisições, ler código de status e corpo, explicar GET × POST | API do IBGE, ViaCEP |
| Leitura de documentação | consumir uma série histórica usando só a documentação oficial | SGS do Banco Central |
| Depuração | corrigir um defeito plantado num desafio técnico | `frontend-challenges` |

**Três marcos de prova integrados** — cada um evidencia várias competências de uma vez, em vez
de 17 provas separadas:

1. desafio técnico de empresa brasileira concluído (`frontend-challenges` ou `backend-br/desafios`);
2. pull request aceito no Querido Diário (Git, code review, comunicação técnica);
3. aplicação publicada no ar (publicação, construção de aplicação).

### Ordem

1. Prática para as 7 `core` sem prática + as 3 missões. ~2–3 dias.
2. Os 3 marcos de prova, ligados às competências que evidenciam. ~1 dia.
3. Regra de suficiência como teste. ~meio dia.
4. Lacunas de conteúdo do benchmark Miro (como a web chega ao navegador, CORS, cookies e sessão) — extensões de competências existentes, quase tudo MDN pt-BR.
5. Competências `supporting` sem prática.

A entrada em três toques (§3) e a publicação (§6) continuam valendo e vêm depois.

---

## 10. Avaliação de 2026-10-15 — skills e "marketplace pessoal de IA" como conteúdo

Proposta do Enzo: incluir skills de desenvolvimento e a criação de um marketplace pessoal de IA
(como `~/Desktop/personal-coding-tools-arquivos`) como conteúdo diferencial.

### Premissa corrigida

"Pouca gente fala disso" não se sustenta em inglês: o **roadmap.sh lançou um roadmap de Claude
Code em fev/2026** (vibe coding, agentic loops, MCP, plugins, hooks, subagentes —
`roadmap.sh/claude-code`, HTTP 200) e mantém um de AI Agents, criticado por não priorizar nada.
O tema não é inédito. O que é raro é o **enquadramento**: as suas normas de engenharia
registradas num kit pessoal, como peça de portfólio, em pt-BR, na posição certa da sequência e
sem depender de ferramenta paga.

### O ponto que resolve a tensão com a decisão de "sem IA no começo"

O kit vale **sem IA**. `AGENTS.md` é documentação de projeto; `rules/` são padrões de código,
Git e teste; `decisions/` são registros de decisão (ADR); hook de pre-commit é portão de
qualidade. A IA só consome esses arquivos. É engenharia que também serve à IA — não o contrário.

### Encaixe no modelo, sem esquema novo e sem trilha nova

Vira o **4º marco de prova integrado** (§9): *repositório público com instruções do projeto,
regras de código e teste, registro de decisões, uma skill própria e um hook de qualidade.*

Evidencia competências já existentes, nos alvos atuais:

| competência | alvo | o que o kit evidencia |
|---|---|---|
| Comunicação técnica | L2 | escrever instruções, README e decisões |
| Controle de versão com Git | L2 | convenções de commit, hook |
| Testes automatizados | L1 | regra de teste + pre-commit que roda testes |
| Participação em code review | L1 | regras de revisão |
| Desenvolvimento assistido por IA | L1 | o descritor diz "fornecendo **contexto do meu projeto**" — é o `AGENTS.md` |

**Posição:** fim da trilha, visível desde o início como destino, com o "não agora" dito: *depois
de testes e Git — um kit sem teste é instrução sem verificação.* Coerente com Shen e Tamkin (2026)
e com a decisão de §9.

Um L2 para `ai-assisted-development-basics` (orientar assistente com o kit e verificar com testes
e diff) fica para depois do TCC.

### Recursos (só link, HTTP 200 em 2026-10-15)

- `agents.md` — padrão aberto de instruções para agentes, aceito por várias ferramentas. **Preferir
  este** ao formato de um fornecedor.
- `github.com/anthropics/skills` — exemplos de skills (inclui frontend-design).
- `github.com/pbakaus/impeccable` — skill de crítica de design, usada neste projeto.
- `github.com/upstash/context7` — documentação atualizada de bibliotecas.
- `pre-commit.com` — hooks de qualidade.
- `code.claude.com/docs/en/plugin-marketplaces` — uma implementação de marketplace.
- `github.com/akitaonrails/ai-memory` — memória entre sessões; avançado, opcional (já em `SOURCES.md`).

Não entra: `roadmap.sh/claude-code` (regra de fonte restrita — só trabalho relacionado).

### Recurso próprio

Um **modelo de kit pessoal** em repositório-template público, escrito pelo projeto, a partir da
estrutura do `personal-coding-tools` do Enzo (é dele; nenhuma menção a empregador encontrada).
Conteúdo original — permitido pela ADR-0005. Versão agnóstica de ferramenta (`AGENTS.md`), com a
variante Claude Code como exemplo.

### Os dois materiais enviados

- **`trilha_ia_desenvolvedores_2026.pdf`** — a etapa final ("criar skills, MCPs e memória quando
  houver necessidade") concorda com a evidência. A **etapa 3** (skills e instruções antes de
  linguagem e Git) não concorda: configurar agente antes de saber verificar o que ele produz é o
  padrão que o ensaio da Anthropic associou à maior perda de aprendizado.
- **`dev-workflow-setup-aula-2.pdf`** (RHawk.pro / Comunidade Top Hawks) — material **proprietário**:
  "proibida a reprodução, distribuição ou comercialização, total ou parcial", e licenciado a um
  e-mail específico. Mesma regra do board Miro: só referência; nada do conteúdo nem da estrutura
  entra no catálogo. Além disso, é avançado demais para a trilha: 10 ferramentas, chaves de API
  pagas (OpenCode Zen, Perplexity), alta volatilidade.
