# Fase 4 — orientar sem prender

Data: 2026-10-15. Pedido do Enzo: estudar o Laracasts (`laracasts.com/path`) e outras
plataformas; parar de "engessar o usuário àquilo que ele tem que fazer" — ele estuda o que
quiser, quando quiser, e o Career Gap só dá a direção do que estudar e do que não estudar agora;
e guardar as informações do usuário em Postgres.

## 1. Onde o produto prende hoje

O motor nunca trancou conteúdo: os links de uma competência "bloqueada" já abriam. O que
prende está na **linguagem** e na **estrutura** — e há um único bloqueio real.

| onde | o que diz hoje | efeito |
|---|---|---|
| `/mapa` | "seu foco agora" — **um** item | trilho de uma faixa só |
| `/mapa` | "abre depois de X" | parece cadeado; o link funciona, mas ninguém tenta |
| `/mapa` | seções "em seguida", "mais adiante" | sequência imposta, não sugerida |
| `/mapa` | "não agora" riscado e **sem recursos** | o único bloqueio de verdade: IA e autenticação somem para o iniciante |
| ficha | teto de 3 recursos | as alternativas existem no catálogo e não aparecem |
| `/projetos` | "espera: X" | trava |
| `/kit` | "falta: X" | trava |
| `/plano` | agenda diária gerada pelo sistema | o mais engessado de tudo: diz o que fazer em cada dia |

## 2. O que as plataformas fazem

### Laracasts (estudado direto no site, 2026-10-15)

- **Hierarquia:** Trilha → 4 níveis ("The Fundamentals", "Build and Ship", "Laravel Mastery",
  "Scale and Maintain") → séries (cursos) → capítulos → episódios.
- **Nível:** nome, "6 Series · 34 Hours", um parágrafo, "You'll Learn" com 3 a 5 resultados,
  as séries na ordem sugerida (título + "With <instrutor>") e **"Optional Branches"**: séries
  alternativas, livro na Amazon, post de blog de terceiros. O ramo opcional aponta para fora.
- **Catálogo aberto ao lado da trilha:** "All Series" com filtros por instrutor, categoria e
  tópico; cartão com título, instrutor, nº de episódios, dificuldade (Beginner, Intermediate,
  Advanced) e categoria. Barra lateral com contagens (Jeffrey Way 141, Frameworks 75…).
- **Série:** texto na voz do instrutor; capítulos com contagem; cada episódio com duração e um
  parágrafo; "Technical Check-in (With Exam)" no fim do capítulo.
- **Estado do usuário:** Jump Back In, Watchlist, Completed, My Stats; selo ao completar a
  trilha.
- **Nada é trancado pela ordem.** A trilha é sugestão ("Begin Path"); qualquer série abre
  direto. O que restringe é só a assinatura.

O que o Laracasts **não** tem e nós temos: ele não sabe nada sobre quem está assistindo. A
trilha é igual para todos e não diz o que pular. É exatamente o espaço do Career Gap:
**a organização do Laracasts com uma camada pessoal de direção por cima.**

### Outras plataformas (2026-10-15; fontes nos links de cada página citada)

| plataforma | trava a ordem? | o que vale copiar |
|---|---|---|
| Master.dev (ex-Frontend Masters) | não | trilha dividida em **"Core — take these in order"** e **"Elective — any order"** |
| Codecademy | **tirou todos os cadeados em 2018** — quem já sabe pula, e link de lição fica compartilhável | o motivo de tirar |
| Exercism | trava por padrão (Learning Mode) e oferece **Practice Mode**, que abre tudo; o fórum registra confusão com exercício travado | o estado do nó vem dos pré-requisitos |
| Khan Academy | não | **"Not feeling ready? Check out Get ready for…"** — manda de volta sem travar |
| Pluralsight | não | avaliação → lacuna por tópico → recomendação ligada ao que errou → nova medição |
| Boot.dev | trava só por pagamento; trilha customizada desde mai/2026, com aviso honesto de pré-requisito | deixar montar o próprio caminho |
| The Odin Project | "deveria seguir a ordem", mas o FAQ admite pular | ordem como conselho |
| roadmap.sh | não | estado declarado pela pessoa por nó: aprendendo / feito / **pular** |
| Rocketseat, Alura, DIO, Origamid, Curso em Vídeo | ordem sugerida; nenhuma tem nivelamento aberto; personalização só paga (Luri, Tutor de IA) | "comece aqui" (Origamid), checkpoint por nível e data de atualização (Alura), horas traduzidas em meses a 1h30/dia (Curso em Vídeo) |
| **Tech Guide da Alura** (`techguide.sh`, 3,8 mil ★) | não | o concorrente mais próximo: níveis 1-2-3 e "conteúdo opcional"; **sem avaliação, sem "não agora"**, links para a própria Alura |

