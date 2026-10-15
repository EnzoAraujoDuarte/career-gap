# Career Gap — Plano de direção (Fase 2, revisão do feedback de 2026-09-11)

Origem: pesquisa completa em `docs/research/DIRECAO.md`. Recursos verificados em
`docs/research/recursos-br-verificados.json` (38), `recursos-canonicos-verificados.json` (57)
e `livros-cursos-verificados.json` (40 mantidos, 11 reprovados).

**Este plano passou por crítica adversarial e está corrigido por ela. A §4 registra o que a
crítica derrubou — inclusive um erro metodológico que comprometeria o experimento do TCC.**

---

## 1. Diagnóstico

O canvas hoje entrega um mapa de 23 nós de peso visual equivalente, cada um respondendo "por quê" e nenhum respondendo "o quê agora, em que ordem, com qual material e como sei que acabei" — o `FocusPanel` termina literalmente em `Recursos ainda não catalogados para esta competência`, e nem o domínio (`model.ts` não tem tipo `Resource`) nem o catálogo (`src/catalog/` não tem `resources.ts`) comportam a resposta. O motor está certo e é defensável: elegibilidade booleana por pré-requisito duro (ADR-0001), ranking por soma ponderada auditável (ADR-0002), política editorial que só rebaixa, `nextBestAction` já calculado. O que falta não é inteligência, é superfície: o resultado do motor chega ao usuário como rótulo de nó ("Fundamentos de HTTP") e não como tarefa ("Leia isto, 25 min, em português, e você terá acabado quando distinguir erro de cliente de erro de servidor"). Sem o recurso concreto, o nome da competência é abstrato demais para agir e abstrato demais para diferenciar-se do roadmap.sh — que, aliás, vence nessa comparação justamente por listar tecnologias nomeadas. A sensação de falta de direção é real e tem causa estrutural única: a camada de recursos verificados existe em JSON no `docs/research/` (95 artefatos), mas não existe no produto.

---

## 2. Princípios

1. Competência é a espinha, recurso é a carne. O motor continua decidindo O QUE e EM QUE ORDEM a partir de gap, pré-requisito e escore; o recurso decide COMO e COM O QUÊ. Nenhum campo de recurso entra no cálculo de prioridade — isso preserva ADR-0002 e a explicabilidade que a banca vai cobrar.
2. Tecnologia aparece como selo derivado dos recursos ligados ao nó, nunca como competência nem como aresta. 'Construção de API — com Node + Express' é a mesma capacidade que 'Construção de API — com Java + Spring'; o que muda é o link, não o gap. Isso atende o pedido de citar linguagens sem criar mapas paralelos por stack.
3. Toda ação é um verbo com objeto verificável: Leia / Assista / Faça / Prove, apontando para uma URL do detentor dos direitos. 'Estude HTTP' não é item de roadmap; 'Leia MDN — Uma visão geral do HTTP (25 min, pt-BR)' é.
4. Um passo dominante, no máximo três ações ativas. Sobrecarga de escolha é condicional, e os moderadores em que ela aparece — preferência não formada, baixa expertise, tarefa difícil — são exatamente a definição do nosso público. 1 a 3 recursos por nó, um marcado como recomendado, o resto do canvas atenuado.
5. Nenhum trecho do roadmap passa de ~4 itens de leitura/vídeo sem um item FAÇA, e todo item FAÇA tem escopo fechado, requisitos listados e checklist de saída. Instrução com orientação mínima é pior para novatos (Kirschner, Sweller & Clark 2006); 'construa um app' não é item, é abdicação.
6. Critério de saída não se inventa na UI: já existe no domínio como `exitCriteria` de cada `LevelDescriptor`. A ficha o exibe como checklist. O mesmo texto serve como item de onboarding, rubrica de reavaliação e critério de conclusão — um só artefato, três usos.
7. Pessoas entram pela autoria de um artefato tipado, nunca como lista de 'quem seguir'. Popularidade só desempata, nunca admite. O bloco na ficha chama-se 'quem ensina isso bem' e sempre carrega a obra, não o perfil.
8. Recomendar recurso em inglês com aviso explícito é melhor do que recomendar recurso ruim em português — e o aviso mede o CORPO do conteúdo, não a interface nem a legenda automática. Nove competências do catálogo só têm cobertura decente em inglês; esconder isso seria mentir para o usuário.
9. Custo, cadastro e data de publicação são atributos de primeira classe do recurso e aparecem antes do clique. Metade do bom material brasileiro exige cadastro (Curso em Vídeo, Alura, DIO, freeCodeCamp), a DIO monetiza o cadastro com recrutamento, e um livro de HTML/CSS de 2012 é pré-flexbox na prática.

---

## 3. Especificações

### 3.1 Ficha do nó

# FICHA DO NÓ — especificação

Substitui o `FocusPanel` atual (`career-gap/src/components/roadmap/focus-panel.tsx`), que hoje
termina no slot vazio `Recursos ainda não catalogados para esta competência`.

