import {
	computeStandings,
	validateMatchResultAssignment,
} from "@component-based-software/core";
import type { Repositories } from "@component-based-software/db";
import {
	assignMatchResultRequestSchema,
	createMatchRequestSchema,
	createRoundRequestSchema,
	createTournamentRequestSchema,
	entityIdSchema,
	listMatchesQuerySchema,
	listRoundsQuerySchema,
	listTournamentsQuerySchema,
	paginationQuerySchema,
	updateTournamentRequestSchema,
} from "@component-based-software/types";
import { createId, nowIsoDateTime } from "@component-based-software/utils";
import { Hono } from "hono";
import { z } from "zod";
import { ApiHttpError } from "./errors";
import {
	toMatchDto,
	toResultDto,
	toRoundDto,
	toTournamentDto,
} from "./mappers";
import { requireAuth } from "./middleware";
import { ok } from "./response";
import type { AppVariables } from "./types";
import { validateJson, validateParam, validateQuery } from "./validation";

type AppContext = {
	Variables: AppVariables;
};

const tournamentIdParamSchema = z.object({
	id: entityIdSchema,
});

const roundIdParamSchema = z.object({
	id: entityIdSchema,
});

const matchIdParamSchema = z.object({
	id: entityIdSchema,
});

const updateRoundRequestSchema = createRoundRequestSchema.partial();
const updateMatchRequestSchema = createMatchRequestSchema.partial();
const assignMatchResultBodySchema = assignMatchResultRequestSchema.pick({
	outcome: true,
	reason: true,
});

