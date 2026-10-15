# Career Gap — Escopo Inicial do Projeto e do TCC

## 1. Regra principal

Este documento define **o que deve ser desenvolvido agora**.

`SYSTEM_SPEC.md` representa a visão ampla do Career Gap.

Quando houver conflito entre uma ideia da especificação ampla e este arquivo, **este arquivo tem prioridade durante o TCC**.

A redução de escopo não significa que as outras ideias foram abandonadas. Elas apenas não devem atrasar a entrega e a avaliação do núcleo do sistema.

---

## 2. Contexto acadêmico

O projeto será desenvolvido como Trabalho de Conclusão de Curso em Sistemas de Informação.

O orientador aprovou a proposta do Career Gap, mas destacou que o escopo originalmente pensado — estágio, júnior, pleno, sênior, arquitetura, Tech Lead e outros caminhos simultaneamente — é grande demais para esta etapa.

Portanto, o TCC deve provar o conceito em um público menor e deixar os demais níveis como evolução futura.

Título inicial sugerido pelo orientador:

**Desenvolvimento e Avaliação de uma Plataforma para Geração de Roadmaps Personalizados de Evolução Profissional na Área de Desenvolvimento de Software**

Nome do sistema: **Career Gap**.

---

## 3. Público-alvo inicial

Priorizar:

> **Estudantes e profissionais em início de carreira que desejam ingressar ou evoluir nos primeiros estágios da carreira em desenvolvimento de software.**

Exemplos:

- estudante começando na área;
- estudante buscando estágio;
- pessoa estudando programação e buscando primeira oportunidade;
- desenvolvedor em início de carreira buscando organizar sua evolução.

Não implementar agora tracks completas para:

- pleno → sênior;
- sênior → Tech Lead;
- arquitetura de software;
- Staff/Principal;
- consultoria;
- gestão;
- carreiras avançadas.

Esses caminhos podem aparecer no trabalho como evolução futura.

---

## 4. Problema de pesquisa inicial

Formulação de trabalho:

> **Como uma plataforma baseada na identificação de lacunas de conhecimento pode gerar roadmaps personalizados considerados úteis e coerentes por estudantes e profissionais em início de carreira na área de desenvolvimento de software?**

A redação poderá ser refinada durante a escrita acadêmica.

O TCC não deve se limitar à pergunta “é possível desenvolver uma plataforma?”.

A investigação deve avaliar principalmente:

- se o sistema identifica lacunas de maneira adequada;
- se a ordem proposta faz sentido;
- se o roadmap é percebido como coerente;
- se o roadmap é percebido como útil;
- se a priorização ajuda o usuário a entender o que estudar/praticar em seguida.

---

## 5. Objetivo geral inicial

> **Desenvolver e avaliar uma plataforma capaz de identificar lacunas de conhecimento e gerar roadmaps personalizados de evolução profissional para estudantes e profissionais em início de carreira na área de desenvolvimento de software.**

---

## 6. Objetivos específicos iniciais

1. Identificar competências relevantes para pessoas em início de carreira em desenvolvimento de software.
2. Estruturar essas competências em níveis e relações de pré-requisito/relevância.
3. Desenvolver um mecanismo para estimar o estado atual do usuário.
4. Permitir que o usuário defina um objetivo profissional inicial.
5. Identificar lacunas entre o estado atual e o objetivo.
6. Definir regras para priorizar essas lacunas.
7. Gerar um roadmap personalizado com uma sequência recomendada.
8. Associar conteúdos, livros, práticas e desafios às competências do roadmap.
9. Desenvolver uma interface visual que permita compreender o caminho e a prioridade atual.
10. Avaliar a utilidade, coerência e usabilidade da plataforma com usuários do público-alvo.

---

## 7. Núcleo funcional do MVP

O MVP precisa demonstrar o ciclo:

```text
ONBOARDING
    ↓
CURRENT STATE
    ↓
TARGET
    ↓
GAP ANALYSIS
    ↓
PRIORITIZATION
    ↓
ROADMAP
    ↓
NEXT BEST ACTION
    ↓
REASSESSMENT / USER EVALUATION
```

Se esse fluxo estiver funcionando e puder ser testado com usuários, o núcleo do TCC existe.

---

## 8. Onboarding inicial

Coletar somente dados necessários para gerar o primeiro perfil.

Perguntas podem cobrir:

- experiência com programação;
- linguagens utilizadas;
- projetos já desenvolvidos;
- Git/GitHub como conhecimento, sem analisar o perfil GitHub;
- frontend/backend;
- APIs;
- banco de dados;
- testes;
- deploy;
- debugging;
- fundamentos;
- objetivo profissional;
- disponibilidade/interesse de estudo, se útil ao roadmap.

Preferir onboarding progressivo e compreensível.

IA pode interpretar respostas abertas, mas o resultado final deve ser convertido para dados estruturados.

---

## 9. Objetivos iniciais disponíveis

Manter poucos objetivos.

Primeira proposta:

- preparação para primeiro estágio/vaga em desenvolvimento;
- início em Frontend;
- início em Backend;
- início em Full Stack.

