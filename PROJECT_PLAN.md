# Health & Habit Tracker — Project Plan

> Log water, sleep, workouts, and medication. Show streaks and weekly trends.
> Small data model, strong daily-use value, easy to extend with reminders.

**Stack:** Next.js (App Router) · PostgreSQL · NextAuth (signup/signin) · AWS EC2 (hosting) · GitHub Actions (CI/CD)
**UI direction:** Modern dark-themed SaaS dashboard inspired by [virlo.ai](https://virlo.ai/?ref=trustmrr) — card-based layouts, gradient accents, clean sans-serif typography, data-dense but airy spacing.

---

## Tech Stack Summary

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router, TypeScript) | Server Components + Route Handlers / Server Actions |
| Styling | Tailwind CSS + shadcn/ui | Dark-first design system |
| Auth | NextAuth.js (credentials + OAuth) | Email/password signup/signin, sessions in DB |
| Database | PostgreSQL | Hosted on RDS or on EC2 (decide in Phase 4) |
| ORM | Prisma | Type-safe queries + migrations |
| Charts | Recharts | Weekly trends & streak visualizations |
| Hosting | AWS EC2 (Ubuntu) | Node process behind Nginx reverse proxy |
| CI/CD | GitHub Actions | Lint → test → build → deploy to EC2 over SSH |

---

## Data Model (high level)

```
User        ── id, email, passwordHash, name, createdAt
HabitLog    ── id, userId, type(water|sleep|workout|medication), value, unit, loggedAt
Streak      ── derived from HabitLog (computed, not stored) or cached per type
Reminder    ── id, userId, type, schedule(cron/time), enabled   (Phase 6, optional)
```

`type` is an enum: `WATER`, `SLEEP`, `WORKOUT`, `MEDICATION`. `value`/`unit` keep the model
small while supporting every tracked category (e.g. water = 500 ml, sleep = 7.5 h, workout = 1 session, medication = 1 dose).

---

## Phase 0 — Project Setup & Foundations

**Goal:** Bootstrap a runnable Next.js app with the toolchain in place.

