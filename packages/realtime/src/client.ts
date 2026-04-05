import { env } from "@component-based-software/env/server";
import { ConvexClient } from "convex/browser";

export function initConvexClient(url?: string) {
	if (url) {
		return new ConvexClient(url);
	}
	return new ConvexClient(env.CONVEX_URL as string);
}
