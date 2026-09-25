#!/usr/bin/env bash
# Prepares the full PawPal stack: PostgreSQL, the React frontend in this
# repository, and the Express backend from its separate repository.
# Safe to re-run; every step converges instead of failing on existing state.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/pawpal-frontend"
BACKEND_DIR="${PAWPAL_BACKEND_DIR:-$HOME/pawpal-backend}"
BACKEND_REPO="${PAWPAL_BACKEND_REPO:-https://github.com/CharlesW1117/PawPal-Backend.git}"

# Local-only development credentials. The backend refuses to run without a
# JWT secret, and PostgreSQL needs a password for TCP connections.
PG_USER=postgres
PG_PASSWORD=postgres
DEV_DB=pawpal
TEST_DB=pawpal_test

log() { printf '\n==> %s\n' "$1"; }

log "Installing PostgreSQL if needed"
if ! command -v psql >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
    postgresql postgresql-contrib
fi

log "Starting PostgreSQL"
"$REPO_ROOT/.cursor/start.sh"

log "Configuring PostgreSQL roles and databases"
sudo -u postgres psql -qc \
  "ALTER USER $PG_USER WITH PASSWORD '$PG_PASSWORD';" >/dev/null
for db in "$DEV_DB" "$TEST_DB"; do
  if ! sudo -u postgres psql -tAc \
    "SELECT 1 FROM pg_database WHERE datname='$db'" | grep -q 1; then
    sudo -u postgres createdb "$db"
    echo "created database $db"
  fi
done

log "Installing frontend dependencies"
cd "$FRONTEND_DIR"
npm install

if [ ! -f "$FRONTEND_DIR/.env.local" ]; then
  log "Writing frontend .env.local"
  cat > "$FRONTEND_DIR/.env.local" <<'EOF'
VITE_API_URL=http://localhost:3000/api
EOF
fi

# Reduces a clone URL to host/owner/repo so checkouts whose origin carries
# injected credentials still compare equal to the plain configured URL.
repo_identity() {
  printf '%s' "$1" | sed -e 's#^[a-z+]*://##' -e 's#^[^@/]*@##' -e 's#\.git$##'
}

log "Fetching backend repository into $BACKEND_DIR"
current_origin=""
if [ -d "$BACKEND_DIR/.git" ]; then
  current_origin="$(git -C "$BACKEND_DIR" remote get-url origin 2>/dev/null || echo '')"
fi

# A relocated backend repo generally has an unrelated history, which no pull can
# fast-forward onto. Replace the checkout instead, carrying over the local-only
# state that lives outside git.
if [ -n "$current_origin" ] && \
   [ "$(repo_identity "$current_origin")" != "$(repo_identity "$BACKEND_REPO")" ]; then
  log "Backend repo moved to $BACKEND_REPO; replacing the checkout"
  carry_over="$(mktemp -d)"
  [ -f "$BACKEND_DIR/.env" ] && cp "$BACKEND_DIR/.env" "$carry_over/.env"
  [ -d "$BACKEND_DIR/uploads" ] && cp -r "$BACKEND_DIR/uploads" "$carry_over/uploads"

  rm -rf "$BACKEND_DIR"
  git clone --quiet "$BACKEND_REPO" "$BACKEND_DIR"

  [ -f "$carry_over/.env" ] && cp "$carry_over/.env" "$BACKEND_DIR/.env"
  [ -d "$carry_over/uploads" ] && cp -r "$carry_over/uploads" "$BACKEND_DIR/uploads"
  rm -rf "$carry_over"
elif [ -n "$current_origin" ]; then
  git -C "$BACKEND_DIR" fetch --quiet origin
  git -C "$BACKEND_DIR" pull --quiet --ff-only || \
    echo "backend has local changes; keeping the current checkout"
else
  git clone --quiet "$BACKEND_REPO" "$BACKEND_DIR"
fi

log "Installing backend dependencies"
cd "$BACKEND_DIR"
npm install

if [ ! -f "$BACKEND_DIR/.env" ]; then
  log "Writing backend .env"
  cat > "$BACKEND_DIR/.env" <<EOF
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://$PG_USER:$PG_PASSWORD@localhost:5432/$DEV_DB
TEST_DATABASE_URL=postgresql://$PG_USER:$PG_PASSWORD@localhost:5432/$TEST_DB
JWT_SECRET=local_dev_only_jwt_secret_$(openssl rand -hex 16)
JWT_EXPIRES_IN=21d
BACKGROUND_CHECK_WEBHOOK_SECRET=local_dev_only_webhook_$(openssl rand -hex 16)
CLIENT_URL=http://localhost:5173
APP_TIME_ZONE=America/Chicago
PET_PHOTO_UPLOAD_DIR=uploads/pets
PET_PHOTO_MAX_BYTES=5242880
PROFILE_PHOTO_UPLOAD_DIR=uploads/profiles
PROFILE_PHOTO_MAX_BYTES=5242880
EOF
fi

log "Applying database migrations"
npm run db:migrate

# The seed script inserts users without conflict handling, so it can only run
# against an empty users table.
user_count="$(PGPASSWORD="$PG_PASSWORD" psql -h localhost -U "$PG_USER" \
  -d "$DEV_DB" -tAc "SELECT count(*) FROM users;" 2>/dev/null || echo 0)"
if [ "$user_count" = "0" ]; then
  log "Seeding demo data"
  npm run db:seed
else
  log "Skipping seed; $DEV_DB already has $user_count users"
fi

log "PawPal setup complete"
echo "frontend: $FRONTEND_DIR"
echo "backend:  $BACKEND_DIR"
echo "demo login: maya@example.com / PawPal123!"
