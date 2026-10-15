import { CATALOG } from '@/catalog';
import { FIRST_WEB_ROLE } from '@/catalog/tracks';
import { RESOURCES } from '@/catalog';
import { OpenMap } from '@/components/entry/open-map';

/**
 * Abertura do produto.
 *
 * O mapa genérico É a primeira tela: valor em zero toque, e a personalização vira uma ação
 * sobre algo que já está diante do usuário, em vez de um pedágio antes dele. Antes o caminho
 * ficava atrás de 25 perguntas — custo antes do valor, que é o padrão que mais faz gente
 * desistir de ferramenta de estudo autodirigido.
 *
 * É o mesmo componente que desenha o roadmap personalizado; muda só a ausência de perfil.
 */
export default function HomePage() {
  const ptBr = RESOURCES.filter((resource) => resource.ptBrStatus === 'complete').length;
  return (
    <OpenMap
      track={FIRST_WEB_ROLE}
      catalog={CATALOG}
      stats={{ competencies: FIRST_WEB_ROLE.requirements.length, resources: RESOURCES.length, ptBr }}
    />
  );
}
