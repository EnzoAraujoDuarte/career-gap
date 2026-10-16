import type { Metadata } from 'next';
import { CATALOG } from '@/catalog';
import { FIRST_WEB_ROLE } from '@/catalog/tracks';
import { ProfileConfirmation, type ProfileGroup } from '@/components/onboarding/profile-confirmation';

export const metadata: Metadata = { title: 'Ajustar o que já sei · Career Gap' };

export default function PerfilPage() {
  const targetOf = new Map(FIRST_WEB_ROLE.requirements.map((item) => [item.competency, item.targetLevel]));
  const groups: ProfileGroup[] = FIRST_WEB_ROLE.path.map((level) => ({
    title: level.title,
    rows: level.competencies.map((competency) => ({
      competency,
      name: CATALOG.competencies.get(competency)?.name ?? competency,
      targetLevel: targetOf.get(competency) ?? 'L1',
    })),
  }));

  return <ProfileConfirmation groups={groups} />;
}
