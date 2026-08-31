import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import { handle as authHandle } from './auth';

Sentry.init({
	dsn: 'https://47ad4557ea3ccb6fcbf67b9011f8599c@o290279.ingest.us.sentry.io/4507146484842496',
	tracesSampleRate: 1.0

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: import.meta.env.DEV,
});

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

export const handle = sequence(sentryHandle(), authHandle, apiAuthGuard);

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
