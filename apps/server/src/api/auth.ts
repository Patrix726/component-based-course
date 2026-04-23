import { createAuth } from "@component-based-software/auth";
import { env } from "@component-based-software/env/server";
import { db } from "./db";

export const auth = createAuth({
	adapterOpts: db.authAdapter,
	config: {
		BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: env.BETTER_AUTH_URL,
		CORS_ORIGIN: env.CORS_ORIGIN,
	},
});
