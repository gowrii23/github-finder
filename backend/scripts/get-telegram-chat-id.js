#!/usr/bin/env node
/**
 * Fetch your Telegram chat_id after you message @JobPulse_Alerts_bot once.
 *
 * Usage:
 *   1. Open https://t.me/JobPulse_Alerts_bot and tap Start (send any message)
 *   2. Run: node backend/scripts/get-telegram-chat-id.js
 *   3. Copy chat_id into .env as TELEGRAM_CHAT_ID=
 */

const https = require('https');
const path = require('path');
const fs = require('fs');

function loadEnv() {
  const envPath = path.join(__dirname, '../../.env');
  if (!fs.existsSync(envPath)) {
    console.error('Missing .env file. Copy .env.example to .env first.');
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return env;
}

function getUpdates(token) {
  return new Promise((resolve, reject) => {
    const url = `https://api.telegram.org/bot${token}/getUpdates`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const env = loadEnv();
  const token = env.TELEGRAM_BOT_TOKEN;

  if (!token || token.includes('your_bot_token')) {
    console.error('Set TELEGRAM_BOT_TOKEN in .env first.');
    process.exit(1);
  }

  console.log('Fetching updates from Telegram...\n');

  const response = await getUpdates(token);

  if (!response.ok) {
    console.error('Telegram API error:', response);
    process.exit(1);
  }

  if (!response.result || response.result.length === 0) {
    console.log('No messages found yet.\n');
    console.log('Do this first:');
    console.log('  1. Open https://t.me/JobPulse_Alerts_bot');
    console.log('  2. Tap "Start" or send any message (e.g. "hi")');
    console.log('  3. Run this script again\n');
    process.exit(0);
  }

  const chats = new Map();
  for (const update of response.result) {
    const msg = update.message || update.edited_message;
    if (!msg || !msg.chat) continue;
    chats.set(msg.chat.id, {
      id: msg.chat.id,
      first_name: msg.chat.first_name,
      username: msg.chat.username,
      type: msg.chat.type,
    });
  }

  console.log('Found chat(s):\n');
  for (const chat of chats.values()) {
    console.log(`  TELEGRAM_CHAT_ID=${chat.id}`);
    console.log(`  Name: ${chat.first_name || 'N/A'}`);
    console.log(`  Username: @${chat.username || 'N/A'}`);
    console.log(`  Type: ${chat.type}\n`);
  }

  const primaryId = [...chats.keys()][0];
  console.log('Add this line to your .env file:');
  console.log(`  TELEGRAM_CHAT_ID=${primaryId}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
