# Career Gap — respostas às sete frentes solicitadas pelo orientador

Documento preparado para a próxima orientação. Cada seção corresponde a um item do e-mail do
Prof. Riciere Massariol.

> Observação sobre referências: três citações estão marcadas **[conferir]** e não devem entrar
> no texto final sem verificação. A justificativa está na seção 7.

---

## 1. Delimitação do público-alvo

**Estudantes e profissionais em início de carreira que buscam ingressar em desenvolvimento
de software, com recorte em desenvolvimento web.**

A delimitação é operacional, não apenas declarativa: o sistema implementa **um único objetivo
de carreira** — *primeira vaga em desenvolvimento web* — com duas ênfases (frontend e backend)
que funcionam como ajuste de peso sobre o mesmo catálogo de competências, nunca como catálogos
paralelos.

Em termos de capacidade, o público situa-se entre os níveis **L0 e L2** da escala descrita na
seção 4. Isso exclui, por construção, os percursos de pleno, sênior, arquitetura e liderança
técnica, que permanecem registrados como evolução futura da plataforma.

**Justificativa da escolha.** Além da orientação de conter o escopo, há razão metodológica: a
literatura sobre a lacuna entre formação e indústria concentra-se justamente nesse recorte, o
que permite ancorar o problema em trabalho existente — Radermacher e Walia (SIGCSE 2013) e
Radermacher, Walia e Knudson (ICSE Companion 2014) documentam deficiências recorrentes de
recém-formados, com destaque para resolução de problemas e comunicação.

---

## 2. Problema de pesquisa

> **Como uma plataforma que identifica lacunas de conhecimento a partir do estado declarado do
> usuário pode gerar roadmaps de estudo percebidos como mais relevantes, mais bem ordenados e
> mais claros quanto ao próximo passo do que a apresentação não personalizada do mesmo
> catálogo de competências e recursos?**

Três decisões de recorte estão embutidas nessa formulação e merecem ser explicitadas:

**(a) A comparação é contra o mesmo catálogo, não contra outro produto.** Comparar o Career
Gap com um roadmap público existente confundiria diferença de conteúdo com diferença de
personalização, além de esbarrar em restrição de licença. O termo de comparação é o próprio
catálogo da plataforma, apresentado sem filtragem e sem ordenação.

**(b) O que se mede é percepção, não desempenho de carreira.** Afirmar que a plataforma
melhora a trajetória profissional exigiria estudo longitudinal, incompatível com o prazo. O
trabalho avalia utilidade e coerência percebidas, e a limitação é declarada.

**(c) A variável independente é a seleção e ordenação por lacuna**, não "personalização" em
sentido amplo. Essa precisão foi necessária porque a plataforma personaliza também a
explicação; o enunciado nomeia o mecanismo efetivamente manipulado.

---

## 3. Objetivo geral e objetivos específicos

### Objetivo geral

Desenvolver e avaliar uma plataforma capaz de identificar lacunas de conhecimento e gerar
roadmaps personalizados de estudo para estudantes e profissionais em início de carreira em
desenvolvimento de software.

### Objetivos específicos

1. Construir um catálogo de competências relevantes para o ingresso em desenvolvimento web,
   com fundamentação documentada por competência.
2. Definir uma escala de níveis baseada em capacidades observáveis, dispensando percentuais
   arbitrários.
3. Representar relações de pré-requisito entre competências de forma verificável.
4. Implementar um mecanismo de estimativa do estado atual do usuário que reconheça as
   limitações da autoavaliação.
5. Implementar o cálculo de lacunas e a priorização de forma determinística e auditável.
6. Montar roadmaps que expliquem por que cada etapa existe e o que pode ser adiado.
7. Associar a cada competência recursos educacionais verificados, com idioma, custo e licença
   registrados.
8. Avaliar com usuários do público-alvo a relevância percebida, a clareza do próximo passo e
   a usabilidade da plataforma.

---

## 4. Como as lacunas de conhecimento são identificadas

O mecanismo tem quatro partes. Nenhuma delas depende de modelo de linguagem.

### 4.1 Catálogo de competências com fundamentação registrada

O catálogo contém **25 competências exigidas pelo objetivo**, mais 5 competências de horizonte
que existem para serem explicitamente despriorizadas. Cada competência, cada nível-alvo e cada
relação de pré-requisito armazena as fontes que a sustentam, com exigência de **duas classes
distintas de fonte**:

