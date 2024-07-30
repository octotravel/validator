import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';

export async function POST() {
	const response = await fetch(`${PUBLIC_VALIDATOR_BASE_URL}/v2/session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
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

export async function GET({ request }) {
	const id = new URL(request.url).searchParams.get('id');

	const response = await fetch(`${PUBLIC_VALIDATOR_BASE_URL}/v2/session/${id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
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

export async function PUT({ request }) {
	const body = await request.json();
	const id = body.id;
	const response = await fetch(`${PUBLIC_VALIDATOR_BASE_URL}/v2/session/${id}`, {
		method: 'PUT',
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
