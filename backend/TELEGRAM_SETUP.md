# Telegram Setup for JobPulse

## Your bot

- **Bot:** [@JobPulse_Alerts_bot](https://t.me/JobPulse_Alerts_bot)
- **Purpose:** Instant job alerts (score ≥ 85)

## One-time setup (3 steps)

### Step 1 — Message your bot

1. Open [t.me/JobPulse_Alerts_bot](https://t.me/JobPulse_Alerts_bot) on your phone or desktop
2. Tap **Start** or send `hi`

### Step 2 — Get your chat_id

From the repo root:

```bash
node backend/scripts/get-telegram-chat-id.js
```

Copy the printed `TELEGRAM_CHAT_ID=...` into your `.env` file.

### Step 3 — Send a test message

```bash
node backend/scripts/test-telegram.js
```

You should receive a test alert on Telegram.

## .env variables

| Variable | Description |
|---|---|
| `TELEGRAM_BOT_TOKEN` | From @BotFather (already in `.env`) |
| `TELEGRAM_CHAT_ID` | Your personal chat ID (from step 2) |

## Security

- **Never commit `.env`** — it is in `.gitignore`
- If token is leaked, revoke via @BotFather → `/mybots` → your bot → **Revoke current token**
- Only `.env.example` (placeholders) goes to GitHub

## When alerts fire (after Phase 3)

| Score | Channel |
|---|---|
| 85+ | Telegram instant + email daily |
| 70–84 | Email daily digest only |
| 40–69 | Dashboard only |
