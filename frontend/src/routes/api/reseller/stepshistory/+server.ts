import { error } from '@sveltejs/kit';
import { proxyToValidator } from '$lib/server/validatorApi';

export async function GET({ url }) {
	const id = url.searchParams.get('id');
	const scenarioId = url.searchParams.get('scenario-id');

	if (!id || !scenarioId) {
		error(400, 'Missing required "id" or "scenario-id" query parameter.');
	}

	return await proxyToValidator(
		`/v2/session/${encodeURIComponent(id)}/validation-history/${encodeURIComponent(scenarioId)}`
	);
}