**O que nenhuma faz:** dizer "não estude X agora, porque Y" com motivo ligado ao perfil de
quem estuda. O mais perto: o cadeado do Exercism, o "você já domina" da Pluralsight e o
"pular" do roadmap.sh, que é declarado pela pessoa, não calculado. É o espaço do Career Gap.

**O que evitar:** XP, ranking e perda de pontos (DIO, Boot.dev) — medem volume consumido e
contradizem "estude o que quiser"; nota por percentil (Pluralsight) — a lacuna é contra o
alvo, não contra outras pessoas; exame como portão (freeCodeCamp).

## 3. A nova organização

Quatro lugares, no lugar dos seis espaços atuais:

| lugar | equivale no Laracasts | o que é |
|---|---|---|
| **Trilha** | Path | a mesma para todos, em 4 níveis, com conteúdo concreto (vídeo, curso, pessoa) e ramos opcionais |
| **Explorar** | All Series | todo o catálogo, com filtros por criador, competência, tipo (vídeo, curso, leitura, prática, livro, ferramenta, hábito), idioma e custo; absorve Projetos, Kit, Biblioteca e Comportamental |
| **Competência** | página da série | o que você vai aprender (critérios de saída), "comece aqui", **todos** os recursos agrupados em aprender, praticar e provar, missão, hábitos |
| **Minha área** | Jump Back In, Watchlist, Completed, My Stats | continuar, minha lista, concluídos, progresso, propósito e meta |

### Os níveis da trilha

Agrupamento editorial, como no Laracasts, mas **com uma regra verificável**: nenhum nível pode
conter competência cujo pré-requisito esteja num nível posterior. Vira teste na suíte, como a
regra de suficiência.

| nível | competências | conferência |
|---|---|---|
| 1 · Fundamentos | fundamentos de programação, decomposição de problemas, linha de comando, Git, ler documentação, HTML semântico, HTTP | todas sem pré-requisito |
| 2 · A web no navegador | CSS layout, JavaScript, DOM, acessibilidade, depuração, legibilidade | todos os pré-requisitos no nível 1 ou antes no 2 |
| 3 · Construir e publicar | consumir API, SQL, modelagem relacional, criar API, aplicação completa, deploy, autenticação | idem |
| 4 · Trabalho de verdade | testes automatizados, code review, algoritmos, comunicação técnica, desenvolvimento com IA + os marcos de prova | idem |
| fora da trilha | contêineres, microsserviços, filas, system design avançado, infraestrutura como código | "não agora" permanente para a primeira vaga |

Cada competência aparece na trilha **pelo conteúdo**, não pelo nome — "Algoritmo e Lógica,
com Gustavo Guanabara · Curso em Vídeo · 40 h" —, porque o mapa só com nomes de competência
já foi rejeitado. Os recursos são os do nível-alvo da trilha, iguais para todos, como hoje: é o
que mantém as condições do experimento comparáveis.

## 4. A camada de direção

O motor não muda. Muda o que a interface faz com a saída dele: **anota, nunca tranca.**

| saída do motor | anotação | o link |
|---|---|---|
| `met` | ✓ você já sabe | abre |
| os 3 primeiros do ranking entre os alcançáveis | → recomendado agora, com o motivo | abre |
| `blocked` | falta base: X — "recomendamos X antes, porque…" | **abre** |
| `excluded` (política) | não agora — o motivo, como hoje | **abre** (hoje não abre) |
| demais alcançáveis | sem anotação | abre |

Regras:

1. **Nenhum link desabilitado, nenhuma tela escondida** por causa do estado do usuário.
2. **No máximo 3 "recomendado agora".** Um foco único vira trilho; 25 recomendações viram
   ruído. Três dá escolha sem paralisia.
3. **Todo "não agora" e todo "falta base" vêm com motivo.** Aviso sem motivo é cadeado
   disfarçado.
