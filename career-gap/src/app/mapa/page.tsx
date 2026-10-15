import { Suspense } from 'react';
import { FlowScreen } from '@/components/flow/flow-screen';

/** Suspense porque o mapa lê `?perfil=` (docs do Next: useSearchParams em prerender). */
export default function MapaPage() {
  return (
    <Suspense fallback={null}>
      <FlowScreen />
    </Suspense>
  );
}
