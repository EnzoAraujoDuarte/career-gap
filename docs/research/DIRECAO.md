# Career Gap — Pesquisa de direção (resposta ao feedback de 2026-09-11)

Feedback que originou esta pesquisa:

> "Gostei do visual, mas sinto falta de direcionamento. No formato atual seria mais útil
> copiar o roadmap.sh — e não é isso que quero sentir. O uso será por brasileiros, devemos
> citar linguagens e frameworks sim, a ideia é parecida com roadmap.sh porém personalizada,
> trazendo skills, links de vídeos, pessoas para acompanhar, indicação de livros."

**Status:** 5 de 8 lentes de pesquisa concluídas. Faltam `roadmapsh`, `br-creators` e
`canonical-en-resources`, além da verificação adversarial de pessoas/recursos, da síntese
final e da crítica — interrompidas por limite de sessão. **Nenhum nome de pessoa, canal ou
vídeo abaixo foi verificado ainda; nada disso pode ir para o catálogo antes de passar pela
verificação.**

---

## 1. Diagnóstico

O canvas entrega **mapa**, não **caminho**. São coisas diferentes e o produto precisa das duas.

O sintoma tem precedente documentado: o Duolingo abandonou a árvore de habilidades por um
caminho linear único em 2022 porque os aprendizes "não sabiam se estavam usando do jeito
certo". O Odin Project escreve **"DO NOT SKIP ANYTHING!"** em caixa alta na primeira lição.

O `NOT NOW` já entrega metade da diretividade — a metade negativa, o que ignorar. Falta a
metade positiva: *faça isto, nesta ordem, e saberá que terminou quando X*.

Não é caso de copiar o roadmap.sh. É caso de somar ao mapa aquilo que o roadmap.sh não tem.

---

## 2. As quatro correções

### 2.1 Ficha do nó (template de lição)

O Odin usa um template fixo e reaproveitável: *Introduction → Lesson overview → Assignment →
Knowledge check*. O `Assignment` é uma lista **ordenada** com verbos de ação apontando para
recursos externos nomeados: "Leia X", "Assista Y", "Faça Z".

Hoje o painel de detalhe do Career Gap responde "por quê". Precisa responder também "o quê,
em que ordem, e como sei que acabei". O critério de saída já existe no domínio — são as
frases `can_do` e os `exit_criteria` de cada nível. Falta exibi-los como checklist.

### 2.2 Tecnologia como selo, não como nó

O Odin nomeia React, NodeJS, Express e PostgreSQL nos títulos dos cursos — mas só depois dos
fundamentos, e sempre como *curso*, nunca como *habilidade*.

Isso resolve o pedido de "citar linguagens e frameworks" sem quebrar o motor
capability-first: o nó continua sendo `api-development`, e exibe **"Construção de API — com
Node + Express"** porque é isso que os recursos ligados a ele usam. A tecnologia vem dos
recursos, não do catálogo de competências.

### 2.3 Um passo dominante, não dez iguais

A sobrecarga de escolha é real mas **condicional** (Scheibehenne et al. 2010 encontra efeito
médio ~zero). Os moderadores em que ela aparece são exatamente a condição do nosso usuário:
preferência não formada, baixa expertise para comparar, tarefa difícil. Somado à lei de Hick
(tempo de decisão cresce com o número de alternativas equiprováveis) e ao limite de ~4 chunks
de memória de trabalho (Cowan 2001 — **não** usar "7±2", que é mal citado):

- no máximo 3 ações ativas simultâneas;
- 1–3 recursos por competência, com um marcado como *recomendado*;
- os demais nós do canvas atenuados, não com o mesmo peso visual do foco.

### 2.4 Projeto como marco, com escopo fechado

Ritmo do Odin: ~1 projeto a cada 3–5 lições — e aprendizes ainda acham espaçado demais.
Quincy Larson (freeCodeCamp) resume a pedagogia diretiva em uma regra: *"Always have a
project"*.

Regra editorial candidata: **nenhum trecho do roadmap com mais de ~4 itens de leitura/vídeo
sem um item "faça"**.

Ressalva importante: instrução com orientação mínima é menos eficaz para novatos (Kirschner,
Sweller & Clark 2006; contestado por Hmelo-Silver 2007). "Construa um app" não é item de
roadmap. Um projeto só é defensável com escopo fechado, lista de requisitos, checklist de
saída e pré-requisitos satisfeitos.

