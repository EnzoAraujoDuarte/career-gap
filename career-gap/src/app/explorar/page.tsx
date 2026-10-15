import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ExploreScreen } from '@/components/explore/explore-screen';

export const metadata: Metadata = { title: 'Explorar · Career Gap' };

/** Suspense porque os filtros vivem na URL (docs do Next: useSearchParams em prerender). */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <ExploreScreen />
    </Suspense>
  );
}
