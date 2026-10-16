import type { Metadata } from 'next';
import { EvaluationScreen } from '@/components/pesquisa/evaluation-screen';

/** Para quem está testando o site, não para a busca. */
export const metadata: Metadata = {
  title: 'Pesquisa · Career Gap',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <EvaluationScreen />;
}
