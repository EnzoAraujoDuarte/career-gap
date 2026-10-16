'use client';

import { useState } from 'react';

/** Um comando de terminal para copiar. Sem área de transferência, o texto fica selecionável.
 *  `compact` é a versão de uma linha, para listas. */
export function CopyCommand({ command, compact = false }: { command: string; compact?: boolean }) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle');

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setState('copied');
    } catch {
      setState('manual');
    }
  }

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <code className="border-rule bg-paper-edge text-ink min-w-0 max-w-full overflow-x-auto rounded-sm border px-2 py-1 text-[12.5px] whitespace-nowrap [font-family:ui-monospace,Menlo,Consolas,monospace]">
          {command}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copiar o comando ${command}`}
          className="text-ink-soft hover:text-ink focus-visible:outline-attention -my-2 inline-flex min-h-11 items-center gap-1.5 text-[12.5px] focus-visible:outline-2"
        >
          <CopyIcon />
          {state === 'copied' ? 'copiado' : state === 'manual' ? 'selecione e copie' : 'copiar'}
        </button>
      </div>
    );
  }

  return (
    <div className="border-rule bg-paper-edge rounded-sm border">
      <pre className="text-ink overflow-x-auto px-3.5 py-3 text-[13px] leading-relaxed [font-family:ui-monospace,Menlo,Consolas,monospace]">
        <code>{command}</code>
      </pre>
      <div className="border-rule flex flex-wrap items-center gap-x-4 gap-y-1 border-t px-3.5 py-2">
        <button
          type="button"
          onClick={copy}
          className="text-ink focus-visible:outline-attention -my-2 inline-flex min-h-11 items-center gap-2 text-[13.5px] font-medium focus-visible:outline-2"
        >
          <CopyIcon />
          Copiar comando
        </button>
        <span className="text-ink-soft text-[12.5px]" aria-live="polite">
          {state === 'copied' && 'Copiado. Cole no terminal e aperte Enter.'}
          {state === 'manual' && 'Não deu para copiar sozinho: selecione o texto acima e copie.'}
        </span>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5" y="5" width="9" height="9" rx="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
    </svg>
  );
}
