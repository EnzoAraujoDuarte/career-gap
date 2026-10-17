# Avaliação com usuários — o questionário

Como o Career Gap coleta a percepção de quem testa o site, o que cada item mede, como exportar e
como ler. A fonte da verdade dos itens é `career-gap/src/lib/evaluation.ts`; este documento
explica o desenho. Decisão: ADR-0013. Desenho do estudo: ADR-0007 e `docs/DECISOES.md` §1.

## Onde está

- Página `/pesquisa`, linkada da Minha área ("Pesquisa do TCC"), do rodapé da trilha e da página
  de privacidade. Fora da busca (`noindex`).
- Precisa do servidor. Quem só olhou o site ainda não tem sessão; ao enviar, o formulário cria a
  sessão anônima e grava. Uma resposta por pessoa; reenviar substitui.
- Termo de consentimento no topo, em linguagem comum: finalidade, voluntariedade, anonimato, como
  retirar o consentimento (apagar os dados em Minha área apaga a resposta).

## O que se pergunta

Cabe em uns cinco minutos, e isso é regra verificada por teste (no máximo 30 itens de escala, 6 de
escolha, 1 aberto; frases de até 80 caracteres). Hoje: 30 itens de escala. Quem testa responde de boa vontade uma vez; um
questionário longo perde a segunda metade das respostas. Cada item que entra tira outro.

| Bloco | Itens | Tipo | Fonte |
|---|---|---|---|
| Sobre você | idade, situação, tempo programando | escolha única | perfil do participante |
| Como foi | tempo de uso, tempo até entender o próximo passo | escolha única | medida objetiva barata da ADR-0007, autodeclarada |
| O Career Gap para você | 8 itens: o que a tese afirma, perguntado direto, uma por hipótese do projeto | concordância 1 a 5 | AGENTS.md (as perguntas do produto); hipóteses a–d do projeto de TCC |
| O que você leva | primeiro passo agora | escolha única | intenção de comportamento |
| A trilha que você recebeu | 2 itens sobre a trilha, 8 do ResQue, 2 de checagem da manipulação | concordância 1 a 5 | INITIAL_SCOPE §19; Pu, Chen e Hu (2011); DECISOES §1 |
| O site | 10 itens | concordância 1 a 5 | SUS (Brooke, 1996) |
| Com as suas palavras | a lacuna descoberta | texto livre, opcional | — |

### O Career Gap para você (`source: 'career-gap'`)

A tese é avaliação → lacuna → caminho priorizado → recomendação útil, e o produto promete
responder, a qualquer momento, onde estou, o que já consigo construir, o que vem depois e o que
posso ignorar. Um item por elo; é o bloco que o texto do TCC reporta primeiro.

| id | construto | item |
|---|---|---|
| `caminho-claro` | clareza do caminho | Consegui ver claramente o caminho que preciso seguir. |
| `lacunas-novas` | descoberta de lacunas | Descobri lacunas técnicas que eu não conhecia. |
| `onde-estou` | onde estou | Entendi em que ponto do caminho eu estou. |
| `construir-agora` | o que já construo | Sei o que já consigo construir hoje. |
| `proximo-passo` | próximo passo | Sei qual é o meu próximo passo. |
| `o-que-ignorar` | o que posso ignorar | Sei o que posso deixar para depois. |
| `nao-agora-util` | utilidade do "não agora" (hipótese c) | Ver o que pode esperar ("não agora") ajudou, em vez de esconder conteúdo. |
| `melhor-que-antes` | melhora sobre o método anterior | Ficou mais fácil decidir o que estudar do que antes. |

A pergunta aberta `lacuna-descoberta` ("Qual lacuna técnica você descobriu que não conhecia?") é
a evidência qualitativa de `lacunas-novas`; a escolha `next-action` registra o que a pessoa diz
que vai fazer primeiro (começar uma construção, estudar o recomendado, ajustar o que sabe, nada).

### A trilha (`source: 'roadmap'`)

| id | construto | item |
|---|---|---|
| `construcoes-motivam` | construções (ADR-0012) | As construções me deram vontade de começar algo hoje. |
| `topicos-desnecessarios` | tópicos desnecessários (invertido) | Havia tópicos desnecessários para mim. |

### ResQue (`source: 'ResQue'`), subconjunto de 8 itens

| construto | ids |
|---|---|
| acurácia percebida | `recomendado-corresponde`, `ja-sabe-bate` |
| transparência | `entendi-motivos` |
| controle | `eu-decidia` |
| utilidade percebida | `ajudou-decidir` |
| confiança | `confio` |
| satisfação | `satisfeito` |
| intenção de uso | `indicaria` |

### Checagem da manipulação (`source: 'manipulation-check'`)