| Classe | Exemplos usados |
|---|---|
| Padrão curricular | ACM/IEEE/AAAI **CS2023** (Knowledge Areas), IEEE **SWEBOK v4** (2024) |
| Framework de competência | **SFIA 9** (códigos de skill e níveis de responsabilidade) |
| Referência canônica | Documentação oficial (MDN, RFC 9110, WCAG 2.2), literatura revisada |

A exigência é verificada por código: a suíte de testes reprova o catálogo se alguma afirmação
citar duas fontes da mesma classe. Na primeira execução, o validador reprovou sete afirmações
em que CS2023 e SWEBOK haviam sido citadas como se fossem independentes — ambas são padrão
curricular. **O protocolo é, em si, uma contribuição metodológica descrevível.**

### 4.2 Escala de níveis por capacidade observável

Quatro níveis são usados (L0 a L3), definidos por frases em primeira pessoa:

| Nível | Semântica | Exemplo em *Fundamentos de HTTP* |
|---|---|---|
| L0 | não reconhece | — |
| L1 | aplica com apoio | "Sei que o navegador faz requisições e reconheço o que é um 404 e um 500." |
| L2 | aplica sozinho | "Leio uma requisição e uma resposta inteiras e explico o que cada parte significa." |
| L3 | decide no sistema | fora do recorte do público |

A escala é apresentada como **escala ordinal operacional definida por descritores**, e não
como teoria de estágios: o modelo Dreyfus é citado apenas como inspiração histórica, com a
ressalva de que a existência de estágios discretos carece de suporte empírico.

### 4.3 Estimativa do estado atual

A estimativa combina três origens de evidência, com confiança distinta:

| Origem | Confiança |
|---|---|
| `self-report` — a pessoa marca a frase que a descreve | baixa |
| `probe` — itens objetivos auto-corrigíveis | média |
| `artifact` — resposta aberta avaliada por rubrica | média |

A decisão de ancorar a autoavaliação em frases de capacidade, e não em escalas numéricas, tem
base empírica: autoavaliação correlaciona aproximadamente **r = 0,30** com desempenho medido
(Zell e Krizan, 2014), e itens abstratos e descontextualizados são os menos confiáveis,
enquanto os ancorados em tarefa concreta apresentam melhor desempenho — mecanismo usado nas
grades de autoavaliação do **CEFR**.

Duas salvaguardas decorrem disso:

- O sistema **nunca rebaixa silenciosamente** o nível declarado. Quando a confiança é baixa e
  a competência é pré-requisito de várias outras, o item é marcado para verificação.
- O perfil inferido é **exibido e confirmado** pelo usuário antes de virar estado.

### 4.4 Cálculo da lacuna

Para cada competência exigida:

```
lacuna = max(0, índice(nível-alvo) − índice(nível-estimado))
```

Ausência de informação é tratada como L0: ausência de evidência não é evidência de capacidade.
Cada lacuna carrega ainda criticidade (essencial, apoio, opcional), confiança e o indicador de
necessidade de verificação.

---

## 5. Como o roadmap é gerado

A geração ocorre em **três etapas separadas e nesta ordem**. A separação é a decisão central
do sistema: ela distingue o que é estrutural e indiscutível do que é opinável e versionado.

### Etapa 1 — Elegibilidade (estrutural, booleana)

Uma competência é *alcançável* quando todos os seus pré-requisitos duros estão satisfeitos
pelos níveis atuais; caso contrário é *bloqueada*, e o sistema registra quais competências a
bloqueiam.

A aresta de pré-requisito só existe quando a competência destravada é **inviável ou
incompreensível** sem a de origem. "É melhor aprender antes" não gera aresta — vira peso na
etapa 2. O grafo é deliberadamente esparso: **22 arestas para 25 competências**, cada uma com
justificativa registrada. Um grafo denso seria opinião com aparência de estrutura.

Esta etapa instancia o conceito de *outer fringe* da **Teoria dos Espaços de Conhecimento**
(Doignon e Falmagne) e de sua extensão baseada em competências (CbKST): o conjunto do que a
pessoa está pronta para aprender é a fronteira do seu estado atual.

### Etapa 2 — Ranking (soma ponderada auditável)

Entre as competências alcançáveis:

```
escore = 0,4 × tamanho_da_lacuna + 0,4 × criticidade + 0,2 × quantidade_que_destrava
```

com todos os componentes normalizados em [0,1] e os pesos publicados junto ao catálogo. Cada
parcela é persistida com o item, o que permite exibir o cálculo completo de qualquer
recomendação.

