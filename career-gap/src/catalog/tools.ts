import type { Tool } from '@/domain/model';

/**
 * Kit — as ferramentas do dev de 2026, cada uma destravada por competência.
 *
 * O diferencial em relação a uma lista de ferramentas não é a lista: é o portão. O roadmap.sh
 * tem um roadmap de Claude Code com MCP, plugins e hooks, igual para todos. Aqui a ferramenta
 * aparece quando a pessoa já tem a base para usá-la sem virar muleta, e o motivo é dito.
 *
 * Os portões das ferramentas de IA repetem as arestas da competência
 * `ai-assisted-development-basics` (fundamentos e depuração): a ferramenta não pode chegar
 * antes da competência que a torna segura.
 *
 * Todas as URLs responderam HTTP 200 em 2026-10-15; documentação em português conferida no
 * corpo da página.
 */
const VERIFIED = '2026-10-15';

export const TOOLS: readonly Tool[] = [
  // ----------------------------------------------------------- desde o começo
  {
    id: 'vscode',
    name: 'VS Code',
    category: 'editor',
    use: 'Editor de código onde você vai passar a maior parte do tempo.',
    why:
      'Gratuito, leve e com interface em português. Aprender bem um editor só rende mais do ' +
      'que pular entre vários (O Programador Pragmático, dica 22).',
    url: 'https://code.visualstudio.com/docs',
    cost: 'free',
    ptBrStatus: 'none',
    stability: 'evergreen',
    unlockedBy: [],
    verifiedAt: VERIFIED,
  },
  {
    id: 'git',
    name: 'Git',
    category: 'version-control',
    use: 'Guarda o histórico do seu código e deixa você voltar atrás.',
    why:
      'Desde o primeiro exercício: o histórico é o que deixa errar sem medo. O livro oficial ' +
      'tem tradução completa em português.',
    url: 'https://git-scm.com/book/pt-br/v2',
    cost: 'free',
    ptBrStatus: 'complete',
    stability: 'evergreen',
    unlockedBy: [],
    verifiedAt: VERIFIED,
  },

  // --------------------------------------------------------------- plataforma web
  {
    id: 'browser-devtools',
    name: 'DevTools do navegador',
    category: 'browser',
    use: 'Inspeciona HTML, CSS, rede e JavaScript da página que está aberta.',
    why: 'Assim que você escreve a primeira página, é por aqui que você enxerga o que o navegador fez com ela.',
    url: 'https://developer.chrome.com/docs/devtools?hl=pt-br',
    cost: 'free',
    ptBrStatus: 'complete',
    stability: 'evergreen',
    unlockedBy: [{ competency: 'html-semantics', atLevel: 'L1' }],
    verifiedAt: VERIFIED,
  },
  {
    id: 'curl',
    name: 'curl',
    category: 'http',
    use: 'Faz requisições HTTP direto do terminal e mostra a resposta crua.',
    why:
      'Depois que você entende o que é status e corpo, o curl tira o navegador do caminho e ' +
      'mostra a conversa como ela é.',
    url: 'https://curl.se/docs/manual.html',
    cost: 'free',
    ptBrStatus: 'none',
    stability: 'evergreen',
    unlockedBy: [{ competency: 'http-fundamentals', atLevel: 'L1' }],
    verifiedAt: VERIFIED,
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'version-control',
    use: 'Guarda seus repositórios na nuvem; é onde ficam portfólio, pull requests e revisão.',
    why:
      'Faz sentido quando o Git local já está claro: o GitHub acrescenta colaboração, não ' +
      'substitui entender commit e histórico.',
    url: 'https://docs.github.com/pt/get-started',
    cost: 'free',
    ptBrStatus: 'complete',
    stability: 'evergreen',
    unlockedBy: [{ competency: 'version-control-git', atLevel: 'L1' }],
    verifiedAt: VERIFIED,
  },

  // ------------------------------------------------------------------ qualidade
  {
    id: 'prettier',
    name: 'Prettier',
    category: 'quality',
    use: 'Formata o código automaticamente, sempre do mesmo jeito.',
    why:
      'Tira a formatação da discussão e do seu esforço. Entra junto com o JavaScript, antes de ' +
      'você se acostumar a formatar na mão.',
    url: 'https://prettier.io/docs/',
    cost: 'free',
    ptBrStatus: 'none',
    stability: 'evergreen',
    unlockedBy: [{ competency: 'javascript-essentials', atLevel: 'L1' }],
    verifiedAt: VERIFIED,
  },
  {
    id: 'eslint',
    name: 'ESLint',
    category: 'quality',
    use: 'Aponta erros e práticas arriscadas no JavaScript antes de rodar.',
    why:
      'Funciona como um revisor incansável — mas só ajuda quem já sabe ler o aviso e decidir ' +
      'se ele procede.',
    url: 'https://eslint.org/docs/latest/',
    cost: 'free',
    ptBrStatus: 'none',
    stability: 'evergreen',
    unlockedBy: [
      { competency: 'javascript-essentials', atLevel: 'L1' },
      { competency: 'code-readability', atLevel: 'L1' },
    ],
    verifiedAt: VERIFIED,
  },
  {
    id: 'husky',
    name: 'Husky (hook de pre-commit)',
    category: 'quality',
    use: 'Roda testes e verificações automaticamente antes de cada commit.',
    why:
      'Transforma "não tolere janelas quebradas" em regra que a máquina cumpre. Pressupõe ter ' +
      'testes para rodar e commits para proteger.',
    url: 'https://typicode.github.io/husky/',
    cost: 'free',
    ptBrStatus: 'none',
    stability: 'evergreen',
    unlockedBy: [
      { competency: 'automated-testing-basics', atLevel: 'L1' },
      { competency: 'version-control-git', atLevel: 'L1' },
    ],
    verifiedAt: VERIFIED,
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    category: 'delivery',
    use: 'Roda seus testes a cada push e pode publicar a aplicação automaticamente.',
    why:
      'Integração contínua de verdade: o projeto é verificado em outra máquina, não só na sua. ' +
      'Exige testes e um fluxo de Git já firme.',
    url: 'https://docs.github.com/pt/actions',
    cost: 'free',
    costNote: 'gratuito para repositórios públicos',
    ptBrStatus: 'complete',
    stability: 'evergreen',
    unlockedBy: [
      { competency: 'automated-testing-basics', atLevel: 'L1' },
      { competency: 'version-control-git', atLevel: 'L2' },
    ],
    verifiedAt: VERIFIED,
  },

  // ------------------------------------------------------------------------- IA
  {
    id: 'ai-code-assistant',
    name: 'Assistente de código no editor',
    category: 'ai',
    use: 'Sugere e completa código dentro do editor — o GitHub Copilot é o exemplo com documentação em português.',
    why:
      'Só depois de fundamentos e depuração: quem ainda não depura não consegue verificar o que ' +
      'a IA gera, e foi justamente em depuração que o ensaio da Anthropic mediu a maior perda.',
    url: 'https://docs.github.com/pt/copilot',
    cost: 'free',
    costNote: 'plano gratuito com limite de uso; planos pagos à parte',
    ptBrStatus: 'complete',
    stability: 'volatile',
    unlockedBy: [
      { competency: 'programming-fundamentals', atLevel: 'L1' },
      { competency: 'debugging', atLevel: 'L1' },
    ],
    verifiedAt: VERIFIED,
  },
  {
    id: 'context7',
    name: 'Context7 (servidor MCP)',
    category: 'ai',
    use: 'Entrega ao assistente de IA a documentação atual da biblioteca que você está usando.',
    why:
      'Corta a resposta baseada em versão velha. Faz sentido para quem já prefere a documentação ' +
      'oficial e já usa assistente com critério.',
    url: 'https://github.com/upstash/context7',
    cost: 'free',
    ptBrStatus: 'none',
    stability: 'volatile',
    unlockedBy: [
      { competency: 'reading-documentation', atLevel: 'L1' },
      { competency: 'ai-assisted-development-basics', atLevel: 'L1' },
    ],
    verifiedAt: VERIFIED,
  },
  {
    id: 'impeccable',
    name: 'Impeccable (skill de design)',
    category: 'ai',
    use: 'Skill para o agente de IA auditar e lapidar interface: contraste, hierarquia, estados, responsivo e os clichês de UI gerada.',
    why:
      'Só rende para quem já monta uma página e sabe o que é layout bom: a skill aponta o que ' +
      'falta, não substitui o olho. É o que este site usa para se auditar.',
    url: 'https://github.com/pbakaus/impeccable',
    cost: 'free',
    ptBrStatus: 'none',
    stability: 'volatile',
    unlockedBy: [
      { competency: 'css-layout', atLevel: 'L1' },
      { competency: 'ai-assisted-development-basics', atLevel: 'L1' },
    ],
    verifiedAt: '2026-10-16',
  },
  {
    id: 'agents-md',
    name: 'AGENTS.md',
    category: 'ai',
    use: 'Arquivo de instruções do projeto que os agentes de IA leem: convenções, como testar, o que evitar.',
    why:
      'É documentação de projeto que também serve à IA — padrão aberto, aceito por várias ' +
      'ferramentas. Escrever um bom exige saber comunicar as próprias regras.',
    url: 'https://agents.md',
    cost: 'free',
    ptBrStatus: 'none',
    stability: 'volatile',
    unlockedBy: [
      { competency: 'ai-assisted-development-basics', atLevel: 'L1' },
      { competency: 'technical-communication', atLevel: 'L1' },
    ],
    verifiedAt: VERIFIED,
  },
  {
    id: 'agent-skills',
    name: 'Skills de agente',
    category: 'ai',
    use: 'Instruções reutilizáveis que ensinam o agente a fazer uma tarefa recorrente do seu jeito.',
    why:
      'Uma skill de teste ou de revisão só presta se você sabe como é um bom teste e uma boa ' +
      'revisão. Por isso vem depois de testes — e é o passo para o seu kit pessoal.',
    url: 'https://github.com/anthropics/skills',
    cost: 'free',
    ptBrStatus: 'none',
    stability: 'volatile',
    unlockedBy: [
      { competency: 'ai-assisted-development-basics', atLevel: 'L1' },
      { competency: 'automated-testing-basics', atLevel: 'L1' },
    ],
    verifiedAt: VERIFIED,
  },
];
