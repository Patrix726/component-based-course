import type { Prisma, PrismaClient } from "../../prisma/generated/client";

export function createMembershipRepository(prisma: PrismaClient) {
	return {
		findById: (id: string) => prisma.membership.findUnique({ where: { id } }),

		findByClubAndUser: (clubId: string, userId: string) =>
			prisma.membership.findUnique({
				where: {
					clubId_userId: { clubId, userId },
				},
			}),

		findMany: (args?: Prisma.MembershipFindManyArgs) =>
			prisma.membership.findMany(args),

		create: (data: Prisma.MembershipCreateInput) =>
			prisma.membership.create({ data }),

		update: (id: string, data: Prisma.MembershipUpdateInput) =>
			prisma.membership.update({ where: { id }, data }),

		delete: (id: string) => prisma.membership.delete({ where: { id } }),
	};
}
