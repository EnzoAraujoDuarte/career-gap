import type { Metadata } from 'next';
import { MyAreaScreen } from '@/components/me/my-area-screen';

export const metadata: Metadata = { title: 'Minha área · Career Gap' };

export default function Page() {
  return <MyAreaScreen />;
}
