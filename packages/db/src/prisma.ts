import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/client";

export type DbClient = PrismaClient;

export const createPrismaClient = (connectionString: string) => {
	const adapter = new PrismaPg({ connectionString });
	return new PrismaClient({ adapter });
};
