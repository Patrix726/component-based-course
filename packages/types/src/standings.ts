import { z } from "zod";
import { entityIdSchema } from "./primitives";

export const standingEntryDtoSchema = z.object({
	playerId: entityIdSchema,
	points: z.number().min(0),
	gamesPlayed: z.number().int().min(0),
	wins: z.number().int().min(0),
	draws: z.number().int().min(0),
	losses: z.number().int().min(0),
	tieBreak: z.number().nullable(),
	rank: z.number().int().min(1),
});

export const standingsDtoSchema = z.object({
	tournamentId: entityIdSchema,
	entries: z.array(standingEntryDtoSchema),
	computedAt: z.string().min(1),
});

export const getStandingsQuerySchema = z.object({
	tournamentId: entityIdSchema,
});

export const getStandingsResponseSchema = z.object({
	standings: standingsDtoSchema,
});

export type StandingEntryDto = z.infer<typeof standingEntryDtoSchema>;
export type StandingsDto = z.infer<typeof standingsDtoSchema>;
export type GetStandingsQuery = z.infer<typeof getStandingsQuerySchema>;
export type GetStandingsResponse = z.infer<typeof getStandingsResponseSchema>;
