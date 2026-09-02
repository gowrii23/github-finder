#!/usr/bin/env bash
# Push local .env Telegram credentials to GitHub Actions secrets (private repo).
# Requires: gh CLI authenticated, repo made private recommended.
#
# Usage:
#   1. Message https://t.me/JobPulse_Alerts_bot and run: npm run telegram:chat-id
#   2. Add TELEGRAM_CHAT_ID to .env
#   3. Make repo private on GitHub
#   4. Run: bash scripts/setup-github-secrets.sh

set -euo pipefail

ENV_FILE="$(dirname "$0")/../.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing .env file at $ENV_FILE"
  exit 1
fi

get_var() {
  grep "^$1=" "$ENV_FILE" | cut -d= -f2- | tr -d '\r'
}

TOKEN=$(get_var TELEGRAM_BOT_TOKEN)
CHAT_ID=$(get_var TELEGRAM_CHAT_ID)

if [[ -z "$TOKEN" ]]; then
  echo "TELEGRAM_BOT_TOKEN missing in .env"
  exit 1
fi

if [[ -z "$CHAT_ID" ]]; then
  echo "TELEGRAM_CHAT_ID missing in .env"
  echo "1. Open https://t.me/JobPulse_Alerts_bot and tap Start"
  echo "2. Run: npm run telegram:chat-id"
  echo "3. Add chat_id to .env and re-run this script"
  exit 1
fi

if ! command -v gh &>/dev/null; then
  echo "Install GitHub CLI: https://cli.github.com/"
  exit 1
fi

echo "Setting GitHub Actions secrets..."
echo "$TOKEN" | gh secret set TELEGRAM_BOT_TOKEN
echo "$CHAT_ID" | gh secret set TELEGRAM_CHAT_ID

echo ""
echo "Done! Secrets set for this repository."
echo "GitHub Actions will now send Telegram alerts automatically."
echo "Test manually: GitHub -> Actions -> JobPulse Telegram Notifications -> Run workflow -> test"
