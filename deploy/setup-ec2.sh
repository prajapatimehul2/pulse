#!/usr/bin/env bash
# One-time provisioning for a fresh Ubuntu 22.04/24.04 EC2 instance.
# Run as the default 'ubuntu' user:  bash setup-ec2.sh
set -euo pipefail

REPO_URL="${REPO_URL:-git@github.com:YOUR_GITHUB/health-habit-tracker.git}"
APP_DIR="$HOME/health-habit-tracker"

echo "==> System packages"
sudo apt-get update -y
sudo apt-get install -y curl git nginx

echo "==> Node.js 22 (via NodeSource)"
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "==> PM2 (global)"
sudo npm install -g pm2

echo "==> Clone repo"
if [ ! -d "$APP_DIR" ]; then
  git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

echo "==> Production env file"
if [ ! -f .env.production ]; then
  cat > .env.production <<'EOF'
DATABASE_URL="postgresql://USER:PASSWORD@RDS_OR_LOCAL_HOST:5432/habit_tracker?schema=public"
NEXTAUTH_SECRET="GENERATE_WITH_openssl_rand_-base64_32"
NEXTAUTH_URL="https://your-domain.com"
EOF
  echo "  -> Edit $APP_DIR/.env.production with real values, then re-run the steps below."
fi

echo "==> Install, migrate, build"
npm ci
npx prisma migrate deploy
npm run build

echo "==> Start with PM2"
pm2 start ecosystem.config.cjs
pm2 save
sudo env PATH=$PATH pm2 startup systemd -u "$USER" --hp "$HOME"

echo "==> Nginx"
sudo cp deploy/nginx.conf /etc/nginx/sites-available/pulse
sudo ln -sf /etc/nginx/sites-available/pulse /etc/nginx/sites-enabled/pulse
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo "==> Done. Provision TLS with: sudo certbot --nginx -d your-domain.com"
