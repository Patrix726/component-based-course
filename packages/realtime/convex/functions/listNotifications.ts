import { query } from "../_generated/server";

export default query(async ({ db }, { userId }) => {
	const results = await db
		.query("notifications")
		.withIndex("byUser", userId as any)
		.collect();
	return results;
});
