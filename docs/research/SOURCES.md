# Career Gap — Fontes levantadas na Fase 1

Bibliografia anotada da fase de discovery. Serve ao referencial teórico do TCC e à
fundamentação do catálogo de competências.

Referências completas (autor, ano, veículo, DOI) precisam ser conferidas na redação —
aqui está a trilha de origem e a razão de cada fonte estar na lista.

---

## 1. Fundamento formal do "o que aprender agora"

| Fonte | Por que importa |
|-------|-----------------|
| **Knowledge Space Theory** — Doignon & Falmagne (1985); Falmagne & Doignon, *Learning Spaces* (2011) | Formaliza estado de conhecimento e **outer fringe** = "o que a pessoa está pronta para aprender". É exatamente a pergunta do produto. https://www.aleks.com/about_aleks/knowledge_space_theory |
| **Competence-based KST (CbKST)** — Heller, Stefanutti, Albert, Ünlü | Estende a KST com competências e relações de precedência entre elas; estado = `C ⊆ S`. Base teórica direta da estrutura do Career Gap. https://link.springer.com/article/10.1007/s13042-025-02615-y |
| **The Assessment of Knowledge, in Theory and in Practice** — Falmagne (ALEKS) | Descrição aplicada da avaliação adaptativa sobre espaços de conhecimento. https://www.aleks.com/about_aleks/Science_Behind_ALEKS.pdf |
| **Zona de Desenvolvimento Proximal** — Vygotsky | O outer fringe é frequentemente lido como operacionalização da ZDP; conecta o motor à teoria de aprendizagem. |

## 2. Sistemas de recomendação

| Fonte | Por que importa |
|-------|-----------------|
| **Knowledge-based recommender systems: overview and research directions** — Felfernig et al., *Frontiers in Big Data* (2024) | Classifica a família à qual o Career Gap pertence e documenta a ausência de cold start. https://www.frontiersin.org/journals/big-data/articles/10.3389/fdata.2024.1304439/full |
| **Constraint-based recommender systems: technologies and research issues** — Felfernig & Burke | Recomendação por restrições: o análogo direto de "pré-requisito + política editorial". |
| **Explainable Recommendation: Theory and Applications** — Zhang & Chen | Survey de explicabilidade; sustenta o requisito de `reason_codes`. https://arxiv.org/pdf/1708.06409 |
| **A user-centric evaluation framework for recommender systems (ResQue)** — Pu, Chen & Hu, RecSys 2011 | Instrumento validado: acurácia percebida, transparência, controle, utilidade, confiança, satisfação. Base do questionário do TCC. https://dl.acm.org/doi/10.1145/2043932.2043962 |
| **Personalized Learning Path Recommendation Based on Knowledge Graphs: A Survey** — *Electronics* (2026) | Estado da arte de trilhas personalizadas por grafo; posiciona o trabalho relacionado. https://doi.org/10.3390/electronics15010238 |
| **Skill-based Career Path Modeling and Recommendation** — UMass | Trabalho relacionado em trajetória de carreira; usa histórico de empregos, abordagem diferente da nossa. https://people.umass.edu/~andrewlan/papers/20bigdata-mnss.pdf |

## 3. Frameworks de competência e currículos (fundamentação do catálogo)

| Fonte | Uso previsto |
|-------|--------------|
| **ACM/IEEE/AAAI CS2023** — Computer Science Curricula | Knowledge Areas, Knowledge Units, CS Core vs KA Core, modelo de competência e *dispositions*. Fonte curricular primária. https://csed.acm.org/ |
| **SWEBOK v4 (IEEE CS, out/2024)** — 18 Knowledge Areas | Recorte da engenharia de software profissional; inclui novas KAs de Arquitetura, Operações e Segurança. https://www.computer.org/education/bodies-of-knowledge/software-engineering |
| **SFIA 9** | 7 níveis de responsabilidade e 5 atributos genéricos (autonomia, influência, complexidade, business skills, conhecimento). Licença gratuita para indivíduos e uso de pesquisa mediante registro. https://sfia-online.org/en/sfia-9/responsibilities |
| **e-CF / EN 16234-1 e ESCO** | Taxonomia europeia de competências; ESCO tem ~13,9 mil conceitos de skill em 4 níveis. Útil para normalizar nomes. |
| **Mapeamento SWEBOK v4 ↔ SFIA 9** | O próprio SFIA publica a correspondência — atalho para fundamentar competências com duas classes de fonte. https://sfia-online.org/en/tools-and-resources/bodies-of-knowledge/swebok-software-engineering-body-of-knowledge |

