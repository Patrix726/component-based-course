export type CoreErrorCode =
	| "INVALID_PAIRING_INPUT"
	| "INVALID_STANDINGS_INPUT"
	| "INVALID_RESULT_ASSIGNMENT";

export class CoreRuleError extends Error {
	readonly code: CoreErrorCode;
	readonly details?: unknown;

	constructor(code: CoreErrorCode, message: string, details?: unknown) {
		super(message);
		this.name = "CoreRuleError";
		this.code = code;
		this.details = details;
	}
}
