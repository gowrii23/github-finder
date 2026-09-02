#!/usr/bin/env node
/**
 * Send JobPulse notification to Telegram.
 * Runs locally or via GitHub Actions (secrets injected as env vars).
 *
 * Phase 1+: reads new jobs from SQLite. Until then sends heartbeat/status.
 */

const { loadEnv, requireEnv } = require('../lib/loadEnv');
const { sendTelegramMessage, formatJobAlert } = require('../notifications/telegram');

loadEnv();

async function getJobsToNotify() {
  // Phase 1 will query SQLite here. Placeholder until fetcher is built.
  const dbPath = process.env.DATABASE_PATH;
  try {
    const fs = require('fs');
    if (dbPath && fs.existsSync(dbPath)) {
      // TODO Phase 1: query jobs where status='new' AND match_score >= threshold
      return [];
    }
  } catch (_) {
    /* db not ready */
  }
  return [];
}

async function main() {
  const token = requireEnv('TELEGRAM_BOT_TOKEN');
  const chatId = requireEnv('TELEGRAM_CHAT_ID');
  const minInstant = parseInt(process.env.MIN_SCORE_INSTANT_ALERT || '85', 10);
  const mode = process.argv[2] || 'digest'; // 'digest' | 'instant' | 'test'

  let message;

  if (mode === 'test') {
    message =
      '<b>✅ JobPulse automation test</b>\n\n' +
      'Scheduled notifications are working.\n' +
      `Instant alert threshold: ${minInstant}+\n` +
      `Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;
  } else {
    const jobs = await getJobsToNotify();
    const threshold = mode === 'instant' ? minInstant : parseInt(process.env.MIN_SCORE_NOTIFY || '70', 10);
    const filtered = jobs.filter((j) => (j.match_score || 0) >= threshold);

    if (filtered.length === 0 && mode === 'digest') {
      message =
        '<b>📋 JobPulse — Daily digest</b>\n\n' +
        'No new jobs today (fetcher not active yet).\n\n' +
        '<i>Phase 1 will auto-scan Greenhouse/Lever/Ashby and alert you here.</i>\n' +
        `Checked: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;
    } else {
      message = formatJobAlert(filtered, mode === 'instant' ? 'instant' : 'digest');
    }
  }

  console.log('Sending Telegram notification...');
  await sendTelegramMessage(token, chatId, message);
  console.log('Sent successfully.');
}

main().catch((err) => {
  console.error('Notification failed:', err.message);
  process.exit(1);
});
