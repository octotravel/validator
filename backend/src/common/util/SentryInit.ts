import * as Sentry from '@sentry/node';
import config from '../config/config';

export function initSentry(): void {
  Sentry.init({
    dsn: config.SENTRY_DNS,
    debug: false,
    enabled: config.IS_SENTRY_ENABLED,
    environment: config.getEnvironment(),
    ignoreErrors: [],
  });
}

export async function endSentry(): Promise<void> {
  await Sentry.flush();
}
