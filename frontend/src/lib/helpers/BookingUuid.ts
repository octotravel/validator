export const hasUndefinedBookingUuid = (url?: string | null): boolean =>
	/\/bookings\/undefined(\/|\?|$)/.test(url ?? '');
