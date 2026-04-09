# Chess Club SaaS - Domain Map

## Actors

- Club Admin: creates tournaments, manages rounds, assigns results
- Player: joins match clock session and views assigned color

## Core Concepts

- Club: organization with admins and members
- Membership: role binding for user within a club
- Tournament: admin-created event with format and rounds
- Round: a grouping of matches within a tournament
- Match: two players, fixed colors, clock configuration, result
- Clock Session: live clock state tied to a match
- Result: admin-declared outcome (white win, black win, draw)

## Key Flows

1. Admin creates tournament
2. Admin/System creates round and assigns pairings
3. System fixes colors and starts clock session
4. Players join via QR/Link and view clocks
5. Admin assigns result and updates standings

## Bounded Contexts

- Tournament Management: creation, pairing, results, standings
- Realtime Clock: session sync, admin monitoring
- Identity & Access: admin-only permissions

## Package Boundaries

- packages/types: cross-package DTOs and contracts
- packages/core: domain rules and validations
- packages/utils: generic helpers (no domain knowledge)