---

## 3. Pessoas: entram via artefato, nunca como "siga fulano"

Evidência convergente de três frentes:

- Ranquear pessoas por popularidade amplifica quem já é popular e reduz representação de
  minorias no topo. **Popularidade só pode ser critério de desempate, nunca de entrada.**
- Listas curadas maduras (awesome-lists, roadmap.sh) **não têm o tipo "pessoa"**: pessoas
  aparecem como autoras de artefatos tipados (vídeo, curso, livro).
- Relação parassocial com educadores do YouTube correlaciona-se fracamente com motivação e
  **não** com ganho de aprendizagem.
- Efeito de reversão de expertise (Kalyuga): boa parte do conteúdo das grandes figuras
  internacionais é L2+. Fowler, Beck e Osmani só devem aparecer quando o usuário chega em L2;
  antes disso caem em `NOT NOW` com motivo explicável.

Modelagem decorrente: `person` ligada a `resource` (autoria), `resource` ligado a
`competency` + `level`. No painel: **"Quem ensina isso bem"** com uma linha de evidência
(obra, docência) e o artefato concreto — nunca um bloco solto de "pessoas interessantes".

Contrapartida que sustenta o seu pedido: sentimento de pertencimento se relaciona com
resultados em computação, e modelos de referência funcionam por *atingibilidade*, não por
fama. Pessoas brasileiras *near-peer* (quem migrou de carreira, veio de bootcamp, é
autodidata) têm valor real — mas como experiência vicária, em camada separada, fora do
cálculo de prioridade.

---

## 4. Fatos brasileiros que mudam o plano

Levantados na lente `br-books-courses`. **Ainda não verificados um a um.**

| Achado | Consequência |
|---|---|
| Git é a competência mais bem servida em pt-BR gratuito (Pro Git pt-BR, Learn Git Branching, Oh Shit Git) | `version-control-git` L0→L2 pode ser 100% pt-BR e grátis |
| Full Stack Open (Helsinque) tem partes 0–5 em pt-BR | Única fonte estruturada e gratuita em português para API REST com Node/Express, testes e autenticação por token |
| Curso em Vídeo é o único conjunto gratuito e completo em pt-BR cobrindo HTML/CSS, JS, Git, MySQL e lógica | Coluna vertebral de L0–L1; certificado é pago — o schema precisa separar custo do conteúdo do custo do certificado |
| Tradução pt do javascript.info está em 38% e **não tem site publicado** | Catalogar em inglês; não linkar `pt.javascript.info` |
| Origamid **não tem mais** cursos gratuitos | Não anunciar como fonte gratuita |
| Casa do Código: títulos para iniciante são majoritariamente 2012–2017 | Schema precisa de `ano_publicacao`/`ano_atualizacao`; HTML/CSS de 2012 é pré-flexbox na prática |
| Das traduções de clássicos, só *Entendendo Algoritmos* é adequado a iniciante; *Código Limpo* parcial (caps. 1–4); *Arquitetura Limpa* é NOT NOW | Recursos precisam de mapeamento **por capítulo**, não por livro |
| CC50 (Fundação Estudar) é o caminho pt-BR legítimo para CS50, licenciado pela Harvard | Linkar a página da Estudar, não vídeos; avisar que começa em C |
| web.dev "Aprenda CSS" está inteiro em pt-BR sob CC BY 4.0 | Melhor recurso pt-BR permissivo para `css-layout` |
| Tech Guide (Alura/PM3/FIAP) é o análogo brasileiro do roadmap.sh | Citar como trabalho relacionado no TCC; verificar licença antes de qualquer reuso |

Campos novos que o schema de recurso precisa: `published_at`, `last_verified_at`,
`translation_status` (completa/parcial/comunidade), `requires_signup`, `formato_pedagogico`
(worked-example / tutorial guiado / exercício / referência / projeto), `content_type`
(aula / referência / opinião / reação) e custo do conteúdo separado do custo do certificado.

---

## 5. Escolha de stack

Nenhuma pesquisa global (Stack Overflow, JetBrains) publica recorte Brasil. A evidência
brasileira precisa vir de mineração de vagas nacionais e de pesquisas com devs daqui — e o
TCC deve declarar essa triangulação na metodologia.

