import { z } from "zod";
import { entityIdSchema, isoDateTimeSchema, paginatedSchema } from "./primitives";

export const playerDtoSchema = z.object({
	id: entityIdSchema,
	clubId: entityIdSchema,
	userId: entityIdSchema.nullable(),
	displayName: z.string().min(1).max(120),
	rating: z.number().int().min(0).nullable(),
	createdAt: isoDateTimeSchema,
	updatedAt: isoDateTimeSchema,
});

export const createPlayerRequestSchema = z.object({
	clubId: entityIdSchema,
	displayName: z.string().min(1).max(120),
	userId: entityIdSchema.optional(),
	rating: z.number().int().min(0).optional(),
});

export const createPlayerResponseSchema = z.object({
	player: playerDtoSchema,
});

export const listPlayersQuerySchema = z.object({
	clubId: entityIdSchema,
});

export const listPlayersResponseSchema = paginatedSchema(playerDtoSchema);

export type PlayerDto = z.infer<typeof playerDtoSchema>;
export type CreatePlayerRequest = z.infer<typeof createPlayerRequestSchema>;
export type CreatePlayerResponse = z.infer<typeof createPlayerResponseSchema>;
export type ListPlayersQuery = z.infer<typeof listPlayersQuerySchema>;
export type ListPlayersResponse = z.infer<typeof listPlayersResponseSchema>;
