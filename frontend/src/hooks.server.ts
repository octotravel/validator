import type { Handle, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authHandle } from './auth';
import { logServerError } from '$lib/server/serverErrorLogger';

const apiAuthGuard: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/')) {
		const session = await event.locals.auth();
		if (!session?.user) {
			return new Response(
				JSON.stringify({
					message: 'You are not signed in. Please sign in and try again.',
					error: 'Unauthorized'
				}),
				{
					status: 401,
					headers: {
						'content-type': 'application/json'
					}
				}
			);
		}
	}
	return resolve(event);
};

export const handle = sequence(authHandle, apiAuthGuard);

export const handleError: HandleServerError = logServerError;
