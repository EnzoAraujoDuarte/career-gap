/**
 * Livros de carreira e de vida que o autor indica. Não ensinam uma competência da trilha, então o
 * motor não os recomenda nem os ordena e eles ficam fora de `resources`: a seleção é editorial,
 * como a do kit, e aparece na aba Hábitos. O link vai para a página da editora brasileira
 * (ADR-0005), conferida em 2026-10-17 (docs/research/livros-indicados-2026-10-17.json).
 */
export interface CareerBook {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly publisher: string;
  readonly url: string;
  /** O que a pessoa leva do livro, na voz do produto. */
  readonly why: string;
}

export const CAREER_BOOKS: readonly CareerBook[] = [
  {
    id: 'habitos-atomicos',
    title: 'Hábitos Atômicos',
    author: 'James Clear',
    publisher: 'Alta Books',
    url: 'https://altabooks.com.br/produto/habitos-atomicos/',
    why: 'Um método para criar hábitos pequenos e constantes, como estudar um pouco todo dia em vez de maratonas. Para quem estuda sozinho e perde o ritmo.',
  },
  {
    id: 'nada-pode-me-ferir',
    title: 'Nada Pode Me Ferir',
    author: 'David Goggins',
    publisher: 'Sextante',
    url: 'https://sextante.com.br/products/nada-pode-me-ferir',
    why: 'A história de um ex-Navy SEAL sobre disciplina e resistência mental, para quando a vontade de desistir aparece no meio do caminho. Leia como relato de disciplina, não como plano de treino.',
  },
  {
    id: 'como-fazer-amigos-e-influenciar-pessoas',
    title: 'Como Fazer Amigos e Influenciar Pessoas',
    author: 'Dale Carnegie',
    publisher: 'Sextante',
    url: 'https://sextante.com.br/products/como-fazer-amigos-e-influenciar-pessoas',
    why: 'Ouvir, criticar sem humilhar, lembrar o nome das pessoas: o que pesa numa entrevista, num code review e em qualquer comunidade que você frequentar.',
  },
];