**Optou-se por soma ponderada e não por produto de fatores.** Em um produto, um fator próximo
de zero anula o escore e oculta lacunas relevantes, além de produzir magnitudes sem
interpretação. A confiança da estimativa **não** entra no escore: incerteza de medida não é
falta de importância, e penalizá-la puniria o usuário por uma limitação do instrumento.

### Etapa 3 — Política editorial (apenas rebaixa)

Regras nomeadas movem itens para o estado `NÃO AGORA`, sempre com código de razão legível.
Nenhuma regra promove. Exemplos implementados:

- `PREMATURE_SPECIALIZATION` — tecnologia de vida curta enquanto há fundamento pendente;
- `LOW_IMPACT_FOR_TARGET` — item opcional diante de várias lacunas essenciais;
- `OUT_OF_TRACK_SCOPE` — competência de horizonte, não exigida pelo objetivo.

Dizer explicitamente o que **não** estudar agora é parte do produto, não detalhe de interface.

### Montagem e rastreabilidade

Os itens são ordenados por onda de alcançabilidade e, dentro da onda, por escore. Todo roadmap
gerado persiste a **versão do catálogo**, o **snapshot do perfil de entrada** e o
**detalhamento do escore** de cada item — o que torna qualquer resultado citado no trabalho
reprodutível e permite calcular o diff em uma reavaliação.

### Papel da inteligência artificial

Delimitado a três usos, cada um atrás de uma interface com validação de esquema e alternativa
determinística: interpretar texto livre em sinais estruturados (com confirmação do usuário),
avaliar resposta aberta contra rubrica, e explicar em linguagem natural uma recomendação **já
calculada**. É vedado à IA definir ordem, prioridade ou composição do roadmap, e vedado gerar
recursos ou URLs. **Com o modelo desligado, o sistema funciona integralmente.**

---

## 6. Metodologia de avaliação com usuários

### Desenho

Comparação **intra-sujeito com ordem contrabalançada**. Cada participante interage com:

- **Condição A** — o catálogo completo do objetivo, na ordem de declaração, sem filtragem por
  lacuna, sem ranking e sem `NÃO AGORA`;
- **Condição B** — o roadmap gerado a partir do seu próprio estado.

As duas condições usam **a mesma interface, os mesmos recursos por competência e o mesmo
tratamento visual**. Varia apenas a seleção e a ordenação. Esse controle é o ponto mais
sensível do desenho: se a camada de recursos existisse apenas na condição personalizada, um
resultado favorável seria esperado mesmo com o motor desligado — por efeito placebo de
sistemas atribuídos a IA (Kosch et al., *ACM TOCHI*, 2023) e por viés de demanda a favor do
artefato do pesquisador (Dell et al., *CHI*, 2012).

Os rótulos apresentados ao participante são neutros ("Versão 1" e "Versão 2").

### Instrumentos

| Instrumento | Uso |
|---|---|
| **ResQue** (Pu, Chen e Hu, RecSys 2011), subconjunto de 15 a 20 itens | acurácia percebida, transparência, controle, utilidade, confiança, satisfação |
| **SUS**, 10 itens | usabilidade |
| *Manipulation check*, 2 itens | percepção de personalização — se este construto não se mover, nada no ResQue é interpretável como efeito do motor |
| Medidas objetivas | tempo até identificar o próximo passo; número de itens marcados como irrelevantes em cada condição |
| Painel de especialistas (3 a 5 desenvolvedores) | coerência dos roadmaps gerados para perfis sintéticos |

### Amostra e poder

**n = 24** (12 por sequência de ordem), mínimo aceitável de 20. Com esse tamanho, o efeito
mínimo detectável a 80% de poder situa-se em torno de *d* ≈ 0,6. **O estudo é declarado
exploratório a priori**, e não após a análise.

### Limitações declaradas

1. Mede-se percepção de utilidade e coerência, não ganho de carreira.
2. A estimativa de entrada é majoritariamente autodeclarada; um resultado nulo pode refletir
   erro de estimativa e não ausência de efeito da personalização.
3. As duas condições compartilham a mesma linguagem visual, o que reduz a saliência da
   manipulação — daí a necessidade do *manipulation check*.
4. O painel de especialistas avalia perfis sintéticos, não os perfis reais dos participantes.

---

## 7. Início do referencial teórico

