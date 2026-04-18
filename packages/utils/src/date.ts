export function nowIsoDateTime() {
	return new Date().toISOString();
}

export function toIsoDateTime(value: Date | string | number) {
	const date = value instanceof Date ? value : new Date(value);

	if (Number.isNaN(date.getTime())) {
		throw new TypeError("Invalid date value; cannot convert to ISO datetime.");
	}

	return date.toISOString();
}

export function parseIsoDateTime(value: string) {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return date;
}
