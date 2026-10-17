# ADR-0016 — O celular como app

**Status:** aceito · **Data:** 2026-10-17 · **Relaciona:** ADR-0009 (nada trancado), ADR-0011
(a trilha é uma estrada), ADR-0015 (vídeo primeiro, prática garantida),
`docs/research/celular-referencias-2026-10-17.md`

## Contexto

Cerca de 80% do público usa o celular. O site foi composto para o computador e encolhido: 26
corpos de texto soltos, o mais comum de 13,5px; a trilha tinha 21 telas de altura sem respostas
e 24 com elas, o "você está aqui" na tela 4,6, e cada estação repetia o cartão inteiro de um
material com sete etiquetas e dois botões em texto. O dono do produto pediu que o celular
parecesse um app e que a leitura deixasse de cansar.

## Decisão

1. **Escala de leitura do celular.** Abaixo de 640px, os 26 corpos se agrupam em seis degraus:
   14 (rótulo), 15 (apoio), 17 (corpo, como o Body do iOS), 18, 20 a 23 (títulos), 28 a 30. Campo
   de formulário nunca abaixo de 16px, para o Safari não dar zoom. No computador nada muda.
2. **Abas no rodapé.** No celular, Trilha, Explorar e Minha área descem para uma barra fixa com
   ícone e palavra, no traço de caneta das construções. No computador, a barra continua no topo.
3. **Barra de voltar nas páginas de detalhe.** Estação e construção ganham uma barra presa ao
   topo, com o voltar a um toque e o título que aparece nela quando o título grande sai da tela.
4. **A trilha abre no próximo passo.** O primeiro bloco é o único com fundo, na tinta de "agora",
   com um botão preenchido: "Responder as 6 perguntas" sem perfil, "Abrir a estação" com ele. É o
   único botão preenchido da tela.
5. **Só o nível atual abre sozinho.** Os outros são uma linha na estrada (nome, tamanho, "ver as
   N estações"). O que a pessoa abre fica guardado na sessão, e a volta de uma estação reabre o
   nível dela. Nada é escondido para sempre: fechar não é trancar (ADR-0009).
6. **Estação enxuta na estrada.** Nome, anotação, motivo, o material que abre a estação numa
   ficha de texto e a prática garantida numa linha (ADR-0015). Guardar e concluir ficam na página
   da estação.
7. **Linha de material = título + ficha.** As etiquetas com borda viram texto corrido; só barreira
   (inglês, pago, cadastro) ganha cor. Guardar e concluir viram dois ícones de 44px.
8. **O que é secundário vem depois ou recolhido.** O kit vai para depois da estrada (o próprio
   motor o marca "falta base" para quem começa); a carta é um convite de uma linha no celular; os
   livros de cada nível, a legenda e os materiais além dos primeiros ficam recolhidos.
9. **Manifesto da web.** Na tela de início, o site abre em tela cheia, direto na trilha, com a cor
   do papel no navegador.

## Consequências

- Trilha sem respostas: de 20,8 para 7,4 telas; com perfil, de 23,6 para 9. Nenhum texto abaixo
  de 14px; 71 elementos interativos em vez de 235.
- A estrada continua a mesma estrada (ADR-0011): os pontos são medidos no DOM, e abrir ou fechar
  um nível a redesenha.
- A página de estação perde as etiquetas com borda; o componente `Tag` continua no Kit e nas
  ferramentas.
- A regra de tamanho por nome de classe (`.text-\[13\.5px\]`) é uma ponte: um corpo novo no código
  precisa entrar nela, ou fica fora da escala no celular.
- O experimento do TCC não muda: as mesmas recomendações, na mesma ordem, em outra composição.