## Regra geral

Ordem dos blocos é fixa e não configurável. Blocos 3 e 5 são obrigatórios — uma competência
sem plano de ação ordenado e sem critério de saída não pode ser exibida como FOCO AGORA.
Blocos 4, 6 e 7 aparecem condicionalmente.

## Blocos

### 1. Cabeçalho
- Nome da competência (do catálogo, nunca gerado).
- **Selo de tecnologia**: derivado da moda das tags `technology` dos recursos selecionados
  para este nó neste nível. Formato `— com X + Y`. Ausente quando os recursos são agnósticos;
  nesse caso exibe-se `vale para qualquer linguagem`.
- Nível atual → nível alvo, em texto humano (`LEVEL_NAMES`).
- Posição na fila (`rank`) e peso para o objetivo (`criticality`).

### 2. POR QUÊ AQUI · POR QUÊ AGORA
Já implementado: `reasonCodes` → `REASON_TEXT`. Não mexer.

### 3. O QUE FAZER — lista **ordenada**, verbo à frente
Cada linha é um `Resource` do catálogo, renderizado como:

```
[VERBO]  Título do recurso · Fonte
         ⏱ tempo · 🌐 idioma · 💰 custo · 🔐 cadastro     [RECOMENDADO]
         uma linha dizendo por que este e não outro
```

- Verbos permitidos: **LEIA** (`READ`), **ASSISTA** (`WATCH`), **ESTUDE** (`LEARN`,
  material com progressão e exercícios), **FAÇA** (`BUILD`), **PROVE** (`PROVE`).
