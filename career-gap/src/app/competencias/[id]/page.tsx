import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import { CompetencyScreen } from '@/components/path/competency-screen';

const inTrack = (id: string) =>
  FIRST_WEB_ROLE.requirements.some((requirement) => requirement.competency === id);

export function generateStaticParams() {
  return FIRST_WEB_ROLE.requirements.map((requirement) => ({ id: requirement.competency }));
}

export async function generateMetadata({ params }: PageProps<'/competencias/[id]'>): Promise<Metadata> {
  const { id } = await params;
  return { title: `${CATALOG.competencies.get(id)?.name ?? 'Competência'} · Career Gap` };
}

/** Suspense porque a tela lê `?perfil=` (docs do Next: useSearchParams em prerender). */
export default async function Page({ params }: PageProps<'/competencias/[id]'>) {
  const { id } = await params;
  if (!inTrack(id)) notFound();
  return (
    <Suspense fallback={null}>
      <CompetencyScreen id={id} />
    </Suspense>
  );
}
