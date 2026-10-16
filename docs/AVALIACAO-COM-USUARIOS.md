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

| Bloco | Itens | Tipo | Fonte |
|---|---|---|---|
| Sobre você | faixa etária, situação, tempo programando, uso de outro roadmap | escolha única | perfil do participante |
| Como foi usar | tempo de uso, tempo até entender o próximo passo, itens irrelevantes | escolha única | medidas objetivas baratas da ADR-0007, autodeclaradas |
| A trilha que você recebeu | 6 itens de qualidade do roadmap, 13 do ResQue, 2 de checagem da manipulação | concordância 1 a 5 | INITIAL_SCOPE §19; Pu, Chen e Hu (2011); DECISOES §1 |
| O site | 10 itens | concordância 1 a 5 | SUS (Brooke, 1996) |
| Com suas palavras | o que ajudou, o que faltou, algo mais | texto livre, opcional | — |

### Qualidade do roadmap (`source: 'roadmap'`)

| id | construto | item |
|---|---|---|
| `gaps-fazem-sentido` | coerência das lacunas | As lacunas que a trilha apontou fazem sentido para mim. |
| `ordem-clara` | clareza da ordem | A ordem sugerida, o que vem antes e o que vem depois, ficou clara. |
| `proximo-passo` | clareza do próximo passo | Depois de usar a trilha, sei dizer qual é o meu próximo passo. |
| `materiais-adequados` | adequação dos recursos | Os materiais indicados parecem adequados para o meu nível. |
| `construcoes-motivam` | construções (ADR-0012) | As construções me deram vontade de começar algo hoje. |
| `topicos-desnecessarios` | tópicos desnecessários (invertido) | Havia tópicos na trilha que considerei desnecessários para mim. |

### ResQue (`source: 'ResQue'`), subconjunto de 13 itens

| construto | ids |
|---|---|
| acurácia percebida | `recomendado-corresponde`, `ja-sabe-bate` |
| novidade | `mostrou-novidade` |
| transparência | `entendi-motivos` |
| controle | `eu-decidia`, `facil-corrigir` |
| suficiência de informação | `informacao-suficiente` |
| utilidade percebida | `ajudou-decidir`, `menos-tempo-perdido` |
| confiança | `confio` |
| satisfação | `satisfeito` |
| intenção de uso | `voltaria`, `indicaria` |

### Checagem da manipulação (`source: 'manipulation-check'`)

`feita-para-meu-nivel` e `mudaria-com-respostas`: percepção de personalização. Se esse construto
não se mover entre pessoas com perfis diferentes, nada no ResQue é interpretável como efeito do
motor (`docs/DECISOES.md` §1).

### SUS (`source: 'SUS'`)

Dez itens, `sus-01` a `sus-10`, os pares invertidos, com "o site" no lugar de "o sistema". A
tradução é do projeto; a versão validada em português pode substituir o texto sem mudar o id.

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
- **Qualidade do roadmap:** item a item; `topicos-desnecessarios` é invertido, concordar é ruim.
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
