/**
 * Gera `src/catalog/resources.ts` a partir dos três JSONs de pesquisa verificada.
 *
 * Os JSONs têm formas diferentes porque vieram de lentes de pesquisa distintas. Este
 * script é a única fonte de normalização — rodar de novo reproduz o catálogo, o que
 * mantém a rastreabilidade exigida pelo protocolo de fundamentação.
 *
 *   pnpm build:resources
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const RESEARCH = resolve(import.meta.dirname, '../../docs/research');
const OUT = resolve(import.meta.dirname, '../src/catalog/resources.ts');

type Raw = Record<string, unknown>;
const read = (file: string): Raw[] =>
  (JSON.parse(readFileSync(resolve(RESEARCH, file), 'utf8')) as { entries: Raw[] }).entries;

/**
 * Normalização de tecnologia. O campo veio como texto livre com 41 valores distintos.
 * Três deles nem são tecnologia — "hashing de senhas", "segurança de autenticação" e
 * "modelagem relacional" são nomes de competência que vazaram para o campo, e é daí que
 * sairia um selo absurdo como "— com hashing de senhas".
 */
const TECH_ALIASES: Record<string, string> = {
  'agnostic': 'agnostic', 'agnóstico': 'agnostic', '': 'agnostic',
  'agnóstico (javascript no ambiente da khan)': 'agnostic',
  'c / python / sql': 'agnostic', 'llms': 'agnostic', 'github copilot': 'agnostic',
  'hashing de senhas': 'agnostic', 'segurança de autenticação': 'agnostic',
  'web estática / github pages / ftp': 'agnostic', 'github pages': 'agnostic',
  'javascript': 'javascript', 'javascript / fetch': 'javascript', 'dom': 'javascript',
  'jest': 'javascript', 'testing library': 'javascript', 'chrome devtools': 'javascript',
  'node': 'node', 'node.js / express': 'node', 'react / node / express': 'node',
  'node.js / express / railway': 'node',
  'html': 'html', 'html / aria': 'html', 'wcag': 'html',
  'css': 'css', 'css flexbox': 'css',
  'sql': 'sql', 'modelagem relacional': 'sql',
  'git': 'git', 'java': 'java', 'http': 'http', 'https/tls': 'http', 'rest': 'http',
  'react': 'react', 'python / django': 'python-django',
  'linux': 'shell', 'shell / man / tldr': 'shell', 'shell / bash': 'shell', 'shell': 'shell',
};

const normalizeTech = (value: unknown): string => {
  const key = String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
  const direct = TECH_ALIASES[String(value ?? '').toLowerCase().trim()];
  if (direct) return direct;
  const stripped = Object.entries(TECH_ALIASES).find(
    ([alias]) => alias.normalize('NFD').replace(/[̀-ͯ]/g, '') === key,
  );
  return stripped ? stripped[1] : 'agnostic';
};

/** "grátis", "free", "R$ 39,90", "grátis, certificado pago" → enum fechado. */
const normalizeCost = (value: unknown): { kind: string; note?: string } => {
  const raw = String(value ?? 'free').toLowerCase();
  if (/certificado pago|certificate/.test(raw)) return { kind: 'free-content-paid-certificate' };
  if (/r\$|pago|paid/.test(raw)) return { kind: 'paid', note: String(value) };
  return { kind: 'free' };
};

/** `kind` veio em texto livre e em português nos livros/cursos. */
const KIND_ALIASES: Record<string, string> = {
  'apostila': 'book', 'material de curso': 'course', 'guia': 'guide',
  'referência': 'reference', 'interativo': 'interactive', 'curso interativo': 'interactive',
  'curso/documentação': 'course', 'documentação': 'doc', 'curso': 'course',
  'curso em vídeo': 'course', 'bootcamp': 'course', 'desafio': 'exercise',
};
const normalizeKind = (value: unknown): string => {
  const raw = String(value ?? 'doc').toLowerCase().trim();
  return KIND_ALIASES[raw] ?? raw;
};

/**
 * "n/a" nos livros significa que o recurso JÁ É em português no original — livro ou curso
 * brasileiro não tem tradução a avaliar. Mapear para "none" diria ao usuário que o material
 * está em inglês, que é o contrário da verdade.
 */
const normalizePtBr = (value: unknown): string => {
  const raw = String(value ?? 'none').toLowerCase().trim();
  return raw === 'n/a' ? 'complete' : raw;
};

/**
 * O campo `chapters` da pesquisa às vezes traz nota para o curador ("NÃO mapear para
 * sql-basics") em vez de referência de trecho. Essas notas não podem vazar para a tela:
 * são instruções internas, e o usuário leria como se fossem instruções para ele.
 */
