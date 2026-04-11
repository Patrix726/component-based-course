import { z } from "zod";
import {
	entityIdSchema,
	isoDateTimeSchema,
	paginatedSchema,
	paginationQuerySchema,
	userIdSchema,
} from "./primitives";

export const tournamentFormatSchema = z.enum([
	"SWISS",
	"ROUND_ROBIN",
	"ELIMINATION",
]);

export const timeControlSchema = z.object({
	initialSeconds: z.number().int().min(60),
	incrementSeconds: z.number().int().min(0).max(120),
});

export const createTournamentRequestSchema = z.object({
	clubId: entityIdSchema,
	name: z.string().min(1).max(120),
	format: tournamentFormatSchema,
	roundsCount: z.number().int().min(1).max(50),
	timeControl: timeControlSchema,
	startsAt: isoDateTimeSchema.optional(),
});

export const updateTournamentRequestSchema = createTournamentRequestSchema.partial();

export const tournamentDtoSchema = z.object({
	id: entityIdSchema,
	clubId: entityIdSchema,
	name: z.string(),
	format: tournamentFormatSchema,
	roundsCount: z.number().int().min(1),
	timeControl: timeControlSchema,
	startsAt: isoDateTimeSchema.nullable(),
	createdByUserId: userIdSchema,
	createdAt: isoDateTimeSchema,
	updatedAt: isoDateTimeSchema,
});

export const listTournamentsQuerySchema =
	paginationQuerySchema.extend({
		clubId: entityIdSchema,
		search: z.string().min(1).optional(),
	});

export const listTournamentsResponseSchema = paginatedSchema(tournamentDtoSchema);

export const createTournamentResponseSchema = z.object({
	tournament: tournamentDtoSchema,
});

export const getTournamentResponseSchema = z.object({
	tournament: tournamentDtoSchema,
});

export type TournamentFormat = z.infer<typeof tournamentFormatSchema>;
export type TimeControl = z.infer<typeof timeControlSchema>;
export type CreateTournamentRequest = z.infer<typeof createTournamentRequestSchema>;
export type UpdateTournamentRequest = z.infer<typeof updateTournamentRequestSchema>;
export type TournamentDto = z.infer<typeof tournamentDtoSchema>;
export type ListTournamentsQuery = z.infer<typeof listTournamentsQuerySchema>;
export type ListTournamentsResponse = z.infer<typeof listTournamentsResponseSchema>;
export type CreateTournamentResponse = z.infer<typeof createTournamentResponseSchema>;
export type GetTournamentResponse = z.infer<typeof getTournamentResponseSchema>;
