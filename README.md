# Career Gap

Trabalho de Conclusão de Curso em Sistemas de Informação — UNESC Colatina.
Autor: Enzo Araujo Duarte · Orientador: Prof. Riciere Massariol.

**No ar:** https://career-gap-tcc.vercel.app

Quem começa em desenvolvimento web não sofre de falta de conteúdo, mas de falta de direção: não
sabe o que estudar agora, em que ordem, e o que pode deixar para depois. O Career Gap estima o
que a pessoa já sabe, calcula as lacunas em relação à primeira vaga e orienta o estudo — **sem
trancar nada**. O catálogo é aberto; o sistema só anota o que vale agora, o que falta de base e o
que pode esperar, sempre com o motivo.

## O que ele faz

1. **Seis perguntas** sobre o que a pessoa já faz, cada frase ligada explicitamente às
   competências que afirma.
2. **Lacunas e prioridade** calculadas por um motor determinístico: elegibilidade pelo grafo de
   pré-requisitos, depois ranking ponderado. Mesma entrada, mesma saída — dá para auditar.
3. **Trilha em 4 níveis, desenhada como uma estrada**, a mesma para todos, com conteúdo concreto
   (quem ensina, quanto tempo leva) e as marcas pessoais: *você já sabe*, *recomendado agora* (no
   máximo 3), *falta base*, *não agora*. O trecho já percorrido fica em tinta, até o *você está
   aqui* ([ADR-0011](docs/adr/0011-trilha-como-estrada.md)).
4. **Explorar**: o catálogo inteiro com filtros — 155 recursos verificados um a um (104 em
   português, 144 gratuitos, 43 de prática ou prova, 15 livros), 13 ferramentas e 26 hábitos
   profissionais.
5. **Minha área**: continuar, minha lista, concluídos, critérios de saída marcados, propósito e
   meta. Fica no navegador e, com o banco ligado, no Postgres.

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
| [`docs/DISCOVERY.md`](docs/DISCOVERY.md) | Modelo de domínio e desenho do motor |
| [`docs/research/`](docs/research/) | Fontes verificadas e os dados que geram o catálogo de recursos |
| [`tcc/`](tcc/) | Documento acadêmico (gerado por script, no formato da UNESC) |

## Estado

107 testes (motor, catálogo, trilha, explorar, banco em Postgres em memória); tipos, lint e
build verificados a cada envio pela integração contínua; cada envio à `main` publica na Vercel.
Banco no Neon, login anônimo por padrão. As páginas chegam renderizadas do servidor, com
`robots.txt` e `sitemap.xml`. Ainda falta:
- **Credenciais de Google e GitHub.** O login social aparece sozinho quando elas existirem, e a
  página de privacidade passa a citá-lo.
- **Condição de controle do experimento**, que espera o desenho com o orientador.
