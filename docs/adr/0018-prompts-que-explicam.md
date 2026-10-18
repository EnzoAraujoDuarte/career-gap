# ADR-0018 — Prompts de IA que explicam, em vez de proibir

**Status:** aceito · **Data:** 2026-10-17 · **Relaciona:** ADR-0004 (o motor decide, a IA explica),
ADR-0005 (só links), ADR-0014 (independente de stack)

## Contexto

O site oferece prompts prontos para a pessoa colar no assistente de IA que já usa. Até aqui havia
dois, de estudo e de construção, e os dois proibiam código: "Não me dê a solução pronta", "sem
corrigir por mim". O dono do produto pediu prompts que rendam bons códigos e boas explicações, num
texto humano, direto, com exemplos do dia a dia e regras de livros como O Programador Pragmático e
XP quando couberem. O prompt antigo também tinha um erro de português ("Hoje eu faz com apoio").

A pesquisa de outubro de 2026 apontou na mesma direção:

- Shen e Tamkin (2026), ensaio com 52 devs: o grupo com IA aprendeu 17% menos, mas três jeitos de
  usar preservaram o aprendizado: perguntar conceitos, pedir código junto com a explicação, e
  gerar o código e depois perguntar até entender. Delegar, ir passando o trabalho aos poucos e
  usar a IA só para depurar foram os piores.
- Eastwood e outros (2026), ensaio com 132 estudantes de programação: o assistente socrático mais
  restritivo foi o pior avaliado e levou mais gente a usar outra IA, sem ganho de compreensão.
- Bastani e outros (PNAS, 2025): IA livre derrubou a prova em 17%; prompts de tutor evitaram a
  perda. Guarda-corpo ajuda; proibição total afasta.
- Os guias da Anthropic, da OpenAI e do Google: contexto em seções, o motivo de cada pedido, dizer
  o que fazer em vez do que evitar, definir o que é pronto, e prompt curto.

## Decisão

1. **Três prompts:** estudar a estação, resolver um exercício com ajuda (novo, na seção Praticar) e
   construir um projeto. Todos em seções: quem sou, o assunto, o que conta como pronto e como a IA
   ajuda.
2. **Código é permitido, sempre explicado.** Se a pessoa pede código, a IA escreve e explica as
   decisões; no exercício, dá pistas em degraus antes da solução, e depois da solução pede para a
   pessoa reescrever sem olhar.
3. **Um jeito de ajudar comum aos três:** colega mais experiente, frases curtas, sem introdução,
   sem elogios e sem resumo no fim; o esforço vai para o que foi pedido; exemplos do dia a dia no
   Brasil, no nível da pessoa; código legível, com erros tratados e sem biblioteca que ninguém
   pediu; uma pergunta de checagem quando fizer sentido, não em toda mensagem. A explicação começa
   do jeito mais simples e sobe de nível só quando a pessoa acompanha, e os termos da área entram aos
   poucos, explicados no fim de cada resposta numa seção "Palavras novas", sem repetir os já vistos.
4. **Hábitos citados vêm do catálogo,** com a fonte conferida, no máximo dois: a IA cita o que está
   no prompt, não um número de dica que lembra errado. Os da tradição "IA tutora" ficam de fora,
   porque dizem como usar a IA, e o próprio pedido já faz isso.
5. **O site preenche só o que sabe:** o que a pessoa já concluiu na estação e as frases do nível
   atual e do pedido, em primeira pessoa. No zero, o prompt diz que ela nunca estudou o assunto.
   Nenhuma linguagem é afirmada: o código vai na linguagem que o assunto pede, ou em JavaScript
   quando tanto faz, até a pessoa dizer que usa outra. A missão do Career Gap vem com o enunciado;
   exercício de outro site, a pessoa cola, porque o catálogo não copia o texto dele.
6. **O hábito "Use a IA como tutora, não como autora" muda de texto** para refletir o estudo que
   cita: pedir código com explicação também preserva o aprendizado; delegar sem entender, não.

## Consequências

- Um teste fixa o teto de tamanho dos prompts em todo o catálogo: passar dele pede cortar, não
  aumentar o teto.
- O hábito mudou, então o catálogo foi para `2026.10.17-2`.
- O Career Gap continua sem IA dentro: os prompts são texto montado por regra, com dados do
  catálogo e do perfil (ADR-0004).

## Fontes

- Shen e Tamkin, How AI Impacts Skill Formation, arXiv:2601.20245, 2026.
- Eastwood e outros, Guardrails or Roadblocks? Effects of Pedagogical Style and Context Awareness in
  AI Teaching Assistants for Programming, arXiv:2609.29995, 2026.
- Bastani e outros, Generative AI without guardrails can harm learning, PNAS 122(26), 2025.
- Anthropic, Best practices for prompt engineering, nov/2025, e Prompting best practices, docs.
- OpenAI, Prompt engineering, docs.
- Philipp Schmid, Gemini 3 prompting: best practices, nov/2025.
