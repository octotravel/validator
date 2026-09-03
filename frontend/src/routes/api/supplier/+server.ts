import { proxyToValidator } from '$lib/server/validatorApi';

export async function POST({ request }) {
	const data = await request.json();

	return await proxyToValidator('/v1/validate', {
		method: 'POST',
		body: { backend: { ...data } }
	});
}
