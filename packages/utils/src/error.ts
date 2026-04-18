export function toError(value: unknown) {
	if (value instanceof Error) {
		return value;
	}

	if (typeof value === "string") {
		return new Error(value);
	}

	return new Error("Unknown error");
}
