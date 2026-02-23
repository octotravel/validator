import { env } from '$env/dynamic/private';
import { SvelteKitAuth } from '@auth/sveltekit';

export const { handle, signIn, signOut } = SvelteKitAuth({
	secret: env.BETTER_AUTH_SECRET,
	trustHost: true,
	debug: false,
	providers: [
		{
			id: 'outseta',
			name: 'Outseta',
			type: 'oauth',
			issuer: `https://${env.PRIVATE_OUTSETA_DOMAIN}`,
			authorization: {
				url: `https://${env.PRIVATE_OUTSETA_DOMAIN}/connect/authorize`,
				params: {
					scope: 'openid profile email outseta',
					response_type: 'code',
					prompt: 'login'
				}
			},
			token: {
				url: `https://${env.PRIVATE_OUTSETA_DOMAIN}/connect/token`
			},
			userinfo: {
				url: `https://${env.PRIVATE_OUTSETA_DOMAIN}/connect/userinfo`
			},
			clientId: env.PRIVATE_OUTSETA_CLIENT_ID,
			clientSecret: env.PRIVATE_OUTSETA_CLIENT_SECRET,
			checks: ['state'],
			client: {
				token_endpoint_auth_method: 'client_secret_post'
			},
			profile(profile) {
				return {
					id: profile.sub,
					name: profile.name || profile.email,
					email: profile.email,
					image: profile.picture
				};
			}
		}
	],
	callbacks: {
		async signIn() {
			return true;
		},
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }) {
			// @ts-ignore - extending session with accessToken
			session.accessToken = token.accessToken as string;
			return session;
		}
	}
});
