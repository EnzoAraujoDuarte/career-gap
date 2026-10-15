import type { Resource, ResourceKind } from '@/domain/model';

/** Quanto tempo um recurso pede. Usado pela trilha (horas por nível) e pelo plano. */

/** "~62 h". Abaixo de uma hora, em minutos. */
export const formatDuration = (minutes: number): string =>
  minutes < 60 ? `${minutes} min` : `~${Math.round(minutes / 60)} h`;

/** Abaixo disso o número é ruído de extração, não duração. */
const MIN_MINUTES = 10;

/**
 * Duração padrão por tipo, quando o recurso não declara tempo. Conservadora de propósito:
 * subestimar faz o plano prometer o que a semana não comporta.
 */
const DEFAULT_MINUTES: Record<ResourceKind, number> = {
  video: 20, article: 15, doc: 25, reference: 20, guide: 30, tutorial: 40,
  interactive: 45, exercise: 45, community: 30, playlist: 240, series: 240,
  course: 480, book: 600,
};

/** "20 min", "1 h 30 min", "1–2 h", "~2 h". Faixa vira média. */
const DURATION = /~?\s*(\d+(?:[.,]\d+)?)(?:\s*[–-]\s*(\d+(?:[.,]\d+)?))?\s*(h|min)\b(?:\s*(\d+)\s*min\b)?/i;

function parseDuration(text: string): number | undefined {
  const match = DURATION.exec(text);
  if (!match) return undefined;
  const low = Number(match[1].replace(',', '.'));
  const high = match[2] ? Number(match[2].replace(',', '.')) : low;
  const value = (low + high) / 2;
  const extraMinutes = match[4] ? Number(match[4]) : 0;
  return Math.round(match[3].toLowerCase() === 'h' ? value * 60 + extraMinutes : value);
}

/**
 * Minutos que o recurso deve ocupar no plano.
 *
 * Convenção da curadoria: dentro dos parênteses, "~N" é a parte RECOMENDADA ("8 h (usar as
 * unidades de busca binária, ~2 h)" → 2 h). Fora disso vale o tempo do início do texto; sem
 * tempo declarado, o padrão do tipo de recurso.
 */
export function estimateMinutes(resource: Resource): number {
  const text = resource.estimatedTime ?? '';
  const inside = /\(([^)]*)\)/.exec(text)?.[1] ?? '';
  const tilde = inside.indexOf('~');
  const recommended = tilde >= 0 ? parseDuration(inside.slice(tilde)) : undefined;
  const minutes = recommended ?? parseDuration(text.split('(')[0]) ?? durationInTitle(resource.title);
  return minutes ? Math.max(MIN_MINUTES, minutes) : DEFAULT_MINUTES[resource.kind];
}

/**
 * Último recurso antes do padrão do tipo: muito curso brasileiro traz a duração no título
 * ("Aprenda em 3 Horas", "[40 Horas]"). Sem isso, um vídeo de 3 h sem tempo declarado entrava
 * no plano como 20 minutos.
 */
function durationInTitle(title: string): number | undefined {
  const match = /(\d+)\s*(horas?|minutos?)\b/i.exec(title);
  if (!match) return undefined;
  return /^h/i.test(match[2]) ? Number(match[1]) * 60 : Number(match[1]);
}
