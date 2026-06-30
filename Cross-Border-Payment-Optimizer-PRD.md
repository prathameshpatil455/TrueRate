# Cross-Border Payment Cost Optimizer — Web Platform

**Document type:** Product Requirements Document (PRD) + System Architecture + MVP Scope
**Platform focus:** Web application (mobile app deferred to a later phase)
**Version:** 1.0

---

## 1. Product Overview

### 1.1 Problem Statement
People and businesses sending money across borders have no easy way to compare the true cost of different transfer methods — SWIFT banks, digital remittance providers, stablecoins, and crypto rails — in one place. Fees are scattered across exchange-rate markups, platform charges, and network costs, making it hard to know which route actually delivers the most money to the recipient, fastest.

### 1.2 Product Vision
A web platform where a user enters a transfer (amount, source currency, destination currency, corridor) and instantly sees a side-by-side comparison of available payment routes — total cost, amount received, and estimated time — with a recommendation for the best option based on their priority (cheapest, fastest, or balanced).

### 1.3 Target Users
- Individuals sending remittances to family abroad
- Freelancers/contractors receiving international payments
- Small businesses paying overseas suppliers
- Crypto-native users comparing stablecoin rails against traditional options

---

## 2. Functional Requirements

### 2.1 User Management
- Registration and login with email/password
- JWT-based session authentication
- Password encryption with bcrypt
- Profile management (name, default currencies, notification preferences)

### 2.2 Payment Comparison Engine
- Input: send amount, source currency, destination currency, corridor (country pair)
- Output: side-by-side comparison across SWIFT, digital remittance providers, stablecoin networks, and crypto rails
- Each route shows: total fee breakdown, effective exchange rate, amount receiver gets, estimated settlement time

### 2.3 Live FX & Crypto Data
- Real-time FX rate fetch (ExchangeRate-API)
- Real-time crypto/stablecoin pricing (CoinGecko)
- Real-time blockchain network fees (Etherscan Gas Tracker)
- Currency auto-conversion before comparison is shown

### 2.4 Transfer Cost Calculator
Computes, per route:
- Platform/provider fee
- Bank charges (where applicable)
- FX markup vs. real mid-market rate
- Blockchain/network fee (for crypto/stablecoin routes)
- Total cost and net amount received

### 2.5 Recommendation Engine (Rule-Based, MVP)
- Lowest cost route
- Fastest route
- Best balance (weighted score of cost + speed)
- Simple, explainable rule logic (e.g., normalize cost and time, weight and rank)

### 2.6 Comparison Dashboard
- Table view of all routes for a given comparison
- Sort/filter by cost, speed, provider type
- Highlight recommended route

### 2.7 Analytics & Visualization
- Exchange-rate history charts
- Fee comparison charts across providers
- Monthly savings summary
- Provider performance over time
- Most-used corridor / route

### 2.8 User Dashboard
- Saved favorite currency pairs
- Recent comparison history
- Search past comparisons
- Download comparison as PDF/CSV

### 2.9 Notifications
- Exchange-rate alerts (threshold-based)
- Fee-drop notifications
- "Better route available" alerts
- Delivered via email (web push optional, later phase)

---

## 3. Non-Functional Requirements
- Response time: comparison results returned within 2–3 seconds (cached FX/crypto data where possible)
- Security: HTTPS everywhere, encrypted passwords, JWT with short-lived access tokens + refresh tokens
- Availability: graceful fallback if a third-party API is down (show cached/last-known rate with a timestamp)
- Scalability: stateless backend so it can scale horizontally
- Data privacy: no storage of actual recipient bank/wallet details unless explicitly required later

---

## 4. System Architecture (Web)

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                      │
│            React.js Web App (Vite, Responsive)             │
└───────────────────────┬───────────────────────────────────┘
                         │ HTTPS (REST/JSON)
┌───────────────────────▼───────────────────────────────────┐
│                   API Gateway / Express.js                 │
│   - Auth middleware (JWT verification)                     │
│   - Rate limiting                                           │
└───────────────────────┬───────────────────────────────────┘
                         │
        ┌────────────────┼─────────────────┬───────────────┐
        ▼                ▼                 ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌────────────────┐ ┌─────────────┐
│ Auth Service  │ │ Comparison   │ │ Recommendation  │ │ Notification │
│ (JWT, bcrypt) │ │ Engine        │ │ Engine (rules)  │ │ Service      │
└──────┬───────┘ └──────┬───────┘ └────────┬────────┘ └──────┬──────┘
       │                │                  │                  │
       ▼                ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         PostgreSQL (Primary DB)                  │
│  Users | Comparisons | Saved Routes | Notification Preferences   │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Redis Cache (FX/crypto rates, sessions)        │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  External API Integration Layer                  │
│  ExchangeRate-API | CoinGecko | Etherscan Gas Tracker             │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Frontend (Web)
- **Framework:** React.js (Vite for build tooling — fast dev server, simple setup, no SSR complexity needed for an MVP behind a login)
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **Charts:** Chart.js or Recharts for analytics visualizations
- **State management:** React Query (for server state/caching) + lightweight client state (Zustand or Context API)

### 4.3 Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **API style:** REST (JSON), versioned (`/api/v1/...`)
- **Background jobs:** Node-cron or a queue (BullMQ + Redis) for periodic rate polling and notification checks

### 4.4 Database
- **Primary DB:** PostgreSQL — relational data fits well (users, comparisons, saved currencies, transfer history)
- **Cache:** Redis — for live FX/crypto rate caching (avoid hammering third-party APIs) and session/token blacklist management

