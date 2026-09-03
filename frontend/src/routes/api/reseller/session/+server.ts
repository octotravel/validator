import { error } from '@sveltejs/kit';
import { proxyToValidator } from '$lib/server/validatorApi';

const requireId = (value: string | null): string => {
	if (!value) {
		error(400, 'Missing required "id" query parameter.');
	}

	return encodeURIComponent(value);
};

export async function POST() {
	return await proxyToValidator('/v2/session', { method: 'POST' });
}

export async function GET({ url }) {
	return await proxyToValidator(`/v2/session/${requireId(url.searchParams.get('id'))}`);
}

export async function PUT({ request }) {
	const body = await request.json();

	return await proxyToValidator(`/v2/session/${requireId(body.id ?? null)}`, {
		method: 'PUT',
		body
	});
}
