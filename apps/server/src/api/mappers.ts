import type {
	MatchClockDto,
	MatchDto,
	ResultDto,
	RoundDto,
	TournamentDto,
} from "@component-based-software/types";

type DbTournament = {
	id: string;
	clubId: string;
	name: string;
	format: TournamentDto["format"];
	roundsCount: number;
	initialSeconds: number;
	incrementSeconds: number;
	startsAt: Date | null;
	createdByUserId: string;
	createdAt: Date;
	updatedAt: Date;
};

type DbRound = {
	id: string;
	tournamentId: string;
	roundNumber: number;
	status: RoundDto["status"];
	startsAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

type DbMatchClock = {
	id: string;
	matchId: string;
	whiteRemainingMs: number;
	blackRemainingMs: number;
	activeColor: MatchClockDto["activeColor"];
	isRunning: boolean;
	lastSyncedAt: Date;
};

type DbResult = {
	id: string;
	matchId: string;
	outcome: ResultDto["outcome"];
	reason: string | null;
	assignedByUserId: string;
	assignedAt: Date;
};

type DbMatch = {
	id: string;
	roundId: string;
	boardNumber: number;
	whitePlayerId: string;
	blackPlayerId: string;
	status: MatchDto["status"];
	initialSeconds: number;
	incrementSeconds: number;
	createdAt: Date;
	updatedAt: Date;
	clock: DbMatchClock | null;
	result: DbResult | null;
};

export type MatchWithRelations = DbMatch;

export function toTournamentDto(tournament: DbTournament): TournamentDto {
	return {
		id: tournament.id,
		clubId: tournament.clubId,
		name: tournament.name,
		format: tournament.format,
		roundsCount: tournament.roundsCount,
		initialSeconds: tournament.initialSeconds,
		incrementSeconds: tournament.incrementSeconds,
		startsAt: tournament.startsAt?.toISOString() ?? null,
		createdByUserId: tournament.createdByUserId,
		createdAt: tournament.createdAt.toISOString(),
		updatedAt: tournament.updatedAt.toISOString(),
	};
}

export function toRoundDto(round: DbRound): RoundDto {
	return {
		id: round.id,
		tournamentId: round.tournamentId,
		roundNumber: round.roundNumber,
		status: round.status,
		startsAt: round.startsAt?.toISOString() ?? null,
		createdAt: round.createdAt.toISOString(),
		updatedAt: round.updatedAt.toISOString(),
	};
}

export function toResultDto(result: DbResult): ResultDto {
	return {
		id: result.id,
		matchId: result.matchId,
		outcome: result.outcome,
		reason: result.reason ?? undefined,
		assignedByUserId: result.assignedByUserId,
		assignedAt: result.assignedAt.toISOString(),
	};
}

export function toMatchDto(match: DbMatch): MatchDto {
	return {
		id: match.id,
		roundId: match.roundId,
		boardNumber: match.boardNumber,
		whitePlayerId: match.whitePlayerId,
		blackPlayerId: match.blackPlayerId,
		status: match.status,
		initialSeconds: match.initialSeconds,
		incrementSeconds: match.incrementSeconds,
		clock: match.clock
			? {
					id: match.clock.id,
					matchId: match.clock.matchId,
					whiteRemainingMs: match.clock.whiteRemainingMs,
					blackRemainingMs: match.clock.blackRemainingMs,
					activeColor: match.clock.activeColor,
					isRunning: match.clock.isRunning,
					lastSyncedAt: match.clock.lastSyncedAt.toISOString(),
			  }
			: null,
		result: match.result ? toResultDto(match.result) : null,
		createdAt: match.createdAt.toISOString(),
		updatedAt: match.updatedAt.toISOString(),
	};
}