## 4. Lacuna academia–indústria (justifica o problema de pesquisa)

| Fonte | Achado |
|-------|--------|
| **Radermacher & Walia — Gaps Between Industry Expectations and the Abilities of Graduates**, SIGCSE 2013 | Catálogo de deficiências de conhecimento de recém-formados. |
| **Radermacher, Walia & Knudson — Investigating the skill gap between graduating students and industry expectations**, ICSE Companion 2014 | Comunicação e resolução de problemas como deficiências dominantes. https://dl.acm.org/doi/10.1145/2591062.2591159 |
| **Are computer science and engineering graduates ready for the software industry?** — ICSE SEET 2018 | Evidência adicional e mais recente. https://dl.acm.org/doi/10.1145/3183377.3185754 |
| **Identifying Non-Technical Skill Gaps in Software Engineering Education** — ACM TOCE (2021) | O que especialistas esperam e os estudantes não aprendem. https://dl.acm.org/doi/full/10.1145/3464431 |

## 5. Avaliação de competência e limites da autoavaliação

| Fonte | Achado usado |
|-------|--------------|
| **Zell & Krizan (2014)** — revisão quantitativa de meta-análises | Autoavaliação correlaciona ~r=.30 com desempenho medido; insuficiente como proxy de capacidade. |
| **Gignac & Zajenkowski (2020)** — *Intelligence* | O efeito Dunning-Kruger é majoritariamente artefato estatístico. Citar com cuidado, sem exagerar o argumento. https://gwern.net/doc/iq/2020-gignac.pdf |
| **CEFR — grade de autoavaliação "can do"** (Council of Europe) | Precedente consolidado de níveis definidos por descritores de capacidade observável. https://www.coe.int/en/web/common-european-framework-reference-languages/table-2-cefr-3.3-common-reference-levels-self-assessment-grid |
| **Oscarson (1989); Ma & Winke (2019)** | Itens abstratos e descontextualizados são os menos confiáveis; itens ancorados em tarefa funcionam melhor, com tendência a subestimar (não superestimar). https://onlinelibrary.wiley.com/doi/10.1111/flan.12379 |
| **Crítica ao modelo Dreyfus** — Gobet & Chassy; *Medical Education Online* (2010) | Não há evidência empírica de estágios discretos. Justifica tratar L0–L3 como escala ordinal operacional, não como teoria de estágios. https://www.tandfonline.com/doi/full/10.3402/meo.v15i0.4846 |

## 6. Pedagogia de programação (fundamenta LEARN → PRACTICE → BUILD → PROVE)

| Fonte | Achado usado |
|-------|--------------|
| **PRIMM** — Sentance, Waite & Kallia, *Computer Science Education* (2019) | Predict-Run-Investigate-Modify-Make; estudo com 493 alunos e grupo de controle. https://www.tandfonline.com/doi/full/10.1080/08993408.2019.1608781 |
| **Use-Modify-Create** — Lee et al. | Escalonamento de profundidade de interação; lastro direto da escada de ação. |
| **Worked examples / carga cognitiva** — Sweller e sucessores | Por que iniciante precisa de exemplo trabalhado antes de produção independente. |

## 7. LLM como avaliador

