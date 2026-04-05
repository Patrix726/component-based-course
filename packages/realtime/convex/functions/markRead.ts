import type { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";

export default mutation(async ({ db }, { id }: { id: Id<"notifications"> }) => {
	await db.patch(id, { read: true });
	return true;
});