- **Maior mineração recente** (19.655 anúncios deduplicados, abr–jun 2025): Python, SQL,
  JavaScript e Java como mais citadas; AWS/Azure, CI/CD, Git e ágil muito frequentes.
- **Lado da oferta** (devs brasileiros empregados): Java e C# lideram; Spring Boot e .NET à
  frente de React. O mercado formal brasileiro é mais enterprise do que os repositórios de
  vagas sugerem.
- **Vagas de entrada** nos repositórios comunitários: JS/TS + React + Node domina, mas vagas
  de entrada são só 8–12% do total.
- **Inglês não é barreira declarada**: aparece em 6,6%–25% das vagas de entrada; "avançado"
  em menos de 4%. Não criar competência "inglês" — é atributo de recurso e sub-habilidade de
  `reading-documentation`.

**Conclusão:** SQL, Git, HTTP/API e testes acima de "mais um framework" — o que o ranking
atual já faz. E uma escolha de stack **JS-only seria um erro** para o mercado brasileiro:
Java+Spring e C#+.NET cobrem a massa de vagas CLT que absorve estagiário.

A escolha de stack deve apenas **filtrar a tag de tecnologia dos recursos**, nunca alterar o
catálogo de competências. E deve ser adiada: o Odin só pergunta depois dos fundamentos, com a
mensagem "não importa tanto, só não troque no meio".

---

## 6. Criadores brasileiros — mapeamento verificado (2026-09-11)

Lente executada em 4 fatias com verificação adversarial independente de cada artefato.
**56 artefatos aprovados, 8 reprovados na verificação, 38 selecionados** para o catálogo
(teto de 2 por competência). Dados completos em `docs/research/recursos-br-verificados.json`.

### 6.1 A verificação se pagou

Casos que passariam despercebidos em curadoria manual:

- **Erro de atribuição:** a playlist "Curso de Django API REST" atribuída a Otávio Miranda
  pertence ao canal *UB Social*, um agregador de conteúdo de terceiros. Mesmo caso com o
  "Curso COMPLETO de QA" atribuído a Julio de Lima — é do canal *Aprendendo a Fazer TI*.
- **Canal inexistente:** `@CodigoFrontendBR`, citado como fonte de um vídeo sobre debugger do
  VSCode, não aparece em nenhuma busca.
- **Competência corrigida:** o Akitando #94 havia sido mapeado como `problem-decomposition`
  L1; o conteúdo real é segmentação de memória, listas encadeadas, hash e Big O — é
  `algorithms-and-complexity` L2. Estava três níveis fora do público.
- **Armadilha de licença:** o livro de estruturas de dados da Loiane Groner é pago (Novatec)
  e **todas** as cópias que aparecem em busca são PDFs piratas.
- **Título não é data:** "Curso Lógica de Programação **2026**" foi publicado em ago/2025 —
  o ano no título é marketing. O campo `published_at` precisa vir da página, nunca do título.
- **Canal inativo:** Dica do Nerd parou em 03/2023 com o curso interrompido na aula 31.

### 6.2 Competências bem servidas em pt-BR gratuito

`html-semantics` (única com folga real), `css-layout`, `programming-fundamentals`,
`version-control-git`, `sql-basics`, `relational-data-modeling`, `api-development`,
`build-an-application`.

### 6.3 As lacunas — e o problema que elas criam

| Competência | Situação |
|---|---|
| **`http-fundamentals`** | Nenhum artefato **de criador brasileiro**. Ver §8: a documentação da MDN cobre a competência em pt-BR — a lacuna era de *aula*, não de material |
| `technical-communication` | Nenhuma *aula* em pt-BR; só comunidades (TabNews, frontendbr) |
| `reading-documentation` | Nenhuma aula pt-BR sobre como ler e usar documentação oficial |
| `deployment-basics` | Quase órfã: um único artefato, acima do nível do primeiro deploy |
| `authentication-basics` | Um único artefato, e é Java/Spring Security |
| `automated-testing-basics` | Há material, mas nos níveis errados — QA em L0 que não ensina a escrever teste, ou arquitetura em L2+ |
| `algorithms-and-complexity` | Os dois artefatos são L2 e em Java |
| `web-accessibility-basics` | O bom conteúdo (NVDA, WAI-ARIA) está atrás de assinatura |

