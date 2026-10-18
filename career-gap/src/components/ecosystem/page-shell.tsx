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
    <main className="min-h-dvh bg-paper">
      <EcosystemNav current={current} />
      {/* A coluna de leitura (640px) começa na mesma margem da barra e da trilha: o título não
          pula de lugar ao trocar de página. */}
      <div className="mx-auto max-w-[1040px] px-4 pb-12 sm:px-6">
        <div className="max-w-[640px]">
          <h1 className="font-serif text-ink mt-7 text-[26px] leading-tight">{title}</h1>
          <p className="text-ink-soft mt-2 max-w-[65ch] text-[14px] leading-relaxed">{intro}</p>
          {children}
        </div>
      </div>
    </main>
  );
}

/** Título de seção. Na tinta e acima do corpo: em 13,5px e cinza ele ficava menor que o texto
 *  que anunciava, e a página perdia o esqueleto (auditoria de 2026-10-17). */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-ink mt-10 text-[18px] leading-snug">{children}</h2>;
}

/** Estado de espera enquanto o navegador é lido — o perfil vive no `localStorage`. */
export function Loading() {
  return <p className="text-ink-faint mt-8 text-[14px]">Carregando…</p>;
}
