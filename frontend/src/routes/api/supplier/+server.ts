import { proxyToValidator } from '$lib/server/validatorApi';

const SUPPLIER_VALIDATION_TIMEOUT_MS = 10 * 60_000;

export async function POST({ request }) {
	const data = await request.json();

	return await proxyToValidator('/v1/validate', {
		method: 'POST',
		body: { backend: { ...data } },
		timeoutMs: SUPPLIER_VALIDATION_TIMEOUT_MS
	});
}
