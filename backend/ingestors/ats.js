const https = require('https');
const http = require('http');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib
      .get(url, { headers: { 'User-Agent': 'JobPulse/1.0' } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return fetchJson(res.headers.location).then(resolve).catch(reject);
        }
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          }
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeGreenhouse(company, raw) {
  const loc = raw.location?.name || raw.offices?.map((o) => o.name).join(', ') || '';
  return {
    external_id: String(raw.id),
    source: 'greenhouse',
    source_type: 'hidden',
    company,
    title: raw.title || '',
    location: loc,
    description: stripHtml(raw.content || ''),
    url: raw.absolute_url || raw.internal_job_id,
    apply_url: raw.absolute_url,
    employment_type: raw.metadata?.find?.((m) => m.name === 'Employment Type')?.value || '',
  };
}

function normalizeLever(company, raw) {
  const loc = raw.categories?.location || raw.workplaceType || '';
  return {
    external_id: String(raw.id),
    source: 'lever',
    source_type: 'hidden',
    company,
    title: raw.text || '',
    location: loc,
    description: stripHtml(raw.descriptionPlain || raw.description || ''),
    url: raw.hostedUrl || raw.applyUrl,
    apply_url: raw.applyUrl || raw.hostedUrl,
    employment_type: raw.categories?.commitment || '',
  };
}

function normalizeAshby(company, raw) {
  const loc = raw.location || raw.locationName || '';
  return {
    external_id: String(raw.id),
    source: 'ashby',
    source_type: 'hidden',
    company,
    title: raw.title || '',
    location: loc,
    description: stripHtml(raw.descriptionHtml || raw.description || ''),
    url: raw.jobUrl || raw.applyUrl,
    apply_url: raw.applyUrl || raw.jobUrl,
    employment_type: raw.employmentType || '',
  };
}

async function fetchGreenhouse(company, slug) {
  const url = `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`;
  const data = await fetchJson(url);
  return (data.jobs || []).map((j) => normalizeGreenhouse(company, j));
}

async function fetchLever(company, slug) {
  const url = `https://api.lever.co/v0/postings/${slug}?mode=json`;
  const data = await fetchJson(url);
  const list = Array.isArray(data) ? data : [];
  return list.map((j) => normalizeLever(company, j));
}

async function fetchAshby(company, slug) {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${slug}`;
  const data = await fetchJson(url);
  return (data.jobs || []).map((j) => normalizeAshby(company, j));
}

async function fetchSource(source) {
  const { name, type, slug } = source;
  switch (type) {
    case 'greenhouse':
      return fetchGreenhouse(name, slug);
    case 'lever':
      return fetchLever(name, slug);
    case 'ashby':
      return fetchAshby(name, slug);
    default:
      throw new Error(`Unknown source type: ${type}`);
  }
}

module.exports = { fetchSource, fetchJson };
