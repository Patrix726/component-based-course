import { z } from "zod";
import { entityIdSchema, isoDateTimeSchema, paginatedSchema } from "./primitives";
import { timeControlSchema } from "./tournament";

export const pieceColorSchema = z.enum(["WHITE", "BLACK"]);
export const matchStatusSchema = z.enum([
	"PENDING",
	"IN_PROGRESS",
	"RESULT_SUBMITTED",
	"LOCKED",
]);
export const matchResultOutcomeSchema = z.enum([
	"WHITE_WIN",
	"BLACK_WIN",
	"DRAW",
]);

export const createMatchRequestSchema = z.object({
	roundId: entityIdSchema,
	boardNumber: z.number().int().min(1),
	whitePlayerId: entityIdSchema,
	blackPlayerId: entityIdSchema,
	timeControl: timeControlSchema,
});

export const matchClockDtoSchema = z.object({
	id: entityIdSchema,
	matchId: entityIdSchema,
	whiteRemainingMs: z.number().int().min(0),
	blackRemainingMs: z.number().int().min(0),
	activeColor: pieceColorSchema.nullable(),
	isRunning: z.boolean(),
	lastSyncedAt: isoDateTimeSchema,
});

export const resultDtoSchema = z.object({
	id: entityIdSchema,
	matchId: entityIdSchema,
	outcome: matchResultOutcomeSchema,
	reason: z.string().min(1).max(240).optional(),
	assignedByUserId: entityIdSchema,
	assignedAt: isoDateTimeSchema,
});

export const matchDtoSchema = z.object({
	id: entityIdSchema,
	roundId: entityIdSchema,
	boardNumber: z.number().int().min(1),
	whitePlayerId: entityIdSchema,
	blackPlayerId: entityIdSchema,
	status: matchStatusSchema,
	timeControl: timeControlSchema,
	clock: matchClockDtoSchema.nullable(),
	result: resultDtoSchema.nullable(),
	createdAt: isoDateTimeSchema,
	updatedAt: isoDateTimeSchema,
});

export const listMatchesQuerySchema = z.object({
	roundId: entityIdSchema,
});

export const listMatchesResponseSchema = paginatedSchema(matchDtoSchema);

export const createMatchResponseSchema = z.object({
	match: matchDtoSchema,
});

export const assignMatchResultRequestSchema = z.object({
	matchId: entityIdSchema,
	outcome: matchResultOutcomeSchema,
	reason: z.string().min(1).max(240).optional(),
});

export const assignMatchResultResponseSchema = z.object({
	result: resultDtoSchema,
	match: matchDtoSchema,
});

export type PieceColor = z.infer<typeof pieceColorSchema>;
export type MatchStatus = z.infer<typeof matchStatusSchema>;
export type MatchResultOutcome = z.infer<typeof matchResultOutcomeSchema>;
export type CreateMatchRequest = z.infer<typeof createMatchRequestSchema>;
export type MatchClockDto = z.infer<typeof matchClockDtoSchema>;
export type ResultDto = z.infer<typeof resultDtoSchema>;
export type MatchDto = z.infer<typeof matchDtoSchema>;
export type ListMatchesQuery = z.infer<typeof listMatchesQuerySchema>;
export type ListMatchesResponse = z.infer<typeof listMatchesResponseSchema>;
export type CreateMatchResponse = z.infer<typeof createMatchResponseSchema>;
export type AssignMatchResultRequest = z.infer<typeof assignMatchResultRequestSchema>;
export type AssignMatchResultResponse = z.infer<
	typeof assignMatchResultResponseSchema
>;
