# Git

Convenções de branch, commit e pull request para qualquer projeto. Branch, commit e título de PR usam o mesmo conjunto de tipos.

## Tipos

| Tipo | Para quê |
| --- | --- |
| `feat` | Comportamento novo para quem usa ou para o sistema |
| `fix` | Correção de bug |
| `hotfix` | Correção urgente em produção (só em nome de branch) |
| `refactor` | Mudança de código que não muda comportamento |
| `perf` | Melhoria de desempenho |
| `test` | Só adiciona ou corrige testes |
| `docs` | Só documentação |
| `chore` | Dependências, configuração e manutenção |
| `ci` | Integração contínua e implantação |

## Branches

- GIT-01: Nunca faça commit direto em `main`, `master` ou `develop`. Toda mudança passa por uma branch própria e um pull request.
- GIT-02: Nomeie a branch como `<tipo>/<descricao>`, com um tipo da tabela.
- GIT-03: A descrição diz a ideia central da mudança, específica o bastante para não se confundir com outra. Só letras minúsculas sem acento, dígitos e hífens entre as palavras.
- GIT-04: O link da tarefa vai no PR, não no nome da branch. O nome precisa fazer sentido para quem nunca abriu a tarefa.
- GIT-05: Cada branch tem um propósito. Mudanças sem relação vão em outra branch.

| Bom | Ruim |
| --- | --- |
| `fix/login-ignora-sessao-expirada` | `fix/bug`: não diz o que corrige |
| `feat/exportar-notas-em-lote` | `feat/melhorias`: genérico demais |
| `refactor/extrair-envio-de-email` | `fix/tarefa-482`: só um número |
| `chore/atualizar-node-22` | `Feature/Novo_Login`: maiúscula e sublinhado |

## Commits

- GIT-06: Use o formato `<tipo>(<escopo opcional>): <descrição>`, com a descrição no imperativo, em minúsculas, sem ponto final e curta o bastante para ler de relance. Exemplo: `fix(login): ignorar sessão expirada`.
- GIT-07: Use o corpo, quando houver, para explicar por que a mudança foi feita. Marque mudança incompatível com `!` depois do tipo e um rodapé `BREAKING CHANGE:`.
- GIT-08: Cada commit guarda uma mudança lógica e deixa o código compilando e com os testes passando, para que qualquer commit possa ser revertido ou bisseccionado com segurança.
- GIT-09: Escreva a mensagem na língua do projeto; o padrão é a língua em que o código e os comentários já estão.
- GIT-10: Nunca reescreva história compartilhada. Não force push em `main`, `master` ou `develop`. Na sua branch, use `--force-with-lease`, nunca `--force`.
- GIT-11: Nunca pule os hooks com `--no-verify`. Se um hook falha, conserte a causa.

## Pull requests

- GIT-12: O título do PR segue o formato do commit, com o mesmo tipo da branch.
- GIT-13: Mantenha cada PR pequeno e com um propósito. Divida um PR que mistura mudanças sem relação ou que não dá para revisar numa sentada.
- GIT-14: Descreva o PR em linguagem direta: o que muda, que problema resolve e como. O modelo de PR é uma sugestão de estrutura, não uma lista de obrigações. A verificação lista só o que você rodou de verdade. Quando o trabalho vem de uma tarefa ou de um relatório de erro, cole o link completo em Origem, como última linha.
- GIT-15: Mantenha a descrição verdadeira. Quando o PR muda, atualize a descrição no mesmo envio.
