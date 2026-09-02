
# Job Search Notification Tool — Product & Technical Plan

**Owner:** Gowrishankar Sekar  
**Repo:** `github-finder` → pivot to **JobPulse** (working name)  
**Status:** Planning only — no implementation yet  
**Date:** September 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Resume Digest & Job Profile](#2-resume-digest--job-profile)
3. [Target Roles & Search Strategy](#3-target-roles--search-strategy)
4. [What Are "Hidden Jobs" & Where to Find Them](#4-what-are-hidden-jobs--where-to-find-them)
5. [Product Vision](#5-product-vision)
6. [Recommended Architecture](#6-recommended-architecture)
7. [Data Model & 30-Day Retention Policy](#7-data-model--30-day-retention-policy)
8. [Job Matching Engine](#8-job-matching-engine)
9. [Notification Design](#9-notification-design)
10. [Repo Transformation Plan](#10-repo-transformation-plan)
11. [Phased Implementation Roadmap](#11-phased-implementation-roadmap)
12. [Tech Stack Recommendation](#12-tech-stack-recommendation)
13. [Initial Company Watchlist (Chennai + Remote India)](#13-initial-company-watchlist-chennai--remote-india)
14. [Risks, Legal & Ethics](#14-risks-legal--ethics)
15. [Open Decisions (Need Your Input)](#15-open-decisions-need-your-input)
16. [Success Metrics](#16-success-metrics)

---

## 1. Executive Summary

### Problem

You're actively job searching across two lanes:

1. **Primary career:** Senior SWE / Tech Lead / AI Integration roles (Chennai or remote)
2. **Side income:** AI trainer / RLHF contract roles (weekend, remote)

Today's job boards (Naukri, LinkedIn) show **only ~30% of relevant openings**. The rest sit on company ATS pages, niche boards, and contractor platforms — posted hours or days before aggregators pick them up.

### Solution

Transform `github-finder` into a **personal job intelligence tool** that:

- Monitors **hidden + public** job sources on a schedule
- Scores each job against **your resume profile** (not generic keywords)
- Sends **daily/weekly digests** of new high-match jobs
- Stores jobs in a local DB with **auto-flush after 30 days**
- Lets you mark jobs as `saved` / `applied` / `skipped` for later application

### What this is NOT

- Not a public job board clone
- Not a LinkedIn scraper (legally risky, brittle)
- Not auto-apply (you apply manually later)
- Not a replacement for networking/referrals

### MVP goal

> **"Every morning, get a short list of 5–15 new jobs I'd actually want to apply to — including ones Naukri hasn't shown yet."**

---

## 2. Resume Digest & Job Profile

### Your professional identity (machine-readable profile)

```yaml
name: Gowrishankar Sekar
location: Chennai, India
experience_years: 11+
current_role: Senior Engineer – Development @ Verizon India
education:
  - degree: M.Tech AI & ML (In Progress, 3rd sem)
    institution: BITS Pilani WILP
    expected: 2027
  - degree: B.Tech Mechanical Engineering
    institution: SASTRA University
    year: 2015

primary_stack:
  languages: [Java 8, Java 17, Python, JavaScript, SQL]
  frameworks: [Spring Boot, Spring Cloud, Hibernate, JPA, REST APIs]
  cloud: [AWS (Solutions Architect certified), CI/CD, DevSecOps]
  databases: [Oracle, PostgreSQL, Redis, Cassandra, MariaDB]
  observability: [Kibana, New Relic, SonarQube]

ai_ml_stack:
  - LLMs, MCP (Model Context Protocol), Agentic Workflows
  - OpenSearch, Prompt Engineering, Generative AI
  - PyTorch, NLP, LLM Fine-tuning (coursework)

leadership:
  - Led team of 7 engineers
  - Tech lead, sprint planning, mentoring, code reviews
  - Cross-functional stakeholder management

domains: [Telecom, Healthcare/Pharma, Retail E-commerce]

certifications:
  - Google AI Professional Certificate (2026)
  - AWS Solutions Architect Associate (2021)
  - Oracle Certified Java Programmer (2016)

signature_projects:
  - name: Automated Defect Triage & RCA AI Agent
    keywords: [Jira webhooks, MCP, OpenSearch, LLM, RCA, incident response]
  - name: Agentic Universe Platform
    keywords: [MCP tools, LLM orchestration, agentic workflows, dashboards]

constraints:
  location: [Chennai, Remote India, Hybrid Chennai]
  avoid: [relocation outside India, on-site only non-Chennai]
  employment_type: [Full-time preferred, Contract OK for AI trainer roles]
```

### Your unique positioning (what makes you different)

| Most candidates | You |
|---|---|
| Pure Java backend engineer | Java backend **+** active M.Tech AI/ML |
| AI/ML fresh grad (no production exp) | M.Tech AI/ML **+** 11 yrs production systems |
| Theoretical ML knowledge | **Built agentic AI in production** (MCP, RCA agent) |
| Generic tech lead | Telecom + healthcare + retail domain depth |

**Search implication:** Target roles that value **both** production engineering rigor **and** AI/ML fluency — not pure one or the other.

---

## 3. Target Roles & Search Strategy

### Role tiers (priority order)

#### Tier 1 — Primary full-time targets (best fit + pay)

| Role title (search variants) | Why you fit | Expected pay (India) |
|---|---|---|
| **Senior Java Developer / Engineer** | 11 yrs Spring Boot microservices | ₹25–45 LPA |
| **Tech Lead – Backend / Java** | Led 7-person team, architecture | ₹30–50 LPA |
| **AI Integration Engineer** | MCP + LLM + production backend | ₹28–45 LPA |
| **Senior Software Engineer – AI Platform** | Agentic workflows + enterprise scale | ₹30–50 LPA |
| **Solutions Architect (AWS + Java)** | AWS certified + microservices | ₹35–55 LPA |
| **Staff / Principal Engineer – Backend** | Stretch but viable at product cos | ₹40–60 LPA |

#### Tier 2 — AI/ML transition roles (leverage M.Tech)

| Role title | Why you fit | Notes |
|---|---|---|
| **ML Engineer (Applied)** | M.Tech + PyTorch + production judgment | Entry-mid ML; your SWE exp compensates |
| **Applied AI Engineer** | Agentic AI projects + LLM integration | Hot market in 2026 |
| **MLOps / AI Platform Engineer** | AWS + CI/CD + model deployment interest | Bridge role |
| **GenAI Engineer** | MCP, prompt engineering, RAG patterns | Matches your projects |

#### Tier 3 — Side income / contract (weekend)

| Role title | Platform | Pay |
|---|---|---|
| Software Engineer (AI Trainer) | Data Annotation, Mercor | $50–85/hr |
| ML Engineer (AI Trainer) | Alignerr, Mercor | $50–120/hr |
| Coding Agent Evaluator | Mercor | $85/hr + bonuses |

### Keyword matrix (for automated matching)

```
MUST_HAVE (any 2+):
  java, spring boot, backend, microservices, rest api, aws, tech lead

STRONG_PLUS (boost score):
  llm, generative ai, mcp, agentic, python, machine learning, ai integration,
  pytorch, nlp, kubernetes, devops, solution architect

LOCATION_MATCH:
  chennai, remote, india, work from home, hybrid, anywhere

NEGATIVE_FILTER (auto-skip):
  intern, fresher, 0-1 years, campus, unpaid,
  on-site only + not chennai,
  phd required, 15+ years required
```

---

## 4. What Are "Hidden Jobs" & Where to Find Them

### Hidden jobs = posted before aggregators, or never listed on Naukri/LinkedIn

| Category | Why it's "hidden" | How we access it |
|---|---|---|
| **Company ATS APIs** | Jobs live on Greenhouse/Lever/Ashby before Naukri indexes | Public JSON APIs (no auth) |
| **AI contractor platforms** | Mercor, Alignerr, Data Annotation — not on job boards | Direct platform monitoring |
| **Startup boards** | Wellfound, YC jobs, HN Who's Hiring | RSS / API / scheduled scrape |
| **Remote job boards** | RemoteOK, We Work Remotely, Himalayas | RSS feeds (free) |
| **India niche boards** | Cutshort, Instahyre, Hasgeek | Limited API; email alerts as backup |
| **Company career pages** | Direct apply, less competition | ATS API behind the page |
| **LinkedIn (boolean)** | Early postings, less saturated | Manual boolean + optional API |

### Source priority for MVP

| Priority | Source | Method | New jobs/day (est.) |
|---|---|---|---|
| **P0** | Greenhouse ATS (target companies) | Public API | 5–20 |
| **P0** | Lever ATS (target companies) | Public API | 5–15 |
| **P0** | Ashby ATS (AI startups) | Public API | 3–10 |
| **P1** | RemoteOK RSS | RSS feed | 10–30 (filtered) |
| **P1** | Hacker News "Who's Hiring" | Monthly thread parse | 5–15 |
| **P1** | Wellfound (AngelList) API | API (free tier) | 5–10 |
| **P2** | AI trainer platforms | Manual watchlist + scrape | 2–5 |
| **P2** | Cutshort / Instahyre | Email forward parse | 3–8 |
| **P3** | LinkedIn job alerts | Email → parser | 10–20 |
| **P3** | Naukri alerts | Email → parser | 10–20 |

### Why ATS APIs are the secret weapon

Most tech companies don't build custom career pages. They use:

```
https://boards-api.greenhouse.io/v1/boards/{company}/jobs?content=true
https://api.lever.co/v0/postings/{company}?mode=json
https://api.ashbyhq.com/posting-api/job-board/{company}
```

These are **public, free, no API key, structured JSON**. You get jobs **hours before** they appear on LinkedIn.

**Change detection:** Store job IDs from last run → diff on next run → only alert on **new** postings.

---

## 5. Product Vision

### User stories

| As a... | I want to... | So that... |
|---|---|---|
| Job seeker | Get a daily email with new matching jobs | I don't miss early postings |
| Job seeker | See a match score (0–100) per job | I focus on best fits first |
| Job seeker | Filter by Chennai / Remote / AI roles | I don't waste time on wrong location |
| Job seeker | Mark jobs as saved/applied/skipped | I track my pipeline |
| Job seeker | Have old jobs auto-deleted after 30 days | My list stays fresh |
| Job seeker | See which jobs are "hidden" (ATS-direct) vs public boards | I apply early to less competitive postings |

### Core screens (repurpose github-finder React app)

| Screen | Purpose |
|---|---|
| **Dashboard** | Today's new jobs, match score, source badge |
| **Job Detail** | Full description, match breakdown, apply link, notes |
| **Saved Jobs** | Jobs you marked for later application |
| **Applied** | Jobs you've applied to (manual tracking) |
| **Settings** | Role preferences, location, notification schedule, keyword tuning |
| **Sources** | Manage company watchlist, enable/disable sources |

### Notification digest format (email/Telegram)

```
🎯 JobPulse Daily — 8 new matches (Sep 2, 2026)

━━━ TIER 1 (Apply today) ━━━

1. [92] AI Integration Engineer — Freshworks (Chennai/Remote)
   Source: Greenhouse ATS (hidden) · Posted: 6 hours ago
   Match: Java, Spring Boot, LLM, AWS
   → https://boards.greenhouse.io/freshworks/jobs/123

2. [88] Senior Java Engineer — Zoho (Chennai)
   Source: Lever ATS (hidden) · Posted: 1 day ago
   → https://jobs.lever.co/zoho/abc

━━━ TIER 2 (Worth reviewing) ━━━

3. [75] Applied AI Engineer — Postman (Remote India)
   ...

━━━ CONTRACT (Weekend) ━━━

4. [80] ML Engineer Coding Agent — Mercor ($85/hr, Remote India)
   ...

Total active jobs in DB: 142 · Auto-flush in: 30 days
```

---

## 6. Recommended Architecture

### High-level diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                              │
│  Greenhouse API │ Lever API │ Ashby API │ RemoteOK RSS │ HN    │
│  Wellfound API  │ AI Platforms │ Email parsers (LinkedIn/Naukri) │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                     INGESTION LAYER (Cron)                        │
│  scheduler.js / cron.py — runs every 6 hours                     │
│  • Fetch from each source                                         │
│  • Normalize to common job schema                                 │
│  • Deduplicate by URL + title hash                                │
│  • Diff against last snapshot (new jobs only)                     │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                     MATCHING ENGINE                               │
│  • Score 0-100 against resume profile (rules + optional LLM)      │
│  • Filter: location, seniority, negative keywords               │
│  • Classify: tier1 / tier2 / contract / skip                      │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                     SQLite DATABASE                               │
│  jobs table · sources table · user_actions table                  │
│  TTL: auto-delete jobs older than 30 days (saved/applied exempt)  │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌──────────────────────┐    ┌────────────────────────────────────┐
│  NOTIFICATION LAYER  │    │  REACT FRONTEND (github-finder)     │
│  Email / Telegram    │    │  Dashboard · Saved · Applied · Settings│
│  Daily digest 8 AM   │    │  localhost:3000 or Netlify deploy    │
└──────────────────────┘    └────────────────────────────────────┘
```

### Why this architecture

| Decision | Reason |
|---|---|
| **SQLite** (not PostgreSQL) | Personal tool, zero hosting cost, file-based, portable |
| **Node.js backend** (new) | Matches existing React frontend ecosystem |
| **Cron scheduler** | Simple, runs on your machine or free GitHub Actions |
| **ATS APIs first** | Highest signal, lowest legal risk, structured data |
| **Rules-based matching first** | Fast, free, explainable; add LLM scoring in Phase 3 |
| **Keep React frontend** | Repurpose github-finder shell (routing, context, layout) |

---

## 7. Data Model & 30-Day Retention Policy

### `jobs` table

```sql
CREATE TABLE jobs (
  id            TEXT PRIMARY KEY,          -- hash of (source + external_id)
  external_id   TEXT,                      -- ATS job ID
  source        TEXT NOT NULL,             -- 'greenhouse', 'lever', 'remoteok', etc.
  source_type   TEXT DEFAULT 'hidden',     -- 'hidden' | 'public' | 'contract'
  company       TEXT NOT NULL,
  title         TEXT NOT NULL,
  location      TEXT,
  remote_type   TEXT,                      -- 'remote' | 'hybrid' | 'onsite' | 'unknown'
  description   TEXT,
  url           TEXT NOT NULL UNIQUE,
  apply_url     TEXT,
  employment_type TEXT,                    -- 'full-time' | 'contract' | 'part-time'
  salary_range  TEXT,                      -- if available
  match_score   INTEGER DEFAULT 0,         -- 0-100
  match_tier    TEXT,                      -- 'tier1' | 'tier2' | 'contract' | 'skip'
  match_reasons TEXT,                      -- JSON: ["java match", "chennai location"]
  status        TEXT DEFAULT 'new',        -- 'new' | 'saved' | 'applied' | 'skipped' | 'expired'
  first_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_seen_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at    DATETIME,                  -- first_seen_at + 30 days
  notes         TEXT                       -- your personal notes
);
```

### `sources` table

```sql
CREATE TABLE sources (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,               -- 'Freshworks'
  type        TEXT NOT NULL,               -- 'greenhouse' | 'lever' | 'ashby' | 'rss'
  slug        TEXT,                        -- company slug for ATS API
  url         TEXT,
  enabled     BOOLEAN DEFAULT 1,
  last_fetched_at DATETIME,
  job_count   INTEGER DEFAULT 0
);
```

### `fetch_log` table

```sql
CREATE TABLE fetch_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id   TEXT,
  fetched_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  jobs_found  INTEGER,
  jobs_new    INTEGER,
  errors      TEXT
);
```

### 30-day retention policy

```
RULE 1: On insert → expires_at = first_seen_at + 30 days

RULE 2: Daily cleanup cron:
  DELETE FROM jobs
  WHERE expires_at < NOW()
    AND status NOT IN ('saved', 'applied')

RULE 3: 'saved' and 'applied' jobs are NEVER auto-deleted
  (you applied — keep the record for your own tracking)

RULE 4: 'skipped' jobs → deleted after 30 days (you rejected them)

RULE 5: If same job reappears after flush → treated as NEW job
  (new first_seen_at, new 30-day window)
```

---

## 8. Job Matching Engine

### Phase 1: Rules-based scoring (MVP — no LLM cost)

```javascript
function scoreJob(job, profile) {
  let score = 0;
  const reasons = [];
  const text = `${job.title} ${job.description}`.toLowerCase();

  // Must-have skills (+10 each, max 40)
  for (const skill of profile.must_have) {
    if (text.includes(skill)) { score += 10; reasons.push(skill); }
  }

  // Strong plus (+5 each, max 30)
  for (const skill of profile.strong_plus) {
    if (text.includes(skill)) { score += 5; reasons.push(skill); }
  }

  // Location match (+20)
  if (matchesLocation(job, ['chennai', 'remote', 'india', 'anywhere'])) {
    score += 20; reasons.push('location match');
  }

  // Seniority match (+15)
  if (matchesSeniority(job, profile.experience_years)) {
    score += 15; reasons.push('seniority match');
  }

  // Negative filters (instant skip)
  for (const neg of profile.negative) {
    if (text.includes(neg)) return { score: 0, tier: 'skip', reasons: [`blocked: ${neg}`] };
  }

  // Tier classification
  const tier = score >= 70 ? 'tier1' : score >= 50 ? 'tier2' : score >= 30 ? 'contract' : 'skip';
  return { score: Math.min(score, 100), tier, reasons };
}
```

### Phase 3: LLM-enhanced scoring (optional upgrade)

```
Prompt: "Given this resume profile and job description, score 0-100
and explain top 3 match/mismatch reasons in JSON."

Use: Claude/GPT API on jobs scoring 40-70 (borderline) only
Cost: ~$0.01 per job × 20 jobs/day = $0.20/day
```

### Match score thresholds

| Score | Action | Label |
|---|---|---|
| 80–100 | Notify immediately | 🔴 Apply today |
| 60–79 | Include in daily digest | 🟡 Worth reviewing |
| 40–59 | Show in dashboard only | 🟢 Low priority |
| 0–39 | Skip (don't show) | ⚫ Hidden |

---

## 9. Notification Design

### Channels (pick one for MVP, add others later)

| Channel | Pros | Cons | MVP? |
|---|---|---|---|
| **Email** (Gmail) | Universal, searchable | Can get noisy | ✅ Recommended |
| **Telegram bot** | Instant, mobile-friendly | Need bot setup | ✅ Phase 2 |
| **Browser only** | Zero setup | Must open app | ✅ Default (dashboard) |
| **WhatsApp** | You use it daily | No free API for personal | ❌ Skip |
| **Slack** | Good for devs | Overkill for personal | ❌ Skip |

### Schedule

| Digest | When | Content |
|---|---|---|
| **Daily** | 8:00 AM IST | New jobs from last 24h with score ≥ 60 |
| **Weekly** | Sunday 9:00 AM IST | Summary: X new, Y saved, Z applied, top 5 picks |
| **Instant** | On Tier 1 match (score ≥ 85) | Single job alert (Telegram only, Phase 2) |

### Email implementation options

| Option | Cost | Complexity |
|---|---|---|
| **Nodemailer + Gmail SMTP** | Free | Low |
| **Resend.com** | Free tier (100/day) | Low |
| **GitHub Actions → email** | Free | Medium (runs on schedule) |

---

## 10. Repo Transformation Plan

### Current state

```
github-finder/
├── src/
│   ├── App.js              ← React router shell (KEEP)
│   ├── context/            ← Context API pattern (REPURPOSE)
│   ├── components/
│   │   ├── users/          ← GitHub user search (REPLACE → jobs/)
│   │   ├── repos/          ← GitHub repos (REPLACE → sources/)
│   │   ├── pages/          ← Home, About (REPURPOSE)
│   │   └── layout/         ← Navbar, Alert, Spinner (KEEP)
│   └── index.js
├── package.json            ← React 16, axios (UPGRADE in Phase 2)
└── netlify.toml            ← Deploy config (KEEP for frontend)
```

### Target state

```
jobpulse/  (rename repo later)
├── backend/
│   ├── server.js           ← Express API
│   ├── db/
│   │   ├── schema.sql
│   │   └── jobpulse.db     ← SQLite (gitignored)
│   ├── ingestors/
│   │   ├── greenhouse.js
│   │   ├── lever.js
│   │   ├── ashby.js
│   │   ├── remoteok.js
│   │   └── index.js        ← orchestrator
│   ├── matcher/
│   │   ├── profile.js      ← your resume config
│   │   └── scorer.js
│   ├── notifications/
│   │   ├── email.js
│   │   └── telegram.js
│   ├── cron/
│   │   ├── fetch-jobs.js   ← every 6 hours
│   │   └── cleanup.js      ← daily 30-day flush
│   └── package.json
├── frontend/               ← moved from src/
│   ├── src/
│   │   ├── components/
│   │   │   ├── jobs/       ← JobCard, JobList, JobDetail
│   │   │   ├── dashboard/  ← Stats, today's matches
│   │   │   ├── sources/    ← Manage company watchlist
│   │   │   └── settings/   ← Preferences
│   │   └── context/
│   │       └── jobs/       ← replaces github context
│   └── package.json
├── config/
│   ├── profile.yaml        ← your resume matching config
│   └── sources.yaml        ← company watchlist
├── docs/
│   ├── JOB_SEARCH_TOOL_PLAN.md     ← this file
│   ├── dataannotation-complete-guide.md
│   └── alignerr-ml-engineer-prep-plan.md
└── README.md
```

### What we keep vs replace

| Component | Action |
|---|---|
| React app shell (routing, layout) | **Keep** — repurpose |
| Context API pattern | **Keep** — swap github → jobs state |
| Axios HTTP client | **Keep** |
| GitHub-specific components | **Replace** with job components |
| Netlify deploy | **Keep** for frontend |
| Backend | **Add new** — doesn't exist today |

---

## 11. Phased Implementation Roadmap

### Phase 0 — Planning ✅ (this document)

- [x] Resume digest
- [x] Role targeting
- [x] Architecture design
- [x] Data model
- [ ] Your approval on open decisions (Section 15)

### Phase 1 — Backend MVP (core engine)

**Goal:** Fetch jobs from 3 ATS sources, score them, store in SQLite, flush after 30 days.

| Task | Detail |
|---|---|
| Set up `backend/` with Express + SQLite | ~2 hours |
| Build Greenhouse ingestor | Fetch + normalize + dedupe |
| Build Lever ingestor | Same pattern |
| Build Ashby ingestor | Same pattern |
| Implement `profile.yaml` + rules scorer | Your resume as config |
| Implement 30-day TTL cleanup cron | Daily delete expired |
| Seed `sources.yaml` with 30 Chennai/remote companies | See Section 13 |
| CLI command: `npm run fetch` | Manual trigger for testing |

**Deliverable:** Running `npm run fetch` prints 10–30 new scored jobs to terminal.

### Phase 2 — Frontend dashboard

**Goal:** Visual job browser in React (repurpose github-finder).

| Task | Detail |
|---|---|
| Create `jobs/` components (JobCard, JobList, JobDetail) | Replace users/ |
| Jobs context + API integration | Fetch from backend |
| Dashboard page: today's matches, filters | Score, tier, source |
| Saved / Applied / Skipped actions | Status management |
| Source manager page | Add/remove companies |

**Deliverable:** Browse and manage jobs at `localhost:3000`.

### Phase 3 — Notifications

**Goal:** Daily email digest without opening the app.

| Task | Detail |
|---|---|
| Email digest template | Tier 1 / Tier 2 / Contract sections |
| Gmail SMTP or Resend integration | Free |
| Cron: daily 8 AM IST send | node-cron or GitHub Actions |
| Telegram bot (optional) | Instant alerts for score ≥ 85 |

**Deliverable:** Email in inbox every morning.

### Phase 4 — More sources + intelligence

| Task | Detail |
|---|---|
| RemoteOK RSS ingestor | Remote jobs filter |
| HN "Who's Hiring" monthly parser | Hidden startup jobs |
| Wellfound API | Startup roles |
| AI platform watchlist (Mercor, Alignerr) | Contract roles |
| LLM scoring for borderline jobs | Claude API on 40–70 score jobs |
| LinkedIn/Naukri email parser | Forward alerts → auto-ingest |

**Deliverable:** 30–50 new jobs/day across all sources.

### Phase 5 — Polish & deploy

| Task | Detail |
|---|---|
| Deploy frontend to Netlify | Already configured |
| Deploy backend cron to GitHub Actions | Free scheduled runs |
| README + setup docs | One-command start |
| Rename repo to `jobpulse` | Optional |

---

## 12. Tech Stack Recommendation

| Layer | Choice | Why |
|---|---|---|
| **Frontend** | React 18 (upgrade from 16) | Already in repo; upgrade during Phase 2 |
| **Backend** | Node.js + Express | Same language as frontend; you know JS |
| **Database** | SQLite (`better-sqlite3`) | Zero setup, file-based, fast for personal use |
| **Scheduler** | `node-cron` (local) or GitHub Actions (cloud) | Free |
| **HTTP client** | `axios` (already installed) | Familiar |
| **Email** | `nodemailer` + Gmail SMTP | Free |
| **Config** | YAML files (`js-yaml`) | Human-readable profile + sources |
| **Notifications** | `node-telegram-bot-api` (Phase 3) | Free |
| **LLM scoring** | Claude API (Phase 4, optional) | ~$6/month |
| **Deploy frontend** | Netlify (existing) | Free |
| **Deploy cron** | GitHub Actions | Free (2000 min/month) |

### Total cost estimate

| Item | Cost |
|---|---|
| Hosting | **₹0** (local + free tiers) |
| LLM scoring (optional) | ~₹500/month |
| Domain (optional) | ~₹1000/year |
| **Total MVP** | **₹0** |

---

## 13. Initial Company Watchlist (Chennai + Remote India)

### Chennai-based (Greenhouse/Lever/Ashby — verify slugs during setup)

| Company | Focus | ATS (likely) | Roles to watch |
|---|---|---|---|
| **Zoho** | SaaS product | Lever | Java, backend, AI |
| **Freshworks** | SaaS CRM | Greenhouse | Java, platform, AI |
| **Chargebee** | SaaS billing | Greenhouse | Java, backend |
| **Kissflow** | Low-code platform | Greenhouse | Java, full-stack |
| **Facilio** | PropTech AI | Ashby | AI, backend |
| **Ather Energy** | EV + software | Lever | Backend, IoT |
| **Postman** | API platform (Chennai office) | Greenhouse | Backend, platform |
| **Mad Street Den** | Computer vision AI | Ashby | ML, AI engineer |
| **HyperVerge** | AI/ML products | Greenhouse | ML, backend |
| **Indsight** | AI analytics | Ashby | AI, data |
| **Verizon India** | Telecom (your current) | Workday | Internal moves |

### Remote India-friendly (global companies)

| Company | Focus | ATS | Roles to watch |
|---|---|---|---|
| **Atlassian** | Dev tools | Greenhouse | Java, backend |
| **GitLab** | DevOps platform | Greenhouse | Backend, remote |
| **Automattic** | WordPress | Lever | Remote, backend |
| **Zapier** | Automation | Ashby | Remote, backend |
| **Razorpay** | Fintech | Greenhouse | Java, backend |
| **PhonePe** | Fintech | Greenhouse | Backend, platform |
| **CRED** | Fintech | Lever | Backend, AI |
| **Swiggy** | Delivery tech | Lever | Backend (remote options) |
| **Groww** | Fintech | Greenhouse | Backend |
| **Juspay** | Payments | Ashby | Backend |

### AI-focused (your M.Tech + projects lane)

| Company | Focus | ATS | Roles to watch |
|---|---|---|---|
| **Anthropic** | AI safety | Greenhouse | AI engineer (contract) |
| **Scale AI** | AI data | Greenhouse | ML engineer |
| **Hugging Face** | ML platform | Lever | ML, developer relations |
| **Cohere** | LLM platform | Ashby | Applied AI |
| **Glean** | Enterprise AI | Greenhouse | AI integration |
| **Sierra AI** | AI agents | Ashby | Agentic AI |
| **Mercor** | AI talent platform | Custom | Contract ML/SWE |
| **Alignerr** | AI training | Custom | Contract ML |

> **Note:** ATS slugs must be verified by visiting each company's careers page URL. We'll build a setup script that validates slugs.

---

## 14. Risks, Legal & Ethics

| Risk | Mitigation |
|---|---|
| **ATS API rate limiting** | Fetch every 6 hours, not every minute; respect robots |
| **Scraping LinkedIn/Indeed** | ❌ Don't scrape — use email alert forwarding instead |
| **Stale job postings** | Track `last_seen_at`; mark as closed if missing for 14 days |
| **False positive matches** | Tune thresholds; add "skip" feedback to improve rules |
| **Data privacy** | All data local (SQLite); no cloud storage of jobs |
| **Terms of service** | ATS public APIs are intended for consumption; RSS feeds are public |
| **GitHub Actions limits** | 2000 min/month free — our cron uses ~5 min/day = ~150 min/month |

---

## 15. Open Decisions (Need Your Input)

Before we implement, please confirm:

### Q1: Primary job search lane?

| Option | Description |
|---|---|
| **A) Full-time SWE/Tech Lead** (recommended) | Chennai + remote, ₹25–50 LPA |
| **B) AI/ML transition roles** | Applied AI, ML Engineer, GenAI |
| **C) Both A + B** | Two tiers in same tool |
| **D) A + B + contract gigs** | Full tool with all three lanes |

**Recommendation:** **D** — you need full-time + weekend contract income.

### Q2: Notification preference?

| Option | Description |
|---|---|
| **A) Email only** | Daily digest to Gmail |
| **B) Telegram only** | Bot messages |
| **C) Email + Telegram** | Both |
| **D) Dashboard only** | No push notifications |

**Recommendation:** **C** — email for daily digest, Telegram for urgent Tier 1 matches.

### Q3: Where should the backend run?

| Option | Description |
|---|---|
| **A) Local machine** | Run cron when laptop is on |
| **B) GitHub Actions** | Free cloud cron, runs even when laptop is off |
| **C) Both** | GitHub Actions for fetch, local for dashboard |

**Recommendation:** **C** — GitHub Actions fetches jobs 4×/day; you browse locally.

### Q4: Repo rename?

| Option | Description |
|---|---|
| **A) Keep `github-finder`** | Less work, confusing name |
| **B) Rename to `jobpulse`** | Clean, descriptive |

**Recommendation:** **B** — rename when Phase 1 is done.

### Q5: Minimum match score to notify?

| Option | Threshold |
|---|---|
| **A) 60+** | More jobs, some noise |
| **B) 70+** | Balanced (recommended) |
| **C) 80+** | Only best matches, might miss good ones |

---

## 16. Success Metrics

| Metric | Target (Month 1) |
|---|---|
| Sources monitored | 30+ companies |
| New jobs ingested/week | 50–100 |
| Jobs scoring ≥ 70 | 10–20/week |
| Hidden (ATS-direct) jobs found | 30%+ of total |
| Time to find relevant job | < 5 min/day (vs 30+ min manual) |
| Jobs applied to via tool | 5–10/month |
| False positive rate | < 30% (tune over time) |

---

## Appendix A: Sample `config/profile.yaml`

```yaml
# Gowrishankar Sekar — Job Matching Profile
# Edit this file to tune what jobs you see

name: Gowrishankar Sekar
email: sgowrishankarrr@gmail.com
location: Chennai, India
experience_years: 11

roles:
  tier1:
    - Senior Java Developer
    - Tech Lead Backend
    - AI Integration Engineer
    - Senior Software Engineer
    - Solutions Architect
  tier2:
    - ML Engineer
    - Applied AI Engineer
    - GenAI Engineer
    - MLOps Engineer
  contract:
    - AI Trainer
    - Software Engineer AI Training
    - ML Engineer Coding Agent

must_have_keywords:
  - java
  - spring
  - backend
  - microservices
  - rest api
  - aws

strong_plus_keywords:
  - llm
  - generative ai
  - mcp
  - agentic
  - python
  - machine learning
  - ai integration
  - pytorch
  - tech lead
  - architect

location_keywords:
  - chennai
  - remote
  - india
  - work from home
  - hybrid
  - anywhere

negative_keywords:
  - intern
  - fresher
  - 0-1 year
  - campus hire
  - unpaid
  - volunteer

min_score_notify: 70
min_score_show: 40
retention_days: 30
```

---

## Appendix B: What Happens Next

Once you confirm the open decisions (Section 15), implementation order is:

```
Week 1: Phase 1 — Backend MVP (ATS fetchers + SQLite + scorer + cleanup)
Week 2: Phase 2 — React dashboard (repurpose github-finder)
Week 3: Phase 3 — Email/Telegram notifications
Week 4: Phase 4 — More sources + tuning
```

**Your immediate action:** Reply with answers to Q1–Q5 in Section 15, and we'll start Phase 1.

---

*This is a planning document only. No code has been implemented yet.*
