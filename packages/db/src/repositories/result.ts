import type { Prisma, PrismaClient } from "../../prisma/generated/client";

export function createResultRepository(prisma: PrismaClient) {
	return {
		findById: (id: string) => prisma.result.findUnique({ where: { id } }),

		findByMatchId: (matchId: string) => prisma.result.findUnique({ where: { matchId } }),

		findMany: (args?: Prisma.ResultFindManyArgs) => prisma.result.findMany(args),

		create: (data: Prisma.ResultCreateInput) => prisma.result.create({ data }),

		update: (id: string, data: Prisma.ResultUpdateInput) =>
			prisma.result.update({ where: { id }, data }),

		delete: (id: string) => prisma.result.delete({ where: { id } }),
	};
}
