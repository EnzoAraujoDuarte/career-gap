# Career Gap — Decisões tomadas (2026-09-11)

O dono do produto delegou estas decisões: *"não vou responder suas perguntas, quero que você
pesquise e chegue à conclusão do que vai ser melhor para o usuário"*.

**Função de objetivo: o usuário final** — o iniciante brasileiro buscando a primeira vaga.
O TCC é restrição, não objetivo: precisa continuar defensável, mas o produto não se otimiza
para o conforto do experimento.

Evidência bruta em `docs/research/DECISOES-EVIDENCIA.json`. **Este documento diverge da
proposta original em três pontos que a crítica adversarial derrubou** — as divergências estão
marcadas.

---

## Decisão 1 — A camada de recursos entra nas DUAS condições

E, junto com ela, **a tese muda de nome**.

### O que fica decidido

Condição A (baseline) e condição B (personalizada) usam a **mesma ficha de nó, o mesmo
conjunto de recursos por nó e a mesma explicação estrutural**. Varia só o que o motor faz:
quais nós aparecem, em que ordem, e o NOT NOW.

### Por quê

Se os recursos existirem só em B, a variável independente deixa de ser personalização e vira
"personalização + curadoria + ordem + recomendado + critério de saída + selo". Três achados
convergem:

- **Ceteris paribus é requisito, não preferência.** Knijnenburg & Willemsen (2015,
  *Recommender Systems Handbook* 2ª ed.) documentam o caso idêntico ao nosso — SVD contra
  itens aleatórios, com o **mesmo rótulo** nas duas condições, justamente para não confundir
  rótulo com algoritmo.
- **Efeito placebo de IA.** Kosch et al. (2023, *ACM TOCHI* 29(6), N=369 e N=100): a mera
  crença de estar sendo apoiado por IA adaptativa elevou percepções, **sem adaptatividade
  real**. Sem controle, o experimento não distingue o motor de um placebo — que é exatamente
  o que ele existe para provar.
