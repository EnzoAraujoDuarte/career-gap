---
name: pr
description: Leva um trabalho pronto a um pull request pronto para revisão, criando a branch, fazendo o commit, enviando e abrindo ou atualizando o PR. Use quando a pessoa pedir para commitar, enviar, abrir ou atualizar um PR, ou mandar o trabalho para revisão.
argument-hint: "[branch de base ou observações para o PR]"
allowed-tools: Bash(gh pr view *)
---

# Pull request

## Estado atual

- Branch: !`git branch --show-current`
- Mudanças: !`git status --short`
- PR desta branch: !`gh pr view --json number,state,baseRefName,url 2>/dev/null || echo "nenhum"`

## Passos

1. **Base.** Use a primeira destas que existir: a base do PR aberto desta branch; a base que a pessoa nomeou; a base que o `AGENTS.md` ou o `CLAUDE.md` do projeto nomeia; a branch padrão do repositório, de `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`.
2. **Branch.** Se a branch atual for a base, ou for `main`, `master`, `develop` ou `production`, crie uma branch nomeada pela GIT-02 e GIT-03 antes de commitar. Se o PR desta branch estiver `MERGED` ou `CLOSED`, commits novos não chegam nele: crie outra branch para outro PR.
3. **Escopo.** Leia `git diff HEAD` inteiro e os arquivos novos (`??`) do `git status`. Adicione ao índice os arquivos da tarefa pelo nome, nunca com `git add -A` ou `git add .`. Deixe o que não é da tarefa de fora e cite isso no relato. Rode `git diff --cached --check`.
4. **Verificar.** Rode as verificações que o `AGENTS.md` do projeto exige, focadas na área que mudou, a não ser que já tenham passado depois da sua última edição. Se uma falhar, conserte antes de seguir. Guarde os comandos e os resultados para a descrição.
5. **Commit** seguindo GIT-06 a GIT-09, passando assunto e corpo como argumentos `-m` separados. Se um hook rejeitar a mensagem, mude a mensagem.
6. **Enviar** com `git push -u origin HEAD`. Se o envio for rejeitado porque a branch remota andou, faça rebase sobre ela e envie de novo.
7. **Abrir ou atualizar.** Escreva a descrição num arquivo temporário e passe com `--body-file`. PR novo: `gh pr create --base <base> --title "<título>" --body-file <arquivo>`. PR existente: quando o envio muda o que o PR faz, reescreva título e descrição para o diff inteiro (GIT-15).
8. **Parar.** Não junte, não aprove, não ligue o merge automático. Relate a URL do PR, a base, os commits e as verificações que rodou.

## Descrição

Escreva para quem revisa: o que muda, por quê, e o que merece atenção. Siga o `.github/pull_request_template.md` do projeto quando existir (GIT-14).

- Sem lista arquivo por arquivo, logs colados ou histórico de rodadas de revisão. O diff e os commits já mostram isso.
- Em Origem, cole só URLs que a pessoa deu ou que você abriu. Nunca monte nem adivinhe um link de tarefa.

## Pegadinhas

- `gh pr edit` pode falhar com "Projects (classic) is being deprecated". Atualize pela API: `gh api -X PATCH repos/{owner}/{repo}/pulls/<número> -f title="<título>" -F body=@<arquivo>`.
