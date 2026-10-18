# O Career Gap no celular — medidas e referências (2026-10-17)

Base da ADR-0016. O dono do produto disse que, no celular, "tá tudo muito pequeno e a quantidade
de conteúdo fica ruim pra ler", e pediu que o site parecesse um app.

## Como foi medido

Produção (career-gap-tcc.vercel.app) a 375×812 e 390×844, tema claro, sem respostas; a versão
com perfil foi medida no servidor local, contra o banco de desenvolvimento. "Telas" é a altura
da página dividida pela altura da janela. Os tamanhos de texto são ponderados por caractere
visível. Duas avaliações independentes rodaram em paralelo: uma revisão de design (heurísticas de
Nielsen, carga cognitiva, personas) e o detector da skill impeccable em 19 páginas e 2 larguras.

O detector não achou nenhum problema: ele não mede alvo de toque nem densidade. O problema real
estava nas medidas abaixo.

## Antes e depois

| Medida | Antes | Depois |
|---|---|---|
| Trilha sem respostas: altura | 20,8 telas | 7,4 telas |
| Trilha com perfil: altura | 23,6 telas | 9 telas |
| Trilha sem respostas: onde começa a estrada | tela 3,8 | tela 1,3 |
| Trilha: elementos interativos | 235 | 71 |
| Trilha: texto abaixo de 14px | 59% | 0% |
| Trilha: corpo de texto mais comum | 13,5px | 17px (corpo), 14px (ficha) |
| Primeira tela: ação principal | nenhuma | "Responder as 6 perguntas" ou "Abrir a estação" |
| Estação (HTML semântico): altura | 4,7 telas | 3 telas |
| Explorar: altura | 5,9 telas | 5,1 telas |
| Pesquisa: opções com menos de 44px | 209 | 0 |

Nota da revisão de design antes da mudança: 23/40 (aceitável); carga cognitiva alta, 7 de 8
itens reprovados.

## Números de plataforma

| Item | Valor | Fonte |
|---|---|---|
| iOS, texto padrão | Body 17/22 pt; Subhead 15; Footnote 13; Title3 20; Title2 22; Title1 28 | Apple HIG, Typography |
| Material 3 | bodyLarge 16/24; bodyMedium 14/20; titleLarge 22/28 | Material 3 TextTheme |
| Alvo de toque | Apple 44×44 pt; Android 48×48 dp; WCAG 2.5.8 ≥ 24×24 px | HIG Accessibility; Android; W3C |
| Corpo na web | 16px | digital.gov; web.dev |
| Entrelinha | ≥ 1,5 dentro do parágrafo (WCAG 1.4.8) | W3C |
| Brasil, sistema (set/2026) | Android 78,8%, iOS 21,2% | StatCounter |
| Brasil, telas comuns (set/2026) | 414×896, 384×832, 412×915, 390×844, 393×873, 360×800 | StatCounter |
| Compreensão no celular | texto difícil é lido ~30 ms/palavra mais devagar | NN/g, 2016 |

## Padrões adotados

1. **Abas no rodapé, três destinos, rótulo de uma palavra.** iOS (Music, Books), Material
   navigation bar. A pessoa sempre vê em que lugar está.
2. **A primeira tela retoma o próximo passo.** Apple Books e Codecademy Go abrem no que você está
   fazendo; o Duolingo tem um atalho de volta para o passo atual.
3. **Trilha que mostra o passo atual, não tudo.** Duolingo reduziu o tamanho das unidades por
   serem longas demais; aqui, só o nível atual abre sozinho.
4. **Linha de lista = título + uma linha de apoio.** HIG Lists, Material list. Etiquetas com
   borda viraram texto corrido; só barreira (inglês, pago, cadastro) ganha cor.
5. **Uma ação preenchida por tela.** Material buttons: preenchido para a ação principal,
   contorno para o resto.
6. **Barra de navegação com voltar e título que encolhe.** HIG Toolbars.
7. **Revelação progressiva.** Acordeões fechados por padrão (NN/g Accordions on Mobile):
   níveis, livros, legenda, "mostrar mais" nos grupos de material.
8. **Prateleira horizontal** para as construções, como as fileiras de apps de loja e leitura.
9. **Manifesto da web e `viewport-fit=cover`.** "Adicionar à tela de início" abre em tela cheia
   (web.dev, MDN).

## O que ficou de fora

- Filtros do Explorar numa folha que sobe do rodapé (NN/g Bottom Sheets): os filtros já ficam
  recolhidos atrás de "Filtrar"; a folha é melhoria possível, não urgente.
- Questionário de pesquisa em uma tela por bloco: mudaria a forma do instrumento no meio da
  coleta. As opções ganharam alvo de 44px e cada escala mostra o sentido de 1 e 5.

## Fontes

- https://developer.apple.com/design/human-interface-guidelines/typography
- https://developer.apple.com/design/human-interface-guidelines/tab-bars
- https://developer.apple.com/design/human-interface-guidelines/toolbars
- https://developer.apple.com/design/human-interface-guidelines/lists-and-tables
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://api.flutter.dev/flutter/material/TextTheme-class.html
- https://developer.android.com/develop/ui/compose/components/navigation-bar
- https://raw.githubusercontent.com/material-components/material-web/main/docs/components/button.md
- https://raw.githubusercontent.com/material-components/material-web/main/docs/components/list.md
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html
- https://digital.gov/guides/mobile-principles/tap-targets
- https://gs.statcounter.com/os-market-share/mobile/brazil
- https://gs.statcounter.com/screen-resolution-stats/mobile/brazil
- https://www.nngroup.com/articles/mobile-content/
- https://www.nngroup.com/articles/progressive-disclosure/
- https://www.nngroup.com/articles/mobile-accordions/
- https://www.nngroup.com/articles/bottom-sheet/
- https://www.nngroup.com/articles/mobile-navigation-patterns/
- https://blog.duolingo.com/new-duolingo-home-screen-design/
- https://blog.duolingo.com/intermediate-mini-units/
- https://web.dev/learn/pwa/app-design
- https://developer.mozilla.org/en-US/docs/Web/CSS/env
