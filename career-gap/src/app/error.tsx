'use client'; // Fronteira de erro precisa ser componente de cliente (docs do Next: error.js).

import Link from 'next/link';

/** Erro inesperado numa tela. O que a pessoa fez fica no navegador, então nada se perde. */
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="min-h-dvh bg-paper px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-[640px]" role="alert">
        <h1 className="font-serif text-ink text-[26px] leading-tight">Algo deu errado nesta tela</h1>
        <p className="text-ink-soft mt-2 text-[14px] leading-relaxed">
          O que você respondeu e guardou continua salvo. Tente de novo; se o problema continuar,
          volte para a trilha.
        </p>
        <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
          <button
            onClick={() => retry()}
            className="focus-visible:outline-attention rounded-sm bg-[var(--ink)] px-4 py-2.5 text-[var(--paper)] focus-visible:outline-2"
          >
            Tentar de novo
          </button>
          <Link href="/trilha" className="text-now underline underline-offset-2">
            Voltar para a trilha
          </Link>
        </p>
      </div>
    </main>
  );
}
