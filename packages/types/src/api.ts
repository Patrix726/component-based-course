import { z } from "zod";

export const apiErrorCodeSchema = z.enum([
	"BAD_REQUEST",
	"UNAUTHORIZED",
	"FORBIDDEN",
	"NOT_FOUND",
	"CONFLICT",
	"UNPROCESSABLE",
	"INTERNAL",
]);

export const apiErrorSchema = z.object({
	code: apiErrorCodeSchema,
	message: z.string().min(1),
	details: z.unknown().optional(),
});

export const apiSuccessMetaSchema = z.object({
	requestId: z.string().min(1).optional(),
	timestamp: z.string().min(1),
});

export const apiEnvelopeSchema = <TData extends z.ZodTypeAny>(dataSchema: TData) =>
	z.object({
		ok: z.literal(true),
		data: dataSchema,
		meta: apiSuccessMetaSchema,
	});

export const apiErrorEnvelopeSchema = z.object({
	ok: z.literal(false),
	error: apiErrorSchema,
	meta: apiSuccessMetaSchema,
});

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiSuccessMeta = z.infer<typeof apiSuccessMetaSchema>;
export type ApiEnvelope<TData> = {
	ok: true;
	data: TData;
	meta: ApiSuccessMeta;
};
export type ApiErrorEnvelope = z.infer<typeof apiErrorEnvelopeSchema>;
