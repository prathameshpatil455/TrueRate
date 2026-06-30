# REST API Contract

**Base URL:** `/api/v1`  
**Format:** JSON  
**Auth:** Bearer JWT in `Authorization` header (protected routes)

---

## Conventions

| Item | Value |
|------|-------|
| Success envelope | `{ "data": T }` |
| Error envelope | `{ "error": { "code": string, "message": string } }` |
| Pagination | `?page=1&limit=20` → `{ "data": [], "meta": { "page", "limit", "total" } }` |
| Dates | ISO 8601 UTC strings |

### HTTP status codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Missing / invalid token |
| 403 | Forbidden |
| 404 | Not found |
| 429 | Rate limited |
| 500 | Server error |

---

## Health

### `GET /api/v1/health`

Public. No auth.

**Response 200**

```json
{
  "data": {
    "status": "ok",
    "version": "1.0.0",
    "services": {
      "database": "ok",
      "redis": "ok"
    }
  }
}
```

---

## Authentication

### `POST /api/v1/auth/register`

**Body**

```json
{
  "email": "user@example.com",
  "password": "securePassword1",
  "name": "Jane Doe"
}
```

**Response 201**

```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Jane Doe",
      "defaultSourceCurrency": "USD",
      "defaultDestCurrency": "INR"
    },
    "accessToken": "eyJ..."
  }
}
```

`refreshToken` set as httpOnly cookie `truerate_refresh`.

---

### `POST /api/v1/auth/login`

**Body:** `{ "email", "password" }`  
**Response 200:** Same shape as register.

---

### `POST /api/v1/auth/refresh`

Uses refresh cookie. Returns new `accessToken`.

---

### `POST /api/v1/auth/logout`

Protected. Clears refresh token.

---

## User profile

### `GET /api/v1/users/me`

Protected.

**Response 200**

```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "defaultSourceCurrency": "USD",
    "defaultDestCurrency": "INR",
    "notificationPreferences": {}
  }
}
```

---

### `PATCH /api/v1/users/me`

**Body (partial):** `{ "name", "defaultSourceCurrency", "defaultDestCurrency" }`

---

## Comparisons

### `POST /api/v1/comparisons`

Run a new comparison. Auth optional for MVP (if authenticated, saves to history).

**Body**

```json
{
  "sendAmount": 1000,
  "sourceCurrency": "USD",
  "destCurrency": "INR",
  "sourceCountry": "US",
  "destCountry": "IN",
  "priority": "balanced"
}
```

`priority`: `cheapest` | `fastest` | `balanced`

**Response 200**

```json
{
  "data": {
    "id": "uuid",
    "sendAmount": 1000,
    "sourceCurrency": "USD",
    "destCurrency": "INR",
    "midMarketRate": 83.12,
    "fxRateFetchedAt": "2026-06-30T12:00:00.000Z",
    "priority": "balanced",
    "disclaimer": "All figures are estimates for comparison only...",
    "routes": [
      {
        "routeId": "wise",
        "providerName": "Wise",
        "providerType": "remittance",
        "platformFee": 4.5,
        "fxMarkup": 8.2,
        "networkFee": 0,
        "totalFee": 12.7,
        "effectiveRate": 82.95,
        "amountReceived": 82950,
        "estimatedTimeHours": 24,
        "rank": 1,
        "isRecommended": true,
        "explanation": "Best balance of low total cost and fast settlement."
      }
    ],
    "recommendedRouteId": "wise"
  }
}
```

---

### `GET /api/v1/comparisons`

Protected. List user's comparison history.

**Query:** `page`, `limit`, `sourceCurrency`, `destCurrency`

---

### `GET /api/v1/comparisons/:id`

Protected. Single comparison with routes.

---

### `GET /api/v1/comparisons/:id/export/csv`

Protected. CSV download of comparison.

---

## Saved currency pairs

### `GET /api/v1/saved-pairs`

Protected. List favorites.

---

### `POST /api/v1/saved-pairs`

**Body**

```json
{
  "sourceCurrency": "USD",
  "destCurrency": "INR",
  "sourceCountry": "US",
  "destCountry": "IN",
  "label": "Family remittance"
}
```

---

### `DELETE /api/v1/saved-pairs/:id`

Protected.

---

## Reference data (public)

### `GET /api/v1/currencies`

Supported ISO 4217 codes for the comparison form.

### `GET /api/v1/corridors`

Supported country/currency corridor pairs for MVP.

---

## Rate limits

| Endpoint group | Limit |
|----------------|-------|
| Auth (`/auth/*`) | 10 req / 15 min / IP |
| Comparisons (`POST /comparisons`) | 30 req / 15 min / user or IP |
| Other authenticated | 100 req / 15 min / user |

---

## Phase 2 endpoints (planned)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/comparisons/search` | Full-text search history |
| GET | `/api/v1/analytics/savings` | Monthly savings summary |
| GET | `/api/v1/analytics/rates/:pair` | Historical rate data |
| POST | `/api/v1/notifications/preferences` | Alert thresholds |
