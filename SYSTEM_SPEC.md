# Career Gap — Especificação Ampla do Sistema

## 1. Visão do produto

Career Gap é uma plataforma de orientação de carreira para pessoas que desejam iniciar ou evoluir profissionalmente em desenvolvimento, engenharia e arquitetura de software.

A proposta central é responder de forma prática a três perguntas:

1. Onde o usuário está hoje?
2. Onde ele quer chegar?
3. Qual é o melhor caminho, em ordem de prioridade, para reduzir a distância entre esses dois pontos?

O Career Gap não deve ser apenas um catálogo de cursos, uma lista de tecnologias ou um gerador genérico de roadmaps por IA. O sistema deve construir um modelo do estado atual do usuário, relacioná-lo a um objetivo profissional e produzir uma sequência recomendada de aprendizado, prática e experiências.

Princípio do produto:

> O Career Gap não mostra tudo o que você poderia aprender. Ele ajuda a decidir o que faz mais sentido aprender e praticar agora.

Fluxo conceitual:

**Entender → Comparar → Identificar gaps → Priorizar → Aprender/Praticar → Demonstrar → Reavaliar**

---

## 2. Público amplo da visão de longo prazo

A visão completa do produto pode atender pessoas em diferentes momentos da carreira de software, incluindo:

- pessoa começando do zero;
- estudante buscando o primeiro estágio;
- pessoa buscando a primeira vaga como desenvolvedor;
- desenvolvedor júnior buscando evolução;
- júnior → pleno;
- pleno → sênior;
- sênior → Tech Lead;
- evolução para Staff/Principal, futuramente;
- evolução para arquitetura de software;
- especialização técnica;
- mudança entre Frontend, Backend, Full Stack, Mobile, DevOps/Platform, Data Engineering e AI Engineering;
- profissional técnico interessado em consultoria ou prestação de serviços.

O escopo do TCC não implementará todos esses caminhos. Esta seção representa a visão de produto, não o MVP acadêmico atual.

---

## 3. Promessas principais

### 3.1 Entender

Construir uma visão estruturada de onde o usuário realmente está, sem depender apenas de títulos como “júnior”, “pleno” ou “sênior”.

### 3.2 Decidir

Identificar as lacunas mais importantes em relação ao objetivo e decidir qual delas deve receber atenção primeiro.

### 3.3 Guiar

Transformar a lacuna em ações concretas: o que estudar, o que praticar, o que construir, quais experiências buscar, quais livros/conteúdos consultar e quais assuntos ainda não devem ser prioridade.

---

## 4. O que o sistema personaliza

A personalização real do Career Gap está concentrada em:

- entender o estado atual do usuário;
- entender o objetivo profissional;
- estimar competências atuais;
- identificar gaps;
- priorizar gaps;
- escolher o próximo passo;
- montar o caminho entre estado atual e objetivo;
- recomendar conteúdos, livros, práticas e desafios adequados ao gap;
- recalcular o caminho quando houver nova avaliação.

Essa é a inteligência central do produto.

---

## 5. O que NÃO será analisado individualmente

A visão anterior considerava análise personalizada de CV, LinkedIn e GitHub. Isso não faz mais parte da proposta.

Career Gap **não deve**:

- analisar o currículo pessoal do usuário;
- acessar ou pontuar seu LinkedIn;
- fazer auditoria profunda de seu GitHub;
- reescrever automaticamente esses perfis com base em dados privados;
- afirmar competência apenas pela presença de um repositório ou palavra-chave.

No lugar disso, o produto poderá fornecer **bons exemplos e orientação geral**.

Exemplos:

### Currículo

- estrutura recomendada para currículo de estágio;
- estrutura recomendada para desenvolvedor com experiência;
- exemplos de como descrever um projeto;
- exemplos de como comunicar impacto;
- erros comuns;
- checklist antes de enviar uma candidatura.

### LinkedIn

- exemplos de headline;
- exemplos de seção “Sobre”;
- boas práticas para apresentar projetos e experiências;
- checklist de perfil profissional.

### GitHub