export function createApiRouter(repos: Repositories) {
	const router = new Hono<AppContext>();

	router.get(
		"/api/tournaments",
		requireAuth,
		validateQuery(listTournamentsQuerySchema),
		async (c) => {
			const query = c.req.valid("query");
			await assertAdminMembership(repos, query.clubId, c.get("user")?.id);

			const offset = (query.page - 1) * query.pageSize;
			const where = {
				clubId: query.clubId,
				...(query.search
					? {
							name: {
								contains: query.search,
								mode: "insensitive" as const,
							},
						}
					: {}),
			};

			const [tournaments, total] = await Promise.all([
				repos.tournament.findMany({
					where,
					skip: offset,
					take: query.pageSize,
					orderBy: { createdAt: "desc" },
				}),
				repos.tournament.count({ where }),
			]);

			return ok(c, {
				items: tournaments.map(toTournamentDto),
				page: query.page,
				pageSize: query.pageSize,
				total,
			});
		},
	);

	router.get(
		"/api/tournaments/:id",
		requireAuth,
		validateParam(tournamentIdParamSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const tournament = await requireTournament(repos, id);

			await assertAdminMembership(
				repos,
				tournament.clubId,
				c.get("user")?.id,
			);

			return ok(c, {
				tournament: toTournamentDto(tournament),
			});
		},
	);

	router.post(
		"/api/tournaments",
		requireAuth,
		validateJson(createTournamentRequestSchema),
		async (c) => {
			const payload = c.req.valid("json");
			const userId = c.get("user")?.id;

			await assertAdminMembership(repos, payload.clubId, userId);

			const tournament = await repos.tournament.create({
				id: createId(),
				club: { connect: { id: payload.clubId } },
				name: payload.name,
				format: payload.format,
				roundsCount: payload.roundsCount,
				initialSeconds: payload.initialSeconds,
				incrementSeconds: payload.incrementSeconds,
				startsAt: payload.startsAt ? new Date(payload.startsAt) : null,
				createdByUser: { connect: { id: userId } },
			});

			return ok(
				c,
				{
					tournament: toTournamentDto(tournament),
				},
				201,
			);
		},
	);

	router.patch(
		"/api/tournaments/:id",
		requireAuth,
		validateParam(tournamentIdParamSchema),
		validateJson(updateTournamentRequestSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const payload = c.req.valid("json");
			const existingTournament = await requireTournament(repos, id);

			await assertAdminMembership(
				repos,
				existingTournament.clubId,
				c.get("user")?.id,
			);

			if (
				payload.clubId &&
				payload.clubId !== existingTournament.clubId
			) {
				await assertAdminMembership(
					repos,
					payload.clubId,
					c.get("user")?.id,
				);
			}

			const tournament = await repos.tournament.update(id, {
				club: payload.clubId
					? {
							connect: { id: payload.clubId },
						}
					: undefined,
				name: payload.name,
				format: payload.format,
				roundsCount: payload.roundsCount,
				initialSeconds: payload.initialSeconds,
				incrementSeconds: payload.incrementSeconds,
				startsAt: payload.startsAt
					? new Date(payload.startsAt)
					: payload.startsAt === undefined
						? undefined
						: null,
			});

			return ok(c, {
				tournament: toTournamentDto(tournament),
			});
		},
	);

	router.delete(
		"/api/tournaments/:id",
		requireAuth,
		validateParam(tournamentIdParamSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const tournament = await requireTournament(repos, id);

			await assertAdminMembership(
				repos,
				tournament.clubId,
				c.get("user")?.id,
			);
			await repos.tournament.delete(id);

			return ok(c, { deleted: true });
		},
	);

	router.get(
		"/api/rounds",
		requireAuth,
		validateQuery(listRoundsQuerySchema.merge(paginationQuerySchema)),
		async (c) => {
			const query = c.req.valid("query");
			const tournament = await requireTournament(
				repos,
				query.tournamentId,
			);

			await assertAdminMembership(
				repos,
				tournament.clubId,
				c.get("user")?.id,
			);

			const offset = (query.page - 1) * query.pageSize;
			const where = { tournamentId: query.tournamentId };

			const [rounds, total] = await Promise.all([
				repos.round.findMany({
					where,
					skip: offset,
					take: query.pageSize,
					orderBy: { roundNumber: "asc" },
				}),
				repos.round.count({ where }),
			]);

			return ok(c, {
				items: rounds.map(toRoundDto),
				page: query.page,
				pageSize: query.pageSize,
				total,
			});
		},
	);

	router.get(
		"/api/rounds/:id",
		requireAuth,
		validateParam(roundIdParamSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const round = await requireRound(repos, id);
			const tournament = await requireTournament(
				repos,
				round.tournamentId,
			);

			await assertAdminMembership(
				repos,
				tournament.clubId,
				c.get("user")?.id,
			);

			return ok(c, {
				round: toRoundDto(round),
			});
		},
	);

	router.post(
		"/api/rounds",
		requireAuth,
		validateJson(createRoundRequestSchema),
		async (c) => {
			const payload = c.req.valid("json");
			const tournament = await requireTournament(
				repos,
				payload.tournamentId,
			);

			await assertAdminMembership(
				repos,
				tournament.clubId,
				c.get("user")?.id,
			);

			const existingRound = await repos.round.findByTournamentAndNumber(
				payload.tournamentId,
				payload.roundNumber,
			);

			if (existingRound) {
				throw new ApiHttpError({
					status: 409,
					code: "CONFLICT",
					message: "Round number already exists for tournament.",
				});
			}

			const round = await repos.round.create({
				id: createId(),
				tournament: { connect: { id: payload.tournamentId } },
				roundNumber: payload.roundNumber,
				status: "SCHEDULED",
				startsAt: payload.startsAt ? new Date(payload.startsAt) : null,
			});

			return ok(
				c,
				{
					round: toRoundDto(round),
				},
				201,
			);
		},
	);

	router.patch(
		"/api/rounds/:id",
		requireAuth,
		validateParam(roundIdParamSchema),
		validateJson(updateRoundRequestSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const payload = c.req.valid("json");
			const round = await requireRound(repos, id);
			const tournament = await requireTournament(
				repos,
				round.tournamentId,
			);

			await assertAdminMembership(
				repos,
				tournament.clubId,
				c.get("user")?.id,
			);

			if (
				payload.tournamentId &&
				payload.tournamentId !== round.tournamentId
			) {
				const targetTournament = await requireTournament(
					repos,
					payload.tournamentId,
				);
				await assertAdminMembership(
					repos,
					targetTournament.clubId,
					c.get("user")?.id,
				);
			}

			const updatedRound = await repos.round.update(id, {
				tournament: payload.tournamentId
					? {
							connect: { id: payload.tournamentId },
						}
					: undefined,
				roundNumber: payload.roundNumber,
				startsAt: payload.startsAt
					? new Date(payload.startsAt)
					: payload.startsAt === undefined
						? undefined
						: null,
			});

			return ok(c, {
				round: toRoundDto(updatedRound),
			});
		},
	);

	router.delete(
		"/api/rounds/:id",
		requireAuth,
		validateParam(roundIdParamSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const round = await requireRound(repos, id);
			const tournament = await requireTournament(
				repos,
				round.tournamentId,
			);

			await assertAdminMembership(
				repos,
				tournament.clubId,
				c.get("user")?.id,
			);

			await repos.round.delete(id);
			return ok(c, { deleted: true });
		},
	);

	router.get(
		"/api/matches",
		requireAuth,
		validateQuery(listMatchesQuerySchema.merge(paginationQuerySchema)),
		async (c) => {
			const query = c.req.valid("query");
			const round = await requireRound(repos, query.roundId);
			const tournament = await requireTournament(
				repos,
				round.tournamentId,
			);

			await assertAdminMembership(
				repos,
				tournament.clubId,
				c.get("user")?.id,
			);

			const offset = (query.page - 1) * query.pageSize;
			const where = { roundId: query.roundId };

			const [matches, total] = await Promise.all([
				repos.match.findMany({
					where,
					skip: offset,
					take: query.pageSize,
					orderBy: { boardNumber: "asc" },
					include: { clock: true, result: true },
				}),
				repos.match.count({ where }),
			]);

			return ok(c, {
				// @ts-expect-error type error but functional
				items: matches.map(toMatchDto),
				page: query.page,
				pageSize: query.pageSize,
				total,
			});
		},
	);

	router.get(
		"/api/matches/:id",
		requireAuth,
		validateParam(matchIdParamSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const match = await requireMatchWithRelations(repos, id);
			const round = await requireRound(repos, match.roundId);
			const tournament = await requireTournament(
				repos,
				round.tournamentId,
			);

			await assertAdminMembership(
				repos,
				tournament.clubId,
				c.get("user")?.id,
			);

			return ok(c, {
				match: toMatchDto(match),
			});
		},
	);

	router.post(
		"/api/matches",
		requireAuth,
		validateJson(createMatchRequestSchema),
		async (c) => {
			const payload = c.req.valid("json");
			const round = await requireRound(repos, payload.roundId);
			const tournament = await requireTournament(
				repos,
				round.tournamentId,
			);

			await assertAdminMembership(
				repos,
				tournament.clubId,
				c.get("user")?.id,
			);

			if (payload.whitePlayerId === payload.blackPlayerId) {
				throw new ApiHttpError({
					status: 422,
					code: "UNPROCESSABLE",
					message: "White and black players must be different.",
				});
			}

			const existingMatch = await repos.match.findByRoundAndBoard(
				payload.roundId,
				payload.boardNumber,
			);

			if (existingMatch) {
				throw new ApiHttpError({
					status: 409,
					code: "CONFLICT",
					message: "Board number already exists for this round.",
				});
			}

			const [whitePlayer, blackPlayer] = await Promise.all([
				repos.player.findById(payload.whitePlayerId),
				repos.player.findById(payload.blackPlayerId),
			]);

			if (!whitePlayer || !blackPlayer) {
				throw new ApiHttpError({
					status: 404,
					code: "NOT_FOUND",
					message: "One or more players were not found.",
				});
			}

			if (
				whitePlayer.clubId !== tournament.clubId ||
				blackPlayer.clubId !== tournament.clubId
			) {
				throw new ApiHttpError({
					status: 422,
					code: "UNPROCESSABLE",
					message: "Players must belong to tournament club.",
				});
			}

			const match = await repos.match.create({
				id: createId(),
				round: { connect: { id: payload.roundId } },
				boardNumber: payload.boardNumber,
				whitePlayer: { connect: { id: payload.whitePlayerId } },
				blackPlayer: { connect: { id: payload.blackPlayerId } },
				status: "PENDING",
				initialSeconds: payload.initialSeconds,
				incrementSeconds: payload.incrementSeconds,
				clock: {
					create: {
						id: createId(),
						whiteRemainingMs: payload.initialSeconds * 1000,
						blackRemainingMs: payload.initialSeconds * 1000,
						activeColor: null,
						isRunning: false,
						lastSyncedAt: new Date(),
					},
				},
			});

			const fullMatch = await requireMatchWithRelations(repos, match.id);

			return ok(
				c,
				{
					match: toMatchDto(fullMatch),
				},
				201,
			);
		},
	);

	router.patch(
		"/api/matches/:id",
		requireAuth,
		validateParam(matchIdParamSchema),
		validateJson(updateMatchRequestSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const payload = c.req.valid("json");
			const match = await requireMatchWithRelations(repos, id);
			const currentRound = await requireRound(repos, match.roundId);
			const currentTournament = await requireTournament(
				repos,
				currentRound.tournamentId,
			);

			await assertAdminMembership(
				repos,
				currentTournament.clubId,
				c.get("user")?.id,
			);

			if (payload.roundId && payload.roundId !== match.roundId) {
				const targetRound = await requireRound(repos, payload.roundId);
				const targetTournament = await requireTournament(
					repos,
					targetRound.tournamentId,
				);
				await assertAdminMembership(
					repos,
					targetTournament.clubId,
					c.get("user")?.id,
				);
			}

			const nextWhitePlayerId =
				payload.whitePlayerId ?? match.whitePlayerId;
			const nextBlackPlayerId =
				payload.blackPlayerId ?? match.blackPlayerId;

			if (nextWhitePlayerId === nextBlackPlayerId) {
				throw new ApiHttpError({
					status: 422,
					code: "UNPROCESSABLE",
					message: "White and black players must be different.",
				});
			}

			const updatedMatch = await repos.match.update(id, {
				round: payload.roundId
					? {
							connect: { id: payload.roundId },
						}
					: undefined,
				boardNumber: payload.boardNumber,
				whitePlayer: payload.whitePlayerId
					? {
							connect: { id: payload.whitePlayerId },
						}
					: undefined,
				blackPlayer: payload.blackPlayerId
					? {
							connect: { id: payload.blackPlayerId },
						}
					: undefined,
				initialSeconds: payload.initialSeconds,
				incrementSeconds: payload.incrementSeconds,
				clock:
					payload.initialSeconds !== undefined
						? {
								update: {
									whiteRemainingMs:
										payload.initialSeconds * 1000,
									blackRemainingMs:
										payload.initialSeconds * 1000,
									lastSyncedAt: new Date(),
								},
							}
						: undefined,
			});

			const fullMatch = await requireMatchWithRelations(
				repos,
				updatedMatch.id,
			);

			return ok(c, {
				match: toMatchDto(fullMatch),
			});
		},
	);

	router.delete(
		"/api/matches/:id",
		requireAuth,
		validateParam(matchIdParamSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const match = await requireMatchWithRelations(repos, id);
			const round = await requireRound(repos, match.roundId);
			const tournament = await requireTournament(
				repos,
				round.tournamentId,
			);

			await assertAdminMembership(
				repos,
				tournament.clubId,
				c.get("user")?.id,
			);
			await repos.match.delete(id);

			return ok(c, { deleted: true });
		},
	);

	router.post(
		"/api/matches/:id/result",
		requireAuth,
		validateParam(matchIdParamSchema),
		validateJson(assignMatchResultBodySchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const payload = c.req.valid("json");
			const sessionUserId = c.get("user")?.id;
			const match = await requireMatchWithRelations(repos, id);
			const round = await requireRound(repos, match.roundId);
			const tournament = await requireTournament(
				repos,
				round.tournamentId,
			);

			await assertAdminMembership(
				repos,
				tournament.clubId,
				sessionUserId,
			);

			const validatedResult = validateMatchResultAssignment({
				match: {
					id: match.id,
					whitePlayerId: match.whitePlayerId,
					blackPlayerId: match.blackPlayerId,
					status: match.status,
					result: match.result ? toResultDto(match.result) : null,
				},
				outcome: payload.outcome,
				reason: payload.reason,
				assignedByUserId: sessionUserId,
			});

			const result = await repos.result.create({
				id: createId(),
				match: { connect: { id: validatedResult.matchId } },
				outcome: validatedResult.outcome,
				reason: validatedResult.reason,
				assignedByUser: {
					connect: { id: validatedResult.assignedByUserId },
				},
				assignedAt: new Date(nowIsoDateTime()),
			});

			await repos.match.update(id, {
				status: validatedResult.newStatus,
			});

			await recomputeStandings(repos, tournament.id);

			const updatedMatch = await requireMatchWithRelations(repos, id);

			return ok(c, {
				result: toResultDto(result),
				match: toMatchDto(updatedMatch),
			});
		},
	);

	return router;
}

