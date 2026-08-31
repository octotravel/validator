import { error } from '@sveltejs/kit';
import { proxyToValidator } from '$lib/server/validatorApi';

export async function POST({ request, url }) {
	const id = url.searchParams.get('id');
	const scenarioId = url.searchParams.get('scenario-id');
	const stepId = url.searchParams.get('step-id');

	if (!id || !scenarioId || !stepId) {
		error(400, 'Missing required "id", "scenario-id" or "step-id" query parameter.');
	}

	const body = await request.json();

	return await proxyToValidator(
		`/v2/session/${encodeURIComponent(id)}/validate-question-answers/${encodeURIComponent(scenarioId)}/${encodeURIComponent(stepId)}`,
		{ method: 'POST', body }
	);
}
