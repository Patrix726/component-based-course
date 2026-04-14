import type {
	EntityId,
	MatchStatus,
	MatchResultOutcome,
	ResultDto,
} from "@component-based-software/types";
import { CoreRuleError } from "./errors";

export type ResultValidationInput = {
	match: {
		id: EntityId;
		whitePlayerId: EntityId;
		blackPlayerId: EntityId;
		status: MatchStatus;
		result: ResultDto | null;
	};
	outcome: MatchResultOutcome;
	assignedByUserId: EntityId;
	reason?: string;
};

export type ValidatedResultAssignment = {
	matchId: EntityId;
	outcome: MatchResultOutcome;
	assignedByUserId: EntityId;
	reason?: string;
	newStatus: MatchStatus;
};

const ALLOWED_STATUSES: ReadonlySet<MatchStatus> = new Set([
	"PENDING",
	"IN_PROGRESS",
	"RESULT_SUBMITTED",
]);

export function validateMatchResultAssignment(
	input: ResultValidationInput,
): ValidatedResultAssignment {
	if (!ALLOWED_STATUSES.has(input.match.status)) {
		throw new CoreRuleError(
			"INVALID_RESULT_ASSIGNMENT",
			`Cannot assign result for match in status '${input.match.status}'.`,
			{ status: input.match.status },
		);
	}

	if (input.match.result !== null) {
		throw new CoreRuleError(
			"INVALID_RESULT_ASSIGNMENT",
			"Result has already been assigned for this match.",
			{ matchId: input.match.id },
		);
	}

	if (input.match.whitePlayerId === input.match.blackPlayerId) {
		throw new CoreRuleError(
			"INVALID_RESULT_ASSIGNMENT",
			"Match has invalid players; white and black players must differ.",
			{ matchId: input.match.id },
		);
	}

	const normalizedReason = normalizeReason(input.reason);

	return {
		matchId: input.match.id,
		outcome: input.outcome,
		assignedByUserId: input.assignedByUserId,
		reason: normalizedReason,
		newStatus: "LOCKED",
	};
}

function normalizeReason(reason?: string) {
	if (typeof reason !== "string") {
		return undefined;
	}

	const trimmed = reason.trim();
	return trimmed.length > 0 ? trimmed : undefined;
}
