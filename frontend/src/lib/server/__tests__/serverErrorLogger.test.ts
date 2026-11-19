import { afterEach, describe, expect, it, vi } from 'vitest';
import { createServerErrorLog, logServerError } from '../serverErrorLogger';

const createInput = (error: unknown, status = 500) => ({
	error,
	event: {
		request: new Request('https://validator.octo.travel/api/reseller/session?code=secret', {
			method: 'POST'
		}),
		url: new URL('https://validator.octo.travel/api/reseller/session?code=secret')
	},
	status,
	message: 'Internal Error'
});

describe('createServerErrorLog', () => {
	it('maps an error to the Datadog error and http attributes', () => {
		const error = new TypeError('boom');

		expect(createServerErrorLog(createInput(error))).toEqual({
			status: 'error',
			message: 'boom',
			error: { kind: 'TypeError', message: 'boom', stack: error.stack },
			http: {
				method: 'POST',
				url: 'https://validator.octo.travel/api/reseller/session',
				status_code: 500
			}
		});
	});

	it('falls back to the SvelteKit message when the error is not an Error', () => {
		expect(createServerErrorLog(createInput('boom'))).toMatchObject({
			message: 'Internal Error',
			error: { message: 'Internal Error' }
		});
	});

	it('never includes the query string', () => {
		expect(JSON.stringify(createServerErrorLog(createInput(new Error('boom'))))).not.toContain(
			'secret'
		);
	});
});

describe('logServerError', () => {
	const spyOnConsoleError = () => vi.spyOn(console, 'error').mockImplementation(() => undefined);

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('writes one JSON line to stderr', () => {
		const consoleError = spyOnConsoleError();

		logServerError(createInput(new Error('boom')));

		expect(consoleError).toHaveBeenCalledOnce();
		expect(JSON.parse(consoleError.mock.calls[0][0])).toMatchObject({
			status: 'error',
			message: 'boom'
		});
	});

	it('does not log not-found errors', () => {
		const consoleError = spyOnConsoleError();

		logServerError(createInput(new Error('Not found: /missing'), 404));

		expect(consoleError).not.toHaveBeenCalled();
	});
});
