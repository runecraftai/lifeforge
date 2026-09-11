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
| `db`       | PocketBase v0.35.0 (pinned)       | **18090**         |
| `db-init`  | One-shot migration runner          | — (exits)         |
| `server`   | Express API on internal port 3636  | **13636**         |
| `client`   | Nginx SPA (proxies `/api/` → API)  | **15173**         |

Open **http://localhost:15173** in your browser.
PocketBase admin: **http://localhost:18090/_/**  
API base: **http://localhost:13636/**

## Switching host ports

Override any port via environment variables or a `.env` file in the repo root:

```bash
# In env/.env.docker (or a .env next to docker-compose.yaml):
PB_PORT=28090      # PocketBase
API_PORT=23636     # API server
WEB_PORT=25173     # Web client
```

## Using the real ports (8090 / 3636 / 5173)

The default ports are offset (18090, 13636, 15173) to avoid collisions with a
manually-started PocketBase or dev server. To use the production ports:

1. **Stop** any locally running PocketBase, API server, or Vite dev server first.
2. Set the ports in your env file:
   ```bash
   PB_PORT=8090
   API_PORT=3636
   WEB_PORT=5173
   ```
3. Start with `docker compose up --build`.

> This is a manual, deliberate step — never done automatically.

## Migrations

`db-init` runs once at startup, generates PocketBase migrations from the schema
files in `modules/` and `apps/api/src/`, and applies them to the database volume.
It exits after completion. Subsequent `docker compose up` skips re-running it
(db-init always runs, but PocketBase on the `db` service sees already-applied
migrations and does nothing).

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
| `PB_PORT`  | 18090   | PocketBase host port |
| `API_PORT` | 13636   | API server host port  |
| `WEB_PORT` | 15173   | Web client host port  |
