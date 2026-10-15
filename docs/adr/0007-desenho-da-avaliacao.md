# ADR-0007 — Desenho da avaliação com usuários

**Status:** proposto, **parcialmente superado por `docs/DECISOES.md` (2026-09-11)** ·
**Data:** 2026-09-10

> Correções em `docs/DECISOES.md` §1: a camada de recursos passa a existir nas DUAS condições;
> o enunciado da tese muda de "personalização" para "seleção e ordenação por lacuna"; n=24
> fixado; a medida objetiva baseada em gabarito do painel sai do recorte.

## Contexto

`INITIAL_SCOPE.md` §19 exige avaliação e §20 trata a comparação com roadmap estático como
opcional. Sem comparação, o trabalho demonstra apenas que o sistema foi construído e que
usuários gostaram — não isola a personalização, que é a tese. Comparar contra roadmap.sh é
inviável (licença) e metodologicamente ruim (confunde diferença de conteúdo com diferença de
personalização).

## Decisão

Três instrumentos:

1. **Comparação intra-sujeito, ordem contrabalançada.** Cada participante vê
   (A) o catálogo completo do track, sem filtragem nem ordenação, e
   (B) o roadmap personalizado. **Ambos a partir do nosso próprio catálogo** — a única
   variável que muda é a personalização.
2. **ResQue** (Pu, Chen & Hu, RecSys 2011), subconjunto de ~15–20 itens: acurácia percebida,
   transparência, controle, utilidade, confiança, satisfação. É o instrumento padrão para
   avaliação centrada no usuário de sistemas de recomendação. **SUS** (10 itens) para usabilidade.
3. **Painel de especialistas**: 3–5 desenvolvedores experientes avaliam a coerência dos
   roadmaps gerados para N perfis sintéticos, sem depender da percepção de iniciantes.

Métricas objetivas baratas: tempo até identificar o próximo passo; nº de itens marcados como
"não relevante para mim" em A vs. B.

## Consequências

- Desenho intra-sujeito dobra o poder estatístico com o mesmo número de participantes —
  importante com n baixo, que é o cenário realista de um TCC.
- Usar ResQue em vez de um questionário próprio dá validade de construto já publicada e
  economiza a discussão metodológica.
- O painel de especialistas responde "os gaps são coerentes?" de forma independente da
  percepção de quem ainda está aprendendo — que é justamente quem menos consegue julgar isso.
- Declarar explicitamente o limite: mede-se percepção de utilidade e coerência, não ganho de
  carreira.
- Exige aprovação do orientador antes de ampliar o escopo metodológico.
