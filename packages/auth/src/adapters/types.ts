// Types for adapter integration so auth package is adapter-agnostic.
// The real shape of the object expected by `better-auth` is unknown here,
// so we keep types intentionally loose (any) while making the calling
// contract explicit: either pass a factory or a prebuilt database adapter.
export type BetterAuthDatabase = any;

// Factory that receives a DB client (for example Prisma client) and optional
// options and returns the database object consumed by better-auth.
export type DbAdapterFactory<Client = any, Options = any> = (
	client: Client,
	opts?: Options,
) => BetterAuthDatabase;

// The adapter accepted by createAuth: either a factory or an already-built
// database object that can be forwarded to better-auth.
export type DbAdapter<Client = any, Options = any> =
	| BetterAuthDatabase
	| DbAdapterFactory<Client, Options>;
