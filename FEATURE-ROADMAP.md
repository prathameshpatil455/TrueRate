# TrueRate — Feature Roadmap & Progress Tracker

**Product:** Cross-Border Payment Cost Optimizer (Web)  
**Source PRD:** [Cross-Border-Payment-Optimizer-PRD.md](./Cross-Border-Payment-Optimizer-PRD.md)  
**Last updated:** 2026-06-30 (Phase 2.6 — UX quick wins)

---

## How to use this document

1. Update the **Status** column as work moves: `Not Started` → `In Progress` → `Done` (or `Blocked` / `Deferred`).
2. Check off items in the **Progress** column when a feature is fully shipped and verified.
3. Add notes, owners, or dates in the **Notes** column as needed.
4. Roll up phase completion in the **Summary** section at the top.

### Status legend

| Status | Meaning |
|--------|---------|
| `Not Started` | Not yet begun |
| `In Progress` | Actively being built |
| `Done` | Shipped and verified |
| `Blocked` | Waiting on a dependency or decision |
| `Deferred` | Moved out of current phase scope |

---

## Progress summary

| Phase | Focus | Items | Done | Progress |
|-------|-------|------:|-----:|----------|
| **Phase 0** | Foundation & decisions | 12 | 11 | 92% |
| **Phase 1** | MVP — core comparison | 39 | 37 | 95% |
| **Phase 2** | Retention & analytics | 26 | 23 | 88% |
| **Phase 3** | Scale & intelligence | 8 | 0 | 0% |
| **Total** | | **76** | **0** | **0%** |

> Update the counts above when items are completed or added.

---

## Phase 0 — Foundation & pre-build

Resolve open questions and set up the project before feature work.

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 0.1 | Choose initial remittance providers (1–2) | Done | [x] | Wise + Remitly — see `docs/PHASE-0-DECISIONS.md` |
| 0.2 | Define stablecoin + network scope (e.g. USDC on Ethereum / L2) | Done | [x] | USDC Ethereum + Polygon; ETH rail |
| 0.3 | Choose hosting (frontend + backend) | Done | [x] | Vercel + Railway |
| 0.4 | Set up monorepo / project structure | Done | [x] | `apps/api`, `apps/web`, `packages/shared` |
| 0.5 | Configure dev environment (Node-only local) | Done | [x] | `npm run dev` — no Docker required |
| 0.6 | Register external API keys (ExchangeRate-API, Etherscan) | In Progress | [ ] | `.env.example` ready — add keys to `apps/api/.env` |
| 0.7 | Define database schema (users, comparisons, saved pairs) | Done | [x] | `docs/DATABASE-SCHEMA.md` + `001_initial_schema.sql` |
| 0.8 | Define REST API contract (`/api/v1/...`) | Done | [x] | `docs/API-CONTRACT.md` |
| 0.9 | Add legal/disclaimer copy ("estimates only") | Done | [x] | `packages/shared` + web footer |
| 0.10 | CI/CD pipeline (lint, test, deploy) | Done | [x] | `.github/workflows/ci.yml` |
| 0.11 | Environment variables & secrets management | Done | [x] | `apps/api/.env.example`, `apps/web/.env.example` |
| 0.12 | Phase 0 sign-off — ready to build MVP | Done | [x] | `npm run dev` works locally without Docker |

---

## Phase 1 — MVP (core value proposition)

**Goal:** Prove accurate, trustworthy multi-rail cost comparison with a clear recommendation.

### 1.1 Infrastructure & backend foundation

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 1.1.1 | Express.js API server with `/api/v1` versioning | Done | [x] | |
| 1.1.2 | PostgreSQL connection & migrations | Done | [x] | `infra/docker-compose.yml` + migrations |
| 1.1.3 | Redis cache layer | Deferred | [ ] | In-memory cache used for now |
| 1.1.4 | Rate limiting middleware | Done | [x] | express-rate-limit |
| 1.1.5 | HTTPS / SSL in production | Deferred | [ ] | Production deploy |
| 1.1.6 | Background job scheduler (cron or BullMQ) | Done | [x] | node-cron rate poller |
| 1.1.7 | Health check & graceful API fallback | Done | [x] | FX fallback to Frankfurter |
| 1.1.8 | Docker Compose for local PostgreSQL | Done | [x] | `infra/data/postgres` bind mount |

