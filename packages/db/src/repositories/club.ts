import type { Prisma, PrismaClient } from "../../prisma/generated/client";

export function createClubRepository(prisma: PrismaClient) {
	return {
		findById: (id: string) => prisma.club.findUnique({ where: { id } }),

		findMany: (args?: Prisma.ClubFindManyArgs) =>
			prisma.club.findMany(args),

		create: (data: Prisma.ClubCreateInput) => prisma.club.create({ data }),

		update: (id: string, data: Prisma.ClubUpdateInput) =>
			prisma.club.update({ where: { id }, data }),

		delete: (id: string) => prisma.club.delete({ where: { id } }),
	};
}