- [ ] `npx create-next-app@latest` (TypeScript, App Router, Tailwind, ESLint)
- [ ] Add shadcn/ui, configure dark theme tokens & gradient accent palette
- [ ] Install Prisma; define initial `schema.prisma` (User, HabitLog enums)
- [ ] Set up local PostgreSQL (Docker Compose) for development
- [ ] `.env.example` with `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- [ ] Base folder structure: `app/`, `components/ui`, `lib/db`, `lib/auth`

**Deliverable:** App boots locally, connects to Postgres, `prisma migrate dev` succeeds.

---

## Phase 1 — Authentication (Signup / Signin)

**Goal:** Secure email/password auth with sessions.

- [ ] Configure NextAuth.js with Credentials provider (bcrypt password hashing)
- [ ] `POST /api/auth/signup` — create user, validate email uniqueness
- [ ] Sign-in flow + session persistence (Prisma adapter, DB sessions)
- [ ] Optional: Google OAuth provider as a second sign-in option
- [ ] Protected route middleware — redirect unauthenticated users to `/signin`
- [ ] Form validation with Zod; friendly error states

**UI (virlo-style):**
- [ ] Split-screen auth pages: dark gradient panel (brand/illustration) + clean form card
- [ ] Rounded inputs, subtle borders, accent-gradient primary button
- [ ] Loading/disabled states, inline validation messages

**Deliverable:** Users can sign up, sign in, sign out; sessions persist; protected pages enforced.

---

## Phase 2 — Core Logging UI & API

**Goal:** Log water, sleep, workouts, medication quickly.

- [ ] Route handlers / server actions: create + list `HabitLog` per type
- [ ] Quick-log widgets per category (e.g. +250ml water, log sleep hours, mark medication taken)
- [ ] "Today" view: at-a-glance summary cards for all four categories
- [ ] Edit / delete a log entry
- [ ] Timezone-aware `loggedAt` handling

**UI (virlo-style):**
- [ ] Dashboard grid of metric cards with icons, current value, and progress ring
- [ ] Floating quick-add button / command-style logging
- [ ] Smooth transitions, skeleton loaders, toast confirmations

**Deliverable:** Authenticated user logs and sees today's entries across all categories.

---

## Phase 3 — Streaks & Weekly Trends

**Goal:** Make the data motivating and glanceable.

- [ ] Streak computation per category (consecutive days meeting goal)
- [ ] Per-category goals (e.g. 2L water/day, 8h sleep) stored per user
- [ ] Weekly trend charts (Recharts) — bar/area per category
- [ ] Dashboard "streak badges" + week-over-week deltas
- [ ] Empty states and first-time onboarding hints

**UI (virlo-style):**
- [ ] Analytics dashboard: dark cards, gradient-filled charts, sparklines
- [ ] Streak counter with flame/accent visual; subtle micro-animations
- [ ] Responsive layout (mobile-first; daily-use on phones matters)

**Deliverable:** Dashboard shows live streaks and 7-day trends per category.

---

## Phase 4 — AWS EC2 Provisioning & Database

**Goal:** Stand up production infrastructure.

- [ ] Launch EC2 instance (Ubuntu LTS, t3.small or t3.micro to start)
- [ ] Security groups: allow 22 (SSH, restricted IP), 80/443 (web)
- [ ] Install Node.js (via nvm), PM2 (process manager), Nginx (reverse proxy)
- [ ] **Database decision:** AWS RDS for PostgreSQL (recommended, managed) **or** PostgreSQL on the same EC2 box (cheaper, more ops)
- [ ] Run `prisma migrate deploy` against production DB
- [ ] Nginx config + Let's Encrypt (Certbot) for HTTPS
- [ ] Production `.env` (managed via EC2, not committed)
- [ ] Smoke-test a manual deploy before automating

**Deliverable:** App reachable over HTTPS on the EC2 public domain/IP, talking to production Postgres.

---

## Phase 5 — GitHub Setup & CI/CD Pipeline

> ⚠️ **GitHub repository is created at the start of this phase** (per your choice — set up just before CI/CD).
> **I will prompt you when we reach this point** to: create the repo, add it as a remote, and configure secrets.

**Goal:** Automated lint → test → build → deploy on every push to `main`.

**GitHub setup (I'll walk you through this when we get here):**
- [ ] Create the GitHub repository (public/private — your call)
- [ ] `git init`, add remote, push existing branches
- [ ] Add repo secrets: `EC2_HOST`, `EC2_SSH_KEY`, `EC2_USER`, `DATABASE_URL`, `NEXTAUTH_SECRET`
- [ ] Branch protection on `main` (require CI to pass)

**CI/CD pipeline (`.github/workflows/deploy.yml`):**
- [ ] **CI job:** install deps → `lint` → `type-check` → `test` → `next build`
- [ ] **CD job (on `main`):** SSH into EC2 → `git pull` → `npm ci` → `prisma migrate deploy` → `next build` → `pm2 reload`
- [ ] Cache `node_modules` / Next.js build cache for speed
- [ ] Deploy notifications (optional: status check / Slack)

**Deliverable:** Push to `main` automatically tests and deploys to EC2 with zero manual steps.

---

## Phase 6 — Reminders (Optional Extension)

**Goal:** Nudge users to log / hit goals.

- [ ] `Reminder` model + per-user schedule settings UI
- [ ] Scheduled job (node-cron on EC2, or a serverless cron) to evaluate reminders
- [ ] Delivery channel: email (Resend/SES) and/or web push notifications
- [ ] Reminder management screen in settings

**Deliverable:** Users configure and receive reminders for any tracked habit.

---

## Phase 7 — Polish & Hardening

- [ ] Accessibility pass (keyboard nav, contrast, ARIA)
- [ ] Rate limiting on auth + API routes
- [ ] Error monitoring (Sentry) + structured logging
- [ ] Lighthouse / performance budget; image & bundle optimization
- [ ] Backup strategy for the database (automated snapshots)
- [ ] README + setup docs

---

## Milestone Order (suggested)

1. **Phases 0–1** → Auth-gated app skeleton
2. **Phases 2–3** → Full local product (log + streaks + trends)
3. **Phase 4** → Live on EC2 (manual deploy)
4. **Phase 5** → GitHub + automated CI/CD ← *I'll ask you to set up GitHub here*
5. **Phases 6–7** → Reminders + polish

---

## Open Decisions

- **DB hosting:** RDS (managed, recommended) vs. Postgres-on-EC2 (cheaper) — finalize in Phase 4.
- **OAuth:** Add Google sign-in in Phase 1, or ship credentials-only first?
- **Domain:** Do you have a custom domain, or use the EC2 public DNS initially?
