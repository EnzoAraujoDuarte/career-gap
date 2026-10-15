import type { AdviceKind } from '@/lib/advice';

/**
 * A anotação de direção. Símbolo, palavra e cor juntos — nunca só a cor. É a voz manuscrita
 * do mentor no canto da página; a parada continua clicável em qualquer caso.
 */
const MARK: Record<AdviceKind, { symbol: string; label: string; className: string }> = {
  met: { symbol: '✓', label: 'você já sabe', className: 'text-done' },
  recommended: { symbol: '→', label: 'recomendado agora', className: 'text-now' },
  'missing-base': { symbol: '↑', label: 'falta base', className: 'text-attention' },
  'not-now': { symbol: '×', label: 'não agora', className: 'text-ink-faint' },
};

export function AdviceMark({ kind }: { kind: AdviceKind }) {
  const mark = MARK[kind];
  return (
    <span className={`hand whitespace-nowrap text-[13.5px] ${mark.className}`}>
      {mark.symbol} {mark.label}
    </span>
  );
}
