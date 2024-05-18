#!/usr/bin/env node

import { Environment } from '@octocloud/core';
import * as esbuild from 'esbuild';
import esbuildPluginPino from 'esbuild-plugin-pino';
import dotenv from 'dotenv';
import { sentryEsbuildPlugin } from '@sentry/esbuild-plugin';
import config from './src/common/config/config';

dotenv.config();

const env = config.getEnvironment();

function generateReleaseName(): string {
  const timestamp = new Date().toISOString();
  return `${env}-${timestamp}`;
}

const releaseName = generateReleaseName();
const plugins = [esbuildPluginPino({ transports: ['pino-pretty'] })];

const commonConfig = {
  // logLevel: 'debug',
  platform: 'node',
  bundle: true,
  keepNames: false,
  minifyWhitespace: true,
  minifyIdentifiers: false,
  minifySyntax: true,
  sourcemap: true,
  plugins,
};

const mainConfig: any = {
  entryPoints: ['src/server.ts', 'src/console.ts'],
  outdir: 'dist',
  ...commonConfig,
};

if (env !== Environment.LOCAL && env !== Environment.TEST) {
  mainConfig.plugins.push(
    sentryEsbuildPlugin({
      release: {
        name: releaseName,
        deploy: {
          env,
        },
      },
      sourcemaps: {
        assets: './dist/**',
      },
      org: 'ventrata',
      project: 'octo-validator-backend',
      telemetry: false,
      authToken: config.SENTRY_AUTH_TOKEN,
    }),
  );
}

esbuild.build(mainConfig).catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
