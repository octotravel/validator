import { validatorBaseUrl } from '$lib/consts.js';

export async function POST({ request }) {
	const data = await request.json();

	const body = {
		backend: {
			endpoint: data.endpoint,
			apiKey: data.apiKey
		}
	};

	const response = await fetch(`${validatorBaseUrl}/validate`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	return response;
}
