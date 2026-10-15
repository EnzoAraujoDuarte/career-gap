import { FIRST_WEB_ROLE } from '@/catalog/tracks';
import { SelfAssessment } from '@/components/onboarding/self-assessment';

export default function AvaliacaoPage() {
  return <SelfAssessment track={FIRST_WEB_ROLE} />;
}
