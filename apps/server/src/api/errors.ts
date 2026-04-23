import { CoreRuleError } from "@component-based-software/core";
import type { ApiErrorCode } from "@component-based-software/types";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";

const DEFAULT_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
	BAD_REQUEST: "Bad request.",
	UNAUTHORIZED: "Authentication is required.",
	FORBIDDEN: "You are not allowed to perform this action.",
	NOT_FOUND: "Resource not found.",
	CONFLICT: "Resource conflict.",
	UNPROCESSABLE: "The request could not be processed.",
	INTERNAL: "Unexpected server error.",
};

export class ApiHttpError extends HTTPException {
	readonly code: ApiErrorCode;
	readonly details?: unknown;

	constructor({
		status,
		code,
		message,
		details,
	}: {
		status: ContentfulStatusCode;
		code: ApiErrorCode;
		message?: string;
		details?: unknown;
	}) {
		super(status, { message: message ?? DEFAULT_ERROR_MESSAGES[code] });
		this.code = code;
		this.details = details;
	}
}

export function normalizeError(error: unknown) {
	if (error instanceof ApiHttpError) {
		return {
			status: error.status,
			code: error.code,
			message: error.message,
			details: error.details,
		};
	}

	if (error instanceof CoreRuleError) {
		return {
			status: 422,
			code: "UNPROCESSABLE" as const,
			message: error.message,
			details: {
				coreCode: error.code,
				...(error.details !== undefined ? { data: error.details } : {}),
			},
		};
	}

	if (error instanceof ZodError) {
		return {
			status: 400,
			code: "BAD_REQUEST" as const,
			message: "Validation failed.",
			details: {
				issues: error.issues,
			},
		};
	}

	if (error instanceof HTTPException) {
		return {
			status: error.status,
			code: (error.status === 404
				? "NOT_FOUND"
				: "BAD_REQUEST") as ApiErrorCode,
			message: error.message,
			details: undefined,
		};
	}

	return {
		status: 500,
		code: "INTERNAL" as const,
		message: DEFAULT_ERROR_MESSAGES.INTERNAL,
		details: undefined,
	};
}
