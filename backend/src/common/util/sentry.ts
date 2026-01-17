import * as Sentry from '@sentry/node';
import config from '../config/config';
import { SentryExceptionLogger } from '../logger/exception/SentryExceptionLogger';

if (config.SENTRY_ENABLED) {
  Sentry.init({
    dsn: config.SENTRY_DNS,
    debug: false,
    enabled: true,
    skipOpenTelemetrySetup: true,
    environment: config.getEnvironment(),
    ignoreErrors: SentryExceptionLogger.IGNORED_ERRORS,
  });
}
