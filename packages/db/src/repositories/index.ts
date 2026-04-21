import type { PrismaClient } from "../../prisma/generated/client";
import { createClubRepository } from "./club";
import { createMatchRepository } from "./match";
import { createMatchClockRepository } from "./match-clock";
import { createMembershipRepository } from "./membership";
import { createPlayerRepository } from "./player";
import { createResultRepository } from "./result";
import { createRoundRepository } from "./round";
import { createStandingRepository } from "./standing";
import { createTournamentRepository } from "./tournament";
import { createUserRepository } from "./user";

export const createRepositories = (prisma: PrismaClient) => ({
	club: createClubRepository(prisma),
	membership: createMembershipRepository(prisma),
	player: createPlayerRepository(prisma),
	tournament: createTournamentRepository(prisma),
	round: createRoundRepository(prisma),
	match: createMatchRepository(prisma),
	matchClock: createMatchClockRepository(prisma),
	result: createResultRepository(prisma),
	standing: createStandingRepository(prisma),
	user: createUserRepository(prisma),
});

export type Repositories = ReturnType<typeof createRepositories>;
