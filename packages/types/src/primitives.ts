import { z } from "zod";

export const entityIdSchema = z.string().min(1);
export const userIdSchema = z.string().min(1);
export const isoDateTimeSchema = z.string().min(1);

export const paginationQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type EntityId = z.infer<typeof entityIdSchema>;
export type UserId = z.infer<typeof userIdSchema>;
export type IsoDateTime = z.infer<typeof isoDateTimeSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const paginatedSchema = <TItem extends z.ZodTypeAny>(itemSchema: TItem) =>
	z.object({
		items: z.array(itemSchema),
		page: z.number().int().min(1),
		pageSize: z.number().int().min(1),
		total: z.number().int().min(0),
	});

export type Paginated<TItem> = {
	items: TItem[];
	page: number;
	pageSize: number;
	total: number;
};
