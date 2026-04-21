import type { Prisma, PrismaClient } from "../../prisma/generated/client";

export function createPlayerRepository(prisma: PrismaClient) {
	return {
		findById: (id: string) => prisma.player.findUnique({ where: { id } }),

		findMany: (args?: Prisma.PlayerFindManyArgs) => prisma.player.findMany(args),

		create: (data: Prisma.PlayerCreateInput) => prisma.player.create({ data }),

		update: (id: string, data: Prisma.PlayerUpdateInput) =>
			prisma.player.update({ where: { id }, data }),

		delete: (id: string) => prisma.player.delete({ where: { id } }),
	};
}
