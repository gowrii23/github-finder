#!/usr/bin/env node
/**
 * Send a test message via JobPulse Telegram bot.
 * Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env
 *
 * Usage: node backend/scripts/test-telegram.js
 */

const https = require('https');
const path = require('path');
const fs = require('fs');

function loadEnv() {
  const envPath = path.join(__dirname, '../../.env');
  if (!fs.existsSync(envPath)) {
    console.error('Missing .env file.');
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

function sendMessage(token, chatId, text) {
  const body = JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' });
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.telegram.org',
        path: `/bot${token}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const env = loadEnv();
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;

  if (!token) {
    console.error('Missing TELEGRAM_BOT_TOKEN in .env');
    process.exit(1);
  }
  if (!chatId) {
    console.error('Missing TELEGRAM_CHAT_ID in .env');
    console.error('Run: node backend/scripts/get-telegram-chat-id.js');
    process.exit(1);
  }

  const message =
    '<b>JobPulse test alert</b>\n\n' +
    'Telegram notifications are working.\n' +
    'You will receive instant alerts here for jobs scoring 85+.\n\n' +
    'Daily digest still goes to email.';

  console.log('Sending test message...');
  const result = await sendMessage(token, chatId, message);

  if (result.ok) {
    console.log('Success! Check Telegram on your phone.');
  } else {
    console.error('Failed:', result);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
