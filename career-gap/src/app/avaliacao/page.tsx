import type { Metadata } from 'next';
import { FIRST_WEB_ROLE } from '@/catalog/tracks';
import { SelfAssessment } from '@/components/onboarding/self-assessment';

export const metadata: Metadata = { title: 'O que você já sabe · Career Gap' };

export default function AvaliacaoPage() {
  return <SelfAssessment track={FIRST_WEB_ROLE} />;
}
