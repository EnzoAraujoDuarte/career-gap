'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import type { Resource } from '@/domain/model';
import type { SocialProvider } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';
import { clearCriteria } from '@/lib/criteria-storage';
import { clearGoals, saveGoals, useGoals } from '@/lib/goals-storage';
import { clearDraft, useStoredDraft } from '@/lib/profile-storage';
import { clearProgress, useProgress } from '@/lib/progress-storage';
import { disableRemote } from '@/lib/remote-push';
import { BUILD_PROGRESS_PREFIX, type Goals, type ResourceProgress } from '@/lib/user-state';
import { deleteMyData } from '@/server/user-state-actions';
import { Loading, PageShell, SectionLabel } from '@/components/ecosystem/page-shell';
import { usePersistence } from '@/components/persistence/persistence';
import { BuildGlyph } from '@/components/ui/build-glyph';
import { ResourceLine } from '@/components/ui/resource-line';

const RESOURCES = new Map(CATALOG.resources.map((resource) => [resource.id, resource]));
const BUILDS = new Map(CATALOG.builds.map((build) => [build.id, build]));

const PROVIDER_LABEL: Record<SocialProvider, string> = { google: 'Google', github: 'GitHub' };

/**
 * O que é da pessoa — como o "Jump Back In / Watchlist / Completed" do Laracasts, mais o porquê
 * e a meta dela. Não há agenda: quando estudar é decisão de quem estuda.
 */
export function MyAreaScreen() {
  const progress = useProgress();
  const goals = useGoals();
  const draft = useStoredDraft();
  const answered = Boolean(draft);
  const stack = FIRST_WEB_ROLE.stacks.find((option) => option.technology === draft?.technologyId);

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
          <BuiltList progress={progress ?? {}} />
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
      {answered && (
        <p className="text-ink-soft mt-2 text-[13px] leading-relaxed">
          Linguagem do servidor: <span className="text-ink">{stack?.name ?? 'ainda não escolhida'}</span>. O caminho
          é o mesmo em qualquer stack; a escolha só reordena os materiais.{' '}
          <Link href="/trilha#nivel-build-and-ship" className="text-now underline underline-offset-2">
            Escolher na trilha
          </Link>
        </p>
      )}

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

/** As construções terminadas: a prova concreta de que a pessoa já faz, antes de qualquer lista. */
function BuiltList({ progress }: { progress: Readonly<Record<string, ResourceProgress>> }) {
  const built = Object.entries(progress)
    .filter(([id, entry]) => id.startsWith(BUILD_PROGRESS_PREFIX) && entry.completedAt)
    .sort(([, a], [, b]) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
    .map(([id, entry]) => ({ build: BUILDS.get(id.slice(BUILD_PROGRESS_PREFIX.length)), at: entry.completedAt! }))
    .filter((item) => item.build);
  return (
    <section>
      <SectionLabel>Construído · {built.length}</SectionLabel>
      {built.length === 0 ? (
        <p className="text-ink-soft mt-2 text-[13px]">
          Quando terminar uma construção da trilha, marque “Construí isto” e ela aparece aqui.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {built.map(({ build, at }) => (
            <li key={build!.id} className="flex items-start gap-3">
              <BuildGlyph kind={build!.kind} size={36} className="text-ink shrink-0" />
              <div className="min-w-0">
                <Link
                  href={`/construir/${build!.id}`}
                  className="text-ink focus-visible:outline-attention text-[14.5px] font-medium underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                >
                  {build!.title}
                </Link>
                <p className="text-ink-soft mt-0.5 text-[12.5px]">
                  em {new Date(at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
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
