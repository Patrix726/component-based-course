import { zValidator } from "@hono/zod-validator";
import type { Context } from "hono";
import type { ZodObject } from "zod";
import { ApiHttpError } from "./errors";

function validationHook(
	result: { success: boolean; error?: unknown },
	c: Context,
) {
	if (!result.success) {
		const requestId = c.get("requestId") as string | undefined;
		throw new ApiHttpError({
			status: 400,
			code: "BAD_REQUEST",
			message: "Validation failed.",
			details: {
				requestId,
				issues: result.error,
			},
		});
	}
}

export function validateJson<T extends ZodObject>(schema: T) {
	return zValidator("json", schema, validationHook);
}

export function validateQuery<T extends ZodObject>(schema: T) {
	return zValidator("query", schema, validationHook);
}

export function validateParam<T extends ZodObject>(schema: T) {
	return zValidator("param", schema, validationHook);
}
