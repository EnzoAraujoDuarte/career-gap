# ADR-0011 — A trilha desenhada como estrada

**Status:** aceito · **Data:** 2026-10-15 · **Revisa a ADR-0008** (só a proibição de traço desenhado)

## Contexto

A ADR-0008 trocou o canvas com pan e zoom por um fluxo vertical, e proibiu reintroduzir "traço
desenhado" sem revisá-la. Os motivos foram três:
- a fonte manuscrita nos rótulos ficava ilegível;
- o produto tinha duas interfaces, uma no desktop e outra no celular;
- o traço orgânico virava ruído com 25 nós.

O Enzo apontou o Trilha Info (trilha.info, Apache-2.0) como "muito parecido com o que eu
queria". A análise está em `docs/COMPARACAO-CURRICULOS.md` §3. Lá, a trilha é **uma estrada
vertical**: um traço suave passa pelo centro real de cada estação, e o trecho percorrido é pintado
por cima. Ela responde aos três motivos da ADR-0008:
- os rótulos ficam em fonte de interface, sempre a 100%;
- é uma tela só, sem pan e sem zoom, que se adapta pelo CSS;
- é um traço único, e as estações se dividem em níveis que terminam numa entrega.

## Decisão

`/trilha` passa a ser desenhada como estrada (`src/components/path/road.tsx`).

- **O traço** é um SVG atrás das estações. Ele passa pelo centro de cada marcador, medido no DOM
  com `offsetLeft`/`offsetTop`, que ignoram `transform`. Entre dois pontos, a curva é uma Bézier
  com as alças na metade da distância vertical. O balanço em torno do eixo segue um padrão fixo:
  o mesmo catálogo desenha sempre a mesma estrada.
- **O trecho percorrido** vai até a primeira estação que ainda pede estudo. Ficam para trás o que
  a pessoa já sabe e o que o motor marcou como "não agora".
  - Esse ponto é o **você está aqui** (`buildPathView().hereId`).
  - Antes, ele era o nível da primeira recomendação. Esse critério falhava quando o ranking
    recomendava algo do nível 4 e ainda havia lacuna no nível 1: a tinta atravessava o que a
    pessoa não sabia.
- **Onde e o que fazer** são respostas separadas. O "você está aqui" responde onde a pessoa
  está. As até três marcas "recomendado agora" respondem o que fazer, cada uma com o motivo. A
  ADR-0009 continua valendo: nada tranca, toda estação abre.
- **Cada nível** começa num marco numerado e termina numa bandeira com "ao fim do nível, você
  consegue". Os livros são um desvio tracejado ao lado da estrada.
- **A identidade continua a nossa:** papel, tinta e azul de ação, com Shantell Sans só na voz da
  anotação. O tema escuro, o magenta e o brilho do Trilha Info **não** foram adotados.
- **Movimento:** o trecho percorrido se desenha uma vez por carregamento. Com movimento
  reduzido, aparece pronto.

## Consequências

- A proibição de "traço desenhado" da ADR-0008 fica limitada ao traço irregular de canvas (o
  rough.js). Um traço único e geométrico na trilha vertical é permitido.
- O resto da ADR-0008 vale: uma interface só, sem pan e sem zoom, e manuscrita só na anotação.
- Os dados não mudam. A estrada consome a mesma `buildPathView` da lista anterior, e as condições
  do experimento continuam comparando seleção e ordem, não forma.
- Atribuição: a técnica foi reescrita, não copiada, e o crédito ao Trilha Info está no cabeçalho
  de `road.tsx`.
- O espécime em `/estilos` continua como registro das seis direções comparadas, com uma nota que
  aponta para a trilha.
