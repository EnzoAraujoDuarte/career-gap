import type { CareerTrack, Criticality, Level, TrackRequirement } from '@/domain/model';
import { canonical, cs2023, sfia, swebok } from './sources';

/** Atalho de autoria: proveniência do requisito é herdada da competência mais a fonte
 *  que sustenta ESTE nível-alvo para ESTE objetivo. */
const requirement = (
  competency: string,
  targetLevel: Level,
  criticality: Criticality,
  sources: TrackRequirement['sources'],
): TrackRequirement => ({ competency, targetLevel, criticality, sources });

/** SFIA 9 nível 2 "Assist" / nível 3 "Apply" descrevem quem executa tarefas rotineiras sob
 *  supervisão — o patamar esperado de quem está entrando. É a âncora dos alvos abaixo. */
const entryLevelBar = sfia('PROG', 'alvo ancorado em SFIA 9 níveis 2-3 (Assist/Apply)');

export const FIRST_WEB_ROLE: CareerTrack = {
  id: 'first-web-role',
  ecosystem: 'web',
  name: 'Primeira vaga em desenvolvimento web',
  description:
    'Estudantes e iniciantes preparando-se para estágio ou primeira vaga como pessoa ' +
    'desenvolvedora web.',
  requirements: [
    requirement('programming-fundamentals', 'L2', 'core', [cs2023('SDF'), entryLevelBar]),
    requirement('problem-decomposition', 'L2', 'core', [cs2023('SDF'), entryLevelBar]),
    requirement('algorithms-and-complexity', 'L1', 'supporting', [cs2023('AL'), sfia('PROG')]),

    requirement('html-semantics', 'L2', 'core', [canonical('MDN'), entryLevelBar]),
    requirement('css-layout', 'L2', 'core', [canonical('MDN'), entryLevelBar]),
    requirement('javascript-essentials', 'L2', 'core', [cs2023('FPL'), entryLevelBar]),
    requirement('dom-and-browser', 'L1', 'core', [canonical('MDN'), sfia('PROG')]),
    requirement('http-fundamentals', 'L2', 'core', [cs2023('NC'), canonical('RFC 9110')]),
    requirement('web-accessibility-basics', 'L1', 'supporting', [
      canonical('WCAG 2.2 AA'),
      cs2023('HCI'),
    ]),

    requirement('command-line-basics', 'L1', 'supporting', [cs2023('OS'), sfia('PROG')]),
    requirement('version-control-git', 'L2', 'core', [
      swebok('Software Configuration Management'),
      sfia('CFMG'),
    ]),
    requirement('reading-documentation', 'L2', 'core', [
      swebok('Software Engineering Professional Practice'),
      sfia('PROG'),
    ]),
    requirement('code-readability', 'L1', 'core', [swebok('Software Construction'), sfia('PROG')]),
    requirement('debugging', 'L2', 'core', [swebok('Software Construction'), entryLevelBar]),
    requirement('build-an-application', 'L2', 'core', [
      swebok('Software Construction'),
      cs2023('SE'),
      entryLevelBar,
    ]),

    requirement('relational-data-modeling', 'L1', 'supporting', [cs2023('DM'), sfia('DBDS')]),
    requirement('sql-basics', 'L1', 'supporting', [cs2023('DM'), sfia('DBDS')]),

    requirement('api-consumption', 'L2', 'core', [cs2023('NC'), sfia('PROG')]),
    requirement('api-development', 'L1', 'supporting', [swebok('Software Design'), sfia('SWDN')]),
    requirement('authentication-basics', 'L1', 'optional', [
      swebok('Software Security'),
      sfia('SCTY'),
    ]),

    requirement('automated-testing-basics', 'L1', 'core', [swebok('Software Testing'), sfia('TEST')]),
    requirement('code-review-participation', 'L1', 'supporting', [
      swebok('Software Quality'),
      sfia('PROG'),
    ]),

    requirement('deployment-basics', 'L1', 'supporting', [
      swebok('Software Engineering Operations'),
      sfia('DEPL'),
    ]),

    requirement('technical-communication', 'L2', 'core', [
      swebok('Software Engineering Professional Practice'),
      canonical('Radermacher, Walia & Knudson, ICSE Companion 2014'),
    ]),
    requirement('ai-assisted-development-basics', 'L1', 'supporting', [
      swebok('Software Engineering Professional Practice'),
      cs2023('SEP'),
      sfia('PROG'),
    ]),
  ],

  // Ênfases ajustam peso e alvo sobre o MESMO catálogo. Nenhuma delas adiciona ou remove
  // competência: é o que impede o track único de virar quatro catálogos disfarçados.
  emphases: [
    {
      id: 'frontend',
      name: 'Ênfase em Frontend',
      description: 'Prioriza interface, navegador e consumo de API; dados e servidor recuam.',
      adjustments: [
        { competency: 'dom-and-browser', targetLevel: 'L2', criticality: 'core' },
        { competency: 'web-accessibility-basics', criticality: 'core' },
        { competency: 'relational-data-modeling', criticality: 'optional' },
        { competency: 'sql-basics', criticality: 'optional' },
        { competency: 'api-development', criticality: 'optional' },
      ],
    },
    {
      id: 'backend',
      name: 'Ênfase em Backend',
      description: 'Prioriza API, dados e autenticação; interface recua para o suficiente.',
      adjustments: [
        { competency: 'api-development', targetLevel: 'L2', criticality: 'core' },
        { competency: 'sql-basics', targetLevel: 'L2', criticality: 'core' },
        { competency: 'relational-data-modeling', targetLevel: 'L2', criticality: 'core' },
        { competency: 'authentication-basics', criticality: 'supporting' },
        { competency: 'css-layout', targetLevel: 'L1', criticality: 'supporting' },
        { competency: 'dom-and-browser', criticality: 'supporting' },
        { competency: 'web-accessibility-basics', criticality: 'optional' },
      ],
    },
  ],
  path: [
    {
      id: 'fundamentals',
      title: 'Fundamentos',
      summary:
        'Programar, quebrar um problema em passos e entender as peças que toda aplicação web ' +
        'usa: HTML, HTTP, terminal e Git. Tudo o que vem depois apoia aqui.',
      outcomes: [
        'Escrever programas pequenos e dividir um problema em passos verificáveis',
        'Estruturar uma página com HTML e entender o que acontece numa requisição HTTP',
        'Usar o terminal e o Git no dia a dia',
        'Achar a resposta na documentação oficial',
      ],
      competencies: [
        'programming-fundamentals',
        'problem-decomposition',
        'html-semantics',
        'http-fundamentals',
        'command-line-basics',
        'version-control-git',
        'reading-documentation',
      ],
    },
    {
      id: 'browser',
      title: 'A web no navegador',
      summary:
        'A linguagem da plataforma e o que dá para fazer com ela na página. Aqui também entra ' +
        'achar defeito com método, que é o que separa quem programa de quem tenta.',
      outcomes: [
        'Programar em JavaScript e alterar a página pelo DOM',
        'Montar layouts responsivos com CSS',
        'Achar a causa de um defeito em vez de tentar no escuro',
        'Escrever código que outra pessoa entende e páginas que todos conseguem usar',
      ],
      competencies: [
        'javascript-essentials',
        'css-layout',
        'dom-and-browser',
        'debugging',
        'code-readability',
        'web-accessibility-basics',
      ],
    },
    {
      id: 'build-and-ship',
      title: 'Construir e publicar',
      summary:
        'Dados, APIs e o projeto inteiro de ponta a ponta, no ar. É o nível que vira portfólio.',
      outcomes: [
        'Modelar e consultar dados com SQL',
        'Consumir e construir APIs HTTP',
        'Juntar tudo numa aplicação completa e colocá-la no ar',
      ],
      competencies: [
        'sql-basics',
        'relational-data-modeling',
        'api-consumption',
        'api-development',
        'build-an-application',
        'authentication-basics',
        'deployment-basics',
      ],
    },
    {
      id: 'job-ready',
      title: 'Pronto para a primeira vaga',
      summary:
        'O que o time espera de quem entra: código testado, revisão, escrita clara, a ' +
        'entrevista técnica e IA usada com verificação.',
      outcomes: [
        'Escrever testes que falham quando o comportamento quebra',
        'Revisar código e ter o seu revisado',
        'Explicar por escrito um problema ou uma decisão',
        'Usar assistente de IA verificando o que ele entrega',
      ],
      competencies: [
        'automated-testing-basics',
        'code-review-participation',
        'technical-communication',
        'algorithms-and-complexity',
        'ai-assisted-development-basics',
      ],
    },
  ],
  // Seis temas em vez de 25 telas. Cada frase lista o que ela afirma; a frase menor afirma
  // menos de propósito — "seguindo um tutorial" não diz nada sobre depurar, então depuração
  // só entra na frase de quem programa sozinho. Ficam sem pergunta algoritmos, autenticação e
  // IA: começam em "ainda não" e a pessoa ajusta na página da competência.
  quickAssessment: [
    {
      id: 'programming',
      title: 'Programar',
      summary: 'Lógica, funções, quebrar um problema em partes, achar erros.',
      statements: [
        {
          level: 'L1',
          canDo: 'Escrevo funções com condicionais e repetição seguindo um exemplo parecido.',
          competencies: ['programming-fundamentals'],
        },
        {
          level: 'L2',
          canDo:
            'Escrevo do zero um programa que outra pessoa entende, quebro o problema em partes e acho a causa de um erro testando hipóteses.',
          competencies: [
            'programming-fundamentals',
            'problem-decomposition',
            'debugging',
            'code-readability',
          ],
        },
      ],
    },
    {
      id: 'web-pages',
      title: 'Páginas com HTML e CSS',
      summary: 'Estrutura, layout e uma página que todos conseguem usar.',
      statements: [
        {
          level: 'L1',
          canDo: 'Monto uma página com HTML e CSS adaptando um exemplo.',
          competencies: ['html-semantics', 'css-layout'],
        },
        {
          level: 'L2',
          canDo:
            'Monto do zero uma página responsiva, com as tags certas, que dá para usar só com o teclado.',
          competencies: ['html-semantics', 'css-layout', 'web-accessibility-basics'],
        },
      ],
    },
    {
      id: 'javascript',
      title: 'JavaScript no navegador',
      summary: 'A linguagem da web, a página reagindo e dados vindos de uma API.',
      statements: [
        {
          level: 'L1',
          canDo: 'Faço a página reagir a um clique com JavaScript, seguindo um tutorial.',
          competencies: ['javascript-essentials', 'dom-and-browser'],
        },
        {
          level: 'L2',
          canDo:
            'Busco dados de uma API com fetch e mostro na página, tratando o carregamento e o erro.',
          competencies: ['javascript-essentials', 'dom-and-browser', 'api-consumption'],
        },
      ],
    },
    {
      id: 'tools',
      title: 'Terminal, Git e documentação',
      summary: 'As ferramentas do dia a dia e o trabalho no mesmo repositório.',
      statements: [
        {
          level: 'L1',
          canDo: 'Rodo comandos no terminal e faço commit e push seguindo um passo a passo.',
          competencies: ['command-line-basics', 'version-control-git'],
        },
        {
          level: 'L2',
          canDo:
            'Trabalho com branches, resolvo conflito, abro pull request, respondo à revisão e tiro dúvidas na documentação oficial.',
          competencies: [
            'command-line-basics',
            'version-control-git',
            'code-review-participation',
            'reading-documentation',
          ],
        },
      ],
    },
    {
      id: 'backend',
      title: 'Servidor e dados',
      summary: 'HTTP, banco de dados e a sua própria API.',
      statements: [
        {
          level: 'L1',
          canDo:
            'Explico o que acontece numa requisição HTTP (método, status) e escrevo um SELECT simples.',
          competencies: ['http-fundamentals', 'sql-basics'],
        },
        {
          level: 'L2',
          canDo: 'Crio uma API com rotas e validação que grava num banco que eu mesmo modelei.',
          competencies: [
            'http-fundamentals',
            'sql-basics',
            'relational-data-modeling',
            'api-development',
          ],
        },
      ],
    },
    {
      id: 'project',
      title: 'Projeto de ponta a ponta',
      summary: 'Juntar as partes, colocar no ar, testar e explicar.',
      statements: [
        {
          level: 'L1',
          canDo: 'Já fiz um projeto seguindo um curso e coloquei no ar com um passo a passo.',
          competencies: ['build-an-application', 'deployment-basics'],
        },
        {
          level: 'L2',
          canDo:
            'Já fiz sozinho um projeto completo e publicado, com testes automatizados e um README que explica as decisões.',
          competencies: [
            'build-an-application',
            'deployment-basics',
            'automated-testing-basics',
            'technical-communication',
          ],
        },
      ],
    },
  ],
};

export const TRACKS: readonly CareerTrack[] = [FIRST_WEB_ROLE];