const CHAPTER_HINT = /\b(cap\.|cap[íi]tulo|m[óo]dulo|parte|aula|se[çc][ãa]o|volume|unidade)\b/i;
const cleanChapters = (value: unknown): string | undefined => {
  const text = String(value ?? '').trim();
  if (!text || text.length > 160) return undefined;
  if (/n[ãa]o mapear|confirmad|curador|TODO|verificar/i.test(text)) return undefined;
  return CHAPTER_HINT.test(text) ? text : undefined;
};

const slug = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70);

interface Built {
  id: string; title: string; sourceName: string; url: string; kind: string;
  actionType: string; competencies: string[]; levelMin: string; technology: string;
  cost: string; costNote?: string; ptBrStatus: string; requiresSignup: boolean;
  license: string; estimatedTime?: string; chapters?: string; why: string; task?: string;
  origin: string;
}

/** O nome do detentor não existe de forma confiável no JSON de livros — o host da URL é o
 *  dado mais honesto que temos, e é exatamente a página que o ADR-0005 manda linkar. Na tela,
 *  porém, "dio.me" ou "github.com" não dizem quem fez: o mapa abaixo dá o nome de quem publica,
 *  conferido em cada página. No GitHub, quem publica é o dono do repositório. */
const PUBLISHER: Readonly<Record<string, string>> = {
  '7daysofcode.io': 'Alura',
  'altabooks.com.br': 'Alta Books',
  'alura.com.br': 'Alura',
  'casadocodigo.com.br': 'Casa do Código',
  'cursoemvideo.com': 'Curso em Vídeo · Gustavo Guanabara',
  'developer.mozilla.org': 'MDN (Mozilla)',
  'dio.me': 'DIO',
  'estudarfora.org.br': 'Fundação Estudar',
  'ev.org.br': 'Fundação Bradesco · Escola Virtual',
  'freecodecamp.org': 'freeCodeCamp',
  'novatec.com.br': 'Novatec',
  'origamid.com': 'Origamid',
  'penseallen.github.io': 'Allen Downey (trad. Sheila Gomes)',
  'rogerdudler.github.io': 'Roger Dudler',
  'theodinproject.com': 'The Odin Project',
  'w3.org': 'W3C',
  'web.dev': 'Google (web.dev)',
};
const GITHUB_OWNER: Readonly<Record<string, string>> = {
  gustavoguanabara: 'Gustavo Guanabara (GitHub)',
  getify: 'Kyle Simpson (GitHub)',
};
const hostOf = (url: string): string => {
  try {
    const { hostname, pathname } = new URL(url);
    const host = hostname.replace(/^www\./, '');
    if (host === 'github.com') {
      const owner = pathname.split('/')[1] ?? '';
      return GITHUB_OWNER[owner] ?? `${owner} (GitHub)`;
    }
    return PUBLISHER[host] ?? host;
  } catch {
    return 'fonte não identificada';
  }
};

const seen = new Set<string>();
const uniqueId = (base: string): string => {
  let id = base;
  let n = 2;
  while (seen.has(id)) id = `${base}-${n++}`;
  seen.add(id);
  return id;
};

const built: Built[] = [];

// --- criadores brasileiros -------------------------------------------------
// Sem license, pt_br_status, requires_signup nem cost no JSON: todos deriváveis.
// São criadores brasileiros falando português (pt-BR completo), 33 de 38 em URL do
// YouTube (sem cadastro), e a verificação já exigiu gratuidade como critério de entrada.
for (const e of read('recursos-br-verificados.json')) {
  const url = String(e.artifact_url);
  const cost = normalizeCost(e.cost);
  built.push({
    id: uniqueId(slug(String(e.artifact_title))),
    title: String(e.artifact_title),
    sourceName: String(e.creator),
    url,
    kind: normalizeKind(e.artifact_kind),
    actionType: String(e.action_type),
    competencies: e.competencies as string[],
    levelMin: String(e.level_min),
    technology: normalizeTech(e.technology),
    cost: cost.kind,
    costNote: cost.note,
    ptBrStatus: 'complete',
    requiresSignup: !/youtube\.com|youtu\.be/.test(url),
    license: 'direitos reservados — apenas linkar',
    why: String(e.why),
    origin: 'br-creator',
  });
}

