# Administrators Guide

For the people who deploy, host and look after the Timebars Ltd. apps (Agilebars, Timebars,
Costbars). End users do not need this guide.

> **This file is public.** Everything in `docsHelp/` is copied into the web image and can be read
> at `/docsHelp/…`. Never add IP addresses, tokens, passwords or API keys here. Keep those in your
> password manager and on the servers only.

Last updated: 2 October 2026.

---

## Contents

1. [How the platform fits together](#1-how-the-platform-fits-together)
2. [Sites and hostnames](#2-sites-and-hostnames)
3. [The two app containers](#3-the-two-app-containers)
4. [Releasing a new version](#4-releasing-a-new-version)
5. [Setting up a box (dev or prod)](#5-setting-up-a-box-dev-or-prod)
6. [Cloudflare Tunnel](#6-cloudflare-tunnel)
7. [Offline mode](#7-offline-mode)
8. [Local development](#8-local-development)
9. [Secrets and security rules](#9-secrets-and-security-rules)
10. [Licensing, tiers and administrators](#10-licensing-tiers-and-administrators)
11. [OpenProject connection](#11-openproject-connection)
12. [Troubleshooting](#12-troubleshooting)
13. [Known issues and follow-ups](#13-known-issues-and-follow-ups)
14. [Change history](#14-change-history)
15. [Building the offline version in your repo](#15-building-the-offline-version-in-your-repo)
16. [Air-gapped customers (no internet, secure LAN)](#16-air-gapped-customers-no-internet-secure-lan)
17. [Docker configuration and customer setup](#17-docker-configuration-and-customer-setup)
18. [Handover by purchase option](#18-handover-by-purchase-option)
19. [Third-party services: set-up notes](#19-third-party-services-set-up-notes)
20. [To do: details still to be added](#20-to-do-details-still-to-be-added)

---

## 1. How the platform fits together

| Part | What it is | Where it runs |
|---|---|---|
| **App (tbrun)** | The single-page app for all three products. Plans, bars, reports and forms run entirely in the browser. | nginx container serving static files |
| **Browser database** | All project data lives in the browser's IndexedDB, per address (origin). | The user's browser |
| **Backend (Strapi, "be2")** | Login, licences (orders/products), cloud publishing (pubsets), user records. | Separate container / service |
| **Sales and dashboards site (tbwww)** | Sales, sign-up, Personal and Enterprise dashboards. | Separate container / service |
| **Database** | PostgreSQL for Strapi (public image). | Container or managed service |
| **OpenProject** | Optional sync partner (Tier-3). | Separate service |
| **Ask AI workers** | Six Cloudflare Workers that call Google Gemini (section 19.5). Being replaced by an AI service in tbwww (section 19.5). | Cloudflare Workers |
| **Notifications** | Push alerts via Pushover, SMS via Twilio. Run by tbwww plus a cron job. | tbwww container + host cron |
| **Email** | Registration and account email sent by Strapi via SendGrid. | SendGrid (external) |
| **Payments** | Licence purchases on the sales site via Stripe, recorded in Strapi. | Stripe (external) |
| **Cloudflare** | DNS, HTTPS certificates and the tunnel to the servers. | Cloudflare |
| **Optional samples** | `helpapp` (help app, Next.js + Gemini) and `nwi` (customer portal). | Own containers |

Key point: **the app container only serves files.** It holds no data and needs no database.
The product (AB / TB / CB) is chosen in the browser from the address the user opened.

---

## 2. Sites and hostnames

Every address the app answers on is listed in **one** place: `scripts/config/sites.js` (`SITES`).
The app reads the hostname, looks it up there, and sets the product, logo, title and demo data.

| Host | Product | Container | Offline mode |
|---|---|---|---|
| `agile.timebars.com` | Agilebars | offline | yes |
| `pmrm.timebars.com` | Timebars | offline | yes |
| `ppm.timebars.com` | Costbars | offline | yes |
| `agiles.timebars.com` | Agilebars (staging) | offline | yes |
| `pmrms.timebars.com` | Timebars (staging) | offline | yes |
| `ppms.timebars.com` | Costbars (staging) | offline | yes |
| `ab.timebars.com` | Agilebars | legacy | no |
| `tb.timebars.com` | Timebars | legacy | no |
| `cb.timebars.com` | Costbars | legacy | no |
| `abs.timebars.com` | Agilebars (staging) | legacy | no |
| `tbs.timebars.com` | Timebars (staging) | legacy | no |
| `cbs.timebars.com` | Costbars (staging) | legacy | no |
| `timebars.com` | Timebars | legacy | no |
| `agile.rlan.ca`, `pmrm.rlan.ca`, `ppm.rlan.ca` | AB / TB / CB (mock production, home lab) | offline | yes |
| `ab.rlan.ca`, `tb.rlan.ca`, `cb.rlan.ca` | AB / TB / CB (home lab) | legacy | no |

`PRODUCT_PUBLIC_HOST` in the same file is the address shown to users in links and messages
(currently `ab` / `tb` / `cb.timebars.com`).

### Adding, renaming or retiring an address

1. **Code:** add, edit or remove the row in `scripts/config/sites.js`. Set `offline: true` only for
   addresses served by the offline container. **No hostname may be written anywhere else in the code.**
2. **Release** the image(s) that serve it (section 4).
3. **Cloudflare:** add the DNS record / tunnel *Published application* for the host (section 6).
4. **Strapi CORS:** add `https://<host>` to the backend's CORS allowlist, or login and publishing
   fail from that address. Everything else works without it.

### Customer addresses without a rebuild: `runtime-config.json`

One image serves every customer. A customer mounts their own `runtime-config.json` next to
`index.html`; the app reads it once at start-up, **before** the browser database opens, and it
replaces the built-in Timebars Ltd. values:

| Key | Replaces | Example |
|---|---|---|
| `apiUrl` | `API_URL` (their Strapi) | `https://be2.example.com/api` |
| `wwwUrl` | `WWW_URL` (their website / dashboards) | `https://www.example.com` |
| `opUrl` | `OP_URL` (their OpenProject; a user's Publishing-page setting still wins) | `https://op.example.com` |
| `sites` | extra rows for `SITES` (same shape; listed first, so they win) | `{ "host": "pm.example.com", "product": "TB", "offline": true }` |
| `productPublicHost` | the addresses shown to users | `{ "AB": "...", "TB": "...", "CB": "..." }` |

Mount it read-only in the app's compose file:
```yaml
    volumes:
      - ./runtime-config.json:/usr/share/nginx/html/runtime-config.json:ro
```
Template: `scripts/config/runtime-config.example.json`. Code: `scripts/config/runtimeConfig.js`.
No file, or a file that is not valid JSON, means the built-in defaults (the console says which).
Rows with an empty host or a product other than AB / TB / CB are ignored. The offline worker fetches
the file network-first and keeps the last good copy, so offline reloads keep the customer's
settings; a changed file applies on the next online load. Timebars Ltd.'s own servers run without it.

### Moving users to a new address

Each address has its own browser database, so work does not follow a user to a new address
automatically. Users move with **spreadsheet sync** or **Start → Data Actions → Make Backup**, then
load it on the new address (see the Data Synchronization, Backup and Recovery guide).

---

## 3. The two app containers

Both are built from the **same Dockerfile**. A build argument decides which one you get.

| | Legacy | Offline |
|---|---|---|
| Image | `jimecox807/tbrun:latest` (or another tag) | `jimecox807/tbrun:offline-<tag>` (e.g. `offline-v1`) |
| Built by (locally) | `./deploy-push-to-hub-secure.sh` | `./deploy-push-offline.sh` |
| Build argument | `ENABLE_SW=false` (default) | `ENABLE_SW=true` |
| Service worker | none (ships a self-destruct `sw.js` nothing registers) | yes |
| Serves | ab / tb / cb, abs / tbs / cbs, timebars.com, rlan.ca | agile / pmrm / ppm, agiles / pmrms / ppms |
| Container name | `tbrun` | `tbrun-offline` |
| Host port → container | **8686** → 80 | **8687** → 80 |
| Folder on each box | `tbrun` | `tbrunoffline` |
| Box files from repo | `deploy/vm/tbrun/` | `scripts/offline/` (`docker-compose.offline.yml`, `vm-deploy.sh`) |
| Tag stored in | `tbrun/.env` → `TBRUN_TAG=latest` | `tbrunoffline/.env` → `OFFLINE_TAG=offline-v1` |

### Folders on the boxes

| Box | Legacy | Offline |
|---|---|---|
| Dev | `/docker/compose/tbrun` | `/docker/compose/tbrunoffline` |
| Prod | `~/docker/tbrun` | `~/docker/tbrunoffline` |

Each folder holds `docker-compose.yml`, `deploy.sh` and a `.env` that `deploy.sh` writes (the
tag only — no secrets).

### Safety rules built into the scripts

- `deploy-push-offline.sh` only pushes `offline-*` tags and refuses `latest`, so the legacy
  container can never pick up the offline image. It checks the image contains the offline worker
  before pushing.
- The legacy `deploy.sh` refuses `offline-*` tags and warns if port 8686 serves the offline worker.
- The offline `deploy.sh` refuses `latest` and checks port 8687 serves the offline worker.

---

## 4. Releasing a new version

Build and push on your development machine, then deploy on each box.

### Legacy (ab / tb / cb …)

```bash
# local machine, repo on main
./deploy-push-to-hub-secure.sh          # Enter = latest
# each box
cd <box folder>/tbrun && ./deploy.sh    # Enter = latest
```
Expect: `OK: jimecox807/tbrun:latest is serving the legacy app on port 8686.`

### Offline (agile / pmrm / ppm …)

```bash
# local machine
./deploy-push-offline.sh                # e.g. v2  -> pushes offline-v2
# each box
cd <box folder>/tbrunoffline && ./deploy.sh   # enter v2
```
Expect: `OK: jimecox807/tbrun:offline-v2 is serving the offline worker on port 8687.`

Use a new tag for every offline release (`v1`, `v2`, …) so you can go back to the previous one.
Users get the new version on their next online visit.

### Rolling back

- **Offline:** run `./deploy.sh` in `tbrunoffline` and enter the previous tag.
- **Legacy:** push the previous build under a tag (e.g. `2026-09-29`) and deploy that tag, or
  rebuild the previous commit and push `latest` again.

### Before every release

- `npm run build` passes locally.
- The Docker login on your machine is current (`docker login -u jimecox807`).

---

## 5. Setting up a box (dev or prod)

### Once per box

1. **Docker Hub login** (the PAT is pasted once and kept by Docker — never written in a script):
   ```bash
   docker logout && docker login -u jimecox807
   ```
2. **Folders owned by your user**, not root. If a folder was created with `sudo`:
   ```bash
   sudo chown -R $USER: <folder>
   ```
3. **Docker without sudo** (optional): `sudo usermod -aG docker $USER`, then log out and in.

### Creating the app folders

Copy the two files from the repo into the folder, named as below, and make the script executable:

| Folder | `docker-compose.yml` from | `deploy.sh` from |
|---|---|---|
| `tbrun` | `deploy/vm/tbrun/docker-compose.yml` | `deploy/vm/tbrun/deploy.sh` |
| `tbrunoffline` | `scripts/offline/docker-compose.offline.yml` | `scripts/offline/vm-deploy.sh` |

```bash
chmod 700 deploy.sh && chmod 644 docker-compose.yml
./deploy.sh
```

### Notes

- The legacy compose file keeps the external Docker network `postgres_tbpg_net` with its static
  address as it always had. The app does not need it; it can be removed later if nothing uses it.
- `docker compose up -d` (no script) restarts with the tag stored in `.env`.
- How Docker itself is installed and where it keeps its data differs per box: see section 17.
- Shell start folder: to open terminals in the compose folder, put `cd /docker/compose` (dev) in
  `~/.bashrc`.

---

## 6. Cloudflare Tunnel

The boxes are reached through a **Cloudflare Tunnel**. `cloudflared` runs as its own Docker
container on each box, in its own folder with a compose file.

### Published applications

In Cloudflare Zero Trust → Networks → Tunnels → *your tunnel* → Public hostnames, each host points
at the box and the container's host port:

| Hosts | Service |
|---|---|
| legacy hosts (section 2) | `http://<box address>:8686` |
| offline hosts (section 2) | `http://<box address>:8687` |

- Records are **proxied**: Cloudflare serves HTTPS with its own certificate. No certificate is
  needed on the box. (The offline service worker requires HTTPS — this satisfies it.)
- `cloudflared` runs in Docker, so `localhost` inside it is the tunnel container, **not** the box.
  Use the box address (or, later, a shared Docker network and the container name).
- Do not add a "Cache Everything" rule for app hosts. Keep Rocket Loader off for them.

### Keeping cloudflared up to date

The image tag `latest` only updates when pulled. In the cloudflared folder:
```bash
docker compose pull && docker compose up -d && docker logs --tail 20 cloudflare
```
`--no-autoupdate` in the command is correct for Docker. The "Unsupported version" warning in the
Cloudflare dashboard clears after the update.

### The tunnel token

The token is a credential. Keep it in a `.env` file next to the cloudflared compose file
(`TUNNEL_TOKEN=…`, `chmod 600`) and reference it as `TUNNEL_TOKEN=${TUNNEL_TOKEN}` in the compose
`environment:`, with `command: tunnel --no-autoupdate run`. If it is ever exposed, refresh it in
Zero Trust (Tunnels → your tunnel → Refresh token).

### Firewall

Ports 8686 and 8687 only need to be reachable by `cloudflared`. If nothing outside the box needs
them, keep them closed in the cloud firewall so nobody can reach the app around Cloudflare.

---

## 7. Offline mode

Offline mode lets the app load and reload with no network (F5, Home and the logo work offline).
User-facing description and security notes: `docsHelp/Common_13_Offline_Mode_And_Security.md`.
Technical details: `scripts/offline/README.md`.

### When it is on

Only when **both** are true:
1. the image was built with `ENABLE_SW=true` (only `deploy-push-offline.sh` does this), and
2. the host has `offline: true` in `sites.js`.

### What is and is not cached

- Cached: the app's own files (code, styles, fonts, icons, images) and help documents once opened.
- Never cached: other servers (Strapi, OpenProject, login), `/api`, tokens, project data.
- No push notifications, no background sync.

### Checking it works

On an offline host, DevTools → Application → Service Workers shows `sw.js` *activated*. Tick
**Offline** in the Network tab and press F5 — the app still loads.

### Turning it off

| How | Effect |
|---|---|
| Stop releasing offline images | Legacy hosts are never affected anyway. |
| Run a normal image in the offline container: set `OFFLINE_TAG=latest` in `tbrunoffline/.env`, `docker compose up -d` | Browsers remove the worker and its cache on their next online visit. |
| Remove the code | `git revert -m 1 <R1 merge commit>` (see `scripts/offline/README.md`). |

To clear one browser: DevTools → Application → Storage → **Clear site data**. This also clears that
browser's project data for the address — make a backup first.

---

## 8. Local development

```bash
npm install
npm run dev        # http://localhost:1234
npm run build      # production build into dist/
```

`.env` in the repo root (git-ignored, **no secrets**):

```
DEV_SITE=tbs.timebars.com          # which site localhost behaves as (any host in sites.js)
API_URL=https://be2.timebars.com/api
WWW_URL=...
APP_VERSION=...
```

- `DEV_SITE` picks the product, branding and demo data on localhost. The older `RUN_URL` still
  works when `DEV_SITE` is not set, but its host must be in `sites.js` (the `.timebars.app` hosts
  were removed).
- After changing `.env`, restart the dev server and clear the site data in DevTools so demo data
  reloads.
- `npm run dev` has no `sw.js`; to try offline mode locally follow `scripts/offline/README.md`.
- Node version: see `.nvmrc` (22). The Dockerfile builds with the same major version.

---

## 9. Secrets and security rules

| Rule | Why |
|---|---|
| **No secrets in browser code or in `.env` values the app reads.** Only public URLs and version strings go in `scripts/config/keys.js`. | Parcel copies every `process.env.X` the code reads into the public JavaScript bundle. |
| **Env files are never committed.** `.gitignore` ignores `.env`, `.env.*`, `.envdev`, `.envProdDevBK`; `.dockerignore` keeps them out of the image build (except `.env`, which must hold no secrets). | Git history keeps everything forever. |
| **Docker Hub PAT:** only via `docker login` on each machine. | No PAT in scripts, notes or `.env`. |
| **Strapi admin / API tokens:** server side only (Strapi or tbwww server code). In tbwww never use a `NEXT_PUBLIC_` name for a secret. | `NEXT_PUBLIC_` values are sent to the browser. |
| **Cloudflare tunnel token:** `.env` next to the cloudflared compose file, `chmod 600`. | It lets anyone run your tunnel. |
| **No third-party runtime loads:** all libraries, fonts and icons are bundled. | Offline use and security reviews. |

### If a secret is exposed

1. Revoke / rotate it at the source (Docker Hub, Strapi → API Tokens, Cloudflare tunnel token).
2. Update the one place it is stored (Docker login, server env, tunnel `.env`).
3. Removing it from git history is optional once rotated.

### History

In September 2026 the browser-side "Sync Users" feature was removed because it shipped a Strapi
full-access token in the app bundle; the replacement plan is in
`docsOtherNew/Plan_How_To_Maintain_RBAC_From_ResPool.md`.

---

## 10. Licensing, tiers and administrators

- Licences come from Strapi **orders** and **products**. At login the app reads the user's active
  order and stores the product code, owner, expiry and limits in the browser's admin panel.
- Limits are data in Strapi `products` (text fields): `qty_bars`, `qty_backlogs`, `qty_pubsets`,
  plus spreadsheets and training. Empty or "Un-limited" bars/backlogs = unlimited; pubsets,
  spreadsheets and training empty = 0. A word instead of a number is treated as 99 and logged in
  red — fix it in Strapi.
- **Tier** = the digit in the product code (`xxT01`, `xxT02`, `xxT03`):
  - Tier-1 (`qty_pubsets` = 0): every Publish entry point is hidden.
  - Tier-3: the OpenProject tab on the Publishing page is available.
- Each cloud login re-reads the licence and tops the user's pubsets up to `qty_pubsets` (first one
  active, extras inactive; never deletes).
- **Administrator** (customer side) = the logged-in email's resource-pool row has Primary Role
  `Administrator` (any casing) and a Customer ID. Administrators see every pubset for that
  Customer ID on the Bulk Update and Re-Publish tabs.
- Licence URL check: a licensed product used on another product's address shows a "URL mismatch"
  message naming the right address.

Strapi-side details and open items: `docsOtherNew/Licensing_Strapi_And_www_Handover.md`.

### 10.1 Licences and users, with or without Strapi

The app talks to Strapi for only three things: login (`/auth/local`), the licence (`/orders`) and
publishing (`/timebars`). At login the active order is copied into the browser's admin panel
(`apTbProduct`, `apT2` owner, `apT3` expiry, `apCustomerID`, `apQty*`, `apLicQtyLoaded`). Every
licence check after that is local and reads only those fields.

**With Strapi (standard).** For each user the customer's administrator:
1. creates the user in Strapi (or the user signs up on tbwww; confirmation email via SendGrid or
   the customer's mail server);
2. creates an **order**: owner = the user's email, the product, `active_status` on, `expires_on`;
3. keeps the `products` rows (limits) correct (section 10).

The user logs in once per browser and address; the licence refreshes on each cloud login. Renew
by changing `expires_on`, revoke by turning `active_status` off.

**Without Strapi (licence by email) — being built.** The issuer emails each user a licence file;
the user imports it on the Show License dialog and the app writes the same admin panel fields.
No login, publishing, dashboards or notifications — plans are shared as spreadsheets and backup
files. Who issues the file:

| Option | Issuer | File |
|---|---|---|
| B — containers | Timebars Ltd. | signed; the image checks the signature |
| C — own the code | the customer | their choice: plain file, own signature, a fixed licence written at start-up, or no licence checks |
| D — service provider | the customer, to their customers | normally Strapi + Stripe instead |

Note for Option B: whoever runs Strapi can create orders, so a customer running their own `tbbe`
controls their own licences. Treat an Option B purchase as a licence for the whole organisation.

Full study and the code changes needed: `docsOtherNew/Study_Licensing_With_And_Without_Strapi.md`
(internal).

---

## 11. OpenProject connection

- Default instance: `https://op.timebars.com`, built into the app.
- A different instance can be set per browser on the **OpenProject tab of the Publishing page**
  (stored as `apOpUrl`); that value wins over the built-in default. No rebuild needed.
- OpenProject sync is Tier-3 only (section 10).

---

## 12. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `docker build` / `pull`: `unauthorized: incorrect username or password` | Docker still holds a revoked PAT | `docker logout && docker login -u jimecox807` with the new PAT |
| Warning `docker-credential-gcloud … not found` | `~/.docker/config.json` refers to the Google Cloud helper | Install the Google Cloud SDK, or remove that entry from `credHelpers` |
| `Permission denied` writing files in a box folder | Folder owned by root | `sudo chown -R $USER: <folder>` |
| `sudo: 'cd': command not found` | `cd` is a shell built-in | Put `sudo` on the command that needs it, not on `cd` |
| `permission denied … /var/run/docker.sock` | User not in the `docker` group | `sudo ./deploy.sh`, or `sudo usermod -aG docker $USER` and log in again |
| Compose: `env file … not found` | Old compose file with `env_file: .env` and no `.env` | Use the compose files from the repo (no `env_file`) |
| New host shows the wrong product or "unknown" | Host missing from `sites.js` | Add the row, release, redeploy |
| Login / publish fails only on a new host | Strapi CORS | Add `https://<host>` to Strapi's CORS allowlist |
| Offline host: no service worker | Not HTTPS, legacy image in the offline container, or host lacks `offline: true` | Check the tunnel/proxied record, `tbrunoffline/.env`, `sites.js` |
| Legacy `deploy.sh` warns it serves the offline worker | Offline image deployed to `tbrun` | Redeploy `latest` in `tbrun` |
| Cloudflare dashboard: tunnel "Unsupported" | Old `cloudflared` image | `docker compose pull && docker compose up -d` in the cloudflared folder |
| Page reload fails with no network on a legacy host | Expected — legacy hosts have no offline mode | Use the Refresh button in the top menu, or the offline hosts |

---

## 13. Known issues and follow-ups

- **`PRODUCT_PUBLIC_HOST`** still names the legacy `ab` / `tb` / `cb` addresses. Switch it to the
  new addresses when they become the main ones.
- **Tighter tunnel networking:** put `cloudflared` and the app containers on one Docker network,
  point the tunnel at container names, and drop the published ports.
- **Legacy compose network:** remove `postgres_tbpg_net` from the tbrun compose file once confirmed
  unused.
- **User / role sync to Strapi:** to be rebuilt server side — see
  `docsOtherNew/Plan_How_To_Maintain_RBAC_From_ResPool.md`.
- This guide is public; keep infrastructure specifics (addresses, tokens) out of it.
- **Licensing without Strapi:** with no route to Strapi the app never loads a licence, so it shows
  "Unlicensed" and hides the product title (limits are not enforced). Needs licence-file import
  (sections 10.1 and 16.6).
- **Customer hostnames:** resolved for the app (October 2026) — a customer's `runtime-config.json`
  supplies their hosts and backend address without a rebuild (section 2). tbwww and Strapi still
  need the same treatment (section 20.2, item 4).
- **AI worker addresses are hard-coded** in `scripts/ai/aiCreateConfig.js`, `scripts/ai/askHelp.js`
  and `scripts/ai/timebars-gemini-bcase.js`, so a container customer (Option B) uses Timebars
  Ltd.'s workers and Gemini key. Resolved by the planned AI move to tbwww (section 19.5).
- **AI workers are open:** each worker answers any origin (`Access-Control-Allow-Origin: *`) with
  no authentication, so anyone who finds the URL can spend the Gemini quota. Until the move to
  tbwww, restrict the allowed origins to the app hosts and add a Cloudflare rate limit. The tbwww
  replacement must check the user's login before calling Gemini.
- **tbwww secrets under `NEXT_PUBLIC_` names (found October 2026):** the tbwww environment held the
  Strapi full-access token, the SendGrid key and a Google API key as `NEXT_PUBLIC_*` variables.
  Next.js copies those into browser JavaScript wherever client code uses them. Rotate them, move them
  to server-only names used only in API routes, rebuild tbwww. Rule (section 9): a secret never
  has a `NEXT_PUBLIC_` name.
- **Twilio route has no auth check** (`/api/notifications/twilio` in tbwww) — see the Text
  Notifications guide. Add a bearer-token check before it is reachable from outside.
- **Sales-site links are hard-coded** to `www.timebars.com` in `index.html` and
  `scripts/tbhtmlcomponents.js` (pricing, knowledge base, spreadsheet downloads). Customers who
  run their own site must change them; better to read them from `WWW_URL`.

---

## 14. Change history

### September 2026 — offline mode, new addresses, security clean-up

| Phase | Change | Main files |
|---|---|---|
| K1 | Removed browser-side Sync Users (it exposed a Strapi admin token); env files untracked; Dockerfile on Node 22 | `scripts/tbloginpublish.js`, `.gitignore`, `.dockerignore`, `Dockerfile`, `docsOtherNew/Plan_How_To_Maintain_RBAC_From_ResPool.md` |
| K1b | Docker Hub credentials removed from the repo; push script uses the saved login | `deploy-push-to-hub-secure.sh` |
| K3 | No CDN loads: Material Icons, Chart.js 4.4.1 and luxon bundled | `index.html`, `index.js`, `scripts/config/vendorGlobals.js`, `css/tbapp.css`, `package.json` |
| K4 | One sites table for every hostname; `DEV_SITE` for local dev | `scripts/config/sites.js`, `scripts/loadtimebarapp.js`, `scripts/tbdatabase.js`, `scripts/tbhtmlcomponents.js`, `scripts/tbLicenseTrimming.js` |
| Fix | OpenProject tab panel no longer shows under every Publishing tab (Tier-3) | `scripts/tbLicenseTrimming.js` |
| R1 | Offline mode (service worker), offline container, VM deploy scripts | `scripts/offline/*`, `deploy-push-offline.sh`, `Dockerfile`, `scripts/config/keys.js`, `scripts/config/sites.js`, `docsHelp/Common_13_Offline_Mode_And_Security.md` |
| Ops | Legacy box folder uses `deploy.sh` + tag in `.env` (replaces `deploystg.sh`) | `deploy/vm/tbrun/*` |
| Sites | New production and staging hosts (agile/pmrm/ppm, agiles/pmrms/ppms, abs/tbs/cbs) | `scripts/config/sites.js` |
| Docs | Added section 17, Docker configuration and customer setup (roles, typical dev and prod, seed data, tunnel outline) | `docsHelp/Administrators_Guide.md` |
| Docs | Added sections 18–20: handover by purchase option, third-party service set-up notes, to-do list; aligned with the Customer Ownership and Installation Options guide | `docsHelp/Administrators_Guide.md`, `docsHelp/Common_12_Customer_Ownership_Installation_Options.md` |
| Docs / Ops | Option D (service provider); licences with or without Strapi (10.1); air-gapped option choice (16.8); planned AI move to tbwww; legacy box files moved to `deploy/vm/tbrun/`; Cloud Run notes dropped | `docsHelp/Administrators_Guide.md`, `docsHelp/Common_12_...`, `docsOtherNew/Study_Licensing_With_And_Without_Strapi.md`, `deploy/vm/tbrun/*` |

---

## 15. Building the offline version in your repo

Two ways to produce the offline build from your VS Code clone. Both use the same code; the only
switch is `ENABLE_SW=true`.

### 15.1 As a Docker image (normal route)

```bash
./deploy-push-offline.sh                      # builds, checks and pushes offline-<tag>
# or build only, without pushing:
docker build --build-arg ENABLE_SW=true -t jimecox807/tbrun:offline-v1 .
```

### 15.2 As a plain folder of files (any web server)

```bash
npm install
ENABLE_SW=true npx parcel build index.html --no-source-maps
ENABLE_SW=true node scripts/offline/build-sw.mjs dist
cp -r docsHelp dist/docsHelp                  # help documents, as the Dockerfile does
```
The result is `dist/`: `index.html`, the bundled JS/CSS/fonts/images and the generated `sw.js`.
The build prints `build-sw: ENABLE_SW=true -> wrote the real sw.js … (offline mode ON)`.

Whichever web server serves `dist/` must:
- serve it over **HTTPS** (or `localhost`) — browsers only run service workers there;
- send `Cache-Control: no-cache` for `/sw.js` and `/index.html` (see `scripts/offline/nginx-sw.conf`);
- serve `.js` as `application/javascript`.

### 15.3 Trying it on your machine

```bash
ENABLE_SW=true DEV_SITE=agile.timebars.com npx parcel build index.html --no-source-maps
ENABLE_SW=true node scripts/offline/build-sw.mjs dist
cd dist && python3 -m http.server 8201        # open http://localhost:8201
```
`DEV_SITE` only matters on `localhost`; it must name a host with `offline: true`.
DevTools → Application → Service Workers shows it; tick **Offline** in the Network tab and press F5.

---

## 16. Air-gapped customers (no internet, secure LAN)

The app is well suited to a closed network: it loads nothing from third-party servers, keeps all
project data in the browser, and the offline image can reload with no network at all. This section
is the procedure for building a package, carrying it across the air gap and installing it.

### 16.1 What works and what does not without internet

| Works fully | Needs a service on the customer's LAN, or is unavailable |
|---|---|
| Planning, bars, drag and drop, Kanban, reports, risks/issues, forms, picklists | **Login and licences** (Strapi) — see 16.6 |
| Spreadsheet sync and backups (files stay on their network) | **Cloud publishing, Personal / Enterprise dashboards** (Strapi + tbwww) |
| Help documents (served from the image, `docsHelp/`) | **Ask AI** (Cloudflare Worker + Gemini) — hide or leave unused; Option C can connect a local model (16.8) |
| Offline reload (service worker) on the customer's HTTPS address | **OpenProject sync** — works only against an OpenProject on their LAN (set its URL on the Publishing page, section 11) |
| | Links to the sales site and the spreadsheet downloads on www.timebars.com — hand the spreadsheet masters over as files instead |

### 16.2 Prepare a customer build

1. Get the customer's internal address(es), e.g. `timebars.agency.local`, and which product each serves.
2. Write their `runtime-config.json` (section 2) with their host rows and backend address, e.g.
   `{ "host": "timebars.agency.local", "product": "TB", "offline": true }` in `sites`, and ship it in
   the package next to the compose file (mounted read-only). Without a host row the address gets no
   product, no demo data and no offline mode. The standard offline image can then be used as is;
   steps 3–4 are only needed for a build with other defaults.
3. Set `.env` for the build to values that make sense on their network (or leave the internet URLs;
   those features simply will not connect). Never put secrets in it.
4. Build and tag with the customer and version:
   ```bash
   docker build --build-arg ENABLE_SW=true -t timebars/tbrun:<customer>-v1 .
   ```
5. Check it before packaging:
   ```bash
   docker run -d --name tbcheck -p 127.0.0.1:8699:80 timebars/tbrun:<customer>-v1
   curl -s http://127.0.0.1:8699/sw.js | head -1      # must start with /* TB-OFFLINE-SW
   docker rm -f tbcheck
   ```

### 16.3 Package it

The saved image contains everything, including the nginx base layer — nothing is pulled at install.

```bash
mkdir tbrun-<customer>-v1 && cd tbrun-<customer>-v1
docker save timebars/tbrun:<customer>-v1 | gzip > tbrun-<customer>-v1.tar.gz
cp ../scripts/offline/docker-compose.offline.yml docker-compose.yml   # edit image: to the customer tag
cp ../docsHelp/Administrators_Guide.md ../docsHelp/Common_13_Offline_Mode_And_Security.md .
# spreadsheet masters and any demo backup the customer should have:
#   cp <spreadsheet masters> .
sha256sum * > SHA256SUMS
```

Alternatively hand over the plain `dist/` folder from 15.2 as a zip, for customers who host static
files on their own approved web server instead of Docker.

Include a short `INSTALL.txt` with 16.4 and the version, build date and git commit
(`git rev-parse --short HEAD`).

### 16.4 Install on the customer's LAN

On the customer's server (Docker installed from their own approved sources):
```bash
sha256sum -c SHA256SUMS
gunzip -c tbrun-<customer>-v1.tar.gz | docker load
docker compose up -d                 # compose file's image: timebars/tbrun:<customer>-v1
```
Then, on their side:
- Put their **HTTPS** reverse proxy / load balancer (with their internal CA certificate) in front of
  the container's port. HTTPS is required for offline mode; plain HTTP still runs the app, just
  without the service worker.
- Their browsers must trust that internal CA.
- DNS for the internal address points at the proxy.

### 16.5 Updating an air-gapped site

Build `<customer>-v2` the same way, carry the new package across, `docker load`, change the tag in
the compose file, `docker compose up -d`. Browsers pick up the new version on their next visit
(new cache, old one deleted). Keep the previous package to roll back.

### 16.6 Licensing without internet (gap — to be built)

Today a licence can only be loaded from Strapi at login, so an air-gapped install shows
"Unlicensed" and hides the product title (no limits are enforced). Options for a later session:

1. **Signed offline licence file** (recommended): Timebars Ltd. issues a file with product code,
   tier, limits, customer and expiry, signed with a private key; the app verifies it with a public
   key built into the image and stores it like a Strapi licence. No server needed.
2. **Customer-hosted Strapi** on their LAN (heavier: database, admin, updates).
3. **Licence baked into the customer build** (simplest, but tied to one build and harder to renew).

Option 1 is the same licence file described in section 10.1 for any site without Strapi.

### 16.7 Security notes for the customer's reviewers

Point them at `Common_13_Offline_Mode_And_Security.md`. Key facts: no third-party runtime loads, no
secrets in the bundle, project data stays in the browser, the service worker caches only the app's
own files, and the image can be scanned before it crosses the air gap (`docker scout` / Trivy on
the connected side).

### 16.8 Which option suits an air-gapped site

**Own the code (Option C) is the best fit.** With containers (Option B) the features that need an
internet service are simply off inside the gap; with the source, the customer can reconnect them
to internal systems:

| Feature | Option B | Option C |
|---|---|---|
| Ask AI | off | a model hosted on their network — for example a local model run with **Ollama** — or their own code in place of the Gemini calls |
| Notifications (Pushover, Twilio) | off | integrate with their internal messaging systems |
| Email from Strapi (SendGrid) | point Strapi at the internal mail server | the same, or integrate further |
| Licences | their own Strapi on the LAN, or signed licence files (10.1) | their own Strapi, their own licence files, or no licence checks |
| Payments (Stripe) | not needed | not needed |

---

## 17. Docker configuration and customer setup

> **The customer installation package and its step-by-step guide live in the `tbown` repository**
> (github.com/jimecox2/tbown): stack folders, scripts `00`–`06`, seed data and
> `INSTALLATION_AND_CONFIGURATION_OF_THE_TIMEBARS_SYSTEM_CONTAINER_OPTION.md`. It was rehearsed end to
> end on a test server in October 2026 (Ubuntu 26.04). This section keeps the background: who does
> what, and Timebars Ltd.'s own server configuration for comparison.

For customers who have bought access to the Timebars Ltd. Docker Hub images, the Strapi code and
the seed data, and who will run their own **dev** and **prod** environments. Timebars Ltd. (the
owner) and the customer each do their own part, listed in section 17.1.

The dev and prod boxes in section 17.2 are the **typical configuration** used by Timebars Ltd.
Build the same or a similar setup. This section holds facts only: no addresses, passwords or tokens
(section 9). Keep your own values in your password manager and private notes.

### 17.1 Who does what

| Step | Timebars Ltd. (owner) | Customer |
|---|---|---|
| 1. Access | Grants pull access to the private Docker Hub images and supplies the Strapi code. | Creates a Docker Hub account and a read access token, and sends the account name to the owner. |
| 2. Hosts | Advises on sizing and the typical setup (section 17.2). | Provides a dev box and a prod box (Linux) and installs Docker. |
| 3. Files | Supplies the compose files, `deploy.sh` scripts and `.env` templates (variable names only). | Places them in the stack folders (section 17.4) and fills in their own values. |
| 4. Hostnames | Adds the customer's hostnames to `sites.js` and publishes a customer image tag (sections 13 and 16.2). | Decides the hostnames and sends them to the owner. An address not in `sites.js` gets no product and no demo data. |
| 5. Seed data | Exports the seed database and uploads, checks them, and sends them securely (section 17.6). | Restores them into their own Postgres and deletes the files afterwards. |
| 6. Secrets | Lists which secrets are needed. | Generates their own Strapi secrets and database passwords (section 17.5). |
| 7. Cloudflare | Gives the outline (section 17.7). | Owns the Cloudflare account, domain and tunnel. |
| 8. Go-live checks | Helps check logs and settings. | Adds their hosts to the Strapi CORS allowlist and tests login and publishing (section 12). |

### 17.2 Typical configuration (Timebars Ltd.)

| Item | Dev | Prod |
|---|---|---|
| Docker Engine / client | 29.1.3 / 29.1.3 | 28.4.0 / 28.4.0 |
| Docker Compose | 2.40.3 (Ubuntu package, `docker compose`) | 2.39.2 (`docker-compose-plugin`, `docker compose`) |
| Installed from | Ubuntu distribution packages (not snap, not rootless) | Docker's own apt repository (`docker-ce`, `docker-ce-cli`, `docker-buildx-plugin` 0.27.0, `docker-compose-plugin`); not snap |
| Service | systemd `docker.service`, enabled, socket-activated | Same |
| Docker data root | `/docker/data` (not the default `/var/lib/docker`) | `/var/lib/docker` (default) |
| Storage driver | overlay2 | overlay2 |
| Volumes live in | `/docker/data/volumes/<name>/_data` | `/var/lib/docker/volumes/<name>/_data` |
| Docker context | `default` (local socket `/var/run/docker.sock`) | Same |
| Compose folders | `/docker/compose/<stack>` | `~/docker/<stack>` (section 3) |
| Daemon user | root (normal, non-rootless) | root (non-rootless; the `docker-ce-rootless-extras` package is installed but not in use) |
| Login user in `docker` group | yes, so no `sudo` for `docker` commands | Yes, same |
| Security profiles | AppArmor, seccomp (builtin), cgroupns | Same |

### 17.3 What this means in practice

- **Dev volumes are not under `/var/lib/docker`.** Because the dev data root is `/docker/data`,
  named volumes are at `/docker/data/volumes/`. Prod uses the default `/var/lib/docker/volumes/`.
  Browsing either needs `sudo`. To get the exact path on any box:
  ```bash
  docker volume inspect <volume_name> --format '{{ .Mountpoint }}'
  ```
- **No `sudo` for Docker commands**, because the login user is in the `docker` group. Files inside
  bind-mounted folders may still be root-owned (section 12).
- **Compose v2 syntax only** on both boxes: `docker compose ...` (with a space), not `docker-compose`.
- **Different install sources.** Dev uses Ubuntu's own packages, prod uses Docker's apt repository.
  Dev is currently the newer engine (29.1.3 vs 28.4.0). Keep compose files to features both support,
  and test a change on dev before prod. Prod updates come through `apt` from Docker's repository.
- **Local daemon only** on both boxes. The `default` context points at the local socket, so
  commands cannot hit a remote host by accident.
- The dev data root is normally set with `data-root` in `/etc/docker/daemon.json`. Check that file
  before changing it, and stop Docker first if the data is ever moved. Prod has no custom data root.

### 17.4 Stacks

Each stack has its own folder and `docker-compose.yml`. Timebars Ltd. uses `/docker/compose/<stack>`
on dev and `~/docker/<stack>` on prod; any folder layout works for you if you keep one folder per
stack.

| Stack | Containers | Notes |
|---|---|---|
| `postgres` | `tbpgdb` (PostgreSQL 14), `pgadmin4` | Creates the network `tbpg_net`; Compose prefixes it, giving `postgres_tbpg_net`. Uses **external** volumes `postgres_db` and `postgres_pgadmin`. Choose a private subnet that does not clash with your LAN. |
| `tbbe` | `tbbe` (Strapi, "be2") | Joins `postgres_tbpg_net` as an external network. Settings and secrets come from a local `.env` (never committed). Uploads are bind-mounted from `./public/uploads`. |
| `tbwwwp` | Sales, sign-up and dashboards site (tbwww, section 1) | Compose file supplied by the owner. Server-side secrets only (section 9). |
| `tbrun` | `tbrun` | Legacy app (section 3). |
| `tbrunoffline` | `tbrun-offline` | Offline app (section 3). |
| cloudflared (own folder) | `cloudflare` | Cloudflare Tunnel (sections 6 and 17.7). |

### 17.5 Building your environment

Do dev first, prove it works, then repeat on prod with its own values.

1. **Install Docker and Compose v2** (`docker compose`, with a space). Add your user to the `docker`
   group, then log out and in: `sudo usermod -aG docker $USER`.
2. **Log in to Docker Hub** with your read token (pasted once, kept by Docker, never in a script):
   ```bash
   docker login -u <your_dockerhub_username>
   ```
3. **Create the stack folders** (section 17.4) and copy in the supplied compose files and `.env`
   templates. Secrets files: `chmod 600 .env`.
4. **Generate your own secrets** for the Strapi `.env`, one value per name in the template (for
   example `APP_KEYS` needs four comma-separated values; also `API_TOKEN_SALT`,
   `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, and any others the template lists):
   ```bash
   openssl rand -base64 32
   ```
   Use different secrets on dev and prod. API tokens stored in the seed data were issued under the
   owner's secrets and will not work; create new ones in the Strapi admin.
5. **Create the external volumes**, then start the database stack:
   ```bash
   docker volume create postgres_db
   docker volume create postgres_pgadmin
   cd <postgres folder> && docker compose up -d
   docker network ls | grep tbpg        # expect postgres_tbpg_net
   ```
6. **Create the application role and database**, then load the seed data (section 17.6). Put the
   same database name, user and password in the Strapi `.env` (`DATABASE_HOST` is the database
   container name, `DATABASE_PORT=5432`).
7. **Start the backend**:
   ```bash
   cd <tbbe folder>
   mkdir -p public/uploads
   docker compose up -d
   docker logs -f tbbe
   ```
8. **Start the other stacks** (`tbwwwp`, `tbrun`, `tbrunoffline`) with their `deploy.sh`
   (sections 3 to 5), using the image tags the owner gives you.
9. **Connect the tunnel** (section 17.7), add your hosts to Strapi's CORS allowlist, and test.

### 17.6 Seed data

**Owner:** export from a copy prepared for sharing. Remove any personal data that is not meant to
leave Timebars Ltd. first.

```bash
docker exec tbpgdb pg_dump -U <admin_user> -d <seed_db> -Fc > seed.dump
tar czf seed-uploads.tar.gz -C <tbbe folder>/public uploads
sha256sum seed.dump seed-uploads.tar.gz > seed.sha256
```

Send the three files by a secure route (not plain email). The dump is from PostgreSQL 14; restore
it into 14 or newer, never an older major version.

**Customer:** with the database stack running and the Strapi `.env` filled in.

```bash
sha256sum -c seed.sha256

# role and database (set the role's password interactively so it stays out of shell history)
docker exec tbpgdb psql -U <admin_user> -d postgres -c "CREATE ROLE <db_user> LOGIN;"
docker exec -it tbpgdb psql -U <admin_user> -d postgres -c "\password <db_user>"
docker exec tbpgdb createdb -U <admin_user> -O <db_user> <db_name>

# restore (backend stopped)
cd <tbbe folder> && docker compose stop
docker exec -i tbpgdb pg_restore -U <admin_user> -d <db_name> --clean --if-exists --no-owner --no-acl --role=<db_user> < seed.dump

# uploads
tar xzf seed-uploads.tar.gz -C <tbbe folder>/public

# check and start
docker exec tbpgdb psql -U <db_user> -d <db_name> -c '\dt' | head
docker compose start
docker logs -f tbbe
```

`<admin_user>` is the `POSTGRES_USER` from the database compose file. "Does not exist" notices
during the first restore are harmless. Use the same `tbbe` image tag the seed was made with.
Delete `seed.dump` and `seed-uploads.tar.gz` when finished. Ask the owner how the first admin login
is provided, and change that password on first use.

### 17.7 Cloudflare Tunnel (outline)

Section 6 has the full notes. In short:

1. Use a Cloudflare account that manages your domain.
2. In Zero Trust, open Networks, then Tunnels, and create a tunnel. Copy its token into a `.env`
   next to the cloudflared compose file (`TUNNEL_TOKEN=...`, `chmod 600`).
3. Run `cloudflared` as its own container and confirm the tunnel shows as healthy.
4. Add one public hostname per app or site, pointing at the service's host port
   (for example 8686 and 8687, section 6), plus hostnames for Strapi and the sales site.
5. Keep those ports closed to the outside so nobody can reach the apps around Cloudflare.

*Exact settings to be added.*

### 17.8 Recording your own configuration

Record your dev and prod facts in a table like section 17.2, in your own private notes. Refresh it
after upgrading Docker or moving the data root. Run on each box:

```bash
docker info --format 'Root: {{.DockerRootDir}}  Security: {{.SecurityOptions}}  Driver: {{.Driver}}'
docker version --format 'Client {{.Client.Version}} / Server {{.Server.Version}}'
docker compose version
docker context ls
which docker
dpkg -l | grep -i docker
snap list 2>/dev/null | grep -i docker
systemctl status docker --no-pager | head -5
id -nG
```

`Security` containing `rootless` means a rootless install (volumes then sit under
`~/.local/share/docker/volumes/`). A `snap list` hit means a snap install (paths differ again).
`dpkg -l` shows `docker-ce` for Docker's repository, or `docker.io` for Ubuntu's packages.

### 17.9 Changing versions, and getting help

The typical configuration is a known-good reference, not a requirement. If you change Docker,
Compose, PostgreSQL or the operating system, you are responsible for getting the stack running
again; the owner will guide you.

When you ask for help, send: the output of the commands in section 17.8, your compose files with
all secrets removed, and `docker logs --tail 100 <container>` for the failing container. Never send
`.env` values, tokens or passwords.

---

## 18. Handover by purchase option

For Options B, C and D the customer starts from the `tbown` package (section 17).

The options themselves are described in *Customer Ownership and Installation Options*
(`Common_12_...`). This section is what each one hands over and what the customer sets up.

### 18.1 Ground rules for every handover

- **The customer uses their own accounts.** Timebars Ltd. does not give out its passwords, and the
  customer does not run production on Timebars Ltd.'s accounts. Most of these accounts are tied to
  the owner's phone for two-factor sign-in, and sharing logins breaks most providers' terms.
- **Access is given by invitation where the service supports it** (GitHub read access, Docker Hub
  pull access), and is removed after handover.
- **Everything else is a supervised walk-through.** Timebars Ltd. shares its screen on the
  service's dashboard (Cloudflare, Google, Pushover, Stripe, SendGrid), the customer copies the code
  and settings they need, and recreates them in their own account.
- **Secrets are never handed over.** The customer generates every key and password themselves.
  Templates list variable names only.
- **The customer records what they received** (repo commit, image tags, worker code versions) so
  later questions have a fixed reference.

### 18.2 What each option needs

| Item | A — Subscribe | B — Containers | C — Own the code | D — Service provider |
|---|---|---|---|---|
| Server / VM (19.1) | — | yes | yes | yes |
| Source code from GitHub (19.2) | — | — | yes (one-time copy) | yes (one-time copy) |
| Docker images (19.3) | — | yes | optional (can build their own) | optional |
| PostgreSQL + seed data (17.5, 17.6) | — | yes | yes | yes |
| Strapi for login and licences (10.1) | — | yes, or signed licence files | their choice | yes |
| Google Gemini key (19.4) | — | after the AI move (19.5) | if AI wanted | if AI wanted |
| AI service (19.5) | — | Timebars Ltd.'s until the AI move | if AI wanted | if AI wanted |
| Pushover (19.6) | each user buys the app | if notifications wanted | if notifications wanted | yes |
| Twilio (19.7) | — | if SMS wanted | if SMS wanted | if SMS wanted |
| Stripe (19.8) | — | — | — | yes |
| SendGrid or own mail server (19.9) | — | yes, with Strapi | yes, with Strapi | yes |
| DNS, TLS, Cloudflare Tunnel (19.10) | — | yes (any provider) | yes (any provider) | yes (any provider) |
| OpenProject (19.11) | optional | optional | optional | optional |
| Diagram tools (19.12) | — | — | optional | optional |

Option D (selling the products to other organisations as a service) is a special arrangement with
Timebars Ltd. — see *Customer Ownership and Installation Options*, section 6.

A subscription customer (Option A) needs none of this section.

---

## 19. Third-party services: set-up notes

Simple how-to notes for each service. Exact screens and variable names for tbwww and Strapi are
still to be added (section 20) — check them against the code you received before going live.

### 19.1 The server (virtual machine)

- **Timebars Ltd. reference:** one DigitalOcean droplet (Ubuntu, small shared-CPU plan) runs all the stacks in section 17.4, reached only through Cloudflare Tunnel.
- **Customer:** any provider — Google Cloud, AWS, Azure, DigitalOcean — or their own hardware.
  The droplet itself cannot be transferred; build a new server and follow section 17. Use a
  supported Ubuntu LTS (22.04 or 24.04).
- **Minimum size:** 2 CPU cores, 4 GB RAM, 100 GB SSD.
- Basics on day one: SSH keys only (no password login), a non-root user in the `docker` group,
  automatic security updates, a cloud firewall with no inbound app ports (section 6), and provider
  backups or snapshots switched on.
- Step-by-step droplet build: see section 20 (appendix to be added).

### 19.2 Source code (GitHub) — Option C

Repositories (owner account `jimecox2`):

| Repo | Visibility | Contents |
|---|---|---|
| `tbrunp` | private | the app (AB / TB / CB), AI worker source, app deploy scripts, help docs |
| `tbwww` | public | Next.js sales site, sign-up, Stripe, notifications, dashboards |
| `tbbe` | public | Strapi backend |
| `helpapp` | public, optional | Next.js help app; example of calling Gemini without Cloudflare |
| `nwi-ghub` | optional | sample customer portal |

Steps:
1. Owner grants the customer's GitHub user read access to `tbrunp` (the public repos need none).
2. Customer clones each repo in VS Code (Command Palette → *Git: Clone*), or:
   ```bash
   git clone https://github.com/jimecox2/tbrunp.git
   ```
3. Customer creates empty repos on their own Git host and pushes the full history:
   ```bash
   cd tbrunp
   git remote rename origin timebars
   git remote add origin <customer repo URL>
   git push -u origin --all && git push origin --tags
   ```
4. Owner removes the read access. From here the code is the customer's to maintain.
5. Customer replaces Timebars Ltd. addresses: `scripts/config/sites.js` (hosts), the AI worker URLs
   (section 13), sales-site links (section 13), and `OP_URL_DEFAULT` in `scripts/op/opUrl.js`.

### 19.3 Docker images (Docker Hub) — Option B

| Image | Purpose |
|---|---|
| `jimecox807/tbrun` | the app (`latest` = legacy, `offline-*` = offline, `<customer>-*` = customer build) |
| `jimecox807/tbwwwp` | sales site, sign-up, notifications, dashboards |
| `jimecox807/tbbe` | Strapi backend |
| `postgres` (public) | database — not a Timebars image |
| `jimecox807/tbhelpapp` | optional sample help app |
| `jimecox807/nwi` | optional sample customer portal |

Steps: customer creates a Docker Hub account and a **read-only** access token; owner grants that
account pull access to the private repositories; customer runs `docker login -u <their user>` on
each box (section 17.5). Pin a specific tag in production, not `latest`.

### 19.4 Google Gemini API (AI)

1. Sign in to Google AI Studio (aistudio.google.com) or the Google Cloud console with the
   customer's own Google account and create (or pick) a project.
2. Make sure the **Generative Language API** (`generativelanguage.googleapis.com`) is enabled under
   *APIs & Services*.
3. Create an API key in AI Studio → *API keys*. Restrict it to the Generative Language API.
4. Turn on billing if usage will pass the free tier, and set a budget alert.
5. The key goes **only** into the worker settings (19.5) — never into the app, `.env` or git.

The workers currently use the `gemini-2.5-flash` model (set at the top of each worker file).

### 19.5 AI workers (Cloudflare Workers) — current, being replaced

> **Planned re-architecture.** The AI features are moving off Cloudflare Workers into a new
> service with similar features inside tbwww (Next.js, the `tbwwwp` image). The AI code in
> `tbrunp/scripts/ai/` and `deploy/workers/` will be removed, and the app will link users to the
> tbwww AI pages instead. After the move: no Cloudflare account is needed for AI, the Gemini key
> (or a customer's own model) lives in the tbwww server environment only, and AI requests are
> checked against the user's login. The steps below apply until then.

| Worker name | What it does | Source in `tbrunp` | Called from |
|---|---|---|---|
| `timebars-gemini-create-project` | L1 → create a Project | `scripts/ai/aiCreateProject.js` | `aiCreateConfig.js` |
| `timebars-gemini-create-wbs` | Project / WP → WBS, tasks, milestones | `scripts/ai/aiCreateWbs.js` | `aiCreateConfig.js` |
| `timebars-gemini-staff-tasks` | assign people to tasks | `scripts/ai/aiCreateStaffing.js` | `aiCreateConfig.js` |
| `timebars-gemini-resource-plan` | resource plan with generic roles | `scripts/ai/aiCreateResourcePlan.js` | `aiCreateConfig.js` |
| `timebars-gemini-bcase` | fill Project Charter / business case | `scripts/ai/timebars-gemini-bcase.js` | same file |
| `timebars-help-assistant` | Ask AI help answers from `docsHelp/` | `deploy/workers/timebars-help-assistant-worker.js` | `scripts/ai/askHelp.js` |

In the first five files the worker code is the block marked `START CLOUDFLARE WORKER` (the rest of
the file is app code). Timebars Ltd. also keeps copies in the tbwww repo.

Steps per worker:
1. In the customer's Cloudflare dashboard → *Workers & Pages* → *Create* → *Worker*, use the name
   above.
2. Paste the worker code and deploy.
3. *Settings → Variables and Secrets* → add `GEMINI_API_KEY` as a **secret**.
4. Note the worker URL (`https://<name>.<your-subdomain>.workers.dev/`).
5. Put the URLs in `aiCreateConfig.js`, `askHelp.js` and `timebars-gemini-bcase.js`, then rebuild
   the app.
6. Before go-live, replace `Access-Control-Allow-Origin: *` with the customer's own app hosts
   (section 13).

**Without Cloudflare:** the same logic can run as Next.js API routes; the `helpapp` repo shows the
pattern. The key then lives in the Next.js server environment (never a `NEXT_PUBLIC_` name).

### 19.6 Pushover (push notifications)

Full user and technical steps are in the *Text Notifications User Guide* (`Common_10_...`).
Administrator summary:
1. Create a Pushover account at pushover.net; register at least one device.
2. *Your Applications* → create an application → copy the **API token**.
3. Copy the **user key** from the dashboard (or create a delivery group for several people).
4. Put `PUSHOVER_APP_TOKEN`, `PUSHOVER_USER_KEY`, `NOTIFICATION_STRAPI_KEY` and
   `SYSTEM_ADMIN_EMAIL` in the tbwww server environment (never `NEXT_PUBLIC_`).
5. Install the cron job described in the notifications guide, using the **absolute** path to the
   script, and test with the `curl` check in that guide.

### 19.7 Twilio (SMS) — optional

Used today for Costbars SMS escalation; a full SMS channel (no app needed for recipients) is
planned but the website side is not finished.
1. Create a Twilio account, verify it and buy a phone number with SMS.
2. Note the Account SID, an auth token (or API key) and the sending number.
3. Put them in the tbwww server environment. Variable names: section 20.
4. Complete the sender registration Twilio requires for your country before sending in volume
   (for US local numbers this is A2P 10DLC registration).
5. Add the auth check to the Twilio route first (section 13).

### 19.8 Stripe (payments) — Option D only

The tbwww site takes payment with Stripe and the result creates the order (licence) in Strapi.
Only Timebars Ltd. sells subscriptions, so Options B and C never need Stripe: their administrator
creates orders in the Strapi admin (or uses licence files, section 10.1). Stripe is needed only by
an Option D service provider selling to its own customers.
1. Create a Stripe account; build and test in **test mode** first.
2. Create the products and prices to match the Strapi `products` rows (section 10).
3. Put the **secret key** in the tbwww server environment; only the publishable key may reach the
   browser.
4. Add a webhook endpoint pointing at the tbwww webhook route and store its signing secret in the
   server environment.
5. Run a test purchase end to end, check the order appears in Strapi, then switch to live keys.

Exact routes and variable names: section 20.

### 19.9 SendGrid (email from Strapi)

Strapi sends registration and password-reset email through SendGrid (now part of Twilio). Any
SMTP server the customer already runs can replace it.
1. Create a SendGrid account and verify a sender: preferably the whole domain (SPF, DKIM records
   in DNS), at least a single sender address.
2. Create an API key with *Mail Send* permission only.
3. Put it in the Strapi `.env` (never in git) and set the from / reply-to addresses.
4. Restart `tbbe` and register a test user to confirm the email arrives.

Exact Strapi provider settings and variable names: section 20.

### 19.10 DNS, HTTPS and Cloudflare Tunnel — optional

Timebars Ltd. uses Cloudflare DNS with Cloudflare Tunnel: `cloudflared` makes an outbound-only
connection from the server, so no inbound ports are open. Set-up is in sections 6 and 17.7;
Cloudflare's own guide is at developers.cloudflare.com/tunnel/.

Any other approach works: a reverse proxy (nginx, Traefik, a cloud load balancer) with TLS
certificates (Let's Encrypt or an internal CA). Whatever is chosen:
- add every app host to `scripts/config/sites.js` (or ask for a customer image);
- add every app host to the Strapi CORS allowlist;
- serve the offline hosts over HTTPS.

### 19.11 OpenProject — optional

OpenProject is open source and is self-hosted by the customer. Timebars Ltd.'s own instance is for
its use and demos only. Point the app at the customer's instance on the Publishing page (section
11); each user creates an API token in their OpenProject account. How sync works is in the help
documents.

### 19.12 Diagram tools — optional

Design diagrams were made with Lucidchart (lucid.app) and Mermaid (mermaid.ai and Mermaid code in
Markdown). Only needed if the customer maintains the design documentation.

---

## 20. To do: details still to be added

### 20.1 Details to be supplied by Timebars Ltd.

- [ ] **Appendix: building the server** — a step-by-step VM build (the DigitalOcean droplet
      cannot be handed over).
- [ ] **tbwww environment template** — every variable name for Strapi URL, Pushover, Twilio, Stripe
      (secret key, webhook secret, price IDs), and which are server-only.
- [ ] **tbbe (Strapi) environment template** — database, secrets, SendGrid / email provider
      settings, CORS allowlist location, first admin user procedure.
- [ ] **Compose files for `tbwwwp`, `tbbe`, `postgres`, cloudflared** — say where they live in the
      repos (or confirm the old `dockeretc` repo is retired).
- [ ] **Stripe (Option D):** webhook route, events used, how an order maps to a Strapi `products`
      row.
- [ ] **Twilio:** finish the website side of the SMS channel, then document it.
- [ ] **Versions:** Strapi, Next.js and Node versions per repo, and their upstream support dates.
- [ ] **Handover checklist** — a one-page sign-off listing commit hashes, image tags and versions
      delivered, and confirming owner access has been removed afterwards.
- [ ] **Agreements** for Options B, C and D (use rights, organisation-wide licence for B,
      white-labelling, warranty, support term; for D the service-provider terms).

- [ ] **Wire the regenerated Strapi full-access token** (October 2026 rotation) into tbwww under a
      server-only name; the features that used the old token are broken until then.
- [ ] **New SendGrid key** (old one deleted): tbwww (server-only name) and Strapi
      (`SENDGRID_API_KEY` in the tbbe `.env`); sign-up and other email is broken until then.
- [ ] **Prod firewall (tbdovm)**: `ufw` is off and app/database ports listen on all addresses; attach a
      DigitalOcean cloud firewall (SSH from the admin IP only) with `tools/handover/do-firewall-tbdovm.sh`.
      Deferred October 2026 — no changes to tbdovm until the prod rebuild.
- [ ] **Scan the public `tbwww` and `tbbe` repos** for secrets in their git history (e.g. gitleaks);
      rotate anything found.
- [ ] **`tbown` visibility**: public for now; decide private/public in the licence session.
- [ ] **Seed data**: demo data with no real users, kept in `tbown` (not prod data).

### 20.2 Platform changes that make handover simpler (recommended)

| # | Change | Why it helps |
|---|---|---|
| 1 | **AI move to tbwww** (planned, section 19.5) — strip `scripts/ai/` and `deploy/workers/` from tbrunp, link to tbwww | removes Cloudflare Workers from every handover; one place for the AI key; closes the open-worker issue |
| 2 | **Licence-file import** on the Show License dialog, with signature check for Option B (10.1) | sites without Strapi, and air-gapped sites, get a working licence |
| 3 | **Standalone mode** setting: hides Login, Publish, Purchase, Bulk Update and Re-Publish and makes no backend calls | a clean app for customers who run no Strapi |
| 4 | **Runtime config, all three images — decided October 2026, do before the first customer package.** tbrun: **done** (October 2026, section 2). a `runtime-config.js` mounted read-only into the nginx container and loaded before the app, overriding hostnames → product, `API_URL`, `WWW_URL`, OpenProject default, standalone mode (built-in values stay as defaults; the offline worker caches it). tbwww: no customer-specific `NEXT_PUBLIC_*` at build time — public settings read from server environment at runtime. tbbe: CORS origins from an environment variable | **one set of Docker Hub images for every customer**; each customer supplies config files and `.env` values only; no customer-specific builds |
| 5 | **Sales-site links from `WWW_URL`** instead of hard-coded `www.timebars.com` (section 13) | customers point links at their own site or intranet |
| 6 | **One handover bundle**: a single compose project for postgres, tbbe, tbwwwp and tbrun, an `.env.example` per service, and a seed-restore script | stand-up becomes "fill in the env files, run one command" |
| 7 | **Strapi bootstrap script** that creates the `products` rows and the first admin user | customers start clean instead of restoring Timebars Ltd.'s seed database |
| 8 | **Organisation accounts** for repos and images (e.g. a `timebars` GitHub organisation and Docker Hub organisation instead of the personal `jimecox2` / `jimecox807`) | access is granted and removed per team, and is not tied to one person |
| 9 | **Repo clean-up** before handover: remove `devops/` and review other experimental or obsolete folders (`docsBin/`, `docsOther/`) | less for the customer to read and less to question in a security review |
| 10 | **Twilio route auth check** in tbwww (section 13) | a security reviewer will flag an open SMS endpoint |
| 11 | **Customer repository `tbown`** (github.com/jimecox2/tbown): the install guide, stack folders (compose files, `.env.example`, config templates), scripts and release notes; each release tagged, so GitHub's release zip *is* the handover package. Seed data and secrets never go in it (delivered separately, encrypted) | one place a customer clones or downloads; versioned with the image tags it names |
| 12 | **tbwww clean-up session**: remove unused variables, move every secret to server-only names, scan the repo history for secrets (it is public), rebuild and redeploy | closes the `NEXT_PUBLIC_` secrets issue (section 13) |
| 13 | **Prod rebuild on Ubuntu 26.04** following the customer install guide (prod runs 24.10, out of support) | prod becomes the first install done exactly as customers do it |
