# TrueRate

Cross-border payment cost optimizer — compare SWIFT, remittance providers, stablecoins, and crypto rails side by side.

## Documentation

| Document | Description |
|----------|-------------|
| [PRD](./Cross-Border-Payment-Optimizer-PRD.md) | Product requirements |
| [Feature roadmap](./FEATURE-ROADMAP.md) | Phased progress tracker |
| [Phase 0 decisions](./docs/PHASE-0-DECISIONS.md) | Provider, chain, and hosting choices |
| [API contract](./docs/API-CONTRACT.md) | REST endpoints (`/api/v1`) |

## Prerequisites

- **Node.js 20+**

No Docker or PostgreSQL required for local development.

## First-time setup

```bash
npm install

cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

npm run db:init
```

`db:init` creates empty JSON data files under `apps/api/data/` (gitignored). The API also initializes this folder automatically on startup.

## Run locally

```bash
npm run dev
```

- **Web:** http://localhost:5173  
- **API:** http://localhost:3001  

Or in separate terminals: `npm run dev:api` and `npm run dev:web`.

## Data storage

User accounts, comparisons, saved pairs, FX snapshots, and notification logs are stored as JSON files in `apps/api/data/`:

| File | Contents |
|------|----------|
| `users.json` | Accounts and preferences |
| `refresh-tokens.json` | Session refresh tokens |
| `comparisons.json` | Saved comparison history |
| `saved-pairs.json` | Favorite currency pairs |
| `fx-rate-snapshots.json` | Rate history for analytics |
| `notification-logs.json` | Sent alert records |

Set `DATA_DIR` in `apps/api/.env` to use a custom location.

## Auth

Register at http://localhost:5173/register. When signed in, comparisons are saved to your history automatically.

### Phase 2 pages (requires auth)

| Page | URL |
|------|-----|
| Analytics | http://localhost:5173/analytics |
| Settings (alerts) | http://localhost:5173/settings |
| History search | http://localhost:5173/history |

## Environment variables

See `apps/api/.env.example` and `apps/web/.env.example`.

| Variable | Required | Purpose |
|----------|----------|---------|
| `JWT_ACCESS_SECRET` | Yes | Access token signing |
| `JWT_REFRESH_SECRET` | Yes | Refresh token hashing |
| `DATA_DIR` | No | Custom JSON storage path (default: `apps/api/data`) |
| `EXCHANGERATE_API_KEY` | No | FX rates (Frankfurter + static fallback) |
| `ETHERSCAN_API_KEY` | No | Gas fees (static fallback) |

## Phase status

**Phase 0** — complete  
**Phase 1** — comparison + auth + history (deploy deferred)  
**Phase 2** — analytics, PDF, notifications (~83%)
