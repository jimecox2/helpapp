![Timebars Logo](../tbimages/logos/timebars-ltd-logo-final.png)
---

# Welcome!

Feel free to use our apps for free with full functionality. If you know project
management, no training is needed, but this guide can save you time.

- **Our Products**: These are web pages designed to enhance productivity for project
  management practitioners. No installation required — launch them in your browser:
  - [ab.timebars.com](https://ab.timebars.com)
  - [tb.timebars.com](https://tb.timebars.com)
  - [cb.timebars.com](https://cb.timebars.com)

The free version limits **how much** data you can hold, not what you can do with it.
Every feature is available from the first minute.

This guide covers two things: how to get a subscription, and — the larger job — how to
get your existing project data out of whatever system holds it today and into ours.

## Table of Contents

1. [Getting Started with a Subscription](#getting-started-with-a-subscription)
2. [Getting Started with Your Data](#getting-started-with-your-data)
   - [What data transformation means](#what-data-transformation-means)
   - [Why a straight copy never works](#why-a-straight-copy-never-works)
   - [Three ways in: pick your path](#three-ways-in-pick-your-path)
   - [Tools for the job](#tools-for-the-job)
3. [Migrating Your Data to the Timebars Ltd Suite](#migrating-your-data-to-the-timebars-ltd-suite)
   - [1. Who this part is for](#1-who-this-part-is-for)
   - [2. How data gets into the application](#2-how-data-gets-into-the-application)
   - [3. The five source tables](#3-the-five-source-tables)
   - [4. Tables you must not populate](#4-tables-you-must-not-populate)
   - [5. ID strategy and hierarchy wiring](#5-id-strategy-and-hierarchy-wiring)
   - [6. Field formats, and how to check every field](#6-field-formats-and-how-to-check-every-field)
   - [7. Step-by-step migration](#7-step-by-step-migration)
   - [8. Validation checklist](#8-validation-checklist)
   - [9. Post-migration setup](#9-post-migration-setup)
   - [10. Where to go next](#10-where-to-go-next)

---

# Getting Started with a Subscription

Everything to do with buying, registering and getting oriented lives in one place:

> ### **[www.timebars.com/sales/quick-start](https://www.timebars.com/sales/quick-start)**

Go there to register an account, choose a subscription, and start using the apps as a
licensed user. The same page carries the **product presentations and feature
descriptions** for Agilebars, Timebars and Costbars, so it is also the right first stop
if you are still deciding which product fits your work.

**What a subscription changes:** it raises the data limits. Your projects, tasks and
resources are untouched by the upgrade — you log in, the license downloads automatically,
and you carry on with a larger allowance.

The rest of this guide assumes you have the app open, and turns to the harder question:
getting your data in.

---

# Getting Started with Your Data

Creating a few bars by hand takes seconds. Bringing across a portfolio that already
exists somewhere else is a different exercise, and it is worth understanding what it
actually involves before you start.

This part of the guide is **general** — the shape of the work, the paths available, and
the tools that help. For precise, store-by-store and field-by-field detail, read the
**[Data Model and Scheduling Engine Guide](https://www.timebars.com/knowledgebase/helparticles/common-03-data-model-and-scheduling-engine-guide)**,
and use the **Schema Values** report inside the application
(**Report Menu → Other → Schema Values**) for the definitive list of every field.

## What data transformation means

Your current system — MS Project, Jira, Smartsheet, Planview, a home-grown database, or
a folder of spreadsheets — stores the same *ideas* we do: work, dates, people, money,
progress. It almost certainly does **not** store them in the same *shape*.

**Data transformation** is the work of reshaping what you have into what the destination
expects. In practice it is four jobs:

| Job | What it means | Example |
|---|---|---|
| **Mapping** | deciding which source field becomes which destination field | your `Owner_Name` becomes our `tbOwner` |
| **Reformatting** | changing how a value is written | `2026-01-15` becomes `15-Jan-2026` |
| **Restructuring** | changing how rows relate to each other | a flat task list with an `Indent Level` column becomes explicit parent IDs |
| **Cleaning** | fixing what was never right | blank dates, duplicate IDs, a status value nobody uses any more |

## Why a straight copy never works

Four differences catch out almost every migration. None is difficult once you know about
it; all four are painful to discover halfway through.

**1. Our hierarchy is explicit, and most systems' is implicit.**

Many tools represent structure by *position* — an indent level, an outline number, or
simply the order of rows. We represent it by **pointer**: every row stores the ID of its
parent in a field called `tbSelfKey2`. Nothing about a row's position on screen defines
where it sits in the hierarchy.

This is the single largest piece of restructuring work in a typical migration, and it is
also what makes the result robust: reorder the rows and the structure survives.

**2. Dates have exactly one accepted format.**

`DD-MMM-YYYY` — `15-Jan-2026`. Not ISO, not US, not your locale's. The importer does not
attempt to guess.

**3. Numbers must be numbers, and empty means zero.**

A numeric field must contain a number. Empty, `null`, and the string `"na"` are all
wrong, and a single one of them can empty an entire portfolio total when it flows through
a sum.

**4. Totals are calculated, not imported.**

Enter cost and work only at the **lowest level in use**. Parent rows get their totals from
the rollup engine, which overwrites anything you put there. Importing pre-computed
parent totals is wasted effort at best, and confusing at worst.

## Three ways in: pick your path

There is no single right route. Pick by who is doing the work.

| | **Path A — Copy and paste** | **Path B — CSV into the template** | **Path C — JSON direct** |
|---|---|---|---|
| **Who does it** | PMO / project data experts | IT — SQL or ETL skills | Developers |
| **What you produce** | data typed or pasted into the workbook | CSV files with our column headers | a JSON file in our structure |
| **Best for** | one portfolio, a few hundred rows, or a pilot | most migrations | large volumes, repeat loads, automation |
| **Repeat loads** | manual each time | manual re-import | easily automated |
| **Needs a developer** | no | no | yes |

**Path A is genuinely viable, and it is under-used.** For a first portfolio you can
download the workbook, paste your project and task names into the **Timebars** sheet,
fill the handful of mandatory columns, paste your people into the **Resources** sheet,
and import. Picklist values can be pasted into the **Tags** sheet, and labels adjusted
afterwards from inside the application. No IT involvement, no export scripts — the people
who understand the data do the work directly. Start here if you are unsure; you can
always graduate to Path B once you know the shape of the target.

Paths B and C are covered in detail in the next part of this guide.

## Tools for the job

You do not need heavyweight tooling. Most migrations are done with one of these:

| Tool | Good for |
|---|---|
| **Python** — **recommended** | Anything beyond a few hundred rows. See below |
| **Excel / LibreOffice Calc formulas** | Small datasets, one-off reformatting, quick mapping with `VLOOKUP`/`XLOOKUP` |
| **SQL** | Exporting straight from a legacy database, with the reshaping done in the query |
| **Power Query** (Excel) | Repeatable reshaping without writing code |
| **A dedicated ETL tool** — Talend, Pentaho, Airbyte | Large or ongoing migrations where you already own the tool |

### Why we recommend Python

Two problems in this migration are awkward in a spreadsheet and easy in Python:

- **Building the parent-child chain.** Turning indent levels or outline numbers into
  `tbSelfKey2` pointers is a few lines of code and a genuinely fiddly spreadsheet exercise.
- **Validating before you import.** Checking that every `tbSelfKey2` resolves, that every
  `tbMDID` has a matching bar, and that every date parses is a handful of dictionary
  lookups — and catching those errors *before* the import is worth far more than fixing
  them after.

The standard library plus `pandas` covers everything needed. `pandas` reads and writes
both CSV and Excel, so the same script can serve Path B or Path C.

A sensible script does four things in order: **read** the legacy export, **map** fields to
ours, **build** the hierarchy pointers, and **validate** before writing output. If
validation fails, print what failed and write nothing — an import that half-works is far
more expensive than one that never ran.

> **Sample migration scripts are on our roadmap.** Until they ship, the section below
> gives you the field rules a script needs, and the four validation checks in section 8
> are the ones worth coding first.

---

# Migrating Your Data to the Timebars Ltd Suite

## 1. Who this part is for

This part is for the people responsible for extracting project data from a legacy system
and loading it into Agilebars, Timebars, or Costbars: **IT staff, data leads and
developers**, and the **PMO data experts** taking Path A.

It describes what data to prepare, which stores it belongs in, how the stores relate, and
how to get it in.

**What this part does not cover:**

- Day-to-day use of the sync feature once you are live — see the
  [Data Synchronization, Backup, Recovery and Retention Guide](https://www.timebars.com/knowledgebase/helparticles/common-04-data-synchronization-backup-recovery-and-retention-user-guide)
- The definition of every field — that is the **Schema Values** report inside the
  application (**Report Menu → Other**), which carries each field's purpose, picklist,
  data type and sheet, and is searchable and filterable

---

## 2. How data gets into the application

### Where the data lives

The suite is a browser-based single-page application. All data lives in **IndexedDB**, an
in-browser database. There is no server-side backend and no REST API to push data into,
so every route in is a **file import**.

### The import panel

All imports go through **Hamburger Icon → Import SpreadSheet, CSV or JSON**, which opens
the **Drop To Import Data** panel. Drop a file onto it, or use the browse button.

> Older documentation told you to drag files onto the canvas. Use the import panel.

Accepted file types: `.xlsx`, `.xlsm`, `.ods`, `.csv`, `.js`, `.json`.

### The filename rule — read this before naming anything

The application works out what a file **is** from the **start of its name**. A file whose
name does not begin with one of these is rejected before it is read:

| Name starts with | Treated as |
|---|---|
| `tbClient…` | the workbook — all of its sheets |
| `tbFullBackup…` | a full restore of every store |
| `transferBars…` | bars transferred from another product |
| a store name — `tbTimebars…`, `tbMetaData…`, `tbTags…`, `tbResources…` | that single store |

That last row matters for migration: **you can import one store at a time**, as JSON or
CSV, by naming the file after the store. A file called `tbResources.json` loads the
resource pool and touches nothing else. This lets you build a migration up in stages —
resources first, then tags, then bars — and re-run any single stage without redoing the
rest.

**An import replaces a store; it does not merge into it.** Every existing row in that
store is removed and the file's rows are written in their place. The application takes an
automatic Full Backup first.

### The three paths

**Path A — Copy and paste into the workbook.** Download the template, paste your data into
the **Timebars**, **MetaData**, **Resources** and **Tags** sheets, save, and import. Best
for a first portfolio or a pilot, and needs no IT involvement — the PMO people who
understand the data do it directly.

**Path B — CSV files via the workbook.** IT exports from the legacy system as CSV files
whose column headers exactly match our field names. Those load into the workbook using the
Import buttons on the Setup tab, and the populated workbook is imported. This is the
recommended path for most migrations. It needs SQL or ETL skill, not programming.

**Path C — JSON direct.** A program reads the legacy system and writes our JSON structure
directly. The result imports without the workbook as an intermediary — either as one file
per store, or as a single `tbFullBackup`-structured file carrying every store at once.
Best for large volumes, repeat loads, and nightly delta syncs during a transition.

---

## 3. The five source tables

Of all the stores in the suite, only **five are source tables** a migration needs to
supply. The rest are either calculated from these five, or are configuration best set up
in the application afterwards.

| Store | Workbook sheet | Holds |
|---|---|---|
| `tbTimebars` | Timebars | Every scheduling item: Portfolios, Projects, Sub-Projects, Tasks, Milestones, Allocations |
| `tbMetaData` | MetaData | Extended classification, narrative and scoring fields |
| `tbBaseline` | Baseline | The approved baseline plan (optional) |
| `tbTags` | Tags | Picklist values for metadata fields |
| `tbResources` | Resources | The resource pool — people and generic roles |

The field rules for all five are in the
[Data Model and Scheduling Engine Guide](https://www.timebars.com/knowledgebase/helparticles/common-03-data-model-and-scheduling-engine-guide);
the field *list* is the Schema Values report.

---

### 3a — tbTimebars (sheet: Timebars)

`tbTimebars` is the backbone. Every scheduling item at every level — Portfolio, Project,
Sub-Project, Task, Milestone, Allocation — is one row. The hierarchy is defined entirely
by `tbSelfKey2`, which holds the `tbID` of the parent row.

**This is the most critical table in the migration. Every other table either points into
it or derives from it.**

#### Hierarchy levels

| `tbType` | Level | Description |
|---|---|---|
| `Portfolio` or `Program` | L1 | Top-level grouping |
| `Project` | L2 | A discrete deliverable or initiative |
| `Sub-Project` | L3 | Work package or component within a project |
| `Task`, `Milestone` or `Gate` | L4 | Individual work items or schedule control points |
| `Allocation` | L5 | A specific resource assigned to a task |

**Agilebars uses only L2 (Project) and L4 (Task).** L1, L3 and L5 are not supported there.

#### Critical fields

| Field | Required | Notes |
|---|---|---|
| `tbID` | Yes | Unique string. A legacy ID converted to a string is fine |
| `tbSelfKey2` | Yes, except roots | The `tbID` of this row's parent. Empty on a Portfolio. **This one field defines the entire hierarchy** |
| `tbType` | Yes | One of the values above |
| `tbName` | Yes | Display name |
| `tbStart` | Yes | Forecast start, `DD-MMM-YYYY` (e.g. `15-Jan-2026`) |
| `tbFinish` | Yes | Forecast finish, same format |
| `canvasNo` | Yes | Always `1` |
| `tbStatus` | Recommended | Typically `Active` for live items |

#### Work and cost

Enter these **only at the leaf level** — L5 Allocations, or L4 Tasks where you do not use
Allocations. Leave `0` on parent rows; the rollup engine recalculates them from the
children on import.

| Field | Meaning |
|---|---|
| `tbWork` | Forecast hours |
| `tbAWork` | Actual hours to date |
| `tbWorkRemaining` | Remaining hours |
| `tbCost` | Forecast cost |
| `tbACost` | Actual cost to date |
| `tbCostRemaining` | Remaining cost |
| `tbPercentComplete` | Progress, integer 0–100 |

#### Allocation-only fields (L5)

| Field | Meaning |
|---|---|
| `tbResID` | Must match a `tbResID` in `tbResources` |
| `tbCalendar` | Working hours per day for this resource |
| `tbPercentTimeOn` | Percentage of the resource's time on this task, 0–100 |
| `tbPayRate` | Hourly rate — cost is derived from hours using it |

#### Leave these blank — the application fills them

| Field(s) | Why |
|---|---|
| `tbL1`–`tbL5` | Ancestor name breadcrumbs, regenerated on load |
| `tbHierarchyOrder` | WBS position string, regenerated on load |
| `tbDuration`, `tbRemainingDuration` | Calculated from start and finish. Enter `0`, or pre-calculate as working-day counts if your script can |
| `tbCostID`, `tbState`, `tbStep`, `tbStepStatus`, `tbWfReasonNote`, `tbStage`, `tbPriority`, `tbPhase`, `tbBarColor`, `tbTextColor`, `focdItemCoordLeft`, `focdItemCoordTop`, `tbBarHeight`, `tbBLID`, `tbConstraintType`, `tbConstraintDate`, `tbFloat`, `tbFreeFloat` | Not used by the core system |

**Canvas positions — `tbCoordTop`, `tbCoordLeft`, `kbCoordTop`, `kbCoordLeft`.** These hold
where a bar sits on screen. The **Timebars sheet has a macro button that generates them**
from the order the rows appear in the sheet — so **arrange your migration data in the
intended hierarchy order before running it**: parents above their children, siblings in
display sequence. Get the row order right and the macro does the rest.

**`tbCustomerID`.** Leave blank, or set it to a string naming the tenant or organisational
unit an item belongs to (`EngDept`, `MarketingDept`). It acts as a partition identifier
that separates items by owner for the enterprise dashboard. Leave blank if you do not need
that separation.

---

### 3b — tbMetaData (sheet: MetaData)

`tbMetaData` holds over 100 extended fields — classification, narrative, financial scoring,
health indicators, risk and issue tracking, portfolio assessment. It joins to `tbTimebars`
on a matching ID: **`tbMDID` must equal the `tbID` of its bar**.

**One `tbMetaData` row must exist for every `tbTimebars` row.** Where the legacy system has
no metadata for an item, still create the row: `tbMDID` set to the matching `tbID`, and
everything else empty.

#### Key fields

| Field | Notes |
|---|---|
| `tbMDID` | Must match the `tbID` of the corresponding bar |
| `tbMDName` | Normally the same value as `tbName` |
| `tbMDStatus` | Item status — the value must exist in `tbTags` under group **Timebar Status** |
| `tbMDPriority` | Priority — value must exist under group **Timebar Priority** |
| `tbMDPM` | Project manager |
| `tbMDBusinessOwner` | Business owner |
| `tbMDSponsoringDepartment` | Sponsoring department |
| `tbMDNotesProject` | General description or notes (rich text) |
| `tbMDHealthOverall` | Overall health indicator |
| `tbMDCategory` | Project or item category |

#### Common mappings from legacy systems

| Legacy field | Our field |
|---|---|
| Status / State | `tbMDStatus` |
| Priority / Urgency | `tbMDPriority` |
| Project Manager | `tbMDPM` |
| Business Owner | `tbMDBusinessOwner` |
| Department | `tbMDSponsoringDepartment` |
| Description / Scope | `tbMDObjectivesAndScope` |
| Notes / Comments | `tbMDNotesProject` |
| Project Number / Reference | `tbMDProjectNumber` |
| Health / RAG Status | `tbMDHealthOverall` |
| External Link / URL | `tbMDExtLink1` |
| External System ID | `tbMDExtSystemID1` |
| Azure DevOps ID | `tbMDAzureID` |
| Risk Score | `tbMDScore` |
| Risk Probability | `tbMDProbability` |
| Risk Impact | `tbMDImpact` |

For anything not in that list, search the **Schema Values** report by purpose — it is
full-text searchable, and finding the right target field takes seconds.

> **Some fields name a person and read the live resource pool, not a picklist** — Owner,
> Project Manager, Executive Sponsor and a dozen more. Load `tbResources` and those
> pickers populate themselves. Adding tag values for them achieves nothing.

Picklist fields must reference values that exist in `tbTags`. **Load tags before
metadata**, and confirm the values are present first.

---

### 3c — tbBaseline (sheet: Baseline)

`tbBaseline` stores a point-in-time snapshot of the approved schedule — the plan of record
progress is measured against. **Its field structure is identical to `tbTimebars`**, so
whatever populates one can populate the other.

**Baseline is optional.** Two approaches:

- **The legacy system holds an approved baseline:** populate `tbBaseline` with those
  approved dates and hours. Users get baseline comparison on day one.
- **No baseline exists:** skip the table. After migration, set the baseline from inside
  the application (**Right-click Canvas → Set Baseline**) once the imported schedule has
  been reviewed and approved.

The Baseline sheet is normally marked as a system-generated store. For migration only, it
is acceptable to pre-populate it.

---

### 3d — tbTags (sheet: Tags)

`tbTags` defines the picklist values used across the metadata forms. Each row is one option
within a named group. `tbTagGroup` names the picklist; `tbTagTbInternalName` names the
field it populates.

**Load tags before metadata.** A metadata row referencing a value that does not exist in
`tbTags` will flag a validation error.

| Field | Meaning |
|---|---|
| `tbTagID` | Unique across all tag rows |
| `tbTagGroup` | The picklist name (e.g. `Timebar Status`, `Timebar Priority`, `Phase`) |
| `tbTagName` | The value shown to users and stored on the record |
| `tbTagNameShort` | Abbreviated label for compact display |
| `tbTagTbInternalName` | The field this group populates (e.g. `tbMDStatus`) |
| `tbTagPurpose` | What the group is for |

#### How to approach tags

The application ships with a full set of seed tags covering the common picklists. Rather
than exporting them from the legacy system, most teams build this table by hand:

1. Review the seed tags already in the Tags sheet.
2. Identify legacy values not already covered.
3. Add those as new rows with the right `tbTagGroup` and `tbTagTbInternalName`.
4. Optionally, remove or rename seed values that do not match your terminology.

Tags are a small dataset. Reviewing the legacy system's dropdown lists by eye is usually
faster than writing an export query.

> **Some values are locked** — the code compares against that exact text, so renaming them
> breaks filters, colours and calculations silently. Adding your own values alongside them
> is always safe. The locked values are marked in the picklist reference in the
> [Forms, Reports and Graphs Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-forms-reports-and-graphs-guide).

---

### 3e — tbResources (sheet: Resources)

`tbResources` holds the resource pool: one row per named person (**Human**) or generic role
placeholder (**Generic**). L5 Allocations reference a resource through `tbResID`.

**Load resources before Allocations.** An Allocation referencing a `tbResID` that does not
exist will fail validation.

| Field | Meaning |
|---|---|
| `tbResID` | Unique — referenced by `tbResID` on Allocation rows |
| `tbResName` | Full display name |
| `tbResPayRate` | Hourly cost rate used by the scheduling engine |
| `tbResResourceCalendar` | Working hours per day (typically `8`) |
| `tbResPercentGeneralAvailability` | Percentage of working time generally available, 0–100 |
| `tbResLabourType` | `Human` or `Generic` |
| `tbResQuantity` | How many of this generic role exist. **Set `0` on management or governance roles** so they stay out of capacity totals and AI resource plans |
| `tbResPrimaryRole` | Role category — drives resource reports and stacked charts |
| `tbResPrimarySkill` | Primary skill area |
| `tbResDepartment` | Organisational department |
| `tbResManager` | Manager name |
| `tbResLocation` | Office or location |
| `tbResPartTimeFullTime` | `Full Time` or `Part Time` |
| `tbResResourceType` | `Labour` or `Non-Labour` |
| `tbResResourceClass` | Employment class (e.g. `Permanent`, `Contract`) |
| `tbResCostCode` | Charge or cost code for financial integration |
| `tbResMonth1`–`tbResMonth24` | Monthly availability factors, 0.00–1.00, over a 24-month window |
| `tbResDaysNotAvailableByMonth` | Exceptions — comma-separated month-year and day count (`Jan25-2, Feb25-2`) |
| `tbResExtSystemResID` | The legacy system's ID, kept for traceability |

---

## 4. Tables you must not populate

These are computed from the five source tables and will be rebuilt automatically. Loading
them wastes effort and can leave stale figures on screen until the next recalculation.

| Store | Built from | Rebuilt |
|---|---|---|
| `tbMdJoined` | `tbTimebars` + `tbMetaData` | Every load, and Recalculate All |
| `tbResCalcs` | Allocation data | Resource calculations |
| `tbResCalcs2` | Allocation data + `tbResources` | Resource calculations |
| `tbResCalcsUsage` | Resource data | Resource data changes |

These are configuration rather than migration data:

| Store | Purpose | How to set up |
|---|---|---|
| `tbAdminPanel` | Canvas settings, report date, holidays, product configuration | Canvas Settings in the application, after migration |
| `tbSchema` | The master field list | Ships configured; maintained through the Schema Values report |
| `tbFields` | Dynamic form field definitions | Ships with defaults; adjust through Fields Values |
| `tbCoreReport` | Which metadata fields show at which level on the Core Form | Ships with defaults; adjust through CoreReport Values |

---

## 5. ID strategy and hierarchy wiring

The most common migration failure is broken hierarchy wiring — IDs that do not match
across tables, or `tbSelfKey2` values pointing at rows that do not exist.

### Choosing IDs

**Option 1 — carry over the legacy IDs.** If the legacy system has unique, stable
identifiers, convert them to strings and use them as `tbID`. Keep the original in
`tbMDExtSystemID1` on metadata rows and `tbResExtSystemResID` on resource rows, so
post-migration reconciliation is possible.

**Option 2 — generate new IDs.** If legacy IDs are not unique, or collide across tables,
generate clean ones. Sequential integers, timestamps, or prefixed strings all work. There
is no constraint on format beyond uniqueness.

Either way, one invariant must hold before import:

> **Every value in a `tbSelfKey2` field must exist as a `tbID` in the same `tbTimebars`
> dataset.**

### A worked example

| `tbID` | `tbName` | `tbType` | `tbSelfKey2` |
|---|---|---|---|
| P001 | Digital Workplace | Portfolio | *(empty — root)* |
| P002 | Cloud Migration | Project | P001 |
| P003 | Phase 1 — Assessment | Sub-Project | P002 |
| P004 | Vendor Assessment | Task | P003 |
| P005 | Alloc — Jane Smith | Allocation | P004 |

`tbMetaData` then has one row for each of P001–P005 with `tbMDID` matching. `tbResources`
has a row for Jane Smith, and P005 carries her `tbResID`.

---

## 6. Field formats, and how to check every field

These rules are strict. The importer does not attempt to parse alternatives.

### Check the field, do not guess

**Every field in the system is a row in the `tbSchema` store**, and you read it in the
application at **Report Menu → Other → Schema Values**.

For each field it gives you the **data type**, whether it is **mandatory**, whether it is
**validated on import**, which **picklist** it draws from and whether that picklist is a
tag list or the live resource pool, its **purpose**, and which **sheet** it belongs to. It
filters by sheet and by picklist, and the purpose column is full-text searchable.

**Use it as your mapping worksheet.** Filter to the Timebars sheet, and you have the exact
column list your export needs to produce, with the type of each. This beats working from
any document, because the report is the live configuration and a document is a snapshot.

The same information drives the **workbook's own validators**, which highlight bad cells in
red as you paste — so Path A gets the same rules enforced without anyone reading a table.

### Dates

- Format: **`DD-MMM-YYYY`** — `15-Jan-2026`
- The month is exactly three letters, initial capital: `Jan`, `Feb`, `Mar`, `Apr`, `May`,
  `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`
- **Not** ISO `2026-01-15`, **not** US `01/15/2026`, not any other variant
- Enforce this in the export script or the ETL step — it is far easier there than in the
  workbook

### Numbers

- Numeric fields hold numbers, not quoted strings
- **A numeric field with no data is `0`** — never `null`, never empty, never `"na"`
- `tbPercentComplete` is an integer **0–100**, not a fraction 0.0–1.0
- Work and cost may be decimal (`40.5` hours, `75.00` rate)

### Text

- Text fields with no value hold an empty string `""`, not `null`
- Most `tbMetaData` fields tolerate `null` where a value is genuinely absent

### Yes/No fields

Stored as the text strings `"Yes"` and `"No"` — in the workbook and in JSON alike. Not
booleans.

---

## 7. Step-by-step migration

### Getting the workbook

**Hamburger Icon → Download Excel SS** (`.xlsm`) or **Download Libre Office Calc SS**
(`.ods`). Always take it from inside the application so you get the current version.

**Do not rename it.** The filename must keep its `tbClient` prefix or the import will not
recognise it.

### Path A — copy and paste

1. Download the workbook and open it.
2. Paste your people into the **Resources** sheet — at minimum `tbResID`, `tbResName`,
   `tbResPayRate`, `tbResResourceCalendar`, `tbResLabourType`.
3. Review the **Tags** sheet, and add any picklist values your organisation uses that the
   seed data does not cover.
4. Paste your projects and tasks into the **Timebars** sheet. Fill the mandatory columns:
   `tbID`, `tbSelfKey2`, `tbType`, `tbName`, `tbStart`, `tbFinish`, `canvasNo`.
   **Put the rows in hierarchy order** — parents above children.
5. Add one **MetaData** row per bar, with `tbMDID` matching each `tbID`.
6. Run the coordinate macro on the Timebars sheet to generate the canvas positions.
7. Fix anything highlighted red by the validators.
8. Save, then import through **Hamburger Icon → Import SpreadSheet, CSV or JSON**.
9. Run **Recalculate All**, then work through section 8.

### Path B — CSV files via the workbook

**Prepare**

1. Download the workbook. Do not rename it.
2. On the **Setup** tab, set the Location column to the folder where the CSV files will be.

**Export from the legacy system**

3. Export as CSV, one file per store.
4. Name each file for its store: `tbTimebars.csv`, `tbMetaData.csv`, `tbBaseline.csv`,
   `tbTags.csv`, `tbResources.csv`.
5. Column headers must exactly match our field names — **case is significant**. Take the
   list from the Schema Values report.
6. Put all the files in the folder from step 2.

**Load and check**

7. On the **Setup** tab, confirm the Import Yes/No column is Yes for each store.
8. Click **Import All**, or use the Import button on an individual sheet.
9. Review every sheet for red-highlighted cells — these are validation failures that must
   be fixed in the source data.
10. Correct the export, regenerate the CSVs, re-import. Repeat until clean.

**Import**

11. Save the workbook, keeping the `tbClient` prefix.
12. Import it through **Hamburger Icon → Import SpreadSheet, CSV or JSON**.
13. The application takes an automatic backup, replaces each store, and redraws.
14. Run **Recalculate All**, then work through section 8.

### Path C — JSON direct

1. Take the field list and types from the **Schema Values** report.
2. Write a program that reads the legacy system and produces our structure. Validate
   before writing output — see section 8.
3. Import either **one file per store**, named for the store (`tbTimebars.json`,
   `tbResources.json`, …), or a **single `tbFullBackup`-structured file** carrying every
   store at once.
4. Import through the same panel. The application backs up first.
5. Run **Recalculate All**, then work through section 8.

> Per-store files are usually easier during development: you can re-run one stage without
> redoing the others, and a failure tells you immediately which store it came from.

---

## 8. Validation checklist

### Before importing

These four referential checks catch the large majority of problems, and all four are a few
lines of code:

- [ ] Every `tbSelfKey2` in `tbTimebars` resolves to a `tbID` in the same dataset
- [ ] Every `tbMDID` in `tbMetaData` matches a `tbID` in `tbTimebars`
- [ ] Every `tbResID` on an Allocation exists in `tbResources`
- [ ] Every picklist value used in `tbMetaData` exists in `tbTags` under the right group

Then the format checks:

- [ ] No duplicate `tbID` values
- [ ] One `tbMetaData` row for every `tbTimebars` row
- [ ] All dates are `DD-MMM-YYYY`
- [ ] All numeric fields hold numbers — `0`, not blank, not `null`, not `"na"`
- [ ] `canvasNo` is `1` on every row
- [ ] Rows are in hierarchy order, and the coordinate macro has been run
- [ ] No red-highlighted cells remain in the workbook

### After importing

- [ ] The canvas shows the hierarchy, at the correct depth (L1 → L2 → L3 → L4 → L5)
- [ ] Rollup totals on parent rows match the sum of their children
- [ ] Bars appear at the right dates on the timescale
- [ ] Resources appear in the pool and can be assigned
- [ ] Picklist dropdowns on the metadata forms show the expected values
- [ ] Baseline comparison displays correctly, if you loaded one
- [ ] Reports run — try All Tabular and the Portfolio drilldown
- [ ] **Config Integrity** (Report Menu → Other) reports nothing unresolved

If the canvas does not refresh, click Refresh on the top menu. If totals look wrong, run
**Right-click Canvas → Recalculate All**.

---

## 9. Post-migration setup

Data being correct is not the same as the product being ready. Five steps remain:

1. **Set the Report Date** — Canvas Settings. This is the "as of" date for every progress
   calculation, and nothing else in the product matters more. Set it to the date of your
   first reporting cycle after go-live.
2. **Set a baseline** — Right-click Canvas → Set Baseline, if you did not pre-populate
   `tbBaseline`. This captures the imported schedule as the plan of record.
3. **Configure the Admin Panel** — product settings, working hours per day, holiday
   exceptions.
4. **Tune the forms** — the **CoreReport Values** and **Fields Values** reports control
   which fields appear where. Adjust them to your workflow rather than living with the
   defaults.
5. **Run Recalculate All once more**, then take a **Full Backup** and keep it. It is your
   clean post-migration restore point, and it is worth having.

Then give your users the workbook: **Hamburger Icon → Download Excel SS**. Day-to-day sync
is covered in the
[Data Synchronization, Backup, Recovery and Retention Guide](https://www.timebars.com/knowledgebase/helparticles/common-04-data-synchronization-backup-recovery-and-retention-user-guide).

---

## 10. Where to go next

| Topic | Where |
|---|---|
| Every field's purpose, type, picklist and sheet | **Schema Values** report — Report Menu → Other |
| Field rules, hierarchy, rollups, the scheduling engine | [Data Model and Scheduling Engine Guide](https://www.timebars.com/knowledgebase/helparticles/common-03-data-model-and-scheduling-engine-guide) |
| Day-to-day sync, the import gate, backup, recovery, retention | [Data Synchronization, Backup, Recovery and Retention Guide](https://www.timebars.com/knowledgebase/helparticles/common-04-data-synchronization-backup-recovery-and-retention-user-guide) |
| Picklists, forms, the Core Form, and all the reports | [Forms, Reports and Graphs Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-forms-reports-and-graphs-guide) |
| Risks, issues and change requests | [Risks, Issues and Change Requests Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-risks-issues-change-requests-user-guide) |
| Using the canvas, the menus and the forms | [User Interface Guide](https://www.timebars.com/knowledgebase/helparticles/common-02-user-interface-guide) |
| Publishing to the cloud | [Cloud Publishing Guide](https://www.timebars.com/knowledgebase/helparticles/common-07-cloud-publishing-guide) |
| Subscriptions, presentations, feature descriptions | [www.timebars.com/sales/quick-start](https://www.timebars.com/sales/quick-start) |

---

**Contact**

- Sales and support — [jcox@tbcox.com](mailto:jcox@tbcox.com) · (613) 255-5374
- Knowledge Base — [www.timebars.com/knowledgebase](https://www.timebars.com/knowledgebase)