// --- canônicos internacionais ----------------------------------------------
for (const e of read('recursos-canonicos-verificados.json')) {
  built.push({
    id: uniqueId(slug(String(e.title))),
    title: String(e.title),
    sourceName: String(e.source),
    url: String(e.pt_br_status === 'complete' && e.pt_br_url ? e.pt_br_url : e.url),
    kind: normalizeKind(e.kind),
    actionType: String(e.action_type),
    competencies: e.competencies as string[],
    levelMin: String(e.level_min),
    technology: normalizeTech(e.technology),
    cost: 'free',
    ptBrStatus: normalizePtBr(e.pt_br_status),
    requiresSignup: Boolean(e.requires_signup),
    license: String(e.license ?? 'não declarada — apenas linkar'),
    estimatedTime: e.estimated_time ? String(e.estimated_time) : undefined,
    why: String(e.why),
    origin: 'canonical',
  });
}

// --- livros e cursos --------------------------------------------------------
for (const e of read('livros-cursos-verificados.json')) {
  const cost = normalizeCost(e.cost);
  built.push({
    id: uniqueId(slug(String(e.name))),
    title: String(e.name),
    sourceName: hostOf(String(e.url)),
    url: String(e.url),
    kind: normalizeKind(e.kind ?? 'book'),
    actionType: String(e.action_type),
    competencies: e.competencies as string[],
    levelMin: String(e.level_min),
    technology: 'agnostic',
    cost: cost.kind,
    costNote: cost.note,
    ptBrStatus: normalizePtBr(e.pt_br_status),
    requiresSignup: false,
    license: String(e.license ?? 'não declarada — apenas linkar'),
    chapters: cleanChapters(e.chapters),
    why: String(e.why),
    origin: 'book',
  });
}

// --- prática e missões ------------------------------------------------------
// Lente aberta na auditoria de 2026-10-15, que achou 7 competências core sem nenhuma prática.
// Missão é texto do projeto: o enunciado vai em `task`; a URL é a documentação que ela usa.
for (const e of read('recursos-pratica-verificados.json')) {
  built.push({
    id: uniqueId(slug(String(e.title))),
    title: String(e.title),
    sourceName: String(e.source),
    url: String(e.url),
    kind: normalizeKind(e.kind),
    actionType: String(e.action_type),
    competencies: e.competencies as string[],
    levelMin: String(e.level_min),
    technology: normalizeTech(e.technology),
    cost: normalizeCost(e.cost).kind,
    ptBrStatus: normalizePtBr(e.pt_br_status),
    requiresSignup: Boolean(e.requires_signup),
    license: String(e.license),
    estimatedTime: e.estimated_time ? String(e.estimated_time) : undefined,
    why: String(e.why),
    task: e.task ? String(e.task) : undefined,
    origin: String(e.origin),
  });
}

/**
 * Deduplicação por URL. Dez recursos apareceram em mais de uma lente (Pro Git, MDN HTTP,
 * SQLBolt, Full Stack Open...), porque cada lente procurou por um ângulo diferente. Mesclar
 * em vez de descartar preserva o que só uma das versões tinha — o mapeamento por capítulo
 * veio da lente de livros, o tempo estimado veio da lente de canônicos.
 */
const byUrl = new Map<string, Built>();
const PRIORITY: Record<string, number> = {
  mission: 4, canonical: 3, practice: 2, 'br-creator': 2, book: 1,
};
for (const entry of built) {
  const existing = byUrl.get(entry.url);
  if (!existing) {
    byUrl.set(entry.url, entry);
    continue;
  }
  const [keep, other] =
    PRIORITY[entry.origin] > PRIORITY[existing.origin] ? [entry, existing] : [existing, entry];
  byUrl.set(entry.url, {
    ...keep,
    chapters: keep.chapters ?? other.chapters,
    estimatedTime: keep.estimatedTime ?? other.estimatedTime,
    license: keep.license.startsWith('não declarada') ? other.license : keep.license,
    competencies: [...new Set([...keep.competencies, ...other.competencies])],
  });
}
const deduped = [...byUrl.values()];

const header = `// GERADO por scripts/build-resource-catalog.ts — não editar à mão.
// Fonte: docs/research/*.json — verificados um a um em 2026-09-11; prática e missões em 2026-10-15.
// Regenerar com: pnpm build:resources
import type { Resource } from '@/domain/model';

export const RESOURCES: readonly Resource[] = `;

writeFileSync(OUT, header + JSON.stringify(deduped, null, 2).replace(/"([a-zA-Z]+)":/g, '$1:') + ';\n');

const byTech = new Map<string, number>();
for (const r of deduped) byTech.set(r.technology, (byTech.get(r.technology) ?? 0) + 1);
console.log(`${deduped.length} recursos gerados (${built.length - deduped.length} duplicados mesclados) em src/catalog/resources.ts`);
console.log('tecnologias:', [...byTech.entries()].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}=${n}`).join(' '));
