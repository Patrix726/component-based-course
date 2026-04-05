import { initConvexClient } from "./client";
import type { Notification, NotificationPayload } from "./types";

export function createRealtime({
	url,
	key,
}: { url?: string; key?: string } = {}) {
	const client: any = initConvexClient(url, key);

	return {
		async send(userId: string, payload: NotificationPayload) {
			// Call convex function sendNotification
			return client.call("sendNotification", { userId, payload });
		},
		async list(userId: string): Promise<Notification[]> {
			return client.call("listNotifications", { userId });
		},
		async markRead(id: string) {
			return client.call("markRead", { id });
		},
		subscribe(_: string, _cb: (n: Notification) => void) {
			// Stub: real-time subscriptions will be handled via SSE on the server
			return () => {};
		},
	};
}
