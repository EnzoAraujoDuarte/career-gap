import { getAuth } from '@/lib/auth';

/** Rotas do Better Auth. Sem `DATABASE_URL`, não há login — e a rota responde 404. */
async function handle(request: Request): Promise<Response> {
  const auth = getAuth();
  return auth ? auth.handler(request) : new Response('Banco não configurado', { status: 404 });
}

export { handle as GET, handle as POST };
