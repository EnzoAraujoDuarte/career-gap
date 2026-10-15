# ADR-0004 — Fronteiras do uso de LLM

**Status:** proposto · **Data:** 2026-09-10

## Contexto

O risco central do produto é degenerar em `respostas → prompt → texto de roadmap`. Além disso,
a literatura sobre LLM-as-a-judge (2025–2026) mostra concordância razoável com humanos **apenas**
quando a tarefa é estruturada e a rubrica é explícita, com viés de leniência e sensibilidade a
ordem/verbosidade persistentes. Alucinação de URLs é o modo de falha mais destrutivo para a
credibilidade de um sistema que recomenda material de estudo.

## Decisão

LLM permitido em exatamente três pontos, cada um atrás de um adapter com schema validado e
**fallback determinístico**:

1. **Interpretar** texto livre do onboarding → sinais estruturados candidatos
   (competência, nível sugerido, trecho citado como evidência) → **usuário confirma**.
2. **Avaliar** resposta aberta contra rubrica → um sinal de evidência com confiança.
3. **Explicar** recomendação **já calculada**, recebendo `reason_codes` estruturados.

Proibido: definir ordem/prioridade/composição do roadmap; **gerar recursos ou URLs**; ser fonte
única de um nível de competência.

Saída de LLM é tratada como entrada não confiável: validada, normalizada, e descartada se não
casar com o schema.

## Consequências

- Com o LLM desligado o sistema funciona integralmente, com explicações em template. Isso é
  um teste automatizado e um argumento de defesa.
- Nenhum prompt dentro de componente de UI; todos em um módulo de adapters.
- Possível medir concordância entre extração do LLM e rotulação humana numa amostra pequena —
  vira um resultado secundário barato para o TCC.
