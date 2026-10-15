import { CATALOG } from '@/catalog';
import { FIRST_WEB_ROLE } from '@/catalog/tracks';
import { ProfileConfirmation, type ProfileRow } from '@/components/onboarding/profile-confirmation';

export default function PerfilPage() {
  const rows: ProfileRow[] = FIRST_WEB_ROLE.requirements.map((requirement) => ({
    competency: requirement.competency,
    name: CATALOG.competencies.get(requirement.competency)?.name ?? requirement.competency,
    targetLevel: requirement.targetLevel,
  }));

  return <ProfileConfirmation rows={rows} />;
}
