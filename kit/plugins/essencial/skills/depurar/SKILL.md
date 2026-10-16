---
name: depurar
description: Acha a causa raiz de um bug a partir de uma verificação que falha e se repete, antes de mudar qualquer código. Use quando algo está quebrado, lançando erro, falhando, lento ou errado, inclusive relatos de bug, issues, alertas de monitoramento e testes ou CI falhando.
---

# Depurar

Não mude nenhum código até conseguir fazer o bug acontecer quando quiser.

## 1. Fixe a afirmação

- Anote em separado o que foi observado (o erro exato, a URL, os dados, a hora), o que era esperado e onde aconteceu (ambiente, usuário, navegador).
- O diagnóstico e a correção propostos por quem relatou são afirmações a conferir, não fatos.
- Veja se já foi corrigido ou está em andamento: leia o código atual, `git log -S '<símbolo>'` e os PRs abertos.
- Uma assinatura de erro é um arquivo mais uma mensagem, ou um status mais um caminho para erros HTTP. Vários trechos de código podem produzir a mesma assinatura. Encontre todos antes de dizer que uma correção cobre o erro.

## 2. Monte uma verificação que falha

Monte uma verificação que mostra o sintoma exato e falha enquanto o bug existe. Prefira, nesta ordem:

1. Um teste na costura real: pela rota ou pelo job, não por um mock deles.
2. Um script ou `curl` contra um ambiente local ou de prévia.
3. Um teste de navegador para comportamento de tela.
4. `git bisect run <verificação>` quando existe um commit sabidamente bom.
5. Em último caso, quando nada pode ser automatizado (um bug só num navegador, por exemplo), passos manuais numerados que reproduzem sempre. Registre os passos no PR.

Deixe a verificação rápida e determinística: fixe o relógio, semeie os dados, simule chamadas a terceiros. Para bug intermitente, repita a verificação em laço até falhar com confiança.

Reproduza com acesso só de leitura ou com uma cópia dos dados. Nunca reproduza escrevendo em dados de produção.

Se não conseguir montar a verificação, pare. Relate o que tentou e o que precisa: acesso, um exemplo de carga, uma linha de log. Não chute uma correção.

## 3. Estreite

- Encolha a reprodução até que cada entrada que sobrar importe.
- Registre nas fronteiras (requisição, job, resposta de API externa, escrita no banco) e siga o valor errado até onde ele aparece pela primeira vez.
- Quando um caminho parecido funciona, liste cada diferença entre os dois.
- Marque os logs temporários com um rótulo único, como `[debug-7f3a]`, para uma busca remover todos.

## 4. Teste hipóteses

- Escreva de duas a quatro hipóteses ordenadas e falsificáveis: "se X é a causa, mudar Y faz a verificação passar".
- Teste uma de cada vez, com uma mudança por rodada. Desfaça cada mudança que não confirmou a hipótese dela.
- Depois de três correções que falharam, pare. A causa provavelmente é uma suposição errada ou o desenho. Diga à pessoa o que você descartou antes de tentar de novo.

## 5. Corrija e prove

- Corrija a causa (COD-04).
- Onde o projeto tem testes, transforme a verificação em teste de regressão (TST-03). Prove: o teste falha com a correção desfeita e passa com ela.
- Depois rode a reprodução original, antes de encolhida.
- Se não achou a causa raiz, diga o que descartou e acrescente o registro que vai pegar a próxima ocorrência. Não publique uma correção especulativa.

## 6. Limpe

Remova os logs marcados e os scripts descartáveis. No PR, diga a causa raiz em uma ou duas frases e nomeie a verificação que prova a correção.
