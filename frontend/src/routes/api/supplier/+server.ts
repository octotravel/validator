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

	if (response.status !== 200) {
		const error = await response.json();
		return new Response(JSON.stringify(error), {
			status: response.status,
			headers: {
				'content-type': 'application/json'
			}
		});
	}

	const parsedResponse = await response.json();

	return new Response(JSON.stringify(parsedResponse), {
		headers: {
			'content-type': 'application/json'
		}
	});
}
