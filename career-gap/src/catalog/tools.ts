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
    setup: {
      kind: 'install',
      note: 'Baixe em code.visualstudio.com e instale como qualquer programa; na primeira abertura, troque o idioma para português em Extensões.',
    },
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
    setup: {
      kind: 'install',
      note: 'No Windows e no Mac, baixe em git-scm.com e instale com as opções padrão; no Linux, pelo gerenciador de pacotes. Confira com git --version.',
      command: 'git --version',
    },
    verifiedAt: VERIFIED,
  },

  {
    id: 'node',
    name: 'Node.js',
    category: 'editor',
    use: 'Roda JavaScript fora do navegador e traz o npm, que instala as dependências de um projeto.',
    why:
      'Quase todo comando "npm install" e "npx" desta lista precisa dele. Faz sentido quando você ' +
      'já escreve JavaScript; antes disso, o navegador basta.',
    url: 'https://nodejs.org/pt',
    cost: 'free',
    ptBrStatus: 'partial',
    stability: 'evergreen',
    unlockedBy: [{ competency: 'javascript-essentials', atLevel: 'L1' }],
    setup: {
      kind: 'install',
      note: 'Baixe a versão LTS em nodejs.org e instale com as opções padrão. Depois, num terminal novo, confira.',
      command: 'node --version && npm --version',
    },
    verifiedAt: '2026-10-16',
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
    setup: {
      kind: 'built-in',
      note: 'Já está no seu navegador: aperte F12, ou clique com o botão direito na página e escolha Inspecionar.',
    },
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
    setup: {
      kind: 'built-in',
      note: 'Já vem no macOS, no Linux e no Windows 10 em diante: abra o terminal e confira.',
      command: 'curl --version',
    },
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
    setup: {
      kind: 'account',
      note: 'Crie uma conta gratuita em github.com; não há nada para instalar. O Git da sua máquina conversa com ela.',
    },
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
    setup: {
      kind: 'project-dependency',
      note: 'Entra no projeto, não no computador: rode na pasta do projeto e ligue “formatar ao salvar” no editor.',
      command: 'npm install -D prettier',
    },
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
    setup: {
      kind: 'project-dependency',
      note: 'Entra no projeto: o comando faz as perguntas e cria o arquivo de configuração.',
      command: 'npm init @eslint/config@latest',
    },
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
    setup: {
      kind: 'project-dependency',
      note: 'Entra no projeto e cria a pasta .husky; o lint e os testes passam a rodar antes de cada commit.',
      command: 'npm install -D husky && npx husky init',
    },
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
    setup: {
      kind: 'repository-file',
      note: 'Nada para instalar: um arquivo .github/workflows/ci.yml no repositório, e o GitHub roda a cada envio.',
    },
    verifiedAt: VERIFIED,
  },

  // ------------------------------------------------------------------------- IA
  {
    id: 'claude-code',
    name: 'Claude Code',
    category: 'ai',
    use: 'O agente de IA no terminal que lê o seu projeto, edita arquivos e roda comandos; é onde os plugins e as skills desta lista entram.',
    why:
      'É o que o autor usa no trabalho. Depois de fundamentos e depuração, pelo mesmo motivo do ' +
      'assistente no editor: quem não depura não confere o que a IA fez. Exige assinatura paga.',
    url: 'https://code.claude.com/docs/en/quickstart',
    cost: 'paid',
    costNote: 'assinatura Claude (Pro ou acima) ou créditos de API',
    ptBrStatus: 'none',
    stability: 'volatile',
    unlockedBy: [
      { competency: 'programming-fundamentals', atLevel: 'L1' },
      { competency: 'debugging', atLevel: 'L1' },
    ],
    setup: {
      kind: 'install',
      note: 'No macOS, Linux e WSL, o comando abaixo instala; no Windows sem WSL, use o PowerShell: irm https://claude.ai/install.ps1 | iex. Depois, abra um terminal novo e rode claude para entrar.',
      command: 'curl -fsSL https://claude.ai/install.sh | bash',
    },
    verifiedAt: '2026-10-16',
  },
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
    setup: {
      kind: 'install',
      note: 'Extensão do editor: no VS Code, procure GitHub Copilot em Extensões e entre com a conta do GitHub.',
    },
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
    setup: {
      kind: 'claude-plugin',
      note: 'Plugin do Claude Code, do marketplace oficial. Com o kit essencial instalado ele já vem junto.',
      command: 'claude plugin install context7@claude-plugins-official --scope user',
    },
    verifiedAt: VERIFIED,
  },
  {
    id: 'ai-memory',
    name: 'ai-memory (memória entre sessões e agentes)',
    category: 'ai',
    use:
      'Guarda o que você e o assistente fizeram em cada sessão e abre a próxima com um "de onde ' +
      'paramos", no Claude Code, Codex, Cursor, Gemini CLI e outros.',
    why:
      'Projeto aberto do Fabio Akita (MIT). Hooks capturam a sessão, um servidor compila tudo em ' +
      'páginas Markdown versionadas no Git do projeto e indexa em SQLite, sem chamar modelo nenhum ' +
      'por padrão. Resolve o chat que esquece tudo e a troca de agente no meio da tarefa. Rende para ' +
      'quem já versiona com Git e já usa assistente com critério.',
    url: 'https://github.com/akitaonrails/ai-memory',
    cost: 'free',
    ptBrStatus: 'partial',
    stability: 'volatile',
    unlockedBy: [
      { competency: 'version-control-git', atLevel: 'L1' },
      { competency: 'ai-assisted-development-basics', atLevel: 'L1' },
    ],
    setup: {
      kind: 'install',
      note:
        'Linux e macOS: o instalador oficial e depois "ai-memory setup", que liga os hooks nos agentes ' +
        'que você usa. Windows: PowerShell com o install.ps1 da mesma página. Também há AUR e Docker.',
      command: 'curl -fsSL https://github.com/akitaonrails/ai-memory/releases/latest/download/install.sh | sh && ai-memory setup',
    },
    verifiedAt: '2026-10-16',
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
    setup: {
      kind: 'claude-plugin',
      note: 'Plugin do Claude Code, do marketplace do autor. Depois, rode /impeccable init no seu projeto.',
      command: 'claude plugin marketplace add pbakaus/impeccable && claude plugin install impeccable@impeccable --scope user',
    },
    verifiedAt: '2026-10-16',
  },
  {
    id: 'kit-career-gap',
    name: 'Kit de trabalho com IA',
    category: 'ai',
    use: 'Regras de código, testes e git carregadas em toda sessão do assistente, mais as skills de PR, depuração e decisão e um agente revisor.',
    why:
      'É a forma de trabalhar do autor deste site, reescrita para qualquer stack: o assistente faz a ' +
      'menor mudança, mostra o que rodou e pede aprovação antes de apagar ou publicar. Pede alguém ' +
      'que já versiona e já usa assistente com critério, senão as regras não têm o que guiar.',
    url: 'https://github.com/EnzoAraujoDuarte/kit-career-gap',
    cost: 'free',
    ptBrStatus: 'complete',
    stability: 'volatile',
    unlockedBy: [
      { competency: 'version-control-git', atLevel: 'L1' },
      { competency: 'ai-assisted-development-basics', atLevel: 'L1' },
    ],
    setup: {
      kind: 'claude-plugin',
      note: 'Um comando no terminal lista o kit e as skills, pergunta o que você quer e instala só isso. Precisa do Claude Code; no Windows, rode no WSL ou no Git Bash.',
      command: 'bash <(curl -fsSL https://raw.githubusercontent.com/EnzoAraujoDuarte/kit-career-gap/main/install.sh)',
    },
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
    setup: {
      kind: 'repository-file',
      note: 'Um arquivo AGENTS.md na raiz do seu projeto, escrito por você; o kit traz um modelo pronto para preencher.',
    },
    verifiedAt: VERIFIED,
  },
  {
    id: 'superpowers',
    name: 'superpowers (skills e método)',
    category: 'ai',
    use: 'Biblioteca de skills e um método de trabalho para o agente: brainstorming antes de codar, teste primeiro, depuração sistemática, planos.',
    why:
      'É o método que torna o assistente previsível: ele pergunta, planeja e testa antes de ' +
      'escrever. Só faz sentido para quem já sabe o que é um bom teste e já depura sozinho.',
    url: 'https://github.com/obra/superpowers',
    cost: 'free',
    ptBrStatus: 'none',
    stability: 'volatile',
    unlockedBy: [
      { competency: 'ai-assisted-development-basics', atLevel: 'L1' },
      { competency: 'automated-testing-basics', atLevel: 'L1' },
    ],
    setup: {
      kind: 'claude-plugin',
      note: 'Plugin do Claude Code, do marketplace oficial.',
      command: 'claude plugin install superpowers@claude-plugins-official --scope user',
    },
    verifiedAt: '2026-10-16',
  },
  {
    id: 'agent-skills',
    name: 'Skills da Anthropic',
    category: 'ai',
    use: 'Instruções reutilizáveis que ensinam o agente a fazer uma tarefa do seu jeito: frontend-design para interface com personalidade, skill-creator para escrever as suas, e as de documento.',
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
    setup: {
      kind: 'claude-plugin',
      note: 'Cada skill é um plugin do marketplace oficial do Claude Code; as duas mais úteis para começar vão no comando.',
      command: 'claude plugin install frontend-design@claude-plugins-official --scope user && claude plugin install skill-creator@claude-plugins-official --scope user',
    },
    verifiedAt: VERIFIED,
  },
];
