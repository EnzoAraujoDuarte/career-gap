'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import type { PortfolioFacet, Resource, UserProfile } from '@/domain/model';
import type { BuildStatus } from '@/domain/builds';
import { buildBuildsView, portfolioView } from '@/lib/builds-view';
import { useCurrentProfile } from '@/lib/current-profile';
import type { SocialProvider } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';
import { clearCriteria } from '@/lib/criteria-storage';
import { clearGoals, saveGoals, useGoals } from '@/lib/goals-storage';
import { clearDraft, useStoredDraft } from '@/lib/profile-storage';
import { clearProgress, useProgress } from '@/lib/progress-storage';
import { disableRemote } from '@/lib/remote-push';
import type { Goals, ResourceProgress } from '@/lib/user-state';
import { deleteMyData } from '@/server/user-state-actions';
import { Loading, PageShell, SectionLabel } from '@/components/ecosystem/page-shell';
import { usePersistence } from '@/components/persistence/persistence';
import { BuildGlyph } from '@/components/ui/build-glyph';
import { ResourceLine } from '@/components/ui/resource-line';

const RESOURCES = new Map(CATALOG.resources.map((resource) => [resource.id, resource]));

const PROVIDER_LABEL: Record<SocialProvider, string> = { google: 'Google', github: 'GitHub' };

/**
 * O que é da pessoa — como o "Jump Back In / Watchlist / Completed" do Laracasts, mais o porquê
 * e a meta dela. Não há agenda: quando estudar é decisão de quem estuda.
 */
export function MyAreaScreen() {
  const { profile } = useCurrentProfile();
  const progress = useProgress();
  const goals = useGoals();
  const answered = Boolean(useStoredDraft());

  return (
    <PageShell
      current="minha-area"
      title="Minha área"
      intro="O que você guardou, começou e terminou, e por que está fazendo isso. Estude quando e como quiser."
    >
      <Account />

      {progress === undefined || goals === undefined ? (
        <Loading />
      ) : (
        <>
          <Portfolio profile={profile ?? null} progress={progress ?? {}} />
          <ResourceList
            title="Continuar"
            empty="Abra qualquer recurso na trilha ou no Explorar e ele aparece aqui."
            entries={pick(progress ?? {}, (entry) => Boolean(entry.startedAt && !entry.completedAt), 'startedAt')}
          />
          <ResourceList
            title="Minha lista"
            empty="Use “+ minha lista” em qualquer recurso para guardar para depois."
            entries={pick(progress ?? {}, (entry) => Boolean(entry.savedAt && !entry.completedAt), 'savedAt')}
          />
          <ResourceList
            title="Concluídos"
            empty="Nada concluído ainda."
            entries={pick(progress ?? {}, (entry) => Boolean(entry.completedAt), 'completedAt')}
          />
          {/* A chave remonta o formulário quando as metas mudam de fora (outra aba, sincronização). */}
          <GoalsForm key={goals?.updatedAt ?? 'new'} initial={goals ?? undefined} />
          {/* Fora do formulário de propósito: ele é recriado a cada gravação, e um aviso dentro
              dele sumiria antes de ser lido ou anunciado. */}
          <p className="text-done mt-2 text-[13px]" aria-live="polite">
            {goals && `Guardado às ${new Date(goals.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`}
          </p>
        </>
      )}

      <SectionLabel>O que você já sabe</SectionLabel>
      <p className="text-ink-soft mt-1 text-[13px] leading-relaxed">
        Concluir um recurso não muda o seu nível, porque assistir não é saber fazer. Quando sentir que
        avançou, ajuste.
      </p>
      <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[14px]">
        <Link href="/perfil" className="text-now underline underline-offset-2">
          Ajustar competência por competência
        </Link>
        <Link href="/avaliacao" className="text-now underline underline-offset-2">
          {answered ? 'Refazer as 6 perguntas' : 'Responder as 6 perguntas'}
        </Link>
      </p>

      <Research />

      <YourData />
    </PageShell>
  );
}

/** Mais recente primeiro: é o que a pessoa provavelmente quer retomar. */
function pick(
  progress: Readonly<Record<string, ResourceProgress>>,
  include: (entry: ResourceProgress) => boolean,
  by: 'startedAt' | 'savedAt' | 'completedAt',
): Resource[] {
  return Object.entries(progress)
    .filter(([id, entry]) => RESOURCES.has(id) && include(entry))
    .sort(([, a], [, b]) => (b[by] ?? '').localeCompare(a[by] ?? ''))
    .map(([id]) => RESOURCES.get(id)!);
}

