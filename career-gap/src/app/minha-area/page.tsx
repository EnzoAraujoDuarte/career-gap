import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MyAreaScreen } from '@/components/me/my-area-screen';

export const metadata: Metadata = { title: 'Minha área · Career Gap' };

/** Suspense porque a navegação lê `?perfil=` (docs do Next: useSearchParams em prerender). */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <MyAreaScreen />
    </Suspense>
  );
}
