![Timebars Logo](../tbimages/logos/timebars-ltd-logo-final.png)
---

# Forms, Reports and Graphs Guide

This guide covers everything on the **Report Menu**, and it comes in two parts.

**Part A** is the reports about your work — tabular views, cards, charts, timelines and the
Gantt Report, with the filters, grouping and inline editing that go with them.

**Part B** is the four **Editable Reports** that configure the product itself: what the
picklists offer, which fields sit on which form, and how the Core Form is laid out. They
sit on the same menu because they are reports; they are documented here because they are
also the only place that configuration is done.

## Contents

**Part A — Reports and graphs**

1. [How to access reports](#1-how-to-access-reports)
2. [Report categories](#2-report-categories)
3. [Tagging rows into reports — the Show In field](#3-tagging-rows-into-reports--the-show-in-field)
4. [Special reports](#4-special-reports)
5. [Common report features](#5-common-report-features)
6. [Where report data comes from](#6-where-report-data-comes-from)
7. [Publishing to the Cloud Dashboard](#7-publishing-to-the-cloud-dashboard)
8. [Tips](#8-tips)
9. [Troubleshooting](#9-troubleshooting)

**Part B — Configuring the product through the Editable Reports**

10. [The two rules that decide everything](#10-the-two-rules-that-decide-everything)
11. [Where configuration lives](#11-where-configuration-lives)
12. [Picklists and tagging](#12-picklists-and-tagging)
13. [Dynamic forms (FOCD)](#13-dynamic-forms-focd)
14. [The Core Form](#14-the-core-form)
15. [What is configurable, by product](#15-what-is-configurable-by-product)

[Appendix A — Picklist reference A–Z](#appendix-a--picklist-reference-az)

---

# Part A — Reports and Graphs

## 1. How to Access Reports

Choose **Main Menu > Reports** to open the Reports menu. It is organised into five
menus:

| Menu | Contains |
|---|---|
| **Portfolio** | Projects by Portfolio, PPM Cards Report, Drilldown from Portfolio, Portfolio Detail Report |
| **Project** | General Tabular View, Detail Cards, Baseline Variance |
| **Task** | Task Tabular Report, Gantt Report |
| **Resource** | Resource Usage, Shared Resource Pool |
| **Other** | Print WBS, Picklist Values, Fields Values, Schema Values, CoreReport Values, Config Integrity |

Most reports offer search, filtering, sorting and export. Reports can be published
to the Timebars Cloud Dashboard with one click.

> **If you are looking for a report you remember by name**, several that used to
> be separate menu items are now reached from inside another report:
>
> | Looking for | It is now |
> |---|---|
> | Items Overdue, Milestone Horizon | tick-box filters inside the **Task Tabular Report**, and on the **Gantt Schedule View** header (reached from the Main Menu, not the Report Menu) |
> | Project Charter, Project Assessment | embedded on Project cards in **Detail Cards** |
> | Portfolio Status and Balancing | embedded per portfolio in **Portfolio Detail Report** |
> | Editable Grids / Data Management Grids | **removed** — each store now has its own report, see *Configuration reports* below |

## 2. Report Categories

### General Reports

**General Tabular View**
- Comprehensive data table displaying all projects, tasks, milestones, and allocations
- Powerful search, filter, and sort capabilities across all fields
- Multiple column presets available:
  - Default Fields: Essential project information
  - Common Fields: Frequently accessed metadata
  - Notes & Descriptions: Detailed project narratives
  - Allocation Fields: Resource assignment details
  - KPI Fields: Key performance indicators
  - Variance Fields: Baseline comparison metrics
  - Investment Fields: Strategic alignment (Costbars)
  - Project Charter Fields: Comprehensive investment analysis
- Export to Excel/CSV with one click
- Color-coded rows by type (Portfolio, Project, Task, Milestone)
- Click any row to open the edit form

**General Card View**
- Visual card layout showing projects and tasks
- Each card displays health indicators, status, priority, and key metadata
- Expandable sections for descriptions and notes
- Filter and search across all visible cards
- Color-coded by hierarchy level (Portfolio, Project, Sub-Project, Task)

**Print WBS (Work Breakdown Structure)**
- Professional WBS reports organized by hierarchy
- Shows parent-child relationships with indentation
- Includes WBS number, name, and description
- Copy and paste into markdown editors for sharing
- Export as documentation for project charters or scope baselines

**All Drilldown (Portfolio Hierarchy)**
- Interactive 5-tier hierarchy visualization
- Shows complete structure: Portfolio → Program → Project → Task/Milestone → Allocation
- Collapse and expand any level to focus on specific areas
- Color-coded levels for instant recognition
- Validates parent-child relationships and identifies orphaned items
- Export hierarchy as diagrams (Mermaid or GraphViz formats)

### Portfolio Reports

**PPM Tabular Report**
- Strategic portfolio analysis with dual scoring dimensions
- **Strategic Value (SV) Score**: Alignment with organizational objectives
- **Ability to Execute (AE) Score**: Resource availability and capability
- **Final Decision Score**: Weighted combination for prioritization
- Weekly resource demand grid (32 weeks visibility)
- Investment category, objective, strategy, and initiative fields
- System-generated decision notes
- Search and filter by project selection criteria
- Export for portfolio review meetings

**PPM Cards Report**
- Card-based view of portfolio projects with visual indicators
- Expandable tabs for Benefits, Impact Analysis, and Notes
- Health dashboard with 7 dimensions
- Filter by investment category, status, priority

**Drilldown from Portfolio**
- Portfolio report with color hierarchy showing all levels
- Visual representation of portfolio structure
- Click to drill down into specific portfolios or programs
- Shows relationships between portfolios, programs, and projects

**PPM Stop Light Report**
- Visual health dashboard with color-coded status indicators
- Red/Yellow/Green indicators across all portfolio dimensions
- Quickly identify projects requiring attention
- Exception-based management view

### Project Reports

**Project Status**
- High-level summary of all projects
- Green, yellow, and red health indicators
- Key metrics: schedule variance, cost variance, budget utilization
- Resource allocation status
- Risk and issue counts
- Escalation flags
- Sortable by any column
- Export for weekly status reporting

**Project Core Report**
- Command center for project data in customizable card layout
- **7-Dimension Health Dashboard**: Overall, Scope, Schedule, Cost, Hours, Risk, Issues
- Expandable rich text sections: Executive summaries, descriptions, notes
- Inline editing: Update project fields without leaving the report
- Print-ready layouts for stakeholder distribution
- Real-time health monitoring
- Color-coded cards by project status

**All Tabular**
- One large table showing all columns and all rows available
- Complete dataset with every field in the system
- Advanced filtering across 100+ fields
- Export entire dataset to Excel or CSV
- Useful for comprehensive data analysis

**Project Stop Light Report**
- Individual project health metrics with color indicators
- Drill-down into specific performance areas
- Track trends over time
- Early warning system for project issues

**Baseline Variance Report**
- Compare actual performance against approved baselines
- Variance calculations for:
  - Start Date Variance (days early/late)
  - Finish Date Variance (days early/late)
  - Duration Variance (work days)
  - Work Variance (hours)
  - Cost Variance (budget units)
- Advanced filtering with operators (>, <, =, >=, <=)
- Filter by hierarchy level (L1-L5)
- Type, status, priority, owner filters
- Earned value analysis support

**Project Charter Document**
- Comprehensive investment analysis report
- Strategic alignment (category, objective, strategy, initiative)
- Risk and complexity scoring with automated calculations
- Financial metrics (cost, hours, ROI indicators)
- Baseline comparison metrics
- Health indicators (7 dimensions)
- Resource demand by role and project
- Timeline visualization
- Export to PDF for board presentations

### Task Reports

The Task menu holds two reports over the same data. The **Task Tabular Report**
is a table; the **Gantt Report** is the same table with a timescale beside it.

**Task Tabular Report**
- Every Task, Milestone and Gate across the whole hierarchy in one table
- Free text name search, plus picklist filters for Status, PM, Owner, State,
  Portfolio (L1) and Project (L2)
- **L3 / L4 / L5 tick boxes** decide how deep the table goes. L1 Portfolio and
  L2 Project rows are always shown; the three lower levels are opt-out
- Column-set picker — Default, Schedule Standard, Schedule Advanced, Notes,
  Variance, Risks & Issues, All Columns
- **Inline editing** — click a cell and type; picklist cells open a picker and
  save on the tap (see *Direct Editing* below)
- Two override tick boxes replace the retired *Items Overdue* and
  *Milestone Horizon* reports (see below)

**Overdue and Milestone Horizon (the two override tick boxes)**

These sit above the table on the Task Tabular Report, and on the header of the
**Gantt Schedule View** (Main Menu). They are *overrides*: while one is ticked it
replaces the L3/L4/L5 level filtering with its own result set. They are mutually
exclusive — ticking one clears the other — and touching any level tick box
clears both and returns you to the normal view.

| Tick box | What it shows |
|---|---|
| **Overdue** | Tasks **and** Milestones that are late — planned start *or* planned finish is in the past — **and** are still missing an actual start or an actual finish. A bar that is genuinely finished on time never appears |
| **Milestone Horizon** | Milestones. On the Task Tabular Report this is *every* Milestone. On the Gantt Schedule View it is limited to a recent horizon — nothing whose start or finish is more than **14 days in the past** — so the list stays focused on what is coming up or has only just passed |

Ticking **Overdue** on the Gantt Schedule View also switches the columns to the
variance set, because the question you are about to ask is "by how much?".
Un-ticking it puts the default columns back.

While either override is on, rows are banded by real hierarchy — Portfolio,
Project and, where one genuinely exists, Sub-Project — so a long overdue list
still reads as "whose is this?". A Task or Milestone with no Sub-Project sits
directly under its Project band, and empty levels produce no placeholder band.

**Gantt Report**

A two-pane report: the filterable, editable table on the left, and the bars on a
timescale on the right. Both panes always render the same filtered set, so what
you see in the table is what you see on the timescale.

- **Filter panel** (collapsible): name search, Reset Filters, and picklists for
  Status, PM, Owner, State, Portfolio (L1) and Project (L2)
- **L3 / L4 / L5 tick boxes** at the foot of the panel — same rule as elsewhere,
  L1 and L2 always show
- **Show In** picklist along the top — narrows to rows tagged for one report
  (see *Tagging Rows Into Reports* below). It combines with everything else
- **Columns** picker and **row spacing** picker along the top
- **Grouping By** picklists — see the next section
- Inline editing throughout, including **Predecessor** on Task and Project rows
- L2 Project rows are emphasised: darker green band, larger bold name, and the
  project name drawn on the timescale itself
- Sort by clicking any column header; while grouping is on, the clicked column
  sorts the tasks *inside* each band rather than the whole list

> The Overdue and Milestone Horizon tick boxes are deliberately **not** on the
> Gantt Report — they live on the Task Tabular Report and the Gantt Schedule
> View. The Gantt Report's job is the grouped structural view.

### Grouping the Gantt Report

Set one or both **Grouping By** picklists and the Gantt Report stops being a
flat hierarchy and reorganises the tasks under bands. The structure is:

```
L1 Portfolio                (real row)
  L2 Project                (real row)   ← grouping starts under L2
    ▸ Sub-Project           (light orange band, showing the Sub-Project name)
        ▸ Owner: Jane       (group band)
            task, task…
        ▸ Owner: Sam        (group band)
            task…
        ▸ Owner: Not Tagged (muted band)
            task…
    (if the project has no Sub-Projects, the group bands sit directly under L2)
```

Points worth knowing:

- **The whole data set is grouped, not one project.** Every Portfolio, and every
  Project under it, is drawn with its own bands. Filter to a single Project on
  the L2 picklist if you want to look at just one
- **Two levels of grouping.** Set the first picklist to group, set the second to
  sub-divide inside each of those bands. Leave either on *No grouping* to use
  fewer levels
- **Nothing is ever hidden.** Tasks with no value for the grouping field are
  collected under a **Not Tagged** band rather than dropped. Tasks whose parent
  was removed by a filter are still shown at the end
- **Bands are labels, not bars.** A band has no dates, so the right-hand pane
  draws a band across the row instead of a bar
- **Allocations (L5) are not grouped** — grouping works on Tasks, Milestones and
  Gates
- Inside a band, tasks are ordered by planned start until you click a column
  header

The dimensions on offer are Sched Status, Owner, WBS, Priority, Phase, Category,
Department, Product, Weighting and Risk/Issue/CR. The list is a single
configurable set — adding a dimension to it makes it appear in **both** grouping
picklists at once, so the report can be extended without redesigning the panel.

> **Blank group bands?** Grouping fields are usually tagged at Project level and
> left empty on the tasks below, which would put everything into *Not Tagged*.
> **Recalculate All** fixes this — see *Grouping Fields Are Filled Down the
> Hierarchy* below.

### Resource Reports

**Resource Usage**
- Comprehensive resource demand visualization
- Multiple rollup options available
- Stacked bar charts showing allocation over time
- 32-week visibility window
- Identify over/under allocation patterns
- Forecast hiring needs
- Balance workloads across teams

**Resource Usage Stacked Charts By:**
- **Resource Name**: Individual allocation patterns
- **Primary Role**: Developer, Architect, PM, Tester, etc.
- **Primary Skill**: Technical skills distribution
- **Location/Office**: Geographic resource distribution
- **Department**: Organizational unit allocation
- **Project**: Project-based resource demand
- **Initials**: Condensed view for large teams

**Resource Usage Detail Table**
- Tabular view with 32-week visibility
- Weekly hours breakdown
- Resource metadata (location, role, skill, department)
- Sortable and exportable
- Supports capacity planning analysis

**Shared Resource Pool**
- Complete resource pool management view
- All resources in the tbResources store
- Shows all resources added by Administrator
- Typically managed via Spreadsheet integration
- Includes:
  - Skills, roles, and competencies
  - Department, location, organizational structure
  - Pay rates, cost codes, financial attributes
  - Availability calendars and capacity
  - Manager, team leader, reporting relationships
- Click any resource to open full resource form for updates
- Skills gap analysis support
- Organization chart maintenance

**Which Generic resources count as supply**

Generic resources are role placeholders — "Senior Developer", "Tester",
"Project Manager" — and not all of them represent capacity you can plan work
against. The rule the application uses everywhere is simple:

> A Generic resource counts as supply only when its **Quantity is greater than
> zero**.

That one number is the switch, and it controls three things at once:

| Where | What Quantity > 0 does |
|---|---|
| **Supply and Demand grids** | Only these Generic roles form the supply target. Capacity is Quantity × calendar hours × working days |
| **AI Resource Plan** | Only these roles are offered to the AI, so only these can be added as Allocations |
| **Resource charts and rollups** | Only these contribute to organisational capacity totals |

**This makes the resource pool manager the gatekeeper.** Roles that exist for
reporting or org structure rather than delivery — governance boards, steering
committees, management overhead — should be set to **Quantity 0**. They stay in
the pool, stay reportable, and stop turning up in plans and capacity totals.

The practical consequence: if an AI-generated resource plan keeps proposing
management roles you did not want, do not fight the prompt — set those Generic
roles to Quantity 0 in the Shared Resource Pool and generate again. Equally, a
delivery role sitting at Quantity 0 is invisible to planning, which is the usual
reason a role you expected never appears.

See the *How to Use Ask AI* guide for the resource plan itself, and the *Supply
and Demand Grids User Guide* for capacity analysis.

## 3. Tagging Rows Into Reports — the Show In Field

Several report sections are not built from a query at all. They show **only the
rows you have tagged for them**, using the **Show In** field on the metadata form
(picklist: *Show In Reports*). This is deliberate: an executive-facing section
should show the five risks that matter, not all forty.

A row can carry more than one Show In value, so one Milestone can appear in a
Project Charter and on a portfolio pack at the same time.

### Which tag feeds which section

| Report and section | Shows | Tag its Show In field with |
|---|---|---|
| **Project Charter → 5. High-Level Risks** | Risks belonging to that project | `Key Risks` |
| **Project Charter → 6. Summary Milestone Schedule** | Tasks and Milestones | `Key Deliverables` |
| **Project Charter → Resource Requirements** | Allocations | `Project Charter` |
| **Portfolio Status and Balancing → Notable Risks by Project** | Risks | `Key Risks` |
| **Portfolio Status and Balancing → Key Deliverables** | Tasks and Milestones | `Key Deliverables` |

The Charter's risk and deliverable sections use the **same two tags** as the
Portfolio Status and Balancing Report. Tag a risk `Key Risks` once and it appears
in both — you do not tag the same row twice for two reports. Only the Charter's
**Resource Requirements** section still uses the `Project Charter` tag, because
allocations are charter-specific.

> Hover the heading of any of these sections in the app and the tool-tip tells
> you which tag it reads.

### If a section is empty

An empty section is almost always an untagged one, and each says so in place of
its content — for example *"No Key Risks for this project. Tag a Risk's Show In
field with 'Key Risks' to display it here."* To fix it:

1. Open the Risk, Task, Milestone or Allocation
2. Click its **Show In** field
3. Pick the value from the list

The change saves on the tap, and the report shows it on the next open.

### Bulk tagging by spreadsheet

Tagging a whole portfolio one row at a time is slow. Export to the spreadsheet,
fill the **Show In** column down, and sync back. Make sure your Tags sheet
carries these three values in the **Show In Reports** group, or the picklist will
not offer them:

- `Project Charter`
- `Key Deliverables`
- `Key Risks`

See the *Forms, Reports and Graphs Guide* for adding picklist values, and the
*Data Synchronization, Backup, Recovery and Retention Guide* for the spreadsheet round trip.

## 4. Special Reports

### Risk, Issue & Change Management Reports

**Risks and Issues Report (Card View)**

**Risk Cards** (Blue):
- Probability × Impact scoring matrix
- Automated risk score calculation
- Mitigation status and plans
- Escalation tracking
- Assign owners and track mitigation activities

**Issue Cards** (Red):
- Priority and severity classification
- Assignment and ownership
- Resolution tracking
- Impact assessment

**Change Request Cards** (Gradient Blue):
- Requestor and department
- Impact assessment (cost, hours, schedule)
- Benefits and justification
- Options analysis
- Version tracking

All cards support:
- Rich text editor for detailed descriptions
- Expandable sections for plans and strategies
- Filter by status, priority, owner
- Search across all text fields
- Export for audit trails

**Risks and Issues Report (Tabular View)**
- Same data as card view in table format
- Sortable columns
- Multi-row selection
- Bulk export capabilities

### Timeline Visualizations

**Horizontal Timeline Report**
- Interactive timeline with draggable event cards
- Events positioned along horizontal date axis
- Persistent positioning (saved in browser)
- Filter and search by name, type, status
- Connector lines from timeline to event details
- Reset positions for fresh layouts

**Vertical Timeline Report**
- Similar to horizontal but oriented vertically
- Project chronologies and milestone sequences flow downward
- Milestone planning visualization
- Dependency relationships

### Configuration Reports (Other menu)

Five reports that show the tables the application is configured from, rather than
your project data. They are covered fully in the *Forms, Reports and Graphs Guide*;
in outline:

**Picklist Values**
- Every value behind every picklist — 97 lists in the shipped data
- Filter to one picklist, then open a value on its form to edit it
- Add and delete values; locked values carry a padlock and cannot be renamed
- A picklist can never be emptied — the last value is renamed rather than deleted

**Fields Values**
- The fields placed on the dynamic FOCD forms, one row per field per form
- Add a field to a form, remove one, change its label, type and picklist
- Label, Top, Left and Width are edited directly in the grid — the only
  configuration columns that are

**Schema Values**
- The master field list every other configuration table joins to
- Read and update only — rows cannot be added or deleted, because a row here
  corresponds to a database index and a spreadsheet column

**CoreReport Values**
- The Core Form layout — which field sits in which section, at which level
- Read and update only

**Config Integrity**
- Checks the four configuration tables against each other and reports what does
  not resolve: orphaned field names, duplicate placements, picklists that are
  empty or referenced by nothing
- It never blocks and never repairs — it measures
- **Run it after every spreadsheet import.** Broken configuration references do
  not throw errors; a picker whose list has gone simply opens empty

---

## 5. Common Report Features

All reports in the system share these capabilities:

### Search & Filter
- Free text search across names and descriptions
- Filter by hierarchy level (L1-L5)
- Filter by type (Portfolio, Project, Sub-Project, Task, Milestone, Allocation)
- Filter by status (Active, On Hold, Cancelled, Complete)
- Filter by priority (High, Medium, Low)
- Filter by owner (Resource names)
- Multiple filters can be combined

### Data Export
- **Excel**: Full data export with formatting
- **CSV**: Raw data for external analysis
- **Print**: Print-ready layouts with proper page breaks
- **Copy**: Copy to clipboard for quick sharing

### Visual Indicators
- **Color Coding**: By type, status, priority, health
- **Health Indicators**: Red/Yellow/Green status
- **Icons**: Visual markers for risks, issues, milestones
- **Progress Bars**: Completion percentage visualization

### Direct Editing

Not every grid is editable, and the difference is deliberate.

| Report | Editing |
|---|---|
| Schedule and metadata reports — General Tabular View, Task Tabular, Gantt Report, Detail Cards | **inline** — click a cell and type; picklist cells open a picker |
| Shared Resource Pool | inline, plus a full edit form |
| Picklist Values, Fields Values, Schema Values, CoreReport Values | **read-only in the grid**; the grid finds the row, the form edits it |

The configuration reports work that way because every one of their columns carries
a rule — a name that must exist elsewhere, a list that must not be emptied — and
enforcing those rules in two places would let the two drift apart. The exception
is the four layout columns on Fields Values, which are plain numbers and edit in
the grid.

Edits save as you go. There is no separate Save step, and no need to switch
screens.

### Editing Predecessors in a Grid

**Predecessor** is editable in the grids, but not on every row, and the list you
are offered depends on what you clicked:

| Row type | Predecessor cell |
|---|---|
| **Task** | Editable. The list holds the other **Tasks in the same project** — a task cannot depend on work in a different project |
| **Project** | Editable. The list holds **all Projects**, with no hierarchy restriction |
| Portfolio, Sub-Project, Milestone, Gate, Allocation | Read-only, like the Type column |

The picker shows each candidate's **ID and name**, with long names trimmed to fit
— hover a row to read the full name. Picking a row stores the **ID** as the
predecessor while showing you the name, so you never have to look an ID up.

The current row is always left out of its own list, so a bar can never be made
its own predecessor.

> Unlike the other picklists, this one is **live**: it is built from your actual
> bars at the moment you click, not from a stored list of values. Create a task
> and it is immediately available as a predecessor.

### Grouping Fields Are Filled Down the Hierarchy

Most people tag a project once — one Department, one Product, one PM — and leave
the tasks below it blank. Grouping and filtering would then be nearly useless:
every task would land in the *Not Tagged* band.

**Recalculate All** solves this. As part of the recalculation, empty grouping
fields inherit the value of their **nearest tagged ancestor**, all the way down
the hierarchy: Portfolio → Project → Sub-Project → Task → Allocation. Tag a
project as *Finance* and every task beneath it groups and filters as *Finance*
without you touching one of them.

The fields filled down are:

| Field | Set at |
|---|---|
| **Owner** | any level |
| **Department** | any level |
| **Product** | any level |
| **Project Number** | any level |
| **Project Manager** | any level |

Three rules make this safe to run as often as you like:

1. **A value you typed is never overwritten.** Only empty fields are filled. A
   task tagged to a different department than its project keeps its own value
2. **Blank means blank in every form** — an empty cell, spaces, or a stray
   "null" left behind by a spreadsheet import are all treated as empty and get
   filled
3. **Gaps in the hierarchy are skipped.** A task sitting directly under a project
   with no sub-project between them inherits from that project

Run it from **Right click on Canvas > Recalculate All**, or any *Recalculate All*
button, including the one on the Reports page. Do it after a spreadsheet import
and before you rely on grouped or filtered output.

> Not every field that you can group by is filled down. A field is filled down
> only where inheriting the parent's value is genuinely meaningful — Status and
> Priority, for instance, belong to the individual task, so they are left alone
> and blanks show as *Not Tagged*.

### Report Persistence
- Last viewed report is remembered
- Filter settings saved per report
- Return to your exact view next session

## 6. Where Report Data Comes From

Reports read the browser database. Two stores do most of the work:

- **`tbMdJoined`** — the cached join of bars and metadata that nearly every tabular and
  card report reads. It is rebuilt by **Recalculate All**, which is why a report showing
  stale numbers is usually a report that needs a recalculation, not a bug.
- **`tbResCalcs2`** — the weekly resource demand figures behind the resource charts and
  grids. Rebuilt separately from Recalculate All.

Baseline variance reads `tbBaseline`, and the resource reports read `tbResources`. The
stores themselves are documented in the *Data Synchronization, Backup, Recovery and
Retention Guide*.

---

## 7. Publishing to the Cloud Dashboard

**One-Click Publishing**: All reports can be published to the Timebars Cloud Dashboard:
- No configuration required
- Customize graph types and filter data sets
- Share with stakeholders via secure links
- Access from any device with internet connection
- Real-time updates when you publish new data

Learn more in the [Cloud Publishing Guide](Common_07_Cloud_Publishing_Guide.md).

## 8. Tips

1. **Recalculate before grouping.** Run Recalculate All after any spreadsheet import, so
   grouping fields are filled down before you group or filter on them
2. **Tag once, report twice.** `Key Risks` and `Key Deliverables` feed both the Project
   Charter and the Portfolio Status and Balancing Report — tag a row once and it appears
   in both
3. **Keep Generic quantities honest.** Quantity 0 on management-only roles keeps them out
   of resource plans and capacity totals
4. **Check the level tick boxes first** when a report looks empty. L4 off means no tasks
5. **Run Config Integrity after every import**, not only when something looks wrong

## 9. Troubleshooting

**Report is Empty or Shows No Data:**
- Check that you have data loaded in the application
- Verify filters are not excluding all results
- Click "Reset Filters" to clear all filter settings
- Check the **L3 / L4 / L5** tick boxes — if L4 is off, no tasks are shown
- Check the **Show In** picklist is not narrowed to a tag nothing carries

**A Report Section Says "No Key Risks" / "No Key Deliverables":**
- The section is tag-driven, not a query — nothing is tagged for it yet
- Open the row, click its **Show In** field, and pick the value the message
  names. See *Tagging Rows Into Reports* above

**Everything Lands in the "Not Tagged" Band:**
- The grouping field is set on the project but empty on the tasks below
- Run **Recalculate All** to fill grouping fields down the hierarchy, then
  re-open the report. See *Grouping Fields Are Filled Down the Hierarchy*

**The Overdue / Milestone Horizon Tick Box Keeps Switching Off:**
- That is by design. They are overrides — ticking one clears the other, and
  touching any L3/L4/L5 tick box clears both and returns the normal view

**A Generic Role Never Appears in a Resource Plan or Supply Grid:**
- Its **Quantity** is 0. Only Generic resources with Quantity greater than zero
  count as supply — see *Which Generic resources count as supply* above

**A cell will not accept an edit:**
- Not every column is editable, and the difference is deliberate — see *Direct Editing*
- On the configuration reports the grid is read-only by design; the form does the editing
- System fields such as Type and Hierarchy Order are read-only everywhere


---

# Part B — Configuring the Product Through the Editable Reports

Four reports on **Report Menu → Other** are not reports about your projects at all: they
are where the product itself is configured — what the dropdowns say, which fields sit on
which form, and how the Core Form is laid out. They are called the **Editable Reports**,
and a fifth report checks that they still agree with each other.

Everything in this part used to live in a separate Configurable Data guide. It is here
because the reports *are* the configuration interface — there is nothing to describe
separately from them.

---

## 10. The Two Rules That Decide Everything

Almost every question in this guide — can I change this? where do I change it? —
is answered by two rules.

### Rule 1: the app edits what is purely data; it does not edit what is also code

An internal field name such as `tbMDStatus` is not just a label. The same string
is a column heading in the workbook, an index in the browser database, and a
literal in the application source. The app cannot rewrite the source, so it will
not let you rewrite the name.

That single idea decides every "can I edit this?" in the product:

| | Where it changes |
|---|---|
| The **values** in a picklist | in the app, or the spreadsheet |
| Which **picklist** a field opens | in the app, or the spreadsheet |
| A field's **label**, position, width | in the app, or the spreadsheet |
| Which **fields** sit on a form | in the app, or the spreadsheet |
| An **internal field name** | the spreadsheet, alongside a code change |
| A **primary key** | never |

### Rule 2: the grid finds the row, the form edits it

On all four Editable Reports the **grid is read-only**. You filter and sort
to find the row you want, then open it on its **form** to change it.

There is one deliberate exception: four layout columns on Fields Values —
**Label, Top, Left, Width** — stay editable in the grid, because
positioning a field means comparing its numbers against its neighbours', and
that is exactly what a grid is good at.

A companion rule follows from Rule 1: **names that reach code are picked from a
list, never typed.** Every cross-table reference is a picklist sourced from the
table that owns the name. The one place free typing is allowed is a **new
picklist name** on the Picklist Values form — because a new picklist has to
start somewhere.

---

## 11. Where Configuration Lives

### The four Editable Reports, and the validator

All five are on **Report Menu → Other**. The first four are the **Editable Reports** — the
places you change how the product is configured. The fifth checks their work.

| Report | What a row is | You can |
|---|---|---|
| **Picklist Values** | one value inside one picklist | edit, add, delete |
| **Fields Values** | one field placed on one FOCD form | edit, add, delete |
| **Schema Values** | one field that exists in the system | edit only |
| **CoreReport Values** | one field placed on one Core Form section | edit only |
| **Config Integrity** | *(a validation report)* | run it |

Schema Values and CoreReport Values have **no Add and no Delete**. A Schema row
corresponds to a database index and a spreadsheet column, neither of which the
app can create; a CoreReport row places a field that must already exist.

### Schema is the spine

The four configuration tables are not independent lists. **Schema is the master
field list, and everything else names a field in it.**

```
                         ┌──────────────────────────┐
                         │          Schema          │   the master field list
                         └────┬──────────┬──────────┘
        ┌─────────────────────┤          ├─────────────────────┐
        ▼                     ▼          ▼                     ▼
  Picklist Values      Fields Values   CoreReport Values   OpenProject
  "Drives Field"          dfName        tbCRFieldName       mappings
```

A name that does not resolve does not throw an error. A write addressed to a row
that is not there is a silent no-op, and a picker whose picklist has gone simply
opens with no rows in it. Nothing turns red. That is why the fifth report exists.

### Config Integrity — run it after every spreadsheet import

An import replaces whole tables. Rename a field on one sheet and not another,
delete a row three tables still point at, empty a picklist — none of it announces
itself. **Config Integrity** measures it: it checks that every field name
resolves, that placements are unique, that `dfType` and `dfPicklist` agree, that
no picklist is down to its last value or referenced by nothing.

It never blocks and never repairs. Bad data must not stop the tool opening, and a
fix belongs where the value is owned — which is usually the spreadsheet.

**Make it a step in your import routine**, immediately after the import.

### Every write is stamped and trimmed

Two housekeeping behaviours worth knowing:

- Every change made in the app stamps that store's **Last Modified** column with
  the date, in `DD-MMM-YYYY`.
- Values are **trimmed on write**, and every comparison trims both sides. A
  trailing space typed into a name cannot create an invisible mismatch.

---

## 12. Picklists and Tagging

### The two kinds of picklist

This is the single most important thing in this section, and the most common
source of wasted effort.

**1. A tag-backed picklist.** The values are rows in the Tags table sharing one
picklist name. You maintain them — add, edit, remove, reorder. Most picklists in
the product are this kind.

**2. A live people-picker.** The field names a *person*, so its list is not
stored anywhere — it is read live from the **Resource Pool** (`Human` rows in
Resources) every time the picker opens. There are no tag values to maintain, and
adding some would achieve nothing.

> **If a field names a person, maintain the Resource Pool, not the Tags table.**

The fifteen people-picker fields:

| Field | Shown as |
|---|---|
| `tbOwner` | Owner |
| `tbMDPM` | Project Manager |
| `tbMDExSponsor` | Executive Sponsor |
| `tbMDBusinessAdvisor` | Business Advisor |
| `tbMDDeliveryManager` | Delivery Manager |
| `tbMDResponsibility` | Responsible Person |
| `tbMDBusinessOwner` | Business Owner |
| `tbMDPrimaryContact` | Primary Contact |
| `tbMDContact` | CR Requestor |
| `tbMDOrgManager` | Org Manager |
| `tbMDStageApprover` | Stage Approver |
| `tbMDEscalationOwner` | Escalation Owner |
| `tbMDCharterApprovedBy` | Charter Approved By |
| `tbMDProductOwner` | Product Owner |
| `tbMDScrumMaster` | Scrum Master |

**This list is growing.** Fields move from tag-backed lists to the live pool over
time, because a person's name kept in two places drifts. `tbMDResponsibleTeam` is
deliberately *not* here — it names a team, and stays a tag-backed picklist.

### Changing what a picklist offers

**Report Menu → Other → Picklist Values.**

1. Filter the **Picklist** column to the list you want.
2. Click the **edit icon** on a row to open it on the form. Change the name,
   short name, sort order, purpose or owner. It saves as you go — there is no
   separate Save step.
3. **Add** puts a new value into whichever picklist is currently filtered — so
   filter first; the button asks you to if you have not. Then open the new row on
   the form to name it.
4. **Delete** removes the value from the list. Any record already holding that
   value keeps it; the value simply stops being offered from now on.

Remember Rule 2: the grid itself is read-only here. It is how you *find* the
value; the form is where you change it.

The same values live on the **Tags** worksheet, and a spreadsheet import replaces
them wholesale. Both routes are valid. Use the app for a handful of values, the
workbook for a wholesale revision.

### Giving a field a picklist

A field opens a picklist because a Tags row points at it — not because of
anything in the code.

> Set a value's **Drives Field** to the field you want, and that value's
> **Picklist** becomes that field's list.

Two constraints:

- **A picklist name must not contain a hyphen.** Forms encode the name as the
  last segment of a hyphen-separated key, so a hyphen splits it in the wrong
  place and the picker opens empty. This has bitten before: `Part-time
  Full-time` had to become `Parttime Fulltime`.
- **A picklist cannot be empty.** See below.

### The never-empty rule

A picklist exists only as the set of rows carrying its name. Delete the last one
and the picklist itself is gone — leaving a field whose picker opens with nothing
in it and no way to put anything back.

So the app refuses. Deleting the **last** value in a picklist renames it to
**Not Assessed** instead. The picklist survives with one neutral value in it, and
the value you wanted rid of stops being offered. If you would rather remove it
outright, add a replacement first.

### Locked values and the padlock

Some values are read by the application itself. A schedule status of `Late` is
not just a word on a bar — it selects a colour. A budget band of `301K to 1000K`
is what a portfolio score is calculated from. Rename one and nothing warns you:
the comparison simply stops matching and the result quietly becomes wrong.

Those values carry a **padlock** in Picklist Values. On a locked row:

| | |
|---|---|
| **Locked** | the value's name, and its picklist name |
| **Still yours** | sort order, short name, purpose, owner |
| **Delete icon** | replaced by the padlock |

The picklist name is locked as well as the value, because renaming a picklist
detaches every value in it from its field — that breaks a whole list, not one
entry.

**You may still add your own values to any locked picklist.** Only the specific
values the code names are fixed. Section 4 lists them, and they are marked in
bold in the A–Z reference.

---

---

## 13. Dynamic Forms (FOCD)

FOCD — Forms on Cached Data — lets you add and remove fields on the product's
built-in forms without writing code. The number of forms is fixed; what goes on
them is yours.

### The seven forms

| Form name | The form it draws |
|---|---|
| `PF1` | L1 Portfolio flyout |
| `PJ1` | L2 Project flyout |
| `SPJ1` | L3 Sub-Project flyout |
| `TASK1` | L4 Task flyout |
| `ALLOC1` | L5 Allocation flyout |
| `dfRisk` | Risk form |
| `dfIssue` | Issue form |

### What a Fields row holds

**Report Menu → Other → Fields Values.** One row is one field on one form.

| Column | What it does |
|---|---|
| **Field** | the field this row places — **picked from Schema**, never typed |
| **Form** | which of the seven forms it appears on |
| **Type** | how it renders — see below |
| **Label** | the caption shown to the user on **this form**; free text |
| **Picklist** | which list the field opens, when Type is `WithPicklist` |
| **Tooltip** | the hover text on the field |
| **Top / Left / Width** | position and size, in pixels |
| **Show** | whether it is drawn at all |
| **Other 1** | which table the value is saved to — `tbTimebars` or `tbMetaData` |
| **Other 2** | `disabled` makes the field read-only on the form; blank leaves it editable |

> **Other 1 and Other 2 are load-bearing despite their names.** Other 1 decides
> where the field's value is stored and Other 2 whether the user can type into
> it. Other 3 and Other 5 are unused and are left blank on a new row.

The five field types:

| Type | Renders as |
|---|---|
| `NoPicklist` | a plain input |
| `WithPicklist` | an input that opens a picklist |
| `TextArea` | a multi-line box |
| `Editor` | a rich text editor |
| `Band` | a section heading bar, not a field |

#### The label is deliberately per-form

A field's **official label** lives once, in Schema, and is what the field is
called everywhere by default. The **Label on a Fields row overrides it for that
one form** — and that is not an inconsistency to be tidied away, it is the point.

The person configuring a form decides what the field should be called *in that
context*, in whatever language the team using the form actually speaks. The same
underlying field can read differently on each form it appears on:

| Form | Field | Official label (Schema) | Label on this form |
|---|---|---|---|
| ALLOC1 | `tbName` | Name | **Allocation Name** |
| ALLOC1 | `tbPercentTimeOn` | Percent Time Allocated | **% Allocated** |
| ALLOC1 | `tbCalendar` | Calendar | **Availability/Calendar** |
| dfIssue | `tbStart` | Start | **Created On** |
| dfIssue | `tbMDHealth` | Schedule Status | **Timebar Health** |

Roughly forty of the shipped Fields rows carry a label that differs from the
official one for exactly this reason. Leave it blank and the official label is
used; fill it in whenever the form's context calls for different wording. It is a
decision for the administrator and the users of that form to make together, and
nothing else in the product is affected by it.

> **The Core Form works the other way.** Its captions are *derived* from the
> official Schema label and cannot be overridden per placement — see
> [The Core Form](#14-the-core-form). The per-form override is a FOCD feature only.

> **`WithPicklist` is one word.** The old guidance said "With Picklist" with a
> space; a field configured that way does not open a picklist. You no longer have
> to remember this — the type is picked from a list.

### Adding, changing and removing fields

- **Add** is scoped to the form you are filtered to, because "which form" cannot
  be guessed. The new row lands below everything already on that form and inherits
  its neighbours' left, width and target store. **Name is left empty** — an
  invented field name is exactly the broken reference these rules exist to
  prevent — and the form opens straight onto it for you to pick one.
- **Type and Picklist move together.** Choosing a picklist sets the type to
  `WithPicklist`; choosing any other type clears the picklist. They cannot
  disagree.
- **Delete** warns you in the two cases whose consequence is not visible in the
  row: deleting a **Band** row removes the form's heading, and deleting the
  **last** row leaves the form empty.

### Positioning fields

Two ways, and they suit different jobs.

**In the grid** — Label, Coord Top, Coord Left and Width are inline-editable, the
only four columns on any configuration report that are. Use this when laying out
a whole form, where the point is comparing one field's numbers against its
neighbours'.

**On the form itself** — the blue icons at the top of a FOCD form move fields
directly. The second icon moves one field at a time, the third moves several
at once; dotted outlines show what is movable. Drag, then click the blue square
to save. Use this for fine-tuning.

### Rich text

Rich text fields use **Tiptap**. (Earlier documentation referred to Quill, which
was replaced.) Whether a field is a rich text editor is set by its type here, and
for the Core Form by a list in the application — see [The Core Form](#14-the-core-form).

---

## 14. The Core Form

The Core Form is the large collapsible form that shows a bar's full metadata,
grouped under business headings — Essential Facts, Progress & Health, Charter,
Investment Alignment and so on. It is the form a PM spends most time in.

> **It is configured from a different table than the FOCD forms.** FOCD forms are
> built from the **Fields** table (section 5); the Core Form is built from the
> **CoreReport** table. They share nothing but the Schema field list underneath
> them, so a change to one never affects the other.

| | FOCD forms | The Core Form |
|---|---|---|
| Configured from | **tbFields** — *Fields Values* report | **tbCoreReport** — *CoreReport Values* report |
| A row is | one field on one of the seven FOCD forms | one field in one Core Form section |
| Add and delete rows in the app | **yes** | **no** — spreadsheet only |
| Field caption | free text, **per form** (section 5) | **derived** from the field's Schema label |
| Positioning | pixel coordinates you set | column widths inside a four-column section |
| Sections | one Band row per heading | a fixed set of named sections |

Everything below is about the Core Form and the CoreReport table.

There are two ways to change the Core Form: **in the application**, one row at a
time, and **in the spreadsheet**, in bulk. They edit exactly the same data — the
CoreReport table — so use whichever suits the job.

### In the application

**Report Menu > Other > CoreReport Values.** One row is one field placed on one
section of the form. Filter to the section or field you want, then click the edit
icon to open the row on its form.

| To change | Edit |
|---|---|
| Which section a field is in | **Section Name** — pick from the list of sections the form actually draws |
| Order within a section | **ID** — fields are drawn in ascending ID within their section |
| Field width | **Columns** — 1, 2 or 3 |
| Shown at a level | the five level flags — Portfolio through Allocation |

Two things you will notice are read-only, and hovering them explains why:

- **Label** is **derived**. It always holds the field's own label from the Schema
  table, and changing it there updates every placement at once. Change a caption
  in **Schema Values**, not here.
- **Section Key** is written for you when you choose a Section Name. It has to
  match a section the form actually draws, so it is never typed.

Rows cannot be **added or deleted** in this report — a CoreReport row places a
field that must already exist, and adding placements is a spreadsheet job.

> `tbCRForm` is now vestigial. Every row is `v2`; version 1 of the Core Form is
> dead at runtime.

### In the spreadsheet

Almost everything about how the Core Form looks is held in the **CoreReport
sheet**, not in the code, and takes effect the next time you import the sheet and
reopen the form. Each row is one field on the form. `tbCRSection` says which
section it appears in, so moving a field from Essential Facts to Other Metadata
is a matter of changing that one cell — nothing in the code names a field's
section. `tbCRID` decides the running order: fields are drawn in ascending
`tbCRID` within their section, so to move a field you give it a number that
falls where you want it to sit. `tbCRNoOfColumns` is how many columns wide the
field is (1 is a normal field, 2 is half a four-column row, 4 is the full row),
and it applies to rich text editors exactly as it does to plain fields — an
editor set to 2 sits beside its neighbour instead of taking a row of its own. A
field behaves the same wherever you put it: width is the field's own, from the
sheet, while how many columns a section is divided into belongs to the section,
so moving a field into a different section does not drag a column count in with
it. Every section is four columns wide, and a width larger than that is capped
at the full row, so a stray value in the sheet costs you a wide field rather
than a broken one.
`tbCRLabel` is the caption shown above the field — but it is **derived from the
field's label in Schema** and rewritten whenever that changes, so set the caption
there rather than here. `tbCRSectionName` is the heading printed above the
section. The five `tbCRPortfolio` … `tbCRAllocation`
columns decide, per hierarchy level, whether the field appears at all: `show`
means show, anything else means hide. Set `tbCRForm` to `v2` on every row, or
the form will not see it. (Every row is `v2` now — v1 is dead at runtime — so this
column is vestigial, but a blank still hides the row.)

A few things are not in the sheet, because it has no column for them. Whether a
field is a **rich text editor** comes from `RICH_TEXT_FORM_FIELDS` in
`scripts/focd/dfmain.js` — that one list also drives how the field renders in the
tabular reports and the Gantt grid, so adding a field there changes it
everywhere at once. Whether a field is a **date picker** comes from its Type
being `Date` on the master field list, and whether it is **read-only** or forced
onto a **new row** comes from `scripts/reports/coreFormV2Fields.js`. Which
**picklist** a field opens is data of a different kind: add or point a `tbTags`
row's `tbTagTbInternalName` at the field and its `tbTagGroup` becomes that
field's list, with no code change — except for people-pickers such as Owner or
Sponsor, which always read the live resource pool and are listed in
`PEOPLE_PICKER_FIELDS` in `scripts/reports/editableCells.js`. Finally, the
Investment Alignment and Benefits & Financial Value sections are hidden outside
Costbars regardless of what the sheet says; that rule is `HIDDEN_BY_PRODUCT` in
`scripts/reports/coreFormV2.js`, and when it fires it says so in the browser
console.

### Where each thing lives

| To change… | Edit | Notes |
|---|---|---|
| Which section a field is in | `tbCRSection` | Must match a section id in `CFV2_SECTIONS` |
| Order within a section | `tbCRID` | Ascending; see the warning below |
| Field width | `tbCRNoOfColumns` | 1–5; editors included |
| Field caption | **`tbSchLabel` in Schema** | `tbCRLabel` follows it automatically; it is read-only in the app |
| Section heading | `tbCRSectionName` | Taken from the section's first row that has one |
| Shown at a level | `tbCRPortfolio` … `tbCRAllocation` | `show`, or anything else to hide |
| Which picklist a field opens | `tbTags` row | `tbTagTbInternalName` → `tbTagGroup` |
| Rich text editor on/off | `RICH_TEXT_FORM_FIELDS`, `dfmain.js` | Also changes the grids |
| Date picker | Type `Date` on the master field list | Uses the app's `DD-MMM-YYYY` format |
| Read-only, forced new row | `coreFormV2Fields.js` | Generated file; see its header |
| Columns a section is divided into | `columns` on the section in `CFV2_SECTIONS` | Every section is four across; set this only to break that |
| Sections and their order | `CFV2_SECTIONS`, `coreFormV2Fields.js` | |
| Costbars-only sections | `HIDDEN_BY_PRODUCT`, `coreFormV2.js` | Overrides the sheet |

### Two things that will bite you

**`tbCRID` is unique.** The store enforces it, and an import that leaves two
rows sharing a number is rejected part-way through. The safe way to reorder a
section is to reuse the numbers that section already has, dealt out in the new
order — then nothing outside the section moves and no number can clash with
another section.

**A field must be known in two other places or it will look broken rather than
missing.** If it has no entry in `CFV2_FIELDS` the form skips it and logs a
warning to the console. If it is absent from the join's field list in
`scripts/tbdatabaseasync.js` it draws as an empty box that accepts what you type
and then shows blank again when you reopen the form — the field saved correctly,
but the form cannot read it back. If a field you added to the sheet behaves that
way, that list is the first place to look.

---

---

## 15. What Is Configurable, by Product

A summary of what can be tailored. All three products share one build, so
anything marked as common applies everywhere.

### Common to all three

**Scheduling and calendar**
- Report Date — the "as-of" date every progress calculation is measured against
- Timescale start and finish, weekly vs. monthly view, zoom level
- Working calendar exceptions and holidays (AdminPanel sheet, rows 6–100)

**Canvas display**
- Dark / light theme; bar row spacing; hierarchy level filter (L1–L5)
- Show or hide: completed bars, baseline bars, ghost bars, dependency lines,
  hierarchy connector lines
- Show or hide Risk, Issue and Change Request bars

**Metadata and tagging**
- The full metadata field set, and the picklist behind any dropdown (section 3)
- Rich-text business case sections
- Custom sort order per item

**Forms**
- Which fields appear on which FOCD form, their labels, tooltips, picklists,
  position, width and read-only state (section 5)
- The Core Form's sections, field order, widths and per-level visibility (section 6)

**Status and health**
- All automation thresholds, via `apMetadataRules` (section 7)

**Data**
- Full JSON backup and restore; per-store export; baseline snapshots

**Licence** *(display only, not user-editable after install)*
- Licensed organisation, expiry date, bar and project limits

### Agilebars

- Five-lane Kanban — Backlog, Will Do, Doing, Finalizing, Done — with automatic
  percent-complete mapping per lane
- Card content as text or as a bar chart
- Progress measured against the Report Date or against today (`apMPO`)
- Fixed-sizing mode, where hours never change when a bar is dragged
- Sprint name per task; multiple boards; burndown chart
- Hierarchy is L2 and L4 only — L1, L3 and L5 are hidden by product

### Timebars

- Full five-level hierarchy, drag-to-schedule with working-day calculations
- Resource pool: role, skill, department, manager, location, team leader
- Work calendar and general availability percentage per resource
- Resources per line, and pixels-per-person display scaling
- Weekly and monthly demand views by name, role, skill, location and department
- Baseline snapshots and overlay

### Costbars

- PPM tabular, card and scorecard views; demand grids
- Prioritisation and scoring configuration
- Investment category, objective, strategy and initiative classification
- ROM estimate, estimation class, size and weighting
- Optional financial scoring: NPV, IRR, payback period, economic value added,
  benefit-cost ratio
- Risk vs. Size and Complexity assessment

---

---

## Appendix A — Picklist Reference A–Z

<!-- BEGIN GENERATED PICKLIST REFERENCE -->

**97 picklists, 608 values.** Every picklist in the product, with the field it
drives, its purpose, and its values in sort order.

**Values in bold are locked** - the code compares against that exact text (144 of them). See *Values the Code Depends On* in the *Data Model and Scheduling Engine Guide*.

> This reference is **generated from the live data** by `tools/buildPicklistReference.py`.
> Run that rather than editing entries here; hand-editing is how the previous
> version came to list twelve picklists that no longer existed.

Picklists named after a person are absent by design - those fields read the
Resource Pool live and have no values to list. See *The two kinds of picklist*
in section 12.

---

### Approval State - `tbMDState`

*Workflow Life-cycle tag*

Values: **Spawned**, **Awaiting Input**, **Requested Approval**, **Awaiting Approval**, **Approved**, **Awaiting Review**

> Every value in this picklist is locked. Add your own freely; do not rename these.

### Benefit Cost Ratio - `tbMDBenefitCostRatio`

*Financial scoring value used at the project level.*

Values: **> 5:1**, **3:1 - 5:1**, **2:1 - 3:1**, **1.5:1 - 2:1**, **1:1 - 1.5:1**, **Not Assessed**

> Every value in this picklist is locked. Add your own freely; do not rename these.

### Benefit Owner - `tbMDBenefitOwner`

*Values for the tbMDBenefitOwner field*

Values: HR, Finance, Engineering, Shareholders

### Benefit Type - `tbMDBenefitType`

*Values for the tbMDBenefitType field*

Values: Financial, Cost Avoidance, Non-Financial

### Billing Type - `tbMDBillingType`

*Mainly Used in CR's and Tasks*

Values: Billable, Non Billable, Not Assessed

### Budget Estimate - `tbMDROMEstimate`

*Fixed ranges for sizing a project budget*

Values: **0 to 100K**, **101K to 300K**, **301K to 1000K**, **1001K to 5000K**, **5000K Plus**

> Every value in this picklist is locked. Add your own freely; do not rename these.

### Budget Fiscal Year - `tbMDBudgetFiscalYear`

*Values for the tbMDBudgetFiscalYear field*

Values: FY2026, FY2027, FY2028

### Calendar - `tbResResourceCalendar`

*Workday hours, used cor calculating wok on an Allocation*

Values: 4, 7.5, 8, 24

### Closure Reason - `tbMDClosureReason`

*Values for the tbMDClosureReason field*

Values: **Completed**, **Cancelled**, Deferred

### Cost Center - `tbMDCostCenter`

*Values for the tbMDCostCenter field*

Values: CC-1000 Operations, CC-2000 Technology, CC-3000 Corporate

### Cost Code - `tbResCostCode`

*Custom Cost Code Metadata for reporting costs, mainly used at Task or Allocation  level*

Values: A26, B44, C99, D11, E11, E112

### Cost Type - `tbCostType`

*Cost Type Metadata to separate costs e.g. Software, Equipment . Mainly used at Task or Allocation  level*

Values: Equipment, Hardware, Software

### CR Category - `tbMDCategoryCR`

*Metadata to categorize Change Requests. Used at Task level if Sub-Type is CR*

Values: Field, Engineerng, Equipment, Product, Defect

### Cross Team Collaboration - `tbPASCrossTeamCollaboration`

*Helps determine the Project Asessment Score.*

Values: Single team, 2-3 teams, 4-6 teams, 7-10 teams, Many teams/departments

### Currency - `tbMDCurrencyCode`

*Values for the tbMDCurrencyCode field*

Values: CAD, USD, EUR

### Department - `tbMDDepartment`

*Task or Allocation Level tagging identifying what department is responsible*

Values: Sales and Marketing, Operations, Finance, Procurement, Business Development, Research and Development, Engineering

### Domain Experience - `tbPASDomainExperience`

*Helps determine the Project Asessment Score.*

Values: Extensive experience, Good experience, Some experience, Limited experience, New domain

### Escalation Level - `tbMDEscalationLevel`

*Metadata to support the Excalation process, mainly for Projects but can be used at any level.*

Values: Executives, Directors, **Project Office**, **Not Assessed**

### Estimation Class - `tbMDEstimationClass`

*Project Tagging for the quality of the Estimate*

Values: **SWAG**, **Based on History**, **Resource Driven**

> Every value in this picklist is locked. Add your own freely; do not rename these.

### Executive Commitment - `tbMDSeniorLevelCommitment`

*Project Tagging for degree of management commitment.*

Values: **Full**, **Strong**, **Moderate**, **Limited**, **Not Clear**, **Not Assessed**

> Every value in this picklist is locked. Add your own freely; do not rename these.

### External Integrations - `tbPASExternalIntegrations`

*Helps determine the Project Asessment Score.*

Values: None, 1-2 simple integrations, 3-5 moderate integrations, 5+ complex integrations, Many critical integrations

### ExtSystemResID - `tbResExtSystemResID`

*Use to tie into or integrate other systems in the organization*

Values: 456M23, 456M24

### Funding Source - `tbMDFundingSource`

*Values for the tbMDFundingSource field*

Values: Capex, Opex, Client Funded

### Gate - `tbMDGate`

*Project Level tagging identifying a project gating process*

Values: 1 Approved to Design, 2 Approved to Develop, 3 Approved to Implement, Not Applicable

### Health Cost - `tbMDHealthCost`

*Core Health Indicators mainly used at Portfolio and Project and Sub-Project/Work Pckage Level*

Values: Green, Yellow, **Not Assessed**, Red

### Health Hours - `tbMDHealthHours`

*Core Health Indicators mainly used at Portfolio and Project and Sub-Project/Work Pckage Level*

Values: Green, Yellow, **Not Assessed**, Red

### Health Issues - `tbMDHealthIssues`

*Core Health Indicators mainly used at Portfolio and Project and Sub-Project/Work Pckage Level*

Values: Green, Yellow, **Not Assessed**, Red

### Health Overall - `tbMDHealthOverall`

*Core Health Indicators mainly used at Portfolio and Project and Sub-Project/Work Pckage Level*

Values: Green, Yellow, **Not Assessed**, Red

### Health Risk - `tbMDHealthRisk`

*Core Health Indicators mainly used at Portfolio and Project and Sub-Project/Work Pckage Level*

Values: Green, Yellow, **Not Assessed**, Red

### Health Schedule - `tbMDHealthSchedule`

*Core Health Indicators mainly used at Portfolio and Project and Sub-Project/Work Pckage Level*

Values: Green, Yellow, **Not Assessed**, Red

### Health Scope - `tbMDHealthScope`

*Core Health Indicators mainly used at Portfolio and Project and Sub-Project/Work Pckage Level*

Values: Green, Yellow, **Not Assessed**, Red

### Internal Rate of Return - `tbMDInternalRateOfReturn`

*Tagging financial values at project level.*

Values: **> 50%**, **25% - 50%**, **15% - 25%**, **5% - 15%**, **< 5%**, **Not Assessed**

> Every value in this picklist is locked. Add your own freely; do not rename these.

### Investment Category - `tbMDInvestmentCategory`

*Project Portfolio Balancing â€“ Product/System Focus*

Values: **Not Assessed**, Business Systems, Our Core Products, Productivity Tools, **Innovation**, Digital Transformation, Infrastructure and Security, Data and Analytics

### Investment Initiative - `tbMDInvestmentInitiative`

*Project Portfolio Balancing â€“ Capability Building*

Values: **Not Assessed**, Strengthen Cybersecurity Infrastructure, Build AI/ML Capabilities, Faster response to new business opportunities, Improve employee skills, Improve product reliability, Improve productivity with Agile Teams, Source Cloud services for our Core products, Support modern digital workplace

### Investment Objective - `tbMDInvestmentObjective`

*Project Portfolio Balancing â€“ Business Impact*

Values: **Not Assessed**, **Grow the Business**, **Run the Business**, Modernize the Business, **Transform the Business**

### Investment Strategy - `tbMDInvestmentStrategy`

*Project Portfolio Balancing â€“ Specific Business Goals*

Values: **Not Assessed**, Attract and retain the best people, Improve our core products, Ensure compliance, Accelerate Time-to-Market, Improve customer service, Build Recurring Revenue Streams, Increase share of market, Reduce waste, Drive Contract Renewals, Server more customers

### Issue Category - `tbMDIssueCategory`

*Metadata to categorize Issues. Used at Task level if Sub-Type is Issue*

Values: Product, Procurement, Construction, **Technical**, Schedule

### Labour Type - `tbResLabourType`

*Type of Resource Generic, Human or other*

Values: **Generic**, **Human**, Other

### Location - `tbResLocation`

*Where is resource located*

Values: Edmonton, Halifax, Ottawa

### Manager - `tbResManager`

*The Resources Manager*

Values: George Bush, John Cougar, Sally Res, Rich Delment, Mitsy Meta, Manny Fact, Marg Ting, Ron Hay, Ron Scope, Al League, Sally Sail, Joe Purch

### Market Timing - `tbPASMarketTiming`

*Helps determine the Project Asessment Score.*

Values: Perfect timing, Good timing, Acceptable timing, Challenging timing, Poor timing

### Mitigation Status - `tbMDMitigationStatus`

*Identify the status if onging mitigation for a Risk*

Values: Identified, Assessed, Mitigation Planned, **In Progress**, Mitigated, Under Review, Accepted, Transferred, **Escalated**, Closed, Deferred

### Net Present Value - `tbMDNetPresentValue`

*Tagging financial values at project level.*

Values: **> $5M**, **$1M - $5M**, **$250K - $1M**, **$50K - $250K**, **< $50K**, **Not Assessed**

> Every value in this picklist is locked. Add your own freely; do not rename these.

### Parttime Fulltime - `tbResPartTimeFullTime`

*Is the Resource Full time employee or part time*

Values: **Full Time**, **Part Time**

> Every value in this picklist is locked. Add your own freely; do not rename these.

### Payback Period - `tbMDPaybackPeriod`

*Set financial values at the Project Level*

Values: **< 1 year**, **1 - 2 years**, **2 - 3 years**, **3 - 5 years**, **> 5 years**, **Not Assessed**

> Every value in this picklist is locked. Add your own freely; do not rename these.

### Percent Available - `tbResPercentGeneralAvailability`

*Default Percent Available for the allocation.*

Values: 10, 25, 50, 75, 100

### PercentTimeAllocated - `tbPercentTimeOn`

*Can be used to override the percent allocated on the Allocation*

Values: 10, 25, 50, 75, 100

### Phase - `tbMDPhase`

*High-level Phase of Project or Program*

Values: **Closing**, Executing, **Initiating**, **Planning**

### Popular - `tbTagPopular`

*Groups tags so commonly used ones surface first*

Values: General, NewBars, NewBarsNo, OpenProject Integration, PPM, Project Management, Resource Management, Risks and Issues Management, StdTasks

### Portfolios - `tbMDPortfolio`

*Optional field to tag a project with another Portfolio Scheme*

Values: Building Services, Business Support Systems, Core Product Delivery, IT Platform, R&D New Technology

### Primary LOB - `tbMDPrimaryLineOfBusiness`

*Optional field to tag a project with a Business Owner*

Values: Business Development, Business Technology Solutions, Corporate Affairs, Engineering and Product Delivery, Human Resources, Research and Development

### Primary Role - `tbResPrimaryRole`

*Set role for resource demand calculations*

Values: **Executive Sponsor**, Director, Manager, Department Head, **Project Manager**, Vendor Manager, R&D, Innovation Manager, Engineer, Solution Architecture, Developer, Software Engineer, DevOps Engineer, Database Administrator, UX/UI Designer, Graphic Designer, Technical Writer, Test Automation, Tester, Risk Manager, Network Administrator, Financial Analyst, HR SME, Finance SME, Marketing Manager, Sales Manager, RF Engineer, Field Service Technician, NOC Technician

### Primary Skill - `tbResPrimarySkill`

*Tag resources for resource for skill visibility*

Values: IT Architecture, Testing, Testing Software, Design, Design - Mechanical, Project Management, Procurement, Catch All Skill, na, Leadership, Management, Strategic Planning, Business Analysis, Stakeholder Management, Client Relationship Management, Vendor Management, Contract Management, Product Management, **Innovation**, Change Management, Solution Architecture, Siebel CRM Development, Cloud Computing, DevOps, Database Administration, Data Analytics, Artificial Intelligence, Robotics, UX/UI Design, Technical Writing, Document Management, Quality Assurance, Network Security, Risk Management, IT Operations, Incident Management, Network Administration, Network Operations (NOC), Customer Support, Training & Development, Human Resources, Financial Analysis, Facilities Management, Communication, Marketing, Sales, RF Engineering, Field Services, Site Acquisition, Design - UI, Testing Hardware, Java Development, JavaScript / Web Development, Python Development

### Product - `tbMDProduct`

*If this timebar is for creating a product, use this tag for reporting by Product*

Values: Access Point, Analyzers, Antenna, Billing System, CEP, Customer Solution, DM System, Hot spot, Hot Spot, HR System, NA, Network, SAP System, Secure Cloud System, Security System, Ticketing system, Tools, VNS System, WIFI System

### Program Activity Alignment (PAA) - `tbMDProgActivityAlignment`

*GOC Field for tracking programs.*

Values: 1 1 1 1 Sub-Sub-Program: Banks support of One-Benefit distribution, 1 1 1 2 Sub-Sub-Program: Tax System changes to suit new One-Benefit., 1 1 1 Sub-Program: One Canada wide monthly payment  to each Canadian, 1 1 Program: Common One-Benefit service for all Canadians, Taxes, Food

### Programs - `tbMDProgram`

*Optional field to tag a project to a Program for Program Reporting*

Values: Building and Office Modernization, Business Continuity Management Program, Centralized Billing and Receivables, Continuous Improvement Transformation, Continuous Internal Delivery Enablement, Core Operations Program, Digital Workplace - Transformation

### Project Assessment Status - `tbPASStatus`

*Helps determine the Project Asessment Score.*

Values: Draft, **Completed**, **Approved**, **Rejected**, **On Hold**

### Project Assessment Type - `tbPASProjectType`

*Helps determine the Project Asessment Score.*

Values: Incremental Improvement, **Enhancement**, New Feature, New Product, Breakthrough Innovation

### Project Category - `tbMDCategory`

*Metadata to categorize bars at all leveles, Projects, Tasks etc.*

Values: SW Upgrade, Business System Configuration, HW Upgrade, Cloud Service New or Upgrade, HW, SW System Upgrade, New Ground to Cloud Service, Not Assessed, New HW, SW System, Upgrade Ground to Cloud Service, Not Applicable

### Project Similarity - `tbPASProjectSimilarity`

*Helps determine the Project Asessment Score.*

Values: Very Similar, Somewhat Similar, Moderately Different, Quite Different, Completely New

### RandIStage - `tbMDStageRIC`

*Controlling Risk and Issue life-cycle workflow*

Values: 1 Proposed, 2 Triaged, 3 Prioritized, 4 Assigned, 5 Solving, 6 Mitigating, 7 Closed

### RandIState - `tbMDStateRIC`

*Workflow Life-cycle tag*

Values: Awaiting Input, Awaiting Approval, Approved, Awaiting Review

### RandIStatus - `tbMDStatusRIC`

*Timebar Task, Issue, Risk or CR Status.*

Values: Managing, **Concerned**, **Critical**, **Completed**

### Regulatory Approvals - `tbPASRegulatoryApprovals`

*Helps determine the Project Asessment Score.*

Values: None required, Internal approvals, Industry standards, Government approvals, Multiple regulatory bodies

### Resource Class - `tbResResourceClass`

*Resource Class External, Seasonal etc*

Values: External, Permanent, Seasonal

### Resource Department - `tbResDepartment`

*Resource belongs to what department*

Values: Finance, Field Operations, Information Technology, Legal Compliance, Engineering, Management

### Resource Type - `tbResResourceType`

*Resource type equipment, labour, material etc.*

Values: Equipment, Labour, Material

### Responsible Team - `tbMDResponsibleTeam`

*Project Tagging*

Values: Product Engineering, Business Analysis, Information Technology, IT Operations, Accounting, Corporate Communications, Finance, Procurement, Procurement & Vendor Mgmt, Design, Documentation, Executive Leadership, Facilities, Field Operations, Human Resources, Marketing, Product & Innovation, Product Management, Project Delivery, Quality Assurance, Sales, Security & Risk, Software Engineering, Solutions Engineering, Strategy & Innovation

### Risk Category - `tbMDRiskCategory`

*Metadata to categorize Issues. Used at Task level if Sub-Type is Risk*

Values: Schedule, Financial, **Operational**, **Technical**, Organizational

### Risk Impact - `tbMDImpact`

*Tagging risks for the risk score result*

Values: **Very Low**, Low, Medium, High, **Very High**, **Not Assessed**

### Risk Probability - `tbMDProbability`

*Tagging risks for the risk score result*

Values: **Very Unlikely**, **Unlikely**, **Likely**, **Very Likely**, **Certain**, **Not Assessed**

> Every value in this picklist is locked. Add your own freely; do not rename these.

### Risk Vs Size - `tbMDRiskVsSizeAndComplexity`

*Supports bubble charts*

Values: **Not Assessed**, **41-50 Complex but Manageable**, **0-10 Very Small and Simple**, **51-60 Significant Complexity**, **11-20 Small and Straightforward**, **61-70 Large and Complex**, **21-30 Medium with Some Complexity**, **71-80 Very Large and Complex**, **31-40 Large with Moderate Complexity**, **81-90 Highly Complex and Risky**, **91-100 Extremely Complex and Risky**

> Every value in this picklist is locked. Add your own freely; do not rename these.

### Schedule Status - `tbMDHealth`

*For Reporting Color indicators*

Values: **Completed**, **Early**, **Late**, **On schedule**, **Slipping**, **Not Assessed**, **Blocked**

> Every value in this picklist is locked. Add your own freely; do not rename these.

### Severity - `tbMDSeverity`

*Indicates how severe a priority item is, in terms of impact*

Values: **Critical**, Important, **Normal**

### Show In Reports - `tbMDShowIn`

*Manly used at Task, Issue, Risk, CR levels to ensure the bar shows in specific system report*

Values: Facility Schedule, **Key Deliverables**, Assembly Shop, **Key Milestones**, **Key Risks**, **Project Charter**

### Size - `tbMDSize`

*Project or Task Tagging*

Values: Small, Medium, Large, Huge

### Sponsoring Department - `tbMDSponsoringDepartment`

*Project Tagging*

Values: Finance, IT Department, Presidents Office, Communications Public Relations, Legal Compliance, Operations

### Stage - `tbMDStage`

*Controlling project life-cycle workflow*

Values: 1 Proposed, 2 Triaged, 3 Prioritized, 4 Selected, 5 Assigned, 6 Delivering, 7 Delivered, 8 Closed

### Stakeholder Count - `tbPASStakeholderCount`

*Helps determine the Project Asessment Score.*

Values: 1-5 stakeholders, 6-10 stakeholders, 11-20 stakeholders, 21-50 stakeholders, Over 50 stakeholders

### Strategic Priority - `tbMDPriorityStrategic`

*Project Tagging*

Values: High, Low, Medium

### SubType - `tbSubType`

*Task, Risk, Issue or Other. Determines Blue bar sub type*

Values: **Issue**, Other, **Risk**, Task, CR

### Supervisor - `tbResSupervisor`

*Resources supervisor, not Manager*

Values: John Hammond, Nora Antenna, Jim Key, Sam Backhaul, Helen Hunt, Lena Spectrum

### Task Category - `tbMDCategoryTask`

*Categorises a Task, kept separate from the Project-level Category*

Values: Engineering, Purchasing, Assembly, Construction, Operate

### Task Status - `tbMDStatusTask`

*Status of a Task, kept separate from the Timebar Status picklist*

Values: **Not Started**, Started, **Late**, **Not Assessed**

### tbType - `tbMDTypes`

*System Internal element that defines the bar type. E.g. Task, Project etc.*

Values: **Portfolio**, Project, **Sub-Project**, **Milestone**, Task, **Allocation**

### tbTypeInternal - `tbType`

*System Internal element that defines the bar type. E.g. Task, Project etc.*

Values: **Portfolio**, Project, **Sub-Project**, Task, **Milestone**, **Allocation**

### Team Leader - `tbResTeamLeader`

*Resource or person tagging*

Values: France Finney, Mack Engineer, Chris Java, Kai Pipeline, Mike Side, Jack Top, App Team, CRM Team, Desktop Team

### Team Size - `tbPASTeamSize`

*Helps determine the Project Asessment Score.*

Values: 1-3 people, 4-8 people, 9-15 people, 16-30 people, Over 30 people

### Team Tech Experience - `tbPASTeamTechExperience`

*Helps determine the Project Asessment Score.*

Values: Expert level, Advanced, Intermediate, Basic, No experience

### Technology Novelty - `tbPASTechnologyNovelty`

*Helps determine the Project Asessment Score.*

Values: Proven/Mature, Established, Emerging, Cutting-edge, Experimental

### Test Status - `tbMDTestStatus`

*Values for the tbMDTestStatus field*

Values: **Not Started**, **In Progress**, Passed

### Timebar Priority - `tbMDPriority`

*Set timebar priority*

Values: High, **Immediate**, Low, **Normal**, **Not Assessed**

### Timebar Status - `tbMDStatus`

*Mandatory values for enabling reporting.*

Values: **In progress**, New, **Rejected**, Closed, **On Hold**, **Blocked**

### Type Of Initiative - `tbMDProjectType`

*Project Type Tagging for Portfolio Balancing*

Values: **Mandatory Compliance**, **Maintenance Operational**, **Growth Enhancement**, External Contract Delivery, Internal Delivery

### Value Stream - `tbMDValueStream`

*Values for the tbMDValueStream field*

Values: Customer Experience, Operations, Technology Platform

### Vendor Dependencies - `tbPASVendorDependencies`

*Helps determine the Project Asessment Score.*

Values: No vendors, 1 reliable vendor, 2-3 known vendors, Multiple/new vendors, Critical unknown vendors

### YesNo - `tbMDYesNo`

*for tagging a time bar for true or false on unknown*

Values: No, Yes, NA

<!-- END GENERATED PICKLIST REFERENCE -->

---

---

## Related Help Topics

- [Data Synchronization, Backup, Recovery and Retention Guide](https://www.timebars.com/knowledgebase/helparticles/common-04-data-synchronization-backup-recovery-and-retention-user-guide) - Import/export data for bulk editing
- [Cloud Publishing Guide](https://www.timebars.com/knowledgebase/helparticles/common-07-cloud-publishing-guide) - Publish reports to the cloud
- [User Interface Guide](https://www.timebars.com/knowledgebase/helparticles/common-02-user-interface-guide) - Navigate the application
- [Data Synchronization, Backup, Recovery and Retention Guide](https://www.timebars.com/knowledgebase/helparticles/common-04-data-synchronization-backup-recovery-and-retention-user-guide) - Understand the data model