Se até isso aumentar demais o escopo, usar um track principal de **entrada em desenvolvimento web** com pequenas ramificações.

A quantidade de tracks não é o valor científico principal do TCC.

---

## 10. Identificação das lacunas

Este ponto é obrigatório e deve ser explicado academicamente.

O sistema não pode simplesmente enviar ao LLM:

> “Esse usuário quer ser frontend. Crie um roadmap.”

Estratégia inicial:

### A. Definir competências

Criar catálogo limitado de skills relevantes ao público inicial.

Exemplo:

- lógica/programação;
- JavaScript ou linguagem-base definida;
- Git;
- HTML/CSS;
- frontend fundamentals;
- HTTP;
- APIs;
- banco de dados básico;
- debugging;
- testes básicos;
- construção de projeto;
- deploy;
- comunicação/documentação básica;
- uso responsável de IA no desenvolvimento.

### B. Definir níveis

Cada skill possui uma rubrica simples de capacidade.

### C. Estimar estado atual

Usar respostas de onboarding e, quando necessário, perguntas adicionais ou pequenos desafios.

### D. Definir perfil-alvo

Cada objetivo informa quais skills são esperadas e o nível mínimo/recomendado.

### E. Calcular gaps

Comparar:

```text
current_skill_level < target_skill_level
```

### F. Registrar confiança

Autoavaliação possui confiança menor que desafio/avaliação estruturada.

---

## 11. Geração do roadmap

O roadmap deve ser consequência dos gaps estruturados.

Fluxo:

```text
User Profile
     +
Target Profile
     +
Skill Relations
     +
Priority Rules
     +
Resource Catalog
     ↓
Gap Analysis
     ↓
Prioritized Gaps
     ↓
Roadmap
```

A IA pode explicar o resultado em linguagem natural, mas não deve ser a única responsável pela ordem.

---

## 12. Priorização inicial

Não é necessário criar um algoritmo matemático complexo.

Implementar uma regra simples, transparente e testável.

Considerar:

- tamanho do gap;
- importância da skill para o objetivo;
- se é pré-requisito de outras skills;
- impacto no objetivo atual;
- confiança da avaliação.

Exemplo conceitual:

```text
priority = gap × target_weight × prerequisite_weight × confidence_factor
```

Além do score, regras editoriais podem impedir recomendações inadequadas.

Exemplo:

- Kubernetes não aparece como prioridade para alguém sem fundamentos de construção/deploy;
- microservices não aparece antes de entendimento básico de aplicações e APIs;
- framework avançado não deve substituir fundamentos essenciais.

A fórmula final deve ser simples o suficiente para ser explicada no TCC.

---

## 13. Roadmap visual

A interface principal deve usar um canvas/fluxo inspirado em whiteboards como Excalidraw.

Não copiar a UI do Excalidraw.

O mapa precisa comunicar:

```text
[START]
   ↓
[Programming ✓]
   ↓
[Git ✓]
   ↓
[Web Fundamentals ●] ← YOU ARE HERE
   ↓
[Build an Application] ← NEXT
   ↓
[Testing]
   ↓
[Deploy]
   ↓
[Ready for initial applications]
```

O mapa deve permitir pan/zoom se isso não comprometer o prazo.

Estados mínimos:

- completed;
- current;
- next;
- future;
- blocked/not-now.

---

## 14. Tela de foco

Ao selecionar um item do roadmap, mostrar:

- competência;
- por que ela está no roadmap;
- por que é prioridade agora;
- o que o usuário precisa entender;
- conteúdo recomendado;
- livros quando aplicável;
- prática/projeto recomendado;
- como saber que pode avançar.

---

## 15. Conteúdos e livros

Criar um catálogo pequeno, curado e suficiente para demonstrar o conceito.

Não construir um agregador gigante de links.

Cada recurso deve estar ligado a uma skill e, idealmente, a um nível.

O sistema pode mostrar:

```text
Testing Basics

LEARN
- documentação selecionada
- artigo selecionado

BOOK
- capítulo/livro recomendado

BUILD
- adicionar testes a uma aplicação simples

EXIT CRITERIA
- explicar diferença entre unit e integration test
- implementar testes básicos
```

Recursos usados no TCC devem ter fonte rastreável.

---

## 16. IA no MVP

Usar IA apenas onde houver benefício claro.

Permitido:

- interpretar resposta aberta do onboarding;
- fazer pergunta complementar;
- transformar texto em sinais estruturados;
- explicar recomendação;
- avaliar resposta aberta contra uma rubrica simples;
- gerar explicação amigável do roadmap.

Não permitido como arquitetura central:

```text
prompt → “gere um roadmap” → salvar resposta
```

O sistema precisa demonstrar regras próprias de domínio.

---

## 17. Funcionalidades explicitamente fora do MVP

Não implementar agora:

- análise de CV;
- análise personalizada de LinkedIn;
- análise profunda de GitHub;
- geração automática de currículo individual;
- job scraping em larga escala;
- market intelligence completo;
- Tech Lead track;
- Senior track;
- Architect track;
- Consultant track;
- Staff/Principal;
- mentoring marketplace;
- comunidades;
- gamificação complexa;
- sistema de certificação;
- Neo4j;
- microservices;
- mobile app.

Podem existir **guias genéricos** de CV/LinkedIn/GitHub posteriormente, mas não são prioridade desta entrega.

---

## 18. Primeiras telas

Prioridade de implementação visual:

### Tela 1 — Landing / apresentação

Explicar rapidamente:

> Tell us where you are.
> Tell us where you want to go.
> Career Gap maps what comes next.

### Tela 2 — Goal

Escolha do objetivo inicial.

### Tela 3 — Assessment / Onboarding

Perguntas progressivas.

### Tela 4 — Profile Summary

Resumo do que o sistema entendeu.

### Tela 5 — Career Gap

Principais lacunas detectadas.

### Tela 6 — Roadmap Canvas

Tela principal e diferencial visual.

### Tela 7 — Skill / Focus Detail

Conteúdo, livro, prática, motivo e critério de avanço.

Não construir telas secundárias antes dessas.

---

## 19. Avaliação com usuários

O professor deixou explícito que o TCC não deve terminar no desenvolvimento.

A plataforma precisa ser avaliada.

Público de teste:

- estudantes de Sistemas de Informação/áreas relacionadas;
- pessoas estudando desenvolvimento;
- profissionais em início de carreira.

Possível procedimento:

1. participante informa perfil e objetivo;
2. utiliza o Career Gap;
3. analisa gaps identificados;
4. analisa roadmap;
5. responde instrumento de avaliação.

Avaliar:

- coerência dos gaps;
- relevância das recomendações;
- clareza da ordem;
- percepção de personalização;
- utilidade;
- clareza sobre o próximo passo;
- presença de tópicos considerados desnecessários;
- usabilidade.

Pode-se usar SUS para usabilidade, combinado com questões específicas sobre a qualidade do roadmap.

Não afirmar que o sistema “melhora a carreira” sem estudo longitudinal. O que pode ser avaliado no TCC é a percepção de utilidade/coerência e a adequação do mecanismo proposto.

---

## 20. Possível comparação experimental

Se houver tempo, comparar:

### A — Roadmap estático

Mesmo roadmap genérico para todos que escolhem o objetivo.

### B — Career Gap

Roadmap baseado em estado atual + gaps + prioridades.

Perguntar qual apresenta:

- maior relevância;
- menos conteúdo desnecessário;
- melhor ordem;
- maior clareza;
- melhor adequação ao perfil.

Essa comparação fortaleceria o trabalho, mas deve ser validada com o orientador antes de aumentar o escopo metodológico.

---

## 21. Referencial teórico a iniciar agora

O orientador solicitou início do referencial sobre:

- carreira em software;
- competências profissionais;
- roadmaps de aprendizagem;
- personalização;
- uso de Inteligência Artificial.

Também pode ser relevante pesquisar:

- competency models;
- adaptive learning;
- recommender systems;
- career guidance systems;
- software engineering competency frameworks;
- self-assessment e limitações;
- explainable recommendations.

Toda afirmação acadêmica deve ser sustentada por fonte adequada.

---

## 22. Questão crítica de pesquisa/desenvolvimento

Antes de expandir funcionalidades, responder:

> **Com base em quê afirmamos que uma determinada competência é necessária e que A deve vir antes de B?**

O Skill Graph e os Career Tracks não podem ser apenas opinião dos desenvolvedores do Career Gap.

Precisamos construir a base usando fontes como:

- literatura acadêmica;
- frameworks de competências;
- currículos de computação/engenharia de software;
- career ladders públicos de organizações;
- dados de mercado quando apropriado;
- validação por especialistas, se viável.

Esse é um dos pontos mais importantes para a credibilidade do TCC.

---

## 23. Definition of Done do MVP acadêmico

O MVP pode ser considerado pronto para avaliação quando um usuário conseguir:

1. entrar no sistema;
2. definir objetivo;
3. responder avaliação inicial;
4. receber um perfil estruturado;
5. visualizar gaps;
6. receber roadmap priorizado;
7. entender por que cada etapa existe;
8. abrir uma etapa e encontrar recursos/prática;
9. identificar claramente o próximo passo;
10. concluir o fluxo de avaliação do sistema.

Tudo além disso é secundário até esses dez pontos funcionarem.

---

## 24. Prioridade imediata de trabalho

Ordem recomendada:

```text
1. Definir público
2. Definir problema e objetivos
3. Pesquisar framework de competências
4. Criar primeira taxonomia de skills
5. Criar primeiro target profile
6. Definir assessment
7. Definir gap calculation
8. Definir priority rules
9. Criar recursos mínimos
10. Implementar onboarding
11. Implementar roadmap visual
12. Implementar detail/focus
13. Testar internamente
14. Preparar avaliação com usuários
15. Executar avaliação
16. Analisar resultados
```

Evitar trabalhar em funcionalidades futuras antes do item 12.
