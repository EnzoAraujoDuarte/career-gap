# ADR-0009 — Orientar sem prender: o motor anota, nunca tranca

**Status:** aceito · **Data:** 2026-10-15 · **Detalhes:** `docs/PLANO-FASE4.md`

## Contexto

O produto prescrevia: um foco único ("seu foco agora"), competências "bloqueadas" ("abre
depois de X"), projetos e ferramentas com "espera" e "falta", e uma agenda diária gerada. O
"não agora" era o único bloqueio real: aparecia riscado e sem nenhum recurso. O dono do produto
pediu o oposto — a pessoa estuda o que quiser, quando quiser; o sistema só diz o que estudar e
o que não estudar agora — e apontou o Laracasts como modelo de organização.

A pesquisa (14 plataformas, `PLANO-FASE4.md` §2) mostrou que quase ninguém tranca por motivo
pedagógico (a Codecademy tirou todos os cadeados em 2018) e que nenhuma diz "não estude X
agora, porque Y" com base em quem estuda. A literatura (§4.1) mostrou que controle total do
aprendiz não melhora a aprendizagem (g = 0,05; Karich, Burns e Maki, 2014) e que o que tem
evidência repetida é aconselhar e deixar escolher — controle compartilhado.

## Decisão

1. **O motor não muda; muda o papel da saída.** Elegibilidade, ranking e política de "não
   agora" continuam determinísticos. A interface transforma a saída em anotação: *você já sabe*,
   *recomendado agora* (no máximo 3, com o motivo numérico), *falta base* (com o caminho de
   volta) e *não agora* (com o motivo). Nenhuma anotação desabilita link ou esconde recurso.
2. **Trilha editorial em 4 níveis, a mesma para todos**, com conteúdo concreto por competência.
   O agrupamento é editorial, mas validado: nenhum pré-requisito pode aparecer depois do que ele
   destrava (`path-order` em `validate.ts`).
3. **Catálogo aberto (Explorar)** com filtros e contagem facetada; a direção é um filtro que a
   pessoa escolhe usar.
4. **A agenda gerada sai.** Quando estudar é decisão de quem estuda.
5. **Avaliação em 6 perguntas por tema**, cada frase declarando explicitamente as competências
   que afirma; o que não é perguntado começa em "ainda não". Num catálogo aberto, subestimar
   custa um item a mais recomendado; superestimar esconde conteúdo (ADR-0003).

## Consequências

- O experimento fica mais limpo: as duas condições podem usar a mesma trilha, com e sem a
  camada de anotação. Desenho a confirmar com o orientador.
- Surge uma medida que só existe com liberdade: aderência às recomendações.
- O risco que a literatura aponta — novato escolhe mal porque avalia mal o que sabe — é tratado
  pelo motivo explícito e pelo tom firme em "falta base", sem cadeado.
