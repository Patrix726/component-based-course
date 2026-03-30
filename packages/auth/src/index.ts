import { betterAuth } from "better-auth";
import createAdapterFactory from "./adapters";

type AuthConfig = {
	CORS_ORIGIN: string;
	BETTER_AUTH_SECRET: string;
	BETTER_AUTH_URL: string;
};

// create better auth instance based on any database layer
export const createAuth = ({
	adapterOpts,
	config,
}: {
	adapterOpts: { type: string; client: any; options?: any };
	config: AuthConfig;
}) => {
	const database = createAdapterFactory(adapterOpts);

	const auth = betterAuth({
		database,
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
