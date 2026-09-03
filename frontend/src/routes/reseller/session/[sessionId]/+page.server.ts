import { error } from '@sveltejs/kit';
import { callValidator } from '$lib/server/validatorApi';
import type { Session } from '$lib/types/Session';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const result = await callValidator<Session>(
		`/v2/session/${encodeURIComponent(params.sessionId)}`
	);

	if (!result.ok || !result.data) {
		error(result.status, result.message ?? `Could not load session "${params.sessionId}".`);
	}

	return { resellerSession: result.data };
}) satisfies PageServerLoad;