- **Viés de demanda.** Dell et al. (2012, *CHI '12*, 450 entrevistas): participantes foram
  ~2,5× mais propensos a preferir o artefato que acreditavam ser do entrevistador, com
  alternativa **idêntica**.

### DIVERGÊNCIA: a tese muda de enunciado

A crítica está certa ao dizer que, mesmo com recursos nos dois lados, sobram diferenças: o
nível do checklist e o conjunto de recursos variavam com o nível do usuário.

**Correção:** os dois lados mostram os recursos do **nível-alvo do track**, não do nível do
usuário. Assim o conteúdo por nó é literalmente o mesmo objeto nas duas condições.

E o enunciado passa a ser honesto:

> ~~a personalização melhora a percepção de relevância~~
> **a seleção e ordenação por lacuna melhoram a percepção de relevância e a clareza do
> próximo passo, comparadas ao mesmo catálogo apresentado sem filtro nem ordem.**

Isso não enfraquece o trabalho — é precisamente o que o motor faz, e agora é testável.

### Parâmetros fixados agora, não depois

- **n = 24** (12 por sequência de ordem). Mínimo aceitável: 20.
- **Ordem contrabalançada**, já exigida pela ADR-0007 §1.
- **Rótulos neutros** "Versão 1" e "Versão 2"; o participante nunca sabe qual é a personalizada.
- **Manipulation check:** dois itens de percepção de personalização. Se esse construto não se
  mover, nada no ResQue é interpretável como efeito do motor.
- **Poder declarado a priori:** com n=24 o efeito mínimo detectável a 80% fica em torno de
  d≈0,6. O estudo é **exploratório** e isso vai escrito na metodologia **antes** da coleta —
  não descoberto pela banca.

**Custo para o usuário:** nenhum. É a opção que mais o beneficia — testa o mecanismo que muda
a vida dele: se filtrar e ordenar por lacuna vale a pena, e se dá para confiar no NOT NOW.
**Custo para a tese:** efeito menor, risco real de resultado nulo, e um enunciado mais modesto.

---

## Decisão 2 — Campos essenciais antes da coleta; o resto sai

### O que fica decidido

**Antes da coleta:** `license`, `requires_signup`, `pt_br_status`, `cost` e a normalização de
`technology`. Mais `estimated_time` **apenas nos 33 vídeos do YouTube** (extraível por script).

**Fora do recorte:** `published_at` nas 95 entradas, e com ele a tarja "material antigo".

### Por quê

A medição local desfez a premissa de esforço. O trabalho é majoritariamente derivável:

| Campo | Situação real |
|---|---|
| `cost` | 38/38 das brasileiras são `free`; 40/40 dos livros já preenchido |
| `requires_signup` | 33/38 são URLs do YouTube → `false` mecânico |
| `pt_br_status` | 38/38 são criadores brasileiros falando português → `complete` é a regra |
| `license` | 57/57 das canônicas já preenchida |
| `technology` | 70/95 resolvem por script (minúsculas + sem acento + alias); 25 por curadoria |

Três dos 41 valores de `technology` nem são tecnologia — `hashing de senhas`, `segurança de
autenticação`, `modelagem relacional` são **nomes de competência vazados no campo**. É daí que
sairia o selo absurdo "— com hashing de senhas".

`published_at` é o caso oposto: 78 entradas sem valor, exigindo abrir cada página, e **não há
evidência controlada** de que exibir data aumente início ou conclusão. Gastar dias nisso
enquanto a avaliação com usuários é o núcleo do TCC é má alocação.

---

## Decisão 3 — Marcar o checklist NÃO altera o nível

### DIVERGÊNCIA total da proposta original

A proposta era um sistema de confiança agregada — `self_report` 0,3, `probe` 0,7, `artifact`
0,9, limiar 0,7, rebaixado para 0,3 em competência "folha". A crítica derrubou, e está certa:

- **O aparato era decorativo.** Em folha, limiar 0,3 com self_report valendo 0,3 promove
  sempre. É um `if/else` com números por cima.
- **16 das 25 competências promoveriam com um clique** — incluindo acessibilidade, testes e
  legibilidade, que são alvos do track. Um verde falso as retira do NEXT.
- **A função de agregação nunca foi definida** (máximo? média? soma?), então a regra nem era
  computável — contradizendo "determinístico e auditável".
- Os pesos eram **admitidamente não calibrados**.

### O que fica decidido, e é mais simples

**Marcar um critério de saída nunca altera o nível estimado.** Registra uma asserção e mostra
progresso. O nível muda por **sondagem objetiva** ou por **reavaliação explícita**.

Quando todos os critérios de um nível estão marcados, o sistema **oferece** a verificação:
*"você marcou tudo em HTTP — quer confirmar em 3 perguntas?"* O usuário decide; a evidência
é que promove.

### Por quê esta e não a outra

- Elimina *gaming* por construção, em vez de tentar precificá-lo com pesos inventados.
- O checklist continua valendo: torna o progresso visível (Progress Principle, Amabile &
  Kramer) e dispara a reavaliação no momento certo.
- É trivial de implementar e de explicar na banca — uma regra, sem aritmética de confiança
  não calibrada.
- Coerente com o que já existe: o domínio já distingue `self-report` < `probe` < `artifact` e
  já expõe `verificationNeeded`.

**Modelo:** `CriterionAssertion { competency, level, criterionIndex, assertedAt }` e
`UserProfile.assertions`. O `Roadmap.inputSnapshot` já guarda o perfil inteiro — reprodutível
e com diff computável, sem camada nova de persistência.

**Durante a sessão experimental o checklist fica em somente-leitura nas duas condições.** Se
marcar regenerasse o roadmap em B e não em A, a personalização ficaria confundida com
interatividade.

**Custo para o usuário:** quem realmente aprendeu não fica verde com um clique — responde 3
perguntas. Segundos de atrito, em troca de não estudar meses sobre uma base falsa que o
próprio sistema validou.

---

## O que a crítica derrubou e não foi consertado

Registrado para não se perder:

- **A medida objetiva de efetividade não fecha.** O gabarito do painel é sobre perfis
  sintéticos; os participantes são pessoas reais sem gabarito. Ou o painel avalia cada
  participante (custo não orçado), ou a medida sai. **Decisão: sai.** Ficam ResQue, SUS,
  tempo até identificar o próximo passo e nº de itens marcados como irrelevantes.
- **Três referências precisam ser conferidas antes de entrar no texto:** o "38 participantes"
  atribuído a Knijnenburg & Willemsen não foi confirmado nas duas cópias do capítulo; a
  intervenção contra *gaming* é de Baker et al. 2006 (ITS), não do CHI '04; e a escala de
  Ramalingam & Wiedenbeck tem 32 itens validados — uma adaptação de 4-6 itens **não herda** a
  validação e não pode ser chamada de escala validada.


---

## Estado da implementação (2026-09-11)

Tudo o que estava marcado "antes da coleta" está implementado e rodando.

| Entrega | Onde |
|---|---|
| Entidade `Resource` + `CriterionAssertion` | `career-gap/src/domain/model.ts` |
| Seleção determinística com razão estruturada | `career-gap/src/domain/resources.ts` |
| Catálogo de **125 recursos** (135 − 10 duplicados mesclados) | `career-gap/src/catalog/resources.ts`, gerado por `pnpm build:resources` |
| Ficha do nó (o quê fazer + como sei que acabei) | `career-gap/src/components/roadmap/focus-panel.tsx` |
| Selo de tecnologia | `career-gap/src/components/roadmap/tech-badge.tsx` |
| Hierarquia visual (foco + horizonte de 3, resto esmaecido) | `career-gap/src/components/roadmap/competency-node.tsx` |
| **Condição A do experimento** | `career-gap/src/app/catalogo` |
| Testes | 47, incluindo cobertura de recurso por requisito |

### Regras que só apareceram ao implementar

Quatro defeitos que a pesquisa não previa e que viraram regra com teste:

1. **Ordem pedagógica, não proximidade do alvo.** Ordenar pelo nível mais próximo do alvo
   colocava um desafio de sete dias como primeiro passo de Git para quem nunca deu um commit.
   Agora ordena por nível ascendente.
2. **Quem ensina abre a lista.** Dentro do mesmo nível, `READ`/`WATCH`/`LEARN` vêm antes de
   `BUILD`/`PROVE` — não se pratica o que ainda não se aprendeu (efeito do exemplo trabalhado).
3. **Selo exige duas evidências e não pode ser redundante.** Um único recurso marcado como
   `git` fazia "Comunicação técnica" aparecer como "com Git"; e "Fundamentos de HTTP — com
   HTTP" não informa nada.
4. **Nota de curadoria não vaza para a tela.** O campo `chapters` de alguns recursos continha
   instrução interna ("NÃO mapear para sql-basics"), que o usuário leria como instrução
   para ele.

### Divergência assumida

`estimated_time` ficou apenas onde a pesquisa já o tinha (recursos canônicos). Não extraí
duração dos 33 vídeos do YouTube: exigiria bater na API do YouTube ou raspar páginas, e a
própria decisão registrou que não há evidência controlada de que exibir duração aumente
início ou conclusão.


---

## Fluxo de entrada (2026-09-11)

Faltava a primeira sessão: o usuário caía direto no mapa, e a troca de perfil ficava num
seletor no cabeçalho que era andaime de demonstração exposto como se fosse produto.

| Rota | Papel |
|---|---|
| `/` | Landing: a promessa em duas linhas, sem cadastro, com o tamanho real do catálogo |
| `/objetivo` | Objetivo e ênfase — "ainda não sei" é a primeira opção e o padrão |
| `/avaliacao` | Autoavaliação em grade "consigo fazer", em dois passos (core, depois apoio) |
| `/perfil` | Confirmação editável do que o sistema entendeu (exigência da ADR-0003) |
| `/mapa` | O roadmap |
| `/catalogo` | Condição A do experimento |

Três decisões de desenho:

- **"Ainda não sei" é o padrão na ênfase.** No minuto zero o iniciante não tem preferência
  formada; forçar a escolha entre frontend e backend produz uma decisão arbitrária que
  enviesa o roadmap inteiro. Sem ênfase, o track roda com os pesos neutros.
- **Crédito ao vivo durante a avaliação.** O contador de "já no seu mapa" sobe a cada
  resposta. Começar em zero deprime a autoeficácia de quem já sabe alguma coisa, e o crédito
  aqui é real — vem do mesmo motor de elegibilidade, não é progresso fabricado.
- **O seletor de perfis virou rodapé discreto**, rotulado como demonstração. É ferramenta de
  quem apresenta o sistema, não parte do produto.

O perfil vive no `localStorage` por enquanto. O motor é TypeScript puro, então roda no
cliente sem adaptação — quando o Postgres entrar, só a origem do perfil muda, e nada do
domínio precisa ser tocado. A leitura usa `useSyncExternalStore`, não `useEffect`: ler
armazenamento externo em efeito causa render em cascata e um flash de tela vazia.

**Ainda fora:** a sondagem objetiva (tela 4 da especificação). Ela depende de itens de
verificação que ainda não foram escritos — 2 a 3 questões para as 5 competências que travam
outras. Sem ela, tudo no perfil é `self-report`, e o sistema já trata isso corretamente:
a origem da evidência define a confiança.
