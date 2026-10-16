# Career Gap

Trabalho de Conclusão de Curso em Sistemas de Informação — UNESC Colatina.
Autor: Enzo Araujo Duarte · Orientador: Prof. Riciere Massariol.

**No ar:** https://career-gap-tcc.vercel.app

Quem começa em desenvolvimento web não sofre de falta de conteúdo, mas de falta de direção: não
sabe o que estudar agora, em que ordem, e o que pode deixar para depois. O Career Gap estima o
que a pessoa já sabe, calcula as lacunas em relação à primeira vaga e orienta o estudo **sem
trancar nada**. A mensagem é uma só: você não precisa saber tudo para começar a criar. O sistema
mostra o que a pessoa já consegue construir com o que sabe, o que vale estudar agora, o que falta
de base e o que pode esperar, sempre com o motivo.

## O que ele faz

1. **Seis perguntas** sobre o que a pessoa já faz, cada frase ligada explicitamente às
   competências que afirma.
2. **Lacunas e prioridade** calculadas por um motor determinístico: elegibilidade pelo grafo de
   pré-requisitos, depois ranking ponderado. Mesma entrada, mesma saída — dá para auditar.
3. **Construções**: 11 coisas concretas para fazer e mostrar, de "uma página sobre você" (sem
   exigir nada) a "uma contribuição aceita num projeto de verdade". O motor avalia cada uma contra
   o perfil e anota: dá para fazer agora, falta só uma, mais adiante
   ([ADR-0012](docs/adr/0012-construcoes.md)). É por elas que a trilha começa. Cada uma diz o que
   você precisa ter em mãos e tem o passo a passo marcável.
4. **Trilha em 4 níveis, desenhada como uma estrada**, a mesma para todos, com conteúdo concreto
   (quem ensina, quanto tempo leva) e as marcas pessoais: *você já sabe*, *recomendado agora* (no
   máximo 3), *falta base*, *não agora*. Cada nível fecha nas suas construções; cada estação diz o
   que destrava. O trecho já percorrido fica em tinta, até o *você está aqui*
   ([ADR-0011](docs/adr/0011-trilha-como-estrada.md)).
5. **Explorar**: o catálogo inteiro com filtros: 157 recursos verificados um a um (104 em
   português, 146 gratuitos, 43 de prática ou prova, 15 livros), 18 ferramentas com portão de
   competência e com "como ter" (já vem no computador, conta, programa, dependência do projeto ou
   plugin do Claude Code, com o comando) e 26 hábitos profissionais.
6. **Minha área**: o que você construiu, continuar, minha lista, concluídos, critérios de saída
   marcados, propósito e meta. Fica no navegador e, com o banco ligado, no Postgres.
7. **Prompt para o seu assistente de IA**, em cada competência e construção: montado a partir
   dos critérios, pede um tutor que pergunta e confere, não uma solução pronta. Não há IA dentro
   do produto.
8. **[Kit de desenvolvimento profissional](https://career-gap-tcc.vercel.app/kit)**: as regras de
   código, testes, git e trabalho com IA que o autor usa, reescritas para qualquer stack, como
   marketplace de plugins do Claude Code
   ([repositório](https://github.com/EnzoAraujoDuarte/kit-career-gap)), mais as skills que ele usa
   e os sites para calibrar o olho. Um comando no terminal pergunta o que instalar.

## Princípios

- **O motor decide, a IA não.** Nenhum modelo de linguagem define ordem, prioridade ou recurso
  ([ADR-0004](docs/adr/0004-fronteiras-da-ia.md)).
- **Orientar sem prender**: o sistema aconselha com motivo explícito, a pessoa decide
  ([ADR-0009](docs/adr/0009-orientar-sem-prender.md)).
- **Catálogo só com links** para a página de quem detém os direitos; nada é hospedado
  ([ADR-0005](docs/adr/0005-catalogo-de-recursos-apenas-links.md)).
- **Catálogo como código**, validado por teste: cada competência e cada pré-requisito precisa de
  duas classes de fonte, e a trilha não pode contradizer o grafo
  ([ADR-0010](docs/adr/0010-persistencia-e-login.md)).

## Onde está cada coisa

| Pasta | Conteúdo |
|---|---|
| [`career-gap/`](career-gap/) | O sistema (Next.js). Como rodar: [`career-gap/README.md`](career-gap/README.md) |
| [`docs/adr/`](docs/adr/) | Decisões de arquitetura, curtas |
| [`docs/PLANO-FASE4.md`](docs/PLANO-FASE4.md) | Direção atual: pesquisa de 14 plataformas, evidência sobre controle do aprendiz, banco |
| [`docs/COMPARACAO-CURRICULOS.md`](docs/COMPARACAO-CURRICULOS.md) | O catálogo contra MDN, freeCodeCamp, Odin, Full Stack Open, Tech Guide e Trilha Info; licenças |
| [`docs/REFERENCIAS-UX.md`](docs/REFERENCIAS-UX.md) | As referências de produto e de evidência por trás das construções e do primeiro acesso |
| [`docs/DISCOVERY.md`](docs/DISCOVERY.md) | Modelo de domínio e desenho do motor |
| [`docs/research/`](docs/research/) | Fontes verificadas e os dados que geram o catálogo de recursos |
| [`tcc/`](tcc/) | Documento acadêmico (gerado por script, no formato da UNESC) |

## Estado

116 testes (motor, catálogo, construções, trilha, explorar, banco em Postgres em memória); tipos, lint e
build verificados a cada envio pela integração contínua; cada envio à `main` publica na Vercel.
Banco no Neon, login anônimo por padrão. As páginas chegam renderizadas do servidor, com
`robots.txt` e `sitemap.xml`; o tema segue o do sistema (claro ou escuro). Ainda falta:
- **Credenciais de Google e GitHub.** O login social aparece sozinho quando elas existirem, e a
  página de privacidade passa a citá-lo.
- **Condição de controle do experimento**, que espera o desenho com o orientador.
