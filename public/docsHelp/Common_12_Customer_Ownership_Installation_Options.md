![Timebars Logo](../tbimages/logos/timebars-ltd-logo-final.png)
---

# Customer Ownership and Installation Options

**Who this document is for:** enterprise and solution architects, IT infrastructure
leads, security and compliance reviewers, and the technical decision-makers who
have to answer two questions before a project management platform can be approved:

> **What exactly are we buying, and where does it run?**

This document answers both. It is deliberately explicit about hardware, skills,
effort and the assumptions behind each option, so you can size the commitment
before committing to it rather than after.

## Contents

1. [What the platform is](#1-what-the-platform-is)
2. [The two questions: ownership, and hosting](#2-the-two-questions-ownership-and-hosting)
3. [Option A — Subscribe: use the hosted service](#3-option-a--subscribe-use-the-hosted-service)
4. [Option B — Managed containers on your infrastructure](#4-option-b--managed-containers-on-your-infrastructure)
5. [Option C — Own the source code](#5-option-c--own-the-source-code)
6. [Option D — Become a service provider](#6-option-d--become-a-service-provider)
7. [Where it runs: cloud, on-premises, air-gapped](#7-where-it-runs-cloud-on-premises-air-gapped)
8. [Third-party services, licences and users](#8-third-party-services-licences-and-users)
9. [Side-by-side comparison](#9-side-by-side-comparison)
10. [Choosing: a decision path](#10-choosing-a-decision-path)
11. [Why this architecture carries little long-term risk](#11-why-this-architecture-carries-little-long-term-risk)
12. [Moving between options](#12-moving-between-options)
13. [Support and contact](#13-support-and-contact)

---

## 1. What the platform is

The Timebars suite covers three project management disciplines from **one
codebase**. All three products are runtime-configurable — a single deployment
serves all three simultaneously, switched per user by a setting.

| Application | Discipline | Core capability |
|---|---|---|
| **Agilebars** | Agile sprint planning | Backlog, Kanban board, burndown charts, sprint scheduling |
| **Timebars** | Resource scheduling | Drag-and-drop allocation, multi-project timelines, working-day scheduling |
| **Costbars** | Project portfolio management | Prioritisation and scoring, portfolio analytics, pipeline scheduling |

Two architectural facts shape every option below, and are worth stating up front
because they are unusual:

**The client application is browser-local.** Project data lives in the browser's
own IndexedDB database. The application works fully offline — no server round trip
is required to open a plan, drag a bar, or run a report. There is no application
server in the data path for day-to-day work.

**Everything else is optional.** The backend, the cloud dashboard, publishing and
notifications are additional services you may or may not deploy. A user with only
the client application has a complete, working product; they simply do not have
team sharing or cloud dashboards.

The practical consequence for an architect: **the deployment footprint is small,
and the blast radius of a server outage is limited.** If the backend is down,
planners keep working.

**Plans are files you keep, like a Microsoft Project `.mpp`.** The application
writes full backup files to the user's Downloads folder automatically (before every
import and sync, and whenever the user asks) and syncs plans to spreadsheets. Those
files go into your document management system alongside your other project records.
See the *Data Synchronization, Backup, Recovery and Retention* guide.

---

## 2. The two questions: ownership, and hosting

Most vendor evaluations conflate these. Keep them separate and the choice becomes
straightforward.

### Question 1 — What do you acquire?

Four answers, in increasing order of control and of commitment:

| | You acquire | You are responsible for |
|---|---|---|
| **Option A — Subscribe** | a subscription to the hosted service | nothing operational |
| **Option B — Containers** | pre-built, versioned Docker images | infrastructure and operations |
| **Option C — Source code** | a one-time copy of the complete source (three repositories, plus two optional) | development, build pipeline, infrastructure and operations |
| **Option D — Service provider** | the source plus the right to sell subscriptions to others (special arrangement) | everything in C, plus sales, payments, licensing and support for your own customers |

### Question 2 — Where does it run?

Options B and C both run **wherever you choose**: your public cloud tenancy, a
VPS, your own data centre, or a fully air-gapped network. The suite has no
proprietary infrastructure dependency and no phone-home licensing — licences come
from the backend (Strapi) that you run yourself, or from a licence file (section
8.1) — so hosting is
genuinely your decision rather than a menu the vendor controls. Section 7 covers
this. Some optional features do call third-party services (AI, notifications,
email, payments); section 8 lists them so you can decide which to keep.

> **The two questions are independent.** Choosing Option B does not commit you to
> a cloud provider, and choosing Option C does not oblige you to run your own
> metal.

---

## 3. Option A — Subscribe: use the hosted service

**The zero-installation option**, and the right starting point for most
organisations even if they intend to end up elsewhere.

Users run the client application from Timebars Ltd.'s hosted site. Project data
stays in their browser. When a team needs to share, they **publish** a dataset to
the Timebars Cloud, which feeds the Personal and Enterprise Dashboards and drives
notifications.

**What you get**
- The three client applications, no installation
- Timebars Cloud publishing and dashboards
- Text notifications (each recipient installs the Pushover app, a small one-time
  purchase)
- Ask AI features, run through Timebars Ltd.'s AI service (Google Gemini)
  *(moving to the Timebars website in an upcoming release — see section 8)*
- Updates and fixes as they ship, with nothing for you to deploy

You do not need any of the third-party accounts in section 8 — Timebars Ltd.
operates them.

**What to check before choosing it**
- Published datasets are stored on Timebars Ltd. infrastructure. If your data
  residency, classification or procurement rules prohibit that, publishing is the
  part that will not pass review — the client application itself still holds data
  only in the user's browser.
- Cross-device access depends on publishing, so a policy against it also removes
  that convenience.
- Text you send to **Ask AI** is processed by Google Gemini through Timebars Ltd.'s
  AI service. If your policy does not allow that, do not use Ask AI.

**Effort:** none. **Team:** none. **Time to first use:** minutes.

> **Use it to evaluate, whichever option you expect to land on.** It costs nothing
> in infrastructure and lets your PMs assess the product properly while the
> architecture review runs in parallel.

---

## 4. Option B — Managed containers on your infrastructure

Timebars Ltd. builds, tests and publishes versioned Docker images. Your team pulls
them, deploys them to your infrastructure, and runs the environment. Application
code is maintained by Timebars; **infrastructure, configuration and operations are
yours.**

This is the right choice when the platform must run inside your perimeter and you
do not want to allocate a development team to it.

### What Timebars Ltd. delivers

- Pull access to the private images, granted to **your own** Docker Hub account
  (you log in with your own read-only access token — Timebars Ltd. does not share
  its credentials)
- A customer image tag that includes **your** hostnames (the app recognises the
  addresses it serves; a new address needs a new image tag from Timebars Ltd.)
- The installation package (`tbown`): Docker Compose configuration for the complete stack,
  install / backup / restore scripts, seed data and a step-by-step installation guide
- Environment configuration templates
- Setup and configuration documentation
- Ongoing image updates covering minor fixes and stability improvements
  *(new product features are not included in the standard agreement)*
- Custom feature development under a separate professional services engagement

### The three containers

| Container | Purpose |
|---|---|
| `jimecox807/tbrun` | the Timebars / Agilebars / Costbars client application |
| `jimecox807/tbwwwp` | website and Cloud Dashboard |
| `jimecox807/tbbe` | Strapi backend services |

A deployment is these three containers plus a database (the public PostgreSQL
image, or a managed PostgreSQL service).

Two optional images are also available: `jimecox807/tbhelpapp` (a sample help
application) and `jimecox807/nwi` (a sample customer portal). Neither is needed to
run the products.

You also choose which third-party services to connect — AI, notifications,
email, payments, DNS/tunnel. Each needs **your own** account and keys
(section 8). Without them the core products still run; those features stay off.

### System requirements

**Hardware — minimum for production**
- 2 CPU cores
- 4 GB RAM
- 100 GB SSD
- Internet access for the initial image pull *(see [air-gapped](#air-gapped-and-restricted-networks) for the alternative)*

**Software**
- Docker Engine 24+ with the Compose v2 plugin (`docker compose`)
- A currently supported Linux server release (for example Ubuntu 22.04 or 24.04
  LTS, RHEL 9). The images are Linux containers; Windows and macOS are suitable
  for evaluation, not production hosting
- PostgreSQL 14+ — a container, or a managed database service (the seed data is
  a PostgreSQL 14 dump and restores into 14 or newer)

**Network**
- Ports 80 and 443, plus any you configure
- DNS for your domain names
- TLS certificates (Let's Encrypt is the straightforward route)

### Team and skills

**Initial deployment — 1 to 2 people, 4 to 8 hours**

A **DevOps engineer or systems administrator** covering: Docker and Docker
Compose, DNS and TLS, Linux or Windows Server administration, reverse proxy
configuration (Nginx, Apache or Traefik), and environment variable management.

A **database administrator** is optional but recommended for production —
PostgreSQL setup, backup procedures and initial tuning, 2 to 4 hours.

**Ongoing operations**

| Role | Responsibilities | Typical weekly commitment |
|---|---|---|
| Systems administrator | container health, logs, image updates, backups, security patching | 2–5 hours |
| Database administrator | backups, maintenance windows, performance, integrity | 1–3 hours |

### Deployment outline

1. Authenticate to Docker Hub
2. Pull the images
3. Configure environment variables and secrets
4. Provision PostgreSQL
5. Deploy the stack with the supplied Compose configuration
6. Configure reverse proxy routing and TLS
7. Verify all services are running and communicating
8. Perform initial application configuration and user setup
9. Establish monitoring, alerting and scheduled backups

### What to weigh

- Application code and the feature roadmap remain with Timebars Ltd.
- Updates are a pull and a restart of the affected containers
- **Customisation is configuration only** — the application code is not accessible.
  New hostnames need an image built for you by Timebars Ltd.
- In an air-gapped network, Ask AI and notifications are not available with
  Option B, because connecting them to internal systems needs code changes (Option C)
- Receiving updates requires Docker Hub access, which matters for air-gapped sites

---

## 5. Option C — Own the source code

The complete source, delivered once as a copy for your own Git host, plus the
build and deployment scripts Timebars Ltd. uses. Your development team builds the
applications, sets up its own pipeline, and operates production. **You own the
product.**

Choose this when you need to modify the platform itself — scheduling logic, data
model, UI, integrations, reporting — or when operating independently of a vendor's
roadmap is itself the requirement.

### What Timebars Ltd. delivers

- Time-limited read access to the GitHub repositories so you can clone them
  (VS Code is the recommended tool), then push the copy to your own Git host —
  GitHub, GitLab, Bitbucket or an internal server
- Docker Compose configuration and deployment scripts
- Environment configuration templates for every component (variable names only —
  you generate your own secrets)
- Setup and configuration documentation, including the *Administrators Guide*
- A supervised handover of the third-party services in section 8: Timebars Ltd.
  shows you its configuration and you copy what you need (worker code, settings)
  into **your own** accounts
- Custom feature development under a separate professional services engagement

The code is a **one-time delivery**. After handover, updates, security patches and
dependency upgrades are yours; further fixes from Timebars Ltd. are by separate
agreement.

### The repositories

| Repository | Technology | Purpose |
|---|---|---|
| `tbrunp` | Vanilla JS, Parcel | the three client applications, the AI worker source, app deploy scripts |
| `tbwww` | Next.js | website, sign-up and payments (Stripe), notifications, Personal and Enterprise dashboards |
| `tbbe` | Strapi, PostgreSQL | backend API: login, licences, publishing, registration email |
| `helpapp` *(optional)* | Next.js | sample help application, including an example of calling Gemini from Next.js instead of Cloudflare Workers |
| `nwi-ghub` *(optional)* | — | sample customer portal |

### The deployment pipeline

A standard three-zone pattern any experienced engineer will recognise on sight.

**Zone 1 — Development.** Your team works the source, builds features, and
validates against a local staging environment before anything advances. Commits go
to your own Git host — GitHub, GitLab or Bitbucket.

**Zone 2 — CI to a registry.** Every push triggers your pipeline: build the
images, run lint and tests, push tagged versions to your registry. This is the
controlled handoff. Nothing reaches production without passing it.

**Zone 3 — Production.** The production host pulls the current image and runs the
applications as containers, behind a reverse proxy handling routing and TLS, with
PostgreSQL persisting data. AWS, GCP, Azure, Hetzner, DigitalOcean or bare metal —
**no proprietary dependencies and no vendor-controlled infrastructure in the
path.**

### AI-accelerated customisation

The codebase is structured and documented to be navigable by AI coding tools. This
materially changes the economics of owning it: a team can orient in an unfamiliar
codebase far faster than by traditional review, implement targeted changes to
scheduling logic or data models in days rather than weeks, and generate tests
alongside features.

The practical result is that a small, capable team can have a working customised
version in days to a few weeks, depending on how deep the modifications go —
without needing deep expertise in every layer before they start.

### System requirements

**Hardware — minimum for production**
- 2 CPU cores
- 4 GB RAM
- 100 GB SSD *(builds run on your developers' machines, not the production host)*

**Software**
- Node.js 22 LTS (the version the client application builds with), NPM, Git
- Docker Engine 24+ with the Compose v2 plugin
- PostgreSQL 14+
- A currently supported Linux server release for production; any OS for
  development

**Build tooling** *(included in the repositories)* — Parcel for `tbrunp`, Next.js
build tooling for `tbwww`, Strapi build dependencies for `tbbe`.

### Team and skills

**Initial deployment — 2 to 4 people, 24 to 48 hours**

| Role | Skills | Effort |
|---|---|---|
| Full-stack developer | JavaScript/Node.js, Next.js, Strapi, jQuery, NPM, Parcel, Git | 16–32 h |
| DevOps engineer | provisioning, CI/CD, reverse proxy, TLS, Docker, environment management | 12–24 h |
| Database administrator | PostgreSQL setup, schema management, backup and recovery, tuning | 8–16 h |
| QA specialist *(recommended)* | web and API testing, integration, browser compatibility | 16–24 h |

**Ongoing operations**

| Role | Responsibilities | Typical weekly commitment |
|---|---|---|
| Full-stack developer | features, bug fixes, dependency updates, integrations, build maintenance | 10–40 h *(scales with customisation)* |
| DevOps engineer | pipeline maintenance, monitoring, security updates, scaling, DR | 5–15 h |
| Database administrator | backup verification, migrations, performance, integrity | 3–8 h |

### Deployment outline

1. Clone the repositories and push them to your own Git host
2. Install Node.js, NPM and dependencies
3. Configure environment variables per component
4. Provision and configure PostgreSQL
5. Create your own third-party accounts for the services you keep (section 8)
6. Build each component — `tbrunp` (Parcel), `tbwww` (Next.js), and `tbbe` (Strapi)
7. Deploy to containers or directly to web servers
8. Configure reverse proxy routing and TLS
9. Stand up your CI/CD pipeline
10. Test across all three products
11. Configure monitoring, logging, alerting and backups

### What you gain

**Complete control.** Data models, scheduling logic, UI, reporting, integrations —
all modifiable. No vendor feature flags, no API rate limits, no roadmap dependency.

**One-time acquisition.** No per-seat fees and no subscription that grows with
headcount. Ongoing cost is your own team's time.

**Data sovereignty.** The application runs entirely on your infrastructure. Data
transits a third-party service only where you choose to connect one — AI,
notifications, email or payments (section 8) — and you can replace or remove each
of those.

**White-label ready.** The codebase can be rebranded for internal deployment or
integration into a broader offering. Selling the products to other organisations as
a service is Option D.

**No vendor sunset risk.** When you own the source, the product cannot be
discontinued beneath you. This is not theoretical — Microsoft is retiring the
cloud-based Project Online on 30 September 2026, forcing its users into migrations
they did not choose on a timeline they did not control. (The on-premises Project
Server Subscription Edition is not affected and is supported until at least 31
December 2031.) Pricing
changes, acquisitions or discontinuation at the vendor level have zero impact on a
deployment you own.

**A proven foundation.** The scheduling engine, data structures and spreadsheet
integration are production-tested. Your team customises a working product rather
than speculating about whether a complex scheduling system can be built.

### What to weigh

- Your team owns all updates, security patches and dependency maintenance
- Build expertise across Node.js, Next.js, Strapi and Docker is required
- The source carries Timebars Ltd.'s own service addresses (website links,
  OpenProject default). Your team replaces them with yours as part of setup
- Initial setup is more involved than Option B — budget for the pipeline and
  testing phases specifically
- **Depth of customisation drives the timeline.** A straightforward deployment
  moves quickly; significant workflow modification does not

---

## 6. Option D — Become a service provider

Options A to C are for organisations that use the products themselves. **Only
Timebars Ltd. sells subscriptions** to the products. An organisation that wants to
offer Agilebars, Timebars and Costbars to *its own* customers as a paid service
needs a special arrangement with Timebars Ltd.

**What it is:** Option C — the complete source, delivered once — plus the right to
run the sales site, take payments and issue licences to other organisations. As
part of the arrangement Timebars Ltd. retires its own hosted service.

**What it adds to Option C**
- The sales and sign-up site (`tbwww`) with **Stripe** payment processing, so
  customers can buy and renew subscriptions online
- Licence issuing through Strapi (orders and products), including tiers and limits
- Notifications, email and dashboards run for many customer organisations, not one
- Your own support, billing, terms of service and privacy obligations to your
  customers

**What to weigh**
- You become the vendor: uptime, security, data protection and support for other
  organisations' data are your responsibility
- A Stripe account, tax set-up and the commercial terms are yours
- Plan this with Timebars Ltd. from the start — the handover of the running service
  is planned together

---

## 7. Where it runs: cloud, on-premises, air-gapped

Options B, C and D impose no hosting constraint. The stack is containers, a reverse
proxy and PostgreSQL — a shape every hosting environment supports.

### Public cloud

Google Cloud, AWS, Azure, DigitalOcean (which Timebars Ltd. uses for its own
service) or any VPS provider. Run PostgreSQL as a container or use the
provider's managed database service — RDS, Azure Database for PostgreSQL, Cloud
SQL — whichever your organisation already standardises on. Nothing in the
application depends on a particular provider's services.

### Your own data centre

The same stack on your own hardware or virtualisation platform. The minimum
production footprint is modest enough — 2 cores, 4 GB RAM, 100 GB SSD — that it
usually fits existing capacity rather than requiring a purchase.

### Hybrid

Because the client application is browser-local, a common arrangement is to run
the backend and dashboards centrally while planners work entirely in their
browsers, syncing on their own schedule. Server outages do not stop planning work.

### Air-gapped and restricted networks

Options B and C both run in environments with no internet access, restricted
perimeters, or policies against third-party vendor dependencies. **Option C is the
better fit for an air-gapped network**, because the features that normally use an
internet service can be reconnected to internal systems only by changing code.

Once the images or source have been delivered and your environment is configured,
the suite runs entirely on your infrastructure with **no ongoing external
connections required** for planning, reporting, publishing, dashboards and login.
There is no phone-home licensing mechanism and no vendor system in the data path:
licences are read from the Strapi backend you run on your own network, or from a
licence file (section 8.1).

Features that depend on an internet service need an internal equivalent:

| Feature | Option B in the gap | Option C in the gap |
|---|---|---|
| **Ask AI** (Google Gemini) | not available | connect a model you host — for example a local model run with Ollama — or your own code |
| **Notifications** (Pushover, Twilio) | not available | integrate with your internal messaging systems |
| **Registration email** (SendGrid) | point Strapi at your internal mail server | point Strapi at your internal mail server, or integrate further |
| **Payments** (Stripe) | not needed | not needed |

The one operational consideration: **updates have to be carried in.** For Option B
that means transferring new images across your boundary by whatever controlled
process you already use; for Option C, the repository updates. Neither requires a
live connection from the running system.

Organisations with data residency obligations, government or defence network
constraints, or internal policy requiring full infrastructure independence can
deploy with confidence — Option C where AI or notifications are required inside the
gap.

---

## 8. Third-party services, licences and users

The platform is built from open-source software plus a small number of external
services. **For Option A you need none of these** — Timebars Ltd. runs them. For
Options B, C and D, this is the full list, so you can decide which to keep, replace or
leave off. Every service you keep runs under **your own account and keys**: Timebars
Ltd. never shares its logins, and you should not run production on another
organisation's account. The *Administrators Guide* has the set-up steps for each.

| Service | What it does in the platform | Option B | Option C | Without it |
|---|---|---|---|---|
| **Virtual machine or server** (Timebars Ltd. uses one DigitalOcean VM) | hosts the containers | required — any provider or your data centre | required — any provider or your data centre | — |
| **GitHub** | where the source is delivered | — | required once, to clone; then your own Git host | — |
| **Docker Hub** | where the images are delivered | required, to pull images | optional — you can build and use your own registry | — |
| **PostgreSQL** (public image) | backend database | required | required | — |
| **Google Gemini API** | the AI model behind Ask AI | optional | optional | Ask AI unavailable |
| **Cloudflare Workers** | run the six small AI services today (create project, WBS, staffing, resource plan, business case, help assistant) — being replaced, see below | Timebars Ltd.'s workers | optional — or host the same logic in Next.js (`helpapp` shows how) | Ask AI unavailable |
| **Pushover** | push notifications to managers' phones | optional | optional | no push alerts |
| **Twilio** | SMS (Costbars escalation; a fuller SMS channel is planned) | optional | optional | no SMS |
| **SendGrid** (part of Twilio) | registration and account email from Strapi | optional — or your own mail server | optional — or your own mail server | no sign-up email |
| **Stripe** | online purchase of subscriptions on the website | not needed | not needed | — *(required only for Option D)* |
| **Cloudflare DNS and Tunnel** | public addresses and HTTPS without opening inbound ports | optional — any DNS, reverse proxy and TLS | optional — any DNS, reverse proxy and TLS | use your own proxy and certificates |
| **OpenProject** (open source) | optional two-way sync partner (Tier 3) | optional — your own instance | optional — your own instance | no OpenProject sync |
| **Lucidchart, Mermaid** | diagrams in the design documentation | — | optional, for your own documentation | — |

Questions to settle in your architecture review:

- **Which data leaves your network?** Ask AI sends prompt text and project
  context to Google Gemini; notifications send project names and status to
  Pushover or Twilio; registration email sends addresses to SendGrid.
- **Who pays and who owns the account?** Each service bills the account holder.
- **What replaces a service you leave off?** Most have a self-hosted or
  internal alternative, noted above.

> **Planned change to Ask AI.** The AI features are moving off Cloudflare Workers
> into a new service with similar features inside the Timebars website (`tbwww`,
> Next.js). The AI code will be removed from the client application, which will
> link users to the website for AI. After the change, AI needs no Cloudflare
> account: the Gemini key (or your own model) is configured on the website server
> only. Option B and C customers receive this as part of the release that carries it.

### 8.1 Licences and users

Every user of the client application needs a licence: the product (Agilebars,
Timebars or Costbars), the tier, the limits and an expiry date. There are two ways
to deliver it.

**With Strapi (the standard way).** Your administrator adds each user in the Strapi
backend and gives them an *order* — product, tier, expiry. The user logs in once in
their browser and the licence is loaded. Strapi also provides publishing, the
dashboards and notifications, and lets you renew or revoke licences centrally.

**Without Strapi (licence by email).** If you only need the planning application —
no publishing, dashboards or notifications — you can leave Strapi out entirely. Each
user receives a small licence file by email and imports it once in the
application. Renewal is a new file before the expiry date. *(Licence-file import is
being added to the product; until it ships, a deployment without Strapi shows as
unlicensed.)*

| | With Strapi | Licence by email |
|---|---|---|
| You run | Strapi, PostgreSQL, a mail service | nothing beyond the web server |
| Adding a user | add the user and an order in Strapi | send a licence file |
| Renew / revoke | centrally, at any time | new file; expiry dates do the rest |
| Publishing, dashboards, notifications | yes | no — share plans as spreadsheets and backup files |

Who issues the licences:

- **Option B:** whoever runs Strapi controls its licences, so an Option B purchase
  covers your organisation as a whole. Without Strapi, Timebars Ltd. issues signed
  licence files.
- **Option C:** you own the code, so you choose — run Strapi, issue your own licence
  files, or remove the licence checks altogether.
- **Option D:** you issue licences to your customers through Strapi and Stripe.

---

## 9. Side-by-side comparison

| | **A — Subscribe** | **B — Containers** | **C — Own the code** | **D — Service provider** |
|---|---|---|---|---|
| **What you acquire** | a subscription | versioned Docker images | full source, one-time copy | full source plus the right to sell subscriptions |
| **You are responsible for** | nothing operational | infrastructure and operations | development, build, infrastructure, operations | everything in C, plus sales, billing and support for your customers |
| **Where data lives** | browser; published data on Timebars infrastructure | your infrastructure *(plus any third-party services you connect, section 8)* | your infrastructure *(plus any third-party services you connect, section 8)* | your infrastructure, holding your customers' data |
| **Third-party accounts you need** | none | your own, for the services you keep | your own, for the services you keep | your own, including Stripe |
| **Licences** | from Timebars Ltd. | your Strapi, or signed files from Timebars Ltd. | your choice (section 8.1) | you issue them |
| **Customisation** | configuration | configuration | unlimited | unlimited |
| **Branding** | standard | standard | full white-label | full white-label |
| **Updates** | automatic | pull a new image | your own team (code is a one-time delivery) | your own team |
| **Time to first deployment** | minutes | 4–8 hours | 24–48 hours | by arrangement |
| **Initial team** | none | 1–2 | 2–4 | 2–4, plus commercial and support staff |
| **Ongoing effort** | none | 3–8 h/week | 18–63 h/week *(scales with customisation)* | more than C — you run a service for others |
| **Suits air-gapped** | no | yes *(without AI and notifications)* | yes — best fit *(AI and notifications via internal systems)* | no — a public service |
| **Vendor sunset exposure** | yes | partial *(you keep running images you hold)* | none | none |
| **Cost shape** | subscription | acquisition + operations | acquisition + your team | special arrangement |

---

## 10. Choosing: a decision path

Work down this list. The first "yes" is usually your answer.

**1. Must the data never leave your infrastructure?**
Rules out Option A's publishing features. Go to B or C.

**2. Do you need to modify the product itself** — scheduling logic, data model,
integrations with internal systems, or a white-labelled build?
**Option C.** Nothing else provides it.

**3. Is independence from vendor roadmap and vendor survival a stated
requirement** — for procurement, compliance, or long-term risk policy?
**Option C.** Owning the source is the only structural answer.

**4. Must it run inside your perimeter, but standard functionality is
sufficient?**
**Option B.** You get the deployment control without the development commitment.

**5. Do you want to sell the products to other organisations as a service?**
**Option D**, by special arrangement with Timebars Ltd.

**6. None of the above?**
**Option A.** Start there. It costs nothing in infrastructure, and you can move
later.

### A recommended sequence

Most organisations that end at B or C are better served by getting there in two
steps rather than one:

1. **Evaluate on Option A** while the architecture review runs. Your PMs assess
   whether the product fits how they actually work — which is the question that
   decides everything, and the one an architecture review cannot answer.
2. **Deploy B or C** once the product is proven and the requirement is clear.

The reverse order — standing up infrastructure before anyone has confirmed the
product suits the team — puts the expensive step first.

---

## 11. Why this architecture carries little long-term risk

Architects reviewing a platform properly ask what happens in five or ten years.
Three answers:

**Built on the open web stack.** JavaScript, HTML and CSS running in a browser.
Not a proprietary runtime, not a vendor-controlled framework, not a
platform-specific technology. JavaScript is the most widely used programming
language in the world, browsers are permanent infrastructure, and the standards
are governed by open industry bodies. There is no realistic path to deprecation.

**PostgreSQL, with no licensing exposure.** Over 35 years of active development,
governed by an independent community and a non-profit association. No single
company owns it; no vendor can change its licensing or discontinue it. Consistently
among the top four databases globally, used in production by Apple, Instagram,
Spotify and thousands of enterprises. No per-core fees, no enterprise-edition
paywall, and a large global talent pool.

**Containers and a reverse proxy.** The deployment pattern is the industry
default. Any engineer you hire in the next decade will recognise it.

The combination means the skills to run this are the skills your team already has
or can readily hire, and none of the foundations depend on the commercial survival
of a particular vendor.

---

## 12. Moving between options

The options are a progression, not a lock-in, and movement is supported in both
directions.

| Move | What is involved |
|---|---|
| **A → B** | export your data, stand up the containers, import. The client application and data model are identical. |
| **A → C** | the same, plus setting up your own build and deployment. |
| **B → C** | the largest step, and the one to plan properly: you take on building, deploying and developing the product yourself. The runtime architecture does not change. |
| **C → B** | supported, though rarely wanted — you give up the modifications you made. |
| **C → D** | by special arrangement: add the sales site, Stripe and licence issuing. |

Timebars Ltd. provides migration assistance between options if requirements
change. Because data moves as standard JSON and spreadsheet formats, no proprietary
export step is involved.

---

## 13. Support and contact

All options include:

- Deployment documentation
- Configuration templates and environment examples
- Technical support during initial setup
- Knowledge base access
- Migration assistance between options

For technical questions, onboarding support, or to discuss a specific deployment:

**Jim Cox**
Timebars Ltd.
**Phone:** (613) 255-5374
**Email:** jcox@tbcox.com

---

## Related documents

| For | See |
|---|---|
| Publishing, pubsets and the cloud dashboards | *Cloud Publishing Guide* |
| Moving data in and out, and backup strategy | *Data Synchronization Backup Recovery And Retention User Guide* |
| Bringing data over from an existing system | *Getting Started* — its data-migration chapter |
| Configuring the product once it is running | *Forms, Reports and Graphs Guide* |
| Standing up Options B and C, and setting up each third-party service | *Administrators Guide*, and the installation guide in the `tbown` package |
| Offline mode and notes for security reviewers | *Offline Mode and Security* |
| Notifications (Pushover, Twilio) | *Text Notifications User Guide* |
| The AI features | *How To Use Ask AI* |

---

*Supersedes: Customer Installation Options, and Products Installation For On Prem.*
