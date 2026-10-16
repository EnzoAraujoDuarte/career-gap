# ADR-0013 — Questionário de avaliação dentro do produto

**Status:** aceito · **Data:** 2026-10-16 · **Relaciona:** ADR-0007 (desenho da avaliação),
ADR-0010 (persistência e login), `docs/DECISOES.md` §1

## Contexto

O site está no ar e vai receber pessoas para testar. A ADR-0007 fixa os instrumentos (ResQue,
SUS, checagem da manipulação, medidas objetivas baratas), mas a comparação intra-sujeito e o
registro de eventos esperam o orientador (`PLANO-FASE4.md` §8.4). Sem um lugar para responder,
cada teste viraria conversa sem dado, e o TCC precisa de dado coletado com consentimento, sem
nome nem e-mail, ligado ao que a pessoa de fato viu.

## Decisão

1. **O instrumento é código**, como o catálogo: `career-gap/src/lib/evaluation.ts` lista cada
   item com id, fonte e construto, sob `INSTRUMENT_VERSION`. O banco guarda só as respostas por
   id (`evaluation_response`, jsonb), com a versão do instrumento e a do catálogo que valiam.
   Mudar um item muda a versão; uma resposta antiga continua interpretável.
2. **Uma resposta por pessoa**, chave primária `user_id`. Reenviar substitui: a pessoa pode
   corrigir, e a análise não precisa deduplicar.
3. **O contexto vem do servidor, não do navegador.** Ao gravar, o servidor recalcula a trilha a
   partir do estado da pessoa no banco (os mesmos módulos das telas) e guarda níveis, "você está
   aqui", recomendados, contagens e construções feitas. O perfil pode mudar depois; a resposta
   fica com o que a pessoa via.
4. **Consentimento no próprio formulário**, em linguagem comum, antes da primeira pergunta, com
   `consent_at` gravado. A resposta sai em cascata com o usuário: "Apagar meus dados" é retirar o
   consentimento (LGPD, art. 18, VI e IX).
5. **Exportação sem identificador:** `pnpm db:respostas` gera CSV com as pessoas renumeradas
   P01, P02… na ordem de envio, e o escore SUS calculado. Nenhum id de sessão sai do banco.
6. **Uma condição por enquanto.** O formulário avalia a trilha personalizada que a pessoa
   recebeu. A comparação com a trilha sem anotação (ADR-0007) continua esperando o orientador;
   como os itens são os mesmos, o que se coleta agora vale como piloto do instrumento.

## Consequências

- Dá para começar a coletar no dia em que alguém testar, sem planilha paralela nem formulário
  de terceiros com os dados da pessoa.
- As "medidas objetivas" (tempo até o próximo passo, itens irrelevantes) entram autodeclaradas.
  A versão medida pela interface depende do registro de eventos, que espera o orientador.
- As traduções do SUS e do ResQue são do projeto. Se o orientador exigir a versão validada em
  português do SUS, o texto muda e o id fica.
- Como a resposta sai em cascata com o usuário, a exportação precisa ser feita com regularidade:
  quem apaga os dados leva a resposta junto, por desenho.
- Pesquisa com pessoas pode exigir parecer de comitê de ética. O termo no formulário não o
  substitui; a pergunta continua em `PLANO-FASE4.md` §8.4.
