# Chess Club SaaS - Product Scope

## Vision

Build a chess club SaaS focused on admin-led tournament management, synchronized clocks, and clear results tracking. The system prioritizes maintainability through component-based engineering.

## Primary Goals

- Admin-only tournament creation and management
- Fixed white/black assignment for every match
- QR-based clock session join and device sync
- Admin-controlled result entry (win/loss/draw)
- Tournament standings and leaderboards

## Non-Goals (for MVP)

- No personal games or casual match recording
- No player-driven result submissions
- No external rating integration (USCF/FIDE)

## Core Constraints

- Admins are the only creators of tournaments and matches
- Admins are the only source of truth for match outcomes
- Clock sync must work across multiple player devices
- Tournament formats are limited but extensible

## MVP Feature Set

- Club + admin membership model
- Tournament setup (name, format, rounds, time control)
- Round creation and pairing with fixed colors
- Match clock sessions with QR join
- Admin dashboard for clock monitoring
- Result entry and standings calculation

## Optional Feature (R&D)

- Board capture to infer position and export PGN
- Treated as an isolated experiment and feature-flagged

## Success Criteria

- Admin can create a tournament and run a full round
- All player devices display synced clocks
- Admin can finalize results and view standings
