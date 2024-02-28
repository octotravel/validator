import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';

export async function POST() {
	const response = await fetch(`${PUBLIC_VALIDATOR_BASE_URL}/v2/session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	return response;
}

export async function GET({ request }) {
	const id = new URL(request.url).searchParams.get('id');
	console.log(id);

	const response = await fetch(`${PUBLIC_VALIDATOR_BASE_URL}/v2/session/${id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	return response;
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

	return response;
}
