#!/usr/bin/env node

import { Environment } from '@octocloud/core';
import * as esbuild from 'esbuild';
import esbuildPluginPino from 'esbuild-plugin-pino';
import dotenv from 'dotenv';
import { sentryEsbuildPlugin } from '@sentry/esbuild-plugin';
import Config from './src/common/config/config';

dotenv.config();

const env = Config.getEnvironment();

function generateReleaseName(): string {
  const timestamp = new Date().toISOString();
  return `${env}-${timestamp}`;
}

const releaseName = generateReleaseName();
const plugins = [esbuildPluginPino({ transports: ['pino-pretty'] })];

const commonConfig = {
  // logLevel: 'debug',
  loader: { '.node': 'file', '.html': 'file' },
  external: ['pg-cloudflare', '@sentry/profiling-node', '@google-cloud/profiler', 'mock-aws-s3', 'aws-sdk', 'nock'],
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
  entryPoints: ['src/server.ts', 'src/worker.ts', 'src/console.ts', 'src/workerJob.ts'],
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
      project: 'octo-node',
      telemetry: false,
      authToken: Config.***REMOVED***,
    }),
  );
}

esbuild.build(mainConfig).catch(() => process.exit(1));
