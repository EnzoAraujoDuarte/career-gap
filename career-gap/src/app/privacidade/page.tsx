import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { PageShell, SectionLabel } from '@/components/ecosystem/page-shell';

export const metadata: Metadata = { title: 'Privacidade · Career Gap' };

/** Exigido pela LGPD (Lei 13.709/2018, art. 9º) antes de guardar dado de alguém no servidor. */
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageShell
        title="Privacidade"
        intro="O que o Career Gap guarda sobre você, para quê, por quanto tempo e como apagar. Sem letra miúda."
      >
        <Block title="O que guardamos">
          <li>
            <strong className="font-medium">No seu navegador:</strong> o que você respondeu sobre o que
            já sabe, seu porquê e sua meta, o que guardou, começou e concluiu, e os critérios de saída
            que marcou.
          </li>
          <li>
            <strong className="font-medium">No servidor, quando ele está ligado:</strong> as mesmas
            informações, ligadas a uma sessão anônima — sem nome nem e-mail. Se você escolher entrar
            com Google ou GitHub, também o nome, o e-mail e a foto que o provedor envia.
          </li>
          <li>
            <strong className="font-medium">Na sessão:</strong> o endereço IP e o nome do navegador,
            para limitar tentativas de login e proteger o site contra abuso.
          </li>
          <li>
            <strong className="font-medium">O cálculo da sua trilha:</strong> a cada vez que você muda o
            que sabe, guardamos o que entrou e o que saiu do cálculo, para poder explicar por que algo
            foi recomendado a você.
          </li>
        </Block>

        <Block title="Para quê">
          <li>Montar a sua trilha e dizer o que vale agora e o que pode esperar.</li>
          <li>Deixar você continuar de outro aparelho, se entrar com uma conta.</li>
          <li>Não vendemos, não usamos para publicidade e não há rastreamento de terceiros.</li>
          <li>
            Este site é parte de um Trabalho de Conclusão de Curso. Nenhum dado seu entra na pesquisa
            sem um termo de consentimento à parte.
          </li>
        </Block>

        <Block title="Com quem">
          <li>Neon, onde fica o banco de dados (Postgres).</li>
          <li>Google ou GitHub, só se você escolher entrar com um deles.</li>
        </Block>

        <Block title="Por quanto tempo e como apagar">
          <li>Até você apagar. Os links de estudo levam a sites de terceiros, com políticas próprias.</li>
          <li>
            Você pode ver e corrigir o que respondeu em{' '}
            <Link href="/perfil" className="text-now underline underline-offset-2">
              Ajustar o que já sei
            </Link>{' '}
            e apagar tudo, aqui e no servidor, em{' '}
            <Link href="/minha-area" className="text-now underline underline-offset-2">
              Minha área → Seus dados
            </Link>
            .
          </li>
        </Block>

        <Block title="Quem é responsável">
          <li>
            Enzo Araujo Duarte, no TCC de Sistemas de Informação da UNESC Colatina.
            {CONTACT_EMAIL && (
              <>
                {' '}
                Contato:{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-now underline underline-offset-2">
                  {CONTACT_EMAIL}
                </a>
                .
              </>
            )}
          </li>
        </Block>
      </PageShell>
    </Suspense>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <SectionLabel>{title}</SectionLabel>
      <ul className="text-ink mt-2 list-disc space-y-2 pl-5 text-[14px] leading-relaxed">{children}</ul>
    </section>
  );
}
