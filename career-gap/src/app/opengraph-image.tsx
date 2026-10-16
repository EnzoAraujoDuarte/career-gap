import { ImageResponse } from 'next/og';

/**
 * A prévia que aparece quando o link é compartilhado (WhatsApp, e-mail, redes). É por ela que
 * chegam as pessoas do piloto, então diz o que o produto faz em uma frase, nas cores do site.
 * Sem números do catálogo: importá-lo estouraria o limite de 500 KB da imagem.
 */

export const alt = 'Career Gap: o que estudar agora, e o que pode esperar, para a primeira vaga em desenvolvimento web';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const MARKS = [
  { label: 'recomendado agora', color: '#2c5aa0' },
  { label: 'falta base', color: '#955f1d' },
  { label: 'não agora', color: '#77736c' },
] as const;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#fdfbf7',
          color: '#1c1b19',
        }}
      >
        <div style={{ fontSize: 34, color: '#6b675f' }}>Career Gap</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 72, lineHeight: 1.1, maxWidth: 960 }}>
            O que estudar agora, e o que pode esperar.
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: '#6b675f', marginTop: 28, maxWidth: 940 }}>
            Uma trilha aberta para a primeira vaga em desenvolvimento web, com o motivo de cada
            recomendação.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 40, fontSize: 26 }}>
          {MARKS.map((mark) => (
            <div key={mark.label} style={{ display: 'flex', alignItems: 'center', gap: 12, color: mark.color }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: mark.color }} />
              {mark.label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
