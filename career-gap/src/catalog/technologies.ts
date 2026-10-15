import type { Technology } from '@/domain/model';

/**
 * Tecnologias do ecossistema web — as únicas do MVP.
 *
 * Este registro existe para etiquetar RECURSOS ("a documentação do Laravel atende o gap
 * de Construção de API em PHP") e para permitir que o usuário escolha a stack em que
 * quer estudar sem que isso mude o conjunto de competências exigidas.
 *
 * Expansão futura (fora do escopo do TCC, registrada para não se perder): ecossistemas
 * com muita vaga e pouco material estruturado — SAP/ABAP (CDS Views, RAP, CAP, BTP,
 * CPI), Shopify (themes e apps), Magento e TOTVS. Cada um entra como novo `ecosystem`
 * com track e competências próprias; o modelo já comporta.
 */
export const TECHNOLOGIES: readonly Technology[] = [
  { id: 'html', name: 'HTML', ecosystem: 'web', stability: 'evergreen' },
  { id: 'css', name: 'CSS', ecosystem: 'web', stability: 'evergreen' },
  { id: 'javascript', name: 'JavaScript', ecosystem: 'web', stability: 'evergreen' },
  { id: 'typescript', name: 'TypeScript', ecosystem: 'web', stability: 'volatile' },
  { id: 'sql', name: 'SQL', ecosystem: 'web', stability: 'evergreen' },
  { id: 'git', name: 'Git', ecosystem: 'web', stability: 'evergreen' },
  { id: 'php-laravel', name: 'PHP / Laravel', ecosystem: 'web', stability: 'volatile' },
  { id: 'node', name: 'Node.js', ecosystem: 'web', stability: 'volatile' },
  { id: 'python-django', name: 'Python / Django', ecosystem: 'web', stability: 'volatile' },
  { id: 'react', name: 'React', ecosystem: 'web', stability: 'volatile' },
  { id: 'java', name: 'Java', ecosystem: 'web', stability: 'evergreen' },
  { id: 'http', name: 'HTTP', ecosystem: 'web', stability: 'evergreen' },
  { id: 'shell', name: 'Terminal', ecosystem: 'web', stability: 'evergreen' },
];

export const TECHNOLOGY_IDS = new Set(TECHNOLOGIES.map((technology) => technology.id));
