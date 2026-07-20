# SPEC.md — Personal OS

## 1. Overview

Personal OS is a fresh, fully hosted personal dashboard for Cecilia. It consolidates business and build operations into one app, accessible from any device. It is a new build. Do not port the layout, code, or contents of the old Mission Control kanban (rosie-second-brain). The Mac mini is not a dependency: the app, its data, and its API all live in the cloud. The Mac mini may optionally push data to the API later, but nothing breaks if it is off.

Product name everywhere in UI and code: **Personal OS**. Repo naming convention: lowercase-kebab (`personal-os`).

## 2. Layout (match the reference screenshot)

Dark theme app shell:

- **Left sidebar (fixed):** app logo + "Personal OS" wordmark at top; section label "TOOLS"; vertical nav list with icon + label per module; "Soon" pill badge on unbuilt modules; user avatar + version string pinned to bottom (e.g., "Personal OS · v0.1").
- **Main pane per module:** large module title, one-line subtitle under it, then a horizontal tab bar (e.g., Overview | [module tabs] | Settings) with an underline on the active tab.
- **Overview tab pattern:** a stat row (3 to 4 inline stats such as counts and "Last run: success 15 hours ago"), primary action buttons top-right (one outlined, one filled accent), an optional "Finish setup" checklist card, then a list of content cards. Each card: status pill (e.g., `draft`), bold title, date + one-line preview, and an "Open" button on the right.
- Rounded corners, subtle card borders, single accent color, generous spacing.
- Fully responsive. Sidebar collapses to a drawer or bottom nav on mobile. This is a hard requirement since access from phone is a primary use case.

Tech: React + Vite SPA, plain CSS or Tailwind (builder's choice), no Next.js required.

## 3. Modules

Build order is Phase 1 → 3. Modules not yet built still appear in the sidebar with a "Soon" badge.

### Phase 1

**Tasks**
- Fresh task system with a new schema. Do not import kanban.json.
- Tabs: Overview | Board | Settings.
- Board: columns `todo`, `inprogress`, `done` with drag and drop.
- Card fields: title, notes, tags (e.g., rosie-nj, rosie-al, clean-aios, build), created date, column.
- Overview stats: open tasks, in progress, completed this week.

**App shell + auth**
- Single-user auth: one password gate for the UI, plus a bearer API key for programmatic writes (for Zapier/n8n or future Mac mini pushes).
- Settings tab per module holds module config; a global Settings holds the API key display and rotation.

### Phase 2

**Weekly Pulse**
- Dashboard version of the Monday control-center report for Rosie Cleans.
- Cards: items needing a decision, escalations (refunds at or above threshold always escalate to Cecilia), VA highlights (Mylin: sales/leads, Elaine: ops/scheduling), inbox items needing a reply.
- Data arrives via POST from Zapier/n8n or Claude routines into `/api/pulse`. The app renders whatever is pushed; it does not scrape Slack or Gmail itself in v1.

**Lead Engine**
- Status view of Engines 1 through 7 with per-engine state (not started / building / live), lead counts, and a card list of leads awaiting human action (Nancy-filter escalations).
- Never use quote language anywhere in this module. Leads see pricing automatically; no quotes exist in this business.

### Phase 3 (sidebar "Soon" until built)

**Content Studio**
- Draft cards in the screenshot style: status pill, title, date, preview, Open.
- Tracks: Rosie Cleans blog posts (including the pricing philosophy post), Clean AiOS advisory content, and Re-Engage email sequence status. Always the word "advisory" for Clean AiOS, never "consulting."

**Automations**
- Registry of the 18 Zaps and their n8n migration status. Fields: name, platform (zapier/n8n), last run, last status, migration state.
- Populated by POSTs from the automations themselves (a final "report status" step) into `/api/automations/runs`.

**Deploys**
- Netlify site health: Field App and Personal OS itself. Last deploy time, build status. Pull via Netlify API using a personal access token stored as an env var.

**Morning Brief archive**
- Telegram delivery stays as is. The brief script additionally POSTs the rendered brief to `/api/briefs`; the module lists briefs by date and renders one as a page.

## 4. Architecture

- **Frontend:** React + Vite SPA, deployed on Netlify from GitHub. Claude Code is the sole builder; deploys go through Netlify.
- **Backend:** Railway. Node + Express (or Hono) with Postgres (Railway addon). All data lives here. No local JSON files as a source of truth.
- **Writers:** Zapier/n8n webhooks, Claude routines, and optionally Mac mini scripts, all authenticated with the bearer API key. The app must be fully functional with the Mac mini offline.
- **No Apps Script anywhere.**

## 5. API contract (v1)

All write endpoints require `Authorization: Bearer <API_KEY>`.

```
GET  /api/tasks                 list tasks
POST /api/tasks                 { title, notes?, tags?, column }   column: todo|inprogress|done
PATCH /api/tasks/:id            partial update (move, edit, tag)
DELETE /api/tasks/:id

POST /api/pulse                 { type: decision|escalation|highlight|inbox, source, title, body?, ts }
GET  /api/pulse?since=

GET  /api/leads/engines         engine 1-7 states
POST /api/leads/engines/:n      { state, note? }
POST /api/leads/escalations     { lead, reason, ts }

POST /api/automations/runs      { name, platform, status, ts, detail? }
GET  /api/automations

POST /api/briefs                { date, html|md }
GET  /api/briefs, GET /api/briefs/:date

POST /api/content               { title, status, channel, preview?, url? }
GET  /api/content
```

## 6. Environment variables

Frontend (Netlify): `VITE_API_BASE`.
Backend (Railway): `DATABASE_URL`, `API_KEY`, `UI_PASSWORD_HASH`, `NETLIFY_TOKEN` (Phase 3).

## 7. Definition of done per phase

- Phase 1: shell + sidebar + Tasks live at a Netlify URL, usable from phone, password protected, tasks persist in Railway Postgres.
- Phase 2: Pulse and Lead Engine render pushed data end to end from at least one real webhook.
- Phase 3: remaining modules lose their "Soon" badges one at a time.

## 8. Governance

- Spec-first: changes to scope get written here before code changes.
- Naming: lowercase-kebab for repo, files, and API routes.
- Brand rules apply in all UI copy: "advisory" for Clean AiOS, no quote language for Rosie Cleans, no rose emoji anywhere.
