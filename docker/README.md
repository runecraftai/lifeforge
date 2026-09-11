# LifeForge – Docker Compose (local)

One command to bring up PocketBase, the API, and the web frontend locally.

## Quick start

```bash
# 1. Create your environment file (edit credentials!)
cp env/.env.docker.example env/.env.docker

# 2. Build and start everything
docker compose up --build

# 3. Tear down (including the database volume)
docker compose down -v
```

## What runs

| Service    | Description                        | Default host port |
|------------|------------------------------------|-------------------|
| `db`       | PocketBase v0.35.0 (pinned)       | **8090**          |
| `db-init`  | One-shot migration runner          | — (exits)         |
| `server`   | Express API on internal port 3636  | **3636**          |
| `client`   | Nginx SPA (proxies `/api/` → API)  | **5173**          |

Open **http://localhost:5173** in your browser.
PocketBase admin: **http://localhost:8090/_/**
API base: **http://localhost:3636/**

## Switching host ports

Override any port via environment variables or a `.env` file in the repo root:

```bash
# Set host-port overrides on the compose command (or in a root .env file):
PB_PORT=28090 API_PORT=23636 WEB_PORT=25173 docker compose up --build
```

## Alternate host ports for testing

The default host ports are 8090, 3636, and 5173. To avoid a collision with
another local process during testing, override any of them in your env file:

```bash
PB_PORT=18090
API_PORT=13636
WEB_PORT=15173
docker compose up --build
```

Stop any manually-started PocketBase, API, or Vite process before using the
default ports. In particular, an old manually-started PocketBase conflicts on
port 8090.

## Migrations

`db-init` runs as the explicit one-shot migration step, generates PocketBase
migrations from the schema files in `modules/` and `apps/api/src/`, and applies
them to the database volume. It exits after completion. After that step, start
the API and frontend with `docker compose up -d server client`. Re-running the
one-shot step is safe because already-applied migrations are skipped.

## Volumes

| Volume             | Container path     | Purpose                    |
|--------------------|--------------------|----------------------------|
| `lifeforge-pb-data`| `/pb_data`         | PocketBase data + migrations |

Modules are bind-mounted from the host (`./modules` → container), so code
changes are reflected immediately after an API server restart.

## Environment variables

Required (in `env/.env.docker`):

| Variable      | Description                           |
|---------------|---------------------------------------|
| `PB_EMAIL`    | PocketBase superuser email            |
| `PB_PASSWORD` | PocketBase superuser password (≥8)    |
| `MASTER_KEY`  | PocketBase master key (≥16)           |

Optional:

| Variable   | Default | Description        |
|------------|---------|--------------------|
| `PB_PORT`  | 8090    | PocketBase host port |
| `API_PORT` | 3636    | API server host port  |
| `WEB_PORT` | 5173    | Web client host port  |
