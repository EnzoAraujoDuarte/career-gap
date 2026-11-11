import type { Competency } from '@/domain/model';
import { canonical, cs2023, sfia, swebok } from './sources';

/**
 * Catálogo de competências para o track de entrada em desenvolvimento web.
 *
 * Regras de autoria:
 *  - descritor `canDo` em primeira pessoa e observável — nunca "conhece X";
 *  - descritores apenas para os níveis usados como alvo ou limiar de pré-requisito;
 *  - no mínimo duas fontes de CLASSES diferentes por competência (validate.ts verifica).
 */
export const COMPETENCIES: readonly Competency[] = [
  // ---------------------------------------------------------------- foundations
  {
    id: 'programming-fundamentals',
    name: 'Fundamentos de programação',
    domain: 'foundations',
    summary: 'Variáveis, controle de fluxo, funções, coleções e tratamento de erros.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo: 'Escrevo funções com condicionais e repetição seguindo um exemplo parecido.',
        exitCriteria: [
          'Resolvo um exercício pequeno sem copiar a solução pronta',
          'Explico o que cada linha do meu código faz',
        ],
      },
      L2: {
        canDo:
          'Escrevo um programa do zero usando listas e mapas, e trato os erros previsíveis ' +
          'sem que ele quebre.',
        exitCriteria: [
          'Escolho entre lista e mapa justificando a escolha',
          'Meu programa falha com mensagem útil em vez de travar',
        ],
      },
    },
    sources: [cs2023('SDF', 'Software Development Fundamentals'), sfia('PROG')],
  },
  {
    id: 'problem-decomposition',
    name: 'Decomposição de problemas',
    domain: 'foundations',
    summary: 'Quebrar um enunciado vago em passos verificáveis antes de escrever código.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo: 'Divido um problema em passos menores quando alguém me mostra por onde começar.',
        exitCriteria: ['Listo os passos antes de codar'],
      },
      L2: {
        canDo:
          'Pego um pedido mal definido, faço as perguntas que faltam e transformo em uma ' +
          'lista de passos que consigo implementar um a um.',
        exitCriteria: [
          'Identifico o que está ambíguo no pedido',
          'Cada passo da minha lista pode ser testado isoladamente',
        ],
      },
    },
    // Radermacher & Walia (SIGCSE 2013) apontam resolução de problemas como uma das
    // principais deficiências de recém-formados — por isso é core, não supporting.
    sources: [
      cs2023('SDF', 'Knowledge Unit de estratégias de resolução de problemas'),
      sfia('PROG'),
      canonical('Radermacher & Walia, SIGCSE 2013', 'deficiência recorrente em iniciantes'),
    ],
  },
  {
    id: 'algorithms-and-complexity',
    name: 'Algoritmos e custo',
    domain: 'foundations',
    summary: 'Nocão de custo de tempo/espaço e escolha de estrutura de dados adequada.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo:
          'Percebo quando um código vai ficar lento com muitos dados e sei dizer, em termos ' +
          'gerais, por quê.',
        exitCriteria: [
          'Reconheço um laço dentro de outro como possível problema',
          'Sei que buscar em mapa custa menos que varrer uma lista',
        ],
      },
    },
    sources: [cs2023('AL', 'Algorithmic Foundations'), sfia('PROG')],
  },

  // --------------------------------------------------------------- web-platform
  {
    id: 'html-semantics',
    name: 'HTML semântico',
    domain: 'web-platform',
    summary: 'Estruturar conteúdo com os elementos corretos, não só com div e span.',
    stability: 'evergreen',
    technologies: ['html'],
    levels: {
      L1: {
        canDo: 'Monto uma página com títulos, listas, links e formulários seguindo um modelo.',
        exitCriteria: ['A página tem estrutura de títulos coerente'],
      },
      L2: {
        canDo:
          'Escolho o elemento certo para cada conteúdo e explico por que uso nav, main ou ' +
          'button em vez de div.',
        exitCriteria: [
          'Meu formulário funciona com teclado e tem label associada',
          'Justifico cada escolha de elemento',
        ],
      },
    },
    sources: [canonical('MDN — HTML elements reference'), sfia('PROG')],
  },
  {
    id: 'css-layout',
    name: 'CSS: estilo e layout',
    domain: 'web-platform',
    summary:
      'Seletores, cascata e especificidade; posicionar e dimensionar elementos, incluindo ' +
      'comportamento responsivo.',
    stability: 'evergreen',
    technologies: ['css'],
    levels: {
      L1: {
        canDo: 'Aplico estilos e uso flexbox a partir de um exemplo para alinhar elementos.',
        exitCriteria: [
          'Consigo centralizar e distribuir elementos sem tentativa e erro',
          'Mostro no inspetor por que uma regra venceu a outra',
        ],
      },
      L2: {
        canDo:
          'Construo um layout que funciona em telas pequenas e grandes, e consigo descobrir ' +
          'por que um elemento está fora do lugar.',
        exitCriteria: [
          'Uso flexbox ou grid escolhendo entre os dois com critério',
          'Inspeciono o box model para diagnosticar um desalinhamento',
        ],
      },
    },
    sources: [canonical('MDN — CSS layout guide'), sfia('PROG')],
  },
  {
    id: 'javascript-essentials',
    name: 'JavaScript essencial',
    domain: 'web-platform',
    summary: 'A linguagem da plataforma web: tipos, funções, arrays, objetos, assincronismo.',
    stability: 'evergreen',
    technologies: ['javascript'],
    levels: {
      L1: {
        canDo: 'Escrevo funções em JavaScript e manipulo arrays e objetos com ajuda de exemplos.',
        exitCriteria: ['Uso map e filter em vez de laço manual quando cabe'],
      },
      L2: {
        canDo:
          'Trabalho com código assíncrono usando promises ou async/await e entendo por que o ' +
          'resultado não chega na hora que eu esperava.',
        exitCriteria: [
          'Explico a diferença entre síncrono e assíncrono com um exemplo meu',
          'Trato o erro de uma chamada assíncrona',
          'Organizo o código em módulos com import e export',
        ],
      },
    },
    sources: [cs2023('FPL', 'Foundations of Programming Languages'), canonical('MDN — JavaScript guide')],
  },
  {
    id: 'dom-and-browser',
    name: 'DOM e navegador',
    domain: 'web-platform',
    summary: 'Ler e alterar a página, reagir a eventos e usar as ferramentas do navegador.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo: 'Altero conteúdo da página e respondo a cliques usando eventos.',
        exitCriteria: ['Uso o console e o inspetor do navegador sem depender de tutorial'],
      },
      L2: {
        canDo:
          'Construo uma interface que reage a ações do usuário e uso as ferramentas do ' +
          'navegador para entender o que aconteceu quando ela não reage.',
        exitCriteria: ['Encontro o erro na aba Console e a requisição na aba Network'],
      },
    },
    sources: [canonical('MDN — Document Object Model'), sfia('PROG')],
  },
  {
    // As seis referências de currículo comparadas ensinam interface por
    // componentes e nenhuma das outras competências cobria. Fica agnóstica: React é o selo da
    // stack JavaScript, não o nome da competência.
    id: 'ui-components-and-state',
    name: 'Interface com componentes',
    domain: 'web-platform',
    summary:
      'Montar a tela com componentes, decidir onde o estado mora e deixar a interface ' +
      'reagir aos dados, sem alterar o DOM à mão.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo:
          'Monto uma tela com componentes que recebem dados e guardam estado, seguindo a ' +
          'documentação do framework.',
        exitCriteria: [
          'Separo a tela em componentes e explico onde o estado mora',
          'Mostro uma lista a partir de um array, com uma chave estável em cada item',
        ],
      },
      L2: {
        canDo:
          'Construo uma interface com formulário controlado e dados de uma API, tratando ' +
          'carregamento e erro, sem manipular o DOM diretamente.',
        exitCriteria: [
          'Meu formulário controlado valida antes de enviar',
          'Busco dados quando a tela abre sem disparar a mesma requisição em laço',
        ],
      },
    },
    sources: [
      cs2023('SPD', 'Specialized Platform Development — plataformas web'),
      canonical('react.dev — Pensando em React'),
      sfia('PROG'),
    ],
  },
  {
    id: 'http-fundamentals',
    name: 'Fundamentos de HTTP',
    domain: 'web-platform',
    summary: 'Métodos, códigos de status, cabeçalhos e o ciclo requisição/resposta.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo: 'Sei que o navegador faz requisições e reconheço o que é um 404 e um 500.',
        exitCriteria: ['Distingo erro do cliente de erro do servidor'],
      },
      L2: {
        canDo:
          'Leio uma requisição e uma resposta inteiras e explico o que cada parte significa, ' +
          'incluindo método, status e cabeçalhos relevantes.',
        exitCriteria: [
          'Escolho entre GET e POST com justificativa',
          'Diagnostico um erro lendo status e corpo da resposta',
        ],
      },
    },
    sources: [cs2023('NC', 'Networking and Communication'), canonical('RFC 9110 — HTTP Semantics')],
  },
  {
    id: 'web-accessibility-basics',
    name: 'Acessibilidade web básica',
    domain: 'web-platform',
    summary: 'Texto alternativo, contraste, foco e navegação por teclado.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo:
          'Garanto que imagens tenham texto alternativo, que dê para navegar pela página só ' +
          'com o teclado e que o contraste seja suficiente.',
        exitCriteria: [
          'Percorro a página inteira usando só Tab',
          'Rodo um verificador automático e corrijo o que ele aponta',
        ],
      },
    },
    sources: [cs2023('HCI', 'Human-Computer Interaction'), canonical('WCAG 2.2 — nível AA')],
  },

  // --------------------------------------------------------------- construction
  {
    id: 'command-line-basics',
    name: 'Linha de comando',
    domain: 'construction',
    summary: 'Navegar diretórios, instalar dependências, rodar scripts e ler a saída de um terminal.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo:
          'Navego entre pastas, rodo os comandos do meu projeto e leio a mensagem de erro que ' +
          'aparece no terminal.',
        exitCriteria: ['Instalo dependências e subo o projeto pelo terminal'],
      },
    },
    sources: [cs2023('OS', 'Operating Systems'), sfia('PROG')],
  },
  {
    id: 'version-control-git',
    name: 'Controle de versão com Git',
    domain: 'construction',
    summary: 'Histórico, branches e colaboração via repositório remoto.',
    stability: 'evergreen',
    technologies: ['git'],
    levels: {
      L1: {
        canDo: 'Faço commit e push do meu trabalho e sei recuperar a versão anterior de um arquivo.',
        exitCriteria: ['Meu histórico tem commits com mensagens compreensíveis'],
      },
      L2: {
        canDo:
          'Trabalho em branches, abro pull request e resolvo um conflito de merge sem perder ' +
          'trabalho meu nem de outra pessoa.',
        exitCriteria: [
          'Explico a diferença entre merge e rebase',
          'Resolvo um conflito entendendo os dois lados',
        ],
      },
    },
    sources: [
      swebok('Software Configuration Management'),
      sfia('CFMG'),
      canonical('Pro Git (Chacon & Straub), Creative Commons'),
    ],
  },
  {
    id: 'reading-documentation',
    name: 'Leitura de documentação',
    domain: 'construction',
    summary: 'Achar a resposta na fonte oficial em vez de depender de tutorial de terceiros.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo: 'Consulto a documentação oficial quando alguém me indica a página.',
        exitCriteria: ['Prefiro a doc oficial ao primeiro resultado de busca'],
      },
      L2: {
        canDo:
          'Encontro sozinho a resposta na documentação oficial, incluindo a assinatura de uma ' +
          'função e as opções que ela aceita.',
        exitCriteria: [
          'Resolvo uma dúvida de API só pela doc, sem tutorial',
          'Identifico a versão da doc que corresponde ao meu projeto',
          'Leio documentação em inglês, com tradutor só como apoio',
        ],
      },
    },
    // É a competência que determina a autonomia de quem está começando: sem ela, toda
    // dúvida vira dependência de terceiros.
    sources: [swebok('Software Engineering Professional Practice'), sfia('PROG')],
  },
  {
    id: 'code-readability',
    name: 'Legibilidade de código',
    domain: 'construction',
    summary: 'Nomes claros, funções pequenas e código que a próxima pessoa entende.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo:
          'Escolho nomes que dizem o que a coisa é e quebro funções muito longas em partes ' +
          'menores.',
        exitCriteria: [
          'Meus nomes não precisam de comentário para serem entendidos',
          'Consigo apontar a parte mais confusa do meu próprio código',
          'Rodo o linter e o formatador do projeto e corrijo o que apontam antes de pedir revisão',
        ],
      },
    },
    sources: [swebok('Software Construction'), sfia('PROG')],
  },
  {
    id: 'debugging',
    name: 'Depuração',
    domain: 'construction',
    summary: 'Localizar a causa de um defeito por hipótese e verificação, não por tentativa.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo: 'Leio a mensagem de erro e o stack trace e chego até a linha que falhou.',
        exitCriteria: ['Uso print ou breakpoint para inspecionar um valor'],
      },
      L2: {
        canDo:
          'Isolo a causa de um defeito formulando uma hipótese e testando-a, em vez de mudar ' +
          'o código até parar de dar erro.',
        exitCriteria: [
          'Reproduzo o defeito de forma consistente antes de corrigir',
          'Explico a causa, não só a correção',
        ],
      },
    },
    sources: [swebok('Software Construction'), cs2023('SDF'), sfia('PROG')],
  },
  {
    id: 'build-an-application',
    name: 'Construir uma aplicação completa',
    domain: 'construction',
    summary: 'Integrar as partes numa aplicação que funciona de ponta a ponta.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo: 'Sigo um tutorial até o fim e entrego uma aplicação pequena funcionando.',
        exitCriteria: ['A aplicação roda na máquina de outra pessoa'],
      },
      L2: {
        canDo:
          'Construo do zero uma aplicação com interface, dados e alguma regra de negócio, ' +
          'tomando eu mesmo as decisões de estrutura.',
        exitCriteria: [
          'A aplicação não é cópia de tutorial',
          'Explico por que separei os arquivos do jeito que separei',
          'Outra pessoa consegue rodar seguindo meu README',
        ],
      },
    },
    sources: [swebok('Software Construction'), cs2023('SE', 'Software Engineering'), sfia('PROG')],
  },

  // ----------------------------------------------------------------------- data
  {
    id: 'relational-data-modeling',
    name: 'Modelagem de dados relacional',
    domain: 'data',
    summary: 'Tabelas, chaves e relacionamentos que representam o problema sem duplicação.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo: 'Leio um modelo de tabelas e entendo como duas tabelas se relacionam.',
        exitCriteria: ['Identifico chave primária e chave estrangeira num esquema existente'],
      },
      L2: {
        canDo:
          'Modelo as tabelas de uma aplicação pequena escolhendo chaves e relacionamentos, ' +
          'sem repetir o mesmo dado em vários lugares.',
        exitCriteria: [
          'Justifico cada relacionamento um-para-muitos',
          'Meu modelo não guarda o mesmo dado em duas tabelas',
        ],
      },
    },
    sources: [cs2023('DM', 'Data Management'), sfia('DBDS')],
  },
  {
    id: 'sql-basics',
    name: 'SQL básico',
    domain: 'data',
    summary: 'Consultar e alterar dados com SELECT, JOIN, filtros e agregações.',
    stability: 'evergreen',
    technologies: ['sql'],
    levels: {
      L1: {
        canDo: 'Escrevo consultas com SELECT e WHERE para encontrar os dados que preciso.',
        exitCriteria: ['Filtro e ordeno resultados sem ajuda'],
      },
      L2: {
        canDo:
          'Combino tabelas com JOIN e resumo dados com agregações, e sei conferir se o ' +
          'resultado da consulta está certo.',
        exitCriteria: [
          'Escrevo um JOIN entre duas tabelas explicando o que ele retorna',
          'Uso GROUP BY corretamente com uma agregação',
        ],
      },
    },
    sources: [cs2023('DM', 'Data Management'), canonical('PostgreSQL — documentação oficial')],
  },

  // ----------------------------------------------------------------------- APIs
  {
    id: 'api-consumption',
    name: 'Consumo de API',
    domain: 'construction',
    summary: 'Chamar uma API HTTP, tratar a resposta e lidar com falha e carregamento.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo: 'Faço uma requisição a uma API e mostro o resultado na tela.',
        exitCriteria: ['Leio a documentação de um endpoint e monto a chamada'],
      },
      L2: {
        canDo:
          'Consumo uma API tratando os três estados: carregando, sucesso e erro, e a ' +
          'interface não quebra em nenhum deles.',
        exitCriteria: [
          'Minha tela mostra algo útil quando a requisição falha',
          'Não deixo o usuário sem resposta enquanto carrega',
          'Explico um erro de CORS: quem bloqueia e quem precisa liberar',
        ],
      },
    },
    sources: [cs2023('NC'), sfia('PROG')],
  },
  {
    id: 'api-development',
    name: 'Construção de API',
    domain: 'construction',
    summary: 'Expor endpoints HTTP com rotas, validação de entrada e status corretos.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo: 'Crio um endpoint que devolve dados em JSON seguindo um exemplo.',
        exitCriteria: [
          'Meu endpoint responde com o status adequado',
          'Uso consulta parametrizada: nunca concateno entrada do usuário no SQL',
        ],
      },
      L2: {
        canDo:
          'Construo um conjunto de endpoints com validação da entrada e códigos de status ' +
          'coerentes, e documento como usá-los.',
        exitCriteria: [
          'Rejeito entrada inválida com status e mensagem claros',
          'Outra pessoa integra com minha API só pela documentação',
        ],
      },
    },
    sources: [swebok('Software Design'), sfia('SWDN')],
  },
  {
    id: 'authentication-basics',
    name: 'Autenticação básica',
    domain: 'construction',
    summary: 'Login, sessão ou token, e armazenamento seguro de senha.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo:
          'Implemento login usando uma biblioteca consolidada e sei que senha se guarda com ' +
          'hash, nunca em texto puro.',
        exitCriteria: [
          'Não escrevo minha própria criptografia',
          'Explico a diferença entre autenticação e autorização',
        ],
      },
    },
    sources: [swebok('Software Security'), sfia('SCTY'), canonical('OWASP Top 10')],
  },

  // -------------------------------------------------------------------- quality
  {
    id: 'automated-testing-basics',
    name: 'Testes automatizados',
    domain: 'quality',
    summary: 'Escrever testes que falham quando o comportamento quebra.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo:
          'Escrevo testes para uma função, cobrindo o caso normal e pelo menos um caso de ' +
          'borda, e rodo a suíte sozinho.',
        exitCriteria: [
          'Meu teste falha quando eu quebro a função de propósito',
          'Explico a diferença entre teste de unidade e de integração',
        ],
      },
      L2: {
        canDo:
          'Decido o que vale testar numa aplicação e escrevo testes que continuam válidos ' +
          'depois de refatorar o código por dentro.',
        exitCriteria: ['Meus testes verificam comportamento, não detalhe de implementação'],
      },
    },
    sources: [swebok('Software Testing'), cs2023('SE'), sfia('TEST')],
  },
  {
    id: 'code-review-participation',
    name: 'Participação em code review',
    domain: 'quality',
    summary: 'Ler o diff de outra pessoa, comentar com utilidade e receber crítica.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo:
          'Leio o diff de um pull request, faço perguntas quando não entendo e aplico o ' +
          'feedback que recebo sem levar para o lado pessoal.',
        exitCriteria: [
          'Meu comentário aponta um problema concreto, não gosto pessoal',
          'Abro PR pequeno o suficiente para alguém revisar',
          'Leio a verificação automática do meu PR e corrijo antes de pedir revisão',
        ],
      },
    },
    sources: [swebok('Software Quality'), sfia('PROG')],
  },

  // ------------------------------------------------------------------- delivery
  {
    id: 'deployment-basics',
    name: 'Publicação da aplicação',
    domain: 'delivery',
    summary: 'Colocar a aplicação no ar, com configuração separada do código.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo:
          'Publico minha aplicação num serviço de hospedagem e mantenho segredos em variáveis ' +
          'de ambiente, fora do repositório.',
        exitCriteria: [
          'Minha aplicação tem uma URL que outra pessoa acessa',
          'Nenhuma senha ou chave está commitada',
        ],
      },
    },
    sources: [swebok('Software Engineering Operations'), sfia('DEPL')],
  },

  // --------------------------------------------------------------- professional
  {
    id: 'technical-communication',
    name: 'Comunicação técnica',
    domain: 'professional',
    summary: 'Explicar um problema, uma decisão ou um projeto por escrito, com clareza.',
    stability: 'evergreen',
    levels: {
      L1: {
        canDo: 'Peço ajuda descrevendo o que tentei, o que esperava e o que aconteceu.',
        exitCriteria: ['Minha pergunta pode ser respondida sem precisar de mais contexto'],
      },
      L2: {
        canDo:
          'Escrevo o README de um projeto meu e explico uma decisão técnica de forma que ' +
          'alguém de fora entenda por que escolhi aquilo.',
        exitCriteria: [
          'Meu README diz o que é, como rodar e por que existe',
          'Descrevo um projeto sem depender de jargão',
          'Apresento um projeto meu em poucos minutos: o problema, uma decisão e o resultado',
        ],
      },
    },
    // Comunicação aparece como deficiência dominante de recém-formados na literatura
    // de lacuna academia-indústria, por isso entra como core e não como "soft skill".
    sources: [
      swebok('Software Engineering Professional Practice'),
      cs2023('SEP', 'Society, Ethics, and the Profession'),
      canonical('Radermacher, Walia & Knudson, ICSE Companion 2014'),
    ],
  },

  // ----------------------------------------------------------------- ai-assisted
  {
    id: 'ai-assisted-development-basics',
    name: 'Desenvolvimento assistido por IA',
    domain: 'ai-assisted',
    summary: 'Usar assistente de código dando contexto e, principalmente, verificando a saída.',
    stability: 'volatile',
    levels: {
      L1: {
        canDo:
          'Uso um assistente de código fornecendo contexto do meu projeto e reviso o que ele ' +
          'gerou antes de aceitar, incluindo rodar o código.',
        exitCriteria: [
          'Identifico quando a sugestão não faz o que eu pedi',
          'Não entrego código gerado que eu não consiga explicar',
        ],
      },
    },
    // O pré-requisito de depuração não é arbitrário: quanto mais autonomia se dá ao
    // agente, maior precisa ser a capacidade de avaliar a saída.
    sources: [
      swebok('Software Engineering Professional Practice'),
      cs2023('SEP', 'uso responsável de ferramentas automatizadas'),
      sfia('PROG', 'revisar e verificar código gerado continua sendo programar'),
    ],
  },

  // ------------------------------------------------------------------- horizonte
  // Não são requisitos deste track. Existem no catálogo para poderem ser
  // explicitamente despriorizadas: dizer NOT NOW é parte do produto.
  {
    id: 'container-orchestration',
    name: 'Orquestração de contêineres',
    domain: 'horizon',
    summary: 'Kubernetes e afins resolvem operação em escala, problema que você ainda não tem.',
    stability: 'volatile',
    levels: {
      L0: { canDo: 'Sei o que é e para que serve.', exitCriteria: [] },
    },
    sources: [swebok('Software Engineering Operations'), sfia('DEPL')],
  },
  {
    id: 'microservices-architecture',
    name: 'Arquitetura de microsserviços',
    domain: 'horizon',
    summary: 'Faz sentido quando há times e escala suficientes para justificar o custo.',
    stability: 'evergreen',
    levels: {
      L0: { canDo: 'Sei o que é e que tipo de problema pretende resolver.', exitCriteria: [] },
    },
    sources: [swebok('Software Architecture'), sfia('ARCH')],
  },
  {
    id: 'message-queues',
    name: 'Filas e mensageria',
    domain: 'horizon',
    summary: 'Processamento assíncrono entre sistemas, relevante com volume e integrações.',
    stability: 'evergreen',
    levels: {
      L0: { canDo: 'Sei que existe processamento assíncrono entre sistemas.', exitCriteria: [] },
    },
    sources: [
      swebok('Software Architecture'),
      cs2023('PDC', 'Parallel and Distributed Computing'),
      sfia('ARCH'),
    ],
  },
  {
    id: 'advanced-system-design',
    name: 'System design avançado',
    domain: 'horizon',
    summary: 'Decisões de escala e trade-offs distribuídos; assunto de entrevista sênior.',
    stability: 'evergreen',
    levels: {
      L0: { canDo: 'Reconheço os termos quando aparecem numa conversa.', exitCriteria: [] },
    },
    sources: [swebok('Software Architecture'), sfia('ARCH')],
  },
  {
    id: 'infrastructure-as-code',
    name: 'Infraestrutura como código',
    domain: 'horizon',
    summary: 'Provisionar ambiente de forma declarativa; necessário quando há ambiente a gerir.',
    stability: 'volatile',
    levels: {
      L0: { canDo: 'Sei que infraestrutura pode ser descrita em arquivos versionados.', exitCriteria: [] },
    },
    sources: [swebok('Software Engineering Operations'), sfia('CFMG')],
  },
];
