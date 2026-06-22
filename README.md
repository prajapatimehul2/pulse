# Pulse — Health & Habit Tracker

**Live:** http://54.172.133.172 — demo login `demo@habit.dev` / `password123`

Log water, sleep, workouts, and medication. Build streaks and see weekly trends.

Built with **Next.js (App Router) · PostgreSQL · Prisma · NextAuth · Tailwind · Recharts**, deployed to **AWS EC2** via a **GitHub Actions** CI/CD pipeline.

## Quick start (local)

```bash
# 1. Start Postgres (Docker)
npm run db:up

# 2. Install deps
npm install

# 3. Set up env
cp .env.example .env        # adjust NEXTAUTH_SECRET if you like

# 4. Create the schema + seed a demo user
npm run prisma:migrate      # name the migration e.g. "init"
npm run prisma:seed

# 5. Run
npm run dev                 # http://localhost:3000
```

Demo login (after seeding): **demo@habit.dev** / **password123**

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run lint` / `type-check` / `test` | CI checks |
| `npm run db:up` / `db:down` | Local Postgres via Docker |
| `npm run prisma:migrate` / `:deploy` / `:seed` | Database |

## Project structure

```
src/
  app/
    (auth)/signin|signup    Split-screen auth pages
    api/auth/*              NextAuth + signup
    api/logs/*              Habit log CRUD
    api/goals               Per-habit targets
    api/reminders           Phase 6 reminders (scaffold)
    dashboard/              Protected dashboard (cards + trends)
  components/               UI: HabitCard, ProgressRing, TrendChart, ...
  lib/                      db, auth, habits (streak logic), validation
prisma/schema.prisma        User, HabitLog, Goal, Reminder
.github/workflows/deploy.yml CI/CD
deploy/                     EC2 setup script + Nginx config
```

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for AWS EC2 provisioning, GitHub
secrets, and the CI/CD pipeline.
