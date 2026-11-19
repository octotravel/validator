interface ServerErrorInput {
	error: unknown;
	event: { request: Request; url: URL };
	status: number;
	message: string;
}

interface ServerErrorLog {
	status: 'error';
	message: string;
	error: { kind?: string; message: string; stack?: string };
	http: { method: string; url: string; status_code: number };
}

export function createServerErrorLog({
	error,
	event,
	status,
	message
}: ServerErrorInput): ServerErrorLog {
	const errorData =
		error instanceof Error
			? { kind: error.constructor.name, message: error.message, stack: error.stack }
			: { message };

	return {
		status: 'error',
		message: errorData.message,
		error: errorData,
		http: {
			method: event.request.method,
			url: `${event.url.origin}${event.url.pathname}`,
			status_code: status
		}
	};
}

export function logServerError(input: ServerErrorInput): void {
	if (input.status === 404) {
		return;
	}

	console.error(JSON.stringify(createServerErrorLog(input)));
}
