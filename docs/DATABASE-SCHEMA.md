# Database Schema

**Database:** PostgreSQL 16  
**Migrations:** `apps/api/src/db/migrations/`

---

## Entity relationship overview

```
users
  ├── saved_currency_pairs
  ├── comparisons
  │     └── comparison_routes
  └── refresh_tokens (optional blacklist / rotation)
```

---

## Tables

### `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, default `gen_random_uuid()` | |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login identifier |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt hash |
| `name` | VARCHAR(255) | NOT NULL | Display name |
| `default_source_currency` | CHAR(3) | NOT NULL, default `'USD'` | ISO 4217 |
| `default_dest_currency` | CHAR(3) | NOT NULL, default `'INR'` | ISO 4217 |
| `notification_preferences` | JSONB | NOT NULL, default `'{}'` | Phase 2 alerts config |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` | |
| `updated_at` | TIMESTAMPTZ | NOT NULL, default `now()` | |

### `refresh_tokens`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → users, ON DELETE CASCADE | |
| `token_hash` | VARCHAR(255) | UNIQUE, NOT NULL | Hashed refresh token |
| `expires_at` | TIMESTAMPTZ | NOT NULL | |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` | |

### `saved_currency_pairs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → users, ON DELETE CASCADE | |
| `source_currency` | CHAR(3) | NOT NULL | |
| `dest_currency` | CHAR(3) | NOT NULL | |
| `source_country` | CHAR(2) | NULL | ISO 3166-1 alpha-2 |
| `dest_country` | CHAR(2) | NULL | |
| `label` | VARCHAR(100) | NULL | User-defined nickname |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` | |

**Unique:** `(user_id, source_currency, dest_currency, source_country, dest_country)`

### `comparisons`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → users, ON DELETE SET NULL, NULLABLE | Anonymous comparisons allowed later |
| `send_amount` | DECIMAL(18, 4) | NOT NULL | Amount in source currency |
| `source_currency` | CHAR(3) | NOT NULL | |
| `dest_currency` | CHAR(3) | NOT NULL | |
| `source_country` | CHAR(2) | NULL | Corridor |
| `dest_country` | CHAR(2) | NULL | |
| `priority` | VARCHAR(20) | NOT NULL | `cheapest` \| `fastest` \| `balanced` |
| `mid_market_rate` | DECIMAL(18, 8) | NOT NULL | FX at comparison time |
| `recommended_route_id` | VARCHAR(50) | NULL | Provider route identifier |
| `fx_rate_fetched_at` | TIMESTAMPTZ | NOT NULL | Data freshness |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` | |

### `comparison_routes`

Snapshot of each route at comparison time (for history & CSV export).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `comparison_id` | UUID | FK → comparisons, ON DELETE CASCADE | |
| `route_id` | VARCHAR(50) | NOT NULL | e.g. `wise`, `remitly`, `swift`, `usdc-ethereum` |
| `provider_name` | VARCHAR(100) | NOT NULL | Display name |
| `provider_type` | VARCHAR(30) | NOT NULL | `swift` \| `remittance` \| `stablecoin` \| `crypto` |
| `platform_fee` | DECIMAL(18, 4) | NOT NULL | |
| `fx_markup` | DECIMAL(18, 4) | NOT NULL | Cost of spread vs mid-market |
| `network_fee` | DECIMAL(18, 4) | NOT NULL, default `0` | Blockchain gas |
| `total_fee` | DECIMAL(18, 4) | NOT NULL | |
| `effective_rate` | DECIMAL(18, 8) | NOT NULL | |
| `amount_received` | DECIMAL(18, 4) | NOT NULL | In dest currency |
| `estimated_time_hours` | DECIMAL(8, 2) | NOT NULL | |
| `is_recommended` | BOOLEAN | NOT NULL, default `false` | |
| `rank` | SMALLINT | NOT NULL | 1 = best for selected priority |
| `explanation` | TEXT | NULL | Why recommended |

---

## Indexes

```sql
CREATE INDEX idx_comparisons_user_id_created_at ON comparisons (user_id, created_at DESC);
CREATE INDEX idx_comparison_routes_comparison_id ON comparison_routes (comparison_id);
CREATE INDEX idx_saved_pairs_user_id ON saved_currency_pairs (user_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
```

---

## Redis keys (not PostgreSQL)

| Key pattern | TTL | Purpose |
|-------------|-----|---------|
| `fx:rates:{base}` | 10 min | Cached FX rates from ExchangeRate-API |
| `crypto:price:{id}` | 5 min | CoinGecko prices |
| `gas:ethereum` | 2 min | Etherscan gas estimate |
| `session:blacklist:{jti}` | token TTL | Revoked JWT IDs |
