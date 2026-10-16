import type { BuildKind } from '@/domain/model';

/**
 * O desenho de cada construção: o que a pessoa vai ter na mão, a traço de caneta sobre o
 * papel. Um sistema só — mesmo traço, mesma caixa — para a trilha ler como um caderno de
 * mentor, não como uma grade de ícones. `currentColor` segue a tinta do contexto.
 */
const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const DRAWINGS: Record<BuildKind, React.ReactNode> = {
  page: (
    <>
      <rect x="6" y="8" width="44" height="34" rx="3" {...STROKE} />
      <path d="M6 15h44M11 11.5h2M15 11.5h2" {...STROKE} />
      <path d="M13 22h12M13 28h22M13 34h17" {...STROKE} />
      <circle cx="40" cy="25" r="4.5" {...STROKE} />
    </>
  ),
  terminal: (
    <>
      <rect x="6" y="9" width="44" height="32" rx="3" {...STROKE} />
      <path d="M13 19l6 5-6 5M23 29h11" {...STROKE} />
      <path d="M13 35h30" {...STROKE} strokeDasharray="2 3" />
    </>
  ),
  link: (
    <>
      <rect x="14" y="4" width="28" height="42" rx="5" {...STROKE} />
      <path d="M24 9h8M26 41h4" {...STROKE} />
      <path d="M21 24c3-5 11-5 14 0M24 29c2-3 6-3 8 0" {...STROKE} />
      <path d="M28 33v4" {...STROKE} />
    </>
  ),
  widget: (
    <>
      <rect x="6" y="12" width="44" height="12" rx="2" {...STROKE} />
      <path d="M12 18h14" {...STROKE} />
      <path d="M29 15v6" {...STROKE} />
      <path d="M28 30l-4 4 4 4" {...STROKE} />
      <rect x="6" y="30" width="44" height="12" rx="2" {...STROKE} strokeDasharray="3 3" />
      <path d="M33 36h11" {...STROKE} />
    </>
  ),
  form: (
    <>
      <path d="M8 10h18M8 15h30" {...STROKE} />
      <rect x="8" y="19" width="40" height="7" rx="1.5" {...STROKE} />
      <path d="M8 31h14" {...STROKE} />
      <rect x="8" y="34" width="22" height="7" rx="1.5" {...STROKE} />
      <rect x="34" y="34" width="14" height="7" rx="3.5" {...STROKE} />
      <path d="M38 37.5l2 2 4-4" {...STROKE} />
    </>
  ),
  server: (
    <>
      <rect x="8" y="6" width="40" height="11" rx="2" {...STROKE} />
      <rect x="8" y="20" width="40" height="11" rx="2" {...STROKE} />
      <rect x="8" y="34" width="40" height="11" rx="2" {...STROKE} />
      <path d="M14 11.5h2M14 25.5h2M14 39.5h2" {...STROKE} />
      <path d="M30 11.5h12M30 25.5h12M30 39.5h12" {...STROKE} />
    </>
  ),
  app: (
    <>
      <rect x="6" y="7" width="44" height="36" rx="3" {...STROKE} />
      <path d="M6 14h44M20 14v29" {...STROKE} />
      <path d="M10 20h6M10 25h6M10 30h6" {...STROKE} />
      <rect x="25" y="20" width="20" height="8" rx="1.5" {...STROKE} />
      <path d="M25 33h20M25 38h13" {...STROKE} />
    </>
  ),
  'pull-request': (
    <>
      <circle cx="16" cy="12" r="4" {...STROKE} />
      <circle cx="16" cy="40" r="4" {...STROKE} />
      <circle cx="40" cy="40" r="4" {...STROKE} />
      <path d="M16 16v20" {...STROKE} />
      <path d="M26 12h8a6 6 0 0 1 6 6v18" {...STROKE} />
      <path d="M29 8l-4 4 4 4" {...STROKE} />
    </>
  ),
};

export function BuildGlyph({ kind, size = 56, className }: { kind: BuildKind; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={(size * 50) / 56}
      viewBox="0 0 56 50"
      className={className}
      aria-hidden
      focusable="false"
    >
      {DRAWINGS[kind]}
    </svg>
  );
}