async function assertAdminMembership(
	repos: Repositories,
	clubId: string,
	userId: string,
) {
	const membership = await repos.membership.findByClubAndUser(clubId, userId);

	if (!membership || membership.role !== "ADMIN") {
		throw new ApiHttpError({
			status: 403,
			code: "FORBIDDEN",
			message: "Admin membership is required.",
		});
	}
}

async function requireTournament(repos: Repositories, tournamentId: string) {
	const tournament = await repos.tournament.findById(tournamentId);

	if (!tournament) {
		throw new ApiHttpError({
			status: 404,
			code: "NOT_FOUND",
			message: "Tournament not found.",
		});
	}

	return tournament;
}

async function requireRound(repos: Repositories, roundId: string) {
	const round = await repos.round.findById(roundId);

	if (!round) {
		throw new ApiHttpError({
			status: 404,
			code: "NOT_FOUND",
			message: "Round not found.",
		});
	}

	return round;
}

async function requireMatchWithRelations(repos: Repositories, matchId: string) {
	const match = await repos.match.findByIdWithRelations(matchId);

	if (!match) {
		throw new ApiHttpError({
			status: 404,
			code: "NOT_FOUND",
			message: "Match not found.",
		});
	}

	return match;
}

async function recomputeStandings(repos: Repositories, tournamentId: string) {
	const tournament = await requireTournament(repos, tournamentId);

	const rounds = await repos.round.findMany({
		where: { tournamentId },
		select: { id: true },
	});

	const roundIds = rounds.map((round) => round.id);

	const [players, matches] = await Promise.all([
		repos.player.findMany({
			where: { clubId: tournament.clubId },
			select: { id: true },
		}),
		roundIds.length > 0
			? repos.match.findMany({
					where: {
						roundId: {
							in: roundIds,
						},
					},
					include: { result: true },
				})
			: Promise.resolve([]),
	]);

	if (players.length === 0) {
		await repos.standing.deleteManyByTournament(tournamentId);
		return;
	}

	const standings = computeStandings({
		tournamentId,
		playerIds: players.map((player) => player.id),
		matches: matches.map((match) => ({
			whitePlayerId: match.whitePlayerId,
			blackPlayerId: match.blackPlayerId,
			// @ts-ignore typing error
			outcome: match.result?.outcome ?? null,
		})),
		computedAt: nowIsoDateTime(),
	});

	await repos.standing.deleteManyByTournament(tournamentId);

	await Promise.all(
		standings.entries.map((entry) =>
			repos.standing.create({
				id: createId(),
				tournament: { connect: { id: tournamentId } },
				player: { connect: { id: entry.playerId } },
				points: entry.points,
				gamesPlayed: entry.gamesPlayed,
				wins: entry.wins,
				draws: entry.draws,
				losses: entry.losses,
				tieBreak: entry.tieBreak,
				rank: entry.rank,
			}),
		),
	);
}
