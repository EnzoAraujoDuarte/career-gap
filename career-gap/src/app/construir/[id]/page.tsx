import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BUILDS } from '@/catalog';
import { BuildScreen } from '@/components/path/build-screen';

export function generateStaticParams() {
  return BUILDS.map((build) => ({ id: build.id }));
}

export async function generateMetadata({ params }: PageProps<'/construir/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const build = BUILDS.find((candidate) => candidate.id === id);
  return {
    title: `${build?.title ?? 'Construção'} · Career Gap`,
    description: build?.result,
  };
}

export default async function Page({ params }: PageProps<'/construir/[id]'>) {
  const { id } = await params;
  if (!BUILDS.some((build) => build.id === id)) notFound();
  return <BuildScreen id={id} />;
}
