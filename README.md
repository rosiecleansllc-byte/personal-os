# personal-os

Personal OS is a fully hosted personal dashboard. Phase 1 ships the app shell and the Tasks
module. See [SPEC.md](SPEC.md) for the full product spec.

## Live deployment

| Piece | URL |
| --- | --- |
| App (Netlify) | https://personal-os-cecilia.netlify.app |
| API (Railway) | https://personal-os-production-faff.up.railway.app |

## Repo layout

| Path | What it is | Deploys to |
| --- | --- | --- |
| `web/` | React + Vite SPA (the dashboard UI) | Netlify |
| `server/` | Node + Express API with Postgres | Railway |

## Frontend (`web/`)

```bash
cd web
npm install
npm run dev
```

Environment variables (see `web/.env.example`):

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE` | Base URL of the Railway API, e.g. `https://personal-os-api.up.railway.app` |

Netlify builds from this repo using `netlify.toml` (base `web`, command `npm run build`,
publish `dist`, SPA redirect included).

## Backend (`server/`)

```bash
cd server
npm install
npm start
```

Environment variables (see `server/.env.example`):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (added automatically by the Railway Postgres addon) |
| `API_KEY` | Bearer key for programmatic writes (Zapier, n8n, routines) |
| `UI_PASSWORD_HASH` | Output of `npm run hash-password -- "your-password"` |
| `DATABASE_SSL` | `true` only if the connection string requires SSL (not needed for Railway internal URLs) |

The schema migrates itself on boot. All `/api/tasks` endpoints require
`Authorization: Bearer <token>` where the token is either the `API_KEY` or a session token
issued by `POST /api/auth/login` (the UI password gate).

### API (Phase 1)

```
GET    /api/health
POST   /api/auth/login          { password } -> { token, expiresAt }
GET    /api/tasks
POST   /api/tasks               { title, notes?, tags?, column }   column: todo|inprogress|done
PATCH  /api/tasks/:id           partial update (move, edit, tag)
DELETE /api/tasks/:id
```

## Deploy checklist

1. **Railway:** create a service from this repo with root directory `server`, attach the
   Postgres addon, set `API_KEY` and `UI_PASSWORD_HASH`. Generate a public domain for the
   service.
2. **Netlify:** create a site from this repo (settings come from `netlify.toml`), set
   `VITE_API_BASE` to the Railway domain, deploy.
3. Open the Netlify URL, enter the UI password, add a task, confirm it persists.
