# Comparação com currículos abertos e com o Trilha Info

Data: 2026-10-15. Pedidos do Enzo:

- deixar o conteúdo "ainda mais completo" com referências abertas (o `nilbuild/developer-roadmap`
  foi descartado: é o roadmap.sh, licenciado só para uso pessoal);
- avaliar o Tech Guide da Alura;
- investigar a fundo o Trilha Info, que tem "algo muito parecido com o que eu queria para o
  nosso" no design.

**Método.**
- Seis fontes lidas contra as 25 competências da trilha. MDN Learn, freeCodeCamp, The Odin
  Project e Full Stack Open foram comparados por quatro agentes em paralelo. Tech Guide e Trilha
  Info foram lidos direto do repositório e do site.
- Cada lacuna recebeu uma classe:
  - **(a)** cabe numa competência que já existe;
  - **(b)** pede uma competência nova;
  - **(c)** está fora do escopo da primeira vaga.
- Cada recurso candidato teve a URL aberta.
- **Nada entrou no catálogo.** Os 59 candidatos e as 56 lacunas dos quatro currículos estão em
  [`research/candidatos-curriculos-abertos.json`](research/candidatos-curriculos-abertos.json).

## 1. Em uma página

1. **Uma lacuna aparece em todas as fontes: interface com componentes e estado (React).** As
   seis fontes a cobrem e nenhuma das nossas 25 competências cobre. Proposta: uma competência
   nova, agnóstica de framework, com React como selo de tecnologia.
2. **Ferramentas do projeto** (npm, scripts, build, linter) também aparecem em todas as fontes,
   mas cabem em competências que já existem.
3. **Três competências estão sem prática ou quase:**
   - `relational-data-modeling`: zero práticas;
   - `ai-assisted-development-basics`: zero práticas;
   - `authentication-basics`: uma prática, e um único recurso em pt-BR.

   As fontes trazem candidatos verificados para as duas primeiras e para autenticação. Para IA,
   só o Trilha Info traz material.
4. **O recurso do Full Stack Open no catálogo tem três erros** (§5).
5. **Trilha Info:**
   - é o trabalho relacionado mais próximo: brasileiro, aberto e ativo;
   - o design dele, uma **estrada vertical**, responde às três objeções que nos fizeram abandonar
     o canvas (ADR-0008);
   - ele **não estima o que a pessoa sabe, não calcula lacuna e não prioriza**. A ordem é
     editorial e a mesma para todos. Isso confirma o nosso diferencial.
6. **Licenças.**
   - Linkar é livre em todas as seis fontes.
   - Adaptar texto sem a cláusula "compartilha igual" só é possível no Tech Guide (MIT) e no
     Trilha Info (Apache-2.0).
   - **O conteúdo do freeCodeCamp não é aberto.** Isso corrige o que eu disse antes: a BSD-3
     cobre só o software.

## 2. Fontes e licenças

| Fonte | Licença do conteúdo | Linkar | Adaptar o texto |
|---|---|---|---|
| MDN Learn | CC BY-SA 2.5 ou posterior; exemplos de código CC0 | sim | sim, mas o trecho derivado sai CC BY-SA, com crédito a "Mozilla Contributors" e nota do que mudou |
| freeCodeCamp | "copyright © 2014 freeCodeCamp.org", sem licença aberta. A BSD-3 cobre só o software; os repositórios de curso não têm arquivo de licença | sim | **não**: só a ideia do projeto, com texto nosso |
| The Odin Project | CC BY-NC-SA 4.0 (`license.md` do repositório `curriculum`) | sim | sim: não comercial, compartilha igual, crédito a Erik Trautman e ao TOP |
| Full Stack Open | CC BY-NC-SA 3.0 (fullstackopen.com) e 4.0 (partes no mooc.fi) | sim | idem, com crédito a Matti Luukkainen e à Universidade de Helsinque |
| Alura Tech Guide | MIT, "Copyright (c) 2022 Alura" | sim | sim, mantendo o aviso; o README pede link para techguide.sh |
| Trilha Info | Apache-2.0 no `LICENSE`. O README e o JSON do catálogo dizem MIT; seguir a Apache, que é a mais exigente | sim | sim, mantendo aviso de copyright e licença e marcando o que mudou |

**Recomendação: manter a regra só-links (ADR-0005).**
- As listas de objetivos (Tech Guide, MIT) e os "Learning outcomes" (MDN) servem como checklist
  de cobertura.
- Os critérios de saída continuam escritos com as nossas palavras. Ideia e fato não geram
  obrigação; cópia da redação gera.
