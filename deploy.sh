#!/bin/bash
# deploy.sh for the tbhelpapp folder on each box (dev: /docker/compose/tbhelpapp, prod: ~/docker/tbhelpapp).
# Pulls jimecox807/tbhelpapp:<tag>, writes it to .env (HELPAPP_TAG, no secrets) and (re)starts it.
# The key and other secrets live in .env.local (see .env.example, chmod 600), never in this file.
#
# Uses the Docker login saved on the box — run `docker login -u jimecox807` once and paste the PAT.
cd "$(dirname "$0")" || exit 1

if [ ! -f .env.local ]; then
  echo "Missing .env.local: cp .env.example .env.local, set GEMINI_API_KEY and STRAPI_URL, chmod 600 .env.local"
  exit 1
fi
if grep -q '^GEMINI_API_KEY=CHANGE_ME' .env.local || ! grep -q '^GEMINI_API_KEY=.' .env.local; then
  echo "GEMINI_API_KEY is not set in .env.local."
  exit 1
fi
# Sign-in (Timebars Cloud) needs both, or the Sign In button lands on https://0.0.0.0:3010/auth/error?error=Configuration
for v in NEXTAUTH_SECRET NEXTAUTH_URL; do
  if grep -q "^$v=CHANGE_ME" .env.local || ! grep -q "^$v=." .env.local; then
    echo "$v is not set in .env.local (NEXTAUTH_SECRET: openssl rand -base64 32; NEXTAUTH_URL: the address users open, e.g. https://cloud.timebars.com)."
    exit 1
  fi
done

current=$(grep -s '^HELPAPP_TAG=' .env | cut -d= -f2)
[ -n "$current" ] && echo "Currently deployed: $current"
read -r -p "Tag (press Enter for 'latest'): " tag
tag=${tag:-latest}
image="jimecox807/tbhelpapp:$tag"

if ! docker pull "$image"; then
  echo "Pull failed. Check the tag exists on Docker Hub, or log in: docker login -u jimecox807"
  exit 1
fi

# shared network with the app containers (their nginx proxies /ai/ to this container)
docker network inspect tbhelp >/dev/null 2>&1 || docker network create tbhelp || exit 1

echo "HELPAPP_TAG=$tag" > .env
docker compose up -d || exit 1
docker compose ps

sleep 5
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' -d '{}' http://127.0.0.1:3010/api/ai/help)
case "$code" in
  401|400) echo "OK: $image is serving /api/ai/* on port 3010 (answered $code to an empty request, as expected)." ;;
  *)       echo "WARNING: /api/ai/help answered $code - check: docker logs tbhelpapp" ;;
esac
