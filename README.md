# rabit.wtf

Public bookmark gallery with a **spotlight** (up to three featured links), an **archive** with tag filters and pagination, and a **password-protected admin** to manage bookmarks in **PostgreSQL**. Open Graph metadata powers thumbnails and text refresh.

- **Stack:** [Next.js 16](https://nextjs.org) (App Router), [Tailwind CSS 4](https://tailwindcss.com), [Drizzle ORM](https://orm.drizzle.team), [NextAuth](https://authjs.dev) (credentials), [open-graph-scraper](https://www.npmjs.com/package/open-graph-scraper), [Zod](https://zod.dev)
- **Design:** system light/dark, Geist Sans, image-forward cards

## Quick start

```bash
npm install
cp .env.example .env.local
# Set DATABASE_URL, AUTH_SECRET, and ADMIN_PASSWORD_HASH (or ADMIN_PASSWORD in dev only)
npx drizzle-kit push
npm run db:seed
npm run dev
```

- **Home:** [http://localhost:3000](http://localhost:3000) — demo data is used if `DATABASE_URL` is missing (for local build without a DB)
- **Admin:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login) — use the password matching your env
- **About / colophon:** `/about`, `/colophon`

## Environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL (e.g. [Neon](https://neon.tech)) |
| `AUTH_SECRET` | NextAuth session encryption |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the operator password (recommended for production) |
| `ADMIN_PASSWORD` | **Development only** — plain password if no hash is set (disabled in production) |

Generate a hash:

```bash
npx --yes node -e "require('bcryptjs').hash('your-password',10).then(console.log)"
```

## Scripts

| Script | |
|--------|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push Drizzle schema to the database |
| `npm run db:generate` | Generate SQL migration files from `src/db/schema.ts` |
| `npm run db:seed` | Reset and seed demo bookmarks (requires `DATABASE_URL`) |
| `npm run db:studio` | Drizzle Studio against `DATABASE_URL` |

## Data model

- **bookmarks** — url, title, excerpt, domain, cover, `featured`, `spotlightOrder`, timestamps  
- **tags** + **bookmark_tags** — many-to-many

Spotlight takes up to **three** `featured` rows, ordered by `spotlightOrder` then recency. Everything else (including overflow featured) appears in the archive list.

## Docs

- [docs/audit.md](docs/audit.md) — repo / deploy direction (milestone 0)
- [`.env.example`](.env.example) — all env vars

## Linear

Project: [rabit.wtf on Linear](https://linear.app/wwwwaaaaddddeeee/project/rabitwtf-c8fc383bb860/overview)

## License

Private / personal project.
