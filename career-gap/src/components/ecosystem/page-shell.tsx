import { EcosystemNav, type SpaceId } from './ecosystem-nav';

/** Moldura comum dos espaços: navegação, título, uma frase de propósito e o conteúdo. */
export function PageShell({
  current,
  title,
  intro,
  children,
}: {
  current?: SpaceId;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-paper px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-[640px]">
        <EcosystemNav current={current} />
        <h1 className="font-serif text-ink mt-7 text-[26px] leading-tight">{title}</h1>
        <p className="text-ink-soft mt-2 text-[14px] leading-relaxed">{intro}</p>
        {children}
      </div>
    </main>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif mt-9 text-[12.5px] tracking-[0.12em] text-ink-soft">{children}</h2>
  );
}

/** Estado de espera enquanto o navegador é lido — o perfil vive no `localStorage`. */
export function Loading() {
  return <p className="text-ink-faint mt-8 text-[14px]">Carregando…</p>;
}
