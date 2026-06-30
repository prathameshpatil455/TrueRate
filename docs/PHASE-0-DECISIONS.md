# Phase 0 — Foundation Decisions

**Status:** Approved for MVP build  
**Date:** 2026-06-30

---

## 0.1 Remittance providers (MVP)

| Provider | In MVP | Fee data source | Rationale |
|----------|--------|-----------------|-----------|
| **Wise** | Yes | Manual config + periodic review | Transparent pricing; widely trusted; fee tiers documented publicly |
| **Remitly** | Yes | Manual config + periodic review | Strong remittance brand; complements Wise for corridor coverage |

**Not in MVP (Phase 2):** Western Union, Xoom, PayPal, additional regional providers.

### Fee data approach

Neither Wise nor Remitly exposes a public, comparison-friendly API. MVP uses:

1. **Static fee configuration** in `apps/api/src/config/providers/` (percentage + flat fee by corridor tier).
2. **FX markup** derived from live mid-market rate (ExchangeRate-API) plus a configured spread per provider.
3. **"As of" timestamp** on every comparison result so users know data may be estimated.
4. **Quarterly review** of provider pricing pages to refresh config values.

---

## 0.2 Stablecoin & blockchain scope (MVP)

| Asset | Network | Gas / fee source | Rationale |
|-------|---------|------------------|-----------|
| **USDC** | Ethereum | Etherscan Gas Tracker | Primary stablecoin rail; real-time gas data available free |
| **USDC** | Polygon | Static low-fee estimate (~$0.01) | Shows L2 cost advantage vs Ethereum in comparisons |

**Not in MVP:** USDT, other stablecoins, Base, Arbitrum, Solana (Phase 2 expansion).

### Crypto rail (non-stablecoin)

| Asset | Network | Pricing source |
|-------|---------|----------------|
| **ETH** | Ethereum | CoinGecko + Etherscan gas |

One crypto rail is enough for MVP multi-rail proof; stablecoin routes are the primary crypto comparison.

---

## 0.3 Hosting & infrastructure

| Component | Choice | Tier | Notes |
|-----------|--------|------|-------|
| **Frontend** | Vercel | Hobby (free) | Native Vite/React support; preview deploys per PR |
| **Backend API** | Railway | Starter / free credits | Node.js + managed PostgreSQL + Redis add-ons |
| **Database** | PostgreSQL 16 | Railway managed | Local via `infra/docker-compose.yml` when needed |
| **Cache** | Redis 7 | Railway managed | Local via `infra/docker-compose.yml` when needed |
| **CI** | GitHub Actions | Free for public repos | Lint + typecheck on push/PR |

### Local development (current)

- **Node.js only** — `npm install` then `npm run dev`
- No Docker, PostgreSQL, or Redis required until auth/history/caching features
- API runs on `http://localhost:3001`, web on `http://localhost:5173`

### Local development (later — when persistence is needed)

- Docker Compose in `infra/` for PostgreSQL + Redis
- Run `npm run db:up` and `npm run db:migrate` before auth and comparison history

### Production hosting

| Environment | Frontend URL | API URL |
|-------------|--------------|---------|
| Local | `http://localhost:5173` | `http://localhost:3001` |
| Production | `https://truerate.vercel.app` (TBD) | `https://api.truerate.app` (TBD) |

---

## 0.6 External API keys

| Provider | Key required | Registration | Free tier |
|----------|--------------|--------------|-----------|
| ExchangeRate-API | Yes | https://www.exchangerate-api.com/ | 1,500 req/month |
| CoinGecko | No (public endpoints) | — | Generous rate limits |
| Etherscan | Yes | https://etherscan.io/apis | 5 calls/sec |

Copy `apps/api/.env.example` → `apps/api/.env` and fill in keys before running comparisons locally.

---

## Sign-off checklist

- [x] Remittance providers chosen (Wise, Remitly)
- [x] Stablecoin/network scope defined (USDC Ethereum + Polygon, ETH rail)
- [x] Hosting strategy documented (Vercel + Railway)
- [x] Fee data strategy documented (manual config + live FX)
- [x] Local dev runs with Node only (`npm run dev`)
- [ ] Docker / PostgreSQL / Redis (deferred to persistence phase)
