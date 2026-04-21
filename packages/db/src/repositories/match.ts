import type { Prisma, PrismaClient } from "../../prisma/generated/client";

export function createMatchRepository(prisma: PrismaClient) {
	return {
		findById: (id: string) => prisma.match.findUnique({ where: { id } }),

		findByRoundAndBoard: (roundId: string, boardNumber: number) =>
			prisma.match.findUnique({
				where: {
					roundId_boardNumber: { roundId, boardNumber },
				},
			}),

		findMany: (args?: Prisma.MatchFindManyArgs) => prisma.match.findMany(args),

		create: (data: Prisma.MatchCreateInput) => prisma.match.create({ data }),

		update: (id: string, data: Prisma.MatchUpdateInput) =>
			prisma.match.update({ where: { id }, data }),

		delete: (id: string) => prisma.match.delete({ where: { id } }),
	};
}
