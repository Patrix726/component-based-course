import { env } from "@component-based-software/env/server";
import {
	createRealtime,
	publishNotification,
	subscribeNotifications,
} from "@component-based-software/realtime";
import { Hono } from "hono";

const realtime = createRealtime({ url: env.CONVEX_URL, key: env.CONVEX_KEY });

const router = new Hono();

router.post("/api/realtime/send", async (c) => {
	const body = await c.req.json();
	const { userId, payload } = body;
	const id = await realtime.send(userId, payload);
	// local publish for SSE clients
	publishNotification({
		id,
		userId,
		payload,
		read: false,
		createdAt: Date.now(),
	});
	return c.json({ id });
});

router.get("/api/realtime/list", async (c) => {
	const userId = String(c.req.query("userId") || "");
	const list = await realtime.list(userId);
	return c.json(list);
});

router.get("/api/realtime/stream", (c) => {
	const userId = String(c.req.query("userId") || "");
	const stream = new ReadableStream({
		start(controller) {
			// send a retry hint
			controller.enqueue(new TextEncoder().encode("retry: 1000\n\n"));
			const send = (n: any) => {
				controller.enqueue(
					new TextEncoder().encode(`data: ${JSON.stringify(n)}\n\n`),
				);
			};
			const unsub = subscribeNotifications(userId, send);
			// store unsub on controller for cancel
			(controller as any)._unsub = unsub;
		},
		cancel() {
			const c = this as any;
			if (c && c._unsub) c._unsub();
		},
	});
	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
		},
	});
});

export default router;
