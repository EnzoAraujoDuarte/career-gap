'use client'; // Fronteira de erro precisa ser componente de cliente (docs do Next: error.js).

import './globals.css';

/**
 * Erro no próprio layout raiz, onde o `error.tsx` não alcança. Substitui o documento inteiro,
 * então traz `<html>`, `<body>` e os estilos; sem ele, a pessoa veria a tela padrão em inglês.
 */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="pt-BR">
      <body className="bg-paper">
        <title>Algo deu errado · Career Gap</title>
        <main className="min-h-dvh px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-[640px]" role="alert">
            <h1 className="text-ink text-[26px] leading-tight">Algo deu errado</h1>
            <p className="text-ink-soft mt-2 text-[14px] leading-relaxed">
              O que você respondeu e guardou continua salvo neste navegador. Tente de novo; se o
              problema continuar, recarregue a página daqui a pouco.
            </p>
            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
              <button
                onClick={() => retry()}
                className="focus-visible:outline-attention rounded-sm bg-[var(--ink)] px-4 py-2.5 text-[var(--paper)] focus-visible:outline-2"
              >
                Tentar de novo
              </button>
              {/* Link comum, não <Link>: com o layout quebrado, a navegação do cliente também pode estar. */}
              <a href="/trilha" className="text-now underline underline-offset-2">
                Voltar para a trilha
              </a>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
