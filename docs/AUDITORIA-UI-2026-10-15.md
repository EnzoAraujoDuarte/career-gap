# Auditoria técnica de interface — 2026-10-15

Telas: `/trilha`, `/explorar`, `/minha-area`, `/competencias/[id]`, `/privacidade`, `/avaliacao`.
Método: skill `impeccable` (modo *audit*), detector automático nas páginas ao vivo, cálculo de
contraste dos tokens e inspeção do DOM. Escopo: acessibilidade, estados e clareza — **sem
redesign visual**, que fica para o fim por decisão do Enzo.

## Nota

| # | Dimensão | Nota | Achado principal |
|---|---|---|---|
| 1 | Acessibilidade | 2 → 3 | âmbar de "atenção" com contraste 3,3:1; opção escolhida da avaliação sem estado para leitor de tela |
| 2 | Desempenho | 3 | sem problema relevante; a barra de progresso animava `width` |
| 3 | Responsivo | 3 | coluna única fluida; alvos de toque de 27 px nos controles de progresso |
| 4 | Temas | 3 | tokens semânticos em quase tudo; sem modo escuro (não pedido) |
| 5 | Integridade | 3 | rótulos acima dos títulos repetindo a informação |
| **Total** | | **14 → 15/20** | **Bom** |

## Achados

| Sev. | Achado | Onde | Correção |
|---|---|---|---|
| P1 | `--state-attention` (#c07b26) como texto: 3,33:1 no papel, 3,00:1 em `paper-edge` (WCAG 1.4.3 pede 4,5:1) | "falta base", "ainda não", etiquetas de aviso, erro de conexão | **feito:** token escurecido para #955f1d, mesmo matiz: 5,17 / 4,66 / 4,66 |
| P1 | Opção escolhida na avaliação marcada só pela borda (WCAG 4.1.2) | `self-assessment.tsx` | **feito:** `aria-pressed`, inclusive em "Ainda não" |
| P2 | Número entre parênteses do filtro selecionado: `ink-faint` sobre `tint-now` = 4,11:1 | `explore-screen.tsx` | **feito:** `ink-soft` (4,91:1) |
| P2 | Alvos de toque de 27 px em "+ minha lista" e "concluído" (produto mobile-first) | `progress-controls.tsx` | **feito:** 44 px de área de toque |
| P2 | 404 e erro inesperado caíam nas telas padrão do Next, em inglês | `app/` | **feito:** `not-found.tsx` e `error.tsx` em português |
| P2 | Salvar propósito e meta não dava retorno visível | `my-area-screen.tsx` | **feito:** "Guardado" anunciado a leitor de tela |
| P3 | Rótulos "TRILHA" e "NÍVEL N" acima dos títulos, repetindo a navegação e o numeral | `path-screen.tsx` | **feito:** removidos; o nível segue anunciado no título para leitor de tela |
| P3 | Título da aba genérico em `/avaliacao` e `/perfil` (WCAG 2.4.2) | `app/` | **feito** |
| P3 | Links que abrem em nova aba sem aviso | `resource-line.tsx`, aba de ferramentas | **feito:** aviso oculto para leitor de tela |
| P3 | Barra de progresso animando `width` | `self-assessment.tsx` | **feito:** `transform: scaleX` |

## Fica para a reforma visual (decisão do Enzo)

O detector também aponta **fundo creme**, **Inter como fonte principal**, **espaçamento largo em
rótulos** e **linhas de 89 a 107 caracteres** (o ideal é até ~75). Os três primeiros são decisões
de identidade — o `CLAUDE.md` pede fundo "warm off-white" — e foram registrados como achados de
direção desde a primeira auditoria. O comprimento de linha depende do corpo do texto e da largura
da coluna, e entra junto com a tipografia na reforma.

## O que está bom

Rótulos de formulário e de caixa de seleção corretos; `lang="pt-BR"`; foco visível em todo
controle; contagem do Explorar em região viva; confirmação em dois passos e `role="alert"` em
"Apagar meus dados"; estados de carregando e vazio presentes em todas as telas.
