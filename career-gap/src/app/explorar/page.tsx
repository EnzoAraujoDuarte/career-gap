import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { ExploreScreen } from '@/components/explore/explore-screen';

export const metadata: Metadata = { title: 'Explorar · Career Gap' };

/**
 * Os filtros vivem na URL. Renderizar a cada requisição (`connection`) deixa o servidor ler a
 * URL e mandar a lista já filtrada; como página estática, ela chegava em branco até o
 * JavaScript carregar (docs do Next: useSearchParams).
 */
export default async function Page() {
  await connection();
  return (
    <Suspense fallback={null}>
      <ExploreScreen />
    </Suspense>
  );
}
