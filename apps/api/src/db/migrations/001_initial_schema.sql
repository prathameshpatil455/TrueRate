CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  default_source_currency CHAR(3) NOT NULL DEFAULT 'USD',
  default_dest_currency CHAR(3) NOT NULL DEFAULT 'INR',
  notification_preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE saved_currency_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_currency CHAR(3) NOT NULL,
  dest_currency CHAR(3) NOT NULL,
  source_country CHAR(2),
  dest_country CHAR(2),
  label VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, source_currency, dest_currency, source_country, dest_country)
);

CREATE TABLE comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  send_amount DECIMAL(18, 4) NOT NULL,
  source_currency CHAR(3) NOT NULL,
  dest_currency CHAR(3) NOT NULL,
  source_country CHAR(2),
  dest_country CHAR(2),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('cheapest', 'fastest', 'balanced')),
  mid_market_rate DECIMAL(18, 8) NOT NULL,
  recommended_route_id VARCHAR(50),
  fx_rate_fetched_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE comparison_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_id UUID NOT NULL REFERENCES comparisons(id) ON DELETE CASCADE,
  route_id VARCHAR(50) NOT NULL,
  provider_name VARCHAR(100) NOT NULL,
  provider_type VARCHAR(30) NOT NULL CHECK (provider_type IN ('swift', 'remittance', 'stablecoin', 'crypto')),
  platform_fee DECIMAL(18, 4) NOT NULL,
  fx_markup DECIMAL(18, 4) NOT NULL,
  network_fee DECIMAL(18, 4) NOT NULL DEFAULT 0,
  total_fee DECIMAL(18, 4) NOT NULL,
  effective_rate DECIMAL(18, 8) NOT NULL,
  amount_received DECIMAL(18, 4) NOT NULL,
  estimated_time_hours DECIMAL(8, 2) NOT NULL,
  is_recommended BOOLEAN NOT NULL DEFAULT false,
  rank SMALLINT NOT NULL,
  explanation TEXT
);

CREATE INDEX idx_comparisons_user_id_created_at ON comparisons (user_id, created_at DESC);
CREATE INDEX idx_comparison_routes_comparison_id ON comparison_routes (comparison_id);
CREATE INDEX idx_saved_pairs_user_id ON saved_currency_pairs (user_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
