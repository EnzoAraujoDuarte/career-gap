import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PathScreen } from '@/components/path/path-screen';

export const metadata: Metadata = { title: 'Trilha · Career Gap' };

/** Suspense porque a tela lê `?perfil=` (docs do Next: useSearchParams em prerender). */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <PathScreen />
    </Suspense>
  );
}
