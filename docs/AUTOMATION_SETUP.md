# JobPulse — Automatic Telegram Notifications

## How automation works

```
GitHub Actions (cloud, runs 24/7)
    ↓ every day 8:00 AM IST
backend/cron/notify-digest.js
    ↓ reads secrets
Telegram API → your phone (@JobPulse_Alerts_bot)
```

Your laptop does **not** need to be on. GitHub Actions runs in the cloud for free.

---

## Setup (one time, ~5 minutes)

### Step 1 — Message your bot (required for chat_id)

1. Open [t.me/JobPulse_Alerts_bot](https://t.me/JobPulse_Alerts_bot)
2. Tap **Start** or send `hi`

### Step 2 — Get chat_id into `.env`

```bash
npm run telegram:chat-id
```

Copy the printed `TELEGRAM_CHAT_ID=...` into your `.env` file.

### Step 3 — Test locally

```bash
npm run telegram:test
# or
node backend/cron/notify-digest.js test
```

### Step 4 — Make repo private (your plan)

GitHub → **Settings** → **General** → **Danger Zone** → **Change repository visibility** → **Private**

### Step 5 — Push secrets to GitHub Actions (recommended)

**Do NOT commit `.env` to git** — use GitHub Secrets instead (works with private repo):

```bash
bash scripts/setup-github-secrets.sh
```

This reads your local `.env` and sets:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

### Step 6 — Verify automation

1. GitHub → **Actions** → **JobPulse Telegram Notifications**
2. Click **Run workflow** → mode: `test` → **Run**
3. Check Telegram on your phone

---

## Schedule (automatic)

| When | What |
|---|---|
| **8:00 AM IST daily** | Daily digest (jobs score ≥ 70) |
| **Every 6 hours** | Check for instant alerts (score ≥ 85) — active after Phase 1 |

---

## Local `.env` vs GitHub Secrets

| Storage | Use for | Commit to git? |
|---|---|---|
| **`.env`** (local) | Development, local testing | ❌ **Never** (even private repo) |
| **GitHub Secrets** | GitHub Actions automation | ✅ Safe — encrypted by GitHub |

### Why not commit `.env` even if private?

- Git history keeps secrets forever
- Forks, collaborators, or accidental public flip expose token
- GitHub Secrets are designed for this

If you still want token in repo: make private first, then only you can decide — but **Secrets is the right way**.

---

## Manual commands

```bash
# Get chat_id after messaging bot
npm run telegram:chat-id

# Send test message
npm run telegram:test

# Send digest manually
node backend/cron/notify-digest.js digest

# Push secrets to GitHub
bash scripts/setup-github-secrets.sh
```

---

## After Phase 1 (job fetcher)

Automation will send real jobs:

```
[92] AI Integration Engineer
Freshworks · Chennai/Remote
https://boards.greenhouse.io/...
```

Until then, daily digest sends a heartbeat confirming the pipeline works.

---

## Revoke token if leaked

Telegram → @BotFather → `/mybots` → JobPulse_Alerts_bot → **Revoke current token**

Then update:
1. Local `.env`
2. Re-run `bash scripts/setup-github-secrets.sh`
