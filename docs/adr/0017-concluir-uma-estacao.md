# ADR-0017 — Concluir uma estação com um toque

**Status:** aceito · **Data:** 2026-10-17 · **Relaciona:** ADR-0003 (autoavaliação é
`self-report`), ADR-0009 (nada trancado), ADR-0016 (o celular como app), `docs/DECISOES.md` §3

## Contexto

A estação só saía do caminho quando o nível mudava, e o nível só mudava refazendo as 6 perguntas
ou ajustando competência por competência noutra página. Marcar todos os critérios de saída não
mudava nada (DECISOES §3) e só mostrava um link. O dono do produto apontou o problema: para
completar um nível a pessoa não precisa consumir todos os materiais, e marcar algo como feito
precisa ser fácil.

A DECISOES §3 continua certa no que proíbe: um checklist que se autopromove infla a trilha com um
clique. Ela mesma prevê a saída: o nível muda por "reavaliação explícita". Faltava essa
reavaliação estar à mão, na estação.

## Decisão

1. **"Concluí esta estação" é uma reavaliação explícita de uma competência só.** Sobe o nível
   dela ao que a vaga pede. É autodeclaração, como as 6 perguntas: a evidência continua
   `self-report`, e o servidor valida o perfil como sempre.
2. **Está nos dois lugares onde a pessoa decide:** um botão "concluí" em cada estação da estrada e
   um "Concluí esta estação" no topo da página da estação, com a frase "não precisa ver todos os
   materiais".
3. **Marcar os critérios continua sem promover.** Quando todos estão marcados, o aviso vira o
   botão "Concluir a estação", em vez de mandar a pessoa para outra página.
4. **Tudo se desfaz.** Um aviso no rodapé diz o que mudou e tem "Desfazer"; a estação concluída
   tem "Reabrir", que volta ao nível de antes (guardado no navegador) ou, sem ele, a um degrau
   abaixo do alvo.
5. **Concluída, a estação aponta a próxima:** o novo "você está aqui", como um app de curso aponta
   a próxima aula.
6. **Sem as 6 perguntas, concluir começa um perfil só com aquela estação,** e o cartão do próximo
   passo avisa que o resto da trilha está no começo e convida a responder.
7. **No perfil de demonstração não há botão:** as marcas são do exemplo.

## Consequências

- Concluir é uma mudança de perfil como qualquer outra: entra no `roadmap_snapshot` com a hora, e a
  resposta da pesquisa grava os níveis que a pessoa tinha ao responder. O TCC continua sabendo de
  onde veio cada nível pela ordem dos registros, mas não por um campo próprio.
- Refazer as 6 perguntas reescreve os níveis que elas cobrem, inclusive o de uma estação concluída.
- A sondagem objetiva da DECISOES §3 ("quer confirmar em 3 perguntas?") continua não implementada;
  quando existir, entra no mesmo lugar do botão.