### 1.2 External API integration layer

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 1.2.1 | `FXProvider` interface + ExchangeRate-API adapter | Done | [x] | Frankfurter fallback without API key |
| 1.2.2 | `CryptoProvider` interface + CoinGecko adapter | Done | [x] | |
| 1.2.3 | `StablecoinProvider` (USDC via CoinGecko) | Done | [x] | USD-pegged routes |
| 1.2.4 | `GasFeeProvider` interface + Etherscan adapter | Done | [x] | Static fallback without key |
| 1.2.5 | Scheduled rate polling (5–15 min) → cache | Done | [x] | In-memory cache (Redis later) |
| 1.2.6 | Provider fee config (remittance + SWIFT estimates) | Done | [x] | `mvp-providers.ts` |

### 1.3 Comparison engine & calculator

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 1.3.1 | Comparison input validation (amount, currencies, corridor) | Done | [x] | |
| 1.3.2 | SWIFT route (fee + time estimate) | Done | [x] | |
| 1.3.3 | Remittance provider route(s) — 1–2 providers | Done | [x] | Wise + Remitly |
| 1.3.4 | Stablecoin route | Done | [x] | USDC Ethereum + Polygon |
| 1.3.5 | Crypto rail route | Done | [x] | ETH Ethereum |
| 1.3.6 | Platform/provider fee calculation | Done | [x] | |
| 1.3.7 | FX markup vs mid-market rate | Done | [x] | |
| 1.3.8 | Blockchain/network fee (crypto routes) | Done | [x] | Live gas + static L2 |
| 1.3.9 | Net amount received per route | Done | [x] | |
| 1.3.10 | Estimated settlement time per route | Done | [x] | |
| 1.3.11 | Currency auto-conversion before compare | Done | [x] | Live FX mid-market |

### 1.4 Recommendation engine (rule-based)

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 1.4.1 | Normalize cost & time (0–1 scale) | Done | [x] | |
| 1.4.2 | Cheapest route ranking | Done | [x] | |
| 1.4.3 | Fastest route ranking | Done | [x] | |
| 1.4.4 | Balanced route (weighted cost + speed) | Done | [x] | |
| 1.4.5 | "Why this route" explanation text | Done | [x] | |

### 1.5 Authentication & user management

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 1.5.1 | User registration (email/password) | Done | [x] | bcrypt + JWT |
| 1.5.2 | Login + JWT access token (~15 min) | Done | [x] | |
| 1.5.3 | Refresh token (httpOnly cookie) | Done | [x] | |
| 1.5.4 | Password hashing (bcrypt) | Done | [x] | |
| 1.5.5 | Profile management (name, default currencies) | Done | [x] | PATCH /users/me |
| 1.5.6 | Auth middleware on protected routes | Done | [x] | |

### 1.6 Frontend — web app

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 1.6.1 | React + Vite project setup | Done | [x] | |
| 1.6.2 | React Router — app shell & routes | Done | [x] | |
| 1.6.3 | Tailwind CSS styling | Done | [x] | |
| 1.6.4 | React Query for server state | Done | [x] | |
| 1.6.5 | Registration & login pages | Done | [x] | /register, /login |
| 1.6.6 | Comparison form (amount, currencies, corridor, priority) | Done | [x] | |
| 1.6.7 | Comparison dashboard — table view | Done | [x] | |
| 1.6.8 | Sort/filter by cost, speed, provider type | Done | [x] | |
| 1.6.9 | Highlight recommended route | Done | [x] | |
| 1.6.10 | Fee breakdown & effective rate per row | Done | [x] | |
| 1.6.11 | Responsive layout (mobile-friendly web) | Done | [x] | |

### 1.7 User dashboard & export

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 1.7.1 | Save comparison to history (DB) | Done | [x] | Auto-save when signed in |
| 1.7.2 | Recent comparisons list | Done | [x] | /history page |
| 1.7.3 | Saved favorite currency pairs | Done | [x] | API + compare page UI |
| 1.7.4 | CSV export of comparison | Done | [x] | Client + server export |

### 1.8 MVP launch checklist

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 1.8.1 | End-to-end comparison flow tested | Done | [x] | API + UI wired |
| 1.8.2 | Calculator accuracy spot-checked vs providers | Not Started | [ ] | Manual verification |
| 1.8.3 | Performance: results within 2–3 seconds | Done | [x] | Cached FX + local calc |
| 1.8.4 | MVP deployed to production | Not Started | [ ] | Vercel + Railway |
| 1.8.5 | Phase 1 sign-off | In Progress | [ ] | Auth + DB remaining |

---

## Phase 2 — Retention, analytics & notifications

**Goal:** Increase stickiness, insights, and engagement after MVP validation.

### 2.1 Reporting & export

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 2.1.1 | PDF comparison report (server-side) | Done | [x] | pdf-lib |
| 2.1.2 | Branded PDF layout / design | Done | [x] | TrueRate header + disclaimer |

