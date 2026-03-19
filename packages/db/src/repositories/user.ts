import type { PrismaClient } from "../../prisma/generated/client";

export type UserCreateInput = Record<string, unknown>;

export function createUserRepository(prisma: PrismaClient) {
	return {
		findById: async (id: string) => prisma.user.findUnique({ where: { id } }),

		findByEmail: async (email: string) =>
			prisma.user.findUnique({ where: { email } }),

		findMany: async (args?: any) => prisma.user.findMany(args),

		create: async (data: UserCreateInput) =>
			prisma.user.create({ data: data as any }),

		update: async (id: string, data: any) =>
			prisma.user.update({ where: { id }, data }),

		delete: async (id: string) => prisma.user.delete({ where: { id } }),
	};
}
