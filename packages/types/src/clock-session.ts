import { z } from "zod";
import { entityIdSchema, isoDateTimeSchema } from "./primitives";
import { pieceColorSchema } from "./match";

export const clockViewRoleSchema = z.enum(["PLAYER", "ADMIN_OBSERVER"]);

export const matchClockSessionPayloadSchema = z.object({
	matchId: entityIdSchema,
	playerId: entityIdSchema,
	color: pieceColorSchema,
	clockConfig: z.object({
		initialSeconds: z.number().int().min(60),
		incrementSeconds: z.number().int().min(0).max(120),
	}),
});

export const createClockSessionRequestSchema = z.object({
	matchId: entityIdSchema,
	viewerRole: clockViewRoleSchema,
	playerId: entityIdSchema.optional(),
});

export const clockSessionDtoSchema = z.object({
	id: entityIdSchema,
	matchId: entityIdSchema,
	viewerRole: clockViewRoleSchema,
	playerId: entityIdSchema.nullable(),
	joinToken: z.string().min(1),
	qrUrl: z.string().url(),
	createdAt: isoDateTimeSchema,
	expiresAt: isoDateTimeSchema,
});

export const createClockSessionResponseSchema = z.object({
	session: clockSessionDtoSchema,
	payload: matchClockSessionPayloadSchema,
});

export type ClockViewRole = z.infer<typeof clockViewRoleSchema>;
export type MatchClockSessionPayload = z.infer<typeof matchClockSessionPayloadSchema>;
export type CreateClockSessionRequest = z.infer<typeof createClockSessionRequestSchema>;
export type ClockSessionDto = z.infer<typeof clockSessionDtoSchema>;
export type CreateClockSessionResponse = z.infer<typeof createClockSessionResponseSchema>;
