import type { Specimen } from './style-specimen';

/**
 * Espécime F — fluxo vertical editorial, sem canvas.
 *
 * Três decisões de uma vez:
 *  1. Sem pan/zoom. O layout é fixo e relê por CSS, então celular e desktop são a MESMA
 *     interface — hoje são duas, e a que atende a maioria do público é a secundária.
 *  2. O painel de detalhe deixa de existir. O conteúdo abre dentro do próprio fluxo, no nó
 *     em foco. Uma superfície em vez de duas.
 *  3. Tipografia editorial no conteúdo, anotação manuscrita só na marginália.
 */
export function FlowSpecimen({ specimen }: { specimen: Specimen }) {
  return (
    <div className="bg-[#fdfbf7] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-[640px]">
        <p className="font-serif text-[11px] uppercase tracking-[0.22em] text-[#8a7f6d]">
          Primeira vaga em desenvolvimento web
        </p>
        <p className="text-ink-soft mt-1 text-[12.5px]">
          6 no nível · 14 em aberto · 6 adiadas
        </p>

        <ol className="mt-7">
          <Station name="JavaScript essencial" state="met" />
          <Station name="HTML semântico" state="met" />

          <Station name={specimen.focus.name} state="now">
            <div className="pb-2 pt-3">
              <p className="text-ink-soft text-[13.5px] leading-relaxed">
                {specimen.focus.summary}
              </p>

              <p className="font-serif mt-5 text-[11px] uppercase tracking-[0.18em] text-[#8a7f6d]">
                O que fazer
              </p>
              <ol className="mt-2.5 space-y-3.5">
                {specimen.actions.map((action, index) => (
                  <li key={action.title} className="flex gap-3.5">
                    <span className="font-serif text-[19px] leading-none text-[#c9bda6]">
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="text-ink text-[14.5px] leading-snug">{action.title}</span>
                      {action.recommended && (
                        <span className="font-hand text-done ml-1.5 whitespace-nowrap text-[13px]">
                          ← comece aqui
                        </span>
                      )}
                      <span className="text-ink-soft mt-0.5 block text-[12px]">
                        {action.verb.toLowerCase()} · {action.source}
                      </span>
                      <span className="mt-1 flex flex-wrap gap-1.5">
                        <Tag>pt-BR</Tag>
                        <Tag>grátis</Tag>
                        <Tag>20 min</Tag>
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <p className="font-serif mt-6 text-[11px] uppercase tracking-[0.18em] text-[#8a7f6d]">
                Você terminou quando
              </p>
              <ul className="mt-2 space-y-1.5">
                {specimen.exitCriteria.map((criterion) => (
                  <li key={criterion} className="text-ink flex gap-2 text-[13.5px] leading-relaxed">
                    <span className="text-[#c9bda6]">☐</span>
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>
          </Station>

          <Station name="Consumo de API" state="blocked" blockedBy={specimen.focus.name} />
          <Station name="Construir uma aplicação completa" state="future" />
          <Station name="Publicação da aplicação" state="future" last />
        </ol>

        <section className="mt-8 border-t border-dashed border-[#e2d9c8] pt-5">
          <p className="font-hand text-critical text-[16px]">não agora</p>
          <p className="text-ink-soft mt-1.5 text-[12.5px] leading-relaxed">
            <span className="text-ink-faint line-through">Kubernetes</span> ·{' '}
            <span className="text-ink-faint line-through">Microsserviços</span> ·{' '}
            <span className="text-ink-faint line-through">Filas e mensageria</span>
            <br />
            Resolvem operação em escala — um problema que você ainda não tem.
          </p>
        </section>
      </div>
    </div>
  );
}

const STATE_STYLE = {
  met: { dot: '#4a7c59', filled: true, label: 'concluído' },
  now: { dot: '#2c5aa0', filled: true, label: 'você está aqui' },
  blocked: { dot: '#9a948a', filled: false, label: 'travado' },
  future: { dot: '#c9bda6', filled: false, label: '' },
} as const;

function Station({
  name,
  state,
  blockedBy,
  children,
  last,
}: {
  name: string;
  state: keyof typeof STATE_STYLE;
  blockedBy?: string;
  children?: React.ReactNode;
  last?: boolean;
}) {
  const style = STATE_STYLE[state];
  const isFocus = state === 'now';

  return (
    <li className="relative pl-7">
      {!last && (
        <span
          className="absolute left-[6px] top-2 -bottom-1 w-px"
          style={{ background: state === 'met' ? '#4a7c59' : '#ded7c9' }}
          aria-hidden
        />
      )}
      <span
        className="absolute left-0 top-[5px] h-[13px] w-[13px] rounded-full border-2"
        style={{
          borderColor: style.dot,
          background: style.filled ? style.dot : '#fdfbf7',
          boxShadow: isFocus ? '0 0 0 4px #eaf0f8' : undefined,
        }}
        aria-hidden
      />

      <div className={last ? 'pb-0' : 'pb-6'}>
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span
            className={
              isFocus
                ? 'font-serif text-ink text-[22px] leading-tight'
                : 'text-ink text-[14.5px] leading-snug'
            }
            style={{ opacity: state === 'future' ? 0.55 : 1 }}
          >
            {name}
          </span>
          {state === 'met' && <span className="text-done text-[12px]">✓ {style.label}</span>}
          {isFocus && <span className="font-hand text-now text-[14px]">← você está aqui</span>}
        </p>
        {blockedBy && (
          <p className="text-ink-faint mt-0.5 text-[12px]">abre depois de {blockedBy}</p>
        )}
        {children}
      </div>
    </li>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm border border-[#e2d9c8] px-1.5 py-px text-[10.5px] text-[#8a7f6d]">
      {children}
    </span>
  );
}
