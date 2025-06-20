import { sentrySvelteKit } from '@sentry/sveltekit';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import 'dotenv/config';

const plugins = [
	sveltekit(),
	purgeCss({
		safelist: {
			// any selectors that begin with "hljs-" will not be purged
			greedy: [/^hljs-/]
		}
	})
];

if (process.env.SENTRY_AUTH_TOKEN) {
	plugins.unshift(
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'ventrata',
				project: 'octo-validator-frontend-7n'
			}
		})
	);
}

export default defineConfig({
	resolve: { alias: { '@': '/src' } },
	plugins,
	server: {
		host: true,
		port: Number(process.env.PUBLIC_APP_PORT) || 3000
	}
});
