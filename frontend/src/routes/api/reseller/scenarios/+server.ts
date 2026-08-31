import { proxyToValidator } from '$lib/server/validatorApi';

export async function GET({ request }) {
	return await proxyToValidator('/v2/reseller/scenarios', {
		headers: { 'Octo-capabilities': request.headers.get('Octo-capabilities') ?? '' }
	});
}
