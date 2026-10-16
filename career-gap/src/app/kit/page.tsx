import type { Metadata } from 'next';
import { KitScreen } from '@/components/kit/kit-screen';

export const metadata: Metadata = {
  title: 'Kit de desenvolvimento profissional · Career Gap',
  description:
    'As ferramentas, as skills e os sites que o autor usa no trabalho, para quem já começou a criar alguma coisa. Um comando, você marca o que quer.',
};

export default function Page() {
  return <KitScreen />;
}