### 2.2 Analytics & visualization

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 2.2.1 | Exchange-rate history charts | Done | [x] | Recharts + fx_rate_snapshots |
| 2.2.2 | Fee comparison charts across providers | Done | [x] | |
| 2.2.3 | Monthly savings summary | Done | [x] | |
| 2.2.4 | Provider performance over time | Done | [x] | |
| 2.2.5 | Most-used corridor / route analytics | Done | [x] | |
| 2.2.6 | Country-wise analytics | Done | [x] | |

### 2.3 Notifications

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 2.3.1 | Transactional email setup (SendGrid/Postmark) | Done | [x] | nodemailer + console fallback |
| 2.3.2 | Exchange-rate threshold alerts | Done | [x] | Hourly cron job |
| 2.3.3 | Fee-drop notifications | Deferred | [ ] | Needs fee history tracking |
| 2.3.4 | "Better route available" alerts | Done | [x] | |
| 2.3.5 | Notification preferences in user profile | Done | [x] | /settings page |
| 2.3.6 | Scheduled job: check thresholds & send email | Done | [x] | notification-checker cron |

### 2.4 User dashboard enhancements

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 2.4.1 | Search across past comparisons | Done | [x] | GET /comparisons/search |
| 2.4.2 | Additional payment providers beyond MVP set | Done | [x] | Western Union + Xoom |

### 2.5 Phase 2 launch checklist

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 2.5.1 | Analytics data pipeline / storage | Done | [x] | fx_rate_snapshots + migration 002 |
| 2.5.2 | Notification opt-in UX | Done | [x] | /settings |
| 2.5.3 | Phase 2 sign-off | In Progress | [ ] | Fee-drop alerts deferred |

### 2.6 UX quick wins (high impact)

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 2.6.1 | Savings hero card on comparison results | Done | [x] | `SavingsHero` component |
| 2.6.2 | Saved corridors UI (save + quick-select list) | Done | [x] | `SavedCorridorsPanel` on compare page |
| 2.6.3 | "Go to provider" outbound links per route | Done | [x] | `providerUrl` on routes + Go link |
| 2.6.4 | Re-run comparison from history ("Compare again") | Done | [x] | URL params from `/history` |
| 2.6.5 | Pre-fill corridor from user profile defaults | Done | [x] | User `defaultSourceCurrency` / `defaultDestCurrency` |
| 2.6.6 | Register success toast | Done | [x] | `REGISTER_SUCCESS_TOAST` |
| 2.6.7 | Shareable comparison via URL query params | Done | [x] | Share link + auto-run on load |
| 2.6.8 | Amount quick presets ($500 / $1k / $5k) | Done | [x] | `AMOUNT_PRESETS` on compare form |

---

## Phase 3 — Scale, intelligence & mobile

**Goal:** Smarter recommendations, operations tooling, and mobile reach.

| # | Feature / Task | Status | Progress | Notes |
|---|----------------|--------|----------|-------|
| 3.1 | Collect comparison outcome data for ML training | Not Started | [ ] | Prerequisite for 3.2 |
| 3.2 | ML recommendation engine (decision tree / RF / XGBoost) | Not Started | [ ] | Replace or augment rules |
| 3.3 | RBAC scaffolding — admin vs user roles | Not Started | [ ] | |
| 3.4 | Admin panel (users, providers, fee config) | Not Started | [ ] | |
| 3.5 | Web push notifications | Not Started | [ ] | Optional; email first in Phase 2 |
| 3.6 | Mobile app (Flutter) — core comparison flow | Not Started | [ ] | After web validates logic |
| 3.7 | Mobile app — auth, history, saved pairs | Not Started | [ ] | |
| 3.8 | Phase 3 sign-off | Not Started | [ ] | |

---

## Success metrics (post-launch tracking)

Instrument after MVP is live; not required to ship Phase 1.

| Metric | Target / benchmark | Tracking | Status |
|--------|-------------------|----------|--------|
| Comparisons per user per month | TBD | Not Started | [ ] |
| 30-day return rate | TBD | Not Started | [ ] |
| Avg estimated savings shown | TBD | Not Started | [ ] |
| Click-through on recommended route | TBD | Not Started | [ ] |
| Notification opt-in rate (Phase 2+) | TBD | Not Started | [ ] |
| Notification engagement rate (Phase 2+) | TBD | Not Started | [ ] |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-30 | Phase 2.6: UX quick wins (savings hero, saved corridors, share URL, etc.) |
| 2026-06-30 | Initial roadmap created from PRD v1.0 |
