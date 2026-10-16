'use client';

import { useId, useState } from 'react';

/**
 * Copia um prompt para a pessoa levar ao assistente de IA que já usa. Não há IA aqui dentro:
 * o texto vem pronto do catálogo (ADR-0004). Sem área de transferência (http simples, iframe),
 * o texto aparece para copiar à mão.
 */
export function CopyPrompt({ prompt, label }: { prompt: string; label: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const id = useId();

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setState('copied');
    } catch {
      setState('manual');
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={copy}
        aria-describedby={`${id}-hint`}
        className="border-ink text-ink hover:bg-paper-edge focus-visible:outline-attention inline-flex min-h-11 items-center gap-2 rounded-sm border px-3.5 text-[13.5px] focus-visible:outline-2"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="5" y="5" width="9" height="9" rx="1.5" />
          <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
        </svg>
        {label}
      </button>
      <p id={`${id}-hint`} className="text-ink-soft mt-1.5 text-[12.5px] leading-snug" aria-live="polite">
        {state === 'copied'
          ? 'Copiado. Cole no ChatGPT, no Gemini ou em outro assistente: ele vai perguntar, não entregar a resposta.'
          : state === 'manual'
            ? 'Não deu para copiar sozinho. Selecione o texto abaixo e copie.'
            : 'Um pedido pronto, montado com os critérios desta página, que faz o assistente agir como tutor.'}
      </p>
      {state === 'manual' && (
        <textarea
          readOnly
          value={prompt}
          rows={8}
          onFocus={(event) => event.currentTarget.select()}
          aria-label="Prompt para copiar"
          className="border-rule bg-paper text-ink mt-2 w-full rounded-sm border p-2 text-[12.5px] leading-snug"
        />
      )}
    </div>
  );
}
