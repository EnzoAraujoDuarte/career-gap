# ADR-0006 — Renderização do roadmap: React Flow + dagre + rough.js

**Status:** **superada pela ADR-0008 (2026-09-16)** · **Data:** 2026-09-10

> O canvas foi substituído por um fluxo vertical sem pan/zoom. Motivo principal: ~80% do
> público acessa por celular, e o canvas obrigava a manter duas interfaces — sendo a da
> maioria a secundária. A análise de bibliotecas abaixo permanece válida como registro.

## Contexto

O canvas é o diferencial visual, mas não pode consumir o cronograma. Opções avaliadas:
tldraw, Excalidraw como biblioteca, React Flow, Cytoscape.js, SVG próprio.

- **tldraw**: desde a SDK 3.x exige licença comercial paga ou exibição de marca d'água.
  Inaceitável para um projeto que pode virar produto.
- **Excalidraw**: MIT, porém é um *editor de desenho*. O usuário não vai desenhar o roadmap;
  trazer o chrome de um editor é peso e ruído.
- **React Flow (@xyflow/react)**: MIT, sem marca d'água, nós e arestas totalmente customizáveis,
  pan/zoom/fitView prontos, foco por teclado e suporte a leitor de tela embutidos,
  `BaseEdge` aceita caminho SVG arbitrário.

## Decisão

**React Flow (MIT) + `@dagrejs/dagre` para layout em camadas + `rough.js` (~9 kB) para o traço
à mão + Excalifont (OFL-1.1) em rótulos e anotações.**

- `rough.js` sempre com `seed` determinístico derivado do id do nó/aresta.
- Fonte manuscrita apenas em títulos de nó, rótulos e anotações; corpo e formulários em fonte
  de alta legibilidade.
- **A visão em lista/stepper não é um extra: é a apresentação padrão no mobile e a alternativa
  acessível ao canvas.** Ambas leem o mesmo modelo.

## Consequências

- Sem custo de licença, sem marca d'água, identidade visual própria (não é clone do Excalidraw).
- Layout automático dispensa posicionar nós à mão e sobrevive a mudanças no catálogo.
- Sem `seed` fixo o traçado se redesenha a cada render e o mapa parece instável — é requisito,
  não detalhe.
- Construir a lista antes do canvas garante entregável funcional mesmo se o canvas atrasar.
