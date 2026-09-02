const https = require('https');

function sendTelegramMessage(token, chatId, text, parseMode = 'HTML') {
  const body = JSON.stringify({
    chat_id: chatId,
    text,
    parse_mode: parseMode,
    disable_web_page_preview: false,
  });

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
            const parsed = JSON.parse(data);
            if (!parsed.ok) {
              reject(new Error(parsed.description || JSON.stringify(parsed)));
            } else {
              resolve(parsed);
            }
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

function formatJobAlert(jobs, type = 'instant') {
  const header =
    type === 'instant'
      ? '<b>🎯 JobPulse — Hot match</b>'
      : '<b>📋 JobPulse — Daily digest</b>';

  if (!jobs.length) {
    return `${header}\n\nNo new matching jobs in this run.`;
  }

  const lines = jobs.map((job, i) => {
    const score = job.match_score ? `[${job.match_score}] ` : '';
    const loc = job.location ? ` · ${job.location}` : '';
    return (
      `${i + 1}. ${score}<b>${escapeHtml(job.title)}</b>\n` +
      `   ${escapeHtml(job.company)}${escapeHtml(loc)}\n` +
      `   <a href="${job.url}">Apply</a>`
    );
  });

  return `${header}\n\n${lines.join('\n\n')}`;
}

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = { sendTelegramMessage, formatJobAlert };
