# Local database

PostgreSQL for auth, comparison history, and saved currency pairs.

## Start

From the project root:

```bash
npm run db:up
npm run db:migrate
```

Data is stored in `infra/data/postgres/` (gitignored, lives on your machine inside the repo folder).

## Stop

```bash
npm run db:down
```

## Connection

```
postgresql://truerate:truerate_dev@localhost:5432/truerate
```

Set as `DATABASE_URL` in `apps/api/.env`.

## Reset database

```bash
npm run db:reset
```
