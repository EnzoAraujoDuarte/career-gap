'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { StoredEvaluation } from '@/db/evaluation';
import { authClient } from '@/lib/auth-client';
import {
  CAREER_GAP_ITEMS,
  CHOICE_QUESTIONS,
  LIKERT_ITEMS,
  LIKERT_SCALE,
  MAX_COMMENT,
  OPEN_QUESTIONS,
  OUTCOME_QUESTIONS,
  PARTICIPANT_QUESTIONS,
  PATH_ITEMS,
  SUS_ITEMS,
  USAGE_QUESTIONS,
  type ChoiceQuestion,
  type EvaluationAnswers,
  type LikertItem,
} from '@/lib/evaluation';
import { myEvaluation, submitEvaluation } from '@/server/evaluation-actions';
import { Loading, PageShell, SectionLabel } from '@/components/ecosystem/page-shell';
import { usePersistence } from '@/components/persistence/persistence';

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

type Status = 'idle' | 'sending' | 'sent' | 'invalid' | 'failed';

/**
 * O questionário da pesquisa do TCC. Os itens vêm de
 * `lib/evaluation.ts`; aqui só a tela. Precisa do servidor: sem banco, não há onde guardar.
 */
export function EvaluationScreen() {
  const persistence = usePersistence();
  const [existing, setExisting] = useState<StoredEvaluation | null | undefined>(undefined);
  const [status, setStatus] = useState<Status>('idle');
  const [sentAt, setSentAt] = useState<string | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  // A resposta anterior vem do servidor: estado externo, lido uma vez ao montar. Sem banco a
  // tela nem chega a usar `existing`, então não há o que carregar.
  useEffect(() => {
    if (persistence.status === 'off') return;
    let cancelled = false;
    myEvaluation()
      .then((response) => !cancelled && setExisting(response))
      .catch(() => !cancelled && setExisting(null));
    return () => {
      cancelled = true;
    };
  }, [persistence.status]);

  useEffect(() => {
    if (status === 'sent') heading.current?.focus();
  }, [status]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload: EvaluationAnswers = {
      consent: form.get('consent') === 'on',
      participant: Object.fromEntries(CHOICE_QUESTIONS.map((question) => [question.id, String(form.get(`p:${question.id}`) ?? '')])),
      answers: Object.fromEntries(LIKERT_ITEMS.map((item) => [item.id, Number(form.get(`a:${item.id}`))])),
      comments: Object.fromEntries(OPEN_QUESTIONS.map((question) => [question.id, String(form.get(`c:${question.id}`) ?? '')])),
    };
    setStatus('sending');
    try {
      // Quem só olhou o site ainda não tem sessão; a resposta precisa de uma, e a anônima basta.
      const session = await authClient.getSession();
      if (!session.data) {
        const anonymous = await authClient.signIn.anonymous();
        if (anonymous.error) throw new Error(anonymous.error.message);
      }
      const result = await submitEvaluation(payload);
      if (!result.ok) {
        setStatus(result.reason === 'invalid' ? 'invalid' : 'failed');
        return;
      }
      setSentAt(result.submittedAt);
      setExisting((previous) => ({
        instrumentVersion: previous?.instrumentVersion ?? '',
        catalogVersion: previous?.catalogVersion ?? '',
        consentAt: result.submittedAt,
        context: previous?.context ?? { hasProfile: false, levels: {}, recommended: [], built: 0, completedResources: 0 },
        submittedAt: result.submittedAt,
        participant: payload.participant,
        answers: payload.answers,
        comments: payload.comments,
      }));
      setEditing(false);
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <PageShell
      current="minha-area"
      title="Conte como foi"
      intro="Uns 5 minutos: como foi usar o Career Gap e o que você leva dele. É o que vira dado no TCC. Sem nome nem e-mail."
    >
      {persistence.status === 'off' ? (
        <p className="text-ink-soft mt-6 border-l border-[var(--rule)] pl-3 text-[13.5px] leading-relaxed">
          Neste ambiente o servidor está desligado, e o questionário não tem onde ser guardado.
        </p>
      ) : existing === undefined ? (
        <Loading />
      ) : status === 'sent' && !editing ? (
        <section className="mt-6 border-l border-[var(--state-done)] pl-3" aria-live="polite">
          <h2 ref={heading} tabIndex={-1} className="font-serif text-ink text-[20px] leading-tight focus:outline-none">
            Obrigado.
          </h2>
          <p className="text-ink mt-2 text-[14px] leading-relaxed">
            Suas respostas foram guardadas
            {sentAt && ` às ${new Date(sentAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}.
            Elas ficam ligadas à sua sessão anônima; apagar seus dados em Minha área apaga as respostas também.
          </p>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[14px]">
            <Link href="/trilha" className="text-now underline underline-offset-2">
              Voltar à trilha
            </Link>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-ink-soft hover:text-ink focus-visible:outline-attention underline underline-offset-2 focus-visible:outline-2"
            >
              Mudar alguma resposta
            </button>
          </p>
        </section>
      ) : (
        <form onSubmit={submit} className="mt-2">
          {existing && status !== 'sent' && (
            <p className="text-ink-soft mt-6 border-l border-[var(--state-done)] pl-3 text-[13.5px] leading-relaxed">
              Você já respondeu em{' '}
              {new Date(existing.submittedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}. Pode
              mudar o que quiser e enviar de novo: a resposta nova substitui a anterior.
            </p>
          )}

          <Consent defaultChecked={Boolean(existing)} />

          <section>
            <SectionLabel>Sobre você</SectionLabel>
            <div className="mt-2 space-y-6">
              {PARTICIPANT_QUESTIONS.map((question) => (
                <ChoiceField key={question.id} question={question} value={existing?.participant[question.id]} />
              ))}
            </div>
          </section>

          <section>
            <SectionLabel>Como foi usar</SectionLabel>
            <div className="mt-2 space-y-6">
              {USAGE_QUESTIONS.map((question) => (
                <ChoiceField key={question.id} question={question} value={existing?.participant[question.id]} />
              ))}
            </div>
          </section>

          <LikertSection
            title="O Career Gap para você"
            intro="Depois de usar o site, o quanto cada frase vale para você."
            items={CAREER_GAP_ITEMS}
            answers={existing?.answers}
          />

          <section>
            <SectionLabel>O que você leva</SectionLabel>
            <div className="mt-2 space-y-6">
              {OUTCOME_QUESTIONS.map((question) => (
                <ChoiceField key={question.id} question={question} value={existing?.participant[question.id]} />
              ))}
            </div>
          </section>

          <LikertSection
            title="A trilha que você recebeu"
            intro="Sobre as marcas da trilha: recomendado agora, você já sabe, não agora."
            items={PATH_ITEMS}
            answers={existing?.answers}
          />

          <LikertSection
            title="O site"
            intro="Sobre usar o site, não sobre o conteúdo."
            items={SUS_ITEMS}
            answers={existing?.answers}
          />

          <section>
            <SectionLabel>Com as suas palavras</SectionLabel>
            <div className="mt-2 space-y-5">
              {OPEN_QUESTIONS.map((question) => (
                <label key={question.id} className="text-ink block text-[14px]">
                  {question.label}
                  {question.hint && <span className="text-ink-soft"> {question.hint}</span>}
                  <textarea
                    name={`c:${question.id}`}
                    defaultValue={existing?.comments[question.id]}
                    rows={3}
                    maxLength={MAX_COMMENT}
                    className="border-rule bg-paper text-ink mt-1 w-full rounded-sm border px-2.5 py-2 text-[14px]"
                  />
                </label>
              ))}
            </div>
          </section>

          <div className="border-rule mt-9 border-t pt-5">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="focus-visible:outline-attention rounded-sm bg-[var(--ink)] px-4 py-2.5 text-[14px] text-[var(--paper)] focus-visible:outline-2 disabled:opacity-60"
            >
              {status === 'sending' ? 'Enviando…' : existing ? 'Enviar de novo' : 'Enviar respostas'}
            </button>
            <p className="mt-3 text-[13px] leading-relaxed" role={status === 'failed' || status === 'invalid' ? 'alert' : undefined}>
              {status === 'failed' && (
                <span className="text-critical">
                  Não conseguimos guardar agora. Suas respostas continuam na tela; tente de novo em instantes.
                </span>
              )}
              {status === 'invalid' && (
                <span className="text-critical">Falta responder algum item. Confira as perguntas marcadas e envie de novo.</span>
              )}
            </p>
          </div>
        </form>
      )}
    </PageShell>
  );
}

/** Termo de consentimento livre e esclarecido, em linguagem comum. A LGPD pede finalidade,
 *  voluntariedade e como retirar o consentimento; está tudo aqui, antes da primeira pergunta. */
function Consent({ defaultChecked }: { defaultChecked: boolean }) {
  return (
    <section>
      <SectionLabel>Termo de consentimento</SectionLabel>
      <div className="text-ink mt-2 max-w-[65ch] space-y-2 text-[14px] leading-relaxed">
        <p>
          Esta pesquisa faz parte do Trabalho de Conclusão de Curso de Enzo Araujo Duarte, em Sistemas de
          Informação na UNESC Colatina. Ela avalia se a trilha do Career Gap ajuda a decidir o que estudar e se o
          site é fácil de usar.
        </p>
        <p>
          Participar é voluntário: você pode parar a qualquer momento, sem prejuízo nenhum. Não pedimos nome nem
          e-mail. As respostas ficam ligadas à mesma sessão anônima que guarda o seu progresso e aparecem no
          trabalho só de forma agregada, junto com as de outras pessoas.
        </p>
        <p>
          Para retirar o consentimento depois, use “Apagar meus dados” em{' '}
          <Link href="/minha-area" className="text-now underline underline-offset-2">
            Minha área
          </Link>
          : as respostas vão junto. O que guardamos e por quanto tempo está na{' '}
          <Link href="/privacidade" className="text-now underline underline-offset-2">
            página de privacidade
          </Link>
          .
          {CONTACT_EMAIL && (
            <>
              {' '}
              Dúvidas:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-now underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
              .
            </>
          )}
        </p>
      </div>
      <label className="text-ink mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-[14px] leading-snug">
        <input
          type="checkbox"
          name="consent"
          required
          defaultChecked={defaultChecked}
          className="focus-visible:outline-attention h-5 w-5 shrink-0 accent-[var(--state-now)] focus-visible:outline-2 sm:h-4 sm:w-4"
        />
        Li o termo e concordo em participar.
      </label>
    </section>
  );
}

function ChoiceField({ question, value }: { question: ChoiceQuestion; value?: string }) {
  return (
    <fieldset>
      <legend className="text-ink text-[14px] leading-snug">{question.label}</legend>
      <div className="mt-1">
        {question.choices.map((choice) => (
          // A linha inteira é o alvo, com 44px de altura: com o dedo, a bolinha de 16px era errar.
          <label key={choice.value} className="text-ink flex min-h-11 cursor-pointer items-center gap-3 py-1 text-[14px] leading-snug">
            <input
              type="radio"
              name={`p:${question.id}`}
              value={choice.value}
              required
              defaultChecked={value === choice.value}
              className="focus-visible:outline-attention h-5 w-5 shrink-0 accent-[var(--state-now)] focus-visible:outline-2 sm:h-4 sm:w-4"
            />
            {choice.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function LikertSection({
  title,
  intro,
  items,
  answers,
}: {
  title: string;
  intro: string;
  items: readonly LikertItem[];
  answers?: Readonly<Record<string, number>>;
}) {
  return (
    <section>
      <SectionLabel>{title}</SectionLabel>
      <p className="text-ink-soft mt-1 max-w-[65ch] text-[13px] leading-relaxed">
        {intro} De <strong className="text-ink font-medium">1, discordo totalmente</strong>, a{' '}
        <strong className="text-ink font-medium">5, concordo totalmente</strong>.
      </p>
      <ol className="divide-rule mt-3 divide-y">
        {items.map((item, index) => (
          <li key={item.id} className="py-3.5">
            <fieldset>
              <legend className="text-ink flex gap-2 text-[14px] leading-snug">
                <span className="text-ink-faint tabular-nums">{index + 1}.</span>
                <span>{item.text}</span>
              </legend>
              <div className="mt-2.5 ml-[26px] flex gap-1.5">
                {LIKERT_SCALE.map((point) => (
                  <label key={point.value} className="relative">
                    <input
                      type="radio"
                      name={`a:${item.id}`}
                      value={point.value}
                      required
                      defaultChecked={answers?.[item.id] === point.value}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className="border-rule text-ink-soft peer-checked:border-now peer-checked:bg-tint-now peer-checked:text-now peer-focus-visible:outline-attention flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm border text-[14px] tabular-nums peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 hover:border-ink-faint"
                    >
                      {point.value}
                    </span>
                    <span className="sr-only">{point.label}</span>
                  </label>
                ))}
              </div>
              {/* O sentido da escala junto de cada item: no celular, o aviso do começo da seção
                  fica três telas acima. */}
              <p aria-hidden className="text-ink-faint mt-1 ml-[26px] flex w-[244px] justify-between text-[12px]">
                <span>discordo</span>
                <span>concordo</span>
              </p>
            </fieldset>
          </li>
        ))}
      </ol>
    </section>
  );
}
