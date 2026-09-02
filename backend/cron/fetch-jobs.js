#!/usr/bin/env node
/**
 * Fetch jobs from ATS APIs, score against profile, store in SQLite.
 * Usage: node backend/cron/fetch-jobs.js
 */

const { loadEnv } = require('../lib/loadEnv');
loadEnv();

const sources = require('../config/sources');
const { fetchSource } = require('../ingestors/ats');
const { scoreJob, inferRemoteType, passesLocationFilter } = require('../matcher/scorer');
const {
  openDatabase,
  makeJobId,
  upsertJob,
  purgeExpired,
  getStats,
} = require('../db/database');

async function main() {
  const db = openDatabase();
  let fetched = 0;
  let inserted = 0;
  let matched = 0;
  const errors = [];

  console.log(`JobPulse fetch — ${sources.length} sources\n`);

  for (const source of sources) {
    try {
      process.stdout.write(`  ${source.name} (${source.type})... `);
      const jobs = await fetchSource(source);
      fetched += jobs.length;
      let sourceNew = 0;

      for (const raw of jobs) {
        if (!raw.title || !raw.url) continue;
        if (!passesLocationFilter(raw)) continue;

        const { score, tier, reasons } = scoreJob(raw);
        const minShow = parseInt(process.env.MIN_SCORE_SHOW || '40', 10);
        if (score < minShow) continue;

        matched++;
        const id = makeJobId(raw.source, raw.external_id);
        const { isNew } = upsertJob(db, {
          id,
          external_id: raw.external_id,
          source: raw.source,
          source_type: raw.source_type,
          company: raw.company,
          title: raw.title,
          location: raw.location || '',
          remote_type: inferRemoteType(raw.location, raw.description),
          description: (raw.description || '').slice(0, 5000),
          url: raw.url,
          apply_url: raw.apply_url || raw.url,
          employment_type: raw.employment_type || '',
          match_score: score,
          match_tier: tier,
          match_reasons: JSON.stringify(reasons),
        });

        if (isNew) {
          inserted++;
          sourceNew++;
        }
      }

      console.log(`${jobs.length} jobs, ${sourceNew} new matches`);
    } catch (err) {
      console.log(`skip (${err.message})`);
      errors.push({ source: source.name, error: err.message });
    }
  }

  const purged = purgeExpired(db);
  const stats = getStats(db);

  console.log('\n--- Summary ---');
  console.log(`Fetched:     ${fetched}`);
  console.log(`New stored:  ${inserted}`);
  console.log(`Matched:     ${matched}`);
  console.log(`Purged:      ${purged}`);
  console.log(`DB total:    ${stats.total}`);
  console.log(`Pending notify: ${stats.pending_notify}`);
  console.log(`Hot (85+):   ${stats.hot}`);

  if (errors.length) {
    console.log(`\nSkipped ${errors.length} sources (404 or timeout)`);
  }

  db.close();
}

main().catch((err) => {
  console.error('Fetch failed:', err);
  process.exit(1);
});