4. **A agenda gerada sai.** Fica o propósito e a meta, escritos pela pessoa, e um registro do
   que ela de fato estudou (vem do "concluído"). O sistema registra, não manda.

### 4.1 Fundamentação: controle compartilhado

Legenda: **[L]** lido no texto primário; **[R]** lido só o resumo; **[S]** fonte secundária —
conferir antes de citar.

- **Abrir tudo, sozinho, não melhora a aprendizagem.** Meta-análise: g = 0,05, 18 estudos
  (KARICH; BURNS; MAKI, 2014, *Review of Educational Research*, 84(3), DOI
  10.3102/0034654314526064) **[R]**. Atenção: "Karich, Burchinal & Fan" não existe — os
  autores são Burns e Maki.
- **O novato escolhe mal porque avalia mal o que já sabe.** "The most consistent finding" é que
  aprendizes usam mal o controle que recebem (BELL; KOZLOWSKI, 2002, *Personnel Psychology*,
  55(2)) **[R]**; a precisão do automonitoramento modera o efeito do controle (MIHALCA et al.,
  2017, *Metacognition and Learning*, 12) **[L]**.
- **O que tem evidência repetida é aconselhar e deixar escolher.** Aconselhamento melhorou o
  pós-teste e reduziu o tempo também sob controle do aprendiz (TENNYSON; BUTTREY, 1980)
  **[R]**; controle compartilhado aumentou o envolvimento (CORBALAN; KESTER; VAN MERRIËNBOER,
  2008, *Contemporary Educational Psychology*, 33(4)) **[R]**; orientação adaptativa somada ao
  controle melhorou autorregulação e desempenho (BELL; KOZLOWSKI, 2002) **[R]**. Quem tem pouco
  conhecimento precisa de aconselhamento ou controle compartilhado (KALYUGA, 2007, *Educational
  Psychology Review*, 19(4)) **[L]**.
- **Precedente mais próximo:** prática de programação livre, tudo aberto, os **3 primeiros**
  recomendados com explicação; a recomendação aumentou as tentativas (β = 0,13), e quem tinha
  pré-teste baixo seguiu mais e acertou mais (BARRIA-PINEDA et al., AIED 2021, DOI
  10.1007/978-3-030-78292-4_6) **[L]**. É o desenho desta fase.
- **Escolha motiva, mas não ensina sozinha.** Meta-análise de 41 estudos: motivação intrínseca
  d ≈ 0,30, competência percebida 0,59, **aprendizagem subsequente 0,10, não significativa**; o
  efeito é maior com 2 a 4 escolhas e 3 a 5 opções (PATALL; COOPER; ROBINSON, 2008,
  *Psychological Bulletin*, 134(2)) **[L]**. Por isso: a liberdade se justifica por motivação; o
  ganho de aprendizagem tem de vir da recomendação. E por isso o teto de 3.
- **O motivo importa.** Dar justificativa aumentou engajamento e aprendizagem conceitual (JANG,
  2008, *Journal of Educational Psychology*, 100(4)) **[S]**.
- **Desafio a considerar:** orientação *controladora* acelerou habilidades mais que a de apoio
  à autonomia (KANAR; BELL, 2013, *Journal of Educational Psychology*, 105(4)) **[R]**. Daí o
  tom firme no "falta base" — "sem essa base, este passo fica bem mais difícil" —, sem trancar.

**Posição para o TCC:** controle compartilhado — o sistema aconselha com motivo explícito, a
pessoa decide. Não é afrouxar a tese; é o desenho com mais evidência.

## 5. Banco de dados

**Neon (Postgres gerenciado, plano gratuito) + Drizzle + Better Auth com entrada anônima.**

| opção | grátis | problema para o TCC |
|---|---|---|
| **Neon** | permanente, 1 GB por projeto, 100 CU-hora/mês, até 100 projetos | dorme após 5 min sem uso e acorda sozinho na consulta seguinte (atraso de partida a frio) |
| Supabase | 500 MB, 2 projetos | **pausa após 1 semana sem uso e só volta à mão** — a banca abre o link num dia qualquer e encontra o sistema fora do ar |
| Postgres local | sem limite | serve para desenvolver, não para o piloto, que precisa de URL pública |

