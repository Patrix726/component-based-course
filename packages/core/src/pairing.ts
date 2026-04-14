import type { EntityId, PieceColor } from "@component-based-software/types";
import { CoreRuleError } from "./errors";

export type PairingParticipant = {
	playerId: EntityId;
	points: number;
	colorHistory?: PieceColor[];
	hadBye?: boolean;
};

export type PairingHistoryMatch = {
	whitePlayerId: EntityId;
	blackPlayerId: EntityId;
};

export type GeneratedPairing = {
	boardNumber: number;
	whitePlayerId: EntityId;
	blackPlayerId: EntityId;
};

export type PairingWarningCode = "FORCED_REMATCH" | "REPEATED_BYE";

export type PairingWarning = {
	code: PairingWarningCode;
	message: string;
	boardNumber?: number;
	playerId?: EntityId;
};

export type GenerateRoundPairingsInput = {
	participants: PairingParticipant[];
	previousMatches?: PairingHistoryMatch[];
};

export type GenerateRoundPairingsResult = {
	pairings: GeneratedPairing[];
	byePlayerId: EntityId | null;
	warnings: PairingWarning[];
};

const REMATCH_PENALTY = 10_000;

export function generateRoundPairings(
	input: GenerateRoundPairingsInput,
): GenerateRoundPairingsResult {
	validateParticipants(input.participants);

	const playedMap = buildPlayedMap(input.previousMatches ?? []);
	const warnings: PairingWarning[] = [];
	const sortedParticipants = [...input.participants].sort(sortParticipants);

	let byePlayerId: EntityId | null = null;
	const pairingPool = [...sortedParticipants];

	if (pairingPool.length % 2 !== 0) {
		const bye = pickByeCandidate(pairingPool);
		byePlayerId = bye.playerId;

		if (bye.hadBye) {
			warnings.push({
				code: "REPEATED_BYE",
				message:
					"No eligible player without a previous bye was available; assigning repeated bye.",
				playerId: bye.playerId,
			});
		}

		const byeIndex = pairingPool.findIndex(
			(participant) => participant.playerId === bye.playerId,
		);

		if (byeIndex >= 0) {
			pairingPool.splice(byeIndex, 1);
		}
	}

	const pairings: GeneratedPairing[] = [];
	let boardNumber = 1;

	while (pairingPool.length > 1) {
		const first = pairingPool.shift();

		if (!first) {
			break;
		}

		const bestPartnerIndex = findBestPartnerIndex(first, pairingPool, playedMap);
		const partner = pairingPool.splice(bestPartnerIndex, 1)[0];

		if (!partner) {
			throw new CoreRuleError(
				"INVALID_PAIRING_INPUT",
				"Unable to create complete pairings from participant list.",
			);
		}

		const choice = chooseColorAssignment(first, partner, playedMap);
		pairings.push({
			boardNumber,
			whitePlayerId: choice.whitePlayerId,
			blackPlayerId: choice.blackPlayerId,
		});

		if (choice.isRematch) {
			warnings.push({
				code: "FORCED_REMATCH",
				message:
					"Previous opponents were paired again to keep the round pairable.",
				boardNumber,
			});
		}

		boardNumber += 1;
	}

	return { pairings, byePlayerId, warnings };
}

function validateParticipants(participants: PairingParticipant[]) {
	if (participants.length < 2) {
		throw new CoreRuleError(
			"INVALID_PAIRING_INPUT",
			"At least two participants are required to generate pairings.",
		);
	}

	const uniquePlayerIds = new Set<EntityId>();

	for (const participant of participants) {
		if (uniquePlayerIds.has(participant.playerId)) {
			throw new CoreRuleError(
				"INVALID_PAIRING_INPUT",
				"Participants must contain unique player ids.",
				{ playerId: participant.playerId },
			);
		}

		uniquePlayerIds.add(participant.playerId);
	}
}

function sortParticipants(a: PairingParticipant, b: PairingParticipant) {
	if (a.points !== b.points) {
		return b.points - a.points;
	}

	return a.playerId.localeCompare(b.playerId);
}

