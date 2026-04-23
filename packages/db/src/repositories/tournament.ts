import type { Prisma, PrismaClient } from "../../prisma/generated/client";

export function createTournamentRepository(prisma: PrismaClient) {
	return {
		findById: (id: string) =>
			prisma.tournament.findUnique({
				where: { id },
			}),

		findMany: (args?: Prisma.TournamentFindManyArgs) =>
			prisma.tournament.findMany(args),

		count: (args?: Prisma.TournamentCountArgs) => prisma.tournament.count(args),

		create: (data: Prisma.TournamentCreateInput) =>
			prisma.tournament.create({ data }),

		update: (id: string, data: Prisma.TournamentUpdateInput) =>
			prisma.tournament.update({ where: { id }, data }),

		delete: (id: string) => prisma.tournament.delete({ where: { id } }),
	};
}
