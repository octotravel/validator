import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';

export async function GET({ request }) {
	const url = new URL(request.url);
	const id = url.searchParams.get('id');
	const scenarioId = url.searchParams.get('scenario-id');

	const response = await fetch(`${PUBLIC_VALIDATOR_BASE_URL}/v2/session/${id}/validation-history/${scenarioId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	return response;
}
