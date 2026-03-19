import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

type AuthConfig = {
	CORS_ORIGIN: string;
	BETTER_AUTH_SECRET: string;
	BETTER_AUTH_URL: string;
};
export const createAuth = ({
	prisma,
	config: config,
}: {
	prisma: any;
	config: AuthConfig;
}) => {
	const auth = betterAuth({
		database: prismaAdapter(prisma, {
			provider: "postgresql",
		}),

		trustedOrigins: [config.CORS_ORIGIN],
		emailAndPassword: {
			enabled: true,
		},
		secret: config.BETTER_AUTH_SECRET,
		baseURL: config.BETTER_AUTH_URL,
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
		plugins: [],
	});

	return {
		handler: auth.handler,
		login: auth.api.signInEmail,
		socialLogin: auth.api.signInSocial,
		register: auth.api.signUpEmail,
		getSession: auth.api.getSession,
		resetPassword: auth.api.resetPassword,
	};
};
