import { Environment } from '@octocloud/core';
import { EnvType, load } from 'ts-dotenv';

const schema = {
  DB_HOST: {
    type: String,
    optional: false,
  },
  DB_PORT: {
    type: Number,
    optional: false,
  },
  DB_NAME: {
    type: String,
    optional: false,
  },
  DB_USER: {
    type: String,
    optional: false,
  },
  DB_PASSWORD: {
    type: String,
    optional: false,
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
  IS_SENTRY_ENABLED: {
    type: Boolean,
    optional: false,
    default: false,
  },
  SENTRY_DNS: {
    type: String,
    optional: false,
  },
} as const;

export type Env = EnvType<typeof schema> & {
  getEnvironment: () => Environment;
};

const config: Env = load(schema) as Env;
config.getEnvironment = (): Environment => {
  return process.env.NODE_ENV as Environment;
};

export default config;
