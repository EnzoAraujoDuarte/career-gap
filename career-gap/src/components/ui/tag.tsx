/** Etiqueta curta de metadado: idioma, custo, tempo. `warn` marca o que é barreira. */
export function Tag({ children, warn }: { children: React.ReactNode; warn?: boolean }) {
  return (
    <span
      className={`rounded-sm border px-1.5 py-px text-[12px] ${
        warn ? 'border-[var(--state-attention)] text-[var(--state-attention)]' : 'border-rule text-ink-soft'
      }`}
    >
      {children}
    </span>
  );
}