- exemplos de README bem estruturado;
- organização de projetos;
- boas práticas de documentação;
- o que um projeto de portfólio deveria demonstrar;
- exemplos de tipos de projetos relevantes para determinados objetivos.

Essas áreas funcionam como **guias**, não como motores de análise individual.

---

## 6. Modelo do desenvolvedor / usuário

O sistema deve representar o usuário por dimensões, e não apenas por cargo.

Dimensões possíveis:

### Experiência

- experiência profissional;
- experiência acadêmica;
- projetos pessoais;
- responsabilidades já assumidas;
- contato com sistemas reais;
- trabalho em equipe.

### Conhecimento técnico

- fundamentos de programação;
- linguagens;
- frontend;
- backend;
- bancos de dados;
- APIs;
- Git;
- infraestrutura;
- cloud;
- segurança;
- performance.

### Engenharia de software

- testes;
- debugging;
- refatoração;
- qualidade de código;
- modularidade;
- design de software;
- arquitetura;
- observabilidade;
- confiabilidade;
- system design.

### Competências profissionais

- comunicação;
- autonomia;
- colaboração;
- code review;
- documentação;
- tomada de decisão;
- liderança técnica;
- visão de produto.

### Desenvolvimento assistido por IA

- uso básico de assistentes;
- prompting/contexto;
- context engineering;
- planejamento com IA;
- agentic coding;
- SDD;
- MCP;
- Agent Skills;
- memória para agentes;
- geração de testes;
- code review assistido;
- verificação de código gerado;
- evals e loops de validação.

---

## 7. Níveis de competência

Evitar porcentagens arbitrárias como “72% em arquitetura”.

O sistema deve trabalhar com níveis baseados em capacidade demonstrável. Modelo inicial possível:

- **L0 — Awareness:** reconhece conceitos e entende sua finalidade.
- **L1 — Guided Application:** consegue aplicar com orientação.
- **L2 — Independent Application:** consegue aplicar de forma independente em situações comuns.
- **L3 — System Thinking:** toma decisões considerando sistema, contexto e trade-offs.
- **L4 — Organizational/Leadership:** influencia decisões, padrões e outras pessoas.

Exemplo em testes:

- L0: entende por que testes existem;
- L1: escreve testes unitários simples;
- L2: escolhe e implementa testes unitários, integração e E2E adequadamente;
- L3: define estratégia de testes para sistemas e integrações;
- L4: influencia práticas de qualidade em equipes ou organizações.

Os níveis devem ser refinados com base em pesquisa e validação, não tratados como verdade absoluta.

---

## 8. Skill Graph

O Skill Graph representa conhecimentos e relações entre conhecimentos.

Ele responde:

> O que uma pessoa pode saber ou ser capaz de fazer e quais conceitos normalmente dependem de outros?

Exemplo simplificado:

```text
Programming Fundamentals
        ↓
Git + Software Construction
        ↓
Web / Backend / Frontend Fundamentals
        ↓
Testing + Debugging + Refactoring
        ↓
Software Design
        ↓
Architecture + Trade-offs
        ↓
Distributed Systems / Reliability / System Design
```

O grafo não deve representar uma única sequência universal. Algumas competências são paralelas, opcionais ou específicas de determinado objetivo.

Relações possíveis:

- prerequisite_of;
- related_to;
- specialization_of;
- unlocks;
- recommended_before.

---

## 9. Career Tracks

Career Tracks são diferentes do Skill Graph.

**Skill Graph:** quais competências existem e como se relacionam.

**Career Track:** quais competências são relevantes para determinado objetivo e em qual nível.

Exemplos de tracks futuros:

- First Internship;
- Junior Frontend;
- Junior Backend;
- Full Stack;
- Mid-level Developer;
- Senior Backend;
- Senior Frontend;
- Tech Lead;
- Software Architect;
- Mobile Developer;
- DevOps/Platform;
- AI Engineer;
- Consultant/Freelancer.

Exemplo conceitual de Senior Backend:

- Programming: alto;
- Backend: alto;
- Databases: intermediário/alto;
- Testing: alto;
- Architecture: intermediário/alto;
- Observability: intermediário/alto;
- Infrastructure: intermediário;
- Security: intermediário;
- Communication: intermediário/alto;
- Product Thinking: intermediário;
- Leadership: básico/intermediário.

Os valores definitivos devem vir de um framework de competências fundamentado e validado.

---

## 10. Identificação de gaps

Um gap é a diferença relevante entre a capacidade estimada do usuário e a capacidade esperada para seu objetivo.

O sistema deve evitar o raciocínio simplista:

> “Você não sabe Kubernetes, então aprenda Kubernetes.”

A ausência de uma habilidade só é importante se ela for relevante para o objetivo naquele momento.

Um gap deve considerar pelo menos:

- nível atual;
- nível desejado;
- importância para o objetivo;
- pré-requisitos;
- impacto profissional;
- confiança da avaliação;
- relevância atual;
- dependências com outros gaps.

---

## 11. Recommendation / Career Policy Engine

O Career Gap deve possuir regras de priorização próprias. A LLM não deve inventar a ordem inteira.

Modelo conceitual:

```text
Priority =
Gap Size
× Target Importance
× Prerequisite Importance
× Career Impact
× Relevance
× Assessment Uncertainty
```

Depois, aplicar penalidades ou regras para:

- especialização prematura;
- conhecimento de baixo impacto para o objetivo;
- complexidade desnecessária;
- ausência de fundamentos;
- tecnologias avançadas antes de pré-requisitos.

Exemplos de políticas:

- iniciante sem fundamentos não recebe microservices como prioridade;
- usuário buscando estágio não recebe Kubernetes como prioridade antes de Git, construção de aplicações e fundamentos;
- candidato a sênior com baixo domínio de testes recebe testes como prioridade relevante;
- pessoa querendo Tech Lead pode receber comunicação, decisões técnicas e mentoring acima de aprender outra linguagem.

O sistema deve ser capaz de explicar:

- Por que isso agora?
- O que isso desbloqueia?
- Por que X não é prioridade agora?

---

## 12. Next Best Action

Embora o usuário possa visualizar o roadmap completo, o sistema deve destacar uma ação principal.

Exemplo:

> **Seu foco agora: Testing Strategy**
>
> Por quê: seu objetivo exige capacidade de escolher e estruturar testes, mas sua avaliação atual mostra experiência apenas com testes unitários básicos.

Isso reduz sobrecarga e diferencia Career Gap de roadmaps que mostram centenas de tópicos simultaneamente.

---

## 13. Learn / Build / Experience / Prove

Roadmaps não devem ser apenas listas de conteúdos.

Cada competência pode gerar quatro tipos de ação.

### Learn

Aprender conceitos por livros, documentação, artigos, vídeos e cursos.

### Build

Aplicar o conhecimento em projetos, laboratórios ou exercícios.

### Experience

Buscar experiências que desenvolvam capacidade profissional, por exemplo:

- realizar code review;
- escrever ADR;
- investigar incidente;
- apresentar decisão técnica;
- mentorar colega;
- participar de definição arquitetural.

### Prove

Demonstrar entendimento por:

- desafio;
- avaliação;
- projeto;
- explicação de decisão;
- resolução de cenário.

---

## 14. Challenges

Desafios são importantes para reduzir dependência de autoavaliação.

Tipos possíveis:

- debugging;
- testing;
- code review;
- arquitetura;
- system design;
- performance;
- segurança;
- design de software;
- IA aplicada ao desenvolvimento.

Exemplo:

Um sistema apresenta aumento no p95/p99 de latência e possui uma integração externa lenta. O usuário recebe métricas e deve explicar onde investigaria primeiro e por quê.

A avaliação pode observar raciocínio, hipóteses, trade-offs e capacidade de investigação.

---

## 15. Conteúdos e recursos

O Career Gap deve recomendar recursos **porque eles resolvem um gap**, não porque são populares.

Tipos:

- ARTICLE;
- BOOK;
- COURSE;
- VIDEO;
- DOCUMENTATION;
- REPOSITORY;
- PROJECT;
- TOOL;
- PERSON;
- CHALLENGE;
- SKILL.

