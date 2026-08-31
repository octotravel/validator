import { error } from '@sveltejs/kit';
import { proxyToValidator } from '$lib/server/validatorApi';

export async function GET({ url }) {
	const id = url.searchParams.get('id');

	if (!id) {
		error(400, 'Missing required "id" query parameter.');
	}

	return await proxyToValidator(`/v2/reseller/scenarios/${encodeURIComponent(id)}`);
}
