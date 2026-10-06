![Timebars Logo](../tbimages/logos/timebars-ltd-logo-final.png)
---

# Data Synchronization, Backup, Recovery and Retention User Guide

This guide covers everything about getting data **into** and **out of** Agilebars,
Timebars and Costbars, and about keeping it safe while it moves: where your data
lives, how to export it, how to bulk-edit it in a spreadsheet, how to bring it
back, what protects you when the two get out of step, and how to recover when
something goes wrong.

> **One thing to read before anything else.** A spreadsheet import is **not a
> merge**. It clears each store and replaces it. Anything you changed in the app
> since your last export is gone. The application now watches for exactly this
> and **stops the import** rather than letting it happen — see
> [The import gate](#6-the-import-gate-and-the-sync-alert). It is the most
> important section in this guide.

## Contents

1. [Where your data lives](#1-where-your-data-lives)
2. [The data stores](#2-the-data-stores)
3. [Which copy is the source of truth](#3-which-copy-is-the-source-of-truth)
4. [Moving data out](#4-moving-data-out)
5. [Moving data in](#5-moving-data-in)
6. [The import gate and the sync alert](#6-the-import-gate-and-the-sync-alert)
7. [The spreadsheet workflow](#7-the-spreadsheet-workflow)
8. [Other data actions](#8-other-data-actions)
9. [Undo Bar Move](#9-undo-bar-move)
10. [Backup, recovery and retention](#10-backup-recovery-and-retention)
11. [Cloud publishing](#11-cloud-publishing)
12. [Validation and integrity](#12-validation-and-integrity)
13. [Troubleshooting](#13-troubleshooting)
14. [Best practices](#14-best-practices)

---

## 1. Where your data lives

The products follow a **client-first** architecture:

- **Your data lives in your browser**, in IndexedDB
- **No internet is required** — the application works completely offline
- **Nothing moves unless you move it** — every export, import and publish is
  something you initiate
- **Cloud publishing is optional**

### Three storage layers

| Layer | Where | What it is for |
|---|---|---|
| **IndexedDB** | your browser | live work; every edit lands here immediately |
| **Files** | your computer | bulk editing, backups, offline work |
| **Timebars Cloud** | Timebars servers | team sharing and cross-device access, opt-in |

```
Your browser (IndexedDB)
     ↓ ↑     you control every movement
Spreadsheet / JSON / CSV files  ←→  Timebars Cloud
```

### About IndexedDB

| | |
|---|---|
| **Database name** | `TB` |
| **Version** | 1 |
| **Typical size** | ~5–20 MB for 100–500 bars; up to ~100 MB for large portfolios |
| **Browsers** | Chrome, Firefox, Edge, Safari |

What this means in practice:

- Data survives closing the browser and restarting the machine.
- Data is **isolated per browser** — your Chrome data is not your Firefox data.
- Data is **per domain** — the Timebars site and the Costbars site hold separate
  databases.
- **Clearing browser data deletes it.** Take a Full Backup before you ever clear
  site data, change machines, or let IT reimage your laptop.

> The hierarchy itself — the five levels, what may parent what, and how rollups
> work — is covered in the *Data Model and Scheduling Engine Guide*, which owns
> that subject. This guide is about moving the data, not modelling it.

---

## 2. The data stores

Fifteen stores. Ten round-trip through the workbook; the rest are calculated.

### Stores you control

| Store | Holds | Edited through |
|---|---|---|
| **tbTimebars** | every bar on the canvas — portfolios, projects, tasks, milestones, allocations | canvas, Bar Creator, flyout forms, tabular grids |
| **tbMetaData** | 100+ extended fields per bar — status, health, priority, business case | Core Form, FOCD forms, tabular grids |
| **tbResources** | the resource pool — people and generic resources | Shared Resource Pool report, or the workbook |
| **tbAdminPanel** | settings — report date, timescale, zoom, product, view state | Canvas Settings and the toolbars |
| **tbTags** | every picklist value | Picklist Values report, or the workbook |
| **tbSchema** | the master field list — one row per field in the system | Schema Values report, or the workbook |
| **tbFields** | which fields sit on which FOCD form | Fields Values report, or the workbook |
| **tbCoreReport** | the Core Form layout — field, section, level | CoreReport Values report, or the workbook |
| **tbBaseline** | baseline snapshots of tbTimebars | Set Baseline on the CS form |
| **tbCharts** | saved chart configurations | saving an Agilebars burndown |

> **tbSchema is the newest of these and the most important to know about.** It is
> the master field list every other configuration table joins to, and it replaced
> the old `BulkOperations` configuration table in the workbook. If your workbook
> predates it, see [The workbook sheets](#the-workbook-sheets).

### Stores the application calculates

These are rebuilt from the stores above. Do not edit them, and do not carry them
back into the workbook.

| Store | Holds | Rebuilt when |
|---|---|---|
| **tbMdJoined** | tbTimebars joined to tbMetaData, for reporting | canvas load, Recalculate All |
| **tbResCalcs** | time-phased hours and costs for burndown charts | burndown calculation |
| **tbResCalcs2** | weekly resource demand by role, skill, location, department | canvas load, Recalculate All |
| **tbResCalcsUsage** | weekly resource availability | resource data changes |
| **tbDocuments** | *deprecated* — retained for compatibility, nothing writes to it | — |

---

## 3. Which copy is the source of truth

This is the most important idea in the guide, and the one that explains every alert,
block and bulk-update tool that follows.

Your data can exist in four places at once — the browser, a workbook, a backup file, and a
published pubset. **Only one of them is current at any moment**, and the product's job is
to stop you overwriting the current one with a stale one.

### The chain, in order

**1. Editing in the app makes the browser the source of truth — immediately.**

Change a picklist value on Picklist Values, a field label on Schema Values, a placement on
CoreReport Values, or any bar or metadata field in a grid, and it is written to IndexedDB
on the spot. There is no save step. From that instant, **the browser holds the only
current copy**.

**2. The workbook is now behind.**

It still holds the configuration as it stood at your last export. Nothing about it looks
wrong — it simply describes an earlier version of your product.

**3. The application blocks the import rather than let you lose the change.**

This is what the sync alert is. Rather than allow a stale workbook to overwrite a newer
browser, the product **stops the import** and tells you which stores are affected. Export
the changed stores, take them into the workbook, and the workbook becomes the source of
truth again — at which point importing it is safe.

The full mechanism is in section 6. What matters here is *why* it exists: an import
replaces stores wholesale, so without the gate the newer copy always loses.

**4. Anything already published or backed up is behind too — and nothing warns you.**

The gate protects the browser. It cannot protect copies that already left.

> A pubset published last month, or a Full Backup taken last month, carries **last month's
> Tags, CoreReport and Fields**. Re-hydrate from it and your configuration silently reverts
> — renamed picklist values come back with their old names, fields you moved go back where
> they were.

This is not a defect; it is what a snapshot is. But it means **a configuration change makes
every existing pubset and backup progressively more out of date**, and the more
configuration you tune, the faster that happens.

**5. Bulk Update is how published data catches up.**

Rather than republish every pubset by hand after a configuration change, the **Publishing
and Syncing Timebars** page has a **Bulk Update** tab that pushes one store into many
existing pubsets at once.

| Bulk Update mode | Use it for |
|---|---|
| **Complete Replacement** (JSON file) | replacing a whole store — the usual choice after a picklist or layout change |
| **Filter & Set** (no file) | changing one field's value wherever it currently equals something else, across the selected pubsets |
| **Row-Level Patch** (CSV file) | updating named rows only. First column is the store key, the rest are the fields to change |

Select the target store, optionally filter the pubset list by publish date, tick the
pubsets to update, preview, and apply. The stores it can push are **tbTimebars,
tbMetaData, tbResources, tbTags, tbFields, tbCoreReport and tbSchema**.

> **tbSchema** is available in **Complete Replacement** and **Row-Level Patch**
> only. Filter & Set builds its field list from the picklist table, which does not
> describe Schema's own columns, so Schema is greyed out in that mode.

### What to do after a configuration change

1. **Export** the changed stores — the sync alert panel offers exactly those
2. **Import them into the workbook**, so it is the source of truth again
3. **Bulk Update** your live pubsets with the changed configuration store
4. **Take a fresh Full Backup**, so your newest restore point matches your newest
   configuration

Steps 3 and 4 are the ones people skip, and they are the ones that hurt months later.

---

## 4. Moving data out

Three exports, for three different jobs. All of them write to your browser's
download folder.

| Menu item | Produces | Use it for |
|---|---|---|
| **Full Backup** | one file, `tbFullBackup_YYYY-MM-DD_HH-MM-SS.js` | restore points — this is your safety net |
| **Export to CSV (SpreadSheet sync.)** | **15 CSV files**, one per store | the spreadsheet round trip |
| **Export to JSON** | **15 JSON files**, one per store | integrations, AI agents, external tools |

All three are on the **Hamburger Icon** menu.

> **Full Backup is the one that matters.** It contains every store, so restoring
> it returns the application to exactly the state it was in. The other two are
> working exports.

A fourth route exists and is often the best one: the **sync alert panel** exports
**only the stores you have actually changed** — see section 6.

### Automatic backups

The application takes a Full Backup for you, without being asked, before:

- importing a spreadsheet, CSV or JSON file
- loading Demo Data
- Clear Timebars & Metadata

They land in your downloads folder with the same `tbFullBackup_…` naming. This is
a safety net, not a backup strategy — the files accumulate unsorted among your
downloads.

---

## 5. Moving data in

### The drop panel

**Hamburger Icon → Import SpreadSheet, CSV or JSON** opens the **Drop To Import
Data** panel. Drop a file onto it, or use the browse button.

> Earlier documentation said to drag files onto the canvas. Use the import panel.

Accepted: `.xlsx`, `.xlsm`, `.ods`, `.csv`, `.js`, `.json`.

### The filename rule

The application decides what a file *is* from the **start of its name**. A file
whose name does not begin with one of these is rejected before anything is read:

| Name starts with | The file is treated as |
|---|---|
| `tbClient…` | the workbook — all its sheets |
| `tbFullBackup…` | a full restore |
| `transferBars…` | bars transferred from another product |
| a store name — `tbTags…`, `tbMetaData…`, `tbTimebars…` | that single store |

The last row is why the per-store exports round-trip cleanly: a file exported as
`tbTags.json` can be dropped straight back in. It is also why **renaming a file
breaks the import**. Keep the name the application gave it.

### What an import actually does

This is the single most misunderstood behaviour in the product:

> **An import clears the store and replaces it. It does not merge.**

Every row in the store is removed and the file's rows are written in their place.
A row you added in the app and did not export is not preserved, not conflicted,
not reported — it is simply gone.

The application does two things to protect you:

1. It takes a **Full Backup first**, automatically.
2. It **refuses to import at all** when it knows you have unexported local
   changes. That is section 6.

---

## 6. The import gate and the sync alert

### Why this exists

You export to the workbook on Monday. On Tuesday you edit a few bars in the app,
add a picklist value, set a baseline. On Wednesday you import the workbook you
edited. Tuesday's work is destroyed, silently, with nothing on screen to suggest
it was ever at risk.

The application now tracks this.

### The alert icon

When any workbook-backed store holds edits that are **not yet in the
spreadsheet**, a **warning icon appears on the top menu**.

| Action | What happens |
|---|---|
| **Single click** | a message: *"Local changes pending — double-click for instructions."* |
| **Double click** | the sync alert panel opens |

Double-click rather than single, so a stray click cannot throw a panel over
whatever you were doing.

### While the icon is showing, imports stop

Attempting an import gives you:

> **Import stopped.** You have local changes that are not yet in the spreadsheet.
> Double-click the alert icon on the top menu for instructions.

The panel opens automatically, listing the stores concerned.

The check happens **after** the filename is validated and **before** the
pre-import backup runs — so a blocked import has touched nothing at all. No
backup file, no partial write, nothing to clean up.

### The two ways out

The panel gives you two buttons, and they are not equivalent:

| Button | What it does |
|---|---|
| **Export to Remove Block** | writes one JSON file per changed store to your downloads folder, ready to import into the workbook, then clears the block |
| **Remove Block** | clears the block and keeps your local changes — **the next import will overwrite them** |

**Export to Remove Block is the safe path.** Remove Block is there because
without an escape hatch a stale flag would leave the application unable to import
at all — use it when you genuinely do not want the local changes.

Exporting a store through the normal Export to CSV or Export to JSON also clears
that store's own mark automatically.

### What gets watched

Nine stores can be changed from inside the app, and each is watched for the work
that changes it:

| Store | Marked dirty by |
|---|---|
| **Timebars** | moving, resizing or rescheduling a bar; changing the Report Date; any field edit on a form or grid — Owner included |
| **MetaData** | field edits on a FOCD form, the Core Form or a tabular grid |
| **Resources** | edits in the Shared Resource Pool view or on the Resource form |
| **Tags** | editing, adding or deleting a value in Picklist Values |
| **Baseline** | setting or clearing a baseline from the CS form, at any level |
| **Charts** | saving a burndown chart in Agilebars |
| **Fields** | edits in Fields Values |
| **Schema** | edits in Schema Values |
| **CoreReport** | edits in CoreReport Values |

Five stores are deliberately **not** watched. Four of them — ResCalcs, ResCalcs2,
ResCalcsUsage and MdJoined — are calculated, rebuilt by Recalculate All, and
never worth carrying back. The fifth, **AdminPanel**, holds your settings and
view state and is written on almost every click; watching it would leave the
warning showing permanently and telling you nothing.

### Two routes into the workbook

They are alternatives, not steps:

- **Export to CSV** on the main menu gives you **everything, every time**, and you
  decide which sheets to import.
- **The sync alert panel** gives you **only the changed stores** — less to import,
  and less chance of overwriting a sheet you did not mean to touch.

### Setting it up

The tracking needs one column, **`apDirtyStores`**, on the **AdminPanel**
worksheet. It needs no database change — if your workbook does not have it yet,
add it. Without the column the app still works; it simply cannot remember the
warning across a reload.

---

## 7. The spreadsheet workflow

### The template

| | |
|---|---|
| **Excel** | Hamburger Icon → **Download Excel SS** — `tbClientMaster….xlsm` |
| **LibreOffice Calc** | Hamburger Icon → **Download Libre Office Calc SS** — `tbClientMaster….ods` |

Both sync with all three products. **The filename must still begin with
`tbClient`** — that prefix is how the application recognises it.

### The cycle

```
1. Export to CSV from the app          (15 files)
2. Import All on the workbook's Setup tab
3. Edit in Excel or Calc
4. Save the workbook
5. Import the workbook back through the drop panel
```

### Step 1 — export

**Hamburger Icon → Export to CSV (SpreadSheet sync.)**. Wait for all files to
finish downloading before moving on.

### Step 2 — tell the workbook where they are

On the **Setup** tab, set the **Location** column to your browser's download
folder. The **Import Yes/No** column controls which stores are pulled in by
*Import All*, so you can leave the calculated stores out.

### Step 3 — import into the workbook

**Import All** on the Setup tab pulls every sheet marked Yes. Individual sheets
have their own Import button if you only want one.

### Step 4 — edit

This is the point of the exercise: copy-paste, fill-down, formulas, filters,
sorting, conditional formatting, bulk status changes, adding and deleting rows.

**Sheet structure:**

| Row | Contents |
|---|---|
| **Row 1** | database field names — `tbID`, `tbName`, `tbStart`. **Never change these.** |
| **Row 3** | friendly labels, for your reference |
| **Row 4+** | your data |

Changing Row 1 breaks the import. It is how each column is matched to a field.

### Step 5 — save, and step 6 — import back

Save the workbook (macros enabled writes the updated CSVs out), then drop it on
the import panel. The app takes its automatic backup, replaces each store from
its sheet, and redraws.

### The workbook sheets

Fifteen sheets map to the fifteen stores:

| Sheet | Store | Edit it? |
|---|---|---|
| Timebars | tbTimebars | yes |
| MetaData | tbMetaData | yes |
| Resources | tbResources | yes |
| AdminPanel | tbAdminPanel | yes — settings and holiday exceptions |
| Tags | tbTags | yes — picklist values |
| **Schema** | **tbSchema** | yes — the master field list |
| Fields | tbFields | yes — FOCD form layout |
| CoreReport | tbCoreReport | yes — Core Form layout |
| Charts | tbCharts | yes |
| Baseline | tbBaseline | no — snapshot |
| MdJoined | tbMdJoined | no — calculated |
| ResCalcs | tbResCalcs | no — calculated |
| ResCalcs2 | tbResCalcs2 | no — calculated |
| ResCalcsUsage | tbResCalcsUsage | no — calculated |
| Documents | tbDocuments | no — deprecated |

### How a sheet is laid out

Every data sheet in the workbook follows the same three-row anchor, and the macros, the
exporter and the importer all depend on it:

| Row | Holds |
|---|---|
| **Row 1** | the exact internal field names — `tbID`, `tbName`, `tbStart` — as column headers |
| Row 3 | friendly column titles, for reading. Nothing reads these |
| **Row 4** | the **first data row** |

**Do not insert or delete rows above row 4, and do not edit row 1.** A field name typed
into row 1 that does not exist in the Schema sheet is not imported and is not reported —
the column is silently ignored. Change a name in Schema first, then in row 1.

The two sheets that carry your plan are **Timebars** (which maps to `tbTimebars`) and
**MetaData** (which maps to `tbMetaData`), joined by `tbMDID` = `tbID`. Where a MetaData
column mirrors a Timebars one — `tbMDName`, `tbMDTypes`, `tbMDSubtype`, `tbMDCustomerID` —
take the value from the matching Timebars row rather than typing it again.

### Validation, and where it comes from

The workbook's macros check data quality as you edit — mandatory columns,
data types, valid picklist values — and highlight problems in red.

> **The validation rules now come from the `Schema` sheet.** They used to come
> from a table on the `BulkOperations` sheet. If you are maintaining the macros,
> `FormatAndValidateV1.bas` reads `CFG_SHEET = "Schema"`. The `BulkOperations`
> sheet still exists for its import and export control ranges, but its
> field-configuration table is gone — one row per field now lives in `Schema`,
> so no field can be configured twice with two different answers.

Two Excel-side tools worth knowing about:

- **The Column Managers** — show and hide groups of columns on the Timebars and
  MetaData sheets, so you can work on one section at a time instead of scrolling
  across hundreds of columns.
- **PickListsV1** — one picklist engine driving the dropdowns for both Tags and
  Resources values.

### Before you import: the six checks

The workbook's validators catch most of this as you type, but these are the six that
break an import or produce a broken hierarchy, and they are worth a deliberate pass:

1. Every Timebars row has a **unique `tbID`**, and every MetaData row has a **`tbMDID`
   that matches one**
2. Every non-root row has a **`tbSelfKey2` pointing at a parent ID that exists**
3. **`tbType`** holds only the reserved values — Portfolio, Project, Sub-Project, Task,
   Milestone, Gate, Allocation
4. All dates are **`DD-MMM-YYYY`**
5. **`canvasNo` is `1`** on every row
6. Headers are in **row 1** and data starts at **row 4**

Numeric columns must hold numbers — `0`, never blank, never `na`. The full field rules are
in the *Data Model and Scheduling Engine Guide*.

### After every import: run Config Integrity

An import can leave the four configuration tables pointing at each other
incorrectly — a field renamed on one sheet and not another, a row deleted while
others still reference it, a picklist emptied. **None of it throws an error.**

**Report Menu → Other → Config Integrity** measures it. Make it the last step of
every import. See the *Forms, Reports and Graphs Guide* for what it checks.

### The rule about editing in two places

Do not edit in the application while the same data is out in a spreadsheet. The
import gate now catches the dangerous half of this automatically, but the
discipline is still worth keeping:

1. Export
2. Edit in the workbook
3. Import
4. Resume working in the app

---

## 8. Other data actions

All on the **Hamburger Icon** menu.

### Bulk Manage Bars

**Duplicate bars and children** — enter the Bar ID (bottom-left of the bar on the
canvas) and click Duplicate. Copies appear near the original, names prefixed
`duplicate`, IDs suffixed `-d`. Good for template projects and what-if scenarios.

**Transfer bars between products** — enter the Bar ID and an optional ID prefix
to avoid collisions, click Transfer, and a `transferBars…json` file lands in your
downloads. Open the target product and drop that file on the import panel. Use it
when a waterfall project becomes agile, or an agile work package becomes a
portfolio item.

### Migrate Rich Text

Converts legacy rich text from the old Quill format to the current editor's
format. **Safe to run at any time** — already-converted and plain-text fields are
left alone.

Run it once after upgrading, and again after importing an old backup file. If
descriptions or business-case sections look like raw markup, this is the fix.

### Clear Timebars & Metadata

Gives you a clean canvas without losing your configuration. A Full Backup is
written automatically first, and the action asks for confirmation.

| Cleared | Kept |
|---|---|
| Timebars, MetaData, **Baseline**, **Charts**, and all four calculated stores | AdminPanel, Schema, Tags, Resources, Fields, CoreReport |

Note that **baselines and saved charts go too** — they describe bars that will no
longer exist. The undo history is cleared for the same reason. Everything that
makes the application *yours* — your picklists, your form layouts, your resource
pool, your settings — survives.

### Load Demo Data

Replaces current data with a demo dataset for the product you are running. A Full
Backup is written automatically first.

### Delete Database

Destroys everything, permanently. Refresh the browser afterwards and a fresh
database is built with demo data. **Back up first** — this one does not do it
for you.

---

## 9. Undo Bar Move

You moved a few bars, and the plan now looks wrong. **Undo Bar Move** puts them
back.

**Where it is:** right-click anywhere on the canvas to open the **Shortcut
Menu**. Undo Bar Move is the first item.

Undo remembers your **last 5 moves**, most recent first. Each click steps back
one move.

> **Undo is not a backup.** It covers bar moves only, only since your last data
> load, and only in this browser. For anything larger — a spreadsheet sync, a bulk
> import, a version upgrade — take a **Full Backup** first.

### What Undo puts back

A drag or resize does not change one bar. It changes everything the scheduling
engine recalculates as a result, and Undo reverses **all** of it:

- **Bar positions** — where each bar sat on the timescale, and its row
- **Dates** — Start, Finish, Actual Start, Actual Finish
- **Durations** — Duration and Remaining Duration
- **Work** — Work, A Work, Work Remaining
- **Cost** — Cost, A Cost, Cost Remaining
- **Progress** — % Complete
- **Allocation values** — Calendar hours, % Allocated, Pay Rate, Override flag
- **Baseline bars** — the matching baseline bar returns to its row

Because a move cascades, Undo restores more than the bar you touched. Move a
Project and you moved its sub-projects, tasks, allocations, any linked successor
tasks, its baseline bar, and the rolled-up totals on the Portfolio above it. Undo
puts that whole branch back — which is what makes it trustworthy, but does mean
undoing a Portfolio drag is a big operation.

### What Undo never touches

**Metadata is completely outside Undo.** One rule with two halves, and both are
worth learning:

| | Undo restores it? | Does editing it cost an undo step? |
|---|---|---|
| **Schedule fields** (dates, durations, work, cost, % complete, allocation values, bar position) | **Yes** | Yes — see below |
| **Everything else** (Name, Owner, tags, descriptions, Status, Priority, all Metadata, Budget Cost, Budget Hours, WBS Description) | **No** | **No** |

So you can rename bars, change owners, tap picklists, write status updates and
edit descriptions **whenever you like** — before, between or after moves. Undo
will not put any of it back, and none of it uses up your undo steps.

**This works field by field, not bar by bar.** Drag a bar, rename that same bar,
then press Undo: the bar's **dates go back** and its **new name stays**.

### Your typed schedule values are protected

Some values you type by hand are the *same* values Undo restores — hours to go,
% Allocated, and the manual Cost / Work / % Complete cells on the status form.
Without a safeguard, undoing an older move would quietly wipe out what you typed.

It cannot. **Typing one of those values clears every restore point older than
it.**

1. You move two bars → 2 moves available to undo
2. You type a new **Hours to go** on an allocation → **undo list clears**, the
   button greys out
3. You move two more bars → 2 moves available again
4. You undo both → the bars go back, and **your typed value is still there**

You can undo moves made *after* your edit, but never back *past* it. Hover the
menu item and it tells you exactly what happened, and when.

**Which edits clear the list:**

- **Hours to go**, **% Allocated** or **Available hours per day** on the
  Allocation Hours Calculator
- **Remove Override** on the Allocation form
- **Manual Cost, A Cost, Cost Remaining, Work, A Work, Work Remaining or
  % Complete** on the CS status form

Editing a bar's Name, Owner, tags, description, Status, Priority, Budget Cost or
Budget Hours does **not** clear the list — Undo would never have touched those
anyway.

### Reading the menu item

| What you see | What it means |
|---|---|
| **Undo Bar Move** | one restore point available |
| **Undo Bar Move (3)** | three moves can be undone, most recent first |
| greyed out | nothing to undo — hover it and the text says why |

### When Undo clears itself

Undo **survives a page refresh**. It is **cleared** whenever the underlying data
is replaced:

- Loading Demo Data
- Clear Timebars & Metadata
- Restoring a Full Backup
- Importing a spreadsheet, CSV or JSON that replaces bars
- Typing a schedule value by hand (above)

This is deliberate. A restore point describes the bars that existed when it was
taken; applying it to freshly loaded data would put back bars that no longer
belong.

### Undo is per browser, per machine

Restore points live in your browser's local database alongside your project data.
They are **not** published to the cloud, **not** shared with colleagues, and do
**not** travel to another computer or browser profile. Two people working on the
same plan each have their own Undo.

Undo history is **not included in a Full Backup** — backup files are unchanged in
size and content by this feature, and restoring one correctly clears the undo
list.

### Undo troubleshooting

| Symptom | Cause and fix |
|---|---|
| Undo is greyed out | No restore point. Hover it — either nothing has moved since the last data load, or a typed schedule value cleared the list |
| My undo list disappeared | You typed a schedule value. That protects your edit. Moves from now on are undoable again |
| Undo put back more than my last drag | Two things do this, both intended: a move cascades to children, siblings and linked tasks; and several drags within half a second are grouped into one restore point |
| Undo put back a bar I did not move | Same cause — it was part of the cascade |
| Undo did not restore my Name / tag / description change | Correct. Metadata is outside Undo entirely |
| Undo is slow on a large plan | It re-runs the full recalculation and redraw, the same cost as Recalculate |
| My colleague cannot undo my move | By design — undo history is local to one browser |

---

## 10. Backup, recovery and retention

### What each kind of file contains

| File | Contains | Restores to |
|---|---|---|
| **Full Backup** — `tbFullBackup_…` | **every store** | exactly the state the application was in when it was taken |
| **Per-store JSON / CSV** — `tbTags.json`, `tbTimebars.csv` … | one store | that store only, replacing what is there |
| **The workbook** — `tbClient…` | the ten editable stores | those ten stores |
| **A pubset** in the cloud | fifteen stores | the application, on any device you log in from |

Only the Full Backup is a restore point. The others are working files: each replaces part
of your data and leaves the rest as it is, which is exactly what you want for a bulk edit
and exactly what you do not want after a mistake.

### Automatic backups

The application takes a Full Backup for you, unasked, immediately before it does anything
destructive:

- importing a spreadsheet, CSV or JSON file
- loading Demo Data
- Clear Timebars & Metadata

They land in your downloads folder with the same `tbFullBackup_…` name. **This is a safety
net, not a backup strategy.** The files accumulate unsorted among everything else you have
downloaded, and after a fortnight you will not be able to tell which one is the good one.

### How to restore

Drop the file onto **Hamburger Icon → Import SpreadSheet, CSV or JSON**.

A Full Backup restore **replaces every store**. Anything done since that backup was taken
is gone — including configuration changes, which is the case people forget. Take a fresh
backup of the current state first if there is any chance you will want to come back to it.

### Recovery scenarios

| What happened | What to do |
|---|---|
| **Browser data was cleared** — you open the app and your work is gone | Restore your most recent Full Backup. Then stop the browser clearing site data on exit, or this repeats |
| **A different browser or profile** — the data looks missing but nothing was lost | IndexedDB is per browser, per profile, per machine. Go back to the browser you were working in, or restore a backup into this one |
| **You imported the wrong file** | Restore the automatic Full Backup the application took immediately before that import. It is the newest `tbFullBackup_…` in your downloads folder |
| **An import overwrote work you had done in the app** | Same — the automatic pre-import backup holds it. This is what the import gate exists to prevent; see section 6 |
| **Moving to a new machine** | Take a Full Backup on the old machine and import it on the new one. Publishing to the cloud and re-hydrating also works and carries thirteen of the stores |
| **The numbers look wrong rather than missing** | Not a restore problem. Run **Recalculate All**, then **Config Integrity**. See section 12 |
| **A picklist opens empty, or a field lost its list** | A configuration reference broke, usually from a partial import. Run **Config Integrity** — it names what no longer resolves |

### What a backup does not contain

- **Undo history.** Undo lives outside the backup, is cleared whenever data is loaded or
  imported, and is per browser. It is not a recovery tool — see section 9.
- **Your browser's view state** beyond what the AdminPanel store holds.

### Retention

A backup you cannot find is not a backup.

| Practice | Why |
|---|---|
| **Keep a dedicated backups folder** — not Downloads | the automatic pre-import backups land in Downloads and bury the ones you meant to keep |
| **Keep three to five recent Full Backups** | enough to step back past a bad day; few enough to tell apart |
| **Keep one monthly backup for as long as the plan matters** | the daily set will have rolled over long before anyone asks what the plan looked like at approval |
| **Keep the filename the application gave it** | the timestamp is in the name, and the import decides what a file is from the start of its name. Rename it and it will not import |
| **Take one before, not after** | any spreadsheet import, bulk operation, demo-data load, configuration change, or browser change |
| **Take a fresh one after a configuration change** | so your newest restore point matches your newest configuration — see section 3 |

**How often?** Daily while you are actively working a critical plan; weekly for stable
work. The honest test is how much re-typing you are willing to do, because that is exactly
what a restore costs you.

---

## 11. Cloud publishing

Optional, user-initiated, and covered fully in the *Cloud Publishing Guide*. In
outline:

**Publish** — Main Menu → Publish, log in, then **Re-Publish!** on the PubSet.
Your data uploads and the Cloud Dashboard updates.

**Re-Hydrate** — on another device, Main Menu → Publish, log in, **Re-Hydrate!**.
Data downloads to that device.

| | |
|---|---|
| **Control** | user-initiated only, never automatic |
| **PubSets** | up to 10 separate datasets, subscription dependent |
| **Dashboard PubSet** | the one with the blue background |
| **Security** | HTTPS in transit, token authentication, data isolated per account |

> **Re-Hydrate replaces all local data.** Same warning as an import: back up
> first, and check the PubSet's Last Published date. If your local data is newer,
> publish before you re-hydrate.

---

## 12. Validation and integrity

Four layers, at different moments:

**As you type** — required fields enforced, date pickers, picklists, numeric
fields reject text.

**In the workbook** — macro validators check mandatory columns, data types,
references and duplicate IDs, and highlight problems in red before you import.
Driven by the `Schema` sheet.

**During import** — field names checked against the schema, types checked, unique
constraints enforced. Multi-store operations are all-or-nothing: an error rolls
the whole thing back.

**After import** — **Config Integrity** for the configuration tables (section 7),
and **Recalculate All** to rebuild every calculated store.

Referential behaviour worth knowing: deleting a parent bar deletes its children.

---

## 13. Troubleshooting

### My data disappeared after restarting the browser

Browser data was cleared, or you are in a different browser or profile. Restore
your most recent Full Backup through the import panel. Then check your browser is
not set to clear site data on exit.

### The import is blocked and I do not know why

You have local changes that are not yet in the spreadsheet. That is the gate
working. Double-click the warning icon on the top menu, then use **Export to
Remove Block** to keep those changes, or **Remove Block** to discard them. See
section 6.

### A pubset or backup brought back old picklists or an old form layout

It was published or taken before you changed the configuration, and a snapshot carries the
configuration of its moment. Re-apply the change, then use **Bulk Update** on the
Publishing and Syncing page to push the current store into your existing pubsets, and take
a fresh Full Backup. See section 3.

### The file will not import at all

The filename does not start with a recognised prefix. It must begin with
`tbClient`, `tbFullBackup`, `transferBars`, or a store name. Do not rename
exported files, and do not drop folders.

### The import ran, but my changes are not there

Two likely causes. Either the sheet you edited was not marked Yes in the Setup
tab's Import column, or you edited the sheet but did not save the workbook before
dropping it. Re-export, re-import, and check the Setup tab.

### An import overwrote work I had done in the app

An import replaces stores; it does not merge. The gate exists to prevent exactly
this — if it did not fire, the changes were made before the tracking was set up,
or `apDirtyStores` is missing from your AdminPanel sheet. Restore the automatic
backup taken immediately before the import; it is in your downloads folder.

### A picklist opens empty, or a field lost its list

A configuration reference has broken — usually a value or picklist renamed on one
sheet and not another. Run **Config Integrity**.

### Rich text fields show raw markup

Run **Migrate Rich Text** from the Hamburger menu. Safe to run repeatedly.

### Storage quota exceeded

Rare. Export your data, delete the database, and import back only what you need.
Consider splitting very large portfolios.

### The data looks inconsistent — totals do not add up

Run **Recalculate All** (right-click the canvas). It rebuilds every calculated
store. If it persists, restore a backup.

### Macros are not working in the workbook

Excel blocks macros in files downloaded from the internet. Right-click the file →
Properties → **Unblock**, or enable macros when prompted. Without them the Import
and Export buttons do nothing.

---

## 14. Best practices

### Backups

Covered in full in section 10. The short version: keep them in a dedicated folder, keep
three to five recent ones plus a monthly, take one before anything destructive, and take a
fresh one after a configuration change.

**Backups vs. Undo.** Undo handles the small everyday mistake — a bar dragged to
the wrong place. It does not replace a backup: bar moves only, five of them, and
cleared whenever data is loaded or imported.

### The sync loop

1. **Export** — everything, or just the changed stores from the alert panel
2. **Edit** in the workbook; do not edit the same data in the app meanwhile
3. **Save** with the `tbClient` name intact
4. **Import** through the drop panel
5. **Run Config Integrity**
6. **Run Recalculate All**
7. Keep the workbook as a record of what changed

Test a major restructuring against demo data before running it on real data.

### Multiple devices

1. Nominate one device as primary
2. Publish from it after changes
3. Re-hydrate on secondary devices *before* working, never after
4. Do not edit on two devices at once
5. Agree a team convention: last person to edit publishes

### Data hygiene

- Delete test and demo bars before production use
- Archive completed projects
- Keep naming conventions consistent
- Review unused resources and picklist values periodically
- Run **Config Integrity** after every import, not just when something looks wrong

---

## Related documents

| For | See |
|---|---|
| Picklists, forms, and the configuration reports | *Forms, Reports and Graphs Guide* |
| The hierarchy, rollups and the scheduling engine | *Data Model and Scheduling Engine Guide* |
| Field-by-field detail | **Schema Values** report |
| Publishing and the Cloud Dashboard | *Cloud Publishing Guide* |
| Moving from a legacy system | *Getting Started* — its data-migration chapter |

---

*Supersedes: Spreadsheet Sync User Guide, Data Management User Guide, and Data
Structure User Guide.*
