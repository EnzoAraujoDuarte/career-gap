import type { ProfessionalHabit } from '@/domain/model';
import {
  canonical,
  cs2023,
  extremeProgramming,
  pragmaticProgrammer,
  sfia,
  swebok,
} from './sources';

/**
 * Hábitos profissionais ligados às competências.
 *
 * Três tradições, escolhidas porque se reforçam: O Programador Pragmático e XP descrevem
 * como profissionais trabalham; a IA como tutora é a forma de usar IA que, no único ensaio
 * randomizado disponível, não prejudicou o aprendizado.
 *
 * Regras de autoria:
 *  - o texto é paráfrase própria; da obra só se cita o título curto da dica ou da prática;
 *  - duas classes de fonte, como toda afirmação do catálogo (validate.ts verifica);
 *  - no máximo três hábitos por competência — mais que isso é lista de regras, não hábito.
 */

/** Único ensaio randomizado sobre IA e formação de habilidade em programação (preprint). */
const shenTamkin = (note: string) =>
  canonical(
    'Shen e Tamkin, How AI assistance impacts the formation of coding skills, arXiv:2601.20245, 2026',
    note,
  );

export const HABITS: readonly ProfessionalHabit[] = [
  // ------------------------------------------------------------ desde o começo
  {
    id: 'ai-as-tutor',
    title: 'Use a IA como tutora, não como autora',
    detail:
      'Peça explicação, exemplo e exercício novo. Não peça a solução do exercício que você ' +
      'está tentando resolver: no ensaio, quem pediu explicação aprendeu; quem delegou, não.',
    tradition: 'ai-tutor',
    theme: 'learn',
    credit: 'Shen e Tamkin (2026), ensaio randomizado',
    competencies: ['programming-fundamentals', 'problem-decomposition'],
    sources: [
      shenTamkin('pedir explicação preservou o aprendizado; delegar o código, não'),
      cs2023('SEP', 'uso responsável de ferramentas automatizadas'),
    ],
  },
  {
    id: 'no-programming-by-coincidence',
    title: 'Não programe por coincidência',
    detail: 'Se funcionou e você não sabe por quê, ainda não terminou. Descubra o motivo antes de seguir.',
    tradition: 'pragmatic-programmer',
    theme: 'verify',
    credit: 'O Programador Pragmático, dica 44',
    competencies: ['programming-fundamentals'],
    sources: [pragmaticProgrammer(44, 'Não programe por coincidência'), cs2023('SDF')],
  },
  {
    id: 'no-code-you-do-not-understand',
    title: 'Não use código gerado que você não entende',
    detail:
      'A dica é de 1999 e falava dos geradores de código das IDEs; com IA vale do mesmo ' +
      'jeito. Se não consegue explicar, não entrega.',
    tradition: 'pragmatic-programmer',
    theme: 'verify',
    credit: 'O Programador Pragmático, dica 50',
    competencies: ['programming-fundamentals', 'ai-assisted-development-basics'],
    sources: [
      pragmaticProgrammer(50, 'Não use um código de assistente que você não entender'),
      cs2023('SEP', 'uso responsável de ferramentas automatizadas'),
    ],
  },
  {
    id: 'small-releases',
    title: 'Avance em pedaços pequenos que funcionam',
    detail:
      'Cada passo termina em algo que roda e pode ser conferido. Um pedaço pequeno errado ' +
      'custa minutos; um grande custa dias.',
    tradition: 'extreme-programming',
    theme: 'deliver',
    credit: 'XP, prática "pequenas versões"',
    competencies: ['problem-decomposition', 'build-an-application'],
    sources: [
      extremeProgramming('pequenas versões (small releases)'),
      swebok('Software Construction', 'construção incremental'),
    ],
  },

  // ------------------------------------------------------------------ depuração
  {
    id: 'dont-panic',
    title: 'Não entre em pânico: leia o erro inteiro',
    detail:
      'Antes de mudar qualquer linha, leia a mensagem até o fim. E suspeite primeiro do seu ' +
      'código — a biblioteca raramente é a culpada.',
    tradition: 'pragmatic-programmer',
    theme: 'verify',
    credit: 'O Programador Pragmático, dicas 25 e 26',
    competencies: ['debugging', 'http-fundamentals'],
    sources: [
      pragmaticProgrammer(25, 'Não entre em pânico'),
      pragmaticProgrammer(26, '"select" não está com defeito'),
      swebok('Software Construction', 'depuração'),
    ],
  },
  {
    id: 'prove-it',
    title: 'Não suponha: reproduza antes de corrigir',
    detail:
      'Faça o defeito acontecer de propósito, de preferência num teste. Assim ele só precisa ' +
      'ser encontrado uma vez.',
    tradition: 'pragmatic-programmer',
    theme: 'verify',
    credit: 'O Programador Pragmático, dicas 27 e 66',
    competencies: ['debugging', 'automated-testing-basics', 'http-fundamentals'],
    sources: [
      pragmaticProgrammer(27, 'Não suponha – teste'),
      pragmaticProgrammer(66, 'Encontre os erros apenas uma vez'),
      swebok('Software Testing'),
    ],
  },
  {
    id: 'ai-explains-you-fix',
    title: 'Na depuração, a IA explica e você corrige',
    detail:
      'Peça à IA o que o erro significa; a correção é sua. No ensaio da Anthropic, a maior ' +
      'perda de aprendizado foi justamente em depuração.',
    tradition: 'ai-tutor',
    theme: 'verify',
    credit: 'Shen e Tamkin (2026), ensaio randomizado',
    competencies: ['debugging'],
    sources: [
      shenTamkin('maior diferença entre os grupos nas questões de depuração'),
      swebok('Software Engineering Professional Practice'),
    ],
  },

  // --------------------------------------------------------- testes e legibilidade
  {
    id: 'test-first-when-unclear',
    title: 'Quando não está claro, escreva o teste primeiro',
    detail:
      'Se você não sabe exatamente o que a função deve fazer, o teste é o jeito de decidir — ' +
      'antes de escrever a função.',
    tradition: 'extreme-programming',
    theme: 'craft',
    credit: 'XP, prática "testes"',
    competencies: ['automated-testing-basics'],
    sources: [extremeProgramming('testes (testing)'), swebok('Software Testing'), sfia('TEST')],
  },
  {
    id: 'no-broken-windows',
    title: 'Não tolere janelas quebradas',
    detail:
      'Nome ruim, teste quebrado, aviso ignorado: conserte assim que perceber. Um defeito ' +
      'tolerado vira licença para o próximo.',
    tradition: 'pragmatic-programmer',
    theme: 'craft',
    credit: 'O Programador Pragmático, dica 4',
    competencies: ['code-readability', 'automated-testing-basics'],
    sources: [pragmaticProgrammer(4, 'Não tolere janelas quebradas'), swebok('Software Quality')],
  },
  {
    id: 'dont-repeat-yourself',
    title: 'Não se repita',
    detail:
      'Cada regra do programa mora num lugar só. Código duplicado são duas coisas para ' +
      'lembrar de mudar — e uma delas você vai esquecer.',
    tradition: 'pragmatic-programmer',
    theme: 'craft',
    credit: 'O Programador Pragmático, dica 11',
    competencies: ['code-readability'],
    sources: [
      pragmaticProgrammer(11, 'NSR – Não se repita'),
      swebok('Software Construction', 'redução de complexidade'),
    ],
  },
  {
    id: 'refactor-early',
    title: 'Refatore cedo, refatore sempre',
    detail:
      'Melhore nomes e simplifique enquanto o código ainda é pequeno e os testes ainda passam. ' +
      'Depois fica caro.',
    tradition: 'pragmatic-programmer',
    theme: 'craft',
    credit: 'O Programador Pragmático, dica 47; XP',
    competencies: ['code-readability'],
    sources: [
      pragmaticProgrammer(47, 'Refatore cedo, refatore sempre'),
      extremeProgramming('refatoração (refactoring)'),
      swebok('Software Construction'),
    ],
  },

  // ----------------------------------------------------------- construir e entregar
  {
    id: 'simple-design',
    title: 'Faça o mais simples que resolve',
    detail:
      'Resolva o problema de hoje. Complexidade para um futuro imaginado é custo certo por ' +
      'benefício incerto.',
    tradition: 'extreme-programming',
    theme: 'craft',
    credit: 'XP, prática "projeto simples"',
    competencies: ['build-an-application'],
    sources: [extremeProgramming('projeto simples (simple design)'), swebok('Software Design')],
  },
  {
    id: 'always-version-control',
    title: 'Use controle de versão sempre',
    detail:
      'Até no exercício de fim de semana. O histórico é o que deixa você errar sem medo e ' +
      'voltar atrás.',
    tradition: 'pragmatic-programmer',
    theme: 'deliver',
    credit: 'O Programador Pragmático, dica 23',
    competencies: ['version-control-git'],
    sources: [
      pragmaticProgrammer(23, 'Use sempre o controle do código-fonte'),
      swebok('Software Configuration Management'),
      sfia('CFMG'),
    ],
  },
  {
    id: 'integrate-often',
    title: 'Integre com frequência',
    detail:
      'Commits pequenos e frequentes, cada um deixando o projeto funcionando. Juntar uma ' +
      'semana de trabalho de uma vez transforma conflito em projeto.',
    tradition: 'extreme-programming',
    theme: 'deliver',
    credit: 'XP, prática "integração contínua"',
    competencies: ['version-control-git'],
    sources: [
      extremeProgramming('integração contínua (continuous integration)'),
      swebok('Software Configuration Management'),
    ],
  },

  // ---------------------------------------------------------- aprender e comunicar
  {
    id: 'read-critically',
    title: 'Leia com desconfiança',
    detail:
      'Pergunte de onde veio, para qual versão vale e quem ganha com aquilo. Vale para ' +
      'tutorial, fórum e resposta de IA.',
    tradition: 'pragmatic-programmer',
    theme: 'learn',
    credit: 'O Programador Pragmático, dica 9',
    competencies: ['reading-documentation', 'ai-assisted-development-basics'],
    sources: [pragmaticProgrammer(9, 'Analise criticamente o que você lê e ouve'), cs2023('SEP')],
  },
  {
    id: 'knowledge-portfolio',
    title: 'Invista no seu conhecimento com regularidade',
    detail: 'Um pouco todo dia, em áreas diferentes, como quem investe. Constância rende mais que maratona.',
    tradition: 'pragmatic-programmer',
    theme: 'learn',
    credit: 'O Programador Pragmático, dica 8',
    competencies: ['reading-documentation'],
    sources: [
      pragmaticProgrammer(8, 'Invista regularmente em sua carteira de conhecimentos'),
      swebok('Software Engineering Professional Practice'),
    ],
  },
  {
    id: 'shell-power',
    title: 'Use o poder do terminal',
    detail: 'O que você repete clicando, o terminal faz numa linha — e a linha pode virar script.',
    tradition: 'pragmatic-programmer',
    theme: 'craft',
    credit: 'O Programador Pragmático, dica 21',
    competencies: ['command-line-basics'],
    sources: [pragmaticProgrammer(21, 'Use o poder dos shells de comando'), cs2023('OS')],
  },
  {
    id: 'pair-programming',
    title: 'Programe em par',
    detail:
      'Um escreve, o outro acompanha o todo e pergunta; trocam com frequência. É revisão de ' +
      'código acontecendo enquanto o código nasce.',
    tradition: 'extreme-programming',
    theme: 'collaborate',
    credit: 'XP, prática "programação em pares"',
    competencies: ['code-review-participation'],
    sources: [extremeProgramming('programação em pares (pair programming)'), swebok('Software Quality')],
  },
  {
    id: 'fix-the-problem-not-the-blame',
    title: 'Corrija o problema, esqueça o culpado',
    detail: 'Na revisão, o assunto é o código, não quem o escreveu. Comentário que acusa não conserta nada.',
    tradition: 'pragmatic-programmer',
    theme: 'collaborate',
    credit: 'O Programador Pragmático, dica 24',
    competencies: ['code-review-participation'],
    sources: [
      pragmaticProgrammer(24, 'Corrija o problema, esqueça o culpado'),
      swebok('Software Quality'),
    ],
  },
  {
    id: 'say-it-well',
    title: 'Importa o que você diz e como diz',
    detail:
      'Saiba o que quer dizer, para quem e em que formato essa pessoa lê. Ideia boa mal ' +
      'comunicada não chega a existir.',
    tradition: 'pragmatic-programmer',
    theme: 'collaborate',
    credit: 'O Programador Pragmático, dica 10',
    competencies: ['technical-communication'],
    sources: [
      pragmaticProgrammer(10, 'É o que você diz e a maneira como diz'),
      swebok('Software Engineering Professional Practice'),
    ],
  },

  // ------------------------------------------------------------- postura geral
  // Sem competência: não cabem numa ficha de nó, valem para o percurso inteiro. Aparecem no
  // espaço comportamental.
  {
    id: 'care-about-your-craft',
    title: 'Preocupe-se com o que você entrega',
    detail:
      'Se não vale o seu cuidado, não vale o seu tempo. Cuidado aparece em detalhe: nome de ' +
      'variável, mensagem de erro, README.',
    tradition: 'pragmatic-programmer',
    theme: 'attitude',
    credit: 'O Programador Pragmático, dica 1',
    competencies: [],
    sources: [
      pragmaticProgrammer(1, 'Preocupe-se com seu trabalho'),
      swebok('Software Engineering Professional Practice'),
    ],
  },
  {
    id: 'think-about-your-work',
    title: 'Pense sobre o que está fazendo',
    detail:
      'No piloto automático não se aprende. De vez em quando, pare e pergunte: por que fiz ' +
      'assim? Faria igual de novo?',
    tradition: 'pragmatic-programmer',
    theme: 'attitude',
    credit: 'O Programador Pragmático, dica 2',
    competencies: [],
    sources: [
      pragmaticProgrammer(2, 'Reflita sobre seu trabalho'),
      swebok('Software Engineering Professional Practice'),
    ],
  },
  {
    id: 'provide-options',
    title: 'Traga opções, não desculpas',
    detail:
      'Quando algo dá errado, chegue com o que dá para fazer agora — não com o motivo de não ' +
      'ter dado.',
    tradition: 'pragmatic-programmer',
    theme: 'collaborate',
    credit: 'O Programador Pragmático, dica 3',
    competencies: [],
    sources: [
      pragmaticProgrammer(3, 'Forneça opções, não dê desculpas esfarrapadas'),
      swebok('Software Engineering Professional Practice'),
    ],
  },
  {
    id: 'sign-your-work',
    title: 'Assine o seu trabalho',
    detail:
      'Trate o que você entrega como algo que leva o seu nome — porque leva. O orgulho do ' +
      'trabalho puxa a qualidade junto.',
    tradition: 'pragmatic-programmer',
    theme: 'attitude',
    credit: 'O Programador Pragmático, dica 70',
    competencies: [],
    sources: [
      pragmaticProgrammer(70, 'Assine seu trabalho'),
      swebok('Software Engineering Professional Practice'),
    ],
  },
  {
    id: 'ask-for-feedback-early',
    title: 'Mostre cedo, peça retorno cedo',
    detail:
      'Retorno no primeiro dia corrige o rumo; no último, só aponta o estrago. Mostre o ' +
      'rascunho, não só a versão pronta.',
    tradition: 'extreme-programming',
    theme: 'collaborate',
    credit: 'XP, valor "feedback"',
    competencies: [],
    sources: [
      extremeProgramming('feedback', 'valor'),
      swebok('Software Engineering Professional Practice'),
    ],
  },
  {
    id: 'courage-to-start-over',
    title: 'Tenha coragem de recomeçar',
    detail:
      'Jogar fora um código que não ficou bom e refazer melhor é avanço, não desperdício. O ' +
      'mesmo vale para avisar cedo que algo não vai dar certo.',
    tradition: 'extreme-programming',
    theme: 'attitude',
    credit: 'XP, valor "coragem"',
    competencies: [],
    sources: [
      extremeProgramming('coragem (courage)', 'valor'),
      swebok('Software Engineering Professional Practice'),
    ],
  },
];
