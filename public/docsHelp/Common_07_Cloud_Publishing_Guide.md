![Timebars Logo](../tbimages/logos/timebars-ltd-logo-final.png)
---

# Cloud Publishing and Bulk Operations Guide

**Applies to**: Agilebars, Timebars, Costbars
**Version**: 2.3
**Last Updated**: 2026-09-26

---

## Table of Contents

1. [Overview](#1-overview)
2. [Account Registration & Subscription](#2-account-registration--subscription)
3. [Logging In to Timebars Cloud](#3-logging-in-to-timebars-cloud)
4. [Publishing Page Interface](#4-publishing-page-interface)
5. [Viewing Pubsets](#5-viewing-pubsets)
6. [Publishing to the Cloud](#6-publishing-to-the-cloud)
7. [Downloading from Cloud to Local (Re-Hydrate)](#7-downloading-from-cloud-to-local-re-hydrate)
8. [Clearing a Published Dataset](#8-clearing-a-published-dataset)
9. [License and Activation](#9-license-and-activation)
10. [Cross-Device Synchronization](#10-cross-device-synchronization)
11. [OpenProject Sync](#11-openproject-sync)
12. [Bulk Update](#12-bulk-update)
13. [Re-Publish with Scheduling Engine](#13-re-publish-with-scheduling-engine)
14. [Support Resources](#14-support-resources)
15. [Quick Reference](#15-quick-reference)

---

## 1. Overview

Cloud Publishing is an **optional feature** that allows you to securely upload your project data from the client applications (Agilebars, Timebars, or Costbars) to the Timebars Cloud. The Cloud Publishing page is the central hub for managing data between your local browser (IndexedDB) and the Timebars Cloud. From here you can:

- **Publish** your local project data to the cloud for sharing and dashboards
- **Download** a published dataset back into your local browser
- **Clear** published data from the cloud
- **Bulk Update** specific fields across multiple published datasets at once
- **Re-Publish** datasets with recalculated scheduling engine data
- **Sync** with OpenProject (external PM system)

Published datasets are called **Pubsets**. Each pubset is a complete snapshot of your project data stored in the cloud. The active pubset feeds your Personal Cloud Dashboard.

**Key Benefits:**
- **Cloud Dashboard Access**: View interactive reports and charts from any device
- **Cross-Device Sync**: Work on one device, continue on another
- **Data Backup**: Secure cloud storage for your project data
- **Team Collaboration**: Share data with stakeholders (requires individual licenses)
- **Real-Time Updates**: Publish changes instantly to the cloud

**Important Notes:**
- Publishing is entirely optional—client apps work fully offline
- Your local data remains in the browser unless you choose to publish
- Cloud Publishing requires an active subscription
- Data is encrypted during transmission (HTTPS/TLS)
- You must log in each session — credentials are not saved or persisted

---

## 2. Account Registration & Subscription

### Create an Account

1. **Register**: Visit www.timebars.com/register, provide your email address and create a secure password, then click "Register"
2. **Verify Email**: Check your email for the verification link and click it to confirm your account

### Choose a Subscription Plan

1. Navigate to www.timebars.com/pricing and review available subscription tiers
2. Select a plan based on your needs — you can purchase up to 10 PubSets depending on tier
3. Complete the credit card transaction; your license activates automatically
4. Log in at www.timebars.com/login to view subscription details and manage PubSets

**Subscription Includes:**
- Client application license (Agilebars, Timebars, or Costbars)
- Cloud Publishing capabilities
- Cloud Dashboard access
- Number of PubSets based on tier
- Technical support

---

## 3. Logging In to Timebars Cloud

### Steps

1. Navigate to the publishing page from the main menu (**Main Menu > Publish**)
2. You will land on the **Login** tab
3. Enter your **Email** and **Password**
4. Click **Cloud Login!**

### What Happens

- Your credentials are validated against the Timebars Cloud authentication service
- On success, a green message appears: *"Login successful! Your pubsets are loaded."*
- After 1 second the page switches to the **Pubsets** tab showing your datasets
- The Pubsets (Cards) and Pubsets (Table) tabs become visible

**Note:** The cloud login is a **secondary login** separate from your local app login, providing an additional security layer. Your data requires both local app login AND cloud login to access.

### Important Notes

- You must log in each session — credentials are not saved or persisted
- No cookies or tokens are stored between sessions
- If you try to access other tabs before logging in, you will be redirected back to the Login tab

---

## 4. Publishing Page Interface

### Tab Navigation

The publishing page has six tabs:

| Tab | Visible | Purpose |
|-----|---------|---------|
| **Login** | Always | Cloud authentication |
| **Pubsets (Cards)** | After login | Card-style view of your pubsets |
| **Pubsets** | After login | Table view with sorting and filtering |
| **OpenProject** | Tier-3 licenses only | Sync projects, bars and people with OpenProject (see section 11) |
| **Bulk Update** | Always | Bulk data operations across pubsets (an Administrator works across the whole customer — see section 12) |
| **Re-Publish** | Always | Download, recalculate, and republish (Administrator: whole customer — see section 13) |

**Tier-1 licenses** include no pubsets, so the Publish icons (main menu, canvas toolbar and the dashboard **Publish!** button) are hidden and the Publishing page is not available.

Click any tab button to switch. The active tab is highlighted with a blue underline.

### Top Navigation Bar

The blue navigation bar at the top of the publishing page provides quick actions:

| Button | Action |
|--------|--------|
| **Show License** | Displays your current license tier, product code, and expiration date |
| **Recalculate All** | Runs all system calculations (hierarchy names, rollups) to ensure data accuracy before publishing |
| **Dashboard** | Opens your Personal Cloud Dashboard in a new browser tab |
| **Purchase** | Opens the Timebars pricing page to buy or upgrade a license |
| **Sync Users** | Admin-only: syncs resource pool data to portal user accounts |
| **Close** (X icon) | Closes the publishing page and returns to the main application |

---

## 5. Viewing Pubsets

After logging in, your pubsets are displayed in two views:

### Card View

- Shows each pubset as a card with its name and action buttons
- The **active pubset** (the one feeding your Cloud Dashboard) has a **blue background**
- Use this view for a quick visual overview

### Table View

- Shows all pubsets in a sortable, searchable table
- Columns: Active status, Pubset Name, ID, Published Date, Published By, Customer ID, Actions
- Click column headers to sort; use the search box to filter by name, owner, or customer ID
- The active pubset is highlighted in blue
- Action buttons for each pubset: **Download**, **Publish**, **Clear**

---

## 6. Publishing to the Cloud

Publishing takes all your local project data and uploads it to a pubset in the cloud.

### Prerequisites

- Active Timebars Ltd. subscription
- Client application installed and running
- Project data created in the client application
- Internet connection
- Logged into the client app locally (gold icon, top right) AND the cloud (see Section 3)

### Steps

1. Go to the **Pubsets** tab after logging in
2. Click the **Publish** button next to the target pubset
3. Enter a name for the pubset when prompted (or keep the existing name)
4. Wait 3–5 seconds for publishing to complete

### What Gets Published

All six data stores are uploaded:

| Store | Content |
|-------|---------|
| **tbTimebars** | Tasks, projects, milestones, allocations (scheduling data) |
| **tbMetaData** | Extended metadata: descriptions, status, priority, assessments |
| **tbResources** | Resource definitions (people, roles, teams) |
| **tbTags** | Picklist tag definitions with colours and groupings |
| **tbFields** | Dynamic form field configurations |
| **tbCoreReport** | Report configurations and settings |

After the stores are published, the system also updates RBAC fields (role-based access control) and enterprise metadata (customer ID, access grants).

### Dashboard PubSet vs Storage PubSets

- **Blue Background PubSet** — your **Dashboard PubSet**: directly connected to the Cloud Dashboard. Publishing here updates all dashboard reports and charts immediately.
- **White Background PubSets** — **Storage PubSets**: used for backup and cross-device synchronization. Publishing here does **not** update the dashboard.

**Best Practice:** Use the blue Dashboard PubSet for day-to-day work. Use white PubSets for backups and snapshots.

### After Publishing

- A green toast notification confirms: *"Publishing complete, go to dashboard to see results!"*
- Your data is immediately available in the Personal Cloud Dashboard

---

## 7. Downloading from Cloud to Local (Re-Hydrate)

Downloading restores a published dataset from the cloud into your local browser.

### Steps

1. Go to the **Pubsets** tab
2. Click the **Download** button next to the pubset you want to restore
3. Confirm by entering **y** when prompted: *"Over-write local data?"*
4. Wait for the download to complete

### Important

- **This overwrites all your local data** with the cloud pubset's data
- If you cancel (enter **n**), your local data is not affected
- All six stores are replaced with the downloaded data
- The tbMdJoined table is automatically rebuilt after download
- No page reload is required — views update automatically
- Ensure you have published any unsaved local work before re-hydrating

---

## 8. Clearing a Published Dataset

Clearing removes all data content from a pubset in the cloud while keeping the pubset container.

### Steps

1. Go to the **Pubsets** tab
2. Click the **Clear/Delete** button next to the pubset
3. Confirm the action when prompted

### What Happens

- All six store fields are set to empty arrays
- The pubset container (name, owner, dates) is preserved
- You can publish new data to the same pubset later
- Your local IndexedDB data is **not affected**
- If the cleared pubset was the active pubset, the Cloud Dashboard will show empty data

---

## 9. License and Activation

### License Tiers

| Tier | Products | Pubsets | Features |
|------|----------|---------|----------|
| **Tier-1** | ABT01, TBT01, CBT01 | 0 | Local only — no cloud publishing; Publish icons are hidden |
| **Tier-2** | ABT02, TBT02, CBT02 | per product | Cloud publishing |
| **Tier-3** | ABT03, TBT03, CBT03 | per product | Cloud publishing plus OpenProject sync |

The exact numbers for each product are on the pricing page. They come from your
purchased product and are downloaded each time you log in (gold icon, top right):

| License limit | What it counts |
|---------------|----------------|
| **Bars** | Every row below the Project level — Sub-Projects, Tasks, Allocations, Milestones, Gates, Risks, Issues and Notes |
| **Projects** (Backlogs in Agilebars) | L2 Project bars |
| **Cloud Pubsets** | How many pubsets you own — missing ones are created each time you log in to the cloud |
| **Spreadsheets** / **Training** | Shown in **Show License**; not enforced by the app |

A blank limit means unlimited. When a limit is exceeded, the New Bar menu is hidden and
publishing is disabled until you remove rows or upgrade. Log in again after an upgrade so
the new limits are downloaded.

### Activation (One-Time Setup)

Pubsets are created automatically when you log in to the cloud on the Publishing page.
Each cloud login re-reads your license and tops your pubsets up to the number it includes:

1. On your first login the system creates all your pubset containers
2. The first pubset is marked as active (feeds the Cloud Dashboard)
3. Remaining pubsets are inactive (for backup or testing)
4. After an upgrade, the next cloud login adds the extra pubsets (inactive)

Pubsets are never deleted automatically — after a downgrade you keep the ones you have.
Only the person who purchased the license gets pubsets created; team members see the
pubsets shared with them. After activation, your PubSets are permanent until you manually clear them.

### Viewing Your License

Click **Show License** to see your product code, expiration date and license limits:

```
TBT02,expires on: 31-Dec-2026, Bars 500, Projects 10, Pubsets 2, Spreadsheets 2, Training: Not included
```

---

## 10. Cross-Device Synchronization

The Timebars Cloud enables seamless work across multiple devices.

### Scenario: Work on PC, Continue on iPad

**On Your PC (Primary Device):**
1. Work on your project data normally
2. Choose **Main Menu > Publish** and log in to cloud service
3. Click **Publish** on your Dashboard PubSet (blue background)

**On Your iPad (Secondary Device):**
1. Open the same client app and log in locally (gold icon, top right)
2. Choose **Main Menu > Publish** and log in to cloud service
3. Click **Download** on the Dashboard PubSet — your project data loads
4. Continue working where you left off

**Syncing Changes Back:**
- After making changes on the iPad, click **Publish** to sync back to the cloud
- Back on the PC, click **Download** to get the latest changes

**Key Rules:**
- Always publish after making changes
- Always download before starting work on a different device
- Downloading will overwrite local data — save any local work first

### Real-Time Dashboard Access

After publishing, click the **Dashboard** button in the top nav bar, or visit www.timebars.com/dashboard from any browser. The dashboard is touch-optimized and works on tablets and phones.

---

## 11. OpenProject Sync

The **OpenProject** tab on the Publishing page connects Timebars to an OpenProject
instance and moves data in either direction, one project at a time. It is available on
**Tier-3 licenses only** (ABT03, TBT03, CBT03); on other licenses the tab is hidden.

Before anything syncs, three things have to be true: Timebars knows which instance to
talk to, the two systems agree on what each field is called, and the project has a
declared owner. The tab is laid out in that order — the scenario checkboxes at the top
for day-to-day running, the **OpenProject Integration** buttons below them for the
set-up and repair work you do less often.

---

### A note on wording: projects, and everything under them

OpenProject calls **every** scheduled row beneath a project a *work package*. Timebars
does not — it has levels, and the level is what decides where a row goes:

| Timebars | Becomes, in OpenProject |
|---|---|
| **L2 Project** (green bar) | an OpenProject **project** |
| **L3 Sub-Project** (orange bar) | a row of type **L3 SP/WP** |
| **L4 Task** | **L4 Task** |
| **L4 Task** with subtype Risk / Issue / CR | **L4 Risk** / **L4 Issue** / **L4 CR** |
| **L4 Milestone** | **L4 Milestone** |
| **L5 Allocation** (gold bar) | **L5 Allocation**, carrying the assignee |

An OpenProject user who says "work package" almost always means what Timebars calls a
**Sub-Project** — the L3 row, which is why its OpenProject type is named `L3 SP/WP`. The
rest of this section says *Sub-Project*, *Task* and *Allocation* rather than *work
package*, because those are the words on your bars.

**L1 Portfolio does not travel.** OpenProject has no type for it. A sync run always
starts at a Project and covers everything under it.

---

### 11.1 Point Timebars at your instance

| Control | What it does |
|---|---|
| **OpenProject URL** | The instance every sync talks to. Type `op.yourcompany.com` — the scheme and any trailing slash are tidied for you. Saved to your settings as the admin panel row **`apOpUrl`**, so it survives a reload and a change of instance no longer needs a rebuild. Leave it empty and the build-time default is used. |
| **Test Connection** | Reads your identity and the instance's type list. It confirms the API key works and prints the work package type ids this instance actually has. Run it first, every time; almost every "nothing happened" report starts here. |

Types are matched **by name at run time, never by id** — a customer's `L5 Allocation`
is not necessarily id 13 — so a type renamed in OpenProject admin stops resolving until
the name matches again.

---

### 11.2 The four scenarios

Each project has a **sync master**: the side that owns it, held in `tbMDSyncMaster`.
The create steps set it; the update steps refuse to run against a project the other way
round, and name the button to press instead. Changing master is a deliberate edit on the
project, not something a run does behind you.

| | Timebars is master | OpenProject is master |
|---|---|---|
| **Create** | **A1** — create the project and every row under it in OpenProject | **B1** — create the project and every bar under it in Timebars |
| **Update** | **A2** — update OpenProject, creating anything missing | **B2** — update Timebars, creating anything missing |

Tick the box and you are asked for the project id — a Timebars `tbID` for A1 and A2, an
OpenProject project id for B1 and B2. Each run previews what it will do and asks once
before writing.

There is **no separate bulk-create step**. A2 and B2 create what is missing as part of
the update, so a project that has grown since the last run does not need a different
button. A row that has been deleted on the master side is **reported, never deleted** on
the other — removals stay a human decision.

**A2 recalculates the hierarchy and rollups before it sends**, so the numbers that reach
OpenProject are the ones the app would show you.

Every run writes its progress into the feedback list under its own checkbox, and every
row it could not carry is named with the reason. Read those lines before assuming the
run worked.

---

### 11.3 The Integration buttons

| Button | Reads | Writes | When to use it |
|---|---|---|---|
| **Test Connection** | OpenProject | nothing | first, and whenever a run behaves oddly |
| **Discover OP Configuration** | OpenProject | nothing — four CSVs to your Downloads folder | after any field or picklist change in OpenProject admin |
| **Reconcile with OpenProject** | OpenProject | tbSchema, tbTags and tbResources in Timebars, plus five CSVs | straight after Discover, and after every OpenProject configuration change |
| **Create OP Users & Groups** | tbResources | OpenProject users and groups | when setting up people, once the resource pool has emails |
| **Create "All Users" Group** | OpenProject | an *All Users* group holding everybody | when a permission has to be granted to everyone at once |

**Discover** walks the Project, Work Package and User schemas and writes nothing at all —
it is safe to run any time.

**Reconcile** is the one that closes the loop. It matches every Timebars field and every
picklist value against OpenProject **by name**, and records the ids it finds. Those ids
are per-instance — your `customField107` is not another customer's — so they are never
typed by hand, and reconciling them from the live instance is the entire point of the
button. It previews, then asks before writing, and it changes IndexedDB only. Take a
backup first if you want a way back.

Two things Reconcile deliberately does **not** do:

- **It never writes to OpenProject.** OpenProject's API cannot create a custom field or a
  picklist value, so those are added in its admin screens — Reconcile tells you which ones
  are missing and downloads the list.
- **It never sets Sync Yes/No.** Whether a field travels is your decision, held in the
  workbook; an id is a fact about the instance, and Reconcile now records one for every
  field that declares a mapping whether or not that field is switched on.

---

### 11.4 Where the field mapping lives

The mapping is **data, not code**. Two workbook sheets own it, and two reports in the app
show it.

**The Schema sheet** (`tbSchema`) is the master field list — one row per field in the
system. Alongside each field's label, type and purpose it carries the OpenProject columns:

| Column | Meaning |
|---|---|
| `tbSchOpSyncYN` | **Sync Yes/No** — whether this field travels at all. Yours to set; nothing else writes it |
| `tbSchOpTableName` | which level it maps at — Project, WP, or Users |
| `tbSchOpFormat` | OpenProject's own type for the field, which decides the payload shape. `Formattable` is what routes a rich text field onto the markdown path |
| `tbSchOpFieldName` | the field's **label** in OpenProject — the name its admin UI shows |
| `tbSchOpInternalName` / `tbSchOpInternalNameWP` | the `customFieldNN` ids, at project and work package level. **Written by Reconcile, never by hand** |

**The Tags sheet** (`tbTags`) does the same for every picklist value: `tbTagOpFieldName`
and `tbTagOpInternalName` say which OpenProject field the value belongs to, and
`tbTagOpTagName` / `tbTagOpCustomOptionID` hold the value's own name and id in OpenProject
— again filled in by Reconcile.

In the app, both are visible and partly editable:

| Report | Where | What you can do |
|---|---|---|
| **Schema Values** | Report Menu → Other | Search and filter the whole field list; **OP Field** and **OP Internal** are shown and locked, because the picklist values join to them and a rename here would orphan them. Label, purpose, width, alignment, Validate and Mandatory are editable |
| **Picklist Values** | Report Menu → Other | Filter to one picklist and open a value. Its **OpenProject Mapping** section lets you pick **OP Field** and **OP Internal** from the names the Schema table owns; **OP Value** and **OP Custom Option ID** are read-only, because OpenProject owns those |
| **Config Integrity** | Report Menu → Other | The standing check across Schema, Tags, Fields and CoreReport. Run it after every spreadsheet import — the drift it finds never throws an error on its own |

`Sync Yes/No`, the level and the format are **workbook columns and are not editable in the
app**, on purpose: turning a field on or off is a configuration decision that has to
survive the next spreadsheet import, and the workbook is what both stores are rebuilt from.

> **The loop to remember.** Discover and Reconcile write to the browser's database and to
> your Downloads folder. The workbook is what Timebars is rebuilt from on the next import.
> Until the reconciled ids are pasted back into the Schema and Tags sheets, the next import
> throws the reconciliation away. That is what `tbSchemaForWorkbook.csv` and
> `tbTagsForWorkbook.csv` are for.

---

### 11.5 Two things that travel outside the mapping

Almost everything the sync sends is a **custom field** in OpenProject, and the Schema sheet
says where each one goes. Two project attributes are not custom fields, and so cannot be
described in the Schema sheet at all:

| In OpenProject | What it is |
|---|---|
| **Description** | the block of text at the top of the project overview page |
| **Status** | the coloured chip beside the project name — On track, At risk, Off track and three more |

These are OpenProject **built-ins**. The Schema sheet's internal-name columns hold
`customFieldNN` ids, Reconcile regenerates them from what OpenProject reports about its
*custom* fields, and a built-in appears nowhere in that walk — so a built-in name typed into
the workbook by hand would be wiped by the next Reconcile run. Both are therefore written by
the sync itself, and **the workbook needs no change for either**.

**This is in addition to the mapping, not instead of it.** `tbMDDescription` still travels to
the *TB Description* custom field and `tbMDHealth` still travels to *Schedule Status*, exactly
as before. What changed is that the same two values now also fill the OpenProject built-ins,
so a project reads correctly to somebody looking at the stock OpenProject page who has never
heard of Timebars.

**Description.** The project's `tbMDDescription` is converted to markdown and written to the
OpenProject description. A blank description is **not** sent — an update will not wipe text
somebody typed in OpenProject just because the Timebars field has not been filled in yet.

**Status** comes from the project's **Health** (`tbMDHealth`, the *Schedule Status* picklist),
not from Timebar Status. OpenProject's project status answers *"is this project in trouble"*
rather than *"what stage is it at"*, which is the question Health answers too:

| Timebars Health | OpenProject project status |
|---|---|
| On schedule | On track |
| Early | On track |
| Slipping | At risk |
| Late | Off track |
| Blocked | Off track |
| Completed | Finished |
| Not Assessed | Not started |

The seven values above are the whole table, and it is **fixed in code**. OpenProject's six
project statuses are a closed set it does not let an administrator add to, so unlike a work
package status there is no id to reconcile and nothing that can drift.

A Health value outside that list — one added to the Tags sheet but not to the table above —
is reported in the run's feedback list and in its anomaly CSV. What happens then depends on
the scenario: **A1** creates the project as *On track*, and **A2** leaves the project's
status in OpenProject exactly as it is rather than resetting it. The same applies to a
project whose Health is blank.

**Work packages are not affected.** Their own description and status fields are untouched by
this and continue to travel only as the custom fields the Schema sheet names. A work package
status in OpenProject is an administrator-defined, per-instance list with numeric ids — a
different problem from the fixed six above, and not one this table speaks for.

---

### 11.6 The CSV files, and what each one is for

Every button and every run downloads its findings, so you are never reading a mapping
problem off a screen. All of them land in the browser's Downloads folder.

**From Discover — what OpenProject actually holds:**

| File | What it answers |
|---|---|
| `opFields.csv` | every custom field on this instance, at every level |
| `opCustomOptions.csv` | every picklist value on this instance |
| `opFieldComparison.csv` | only the fields where OpenProject and `tbSchema` **disagree** |
| `opTagComparison.csv` | only the picklist values where OpenProject and `tbTags` **disagree** |

The two comparison files are the ones to open first: they are short by design, and a field
that is not in them is a field that is already fine.

**From Reconcile — what to do next:**

| File | What it answers |
|---|---|
| `tbSchemaForWorkbook.csv` | the **whole** Schema sheet in sheet column order, ids filled in. Paste it over the sheet, below the header rows |
| `tbTagsForWorkbook.csv` | the same for the Tags sheet |
| `opFieldsToCreate.csv` | the fields a Timebars row names that this instance does not have. **Admin-UI work** — the API cannot create them |
| `opRemainingWork.csv` | the picklist values still to add in OpenProject. Same — admin UI |
| `opUnmatchedPeople.csv` | resources with no matching OpenProject user, so an assignee cannot be set |
| `currentOPFormFieldConfigStatus.csv` | **every field each work package type must have on its OpenProject form** - where the requirement comes from, whether `tbSchema` maps it, and whether the form exposes it today. The list to configure a type's form from |

The two workbook files are written **whether or not** you confirm the write into Timebars,
because they describe what would change either way.

**From a run — what did not carry:**

`opSyncAnomalies_A1.csv`, `_A2.csv`, `_B1.csv`, `_B2.csv` — one row per thing worth knowing
about that run, at three severities:

| Severity | Meaning |
|---|---|
| **blocked** | did not sync. Something has to change before it will |
| **guessed** | synced, but on a fallback rather than an exact match. Worth a look |
| **note** | nothing was lost; worth knowing |

A run whose anomalies are all notes is a clean run. The same lines are printed on screen as
the run goes, so the CSV is the copy you can sort, filter and send to whoever owns the fix.

---

### 11.7 When a field will not sync

Almost every "the field is empty in OpenProject" report is one of five things, and the
files above name which:

1. **`Sync Yes/No` is not `Yes`** on that `tbSchema` row. Nothing else is wrong; the
   workbook has decided the field does not travel.
2. **The field does not exist in OpenProject yet** — it is in `opFieldsToCreate.csv`. Add
   it in OpenProject admin, then Reconcile.
3. **The labels disagree.** Matching is by label, so `Cost Centre` against `Cost Center`
   resolves at neither level. `opFieldComparison.csv` lists exactly these.
4. **The field exists but is not on that type's form.** OpenProject refuses a value for a
   field the type does not expose, so the run drops it and says so. Fixing it is
   **Administration → Work packages → Types → *type* → Form configuration**, by hand —
   OpenProject has no API for form configuration. A run names each such field **once**, at
   the top, and only for fields that belong on that type; `currentOPFormFieldConfigStatus.csv`
   from Reconcile is the full list, type by type.
5. **A picklist value has no option id** — it is in `opRemainingWork.csv`. Add the value in
   OpenProject admin, then Reconcile.

Order of operations, whenever anything changes on either side: **change it → Discover →
Reconcile → paste the two workbook CSVs back into the sheets → run A2 or B2.**

---

### 11.8 Formatted text fields

43 metadata fields hold formatted text — descriptions, executive summaries, options
analyses and the rest of the Charter and Assessment content. They are stored in Timebars in
the editor's own format and **converted at the sync boundary**: Timebars sends markdown,
and markdown coming back is converted for display. Nothing reaches OpenProject as raw
markup, and no formatting has to be re-typed.

Two things follow from that:

- **Set those fields to *Long text* in OpenProject.** A field left as single-line *Text*
  has its formatting flattened on purpose, because markdown syntax in a one-line box is
  noise. Change the field's type in OpenProject admin and re-run Reconcile — it upgrades
  itself, with no code change.
- **A round trip loses underline and colour.** Headings, lists, bold, italic, links, quotes
  and code survive in both directions; markdown cannot carry the other two. Everything else
  comes back as it went.

---

## 12. Bulk Update

The Bulk Update tab lets you modify data across multiple pubsets simultaneously without downloading and re-publishing each one individually.

### Who You Are Working As

The top of the Bulk Update and Re-Publish tabs states who is logged in and their role,
taken from the resource pool (the person's **Primary Role** and **Customer ID** in
tbResources, matched by the login email).

| Role | What **Load Pubsets** loads |
|------|-----------------------------|
| **Administrator** (shown in red) | **Every** pubset for the administrator's Customer ID, whoever owns it, plus the administrator's own — so one person can bulk update and re-publish for the whole customer |
| Anyone else | Only the pubsets you own |

The **Published Since** date narrows either list. Each loaded pubset shows its owner.
An Administrator's changes are written to each pubset in place — the owner does not change.

### Getting Started

1. Go to the **Bulk Update** tab
2. Choose an **Update Mode** (see modes below)
3. Select the **Target Store** you want to update
4. Optionally set a **Published Since** date to filter which pubsets are shown
5. Click **Load Pubsets** to fetch your available pubsets from the cloud
6. Check the boxes next to the pubsets you want to update (or use Select All)
7. Configure the mode-specific options (see below)
8. Click **Apply Bulk Update**
9. Confirm the operation in the dialog

---

### Mode 1: Complete Replacement (JSON File)

**Use case**: Replace the entire contents of a store with data from a prepared JSON file.

**Steps**:
1. Select **Complete Replacement (JSON file)** mode
2. Choose the target store from the dropdown
3. Click **Load Pubsets** and select which pubsets to update
4. Upload a JSON file containing the replacement data
5. The preview shows: file name, size, and record count
6. Click **Apply Bulk Update** and confirm

**JSON file format**:
```json
[
  { "tbID": "A001", "tbName": "Task One", "tbWork": 40 },
  { "tbID": "A002", "tbName": "Task Two", "tbWork": 80 }
]
```

The file must contain a JSON array of objects. The entire store content on each selected pubset is replaced with this array.

---

### Mode 2: Filter and Set

**Use case**: Find records matching a specific value in a field and change that field to a new value. Ideal for bulk metadata updates like changing status, priority, or category across many pubsets at once.

**Available stores**: tbMetaData and tbResources only.

**Steps**:
1. Select **Filter & Set (no file needed)** mode
2. The **Target Store** defaults to tbMetaData
3. The **Published Since** date defaults to one month ago
4. Click **Load Pubsets** and select which pubsets to update
5. If tbMetaData is selected, a **Set Values by Type** filter appears — choose All Types or a specific type (Portfolio, Project, Sub-Project, Task, Milestone, or Allocation)
6. Select a **Field Name** from the dropdown (populated from your Tags definitions in the local database)
7. Select the current value in **Where Value Equals**
8. Select the replacement value in **Set To New Value**
9. Click **Apply Bulk Update** and confirm

**Example**: Change the priority of all Tasks from "Low" to "Medium" across 5 pubsets:
- Store: tbMetaData | Type filter: Task | Field Name: tbMDPriority | Where Value Equals: Low | Set To New Value: Medium

**How the dropdowns are populated**:

| Dropdown | Data Source |
|----------|------------|
| **Field Name** | Local tbTags store, filtered by prefix (tbMD for tbMetaData, tbRes for tbResources) |
| **Where Value Equals** | Unique values found in the actual pubset data for the selected field. Includes **(Blank)** for empty/null values. Respects the type filter. |
| **Set To New Value** | Tag values from the local tbTags store where tbTagTbInternalName matches the selected field |

---

### Mode 3: Row-Level Patch (CSV File)

**Use case**: Update specific rows identified by their unique ID, changing one or more fields per row.

**Steps**:
1. Select **Row-Level Patch (CSV file)** mode
2. Choose the target store from the dropdown
3. Click **Load Pubsets** and select which pubsets to update
4. Upload a CSV file with your updates
5. The preview shows: file name, size, row count, column names, and a sample row
6. Click **Apply Bulk Update** and confirm

**CSV file format**:
```
tbMDID,tbMDStatus,tbMDPriority
A001,Complete,High
A002,In Progress,Medium
A003,Not Started,Low
```

**Rules**:
- The first column must be the store's unique key (tbID for tbTimebars, tbMDID for tbMetaData, tbResID for tbResources, etc.)
- Only the fields listed in the CSV are changed; all other fields on the record are preserved
- Rows in the pubset that don't match any CSV key are left unchanged

---

### Bulk Update Results

After execution, a results table appears:

| Column | Content |
|--------|---------|
| **Pubset Name** | Name of the pubset |
| **ID** | Strapi record ID |
| **Status** | success or failed |
| **Detail** | "Replaced" (Mode 1), "X rows matched" (Mode 2), "X rows patched" (Mode 3), or error message |

- Green background: all pubsets succeeded
- Red background: one or more pubsets failed (check Detail column for error)

---

## 13. Re-Publish with Scheduling Engine

The Re-Publish feature downloads pubsets from the cloud, runs the PM scheduling engine to recalculate all derived data (dates, hours, costs, percent complete, rollups, resource demand), then publishes the refreshed data back to the cloud.

### When to Use

- After a bulk update that changed fields affecting calculations (e.g. status, work hours, dates)
- To refresh derived data across many pubsets without manually opening each one
- When the scheduling engine or rollup logic has been updated and you want all pubsets recalculated

### Steps

1. Go to the **Re-Publish** tab
2. Optionally set a **Published Since** date filter
3. Click **Load Pubsets** — an Administrator gets every pubset for their Customer ID (see *Who You Are Working As* in section 12)
4. Select the pubsets you want to re-publish (checkboxes or Select All)
5. Choose which calculation steps to run (all checked by default):
   - **Scheduling Engine** — recalculates dates, hours, costs, and percent complete for allocations
   - **Rollups & Hierarchy** — rolls up costs and hours from children to parents, rebuilds L1–L5 hierarchy names, regenerates the tbMdJoined table
   - **Resource Calculations** — regenerates weekly and monthly resource demand data (tbResCalcs2, tbResCalcsUsage)
6. Click **Execute Re-Publish**
7. Confirm the operation in the dialog
8. Watch the progress log as each pubset is processed

### The 5-Step Pipeline (per pubset)

| Step | Operation | Description |
|------|-----------|-------------|
| **1** | Download to IDB | Fetches the pubset from cloud and loads all stores into local IndexedDB |
| **2** | Scheduling Engine | Runs `calcCostWorkTBCB()` on allocations to recalculate dates, hours, costs, and percent complete |
| **3** | Rollups & Hierarchy | Runs `performFullSystemUpdate()` to roll up values through the hierarchy and rebuild joined tables |
| **4** | Resource Calculations | Runs `createUnifiedWeeklyUsageData()` to regenerate weekly/monthly resource demand splits |
| **5** | Publish Back | Runs `publishToTimebarsCloud()` to upload all stores, then updates RBAC and enterprise metadata |

Steps 2, 3, and 4 can be individually enabled or disabled via the checkboxes.

### Progress Log

A dark terminal-style log panel shows timestamped entries as each step executes:

```
[14:23:45] --- Starting pubset: Project Q4 (ID: 123) ---
[14:23:46] Step 1: Downloading pubset data to IndexedDB...
[14:23:48] Step 1 complete: Data loaded into IDB
[14:23:50] Step 2: Running scheduling engine on allocations...
[14:23:53] Step 2 complete: Scheduling engine finished
[14:23:54] Step 3: Running rollups, hierarchy, and joined table rebuild...
[14:23:56] Step 3 complete: Rollups and hierarchy rebuilt
[14:23:57] Step 4: Regenerating resource calculations...
[14:23:59] Step 4 complete: Resource calculations regenerated
[14:24:00] Step 5: Publishing all stores back to cloud...
[14:24:04] Step 5b: Updating RBAC and enterprise metadata...
[14:24:05] Pubset "Project Q4" re-published successfully!
```

- **Blue text**: Start/end markers | **Green text**: Successful step | **Orange text**: Warnings | **Gray text**: Skipped steps | **Red text**: Fatal errors

### Processing Notes

- Pubsets are processed **one at a time** (sequential) to avoid database conflicts
- Typical time per pubset: 20–25 seconds with all calculation options enabled
- Your local IndexedDB will contain the data from the last processed pubset when complete
- Toast notifications confirm each pubset as it completes

---

## 14. Support Resources

### Knowledge Base
- Browse articles at www.timebars.com/knowledgebase
- Search for specific topics or error messages
- View step-by-step tutorials and videos

### Customer Support
- **Email**: jcox@tbcox.com
- **Support Tickets**: www.timebars.com/support
- **Response Time**: 24–48 hours (varies by subscription level)
- **Phone**: (613) 255-5374

### Feature Requests
- Email: jcox@tbcox.com with a detailed description and use case
- All requests are reviewed for the product roadmap

---

## 15. Quick Reference

### Publishing Workflow

```
1. Log in to client app (gold icon, top right)
2. Main Menu > Publish
3. Cloud Login (email + password)
4. PubSets are created (or topped up) for you on each cloud login
5. Click Publish next to blue PubSet (Dashboard PubSet)
6. View Dashboard button or www.timebars.com/dashboard
```

### Cross-Device Workflow

```
Device A:
1. Make changes
2. Main Menu > Publish → Publish (to save to cloud)

Device B:
1. Main Menu > Publish → Download (to get latest from cloud)
2. Make changes
3. Main Menu > Publish → Publish (to save changes back)

Device A:
1. Main Menu > Publish → Download (to get Device B's changes)
```

### Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| Cannot log in to cloud | Check email/password; verify subscription at www.timebars.com/login |
| Publishing hangs | Wait 10+ seconds; check browser console for errors |
| Data not in dashboard | Ensure you published to the **active** pubset (blue highlight) |
| Re-Hydrate fails | Check "Last Published" date on pubset — if empty, pubset has no data |
| "No pubsets found" (Bulk Update) | Adjust or clear the Published Since date filter |
| Field Name dropdown empty (Bulk Update) | Ensure local tbTags store has definitions with matching tbTagTbInternalName prefix |
| Pubset is empty (Re-Publish) | Pubset has been cleared — publish data to it first |
| OpenProject run does nothing | Run **Test Connection** first; check the OpenProject URL field (`apOpUrl`) |
| A field is empty in OpenProject | Check `Sync Yes/No` on its Schema row, then `opFieldComparison.csv` for a label mismatch |
| A picklist value will not sync | It has no option id — see `opRemainingWork.csv`, add it in OpenProject admin, then Reconcile |
| A2 or B2 refuses to run | The project's sync master is the other side. Use the other button, or change the master on the project |
| Reconciled ids disappear after an import | The two workbook CSVs were not pasted back into the Schema and Tags sheets |
| Project status in OpenProject looks wrong | It comes from the project's Health, not Timebar Status — see the table in section 11.5 |

---

*Cloud Publishing and Bulk Operations Guide v2.2 — Timebars Ltd.*
