# Isolated LifeForge fixture

This fixture runs PocketBase, the API, and the Vite web client on ports separate from the normal local services. It uses only synthetic credentials and a fresh PocketBase data directory.

## Ports

| Service    |  Port |
| ---------- | ----: |
| PocketBase | 18090 |
| API        | 13636 |
| Web        | 15173 |

The normal LifeForge ports remain 8090, 3636, and 5173.

## Usage

From the repository root:

```sh
bash tools/architecture/fixtures/start.sh
bash tools/architecture/fixtures/stop.sh
```

The fixture web client is available at `http://localhost:15173`. PocketBase health is available at `http://localhost:18090/api/health`. API liveness is checked at `http://localhost:13636/`, the exposed welcome route; the API does not provide `/api/health`.

`fixture.env` contains synthetic local-only credentials. Do not replace them with real credentials or point the fixture at an application data directory.

The generated PocketBase data, process IDs, and service logs are ignored by the fixture's `.gitignore`.

On machines where the normal services already occupy 8090, 3636, and 5173, isolation is verified by confirming the fixture binds only 18090, 13636, and 15173, responds on those ports while running, and releases them after `stop.sh`. The normal services remain running and untouched.
