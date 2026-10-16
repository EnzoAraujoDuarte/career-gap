---
name: decisao
description: Escreve um registro de decisão na pasta do kit, depois que a pessoa concordou em registrar a decisão (IA-07). Use quando a pessoa pedir para registrar, guardar ou substituir uma decisão.
argument-hint: "[a decisão a registrar]"
---

# Registro de decisão

Registre uma decisão que a pessoa já concordou em registrar (IA-07).

A pasta do kit é `${CLAUDE_PLUGIN_ROOT}/../..`. Os registros ficam em `decisoes/` e o modelo em `modelos/decisao.md`.

## Passos

1. **Origem.** A `origem` do registro é o PR ou o commit com a mudança. Se nenhum existir ainda, pergunte se a pessoa quer abrir o PR primeiro com a skill `pr`, ou escrever `nenhuma`.
2. **Número.** O maior número em `decisoes/` mais um.
3. **Escreva** `decisoes/NNNN-<titulo-curto>.md` a partir de `modelos/decisao.md`.
   - `repos` lista cada repositório que a decisão vale, pelo nome do remoto `origin` ou da pasta quando não há remoto, ou `todos`.
   - `resumo` é uma frase com a decisão e o motivo. É a única linha que toda sessão vê no índice, então precisa ficar de pé sozinha.
   - Cada seção em poucas frases. Contexto, Decisão e Consequências são obrigatórias. Rejeitadas é opcional: inclua quando alternativas reais foram pesadas, porque alguém vai propô-las de novo.
4. **Substituir.** Quando o registro novo troca um antigo, mude o status do antigo para `substituída por NNNN` e deixe o resto como estava. Nunca edite um registro aceito para mudar o que ele decidiu.
5. **Confira** que o índice mostra o registro, da raiz de um repositório que ele vale:

   ```bash
   CLAUDE_PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT}" "${CLAUDE_PLUGIN_ROOT}/hooks/listar-decisoes.sh"
   ```

6. **Pare.** Dê à pessoa o caminho do registro. Ele chega às sessões no próximo início, ou depois de `/reload-plugins`.
