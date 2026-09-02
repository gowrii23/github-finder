#!/usr/bin/env node
/**
 * Send JobPulse notification to Telegram.
 * Runs locally or via GitHub Actions (secrets injected as env vars).
 *
 * Reads new jobs from SQLite (populated by fetch-jobs.js).
 */

const { loadEnv, requireEnv } = require('../lib/loadEnv');
const { sendTelegramMessage, formatJobAlert } = require('../notifications/telegram');
const { openDatabase, getJobsToNotify, markJobsNotified } = require('../db/database');

loadEnv();

function queryJobsToNotify(minScore, limit = 15) {
  const db = openDatabase();
  try {
    return getJobsToNotify(db, minScore, limit);
  } finally {
    db.close();
  }
}

function markNotified(ids) {
  if (!ids.length) return;
  const db = openDatabase();
  try {
    markJobsNotified(db, ids);
  } finally {
    db.close();
  }
}

async function main() {
  const token = requireEnv('TELEGRAM_BOT_TOKEN');
  const chatId = requireEnv('TELEGRAM_CHAT_ID');
  const minInstant = parseInt(process.env.MIN_SCORE_INSTANT_ALERT || '85', 10);
  const mode = process.argv[2] || 'digest'; // 'digest' | 'instant' | 'test'

  let message;
  let notifiedIds = [];

  if (mode === 'test') {
    message =
      '<b>✅ JobPulse automation test</b>\n\n' +
      'Scheduled notifications are working.\n' +
      `Instant alert threshold: ${minInstant}+\n` +
      `Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;
  } else {
    const threshold =
      mode === 'instant'
        ? minInstant
        : parseInt(process.env.MIN_SCORE_NOTIFY || '70', 10);
    const jobs = queryJobsToNotify(threshold);

    if (jobs.length === 0) {
      const label = mode === 'instant' ? 'Instant check' : 'Daily digest';
      message =
        `<b>📋 JobPulse — ${label}</b>\n\n` +
        `No new jobs scoring ${threshold}+ today.\n\n` +
        `<i>Next scan fetches Greenhouse/Lever/Ashby boards automatically.</i>\n` +
        `Checked: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;
    } else {
      message = formatJobAlert(jobs, mode === 'instant' ? 'instant' : 'digest');
      notifiedIds = jobs.map((j) => j.id);
    }
  }

  console.log('Sending Telegram notification...');
  await sendTelegramMessage(token, chatId, message);
  markNotified(notifiedIds);
  console.log(
    notifiedIds.length
      ? `Sent ${notifiedIds.length} job alert(s) successfully.`
      : 'Sent successfully.'
  );
}

main().catch((err) => {
  console.error('Notification failed:', err.message);
  process.exit(1);
});
