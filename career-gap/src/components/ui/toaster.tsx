'use client';

import { dismissToast, useToast } from '@/lib/toast';

/** O aviso do rodapé. No celular, acima das abas; no computador, embaixo e no centro. */
export function Toaster() {
  const toast = useToast();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] z-40 flex justify-center px-4 sm:bottom-6"
    >
      {toast && (
        <div
          key={toast.id}
          className="pointer-events-auto flex max-w-[480px] items-center gap-3 rounded-sm bg-[var(--ink)] py-1 pr-1 pl-4 text-[14px] text-[var(--paper)] shadow-[0_6px_20px_rgba(28,27,25,0.22)]"
        >
          <span className="py-2">{toast.text}</span>
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                const { run } = toast.action!;
                dismissToast();
                run();
              }}
              className="focus-visible:outline-attention min-h-11 rounded-sm px-3 font-medium underline underline-offset-2 focus-visible:outline-2"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
