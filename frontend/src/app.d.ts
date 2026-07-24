// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { Session } from '@auth/sveltekit';

declare global {
	namespace App {
		// interface Error {}
		// interface Platform {}
		interface Locals {
			auth(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
	}
}

export {};
