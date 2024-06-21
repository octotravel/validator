import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';

export async function GET({ request }) {
	const response = await fetch(`${PUBLIC_VALIDATOR_BASE_URL}/v2/reseller/scenarios`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Octo-capabilities': request.headers.get('Octo-capabilities') ?? ''
		}
	});

	const parsedResponse = await response.json();

	return new Response(JSON.stringify(parsedResponse), {
		headers: {
			'content-type': 'application/json'
		}
	});
}
