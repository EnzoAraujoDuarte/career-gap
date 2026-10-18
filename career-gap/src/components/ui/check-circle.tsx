/** O visto num círculo: concluído quando cheio. Um desenho só para material e estação. */
export function CheckCircle({ filled, size = 22 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden className="shrink-0">
      <circle cx={11} cy={11} r={8} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.6} />
      <path
        d="M7.4 11.2l2.5 2.4 4.7-4.9"
        fill="none"
        stroke={filled ? 'var(--paper)' : 'currentColor'}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