| Fonte | Achado usado |
|-------|--------------|
| **Reliability without Validity: LLM-as-a-Judge across Agreement, Consistency, and Bias** (2026) | Consistência alta não implica validade. https://arxiv.org/pdf/2606.19544 |
| **Grading Scale Impact on LLM-as-a-Judge** (2026) | Alinhamento humano-LLM é maior em escalas curtas (0–5). Sustenta L0–L3. https://arxiv.org/pdf/2601.03444 |
| **Quantifying the Statistical Effect of Rubric Modifications on Human-Autorater Agreement** (2026) | A rubrica explícita é o que carrega a concordância. https://arxiv.org/pdf/2605.06283 |
| Prática de medida | Reportar κ ponderado ou correlação de postos para escalas ordinais; α de Krippendorff com múltiplos avaliadores. |

## 8. Recursos educacionais — situação de direitos

| Fonte | Situação | Decisão |
|-------|----------|---------|
| **BibliotecaDev** (`github.com/KAYOKG/BibliotecaDev`) | Hospeda PDFs digitalizados de livros comerciais protegidos (Casa do Código, Fowler, Martin). Distribuição não autorizada. | **Não usar**, nem como destino de link. |
| **free-programming-books** (EbookFoundation) | Índice sob CC BY; exige acesso livre e recomenda linkar a fonte mais autoritativa. | Usar como **índice de descoberta**; linkar sempre a fonte original. https://github.com/EbookFoundation/free-programming-books |
| **roadmap.sh** | Licença proíbe redistribuição do conteúdo fora do repositório. | Apenas **trabalho relacionado** na escrita. |
| **freeCodeCamp** | "copyright © 2014 freeCodeCamp.org", sem licença aberta. A BSD-3 cobre só o software; os repositórios de curso não têm arquivo de licença. | Apenas link; nunca o texto das lições. |
| **CS50x (Harvard)** | CC BY-NC-SA 4.0. | Link permitido; sem reuso comercial ou derivados. https://cs50.harvard.edu/x/ |
| **refactoring.guru** | Uso de conteúdo restrito; até 10 ilustrações sob condições. | Apenas link; sem reuso de imagem. https://refactoring.guru/content-usage-policy |
| **Pro Git** | Creative Commons, com tradução pt-BR mantida. | Link direto. https://git-scm.com/book/pt-br |
| **Documentação oficial pt-BR** | React (`pt-br.react.dev`), MDN, PostgreSQL, Docker, TypeScript, Node. | Prioridade máxima de autoridade. |
| **free-programming-books-pt_BR** | ~40 categorias. Cobertura desigual: JavaScript ~30 entradas, fundamentos ~8, Git ~5, SQL ~2, **testes ~1**. | Registrar `idioma` por recurso; aceitar inglês onde o pt-BR não existe. |

## 9. Pessoas e projetos citados pelo usuário — verificação