Limites do Neon conferidos na documentação oficial (`neon.com/docs/introduction/plans`) em
2026-10-15; os do Supabase vêm de fontes secundárias. Postgres em si é software livre; o que
custa é hospedar, e o plano gratuito do Neon cobre com folga um piloto de dezenas de pessoas.

- **Drizzle:** o esquema é TypeScript e o SQL fica visível — dá para mostrar no capítulo de
  metodologia. As migrações são versionadas pelo `drizzle-kit`. O domínio continua sem nenhum
  import de ORM (regra de `DISCOVERY.md` §11): o banco só troca a origem do perfil.
- **Better Auth:** biblioteca aberta, as tabelas de usuário ficam no **nosso** Postgres, não
  num serviço de terceiros. O plugin anônimo deixa a pessoa começar sem cadastro — preserva a
  entrada em 3 toques — e o `onLinkAccount` move os dados dela quando decide criar conta para
  não perder o progresso.
- **O catálogo continua no código, não no banco.** Ele é validado por teste (proveniência,
  suficiência, níveis da trilha), revisado por diff e versionado (`CATALOG_VERSION`). O banco
  guarda só o estado do usuário, referenciando IDs do catálogo e a versão vigente. Revisa o
  passo 3 de `DISCOVERY.md` §9 ("seed versionado do catálogo"), que pressupunha catálogo no
  banco.

### Tabelas

```text
-- geradas pelo Better Auth: user (+ is_anonymous), session, account, verification

learner            user_id PK→user · track_id · emphasis_id? · catalog_version
                   purpose? · career_goal? · target_month? · research_consent_at? · updated_at
competency_level   (user_id, competency_id) PK · level L0–L3 · evidence self-report|probe · updated_at
criterion_check    (user_id, competency_id, level, criterion_index) PK · checked_at
resource_progress  (user_id, resource_id) PK · saved_at? · started_at? · completed_at? · updated_at
roadmap_snapshot   id · user_id · catalog_version · input jsonb · output jsonb · created_at
study_event        id · user_id · resource_id · kind open|save|complete
                   · advice met|recommended|missing-base|not-now|none · catalog_version · created_at
```

- `resource_progress` sustenta Continuar (iniciado e não concluído, pelo mais recente), Minha
  lista (`saved_at`) e Concluídos (`completed_at`).
- `roadmap_snapshot` grava entrada e saída do motor a cada mudança de perfil: é a trilha de
  auditoria que o TCC precisa para explicar **por que** algo foi recomendado a alguém, com a
  versão do catálogo que valia no dia.
- `study_event` só é gravado com consentimento de pesquisa (`research_consent_at`). Ver §6.
- Apagar a conta apaga tudo em cascata (LGPD: dado mínimo, finalidade declarada).

### Como ligar o banco (implementado em 2026-10-15; falta só conectar)

Sem `DATABASE_URL`, nada muda: tudo fica no navegador, como antes. Com ela, cada visitante
ganha uma sessão anônima, o que está no navegador sobe para o banco e cada nova escrita também.

1. Criar o projeto no Neon (plano gratuito) e copiar a string de conexão **pooled**.
2. Copiar `career-gap/.env.example` para `career-gap/.env.local` e preencher `DATABASE_URL`,
   `BETTER_AUTH_SECRET` (`openssl rand -base64 32`) e `BETTER_AUTH_URL`
   (`http://localhost:3000` em desenvolvimento).
3. `pnpm db:migrate` dentro de `career-gap/` — cria as 8 tabelas.
4. Reiniciar o `pnpm dev`.
5. Opcional — login com Google e/ou GitHub: criar o app OAuth em cada um, cadastrar o retorno
   `<BETTER_AUTH_URL>/api/auth/callback/google` (ou `/github`) e preencher o client id e o
   secret. O botão só aparece para o provedor que tem as duas credenciais.
6. Na Vercel: as mesmas variáveis no painel do projeto e um deploy novo — as páginas são
   estáticas e leem se há banco no momento do build.

Nenhuma credencial passa pelo chat.

**O que foi verificado sem o Neon:** a migração roda num Postgres real em memória (PGlite) e o
Better Auth cria a sessão anônima nas nossas tabelas (`tests/db.test.ts`, 8 testes: gravação,
"mais recente vence", junção de conta anônima com conta Google/GitHub, apagamento em cascata,
validação da entrada); `pnpm db:migrate` aplicou a migração pelo driver `pg` num servidor
PGlite local; `pnpm build` passa. **Não verificado:** o fluxo dentro do navegador com o banco
ligado (sessão anônima → sincronização → Minha área "salvo só neste aparelho") e o login
Google/GitHub, que precisam das credenciais. Primeira coisa a conferir depois de conectar.

