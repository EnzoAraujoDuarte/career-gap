import type { Catalog } from '@/domain/roadmap';
import { COMPETENCIES } from './competencies';
import { PREREQUISITES } from './prerequisites';
import { TRACKS } from './tracks';
import { RESOURCES } from './resources';
import { HABITS } from './habits';
import { TOOLS } from './tools';
import { BUILDS } from './builds';

/**
 * Versão do catálogo. Gravada em todo roadmap gerado.
 *
 * Sem isto, um resultado coletado na avaliação com usuários deixa de ser reproduzível
 * assim que uma competência muda de nível-alvo — e o TCC perde a rastreabilidade que
 * justamente promete (DISCOVERY.md §3).
 */
export const CATALOG_VERSION = '2026.10.16-1';

export const CATALOG: Catalog = {
  version: CATALOG_VERSION,
  competencies: new Map(COMPETENCIES.map((competency) => [competency.id, competency])),
  prerequisites: PREREQUISITES,
  resources: RESOURCES,
  habits: HABITS,
  tools: TOOLS,
  builds: BUILDS,
  tracks: new Map(TRACKS.map((track) => [track.id, track])),
};

export { COMPETENCIES, PREREQUISITES, TRACKS, RESOURCES, HABITS, TOOLS, BUILDS };
export { TECHNOLOGIES } from './technologies';
export { FIRST_WEB_ROLE } from './tracks';
