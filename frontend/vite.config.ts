import { sentrySvelteKit } from '@sentry/sveltekit';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import 'dotenv/config';

export default defineConfig({
	resolve: { alias: { '@': '/src' } },
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'ventrata',
				project: 'octo-validator-frontend-7n'
			}
		}),
		sveltekit(),
		purgeCss({
			safelist: {
				// any selectors that begin with "hljs-" will not be purged
				greedy: [/^hljs-/]
			}
		})
	],
	server: {
		host: true,
		port: Number(process.env.PUBLIC_APP_PORT) || 3000
	}
});
