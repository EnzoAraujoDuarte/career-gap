# ADR-0015 — Vídeo em português primeiro em cada estação

**Status:** aceito · **Data:** 2026-10-17 · **Relaciona:** ADR-0005 (só links), ADR-0014
(independente de stack), `docs/research/videos-pt-verificados.json`

## Contexto

O dono do produto achou fracos boa parte dos materiais de abertura: livros, artigos e
documentação, alguns em inglês, outros antigos. Para quem começa em desenvolvimento no Brasil, o
caminho mais curto é um vídeo em português, recente e bem avaliado. A regra de ordenação dizia
"o mais acessível primeiro" (nível mínimo) e não olhava formato nem idioma do vídeo.

Em 2026-10-17 foi feita uma busca no YouTube por competência, filtrando vídeos falados em
português (legenda automática e título original conferidos; o YouTube traduz títulos de canais
estrangeiros), no assunto, de até dois anos, priorizando recência e avaliação. Saíram 76 vídeos,
até três por competência. O dono do produto aprovou a lista inteira e pediu que, em cada
competência, os vídeos fiquem do mais novo para o mais antigo.

## Decisão

1. **Os vídeos curados abrem a estação, do mais novo para o mais antigo.** Cada recurso pode ter
   `featured`, uma posição por competência, e `published`, a data de publicação; a ordenação
   começa pela posição, e o validador cobra que a posição siga a data. A linha do material mostra
   o mês e o ano.
2. **Depois deles, qualquer vídeo vem antes de texto.** Vídeo é `actionType: 'WATCH'`.
3. **Dentro de cada grupo, a regra antiga continua:** o mais acessível primeiro, quem ensina
   antes de quem pede prática, a linguagem escolhida desempata, depois idioma, gratuidade e id.
4. **A vaga de prática continua garantida** no cartão da estação (`withPracticeSlot`).
5. **O validador cobra a ordem curada:** a posição só vale numa competência que o recurso lista,
   e não há duas posições iguais na mesma competência.

## Consequências

- O "comece aqui" das 26 estações passa a ser um vídeo em português (teste).
- O catálogo vai de 157 para 230 materiais, 177 em português.
- Os números de visualização e curtidas são do dia da busca e envelhecem; a data fica no `why`
  de cada vídeo. Uma nova busca vira uma nova lente, não edição desta.
- O experimento não muda: os materiais por competência são os mesmos nas duas condições.
