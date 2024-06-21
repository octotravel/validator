import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';

export async function GET() {
	const response = await fetch(`${PUBLIC_VALIDATOR_BASE_URL}/v2/reseller/capabilities`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const parsedResponse = await response.json();

	return new Response(JSON.stringify(parsedResponse), {
		headers: {
			'content-type': 'application/json'
		}
	});
}
