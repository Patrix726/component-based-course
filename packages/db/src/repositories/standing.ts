import type { Prisma, PrismaClient } from "../../prisma/generated/client";

export function createStandingRepository(prisma: PrismaClient) {
	return {
		findById: (id: string) => prisma.standing.findUnique({ where: { id } }),

		findByTournamentAndPlayer: (tournamentId: string, playerId: string) =>
			prisma.standing.findUnique({
				where: {
					tournamentId_playerId: { tournamentId, playerId },
				},
			}),

		findMany: (args?: Prisma.StandingFindManyArgs) =>
			prisma.standing.findMany(args),

		create: (data: Prisma.StandingCreateInput) => prisma.standing.create({ data }),

		update: (id: string, data: Prisma.StandingUpdateInput) =>
			prisma.standing.update({ where: { id }, data }),

		upsertByTournamentAndPlayer: (
			tournamentId: string,
			playerId: string,
			args: {
				create: Prisma.StandingCreateInput;
				update: Prisma.StandingUpdateInput;
			},
		) =>
			prisma.standing.upsert({
				where: { tournamentId_playerId: { tournamentId, playerId } },
				create: args.create,
				update: args.update,
			}),

		delete: (id: string) => prisma.standing.delete({ where: { id } }),

		deleteManyByTournament: (tournamentId: string) =>
			prisma.standing.deleteMany({ where: { tournamentId } }),
	};
}
