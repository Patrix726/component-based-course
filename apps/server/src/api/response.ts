import type { ApiErrorCode } from "@component-based-software/types";
import { nowIsoDateTime } from "@component-based-software/utils";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { Context } from "hono";

export function ok<TData>(c: Context, data: TData, status = 200) {
	return c.json(
		{
			ok: true as const,
			data,
			meta: {
				requestId: c.get("requestId") as string | undefined,
				timestamp: nowIsoDateTime(),
			},
		},
		status as ContentfulStatusCode,
	);
}

export function fail(
	c: Context,
	args: {
		status: number;
		code: ApiErrorCode;
		message: string;
		details?: unknown;
	},
) {
	return c.json(
		{
			ok: false as const,
			error: {
				code: args.code,
				message: args.message,
				...(args.details !== undefined ? { details: args.details } : {}),
			},
			meta: {
				requestId: c.get("requestId") as string | undefined,
				timestamp: nowIsoDateTime(),
			},
		},
		args.status as ContentfulStatusCode,
	);
}