Organizado pelos cinco eixos solicitados. A bibliografia anotada completa, com URLs e situação
de direitos de cada fonte, está em `docs/research/SOURCES.md`.

### 7.1 Carreira em software e a lacuna formação–indústria

Radermacher e Walia (SIGCSE 2013); Radermacher, Walia e Knudson (ICSE Companion 2014);
*Are computer science and engineering graduates ready for the software industry?* (ICSE SEET
2018); *Identifying Non-Technical Skill Gaps in Software Engineering Education* (ACM TOCE,
2021). No contexto brasileiro, dados de evasão e reprovação em disciplinas introdutórias de
programação sustentam a inclusão de decomposição de problemas, depuração e legibilidade já
nos níveis iniciais.

### 7.2 Competências profissionais e modelos de nível

ACM/IEEE/AAAI **CS2023**; IEEE **SWEBOK v4** (2024); **SFIA 9**; **e-CF / ESCO**. Para o
formato dos descritores, as grades de autoavaliação do **CEFR** (Conselho da Europa). Sobre os
limites da autoavaliação, **Zell e Krizan (2014)**; sobre a crítica ao modelo Dreyfus, Gobet e
Chassy, e a revisão em *Medical Education Online* (2010).

### 7.3 Roadmaps e sequenciamento de aprendizagem

**Teoria dos Espaços de Conhecimento** (Doignon e Falmagne, 1985; Falmagne e Doignon, 2011) e
**CbKST** (Heller, Stefanutti, Albert, Ünlü), que formalizam estado de conhecimento, relação
de precedência e o *outer fringe*. Sobre pedagogia de programação, **PRIMM** (Sentance, Waite
e Kallia, *Computer Science Education*, 2019) e **Use-Modify-Create**. Sobre carga cognitiva e
exemplos resolvidos, Sweller; sobre os limites da instrução com orientação mínima para
novatos, Kirschner, Sweller e Clark (2006), com a réplica de Hmelo-Silver et al. (2007).

### 7.4 Personalização e sistemas de recomendação

O Career Gap classifica-se como **recomendador baseado em conhecimento**, família adequada
quando não há histórico de interação — Felfernig et al., *Frontiers in Big Data* (2024).
Sobre explicabilidade, Zhang e Chen. Sobre avaliação centrada no usuário, **ResQue** (Pu, Chen
e Hu, RecSys 2011) e Knijnenburg e Willemsen (*Recommender Systems Handbook*, 2ª ed., 2015),
este último para o requisito de que as condições sejam idênticas em tudo o que não é a
variável manipulada. Como trabalho relacionado, *Personalized Learning Path Recommendation
Based on Knowledge Graphs* (2026) e sistemas comerciais de análise de lacunas, cuja limitação
é a opacidade do cálculo.

### 7.5 Uso de inteligência artificial

Sobre LLM como avaliador, a literatura de 2025–2026 indica concordância razoável com humanos
**apenas** quando a tarefa é estruturada e a rubrica explícita, com viés de leniência e
sensibilidade a ordem persistentes; escalas curtas apresentam melhor alinhamento, o que apoia
a granularidade L0–L3. Sobre percepção inflada de sistemas atribuídos a IA, Kosch et al.
(*ACM TOCHI*, 2023). Sobre viés de demanda em avaliação de artefato, Dell et al. (*CHI*, 2012).

### Referências a conferir antes da redação final

1. **[conferir]** A indicação de 38 participantes para desenho intra-sujeito atribuída a
   Knijnenburg e Willemsen não foi localizada em duas cópias do capítulo. Não usar como
   prescrição da fonte sem confirmação.
2. **[conferir]** A intervenção contra *gaming the system* é de Baker et al. (ITS, 2006), não
   do artigo de CHI 2004 frequentemente citado no lugar.
3. **[conferir]** A escala de autoeficácia de Ramalingam e Wiedenbeck tem 32 itens validados;
   uma adaptação curta **não herda** essa validação e não pode ser descrita como instrumento
   validado.

---

## Anexo — estado da implementação

| Frente | Situação |
|---|---|
| Catálogo de competências | 30 competências, 22 arestas, versão `2026.09.10-1` |
| Catálogo de recursos | 125 recursos verificados individualmente; 83 em português |
| Motor de lacunas e priorização | implementado, 48 testes automatizados |
| Interface | fluxo vertical responsivo; condições A e B renderizadas pelo mesmo componente |
| Instrumentos de avaliação | definidos; coleta ainda não iniciada |
