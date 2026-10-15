'use client';

import { anonymousClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

/** Cliente de login no navegador. Fala com `/api/auth`, na mesma origem. */
export const authClient = createAuthClient({ plugins: [anonymousClient()] });
