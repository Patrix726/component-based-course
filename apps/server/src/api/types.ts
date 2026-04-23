import type { auth } from "./auth";

export type AppVariables = {
	user: typeof auth.types.user;
	session: typeof auth.types.session;
};
