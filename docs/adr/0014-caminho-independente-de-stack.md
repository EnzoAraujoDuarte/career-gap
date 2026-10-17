# ADR-0014 — Caminho independente de stack, com escolha da linguagem do servidor

**Status:** aceito · **Data:** 2026-10-17 · **Relaciona:** ADR-0001 (competências, não stacks),
ADR-0009 (orientar sem prender), `docs/PLANO-DIRECAO.md` §3

## Contexto

A ADR-0001 decidiu que o catálogo tem competências, não mapas por linguagem: "construir uma API"
é a mesma capacidade em Node ou em Java, e a tecnologia aparece como selo derivado dos materiais.
O caminho, porém, nunca dizia isso à pessoa, e no terceiro nível a linguagem do servidor ficava
implícita (os materiais eram majoritariamente Node). Quem quer ser dev vai precisar escolher uma
linguagem; o site precisava dizer quando e como, sem contradizer a ADR-0001.

## Decisão

1. **O caminho é independente de stack, e isso é dito explicitamente** na abertura da trilha e no
   bloco de escolha: competências, ordem e lacunas são as mesmas em qualquer linguagem. Nos níveis
   1 e 2 a stack é a própria web (HTML, CSS, JavaScript) e não é escolha.
2. **A escolha existe, é opcional e nunca tranca.** No começo do nível 3 a pessoa escolhe a
   linguagem do servidor entre as `stacks` do track (hoje JavaScript com Node.js e Java com
   Spring), ou "ainda não sei". A escolha fica no perfil (`technologyId`, coluna
   `learner.technology_id`), viaja na sincronização e entra no snapshot do motor.
3. **A escolha só reordena materiais.** Em `selectResourcesFor`, a linguagem escolhida desempata
   entre materiais igualmente acessíveis: o acessível vem primeiro para todo mundo; entre iguais, o
   material na linguagem escolhida (ou agnóstico) passa à frente, com o motivo `YOUR_STACK` ("na
   linguagem que você escolheu"). Competências, arestas, lacunas e ranking não leem a escolha
   (teste).
4. **Só se oferece linguagem com material.** O validador exige que cada `stack` do track exista no
   catálogo de tecnologias e tenha pelo menos dois materiais verificados nas competências do
   track. Python/Django e PHP/Laravel ficam fora até terem material (PLANO-DIRECAO §3).

## Consequências

- A pessoa ouve do site o que o autor diz: a lógica é a base, a linguagem é ferramenta, e quem
  aprende uma aprende a outra.
- O experimento não muda: a variável manipulada continua sendo seleção e ordenação por lacuna.
  A preferência de linguagem é a mesma nas duas condições, porque só toca os materiais.
- Mais uma coluna no `learner` (migração `0003_linguagem_do_servidor`). Aplicar no Neon `main`
  antes de publicar.
