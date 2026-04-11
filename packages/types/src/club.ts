import { z } from "zod";
import { entityIdSchema, isoDateTimeSchema, userIdSchema } from "./primitives";

export const membershipRoleSchema = z.enum(["ADMIN", "MEMBER"]);

export const clubDtoSchema = z.object({
	id: entityIdSchema,
	name: z.string().min(1).max(120),
	createdAt: isoDateTimeSchema,
	updatedAt: isoDateTimeSchema,
});

export const membershipDtoSchema = z.object({
	id: entityIdSchema,
	clubId: entityIdSchema,
	userId: userIdSchema,
	role: membershipRoleSchema,
	createdAt: isoDateTimeSchema,
	updatedAt: isoDateTimeSchema,
});

export type MembershipRole = z.infer<typeof membershipRoleSchema>;
export type ClubDto = z.infer<typeof clubDtoSchema>;
export type MembershipDto = z.infer<typeof membershipDtoSchema>;
