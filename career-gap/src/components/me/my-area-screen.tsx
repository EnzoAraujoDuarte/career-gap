'use client';

import Link from 'next/link';
import { CATALOG } from '@/catalog';
import type { Resource } from '@/domain/model';
import type { SocialProvider } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';
import { clearCriteria } from '@/lib/criteria-storage';
import { clearGoals, saveGoals, useGoals } from '@/lib/goals-storage';
import { clearDraft } from '@/lib/profile-storage';
import { clearProgress, useProgress } from '@/lib/progress-storage';
import { disableRemote } from '@/lib/remote-push';
import type { Goals, ResourceProgress } from '@/lib/user-state';
import { Loading, PageShell, SectionLabel } from '@/components/ecosystem/page-shell';
import { usePersistence } from '@/components/persistence/persistence';
import { ResourceLine } from '@/components/ui/resource-line';

const RESOURCES = new Map(CATALOG.resources.map((resource) => [resource.id, resource]));

const PROVIDER_LABEL: Record<SocialProvider, string> = { google: 'Google', github: 'GitHub' };

/**
 * O que é da pessoa — como o "Jump Back In / Watchlist / Completed" do Laracasts, mais o porquê
 * e a meta dela. Não há agenda: quando estudar é decisão de quem estuda.
 */
export function MyAreaScreen() {
  const progress = useProgress();
  const goals = useGoals();

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
        </>
      )}

      <SectionLabel>O que você já sabe</SectionLabel>
      <p className="text-ink-soft mt-1 text-[13px] leading-relaxed">
        Concluir um recurso não muda o seu nível — assistir não é saber fazer. Quando sentir que
        avançou, ajuste.
      </p>
      <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[14px]">
        <Link href="/perfil" className="text-now underline underline-offset-2">
          Ajustar competência por competência
        </Link>
        <Link href="/avaliacao" className="text-now underline underline-offset-2">
          Refazer as 6 perguntas
        </Link>
      </p>

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
      <p className="text-ink-soft mt-6 border-l-2 border-[var(--rule)] pl-3 text-[13px] leading-relaxed">
        Seu progresso fica salvo neste navegador.
      </p>
    );
  }
  if (status === 'error') {
    return (
      <p className="text-attention mt-6 border-l-2 border-[var(--state-attention)] pl-3 text-[13px] leading-relaxed">
        Não conseguimos falar com o servidor agora. Seu progresso continua salvo neste navegador e
        sobe quando a conexão voltar.
      </p>
    );
  }

  const user = session.data?.user as { name?: string; email?: string; isAnonymous?: boolean | null } | undefined;
  if (status === 'connecting' || session.isPending || !user) return <Loading />;

  if (user.isAnonymous) {
    return (
      <div className="mt-6 border-l-2 border-[var(--state-now)] pl-3">
        <p className="text-ink text-[13.5px] leading-relaxed">
          Seu progresso está salvo, mas só neste aparelho.
          {providers.length > 0 && ' Entre para levá-lo junto — o que você já fez vai junto também.'}
        </p>
        {providers.length > 0 && (
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
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2 border-l-2 border-[var(--state-done)] pl-3">
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
        <p className="text-ink mt-3 border-l-2 border-[var(--state-now)] pl-3 text-[15px] leading-relaxed">
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

