import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex schema for Notification
 * documentation: https://docs.convex.dev/
 */
export default defineSchema({
	notifications: defineTable({
		userId: v.string(),
		payload: v.object({ data: v.any() }),
		read: v.boolean(),
		createdAt: v.float64(),
	}).index("byUser", ["userId"]),
});