/** Rótulos do portfólio, pelo que cada construção prova a quem contrata. */
const FACET_LABEL: Record<PortfolioFacet, string> = {
  fundamentals: 'Fundamentos',
  frontend: 'Front-end',
  backend: 'Back-end',
  design: 'Design',
  ai: 'IA',
  collaboration: 'Colaboração',
};

const STATUS_LABEL: Record<BuildStatus, string> = {
  ready: 'dá para fazer agora',
  'one-away': 'a um passo',
  later: 'mais adiante',
  built: 'feita',
};

/**
 * O portfólio: as construções feitas, agrupadas pelo que provam, com a frase para o currículo.
 * Variedade é a régua, e o que falta é anotado com a construção mais perto; nada é trancado.
 */
function Portfolio({ profile, progress }: { profile: UserProfile | null; progress: Readonly<Record<string, ResourceProgress>> }) {
  const groups = portfolioView(buildBuildsView(CATALOG, FIRST_WEB_ROLE, profile, progress));
  // Uma construção pode provar duas facetas; conta-se cada uma uma vez.
  const builtTotal = new Set(groups.flatMap((group) => group.built.map((item) => item.build.id))).size;
  return (
    <section>
      <SectionLabel>Seu portfólio · {builtTotal === 0 ? 'nada ainda' : builtTotal === 1 ? '1 construção' : `${builtTotal} construções`}</SectionLabel>
      <p className="text-ink-soft mt-1 text-[13px] leading-relaxed">
        O que você já construiu, agrupado pelo que prova a quem contrata. Qualidade primeiro,
        variedade depois, e as duas valem mais que quantidade: um projeto de back-end, um de
        front-end, um com design, um com IA, todos bem feitos. Cada construção feita traz a frase
        para o currículo e o LinkedIn; na entrevista, a pergunta é “posso te mostrar um pouco do que
        já construí?”.
      </p>
      <ul className="divide-rule mt-3 divide-y">
        {groups.map((group) => (
          <li key={group.facet} className="py-3">
            <p className="flex flex-wrap items-baseline gap-x-2.5">
              <span className="text-ink text-[14.5px] font-medium">{FACET_LABEL[group.facet]}</span>
              {group.built.length > 0 ? (
                <span className="hand text-done text-[13.5px]">✓ você já prova</span>
              ) : (
                <span className="text-ink-faint text-[12.5px]">ainda nada que prove</span>
              )}
            </p>
            {group.built.length > 0 ? (
              <ul className="mt-1.5 space-y-2">
                {group.built.map((item) => (
                  <li key={item.build.id} className="flex items-start gap-3">
                    <BuildGlyph kind={item.build.kind} size={30} className="text-ink shrink-0" />
                    <div className="min-w-0">
                      <Link
                        href={`/construir/${item.build.id}`}
                        className="text-ink focus-visible:outline-attention text-[14px] font-medium underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                      >
                        {item.build.title}
                      </Link>
                      <p className="text-ink-soft mt-0.5 text-[13px] leading-snug">
                        <span className="text-ink-faint">Para o currículo: </span>
                        {item.build.pitch}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              group.next && (
                <p className="text-ink-soft mt-1 text-[13px] leading-snug">
                  A mais perto:{' '}
                  <Link
                    href={`/construir/${group.next.build.id}`}
                    className="text-ink underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)]"
                  >
                    {group.next.build.title}
                  </Link>
                  {profile && (
                    <>
                      {' · '}
                      <span className={group.next.status === 'ready' ? 'text-done' : 'text-ink-faint'}>
                        {STATUS_LABEL[group.next.status]}
                      </span>
                    </>
                  )}
                </p>
              )
            )}
          </li>
        ))}
      </ul>
      <p className="text-ink-soft mt-3 text-[13px] leading-relaxed">
        Quando terminar uma construção, marque “Construí isto” na página dela e ela entra aqui.{' '}
        <Link href="/carta" className="text-now underline underline-offset-2">
          Por que isso importa agora
        </Link>
      </p>
    </section>
  );
}

function ResourceList({ title, empty, entries }: { title: string; empty: string; entries: readonly Resource[] }) {
  return (
    <section>
      <SectionLabel>
        {title} · {entries.length}
      </SectionLabel>
      {entries.length === 0 ? (
        <p className="text-ink-soft mt-2 text-[13px]">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-5">
          {entries.map((resource) => (
            <li key={resource.id}>
              <ResourceLine resource={resource} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Account() {
  const { status, providers } = usePersistence();
  const session = authClient.useSession();

  if (status === 'off') {
    return (
      <p className="text-ink-soft mt-6 border-l border-[var(--rule)] pl-3 text-[13px] leading-relaxed">
        Seu progresso fica salvo neste navegador.
      </p>
    );
  }
  if (status === 'error') {
    return (
      <p className="text-attention mt-6 border-l border-[var(--state-attention)] pl-3 text-[13px] leading-relaxed">
        Não conseguimos falar com o servidor agora. Seu progresso continua salvo neste navegador e
        sobe quando a conexão voltar.
      </p>
    );
  }

  if (status === 'idle') {
    return (
      <div className="mt-6 border-l border-[var(--rule)] pl-3">
        <p className="text-ink-soft text-[13.5px] leading-relaxed">
          Nada guardado ainda. Quando você responder as perguntas ou marcar um recurso, seu
          progresso também fica salvo no servidor.
        </p>
        <SocialSignIn providers={providers} />
      </div>
    );
  }

  const user = session.data?.user as { name?: string; email?: string; isAnonymous?: boolean | null } | undefined;
  if (status === 'connecting' || session.isPending || !user) return <Loading />;

  if (user.isAnonymous) {
    return (
      <div className="mt-6 border-l border-[var(--state-now)] pl-3">
        <p className="text-ink text-[13.5px] leading-relaxed">
          Seu progresso está salvo neste navegador e no servidor, numa sessão sem nome nem e-mail.
          {providers.length > 0
            ? ' Entre com uma conta para levá-lo a outro aparelho — o que você já fez vai junto.'
            : ' Ele continua aqui enquanto você não apagar os dados do navegador.'}
        </p>
        <SocialSignIn providers={providers} />
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2 border-l border-[var(--state-done)] pl-3">
      <p className="text-ink text-[13.5px]">
        Conectado como <strong className="font-medium">{user.name || user.email}</strong>. Seu
        progresso vai com você para qualquer aparelho.
      </p>
      <button
        onClick={signOut}
        className="text-ink-soft hover:text-ink focus-visible:outline-attention text-[13px] underline focus-visible:outline-2"
      >
        sair
      </button>
    </div>
  );
}

function clearLocalState() {
  disableRemote();
  clearDraft();
  clearGoals();
  clearProgress();
  clearCriteria();
}

function SocialSignIn({ providers }: { providers: readonly SocialProvider[] }) {
  if (providers.length === 0) return null;
  return (
    <p className="mt-2 flex flex-wrap gap-2">
      {providers.map((provider) => (
        <button
          key={provider}
          onClick={() => authClient.signIn.social({ provider, callbackURL: '/minha-area' })}
          className="focus-visible:outline-attention rounded-sm border border-[var(--ink)] px-3 py-1.5 text-[13.5px] text-ink hover:bg-paper-edge focus-visible:outline-2"
        >
          Entrar com {PROVIDER_LABEL[provider]}
        </button>
      ))}
    </p>
  );
}

/** Num computador compartilhado, sair precisa levar junto o que está no navegador. */
async function signOut() {
  clearLocalState();
  await authClient.signOut();
  // Recarga completa de propósito: zera a sessão no cliente, e o provedor cria uma anônima nova.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign('/trilha');
}

function GoalsForm({ initial }: { initial?: Goals }) {
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    saveGoals({
      purpose: String(form.get('purpose') ?? '').trim(),
      careerGoal: String(form.get('careerGoal') ?? '').trim(),
      targetMonth: String(form.get('targetMonth') ?? '') || undefined,
    });
  }

  const field = 'mt-1 w-full rounded-sm border border-[var(--rule)] bg-paper px-2.5 py-2 text-[14px] text-ink';
  return (
    <section>
      <SectionLabel>Seu porquê e sua meta</SectionLabel>
      {initial?.purpose && (
        <p className="text-ink mt-3 border-l border-[var(--state-now)] pl-3 text-[15px] leading-relaxed">
          {initial.purpose}
        </p>
      )}
      <form onSubmit={submit} className="mt-3 space-y-4">
        <label className="block text-[13.5px] text-ink">
          Por que você quer isso?
          <textarea name="purpose" defaultValue={initial?.purpose} rows={3} maxLength={1000} className={field} />
        </label>
        <label className="block text-[13.5px] text-ink">
          Aonde quer chegar?
          <input
            name="careerGoal"
            defaultValue={initial?.careerGoal}
            maxLength={1000}
            className={field}
            placeholder="ex.: minha primeira vaga como dev front-end"
          />
        </label>
        <label className="block text-[13.5px] text-ink">
          Até quando?
          <input name="targetMonth" type="month" defaultValue={initial?.targetMonth} className={field} />
        </label>
        <button
          type="submit"
          className="focus-visible:outline-attention rounded-sm bg-[var(--ink)] px-4 py-2.5 text-[14px] text-[var(--paper)] focus-visible:outline-2"
        >
          {initial ? 'Atualizar' : 'Guardar'}
        </button>
      </form>
    </section>
  );
}

/** O convite à pesquisa do TCC. Fica aqui, e não na trilha principal, porque é um pedido ao
 *  testador, não parte do estudo dele. */
function Research() {
  return (
    <section>
      <SectionLabel>Pesquisa do TCC</SectionLabel>
      <p className="text-ink-soft mt-1 text-[13px] leading-relaxed">
        Está testando o Career Gap? Conte como foi: uns 5 minutos de perguntas sobre a trilha e o site,
        sem nome nem e-mail. É o que vira dado no trabalho.
      </p>
      <Link href="/pesquisa" className="text-now mt-2 inline-block text-[14px] underline underline-offset-2">
        Responder ao questionário
      </Link>
    </section>
  );
}

/** O que o Career Gap guarda, e o botão para apagar tudo (LGPD, art. 18, VI). */
function YourData() {
  const { status } = usePersistence();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [failed, setFailed] = useState(false);
  // O foco acompanha a troca: ao abrir, vai para a confirmação (senão cai no body, com o
  // aviso abaixo da dobra); ao cancelar, volta para o botão que a abriu.
  const opener = useRef<HTMLButtonElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  const toggled = useRef(false);
  useEffect(() => {
    if (!toggled.current) return;
    if (confirming) {
      confirmation.current?.focus();
      confirmation.current?.scrollIntoView({ block: 'nearest' });
    } else {
      opener.current?.focus();
    }
  }, [confirming]);
  const toggle = (next: boolean) => {
    toggled.current = true;
    setConfirming(next);
  };

  async function erase() {
    setDeleting(true);
    setFailed(false);
    // Primeiro o servidor: se falhar, nada some do navegador e a pessoa pode tentar de novo.
    try {
      if (status === 'on') await deleteMyData();
    } catch {
      setDeleting(false);
      setFailed(true);
      return;
    }
    clearLocalState();
    // Recarga completa: zera o estado em memória e, com banco, começa uma sessão anônima nova.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign('/trilha');
  }

  return (
    <section>
      <SectionLabel>Seus dados</SectionLabel>
      <p className="text-ink-soft mt-1 text-[13px] leading-relaxed">
        O que guardamos, para quê e por quanto tempo está na{' '}
        <Link href="/privacidade" className="text-now underline underline-offset-2">
          página de privacidade
        </Link>
        .
      </p>
      {!confirming ? (
        <button
          ref={opener}
          onClick={() => toggle(true)}
          className="text-critical focus-visible:outline-attention mt-2 py-1 text-[13.5px] underline underline-offset-2 focus-visible:outline-2"
        >
          Apagar meus dados
        </button>
      ) : (
        <div
          ref={confirmation}
          tabIndex={-1}
          role="group"
          aria-label="Confirmar: apagar meus dados"
          className="mt-3 border-l border-[var(--state-critical)] pl-3 focus:outline-none"
        >
          <p className="text-ink text-[13.5px] leading-relaxed">
            Isso apaga o que você respondeu, suas metas, sua lista, o que concluiu, os critérios
            marcados e, se respondeu, o questionário da pesquisa
            {status === 'on' ? ', neste navegador e no servidor' : ', neste navegador'}. Não tem volta.
          </p>
          {failed && (
            <p className="text-critical mt-2 text-[13px]" role="alert">
              Não conseguimos apagar no servidor agora. Nada foi apagado; tente de novo em instantes.
            </p>
          )}
          <p className="mt-2 flex flex-wrap gap-3">
            <button
              onClick={erase}
              disabled={deleting}
              className="focus-visible:outline-attention rounded-sm bg-[var(--state-critical)] px-3 py-1.5 text-[13.5px] text-[var(--paper)] focus-visible:outline-2 disabled:opacity-60"
            >
              {deleting ? 'Apagando…' : 'Apagar tudo'}
            </button>
            <button
              onClick={() => toggle(false)}
              disabled={deleting}
              className="text-ink-soft hover:text-ink focus-visible:outline-attention text-[13.5px] focus-visible:outline-2"
            >
              Cancelar
            </button>
          </p>
        </div>
      )}
    </section>
  );
}
