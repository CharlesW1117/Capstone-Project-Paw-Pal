#!/usr/bin/env bash
# Brings PostgreSQL online. Runs on every environment boot, so it must
# tolerate an already-running cluster.
set -euo pipefail

if ! command -v pg_lsclusters >/dev/null 2>&1; then
  echo "PostgreSQL is not installed yet; skipping startup"
  exit 0
fi

cluster_line="$(pg_lsclusters --no-header | head -n 1 || true)"
if [ -z "$cluster_line" ]; then
  echo "No PostgreSQL cluster found; skipping startup"
  exit 0
fi

version="$(echo "$cluster_line" | awk '{print $1}')"
cluster="$(echo "$cluster_line" | awk '{print $2}')"

if [ "$(echo "$cluster_line" | awk '{print $4}')" = "online" ]; then
  echo "PostgreSQL $version/$cluster already online"
else
  sudo pg_ctlcluster "$version" "$cluster" start
fi

# The dev server and install steps connect immediately after this returns,
# so wait until the socket actually accepts connections.
for _ in $(seq 1 30); do
  if sudo -u postgres pg_isready -q; then
    echo "PostgreSQL is accepting connections"
    exit 0
  fi
  sleep 1
done

echo "PostgreSQL did not become ready in time" >&2
exit 1
