import { proxyToValidator } from '$lib/server/validatorApi';

export async function GET() {
	return await proxyToValidator('/v2/reseller/capabilities');
}
