import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const sessionId = params.sessionId;

    const res = await fetch(`${PUBLIC_VALIDATOR_BASE_URL}/v2/session/${sessionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const session = await res.json();

    return {
        props: {
            sessionId: params.sessionId
        },
        session
    };
}) satisfies PageServerLoad;