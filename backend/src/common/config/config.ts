import { Environment } from '@octocloud/core';
import { EnvType, load } from 'ts-dotenv';

const schema = {
  DB_HOST: {
    type: String,
    optional: false,
    default: '',
  },
  DB_PORT: {
    type: Number,
    optional: false,
    default: 15432,
  },
  DB_NAME: {
    type: String,
    optional: false,
    default: '',
  },
  DB_TEST_NAME: {
    type: String,
    optional: true,
    default: '',
  },
  DB_USER: {
    type: String,
    optional: false,
    default: '',
  },
  DB_PASSWORD: {
    type: String,
    optional: false,
    default: '',
  },
  APP_PORT: {
    type: Number,
    optional: false,
    default: 3006,
  },
  NODE_ENV: {
    type: String,
    optional: false,
    default: Environment.LOCAL,
  },
  BASE_URL: {
    type: String,
    optional: false,
    default: '',
  },
  BACKEND_ENDPOINT_URL: {
    type: String,
    optional: false,
    default: '',
  },
  IS_SENTRY_ENABLED: {
    type: Boolean,
    optional: false,
    default: false,
  },
  SENTRY_DNS: {
    type: String,
    optional: false,
    default: '',
  },
  SENTRY_AUTH_TOKEN: {
    type: String,
    optional: false,
    default: '',
  },
} as const;

export type Env = EnvType<typeof schema> & {
  getEnvironment(): Environment;
};

const config: Env = load(schema) as Env;
config.getEnvironment = (): Environment => {
  return process.env.NODE_ENV as Environment;
};

export default config;