### 4.5 Authentication & Security
- JWT access tokens (short-lived, ~15 min) + refresh tokens (longer-lived, stored httpOnly cookie)
- bcrypt for password hashing
- HTTPS/SSL enforced
- Rate limiting on auth and comparison endpoints
- RBAC scaffolding (admin vs. user) even if only user-role is used at MVP

### 4.6 External API Integration Layer
A dedicated service layer that abstracts each third-party provider behind a common internal interface, so providers can be swapped without touching business logic. For the MVP, every external data source should be a **free-tier provider** to keep costs at zero during validation — this does mean working within their rate limits (typically a few hundred to a few thousand calls/month on free tiers), which is exactly why the Redis caching layer matters: poll rates on a schedule (e.g., every 5–15 minutes) and serve cached values to users instead of calling the provider on every single comparison request.

- `FXProvider` interface → **ExchangeRate-API** (free tier: 1,500 requests/month, no card required) — simplest free option to start with
- `CryptoProvider` interface → **CoinGecko** (free public API, generous rate limits, no key required for basic endpoints) — best free option for crypto/stablecoin pricing
- `StablecoinProvider` interface → CoinGecko market data for USDC pricing (Circle's own API can be added later if more detailed stablecoin-specific data is needed)
- `GasFeeProvider` interface → **Etherscan Gas Tracker** (free tier with API key, simple REST endpoint) — easier free option than Blocknative for MVP

This abstraction matters because free-tier rate limits, pricing, or reliability issues with any one provider are common — having a swappable interface means upgrading to a paid tier or switching providers later doesn't require a rewrite.

### 4.7 Recommendation Engine (MVP)
Rule-based scoring service, implemented as an internal module (not a separate microservice at MVP):
- Normalize cost and time across routes (0–1 scale)
- Apply weights based on user-selected priority (cost / speed / balanced)
- Output ranked list with a clearly explained "why this route" reason

### 4.8 Notifications
- MVP: email notifications via a transactional email service (e.g., SendGrid/Postmark) triggered by a scheduled job checking rate thresholds
- Later: web push notifications

### 4.9 Reporting
- PDF generation via a server-side library (e.g., Puppeteer or pdf-lib) for downloadable comparison reports
- CSV export via simple server-side serialization

---

## 5. MVP Feature Scope

The goal of the MVP is to prove the core value proposition — accurate, trustworthy cost comparison with a clear recommendation — without building every analytics and notification feature upfront.

### 5.1 MVP — Included
| Feature | Why it's in MVP |
|---|---|
| Registration/login (JWT + bcrypt) | Needed to save history and personalize |
| Live FX rate fetch + conversion | Core to any comparison |
| Payment comparison engine (SWIFT, 1–2 remittance providers, 1 stablecoin, 1 crypto rail) | Core value proposition — start narrow, prove the concept |
| Transfer cost calculator (fees, FX markup, network fees) | This is the actual product |
| Estimated transfer time per route | Needed for "fastest" recommendation |
| Rule-based recommendation engine | Cheapest, fastest, balanced — no ML needed yet |
| Comparison dashboard (table view) | Primary UI surface |
| Basic user dashboard (recent comparisons, saved currency pairs) | Retention driver, low build cost |
| CSV export of comparison | Cheap to build, high perceived value |

### 5.2 Deferred to Phase 2
- PDF report generation (CSV first, PDF once layout/design is settled)
- Full analytics suite (historical rate trend charts, monthly savings, provider performance, country-wise analytics)
- Notifications (rate alerts, fee-drop alerts, better-route alerts)
- Search across past comparisons
- Additional providers beyond the initial 3–4 routes

### 5.3 Deferred to Phase 3
- Machine learning recommendation engine (decision tree / random forest / XGBoost) — only viable once there's enough real comparison and outcome data to train on
- RBAC / admin panel
- Mobile app (Flutter), once the web product validates the core comparison logic and provider integrations

### 5.4 Rationale for This Cut
The riskiest, most valuable part of this product is whether the comparison and cost-calculation logic is accurate and trustworthy — not the dashboard polish or notification system. Starting with a narrow set of providers (one SWIFT-equivalent estimate, one or two remittance providers with public/estimable fee structures, one stablecoin, one crypto rail) keeps the external-integration surface small while still proving the multi-rail comparison concept. Everything in Phase 2 and 3 adds retention and stickiness but isn't needed to validate whether the core comparison is useful.

---

## 6. Open Questions to Resolve Before Build
- Which specific remittance providers will be compared first, and do they have public APIs, or will fee data need to be manually maintained/estimated (most remittance providers — Wise, Remitly, etc. — don't expose public comparison-friendly APIs)?
- Which blockchain networks/stablecoins are in scope at MVP (e.g., USDC on Ethereum only, or also on cheaper L2s like Polygon/Base — this significantly affects perceived "network fee" competitiveness)
- Hosting/infra choice (e.g., a free/low-cost host for frontend such as Vercel or Netlify + a managed Node host for backend — worth keeping this free-tier-friendly too, in line with the API choices)

---

## 7. Success Metrics (Lower Priority — Track Later, Not an MVP Build Requirement)
These aren't needed to ship the MVP, but worth having instrumented for once the product is live:
- Number of comparisons run per user per month
- % of users who return to compare again within 30 days
- Average estimated savings shown to users
- Conversion from comparison → "recommended route" click-through
- Notification opt-in and engagement rate (once notifications ship in Phase 2)
