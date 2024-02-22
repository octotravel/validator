import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { env } from '$env/dynamic/private'

export default defineConfig({
	resolve: { alias: { '@': '/src' } },
	plugins: [
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
		port: Number(env.APP_PORT)
	}
});
