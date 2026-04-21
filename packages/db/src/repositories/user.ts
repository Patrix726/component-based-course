import type { Prisma, PrismaClient } from "../../prisma/generated/client";

export function createUserRepository(prisma: PrismaClient) {
	return {
		findById: (id: string) => prisma.user.findUnique({ where: { id } }),

		findByEmail: (email: string) =>
			prisma.user.findUnique({ where: { email } }),

		findMany: (args?: Prisma.UserFindManyArgs) =>
			prisma.user.findMany(args),

		create: (data: Prisma.UserCreateInput) => prisma.user.create({ data }),

		update: (id: string, data: Prisma.UserUpdateInput) =>
			prisma.user.update({ where: { id }, data }),

		delete: (id: string) => prisma.user.delete({ where: { id } }),
	};
}