| Item | Verificação | Decisão |
|------|-------------|---------|
| **Fabio Akita / Akitando** | Canal ativo com conteúdo de fundamentos, carreira e crítica de tendências. | Elegível **por vídeo específico** vinculado a um gap; nunca "assista o canal". |
| **ai-memory** (`github.com/akitaonrails/ai-memory`) | Real: memória persistente entre agentes de código, Rust, servidor MCP, MIT, ~6,5 mil estrelas. | Fora do MVP. Relevante a competências avançadas de desenvolvimento assistido por IA. |
| **Renato Augusto** | Identificado como Renato Augusto (`renatoaugustofs`), arquiteto de software brasileiro, pós-graduado em Arquitetura de Software pela PUC-PR, produz conteúdo de arquitetura ("O Mapa do Arquiteto"). | **Fora do MVP**: conteúdo de arquitetura é nível errado para o público-alvo. Reavaliar no track de Arquitetura. |
| **Eduardo Bomerich — Manual de Criação** (`youtube.com/@manualdecriacao`) | Verificado em 2026-10-15: ~36 mil inscritos. Dos 30 vídeos mais recentes, praticamente todos são produção criativa com IA generativa — comparação de modelos ("Opus 5.5 vs GPT 6: criei 30 jogos"), Blender automatizado por IA, vídeo com Seedance, música com Suno, "criei um jogo com Claude (zero programação)". Quase todo título está preso a uma versão de modelo. | **Fora do catálogo.** Nenhum vídeo mapeia para as 25 competências da trilha; "zero programação" é o padrão de delegação que Shen e Tamkin (2026) associam a menor aprendizado, e contraria a decisão de 2026-10-15 de não pôr IA no começo. Volatilidade alta. Reavaliar só se surgir trilha de jogos/3D/criação — registrada como trabalho futuro, como Shopify e SAP. |
| **Gustavo Campelo — Desenvolvedor** (`youtube.com/@gucampelo`) | Verificado em 2026-10-15: ~72,8 mil inscritos. Front-end criativo (estilo Awwwards: GSAP, Three.js, R3F, parallax, preloaders, análise de sites premiados) e, nos últimos meses, muito conteúdo de IA ("site com 1 prompt", skills, testes de modelos). Descrições dos vídeos são só funil para curso pago (`webhubeducacao.com.br`) — sem capítulos nem ementa. **Mercado:** 2 de 147 vagas de front-end do `frontendbr/vagas` em 12 meses citam GSAP/Three.js/WebGL/R3F; **0 de 19 vagas de estágio e júnior**. | **Fora da trilha atual** — front-end criativo é especialização além da primeira vaga. Candidato a **ênfase futura "front-end criativo"**. Exceção possível agora: vídeos-tutorial específicos (ex.: "Aprenda a Criar um Preloader Animado do Zero", 18 min, `79xxnu-PRQo`) como **prática (BUILD)** de DOM e CSS — só depois de assistidos e verificados pelo protocolo de criadores; o metadado não diz o que ensinam. Nunca "acompanhe o canal". |
| **O Novo Programador — "Me dê 20 MINUTOS e Você Usará o Claude Melhor que 99% dos Devs!"** (`youtube.com/watch?v=5wnCQ08wQ-Y`) | Sugerido pelo Enzo em 2026-10-15. Canal brasileiro; 27 min; publicado em 07/10/2026; ~38 mil visualizações. Sem capítulos; a descrição é só funil (workshop pago, cupom de hospedagem, escola). A transcrição automática não pôde ser lida — o YouTube passou a exigir token de origem para requisição automática. | **Pendente: precisa ser assistido.** Entra como WATCH em `ai-assisted-development-basics` L1 (ou na ficha do assistente de código, no Kit) se (1) ensina a dar contexto ao assistente e a revisar e testar a saída, e (2) não ensina a aceitar código sem revisar. Título caça-clique não desqualifica; ensinar a delegar sem verificar, sim. Ferramenta de um fornecedor só: `volatile`, revisar em seis meses. |
| **Martin Fowler** | Artigos específicos (testes, refatoração, CD). | Elegível por artigo, em gaps de nível intermediário. Majoritariamente acima do público inicial. |

## 10. Bibliotecas de interface

| Item | Situação verificada |
|------|---------------------|
| **React Flow / @xyflow/react** | MIT, sem marca d'água; foco por teclado e leitor de tela embutidos; `BaseEdge` aceita caminho SVG arbitrário; exemplos oficiais de layout com `@dagrejs/dagre` e `elkjs`. https://reactflow.dev |
| **tldraw** | Desde a SDK 3.x exige licença comercial paga ou marca d'água "made with tldraw". **Descartado.** https://tldraw.dev/community/license |
| **Excalidraw** | MIT, porém é um editor de desenho, não um renderizador de diagrama. **Descartado** como base. |
| **rough.js** | MIT, <9 kB gzip, funciona com SVG, aceita `seed` para traçado determinístico. https://roughjs.com |
| **Excalifont / Virgil** | Ambas SIL OFL-1.1, uso pessoal e comercial livre. https://plus.excalidraw.com/excalifont |
