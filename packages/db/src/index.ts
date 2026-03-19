import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/client";
import { createUserRepository } from "./repositories/user";

export const createDb = ({
	connectionString,
}: {
	connectionString: string;
}) => {
	const adapter = new PrismaPg({ connectionString });
	const prisma = new PrismaClient({ adapter });

	return {
		prisma,
		repositories: { user: createUserRepository(prisma) },
	};
};