function pickByeCandidate(participants: PairingParticipant[]) {
	for (let index = participants.length - 1; index >= 0; index -= 1) {
		const participant = participants[index];

		if (participant && !participant.hadBye) {
			return participant;
		}
	}

	const fallback = participants[participants.length - 1];

	if (!fallback) {
		throw new CoreRuleError(
			"INVALID_PAIRING_INPUT",
			"Unable to choose a bye candidate.",
		);
	}

	return fallback;
}

function findBestPartnerIndex(
	first: PairingParticipant,
	remainingParticipants: PairingParticipant[],
	playedMap: Map<EntityId, Set<EntityId>>,
) {
	if (remainingParticipants.length === 0) {
		throw new CoreRuleError(
			"INVALID_PAIRING_INPUT",
			"A partner was required, but no participants remained.",
		);
	}

	let bestIndex = 0;
	let bestPenalty = Number.POSITIVE_INFINITY;

	for (let index = 0; index < remainingParticipants.length; index += 1) {
		const candidate = remainingParticipants[index];

		if (!candidate) {
			continue;
		}

		const assignment = chooseColorAssignment(first, candidate, playedMap);
		const scoreGapPenalty = Math.abs(first.points - candidate.points) * 100;
		const totalPenalty = scoreGapPenalty + assignment.colorPenalty;

		if (totalPenalty < bestPenalty) {
			bestPenalty = totalPenalty;
			bestIndex = index;
		}
	}

	return bestIndex;
}

function chooseColorAssignment(
	a: PairingParticipant,
	b: PairingParticipant,
	playedMap: Map<EntityId, Set<EntityId>>,
) {
	const playedBefore = hasPlayedBefore(a.playerId, b.playerId, playedMap);
	const rematchPenalty = playedBefore ? REMATCH_PENALTY : 0;

	const aImbalance = colorImbalance(a.colorHistory);
	const bImbalance = colorImbalance(b.colorHistory);

	const aWhitePenalty =
		Math.abs(aImbalance + 1) + Math.abs(bImbalance - 1) + rematchPenalty;
	const bWhitePenalty =
		Math.abs(bImbalance + 1) + Math.abs(aImbalance - 1) + rematchPenalty;

	if (aWhitePenalty < bWhitePenalty) {
		return {
			whitePlayerId: a.playerId,
			blackPlayerId: b.playerId,
			colorPenalty: aWhitePenalty,
			isRematch: playedBefore,
		};
	}

	if (bWhitePenalty < aWhitePenalty) {
		return {
			whitePlayerId: b.playerId,
			blackPlayerId: a.playerId,
			colorPenalty: bWhitePenalty,
			isRematch: playedBefore,
		};
	}

	if (a.playerId.localeCompare(b.playerId) <= 0) {
		return {
			whitePlayerId: a.playerId,
			blackPlayerId: b.playerId,
			colorPenalty: aWhitePenalty,
			isRematch: playedBefore,
		};
	}

	return {
		whitePlayerId: b.playerId,
		blackPlayerId: a.playerId,
		colorPenalty: bWhitePenalty,
		isRematch: playedBefore,
	};
}

function colorImbalance(colorHistory: PieceColor[] | undefined) {
	if (!colorHistory || colorHistory.length === 0) {
		return 0;
	}

	let balance = 0;

	for (const color of colorHistory) {
		balance += color === "WHITE" ? 1 : -1;
	}

	return balance;
}

function buildPlayedMap(previousMatches: PairingHistoryMatch[]) {
	const playedMap = new Map<EntityId, Set<EntityId>>();

	for (const match of previousMatches) {
		if (match.whitePlayerId === match.blackPlayerId) {
			continue;
		}

		addPlayedEdge(match.whitePlayerId, match.blackPlayerId, playedMap);
		addPlayedEdge(match.blackPlayerId, match.whitePlayerId, playedMap);
	}

	return playedMap;
}

function addPlayedEdge(
	playerId: EntityId,
	opponentId: EntityId,
	playedMap: Map<EntityId, Set<EntityId>>,
) {
	const current = playedMap.get(playerId) ?? new Set<EntityId>();
	current.add(opponentId);
	playedMap.set(playerId, current);
}

function hasPlayedBefore(
	playerA: EntityId,
	playerB: EntityId,
	playedMap: Map<EntityId, Set<EntityId>>,
) {
	return playedMap.get(playerA)?.has(playerB) ?? false;
}
