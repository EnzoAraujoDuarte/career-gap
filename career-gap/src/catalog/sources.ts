import type { Source } from '@/domain/model';

/**
 * Construtores de proveniência.
 *
 * Os identificadores foram conferidos contra as publicações oficiais em 2026-09-10:
 * CS2023 tem 17 Knowledge Areas, SWEBOK v4 tem 18, e os códigos SFIA 9 abaixo existem
 * no catálogo publicado. Referência inventada aqui destrói exatamente aquilo que o
 * protocolo de fundamentação existe para garantir (DISCOVERY.md §3).
 */

/** ACM/IEEE-CS/AAAI Computer Science Curricula 2023 — código da Knowledge Area. */
export const cs2023 = (knowledgeArea: string, note?: string): Source => ({
  sourceClass: 'curriculum',
  ref: `CS2023:${knowledgeArea}`,
  note,
});

/** IEEE Guide to the Software Engineering Body of Knowledge v4.0 (2024). */
export const swebok = (knowledgeArea: string, note?: string): Source => ({
  sourceClass: 'curriculum',
  ref: `SWEBOK4:${knowledgeArea}`,
  note,
});

/** SFIA 9 — código de skill de quatro letras. */
export const sfia = (skillCode: string, note?: string): Source => ({
  sourceClass: 'competency-framework',
  ref: `SFIA9:${skillCode}`,
  note,
});

/** Documentação oficial, norma ou obra de referência reconhecida. */
export const canonical = (ref: string, note?: string): Source => ({
  sourceClass: 'canonical-reference',
  ref,
  note,
});

/**
 * HUNT, A.; THOMAS, D. O programador pragmático: de aprendiz a mestre. Porto Alegre: Bookman,
 * 2010 (ISBN 978-85-7780-734-5) — tradução da 1ª edição. A numeração das 70 dicas foi conferida
 * no texto da edição brasileira em 2026-10-15; a edição de 20 anos numera diferente.
 */
export const pragmaticProgrammer = (tip: number, title: string): Source =>
  canonical(`Hunt e Thomas, O Programador Pragmático (Bookman, 2010), dica ${tip}`, title);

/**
 * BECK, K. Programação extrema (XP) explicada: acolha as mudanças. Porto Alegre: Bookman, 2004
 * (ISBN 978-85-363-0387-1) — tradução da 1ª edição, a das 12 práticas. Nomes das práticas
 * conferidos contra o texto da 1ª edição em 2026-10-15.
 */
export const extremeProgramming = (name: string, kind: 'prática' | 'valor' = 'prática'): Source =>
  canonical(`Beck, Programação Extrema (XP) Explicada (Bookman, 2004), ${kind} "${name}"`);
