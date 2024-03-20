import * as Sentry from '@sentry/node';
import config from '../config/config';

export class SentryUtil {
  public static initSentry(): void {
    Sentry.init({
      dsn: config.SENTRY_DNS,
      debug: false,
      enabled: config.IS_SENTRY_ENABLED,
      environment: config.getEnvironment(),
      ignoreErrors: [],
    });
  }

  public static async endSentry(): Promise<void> {
    await Sentry.flush();
  }
}
