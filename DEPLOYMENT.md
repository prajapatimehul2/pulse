# Deployment — AWS EC2 + GitHub Actions CI/CD

This covers Phase 4 (EC2) and Phase 5 (GitHub + CI/CD) of the project plan.

> **GitHub repo creation happens here** (per the project plan you chose
> "set up just before CI/CD"). Steps 1–2 below are the GitHub setup — I'll
> walk you through them when you're ready.

## 1. Create the GitHub repository

```bash
git init
git add .
git commit -m "Initial commit: Pulse health & habit tracker"
gh repo create health-habit-tracker --private --source=. --remote=origin --push
# or create it in the GitHub UI and: git remote add origin <url> && git push -u origin main
```

## 2. Add repository secrets

Settings → Secrets and variables → Actions → New repository secret:

| Secret | Value |
|---|---|
| `EC2_HOST` | EC2 public IP / DNS |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Contents of the private key (PEM) for the instance |

(`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` live in `.env.production`
**on the server**, not in CI — the build step uses placeholders.)

## 3. Provision EC2 (Phase 4)

1. Launch an **Ubuntu 24.04 LTS** instance (t3.small recommended; t3.micro for free tier).
2. Security group inbound rules: `22` (SSH, your IP only), `80` and `443` (web).
3. **Database** — choose one:
   - **AWS RDS for PostgreSQL** (recommended, managed) — point `DATABASE_URL` at it.
   - **Postgres on the same EC2 box** — `sudo apt install postgresql`, create the `habit_tracker` DB/user.
4. SSH in and run the provisioning script:

```bash
scp -i key.pem -r deploy ubuntu@EC2_HOST:~/   # or just clone the repo
ssh -i key.pem ubuntu@EC2_HOST
REPO_URL=git@github.com:YOU/health-habit-tracker.git bash deploy/setup-ec2.sh
```

The script installs Node 22, PM2, Nginx; clones the repo; runs
`prisma migrate deploy`; builds; starts PM2; and wires up Nginx.

5. Edit `~/health-habit-tracker/.env.production` with real `DATABASE_URL`,
   `NEXTAUTH_SECRET` (`openssl rand -base64 32`), and `NEXTAUTH_URL`.
6. TLS: `sudo certbot --nginx -d your-domain.com`.

## 4. CI/CD (Phase 5)

`.github/workflows/deploy.yml`:

- **On every push/PR to `main`** → install → `prisma generate` → lint →
  type-check → test → build.
- **On push to `main` only** → SSH to EC2 → `git pull` → `npm ci` →
  `prisma migrate deploy` → `build` → `pm2 reload`.

Enable branch protection on `main` requiring the **CI** job to pass.

## Operations

```bash
pm2 status            # process health
pm2 logs pulse        # app logs
pm2 reload pulse      # zero-downtime reload
```
