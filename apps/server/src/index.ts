import { createAuth } from "@component-based-software/auth";
import { createDb } from "@component-based-software/db";
import { env } from "@component-based-software/env/server";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import realtimeRouter from "./realtime-routes";

const { prisma } = createDb({ connectionString: env.DATABASE_URL });
const auth = createAuth({
	adapterOpts: {
		type: "prisma",
		client: prisma,
		options: { provider: "postgresql" },
	},
	config: {
		BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: env.BETTER_AUTH_URL,
		CORS_ORIGIN: env.CORS_ORIGIN,
	},
});

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
	return c.text("OK");
});

// realtime routes
app.route("/", realtimeRouter);

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
