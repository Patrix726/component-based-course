import { z } from "zod";

export function safeJsonParse(value: string): unknown {
	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
}

export function safeParseWithSchema<TSchema extends z.ZodTypeAny>(
	schema: TSchema,
	value: unknown,
): z.infer<TSchema> | null {
	const parsed = schema.safeParse(value);
	return parsed.success ? parsed.data : null;
}

export function serializeJson(value: unknown) {
	return JSON.stringify(value);
}
