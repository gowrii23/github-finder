const profile = require('../config/profile');

function inferRemoteType(location = '', description = '') {
  const text = `${location} ${description}`.toLowerCase();
  if (/remote|work from home|wfh|anywhere/.test(text)) return 'remote';
  if (/hybrid/.test(text)) return 'hybrid';
  if (/chennai|bangalore|bengaluru|mumbai|pune|hyderabad/.test(text)) return 'onsite';
  return 'unknown';
}

function scoreJob(job) {
  const text = `${job.title} ${job.location} ${job.description}`.toLowerCase();
  const reasons = [];
  let score = 0;

  for (const neg of profile.negative) {
    if (text.includes(neg)) {
      return { score: 0, tier: 'skip', reasons: [`blocked: ${neg}`] };
    }
  }

  for (const kw of profile.mustHave) {
    if (text.includes(kw)) {
      score += 8;
      if (reasons.length < 5) reasons.push(kw);
    }
  }

  for (const kw of profile.strongPlus) {
    if (text.includes(kw)) {
      score += 5;
      if (reasons.length < 8) reasons.push(kw);
    }
  }

  const locText = `${job.location} ${job.description}`.toLowerCase();
  const locMatch = profile.locationKeywords.some((k) => locText.includes(k));
  if (locMatch) {
    score += 15;
    reasons.push('location');
  } else if (!/united states|usa|europe only|uk only|canada only/.test(locText)) {
    score += 5;
  } else {
    score -= 20;
  }

  const titleLower = job.title.toLowerCase();
  if (profile.tier1Titles.some((t) => titleLower.includes(t))) {
    score += 15;
    reasons.push('tier1-title');
  } else if (profile.tier2Titles.some((t) => titleLower.includes(t))) {
    score += 12;
    reasons.push('tier2-title');
  }

  if (/senior|lead|staff|principal|architect/.test(titleLower)) {
    score += 10;
    reasons.push('seniority');
  }

  score = Math.max(0, Math.min(100, score));

  let tier = 'skip';
  if (score >= 70) tier = 'tier1';
  else if (score >= 50) tier = 'tier2';
  else if (score >= 30) tier = 'contract';

  return { score, tier, reasons: [...new Set(reasons)] };
}

function passesLocationFilter(job) {
  const text = `${job.title} ${job.location} ${job.description}`.toLowerCase();
  if (profile.locationKeywords.some((k) => text.includes(k))) return true;
  if (/remote|india|chennai|bangalore|hybrid/.test(text)) return true;
  if (/united states only|us only|must be in us|eu only/.test(text)) return false;
  return true;
}

module.exports = { scoreJob, inferRemoteType, passesLocationFilter };
