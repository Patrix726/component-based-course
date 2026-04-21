import { createPrismaClient } from "./prisma";
import { createRepositories } from "./repositories";

export const createDb = ({
	connectionString,
}: {
	connectionString: string;
}) => {
	const prisma = createPrismaClient(connectionString);
	const repositories = createRepositories(prisma);

	return {
		repositories,
		authAdapter: {
			type: "prisma",
			client: prisma,
			options: { provider: "postgresql" },
		},
		disconnect: () => prisma.$disconnect(),
	};
};

export type DbInstance = ReturnType<typeof createDb>;
export type { DbClient } from "./prisma";
export type { Repositories } from "./repositories";