Cada recurso deve poder ser relacionado a:

- skill;
- nível;
- objetivo;
- idioma;
- tipo;
- duração estimada;
- estabilidade do conhecimento;
- fonte.

Exemplos de categorias de conteúdo:

- fundamentos;
- algoritmos;
- Git;
- HTTP;
- SQL;
- React;
- Laravel;
- testes;
- arquitetura;
- system design;
- clean code;
- KISS/DRY/YAGNI;
- observabilidade;
- segurança;
- IA aplicada ao desenvolvimento.

Livros podem ter progresso de leitura, mas concluir um livro não deve automaticamente aumentar o nível de competência.

---

## 16. Conhecimento evergreen vs. conhecimento volátil

O sistema pode distinguir conhecimentos com diferentes níveis de estabilidade.

### Alta estabilidade

- estruturas de dados;
- algoritmos;
- HTTP;
- SQL;
- redes;
- sistemas operacionais;
- testes;
- coupling/cohesion;
- princípios de design;
- trade-offs arquiteturais.

### Média/baixa estabilidade

- versões de frameworks;
- bibliotecas específicas;
- ferramentas de IA;
- agentes;
- MCP tooling;
- frameworks recentes.

Isso ajuda a evitar roadmaps dominados por ferramentas temporárias.

---

## 17. AI-Native Developer

O Career Gap deve reconhecer que desenvolvimento moderno inclui colaboração com IA, mas não tratar IA como substituta dos fundamentos.

Princípio:

> Quanto maior a autonomia dada a um agente, maior deve ser a capacidade do desenvolvedor de avaliar e verificar o resultado.

Possível progressão:

- uso básico de assistente;
- prompts com contexto e restrições;
- decomposição de problemas;
- specification-driven development;
- agentic coding;
- context engineering;
- skills/tools/MCP;
- memória;
- verification loops;
- evals;
- desenho de ambientes de desenvolvimento assistidos por IA.

O sistema pode recomendar ferramentas e boas práticas quando forem relevantes, sem transformar “saber usar ferramenta X” em sinônimo de competência profissional.

---

## 18. Uso de Inteligência Artificial dentro do Career Gap

IA deve apoiar o sistema, não ser todo o sistema.

Usos adequados:

- interpretar respostas em linguagem natural;
- conduzir entrevista adaptativa;
- extrair sinais de experiência relatada;
- gerar perguntas de follow-up;
- avaliar respostas abertas contra rubricas;
- explicar gaps;
- explicar recomendações;
- adaptar linguagem ao nível do usuário;
- ajudar a gerar desafios controlados;
- resumir conteúdos e próximos passos.

Lógica que deve permanecer estruturada:

- taxonomia de skills;
- níveis;
- pré-requisitos;
- career tracks;
- relações;
- scoring;
- regras de prioridade;
- recursos aprovados;
- critérios de avaliação.

Se a LLM ficar indisponível, o domínio central ainda deve existir.

---

## 19. Onboarding adaptativo

Evitar formulário com dezenas de checkboxes.

Fluxo desejado:

1. perguntar objetivo;
2. perguntar experiência atual;
3. permitir resposta natural;
4. interpretar sinais;
5. fazer perguntas específicas;
6. apresentar perfil inferido;
7. usuário confirma/corrige;
8. gerar avaliação inicial.

Exemplo:

Usuário: “Faço projetos com React e Laravel e já publiquei algumas APIs.”

Sistema pode perguntar:

- Você já trabalhou com testes automatizados?
- Já precisou investigar um problema em produção?
- Como costuma decidir a estrutura de uma API?
- Já trabalhou com filas ou processamento assíncrono?

---

## 20. Market Signals — visão futura

O sistema poderá usar dados de vagas para entender frequência e relevância de competências.

Isso não significa copiar requisitos de vagas como verdade.

Market signals podem ajudar a responder:

- quais competências aparecem frequentemente para determinado objetivo;
- quais tecnologias estão crescendo ou diminuindo;
- quais conhecimentos são essenciais vs. especializações;
- quais gaps possuem maior impacto de empregabilidade.

