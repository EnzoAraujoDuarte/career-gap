// GERADO por scripts/build-resource-catalog.ts — não editar à mão.
// Fonte: docs/research/*.json — verificados um a um em 2026-09-11; prática e missões em 2026-10-15.
// Regenerar com: pnpm build:resources
import type { Resource } from '@/domain/model';

export const RESOURCES: readonly Resource[] = [
  {
    id: "curso-de-algoritmos-e-logica-de-programacao-40-horas",
    title: "Curso de Algoritmos e Lógica de Programação [40 Horas]",
    sourceName: "Gustavo Guanabara (Curso em Vídeo)",
    url: "https://www.cursoemvideo.com/curso/curso-de-algoritmo/",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "programming-fundamentals",
      "problem-decomposition"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: true,
    license: "direitos reservados — apenas linkar",
    why: "16 aulas de pseudocódigo, de entrada/operadores a vetores e matrizes. Verificado na página oficial: gratuito, só o certificado é pago. Pseudocódigo não sofre defasagem de sintaxe, então a ausência de data não invalida. É o nó de entrada para quem nunca escreveu um algoritmo.",
    origin: "br-creator"
  },
  {
    id: "curso-logica-de-programacao-2026-aprenda-em-3-horas-de-verdade",
    title: "Curso Lógica de Programação 2026 – Aprenda em 3 Horas (De Verdade!)",
    sourceName: "Jhonatan de Souza (Dev Aprender)",
    url: "https://www.youtube.com/watch?v=epf-WQdVis0",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "programming-fundamentals",
      "problem-decomposition"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Mesma competência do curso de 40h em um artefato único de ~3h: variante de baixo atrito para quem abandona curso longo. Canal oficial confirmado e ativo. Registrar 2025 como ano; nunca tomar o título como fonte de data.",
    origin: "br-creator"
  },
  {
    id: "curso-de-javascript-do-zero-parte-1-variaveis-onclick-funcoes-e-intera",
    title: "CURSO DE JAVASCRIPT DO ZERO | parte 1 - variáveis, onClick, funções e interação com HTML",
    sourceName: "Rafaella Ballerini",
    url: "https://www.youtube.com/watch?v=Z7mnxUI4u00",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "javascript-essentials",
      "dom-and-browser"
    ],
    levelMin: "L0",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Único artefato de JS/DOM da lista com data de publicação confirmada e recente. O título nomeia onClick e interação com HTML, o que sustenta o mapeamento sem depender de assistir. É 'parte 1' de série: o nó precisa indicar a continuidade, senão o usuário termina pela metade.",
    origin: "br-creator"
  },
  {
    id: "curso-gratis-de-javascript-e-ecmascript-para-iniciantes",
    title: "Curso Grátis de JavaScript e ECMAScript para Iniciantes",
    sourceName: "Gustavo Guanabara (Curso em Vídeo)",
    url: "https://www.youtube.com/playlist?list=PLHz_AreHm4dlsK3Nr9GVvXCbpQyHQl1o1",
    kind: "playlist",
    actionType: "WATCH",
    competencies: [
      "javascript-essentials"
    ],
    levelMin: "L0",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Cobertura mais longa de JavaScript como linguagem-base em pt-BR gratuito. Risco declarado: JavaScript é a tecnologia mais perecível do catálogo e não confirmei a data das aulas; se forem anteriores a ~2018 (var/ES5), rebaixar ou substituir. Validar manualmente antes de publicar este nó.",
    origin: "br-creator"
  },
  {
    id: "introducao-ao-dom-curso-javascript-09",
    title: "Introdução ao DOM - Curso JavaScript #09",
    sourceName: "Gustavo Guanabara (Curso em Vídeo)",
    url: "https://www.youtube.com/watch?v=WWZX8RWLxIk",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "dom-and-browser"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Modelo mental de árvore DOM (parent/child, querySelector), que é o conceito ausente quando o aluno copia seletores sem entender o que seleciona. Autoria e gratuidade confirmadas por oEmbed e pela página oficial do curso. Não cobre APIs modernas de navegador.",
    origin: "br-creator"
  },
  {
    id: "curso-estrutura-de-dados-e-algoritmos-java",
    title: "Curso Estrutura de Dados e Algoritmos Java",
    sourceName: "Loiane Groner",
    url: "https://www.youtube.com/playlist?list=PLGxZ4Rq3BOBrgumpzz-l8kFMw2DLERdxi",
    kind: "playlist",
    actionType: "WATCH",
    competencies: [
      "algorithms-and-complexity"
    ],
    levelMin: "L2",
    technology: "java",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Conteúdo gratuito mais completo de estruturas de dados em pt-BR, com autoria confirmada pelo repositório oficial github.com/loiane/estrutura-dados-algoritmos-java. Duas ressalvas que o nó deve carregar: é Java (não a stack do público) e é L2 — deve ser ADIADO para quem ainda está em lógica básica.",
    origin: "br-creator"
  },
  {
    id: "akitando-94-o-que-vem-depois-do-hello-world-consertando-meu-c",
    title: "[Akitando] #94 - O que vem DEPOIS do Hello World | Consertando meu C",
    sourceName: "Fabio Akita (Akitando)",
    url: "https://akitaonrails.com/2021/03/22/akitando-94-o-que-vem-depois-do-hello-world-consertando-meu-c/",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "algorithms-and-complexity"
    ],
    levelMin: "L2",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: true,
    license: "direitos reservados — apenas linkar",
    why: "Competência e nível CORRIGIDOS na verificação: o conteúdo real é segmentação de memória, listas encadeadas, tabelas hash, ordenação e Big O — algorithms-and-complexity em L2, não problem-decomposition em L1. Depende do episódio anterior sobre C. Publicado no site do próprio autor.",
    origin: "br-creator"
  },
  {
    id: "comandos-basicos-linux-01-bash-ls-cd-pwd-encadeamento-clear",
    title: "Comandos Básicos Linux 01 - bash, ls, cd, pwd, encadeamento, clear",
    sourceName: "Fábio dos Reis (Bóson Treinamentos)",
    url: "https://www.youtube.com/watch?v=ufWrWK0I2o0",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "command-line-basics"
    ],
    levelMin: "L0",
    technology: "shell",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Primeiro passo do tamanho certo: navegação e orientação no shell, sem carga de sysadmin. Canal oficial confirmado. Preferível à playlist LPIC completa como porta de entrada.",
    origin: "br-creator"
  },
  {
    id: "curso-de-linux-basico-certificacao-lpic-1",
    title: "Curso de Linux Básico / Certificação LPIC - 1",
    sourceName: "Fábio dos Reis (Bóson Treinamentos)",
    url: "https://www.youtube.com/playlist?list=PLucm8g_ezqNp92MmkF9p_cj4yhT-fCTl7",
    kind: "playlist",
    actionType: "WATCH",
    competencies: [
      "command-line-basics"
    ],
    levelMin: "L0",
    technology: "shell",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Continuação para cp/mv/rm, chmod, ps/kill, grep/awk, pipes. RESSALVA FORTE: é orientado a certificação de sysadmin e a maior parte (boot, systemd, particionamento, redes) é irrelevante para dev web. O nó deve apontar aulas específicas, jamais a playlist inteira.",
    origin: "br-creator"
  },
  {
    id: "curso-completo-de-html-seu-primeiro-site-do-zero-para-iniciar-em-progr",
    title: "Curso completo de HTML - seu PRIMEIRO SITE DO ZERO para iniciar em PROGRAMAÇÃO!",
    sourceName: "Rafaella Ballerini",
    url: "https://www.youtube.com/watch?v=Fhy-5CtVkiM",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "html-semantics"
    ],
    levelMin: "L0",
    technology: "html",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "1h31 contínuas do zero a uma página pronta, sem exigir atravessar 40 aulas antes de ver resultado — reduz abandono em L0. Canal oficial ativo (último upload 31/08/2026).",
    origin: "br-creator"
  },
  {
    id: "curso-de-html-para-iniciantes-2023-aprenda-html-5-e-crie-um-projeto",
    title: "Curso de HTML para iniciantes 2023 - Aprenda HTML 5 e crie um projeto",
    sourceName: "Matheus Battisti (Hora de Codar)",
    url: "https://www.youtube.com/watch?v=yvCAX68TJMc",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "html-semantics"
    ],
    levelMin: "L0",
    technology: "html",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "1h47 só de HTML, útil quando misturar CSS na mesma aula sobrecarrega o aluno L0. Canal oficial e muito ativo (uploads diários em set/2026). Alternativa de dosagem ao vídeo de 3h do mesmo autor.",
    origin: "br-creator"
  },
  {
    id: "aprenda-css-do-zero-ate-colocar-o-site-no-ar-tutorial-passo-a-passo-co",
    title: "Aprenda CSS do ZERO até colocar o SITE NO AR | Tutorial PASSO A PASSO com PROJETO PRÁTICO",
    sourceName: "Rafaella Ballerini",
    url: "https://www.youtube.com/watch?v=AB35iSr1YyA",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "css-layout"
    ],
    levelMin: "L0",
    technology: "css",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Entrada em CSS no ponto em que o iniciante trava: sair do HTML cru e conseguir posicionar. NÃO confirmei que ensine flexbox/grid em vez de float, nem que a parte de publicar seja substantiva — por isso mapeei só css-layout e não deployment-basics.",
    origin: "br-creator"
  },
  {
    id: "curso-html5-e-css3-modulo-5-de-5",
    title: "Curso HTML5 e CSS3.- Módulo 5 de 5",
    sourceName: "Gustavo Guanabara (Curso em Vídeo)",
    url: "https://www.youtube.com/playlist?list=PLHz_AreHm4dn1bAtIJWFrugl5z2Ej_52d",
    kind: "playlist",
    actionType: "WATCH",
    competencies: [
      "css-layout"
    ],
    levelMin: "L1",
    technology: "css",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Artefato mais bem sustentado do catálogo: a varredura da playlist encontrou 39 menções a Flexbox e 41 a Grid nos títulos das aulas — o foco em layout moderno é evidência, não inferência por data. É o recurso PRINCIPAL de css-layout; o resto do catálogo gratuito pt-BR de CSS ainda é majoritariamente de 2017-2019.",
    origin: "br-creator"
  },
  {
    id: "curso-de-html-e-css-com-projeto-html-e-css-para-iniciantes",
    title: "Curso de HTML e CSS com projeto - HTML e CSS para iniciantes",
    sourceName: "Matheus Battisti (Hora de Codar)",
    url: "https://www.youtube.com/watch?v=PuyZAUyZYDI",
    kind: "video",
    actionType: "BUILD",
    competencies: [
      "build-an-application"
    ],
    levelMin: "L0",
    technology: "html",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Projeto guiado de 2h59 que fecha o gap 'sei as tags mas nunca montei uma página inteira'. Entra como projeto, não como recurso principal de HTML/CSS — para marcação e layout o catálogo já tem artefatos mais novos. Não confirmei se o CSS do projeto usa flexbox/grid.",
    origin: "br-creator"
  },
  {
    id: "criando-aplicacao-fullstack-do-zero-com-java-spring-e-react-parte-1-de",
    title: "Criando Aplicação Fullstack do Zero com Java Spring e React - Parte 1: Desenvolvimento do Backend",
    sourceName: "Fernanda Kipper",
    url: "https://www.youtube.com/watch?v=lUVureR5GqI",
    kind: "video",
    actionType: "BUILD",
    competencies: [
      "build-an-application"
    ],
    levelMin: "L1",
    technology: "java",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "URL e título CORRIGIDOS: o mapeamento original apontava para o repositório GitHub com um título inventado. Projeto de ponta a ponta (Spring MVC + JPA + PostgreSQL) com repositório oficial (95 stars) e front companheiro em React. É 'Parte 1' — cadastrar a parte de frontend separadamente se o nó exigir ciclo completo.",
    origin: "br-creator"
  },
  {
    id: "guia-wcag-guia-de-consulta-rapida",
    title: "Guia WCAG | Guia de consulta rápida",
    sourceName: "Guia WCAG (projeto Acessibilidade Toolkit)",
    url: "https://guia-wcag.com/",
    kind: "article",
    actionType: "READ",
    competencies: [
      "web-accessibility-basics",
      "reading-documentation"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: true,
    license: "direitos reservados — apenas linkar",
    why: "Traduz os critérios da WCAG para linguagem utilizável e resolve o gap de 'a norma oficial é ilegível para iniciante'. Sem paywall e sem cadastro. Autoria pessoal NÃO confirmada na página, por isso o creator está registrado como o projeto. É referência de consulta, não substitui aula prática — que não existe em pt-BR gratuito.",
    origin: "br-creator"
  },
  {
    id: "como-uma-pessoa-cega-navega-na-internet",
    title: "Como uma pessoa cega navega na internet?",
    sourceName: "Canal Inclunet (Camila Domingues e Leonardo Gleison Ferreira)",
    url: "https://www.youtube.com/watch?v=_wjFPrRfBZI",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "web-accessibility-basics"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Mostra o leitor de tela sendo usado de verdade em sites reais. Sem isso, alt e ARIA viram regra decorada; com isso, viram consequência observável. Usar como motivação inicial — é canal de usuário/tecnologia assistiva, nunca fonte técnica de implementação.",
    origin: "br-creator"
  },
  {
    id: "aprenda-fetch-api-de-javascript-com-projeto",
    title: "APRENDA FETCH API DE JAVASCRIPT COM PROJETO",
    sourceName: "Matheus Battisti (Hora de Codar)",
    url: "https://www.youtube.com/watch?v=qIGYM4S8x50",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "api-consumption"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Único artefato-aula gratuito em pt-BR que confirmei ensinando consumo de API com projeto, e o título nomeia Fetch sem ambiguidade. 45min. NÃO confirmei cobertura de async/await, tratamento de erro ou estados de carregamento — recomendar só depois de javascript-essentials e complementar com documentação.",
    origin: "br-creator"
  },
  {
    id: "como-usar-o-console-no-navegador-conteudo-extra-das-aulas-de-javascrip",
    title: "Como usar o CONSOLE no navegador? | Conteúdo extra das aulas de Javascript!",
    sourceName: "Rafaella Ballerini",
    url: "https://www.youtube.com/watch?v=rvBdC3Ziwg8",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "debugging"
    ],
    levelMin: "L0",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Gap raramente coberto: o iniciante escreve código e não sabe que o navegador tem ferramentas de inspeção. Mapeamento para dom-and-browser foi REMOVIDO na verificação — pelo título cobre console, não DevTools inteiro (inspetor, network, breakpoints).",
    origin: "br-creator"
  },
  {
    id: "debugger-javascript-no-google-chrome-devtools-aprenda-a-debugar",
    title: "Debugger JavaScript no Google Chrome DevTools - Aprenda a Debugar",
    sourceName: "hcode",
    url: "https://www.youtube.com/watch?v=ReL1M9m2wqc",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "debugging"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Breakpoints, step e watch no navegador — o caminho mais curto para parar de adivinhar bug. Titularidade confirmada porque o próprio site publica o vídeo. RESSALVAS: sem evidência de publicações do canal nos últimos 18 meses, e a UI do Chrome mudou painéis de lugar desde 2020.",
    origin: "br-creator"
  },
  {
    id: "aprendendo-docker-empacotando-api-java-spring-deploy-na-aws",
    title: "APRENDENDO DOCKER | EMPACOTANDO API JAVA SPRING + DEPLOY NA AWS",
    sourceName: "Fernanda Kipper",
    url: "https://www.youtube.com/watch?v=l9k_tWRTX7k",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "deployment-basics"
    ],
    levelMin: "L1",
    technology: "java",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Único artefato razoável de deployment em pt-BR gratuito que sobreviveu à verificação: leva a API do 'roda na minha máquina' até publicada. ALERTA: tutorial de console AWS é o tipo de conteúdo que envelhece rápido; revalidar antes de tratar como caminho único, e não assumir que cobre variáveis de ambiente, logs ou rollback.",
    origin: "br-creator"
  },
  {
    id: "dicionario-do-programador",
    title: "Dicionário do Programador",
    sourceName: "Código Fonte TV (Gabriel Fróes e Vanessa Weber)",
    url: "https://www.youtube.com/playlist?list=PLVc5bWuiFQ8GgKm5m0cZE6E02amJho94o",
    kind: "playlist",
    actionType: "WATCH",
    competencies: [
      "technical-communication",
      "reading-documentation"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Entra como REFERÊNCIA de vocabulário: o gap de iniciante costuma ser não saber nomear as coisas (API, deploy, HTTP) ao falar com o time e ao ler documentação. Só esta playlist do canal entra — o restante é notícia e opinião, que não popula nó de competência.",
    origin: "br-creator"
  },
  {
    id: "tabnews-conteudos-para-quem-trabalha-com-programacao-e-tecnologia",
    title: "TabNews: Conteúdos para quem trabalha com Programação e Tecnologia",
    sourceName: "TabNews (comunidade open source BR, mantida por Filipe Deschamps)",
    url: "https://www.tabnews.com.br/",
    kind: "community",
    actionType: "PROVE",
    competencies: [
      "technical-communication"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: true,
    license: "direitos reservados — apenas linkar",
    why: "Comunicação técnica não se aprende assistindo vídeo. Único espaço BR gratuito verificado onde o iniciante escreve pergunta técnica pública e recebe resposta. Só faz sentido no roadmap atrelado a uma tarefa concreta ('publique sua dúvida descrevendo o que já tentou'), nunca como leitura passiva.",
    origin: "br-creator"
  },
  {
    id: "curso-de-modelagem-de-dados",
    title: "Curso de Modelagem de Dados",
    sourceName: "Fábio dos Reis (Bóson Treinamentos)",
    url: "https://www.youtube.com/playlist?list=PLucm8g_ezqNoNHU8tjVeHmRGBFnjDIlxD",
    kind: "playlist",
    actionType: "WATCH",
    competencies: [
      "relational-data-modeling"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Raro conteúdo pt-BR que trata modelagem relacional como disciplina própria (MER/DER, dicionário de dados, formas normais) e não como apêndice de tutorial de CRUD. Ementa confirmada no site oficial. Fecha o gap de quem escreve SELECT mas não sabe decidir tabelas e chaves.",
    origin: "br-creator"
  },
  {
    id: "curso-de-bancos-de-dados-com-mysql",
    title: "Curso de Bancos de Dados com MySQL",
    sourceName: "Fábio dos Reis (Bóson Treinamentos)",
    url: "https://www.youtube.com/playlist?list=PLucm8g_ezqNrWAQH2B_0AnrFY5dJcgOLR",
    kind: "playlist",
    actionType: "WATCH",
    competencies: [
      "sql-basics",
      "relational-data-modeling"
    ],
    levelMin: "L0",
    technology: "sql",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "SQL do zero com progressão explícita para quem nunca abriu um banco. CORREÇÃO: a alegação de repositório com scripts do curso NÃO se sustenta — github.com/bosontreinamentos/mysql tem 3 commits e 2 arquivos soltos, não serve como material de prática.",
    origin: "br-creator"
  },
  {
    id: "curso-de-banco-de-dados-mysql",
    title: "Curso de Banco de Dados MySQL",
    sourceName: "Gustavo Guanabara (Curso em Vídeo)",
    url: "https://www.youtube.com/playlist?list=PLHz_AreHm4dkBs-795Dsgvau_ekxg8g1r",
    kind: "playlist",
    actionType: "WATCH",
    competencies: [
      "sql-basics"
    ],
    levelMin: "L0",
    technology: "sql",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Rampa de menor atrito para L0 absoluto: ritmo lento, sem jargão, instalação guiada. Indicar quando o usuário trava em 'nem sei o que é uma tabela'. Para L1 é lento demais — nesse caso preferir Bóson. A parte de instalação pode estar datada; o SQL não.",
    origin: "br-creator"
  },
  {
    id: "crie-uma-api-restful-com-node-js-e-mongodb-crud-com-node-express-e-mon",
    title: "Crie uma API RESTful com Node.js e MongoDB | CRUD com Node, Express e Mongoose",
    sourceName: "Matheus Battisti (Hora de Codar)",
    url: "https://www.youtube.com/watch?v=K5QaTfE5ylk",
    kind: "video",
    actionType: "BUILD",
    competencies: [
      "api-development"
    ],
    levelMin: "L1",
    technology: "node",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Caminho de menor atrito para quem vem de JavaScript no navegador e nunca escreveu servidor: CRUD completo em uma sessão. PRÉ-REQUISITO OBRIGATÓRIO no roadmap: usa MongoDB, então NÃO cobre sql-basics nem relational-data-modeling — parear com os cursos de banco, senão o aluno termina a trilha de API sem nunca ter escrito um JOIN.",
    origin: "br-creator"
  },
  {
    id: "spring-data-jpa-curso-2024",
    title: "Spring Data JPA | Curso 2024",
    sourceName: "Michelli Brito",
    url: "https://www.youtube.com/watch?v=Ca30sv9EbLo",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "api-development"
    ],
    levelMin: "L1",
    technology: "java",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Caminho Java/Spring, que domina vaga júnior em banco e seguro no Brasil. Liga API a persistência relacional — o salto 'já sei sintaxe, nunca liguei API a banco'. CORREÇÃO: o rótulo api-consumption foi removido, o curso é de persistência, não de consumo de APIs externas.",
    origin: "br-creator"
  },
  {
    id: "autenticacao-e-autorizacao-com-spring-security-jwt-tokens-e-roles",
    title: "Autenticação e Autorização com Spring Security, JWT Tokens e Roles",
    sourceName: "Fernanda Kipper",
    url: "https://www.youtube.com/watch?v=5w-YCcOjPD0",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "authentication-basics"
    ],
    levelMin: "L1",
    technology: "java",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Único artefato do lote cuja evidência de apoio se confirmou por inteiro: repositório oficial github.com/Fernanda-Kipper/auth-api com 321 stars, Spring Security + JWT + PostgreSQL + Flyway e README documentando os papéis USER e ADMIN — o que sustenta a separação entre autenticação e autorização. Limite: é Java; não há equivalente em Node/JS no catálogo.",
    origin: "br-creator"
  },
  {
    id: "programacao-para-qa-s-que-querem-automatizar-testes-a-introducao",
    title: "Programação para QA's que querem automatizar testes: A introdução",
    sourceName: "Julio de Lima",
    url: "https://www.youtube.com/watch?v=XAFfvt0Fej0",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "automated-testing-basics"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Artefato de teste automatizado mais próximo de L0 que encontrei em pt-BR: assume zero base e constrói do conceito. RESSALVA ESTRUTURAL: a lente é de carreira QA, não de dev testando o próprio código — cobre o conceito, não o hábito de escrever teste junto com a função.",
    origin: "br-creator"
  },
  {
    id: "como-fazer-testes-automatizados-em-javascript-sem-frameworks",
    title: "Como fazer testes automatizados em JavaScript (SEM FRAMEWORKS)",
    sourceName: "Erick Wendel",
    url: "https://www.youtube.com/watch?v=8hxhZkBzWhk",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "automated-testing-basics"
    ],
    levelMin: "L2",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Desmonta a ideia de que testar é configurar Jest e mostra o mecanismo por baixo. O próprio título pressupõe que o aluno já saiba o que um framework de teste faz: manter como L2 e ADIADO — recomendar antes disso causa reversão de expertise.",
    origin: "br-creator"
  },
  {
    id: "aprenda-a-programar-do-zero-com-ia-curso-100-gratuito-rocketseat-disco",
    title: "Aprenda a Programar do Zero com IA: Curso 100% Gratuito | Rocketseat Discover",
    sourceName: "Rocketseat",
    url: "https://www.rocketseat.com.br/discover",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "ai-assisted-development-basics"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: true,
    license: "direitos reservados — apenas linkar",
    why: "Única trilha BR gratuita confirmada que trata uso de IA no aprendizado já em L0, dentro de projeto guiado. CORREÇÃO: o rótulo version-control-git foi REMOVIDO — a página retorna 403 ao fetch e a ementa não foi verificada. Não confirmei se o acesso exige cadastro.",
    origin: "br-creator"
  },
  {
    id: "o-que-todo-dev-precisa-saber-antes-de-confiar-na-ia",
    title: "O que todo dev precisa saber antes de confiar na IA",
    sourceName: "Rocketseat",
    url: "https://www.youtube.com/watch?v=0ifZP3AJuV0",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "ai-assisted-development-basics"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Cobre o lado de ceticismo e verificação — o gap perigoso de L0-L1, que é aceitar código gerado sem entender. PENDÊNCIA DECLARADA: a URL e o título conferem, mas nenhuma fonte independente liga este vídeo ao canal da Rocketseat; a titularidade precisa de conferência humana antes de publicar o nó.",
    origin: "br-creator"
  },
  {
    id: "clean-code-rodrigo-branas",
    title: "Clean Code (Rodrigo Branas)",
    sourceName: "Rodrigo Branas",
    url: "https://www.youtube.com/playlist?list=PLQCmSnNFVYnSpfpwwQGO8QHQ3CcizaZsV",
    kind: "playlist",
    actionType: "WATCH",
    competencies: [
      "code-readability"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Trata nomeação, legibilidade e refatoração como decisão, não como regra decorada. Playlist curta e de 2017, mas conceitual e independente de versão de linguagem. É o nó mais frágil do catálogo: todo material BR recente de legibilidade está atrás de paywall ou é nível pleno/sênior.",
    origin: "br-creator"
  },
  {
    id: "curso-de-git-e-github-gratis-pratico-e-sem-usar-comandos-no-terminal",
    title: "Curso de Git e GitHub: grátis, prático e sem usar comandos no terminal",
    sourceName: "Gustavo Guanabara (Curso em Vídeo)",
    url: "https://www.youtube.com/playlist?list=PLHz_AreHm4dm7ZULPAmadvNhH6vk9oNZA",
    kind: "playlist",
    actionType: "WATCH",
    competencies: [
      "version-control-git"
    ],
    levelMin: "L0",
    technology: "git",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Melhor rampa L0: ensina o modelo mental de versionamento sem exigir terminal, reduzindo a carga de quem ainda não tem command-line-basics. LIMITE EXPLÍCITO que o nó deve exibir: por ser via interface gráfica, NÃO cobre o fluxo por linha de comando — precisa ser sucedido pelo curso do Willian Justen.",
    origin: "br-creator"
  },
  {
    id: "git-e-github-na-vida-real",
    title: "Git e Github na Vida Real",
    sourceName: "Willian Justen",
    url: "https://www.youtube.com/playlist?list=PLlAbYrWSYTiNqugqFFWWsgONJsmc3eMpg",
    kind: "playlist",
    actionType: "WATCH",
    competencies: [
      "version-control-git",
      "command-line-basics"
    ],
    levelMin: "L1",
    technology: "git",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Confirmado no blog do próprio autor: 45 aulas em 4 módulos (~4h), com Issues/PR/code review no módulo 3 e Git Flow/feature branch no módulo 4. Único artefato BR gratuito verificado que trata Git como prática de equipe, e não como lista de comandos.",
    origin: "br-creator"
  },
  {
    id: "como-revisar-e-comentar-pull-requests-sem-ser-grosseiro-revisao-de-cod",
    title: "Como revisar e comentar pull requests sem ser grosseiro: revisão de código (título original contém linguagem chula)",
    sourceName: "Programador de Elite",
    url: "https://www.youtube.com/watch?v=fsMFuT59rMU",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "code-review-participation",
      "technical-communication"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Cobre o lado humano do code review — como escrever o comentário — que é o gap real de quem entra no primeiro time. Quase nenhum material BR gratuito trata isso. DUAS RESSALVAS: o título original contém palavrão e deve ser exibido editado num contexto acadêmico; a titularidade do canal não foi confirmada por fonte independente.",
    origin: "br-creator"
  },
  {
    id: "git-pull-requests-code-review-e-contribuicao-em-projetos-publicos-no-g",
    title: "Git - Pull requests, Code review e contribuição em projetos públicos no github e gitlab",
    sourceName: "Angelo Luz",
    url: "https://www.youtube.com/watch?v=thtAHpgYVg8",
    kind: "video",
    actionType: "WATCH",
    competencies: [
      "code-review-participation"
    ],
    levelMin: "L1",
    technology: "git",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Mostra o fluxo fork → PR → review em projeto público, que é o único caminho de praticar code review sem ter emprego. Perfil do autor (professor de TI e CTO) é coerente com a autoria. Entra por falta de alternativa viva e recente: a competência inteira depende de dois vídeos de 2020 e 2023.",
    origin: "br-creator"
  },
  {
    id: "uma-visao-geral-do-http",
    title: "Uma visão geral do HTTP",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Overview",
    kind: "doc",
    actionType: "READ",
    competencies: [
      "http-fundamentals"
    ],
    levelMin: "L0",
    technology: "http",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "25 min",
    why: "Única página que apresenta cliente-servidor, requisição/resposta, métodos, cabeçalhos e status em uma leitura só, em pt-BR verificado. Porta de entrada da competência.",
    origin: "canonical"
  },
  {
    id: "como-https-funciona",
    title: "Como HTTPS funciona",
    sourceName: "DNSimple",
    url: "https://howhttps.works/pt-br/",
    kind: "interactive",
    actionType: "READ",
    competencies: [
      "http-fundamentals"
    ],
    levelMin: "L0",
    technology: "http",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "não declarada — apenas linkar",
    estimatedTime: "20 min",
    why: "Os 5 episódios em quadrinhos traduzidos cobrem o pedaço que mais trava iniciante (por que HTTPS, chaves, handshake, autoridades certificadoras) sem vocabulário de rede.",
    origin: "canonical"
  },
  {
    id: "codigos-de-status-de-respostas-http",
    title: "Códigos de status de respostas HTTP",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status",
    kind: "reference",
    actionType: "READ",
    competencies: [
      "http-fundamentals"
    ],
    levelMin: "L1",
    technology: "http",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "20 min",
    why: "Transforma 'deu erro' em diagnóstico (404 vs 401 vs 500). Verificação corrigiu o rótulo: as 5 classes e as descrições estão em português, só as páginas-filhas caem para inglês.",
    origin: "canonical"
  },
  {
    id: "metodos-de-requisicao-http",
    title: "Métodos de requisição HTTP",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Methods",
    kind: "reference",
    actionType: "READ",
    competencies: [
      "api-consumption"
    ],
    levelMin: "L1",
    technology: "http",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "15 min",
    why: "Sustenta a diferença GET/POST/PUT/PATCH que a maioria dos iniciantes erra ao consumir API. Em pt-BR completo; só os rótulos safe/idempotent/cacheable ficam em inglês.",
    origin: "canonical"
  },
  {
    id: "making-network-requests-with-javascript",
    title: "Making network requests with JavaScript",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Network_requests",
    kind: "tutorial",
    actionType: "LEARN",
    competencies: [
      "api-consumption"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "1 h 30 min",
    why: "Degrau certo da competência: fetch com response.ok, .json(), .blob() e erro de rede em exemplos executáveis. A rota pt-BR entrega a página legada 'AJAX', não este tutorial — exige inglês.",
    origin: "canonical"
  },
  {
    id: "jsonplaceholder-free-fake-rest-api",
    title: "JSONPlaceholder: Free Fake REST API",
    sourceName: "typicode",
    url: "https://jsonplaceholder.typicode.com/",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "api-consumption"
    ],
    levelMin: "L0",
    technology: "http",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "serviço gratuito, sem licença de conteúdo declarada",
    estimatedTime: "2 h (uso em exercício)",
    why: "API estável, sem chave e sem cadastro para praticar GET/POST e renderizar a resposta. Barreira de idioma quase nula: o uso são 6 endpoints.",
    origin: "canonical"
  },
  {
    id: "introducao-a-acessibilidade-web",
    title: "Introdução à acessibilidade web",
    sourceName: "W3C Web Accessibility Initiative (WAI)",
    url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/pt-BR",
    kind: "guide",
    actionType: "READ",
    competencies: [
      "web-accessibility-basics"
    ],
    levelMin: "L0",
    technology: "html",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "W3C Permissive Document License",
    estimatedTime: "30 min",
    why: "Recurso canônico de quem define WCAG, em pt-BR integral (tradução de Adiel Cristo). Responde o quê/quem/por quê antes de qualquer checklist técnica.",
    origin: "canonical"
  },
  {
    id: "learn-accessibility-modulos-content-structure-e-keyboard-focus",
    title: "Learn Accessibility: módulos 'Content structure' e 'Keyboard focus'",
    sourceName: "web.dev (Google / Chrome team)",
    url: "https://web.dev/learn/accessibility",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "web-accessibility-basics"
    ],
    levelMin: "L1",
    technology: "html",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY 4.0 (código Apache 2.0)",
    estimatedTime: "~1 h (só os 2 módulos; curso inteiro tem 8 h)",
    why: "Ensina o 'como' depois do 'porquê' do W3C. Verificado: ?hl=pt-br volta 100% em inglês. Recomendar módulos isolados, nunca o curso inteiro.",
    origin: "canonical"
  },
  {
    id: "checklist-the-a11y-project",
    title: "Checklist: The A11Y Project",
    sourceName: "The A11Y Project",
    url: "https://www.a11yproject.com/checklist/",
    kind: "reference",
    actionType: "PROVE",
    competencies: [
      "web-accessibility-basics"
    ],
    levelMin: "L1",
    technology: "html",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "Apache License 2.0",
    estimatedTime: "40 min (primeira passada no projeto próprio)",
    why: "Traduz WCAG em itens verificáveis um a um — é como o aluno prova que aplicou acessibilidade no portfólio. Licença Apache 2.0, a mais permissiva do conjunto.",
    origin: "canonical"
  },
  {
    id: "introducao-ao-dom",
    title: "Introdução ao DOM",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model/Introduction",
    kind: "doc",
    actionType: "READ",
    competencies: [
      "dom-and-browser"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "30 min",
    why: "Modelo mental de documento como árvore de objetos, que o iniciante pula ao ir direto para querySelector. Exemplos ainda em 'var': avisar para usar const/let.",
    origin: "canonical"
  },
  {
    id: "structuring-content-with-html-pt-br-introducao-ao-html",
    title: "Structuring content with HTML (pt-BR: Introdução ao HTML)",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "html-semantics"
    ],
    levelMin: "L0",
    technology: "html",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "~2 h (guias 'Fundamentos do texto HTML' e 'Estrutura dos documentos e do site'; módulo inteiro tem 10 h)",
    why: "Único material canônico de semântica com avaliações práticas em pt-BR. A rota pt-BR entrega o módulo antigo 'Introdução ao HTML' (7 guias + 2 avaliações); apontar guias, não o módulo.",
    origin: "canonical"
  },
  {
    id: "aprenda-css-modulos-flexbox-e-grid",
    title: "Aprenda CSS: módulos Flexbox e Grid",
    sourceName: "web.dev (Google / Chrome team)",
    url: "https://web.dev/learn/css/flexbox?hl=pt-br",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "css-layout"
    ],
    levelMin: "L1",
    technology: "css",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY 4.0 (código Apache 2.0)",
    estimatedTime: "~2 h (Flexbox + Grid; curso inteiro tem 12 h)",
    why: "Verificação refutou o rótulo 'parcial': índice e corpo do módulo Flexbox estão integralmente em português. Melhor combinação de qualidade, licença aberta e pt-BR para layout.",
    origin: "canonical"
  },
  {
    id: "a-complete-css-flexbox-layout-guide",
    title: "A Complete CSS Flexbox Layout Guide",
    sourceName: "CSS-Tricks (publicado por Mediavine)",
    url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
    kind: "reference",
    actionType: "READ",
    competencies: [
      "css-layout"
    ],
    levelMin: "L1",
    technology: "css",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "não declarada — apenas linkar, nunca copiar trechos",
    estimatedTime: "40 min",
    why: "Referência visual de consulta durante o projeto (o web.dev ensina, esta se consulta). Título e editor corrigidos na verificação: não é mais 'A Complete Guide to CSS Flexbox' nem DigitalOcean.",
    origin: "canonical"
  },
  {
    id: "flexbox-froggy",
    title: "Flexbox Froggy",
    sourceName: "Codepip (Thomas Park)",
    url: "https://flexboxfroggy.com/#pt-br",
    kind: "interactive",
    actionType: "PROVE",
    competencies: [
      "css-layout"
    ],
    levelMin: "L0",
    technology: "css",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "MIT (código, repo thomaspark/flexboxfroggy); arte/marca da Codepip",
    estimatedTime: "45 min",
    why: "Tradução auditada no código-fonte: 24/24 níveis, 18/18 mensagens e 8/8 verbetes com chave pt-br, em português brasileiro real. Prática com feedback imediato no nível exato de L0.",
    origin: "canonical"
  },
  {
    id: "getting-started-jest",
    title: "Getting Started · Jest",
    sourceName: "Meta / Jest (OpenJS)",
    url: "https://jestjs.io/docs/getting-started",
    kind: "doc",
    actionType: "LEARN",
    competencies: [
      "automated-testing-basics"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "MIT",
    estimatedTime: "30 min",
    why: "Menor passo possível para sair de L0 em testes: instalar, escrever sum.test.js, rodar, ver verde. ATENÇÃO: /pt-BR/ resolve mas só traduz o chrome do site — o corpo é inglês.",
    origin: "canonical"
  },
  {
    id: "guiding-principles-testing-library",
    title: "Guiding Principles | Testing Library",
    sourceName: "Testing Library (Kent C. Dodds e contribuidores)",
    url: "https://testing-library.com/docs/guiding-principles/",
    kind: "doc",
    actionType: "READ",
    competencies: [
      "automated-testing-basics"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "MIT (biblioteca)",
    estimatedTime: "10 min",
    why: "Dez minutos que resolvem o erro nº1 de quem começa: testar detalhe de implementação em vez de comportamento. Critério aplicável sozinho, sem teoria de pirâmide.",
    origin: "canonical"
  },
  {
    id: "write-tests-not-too-many-mostly-integration",
    title: "Write tests. Not too many. Mostly integration.",
    sourceName: "Kent C. Dodds",
    url: "https://kentcdodds.com/blog/write-tests",
    kind: "article",
    actionType: "READ",
    competencies: [
      "automated-testing-basics"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    estimatedTime: "15 min",
    why: "Responde 'quanto teste é suficiente?' (retorno decrescente acima de ~70% de cobertura) e evita o ciclo de culpa por 100%. Tradução em pt existe só no Medium de terceiro: não conta.",
    origin: "canonical"
  },
  {
    id: "o-que-deu-errado-resolvendo-problemas-no-javascript",
    title: "O que deu errado? Resolvendo problemas no JavaScript",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Scripting/What_went_wrong",
    kind: "tutorial",
    actionType: "LEARN",
    competencies: [
      "debugging"
    ],
    levelMin: "L0",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "1 h",
    why: "Melhor recurso do catálogo inteiro: jogo com bugs plantados, taxonomia sintaxe/lógica/runtime, tradução pt-BR completa e mantida (identificadores adaptados). Usar a URL pt-BR como primária.",
    origin: "canonical"
  },
  {
    id: "depurar-o-javascript",
    title: "Depurar o JavaScript",
    sourceName: "Google / Chrome for Developers",
    url: "https://developer.chrome.com/docs/devtools/javascript/?hl=pt-br",
    kind: "tutorial",
    actionType: "LEARN",
    competencies: [
      "debugging"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY 4.0 (código Apache 2.0)",
    estimatedTime: "1 h",
    why: "Faz a transição de console.log para breakpoint, passo a passo e em pt-BR. Tradução do pipeline do Google é literal ('painel Origens' = Sources): avisar o aluno sobre os termos.",
    origin: "canonical"
  },
  {
    id: "a-debugging-manifesto",
    title: "A debugging manifesto",
    sourceName: "Julia Evans (jvns.ca)",
    url: "https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/",
    kind: "article",
    actionType: "READ",
    competencies: [
      "debugging"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "não declarada — apenas linkar",
    estimatedTime: "10 min",
    why: "Ataca a dimensão afetiva: 'estar preso é temporário', 'geralmente o bug é do seu código', 'construa seu kit de ferramentas'. Abre a trilha antes de qualquer ferramenta.",
    origin: "canonical"
  },
  {
    id: "the-cl-author-s-guide-to-getting-through-code-review",
    title: "The CL author's guide to getting through code review",
    sourceName: "Google (google/eng-practices)",
    url: "https://google.github.io/eng-practices/review/developer/",
    kind: "guide",
    actionType: "READ",
    competencies: [
      "code-review-participation"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY 3.0 (alegada; não confirmada no rodapé renderizado)",
    estimatedTime: "1 h",
    why: "É o lado que o júnior realmente ocupa: descrever bem o PR, mantê-lo pequeno e responder a comentários sem defensividade. Recomendar ANTES do guia do revisor.",
    origin: "canonical"
  },
  {
    id: "how-to-do-a-code-review",
    title: "How to do a code review",
    sourceName: "Google (google/eng-practices)",
    url: "https://google.github.io/eng-practices/review/reviewer/",
    kind: "guide",
    actionType: "READ",
    competencies: [
      "code-review-participation"
    ],
    levelMin: "L2",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY 3.0 (alegada; não confirmada)",
    estimatedTime: "2 h",
    why: "Leitura posterior. A peça acionável é 'The Standard of Code Review', onde está verificado o significado do prefixo 'Nit:' — decifrar esse jargão evita que o júnior leia comentário opcional como reprovação.",
    origin: "canonical"
  },
  {
    id: "como-relatar-bugs-de-maneira-eficaz",
    title: "Como Relatar Bugs De Maneira Eficaz",
    sourceName: "Simon Tatham",
    url: "https://www.chiark.greenend.org.uk/~sgtatham/bugs-br.html",
    kind: "article",
    actionType: "READ",
    competencies: [
      "technical-communication"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "OpenContent Licence, © 1999 Simon Tatham",
    estimatedTime: "30 min",
    why: "Texto canônico sobre descrever sintoma em vez de diagnóstico, hospedado pelo próprio autor e traduzido por inteiro. Serve de rubrica para avaliar a competência. Exemplos datados (1999) pedem enquadramento.",
    origin: "canonical"
  },
  {
    id: "conventional-commits-1-0-0",
    title: "Conventional Commits 1.0.0",
    sourceName: "Conventional Commits (projeto oficial)",
    url: "https://www.conventionalcommits.org/pt-br/v1.0.0/",
    kind: "reference",
    actionType: "READ",
    competencies: [
      "technical-communication"
    ],
    levelMin: "L0",
    technology: "git",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY 3.0",
    estimatedTime: "20 min",
    why: "Regra mecânica e verificável (feat:, fix:, BREAKING CHANGE) aplicável já no primeiro commit do portfólio. Um dos dois únicos 'complete' que sobreviveram à verificação nesta fatia.",
    origin: "canonical"
  },
  {
    id: "technical-writing-one",
    title: "Technical Writing One",
    sourceName: "Google for Developers",
    url: "https://developers.google.com/tech-writing/one",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "technical-communication"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY 4.0 (código Apache 2.0)",
    estimatedTime: "4 h",
    why: "Curso canônico de escrita técnica (voz ativa, clareza de frase, listas, público-alvo). ARMADILHA confirmada: ?hl=pt-br traduz só a interface, o curso é inglês — marcar inglês como pré-requisito.",
    origin: "canonical",
    chapters: "12 unidades pré-aula: voz ativa, frases claras, listas e tabelas, gramática, Markdown"
  },
  {
    id: "code-smells",
    title: "Code Smells",
    sourceName: "Refactoring.Guru (Alexander Shvets)",
    url: "https://refactoring.guru/pt-br/refactoring/smells",
    kind: "reference",
    actionType: "READ",
    competencies: [
      "code-readability"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: false,
    license: "Content Usage Policy restritiva — NÃO é Creative Commons; apenas linkar",
    estimatedTime: "1 h",
    why: "Dá vocabulário nomeado (Long Method, Duplicate Code) ao desconforto que o aluno já sente. Verificação refutou 'complete': índice e categorias em pt-BR, mas o corpo de cada smell é inglês.",
    origin: "canonical"
  },
  {
    id: "catalog-of-refactorings",
    title: "Catalog of Refactorings",
    sourceName: "Martin Fowler / refactoring.com",
    url: "https://refactoring.com/catalog/",
    kind: "reference",
    actionType: "READ",
    competencies: [
      "code-readability"
    ],
    levelMin: "L2",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "sem licença aberta declarada",
    estimatedTime: "10 min por refatoração (consulta)",
    why: "Consulta pontual quando o aluno percebe um método longo. Pressupõe código próprio e rede de testes — amarra code-readability a automated-testing-basics como pré-requisito.",
    origin: "canonical"
  },
  {
    id: "javascript-testing-best-practices-readme-pt-br",
    title: "javascript-testing-best-practices (readme pt-BR)",
    sourceName: "Yoni Goldberg (GitHub)",
    url: "https://github.com/goldbergyoni/javascript-testing-best-practices/blob/master/readme-pt-br.md",
    kind: "reference",
    actionType: "READ",
    competencies: [
      "code-readability"
    ],
    levelMin: "L2",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: false,
    license: "MIT",
    estimatedTime: "20 min por seção",
    why: "Catálogo de consulta para nomear e estruturar teste (AAA, 3 partes no nome). Traduzidas as seções 0-2; as seções 3 (frontend), 4 e 5 continuam em inglês — justamente as mais úteis para front-end.",
    origin: "canonical"
  },
  {
    id: "como-pensar-como-um-programador-licoes-de-resolucao-de-problemas",
    title: "Como pensar como um programador: lições de resolução de problemas",
    sourceName: "freeCodeCamp (Richard Reis; tradução de Afonso Branco)",
    url: "https://www.freecodecamp.org/portuguese/news/como-pensar-como-um-programador-licoes-de-resolucao-de-problemas/",
    kind: "article",
    actionType: "READ",
    competencies: [
      "problem-decomposition"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "sem licença aberta declarada",
    estimatedTime: "20 min",
    why: "Framework compreender-planejar-dividir-destravar em 20 min, sem pré-requisito de stack. A verificação achou tradução OFICIAL no próprio freeCodeCamp — variante em português europeu, não pt-BR.",
    origin: "canonical"
  },
  {
    id: "the-twelve-factor-app-pt-br",
    title: "The Twelve-Factor App (pt-BR)",
    sourceName: "Adam Wiggins / Heroku (Salesforce)",
    url: "https://12factor.net/pt_br/",
    kind: "guide",
    actionType: "READ",
    competencies: [
      "deployment-basics"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "não declarada (© Salesforce) — verificar antes de derivar",
    estimatedTime: "2 h (usar fatores I–V e XI, ~45 min)",
    why: "Dá o modelo mental que falta (config em variáveis de ambiente, build/release/run, paridade dev/prod, logs como stream). Texto denso: limitar aos fatores I–V e XI em L1.",
    origin: "canonical"
  },
  {
    id: "publicando-seu-site",
    title: "Publicando seu site",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Getting_started/Your_first_website/Publishing_your_website",
    kind: "tutorial",
    actionType: "LEARN",
    competencies: [
      "deployment-basics"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "45 min",
    why: "Primeiro degrau real de deploy em L0: hospedagem, domínio, FTP e GitHub Pages sem build, CLI ou conta paga. Uma página, não um curso.",
    origin: "canonical"
  },
  {
    id: "inicio-rapido-para-paginas-do-github",
    title: "Início Rápido para Páginas do GitHub",
    sourceName: "GitHub Docs",
    url: "https://docs.github.com/pt/pages/quickstart",
    kind: "guide",
    actionType: "BUILD",
    competencies: [
      "deployment-basics"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: true,
    license: "CC BY 4.0 (repo github/docs)",
    estimatedTime: "30 min",
    why: "Primeiro deploy versionado: o repositório vira a fonte da verdade e o push publica. Tradução oficial do GitHub. Exige conta gratuita (sem cartão).",
    origin: "canonical"
  },
  {
    id: "autenticacao-http",
    title: "Autenticação HTTP",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Authentication",
    kind: "doc",
    actionType: "READ",
    competencies: [
      "authentication-basics"
    ],
    levelMin: "L1",
    technology: "http",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "30 min",
    why: "Única ponte em português entre HTTP e autenticação: 401 vs 407, WWW-Authenticate, Authorization, Basic sem TLS é inseguro. Cobre Basic a fundo; Bearer/JWT fica raso.",
    origin: "canonical"
  },
  {
    id: "password-storage-cheat-sheet",
    title: "Password Storage Cheat Sheet",
    sourceName: "OWASP Cheat Sheet Series",
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
    kind: "reference",
    actionType: "READ",
    competencies: [
      "authentication-basics"
    ],
    levelMin: "L2",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY-SA 4.0",
    estimatedTime: "40 min",
    why: "Resolve o erro mais caro de iniciante (senha em texto puro ou MD5) com parâmetros concretos verificados: Argon2id 19 MiB/2/1, bcrypt custo 10+, PBKDF2-SHA256 600k.",
    origin: "canonical"
  },
  {
    id: "authentication-cheat-sheet",
    title: "Authentication Cheat Sheet",
    sourceName: "OWASP Cheat Sheet Series",
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
    kind: "reference",
    actionType: "READ",
    competencies: [
      "authentication-basics"
    ],
    levelMin: "L2",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY-SA 4.0",
    estimatedTime: "1 h 30 min (consulta por tópico)",
    why: "Maior autoridade sem paywall sobre política de senha, mensagens de erro genéricas, enumeração de usuário e bloqueio. Vai até OAuth/OIDC/FIDO: consultar por tópico, nunca ler linear.",
    origin: "canonical"
  },
  {
    id: "research-and-learning",
    title: "Research and learning",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Soft_skills/Research_and_learning",
    kind: "article",
    actionType: "READ",
    competencies: [
      "reading-documentation"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "45 min",
    why: "O mais próximo de uma aula sobre COMO ler documentação vindo de fonte canônica: escolher fonte, referência vs guia vs Stack Overflow, pesquisar antes de pedir ajuda. Rota pt-BR retorna 404.",
    origin: "canonical"
  },
  {
    id: "guia-javascript",
    title: "Guia JavaScript",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide",
    kind: "doc",
    actionType: "READ",
    competencies: [
      "reading-documentation",
      "javascript-essentials"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "10 h (usar por capítulo)",
    why: "Documentação canônica em pt-BR completo (19 capítulos básicos verificados): serve de objeto de prática para treinar leitura de fonte oficial em vez de blog aleatório.",
    origin: "canonical"
  },
  {
    id: "shell-tools-and-scripting-secao-finding-how-to-use-commands",
    title: "Shell Tools and Scripting (seção 'Finding how to use commands')",
    sourceName: "MIT — The Missing Semester of Your CS Education",
    url: "https://missing.csail.mit.edu/2020/shell-tools/",
    kind: "tutorial",
    actionType: "LEARN",
    competencies: [
      "reading-documentation",
      "command-line-basics"
    ],
    levelMin: "L1",
    technology: "shell",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY-NC-SA (cláusula NC: não reaproveitar em produto pago)",
    estimatedTime: "1 h 30 min",
    why: "Ensina o gesto concreto de ler documentação: -h/--help, man, tldr, find, grep, history. ATENÇÃO: a tradução pt tem só título e navegação em português — o corpo e os exercícios são inglês.",
    origin: "canonical"
  },
  {
    id: "course-overview-the-shell",
    title: "Course Overview + The Shell",
    sourceName: "MIT — The Missing Semester of Your CS Education",
    url: "https://missing.csail.mit.edu/2020/course-shell/",
    kind: "tutorial",
    actionType: "LEARN",
    competencies: [
      "command-line-basics"
    ],
    levelMin: "L0",
    technology: "shell",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: false,
    license: "CC BY-NC-SA",
    estimatedTime: "1 h 30 min",
    why: "Constrói modelo mental (shell, PATH, streams, permissões) com 11 exercícios. A tradução começa em português e é abandonada por volta de 'Connecting programs'; os exercícios estão todos em inglês.",
    origin: "canonical"
  },
  {
    id: "algoritmos-teoria-da-ciencia-da-computacao",
    title: "Algoritmos | Teoria da Ciência da Computação",
    sourceName: "Khan Academy (Tom Cormen e Devin Balkcom, Dartmouth)",
    url: "https://pt.khanacademy.org/computing/computer-science/algorithms",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "algorithms-and-complexity"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: false,
    license: "CC BY-NC-SA 3.0 US",
    estimatedTime: "8 h (usar unidades de busca binária e notação assintótica, ~2 h)",
    why: "Único material canônico de algoritmos desenhado para quem nunca viu complexidade, em pt-BR e em JavaScript (não Java). Cobertura da tradução não auditável por fetch (SPA): verificar manualmente.",
    origin: "canonical"
  },
  {
    id: "visualgo-visualising-data-structures-and-algorithms-through-animation",
    title: "VisuAlgo: visualising data structures and algorithms through animation",
    sourceName: "VisuAlgo — Steven Halim, National University of Singapore",
    url: "https://visualgo.net/en",
    kind: "interactive",
    actionType: "LEARN",
    competencies: [
      "algorithms-and-complexity"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "uso gratuito, direitos do NUS (não é CC)",
    estimatedTime: "2 h",
    why: "Permite 'ver' por que um algoritmo é O(n log n) em vez de decorar tabela. Vocabulário necessário é mínimo, então a barreira do inglês é baixa. Conta é opcional.",
    origin: "canonical"
  },
  {
    id: "big-o-algorithm-complexity-cheat-sheet",
    title: "Big-O Algorithm Complexity Cheat Sheet",
    sourceName: "Eric Drowell e colaboradores",
    url: "https://www.bigocheatsheet.com/",
    kind: "reference",
    actionType: "READ",
    competencies: [
      "algorithms-and-complexity"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "não declarada — apenas linkar",
    estimatedTime: "20 min",
    why: "Uma página que conecta estrutura/algoritmo a custo de tempo e espaço. Consulta depois da conceituação, evitando mandar iniciante para 40 h por causa de um gap pequeno.",
    origin: "canonical"
  },
  {
    id: "the-modern-javascript-tutorial",
    title: "The Modern JavaScript Tutorial",
    sourceName: "Ilya Kantor (javascript.info)",
    url: "https://javascript.info/",
    kind: "tutorial",
    actionType: "LEARN",
    competencies: [
      "javascript-essentials",
      "programming-fundamentals"
    ],
    levelMin: "L0",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "© Ilya Kantor, sem licença aberta — apenas linkar",
    estimatedTime: "40 h (usar por capítulo)",
    why: "Tutorial mais bem estruturado por nível, de L0 em diante, com exercícios resolvidos. Verificado em /translate: português em 38% e SEM site publicado — barreira de idioma total.",
    origin: "canonical",
    chapters: "usar por capítulo — Parte 1 (a linguagem) primeiro; Parte 2 (o navegador) depois"
  },
  {
    id: "eloquent-javascript-4-edicao",
    title: "Eloquent JavaScript, 4ª edição",
    sourceName: "Marijn Haverbeke",
    url: "https://braziljs.github.io/eloquente-javascript/",
    kind: "book",
    actionType: "READ",
    competencies: [
      "javascript-essentials",
      "programming-fundamentals"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-NC (prosa) + MIT (código)",
    estimatedTime: "30 h (usar capítulos 1-5)",
    why: "Cobre a parte conceitual (funções de ordem superior, abstração) que tutorial de sintaxe não dá. A tradução BrazilJS hoje cobre a 4ª edição inteira, mas é comunitária e ASSISTIDA POR IA, sem revisão humana nem aval do autor.",
    origin: "canonical"
  },
  {
    id: "sqlbolt-learn-sql",
    title: "SQLBolt: Learn SQL",
    sourceName: "SQLBolt",
    url: "https://sqlbolt.com/",
    kind: "interactive",
    actionType: "PROVE",
    competencies: [
      "sql-basics"
    ],
    levelMin: "L0",
    technology: "sql",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "não declarada — apenas © SQLBolt; só linkar",
    estimatedTime: "4 h",
    why: "18 lições com validação no navegador, sem instalar banco nem criar conta. Vocabulário é quase só palavra-chave SQL: menor barreira de idioma da fatia.",
    origin: "canonical"
  },
  {
    id: "select-star-sql",
    title: "Select Star SQL",
    sourceName: "Zi Chong Kao",
    url: "https://selectstarsql.com/",
    kind: "interactive",
    actionType: "PROVE",
    competencies: [
      "sql-basics"
    ],
    levelMin: "L1",
    technology: "sql",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY-SA 4.0 (texto) / CC0 (código e dados)",
    estimatedTime: "6 h",
    why: "Passo seguinte ao SQLBolt: pensar a consulta a partir de pergunta real, com agregações, joins e subconsultas. Sem anúncio, sem cadastro, licença clara.",
    origin: "canonical"
  },
  {
    id: "database-design-2nd-edition",
    title: "Database Design: 2nd Edition",
    sourceName: "Adrienne Watt e Nelson Eng — BCcampus",
    url: "https://opentextbc.ca/dbdesign01/",
    kind: "book",
    actionType: "READ",
    competencies: [
      "relational-data-modeling",
      "sql-basics"
    ],
    levelMin: "L1",
    technology: "sql",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY 4.0 (a mais permissiva do catálogo)",
    estimatedTime: "15 h (usar capítulos de MER e normalização)",
    why: "Modelo ER, dependências funcionais, normalização 1FN-3FN e integridade, com exercícios de fim de capítulo. Verificação só indireta: o domínio bloqueia fetch com HTTP 403.",
    origin: "canonical"
  },
  {
    id: "pro-git-2-edicao-pt-br",
    title: "Pro Git: 2ª edição (pt-BR)",
    sourceName: "Scott Chacon e Ben Straub / git-scm.com",
    url: "https://git-scm.com/book/pt-br/v2",
    kind: "book",
    actionType: "READ",
    competencies: [
      "version-control-git"
    ],
    levelMin: "L1",
    technology: "git",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-NC-SA 3.0 (cláusula NC)",
    estimatedTime: "12 h (usar capítulos 2 e 3)",
    why: "Referência canônica no site do detentor, com tradução pt-BR completa e PDF/EPUB. Apontar capítulos 2 (Fundamentos) e 3 (Ramificação), nunca o livro todo.",
    origin: "canonical"
  },
  {
    id: "learn-git-branching",
    title: "Learn Git Branching",
    sourceName: "Peter Cottle",
    url: "https://learngitbranching.js.org/?locale=pt_BR",
    kind: "interactive",
    actionType: "PROVE",
    competencies: [
      "version-control-git"
    ],
    levelMin: "L1",
    technology: "git",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: false,
    license: "MIT",
    estimatedTime: "3 h",
    why: "Faz o aluno entender o grafo de commits errando em ambiente seguro. O locale pt_BR existe, mas a cobertura não foi auditável por fetch (canvas/JS): verificar no navegador antes de publicar.",
    origin: "canonical"
  },
  {
    id: "oh-shit-git-pt-br",
    title: "Oh Shit, Git!?! (pt_BR)",
    sourceName: "Katie Sylor-Miller",
    url: "https://ohshitgit.com/pt_BR",
    kind: "reference",
    actionType: "READ",
    competencies: [
      "version-control-git"
    ],
    levelMin: "L1",
    technology: "git",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "não declarada — © Katie Sylor-Miller; apenas linkar",
    estimatedTime: "20 min",
    why: "Resolve as situações em que o iniciante acha que 'quebrou o Git'. URL corrigida: o caminho é case-sensitive (/pt_BR funciona, /pt_br dá 404). Variante sem palavrão: dangitgit.com.",
    origin: "canonical"
  },
  {
    id: "full-stack-open-pt-br",
    title: "Full stack open (pt-BR)",
    sourceName: "Universidade de Helsinque — Full Stack Open",
    url: "https://fullstackopen.com/ptbr/",
    kind: "course",
    actionType: "BUILD",
    competencies: [
      "build-an-application",
      "api-development",
      "automated-testing-basics",
      "authentication-basics"
    ],
    levelMin: "L2",
    technology: "node",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: false,
    license: "CC BY-NC-SA 3.0",
    estimatedTime: "~90 h nas partes 0-5 (médias de 2026 do painel do curso)",
    why: "Curso gratuito mais sério para construir aplicação, de universidade pública. Partes 0-5 em pt-BR, numa tradução anterior à versão atual (usa create-react-app, Jest e Cypress; a versão em inglês já usa Vite, node:test e Playwright). As partes 6 a 14 existem só em inglês. Exige JavaScript consolidado; para começar no nível 1, os exercícios de cada parte estão catalogados separadamente.",
    origin: "canonical"
  },
  {
    id: "introducao-express-node",
    title: "Introdução Express/Node",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/Introduction",
    kind: "tutorial",
    actionType: "LEARN",
    competencies: [
      "api-development"
    ],
    levelMin: "L1",
    technology: "node",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "2 h",
    why: "Ponte barata antes do Full Stack Open: o que é Node, o que é Express, como uma rota vira resposta HTTP, em pt-BR. Os artigos seguintes do tutorial LocalLibrary caem para inglês.",
    origin: "canonical"
  },
  {
    id: "express-tutorial-part-7-deploying-to-production",
    title: "Express Tutorial Part 7: Deploying to production",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/deployment",
    kind: "tutorial",
    actionType: "BUILD",
    competencies: [
      "api-development"
    ],
    levelMin: "L2",
    technology: "node",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "3 h",
    why: "Cobre o que GitHub Pages não cobre: deploy de app dinâmico com banco, variáveis de ambiente e checklist de produção. Rota pt-BR dá 404. O plano gratuito do Railway hoje é crédito de teste — avisar.",
    origin: "canonical"
  },
  {
    id: "cs50x-cs50-s-introduction-to-computer-science",
    title: "CS50x: CS50's Introduction to Computer Science",
    sourceName: "Harvard University / CS50 (David J. Malan)",
    url: "https://cs50.harvard.edu/x/",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "programming-fundamentals"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY-NC-SA 4.0",
    estimatedTime: "100 h",
    why: "Trilha longa opcional, só quando o diagnóstico apontar programming-fundamentals em L0 de fato. Correção: legenda automática de YouTube NÃO é tradução — site e problem sets são 100% inglês.",
    origin: "canonical"
  },
  {
    id: "here-s-how-i-use-llms-to-help-me-write-code",
    title: "Here's how I use LLMs to help me write code",
    sourceName: "Simon Willison",
    url: "https://simonwillison.net/2025/Mar/11/using-llms-for-code/",
    kind: "article",
    actionType: "READ",
    competencies: [
      "ai-assisted-development-basics"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "leitura livre, direitos reservados (não é CC)",
    estimatedTime: "40 min",
    why: "Texto gratuito mais criterioso e não-hype: expectativas realistas, limite de data de treinamento, contexto e a obrigação de testar e entender o que foi gerado.",
    origin: "canonical"
  },
  {
    id: "praticas-recomendadas-para-usar-github-copilot",
    title: "Práticas recomendadas para usar GitHub Copilot",
    sourceName: "GitHub Docs",
    url: "https://docs.github.com/pt/copilot/get-started/best-practices",
    kind: "doc",
    actionType: "READ",
    competencies: [
      "ai-assisted-development-basics"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY 4.0 (alegada; não confirmada no LICENSE do repo)",
    estimatedTime: "30 min",
    why: "Documentação do próprio fornecedor sobre entender pontos fracos, criar prompts e VERIFICAR o trabalho do Copilot. A verificação achou a página integralmente traduzida — o mapeamento dizia que não existia.",
    origin: "canonical"
  },
  {
    id: "exploring-generative-ai",
    title: "Exploring Generative AI",
    sourceName: "Thoughtworks / Martin Fowler",
    url: "https://martinfowler.com/articles/exploring-gen-ai.html",
    kind: "article",
    actionType: "READ",
    competencies: [
      "ai-assisted-development-basics"
    ],
    levelMin: "L2",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "leitura livre, direitos reservados",
    estimatedTime: "20-30 min por memo (série viva, 25+ memos)",
    why: "Efeitos reais de assistentes de código sobre qualidade e revisão, por engenheiros que praticam. Pressupõe quem já produz e revisa código — em L0/L1 use o texto do Willison.",
    origin: "canonical"
  },
  {
    id: "pensando-em-react",
    title: "Pensando em React",
    sourceName: "React (documentação oficial)",
    url: "https://pt-br.react.dev/learn/thinking-in-react",
    kind: "doc",
    actionType: "READ",
    competencies: [
      "ui-components-and-state"
    ],
    levelMin: "L0",
    technology: "react",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY 4.0",
    estimatedTime: "40 min",
    why: "O método em cinco passos da própria equipe do React: quebrar a tela em componentes, montar a versão estática e só então decidir o estado mínimo e onde ele mora. É o critério de saída da competência explicado pela fonte.",
    origin: "canonical"
  },
  {
    id: "gerenciando-o-estado",
    title: "Gerenciando o Estado",
    sourceName: "React (documentação oficial)",
    url: "https://pt-br.react.dev/learn/managing-state",
    kind: "doc",
    actionType: "READ",
    competencies: [
      "ui-components-and-state"
    ],
    levelMin: "L1",
    technology: "react",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY 4.0",
    estimatedTime: "2 h (7 páginas)",
    why: "Capítulo sobre a decisão difícil da competência: que estado guardar, como compartilhá-lo entre componentes e quando ele deve ser preservado ou reiniciado.",
    origin: "canonical"
  },
  {
    id: "package-management-basics",
    title: "Package management basics",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_tools/Package_management",
    kind: "doc",
    actionType: "READ",
    competencies: [
      "command-line-basics"
    ],
    levelMin: "L0",
    technology: "shell",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    estimatedTime: "30 min",
    why: "npm init, npm install, npx e scripts do package.json, no terminal: o \"instalo dependências e subo o projeto\" que toda vaga pressupõe. Sem versão em português no MDN.",
    origin: "canonical"
  },
  {
    id: "awwwards-sites-premiados-por-design-e-desenvolvimento-front-end",
    title: "Awwwards: sites premiados por design e desenvolvimento front-end",
    sourceName: "Awwwards",
    url: "https://www.awwwards.com/websites/",
    kind: "reference",
    actionType: "READ",
    competencies: [
      "css-layout",
      "ui-components-and-state"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Referência de teto: o que o front-end de nível alto está fazendo em layout, tipografia e movimento, com os sites de verdade para inspecionar no DevTools. Só rende para quem já monta uma página; antes disso é só vitrine. Pedido do dono do produto em 2026-10-16.",
    origin: "canonical"
  },
  {
    id: "mobbin-biblioteca-de-padroes-de-interface-de-produtos-reais",
    title: "Mobbin: biblioteca de padrões de interface de produtos reais",
    sourceName: "Mobbin",
    url: "https://mobbin.com/",
    kind: "reference",
    actionType: "READ",
    competencies: [
      "ui-components-and-state",
      "css-layout"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: true,
    license: "direitos reservados — apenas linkar",
    why: "Milhares de fluxos e telas de aplicativos reais, organizados por padrão (login, busca, formulário, estado vazio). Serve para decidir como um componente costuma se comportar antes de inventar. Plano gratuito com limite; o restante é pago. Pedido do dono do produto em 2026-10-16.",
    origin: "canonical"
  },
  {
    id: "pense-em-python-2-edicao-allen-downey-trad-sheila-gomes",
    title: "Pense em Python: 2ª edição (Allen Downey, trad. Sheila Gomes)",
    sourceName: "Allen Downey (trad. Sheila Gomes)",
    url: "https://penseallen.github.io/PensePython2e/",
    kind: "book",
    actionType: "READ",
    competencies: [
      "programming-fundamentals",
      "problem-decomposition",
      "debugging"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-NC 3.0",
    why: "Tradução integral autorizada, montada por Luciano Ramalho a partir de arquivos da Novatec. Serve fundamentos agnósticos, não a plataforma web — só recomendar quando o usuário ainda não escolheu caminho, e encadear com material de HTML/CSS/JS depois.",
    origin: "book"
  },
  {
    id: "apostila-caelum-alura-desenvolvimento-web-com-html-css-e-javascript",
    title: "Apostila Caelum/Alura: Desenvolvimento Web com HTML, CSS e JavaScript",
    sourceName: "Alura",
    url: "https://www.alura.com.br/apostila-html-css-javascript",
    kind: "book",
    actionType: "READ",
    competencies: [
      "html-semantics",
      "css-layout",
      "javascript-essentials"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "proprietária — Alura/Caelum, redistribuição proibida",
    why: "Página oficial da Alura, 59 capítulos gratuitos, e cobre Flexbox e Grid — não é material pré-flexbox. Exige cadastro com nome, e-mail e interesses. A página não declara data de atualização, e parte do material ainda ensina Bootstrap como caminho de layout: usar como apoio, nunca como referência única de CSS moderno.",
    origin: "book"
  },
  {
    id: "e-book-e-material-do-curso-html5-e-css3-gustavo-guanabara",
    title: "E-book e material do curso HTML5 e CSS3 (Gustavo Guanabara)",
    sourceName: "Gustavo Guanabara (GitHub)",
    url: "https://github.com/gustavoguanabara/html-css",
    kind: "course",
    actionType: "READ",
    competencies: [
      "html-semantics",
      "css-layout"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "MIT com exigência de referência ao autor; veda reuso comercial",
    why: "Repositório da conta pessoal do próprio autor, com PDFs das aulas e exercícios executáveis via GitHub Pages, 16,5k estrelas. Ressalva: a atualização do repositório (nov/2025) não significa aulas regravadas — o conteúdo é da safra 2019-2021.",
    origin: "book"
  },
  {
    id: "git-guia-pratico-pt-br",
    title: "git: guia prático (pt-BR)",
    sourceName: "Roger Dudler",
    url: "https://rogerdudler.github.io/git-guide/index.pt_BR.html",
    kind: "guide",
    actionType: "READ",
    competencies: [
      "version-control-git"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "não declarada na página — apenas linkar",
    why: "Página do próprio autor, corpo integralmente em pt-BR, cobre init, clone, add/commit, push/pull, branch/merge, tag e reset em 15 minutos. Primeiríssimo contato com Git, nunca recurso único — encadear com Pro Git ou Learn Git Branching.",
    origin: "book"
  },
  {
    id: "you-don-t-know-js-yet-2-edicao-kyle-simpson",
    title: "You Don't Know JS Yet: 2ª edição (Kyle Simpson)",
    sourceName: "Kyle Simpson (GitHub)",
    url: "https://github.com/getify/You-Dont-Know-JS",
    kind: "book",
    actionType: "READ",
    competencies: [
      "javascript-essentials"
    ],
    levelMin: "L2",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY-NC-ND 4.0 — só linkar, não redistribuir nem derivar",
    why: "Repositório oficial do próprio autor, leitura online gratuita. Entra com gate 'só depois de um projeto real' — é aprofundamento de linguagem, L2-L3. A ficha precisa declarar o status por volume para não prometer uma série completa que não existe. A tradução pt-BR em circulação é da 1ª edição e foi reprovada.",
    origin: "book"
  },
  {
    id: "mdn-aprenda-desenvolvimento-web-pt-br",
    title: "MDN: Aprenda desenvolvimento web (pt-BR)",
    sourceName: "MDN (Mozilla)",
    url: "https://developer.mozilla.org/pt-BR/docs/Learn_web_development",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "html-semantics",
      "css-layout",
      "javascript-essentials",
      "dom-and-browser",
      "web-accessibility-basics"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: false,
    license: "Creative Commons (MDN) — confirmar a versão exata na página de atribuição antes de citar",
    why: "Corpo verificado em português nos módulos centrais, com aviso explícito da própria página de que a tradução é comunitária. Parcial de verdade: vários links internos apontam para /en-US/. Espinha dorsal gratuita de web-platform em pt-BR.",
    origin: "book"
  },
  {
    id: "web-dev-aprenda-css-pt-br",
    title: "web.dev: Aprenda CSS (pt-BR)",
    sourceName: "Google (web.dev)",
    url: "https://web.dev/learn/css?hl=pt-br",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "css-layout"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY 4.0 (texto) + Apache 2.0 (código)",
    why: "Publicado pelo Google/Chrome, corpo verificado em português, licença permissiva declarada, sem cadastro. Substitui com folga os livros de CSS brasileiros de 2012 e é a razão pela qual nenhum material pago de CSS pode ser o recomendado padrão. O carimbo de data (2021) parece ser da página-índice: o sumário lista módulos pós-2023.",
    origin: "book"
  },
  {
    id: "w3c-wai-digital-accessibility-foundations-edx",
    title: "W3C WAI: Digital Accessibility Foundations (edX)",
    sourceName: "W3C",
    url: "https://www.w3.org/WAI/courses/foundations-course/",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "web-accessibility-basics"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "não declarada — conteúdo W3C/WAI; apenas linkar",
    why: "Página oficial do W3C WAI, auditoria gratuita de todo o conteúdo, 16-20h autoguiado. Nome corrigido: 'Introduction to Web Accessibility' é o título antigo. Sem qualquer menção a versão em português — tratar como recurso em inglês e manter o livro do Reinaldo Ferraz para o recorte brasileiro.",
    origin: "book"
  },
  {
    id: "curso-em-video-html5-e-css3-modulos-1-a-5",
    title: "Curso em Vídeo: HTML5 e CSS3 (módulos 1 a 5)",
    sourceName: "Curso em Vídeo · Gustavo Guanabara",
    url: "https://www.cursoemvideo.com/cursos/",
    kind: "course",
    actionType: "WATCH",
    competencies: [
      "html-semantics",
      "css-layout",
      "build-an-application"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free-content-paid-certificate",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "não declarada na plataforma",
    chapters: "módulo 1 (41 aulas, 40h) é a entrada; Flexbox, Grid e projeto final de portfólio estão no módulo 5",
    why: "Plataforma oficial do próprio autor, conteúdo 100% gratuito, material em PDF e exercícios. Duas correções obrigatórias: a plataforma EXIGE cadastro (a ficha anterior dizia que não), e a URL precisa apontar para a lista de cursos — cadastrada no módulo 1, o usuário nunca chega ao módulo que ensina layout moderno.",
    origin: "book"
  },
  {
    id: "curso-em-video-javascript-modulos-a-f",
    title: "Curso em Vídeo: JavaScript (módulos A-F)",
    sourceName: "Curso em Vídeo · Gustavo Guanabara",
    url: "https://www.cursoemvideo.com/curso/javascript/",
    kind: "course",
    actionType: "WATCH",
    competencies: [
      "javascript-essentials",
      "dom-and-browser"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free-content-paid-certificate",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "não declarada; autor permite uso didático mantendo referência",
    chapters: "módulo C (Entendendo o DOM)",
    why: "40h com estrutura confirmada, patrocínio Google, foco em ECMAScript 6, publicado em 2019 — no limite do corte. Não cobre fetch, async/await nem módulos ES6+: serve como porta de entrada falada em português e obriga javascript.info ou o Eloquente para L1-L2. Exige cadastro gratuito.",
    origin: "book"
  },
  {
    id: "curso-em-video-git-e-github",
    title: "Curso em Vídeo: Git e GitHub",
    sourceName: "Curso em Vídeo · Gustavo Guanabara",
    url: "https://www.cursoemvideo.com/curso/curso-de-git-e-github/",
    kind: "course",
    actionType: "WATCH",
    competencies: [
      "version-control-git",
      "deployment-basics"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free-content-paid-certificate",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "não declarada na plataforma",
    chapters: "aula de GitHub Pages (primeiro deploy)",
    why: "20h em 13 aulas sem pré-requisito de programação; cobre controle de versão, branches, Issues, Markdown e GitHub Pages. Exige cadastro. A página não data o curso — checar periodicamente se as demonstrações ainda batem com a interface atual do GitHub.",
    origin: "book"
  },
  {
    id: "curso-em-video-mysql-banco-de-dados",
    title: "Curso em Vídeo: MySQL / Banco de Dados",
    sourceName: "Curso em Vídeo · Gustavo Guanabara",
    url: "https://www.cursoemvideo.com/curso/mysql/",
    kind: "course",
    actionType: "WATCH",
    competencies: [
      "sql-basics",
      "relational-data-modeling"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free-content-paid-certificate",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "não declarada na plataforma",
    why: "40h em 18 aulas com SQL explicado em português falado. Ressalva forte e obrigatória na ficha: o ambiente ensinado é WAMP/XAMPP com phpMyAdmin, stack datada e hoje um obstáculo real — recomendar praticar no SQLBolt ou em MySQL/Postgres em container. Exige cadastro.",
    origin: "book"
  },
  {
    id: "cc50-cs50-de-harvard-legendado-em-portugues-fundacao-estudar",
    title: "CC50: CS50 de Harvard legendado em português (Fundação Estudar)",
    sourceName: "Fundação Estudar",
    url: "https://www.estudarfora.org.br/cc50-v2/",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "programming-fundamentals",
      "algorithms-and-complexity"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: false,
    license: "CC BY-NC-SA 4.0 (licença CS50/Harvard), licenciado à Fundação Estudar",
    why: "Versão pt-BR oficial do CS50, produzida e licenciada por Harvard, com link de licença na própria página. Correção obrigatória: pt-BR é LEGENDA profissional, não dublagem nem tradução do corpo — as aulas são em inglês, e problem sets e textos seguem em inglês. Marcar como parcial e dizer isso ao usuário.",
    origin: "book"
  },
  {
    id: "freecodecamp-curriculo-em-portugues",
    title: "freeCodeCamp: currículo em português",
    sourceName: "freeCodeCamp",
    url: "https://www.freecodecamp.org/portuguese/learn",
    kind: "interactive",
    actionType: "PROVE",
    competencies: [
      "html-semantics",
      "css-layout",
      "javascript-essentials",
      "algorithms-and-complexity",
      "sql-basics"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: false,
    license: "BSD-3-Clause (código) + CC BY-SA 4.0 (currículo)",
    why: "Fundação detentora, gratuito, tradução do currículo feita manualmente por voluntários. Alerta que muda o cadastro: as 11 certificações antigas viraram 'legadas' e há um novo currículo Certified Full Stack Developer sem evidência de tradução pt-BR — apontar para as legadas, não para a raiz. A SPA não permitiu inspecionar o corpo dos desafios: confiança rebaixada.",
    origin: "book"
  },
  {
    id: "dio-bootcamp-primeiros-passos-em-tecnologia",
    title: "DIO: Bootcamp Primeiros Passos em Tecnologia",
    sourceName: "DIO",
    url: "https://www.dio.me/bootcamp/primeiros-passos-em-tecnologia",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "programming-fundamentals",
      "html-semantics",
      "css-layout",
      "javascript-essentials",
      "version-control-git"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "proprietária (plataforma DIO) — apenas linkar",
    why: "72h com inscrição gratuita e ativa, conteúdo nativo em pt-BR cobrindo lógica, HTML/CSS/JS, versionamento e preparação para entrevista. Aviso obrigatório na ficha: a própria página declara que o cadastro deixa o perfil disponível para centenas de empresas — o preço real é o dado pessoal, e o usuário tem que saber antes de clicar.",
    origin: "book"
  },
  {
    id: "alura-7-days-of-code",
    title: "Alura: 7 Days of Code",
    sourceName: "Alura",
    url: "https://7daysofcode.io/",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "build-an-application",
      "javascript-essentials",
      "dom-and-browser",
      "version-control-git"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "proprietária (Alura)",
    why: "Iniciativa perene, aberta a qualquer pessoa sem assinatura, com o único requisito de um e-mail para receber os desafios. Não ensina conteúdo novo, propõe prática — é artefato BUILD dependente de um curso anterior, e por isso encaixa exatamente na regra de um FAÇA a cada ~4 leituras.",
    origin: "book"
  },
  {
    id: "escola-virtual-fundacao-bradesco-crie-um-site-simples-usando-html-css-",
    title: "Escola Virtual Fundação Bradesco: Crie um site simples usando HTML, CSS e JavaScript",
    sourceName: "Fundação Bradesco · Escola Virtual",
    url: "https://www.ev.org.br/cursos/crie-um-site-simples-usando-html-css-e-javascript",
    kind: "course",
    actionType: "BUILD",
    competencies: [
      "html-semantics",
      "css-layout",
      "build-an-application"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "proprietária — conteúdo Microsoft cedido à Escola Virtual; apenas linkar",
    why: "2h, integralmente gratuito, com certificado digital gratuito e código de autenticação — raro no lote. Contradição a registrar: a própria página exige familiaridade prévia com uma linguagem de programação e marcação, e instalação do VS Code. Recurso secundário com certificado, NUNCA porta de entrada de html-semantics L0. Idade mínima 16 anos, prazo de 60 dias.",
    origin: "book"
  },
  {
    id: "escola-virtual-fundacao-bradesco-linguagem-de-programacao-python-basic",
    title: "Escola Virtual Fundação Bradesco: Linguagem de Programação Python Básico",
    sourceName: "Fundação Bradesco · Escola Virtual",
    url: "https://www.ev.org.br/cursos/linguagem-de-programacao-python-basico",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "programming-fundamentals"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "proprietária (Fundação Bradesco) — apenas linkar",
    why: "18h, nível iniciante, com certificado automático para aprovados: lógica, variáveis e tipos, estruturas lógicas e funções. Usa PyCharm e programas de console — só recomendar quando o usuário quer fundamentos agnósticos, nunca como caminho para a plataforma web. A página não declara ano de produção.",
    origin: "book"
  },
  {
    id: "the-odin-project-foundations",
    title: "The Odin Project: Foundations",
    sourceName: "The Odin Project",
    url: "https://www.theodinproject.com/paths/foundations/courses/foundations",
    kind: "course",
    actionType: "LEARN",
    competencies: [
      "html-semantics",
      "css-layout",
      "javascript-essentials",
      "version-control-git",
      "command-line-basics",
      "problem-decomposition"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY-NC-SA 4.0 (currículo open source)",
    why: "Currículo vivo, mantido open source, com Flexbox como método de layout ensinado (sem risco pré-2019) e ritmo de ~1 projeto a cada 3-5 lições, que é a referência pedagógica do nosso marco. Correção: CSS Grid NÃO está em Foundations, fica no curso Intermediate — não prometer Grid. Só em inglês.",
    origin: "book"
  },
  {
    id: "logica-de-programacao-crie-seus-primeiros-programas-usando-javascript-",
    title: "Lógica de Programação: Crie seus primeiros programas usando JavaScript e HTML (Paulo Silveira, Adriano Almeida)",
    sourceName: "Casa do Código",
    url: "https://www.casadocodigo.com.br/products/livro-programacao",
    kind: "book",
    actionType: "READ",
    competencies: [
      "programming-fundamentals",
      "problem-decomposition",
      "ai-assisted-development-basics"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "paid",
    costNote: "R$ 39,90 e-book / R$ 69,90 impresso",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "comercial — Casa do Código",
    chapters: "10 capítulos sem pré-requisito, incluindo uma seção sobre uso responsável de IA",
    why: "Único livro pago do lote com atualização recente confirmada (set/2025) e o único que trata explicitamente o uso responsável de ChatGPT/Gemini como complemento ao aprendizado. PAGO: nunca é o recomendado padrão enquanto existirem Curso em Vídeo e Pense em Python de graça no mesmo nível.",
    origin: "book"
  },
  {
    id: "aprenda-javascript-com-dashboards-lucas-tauil",
    title: "Aprenda JavaScript com Dashboards (Lucas Tauil)",
    sourceName: "Casa do Código",
    url: "https://www.casadocodigo.com.br/products/livro-js-dashboards",
    kind: "book",
    actionType: "READ",
    competencies: [
      "javascript-essentials",
      "dom-and-browser",
      "api-consumption"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "paid",
    costNote: "R$ 39,90 e-book / R$ 64,90 impresso",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "comercial — Casa do Código",
    why: "Publicado em set/2025, 252 páginas — o material pago de JavaScript mais recente do lote, e o único que não cai no corte pré-2019. A editora posiciona explicitamente para quem nunca teve contato com código. PAGO, e a profundidade real de api-consumption não foi verificada no miolo.",
    origin: "book"
  },
  {
    id: "mysql-comece-com-o-principal-banco-de-dados-open-source-do-mercado-vin",
    title: "MySQL: Comece com o principal banco de dados open source do mercado (Vinícius Carvalho)",
    sourceName: "Casa do Código",
    url: "https://www.casadocodigo.com.br/products/livro-banco-mysql",
    kind: "book",
    actionType: "READ",
    competencies: [
      "sql-basics",
      "relational-data-modeling"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "paid",
    costNote: "R$ 39,90 e-book",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "comercial — Casa do Código",
    why: "Publicado em 2015, atualizado em dez/2018 para MySQL 8.0 — a regra de corte de ~2019 vale para HTML/CSS/JS pré-flexbox, não para SQL, que segue atual. PAGO. Alerta menor: já existe MySQL 8.4 LTS, então detalhes de instalação estarão defasados.",
    origin: "book"
  },
  {
    id: "testes-automatizados-de-software-um-guia-pratico-mauricio-aniche",
    title: "Testes automatizados de software: um guia prático (Mauricio Aniche)",
    sourceName: "Casa do Código",
    url: "https://www.casadocodigo.com.br/products/livro-testes-de-software",
    kind: "book",
    actionType: "READ",
    competencies: [
      "automated-testing-basics"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "paid",
    costNote: "R$ 39,90 e-book / R$ 59,90 impresso",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "comercial — Casa do Código",
    chapters: "caps. 1 (testes de unidade), 2 (TDD) e 3 (mock objects) como leitura conceitual; os demais são de integração/serviços e fogem do nível",
    why: "Sumário confirmado na página da editora. Apoio conceitual pago para uma das competências mais mal servidas do catálogo — mas 11 anos sem atualização e nenhum capítulo sobre ferramentas JS (Jest/Vitest), então nunca como recurso principal. A linguagem dos exemplos não foi confirmada na página.",
    origin: "book"
  },
  {
    id: "acessibilidade-na-web-boas-praticas-para-construir-sites-e-aplicacoes-",
    title: "Acessibilidade na Web: Boas práticas para construir sites e aplicações acessíveis (Reinaldo Ferraz)",
    sourceName: "Casa do Código",
    url: "https://www.casadocodigo.com.br/products/livro-acessibilidade",
    kind: "book",
    actionType: "READ",
    competencies: [
      "web-accessibility-basics",
      "html-semantics"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "paid",
    costNote: "R$ 39,90 e-book / R$ 69,90 impresso",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "comercial — Casa do Código, ISBN 978-65-86110-10-4",
    why: "Publicado em 04/2020, obra original em pt-BR (não é tradução), dentro do corte. É o recurso mais defensável para o recorte brasileiro de acessibilidade, ao lado do W3C WAI traduzido. PAGO, e a menção ao eMAG não pôde ser confirmada na página.",
    origin: "book"
  },
  {
    id: "construindo-apis-rest-com-node-js-caio-ribeiro-pereira",
    title: "Construindo APIs REST com Node.js (Caio Ribeiro Pereira)",
    sourceName: "Casa do Código",
    url: "https://www.casadocodigo.com.br/products/livro-apis-nodejs",
    kind: "book",
    actionType: "READ",
    competencies: [
      "api-development"
    ],
    levelMin: "L2",
    technology: "agnostic",
    cost: "paid",
    costNote: "R$ 39,90 e-book / R$ 69,90 impresso",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "comercial — Casa do Código, ISBN 978-85-5519-150-3",
    why: "Publicado em 2016, atualizado em out/2021 para Node.js 16. Ressalva obrigatória e séria na ficha: Node 16 está em EOL desde set/2023 e o livro não recebe atualização há ~5 anos — setup, dependências e padrões de Sequelize/Passport vão exigir ajuste. Topo do escopo (L2), nunca recurso principal sem complemento nas docs oficiais de Express/Node LTS.",
    origin: "book"
  },
  {
    id: "estruturas-de-dados-domine-as-praticas-essenciais-em-c-java-c-python-e",
    title: "Estruturas de Dados: Domine as práticas essenciais em C, Java, C#, Python e JavaScript (Thiago Leite e Carvalho)",
    sourceName: "Casa do Código",
    url: "https://www.casadocodigo.com.br/products/livro-estruturas-de-dados",
    kind: "book",
    actionType: "READ",
    competencies: [
      "algorithms-and-complexity"
    ],
    levelMin: "L2",
    technology: "agnostic",
    cost: "paid",
    costNote: "R$ 49,90 e-book / R$ 89,90 impresso",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "comercial — Casa do Código, ISBN 978-85-5519-338-5",
    why: "Publicado em jun/2023 com atualização em fev/2024 — o livro pago mais recente do lote. Implementações em JavaScript ao lado de C/Java/C#/Python confirmadas, o que resolve o problema de todo material brasileiro de algoritmos estar em Java. L2 legítimo: gate 'depois de programming-fundamentals L1 e de Entendendo Algoritmos'.",
    origin: "book"
  },
  {
    id: "entendendo-algoritmos-2-edicao-aditya-bhargava",
    title: "Entendendo Algoritmos: 2ª edição (Aditya Bhargava)",
    sourceName: "Novatec",
    url: "https://novatec.com.br/livros/entendendo-algoritmos-2ed/",
    kind: "book",
    actionType: "READ",
    competencies: [
      "algorithms-and-complexity",
      "problem-decomposition"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "paid",
    costNote: "R$ 96,00 impresso",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "comercial — Novatec (tradução autorizada de Grokking Algorithms 2e)",
    why: "2ª edição, 2026, 328 páginas, tradução pt-BR completa e impressa (não é tradução comunitária parcial). A própria editora declara que não exige conhecimento matemático avançado, o que é coerente com L1. Melhor item pago do lote para algorithms-and-complexity, competência em que o material gratuito brasileiro está todo em L2 e em Java.",
    origin: "book"
  },
  {
    id: "codigo-limpo-habilidades-praticas-do-agile-software-robert-c-martin",
    title: "Código Limpo: Habilidades Práticas do Agile Software (Robert C. Martin)",
    sourceName: "Alta Books",
    url: "https://altabooks.com.br/produto/codigo-limpo/",
    kind: "book",
    actionType: "READ",
    competencies: [
      "code-readability"
    ],
    levelMin: "L2",
    technology: "agnostic",
    cost: "paid",
    costNote: "R$ 138,50",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "comercial — Alta Books, ISBN 978-85-7608-267-5",
    why: "Página oficial da editora detentora dos direitos em pt-BR, tradução completa, conteúdo conceitual evergreen. Entra APENAS como aprofundamento opcional com o corte por capítulo: R$ 138,50 é alto para o público-alvo e a tradução é criticada, então o gratuito (Refactoring.Guru pt-BR parcial, guias de code review do Google) vem sempre primeiro na ficha.",
    origin: "book"
  },
  {
    id: "origamid-html-e-css-para-iniciantes",
    title: "Origamid: HTML e CSS para Iniciantes",
    sourceName: "Origamid",
    url: "https://www.origamid.com/curso/html-e-css-para-iniciantes/",
    kind: "course",
    actionType: "WATCH",
    competencies: [
      "html-semantics",
      "css-layout",
      "version-control-git",
      "command-line-basics"
    ],
    levelMin: "L0",
    technology: "agnostic",
    cost: "paid",
    costNote: "R$ 249 avulso ou assinatura",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "proprietária (Origamid) — conteúdo pago, apenas linkar",
    why: "Conteúdo moderno e confirmado (Flexbox e Grid), sem o problema pré-flexbox dos livros brasileiros da mesma competência. Mas o paywall é sobre o conteúdo em si, não sobre certificado, e a Origamid não tem mais cursos gratuitos: a ficha deve sempre oferecer primeiro web.dev 'Aprenda CSS' e o Curso em Vídeo. A página não declara ano de produção.",
    origin: "book"
  },
  {
    id: "origamid-javascript-completo-es6",
    title: "Origamid: JavaScript Completo ES6",
    sourceName: "Origamid",
    url: "https://www.origamid.com/curso/javascript-completo-es6/",
    kind: "course",
    actionType: "WATCH",
    competencies: [
      "javascript-essentials",
      "dom-and-browser",
      "api-consumption"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "paid",
    costNote: "R$ 249 avulso ou assinatura",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "proprietária (Origamid) — conteúdo pago, apenas linkar",
    why: "Cobre fundamentos de JS, manipulação de DOM, assíncrono com Promises e Fetch API e regex, atendendo dom-and-browser e api-consumption em português. Ressalva cética: a página não declara ano, o título 'ES6' indica material de ~2018, o toolchain final (Webpack/Babel) está datado frente a Vite e não há menção a async/await no programa. Sempre depois de javascript.info e do Curso em Vídeo na ordem.",
    origin: "book"
  },
  {
    id: "neps-academy-exercicios-com-correcao-automatica",
    title: "Neps Academy: exercícios com correção automática",
    sourceName: "Neps Academy",
    url: "https://neps.academy/br/exercises",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "programming-fundamentals",
      "problem-decomposition"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: true,
    license: "direitos reservados — apenas linkar",
    why: "Plataforma brasileira de exercícios em português, com correção automática. Gratuita com cadastro; o plano Pro é opcional. Resolver sem copiar a solução é o critério de saída de Fundamentos L1.",
    origin: "practice"
  },
  {
    id: "obi-problemas-das-edicoes-anteriores",
    title: "OBI: problemas das edições anteriores",
    sourceName: "Olimpíada Brasileira de Informática (Unicamp)",
    url: "https://olimpiada.ic.unicamp.br/pratique/",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "problem-decomposition",
      "programming-fundamentals"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Enunciados de olimpíada separados por nível, em português e sem cadastro para ler. Bons para treinar listar os passos antes de codar — o critério de Decomposição L1.",
    origin: "practice"
  },
  {
    id: "exercism-trilha-de-javascript",
    title: "Exercism: trilha de JavaScript",
    sourceName: "Exercism",
    url: "https://exercism.org/tracks/javascript",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "programming-fundamentals",
      "javascript-essentials"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: true,
    license: "plataforma aberta e gratuita — apenas linkar",
    why: "Exercícios curtos com testes prontos: você sabe que terminou quando os testes passam. Mentoria humana gratuita é opcional. Em inglês.",
    origin: "practice"
  },
  {
    id: "depurar-o-javascript-tutorial-do-chrome-devtools",
    title: "Depurar o JavaScript: tutorial do Chrome DevTools",
    sourceName: "Chrome for Developers (Google)",
    url: "https://developer.chrome.com/docs/devtools/javascript?hl=pt-br",
    kind: "tutorial",
    actionType: "BUILD",
    competencies: [
      "debugging"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "conteúdo do Google para desenvolvedores — apenas linkar",
    estimatedTime: "20 min",
    why: "Tutorial em português com uma página de demonstração defeituosa: você acha o defeito com ponto de interrupção, sem chutar e sem encher o código de console.log. É o critério de Depuração L1 feito na prática.",
    origin: "practice"
  },
  {
    id: "gilded-rose-kata-de-refatoracao",
    title: "Gilded Rose: kata de refatoração",
    sourceName: "Emily Bache (GitHub)",
    url: "https://github.com/emilybache/GildedRose-Refactoring-Kata",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "code-readability",
      "automated-testing-basics"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "MIT",
    why: "Código legado confuso de propósito, em dezenas de linguagens. Primeiro você escreve os testes que travam o comportamento; depois refatora sem medo. Treina testes e legibilidade juntos — nessa ordem.",
    origin: "practice"
  },
  {
    id: "overthewire-bandit",
    title: "OverTheWire: Bandit",
    sourceName: "OverTheWire",
    url: "https://overthewire.org/wargames/bandit/",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "command-line-basics"
    ],
    levelMin: "L1",
    technology: "shell",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar",
    why: "Jogo de terminal em fases: cada nível só se passa usando comandos de verdade. Navegar, ler arquivo e buscar texto sem decorar lista de comandos.",
    origin: "practice"
  },
  {
    id: "missao-consulte-cnpjs-e-leia-o-que-a-resposta-diz",
    title: "Missão: consulte CNPJs e leia o que a resposta diz",
    sourceName: "Missão Career Gap · BrasilAPI",
    url: "https://brasilapi.com.br/docs#tag/CNPJ",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "http-fundamentals"
    ],
    levelMin: "L1",
    technology: "http",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "missão do projeto; BrasilAPI é pública e aberta (MIT)",
    estimatedTime: "30 min",
    why: "Consultar empresa por CNPJ é tarefa comum em sistema brasileiro — cadastro de cliente, de fornecedor, nota fiscal. As respostas foram testadas: 200 para CNPJ real, 400 para dígito inválido, 404 para CNPJ bem formado que não existe.",
    task: "Pelo navegador ou com curl, consulte na API de CNPJ da BrasilAPI: um CNPJ real (o do Banco do Brasil é 00.000.000/0001-91), o mesmo número com o último dígito trocado e o 00.000.000/0000-00. Para cada um, anote o código de status e o que o corpo diz, e explique por que um volta 400 e outro 404. Depois consulte na API de Localidades do IBGE um estado que não existe: vem 200 com lista vazia. O que isso ensina sobre olhar só o status? Feche explicando por que consulta é GET e quando um cadastro seria POST.",
    origin: "mission"
  },
  {
    id: "missao-monte-um-cadastro-de-fornecedor-so-pela-documentacao",
    title: "Missão: monte um cadastro de fornecedor só pela documentação",
    sourceName: "Missão Career Gap · BrasilAPI",
    url: "https://brasilapi.com.br/docs",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "reading-documentation"
    ],
    levelMin: "L2",
    technology: "http",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "missão do projeto; BrasilAPI é pública e aberta (MIT)",
    estimatedTime: "40 min",
    why: "Os dois critérios de saída de Leitura de documentação L2 são resolver uma dúvida de API só pela documentação e identificar a versão certa — e a BrasilAPI tem duas versões da consulta de CEP, o que torna o segundo critério real.",
    task: "Você vai preencher um cadastro de fornecedor a partir do CNPJ. Usando só a documentação da BrasilAPI — sem tutorial e sem pedir a URL a uma IA —, descubra como obter a razão social e o endereço pelo CNPJ e como completar o endereço pelo CEP. A consulta de CEP existe em duas versões: diga qual você usaria e por quê. Monte as URLs e confira o resultado no navegador.",
    origin: "mission"
  },
  {
    id: "missao-valide-o-cnpj-inclusive-o-novo-com-letras",
    title: "Missão: valide o CNPJ, inclusive o novo, com letras",
    sourceName: "Missão Career Gap · Receita Federal",
    url: "https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/cnpj/cnpj-alfanumerico.pdf",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "programming-fundamentals"
    ],
    levelMin: "L2",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "missão do projeto; documento público da Receita Federal",
    estimatedTime: "1–2 h",
    why: "É a mudança de mercado de 2026 no cadastro de empresas, e exercita exatamente os critérios de Fundamentos L2: programa do zero e erro tratado com mensagem útil. Pede ainda que os passos sejam listados antes de codar. Ensina de quebra que CNPJ é texto, não número.",
    task: "Desde julho de 2026 a Receita emite CNPJ com letras nas 12 primeiras posições, e todo sistema brasileiro precisa aceitar os dois formatos. Antes de codar, liste os passos. Depois escreva uma função que diga se um CNPJ é válido, nos dois formatos, seguindo a regra oficial dos dígitos verificadores do documento. Teste com o exemplo resolvido no próprio documento e com um CNPJ numérico real. Troque um dígito de propósito: a função tem que recusar com uma mensagem útil.",
    origin: "mission"
  },
  {
    id: "desafio-tecnico-de-empresa-brasileira-front-end",
    title: "Desafio técnico de empresa brasileira: front-end",
    sourceName: "felipefialho/frontend-challenges (GitHub)",
    url: "https://github.com/felipefialho/frontend-challenges",
    kind: "exercise",
    actionType: "PROVE",
    competencies: [
      "build-an-application"
    ],
    levelMin: "L2",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "MIT",
    why: "Testes técnicos que empresas brasileiras aplicam em processos seletivos, reunidos pela comunidade (15 mil estrelas, ativo em outubro de 2026). Entregar um é a prova mais próxima do que o mercado pede — e já entra no portfólio.",
    origin: "practice"
  },
  {
    id: "desafio-tecnico-de-empresa-brasileira-back-end",
    title: "Desafio técnico de empresa brasileira: back-end",
    sourceName: "backend-br/desafios (GitHub)",
    url: "https://github.com/backend-br/desafios",
    kind: "exercise",
    actionType: "PROVE",
    competencies: [
      "build-an-application"
    ],
    levelMin: "L2",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "MIT",
    why: "A versão de back-end da mesma ideia: desafios reais de processos seletivos no Brasil. Serve de marco para quem segue a ênfase de back-end.",
    origin: "practice"
  },
  {
    id: "primeira-contribuicao-querido-diario",
    title: "Primeira contribuição: Querido Diário",
    sourceName: "Open Knowledge Brasil (GitHub)",
    url: "https://github.com/okfn-brasil/querido-diario/issues?q=is%3Aopen+label%3A%22good+first+issue%22",
    kind: "exercise",
    actionType: "PROVE",
    competencies: [
      "code-review-participation",
      "version-control-git"
    ],
    levelMin: "L1",
    technology: "agnostic",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: true,
    license: "MIT",
    why: "Projeto brasileiro de dados abertos com 25 issues marcadas para quem está começando (15/10/2026). Um pull request aceito passa por revisão de verdade — é evidência pública de Git, de revisão e de comunicação.",
    origin: "practice"
  },
  {
    id: "full-stack-open-exercicios-1-1-a-1-14-componentes-props-e-estado",
    title: "Full Stack Open, exercícios 1.1 a 1.14: componentes, props e estado",
    sourceName: "Universidade de Helsinque — Full Stack Open",
    url: "https://fullstackopen.com/ptbr/part1/introducao_a_biblioteca_react",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "ui-components-and-state"
    ],
    levelMin: "L1",
    technology: "react",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-NC-SA 3.0 — apenas linkar",
    estimatedTime: "7 h (média de 2026 da parte 1)",
    why: "Três aplicações pequenas que obrigam a separar a tela em componentes e decidir onde o estado mora. A tradução em pt-BR ainda manda criar o projeto com create-react-app, que o React não recomenda mais: crie com Vite, como a versão em inglês do curso já faz.",
    origin: "practice"
  },
  {
    id: "full-stack-open-exercicios-2-1-a-2-10-listas-e-formulario-controlado",
    title: "Full Stack Open, exercícios 2.1 a 2.10: listas e formulário controlado",
    sourceName: "Universidade de Helsinque — Full Stack Open",
    url: "https://fullstackopen.com/ptbr/part2/formularios",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "ui-components-and-state"
    ],
    levelMin: "L1",
    technology: "react",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-NC-SA 3.0 — apenas linkar",
    why: "Renderizar uma coleção com chave estável e montar um formulário controlado que valida antes de adicionar: os dois critérios da competência, em exercícios curtos e em português.",
    origin: "practice"
  },
  {
    id: "full-stack-open-exercicios-0-4-a-0-6-diagrame-as-requisicoes",
    title: "Full Stack Open, exercícios 0.4 a 0.6: diagrame as requisições",
    sourceName: "Universidade de Helsinque — Full Stack Open",
    url: "https://fullstackopen.com/ptbr/part0/fundamentos_de_aplicacoes_web",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "http-fundamentals"
    ],
    levelMin: "L1",
    technology: "http",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-NC-SA 3.0 — apenas linkar",
    estimatedTime: "4 h (média de 2026 da parte 0)",
    why: "Desenhar o fluxo exige ler cada requisição na aba Network e comparar o POST de formulário, que redireciona, com o POST em JSON da aplicação de página única. É escolher entre GET e POST sabendo o porquê.",
    origin: "practice"
  },
  {
    id: "full-stack-open-exercicios-2-11-a-2-17-lista-telefonica-com-api-rest",
    title: "Full Stack Open, exercícios 2.11 a 2.17: lista telefônica com API REST",
    sourceName: "Universidade de Helsinque — Full Stack Open",
    url: "https://fullstackopen.com/ptbr/part2/obtendo_dados_do_servidor",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "api-consumption"
    ],
    levelMin: "L1",
    technology: "react",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-NC-SA 3.0 — apenas linkar",
    why: "Buscar, criar, alterar e apagar por uma API REST local. O exercício 2.17 pede uma mensagem útil quando a operação falha (o contato já foi apagado em outra aba e a API devolve 404).",
    origin: "practice"
  },
  {
    id: "full-stack-open-exercicios-4-15-a-4-23-senha-com-bcrypt-e-login-por-to",
    title: "Full Stack Open, exercícios 4.15 a 4.23: senha com bcrypt e login por token",
    sourceName: "Universidade de Helsinque — Full Stack Open",
    url: "https://fullstackopen.com/ptbr/part4/autenticacao_por_token",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "authentication-basics"
    ],
    levelMin: "L1",
    technology: "node",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-NC-SA 3.0 — apenas linkar",
    why: "Guarda a senha com bcrypt em vez de criptografia própria e só deixa o autor apagar o que criou (401 para quem não pode). O texto não nomeia a diferença entre autenticação e autorização; leia junto o tutorial do MDN.",
    origin: "practice"
  },
  {
    id: "tutorial-django-parte-8-autenticacao-de-usuario-e-permissoes",
    title: "Tutorial Django Parte 8: Autenticação de usuário e permissões",
    sourceName: "MDN Web Docs (Mozilla)",
    url: "https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Extensions/Server-side/Django/Authentication",
    kind: "tutorial",
    actionType: "BUILD",
    competencies: [
      "authentication-basics"
    ],
    levelMin: "L1",
    technology: "python-django",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "CC BY-SA 2.5",
    why: "Login e permissões em seções separadas, que é a diferença entre autenticação e autorização posta em prática. Continua o projeto LocalLibrary das partes anteriores, que também estão em pt-BR.",
    origin: "practice"
  },
  {
    id: "freecodecamp-criar-uma-api-de-lista-de-filmes-para-a-familia",
    title: "freeCodeCamp: Criar uma API de lista de filmes para a família",
    sourceName: "freeCodeCamp",
    url: "https://www.freecodecamp.org/portuguese/learn/back-end-development-and-apis-v9/lab-family-movie-watchlist-api/build-a-family-movie-watchlist-api",
    kind: "exercise",
    actionType: "PROVE",
    competencies: [
      "authentication-basics"
    ],
    levelMin: "L1",
    technology: "node",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: true,
    license: "direitos reservados — apenas linkar (a BSD-3 do freeCodeCamp cobre só o software)",
    why: "Os testes automáticos distinguem 401 de 403 por papel (quem pode ver e quem pode alterar a lista), e a entrega é um repositório público com os testes passando. Enunciado traduzido; o ambiente roda no GitHub Codespaces, com instruções do editor em inglês.",
    origin: "practice"
  },
  {
    id: "freecodecamp-criar-um-banco-de-dados-de-corpos-celestiais",
    title: "freeCodeCamp: Criar um banco de dados de corpos celestiais",
    sourceName: "freeCodeCamp",
    url: "https://www.freecodecamp.org/portuguese/learn/relational-databases-v9/lab-celestial-bodies-database/lab-celestial-bodies-database",
    kind: "exercise",
    actionType: "PROVE",
    competencies: [
      "relational-data-modeling"
    ],
    levelMin: "L0",
    technology: "sql",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: true,
    license: "direitos reservados — apenas linkar (a BSD-3 do freeCodeCamp cobre só o software)",
    why: "Modelar cinco tabelas ligadas por chave primária e estrangeira, com testes que conferem a estrutura. Primeira prática verificável da competência no catálogo. Enunciado traduzido; o tutorial dentro do ambiente está em inglês.",
    origin: "practice"
  },
  {
    id: "the-odin-project-project-inventory-application",
    title: "The Odin Project, Project: Inventory Application",
    sourceName: "The Odin Project",
    url: "https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "relational-data-modeling"
    ],
    levelMin: "L1",
    technology: "node",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY-NC-SA 4.0 — apenas linkar",
    why: "Antes de escrever código, o projeto pede o desenho das tabelas e uma decisão: o que acontece com os itens quando a categoria é apagada. É chave estrangeira com consequência, não só sintaxe.",
    origin: "practice"
  },
  {
    id: "freecodecamp-construir-um-aplicativo-de-clima",
    title: "freeCodeCamp: Construir um Aplicativo de Clima",
    sourceName: "freeCodeCamp",
    url: "https://www.freecodecamp.org/portuguese/learn/javascript-v9/lab-weather-app/lab-weather-app",
    kind: "exercise",
    actionType: "PROVE",
    competencies: [
      "api-consumption"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar (a BSD-3 do freeCodeCamp cobre só o software)",
    why: "Os testes forçam a falha da API e exigem um aviso ao usuário: prova \"minha tela mostra algo útil quando a requisição falha\". Roda no navegador; a conta só guarda o progresso.",
    origin: "practice"
  },
  {
    id: "freecodecamp-faca-a-depuracao-do-modificador-de-cor-de-fundo-aleatorio",
    title: "freeCodeCamp: Faça a depuração do modificador de cor de fundo aleatório",
    sourceName: "freeCodeCamp",
    url: "https://www.freecodecamp.org/portuguese/learn/javascript-v9/lab-random-background-color-changer/debug-a-random-background-color-changer",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "debugging"
    ],
    levelMin: "L0",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar (a BSD-3 do freeCodeCamp cobre só o software)",
    why: "Um programa quebrado de propósito, em que cada história nomeia o tipo de erro (de sintaxe, de referência, de tipo). Treina explicar a causa, não só aplicar a correção.",
    origin: "practice"
  },
  {
    id: "freecodecamp-depure-um-formulario-de-doacao",
    title: "freeCodeCamp: Depure um formulário de doação",
    sourceName: "freeCodeCamp",
    url: "https://www.freecodecamp.org/portuguese/learn/responsive-web-design-v9/lab-debug-donation-form/debug-donation-form",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "web-accessibility-basics"
    ],
    levelMin: "L0",
    technology: "html",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "direitos reservados — apenas linkar (a BSD-3 do freeCodeCamp cobre só o software)",
    why: "Um formulário inacessível para consertar até os testes passarem: rótulos associados, agrupamento e controles usáveis pelo teclado. Roda no navegador.",
    origin: "practice"
  },
  {
    id: "the-odin-project-project-etch-a-sketch",
    title: "The Odin Project, Project: Etch-a-Sketch",
    sourceName: "The Odin Project",
    url: "https://www.theodinproject.com/lessons/foundations-etch-a-sketch",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "dom-and-browser"
    ],
    levelMin: "L0",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "none",
    requiresSignup: false,
    license: "CC BY-NC-SA 4.0 — apenas linkar",
    why: "Uma grade gerada toda pelo DOM que reage ao mouse, com um roteiro de diagnóstico pelo console e pelo inspetor quando nada aparece. Pede usar as ferramentas do navegador sem tutorial.",
    origin: "practice"
  },
  {
    id: "freecodecamp-criar-um-boilerplate-so-pelo-terminal",
    title: "freeCodeCamp: Criar um boilerplate (só pelo terminal)",
    sourceName: "freeCodeCamp",
    url: "https://www.freecodecamp.org/portuguese/learn/relational-databases-v9/workshop-bash-boilerplate/build-a-boilerplate",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "command-line-basics"
    ],
    levelMin: "L0",
    technology: "shell",
    cost: "free",
    ptBrStatus: "partial",
    requiresSignup: true,
    license: "direitos reservados — apenas linkar (a BSD-3 do freeCodeCamp cobre só o software)",
    why: "Monta a estrutura de um site inteiro só com comandos: criar, mover, renomear e apagar pastas e arquivos. Exige conta no GitHub para o ambiente; as instruções do editor estão em inglês.",
    origin: "practice"
  },
  {
    id: "missao-peca-a-ia-uma-funcao-de-preco-e-prove-que-ela-esta-certa",
    title: "Missão: peça à IA uma função de preço e prove que ela está certa",
    sourceName: "Missão Career Gap · MDN",
    url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat",
    kind: "exercise",
    actionType: "BUILD",
    competencies: [
      "ai-assisted-development-basics"
    ],
    levelMin: "L1",
    technology: "javascript",
    cost: "free",
    ptBrStatus: "complete",
    requiresSignup: false,
    license: "missão do projeto; a página do MDN é CC BY-SA 2.5",
    estimatedTime: "45 min",
    why: "Formatar preço em reais é tarefa de todo sistema brasileiro, e a armadilha é real: o Intl.NumberFormat põe um espaço não separável (U+00A0) entre R$ e o número, então o teste escrito com espaço comum falha mesmo com o código certo. Conferido no Node 22: 1234.56 vira \"R$ 1.234,56\" com U+00A0, e -10 vira \"-R$ 10,00\". Obriga a verificar a saída em vez de confiar nela, que é o critério da competência.",
    task: "Antes de abrir o assistente, escreva quatro testes para uma função formatarPreco(valor): 1234.56 vira R$ 1.234,56; 0.5 vira R$ 0,50; -10 vira -R$ 10,00; e um valor que não é número, como \"abc\", gera erro. Depois peça a função ao assistente que você já usa, colando os testes e dizendo a linguagem. Rode os testes. Se algum falhar, descubra se o erro é da IA ou do teste comparando a saída caractere por caractere com o esperado: o espaço depois de R$ não é um espaço comum. Anote o que a IA errou, o que faltou no seu pedido e o que você teria aceitado sem os testes. Feche explicando cada linha da função final; a linha que você não souber explicar, reescreva.",
    origin: "mission"
  }
];
