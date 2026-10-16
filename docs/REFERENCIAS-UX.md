# Referências de UX para a rodada "criar desde o primeiro minuto"

Data: 2026-10-16. Pedido: tornar a experiência mais atrativa, intuitiva e envolvente para quem
está começando, fazendo a pessoa perceber que já consegue construir algo desde o primeiro
acesso. Pesquisa feita antes de decidir; o que foi adotado está na ADR-0012.

## Produtos de aprendizagem

| Produto | O que faz bem | O que levamos | O que não levamos |
|---|---|---|---|
| **Laracasts Path** (laracasts.com/path) | Níveis com "You'll learn", um desenho por série, trilha vertical com marcos, "Jump back in", "Completed" | Bloco de nível com "você vai aprender"; um desenho a traço por construção e por nível; Minha área com continuar/lista/concluídos (já existia) | Tema escuro com pixel art e magenta: é a pele deles |
| **Hyperskill** (hyperskill.org/how-we-teach) | Projeto como unidade; estágios que crescem; tópicos servem ao estágio | Construção como unidade que liga competências a resultado; passos curtos | Plataforma fechada com código executado no site |
| **Frontend Mentor** (frontendmentor.io/guides) | Cinco níveis; o primeiro é um componente de poucas horas; "comece pelo Newbie seja qual for sua experiência" | Construções de horas, não semanas; porta de entrada sem exigência | Designs prontos para copiar (direitos) |
| **roadmap.sh projects** (roadmap.sh/frontend/projects) | Projetos por dificuldade, com verbo de ação e uma frase | Frase de resultado concreta em cada construção | O conteúdo é só para uso pessoal; nada copiado |
| **Trilha Info** (trilha.info) | Estrada vertical; "Estudei" separado de "Demonstrei"; projeto fecha o trecho | Já adotado na ADR-0011; aqui, a bandeira do nível vira a construção | Tema escuro, aulas geradas |
| **Scrimba, Exercism** | Projeto cedo, exercícios de conceito e de prática | Prática antes de "saber tudo" | Editor embutido |

## Referências de teto para front-end

Pedido do dono do produto: citar o nível alto do front-end. Entraram no catálogo como referências
(`kind: reference`), para quem já monta uma página, com o portão de CSS e de componentes:

- **Awwwards** (awwwards.com/websites) — sites premiados por design e desenvolvimento; serve
  para ver o que o front-end de ponta faz em layout, tipografia e movimento, e inspecionar no
  DevTools.
- **Mobbin** (mobbin.com) — biblioteca de padrões de interface de produtos reais, por padrão
  (login, busca, formulário, estado vazio); serve para decidir como um componente costuma se
  comportar antes de inventar. Plano gratuito com limite.

## Evidência

- **Autoeficácia (Bandura).** A experiência de domínio é a fonte mais forte de autoeficácia, e
  fracassos cedo são os que mais derrubam. Por isso a primeira construção não exige nada e cabe
  em uma hora e meia.
- **Progresso dotado (Nunes e Drèze, 2006).** Mostrar progresso já conquistado aumenta a chance
  de concluir, com a ressalva dos autores: o progresso precisa ter uma razão. Por isso "N de 11
  ao seu alcance" sai do motor, nunca é um número de boas-vindas.
- **Exemplo trabalhado e reversão por perícia (Sweller; Kalyuga et al., 2003).** Novatos aprendem
  mais estudando exemplo resolvido; quem já sabe rende mais resolvendo. Por isso a ficha abre com
  quem ensina e a construção pede a prática no nível-alvo.
- **Controle compartilhado** (`docs/PLANO-FASE4.md` §4.1): aconselhar e deixar escolher. Por isso
  construção "mais adiante" abre do mesmo jeito.

## Hipótese avaliada: prompt para IA externa

Valor real para quem começa: a pessoa já usa ChatGPT ou Gemini e não sabe pedir; um prompt que
pede um tutor (perguntas, conferência contra critérios, sem solução pronta) ensina o uso que a
competência de IA da trilha defende. Custo baixo: template sobre dados do catálogo, sem chave,
sem chamada. Risco: virar "peça à IA que faça por você"; mitigado pelas regras no próprio
prompt. Adotado nas páginas de competência e de construção. Não há IA dentro do produto
(ADR-0004).

## Fontes

- Laracasts Path — https://laracasts.com/path
- Hyperskill, How we teach — https://hyperskill.org/how-we-teach
- Frontend Mentor, difficulty levels e choose your first challenge —
  https://www.frontendmentor.io/guides/difficulty-levels ·
  https://www.frontendmentor.io/guides/choose-your-first-challenge
- roadmap.sh, Frontend projects — https://roadmap.sh/frontend/projects
- Bandura, A. Self-efficacy: toward a unifying theory of behavioral change (1977); síntese em
  https://www.simplypsychology.org/self-efficacy.html
- Nunes, J. C.; Drèze, X. The endowed progress effect. Journal of Consumer Research, 2006;
  síntese em https://uxdesign.cc/designing-for-motivation-with-the-endowed-progress-effect-d213d5dd86a2
- Kalyuga, S.; Ayres, P.; Chandler, P.; Sweller, J. The expertise reversal effect (2003);
  síntese em https://en.wikipedia.org/wiki/Expertise_reversal_effect
- Awwwards — https://www.awwwards.com/websites/
- Mobbin — https://mobbin.com/
