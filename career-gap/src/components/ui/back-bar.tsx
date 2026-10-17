'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * A volta de uma página de detalhe. No celular é a barra de navegação de um app: presa ao topo,
 * com o "voltar" sempre a um toque e, quando o título grande sai da tela, o nome volta pequeno no
 * meio da barra (HIG Toolbars). No computador continua o link discreto de sempre.
 *
 * `ready` refaz a observação quando o título só aparece depois de ler o perfil.
 */
export function BackBar({
  href,
  label,
  place,
  title,
  titleId,
  ready = true,
  onNavigate,
}: {
  href: string;
  /** Para onde volta, curto: "Trilha". */
  label: string;
  /** O resto do caminho, só no computador, onde cabe: "Fundamentos". */
  place?: string;
  title: string;
  titleId: string;
  ready?: boolean;
  onNavigate?: () => void;
}) {
  const [titleAway, setTitleAway] = useState(false);
  useEffect(() => {
    const heading = document.getElementById(titleId);
    if (!ready || !heading) return;
    const observer = new IntersectionObserver(([entry]) =>
      setTitleAway(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(heading);
    return () => observer.disconnect();
  }, [titleId, ready]);

  return (
    <div className="border-rule bg-paper sticky top-0 z-20 -mx-4 grid min-h-12 grid-cols-[6rem_minmax(0,1fr)_6rem] items-center border-b sm:static sm:mx-0 sm:mt-7 sm:block sm:min-h-0 sm:border-0">
      <Link
        href={href}
        // Sem rolar para o topo: quem decide onde parar é a volta guardada (lib/scroll-memory).
        scroll={false}
        onClick={onNavigate}
        className="text-ink-soft hover:text-ink focus-visible:outline-attention inline-flex min-h-11 items-center gap-0.5 pl-2 text-[15px] focus-visible:outline-2 focus-visible:-outline-offset-2 sm:min-h-0 sm:py-1 sm:pl-0 sm:text-[13px]"
      >
        <svg width={22} height={22} viewBox="0 0 22 22" className="sm:hidden" aria-hidden>
          <path
            d="M13.5 4.5L7 11l6.5 6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="hidden sm:inline">← </span>
        {label}
        {place && <span className="hidden sm:inline"> · {place}</span>}
      </Link>
      <span
        aria-hidden
        className={`text-ink truncate px-1 text-center text-[1.0625rem] font-medium transition-opacity duration-200 sm:hidden ${
          titleAway ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {title}
      </span>
    </div>
  );
}
