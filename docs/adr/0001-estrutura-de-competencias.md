# ADR-0001 — Estrutura de competências com pré-requisitos duros, não "Skill Graph" genérico

**Status:** proposto · **Data:** 2026-09-10

## Contexto

`SYSTEM_SPEC.md` §8 propõe um Skill Graph com relações `prerequisite_of`, `related_to`,
`specialization_of`, `unlocks`, `recommended_before`. Cinco tipos de aresta em um catálogo de
~25 competências produz um grafo denso cuja maior parte não é verificável — vira opinião dos
autores com aparência de estrutura. A questão crítica do `INITIAL_SCOPE.md` §22 ("com base em
quê afirmamos que A vem antes de B?") ficaria sem resposta defensável.

## Decisão

Modelar uma **estrutura de competências** no sentido da *Competence-based Knowledge Space
Theory* (CbKST):

- Um único tipo de aresta persistida: **pré-requisito duro**, com `min_level` na origem.
- Critério de admissão da aresta: *B é inviável ou incompreensível sem A no nível L*.
  Se a afirmação correta for "é melhor aprender A antes", **não é aresta** — é peso no escore.
- `unlocks` não é armazenado: é a aresta invertida, calculada.
- `related_to` / `specialization_of` só entram se uma funcionalidade concreta exigir.
- Toda aresta carrega `rationale` e `sources[]`.

O conjunto de competências elegíveis ("o que estou pronto para aprender") é o **outer fringe**
do estado atual — conceito já formalizado na literatura, não inventado aqui.

## Consequências

- O grafo fica esparso e cada aresta é defensável individualmente na banca.
- Ordem entre competências igualmente elegíveis passa a ser responsabilidade do escore
  (ADR-0002), que é versionado e auditável — e não de uma aresta implícita.
- Elegibilidade vira cálculo booleano trivial (fecho transitivo sobre um DAG pequeno):
  rápido, testável, sem dependência de LLM.
- Perde-se a capacidade de expressar "afinidade" entre competências. Aceito: nenhuma tela do
  MVP precisa disso.
