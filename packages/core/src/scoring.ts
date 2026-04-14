import type {
	EntityId,
	IsoDateTime,
	MatchResultOutcome,
	StandingsDto,
	StandingEntryDto,
} from "@component-based-software/types";
import { CoreRuleError } from "./errors";

export type ScoringSystem = {
	winPoints: number;
	drawPoints: number;
	lossPoints: number;
};

export type ScorableMatch = {
	whitePlayerId: EntityId;
	blackPlayerId: EntityId;
	outcome: MatchResultOutcome | null;
};

export type ComputeStandingsInput = {
	tournamentId: EntityId;
	playerIds: EntityId[];
	matches: ScorableMatch[];
	computedAt: IsoDateTime;
	scoring?: Partial<ScoringSystem>;
};

const DEFAULT_SCORING_SYSTEM: ScoringSystem = {
	winPoints: 1,
	drawPoints: 0.5,
	lossPoints: 0,
};

export function computeStandings(input: ComputeStandingsInput): StandingsDto {
	validateComputeStandingsInput(input);

	const scoring: ScoringSystem = {
		...DEFAULT_SCORING_SYSTEM,
		...input.scoring,
	};

	const table = new Map<EntityId, Omit<StandingEntryDto, "rank" | "tieBreak">>();

	for (const playerId of input.playerIds) {
		table.set(playerId, {
			playerId,
			points: 0,
			gamesPlayed: 0,
			wins: 0,
			draws: 0,
			losses: 0,
		});
	}

	for (const match of input.matches) {
		if (match.outcome === null) {
			continue;
		}

		const white = table.get(match.whitePlayerId);
		const black = table.get(match.blackPlayerId);

		if (!white || !black) {
			throw new CoreRuleError(
				"INVALID_STANDINGS_INPUT",
				"All match participants must exist in playerIds.",
				{ match },
			);
		}

		white.gamesPlayed += 1;
		black.gamesPlayed += 1;

		if (match.outcome === "WHITE_WIN") {
			white.wins += 1;
			black.losses += 1;
			white.points += scoring.winPoints;
			black.points += scoring.lossPoints;
			continue;
		}

		if (match.outcome === "BLACK_WIN") {
			black.wins += 1;
			white.losses += 1;
			black.points += scoring.winPoints;
			white.points += scoring.lossPoints;
			continue;
		}

		white.draws += 1;
		black.draws += 1;
		white.points += scoring.drawPoints;
		black.points += scoring.drawPoints;
	}

	const orderedEntries = [...table.values()].sort(sortEntriesForRank);
	const entries: StandingEntryDto[] = orderedEntries.map((entry, index) => ({
		...entry,
		rank: index + 1,
		tieBreak: null,
	}));

	return {
		tournamentId: input.tournamentId,
		entries,
		computedAt: input.computedAt,
	};
}

function sortEntriesForRank(
	a: Omit<StandingEntryDto, "rank" | "tieBreak">,
	b: Omit<StandingEntryDto, "rank" | "tieBreak">,
) {
	if (a.points !== b.points) {
		return b.points - a.points;
	}

	if (a.wins !== b.wins) {
		return b.wins - a.wins;
	}

	if (a.draws !== b.draws) {
		return b.draws - a.draws;
	}

	return a.playerId.localeCompare(b.playerId);
}

function validateComputeStandingsInput(input: ComputeStandingsInput) {
	if (input.playerIds.length === 0) {
		throw new CoreRuleError(
			"INVALID_STANDINGS_INPUT",
			"Standings require at least one player.",
		);
	}

	const uniquePlayerIds = new Set(input.playerIds);

	if (uniquePlayerIds.size !== input.playerIds.length) {
		throw new CoreRuleError(
			"INVALID_STANDINGS_INPUT",
			"Standings input contains duplicate player ids.",
		);
	}

	for (const match of input.matches) {
		if (match.whitePlayerId === match.blackPlayerId) {
			throw new CoreRuleError(
				"INVALID_STANDINGS_INPUT",
				"A match cannot contain the same player as both white and black.",
				{ match },
			);
		}

		if (
			!uniquePlayerIds.has(match.whitePlayerId) ||
			!uniquePlayerIds.has(match.blackPlayerId)
		) {
			throw new CoreRuleError(
				"INVALID_STANDINGS_INPUT",
				"Match contains player id that is not in standings playerIds.",
				{ match },
			);
		}
	}
}
