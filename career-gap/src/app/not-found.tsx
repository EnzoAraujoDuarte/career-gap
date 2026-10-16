import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Página não encontrada · Career Gap' };

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-paper px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-[640px]">
        <h1 className="font-serif text-ink text-[26px] leading-tight">Esta página não existe</h1>
        <p className="text-ink-soft mt-2 text-[14px] leading-relaxed">
          O endereço pode ter mudado ou estar com um erro de digitação. Tudo o que o Career Gap
          indica está na trilha e no Explorar.
        </p>
        <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
          <Link href="/trilha" className="text-now underline underline-offset-2">
            Ir para a trilha
          </Link>
          <Link href="/explorar" className="text-now underline underline-offset-2">
            Explorar o catálogo
          </Link>
        </p>
      </div>
    </main>
  );
}
