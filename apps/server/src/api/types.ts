import type { Session, User } from "./auth";

export type AppVariables = {
	user: User;
	session: Session;
};