**A tensão central:** as maiores lacunas de criador brasileiro caem exatamente sobre
competências que o motor ranqueia alto. No perfil-fixture `self-taught-frontend`, o FOCO
AGORA calculado é `http-fundamentals`. (A §8 corrige parte desta conclusão: há documentação
canônica em pt-BR; o que não existe é aula em vídeo brasileira.)

Isso não invalida o ranking; ele está certo. Mas obriga uma decisão de produto: o Career Gap
**vai recomendar recurso em inglês quando não houver pt-BR adequado**, com aviso explícito
de idioma. Barreira de idioma é real (pesquisa com 840 respondentes de 86 países confirma
que falantes não nativos enfrentam dificuldade com material instrucional e documentação),
mas recomendar um recurso ruim em português é pior que um bom em inglês com aviso. Isso
reforça `reading-documentation` como competência — ler doc em inglês é parte do trabalho.

### 6.4 Padrões de descarte

O filtro "só aula, nunca opinião" removeu grande parte do conteúdo brasileiro mais popular:
Lucas Montano, Attekita Dev, Código Fonte TV e o **canal do Akita no YouTube** (que, além
disso, está sem upload desde 16/03/2024 — o material vivo dele é o site próprio).

O filtro "artefato gratuito comprovado" removeu curso.dev do Filipe Deschamps (R$ 2.700),
Origamid, Balta.io, B7Web, Full Cycle, Dev Eficiente e os cursos do Rodrigo Branas — todos
cobrem competências que precisamos, todos atrás de pagamento.

Nenhum desses descartes é juízo de qualidade. São consequência das regras de curadoria, e é
isso que as torna defensáveis na banca.

---

## 7. O que ainda falta

1. **Lente `canonical-en-resources`** — recursos canônicos internacionais por competência.
   Ficou mais importante do que parecia: é o que vai tapar as 9 lacunas da seção 6.3.
2. **Lente `roadmapsh`** — anatomia detalhada (parcialmente coberta por `directive-products`).
3. **Livros e cursos da seção 4** — levantados, ainda não submetidos à verificação adversarial.

Regra que permanece: **nada entra no catálogo sem verificação.**


---

## 8. Recursos canônicos internacionais (2026-09-11)

Lente executada para tapar as nove lacunas. **57 recursos verificados**, dados completos em
`docs/research/recursos-canonicos-verificados.json`. A verificação não reprovou nenhum — o que
é esperado para MDN, W3C e Google, que não somem — mas **corrigiu onze afirmações**, e é aí
que estava o valor.

### 8.1 Correção de uma conclusão minha

Eu afirmei na §6 que `http-fundamentals` tinha **zero** recursos em português. Estava errado.

A lente de criadores brasileiros procurou *canais e vídeos*, e nenhum ensina HTTP como
competência própria. Mas a MDN tem "Uma visão geral do HTTP", "Códigos de status" e "Métodos
de requisição" **integralmente em pt-BR**, sob CC BY-SA, e o howhttps.works tem os cinco
episódios em quadrinhos traduzidos.

A lacuna real é outra, e mais específica: **não falta material, falta aula**. Para quem
aprende por vídeo — a maioria do nosso público — documentação de referência não substitui uma
explicação conduzida. E o material existe mas não é encontrado: é um problema de **descoberta**,
que é exatamente o que um catálogo curado resolve. Isso fortalece o produto em vez de
enfraquecê-lo.

### 8.2 As onze correções de tradução

Nenhuma teria sido pega sem abrir a página em português. As mais graves:

| Recurso | Alegado | Real |
|---|---|---|
| **Jest** "Getting Started" | parcial (~60–70%) | **none** — só o chrome do site é traduzido; o corpo abre em inglês. As frases citadas no mapeamento não existem na página |
| **MIT Missing Semester** "Shell Tools" | completo | **none** — só título e navegação; o corpo é inteiro em inglês |
| **MIT Missing Semester** "The Shell" | completo | **parcial** — tradução abandonada na metade, e os 11 exercícios estão em inglês |
| **Harvard CS50x** | parcial | **none** — legenda automática de YouTube **não é** tradução do recurso |
| **Refactoring.Guru** "Code Smells" | completo | **parcial** — só os cabeçalhos; o corpo explicativo é inglês |
| **web.dev** "Aprenda CSS" | parcial | **completo** — índice e corpo do Flexbox integralmente em português |
| **GitHub Copilot docs** | none | **completo** — a rota `/pt/` entrega tudo traduzido |
| **Eloquent JavaScript** (BrazilJS) | 2ª edição, duas atrás | **4ª edição completa** — mas o README declara tradução assistida por IA, não endossada pelo autor |
| **Oh Shit, Git!?!** | pt-BR retorna 404 | a URL é *case-sensitive*: `/pt_BR` funciona |

Dois padrões que viram regra de catálogo:

1. **Legenda de vídeo não é tradução.** Marcar CS50 como "tem pt-BR" por causa de legenda
   automática enganaria o usuário sobre problem sets e textos, que são 100% inglês.
2. **Interface traduzida não é conteúdo traduzido.** Jest, Missing Semester e o curso do
   Google traduzem o menu e mantêm o corpo em inglês. O campo `pt_br_status` precisa medir o
   **corpo do conteúdo**, nunca a navegação.

### 8.3 As nove lacunas, uma a uma

Todas ficaram cobertas, com riscos residuais desiguais:

- **Cobertura em pt-BR sólida:** `http-fundamentals`, `technical-communication` (Simon Tatham
  "Como Relatar Bugs De Maneira Eficaz" + Conventional Commits), `deployment-basics` (MDN
  "Publicando seu site" + GitHub Pages + 12factor) — este último **só para site estático**;
  deploy de aplicação com banco e variáveis de ambiente existe apenas em inglês.
- **Degrau íngreme** — porta de entrada em português, segundo passo já em inglês:
  `web-accessibility-basics` (W3C WAI traduzido → web.dev só inglês),
  `authentication-basics` (MDN "Autenticação HTTP" cobre Basic a fundo e deixa Bearer/JWT
  raso, que é justamente o que o aluno vai usar), `algorithms-and-complexity` (Khan Academy
  existe em pt-BR **e em JavaScript**, não em Java como supúnhamos).
- **Só inglês:** `automated-testing-basics` e `api-consumption`. No segundo, a ironia é
  precisa — a referência está traduzida, e o tutorial que *efetivamente ensina* fetch não: a
  rota pt-BR entrega a página legada "AJAX", sem os exemplos.
- **Pior caso:** `reading-documentation`. A rota pt-BR da aula da MDN retorna 404 confirmado.

### 8.4 Dois buracos que não existem em idioma nenhum

1. **`automated-testing-basics` em L0 estrito.** Todo recurso verificado pressupõe L1 (Node e
   npm instalados, JS básico). Não existe material canônico, em nenhum idioma, que leve de
   "nunca escrevi teste" a "teste rodando". A cobertura atual é montagem de três peças.
2. **`algorithms-and-complexity` com prática avaliada, gratuita e sem cadastro em L0/L1.**
   Khan cobre a teoria, VisuAlgo visualiza, Big-O serve de consulta — falta o artefato
   `PROVE`. LeetCode é L2+ e parcialmente pago.

São candidatos a conteúdo próprio do Career Gap: os únicos pontos onde curadoria não basta.

### 8.5 Descartes que valem registro

- **Julia Evans**: os zines de HTTP e debugging são pagos (US$ 12). Entrou o post gratuito.
- **RFC 9110 e WCAG 2.2 Quick Reference**: normativos, escritos para implementadores. L3+ na
  prática — recomendá-los a quem está em L0/L1 produz reversão de expertise.
- **"How To Ask Questions The Smart Way"** (Eric S. Raymond): descartado por **tom hostil com
  iniciantes**. Para estudante brasileiro buscando a primeira vaga, o custo afetivo supera o
  ganho. O texto do Simon Tatham cobre a mesma competência sem humilhar quem pergunta.
- **Traduções brasileiras do CSS-Tricks e de outros guias**: republicações de terceiros sem
  autorização. Só a página do detentor entra.
- **Cursos de "vibe coding"**: sem detentor identificável e com incentivo oposto ao da
  competência, que é conferir e entender o código gerado.