- Máximo **3** linhas por nível. Exatamente **uma** marcada `RECOMENDADO`.
- Ordem = ordem pedagógica definida no catálogo (`sequence`), não ordem de escore.
- Pílula de idioma: `pt-BR` (verde), `pt-BR parcial` (amarelo, com tooltip dizendo o que
  cai em inglês), `inglês` (cinza, com a frase *"não há material equivalente em português
  para este passo"*). Legenda de vídeo **nunca** conta como pt-BR.
- Pílula de custo: `grátis` · `grátis, certificado pago` · `R$ 39,90`.
- Pílula de cadastro: só aparece quando `requires_signup = true`. Para a DIO, texto extra:
  *"o cadastro expõe seu perfil a empresas recrutadoras"*.
- Recurso com `published_at` anterior a 2019 em competência de stack volátil recebe tarja
  `material antigo — confira a ressalva`.

### 4. MARCO (condicional)
Aparece quando o trecho do roadmap acumulou **4 ou mais** itens `READ`/`WATCH`/`LEARN` sem um
item `BUILD`. Campos obrigatórios: escopo em uma frase, lista fechada de requisitos, tempo
estimado, e **checklist de entrega**. Sem os quatro, o marco não é exibido.

### 5. COMO SEI QUE ACABEI
Renderiza `competency.levels[targetLevel].exitCriteria` como checklist marcável. Texto vem do
catálogo, palavra por palavra — é a mesma frase usada na reavaliação.

### 6. QUEM ENSINA ISSO BEM (condicional)
Só quando existe `Person` ligada por autoria a um recurso **já listado no bloco 3**. Uma linha
de evidência (obra ou docência) + link do artefato. Nunca link de perfil social. Nunca bloco
de "pessoas interessantes".

### 7. NÃO AGORA (condicional)
O que o usuário pode ignorar neste ponto, com `reason_code`. Já existe como painel separado;
passa a ter espelho na ficha quando o nó tiver recurso classificado acima do nível alvo.

---

# EXEMPLO REAL PREENCHIDO — `http-fundamentals`

Nó escolhido porque é o FOCO AGORA calculado para o perfil-fixture `self-taught-frontend`.
Todos os recursos abaixo estão em `docs/research/recursos-canonicos-verificados.json`.

---

### Fundamentos de HTTP
**vale para qualquer linguagem** · 1º na fila · núcleo do objetivo
**Reconhece → Aplica sozinho** (L0 → L2)

**POR QUÊ?**
— É lacuna de competência-núcleo do seu objetivo
— Destrava outras 3 competências do seu roadmap
— Distância de 2 níveis

---

**O QUE FAZER**

**1. LEIA** · Uma visão geral do HTTP · MDN Web Docs (Mozilla)
⏱ 25 min · 🌐 pt-BR · 💰 grátis · **RECOMENDADO**
https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Overview
*Única página que apresenta cliente-servidor, requisição/resposta, métodos, cabeçalhos e
status em uma leitura só, com o corpo verificado em português.*

**2. LEIA** · Como HTTPS funciona · DNSimple
⏱ 20 min · 🌐 pt-BR · 💰 grátis
https://howhttps.works/pt-br/
*Cinco episódios em quadrinhos. Explica por que existe o cadeado antes de você precisar
configurar um — e é o único material da competência que não parece documentação.*

**3. PROVE** · Ler uma requisição real na aba Network
⏱ 45 min · 🌐 pt-BR · 💰 grátis · *exercício do Career Gap*
Apoio: https://jsonplaceholder.typicode.com/ (API pública de teste, sem cadastro)
Consulta: https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status
*Não existe, em nenhum idioma, um artefato PROVE gratuito para esta competência. Este é um
dos dois pontos do catálogo em que a curadoria não basta e o Career Gap escreve o próprio
exercício.*

---

**MARCO — Diário de 5 requisições**
Escopo: escolher 5 endpoints do JSONPlaceholder, chamá-los pela aba Network do navegador e
registrar, para cada um, método, status, um cabeçalho relevante e o formato do corpo.
Requisitos: 1 GET com sucesso, 1 POST, 1 requisição que devolva 404, 1 que devolva 4xx por
entrada inválida, 1 de sua escolha. ⏱ ~1 h.
Checklist de entrega:
☐ os 5 registros existem e cada um nomeia o método e o status
☐ para o 404, você escreveu se o erro foi seu ou do servidor — e por quê
☐ você explicou por que o POST não podia ser um GET

---

**COMO SEI QUE ACABEI** — critério de saída do nível *Aplica sozinho*
☐ Escolho entre GET e POST com justificativa
☐ Diagnostico um erro lendo status e corpo da resposta

*Sua frase-alvo: "Leio uma requisição e uma resposta inteiras e explico o que cada parte
significa, incluindo método, status e cabeçalhos relevantes."*

---

**NÃO AGORA**
— RFC 9110 (a norma). É escrita para quem implementa servidor HTTP. Volte se um dia precisar
decidir comportamento de cache em produção.

---

# SEGUNDO EXEMPLO, COMPACTO — o selo em ação (`api-consumption`)

### Consumo de API — **com JavaScript (fetch)**
**Reconhece → Aplica sozinho** (L0 → L2)

**1. LEIA** · Métodos de requisição HTTP · MDN · ⏱ 15 min · 🌐 pt-BR · 💰 grátis
https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Methods

**2. ASSISTA** · APRENDA FETCH API DE JAVASCRIPT COM PROJETO · Matheus Battisti (Hora de
Codar) · ⏱ vídeo único · 🌐 pt-BR · 💰 grátis · **RECOMENDADO**
https://www.youtube.com/watch?v=qIGYM4S8x50

**3. ESTUDE** · Making network requests with JavaScript · MDN · ⏱ 1 h 30 · 🌐 **inglês** ·
💰 grátis
https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Network_requests
*Não há material equivalente em português para este passo: a rota pt-BR da MDN entrega a
página legada "AJAX", sem os exemplos de fetch.*

**QUEM ENSINA ISSO BEM** — Matheus Battisti (canal Hora de Codar), autor do vídeo acima;
mantém curso gratuito de HTML/CSS/JS com projeto, também no catálogo.

**COMO SEI QUE ACABEI**
☐ Minha tela mostra algo útil quando a requisição falha
☐ Não deixo o usuário sem resposta enquanto carrega

O selo `com JavaScript (fetch)` não veio do catálogo de competências — `api-consumption` não
declara `technologies`. Veio da moda das tags dos três recursos selecionados. Trocar a stack
para Java trocaria os recursos e o selo; o nó, o gap e a posição na fila ficam idênticos.

### 3.2 Escolha de stack

# ESCOLHA DE STACK — especificação

## Princípio

A escolha de stack **filtra a tag de tecnologia dos recursos e alimenta o selo do nó**. Não
adiciona, remove nem reordena competência nenhuma. `CareerTrack.requirements`, o grafo de
pré-requisitos e o escore são idênticos nas duas pontas — o que muda é só qual link aparece
no bloco 3 da ficha. Isso é testável: gerar o roadmap com stack A e stack B e comparar os
`RoadmapItem[]` deve dar diff vazio. Vale como teste automatizado e como argumento de banca.

## Quais opções — e por que só estas

O mercado brasileiro não autoriza uma escolha JS-only:

- **Mineração de vagas** (19.655 anúncios deduplicados, abr–jun/2025): Python, SQL,
  JavaScript e Java como linguagens mais citadas.
- **Lado da oferta** (devs brasileiros empregados): Java e C# lideram; Spring Boot e .NET
  aparecem à frente de React. O mercado CLT que absorve estagiário é mais enterprise do que
  os repositórios de vagas sugerem.
- **Vagas de entrada** nos repositórios comunitários: JS/TS + React + Node domina, mas vagas
  de entrada são só 8–12% do total.

Mas há um segundo filtro, e ele é mais duro que o mercado: **só se oferece a stack que o
catálogo verificado consegue servir.** Conferindo os 95 recursos verificados:

| Stack | Cobertura verificada | Decisão MVP |
|---|---|---|
| **JavaScript / Node** | api-development (Battisti, Node+Mongo), api-consumption (Battisti fetch), javascript-essentials (Rafaella, Guanabara, javascript.info, Eloquente), automated-testing (Erick Wendel), build-an-application (Full Stack Open ptbr partes 0–5) | **Oferecer — padrão** |
| **Java / Spring** | api-development (Michelli Brito, Spring Data JPA 2024), authentication-basics (Fernanda Kipper, Spring Security + JWT), deployment-basics (Kipper, Docker + deploy), build-an-application (Kipper, fullstack Java+React), algorithms (Loiane Groner) | **Oferecer** |
| **Python / Django** | zero recursos verificados de backend; só fundamentos agnósticos (Pense em Python, EV Bradesco) | **Não oferecer no MVP** |
| **PHP / Laravel** | zero recursos verificados | **Não oferecer no MVP** |
| **C# / .NET** | zero recursos verificados | **Não oferecer no MVP** |

Oferecer uma stack sem recurso por trás reproduz exatamente o problema que estamos
consertando. Python/Laravel/.NET ficam registrados como expansão declarada — o modelo já
comporta (`Technology.ecosystem`), falta curadoria.

## Quando perguntar

**Nunca no onboarding.** O Odin Project só pergunta depois dos fundamentos, com a mensagem
"não importa tanto, só não troque no meio" — e nosso usuário, por definição, não tem
preferência formada para decidir isso no minuto zero.

Gatilho: a pergunta aparece **na primeira vez que o roadmap posiciona como FOCO AGORA um nó
cujos recursos divergem por stack** — na prática `api-development` ou `build-an-application`.
Até lá, todo nó do caminho (`programming-fundamentals`, `http-fundamentals`,
`version-control-git`, `sql-basics`, `html-semantics`, `css-layout`) tem recurso agnóstico ou
de plataforma, e a pergunta seria ruído.

Formato da pergunta, como decisão reversível e de baixo peso:

> **Em qual stack você quer praticar daqui pra frente?**
> As competências do seu roadmap não mudam — muda o material que vamos indicar.
> ( ) JavaScript / Node — mais vagas de entrada nos portais de tecnologia
> ( ) Java / Spring — mais vagas CLT no mercado formal brasileiro
> ( ) Ainda não sei — seguimos em JavaScript, você troca quando quiser

Terceira opção sempre presente e sempre default. Trocar depois é permitido, com aviso único:
*"trocar agora substitui o material indicado; seu progresso e seus níveis continuam valendo"*
— porque continuam mesmo: o progresso é por competência, não por recurso.

## Como afeta títulos

O selo do nó é **derivado dos recursos**, não da resposta do usuário diretamente. A resposta
filtra os recursos; o selo lê o resultado. Assim, um nó continua sem selo quando todos os
recursos filtrados são agnósticos, e isso é correto — `technical-communication` não tem
stack.

| Nó | Sem escolha | JS/Node | Java/Spring |
|---|---|---|---|
| Construção de API | Construção de API | Construção de API — com Node + Express | Construção de API — com Java + Spring |
| Autenticação básica | Autenticação básica | Autenticação básica | Autenticação básica — com Spring Security + JWT |
| Fundamentos de HTTP | Fundamentos de HTTP (vale para qualquer linguagem) | idem | idem |

Nota honesta a registrar na ficha: em `authentication-basics`, o único artefato brasileiro
verificado é Java/Spring. Quem escolher JS recebe MDN "Autenticação HTTP" (pt-BR, parcial —
cobre Basic a fundo e deixa Bearer/JWT raso) mais OWASP em inglês. Isso é uma lacuna real do
catálogo, não um defeito da escolha de stack, e deve aparecer como aviso.

## Fora do escopo do TCC

Ecossistemas com muita vaga e pouco material estruturado (SAP/ABAP, Shopify, Magento, TOTVS)
já estão previstos no comentário de `catalog/technologies.ts` e permanecem fora. Registrar no
texto acadêmico como evolução, não implementar.

---

## 4. Correções impostas pela crítica

A crítica adversarial derrubou parte do plano original. O que segue vale **acima** das seções
anteriores onde houver conflito.

### 4.1 O erro metodológico (mais grave)

A ADR-0007 define a condição A como "catálogo completo, sem filtragem nem ordenação" e a B
como o roadmap personalizado. Se a camada de recursos entrar **só na B**, a condição B passa
a ter personalização **mais** curadoria, ordem pedagógica, um recomendado, critério de saída,
selo de tecnologia e hierarquia visual. Um resultado positivo no ResQue não isolaria a
personalização — que é a tese do trabalho.

**Correção:** a camada de recursos precisa existir **igual nas duas condições**, variando
apenas seleção e ordem. Alternativa honesta, se isso for inviável: declarar no texto que o
experimento mede "curadoria + personalização", e não personalização.

Some-se: fixar a stack durante a coleta (perguntar no meio da sessão faz participantes verem
conteúdos diferentes e quebra o intra-sujeito com n baixo); e limitar a 1 recomendado e 3
ações derruba justamente as dimensões de **controle** e **transparência** do ResQue — medir,
não assumir.

### 4.2 Afirmações que eu não podia sustentar

- **"95 recursos prontos, falta só importar" é falso.** As 38 entradas brasileiras não têm
  `license` (exigida pela ADR-0005), `estimated_time`, `requires_signup`, `pt_br_status`,
  `published_at` nem `last_verified_at`. Sem esses campos, `validateCatalog` reprova e as
  pílulas da ficha não têm o que renderizar.
- **`technology` é texto livre com 39 valores inconsistentes** (`agnostic`/`agnóstico`,
  `javascript`/`JavaScript`/`JavaScript / Fetch`, `hashing de senhas`). A "moda das tags"
  produziria o selo "— com hashing de senhas". Normalizar para `TechnologyId` é
  **pré-requisito** dos itens de selo e de stack, não custo marginal.
- **Acusação sem fonte:** a alegação de que o cadastro da DIO expõe o perfil a recrutadores
  nomeia uma empresa e seria exibida ao usuário. Sai até haver fonte.
- Os números de mercado (19.655 anúncios, 8–12% de vagas de entrada) estão no DIRECAO.md mas
  **não em `SOURCES.md`** — sem referência citável, não entram no texto acadêmico.

### 4.3 Viabilidade que o plano superestimou

- **21 dos 49 pares (competência, nível) têm um único recurso**, e só 11 entradas são L2. A
  regra "bloco 3 obrigatório, sem plano não vira FOCO AGORA" silenciaria justamente o
  `nextBestAction` que o motor elegeu. Definir fallback por `levelMin <= alvo`.
- **Só 7 das 95 entradas são `BUILD`.** A regra "marco a cada 4 leituras" dispararia em quase
  todo trecho, e marcos escritos à mão não cobrem 23 nós.
- **O checklist de saída não persiste em lugar nenhum.** Se marcar não altera o nível estimado
  nem regenera o roadmap, é decoração.
- **A ficha conserta o painel, não o mapa.** A queixa era do mapa: sem hierarquia visual e sem
  "passo N de M", os 23 nós continuam equivalentes.

### 4.4 Recorte revisado

A crítica é dura e está certa: 11 mudanças, três delas de autoria de conteúdo, competem com a
avaliação com usuários — que é o núcleo do TCC e o que o orientador frisou.

**Antes da coleta, apenas:** entidade `Resource` + import do catálogo; ficha do nó (plano
ordenado + checklist); hierarquia visual de um passo dominante; pílulas de idioma, custo e
cadastro. Mais a normalização de `technology` e o preenchimento dos campos faltantes, que são
pré-requisito.

**Depois da coleta:** marcos, escolha de stack, pessoas por autoria, exercícios de autoria
própria, rotina de revalidação de URL.

Exercício de autoria própria (os dois buracos sem cobertura em idioma nenhum) **exige ADR
nova**: a ADR-0005 define catálogo como metadados + URL do detentor, e conteúdo próprio muda
essa premissa.

---

## 5. Mudanças, ordenadas

| # | Mudança | Esforço | Risco de escopo | Quando |
|---|---|---|---|---|
| 1 | Entidade Resource no domínio + catálogo importado dos 95 recursos verificados | M | low | antes da coleta |
| 2 | Ficha do nó: plano ordenado em verbos + checklist de saída | M | low | antes da coleta |
| 3 | Selo de tecnologia derivado dos recursos | S | low | depois |
| 4 | Um passo dominante: hierarquia visual e abertura no FOCO AGORA | S | low | antes da coleta |
| 5 | Pílulas de idioma, custo e cadastro antes do clique | S | low | antes da coleta |
| 6 | Projeto-marco com escopo fechado a cada ~4 itens de leitura | M | medium | depois |
| 7 | 'Quem ensina isso bem' — pessoa por autoria de artefato | S | low | depois |
| 8 | Escolha de stack adiada, com duas opções servidas | M | medium | depois |
| 9 | Livros: custo explícito, mapeamento por capítulo e gratuito primeiro | M | low | depois |
| 10 | Revalidação de URL e `lastVerifiedAt` como rotina | S | low | depois |
| 11 | Dois artefatos PROVE de autoria própria — e só dois | L | high | depois |

Detalhamento de cada uma em `docs/research/` e no JSON do plano.

---

## 6. Campos novos no modelo

- `Resource` (tipo novo em domain/model.ts) — não existe hoje; sem ele o FocusPanel não tem o que renderizar e os 95 recursos verificados ficam presos em JSON de pesquisa.
- `Resource.url` + `Resource.sourceName` — URL canônica da página do detentor dos direitos, exigida por ADR-0005 (nada hospedado, espelhado ou embutido).
- `Resource.actionType: 'READ' | 'WATCH' | 'LEARN' | 'BUILD' | 'PROVE'` — é o verbo que abre cada linha da ficha; sem tipagem a lista vira bullet point sem direção.
- `Resource.competencies[]` + `Resource.levelMin` — o mesmo recurso serve níveis diferentes (Learn Git Branching é L1 nos primeiros níveis e L2 em rebase), e a ficha precisa filtrar por nível-alvo, não só por competência.
- `Resource.technology: TechnologyId | 'agnostic'` — é a origem do selo do nó; a tecnologia entra pelo recurso, nunca pela competência.
- `Resource.cost: { content: 'free' | 'paid', amountBRL?, certificateSeparate: boolean }` — Curso em Vídeo, freeCodeCamp, W3Cx e EV Bradesco têm conteúdo gratuito com certificado pago; um booleano `is_free` esconderia essa distinção e mentiria nos dois sentidos.
- `Resource.requiresSignup: boolean` + `signupNote?` — metade do bom material brasileiro exige cadastro (Curso em Vídeo, Alura, DIO, freeCodeCamp, 7 Days of Code) e no caso da DIO o cadastro expõe o perfil a recrutadores, o que o usuário tem direito de saber antes do clique.
- `Resource.ptBrStatus: 'complete' | 'partial' | 'none' | 'n/a'` — precisa medir o CORPO do conteúdo: interface traduzida (Jest, Missing Semester, Technical Writing One) e legenda automática (CS50) não são tradução, e a verificação corrigiu onze afirmações exatamente nesse ponto.
- `Resource.ptBrNote?` — onde a tradução parcial falha (Full Stack Open tem 0–5 e 13 em pt-BR, 6–12 só em inglês; Eloquente 4ª ed. foi traduzido com auxílio de IA e não é endossado pelo autor).
- `Resource.publishedAt` + `Resource.updatedAt?` — ano no título é marketing ('Curso Lógica de Programação 2026' saiu em ago/2025); material de HTML/CSS/JS anterior a ~2019 é pré-flexbox/grid na prática e precisa de tarja.
- `Resource.lastVerifiedAt` — sem data de última checagem não há como falhar o build por link podre, e a verificação já encontrou um recurso morto e duas rotas erradas.
- `Resource.license` — ADR-0005 exige licença registrada por recurso; há CC BY-NC-ND (YDKJS, proíbe derivados), proprietárias (Alura, Origamid, DIO) e não-declaradas (SQLBolt, Oh Shit Git) convivendo no mesmo catálogo.
- `Resource.estimatedTime` — a ficha promete 'Leia isto, 25 min'; sem tempo estimado o plano ordenado não ajuda ninguém a decidir se cabe hoje.
- `Resource.pedagogicalFormat: 'worked-example' | 'guided-tutorial' | 'exercise' | 'reference' | 'project'` — separa 'explica' de 'faz praticar', que é o que a regra dos ~4 itens sem um FAÇA precisa contar.
- `Resource.contentType: 'lesson' | 'reference' | 'opinion'` — o filtro 'só aula, nunca opinião' descartou boa parte do conteúdo brasileiro mais popular; a regra precisa virar campo para ser auditável na banca em vez de nota de rodapé.
- `Resource.chapters?` — 'Código Limpo caps. 1–4 e 17', 'Pro Git caps. 2–3', 'Eloquente caps. 1–5': mapeamento por livro inteiro recomendaria centenas de páginas fora do nível do usuário.
- `Resource.recommended: boolean` + `Resource.sequence: number` — exatamente um recomendado por (competência, nível) e ordem pedagógica explícita; é o que implementa 'um passo dominante' em dado, não em CSS.
- `Resource.caveat?` — ressalvas verificadas que precisam aparecer na ficha (Node 16 em EOL no livro de APIs; WAMP/XAMPP no MySQL do Curso em Vídeo; Grid ausente no Odin Foundations; volumes cancelados do YDKJS Yet).
- `Person` (tipo novo) + `Resource.authoredBy?` — pessoa só existe ligada a artefato; sem a aresta de autoria o bloco 'quem ensina isso bem' vira lista de indicados por popularidade, que é o que a pesquisa desaconselha.
- `Milestone` (tipo novo) — projeto com escopo fechado, requisitos[], tempo e checklist de entrega; sem os quatro campos o item degenera em 'construa um app', que é orientação mínima e comprovadamente pior para novatos.
- `UserProfile.stackId?` — guarda a escolha de stack para filtrar recursos; deliberadamente fora de `Gap`, `ScoreBreakdown` e `RoadmapItem`, para que a invariância do motor entre stacks seja testável.
- `Catalog.resources`, `Catalog.people`, `Catalog.milestones` — sem entrar no `Catalog` os novos tipos não passam por `validateCatalog` e o protocolo de fundamentação deixa de ser mecanismo verificável.

---

## 7. Avaliação das sugestões do dono do produto

### Citar linguagens e frameworks no roadmap
**ADOTAR-COM-AJUSTE** — Adotar como SELO derivado dos recursos ('Construção de API — com Node + Express'), não como competência nem como aresta. O ajuste não é preciosismo: criar competência por tecnologia reproduz o problema dos roadmaps por stack — dezenas de mapas paralelos repetindo 'aprenda testes' e 'aprenda Git' — e quebraria ADR-0001 e a comparabilidade entre perfis na avaliação. Com o selo, o pedido é atendido em três lugares visíveis (título do nó, ficha, linha do recurso) e o motor não muda uma linha.

### Trazer links de vídeos
**ADOTAR** — É o formato dominante do público e a curadoria brasileira já está verificada: 38 artefatos aprovados de criadores brasileiros, a maioria vídeo, com autoria, gratuidade e URL conferidas uma a uma. Entram como linhas ASSISTA na lista ordenada, com tempo e aviso de idioma — nunca como parede de links. Ressalva operacional: duas playlists longas (Guanabara e Battisti em JavaScript) tiveram gratuidade confirmada mas nenhuma data de aula, e JavaScript é o conteúdo mais perecível do catálogo; publicar só depois de checar a data.

### Indicar pessoas para acompanhar
**ADOTAR-COM-AJUSTE** — Discordo do formato pedido. Pessoa entra pela AUTORIA de um artefato já listado na ficha, no bloco 'quem ensina isso bem', com uma linha de evidência e o link da obra — nunca como lista de perfis a seguir. Três razões convergentes: ranquear pessoa por popularidade amplifica quem já é popular e reduz representação de minorias no topo; listas curadas maduras (awesome-lists, roadmap.sh) não têm o tipo 'pessoa'; e relação parassocial com educador de YouTube correlaciona-se fracamente com motivação e não com ganho de aprendizagem. Some-se que a verificação desta pesquisa pegou dois erros de atribuição de autoria e um canal inexistente — 'siga fulano' não é auditável, autoria de artefato é. Pessoas brasileiras near-peer (quem migrou de carreira, veio de bootcamp) têm valor real como experiência vicária, mas em camada separada e fora do cálculo de prioridade.

### Indicação de livros
**ADOTAR-COM-AJUSTE** — Adotar com mapeamento POR CAPÍTULO e custo explícito. O levantamento desta rodada reprovou 8 de 48 títulos e quase todas as reprovações são de nível ou de data, não de qualidade: Refatoração e Arquitetura Limpa são L2-L3 e devem alimentar o estado NOT NOW com razão explícita ('volte após build-an-application L1'), não a lista de recomendados; HTML5 e CSS3 (2012) e Cangaceiro JavaScript (2017) caem no corte pré-flexbox/pré-ESM; Controlando versões com Git é pago, de 2014, e perde para o Pro Git pt-BR, que é gratuito, oficial e mantido. E a regra dura: recurso pago nunca é o RECOMENDADO quando existe equivalente gratuito verificado no mesmo nível — o público-alvo é estudante em início de carreira, e web.dev 'Aprenda CSS' em português e de graça torna os R$ 249 da Origamid indefensáveis como primeira indicação.

### Parecer com o roadmap.sh, porém personalizado
**ADOTAR-COM-AJUSTE** — Adotar a parte que o roadmap.sh acerta — tecnologia nomeada e material anexado a cada nó — e recusar a parte que ele não tem como dar. O roadmap.sh é o mesmo mapa para todo mundo, sem estado atual, sem gap, sem 'já pode pular isto', sem critério de saída; copiá-lo jogaria fora o único mecanismo que o TCC precisa provar. Nossa diferença defensável, e que o usuário tem que SENTIR na tela, é tripla: o mapa muda conforme o que a pessoa já sabe, um passo é dominante em vez de dez equivalentes, e cada nó diz como você sabe que acabou. Nota de licença, que também é decisão tomada: o roadmap.sh proíbe redistribuição do conteúdo fora do repositório — entra no TCC como trabalho relacionado citado, nunca como fonte de recurso, e o baseline do experimento é construído com o nosso próprio catálogo (o que, por acaso, é o desenho experimental mais limpo).


---

## 8. Crítica adversarial na íntegra

**1. Escopo/ADRs** — Nada fere ADR-0001/0002 (motor intacto, recurso fora do escore), mas há três atritos reais: (a) item 11 (exercícios PROVE autorais) e o "exercício do Career Gap" da ficha violam ADR-0005, que define catálogo como *metadados + URL do detentor* — conteúdo próprio exige ADR nova, não nota de rodapé; (b) item 6 injeta `Milestone` em `roadmap.ts`, alterando a sequência determinística por uma regra ("4+ leituras sem BUILD") que não deriva de gap, pré-requisito nem escore — precisa virar regra documentada, ou a banca pergunta por que o item 5 é um projeto; (c) 11 mudanças, 3 delas de autoria de conteúdo (marcos, exercícios, curadoria de 40 livros), competem com a avaliação com usuários, que é o núcleo do TCC (§19, ADR-0007). Antes da coleta cabem 1, 2, 4, 5 — o resto é pós-avaliação.

**2. Afirmações sem lastro / recursos não verificados** — "95 recursos verificados e prontos, falta só o tipo e o import" é falso: as 38 entradas de `docs/research/recursos-br-verificados.json` só têm `cost`, `technology` e `year_or_recency`; **não têm `license` (exigida por ADR-0005), `estimated_time`, `requires_signup`, `pt_br_status`, `published_at` nem `last_verified_at`** — os quatro invariantes de `validateCatalog` e as pílulas do item 5 não passam para 40% do catálogo. Os 40 livros do item 9 não existem em lugar nenhum: há **3 entradas `kind: "book"`** nos dois JSONs, e `DIRECAO.md` §4 diz literalmente que a lente `br-books-courses` está "ainda não verificados um a um" — logo "reprovou 8 de 48 títulos", os cortes por capítulo (Código Limpo 1–4 e 17, Aniche 1–3, Pro Git 2–3) e o preço da Origamid são afirmações sem artefato de verificação. Idem "metade do bom material brasileiro exige cadastro" e "a DIO monetiza o cadastro com recrutamento": não há campo `requires_signup` no JSON BR para sustentar a metade, e a alegação sobre a DIO é acusação sobre empresa nomeada, exibida ao usuário, sem fonte. Os números de mercado (19.655 anúncios, 8–12% de vagas de entrada, Java/C# no lado da oferta) estão em `DIRECAO.md` mas **não aparecem em `docs/research/SOURCES.md`** — sem referência citável, não entram no texto acadêmico. Erro operacional adicional: `technology` é texto livre com 39 valores inconsistentes (`agnostic`/`agnóstico`, `javascript`/`JavaScript`/`JavaScript / Fetch`, `hashing de senhas`, `web estática / GitHub Pages / FTP`) — a "moda das tags" produziria "— com hashing de senhas" e o filtro de stack não tem chave; normalizar para `TechnologyId` é pré-requisito dos itens 3 e 8, não custo baixíssimo.

**3. A ficha resolve a queixa?** — Parcialmente. Resolve "o quê/com quê/como sei que acabei" **dentro do nó focado**; não resolve "onde estou no todo" (não há passo N de M, progresso nem horizonte de tempo) e, sem o item 4, os 23 nós continuam equivalentes no canvas — a queixa era do mapa, e o conserto está no painel. Dois buracos estruturais: o checklist de saída é marcável mas **nenhuma mudança define onde esse estado persiste nem se ele realimenta `currentState`/reavaliação** — sem isso é decoração; e a viabilidade do bloco 3 é otimista: 21 dos 49 pares (competência, nível) têm **um único** recurso e só 11 entradas são L2, então "bloco 3 obrigatório, sem plano não vira FOCO AGORA" pode silenciar justamente o `nextBestAction` que o motor elegeu. Defina o fallback por `levelMin <= alvo` e o que a ficha mostra quando sobra 1 recurso. Só 7 das 95 entradas são BUILD — a regra dos 4 itens dispararia em quase todo trecho, e 4–6 marcos escritos à mão não cobrem 23 nós.

**4. O que um avaliador questionaria** — Recomendação: o desenho da ADR-0007 fica confundido. A condição A é "catálogo completo sem filtragem nem ordenação" e a B passa a ter, além da personalização por gap, curadoria, ordem pedagógica, um RECOMENDADO, critério de saída, selo e hierarquia visual — um ResQue positivo não isola a personalização, que é a tese. A camada de recursos precisa existir **igual nas duas condições**, variando só seleção/ordem. Some-se: o `RECOMENDADO` é escolha editorial do próprio autor do sistema, que também é o avaliador (viés de curadoria não declarado); limitar a 1 recomendado e 3 ações derruba justamente as dimensões de *controle* e *transparência* do ResQue; e o "por que este e não outro" é prosa livre no campo `why`, contrariando a regra do CLAUDE.md de guardar razão estruturada — deveria ser reason code tipado (gratuito, pt-BR, nível compatível, sem cadastro) renderizado como texto. Educação: `exitCriteria` são autodeclarados e servem simultaneamente de rubrica e de critério de conclusão — circularidade que o painel de especialistas precisa checar; e a pergunta de stack no meio da sessão faz participantes verem conteúdos diferentes, quebrando o intra-sujeito com n baixo (fixe a stack durante a coleta).

**As três perguntas antes de implementar:**
1. A camada de recursos vai aparecer nas duas condições da ADR-0007 (variando só seleção e ordem) ou você aceita, e declara no texto, que o experimento passa a medir "curadoria + personalização" em vez de personalização?
2. Quem completa `license`, `estimated_time`, `requires_signup`, `pt_br_status` e `published_at` das 38 entradas BR, normaliza `technology` para `TechnologyId` e executa de fato a verificação de livros — e isso cabe antes da coleta, ou os itens 5, 8 e 9 saem do recorte do TCC?
3. Marcar o critério de saída muda o nível estimado da competência e regenera o roadmap? Se sim, onde persiste e como a reavaliação entra na metodologia; se não, por que exibir um checklist que não faz nada?
