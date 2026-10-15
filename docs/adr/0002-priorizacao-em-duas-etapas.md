# ADR-0002 — Priorização em duas etapas, com soma ponderada em vez de produto

**Status:** proposto · **Data:** 2026-09-10

## Contexto

`INITIAL_SCOPE.md` §12 e `SYSTEM_SPEC.md` §11 propõem
`priority = gap × target_weight × prerequisite_weight × confidence_factor`.

Problemas: (a) um fator próximo de zero aniquila o escore inteiro, escondendo gaps relevantes;
(b) a magnitude resultante não tem significado interpretável; (c) confiança da avaliação é
*incerteza*, não *importância* — multiplicá-la penaliza o usuário por não termos medido bem;
(d) é difícil defender a escolha dos expoentes implícitos na banca.

## Decisão

Três etapas separadas e nomeadas:

1. **Elegibilidade (estrutural, booleana).** Pré-requisitos satisfeitos → `available`;
   caso contrário `blocked`, com a lista do que bloqueia. Nada de escore aqui.
2. **Ranking (escore).** Entre os `available`, soma ponderada de componentes normalizados em
   [0,1], com pesos publicados e versionados no catálogo:
   `score = w1·gap_size + w2·criticality + w3·unlock_count`.
   Cada parcela é persistida em `score_breakdown`.
3. **Política editorial (só rebaixa).** Regras nomeadas que movem itens para `not_now` ou
   demovem posição, cada uma emitindo um `reason_code` legível
   (ex.: `PREMATURE_SPECIALIZATION`, `LOW_IMPACT_FOR_TARGET`). Nenhuma regra promove.

Confiança **não** entra no escore. Confiança baixa em competência que trava outras gera a flag
`needs_verification` e um passo barato de verificação no roadmap.

## Consequências

- O TCC consegue exibir um exemplo trabalhado: entrada → parcelas → escore → regras acionadas
  → posição final.
- Cada etapa é testável isoladamente; regras de política são testes de unidade óbvios.
- Ajustar pesos não exige reprocessar a estrutura, e `catalog_version` mantém os resultados
  já coletados reprodutíveis.
- Soma ponderada permite que um item com um componente zerado ainda apareça. Correto:
  um gap sem pré-requisitos pendentes continua sendo um gap.
