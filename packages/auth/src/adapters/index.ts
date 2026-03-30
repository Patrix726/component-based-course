import { prismaAdapter } from "better-auth/adapters/prisma";
import type { BetterAuthDatabase } from "./types";

type CreateAdapterArgs = {
	// Adapter type/kind, extendable in future (e.g. 'prisma', 'other')
	type: string;
	// The underlying DB client (e.g. Prisma client)
	client: any;
	// Optional adapter-specific options forwarded to the underlying adapter
	options?: any;
};

// Unified factory that creates the database object expected by better-auth
// based on the provided `type`. This keeps the responsibility of importing
// concrete adapters inside the auth package so callers do not need to depend
// on 'better-auth' directly.
export function createAdapter({
	type,
	client,
	options,
}: CreateAdapterArgs): BetterAuthDatabase {
	switch (type) {
		case "prisma":
			return prismaAdapter(client, options);
		default:
			throw new Error(`Unsupported adapter type: ${type}`);
	}
}

export default createAdapter;
