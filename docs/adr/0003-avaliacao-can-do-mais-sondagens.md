# ADR-0003 — Avaliação por frases "consigo fazer" + sondagens objetivas focadas

**Status:** proposto · **Data:** 2026-09-10

## Contexto

O estado atual do usuário é a entrada mais importante do sistema e a mais difícil de obter.
Autoavaliação correlaciona apenas ~r=.30 com desempenho medido (Zell & Krizan, 2014), e a
literatura de avaliação de proficiência mostra que itens **abstratos e descontextualizados**
("nota de 1 a 5 em React") são os menos confiáveis, enquanto itens ancorados em tarefa
concreta ("consigo fazer X") são substancialmente melhores — é o mecanismo usado nas grades
de autoavaliação do CEFR. Medição rigorosa custa tempo: uma avaliação adaptativa comercial
gasta ~20 itens para *um* domínio, inviável num onboarding de TCC.

## Decisão

- Cada `competency_level` tem um `can_do_statement` observável. **O onboarding apresenta as
  frases, nunca o nome abstrato da competência com uma escala numérica.**
- Três fontes de evidência com confiança explícita: `SELF_REPORT` (baixa) < `PROBE` (média)
  < `ARTIFACT` (média, resposta aberta avaliada por rubrica).
- **Sondagens objetivas só nas competências com alto fan-out** (as que são pré-requisito de
  muitas outras) — 1 a 3 itens auto-corrigíveis. Orçamento total de onboarding: 6–8 minutos,
  medido no piloto.
- O sistema **nunca rebaixa silenciosamente** o nível declarado. Confiança baixa + competência
  que trava outras → item marcado `needs_verification`.
- O perfil inferido é exibido e **confirmado pelo usuário** antes de virar estado.
- Níveis usados no MVP: **L0–L3**. L4 permanece no enum, sem uso — é inalcançável para o
  público-alvo, e escalas ordinais curtas maximizam concordância entre avaliadores.
- Os níveis são apresentados como **escala ordinal operacional definida por descritores**,
  não como estágios psicológicos. O modelo Dreyfus é citado como inspiração histórica, com a
  ressalva de que a existência de estágios discretos carece de suporte empírico.

## Consequências

- Os `can_do_statements` servem simultaneamente como item de onboarding, critério de saída e
  rubrica de correção. Um artefato, três usos.
- Custo de autoria: descritores apenas para os níveis efetivamente usados como alvo ou limiar
  (~50–75 frases, não 25×5).
- A confiança fica visível para o usuário e para a banca, em vez de embutida num coeficiente.