**Conectado em 2026-10-15 e verificado no Neon real.** Banco criado pelo CLI oficial
(`npx neon@latest claim create --file .env.local`), sem conta, e **reivindicado pelo Enzo para a
conta dele no mesmo dia** (projeto `old-leaf-70133653`, branch `main`). A transferência troca a
senha: as URLs foram atualizadas com `neon env pull`, e a pasta foi religada com `neon link`.
Skills `neon` e `neon-postgres` instaladas em `.claude/skills/` (versões em `skills-lock.json`) e o
MCP do Neon em `.mcp.json`, por OAuth e preso a esse projeto — nenhuma chave em arquivo. Verificado: as 9 tabelas, a sessão anônima, a subida do perfil com o registro
do motor, e o envio de "minha lista" e de critério marcado a cada ação. O teste achou um defeito
que o PGlite não pegava — o efeito duplo do React em desenvolvimento criava dois usuários
anônimos e dois snapshots — corrigido com conexão única por página e trava por usuário nas
gravações. Migrações usam a conexão direta (`DATABASE_URL_UNPOOLED`). Ainda não verificado: login
Google/GitHub, que precisa das credenciais OAuth.

**Fica para depois:** `study_event` (medida de aderência) espera o orientador (§8.4);
`criterion_check` (critérios de saída marcados) não é persistido ainda.

## 6. Avaliação em 6 perguntas

Pedido do Enzo, no meio desta fase: as 25 telas de autoavaliação "poderiam ser umas 6 só".

Seis temas — Programar; Páginas com HTML e CSS; JavaScript no navegador; Terminal, Git e
documentação; Servidor e dados; Projeto de ponta a ponta. Cada um tem "ainda não" e três frases
"consigo…", da menor para a maior (eram duas até 2026-10-16), e **cada frase lista
explicitamente as competências que afirma** (`quickAssessment` no track). Escolher a frase põe
essas competências no nível dela, limitado ao alvo.

- **A frase menor afirma menos, de propósito.** "Escrevo funções… seguindo um exemplo" não diz
  nada sobre depurar; depuração só entra a partir da frase do meio. Como depuração é o que
  aproxima a IA, quem segue tutorial continua com IA em "não agora" (teste).
- **A frase do meio dá crédito parcial.** Fica no mesmo nível da menor e afirma mais
  competências: quem lê a mensagem de erro até a linha, quem já fez um fetch seguindo exemplo,
  quem consulta a documentação quando lhe indicam a página. Antes essas pessoas tinham de
  escolher entre subestimar (frase menor) e inflar (frase maior).
- **Cobertura:** as frases maiores passaram a afirmar interface com componentes (JavaScript),
  autenticação (Servidor e dados) e IA com verificação (Programar, junto com depurar sozinho,
  que é o que a competência exige). **Sem pergunta** fica só algoritmos e custo: começa em
  "ainda não". Num catálogo aberto, subestimar custa um item a mais marcado como recomendado;
  superestimar esconde conteúdo e libera o que vem depois (ADR-0003).
- **Validador:** cada competência responde a uma pergunta só; cada frase afirma mais que a
  anterior (sobe de nível ou, no mesmo nível, afirma mais competências) e nunca deixa de afirmar
  o que a anterior afirma; só exigências do track.
- **Ênfase** (front-end, back-end, ainda não sei) virou tela opcional no fim.

Custo assumido: a frase composta é menos precisa que 25 frases separadas. Compensa porque nada
mais é trancado, e o ajuste por competência entra na Minha área (§9).

## 7. Impacto no TCC

- **A tese não muda de mecanismo, muda de papel.** Avaliação → lacuna → prioridade →
  recomendação continua determinística e auditável. O que muda é o uso: o sistema aconselha,
  não prescreve (§4.1).
- **O experimento fica mais limpo.** Antes, a condição A era outra tela (`/catalogo`). Agora
  pode ser a **mesma trilha sem a camada de direção**, e a condição B, a mesma trilha com ela.
  A única diferença entre as condições passa a ser o conselho — que é o que se quer medir.
