# Career Gap

Trabalho de Conclusão de Curso em Sistemas de Informação — UNESC Colatina.
Autor: Enzo Araujo Duarte · Orientador: Prof. Riciere Massariol.

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
3. **Trilha em 4 níveis**, a mesma para todos, com conteúdo concreto (quem ensina, quanto tempo
   leva) e as marcas pessoais: *você já sabe*, *recomendado agora* (no máximo 3), *falta base*,
   *não agora*.
4. **Explorar**: o catálogo inteiro com filtros — 137 recursos verificados um a um (92 em
   português, 126 gratuitos, 28 de prática ou prova, 15 livros), 13 ferramentas e 26 hábitos
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
| [`docs/DISCOVERY.md`](docs/DISCOVERY.md) | Modelo de domínio e desenho do motor |
| [`docs/research/`](docs/research/) | Fontes verificadas e os dados que geram o catálogo de recursos |
| [`tcc/`](tcc/) | Documento acadêmico (gerado por script, no formato da UNESC) |

## Estado

105 testes (motor, catálogo, trilha, explorar, banco em Postgres em memória); tipos, lint e
build verificados a cada envio pela integração contínua. Banco no Neon, login anônimo por
padrão. Ainda falta: login com Google e GitHub (credenciais), a condição de controle do
experimento e a reforma visual.
