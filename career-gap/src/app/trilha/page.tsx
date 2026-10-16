import type { Metadata } from 'next';
import { PathScreen } from '@/components/path/path-screen';

export const metadata: Metadata = { title: 'Trilha · Career Gap' };

export default function Page() {
  return <PathScreen />;
}