- Se algum dia quisermos missões traduzidas do Odin ou do FSO, isso pede uma ADR própria, um
  campo de atribuição separado e o compromisso de não cobrar pelo produto.

## 3. Trilha Info a fundo

### 3.1 O que é

[trilha.info](https://trilha.info) · `github.com/flaviojmendes/trilhainfo`.
- **História e tamanho:** criado em junho de 2022 por Flávio Mendes; 846★ e 76 forks; último
  envio em 15/10/2026.
- **Stack:** React 18 com Vite, Tailwind e Framer Motion.
- **Escopo:** 8 trilhas (Frontend, Backend, Fullstack, QA, DevOps, Dados, React, Entrevistas).
  A de Frontend tem 14 etapas, 53 passos essenciais e 3 trechos.
- **Conteúdo:** 129 recursos externos, 34 guias curtos e 76 aulas próprias.
- **Sem cadastro:** o progresso fica no navegador.
- **Reescrito em outubro de 2026.** O repositório tem `PRODUCT.md` e `DESIGN.md` no formato da
  skill impeccable, a mesma que usamos.

### 3.2 O design: a estrada

O que o torna especial, medido no código (`src/components/LearningWorkspace/JourneyMap.tsx` e
`workspace.css`):

1. **Uma estrada só, vertical, sem pan nem zoom.**
   - É um SVG posicionado atrás das estações.
   - O caminho passa pelo centro real de cada ponto, medido no DOM com
     `offsetLeft`/`offsetTop`. Essas medidas ignoram `transform`, então animação e hover não
     entortam a estrada. Um `ResizeObserver` refaz a medida quando o layout muda.
   - Entre dois pontos há uma Bézier cúbica com as alças na metade da distância vertical. A
     curva sempre sai e chega na vertical, por isso parece estrada e não rabisco.
2. **Balanço determinístico.**
   - Cada estação sai do eixo por um padrão fixo, `[0, .55, 1, .55, 0, −.55, −1, −.55]` vezes
     108 px. É orgânico sem ser aleatório: o mesmo catálogo desenha sempre a mesma estrada.
   - O texto fica sempre à direita do ponto, e a leitura continua sendo uma coluna.
3. **Duas camadas de traço.**
   - O trajeto inteiro tem um leito de 14 px e uma faixa central tracejada (`dasharray 1 11`).
   - Por cima vai o trecho já percorrido: 6 px, em gradiente, com brilho desfocado.
   - "Onde já passei" é um traço, não um número.
4. **Trechos que terminam numa entrega.**
   - Os 53 passos viram 3 trechos: "Construir a base", "Conectar interface e dados" e "Entregar
     seu produto".
   - Cada trecho começa num marco numerado e termina num projeto: marcador quadrado com
     bandeira e "0 de 3 critérios".
   - O fim da estrada é o **Destino**, o resultado prometido da trilha.
5. **Coluna fixa de orientação**, com 316 px no desktop.
   - Contém o "Próximo passo" com botão, os trechos com barra de progresso e a legenda "Como ler
     o mapa".
   - Abaixo de 1180 px ela sobe para o topo. No celular, os trechos viram uma faixa horizontal e
     a legenda começa recolhida.
6. **Desvios fora da estrada.** Os aprofundamentos opcionais ficam numa caixa tracejada ao lado,
   e não entram no total obrigatório.
7. **O estado nunca depende só da cor.**
   - Concluído tem ✓ e texto.
   - "Você está aqui" tem `aria-current="step"`.
   - Progresso parcial aparece em arco e em contagem.
   - Cada estação é um `<button>` com rótulo completo, por exemplo "Internet e HTTP ·
     Obrigatório · 2 passos essenciais · Você está aqui".
8. **Movimento uma vez só.**
   - Na primeira abertura da sessão, o trecho percorrido se desenha em 1,5 s, as estações chegam
     em cascata de 40 ms e o ponto atual pulsa três vezes.
   - `prefers-reduced-motion` e um controle de efeitos desligam tudo.
9. **Três estados separados por assunto:**
   - **Estudei:** a referência foi lida.
   - **Demonstrei:** a prática foi cumprida.
   - **Familiaridade declarada:** "Estou começando", "Já pratiquei" ou "Consigo demonstrar".

   Na tela: "Uma referência lida continua separada da habilidade demonstrada". É o mesmo
   princípio que seguimos (checklist não promove nível).
10. **Extras:**
    - profundidade por assunto (Simplificar / Ver completo / Aprofundar);
    - saída em JSON, Markdown e PNG;
    - tema escuro com iluminação que segue o horário local.

### 3.3 Por que a estrada cabe nos motivos da ADR-0008

| Objeção da ADR-0008 ao canvas | Como a estrada responde |
|---|---|
| Fonte manuscrita nos rótulos, ilegível com o zoom abaixo de 100% | Rótulos em fonte de interface, dentro de cartões, sempre a 100% |
| Duas interfaces: canvas no desktop, lista no celular | Uma tela só, vertical, que reflui por CSS |
| Traço orgânico vira ruído com 25 nós | Um traço único e suave, com os nós divididos em trechos |

**Atenção:** a ADR-0008 diz textualmente para não reintroduzir "traço desenhado" sem revisá-la.
Adotar a estrada exige uma **ADR-0011** que revise esse ponto. O resto da 0008 continua de pé:
uma interface só, sem pan e sem zoom, anotação manuscrita só na voz do mentor.

### 3.4 Como ficaria no Career Gap

A estrutura vem do Trilha Info. A identidade, a lógica e o tom continuam nossos.

| No Trilha Info | No Career Gap |
|---|---|
| 3 trechos que terminam num projeto | Os 4 níveis da trilha (Fundamentos, No navegador, Construir e publicar, Pronto para a vaga). Cada nível fecha com uma entrega escolhida entre as práticas `PROVE` que o catálogo já tem. Exemplos: o desafio técnico de empresa brasileira em "Construir e publicar"; a primeira contribuição ao Querido Diário em "Pronto para a vaga" |
| Estação = assunto | Estação = competência |
| ✓ concluído, e o traço percorrido vai até ele | "você já sabe" (`met`); o traço percorrido cobre o que a pessoa já domina |
| Um "Você está aqui", definido pela ordem editorial | O nível onde a pessoa está (`hereLevelId`) e, ao lado, até 3 anotações `← recomendado agora`, cada uma com o motivo dado pelo motor |
| — | "falta base": contorno tracejado e "rende mais depois de X". O link continua abrindo |
| Desvio opcional, fora da estrada | "não agora" e as competências fora da trilha |
| Próximo passo (um só) | "Recomendado agora" (até 3), na coluna fixa |
| Escuro, magenta, brilho, vidro | Papel quente, tinta e azul de ação. Traço de tinta sem brilho. Shantell Sans só na anotação |
| "Obrigatório" em cada estação | Nada é obrigatório nem trancado (ADR-0009). A estrada mostra uma ordem, não impõe |

### 3.5 O que não copiar

- **A identidade visual deles:** obsidiana, magenta, vidro e iluminação por horário. É a marca
  deles e contraria a nossa.
- **A lógica do próximo passo.** O `nextGroup` escolhe o primeiro grupo, na ordem editorial, que
  tenha um passo obrigatório não concluído. A familiaridade declarada não muda essa escolha; só
  aparece no plano gerado e no prompt para a IA. É exatamente a sequência fixa que o nosso motor
  substitui.
- **"Obrigatório" e três frameworks (React, Angular e Vue) como estações da mesma estrada:** pesa
  e contraria a ADR-0009.
- **As aulas próprias, por dois motivos:**
  - a ADR-0005 só permite links;
  - as **76 aulas foram geradas num único commit com o agente do Cursor em 14/10/2026** (commit
    `2a2410d`) e ainda não têm revisão de terceiros.

### 3.6 Conteúdo aproveitável

- **Recursos:** são 129 entradas, com 111 URLs únicas (60 do YouTube). Só **6 já estão no nosso
  catálogo**, e nenhuma coincide com o Tech Guide. Os títulos já trazem o idioma ("português",
  "inglês"), o que ajuda na triagem.
- **Guias e aulas:** os 34 guias e as 76 aulas podem entrar como links (`trilha.info/guide/:guia`,
  `trilha.info/aula/:aula`) depois de revisados um a um. Isso é compatível com a ADR-0005.
- **IA, a nossa competência sem prática:**
  - estações "Com IA": prompts para aprender, contexto útil e dados protegidos, depuração com
    evidências, validar trabalho gerado por IA;
  - documentação oficial: Cursor, Claude Code e Codex em inglês; o uso responsável do GitHub
    Copilot em pt-BR.

### 3.7 Para o texto do TCC

- **Convergência.** Ele chega sozinho a decisões que tomamos por evidência: separar leitura de
  habilidade demonstrada, dar um próximo passo com objetivo observável e guardar o progresso sem
  cadastro.
- **Diferença central.** A ordem dele é editorial e igual para todos. O Career Gap é a camada que
  falta: a mesma ideia de trilha aberta, **anotada por um motor explicável** a partir do que a
  pessoa já sabe.
- **IA.** Ele também usa a IA na posição certa. Exporta catálogo e progresso e pede ao
  assistente um plano em JSON que só usa IDs do catálogo ("Não invente links"). A diferença é que
  lá a IA monta o plano, e aqui o motor decide (ADR-0004).

## 4. Lacunas consolidadas

Legenda: ● a fonte cobre o tema; a/b/c é a classe que o agente propôs para a fonte; — a fonte
não trata o tema.

| Tema | MDN | fCC | Odin | FSO | Tech Guide | Trilha Info | Proposta |
|---|---|---|---|---|---|---|---|
| Interface com componentes e estado (React) | b | b | b | b | ● guia React | ● etapa "Escolha um framework" | **(b) competência nova** `ui-components-and-state`, nível "Construir e publicar", alvo L1, React como selo |
| Ferramentas do projeto (npm, scripts, build, linter, formatador) | a | a | a | a | ● yarn, semver | ● "Vite, pacotes e qualidade" | (a): npm em `command-line-basics`; linter e formatador em `code-readability`; `npm run build` em `build-an-application` |
| TypeScript | — | b | — | a | ● opcional | ● estação | (a) extensão L2 de `javascript-essentials`, como selo |
| Organizar código: módulos, classes, POO | a | a | b | — | ● | — | (a) critério em `javascript-essentials`. O Odin defende (b) porque POO cai em entrevista; dá para reavaliar com dados de vaga |
| CSS: cascata, seletores, especificidade | a | ● parcial | — | — | ● | ● aula própria | (a) ampliar `css-layout`, que passa a se chamar "CSS: estilo e layout" (o id não muda) |
| Segurança básica (XSS, SQL injection) e CORS | a | a | — | c | — | ● guias | (a) um critério em `api-development` (nunca concatenar entrada) e CORS em `api-consumption` |
| Autenticação como parte do núcleo | ● | ● | ● 2 projetos | ● parte 4 | ● | ● | Reavaliar `optional` em `authentication-basics` |
| Inglês técnico para ler documentação | — | b/a | — | — | ● | — | (a) critério em `reading-documentation` |
| Portfólio e candidatura | a | — | c / a (site pessoal) | — | — | ● etapa e trilha Entrevistas | (a) README e site em `technical-communication`; currículo continua fora do escopo |
| CI simples (ler o check do PR) | — | a | — | c | ● | ● | (a) em `code-review-participation`; montar pipeline fica em (c) |
| SEO, Figma | — | — | — | — | ● | — | (c) |
| Estado global, GraphQL, React Native, Next.js, contêineres, WebSockets, performance web, árvores, grafos e programação dinâmica, design, animação | c | c | c | c | — | ● alguns como desvio | (c), consenso |

Nenhuma fonte sugeriu remover qualquer uma das 25 competências. A menos coberta pelas fontes é
`ai-assisted-development-basics`:
- só o Trilha Info a trata como parte da trilha;
- o MDN apenas a menciona;
- o Odin recomenda não usar IA para aprender;
- o Tech Guide não tem card para ela.

## 5. Correções no catálogo atual

O recurso `full-stack-open-pt-br` tem três problemas:
- **Erro factual na nota de idioma.** A nota diz "partes 0-5 e 13 em pt-BR". A parte 13 só
  existe em inglês: `/ptbr/part13` dá 404.
- **Erro factual no tempo.** O catálogo diz "~60 h" para as partes 0–5. As médias de 2026 no
  painel do curso somam **cerca de 90 h**.
- **Versão antiga em pt-BR.** A tradução ainda manda usar `create-react-app`, Jest e Cypress; a
  versão em inglês já usa Vite, `node:test` e Playwright. Vale avisar no `why`.
- **Efeito colateral de uma decisão antiga (decidir, não é bug).** O `levelMin: L2` foi
  escolhido de propósito ("nunca em L0/L1"). Mas ele esconde o curso nas três competências com
  alvo L1: `api-development`, `authentication-basics` e `automated-testing-basics`. A saída mais
  limpa é trocar a entrada única pelos exercícios de cada parte (candidatos do FSO no JSON), cada
  um no nível certo.

## 6. Onde os candidatos rendem mais

Prioridade para as competências com zero ou uma prática, preferindo pt-BR completo e sem
cadastro:

| Competência (práticas hoje) | Melhores candidatos |
|---|---|
| `relational-data-modeling` (0) | **fCC** Banco de corpos celestiais (`PROVE`, pt-BR parcial, GitHub); **Odin** Inventory Application; **FSO** parte 13, cap. 3–4 (`PROVE`, inglês) |
| `ai-assisted-development-basics` (0) | Nenhuma das quatro fontes; o Odin é contra usar IA para aprender. Candidatos: estações "Com IA" do Trilha Info (depois de revisar) e uma missão nossa |
| `authentication-basics` (1, 1 em pt-BR) | **FSO** 4.15–4.23 (pt-BR completo); **MDN** Django parte 8 (pt-BR completo); **fCC** API de lista de filmes, 401 × 403 (pt-BR parcial); **Odin** Members Only |
| `http-fundamentals` (1) | **FSO** 0.4–0.6, diagramar as requisições na aba Network (pt-BR completo) |
| `api-consumption` (1) | **fCC** Aplicativo de clima (`PROVE`, pt-BR, sem cadastro); **FSO** 2.11–2.17 (pt-BR) |
| `debugging` (1) | **fCC** Depure o modificador de cor (pt-BR, sem cadastro) |
| `web-accessibility-basics` (1) | **fCC** Depure um formulário de doação (pt-BR, sem cadastro); **MDN** Accessibility troubleshooting |
| `dom-and-browser` (1) | **Odin** Etch-a-Sketch; **MDN** Image gallery |
| `command-line-basics` (1) | **MDN** Package management basics; **fCC** boilerplate só no terminal |

Os demais candidatos (testes, CSS, HTML, deploy, algoritmos) reforçam competências que já têm
prática. Estão no JSON.

**Tech Guide.**
- Cobre 20 das 25 competências.
- Traz 194 links externos ligados a elas; só 4 já estão no catálogo.
- A qualidade varia muito:
  - bons: MDN em pt-BR, Rafaella Ballerini, Dev Soutinho, Dangit Git, Visualizing Git;
  - fracos: Medium aleatório e o `acervolima.com`, que é tradução raspada de outro site.
- Serve melhor como **checklist de objetivos em pt-BR** e como segunda referência de nível e
  ordem (Jr, Pleno, aprofundamento) do que como fonte de links.

## 7. Decisões tomadas (2026-10-15)

O Enzo aprovou as cinco recomendações. Ficou assim:

1. **Competência nova `ui-components-and-state`**, "Interface com componentes".
   - Agnóstica de framework, com React como selo.
   - Fontes: CS2023 SPD, react.dev e SFIA PROG.
   - Pré-requisitos: `javascript-essentials` L2 e `dom-and-browser` L1.
   - Na trilha: nível "Construir e publicar", logo depois de consumo de API. No track geral é
     de apoio, com alvo L1. Na ênfase em frontend vira central, com alvo L2; na ênfase em
     backend, opcional.
   - Entrou na avaliação de 6 perguntas em 2026-10-16, na frase maior de JavaScript, quando a
     regra das frases passou a aceitar frase no mesmo nível que afirma mais competências
     (`PLANO-FASE4.md` §6). Antes ficava sem pergunta e começava em "ainda não".
2. **Critérios acrescentados no fim de cada lista**, para não deslocar o que as pessoas já
   marcaram, que é guardado por posição:
   - CSS (cascata no inspetor; o nome passou a "CSS: estilo e layout");
   - legibilidade (linter e formatador);
   - construção de API (consulta parametrizada);
   - consumo de API (CORS);
   - JavaScript (módulos);
   - leitura de documentação (inglês);
   - comunicação técnica (apresentar um projeto);
   - code review (verificação automática do PR).

   O npm já estava coberto em linha de comando ("instalo dependências e subo o projeto").
3. **Lote de recursos, cada um conferido de novo:**
   - 14 práticas: 6 do Full Stack Open, 5 do freeCodeCamp, 2 do Odin e 1 do MDN;
   - 3 leituras: "Pensando em React", "Gerenciando o Estado" e npm no MDN;
   - 1 missão nossa para IA, a função de preço em reais, que usa a armadilha real do espaço
     não separável do `Intl.NumberFormat`;
   - o recurso do Full Stack Open corrigido: parte 13 só em inglês, ~90 h, tradução
     desatualizada.

   O catálogo foi de 137 para 155 recursos. `relational-data-modeling` e
   `ai-assisted-development-basics` deixam de ter zero prática.
4. **A estrada foi para a `/trilha`** (ADR-0011). Depois do espécime, o Enzo pediu para fechar
   os pontos em aberto com as escolhas recomendadas. Voltar atrás é trocar só o componente: os
   dados são os mesmos.
5. **Autenticação passou de opcional a apoio** no track geral, e a **central na ênfase em
   backend**.
