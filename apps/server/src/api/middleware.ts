import type { MiddlewareHandler } from "hono";
import { auth } from "./auth";
import { ApiHttpError } from "./errors";

export const authContext: MiddlewareHandler = async (c, next) => {
	const session = await auth.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		await next();
		return;
	}

	c.set("user", session.user);
	c.set("session", session.session);
	await next();
};

export const requireAuth: MiddlewareHandler = async (c, next) => {
	if (!c.get("user")?.id) {
		throw new ApiHttpError({
			status: 401,
			code: "UNAUTHORIZED",
			message: "Missing authenticated user context.",
		});
	}

	await next();
};
