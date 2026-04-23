import { createDb } from "@component-based-software/db";
import { env } from "@component-based-software/env/server";

export const db = createDb({ connectionString: env.DATABASE_URL });
