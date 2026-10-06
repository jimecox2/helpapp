![Timebars Logo](../tbimages/logos/timebars-ltd-logo-final.png)
---

# Data Model and Scheduling Engine Guide


## Table of Contents

1. [Introduction](#1-introduction)
2. [Data Hierarchy](#2-data-hierarchy)
3. [Parent–Child Relationships & WBS Ordering](#3-parentchild-relationships--wbs-ordering)
4. [Field Rules — What Every Row Must Carry](#4-field-rules--what-every-row-must-carry)
5. [Rollup Rules & Field Aggregation](#5-rollup-rules--field-aggregation)
6. [Scheduling Engine & Scenarios](#6-scheduling-engine--scenarios)
7. [Predecessor & Constraint Logic](#7-predecessor--constraint-logic)
8. [Where the Full Field List Lives](#8-where-the-full-field-list-lives)
9. [What Recalculate All Does](#9-what-recalculate-all-does)
10. [Values the Code Depends On](#10-values-the-code-depends-on)
11. [Status and Health Automation](#11-status-and-health-automation)


---

## 1. Introduction

The platform is a multi-product scheduling application available in three variants — **Agilebars (AB)**, **Timebars (TB)**, and **Costbars (CB)**. All three products share the same underlying data model and a single client-side IndexedDB database. The differences between products are driven by different scheduling engines and configuration, not by separate codebases.

At the heart of the platform is a **five-level parent child data hierarchy**, where every item — from a top-level portfolio down to an individual resource allocation — is a record in the `tbTimebars` store with a `tbType` field that identifies its level:

| Level | `tbType` | Bar colour | Typical purpose | What its `tbSelfKey2` must point at |
|---|---|---|---|---|
| L1 | `Portfolio` or `Program` | dark brown | Top-level grouping of related projects | nothing — a root node has no parent |
| L2 | `Project` | green | A discrete deliverable or initiative | the parent L1, when a Portfolio exists |
| L3 | `Sub-Project` or `Work-Package` | orange | A work package or component within a project | the parent L2 |
| L4 | `Task`, `Milestone` or `Gate` | blue | Individual work items or schedule control points | its immediate parent — L3, or L2 when there is no Sub-Project |
| L5 | `Allocation` | gold | A resource's assignment to a task (TB/CB only) | the parent L4 Task — and it must also carry a `tbResID` that exists in `tbResources` |

A row may never skip a level or point at a parent that does not exist. An unresolved
`tbSelfKey2` orphans the row: it disappears from the hierarchy and contributes nothing to
any rollup.

**Important Note:** Agilebars is a Two Tier Hierarchy, Projects and Tasks, it has its own scheduling engine that skips the other levels. 

Parent–child relationships are established via the **`tbSelfKey2`** field: every child record stores the `tbID` of its parent. This single field is what the scheduling engine, rollup functions, and hierarchy rendering all rely on to traverse the tree — upward to aggregate totals and downward to render the timescale and Kanban views.

**Work and cost values are entered at the lowest level in use** — normally L5 Allocations, but any childless row (a Task with no allocations, or even a Sub-Project, Project, or Portfolio with nothing beneath it) acts as the leaf for its branch and may carry directly entered values — and they are **rolled up automatically** through the hierarchy. The `tbWork`, `tbAWork`, and `tbWorkRemaining` fields represent forecast hours, actual hours, and remaining hours respectively; `tbCost`, `tbACost`, and `tbCostRemaining` follow the same pattern for costs. A parent **with children** always holds derived totals: the rollup overwrites any manually set values on it, ensuring consistency from allocation to portfolio.

The three products use that model differently:

| Product | Hierarchy | Scheduling |
|---|---|---|
| **Agilebars** | two levels — **Project (L2) → Task or Story (L4)**. L1, L3 and L5 are not used | lane-based progress steps on the Kanban board, plus a sprint burndown |
| **Timebars** | the full five levels on a gantt-style timescale | dragging an L5 Allocation recalculates actual start, actual and remaining hours and cost, and percent complete, then rolls the totals up the chain |
| **Costbars** | the full five levels, same cost and hours model | as Timebars, extended with portfolio pipeline features — strategic value scoring and demand vs. capacity analysis |

This guide documents how data flows through that hierarchy — from the scheduling engine calculations at L5 up through each rollup stage to the portfolio total — and how the two stores (`tbTimebars` for core fields, `tbMetaData` for extended fields) relate to each other across all levels.


---

## 2. Data Hierarchy

The **tbTimebars** store in IndexedDB holds rows that represent different levels of work items. Each row is keyed by `tbID` (unique ID) and references its parent with `tbSelfKey2`. The `tbType` field determines its role in the hierarchy.

### Timebars and Costbars

The full hierarchy is:

**Portfolio → Project → Sub-Project → Task → Allocation**

Example:

- **Portfolio**: "Digital Workplace - Transformation"
- **Project**: "Synchronisation Client"
- **Sub-Project**: "Private Cloud Phase 1"
- **Task**: "Consume requirements"
- **Allocations**: "Alloc 1" and "Alloc 2"

Each row stores cost, work, dates, durations, and scheduling metadata. Higher-level rows (Sub-Projects, Projects, Portfolios) that **have children** always hold rolled-up totals — anything entered directly on them is overwritten by the rollup. A higher-level row **without children** is the leaf of its branch and may hold directly entered cost and work (see *Manual Cost, Work & Percent Complete* below).

At the task level, the rollup engine checks whether a Task has child Allocations. If Allocations exist, the Task's cost and work totals are summed from them. If no Allocations exist, the Task itself is treated as the leaf node and its own stored values are used directly in the rollup. This means allocations are optional — tasks without them still participate correctly in the hierarchy rollup.


### Agilebars

Agilebars uses a simplified two-level hierarchy:

**Project → Task (or Story)**

L1 (Portfolio/Program), L3 (Sub-Project), and L5 (Allocation) are not supported. Example:

- **Project**: "Sprint 4 - Mobile App"
- **Tasks / Stories**: "Design login screen", "Write unit tests", "Fix auth bug"

Tasks are always the leaf nodes in Agilebars. Cost and work values are entered directly on each Task, and the Project rolls them up. There is no allocation layer — resource assignment in Agilebars is handled through the Kanban board lanes and sprint membership rather than discrete allocation records.

---

## 3. Parent–Child Relationships & WBS Ordering

Every row in `tbTimebars` links to its parent through a single field: **`tbSelfKey2`**, which stores the `tbID` of the parent row. Root nodes (Portfolios with no parent) have `tbSelfKey2` set to null or empty. This one field is what every traversal — rollup aggregation, hierarchy rendering, connector drawing — depends on.

**Breadcrumb labels (`tbL1` through `tbL5`)** are derived display fields, not structural ones. They are cleared and regenerated each time `updateL1ToL5()` runs. Each row gets its ancestor names written into these fields by walking up the `tbSelfKey2` chain, so that any row can show its full path without a live tree traversal at render time:

| Field | Contains |
|-------|----------|
| `tbL1` | Portfolio or Program name |
| `tbL2` | Project name |
| `tbL3` | Sub-Project name |
| `tbL4` | Task name |
| `tbL5` | Allocation name |

**WBS ordering (`tbHierarchyOrder`)** is a dot-separated position string, zero-padded to two digits per level, always five segments deep regardless of the actual depth of the row. Examples:

- Portfolio: `01.00.00.00.00`
- Project: `01.01.00.00.00`
- Sub-Project: `01.01.02.00.00`
- Task: `01.01.02.03.00`
- Allocation: `01.01.02.03.01`

This field is used for display ordering and WBS-style report sorting. Like `tbL1–tbL5`, it is a computed field regenerated on demand by `updateTbHierarchyOrder()` — it is not a source of truth for structure, only for ordering. This pre-processed data make managing project data in the spreadsheets and the reports easier for the users.

---

## 4. Field Rules — What Every Row Must Carry

The rules in this section apply to **every** route data takes into the product: typed on a
form, generated by AI, or synced from the workbook. Data that breaks them does not throw
an error — it renders wrongly, or calculates wrongly, or quietly does nothing.

### Mandatory fields

**Every `tbTimebars` row, at every level:**

| Field | What it must hold |
|---|---|
| `tbID` | a unique alphanumeric identifier — the key everything else joins to |
| `tbName` | the display label shown on the bar, in grids and in reports |
| `tbStart`, `tbFinish` | planned dates, `DD-MMM-YYYY` (for example `15-Jan-2026`) |
| `tbType` | one of the reserved values — `Portfolio`, `Project`, `Sub-Project`, `Task`, `Milestone`, `Gate`, `Allocation` |
| `tbSelfKey2` | the parent's `tbID`, per the table in section 1. Empty only on a root Portfolio |
| `canvasNo` | always `1` |

**Every `tbMetaData` row:** `tbMDID`, which must **exactly** match its bar's `tbID`. That
single field is the entire join between the two stores — one metadata row per bar, no more
and no less.

**Allocations (L5) additionally require** the fields the scheduling engine calculates from:
`tbPayRate`, `tbPercentTimeOn`, `tbCalendar`, `tbWork`, `tbWorkRemaining`, `tbDuration`,
`tbRemainingDuration` and `tbPercentComplete`. Section 6 shows how they interact.

### Field typing

Three rules, and they are absolute.

**Numeric fields must be numbers, and default to `0` — never `null`, never `"na"`, never
blank:**

`tbWork`, `tbAWork`, `tbWorkRemaining`, `tbCost`, `tbACost`, `tbCostRemaining`,
`tbBudgetCost`, `tbDuration`, `tbRemainingDuration`, `tbPercentComplete`, `tbPayRate`,
`tbPercentTimeOn`, `tbCalendar`, `tbCoordTop`, `kbCoordTop`

A `null` or `"na"` in any of these propagates through every sum it touches: one bad value
at allocation level can empty a portfolio total. This is the single most common defect in
data arriving from a spreadsheet.

**Date fields must be `DD-MMM-YYYY` strings** — `07-Oct-2026`:

`tbStart`, `tbFinish`, `tbAStart`, `tbAFinish`

**Text fields hold `""` when empty**, never `null` or `undefined`. Every null and undefined
is blanked on the way in.

### Where a bar sits on the canvas

`tbCoordTop` is the vertical pixel position of a bar. On the Timebar View you place bars
where you like, and that freedom is what lets far more work fit on one screen than a
conventional gantt chart — so the position has to be stored, not derived.

Data created **inside** the application gets this for free. Data you **generate or import**
must set it, or every bar stacks at the same height:

- Give the first bar in the hierarchy a starting value — **100 pixels** is the default if
  you have no reason to choose otherwise.
- Step each following bar down from it. The Bar Creator uses **50 pixels**; AI-generated
  rows use **35**, and place an Allocation **40** below its parent Task.

Any consistent step works. The numbers above are what the application itself uses.

### Metadata defaults

When a metadata row is created without them, three fields are filled in so the row is
never left in an unreportable state:

| Field | Default |
|---|---|
| `tbMDStatus` | `New` |
| `tbMDHealth` | `Not Assessed` |
| `tbMDPriority` | `Not Assessed` |

### Risks, Issues and Change Requests are Tasks

There is no `tbType` of `Risk`. A risk, an issue and a change request are all **Tasks**
carrying a `tbSubType`:

| To create a | Set `tbType` | Set `tbSubType` |
|---|---|---|
| Risk | `Task` | `Risk` |
| Issue | `Task` | `Issue` |
| Change Request | `Task` | `CR` |

`tbType` is forced to `Task` for all three. The `tbSubType` value is what routes the item
to the Risks and Issues views, draws its flag icon on the canvas, and keeps it out of
resource calculations — a risk is tracked work, not scheduled effort.

---

## 5. Rollup Rules & Field Aggregation

Costs and work flow upward through the hierarchy via the rollup engine (`tbschedulingengineRollups.js`). It builds an in-memory map of the entire hierarchy keyed by `tbID`, links children to parents via `tbSelfKey2`, then walks the tree bottom-up with `aggregateCostsAndWork()`.

The engine applies one rule at every node, regardless of type or level:

- **If a node has children**: its cost and work fields are overwritten with the sum of its children's values.
- **If a node has no children** (leaf node): its own stored values (`originalValues`) are written back as-is and passed upward unchanged.

The leaf-node rule is **not type-aware**. It does not distinguish between an Allocation, a Task, a Sub-Project, or a Project. Any node without children becomes the leaf at that branch and its own stored cost and work values participate in the rollup. This means it is valid to mix approaches within a single portfolio — some projects fully broken down to allocations, others with a cost and work figure entered directly at the project or sub-project level — and the rollup will aggregate all of them correctly into the portfolio total.

The general convention is that cost and work are entered at the Allocation level and that higher-level rows hold only derived totals. But this is a convention, not an enforcement. The engine simply sums whatever exists beneath each node and falls back to the node's own values when nothing is beneath it.

Running the rollup multiple times produces the same result — it is fully idempotent.

**Fields that roll up at every level:**

| Field | Meaning |
|-------|---------|
| `tbWork` | Forecast hours |
| `tbAWork` | Actual hours to date |
| `tbWorkRemaining` | Remaining hours |
| `tbCost` | Forecast cost |
| `tbACost` | Actual cost to date |
| `tbCostRemaining` | Remaining cost |

**The full bottom-up flow:**

```
Allocation (or any childless node)
  → summed into Task (or nearest parent with children)
    → summed into Sub-Project
      → summed into Project
        → summed into Portfolio
```

The Portfolio row is always the root node (`tbSelfKey2` = null). Its totals equal the sum of every leaf node beneath it, wherever in the tree those leaves sit.

**Percent complete is derived, not summed.** Percentages cannot be meaningfully added, so `tbPercentComplete` is excluded from the summed fields. Instead, immediately after a parent's children are summed, its percent complete is derived from the fresh totals using the same rule hierarchy as manual entry: 100 when the parent itself is complete (it has an actual finish date), otherwise from work when the parent has work (`tbAWork ÷ tbWork`), from cost when it has cost but no work (`tbACost ÷ tbCost`), and left unchanged when it has neither.

### Manual Cost, Work & Percent Complete (rows without Allocations)

When a user chooses not to create Allocations, cost and work are entered by hand on the lowest row in use — typically the L4 Task, but the same applies to a childless L3, L2, or L1. These rows are edited in the **Cost & Schedule popup form** (launched from the bar's status icon), where the Forecast row's three cost cells, three work cells, and % complete render as editable dotted-border inputs on Timebars and Costbars. Rows **with** children stay read-only there — their values come from the rollup, and any manual entry on them would be overwritten (children always win).

Every manual entry is auto-reconciled so the seven fields stay mathematically aligned:

| You enter | The system derives |
|-----------|--------------------|
| **Work** (first entry) | Work Remaining = Work, A Work = 0, % Complete = 0 |
| **A Work** later | Work Remaining = Work − A Work, % Complete = A Work ÷ Work × 100 |
| **% Complete** later (work present) | A Work = Work × %, Work Remaining = Work − A Work |
| **Work Remaining** directly | A Work is kept; Work is re-forecast to A Work + Work Remaining (same convention as the Allocation hours-to-go override) |
| **Cost fields**, no work present | identical rules on the cost triple; % Complete derived from cost |
| **Cost fields**, work present | Cost Remaining = Cost − A Cost kept consistent, but % Complete stays work-driven |
| **% Complete** with neither work nor cost | the typed percent is simply held for reporting |

The rule hierarchy for `tbPercentComplete` is therefore: **complete first, then work, then cost, user-entered as last resort**. If Allocations are later created beneath the row, the next rollup replaces the manual values with the children's totals — no cleanup needed.

**Completion always wins (all bar types).** A bar that carries an actual finish date (`tbAFinish`) is finished — that single field is what makes the Schedule Status read *Completed* and what the *Hide Completed Bars* filter looks for. The scheduling engine sets it on **any** bar type whose finish falls behind the report date, not just Allocations, so `tbPercentComplete` is forced to **100** on those rows too: Task, Sub-Project, Project and Portfolio as well as Milestone, Gate and Release. Previously only Allocations got the matching 100, which left completed rows sitting at whatever percent they happened to hold — complete by date, part-done by number — and Hide Completed Bars (which needs both the actual finish *and* 100%) never hid them.

Actual work and actual cost are **not** rewritten to match. The hours and money a row really consumed stay exactly as entered, so a completed row can legitimately read 100% with A Work below Work. Dates decide *whether* a row is done; the numbers stay a record of what it took. To show less than 100% on such a row, clear its actual finish date or move the bar out past the report date — percent then falls back to the work/cost rules on the next recalculation.

Because data can also arrive via AI generation and Spreadsheet Sync, these seven fields can drift out of alignment. The **Recalculate All** button runs a consistency checker before the rollup: on every childless L4–L1 row it treats forecast and actual work (and cost) as the source of truth, corrects the remaining and percent complete fields to match, and assumes actuals of 0 when only a forecast value exists. Allocation (L5) rows are never touched by the checker — they belong to the scheduling engine.

The scheduling engine (`tbschedulingengine2.js`) is triggered when a user drags or resizes an allocation bar on the timescale. It only recalculates **allocation-level fields** — tasks, sub-projects, projects, and portfolios are updated afterwards by the rollup engine, not by the scheduling engine directly.



---

> **Important — Manual Cost & Work at L1–L4:**
> The scheduling engine only recalculates cost and work fields for **Allocation (L5)** rows. If cost and work have been entered manually on a Task, Sub-Project, Project, or Portfolio row (i.e. the row has no children and is acting as a leaf node), those values will **not** be recalculated when the bar is dragged or resized on the timescale. The engine will still update the bar's dates and duration, but `tbWork`, `tbCost`, and all related actual and remaining fields will remain unchanged. To have cost and work recalculate automatically on drag, the values must be held at the Allocation level.
>
> The one progress field the engine does write on these rows is `tbPercentComplete`, and only on completion: when the drag, resize, or report-date change puts the bar entirely behind the report date, the engine stamps the actual finish date and sets percent complete to 100. Work and cost are still left alone.
>
> Manually entered values are maintained through the **Cost & Schedule popup form** (click the bar's status icon): on a childless L4–L1 row the Forecast row's cost, work, and % complete cells render as editable (dotted-border) inputs, and every entry is auto-reconciled by the manual calculation rules described in the *Manual Cost, Work & Percent Complete* section below.

---

## 6. Scheduling Engine & Scenarios

The scheduling engine runs when a user drags or resizes an **Allocation** bar on the
timescale. It recalculates that allocation's dates, duration, hours, cost and percent
complete; everything above it in the hierarchy is then updated by the rollup engine, not
by the scheduling engine directly.

### Input: Pixels to Days

The entry point is `prepForDateHoursCostCalculator()`, which converts the pixel offset of the drag (`leftDiff` for a move, `resizeDelta` for a resize) into days using the current timescale pixel factor (`tsPxFactor`, set per the weekly or monthly view). This produces `daysdiffS` (start shift) and `daysdiffF` (finish shift), which are passed to `dateHoursCostCalculator()`.

### Scenario Detection

The engine reads the allocation's `tbStart` and `tbFinish` dates, converts them to JavaScript Date objects, then compares against `apStatusDate` (the user's status/report date) to determine which of three scenarios applies:

| Condition | Scenario |
|-----------|----------|
| `dStart < statusDate` AND `dFinish > statusDate` | **In Progress** |
| `dStart < statusDate` AND `dFinish < statusDate` | **Completed** |
| `dStart >= statusDate` | **Not Started** |

### Scenario 1 — In Progress

The allocation has started but not yet finished. The actual start is locked to the bar's start date; actual finish remains empty.

**Standard (no override):**
```
tbDuration         = working days (dStart → dFinish)
tbADuration        = working days (dStart → statusDate)
tbRemainingDuration = tbDuration - tbADuration
tbWork             = tbCalendar × (tbPercentTimeOn / 100) × tbDuration
tbAWork            = tbCalendar × (tbPercentTimeOn / 100) × tbADuration
tbWorkRemaining    = tbCalendar × (tbPercentTimeOn / 100) × tbRemainingDuration
tbCost             = tbWork × tbPayRate
tbACost            = tbAWork × tbPayRate
tbCostRemaining    = tbWorkRemaining × tbPayRate
tbPercentComplete  = (tbWork - tbWorkRemaining) / tbWork × 100
tbAStart           = dStart (formatted DD-MMM-YYYY)
tbAFinish          = "" (not yet finished)
```

**Override path** (`tbSchEngOverride = "Overridden"`): The user has manually fixed `tbWorkRemaining`. The engine respects that stored value instead of recalculating it from duration:
```
tbAWork            = tbCalendar × (tbPercentTimeOn / 100) × tbADuration
tbWorkRemaining    = stored value (not recalculated)
tbWork             = tbWorkRemaining + tbAWork
tbCost/tbACost/tbCostRemaining recalculated from the above
tbPercentComplete  = tbAWork / tbWork × 100
```

### Scenario 2 — Completed

The entire bar sits before the status date. The allocation is 100% done.

```
tbAStart           = dStart (formatted DD-MMM-YYYY)
tbAFinish          = dFinish (formatted DD-MMM-YYYY)
tbDuration         = working days (dStart → dFinish)
tbADuration        = tbDuration
tbRemainingDuration = 0
tbWork             = tbCalendar × (tbPercentTimeOn / 100) × tbDuration
tbAWork            = tbWork
tbWorkRemaining    = 0
tbCost             = tbWork × tbPayRate
tbACost            = tbCost
tbCostRemaining    = 0
tbPercentComplete  = 100
```

### Scenario 3 — Not Started

The bar's start date is on or after the status date. No actual progress exists.

```
tbAStart           = "" (not started)
tbAFinish          = "" (not started)
tbDuration         = working days (dStart → dFinish)
tbRemainingDuration = tbDuration
tbWork             = tbCalendar × (tbPercentTimeOn / 100) × tbDuration
tbAWork            = 0
tbWorkRemaining    = tbWork
tbCost             = tbWork × tbPayRate
tbACost            = 0
tbCostRemaining    = tbCost
tbPercentComplete  = 0
```

### Key Allocation Fields Used by the Engine

| Field | Role |
|-------|------|
| `tbCalendar` | Work hours per day for this resource |
| `tbPercentTimeOn` | Percentage of time allocated to this task (0–100) |
| `tbPayRate` | Hourly cost rate — used to derive all cost fields from work hours |
| `tbSchEngOverride` | `"Overridden"` locks `tbWorkRemaining` against recalculation |

After the scenario calculation completes, results are written back to IndexedDB via `UpdateProgressHoursCalculator()` (called from the drag/resize path in `tbschedulingengine.js`; the allocation popup form path fills the form via `initSchEngForm()`), and the rollup engine then propagates the updated totals up the hierarchy chain.

---

> **Important — Progress is Calculated Against the Status Date, Not Today's Date:**
> The engine always compares bar positions against `apStatusDate` — the status or report date set by the user in the admin panel — not against the current calendar date. This is a deliberate project management discipline, not a technical limitation.
>
> In formal project management, schedules are updated on a defined reporting cycle: weekly, fortnightly, or monthly. The status date is the agreed "as of" date for that cycle — the point in time at which the team has collectively assessed progress and recorded actuals. Using today's date instead would mean that the same schedule opened on a Monday shows different percent complete, actual hours, and remaining work than it does on a Friday, even if no update has been made and no real work has been recorded. Reports sent to a steering committee or PMO would not match the numbers the PM sees in the tool, and trend analysis across reporting periods would become unreliable because the reference point keeps drifting.
>
> By anchoring all calculations to a fixed status date, the platform ensures that every report, chart, and rollup total reflects a consistent snapshot: what the project looked like as of that date. The PM advances the status date at the start of each new reporting period, updates the schedule, and the next snapshot is produced cleanly.
>
> Note: The Agilebars Kanban board offers an optional setting (`apABuseStatusDate`) that allows teams to use today's date instead of the status date, for teams that prefer to update progress continuously rather than on a fixed reporting cycle.

---

## 7. Predecessor & Constraint Logic

### Predecessor (`tbPredecessor`)

A row can reference one other row as its predecessor by storing that row's `tbID` in the `tbPredecessor` field. This establishes a **Finish-to-Start** relationship in intent: the successor is expected to start when its predecessor finishes. The field stores the predecessor's `tbID` as a plain string and defaults to `""` when no predecessor exists.

Predecessors are supported on **Projects (L2)** and **Tasks, Milestones, and Gates (L4)**. Sub-Projects (L3), Allocations (L5), and Portfolios (L1) do not carry a predecessor reference in their rendered bar HTML and will not display connector lines even if a value exists in `tbPredecessor` on the underlying record.

### Constraint Type (`tbConstraintType`)

The `tbConstraintType` field controls whether a bar's position is locked against movement caused by a predecessor cascade. The meaningful value is:

| Value | Effect |
|-------|--------|
| `"Pinned"` | The bar is locked. A predecessor cascade will not move it. A pin icon is rendered on the bar. |
| `""` (empty) | No constraint. The bar moves freely and participates in predecessor cascades normally. |

Pinning is useful when a task has a hard deadline or a fixed contractual date that must not drift when upstream bars are rescheduled.

### Connector Rendering

When the timescale draws bars, each bar element receives `data-pred` and `data-tbid` HTML attributes. After rendering, `tbCanvas.js` iterates the bar elements, reads `data-pred` on each successor, looks up the corresponding predecessor element by `id="key{tbID}"`, and draws a connector line between the two. If the predecessor element is not found in the current view (filtered out or off-screen), the connector is silently skipped.

### Important — Simplified Dependency Relationships (Scheduling Light)

Traditional project scheduling tools support four dependency relationship types: **Finish-to-Start (FS)**, **Start-to-Start (SS)**, **Finish-to-Finish (FF)**, and **Start-to-Finish (SF)**, each optionally combined with a positive or negative lag value. This platform intentionally implements a simplified subset of that model.

Only **Finish-to-Start** relationships are supported, with the option to apply a **positive lag** (a gap between the predecessor finishing and the successor starting) or a **negative lag** (which effectively approximates a Start-to-Start with overlap, allowing the successor to begin before its predecessor finishes). Finish-to-Finish and Start-to-Finish relationships are not supported, as Finish-to-Finish is rarely practical in day-to-day scheduling and Start-to-Finish is almost never used in practice.

When a **Task** is dragged on the timescale, the engine automatically cascades the move to any successor Tasks linked to it via `tbPredecessor`, recursively cascading through the full chain. A successor Task that has been **Pinned** will not move regardless of what its predecessor does — the pin takes priority over the cascade. This cascade is **limited to Tasks only** — dragging a Project bar does not trigger a cascade to linked successor Projects. The predecessor connector line will display on Project bars as a visual reference, but Project-level predecessors must be manually rescheduled.

This approach is intentionally described as **Scheduling Light** — enough dependency structure to communicate sequence and intent clearly on the timescale and in reports, without requiring teams to manage the complexity of a fully automated predecessor network across all levels of the hierarchy.

---

## 8. Where the Full Field List Lives

Every field in the system is a row in the **`tbSchema`** store, and you read it in the
application rather than here: **Report Menu → Other → Schema Values**.

For each field it gives you the internal name, its label, **what it is for**, the picklist
it draws from and whether that picklist is a tag list or the live resource pool, its data
type, whether it is mandatory, whether it is validated, and which spreadsheet sheet it
belongs to. It is filterable by sheet and by picklist, and its purpose column is
full-text searchable.

That report is the field reference. A field list printed into a guide would start drifting
from the product the day it was written; the report cannot.

**The related stores, in one line each:**

| Store | What it holds |
|---|---|
| `tbTimebars` | every bar — the scheduling backbone |
| `tbMetaData` | the extended fields for each bar, joined on `tbMDID` = `tbID` |
| `tbBaseline` | a point-in-time snapshot that mirrors the `tbTimebars` structure **exactly** — the same fields populate it |
| `tbResources` | the resource pool, one row per person or generic role. L5 Allocations link to it through `tbResID` |
| `tbTags` | every picklist value, grouped by `tbTagGroup`, each group pointed at a field by `tbTagTbInternalName` |

The picklists and their values are documented in the *Forms, Reports and Graphs Guide*;
the stores and how they move in and out of the product are in the *Data Synchronization,
Backup, Recovery and Retention Guide*.

---

## 9. What Recalculate All Does

**Recalculate All** is the single button that puts every derived value back in step. It
matters because data arrives from three directions — typed in the app, generated by AI,
synced from a workbook — and only the first of those keeps the derived fields current as
it goes.

It runs in this order, and the order is the point: each step feeds the next.

| # | Step | What it fixes |
|---|---|---|
| 1 | **Consistency check** | on every childless L4–L1 row, treats forecast and actual work and cost as the truth and corrects the remaining and percent-complete fields to match. Runs **first**, so corrected leaf values feed the rollup in the same pass. Allocations are left alone — they belong to the scheduling engine |
| 2 | **Cost and work rollup** | sums the six cost and work fields bottom-up in a single pass, and derives each parent's percent complete from its fresh totals |
| 3 | **Hierarchy names** | clears and rewrites the `tbL1`–`tbL5` breadcrumb fields by walking `tbSelfKey2` up the tree |
| 4 | **WBS ordering** | regenerates `tbHierarchyOrder`, the five-segment sort path |
| 5 | **Grouping fill-down** | empty grouping fields inherit the nearest tagged ancestor's value, so reports do not group everything as untagged. Runs after the ordering is fresh and before the rebuild below, so the joined rows carry the filled values |
| 6 | **Joined table rebuild** | rebuilds `tbMdJoined`, the cached join of bars and metadata that every report reads |

**Run it after** any spreadsheet import, any AI generation, and any bulk edit — and before
publishing, exporting, or trusting a portfolio total. Running it twice changes nothing the
second time; every step is idempotent.

> **Resource calculations are not part of this.** The weekly resource demand figures
> behind the charts and grids are rebuilt separately, so a resource chart that looks stale
> after a Recalculate All needs its own refresh rather than another run of this.

## 10. Values the Code Depends On

This section replaces the old *Picklist Values Locked By Code* document and the
old *System-Reserved Metadata Fields and Values* section, which said similar
things in different words and had both drifted from the product.

**144 values across 46 picklists are locked.** Twelve picklists are locked
end to end. Every locked value is shown in **bold** in the A–Z reference in
the picklist reference in the *Forms, Reports and Graphs Guide*, so there is one list to read rather than two to reconcile.

### The picklists whose meaning is not obvious

Most locked values explain themselves. These do not, and getting them wrong is
expensive:

| Picklist | Field | Why the exact text matters |
|---|---|---|
| **tbType** | `tbType` | Tells the scheduling engine whether a row is a Project, Task, Milestone or Allocation. Everything downstream branches on it. |
| **SubType** | `tbSubType` | Turns a Task into a Risk, Issue or CR. The Risks & Issues module, and the health rules in section 7, find their rows by this value. |
| **Timebar Status** | `tbMDStatus` | Drives the whole PPM pipeline — what counts as a proposal, in-flight work, or closed. `Rejected`, `On Hold` and `Blocked` also make a row immune to the status automation. |
| **Schedule Status** | `tbMDHealth` | The word behind the schedule colour. Section 6 maps each value to a colour by exact text. |
| **Escalation Level** | `tbMDEscalationLevel` | `Executives` and `Directors` push a project's scope, risk or issue health straight to Red, and drive Enterprise Dashboard notifications. |
| **Budget Estimate** | `tbMDROMEstimate` | Band names are parsed as money ranges, used as the fallback when Budget Cost is zero in the PPM select/kill process. |
| **Risk Probability**, **Risk Impact** | `tbMDProbability`, `tbMDImpact` | Each value carries a hidden 1–5 weight **held in code, not in sort order**. Rename one and risks stop scoring — see the warning below. |
| **Labour Type** | `tbResLabourType` | `Human` is what makes a resource appear in every people-picker; `Generic` and `Human` split the supply-and-demand analysis. |
| **Health Cost/Hours/Issues/Overall/Risk/Schedule/Scope** | `tbMDHealth*` | `Green`, `Yellow`, `Red`, `Not Assessed` are matched exactly to select an indicator colour. There is no `Grey` — grey is how `Not Assessed` renders. |
| **Executive Commitment** | `tbMDSeniorLevelCommitment` | Feeds PPM scoring and notification thresholds. |
| **Show In Reports** | `tbMDShowIn` | Each value is a report filter. A renamed value silently removes rows from that report. |

> **Risk Probability and Risk Impact deserve a specific warning.** The 1–5 weights
> behind them are an explicit map in the code, deliberately *not* taken from the
> tag sort order — because `Not Assessed` shares a sort order with the worst value
> in both lists, and taking sort order would score an unassessed risk as the worst
> possible one. The consequence for you: **renaming a probability or impact value
> stops it scoring altogether**, and the risk silently reads 0 / Not Assessed. Add
> values freely; do not rename the five in each list.

### Why this list can drift, and what to do about it

The lock list is maintained alongside the code, and the picklist values are
maintained in the spreadsheet. Nothing automatically checks one against the
other, and they have gone out of step before — the `Part-time Full-time` rename
detached two values the portfolio report still branches on, and left the
resource form's picker opening empty for months.

Two things protect you:

- **Config Integrity** after every import.
- The A–Z in the picklist reference in the *Forms, Reports and Graphs Guide* is **generated from the live data**, so a value that has
  been renamed away simply stops appearing in bold rather than sitting in the
  documentation as a value that no longer exists.

---

---

## 11. Status and Health Automation

The product can set status, stage, phase, schedule status and all seven health
indicators for you, across the whole database, from the dates, baselines, budgets
and risk register you already hold. This section documents what each button does.

**Where:** the buttons sit on the **Core Form** and on the **CS status form**.

| Button | Sets | On |
|---|---|---|
| **Update Status** | Status, PPM Stage, PMI Phase, Schedule Status | Projects and Sub-Projects (all four); Tasks, Milestones, Allocations (Status only) |
| **Sch Status** | Schedule Status | Projects, Sub-Projects, Tasks, Milestones, Allocations |
| | …and the Health Schedule colour | Projects and Sub-Projects only — it is the only level the colour is reported on |
| **Cost Hours** | Health Cost, Health Hours | Projects and Sub-Projects |
| **RIC** | Health Scope, Health Risk, Health Issues | Projects and Sub-Projects |
| **Overall** | Portfolio rollup, then Health Overall | Portfolios, Projects, Sub-Projects |
| **Run All** | all five, in the correct order, in one pass | everything |

**Run All before sending reports to management.** The buttons can be pressed
individually and in any order, but Overall reads what the others wrote, so
running them out of order gives an Overall based on stale inputs.

### What automation never touches

- **A row whose Status is `Rejected`, `On Hold` or `Blocked` is skipped
  entirely.** Somebody put it there deliberately; nothing automatic moves it out,
  and skipping the whole row means it can never end up half updated.
- **Actual work and actual cost are never rewritten.** The automation reads them.
- Every indicator is recomputed from current state on every run, so a withdrawn
  escalation or a corrected date moves a project back *down* as readily as up.
  Nothing gets stuck on Red.

### Update Status — lifecycle from the actual dates

A row's state is read from its actual dates alone:

| The row has | State | Status | Stage | Phase | Schedule Status |
|---|---|---|---|---|---|
| no actual dates | Not started | `New` | `1 Proposed` | `Initiating` | `Not Assessed` |
| an actual start | Started | `In progress` | `6 Delivering` | `Executing` | `On schedule` |
| an actual finish | Finished | `Closed` | `8 Closed` | `Closing` | `Completed` |

On Projects and Sub-Projects all four fields move together, so the row always
reads consistently. On Tasks, Milestones and Allocations **only Status** is set —
stage, phase and schedule status are left alone.

### Sch Status — schedule health

Two methods, tried in order:

**With a baseline** — compares forecast finish against baseline finish. The
tolerances scale with the length of the item, because five days late on a
three-week task is not the same event as five days late on a two-year programme:

| | Default |
|---|---|
| Slip tolerance | the greater of **3 days** or **5%** of baseline duration |
| Late tolerance | the greater of **10 days** or **10%** of baseline duration |

| Result | When |
|---|---|
| `Early` | earlier than baseline by more than the slip tolerance |
| `On schedule` | within the slip tolerance either way |
| `Slipping` | late, but within the late tolerance |
| `Late` | later than the late tolerance |
| `Completed` | the row has an actual finish — this wins over everything |

**Without a baseline** — it can only see what is already overdue against the
Report Date, which is a genuinely different question. So it returns `Late` or
`Not Assessed` and never `Early` or `Slipping`. Work still ahead of the Report
Date stays `Not Assessed` rather than being flattered with an "On schedule" there
is no evidence for.

The **Health Schedule** colour is a pure projection of the word, so the two can
never disagree: Early and On schedule and Completed are Green, Slipping is
Yellow, Late is Red, Not Assessed is grey.

Each run tells you which method it used. If it reports that no baselines were
found, every schedule status on that run came from the Report Date alone —
useful, but not schedule variance. **Set a baseline to get the real answer.**

### Cost Hours — cost and hours health

Two questions, combined, with the **worse of the two** winning:

- **Variance** — is the forecast bigger than the plan? An estimating question.
  The plan is the baseline if there is one, otherwise the entered Budget Cost or
  Budget Hours. Green within 5%, Yellow within 15%, Red beyond — with an absolute
  floor (**5,000** currency units, **40** hours) so a small project's rounding
  noise does not read as an overrun.
- **CPI** — are we burning faster than we are earning? An execution question,
  meaningful only once something has actually been spent. Green at 0.95 and above,
  Yellow at 0.85, Red below.

Two safeguards worth knowing, because they are what stop a dashboard lying:

- **With neither a baseline nor a budget the answer is `Not Assessed`, never
  Green.** A brand-new project reporting green cost health is the most common way
  a portfolio dashboard misleads.
- **Below 15% complete, a variance-driven Red is reported as Yellow.** Early on, a
  forecast above plan is an estimate revision rather than an overspend — attention,
  not alarm. A genuinely bad CPI still shows Red at any percent complete, so
  nothing is hidden.

### RIC — scope, risk and issue health

Each of the three indicators counts the Change Requests, Risks or Issues beneath
the project. A row stops counting once its Status is `Closed` or `Rejected`.

| Result | When |
|---|---|
| `Not Assessed` | the register is empty — no items of that kind at all |
| `Green` | items exist and none are open |
| `Yellow` | an open item is escalated to the **Project Office**, or **3 or more** remain open |
| `Red` | an open item is escalated to **Executives** or **Directors**, or a risk is marked `Escalated` |

### Overall — the summary indicator

First, **Portfolios take their six indicators from their Projects** — the worst
reading among them. Sub-Projects are deliberately excluded, because their costs
already roll into the Project totals and their risks are already counted at
Project level; reading them again would count the same problem twice. A Portfolio
with no Project in progress stays `Not Assessed` rather than claiming health it
has not earned.

Then Health Overall is set from the other six indicators on the same row:

| Result | When |
|---|---|
| `Red` | **any** indicator is Red, or **4 or more** are Yellow |
| `Yellow` | 1 to 3 indicators are Yellow |
| `Green` | all assessed indicators are Green |
| `Not Assessed` | no indicator has been assessed |

Indicators reading `Not Assessed` are excluded from the count entirely, so an
unassessed dimension neither dilutes nor inflates the result. Zero assessed
dimensions gives `Not Assessed`, never a confident green built on no evidence.

### Tuning the thresholds

Every threshold above is a default, and every one can be overridden per install
through an **`apMetadataRules`** JSON value on the admin panel row. Absent or
unparseable, the defaults apply — so a malformed entry degrades to standard
behaviour rather than breaking anything.

| Key | Default | Controls |
|---|---|---|
| `slipDaysMin` / `slipPct` | 3 / 0.05 | Slipping tolerance |
| `lateDaysMin` / `latePct` | 10 / 0.10 | Late tolerance |
| `costGreen` / `costYellow` | 0.05 / 0.15 | cost variance bands |
| `costMateriality` | 5000 | absolute floor below which cost variance is ignored |
| `hoursGreen` / `hoursYellow` | 0.05 / 0.15 | hours variance bands |
| `hoursMateriality` | 40 | absolute floor, in hours |
| `cpiGreen` / `cpiYellow` | 0.95 / 0.85 | earned-value bands |
| `evEarlyPct` | 15 | percent complete below which variance cannot force Red |
| `ricYellowCount` | 3 | open items before an unescalated register goes Yellow |
| `overallYellowToRed` | 4 | Yellow count that forces Overall to Red |

### The dependency you must not break

Every value in the tables above — `In progress`, `On schedule`, `Executives`,
`Green` — is matched by **exact text** against the picklists. The automation
writes the value, and the picker has to be able to offer the same value back to
the user afterwards.

> **Rename one of these values and the automation stops working on that field**,
> silently. They are locked for exactly this reason (section 4). Note the
> lower-case second word in `In progress` and `On schedule`; they are not
> `In Progress` or `On Schedule`.

---

---

*End of guide.*