- **Medida nova, possível só com liberdade:** aderência — que fração das escolhas da pessoa caiu
  em "recomendado agora", em "não agora" e em "falta base". É o que Barria-Pineda et al. (2021)
  mediram. Depende do registro de eventos com consentimento (§5, `study_event`).
- **Texto:** §3.2 descreve a camada de direção, os níveis da trilha com a regra de ordem, a vaga
  de prática e a avaliação em 6 perguntas; §4 ganha o referencial de controle compartilhado.
- **Versão do catálogo:** `2026.10.15-2`.

## 8. Decisões que são do Enzo

1. ~~A agenda diária gerada sai?~~ **Decidido: saiu** (2026-10-15). Ficaram propósito, meta e
   o registro do que foi estudado, na Minha área.
2. ~~Login~~ **Implementado:** anônimo por padrão, Google e GitHub opcionais.
3. **Neon:** criar o projeto e seguir "Como ligar o banco" (§5).
4. **Registro de eventos para medir aderência** (com consentimento): levar ao orientador junto
   com o desenho A/B revisado. Pesquisa com pessoas pode exigir parecer de ética; perguntar.
5. **Visual:** o Laracasts fica como referência de **organização** agora; a pele (tema escuro ou
   papel) continua para o fim, como ele decidiu. A trilha do Laracasts também é vertical, então
   não conflita com a ADR-0008.

## 9. Estado e próximos passos

**Feito (2026-10-15):**

- `/trilha` — 4 níveis, conteúdo concreto por competência ("comece aqui", prática, quantos
  recursos), horas e semanas a 1h30/dia, "você vai aprender", livros como ramo opcional,
  "fora da trilha · pode ignorar", e "para você agora" (3) quando há perfil.
- `/competencias/[id]` — todos os recursos em aprender, praticar e provar; "antes, vale ter"
  como caminho de volta com links; "abre caminho para"; hábitos; critérios de saída.
- Camada de direção (`lib/advice.ts`): já sabe, recomendado agora (máx. 3, com motivo
  numérico), falta base, não agora. **"Não agora" agora tem conteúdo visível** — antes era o
  único bloqueio real.
- Avaliação em 6 perguntas (§6).
- Validador: ordem da trilha contra o grafo; avaliação rápida; texto de tela sem código interno
  (três notas de curador tinham vazado para a página).
- 95 testes, tipos e lint limpos.

**Feito (2026-10-15, segunda rodada):**

- **Agenda fora.** `/plano` e o gerador de semana saíram; `/plano` redireciona para a Minha área.
- **Explorar** (`/explorar`): conteúdos (137), ferramentas (13) e hábitos (26). Filtros por
  direção, tipo (aprender, praticar, provar, livros), português, grátis, competência e criador,
  com contagem facetada — o número ao lado da opção é o que aparece ao clicar. Estado na URL.
  Dentro de cada competência, a mesma ordem e o mesmo "comece aqui" da trilha. Projetos, Kit,
  Biblioteca e Comportamental viraram filtros e abas; as rotas antigas redirecionam.
- **Minha área** (`/minha-area`): continuar, minha lista, concluídos, propósito e meta, conta.
  Todo recurso ganhou "+ minha lista" e "marcar como concluído"; abrir o link conta como começar.
  Concluir não muda nível.
- **Navegação:** Trilha · Explorar · Minha área. `/mapa` e `/catalogo` continuam no ar só para
  o experimento, fora da navegação, até o desenho A/B ser revisto com o orientador.
- **Banco pronto para conectar** (§5).
- 104 testes; tipos, lint e build limpos.

**Feito (2026-10-15, terceira rodada):**

- **Git.** Repositório na raiz do `TCC_ROADMAP`, com commit de base. Ficam fora: dependências,
  builds, segredos, configuração local, a skill instalada e o documento de terceiro usado como
  referência de formato.
- **Entrada:** `/` leva à trilha; o mapa genérico antigo saiu. As 6 perguntas terminam na
  trilha, com "para você agora" já preenchido.
- **Critérios de saída guardados** (antes sumiam ao recarregar), no navegador e no banco
  (`criteria_check`, migração `0001`). A trilha mostra "✓ x de y critérios" e "x de y já no seu
  nível" por nível. O botão desabilitado "Verificar em 3 perguntas" — texto provisório de uma
  função que não existe — virou "Ajustar meu nível".
