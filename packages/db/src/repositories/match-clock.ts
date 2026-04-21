import type { Prisma, PrismaClient } from "../../prisma/generated/client";

export function createMatchClockRepository(prisma: PrismaClient) {
	return {
		findById: (id: string) => prisma.matchClock.findUnique({ where: { id } }),

		findByMatchId: (matchId: string) =>
			prisma.matchClock.findUnique({ where: { matchId } }),

		findMany: (args?: Prisma.MatchClockFindManyArgs) =>
			prisma.matchClock.findMany(args),

		create: (data: Prisma.MatchClockCreateInput) =>
			prisma.matchClock.create({ data }),

		update: (id: string, data: Prisma.MatchClockUpdateInput) =>
			prisma.matchClock.update({ where: { id }, data }),

		delete: (id: string) => prisma.matchClock.delete({ where: { id } }),
	};
}
