import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';

export async function POST({ request }) {
	const data = await request.json();

	const body = {
		backend: {
			...data
		}
	};

	const response = await fetch(`${PUBLIC_VALIDATOR_BASE_URL}/v1/validate`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	const parsedResponse = await response.json();

	console.log('parsedResponse', parsedResponse);

	return new Response(JSON.stringify(parsedResponse.body), {
		status: parsedResponse.status,
		headers: {
			'content-type': 'application/json'
		}
	});
}
