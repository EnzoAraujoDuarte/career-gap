# Ecossistema em volta do roadmap — base

> **Superado em parte em 2026-10-15** (`PLANO-FASE4.md`): Projetos, Kit, Biblioteca e
> Comportamental viraram filtros e abas do Explorar; a agenda do Plano saiu; propósito e meta
> foram para a Minha área. O conteúdo e as decisões abaixo continuam valendo.

Data: 2026-10-15. Pedido do Enzo: transformar o projeto num roadmap com, em volta dele, um
ecossistema de desenvolvimento profissional e comportamental para iniciantes. Visual completo
fica para o fim, por decisão dele — o que existe aqui é a base funcional.

## Princípio: um estado, todos os espaços

O que separa isto de "um site com várias páginas de conteúdo" é que **todos os espaços leem o
mesmo estado de competências** e aplicam a mesma lógica do roadmap: aparece para todos, é
destravado pelo que a pessoa já sabe, e o "não agora" vem com o motivo.

Isso também mantém o TCC coerente. A tese é seleção e ordenação a partir do estado do usuário;
o ecossistema estende essa tese para ferramentas, projetos e rotina, em vez de competir com ela.

## Os seis espaços

| espaço | o que é | movido por | rota |
|---|---|---|---|
| **Mapa** | o roadmap; cada ficha ganhou prática garantida, missões e hábitos | motor (inalterado) | `/mapa` |
| **Projetos** | toda a prática do catálogo por dificuldade: primeiros projetos (14), projetos de verdade (4), marcos de prova (10) | pronto quando nenhuma competência treinada está bloqueada | `/projetos` |
| **Kit** | 13 ferramentas do dev de 2026, cada uma com portão de competência | `assessTools` — mesmo `levelAtLeast` do motor | `/kit` |
| **Comportamental** | 26 hábitos em 6 temas (20 ligados a fichas + 6 de postura geral) e as competências comportamentais do mapa | catálogo | `/comportamental` |
| **Biblioteca** | 15 livros do catálogo, do mais acessível ao mais exigente, e as 3 obras por trás dos hábitos, com ISBN | catálogo | `/biblioteca` |
| **Plano** | propósito, meta, intenção de implementação, meta de aprendizagem e a semana | roadmap + compromisso escrito pela pessoa | `/plano` |

O kit já diferencia pessoas: o iniciante absoluto recebe só VS Code e Git; o autodidata de
front-end recebe também DevTools, GitHub e Prettier, mas **não** o assistente de IA, porque não
declarou depuração; o estudante de computação recebe o assistente de IA, mas não o DevTools,
porque não declarou HTML.

## Decisões

1. **"Kit" como nome do espaço de ferramentas.** Curto, cabe na navegação do celular, e prepara
   o marco de prova "monte o seu kit pessoal" (`PLANO-FASE3.md` §10).
2. **Toda ferramenta de IA presa a depuração**, direta ou indiretamente — teste estrutural na
   suíte. A ferramenta não chega antes da competência que a torna segura (Shen e Tamkin, 2026).
3. **Meta de aprendizagem, não de resultado.** Metas específicas superam "faça o seu melhor",
   mas, para quem aprende tarefa complexa, meta de aprendizagem supera meta de resultado
   (Locke e Latham, 2002). A meta proposta é a competência em foco no mapa, com os critérios de
   saída dela — não "conseguir o emprego", que fica como meta de carreira, à parte.
4. **Intenção de implementação.** O plano pede "quando ___, eu estudo". Metanálise de Gollwitzer
   e Sheeran (2006): 94 estudos, d ≈ 0,65 sobre a intenção de meta sozinha. **Conferir os
   números no capítulo original antes de citar no TCC** — foram lidos em fontes secundárias.
5. **Propósito escrito pela pessoa**, com as palavras dela. Há um preprint (arXiv 2605.12344)
   sugerindo que metas escritas por IA minam a motivação; não foi lido e não deve ser citado.
6. **Semana: recomendado → prática → extras.** Seguir a ficha na ordem fazia um curso longo
   ocupar a semana e a prática nunca chegar. Duração lida do tempo declarado, da parte
   recomendada ("~N" entre parênteses), do título ("em 3 Horas") e, por último, do padrão do tipo.
7. **Livros sem link para cópia.** A biblioteca indica as obras canônicas pelo ISBN.

## Fundamentação nova

- LOCKE, E. A.; LATHAM, G. P. Building a practically useful theory of goal setting and task
  motivation: a 35-year odyssey. *American Psychologist*, v. 57, n. 9, p. 705-717, 2002.
  DOI 10.1037/0003-066X.57.9.705.
- GOLLWITZER, P. M.; SHEERAN, P. Implementation intentions and goal achievement: a
  meta-analysis of effects and processes. *Advances in Experimental Social Psychology*, v. 38,
  p. 69-119, 2006.
- HUNT, A.; THOMAS, D. *O programador pragmático: de aprendiz a mestre*. Porto Alegre: Bookman,
  2010. Dicas conferidas no texto desta edição.
- BECK, K. *Programação extrema (XP) explicada: acolha as mudanças*. Porto Alegre: Bookman,
  2004. Práticas e valores conferidos contra o texto da 1ª edição.

## Ficou de fora, de propósito

- **Visual.** Decisão do Enzo: mudança completa no fim.
- **Banco de dados.** Tudo no navegador (`localStorage`), como o perfil.
- **Feedback de progresso no plano** (marcar sessão feita). Meta com feedback rende mais que meta
  sozinha (Locke e Latham, 2002) — é o próximo passo natural do Plano.
- **Kit pessoal como repositório-template público** (`PLANO-FASE3.md` §10).
- **Separar prova pública de prova por exercício.** A curadoria original marcou como PROVE jogos
  e exercícios com conferência (Flexbox Froggy, SQLBolt); a seção de marcos foi redigida para ser
  verdadeira para todos, mas um campo próprio deixaria o portfólio mais claro.
- **Vídeo do canal O Novo Programador** — pendente de ser assistido (`SOURCES.md` §9).

## Impacto no TCC

- **Experimento preservado.** Hábitos, missões e a vaga de prática estão no componente de ficha
  usado pelas DUAS condições, então continuam idênticas entre A e B. Os espaços novos ficam fora
  da sessão experimental.
- **A vaga de prática muda a seleção de recursos nas duas condições** — registrar na seção 3.2
  como regra do seletor.
- **Texto.** A seção 3 pode descrever o ecossistema como parte do artefato; a avaliação continua
  sendo sobre o mapa. Se o Plano for descrito, Locke e Latham e Gollwitzer e Sheeran entram no
  referencial.
- **Versão do catálogo:** `2026.10.15-1`.

## Estado

78 testes; 137 recursos; 26 hábitos; 13 ferramentas; validação do catálogo sem problemas.
