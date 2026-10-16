import type { Metadata } from 'next';
import { FlowScreen } from '@/components/flow/flow-screen';

/** Condição B do experimento, fora da navegação e da busca. */
export const metadata: Metadata = { title: 'Mapa · Career Gap', robots: { index: false, follow: false } };

export default function MapaPage() {
  return <FlowScreen />;
}
