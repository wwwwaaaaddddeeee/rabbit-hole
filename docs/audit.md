# Milestone 0 — repo, deploy, and direction

**Date:** 2026-04-26  
**Path:** [Desktop/rabit-wtf](file:///Users/wade/Desktop/rabit-wtf) (this repository)

## Findings

| Item | State |
|------|--------|
| **Framework** | Next.js 16 (App Router), TypeScript, Tailwind 4 |
| **Previous data** | [Raindrop.io](https://api.raindrop.io) via `src/lib/raindrop.ts` and env — **replaced in v2** with PostgreSQL + first-party data |
| **“Coming soon”** | The live rabit.wtf marketing shell may not match this repo; deploy target should be re-verified after `DATABASE_URL` and auth are set on [Vercel](https://vercel.com) |
| **Git** | This folder is the implementation surface for v2; connect Git remote and enable branch protection per team preference |

## Decision

**Revive** this Next.js app (not greenfield). Replace the Raindrop pipeline with a **Postgres** store (e.g. [Neon](https://neon.tech)), **Drizzle ORM**, server-only `DATABASE_URL`, and a **protected admin** for CRUD, featured/spotlight, and OG refresh.

## Linear / GitHub

- **Backlog and milestones:** [Linear — rabitwtf](https://linear.app/wwwwaaaaddddeeee/project/rabitwtf-c8fc383bb860/overview)
- **Code and PRs:** this GitHub (or your chosen) repo — link issues ↔ PRs when the integration is connected

## Follow-ups for operator

1. Set `DATABASE_URL` (and optional `DIRECT_URL` for migrations) in Vercel and locally.
2. Set `AUTH_SECRET` and `ADMIN_PASSWORD` (or use env var doc in [README](README.md)).
3. Run `npx drizzle-kit push` (or `migrate`) after the first deploy with DB access.
4. Run `npm run db:seed` once to load demo data, then replace in admin.
