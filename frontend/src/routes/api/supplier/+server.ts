import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';

export async function POST({ request }) {
	const data = await request.json();

	const body = {
		backend: {
			endpoint: data.endpoint,
			apiKey: data.apiKey
		}
	};

	const response = await fetch(`${PUBLIC_VALIDATOR_BASE_URL}/v1/validate`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	return response;
}
