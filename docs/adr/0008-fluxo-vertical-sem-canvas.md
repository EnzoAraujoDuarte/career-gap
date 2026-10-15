# ADR-0008 — Fluxo vertical editorial no lugar do canvas

**Status:** aceito · **Data:** 2026-09-16 · **Supera a ADR-0006**

## Contexto

A ADR-0006 escolheu React Flow + dagre + rough.js para um canvas de quadro branco com
pan/zoom. A implementação funcionou, mas três problemas apareceram com o uso:

1. **Legibilidade.** A manuscrita fazia dois trabalhos e só um bem. Anotar (`VOCÊ ESTÁ AQUI`,
   `NÃO AGORA`) funciona; rotular conteúdo não — rótulo se lê de relance, muitas vezes com o
   canvas abaixo de 100% de zoom. Agravante: a face escolhida (Architects Daughter) tem
   altura-x baixa.
2. **Duas interfaces.** Canvas no desktop e lista no celular. O dono do produto estima que
   **~80% do público acessará por celular** — ou seja, a experiência principal foi construída
   para a plataforma minoritária, e a que atende a maioria era a secundária.
3. **Velocidade de leitura.** O pedido explícito era "rápido, direto ao ponto, fácil
   visualização". Traço orgânico é charmoso com 5 nós e vira ruído com 25.

Seis direções visuais foram comparadas sobre o mesmo conteúdo real do catálogo, em
`/estilos`: (A) atual desenhado, (B) anotação sobre estrutura, (C) planta técnica, (D) mapa de
metrô, (E) caderno editorial e (F) fluxo editorial sem canvas.

## Decisão

Adotar **F: fluxo vertical fixo com tipografia editorial, sem pan e sem zoom.**

- Uma interface só, que reflui por CSS. Celular e desktop são a mesma tela.
- O painel de detalhe deixa de existir: o conteúdo abre **dentro** do próprio nó.
- O DAG vira vertical pelas **ondas que o motor já calcula** — "Também alcançável agora",
  "Em seguida", "Mais adiante". Indentar por filho seria mentira, porque um nó costuma ter
  vários bloqueadores; a dependência aparece como texto ("abre depois de X").
- A condição A do experimento (`/catalogo`) usa **o mesmo componente de estação**, com os
  mesmos recursos por competência. É o que a `docs/DECISOES.md` §1 exige: só a seleção e a
  ordenação variam entre as condições.

### O que carrega a identidade agora

Papel quente, paleta de tinta e a **voz da anotação** — `← você está aqui`, `← comece aqui`,
`não agora`. A manuscrita passa a ser a única coisa manuscrita na tela, e por isso volta a se
destacar. A face passa a ser **Shantell Sans** (OFL), que tem altura-x maior e foi desenhada
para permanecer legível.

## Consequências

- **Saem do projeto:** `@xyflow/react`, `@dagrejs/dagre` e `roughjs`. As dependências de
  produção caem para `next`, `react` e `react-dom`. Sai junto a obrigação de exibir a
  atribuição do React Flow.
- **Perde-se** a metáfora do quadro branco quase inteira, e com ela o diferencial visual
  registrado no `AGENTS.md`. É uma perda real, aceita em troca de legibilidade e de atender a
  plataforma da maioria.
- **Risco assumido:** as condições A e B do experimento ficam visualmente parecidas. A
  diferença passa a ser conteúdo e ordem — que é exatamente a variável sob teste, mas reduz a
  saliência da manipulação. O *manipulation check* da `DECISOES.md` §1 fica ainda mais
  necessário.
- `/estilos` é mantida como registro do método, com as fontes de comparação isoladas no layout
  daquela rota para o produto não pagar por elas.

## Regras de ruído que surgiram na implementação

Nenhuma aparecia no espécime de 6 nós; todas apareceram com os 25 reais:

1. Só razões que **diferenciam** aparecem na visão fechada. "É essencial para o objetivo"
   repetia em oito itens seguidos — verdadeiro e inútil.
2. `abre depois de X` dispensa a frase genérica de bloqueio: nomear o bloqueador informa mais.
3. Itens do NÃO AGORA com a mesma justificativa viram uma linha só.
4. O selo de tecnologia sai de **um caminho único** (`src/lib/tech-badge.ts`). A regra de
   redundância já tinha sido esquecida uma vez, e a condição A exibiu "HTML semântico — com
   HTML".


## Auditoria de celular (2026-09-16)

Medida em 375px, no perfil `self-taught-frontend` com os 25 nós:

| Verificação | Resultado |
|---|---|
| Overflow horizontal | nenhum — `scrollWidth` igual ao viewport |
| Texto abaixo de 11px | 0 (eram 9; etiquetas subiram de 10,5 para 11,5px) |
| Alvos de toque abaixo de 24px | 3, todos no rodapé de demonstração, que sai do produto |

Correções aplicadas: caixa de seleção do critério de saída passou a 16px com o rótulo inteiro
virando alvo; título de nó recolhível ganhou área vertical; link de recurso ganhou área sem
alterar o layout.

**Limitação do ambiente:** a ferramenta de captura desta sessão não consegue fotografar a
página rolada — devolve tela em branco mesmo com o elemento posicionado no centro do viewport
(confirmado por `elementFromPoint` e `getBoundingClientRect`). A verificação abaixo da dobra
foi feita por medição no DOM, não por inspeção visual. Vale uma conferência manual em aparelho
real antes da coleta.