- **LGPD:** `/privacidade` (o que guardamos, para quê, com quem, por quanto tempo, quem
  responde) e "Apagar meus dados" na Minha área, em dois passos, apagando em cascata no
  servidor. O IP da sessão fica, para limitar abuso no login, e está declarado.
- **Seletor de perfis de demonstração** no rodapé da trilha, para apresentar ao orientador.
- **ADR-0009** (orientar sem prender) e **ADR-0010** (persistência e login).
- 105 testes; tipos, lint e build limpos.

**Feito (2026-10-15, quinta rodada — pronto para uso):**

- **Conteúdo comparado com seis currículos abertos** (`docs/COMPARACAO-CURRICULOS.md`):
  - competência nova "Interface com componentes";
  - critérios acrescentados em oito competências;
  - 18 recursos novos, com o catálogo indo de 137 para 155;
  - o recurso do Full Stack Open corrigido;
  - autenticação passando de opcional a apoio.
- **A trilha virou estrada** (ADR-0011). O trecho percorrido fica em tinta até o "você está
  aqui", agora a primeira estação que ainda pede estudo.
- **Fonte de leitura:** Atkinson Hyperlegible Next no lugar da Inter, que a auditoria apontava
  como clichê. O fundo creme fica, porque é a direção fixada no `CLAUDE.md`.
- **Seletor de demonstração escondido de quem usa o site.** Ele só aparece com
  `?perfil=fixture-...` na URL. "Refazer as 6 perguntas" ficou visível na trilha.
- **Busca:** `robots.txt` e `sitemap.xml`. As páginas de método e do experimento ficam com
  `noindex`.
- **Contraste e superfícies do navegador:** placeholder, seleção, cursor de texto e rótulos sem
  espaçamento largo.

**Feito (2026-10-16, sexta rodada — criar desde o primeiro minuto):**

- **Regras do projeto podadas.** `CLAUDE.md` e `AGENTS.md` na raiz, curtos, só com o que o
  código não conta; as regras de escrita de código vêm do kit pessoal do Enzo. Saíram o manual
  visual do canvas e as listas de leitura obrigatória.
- **Construções** (ADR-0012): 11 coisas para fazer e mostrar, avaliadas contra o perfil, com
  página própria, passo a passo, critério de pronto e "Construí isto". A trilha começa por elas;
  cada nível fecha nelas; cada estação diz o que destrava.
- **Primeiro acesso:** "Você não precisa saber tudo para começar a criar", a porta de entrada
  sem exigência e o convite às 6 perguntas.
- **Prompt para IA externa** nas páginas de competência e de construção, por template, sem IA
  dentro do produto.
- **Desenhos a traço** por construção; **modo escuro** pelos tokens, seguindo o sistema.
- **Catálogo:** Context7 e impeccable no kit de ferramentas; Awwwards e Mobbin como referências
  de teto para CSS e componentes.
- **Kit de trabalho com IA** (github.com/EnzoAraujoDuarte/kit-career-gap, público, MIT): o
  marketplace pessoal do Enzo reescrito em português, para qualquer stack, com as regras, `pr`,
  `depurar`, `decisao`, `passagem` e o agente `revisor`. Validado com `claude plugin validate`;
  cadastrado no catálogo como ferramenta, com portão de Git e de IA.
- 116 testes; referências em `docs/REFERENCIAS-UX.md`.
- **Depois do merge, no mesmo dia:** a seção "O kit de desenvolvimento profissional" na trilha e a
  página `/kit`, com um comando que instala o kit e as skills de forma interativa
  (`install.sh` no repositório do kit); toda ferramenta ganhou "como ter" (tipo, nota e comando);
  Node.js e Claude Code entraram no catálogo (o segundo com o custo dito); cada construção lista
  o que a pessoa precisa ter e tem passo a passo marcável, guardado na mesma tabela dos critérios.
  118 testes.

**Feito (2026-10-16, sétima rodada — pronto para receber testadores):**

- **Fluxo de entrada conferido em produção**, no navegador: as 6 perguntas criam a sessão anônima
  na primeira gravação, o perfil e o snapshot do motor chegam ao Neon `main`, a Minha área diz
  "salvo neste navegador e no servidor", e "Apagar meus dados" remove tudo em cascata (contagem
  de linhas antes e depois). Login com Google e GitHub segue sem credencial na Vercel: não
  existe cadastro, e isso é decisão, não falta (ADR-0010).
