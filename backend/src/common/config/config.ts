import { Environment } from '@octocloud/core';
import { EnvType, load } from 'ts-dotenv';

const schema = {
  DB_USE_IAM_AUTH: {
    type: Boolean,
    optional: true,
    default: false,
  },
  DB_USE_MIGRATION_IAM_USER: {
    type: Boolean,
    readonly: false,
    optional: true,
    default: false,
  },
  DB_HOST: {
    type: String,
    optional: true,
    default: '',
  },
  DB_PORT: {
    type: Number,
    optional: true,
    default: 15432,
  },
  DB_USE_SSL: {
    type: Boolean,
    optional: true,
    default: false,
  },
  DB_NAME: {
    type: String,
    optional: true,
    default: '',
  },
  DB_TEST_NAME: {
    type: String,
    optional: true,
    default: '',
  },
  DB_USER: {
    type: String,
    optional: true,
    default: '',
  },
  DB_PASSWORD: {
    type: String,
    optional: true,
    default: '',
  },
  DB_IAM_USER: {
    type: String,
    optional: true,
    default: '',
  },
  DB_IAM_MIGRATION_USER: {
    type: String,
    optional: true,
    default: '',
  },
  DB_INSTANCE_CONNECTION_NAME: {
    type: String,
    optional: true,
    default: '',
  },
  APP_PORT: {
    type: Number,
    optional: true,
    default: 3006,
  },
  APP_LOG_LEVEL: {
    type: String,
    optional: true,
    default: 'trace',
  },
  APP_ENABLE_LOGGER: {
    type: Boolean,
    optional: true,
    default: true,
  },
  APP_ENABLE_FILE_LOGGER: {
    type: Boolean,
    optional: true,
    default: false,
  },
  NODE_ENV: {
    type: String,
    optional: true,
    default: Environment.LOCAL,
  },
  BASE_URL: {
    type: String,
    optional: true,
    default: '',
  },
  BACKEND_ENDPOINT_URL: {
    type: String,
    optional: true,
    default: '',
  },
  SENTRY_ENABLED: {
    type: Boolean,
    optional: true,
    default: false,
  },
  SENTRY_DNS: {
    type: String,
    optional: true,
    default: '',
  },
  SENTRY_AUTH_TOKEN: {
    type: String,
    optional: true,
    default: '',
  },
} as const;

export type Env = EnvType<typeof schema> & {
  getEnvironment(): Environment;
};

const config: Env = load(schema, process.env.ENV_FILE_PATH ?? '.env') as Env;
config.getEnvironment = (): Environment => {
  return config.NODE_ENV as Environment;
};

export default config;