Dados devem ter fonte e data. Nunca inventar percentuais.

---

## 21. Career Evidence / Skill Passport — visão futura

O sistema poderá apresentar um resumo das capacidades estimadas:

```text
Backend       L3
Frontend      L2
Testing       L2
Architecture  L1
AI-assisted   L3
```

Cada nível pode incluir confiança e origem da avaliação.

O objetivo não é criar uma certificação oficial, mas tornar o progresso mais compreensível.

---

## 22. Orientação para currículo, LinkedIn e GitHub

Essas funcionalidades são educativas e genéricas, não análises personalizadas.

Podem existir páginas como:

- “Como montar seu primeiro currículo de desenvolvimento”;
- “Como descrever projetos sem experiência profissional”;
- “Como organizar um GitHub para demonstrar conhecimento”;
- “Exemplo de README de projeto”;
- “Como estruturar seu LinkedIn para vagas de software”;
- “Checklist antes de se candidatar”.

O Career Gap pode recomendar esses guias quando fizer sentido no roadmap, por exemplo próximo da etapa de candidatura.

---

## 23. Track de consultoria — visão futura

Um profissional tecnicamente forte que deseja trabalhar como consultor pode não precisar aprender outra framework.

Roadmap possível:

```text
Technical Credibility
      ↓
Discovery
      ↓
Scoping
      ↓
Estimation / Pricing
      ↓
Proposal
      ↓
Client Communication
      ↓
Delivery
      ↓
Case Studies
      ↓
First Client
```

Competências incluem descoberta, negociação, estimativa, proposta, comunicação, contratos, manutenção e vendas.

Fora do escopo atual do TCC.

---

## 24. Interface e experiência visual

A identidade do Career Gap deve evitar dashboard SaaS genérico.

Referência conceitual: **fluxos e whiteboards semelhantes ao Excalidraw**, sem copiar sua interface.

O produto deve parecer um mapa de carreira desenhado e anotado por um mentor técnico.

Características:

- canvas amplo;
- pan e zoom;
- nós conectados;
- setas com aparência orgânica;
- agrupamentos;
- pequenas anotações;
- hierarquia clara;
- caminhos e bifurcações;
- sensação de whiteboard técnico;
- imperfeição visual controlada.

### Estados visuais

- Completed;
- Current;
- Next;
- Available;
- Blocked;
- Reassess;
- Not Now.

Anotações possíveis:

- YOU ARE HERE;
- NEXT;
- IMPORTANT;
- WHY?;
- NOT YET;
- THIS UNLOCKS...;

### Tipografia

Usar fonte de alta legibilidade para conteúdo principal.

Fonte manuscrita/hand-drawn deve ser usada seletivamente em:

- labels;
- títulos de nós;
- pequenas notas;
- setas/anotações.

Não usar tipografia manuscrita em grandes blocos de texto.

### Cores

Paleta deve lembrar whiteboard/papel, com semântica controlada:

- fundo off-white;
- texto quase preto;
- vermelho para gap crítico/bloqueio;
- azul para ação/recurso;
- verde para concluído/evidenciado;
- amarelo/laranja para atenção/reavaliação;
- cinzas para elementos secundários.

Evitar gradientes genéricos, excesso de cards arredondados e estética “AI SaaS”.

---

## 25. Overview Canvas

Tela principal do produto.

Deve responder visualmente:

- Onde estou?
- Para onde estou indo?
- Qual é o próximo passo?
- O que já completei?
- O que está bloqueado?
- O que não preciso estudar agora?

O usuário deve conseguir explorar o mapa sem perder a noção da prioridade atual.

---

## 26. Focus Mode

Ao abrir uma competência, mostrar detalhes como:

- nome;
- prioridade;
- nível atual;
- nível esperado;
- por que isso importa;
- por que agora;
- conceitos esperados;
- Learn;
- Build;
- Experience;
- Prove;
- conteúdos;
- livros;
- desafios;
- critérios de saída.

Exemplo:

```text
Architecture
Current: L1
Target: L2
Priority: High

WHY NOW?
Você já consegue construir aplicações, mas ainda demonstra pouca
capacidade de justificar limites, acoplamento e decisões estruturais.

LEARN
- coupling/cohesion
- boundaries
- modularity
- trade-offs

BUILD
- refatorar uma aplicação em módulos claros

PROVE
- resolver challenge
- escrever ADR
```

---

## 27. Not Now

Uma área importante do Career Gap deve mostrar explicitamente o que **não é prioridade**.

Exemplo para usuário buscando primeiro estágio:

```text
NOT NOW

Kubernetes
Microservices
Kafka
Rust
Advanced System Design

Reason:
Esses tópicos podem ser úteis no futuro, mas não resolvem os gaps
mais importantes para seu objetivo atual.
```

Isso ajuda a reduzir ansiedade e excesso de estudo sem direção.

---

## 28. Reassessment

O roadmap não deve ser estático.

Após desafios, conclusão de etapas ou mudança de objetivo:

1. atualizar evidências;
2. reestimar competências relevantes;
3. recalcular gaps;
4. recalcular prioridade;
5. escolher novo Next Best Action;
6. atualizar mapa.

---

## 29. Modelo de dados conceitual

Entidades possíveis:

- users;
- profiles;
- skills;
- skill_levels;
- skill_relations;
- career_tracks;
- career_track_skills;
- user_skills;
- assessments;
- assessment_answers;
- evidences;
- resources;
- skill_resources;
- challenges;
- challenge_skills;
- roadmaps;
- roadmap_items;
- recommendations;
- recommendation_reasons.

PostgreSQL é suficiente inicialmente. Não adicionar banco de grafos sem necessidade comprovada.

---

## 30. Princípios arquiteturais

- domínio de carreira separado da interface;
- regras de recomendação testáveis;
- IA atrás de uma interface/adaptador;
- dados estruturados antes de prompts gigantes;
- explicabilidade das recomendações;
- versionamento da taxonomia;
- possibilidade de revisão editorial;
- rastreabilidade de fontes;
- arquitetura simples antes de arquitetura distribuída;
- evitar microservices no início.

---

## 31. Princípios de produto

1. Direção é mais importante que quantidade.
2. Um próximo passo claro é melhor que 100 tópicos.
3. Personalização deve vir do estado atual + objetivo.
4. IA explica e interpreta; não inventa toda a carreira.
5. Competência não é sinônimo de tecnologia conhecida.
6. Conteúdo deve estar ligado a um gap.
7. Ler não significa dominar.
8. Framework não define senioridade.
9. Roadmap é vivo.
10. O usuário deve entender por que uma recomendação existe.

---

## 32. Visão de longo prazo

Career Gap pode evoluir de um TCC para uma plataforma maior com:

- novos Career Tracks;
- career ladder completa;
- market signals;
- biblioteca editorial de recursos;
- avaliações mais robustas;
- Skill Passport;
- compartilhamento de progresso;
- comunidades;
- mentoring;
- planos para equipes;
- recomendações por mercado/região;
- trilhas AI-native;
- guias de currículo/LinkedIn/GitHub;
- trilha de consultoria;
- comparação entre objetivos;
- histórico de evolução;
- **ecossistemas de mercado pouco cobertos por roadmaps convencionais**, com muita vaga e
  pouco material estruturado: desenvolvimento Shopify (themes e apps), SAP/ABAP (incluindo
  CDS Views, RAP, CAP, BTP, PI/CPI), Magento/Adobe Commerce, TOTVS (Protheus/ADVPL) e
  similares. Cada um entra como novo `ecosystem` com track e competências próprias; o
  modelo de domínio já comporta isso sem alteração (campo `ecosystem` no track, tecnologia
  como dimensão ortogonal à competência). É um diferencial de produto: onde o roadmap.sh
  não chega, mas o mercado brasileiro contrata.

Essas ideias não devem ampliar o MVP atual. Elas ficam documentadas para impedir que a visão do produto seja perdida ao reduzir o escopo acadêmico.