`feita-para-meu-nivel` e `mudaria-com-respostas`: percepção de personalização. Se esse construto
não se mover entre pessoas com perfis diferentes, nada no ResQue é interpretável como efeito do
motor (`docs/DECISOES.md` §1).

### SUS (`source: 'SUS'`)

Dez itens, `sus-01` a `sus-10`, os pares invertidos, com "o site" no lugar de "o sistema" e frases
encurtadas. A tradução é do projeto; a versão validada em português pode substituir o texto sem
mudar o id.

### Histórico do instrumento

- `2026.10.16-1`: 31 itens de escala, 7 de escolha, 3 abertos.
- `2026.10.16-2`: bloco "O Career Gap para você" (10 itens), `next-action`, `lacuna-descoberta`.
- `2026.10.16-3`: enxugado para 29 itens de escala, 6 de escolha, 2 abertos, frases curtas. Os
  ids que ficaram não mudaram de sentido; os que saíram não voltam com o mesmo id.
- `2026.10.16-4`: uma aberta só, a lacuna descoberta. Tudo o que o método mede sai das escalas; a
  frase da pessoa é a única evidência que uma escala não captura.
- `2026.10.17-5`: `nao-agora-util`, para a hipótese c do projeto (o "não agora" é percebido como
  útil, não como omissão). As hipóteses do projeto e seus itens: a) irrelevância →
  `topicos-desnecessarios`, `recomendado-corresponde`; b) clareza do próximo passo →
  `proximo-passo`, `caminho-claro`; c) "não agora" útil → `nao-agora-util`, `o-que-ignorar`;
  d) explicação aumenta confiança → `entendi-motivos`, `confio`.

## O que mais é gravado

Com a resposta vão: `instrument_version`, `catalog_version`, `consent_at`, `submitted_at` e um
`context` calculado no servidor a partir do estado da pessoa no banco, com os mesmos módulos das
telas: se tinha perfil, níveis declarados, ênfase, "você está aqui", competências recomendadas,
contagens (já no nível, em aberto, não agora), construções feitas e recursos concluídos. É o que
permite cruzar percepção com o que a pessoa de fato via.

## Como exportar

De dentro de `career-gap/`, com o `.env.local` apontando para o branch do Neon desejado
(`npx neon@latest checkout main` para a produção; voltar com `checkout dev` depois):

```bash
pnpm db:respostas > respostas.csv
```

CSV com ponto e vírgula e decimal com vírgula (o Excel em português abre direto). Cada pessoa vira
`P01`, `P02`… na ordem de envio; nenhum id de sessão sai. O resumo (quantas respostas, SUS médio)
vai para a saída de erro, fora do arquivo.

## Como ler

- **SUS:** 0 a 100 por pessoa (`susScore`): nos ímpares conta resposta − 1, nos pares 5 − resposta,
  soma vezes 2,5. Média acima de 68 é o ponto de referência usual (Sauro e Lewis); abaixo de 50,
  problema. Reporte média, desvio e n.
- **ResQue:** média por construto (1 a 5); reporte cada construto separado, não uma soma.
- **Checagem da manipulação:** média dos dois itens; compare quem respondeu as 6 perguntas com quem
  não respondeu (`context.hasProfile`), e perfis com mais e menos "já no nível".
- **O Career Gap para você:** item a item, média e distribuição; é a tabela que responde à tese.
  Cruze `lacunas-novas` com a resposta aberta `lacuna-descoberta` e com `context.recommended`.
- **A trilha:** item a item; `topicos-desnecessarios` é invertido, concordar é ruim.
- **Medidas autodeclaradas:** distribuição de `time-to-next-step` e `irrelevant-items`.
- **Texto livre:** codificação temática simples (o que ajudou, o que faltou), com trechos citados
  sem nada que identifique a pessoa.

## Limitações declaradas

1. Uma condição só: mede a percepção da trilha personalizada, não a diferença contra a trilha sem
   anotação. A comparação intra-sujeito da ADR-0007 espera o orientador.
2. As medidas "objetivas" são autodeclaradas aqui. A versão medida pela interface depende do
   registro de eventos (`study_event`), também pendente.
3. Traduções do SUS e do ResQue sem validação psicométrica própria; dizer isso no texto.
4. Amostra por conveniência (quem testar o site); n e perfil saem da exportação.
5. Parecer de comitê de ética: o termo no formulário informa e registra o consentimento, mas não
   substitui o parecer se a instituição o exigir.

## LGPD

Dado mínimo (faixas, nunca o valor exato; sem nome nem e-mail), finalidade declarada no termo,
consentimento registrado, exclusão em cascata pela própria pessoa, exportação sem identificador.
A página `/privacidade` descreve o que é guardado.
