---
name: passagem
description: Escreve uma nota de passagem para que uma sessão nova, ou outra pessoa, continue o trabalho atual sem esta conversa.
disable-model-invocation: true
argument-hint: "[o que a próxima sessão vai fazer]"
---

# Passagem

Escreva uma nota que permita a alguém continuar este trabalho numa sessão nova. Quando houver argumento, molde a nota em torno dele: $ARGUMENTS

Rode `git status -sb`, `git log --oneline @{u}..` e `gh pr view --json url,state,statusCheckRollup`, para a nota registrar fatos, não lembranças.

## Conteúdo

- **Objetivo:** a tarefa em uma ou duas frases, com a URL de origem (issue, tarefa, relatório de erro ou PR).
- **Estado:** o que está pronto, o que está em andamento e o que não começou.
- **Decisões:** o que foi decidido e por quê, e as opções descartadas. Uma sessão nova recupera o código, mas não os motivos.
- **Código:** caminho do repositório, branch, mudanças sem commit e sem envio, URL do PR e estado da CI.
- **Verificação:** os comandos rodados e os resultados, e o que ainda falta rodar.
- **Processos rodando:** servidores de desenvolvimento, filas, ambientes de prévia e tarefas em segundo plano, com como alcançar ou parar cada um.
- **Próximos passos,** em ordem.
- **Pegadinhas** encontradas no caminho.

Aponte para especificações, tarefas, PRs e arquivos em vez de copiá-los (a IA-03 vale para a nota).

## Saída

Salve a nota fora do repositório, em `${TMPDIR:-/tmp}/passagem-<repositorio>-<branch>.md`, trocando cada `/` do nome da branch por `-`. Dê à pessoa o caminho e o pedido que retoma o trabalho: `Leia <caminho> e continue.`

Para publicar a nota numa tarefa ou num PR, mostre primeiro à pessoa e publique só depois do sim (IA-02).
