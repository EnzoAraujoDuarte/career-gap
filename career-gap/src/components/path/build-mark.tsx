import type { BuildStatus } from '@/domain/builds';

/**
 * A anotação de uma construção, na mesma voz das marcas de competência: símbolo e palavra,
 * nunca só cor. "Falta só X" e "mais adiante" são conselho; a página abre em qualquer caso.
 */
const MARK: Record<BuildStatus, { symbol: string; label: string; className: string }> = {
  built: { symbol: '✓', label: 'construído', className: 'text-done' },
  ready: { symbol: '→', label: 'dá para fazer agora', className: 'text-now' },
  'one-away': { symbol: '↑', label: 'falta só uma', className: 'text-attention' },
  later: { symbol: '·', label: 'mais adiante', className: 'text-ink-faint' },
};

export function BuildMark({ status, missing }: { status: BuildStatus; missing?: string }) {
  const mark = MARK[status];
  const text = status === 'one-away' && missing ? `falta só ${missing}` : mark.label;
  // O nome da competência que falta pode ser longo; só o rótulo curto fica numa linha.
  return (
    <span className={`hand text-[13.5px] ${missing ? '' : 'whitespace-nowrap'} ${mark.className}`}>
      {mark.symbol} {text}
    </span>
  );
}
