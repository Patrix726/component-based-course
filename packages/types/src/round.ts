import { z } from "zod";
import { entityIdSchema, isoDateTimeSchema, paginatedSchema } from "./primitives";

export const roundStatusSchema = z.enum(["SCHEDULED", "ONGOING", "COMPLETED"]);

export const createRoundRequestSchema = z.object({
	tournamentId: entityIdSchema,
	roundNumber: z.number().int().min(1),
	startsAt: isoDateTimeSchema.optional(),
});

export const roundDtoSchema = z.object({
	id: entityIdSchema,
	tournamentId: entityIdSchema,
	roundNumber: z.number().int().min(1),
	status: roundStatusSchema,
	startsAt: isoDateTimeSchema.nullable(),
	createdAt: isoDateTimeSchema,
	updatedAt: isoDateTimeSchema,
});

export const listRoundsQuerySchema = z.object({
	tournamentId: entityIdSchema,
});

export const listRoundsResponseSchema = paginatedSchema(roundDtoSchema);

export const createRoundResponseSchema = z.object({
	round: roundDtoSchema,
});

export type RoundStatus = z.infer<typeof roundStatusSchema>;
export type CreateRoundRequest = z.infer<typeof createRoundRequestSchema>;
export type RoundDto = z.infer<typeof roundDtoSchema>;
export type ListRoundsQuery = z.infer<typeof listRoundsQuerySchema>;
export type ListRoundsResponse = z.infer<typeof listRoundsResponseSchema>;
export type CreateRoundResponse = z.infer<typeof createRoundResponseSchema>;
