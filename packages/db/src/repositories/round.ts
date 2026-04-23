import type { Prisma, PrismaClient } from "../../prisma/generated/client";

export function createRoundRepository(prisma: PrismaClient) {
	return {
		findById: (id: string) => prisma.round.findUnique({ where: { id } }),

		findByTournamentAndNumber: (tournamentId: string, roundNumber: number) =>
			prisma.round.findUnique({
				where: {
					tournamentId_roundNumber: { tournamentId, roundNumber },
				},
			}),

		findMany: (args?: Prisma.RoundFindManyArgs) => prisma.round.findMany(args),

		count: (args?: Prisma.RoundCountArgs) => prisma.round.count(args),

		create: (data: Prisma.RoundCreateInput) => prisma.round.create({ data }),

		update: (id: string, data: Prisma.RoundUpdateInput) =>
			prisma.round.update({ where: { id }, data }),

		delete: (id: string) => prisma.round.delete({ where: { id } }),
	};
}
