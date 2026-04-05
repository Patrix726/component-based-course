// Convex mutation: insert a notification record

import { mutation } from "../_generated/server";

export default mutation(
	async ({ db }, { userId, payload }: { userId: string; payload: any }) => {
		const id = await db.insert("notifications", {
			userId,
			payload,
			read: false,
			createdAt: Date.now(),
		});
		return id;
	},
);
