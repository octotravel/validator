import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';

export async function GET() {
	const response = await fetch(`${PUBLIC_VALIDATOR_BASE_URL}/v2/reseller/capabilities`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	return response;
}
