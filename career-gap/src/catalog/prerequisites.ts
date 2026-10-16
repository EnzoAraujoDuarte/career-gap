import type { Prerequisite } from '@/domain/model';
import { canonical, cs2023, sfia, swebok } from './sources';

/**
 * Pré-requisitos DUROS (ADR-0001).
 *
 * Teste de admissão de cada aresta: a competência destravada é inviável ou
 * incompreensível sem a origem naquele nível? Se a afirmação honesta for apenas
 * "é melhor aprender antes", a aresta não entra — isso é peso no escore.
 *
 * O grafo esparso é intencional: 24 arestas para 26 competências. Um grafo denso
 * seria opinião com aparência de estrutura, e nenhuma banca conseguiria auditá-lo.
 */
export const PREREQUISITES: readonly Prerequisite[] = [
  {
    requires: 'programming-fundamentals',
    atLevel: 'L1',
    unlocks: 'javascript-essentials',
    rationale:
      'Sem controle de fluxo e funções não há o que escrever em JavaScript; a sintaxe da ' +
      'linguagem não substitui o conceito.',
    sources: [cs2023('SDF'), sfia('PROG')],
  },
  {
    requires: 'programming-fundamentals',
    atLevel: 'L1',
    unlocks: 'debugging',
    rationale: 'Não se depura um programa cujas construções básicas ainda não se lê.',
    sources: [swebok('Software Construction'), sfia('PROG')],
  },
  {
    requires: 'programming-fundamentals',
    atLevel: 'L1',
    unlocks: 'code-readability',
    rationale: 'Julgar se um nome ou uma função estão claros exige escrever código primeiro.',
    sources: [swebok('Software Construction'), sfia('PROG')],
  },
  {
    requires: 'programming-fundamentals',
    atLevel: 'L2',
    unlocks: 'algorithms-and-complexity',
    rationale:
      'Comparar custo entre soluções pressupõe conseguir implementar mais de uma solução.',
    sources: [cs2023('AL'), sfia('PROG')],
  },
  {
    requires: 'programming-fundamentals',
    atLevel: 'L2',
    unlocks: 'build-an-application',
    rationale:
      'Uma aplicação inteira exige escrever código independente; abaixo disso o resultado é ' +
      'cópia de tutorial, não construção.',
    sources: [swebok('Software Construction'), cs2023('SE'), sfia('PROG')],
  },
  {
    requires: 'programming-fundamentals',
    atLevel: 'L2',
    unlocks: 'automated-testing-basics',
    rationale: 'Um teste é código: quem ainda não escreve código sozinho não escreve teste.',
    sources: [swebok('Software Testing'), sfia('TEST')],
  },
  {
    requires: 'programming-fundamentals',
    atLevel: 'L1',
    unlocks: 'ai-assisted-development-basics',
    rationale:
      'Sem conseguir ler código não há como revisar o que o assistente gerou, e aceitar sem ' +
      'revisar é o modo de falha central desta competência.',
    sources: [
      swebok('Software Engineering Professional Practice'),
      cs2023('SEP'),
      sfia('PROG'),
    ],
  },
  {
    requires: 'debugging',
    atLevel: 'L1',
    unlocks: 'ai-assisted-development-basics',
    rationale:
      'Quanto mais autonomia se dá ao agente, maior precisa ser a capacidade de avaliar a ' +
      'saída; verificar código gerado é depuração aplicada a código que não se escreveu.',
    sources: [swebok('Software Engineering Professional Practice'), sfia('PROG')],
  },
  {
    requires: 'html-semantics',
    atLevel: 'L1',
    unlocks: 'css-layout',
    rationale: 'CSS estiliza uma árvore de elementos que precisa existir e fazer sentido antes.',
    sources: [canonical('MDN — CSS layout guide'), sfia('PROG')],
  },
  {
    requires: 'html-semantics',
    atLevel: 'L1',
    unlocks: 'dom-and-browser',
    rationale: 'Manipular o DOM é manipular a estrutura HTML já renderizada.',
    sources: [canonical('MDN — Document Object Model'), sfia('PROG')],
  },
  {
    requires: 'html-semantics',
    atLevel: 'L1',
    unlocks: 'web-accessibility-basics',
    rationale:
      'Quase toda acessibilidade básica decorre de usar o elemento semanticamente correto.',
    sources: [canonical('WCAG 2.2'), cs2023('HCI')],
  },
  {
    requires: 'javascript-essentials',
    atLevel: 'L1',
    unlocks: 'dom-and-browser',
    rationale: 'Eventos e manipulação do DOM são escritos em JavaScript.',
    sources: [canonical('MDN — Document Object Model'), sfia('PROG')],
  },
  {
    requires: 'javascript-essentials',
    atLevel: 'L2',
    unlocks: 'ui-components-and-state',
    rationale:
      'Componente é função JavaScript: props desestruturadas, map sobre arrays, estado que não ' +
      'se altera no lugar e módulos são a linguagem, não o framework.',
    sources: [canonical('react.dev — Pensando em React'), sfia('PROG')],
  },
  {
    requires: 'dom-and-browser',
    atLevel: 'L1',
    unlocks: 'ui-components-and-state',
    rationale:
      'O framework gera elementos e trata eventos por você; sem saber o que é a árvore do DOM ' +
      'e um evento, o que ele faz parece mágica e o defeito fica impossível de achar.',
    sources: [canonical('MDN — Introduction to client-side frameworks'), cs2023('SPD')],
  },
  {
    requires: 'javascript-essentials',
    atLevel: 'L2',
    unlocks: 'api-consumption',
    rationale:
      'Consumir API exige código assíncrono; sem promises o resultado chega fora de ordem e ' +
      'o erro fica incompreensível.',
    sources: [canonical('MDN — Fetch API'), sfia('PROG')],
  },
  {
    requires: 'http-fundamentals',
    atLevel: 'L1',
    unlocks: 'api-consumption',
    rationale: 'Tratar a resposta exige entender status e corpo da resposta.',
    sources: [cs2023('NC'), canonical('RFC 9110')],
  },
  {
    requires: 'http-fundamentals',
    atLevel: 'L2',
    unlocks: 'api-development',
    rationale:
      'Escolher método e status ao expor um endpoint exige ler a semântica do protocolo, não ' +
      'apenas reconhecê-la.',
    sources: [cs2023('NC'), canonical('RFC 9110')],
  },
  {
    requires: 'programming-fundamentals',
    atLevel: 'L2',
    unlocks: 'api-development',
    rationale: 'Um endpoint contém a lógica da aplicação; depende de programar de forma autônoma.',
    sources: [swebok('Software Design'), sfia('SWDN')],
  },
  {
    requires: 'http-fundamentals',
    atLevel: 'L2',
    unlocks: 'authentication-basics',
    rationale:
      'Sessão e token são mecanismos construídos sobre cabeçalhos e cookies; sem isso o ' +
      'assunto vira receita copiada.',
    sources: [swebok('Software Security'), sfia('SCTY')],
  },
  {
    requires: 'api-development',
    atLevel: 'L1',
    unlocks: 'authentication-basics',
    rationale: 'Autenticação protege endpoints, que precisam existir primeiro.',
    sources: [swebok('Software Security'), sfia('SCTY')],
  },
  {
    requires: 'version-control-git',
    atLevel: 'L1',
    unlocks: 'build-an-application',
    rationale:
      'Um projeto que evolui sem histórico perde trabalho; versionar é condição de construir ' +
      'algo além de um exercício isolado.',
    sources: [swebok('Software Configuration Management'), sfia('CFMG')],
  },
  {
    requires: 'version-control-git',
    atLevel: 'L2',
    unlocks: 'code-review-participation',
    rationale:
      'Revisar exige ler diff e trabalhar com branches e pull requests — o fluxo do próprio Git.',
    sources: [swebok('Software Quality'), sfia('CFMG')],
  },
  {
    requires: 'build-an-application',
    atLevel: 'L1',
    unlocks: 'deployment-basics',
    rationale: 'Só se publica o que já funciona localmente.',
    sources: [swebok('Software Engineering Operations'), sfia('DEPL')],
  },
  {
    requires: 'command-line-basics',
    atLevel: 'L1',
    unlocks: 'deployment-basics',
    rationale:
      'Build, variáveis de ambiente e logs de publicação são operados por terminal em ' +
      'praticamente todo serviço de hospedagem.',
    sources: [swebok('Software Engineering Operations'), cs2023('OS'), sfia('DEPL')],
  },
];
