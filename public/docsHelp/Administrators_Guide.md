# Administrators Guide

For the people who deploy, host and look after the Timebars Ltd. apps (Agilebars, Timebars,
Costbars). End users do not need this guide.

> **This file is public.** Everything in `docsHelp/` (helpapp, the master of the help files) is served by
> Timebars Cloud and can be read at `/docsHelp/…`. Never add IP addresses, tokens, passwords or API keys here. Keep those in your
> password manager and on the servers only.

Last updated: 16 October 2026.

---

## Contents

1. [How the platform fits together](#1-how-the-platform-fits-together)
2. [Sites and hostnames](#2-sites-and-hostnames)
3. [The containers](#3-the-containers)
4. [Releasing a new version](#4-releasing-a-new-version)
5. [Setting up an environment](#5-setting-up-an-environment)
6. [Proxy, HTTPS and DNS](#6-proxy-https-and-dns)
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
| **Website (tbwww)** | Sales, sign-up, profile and orders. | `tbwwwp` container |
| **Database** | PostgreSQL for Strapi (public image). | Container or managed service |
| **OpenProject** | Optional sync partner (Tier-3). | Separate service |
| **AI service (helpapp)** | Next.js container with six routes (`/api/ai/*`) that call Google Gemini; it holds the Gemini key and checks the user's login (section 19.5). | `tbhelpapp` container, reached by the app's nginx over the Docker network `tbnet` |
| **Timebars Cloud (helpapp)** | Enterprise and Personal dashboards, notifications (Pushover, SMS via Twilio) plus a cron job, and the AI service above. | `tbhelpapp` container + host cron |
| **Email** | Registration and account email sent by Strapi via SendGrid. | SendGrid (external) |
| **Payments** | Licence purchases on the sales site via Stripe, recorded in Strapi. | Stripe (external) |
| **Proxy** | Caddy: answers every name over HTTPS and passes it to the right container (section 6). Or your own proxy. | `tbproxy` container |
| **Optional samples** | `nwi` (customer portal). (`helpapp` is no longer optional: it is the AI service above.) | Own container |

Key point: **the app container only serves files.** It holds no data and needs no database.
The product (AB / TB / CB) is chosen in the browser from the address the user opened.

---

## 2. Sites and hostnames

Every address the app answers on is listed in **one** place: `scripts/config/sites.js` (`SITES`).
The app reads the hostname, looks it up there, and sets the product, logo, title and demo data.

All hosts are served by the same `tbrun` image and container.

| Host | Product | Offline mode |
|---|---|---|
| `agile.timebars.com` | Agilebars | yes |
| `pmrm.timebars.com` | Timebars | yes |
| `ppm.timebars.com` | Costbars | yes |
| `agiles.timebars.com` | Agilebars (staging) | yes |
| `pmrms.timebars.com` | Timebars (staging) | yes |
| `ppms.timebars.com` | Costbars (staging) | yes |
| `ab.timebars.com` | Agilebars | no |
| `tb.timebars.com` | Timebars | no |
| `cb.timebars.com` | Costbars | no |
| `abs.timebars.com` | Agilebars (staging) | no |
| `tbs.timebars.com` | Timebars (staging) | no |
| `cbs.timebars.com` | Costbars (staging) | no |
| `timebars.com` | Timebars | no |
| `agile.rlan.ca`, `pmrm.rlan.ca`, `ppm.rlan.ca` | AB / TB / CB (mock production, home lab) | yes |
| `ab.rlan.ca`, `tb.rlan.ca`, `cb.rlan.ca` | AB / TB / CB (home lab) | no |

`PRODUCT_PUBLIC_HOST` in the same file is the address shown to users in links and messages
(currently `ab` / `tb` / `cb.timebars.com`).

### Adding, renaming or retiring an address

1. **Code:** add, edit or remove the row in `scripts/config/sites.js` (`offline: true` turns the service
   worker on for that host), then release a new image (section 4). **No hostname may be written anywhere
   else in the code.** A server that needs a host the image does not know adds a `sites` row to its
   `runtime-config.json` instead — no release.
2. **Deploy** the new image, or reload the container after editing `runtime-config.json`.
3. **Proxy and DNS:** a DNS record for the host pointing at the proxy, and a route for it in the proxy
   (section 6).
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
| `cloudUrl` | `CLOUD_URL` (their Timebars Cloud: Enterprise Dashboard, notifications, AI help) | `https://cloud.example.com` |
| `helpUrl` | `HELP_URL` (their help library: guide links, spreadsheet downloads) | `https://help.example.com` |
| `opUrl` | `OP_URL` (their OpenProject; a user's Publishing-page setting still wins) | `https://op.example.com` |
| `aiBaseUrl` | `AI_BASE_URL` (where the AI routes are; default `/ai`, which the app's own nginx proxies to helpapp, section 19.5) | `/ai` |
| `sites` | extra rows for `SITES` (same shape; listed first, so they win) | `{ "host": "pm.example.com", "product": "TB", "offline": true }` |
| `productPublicHost` | the addresses shown to users | `{ "AB": "...", "TB": "...", "CB": "..." }` |

It lives in `$TB/tbrun/runtime-config.json`, written by `apply` from `tbapps.conf` (`tbown`); the compose
file mounts it read-only at `/usr/share/nginx/html/runtime-config.json`.
Template: `scripts/config/runtime-config.example.json`. Code: `scripts/config/runtimeConfig.js`.
No file, or a file that is not valid JSON, means the built-in defaults (the console says which).
Rows with an empty host or a product other than AB / TB / CB are ignored. The offline worker fetches
the file network-first and keeps the last good copy, so offline reloads keep the customer's
settings; a changed file applies on the next online load. Timebars Ltd.'s production can run without it
(the defaults are its addresses); `apply` writes one for every other environment.

### Moving users to a new address

Each address has its own browser database, so work does not follow a user to a new address
automatically. Users move with **spreadsheet sync** or **Start → Data Actions → Make Backup**, then
load it on the new address (see the Data Synchronization, Backup and Recovery guide).

---

## 3. The containers

Every container is built, versioned and deployed the same way. Each image is generic: it carries no
address, key or password. Each server keeps those in local files next to the compose file, so one
image runs on dev, staging, prod or a customer server unchanged. Plan and background:
`docsOtherNew/Plan_Uniform_Container_Deploy.md`.

| Container | Stack folder | Image | Port (host, this server only) | Settings file |
|---|---|---|---|---|
| `tbpgdb` | `postgres` | `postgres:<tag>` (public) | `127.0.0.1:5433` | `.env.local` |
| `tbbe` | `tbbe` | `jimecox807/tbbe:<tag>` | `127.0.0.1:1337` | `.env.local` |
| `tbwwwp` | `tbwww` | `jimecox807/tbwwwp:<tag>` | `127.0.0.1:3001` | `.env.local` |
| `tbhelpapp` | `tbhelp` | `jimecox807/tbhelpapp:<tag>` | `127.0.0.1:3010` | `.env.local` |
| `tbrun` | `tbrun` | `jimecox807/tbrun:<tag>` | `127.0.0.1:8687` | `runtime-config.json` |
| `tbproxy` | `proxy` | `caddy:<tag>` (public) | `80`, `443` (the only published ports) | `Caddyfile` |

All of them join one Docker network, **`tbnet`**, and find each other by container name. Only the proxy
is reachable from the network; it reaches the other containers by name (section 6). Their host ports
are bound to `127.0.0.1` only, for checks on the server itself.

### Files in each environment folder (`$TB` on every server)

| File | In git? | Holds | Written by |
|---|---|---|---|
| `<stack>/docker-compose.yml`, `<stack>/deploy.sh` | yes (`tbown/templates`) | service, port, network, healthcheck — no values | the package |
| `<stack>/.env.local` | never | this environment's addresses and settings — no secrets | `apply`, on the dev box |
| `secrets.env` | **never** | keys (pasted) and passwords (made on the server); `chmod 600` | you and `03-make-passwords.sh` |
| `<stack>/.secrets.env` | never | the part of `secrets.env` that stack needs; `chmod 600` | `03-make-passwords.sh` |
| `<stack>/.env` | never | one line: the image tag, e.g. `TBWWW_TAG=2026.10.12` | `deploy.sh` |
| `tbrun/runtime-config.json` | never | the browser's addresses (no secrets) | `apply` |
| `proxy/Caddyfile` | never | every name and its route | `apply` |

The server files live **only** in the `tbown` package (`templates/<stack>/`, made into one package per
environment by `apply`); the image repos hold the Dockerfile, `.dockerignore`, the push script and (for
local development) an `.env.example`.

### Image tags

- Tag = build date, e.g. `2026.10.12` (a second build that day: `2026.10.12-2`). The push scripts
  propose today's date.
- Servers never run `latest`: `deploy.sh` writes the exact tag to `.env`, and a rollback is
  `./deploy.sh` with the previous tag. `latest` is pushed too, as a pointer only.
- `tbown/VERSION.md` lists the set of tags tested together.

### The app image (tbrun)

One image serves every app hostname. The product (AB / TB / CB) is chosen in the browser from the
address (section 2). The offline service worker is built into every image and runs only on hosts
whose row says `offline: true` (section 7). No `.env` enters the build: the built-in defaults are
Timebars Ltd.'s addresses, and a server sets its own in `runtime-config.json` (section 2). The
product version shown in the app (`APP_VERSION`, e.g. `8.0:18-Mar-26`) is passed by the push script.

---

## 4. Releasing a new version

### Build and push (your development machine, repo on `main`)

```bash
./deploy-push-to-hub-secure.sh       # same script in tbrunp, tbwww, helpapp, tbbe; Enter = today's date tag
```
It uses the Docker login saved on the machine (`docker login -u jimecox807`, once) and pushes
`<image>:<tag>` and `:latest`. The tbrunp script also asks for `APP_VERSION` (Enter = the value in
your local `.env`) and checks the image contains the offline worker before pushing. Record the tag
in `tbown/VERSION.md`, then on the dev box `bash scripts/apply.sh --force <ENV>` and push the package
to each environment (section 5).

### Deploy (each environment)

```bash
cd $TB && ./deploy-all.sh            # every stack, with the tags in VERSION.md
cd $TB/<stack> && ./deploy.sh        # one stack: type the tag; Enter keeps the current one
```
`deploy.sh` checks the stack's settings, pulls the image, writes the tag to `.env`, starts the container
and waits for its health check. `deploy-all.sh` recreates only the containers whose image or settings
changed.

### Changing an address or key (no new image)

- **An address or setting:** change `tbapps.conf` and run `bash scripts/apply.sh --force <ENV>` (or find
  and replace in `envs/<ENV>`), push the package again, then `cd $TB && ./deploy-all.sh`.
- **A key:** edit `$TB/secrets.env`, then `bash $TB/scripts/03-make-passwords.sh && cd $TB && ./deploy-all.sh`.

Never rebuild an image for a setting.

### Rolling back

`./deploy.sh` in the stack folder and type the previous tag (`tbown/VERSION.md` or `.env` history in
your notes). App users get the previous release on their next online visit.

### Before every release

- `npm run build` passes locally (tbrunp; `next build` for tbwww and helpapp).
- The Docker login on your machine is current (`docker login -u jimecox807`).

---

## 5. Setting up an environment

Follow the `tbown` deployment guide (`DEPLOY_TB_SYSTEM_CONTAINER_OPTION_V2.md`). Timebars Ltd.'s own
environments are installed exactly as a customer's. Every environment (DEV, STAGING, PROD, TRAINING)
has its own server. In short:

1. **Dev box:** clone `tbown`, fill in `tbapps.conf` (one section per environment, six names each; the help name is made from the Cloud name) and
   run `bash scripts/apply.sh`. It makes one package per environment in `envs/<ENV>`, with every address
   already in place. The section name is also the environment's name (`TB_ENVIRONMENT` in the Cloud and
   website `.env.local`): every environment except `PROD` shows a dark red nav bar with its name there, so
   staging is not mistaken for production.
2. **Server:** a patched Ubuntu server with an admin user and SSH key login.
   `scripts/00-prep-new-server.sh` sets up a new cloud server.
3. **Send the package:** `bash envs/<ENV>/00-push-to-server.sh <server> /docker/compose` copies it into
   a folder `tbApps` there and sets `$TB` to it.
4. **On the server:** `sudo bash $TB/scripts/01-install-docker.sh`, `docker login -u jimecox807`, paste
   the keys into `$TB/secrets.env`, then `cd $TB && ./deploy-all.sh`. That creates the volumes and the
   network, makes the passwords, starts every stack, loads the seed data on the first deploy and starts
   the proxy.
5. **Check:** `06-health-check.sh` (running tag and health of every container) and `07-check-urls.sh`
   (every name, through the proxy).

> **Important: deploying on a server where these Docker volumes already exist.** If the server has run a
> Timebars database before, the `postgres_db` volume keeps its old passwords and Strapi stops with
> `password authentication failed for user "strapi"`. Check with `docker volume ls | grep postgres`.
> If nothing in it is needed, remove it so the environment starts clean (this deletes that database):
> `docker rm -f tbbe tbpgdb 2>/dev/null; docker volume rm postgres_db && rm -f $TB/.seeded`, then
> `cd $TB && ./deploy-all.sh`. To keep the data, restore the `secrets.env` that belongs to it instead.

Run the scripts as your admin user, not with `sudo` (except `01-install-docker.sh`).
`docker compose up -d` in a stack folder restarts it with the tag stored in `.env`.

---

## 6. Proxy, HTTPS and DNS

Each environment has seven names: the three app names (Agilebars, Timebars, Costbars), the Strapi
backend, the website, Timebars Cloud and its help library. Six are set in `tbapps.conf`; the help name
(`HELP_HOST`) is made from the Cloud name (`cloud.<domain>` -> `help.<domain>`) unless you type it. `apply`
writes every setting and route from them. The help name redirects to Cloud's `/help`, so it must share the
Cloud name's domain.

**Our proxy (`PROXY=caddy`).** The `tbproxy` container (Caddy) answers every name over HTTPS and
passes it to the container by name over `tbnet`:

| Name | Route |
|---|---|
| the three app names (section 2) | `http://tbrun:80` |
| backend (`be2.<domain>`) | `http://tbbe:1337` |
| website (`www.<domain>`) | `http://tbwwwp:3001` |
| Timebars Cloud (`cloud.<domain>`) | `http://tbhelpapp:3010` |
| help library (`help.<domain>`) | `http://tbhelpapp:3010` |

- `TLS=letsencrypt`: public names, ports 80 and 443 open to the internet. Caddy gets and renews free
  Let's Encrypt certificates on its own.
- `TLS=internal`: names in internal DNS or hosts files only. Caddy signs the certificates itself; each
  browser machine trusts its root certificate once (`tbown` guide, section 8).

**Your own proxy (`PROXY=own`).** Caddy is not started. Your proxy terminates HTTPS for each name and
passes it on over HTTP to `127.0.0.1:8687` (app), `:1337` (backend), `:3001` (website) and `:3010`
(Cloud), or to `LISTEN_IP` when it runs on another machine. The *Routes* table in `envs/<ENV>/DEPLOY.md`
lists them. Keep the `Host` header and send `X-Forwarded-Proto: https`.

**DNS.** Every name points at the proxy. The *Names* table in `envs/<ENV>/DEPLOY.md` lists the records.

Either way:
- HTTPS is required for offline mode: browsers only run service workers over HTTPS.
- Do not cache `/index.html`, `/sw.js` or `/runtime-config.json` at the proxy.

### Firewall

Only SSH and, with our proxy, ports 80 and 443 are open (`00-prep-new-server.sh --web --ssh-from <your IP>`
sets this up). Every other container port is bound to `127.0.0.1`.

---

## 7. Offline mode

Offline mode lets the app load and reload with no network (F5, Home and the logo work offline).
User-facing description and security notes: `docsHelp/Common_13_Offline_Mode_And_Security.md`.
Technical details: `scripts/offline/README.md`.

### When it is on

The service worker is in every app image. It runs only on hosts whose row has `offline: true` — in
`sites.js`, or in the server's `runtime-config.json` (`sites` rows are listed first, so they win).
ab / tb / cb hosts are served by the same image without it.

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
| One host: a `sites` row for it in `runtime-config.json` without `offline: true`, then reload the container | Browsers remove the worker and its cache on their next online visit. |
| Every host: `ENV ENABLE_SW=false` in the Dockerfile, release a new image | The image ships a self-destruct `sw.js`; browsers clean up the same way. |

To clear one browser: DevTools → Application → Storage → **Clear site data**. This also clears that
browser's project data for the address — make a backup first.

---

## 8. Local development

```bash
npm install
npm run dev        # http://localhost:1234
npm run build      # production build into dist/
```

`.env` in the repo root (git-ignored, **no secrets**, used by `npm run dev` only — it never enters an
image; servers use `runtime-config.json`):

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
- **AI in local development:** `.proxyrc.json` makes the dev server forward `/ai/` to helpapp on
  `http://localhost:3009` (the same path the nginx proxy uses in the containers). In the helpapp repo create
  `.env.local` (`GEMINI_API_KEY`, and `STRAPI_URL` = the same address as `API_URL` in the app's `.env`) and run
  `npm run dev`. Log in to the Timebars Cloud in the app, then use Ask AI. For a first check without a login set
  `AI_REQUIRE_LOGIN=false` in helpapp's `.env.local`.
- Node version: see `.nvmrc` (22). The Dockerfile builds with the same major version.

---

## 9. Secrets and security rules

| Rule | Why |
|---|---|
| **No secrets in browser code or in `.env` values the app reads.** Only public URLs and version strings go in `scripts/config/keys.js`. | Parcel copies every `process.env.X` the code reads into the public JavaScript bundle. |
| **Env files are never committed.** `.gitignore` ignores `.env`, `.env.*`, `.envdev`, `.envProdDevBK`; `.dockerignore` keeps them out of the image build (except `.env`, which must hold no secrets). | Git history keeps everything forever. |
| **Docker Hub PAT:** only via `docker login` on each machine. | No PAT in scripts, notes or `.env`. |
| **Strapi admin / API tokens:** server side only (Strapi or tbwww server code). In tbwww never use a `NEXT_PUBLIC_` name for a secret. | `NEXT_PUBLIC_` values are sent to the browser. |
| **Keys and passwords:** only in `$TB/secrets.env` on each server (`chmod 600`), with a copy in your password vault. Passwords are made on the server and never leave it. | They open the database, Strapi and the paid services. |
| **No third-party runtime loads:** all libraries, fonts and icons are bundled. | Offline use and security reviews. |

### If a secret is exposed

1. Revoke / rotate it at the source (Docker Hub, Strapi → API Tokens, Gemini, SendGrid, Stripe).
2. Update the one place it is stored (Docker login, or `$TB/secrets.env` then `03-make-passwords.sh && ./deploy-all.sh`).
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
| `Permission denied` writing files in an environment folder | Folder owned by root | `sudo chown -R $USER: <folder>` |
| `sudo: 'cd': command not found` | `cd` is a shell built-in | Put `sudo` on the command that needs it, not on `cd` |
| `permission denied … /var/run/docker.sock` | User not in the `docker` group | `sudo ./deploy.sh`, or `sudo usermod -aG docker $USER` and log in again |
| Compose: `env file … .env.local` or `.secrets.env not found` | The environment folder is incomplete, or the passwords were never made | `bash $TB/scripts/03-make-passwords.sh`; if `.env.local` is missing, `bash scripts/apply.sh --force <ENV>` on the dev box and push again |
| Strapi: `password authentication failed for user "strapi"` | The `postgres_db` volume is older than this `secrets.env` (an earlier run on this server) | Remove the volume and deploy again, or restore that volume's `secrets.env` (Important note in section 5) |
| New host shows the wrong product or "unknown" | Host missing from `sites.js` and `runtime-config.json` | Add a `sites` row to `runtime-config.json` and recreate the container (or add it to `sites.js` and release) |
| Login / publish fails only on a new host | Strapi CORS | Add `https://<host>` to Strapi's CORS allowlist |
| Offline host: no service worker | Not HTTPS, the certificate is not trusted (`TLS=internal`), or the host lacks `offline: true` | `07-check-urls.sh`; trust Caddy's root certificate (section 6); check `sites.js` / `runtime-config.json` |
| AI (Ask AI, AI Create) answers 502 | `tbhelpapp` not running, or it or `tbrun` is not on the `tbnet` network | `docker ps`, then `docker network inspect tbnet` should list both; `cd $TB && ./deploy-all.sh` (section 19.5) |
| AI answers 401 | User not logged in to the Timebars Cloud, expired login, or helpapp's `STRAPI_URL` is wrong | Log in again; check `STRAPI_URL` in helpapp's `.env.local` |
| AI answers 503 "Could not check your login right now" | helpapp cannot reach Strapi: wrong `STRAPI_URL` (a typo in the hostname), or Strapi down | `docker exec tbhelpapp wget -S -O- <STRAPI_URL>/users/me` should answer 401/403, not an error; fix `.env.local`, then `./deploy.sh` again |
| Page reload fails with no network on an ab / tb / cb host | Expected — those hosts have no offline mode | Use the Refresh button in the top menu, or the agile / pmrm / ppm hosts |

---

## 13. Known issues and follow-ups

- **`PRODUCT_PUBLIC_HOST`** still names the legacy `ab` / `tb` / `cb` addresses. Switch it to the
  new addresses when they become the main ones.
- **User / role sync to Strapi:** to be rebuilt server side — see
  `docsOtherNew/Plan_How_To_Maintain_RBAC_From_ResPool.md`.
- This guide is public; keep infrastructure specifics (addresses, tokens) out of it.
- **Licensing without Strapi:** with no route to Strapi the app never loads a licence, so it shows
  "Unlicensed" and hides the product title (limits are not enforced). Needs licence-file import
  (sections 10.1 and 16.6).
- **Customer hostnames:** resolved for the app (October 2026) — a customer's `runtime-config.json`
  supplies their hosts and backend address without a rebuild (section 2). tbwww and helpapp read
  their addresses from `.env.local` at run time, and Strapi its CORS origins, email sender and public
  URL (`CORS_ORIGINS`, `EMAIL_FROM`, `PUBLIC_URL`; October 2026).
- **Strapi on Node 16** (end of life): the tbbe Dockerfile still builds on `node:16-alpine`; move to 18/20
  after a test build (native modules better-sqlite3 and sharp).
- **AI login:** AI needs a login to the Timebars Cloud (Strapi), checked by helpapp. Sites with no Strapi
  (air-gapped, licence by file) set `AI_REQUIRE_LOGIN=false` in helpapp's `.env.local` and keep it
  reachable only from their LAN.
- **tbwww secrets under `NEXT_PUBLIC_` names — fixed October 2026:** all keys rotated; tbwww has no
  `NEXT_PUBLIC_` values left, every setting is read at run time from `.env.local`, and `.dockerignore`
  keeps every `.env*` file out of the image. Rule (section 9): a secret never has a `NEXT_PUBLIC_` name.
- **Twilio route has no auth check** (`/api/notifications/twilio`, now in helpapp) — see the Text
  Notifications guide. Add a bearer-token check before it is reachable from outside.
- **Sales-site links are hard-coded** to `www.timebars.com` in `index.html` and
  `scripts/tbhtmlcomponents.js` (pricing, knowledge base, spreadsheet downloads). Customers who
  run their own site must change them; better to read them from `WWW_URL`.

---

## 14. Change history

### October 2026 — Container Option V2

| Area | Change | Files |
|---|---|---|
| Deploy | One `tbapps.conf` on a dev box; `apply` makes a ready package per environment (DEV, STAGING, PROD, TRAINING), each on its own server; `deploy-all.sh` runs every server step; passwords made on the server; Caddy proxy with HTTPS for every name, or the customer's own proxy | `tbown` |

### October 2026 — one way to build and deploy every container

| Area | Change | Files |
|---|---|---|
| App image | One image for every host (service worker always built in, on per host via `offline: true`); no `.env` in the build, defaults in `keys.js`, `APP_VERSION` as a build arg; container `tbrun`; legacy `latest` image, `deploy-push-offline.sh` and the repo's box files removed | `Dockerfile`, `.dockerignore`, `deploy-push-to-hub-secure.sh`, `scripts/config/keys.js`, `scripts/offline/*` |
| All images | Date tags (`2026.10.12`), servers pin the tag in `.env`; secrets and addresses in `.env.local`; one `deploy.sh` shape; one network `tbnet`; proxy routes by container name; server files only in `tbown` | tbrunp, tbwww, helpapp, tbbe, tbown |
| tbwww / helpapp | Run-time `config/site.js` (same names in both), only `.env.example` + `.env.local`, no pages built ahead | tbwww, helpapp repos |

### October 2026 — AI service in helpapp

| Phase | Change | Main files |
|---|---|---|
| AI | Six helpapp routes `/api/ai/*` (Gemini key server-side, Strapi login check, size and rate limits). App calls `/ai`, proxied by its nginx to `tbhelpapp` over the Docker network `tbnet`; `aiBaseUrl` in `runtime-config.json`. | `scripts/ai/aiAuth.js`, `scripts/config/keys.js`, `deploy/nginx/*`, `Dockerfile`, `scripts/offline/*`, helpapp repo, `docsOtherNew/Plan_Move_AI_Workers_To_helpapp.md` |

### September 2026 — offline mode, new addresses, security clean-up

| Phase | Change | Main files |
|---|---|---|
| K1 | Removed browser-side Sync Users (it exposed a Strapi admin token); env files untracked; Dockerfile on Node 22 | `scripts/tbloginpublish.js`, `.gitignore`, `.dockerignore`, `Dockerfile`, `docsOtherNew/Plan_How_To_Maintain_RBAC_From_ResPool.md` |
| K1b | Docker Hub credentials removed from the repo; push script uses the saved login | `deploy-push-to-hub-secure.sh` |
| K3 | No CDN loads: Material Icons, Chart.js 4.4.1 and luxon bundled | `index.html`, `index.js`, `scripts/config/vendorGlobals.js`, `css/tbapp.css`, `package.json` |
| K4 | One sites table for every hostname; `DEV_SITE` for local dev | `scripts/config/sites.js`, `scripts/loadtimebarapp.js`, `scripts/tbdatabase.js`, `scripts/tbhtmlcomponents.js`, `scripts/tbLicenseTrimming.js` |
| Fix | OpenProject tab panel no longer shows under every Publishing tab (Tier-3) | `scripts/tbLicenseTrimming.js` |
| R1 | Offline mode (service worker), offline container | `scripts/offline/*`, `deploy-push-offline.sh`, `Dockerfile`, `scripts/config/keys.js`, `scripts/config/sites.js`, `docsHelp/Common_13_Offline_Mode_And_Security.md` |
| Sites | New production and staging hosts (agile/pmrm/ppm, agiles/pmrms/ppms, abs/tbs/cbs) | `scripts/config/sites.js` |
| Docs | Added section 17, Docker configuration and customer setup (roles, typical configuration, seed data) | `docsHelp/Administrators_Guide.md` |
| Docs | Added sections 18–20: handover by purchase option, third-party service set-up notes, to-do list; aligned with the Customer Ownership and Installation Options guide | `docsHelp/Administrators_Guide.md`, `docsHelp/Common_12_Customer_Ownership_Installation_Options.md` |
| Docs / Ops | Option D (service provider); licences with or without Strapi (10.1); air-gapped option choice (16.8); Cloud Run notes dropped | `docsHelp/Administrators_Guide.md`, `docsHelp/Common_12_...`, `docsOtherNew/Study_Licensing_With_And_Without_Strapi.md` |

---

## 15. Building the offline version in your repo

Two ways to produce the offline build from your VS Code clone. Both use the same code; the switch
is `ENABLE_SW=true`, which the Dockerfile always sets.

### 15.1 As a Docker image (normal route)

```bash
./deploy-push-to-hub-secure.sh                # builds, checks the worker and pushes <date tag>
# or build only, without pushing:
docker build -t jimecox807/tbrun:test .
```

### 15.2 As a plain folder of files (any web server)

```bash
npm install
ENABLE_SW=true npx parcel build index.html --no-source-maps
ENABLE_SW=true node scripts/offline/build-sw.mjs dist
```
The result is `dist/`: `index.html`, the bundled JS/CSS/fonts/images and the generated `sw.js`.
The help files are not in it: Ask AI reads `/docsHelp/` and `/ai/` from Timebars Cloud, so that web server
proxies both to helpapp as `deploy/nginx/ai-proxy.conf` does.
The build prints `build-sw: ENABLE_SW=true -> wrote the real sw.js … (offline mode ON)`.

Whichever web server serves `dist/` must:
- serve it over **HTTPS** (or `localhost`) — browsers only run service workers there;
- send `Cache-Control: no-cache` for `/sw.js`, `/index.html` and `/runtime-config.json` (see `scripts/offline/nginx-sw.conf`);
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
| Help library and help documents (the helpapp container, `/docsHelp/` proxied by the app) | **Ask AI** (helpapp container + Gemini) — needs the internet for Gemini, and a login (Strapi); leave unused, or Option C can connect a local model (16.8) |
| Offline reload (service worker) on the customer's HTTPS address | **OpenProject sync** — works only against an OpenProject on their LAN (set its URL on the Publishing page, section 11) |
| | Links to the sales site on www.timebars.com (the spreadsheet downloads come from their own help library, `helpUrl`) |

### 16.2 Prepare a customer build

1. Get the customer's internal address(es), e.g. `timebars.agency.local`, and which product each serves.
2. Write their `runtime-config.json` (section 2) with their host rows and backend address, e.g.
   `{ "host": "timebars.agency.local", "product": "TB", "offline": true }` in `sites`, and ship it in
   the package next to the compose file (mounted read-only). Without a host row the address gets no
   product, no demo data and no offline mode. The standard image is then used as is; steps 3–4 only
   re-tag it for the package.
3. No build settings are needed: addresses come from `runtime-config.json`, never from a `.env`.
4. Tag the release image with the customer and version:
   ```bash
   docker pull jimecox807/tbrun:<tag> && docker tag jimecox807/tbrun:<tag> timebars/tbrun:<customer>-v1
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
cp <tbown>/templates/tbrun/docker-compose.yml .   # set TBRUN_TAG=<customer>-v1 in .env, image name to timebars/tbrun
cp <their runtime-config.json> .
cp <helpapp>/public/docsHelp/Administrators_Guide.md <helpapp>/public/docsHelp/Common_13_Offline_Mode_And_Security.md .
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
docker compose up -d                 # image timebars/tbrun:<customer>-v1, runtime-config.json mounted
```
Then, on their side:
- Put their **HTTPS** reverse proxy / load balancer (with their internal CA certificate) in front of
  the container's port (bound to `127.0.0.1:8687`; publish it on their LAN address if the proxy is on another
  machine). HTTPS is required for offline mode; plain HTTP still runs the app, just
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
| Ask AI | off | a model hosted on their network — for example a local model run with **Ollama** — or their own code in the helpapp routes in place of the Gemini calls (set `AI_REQUIRE_LOGIN=false` if they run no Strapi) |
| Notifications (Pushover, Twilio) | off | integrate with their internal messaging systems |
| Email from Strapi (SendGrid) | point Strapi at the internal mail server | the same, or integrate further |
| Licences | their own Strapi on the LAN, or signed licence files (10.1) | their own Strapi, their own licence files, or no licence checks |
| Payments (Stripe) | not needed | not needed |

---

## 17. Docker configuration and customer setup

> **The customer installation package and its step-by-step guide live in the `tbown` repository**
> (github.com/jimecox2/tbown): `tbapps.conf.example`, `scripts/apply.sh`, the package templates, seed
> data and `DEPLOY_TB_SYSTEM_CONTAINER_OPTION_V2.md`. This section keeps the background: who does
> what, and the reference configuration.

For customers who have bought access to the Timebars Ltd. Docker Hub images, the Strapi code and
the seed data, and who will run their own environments (for example DEV, STAGING, PROD, TRAINING).
Timebars Ltd. (the owner) and the customer each do their own part, listed in section 17.1.

This section holds facts only: no addresses, passwords or tokens (section 9). Keep your own values in
your password manager and private notes.

### 17.1 Who does what

| Step | Timebars Ltd. (owner) | Customer |
|---|---|---|
| 1. Access | Grants pull access to the private Docker Hub images and supplies the Strapi code. | Creates a Docker Hub account and a read access token, and sends the account name to the owner. |
| 2. Servers | Advises on sizing and the reference configuration (section 17.2). | Provides a dev box and one Linux server per environment (section 5). |
| 3. Package | Supplies the `tbown` package: `tbapps.conf.example`, `apply`, templates and scripts. | Fills in `tbapps.conf` and runs `apply` on a dev box (section 5). |
| 4. Names | Explains the six names per environment (section 6). | Decides the names and puts them in `tbapps.conf`; `apply` writes them into every setting, including the app's `runtime-config.json` (section 2). |
| 5. Seed data | Ships the seed database and uploads in the package (section 17.6). | `deploy-all.sh` loads them on each environment's first deploy. |
| 6. Secrets | Lists which keys are needed (`tbown` guide, section 11). | Pastes their own keys on each server; `03-make-passwords.sh` makes every password there. |
| 7. Proxy and DNS | Explains the two proxy choices (section 6). | Creates the DNS records, and opens ports 80/443 for our proxy or routes their own proxy. |
| 8. Go-live checks | Helps check logs and settings. | Adds their hosts to the Strapi CORS allowlist and tests login and publishing (section 12). |

### 17.2 Reference configuration

The configuration the `tbown` package is tested on. Build the same or a similar setup.

| Item | Value |
|---|---|
| Operating system | Ubuntu 26.04 LTS (24.04 also works) |
| Size | 2+ CPU cores, 4 GB RAM with swap, 100 GB SSD |
| Docker | Docker Engine and Compose plugin from Docker's own apt repository (`01-install-docker.sh`); not snap, not rootless |
| Docker data root | `/var/lib/docker` (default) |
| Environment folder | `/docker/compose/tbApps` (`$TB`), one stack folder per container group |
| Login user | an admin user in the `docker` group, so no `sudo` for `docker` commands |

### 17.3 What this means in practice

- **No `sudo` for Docker commands**, because the admin user is in the `docker` group.
- **Compose v2 syntax only:** `docker compose ...` (with a space), not `docker-compose`.
- **Local daemon only.** The `default` context points at the local socket, so commands cannot hit a
  remote host by accident.
- To find a volume's files: `docker volume inspect <volume_name> --format '{{ .Mountpoint }}'` (needs `sudo` to browse).

### 17.4 Stacks

One folder per stack in the environment folder (`$TB/<stack>`), made by `apply` from
`tbown/templates/<stack>/` (section 3 has the files in each folder and the container table).

| Stack | Containers | Notes |
|---|---|---|
| `postgres` | `tbpgdb` (PostgreSQL), `pgadmin4` (optional, profile `tools`) | **External** volumes `postgres_db` and `postgres_pgadmin`. Joins `tbnet`. |
| `tbbe` | `tbbe` (Strapi, "be2") | Database, secrets, public URL, CORS origins and email sender from `.env.local`. Uploads outside the image. |
| `tbwww` | `tbwwwp` | Website, sign-up, profile, orders (tbwww). Addresses and secrets from `.env.local`. |
| `tbhelp` | `tbhelpapp` | Timebars Cloud and the AI service (section 19.5); the app's nginx finds it by this name. |
| `tbrun` | `tbrun` | The app, every hostname (section 3). Addresses in `runtime-config.json`. |
| `proxy` | `tbproxy` (Caddy) | HTTPS for every name (section 6). Not started with `PROXY=own`. |

All join the external network `tbnet` (created by `02-create-volumes.sh`, or `deploy-all.sh`).

### 17.5 Building your environments

Section 5 has the steps and the `tbown` guide every command. Do DEV first and prove it works (`tbown`
guide, section 8), then each next environment on its own server.

- **Secrets are made on each server** by `03-make-passwords.sh`: database passwords and every Strapi
  secret (`APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`),
  different on every server. Keep a copy of each server's `secrets.env` in your password vault.
- **API tokens in the seed data do not work** with your secrets: create a new Strapi API token after
  the first deploy and paste it into `secrets.env` as `STRAPI_ADMIN_TOKEN` (`tbown` guide, section 8).
- **Set your own Strapi admin password** after the first deploy (`tbown` guide, section 8).

### 17.6 Seed data

**Owner:** export from a copy prepared for sharing. Remove any personal data that is not meant to
leave Timebars Ltd. first.

```bash
docker exec tbpgdb pg_dump -U <admin_user> -d <seed_db> -Fc > seed.dump
tar czf seed-uploads.tar.gz -C <tbbe folder>/public uploads
sha256sum seed.dump seed-uploads.tar.gz > seed.sha256
```

The seed is shipped in the `tbown` package (`seed/`). It is from PostgreSQL 14; restore it into 14 or
newer, never an older major version.

**Customer:** `deploy-all.sh` loads it on each environment's first deploy. To load it (or one of your
own backups) by hand: `bash $TB/scripts/04-restore.sh [<dump> <uploads.tar.gz>]`.

### 17.7 Recording your own configuration

Record each server's facts in a table like section 17.2, in your own private notes. Refresh it
after upgrading Docker. Run on each server:

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

### 17.8 Changing versions, and getting help

The typical configuration is a known-good reference, not a requirement. If you change Docker,
Compose, PostgreSQL or the operating system, you are responsible for getting the stack running
again; the owner will guide you.

When you ask for help, send: the output of the commands in section 17.7, `06-health-check.sh`, and `docker logs --tail 100 <container>` for the failing container. Never send
`.env.local` values, tokens or passwords.

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
  service's dashboard (Google, Pushover, Stripe, SendGrid), the customer copies the code
  and settings they need, and recreates them in their own account.
- **Secrets are never handed over.** The customer generates every key and password themselves.
  Templates list variable names only.
- **The customer records what they received** (repo commit, image tags, versions) so
  later questions have a fixed reference.

### 18.2 What each option needs

| Item | A — Subscribe | B — Containers | C — Own the code | D — Service provider |
|---|---|---|---|---|
| Server / VM (19.1) | — | yes | yes | yes |
| Source code from GitHub (19.2) | — | — | yes (one-time copy) | yes (one-time copy) |
| Docker images (19.3) | — | yes | optional (can build their own) | optional |
| PostgreSQL + seed data (17.5) | — | yes | yes | yes |
| Strapi for login and licences (10.1) | — | yes, or signed licence files | their choice | yes |
| Google Gemini key (19.4) | — | if AI wanted (own key) | if AI wanted | if AI wanted |
| AI service: helpapp container (19.5) | — | if AI wanted | if AI wanted | if AI wanted |
| Pushover (19.6) | each user buys the app | if notifications wanted | if notifications wanted | yes |
| Twilio (19.7) | — | if SMS wanted | if SMS wanted | if SMS wanted |
| Stripe (19.8) | — | — | — | yes |
| SendGrid or own mail server (19.9) | — | yes, with Strapi | yes, with Strapi | yes |
| DNS and HTTPS (19.10) | — | yes (our Caddy proxy, or their own) | yes | yes |
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

- **Timebars Ltd. reference:** one DigitalOcean droplet (Ubuntu, small shared-CPU plan) per environment runs all the stacks in section 17.4, behind the Caddy proxy.
- **Customer:** any provider — Google Cloud, AWS, Azure, DigitalOcean — or their own hardware.
  The droplet itself cannot be transferred; build a new server and follow section 5. Use a
  supported Ubuntu LTS (24.04 or 26.04).
- **Minimum size:** 2 CPU cores, 4 GB RAM, 100 GB SSD.
- Basics on day one: SSH keys only (no password login), a non-root user in the `docker` group,
  automatic security updates, only SSH and ports 80/443 open (section 6), and provider
  backups or snapshots switched on.
- `tbown/scripts/00-prep-new-server.sh` does all of that on a new cloud server (`tbown` guide, section 5).

### 19.2 Source code (GitHub) — Option C

Repositories (owner account `jimecox2`):

| Repo | Visibility | Contents |
|---|---|---|
| `tbrunp` | private | the app (AB / TB / CB), app deploy scripts (the AI client code is `scripts/ai/`; the AI server is `helpapp`) |
| `tbwww` | public | Next.js sales site, sign-up, Stripe, notifications, dashboards |
| `tbbe` | public | Strapi backend |
| `helpapp` | public | Timebars Cloud: AI service (`/api/ai/*`, section 19.5), the help library and the help files (master) |
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
5. Customer replaces Timebars Ltd. addresses: `scripts/config/sites.js` (hosts), sales-site links
   (section 13), and `OP_URL_DEFAULT` in `scripts/op/opUrl.js`. (The AI address is `/ai`, same origin, so
   it needs no change.)

### 19.3 Docker images (Docker Hub) — Option B

| Image | Purpose |
|---|---|
| `jimecox807/tbrun` | the app, every hostname |
| `jimecox807/tbwwwp` | website: sales, sign-up, profile, orders |
| `jimecox807/tbbe` | Strapi backend |
| `postgres` (public) | database — not a Timebars image |
| `jimecox807/tbhelpapp` | Timebars Cloud: dashboards, notifications and the AI service (`/api/ai/*`, section 19.5) |
| `jimecox807/nwi` | optional sample customer portal |

Steps: customer creates a Docker Hub account and a **read-only** access token; owner grants that
account pull access to the private repositories; customer runs `docker login -u <their user>` on
each server (section 5). Tags are build dates; every server pins one (`tbown/VERSION.md`), never `latest`.

### 19.4 Google Gemini API (AI)

1. Sign in to Google AI Studio (aistudio.google.com) or the Google Cloud console with the
   customer's own Google account and create (or pick) a project.
2. Make sure the **Generative Language API** (`generativelanguage.googleapis.com`) is enabled under
   *APIs & Services*.
3. Create an API key in AI Studio → *API keys*. Restrict it to the Generative Language API.
4. Turn on billing if usage will pass the free tier, and set a budget alert.
5. The key goes **only** into helpapp's `.env.local` (19.5), `chmod 600` — never into the app, any `.env` the app reads, or git.

The AI routes use the `gemini-2.5-flash` model (set in each route file in helpapp).

### 19.5 AI service (helpapp container)

The AI features (Ask AI help, AI Create, Project Charter fill) run in the **helpapp** container
(`jimecox807/tbhelpapp`, Next.js), with the `gemini-2.5-flash` model.

| Route | What it does | Browser call site in `tbrunp` |
|---|---|---|
| `/api/ai/create-project` | L1 → create a Project (also fills Charter fields) | `scripts/ai/aiCreateProject.js`, `aiCreateUpdateFields.js` |
| `/api/ai/create-wbs` | Project / WP → WBS, tasks, milestones | `scripts/ai/aiCreateWbs.js` |
| `/api/ai/staff-tasks` | assign people to tasks | `scripts/ai/aiCreateStaffing.js` |
| `/api/ai/resource-plan` | resource plan with generic roles | `scripts/ai/aiCreateResourcePlan.js` |
| `/api/ai/bcase` | fill Project Charter / business case | `scripts/ai/timebars-gemini-bcase.js` |
| `/api/ai/help` | Ask AI help answers from `docsHelp/` | `scripts/ai/askHelp.js` |

**How a request travels.** The browser posts to `/ai/<route>` on the app's own address. The app's nginx
(`deploy/nginx/ai-proxy.conf`) forwards it to `http://tbhelpapp:3010/api/ai/<route>` over the
Docker network **`tbnet`**. Same origin, so no CORS and no extra proxy route. With helpapp
stopped, AI answers 502 and the rest of the app is unaffected.

**Security.**
- `GEMINI_API_KEY` is read from the container's environment only (`.env.local`, `chmod 600`, never
  committed, never a `NEXT_PUBLIC_` name). The browser never sees it.
- Every request must carry the user's Timebars Cloud login (`Authorization: Bearer`, the Strapi token).
  helpapp checks it against `STRAPI_URL`/users/me and remembers a good token for one minute. The app keeps
  the token for the browser tab only. No login, or an expired one, gives a 401 with a message.
- Request size is capped (10 MB), and each client address is limited per minute (30 by default).
- `AI_REQUIRE_LOGIN=false` switches the login check off, for sites with no Strapi. Use it only behind a LAN.

**Setting it up (per environment).**
1. A Google Gemini key (19.4), the customer's own.
2. Paste it into `$TB/secrets.env` as `GEMINI_API_KEY=`. `STRAPI_URL` and the other addresses are
   written by `apply`.
3. `bash $TB/scripts/03-make-passwords.sh && cd $TB && ./deploy-all.sh`. The `tbhelp` stack pulls
   `jimecox807/tbhelpapp:<tag>`, starts the container on `tbnet` and checks that `/api/ai/help` answers.
4. Test: log in to the app and use Ask AI. A 502 means helpapp is not running or it or `tbrun` is not on
   `tbnet`; a 401 means the user is not logged in; a 503 "Could not check your login right now" means
   helpapp cannot reach Strapi at `STRAPI_URL` (section 12).

**Image tags.** Same as every image (section 4): `./deploy-push-to-hub-secure.sh` in the helpapp repo
pushes a date tag; `deploy.sh` stores it in `.env` (`HELPAPP_TAG`), so a rollback is `./deploy.sh` with the
previous tag.

**No new address.** AI needs no DNS record and no proxy route of its own: the browser only ever calls
the app's own address.

Settings (names only here): `GEMINI_API_KEY` in `secrets.env`; `STRAPI_URL`, `AI_REQUIRE_LOGIN`,
`AI_RATE_LIMIT_PER_MIN`, `AI_MAX_BODY_BYTES`, `AI_ALLOWED_ORIGINS` (only if a browser calls helpapp
directly instead of through `/ai/`) in `.env.local`. A customer who hosts helpapp elsewhere sets `aiBaseUrl` in their
`runtime-config.json` (section 2).

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

### 19.10 DNS and HTTPS

The package's Caddy proxy (`PROXY=caddy`) gets free Let's Encrypt certificates for public names, or
signs its own for internal names (`TLS=internal`). A customer with a reverse proxy of their own (nginx,
Traefik, a load balancer) and their own certificates sets `PROXY=own`. Section 6 has both. Whatever
is chosen:
- every name is in `tbapps.conf`, so `apply` adds the app names to `runtime-config.json` and every
  name to the Strapi CORS allowlist;
- DNS for every name points at the proxy;
- the app names are served over HTTPS (offline mode needs it).

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

- [x] **Building the server** — `tbown/scripts/00-prep-new-server.sh` and the `tbown` guide, section 5.
- [x] **tbwww environment template** — `.env.example` in the tbwww repo; the `tbown` package writes each environment's settings
      (October 2026). Notifications (Pushover, Twilio) are in helpapp's `.env.example`.
- [ ] **tbbe (Strapi) environment template** — database, secrets, SendGrid / email provider
      settings, CORS allowlist location, first admin user procedure.
- [x] **Compose files for every stack** — in `tbown/templates/<stack>/` only (October 2026).
- [ ] **Stripe (Option D):** webhook route, events used, how an order maps to a Strapi `products`
      row.
- [ ] **Twilio:** finish the website side of the SMS channel, then document it.
- [ ] **Versions:** Strapi, Next.js and Node versions per repo, and their upstream support dates.
- [ ] **Handover checklist** — a one-page sign-off listing commit hashes, image tags and versions
      delivered, and confirming owner access has been removed afterwards.
- [ ] **Agreements** for Options B, C and D (use rights, organisation-wide licence for B,
      white-labelling, warranty, support term; for D the service-provider terms).

- [x] **Strapi full-access token** — `STRAPI_ADMIN_TOKEN`, server only, in tbwww's and helpapp's `.env.local`.
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
| 1 | **AI in helpapp — done October 2026** (section 19.5). The app calls `/ai`, proxied by its nginx to helpapp, which holds the key and checks the login | one place for the AI key, on the customer's own server |
| 2 | **Licence-file import** on the Show License dialog, with signature check for Option B (10.1) | sites without Strapi, and air-gapped sites, get a working licence |
| 3 | **Standalone mode** setting: hides Login, Publish, Purchase, Bulk Update and Re-Publish and makes no backend calls | a clean app for customers who run no Strapi |
| 4 | **Runtime config, all three images — decided October 2026, do before the first customer package.** tbrun: **done** (October 2026, section 2). a `runtime-config.js` mounted read-only into the nginx container and loaded before the app, overriding hostnames → product, `API_URL`, `WWW_URL`, OpenProject default, standalone mode (built-in values stay as defaults; the offline worker caches it). tbwww and helpapp: **done** (October 2026) — no `NEXT_PUBLIC_*`, everything read from `.env.local` at run time. tbbe: **done** (October 2026) — CORS origins, email sender and public URL from `.env.local` | **one set of Docker Hub images for every customer**; each customer supplies config files and `.env` values only; no customer-specific builds |
| 5 | **Sales-site links from `WWW_URL`** instead of hard-coded `www.timebars.com` (section 13) | customers point links at their own site or intranet |
| 6 | **One handover bundle — done in `tbown` (V2)**: `tbapps.conf` and `apply` make a ready package per environment, with the same `deploy.sh` in each stack, `deploy-all.sh` and the seed | stand-up becomes "fill in `tbapps.conf`, apply, push, `./deploy-all.sh`" |
| 7 | **Strapi bootstrap script** that creates the `products` rows and the first admin user | customers start clean instead of restoring Timebars Ltd.'s seed database |
| 8 | **Organisation accounts** for repos and images (e.g. a `timebars` GitHub organisation and Docker Hub organisation instead of the personal `jimecox2` / `jimecox807`) | access is granted and removed per team, and is not tied to one person |
| 9 | **Repo clean-up** before handover: remove `devops/` and review other experimental or obsolete folders (`docsBin/`, `docsOther/`) | less for the customer to read and less to question in a security review |
| 10 | **Twilio route auth check** in tbwww (section 13) | a security reviewer will flag an open SMS endpoint |
| 11 | **Customer repository `tbown`** (github.com/jimecox2/tbown): the V2 deployment guide, `tbapps.conf.example`, the package templates, scripts and release notes; each release tagged, so GitHub's release zip *is* the handover package. Seed data and secrets never go in it (delivered separately, encrypted) | one place a customer clones or downloads; versioned with the image tags it names |
| 12 | **tbwww clean-up — done October 2026**: unused variables and MongoDB / Cloudinary code removed, every secret server-only. Left: scan the repo history for secrets | closes the `NEXT_PUBLIC_` secrets issue (section 13) |
| 13 | **Prod rebuild on Ubuntu 26.04** following the customer install guide (prod runs 24.10, out of support) | prod becomes the first install done exactly as customers do it |
