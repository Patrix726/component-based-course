export function createId() {
	if (typeof globalThis.crypto?.randomUUID === "function") {
		return globalThis.crypto.randomUUID();
	}

	throw new Error("crypto.randomUUID is not available in this runtime.");
}

export function isNonEmptyId(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}
