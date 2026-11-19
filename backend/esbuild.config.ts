#!/usr/bin/env node

import * as esbuild from 'esbuild';
import esbuildPluginPino from 'esbuild-plugin-pino';

const ddPlugin = require('dd-trace/esbuild');

const esbuildConfig: esbuild.BuildOptions = {
  entryPoints: ['src/server.ts', 'src/console.ts'],
  outdir: 'dist',
  platform: 'node',
  target: 'ES2022',
  bundle: true,
  keepNames: false,
  minifyWhitespace: true,
  minifyIdentifiers: false,
  minifySyntax: true,
  sourcemap: true,
  plugins: [esbuildPluginPino({ transports: [] }), ddPlugin],
  logOverride: {
    'require-resolve-not-external': 'silent',
  },
};

esbuild.build(esbuildConfig).catch((e) => {
  console.error(e);
  process.exit(1);
});
