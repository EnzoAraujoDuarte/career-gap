# Benchmark — board "ROADMAP - Unlock." (Miro) vs. catálogo Career Gap

Análise feita em 2026-09-16 sobre o board compartilhado pelo Enzo. O board é material de
curso de terceiro, provavelmente de Renato Augusto (um dos links aponta para
`github.com/RenatoAugustoFS/ddd-starter-modelling-process`).

**Regra de uso:** serve como *referência e comparação*. Nada de conteúdo, estrutura ou
curadoria pode ser copiado — mesma restrição já registrada para o roadmap.sh.

---

## 1. Por que a comparação precisa ser recortada

O board cobre `Largada → Júnior → Pleno/Sênior → Arquiteto de Software → Arquiteto de
Soluções`. A maior parte do volume dele — SOLID, Design Patterns, Object Calisthenics, DDD,
EventStorming, CQRS, CAP, sharding, chaos engineering, certificações AWS — está acima do
nosso público por decisão do orientador.

Comparar o catálogo inteiro contra o board inteiro produziria uma lista de "faltas" que é, na
verdade, o escopo que foi deliberadamente cortado. **A comparação útil é só contra Largada +
Júnior**, mais os itens de Pleno que um júnior encontra na prática.

---

## 2. Lacunas reais no nosso catálogo

### Camada 1 — entram, são claramente de entrada

**1. Como a web chega até o navegador.** O board dedica dez artigos a DNS, domínio, URL,
cliente-servidor, servidor web vs. servidor de aplicação, e "qual a diferença entre página,
site, servidor e buscador". Nosso `http-fundamentals` começa na requisição e na resposta —
pula tudo que vem antes. É o modelo mental que falta para "o que acontece quando eu digito
uma URL", que é a pergunta de entrevista júnior mais comum que existe.
*Proposta:* estender `http-fundamentals` com um nível L1 sobre o caminho da requisição, em vez
de criar competência nova. Recursos MDN pt-BR já existem para todos esses artigos.

**2. CORS.** Não está em lugar nenhum do nosso catálogo. É a parede em que todo iniciante
bate na primeira vez que consome uma API a partir do navegador, e o erro no console não
explica nada. Pertence a `api-consumption`.

**3. Cookies, sessão e estado no navegador.** Ausente. Conecta `dom-and-browser` a
`authentication-basics`, e hoje há um vão entre os dois: o usuário aprende a fazer login sem
entender onde a sessão vive.

### Camada 2 — avaliar, defensáveis mas discutíveis

**4. Transações e índices (noção).** Nossas competências de dados param em modelagem e JOIN.
O board trata ACID, transação e índice como conteúdo de júnior. "O que é uma transação" e
"por que existe índice" são razoáveis para a primeira vaga de back-end — no nível de
reconhecer, não de otimizar.

**5. Integração contínua.** `deployment-basics` cobre publicar, não cobre pipeline. Rodar
teste automático a cada push virou padrão mesmo em projeto de portfólio, e liga
`automated-testing-basics` a `deployment-basics`, que hoje não se falam.

**6. Paginação de API e noção de NoSQL.** Menor prioridade. Paginação cabe em
`api-development` L2; NoSQL cabe como item de horizonte (`NÃO AGORA`), não como competência.

### Camada 3 — confirmam o corte, não entram

SOLID, Design Patterns, Object Calisthenics, DDD, EventStorming, CQRS, CAP, ACID vs BASE,
sharding, replicação, circuit breaker, chaos engineering, tracing distribuído, certificações
AWS. É o grosso do board e é exatamente o escopo que o orientador mandou reduzir. Vários já
estão no nosso `horizon` alimentando o `NÃO AGORA`.

---

## 3. A lacuna inversa: o que temos e o board não tem

Oito das nossas 25 competências não existem no board, em nenhum nível:

| Competência | Observação |
|---|---|
| `debugging` | **A ausência mais grave.** O board não tem uma linha sobre depuração — que é a atividade diária de qualquer pessoa júnior |
| `problem-decomposition` | Nenhum conteúdo sobre transformar pedido vago em passos |
| `reading-documentation` | Nada sobre aprender a se virar na fonte oficial |
| `technical-communication` | Nada sobre escrever README, pedir ajuda, explicar decisão |
| `code-review-participation` | Nada sobre ler diff, comentar, receber crítica |
| `web-accessibility-basics` | Nenhum conteúdo — e no Brasil isso é exigência legal, não preferência |
| `ai-assisted-development-basics` | Nenhum conteúdo |
| `build-an-application` como marco | Há cursos que constroem, mas não há o marco explícito |

Isso não é descuido do autor. É a diferença entre **lista de tópicos** e **modelo de
capacidade**: o board responde "o que estudar", o nosso responde "o que você consegue fazer".
Tópico se consome; capacidade se demonstra. É o argumento central do TCC, e o benchmark o
sustenta melhor do que qualquer texto que escrevêssemos.

---

## 4. Recursos: 13 de 24 temas já cobertos

Dos temas de nível de entrada que o board lista, **11 não têm recurso equivalente no nosso
catálogo**: cookies, HTTP caching, DNS/como a internet funciona, o que é uma URL,
cliente-servidor, servidor web, CORS, ACID/transações, CI-CD/GitHub Actions, paginação de API
e NoSQL.

Quase todos são páginas da MDN em pt-BR — a mesma fonte que nossa curadoria já elegeu como
prioritária. Ou seja: **não é preciso curadoria nova, é preciso cobertura**. São links da
mesma família dos que já temos, e a maioria tem tradução completa verificada.

Conclusão sobre curadoria: a sobreposição alta valida nossa seleção. Onde o board tem mais
profundidade é justamente onde ele mira num público mais avançado.

---

## 5. Recomendação

**Fazer agora, é barato:** estender `http-fundamentals` com o caminho da requisição; criar
critério de saída para CORS em `api-consumption`; cobrir cookies/sessão entre `dom-and-browser`
e `authentication-basics`. Os três são extensões de competências existentes, não competências
novas — o catálogo continua com 25, e nenhuma aresta de pré-requisito muda.

**Decidir depois:** transações/índices e integração contínua. Ambos ampliam o alvo do track e
mereceriam fonte de mercado antes de entrar.

**Não fazer:** importar a espinha do board. Ela é o roadmap estático, igual para todos, que o
Career Gap existe para superar — e, na prática, é a nossa condição A do experimento, com
produção melhor.
