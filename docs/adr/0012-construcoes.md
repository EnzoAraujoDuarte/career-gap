# ADR-0012 — Construções: o roadmap liga saber a conseguir fazer

**Status:** aceito · **Data:** 2026-10-16 · **Referências:** `docs/REFERENCIAS-UX.md`

## Contexto

O pedido do dono do produto: a pessoa precisa sentir, desde o primeiro acesso, que já consegue
criar algo. A trilha, mesmo aberta e anotada, apresentava 26 competências a aprender; para quem
está começando, isso lê como uma lista do que falta. A pesquisa de referências mostrou o mesmo
padrão em quem dá certo: Hyperskill organiza o estudo em projetos por estágios e os tópicos
servem ao estágio; Frontend Mentor começa todo mundo por um componente de poucas horas;
roadmap.sh lista projetos por dificuldade com verbos de ação. A psicologia por trás é a
autoeficácia de Bandura: a experiência de domínio é a fonte mais forte, e fracasso cedo é o que
mais derruba. Progresso visível que já foi conquistado também ajuda a continuar (efeito do
progresso dotado, Nunes e Drèze, 2006), desde que o progresso seja real.

## Decisão

1. **Entra uma entidade de catálogo, `Build` (construção):** algo concreto que a pessoa faz e
   mostra, em horas, com `requires` (competência e nível), `exercises`, passos, critério de
   pronto e recursos do catálogo. Texto nosso; recursos continuam links (ADR-0005). Onze
   construções, duas a três por nível; exatamente uma sem exigência, no primeiro nível: a porta
   de entrada ("Uma página sobre você").
2. **O motor avalia, não tranca.** `assessBuilds` compara cada exigência ao perfil e anota:
   construído, dá para fazer agora, falta só uma, mais adiante. Toda construção abre para todo
   mundo; a anotação carrega o motivo (ADR-0009). É a mesma lógica do portão de ferramenta.
3. **A trilha começa pelo que a pessoa já constrói.** Sem perfil: a porta de entrada e o convite
   às 6 perguntas. Com perfil: o que está pronto, o que fica a um passo e "N de 11 ao seu
   alcance". Cada nível da estrada fecha na bandeira com as construções do nível; cada estação
   diz o que destrava quando é a única exigência que falta.
4. **Terminar uma construção é progresso guardado**, na mesma tabela do progresso de recursos,
   com a chave `build:<id>`. Marcar não muda o nível: quem muda é a autoavaliação
   (`docs/DECISOES.md` §3).
5. **Prompt para o assistente de IA que a pessoa já usa**, montado por template a partir do
   catálogo e do perfil, na página da competência e na da construção. Não há IA dentro do
   produto; o motor decide e o prompt pede um tutor que pergunta e confere contra os critérios
   (ADR-0004).

## Rejeitado

- **Projetos como recurso externo** (só links para Odin, freeCodeCamp): não responde "o que eu
  já consigo fazer", porque um recurso não declara o que exige.
- **IA embutida para gerar projetos:** fere a ADR-0004 e cria custo e dependência sem ganho
  para a tese; o prompt exportável entrega o uso de IA na posição certa.
- **Tabela nova para construções concluídas:** exigiria migração no banco de produção para
  guardar um booleano por item; a tabela de progresso já é "um item com datas".

## Consequências

- O validador ganha regras para construções: exigências dentro do alvo do track, nível da
  trilha existente, nenhuma exigência de um nível posterior, cada nível com construção e uma
  única porta de entrada.
- O texto do TCC ganha uma camada explicável a mais: além de "o que estudar", "o que você já
  constrói e por quê".
- A condição de controle do experimento (`/catalogo`) continua sem construções até o desenho
  ser revisto com o orientador.
