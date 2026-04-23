import { env } from "@component-based-software/env/server";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./api/auth";
import { db } from "./api/db";
import { normalizeError } from "./api/errors";
import { authContext, requireAuth } from "./api/middleware";
import { fail } from "./api/response";
import { createApiRouter } from "./api/router";
import type { AppVariables } from "./api/types";
import realtimeRouter from "./realtime-routes";

const app = new Hono<{
	Variables: AppVariables;
}>();

app.use(logger());
app.use("*", authContext);
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
app.use("/api/tournaments/*", requireAuth);
app.use("/api/tournaments", requireAuth);
app.use("/api/rounds/*", requireAuth);
app.use("/api/rounds", requireAuth);
app.use("/api/matches/*", requireAuth);
app.use("/api/matches", requireAuth);

app.onError((error, c) => {
	const normalized = normalizeError(error);

	return fail(c, normalized);
});

app.get("/", (c) => {
	return c.text("OK");
});

// realtime routes
app.route("/", realtimeRouter);
app.route("/", createApiRouter(db.repositories));

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
