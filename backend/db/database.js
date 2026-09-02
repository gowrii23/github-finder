const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DEFAULT_DB = path.join(__dirname, 'jobpulse.db');

function getDbPath() {
  return process.env.DATABASE_PATH || DEFAULT_DB;
}

function ensureDbDir(dbPath) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      external_id TEXT,
      source TEXT NOT NULL,
      source_type TEXT DEFAULT 'hidden',
      company TEXT NOT NULL,
      title TEXT NOT NULL,
      location TEXT,
      remote_type TEXT,
      description TEXT,
      url TEXT NOT NULL UNIQUE,
      apply_url TEXT,
      employment_type TEXT,
      match_score INTEGER DEFAULT 0,
      match_tier TEXT,
      match_reasons TEXT,
      status TEXT DEFAULT 'new',
      first_seen_at TEXT DEFAULT (datetime('now')),
      last_seen_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT,
      notified_at TEXT,
      notes TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    CREATE INDEX IF NOT EXISTS idx_jobs_score ON jobs(match_score);
    CREATE INDEX IF NOT EXISTS idx_jobs_expires ON jobs(expires_at);
  `);
}

function openDatabase() {
  const dbPath = getDbPath();
  ensureDbDir(dbPath);
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  initSchema(db);
  return db;
}

function makeJobId(source, externalId) {
  return `${source}:${externalId}`;
}

function upsertJob(db, job) {
  const retentionDays = parseInt(process.env.RETENTION_DAYS || '30', 10);
  const stmt = db.prepare(`
    INSERT INTO jobs (
      id, external_id, source, source_type, company, title, location,
      remote_type, description, url, apply_url, employment_type,
      match_score, match_tier, match_reasons, status, expires_at
    ) VALUES (
      @id, @external_id, @source, @source_type, @company, @title, @location,
      @remote_type, @description, @url, @apply_url, @employment_type,
      @match_score, @match_tier, @match_reasons, 'new',
      datetime('now', '+' || @retention || ' days')
    )
    ON CONFLICT(id) DO UPDATE SET
      last_seen_at = datetime('now'),
      match_score = excluded.match_score,
      match_tier = excluded.match_tier,
      match_reasons = excluded.match_reasons,
      location = excluded.location,
      description = excluded.description
  `);

  const existing = db.prepare('SELECT id FROM jobs WHERE id = ?').get(job.id);
  const result = stmt.run({ ...job, retention: retentionDays });
  const isNew = !existing && result.changes > 0;
  return { isNew, id: job.id };
}

function getJobsToNotify(db, minScore, limit = 15) {
  return db
    .prepare(
      `
    SELECT * FROM jobs
    WHERE status = 'new'
      AND notified_at IS NULL
      AND match_score >= ?
    ORDER BY match_score DESC, first_seen_at DESC
    LIMIT ?
  `
    )
    .all(minScore, limit);
}

function markJobsNotified(db, ids) {
  if (!ids.length) return;
  const placeholders = ids.map(() => '?').join(',');
  db.prepare(
    `UPDATE jobs SET notified_at = datetime('now'), status = 'notified' WHERE id IN (${placeholders})`
  ).run(...ids);
}

function purgeExpired(db) {
  const result = db
    .prepare(
      `
    DELETE FROM jobs
    WHERE expires_at < datetime('now')
      AND status NOT IN ('saved', 'applied')
  `
    )
    .run();
  return result.changes;
}

function getStats(db) {
  return db
    .prepare(
      `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'new' AND notified_at IS NULL THEN 1 ELSE 0 END) as pending_notify,
      SUM(CASE WHEN match_score >= 85 THEN 1 ELSE 0 END) as hot
    FROM jobs
  `
    )
    .get();
}

module.exports = {
  openDatabase,
  makeJobId,
  upsertJob,
  getJobsToNotify,
  markJobsNotified,
  purgeExpired,
  getStats,
};