- **Questionário da pesquisa** em `/pesquisa` (ADR-0013, `docs/AVALIACAO-COM-USUARIOS.md`):
  termo de consentimento, perfil do participante em faixas, uso, 21 itens sobre a trilha (qualidade
  do roadmap, ResQue, checagem da manipulação), SUS e três perguntas abertas. Uma resposta por
  pessoa; o servidor grava junto o retrato da trilha que a pessoa via. `pnpm db:respostas` exporta
  em CSV sem identificador, com o escore SUS. Migração `0002_respostas_da_pesquisa`.
- 127 testes.
- **Três frases por pergunta** (§6): a do meio dá crédito parcial no mesmo nível; as maiores
  passaram a cobrir componentes, autenticação e IA. Catálogo `2026.10.16-1`; 130 testes.
- **Hábitos de carreira**, tema novo "Ser visto e seguir aprendendo", tradição Apprenticeship
  Patterns (Hoover e Oshineye, 2009): publicar o que aprendeu, no seu ritmo (LinkedIn), conviver
  com outros devs em eventos e comunidades, manter currículo, LinkedIn e conhecimento em dia.
  Ligados a comunicação técnica, participação em code review e leitura de documentação. O
  sistema indica o hábito; não analisa currículo nem perfil, que segue fora do escopo. 131 testes.
- **ai-memory no kit** (pedido do Enzo): o projeto aberto do Fabio Akita entra no catálogo de
  ferramentas, na seção do kit na trilha e na página `/kit`, como memória entre sessões e entre
  agentes (Claude Code, Codex, Cursor, Gemini CLI), com portão de Git e de IA. 19 ferramentas;
  catálogo `2026.10.16-2`.
- **Pessoas que valem seguir** (pedido do Enzo, a partir do Fabio Akita): aba nova no Explorar
  com 13 nomes brasileiros, página oficial conferida, o que publicam, por onde começar e o
  portão que diz quando rende (mesma régua das ferramentas, `missingGates`). Teto de 15 no
  validador: curadoria, não diretório. Catálogo `2026.10.16-3`.
- **Questionário, bloco "O Career Gap para você"** (pedido do Enzo): dez itens que perguntam direto
  o que a tese afirma (caminho claro, lacunas que não conhecia, onde estou, o que já construo,
  próximo passo, o que ignorar, melhor que antes), mais "qual lacuna você descobriu" e "qual vai
  ser o seu primeiro passo". Instrumento `2026.10.16-2`.
- **Questionário enxugado** (pedido do Enzo: menos perguntas, mais claras): 29 itens de escala,
  6 de escolha, 1 aberto (a lacuna descoberta), frases de até 80 caracteres, uns 5 minutos; o SUS
  fica inteiro. Teto verificado por teste. Instrumento `2026.10.16-4`.

**Feito (2026-10-17, nona rodada — stack e carreira):**

- **Caminho independente de stack, dito explicitamente** (ADR-0014): abertura da trilha e bloco
  "a linguagem do servidor é escolha sua" no nível 3, com JavaScript/Node.js e Java/Spring (as
  duas com material verificado) ou "ainda não sei". A escolha fica no perfil (`technology_id`,
  migração `0003`), entra no snapshot do motor e só reordena materiais, com o motivo "na linguagem
  que você escolheu". Validador exige material para cada linguagem oferecida.
- **Carreira na era da IA**, do pedido do Enzo: carta de abertura (`/carta`, resumo no alto da
  trilha) com os dados próprios de vagas; "Seu portfólio" na Minha área, as construções agrupadas
  pelo que provam (fundamentos, front-end, back-end, design, IA, colaboração), com a frase para o
  currículo de cada uma e a construção mais perto do que falta; construção nova "Um site com
  design de prêmio" (12 construções); hábito "Nunca fique sem um projeto aberto" (30 hábitos);
  item `nao-agora-util` no questionário, para a hipótese c do projeto (instrumento
  `2026.10.17-5`).

**Próximo:**

1. Aplicar a migração `0003` no Neon `main` antes de publicar (a `0002` já está lá).
2. Condição A do experimento como trilha sem anotação, depois de falar com o orientador.
