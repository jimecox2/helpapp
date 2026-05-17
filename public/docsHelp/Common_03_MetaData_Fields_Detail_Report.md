# MetaData Fields Detail Report - Common Across Products
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

This reference document is intended for organisation administrators and power users responsible for configuring and maintaining Timebars Ltd. products. It provides a comprehensive catalogue of every metadata field active across the platform — what each field does, which picklist it draws from, whether its values are user-configurable or system-reserved, and which application modules depend on it.

Understanding field behaviour across modules is essential before making any changes to picklist values, field labels, or tag configurations. Some fields are safe to extend with new values; others have values that are hard-coded into the software and must remain exactly as defined. Modifying a system-reserved value will not produce an error — it will silently break the filters, calculations, colour coding, or views that depend on it.


---

## Table of Contents

- [MetaData Fields Detail Report - Common Across Products](#metadata-fields-detail-report---common-across-products)
  - [Table of Contents](#table-of-contents)
  - [1. Scheduling \& Core Application (Scheduling Module)](#1-scheduling--core-application-scheduling-module)
    - [Bar Type \& Identity](#bar-type--identity)
    - [Scheduling Dates \& Duration](#scheduling-dates--duration)
    - [Progress \& Completion](#progress--completion)
    - [Work \& Cost](#work--cost)
    - [Resource Fields](#resource-fields)
    - [Hierarchy \& Parent–Child Fields](#hierarchy--parentchild-fields)
    - [Canvas Positioning](#canvas-positioning)
    - [Kanban Fields](#kanban-fields)
    - [Resource Calculation Store Fields (`tbResCalcs`, `tbResCalcs2`)](#resource-calculation-store-fields-tbrescalcs-tbrescalcs2)
    - [Admin Panel Settings](#admin-panel-settings)
    - [Status \& Health Colour Lookups (from `tbmain.js`)](#status--health-colour-lookups-from-tbmainjs)
  - [Note: blocked has been removed and code has to change??](#note-blocked-has-been-removed-and-code-has-to-change)
  - [2. Risks, Issues \& Change Requests (R\&I Module)](#2-risks-issues--change-requests-ri-module)
  - [3. Portfolio \& Project Management (PPM Module)](#3-portfolio--project-management-ppm-module)
    - [Strategic Alignment Inputs (SV Score)](#strategic-alignment-inputs-sv-score)
    - [Financial Inputs (SV Score — Financial Component)](#financial-inputs-sv-score--financial-component)
    - [Ability to Execute (AE Score) Inputs](#ability-to-execute-ae-score-inputs)
    - [Lifecycle \& Governance Fields](#lifecycle--governance-fields)
    - [People \& Governance Fields](#people--governance-fields)
    - [System-Calculated Output Fields](#system-calculated-output-fields)
    - [Rich-Text / Free-Text Fields](#rich-text--free-text-fields)
  - [4. Reports Module Fields](#4-reports-module-fields)
    - [1. Risks, Issues \& Change Requests Reports Field Usage](#1-risks-issues--change-requests-reports-field-usage)
    - [2. Portfolio Reports Field Usage](#2-portfolio-reports-field-usage)
    - [3. Scheduling Reports Field Usage](#3-scheduling-reports-field-usage)
    - [4. Other Reports Field Usage](#4-other-reports-field-usage)

---

> **Before making any changes**, locate the field in the relevant section below and check
> whether it is marked **System-Reserved**. System-reserved fields and values must not be
> renamed, removed, or reordered. You may safely **add** new values to configurable picklists,
> but existing system-reserved values must remain intact.



## 1. Scheduling & Core Application (Scheduling Module)

---

### Bar Type & Identity

---

**Field Name**: `tbID`
**Picklist Name:** None (user-assigned or system-generated)
**Purpose**: Unique identifier for every bar across all stores. Used as the primary key for all database lookups, inter-bar relationships, data attributes, and HTML element IDs throughout the application.
**Values:** Alphanumeric string, e.g. `A001`

---

**Field Name**: `tbName`
**Picklist Name:** None (free text)
**Purpose**: The human-readable display label for a bar. Rendered on the canvas, Kanban cards, hierarchy panels, reports, and all RDD (Right Detail Detail) panels.
**Values:** Free text

---

**Field Name**: `tbType`
**Picklist Name:** None *(system-reserved enum)*
**Purpose**: Defines the hierarchy level of a bar and controls every aspect of its rendering — HTML template, strip colour, icon, indent depth, scheduling behaviour, and which calculations apply. Also gates which child types can be created beneath it.
**Values:** `Portfolio`, `Project`, `Sub-Project`, `Task`, `Milestone`, `Allocation`, `Gate`

> **System-Reserved:** All values are hardcoded across bar HTML functions, the scheduling engine, hierarchy builder, filtering engine, and resource calculation modules. Any rename will break rendering, hierarchy, and calculations silently.

---

**Field Name**: `tbSubType`
**Picklist Name:** Item Type
**Purpose**: Secondary classification of a bar. Used to render special icons (risk/issue flags) on bars in the canvas and Gantt view, to route items to the R&I views, and to exclude risks/issues from resource calculations and certain reports.
**Values:** `Risk`, `Issue`, `CR`

> **System-Reserved:** All three values are hardcoded across `tbMainDrawBars.js`, `tbMainModernView.js`, `tbMainFilterManager.js`, `tbMainDrawBarsFilterManager.js`, and `tbp3menu.js`.

---

### Scheduling Dates & Duration

---

**Field Name**: `tbStart`
**Picklist Name:** None (date — format `DD-MMM-YYYY`)
**Purpose**: The planned start date. Used to calculate bar horizontal position on the canvas relative to the timescale start. Input to all duration and work-day calculations.
**Values:** Date string, e.g. `24-Jan-2024`

---

**Field Name**: `tbFinish`
**Picklist Name:** None (date)
**Purpose**: The planned finish date. Used to calculate bar width on the canvas. Together with `tbStart` drives `tbDuration` in working days.
**Values:** Date string

---

**Field Name**: `tbDuration`
**Picklist Name:** None (numeric — working days)
**Purpose**: Planned duration in working days (excludes weekends and holidays). Drives bar pixel width on the timescale: `barWidthPx = tbDuration × apTS_WeeklyPxFactor / 7`.
**Values:** Positive integer

---

**Field Name**: `tbDurationRemaining`
**Picklist Name:** None (numeric — working days)
**Purpose**: Working days remaining from the status date to `tbFinish`. Displayed in the RDD panel. Zero when complete, equals `tbDuration` when not started.
**Values:** Non-negative integer

---

**Field Name**: `tbAStart`
**Picklist Name:** None (date)
**Purpose**: Actual start date. Set automatically by the scheduling engine when the status date passes `tbStart` and the bar is in progress. Triggers the dual-bar rendering mode (planned bar + actual progress overlay).
**Values:** Date string or empty string `""` when not yet started

---

**Field Name**: `tbAFinish`
**Picklist Name:** None (date)
**Purpose**: Actual finish date. Set automatically when `tbFinish` is on or before the status date. Used to detect completion and suppress ghost bar rendering: bars where `tbAFinish` is set and `tbPercentComplete === 100` are hidden from the ghost bar layer.
**Values:** Date string or empty string `""`

---

**Field Name**: `tbConstraintType`
**Picklist Name:** None *(system-reserved)*
**Purpose**: Locks a bar to its current position so the auto-scheduler cannot move it. When set, a pin icon is rendered above the bar on the canvas. The scheduling engine skips pinned bars.
**Values:** `Pinned` (locked) or empty/null (free to schedule)

> **System-Reserved:** The exact string `"Pinned"` is hardcoded for the pin icon check and the scheduling bypass condition.

---

**Field Name**: `tbPredecessor`
**Picklist Name:** None (references another bar's `tbID`)
**Purpose**: Defines a finish-to-start dependency between this bar and its predecessor. Used by the scheduling engine to sequence bars and by the Gantt view to draw dependency arrows.
**Values:** `tbID` string of predecessor bar, or empty

---

### Progress & Completion

---

**Field Name**: `tbPercentComplete`
**Picklist Name:** None (numeric 0–100)
**Purpose**: The primary progress driver for the entire application. Controls bar fill on the canvas, routes bars to Kanban lanes, feeds all actual work/cost calculations, and determines whether a bar is shown in the ghost bar layer. The scheduling engine writes this field; users can also drag bars on the timescale to update it.
**Values:** Integer 0–100

> **System-Reserved:** The value `100` is hardcoded across `tbMainDrawBars.js`, `tbMainModernView.js`, `tbMainDrawBarsFilterManager.js`, and `tbMainDrawbarsGantt.js` to detect completion. Kanban lane thresholds (0, 25, 50, 75, 100) are hardcoded in `tbkanban.js`.

---

### Work & Cost

---

**Field Name**: `tbWork`
**Picklist Name:** None (numeric — hours)
**Purpose**: Planned total work hours for the bar. Baseline for all effort calculations. Displayed in the RDD panel (W field). Used in resource demand calculations and rolled up to parent bars.
**Values:** Non-negative number (use `0` not `null`)

---

**Field Name**: `tbAWork`
**Picklist Name:** None (numeric — hours)
**Purpose**: Actual work hours completed to date. Calculated automatically: `tbAWork = tbWork × tbPercentComplete / 100`. Displayed in the RDD panel.
**Values:** Non-negative number, system-calculated

---

**Field Name**: `tbWorkRemaining`
**Picklist Name:** None (numeric — hours)
**Purpose**: Remaining work hours: `tbWorkRemaining = tbWork − tbAWork`. Displayed in the RDD panel (Rem Work). Used in resource remaining-demand calculations.
**Values:** Non-negative number, system-calculated

---

**Field Name**: `tbCost`
**Picklist Name:** None (numeric — currency)
**Purpose**: Planned total cost for the bar. Rolled up to parent levels. Used in portfolio cost reporting and PPM scoring comparisons.
**Values:** Non-negative number (use `0` not `null`)

---

**Field Name**: `tbACost`
**Picklist Name:** None (numeric — currency)
**Purpose**: Actual cost incurred to date. Calculated: `tbACost = tbCost × tbPercentComplete / 100`. Displayed in cost reporting panels.
**Values:** Non-negative number, system-calculated

---

**Field Name**: `tbCostRemaining`
**Picklist Name:** None (numeric — currency)
**Purpose**: Remaining planned cost: `tbCostRemaining = tbCost − tbACost`. Used in remaining cost reporting.
**Values:** Non-negative number, system-calculated

---

**Field Name**: `tbBudgetCost`
**Picklist Name:** None (numeric — currency)
**Purpose**: A separate budget field from `tbCost`, used for planning and PPM budget variance calculations. Takes priority over `tbMDROMEstimate` in the AE Score budget component.
**Values:** Non-negative number

---

**Field Name**: `tbBudgetHours`
**Picklist Name:** None (numeric — hours)
**Purpose**: A separate hours budget field used in planning and bulk bar creation.
**Values:** Non-negative number

---

**Field Name**: `tbPercentTimeOn`
**Picklist Name:** None (numeric 0–100)
**Purpose**: The percentage of a resource's time allocated to this specific bar (Allocation bars only). Used in resource supply/demand matching to calculate FTE utilisation.
**Values:** Integer 0–100

---

**Field Name**: `tbCalendar`
**Picklist Name:** None (numeric — hours per day)
**Purpose**: Standard working hours per day for this bar/resource. Used to convert between hours and days in resource calculations. Default is 8.
**Values:** Positive number, typically `8`, `6`, or `4`

---

### Resource Fields

---

**Field Name**: `tbResID`
**Picklist Name:** None (foreign key to `tbResources.tbResID`)
**Purpose**: Links an Allocation bar to a specific resource record. Used by the resource grid, cost calculations, and all resource usage reports to match allocations to people.
**Values:** `tbResID` string from the `tbResources` store

---

**Field Name**: `tbOwner`
**Picklist Name:** Resource List
**Purpose**: Display name of the responsible person or resource. Rendered on bar titles, RDD panels, PPM cards, and R&I cards. Also used as the grouping key in resource stacked charts.
**Values:** Free text (drawn from resource list)

---

**Field Name**: `tbResName`
**Picklist Name:** None (on `tbResources` store, not `tbTimebars`)
**Purpose**: Full name of the resource record. Used in resource grids and allocation naming at creation time.
**Values:** Free text

---

**Field Name**: `tbResLabourType`
**Picklist Name:** Labour Type
**Purpose**: Categorises the resource as Human or Generic. Controls which resources appear in human-only vs. generic resource grids and reports. Hardcoded comparisons split resource lists by this field.
**Values:** `Human`, `Generic`

> **System-Reserved:** Both values are hardcoded in `tbResourceGridsMain.js` and `tbresources.js`.

---

**Field Name**: `tbResPrimaryRole`
**Picklist Name:** Primary Role
**Purpose**: The job title or role of the resource. Used as a grouping dimension in resource demand charts and portfolio capacity analysis (`ResChartsByRole`).
**Values:** *(Configurable)*

---

**Field Name**: `tbResPrimarySkill`
**Picklist Name:** Primary Skill
**Purpose**: Core competency of the resource. Used in resource filtering and skill-based demand reports.
**Values:** *(Configurable)*

---

**Field Name**: `tbResDepartment`
**Picklist Name:** Department
**Purpose**: The organisational department of the resource. Used as a rollup and grouping dimension in resource usage reports and PPM portfolio analysis.
**Values:** *(Configurable)*

---

**Field Name**: `tbResLocation`
**Picklist Name:** Location
**Purpose**: Geographic location of the resource. Used as a rollup dimension in resource usage reports.
**Values:** *(Configurable)*

---

**Field Name**: `tbResPercentGeneralAvailability`
**Picklist Name:** None (numeric 0–100)
**Purpose**: The general percentage of this resource's time that is available for allocation (e.g. 80% if 20% is reserved for non-project work). Used in supply vs. demand calculations.
**Values:** Integer 0–100

---

### Hierarchy & Parent–Child Fields

---

**Field Name**: `tbSelfKey2`
**Picklist Name:** None (foreign key to parent `tbID`)
**Purpose**: Links a bar to its direct parent in the hierarchy. Defines the tree structure that drives indentation, rollup calculations, filtering, and hierarchy label building. Projects link to a Portfolio, Tasks to a Sub-Project, Allocations to a Task, etc.
**Values:** `tbID` string of parent bar, empty for top-level items

---

**Field Name**: `tbL1`
**Picklist Name:** None (system-calculated)
**Purpose**: The Portfolio (Level 1) name for this bar, stored directly on the bar record for fast display and filtering without a join. Populated by `clearAndSetHierarchyNames()`.
**Values:** Portfolio name string, system-calculated

---

**Field Name**: `tbL2`
**Picklist Name:** None (system-calculated)
**Purpose**: The Project (Level 2) name for this bar. Used widely as a grouping key in resource charts, PPM pages, and report filters.
**Values:** Project name string, system-calculated

---

**Field Name**: `tbL3`, `tbL4`, `tbL5`
**Picklist Name:** None (system-calculated)
**Purpose**: Sub-Project, Task, and Allocation names for display in hierarchy breadcrumbs on cards and reports. All five levels are populated together by the hierarchy engine.
**Values:** Name strings, system-calculated

---

**Field Name**: `tbHierarchyOrder`
**Picklist Name:** None (numeric)
**Purpose**: The sequential sort order of a bar within its parent level. Controls the vertical stacking order of bars on the canvas. Recalculated every time the hierarchy is rebuilt.
**Values:** Non-negative integer, system-calculated

---

### Canvas Positioning

---

**Field Name**: `tbCoordTop`
**Picklist Name:** None (numeric — pixels)
**Purpose**: The vertical pixel position of the bar row on the canvas. Assigned sequentially by the draw engine based on hierarchy order and row height. Used to position the bar div, RDD panel, and date labels.
**Values:** Non-negative integer, system-calculated

---

**Field Name**: `tbBarColor`
**Picklist Name:** None (HTML colour value)
**Purpose**: Optional custom background colour for the bar strip. Overrides the default type-based colour when set.
**Values:** Hex or RGB colour string, user-defined

---

**Field Name**: `tbTextColor`
**Picklist Name:** None (HTML colour value)
**Purpose**: Optional custom text colour for the bar label. Overrides the default when set.
**Values:** Hex or RGB colour string, user-defined

---

### Kanban Fields

---

**Field Name**: `kbCoordLeft`
**Picklist Name:** None *(system-reserved lane coordinate)*
**Purpose**: Controls which Kanban lane the bar appears in. Written automatically by the Kanban scheduling engine based on `tbPercentComplete`. Never set manually.
**Values:** `1` (Will Do — 0%), `2` (Doing — 1–74%), `2.75` (Finalising — 75–99%), `3` (Done — 100%)

> **System-Reserved:** All four lane values are hardcoded in `tbkanban.js`. The lane thresholds and coordinate values must not be changed.

---

**Field Name**: `kbCoordTop`
**Picklist Name:** None (numeric — pixels)
**Purpose**: Vertical stacking position within a Kanban lane. Incremented automatically for each bar added to a lane.
**Values:** Non-negative integer, system-calculated

---

### Resource Calculation Store Fields (`tbResCalcs`, `tbResCalcs2`)

---

**Field Name**: `tbResCalcName`
**Picklist Name:** None *(system-reserved row type)*
**Purpose**: Identifies the type of row in the resource calculation store. Used to locate specific summary rows when rendering the burndown chart and resource demand grids.
**Values:** `Forecast`, `wkSum`, `CostSummaryRow`, `HoursSummaryRow`

> **System-Reserved:** All four values are hardcoded in `tbkanbanBurndown.js`. Any rename will silently break the burndown chart.

---

### Admin Panel Settings

---

**Field Name**: `apTbProduct`
**Picklist Name:** None *(system-reserved product code)*
**Purpose**: The active product variant. Controls all UI trimming — which menus, reports, views, and features are shown or hidden. Enforced by `productUiTrimCore()`, `productUiTrimAgilebars()`, and `productUiTrimInvestor()` in `loadtimebarapp.js`.
**Values:** `Agilebars`, `Timebars`, `Costbars`

> **System-Reserved:** All three values are hardcoded throughout the UI trimming functions.

---

**Field Name**: `apFilteredFrom`
**Picklist Name:** None *(system-reserved view state)*
**Purpose**: Tracks the currently active view so that when `loadTimebarApp()` is called it restores the correct page. Used as a lightweight navigation state machine.
**Values:** `Canvas`, `Agilebars`, `AbCanvas`, `ViewGantt`, `RisksAndIssuesCard`, `RisksAndIssuesTabular`, `PPMPageTabular`, `PpmPageCardView`, `PPMPageScoreCard`, and others

> **System-Reserved:** All view name strings are hardcoded across the codebase.

---

**Field Name**: `apStatusDate`
**Picklist Name:** None (date)
**Purpose**: The reporting/status date. The central reference point for all scheduling engine calculations — determines which bars are In Progress, complete, or not started. All progress and actual date derivations are relative to this date.
**Values:** Date string, user-set in Admin Panel

---

**Field Name**: `apT10`
**Picklist Name:** None (string flag)
**Purpose**: Controls whether connecting lines between parent and child bars are shown on the canvas.
**Values:** `"Yes"` / `"No"`

---

**Field Name**: `apT11`
**Picklist Name:** None (string flag)
**Purpose**: Switches the Kanban board between bar-style cards and text-list style (used in Agilebars).
**Values:** `"Yes"` / `"No"`

---

**Field Name**: `apT12`
**Picklist Name:** None (string flag)
**Purpose**: Controls the light/dark theme across the application. Switches the canvas background, bar colours, border styles, and text colours.
**Values:** `"Dark"`, `"Light"`

> **System-Reserved:** Both values are hardcoded in `tbmain.js` colour lookups and canvas rendering.

---

**Field Name**: `apT4`
**Picklist Name:** None (numeric)
**Purpose**: License limit for the total number of Timebar rows allowed. Enforced by `tbLicenseTrimming.js` to cap data entry.
**Values:** Positive integer

---

**Field Name**: `apT5`
**Picklist Name:** None (numeric)
**Purpose**: License limit for the total number of Projects allowed. Enforced alongside `apT4` by the license trimming module.
**Values:** Positive integer

---

### Status & Health Colour Lookups (from `tbmain.js`)

These fields are not stored in the database but their picklist values drive the visual colour-coding system used across the canvas, Kanban, PPM cards, and R&I cards:

---

**Field Name**: `tbMDStatus` *(in bar rendering context)*
**Picklist Name:** Timebar Status
**Purpose**: Drives the bar border colour and font weight on the canvas. The rendering engine groups statuses into two families by bar type: `blockHold` family (for Portfolio/Project/Sub-Project/Task) uses `blocked` and `on hold`; `critConcern` family (for Milestone/Allocation) uses `critical` and `concerned`.
**Values** Rejected, In progress, New, Closed, On Hold
Note: blocked has been removed and code has to change??
---

**Field Name**: `tbMDHealth`
**Picklist Name:** Schedule Status
**Purpose**: Drives colour-coded font styling on bar labels and cards across canvas, Kanban, PPM, and R&I views via the `healthFontColors` and `healthColors` lookup objects.
**Values:** `Completed`, `Early`, `On schedule`, `Slipping`, `Late`, `Blocked`

> **System-Reserved:** All five values are hardcoded as keys in `healthFontColors` and `healthColors` in `tbmain.js`.

---

**Field Name**: `tbMDPriority`
**Picklist Name:** Timebar Priority
**Purpose**: Drives left-border colour on R&I and PPM cards, font colour in tabular views, and CSS row-class assignment via `PRIORITY_CLASSES` and `priorityColors` lookup objects.
**Values:** `Immediate`, `High`, `Normal`, `Low`

> **System-Reserved:** All four values are hardcoded keys in `priorityColors`, `priorityFontColors`, and `PRIORITY_CLASSES` in `tbmain.js`.

---

**Field Name**: `tbMDEscalationLevel`
**Picklist Name:** Escalation Level
**Purpose**: Drives font colour on R&I and PPM cards via the `escalationFontColors` lookup.
**Values:** `Project Office`, `Directors`, `Executives`, `Not Assessed`

> **System-Reserved:** All four values are hardcoded keys in `escalationFontColors` in `tbmain.js`.



## 2. Risks, Issues & Change Requests (R&I Module)

---

**Field Name**: `tbSubType`
**Picklist Name:** Item Type
**Purpose**: Identifies the record as a Risk, Issue, or Change Request. Controls which card template is rendered, which edit form is launched, and how the item is filtered and categorised throughout the R&I views.
**Values:** `Risk`, `Issue`, `CR`

---

**Field Name**: `tbMDPriority`
**Picklist Name:** Timebar Priority
**Purpose**: Indicates the urgency or importance of the risk, issue, or CR. Drives the left-border colour on cards and the font colour in the tabular view. Also used to apply CSS row-level styling via `PRIORITY_CLASSES`.
**Values:** `Immediate`, `High`, `Normal`, `Low`

> **System-Reserved:** These exact values are keys in the `priorityColors`, `priorityFontColors`, and `PRIORITY_CLASSES` lookup objects in `tbmain.js`. Renaming any value will silently remove its colour coding.

---

**Field Name**: `tbMDHealth`
**Picklist Name:** Schedule Status
**Purpose**: Reflects the schedule health of the parent item associated with the risk or issue. Rendered with colour-coded font in both card and tabular views.
**Values:** `Completed`, `Early`, `On schedule`, `Slipping`, `Late`

> **System-Reserved:** These exact values are keys in the `healthFontColors` and `healthColors` lookup objects in `tbmain.js`. Renaming will silently remove colour coding.

---

**Field Name**: `tbMDEscalationLevel`
**Picklist Name:** Escalation Level
**Purpose**: Indicates the management level to which the risk or issue has been escalated. Rendered with colour-coded font in both card and tabular views.
**Values:** `Project Office`, `Directors`, `Executives`, `Not Assessed`

> **System-Reserved:** These exact values are keys in the `escalationFontColors` lookup in `tbmain.js`. Renaming will silently remove colour coding.

---

**Field Name**: `tbMDScore`
**Picklist Name:** *(System-calculated — not a picklist)*
**Purpose**: Numeric risk score calculated from Probability × Impact. Displayed with colour-coded font scaling by severity band: 0–24 (low), 25–49 (moderate), 50–74 (high), 75+ (critical). Also used by the PPM scoring engine to rank the top 3 risks per project.
**Values:** Numeric (0–100), system-calculated

---

**Field Name**: `tbMDProbability`
**Picklist Name:** Risk Probability
**Purpose**: Likelihood that a risk will occur. Combined with `tbMDImpact` to calculate the overall risk score via the risk score calculator (`initializeRiskScoreCalculator`). Appears on the Risk card and edit form.
**Values:** *(Configurable — picklist values drive the score calculator; the field is read dynamically)*

---

**Field Name**: `tbMDImpact`
**Picklist Name:** Risk Impact
**Purpose**: The severity of consequence if the risk materialises. Combined with `tbMDProbability` to calculate the risk score. Appears on the Risk card and edit form.
**Values:** *(Configurable — same note as Probability above)*

---

**Field Name**: `tbMDMitigationStatus`
**Picklist Name:** Mitigation Status
**Purpose**: Tracks the current state of the mitigation action for a risk. Display only in the card view — no colour coding or filtering logic tied to specific values.
**Values:** *(Configurable)*

---

**Field Name**: `tbMDRiskCategory`
**Picklist Name:** Risk Category
**Purpose**: Classifies the nature of the risk or issue (e.g. financial, technical, resource). Display only in both card and tabular views — no colour coding or filtering logic tied to specific values.
**Values:** *(Configurable)*

---

**Field Name**: `tbMDStatus`
**Picklist Name:** Timebar Status
**Purpose**: Current lifecycle status of the risk, issue, or CR. Display only in the R&I views — no colour coding applied here, though values are hardcoded elsewhere in the PPM and reports modules.
**Values:** *(Configurable within R&I views, but see System-Reserved note from PPM/reports audit)*

---

**Field Name**: `tbMDState`
**Picklist Name:** WF State
**Purpose**: Workflow approval state of the item. Display only in the R&I card and tabular views — no colour coding or filtering logic tied to specific values in these modules.
**Values:** *(Configurable)*

---

**Field Name**: `tbMDContact`
**Picklist Name:** CR Requestor
**Purpose**: The person who raised the Change Request. Displayed on the CR card only.
**Values:** *(Configurable)*

---

**Field Name**: `tbMDPM`
**Picklist Name:** Project Manager
**Purpose**: The project manager responsible for the CR. Displayed on the CR card only.
**Values:** *(Configurable)*

---

**Field Name**: `tbMDExSponsor`
**Picklist Name:** Executive Sponsor
**Purpose**: The executive sponsor of the Change Request. Displayed on the CR card only.
**Values:** *(Configurable)*

---

**Field Name**: `tbMDDepartment`
**Picklist Name:** Department
**Purpose**: The department that originated the Change Request. Displayed on the CR card only.
**Values:** *(Configurable)*

---

**Rich-Text / Free-Text Fields** (no picklist — Quill editor or plain text):

| Field                        | Label on Card            | Applies To      |
| ---------------------------- | ------------------------ | --------------- |
| `tbMDDescription`            | Description              | Risk, Issue, CR |
| `tbMDExecutiveSummary`       | Executive Summary        | Risk, Issue, CR |
| `tbMDNotes`                  | Notes                    | Risk, Issue, CR |
| `tbMDRiskResponseStrategy`   | Risk Response Strategy   | Risk only       |
| `tbMDMitigationPlan`         | Mitigation Plan          | Risk only       |
| `tbMDContingencyPlan`        | Contingency Plan         | Risk only       |
| `tbMDTriggerEvent`           | Trigger Event            | Risk only       |
| `tbMDEarlyWarningIndicators` | Early Warning Indicators | Risk only       |
| `tbMDExpectedBenefits`       | Expected Benefits        | CR only         |
| `tbMDCostBenefitAnalysis`    | Cost Benefit Analysis    | CR only         |
| `tbMDOptionsAnalysis`        | Options Analysis         | CR only         |
| `tbMDScheduleCommentary`     | Schedule Commentary      | CR only         |
| `tbMDBudgetCommentary`       | Budget Commentary        | CR only         |
| `tbMDScopeCommentary`        | Scope Commentary         | CR only         |
| `tbMDResourceCommentary`     | Resource Commentary      | CR only         |
| `tbMDKeyDependencies`        | Key Dependencies         | CR only         |
| `tbMDImplementationApproach` | Implementation Approach  | CR only         |
| `tbMDNextSteps`              | Next Steps               | CR only         |
| `tbMDProblemOpportunity`     | Problem Opportunity      | CR only         |

---

## 3. Portfolio & Project Management (PPM Module)

---

### Strategic Alignment Inputs (SV Score)

---

**Field Name**: `tbMDInvestmentCategory`
**Picklist Name:** Investment Category
**Purpose**: Classifies the initiative by the type of business investment (e.g. Run, Grow, Transform the Business). Used as one of four equally-weighted strategic alignment dimensions in the Strategic Priority (SV) Score. Also used by the Balanced Scorecard to assess Run/Grow/Transform portfolio balance.
**Values:** *(Configurable — values are scored by their `tbTagSortOrder`; higher sort order = lower strategic score)*

---

**Field Name**: `tbMDInvestmentObjective`
**Picklist Name:** Investment Objective
**Purpose**: Defines the specific business objective the initiative supports. One of four equally-weighted dimensions in the SV Score calculation.
**Values:** *(Configurable — scored by `tbTagSortOrder`)*

---

**Field Name**: `tbMDInvestmentStrategy`
**Picklist Name:** Investment Strategy
**Purpose**: Identifies which organisational strategy the initiative is aligned to. One of four equally-weighted dimensions in the SV Score calculation.
**Values:** *(Configurable — scored by `tbTagSortOrder`)*

---

**Field Name**: `tbMDInvestmentInitiative`
**Picklist Name:** Investment Initiative
**Purpose**: Links the project to a specific strategic initiative or programme. One of four equally-weighted dimensions in the SV Score calculation.
**Values:** *(Configurable — scored by `tbTagSortOrder`)*

---

### Financial Inputs (SV Score — Financial Component)

---

**Field Name**: `tbMDNetPresentValue`
**Picklist Name:** Net Present Value
**Purpose**: The net present value of expected future cash flows. Contributes 40% of the Revenue Score sub-component in the financial portion of the SV Score. Requires at least 4 of 7 financial fields to be populated for the financial component to apply.
**Values:** *(Configurable picklist ranges — scored by range band)*

---

**Field Name**: `tbMDInternalRateOfReturn`
**Picklist Name:** Internal Rate of Return
**Purpose**: The expected return on investment expressed as a percentage. Contributes 35% of the Revenue Score sub-component in the SV Score financial calculation.
**Values:** *(Configurable picklist ranges — scored by range band)*

---

**Field Name**: `tbMDBenefitCostRatio`
**Picklist Name:** Benefit Cost Ratio
**Purpose**: The ratio of total expected benefits to total costs. Contributes 25% of the Revenue Score sub-component in the SV Score financial calculation.
**Values:** *(Configurable picklist ranges — scored by range band)*

---

**Field Name**: `tbMDEconomicValueAdded`
**Picklist Name:** Economic Value Added
**Purpose**: A measure of economic profit generated by the project. Contributes 45% of the Risk-Adjusted Score sub-component in the SV Score financial calculation.
**Values:** *(Configurable picklist ranges — scored by range band)*

---

**Field Name**: `tbMDPaybackPeriod`
**Picklist Name:** Payback Period
**Purpose**: The time expected to recover the cost of the investment. Contributes 30% of the Risk-Adjusted Score sub-component in the SV Score financial calculation.
**Values:** *(Configurable picklist ranges — scored by range band)*

---

**Field Name**: `tbMDOpportunityCost`
**Picklist Name:** Opportunity Cost
**Purpose**: The cost of the next-best alternative foregone. Contributes 25% of the Risk-Adjusted Score sub-component in the SV Score financial calculation (inverse — lower cost = higher score).
**Values:** *(Configurable picklist ranges — scored by range band)*

---

**Field Name**: `tbMDSunkCosts`
**Picklist Name:** Sunk Costs
**Purpose**: Costs already incurred that cannot be recovered. Included as a presence check in determining whether sufficient financial data exists to apply the financial component to the SV Score (minimum 4 of 7 fields required).
**Values:** *(Configurable)*

---

### Ability to Execute (AE Score) Inputs

---

**Field Name**: `tbMDRiskVsSizeAndComplexity`
**Picklist Name:** Risk vs Size and Complexity
**Purpose**: Assesses the project's overall risk level relative to its size and complexity. Contributes 20% of the AE Score for both In-Flight and New/On-Hold projects. Each picklist band maps to a fixed numeric score.
**Values:** `0-10 Very Small and Simple`, `11-20 Small and Straightforward`, `21-30 Medium with Some Complexity`, `31-40 Large with Moderate Complexity`, `41-50 Complex but Manageable`, `51-60 Significant Complexity`, `61-70 Large and Complex`, `71-80 Very Large and Complex`, `81-90 Highly Complex and Risky`, `91-100 Extremely Complex and Risky`, `Not Assessed`

> **System-Reserved:** All band labels are hardcoded in the scoring function. Any rename will silently score that value as 0.

---

**Field Name**: `tbMDSeniorLevelCommitment`
**Picklist Name:** Senior Level Commitment
**Purpose**: Measures the degree of executive buy-in and sponsorship for the project. Contributes 15% (In-Flight) or 20% (New) of the AE Score. Each value maps to a fixed numeric score.
**Values:** `Full`, `Strong`, `Moderate`, `Limited`, `Not Clear`, `Not Assessed`

> **System-Reserved:** All values are hardcoded in the scoring function. Any rename will silently score that value as 0.

---

**Field Name**: `tbMDEstimationClass`
**Picklist Name:** Estimation Class
**Purpose**: Indicates the methodology used to estimate the project's cost and effort. Used in the New/On-Hold AE Score only (10% weight). More rigorous estimation methods score higher.
**Values:** `SWAG`, `Based on History`, `Resource Driven`

> **System-Reserved:** All three values are hardcoded to numeric scores (25, 75, 100). Any rename will silently score as 0.

---

**Field Name**: `tbMDROMEstimate`
**Picklist Name:** ROM Estimate
**Purpose**: Rough Order of Magnitude cost estimate used as a fallback budget value for New/On-Hold projects when `tbBudgetCost` is not set. Feeds the Budget Variance component (15% weight) of the New Project AE Score. The upper bound of the selected band is used as the budget figure.
**Values:** `0 to 100K`, `101K to 300K`, `301K to 1000K`, `1001K to 5000K`, `5000K Plus`

> **System-Reserved:** All band labels are hardcoded in `getBudgetForScoring()`. Any rename will silently return a budget of zero, zeroing out the budget variance score.

---

**Field Name**: `tbMDHealthOverall`
**Picklist Name:** Health — Overall
**Purpose**: Overall project health indicator displayed as a colour-coded dot on PPM cards (green/yellow/red). Display only — not used in AE Score calculation.
**Values:** `Green`, `Yellow`, `Red`

> **System-Reserved:** Values are keys in the `getHealthColor()` colour lookup in `tbmain.js`.

---

**Field Name**: `tbMDHealthScope`
**Picklist Name:** Health — Scope
**Purpose**: Scope health indicator. Used as one of three health indicators (alongside Schedule and Issues) that together contribute 20% of the In-Flight AE Score. Green = 2 pts, Yellow = 1 pt, Red = 0 pts.
**Values:** `Green`, `Yellow`, `Red`

> **System-Reserved:** Values are hardcoded in the health scoring function and in the `getHealthColor()` colour lookup.

---

**Field Name**: `tbMDHealthSchedule`
**Picklist Name:** Health — Schedule
**Purpose**: Schedule health indicator. One of the three health indicators feeding the AE Score health component (20% weight, In-Flight projects).
**Values:** `Green`, `Yellow`, `Red`

> **System-Reserved:** Same as above.

---

**Field Name**: `tbMDHealthIssues`
**Picklist Name:** Health — Issues
**Purpose**: Issues health indicator. One of the three health indicators feeding the AE Score health component (20% weight, In-Flight projects).
**Values:** `Green`, `Yellow`, `Red`

> **System-Reserved:** Same as above.

---

**Field Name**: `tbMDHealthCost`
**Picklist Name:** Health — Cost
**Purpose**: Cost health indicator. Displayed on PPM cards. Not included in the AE Score formula despite being read — display and reporting only.
**Values:** `Green`, `Yellow`, `Red`

> **System-Reserved:** Values are keys in the `getHealthColor()` colour lookup.

---

**Field Name**: `tbMDHealthHours`
**Picklist Name:** Health — Hours
**Purpose**: Hours/effort health indicator. Displayed on PPM cards. Same note as Cost — display and reporting only in PPM.
**Values:** `Green`, `Yellow`, `Red`

> **System-Reserved:** Values are keys in the `getHealthColor()` colour lookup.

---

**Field Name**: `tbMDHealthRisk`
**Picklist Name:** Health — Risk
**Purpose**: Risk health indicator. Displayed on PPM cards. Display and reporting only in PPM.
**Values:** `Green`, `Yellow`, `Red`

> **System-Reserved:** Values are keys in the `getHealthColor()` colour lookup.

---

### Lifecycle & Governance Fields

---

**Field Name**: `tbMDStatus`
**Picklist Name:** Timebar Status
**Purpose**: The current lifecycle status of the project. Used to segment projects into In-Flight (`In Progress`) and New (`New`, `On Hold`) groups for AE Score formula selection. Also drives status colour-coding in the project selection results report.
**Values:** `New`, `In Progress`, `On Hold`, `Closed`, `Rejected`

> **System-Reserved:** `"In Progress"`, `"In progress"`, `"New"`, `"On Hold"` are hardcoded in filtering logic. Note the case inconsistency between `"In Progress"` and `"In progress"` — both are checked but represent a known data quality risk.

---

**Field Name**: `tbMDState`
**Picklist Name:** WF State
**Purpose**: Workflow approval state of the project. Used to separate `Approved` from `Awaiting Approval` projects in the prioritisation summary report, and to flag `Spawned` or `Closed` projects for exclusion from scoring runs.
**Values:** `Approved`, `Awaiting Approval`, `Spawned`

> **System-Reserved:** `"Approved"`, `"Awaiting Approval"`, and `"Spawned"` are hardcoded in filtering and reporting logic.

---

**Field Name**: `tbMDPhase`
**Picklist Name:** PMI Phase
**Purpose**: The current project management phase. Displayed on PPM cards as informational context. Projects in `"Closing"` phase are excluded from all Balanced Scorecard calculations.
**Values:** `Initiating`, `Planning`, `Executing`, `Closing`

> **System-Reserved:** `"Closing"` is hardcoded in scorecard exclusion filters (×7 occurrences in `ppmScoreCard.js`).

---

**Field Name**: `tbMDProjectType`
**Picklist Name:** Type of Initiative
**Purpose**: Describes the nature or type of the initiative (e.g. Infrastructure, Software, Organisational Change). Displayed on PPM cards — no scoring logic tied to specific values.
**Values:** *(Configurable)*

---

**Field Name**: `tbMDStage`
**Picklist Name:** Stage
**Purpose**: Workflow stage of the project within the PPM process. Displayed on PPM cards as informational context only — no filtering or scoring logic tied to specific values in PPM.
**Values:** *(Configurable)*

---

**Field Name**: `tbMDPriority`
**Picklist Name:** Timebar Priority
**Purpose**: Manually assigned priority level for the project. Displayed on PPM cards — informational, not used in any automated PPM scoring formula.
**Values:** `Immediate`, `High`, `Normal`, `Low`

---

**Field Name**: `tbMDYesNoSelector`
**Picklist Name:** YesNo
**Purpose**: The portfolio selection decision for the project — whether it has been selected to proceed. Written automatically by the AE Score process (`Yes`/`No`) and can also be set manually by management. Displayed prominently on PPM cards.
**Values:** `Yes`, `No`

---

### People & Governance Fields

---

**Field Name**: `tbMDExSponsor`
**Picklist Name:** Executive Sponsor
**Purpose**: The executive sponsoring the project. Displayed on PPM cards — no scoring logic.
**Values:** *(Configurable)*

---

**Field Name**: `tbMDPM`
**Picklist Name:** Resource List
**Purpose**: The project manager responsible for delivery. Displayed on PPM cards — no scoring logic.
**Values:** *(Drawn from the Resource List picklist)*

---

**Field Name**: `tbMDBusinessAdvisor`
**Picklist Name:** Business Advisor
**Purpose**: The business-side advisor or liaison for the project. Displayed on PPM cards — no scoring logic.
**Values:** *(Configurable)*

---

### System-Calculated Output Fields

---

**Field Name**: `tbMDPriorityStrategic`
**Picklist Name:** *(System-calculated — not a picklist)*
**Purpose**: The Strategic Priority (SV) Score for the project, calculated by the Prioritisation engine. Ranges 0–100. Weighted 60% in the Final Score. Written to the database by the Prioritise process and displayed in PPM cards and the tabular view.
**Values:** Numeric 0–100, system-calculated

---

**Field Name**: `tbMDCostbarsScore`
**Picklist Name:** *(System-calculated — not a picklist)*
**Purpose**: The Ability to Execute (AE) Score for the project, calculated by the AE Score engine. Ranges 0–100. Weighted 40% in the Final Score. Written to the database and displayed in PPM cards and the tabular view.
**Values:** Numeric 0–100, system-calculated

---

**Field Name**: `tbMDFinancialScore`
**Picklist Name:** *(System-calculated — not a picklist)*
**Purpose**: The financial sub-score used within the SV Score calculation. Written to the database alongside `tbMDPriorityStrategic` for audit and transparency purposes.
**Values:** Numeric 0–100, system-calculated

---

**Field Name**: `tbMDDecisionStrategic`
**Picklist Name:** *(System-generated — not a user picklist)*
**Purpose**: The system recommendation written after each scoring run. For In-Flight projects: `Continue`, `Review`, or `Reject`. For New projects: `PROCEED` or `REJECT`. Displayed on PPM cards as the System Decision.
**Values:** `Continue`, `Review`, `Reject`, `PROCEED`, `REJECT` *(system-written)*

---

**Field Name**: `tbMDDecisionNotes`
**Picklist Name:** *(System-generated — free text)*
**Purpose**: Detailed scoring breakdown appended by the system each time the Prioritise or AE Score process runs. Records the component scores, warnings, and rationale. Displayed on PPM cards under System Decision Notes.
**Values:** Free text, system-appended

---

### Rich-Text / Free-Text Fields

| Field                  | Label in PPM           | Notes                                                                                                    |
| ---------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| `tbMDDescription`      | Initiative Description | Displayed in Decision Review expand section                                                              |
| `tbMDExecutiveSummary` | Executive Summary      | Displayed in Decision Review expand section                                                              |
| `tbMDNotes`            | Management Notes       | Editable by management in PPM card                                                                       |
| `tbMDShowIn`           | Show In                | Controls whether child tasks/risks appear on Business Case (`"Business Case"` value is hardcoded filter) |

31 files — spawning the research agent now.

Here is the full field report for `scripts/reports/`, organised by category:

---

## 4. Reports Module Fields

---

### 1. Risks, Issues & Change Requests Reports Field Usage

---

**Field Name**: `tbSubType`
**Picklist Name:** Item Type
**Purpose**: Classifies each record as a Risk, Issue, or Change Request. Controls which card layout is rendered, which edit form is launched, and how the item is routed throughout the R&I views and reports.
**Values:** `Risk`, `Issue`, `CR`

> **System-Reserved:** All three values are hardcoded in filtering, rendering, and routing logic across `randiCardTabularViews.js`, `randiDynFOCD.js`, and `commonfiltering.js`.

---

**Field Name**: `tbMDProbability`
**Picklist Name:** Risk Probability
**Purpose**: Likelihood of a risk occurring. Combined with `tbMDImpact` to calculate the risk score using the formula: `score = 100 − ((probability × impact − 1) / 24 × 100)`. Higher probability = lower score (inverse scale).
**Values:** `Very Unlikely` (1), `Unlikely` (2), `Likely` (3), `Very Likely` (4), `Certain` (5)

> **System-Reserved:** All five values and their numeric mappings are hardcoded in `reportingFunctions.js`.

---

**Field Name**: `tbMDImpact`
**Picklist Name:** Risk Impact
**Purpose**: Severity of consequence if the risk occurs. Multiplied with `tbMDProbability` to produce the raw risk score on a 1–25 scale, then converted to 0–100 (inverted so high score = low risk).
**Values:** `Very Low` (1), `Low` (2), `Medium` (3), `High` (4), `Very High` (5)

> **System-Reserved:** All five values and their numeric mappings are hardcoded in `reportingFunctions.js`.

---

**Field Name**: `tbMDScore`
**Picklist Name:** *(System-calculated — not a picklist)*
**Purpose**: Calculated risk score (0–100, where higher = lower risk). Displayed with colour-coded font in card and tabular views. Also consumed by the PPM AE Score engine (top 3 risks averaged). Displayed with banded labels:
- 0–25: Low Risk
- 26–50: Medium Risk
- 51–70: Moderately High Risk
- 71–85: High Risk
- 86–100: Critical Risk

**Values:** Numeric 0–100, system-calculated

---

**Field Name**: `tbMDMitigationStatus`
**Picklist Name:** Mitigation Status
**Purpose**: Current state of the mitigation action for a risk. Displayed on R&I cards — no colour coding or scoring logic tied to specific values.
**Values:** *(Configurable)*

---

**Field Name**: `tbMDRiskCategory`
**Picklist Name:** Risk Category
**Purpose**: Classifies the type of risk or issue. Displayed on R&I cards and the core report card — no scoring or filtering logic tied to specific values.
**Values:** *(Configurable)*

---

**Field Name**: `tbMDEscalationLevel`
**Picklist Name:** Escalation Level
**Purpose**: Indicates the management level to which the risk or issue has been escalated. Rendered with colour-coded font via the `escalationFontColors` lookup.
**Values:** `Project Office`, `Directors`, `Executives`, `Not Assessed`

> **System-Reserved:** All four values are hardcoded keys in `escalationFontColors` in `tbmain.js`.

---

**Rich-Text Fields — Risks**

| Field                        | Label                    | Notes                           |
| ---------------------------- | ------------------------ | ------------------------------- |
| `tbMDRiskResponseStrategy`   | Risk Response Strategy   | Quill editor, Risk cards only   |
| `tbMDMitigationPlan`         | Mitigation Plan          | Quill editor, Risk cards only   |
| `tbMDContingencyPlan`        | Contingency Plan         | Quill editor, Risk and CR cards |
| `tbMDTriggerEvent`           | Trigger Event            | Rich text, Risk cards only      |
| `tbMDEarlyWarningIndicators` | Early Warning Indicators | Rich text, Risk cards only      |

---

**Rich-Text & Display Fields — Change Requests**

| Field                        | Label                   | Picklist / Type            |
| ---------------------------- | ----------------------- | -------------------------- |
| `tbMDContact`                | Requestor               | CR Requestor picklist      |
| `tbMDPM`                     | Project Manager         | Resource List picklist     |
| `tbMDExSponsor`              | Executive Sponsor       | Executive Sponsor picklist |
| `tbMDDepartment`             | Department              | Department picklist        |
| `tbMDVersion`                | Version                 | Free text                  |
| `tbMDExpectedBenefits`       | Expected Benefits       | Quill editor               |
| `tbMDCostBenefitAnalysis`    | Cost Benefit Analysis   | Quill editor               |
| `tbMDOptionsAnalysis`        | Options Analysis        | Quill editor               |
| `tbMDScheduleCommentary`     | Schedule Commentary     | Quill editor               |
| `tbMDBudgetCommentary`       | Budget Commentary       | Quill editor               |
| `tbMDScopeCommentary`        | Scope Commentary        | Quill editor               |
| `tbMDResourceCommentary`     | Resource Commentary     | Quill editor               |
| `tbMDKeyDependencies`        | Key Dependencies        | Quill editor               |
| `tbMDImplementationApproach` | Implementation Approach | Quill editor               |
| `tbMDNextSteps`              | Next Steps              | Quill editor               |
| `tbMDProblemOpportunity`     | Problem / Opportunity   | Quill editor               |

---

### 2. Portfolio Reports Field Usage

---

**Field Name**: `tbType`
**Picklist Name:** None *(system-reserved)*
**Purpose**: Hierarchical level of the bar. Controls card layout selection, CSS row-style classes, filtering routes, and whether a row is included in portfolio-level aggregations.
**Values:** `Portfolio`, `Project`, `Sub-Project`, `Task`, `Milestone`, `Allocation`

> **System-Reserved:** Hardcoded across all major report files.

---

**Field Name**: `tbMDStatus`
**Picklist Name:** Timebar Status
**Purpose**: Current lifecycle status. Used to segment projects into In-Flight and New/On-Hold groups for AE scoring, to apply colour-coded status badges in report tables, and to drive the ROM estimate fallback logic.
**Values:** `New`, `In Progress`, `On Hold`, `Closed`, `Rejected`

> **System-Reserved:** `"New"`, `"In Progress"`, `"In progress"`, `"On Hold"`, `"Closed"`, `"Rejected"` are hardcoded across `reportingFunctions.js`, `tbProjecttimeline.js`, `commonfiltering.js`, and `tbComprehensivePortfolioReport.js`. Note: `"In Progress"` and `"In progress"` are both checked — a known case-consistency risk.

---

**Field Name**: `tbMDState`
**Picklist Name:** WF State
**Purpose**: Workflow approval state. Used to separate Approved from non-Approved projects in the prioritisation summary, and to exclude `Spawned` and `Closed` projects from scoring runs.
**Values:** `Approved`, `Awaiting Approval`, `Spawned`

> **System-Reserved:** All three values are hardcoded in filtering logic across multiple files.

---

**Field Name**: `tbMDPhase`
**Picklist Name:** PMI Phase
**Purpose**: Current project management phase. Used to filter and group projects in timeline views, and to exclude `Closing` phase projects from balanced scorecard calculations.
**Values:** `Initiating`, `Planning`, `Executing`, `Closing`

> **System-Reserved:** All four values are hardcoded in `coreBarReport.js`, `tbProjecttimeline.js`, and `tbComprehensivePortfolioReport.js`. `"Closing"` is the exclusion key in scorecard logic.

---

**Field Name**: `tbMDPriority`
**Picklist Name:** Timebar Priority
**Purpose**: Manually assigned priority level. Drives colour-coded font and row CSS classes in tabular and card reports via `priorityFontColors` and `PRIORITY_CLASSES` lookups.
**Values:** `Immediate`, `High`, `Normal`, `Low`

> **System-Reserved:** All four values are hardcoded keys in colour lookup objects in `tbmain.js`.

---

**Field Name**: `tbMDHealth`
**Picklist Name:** Schedule Status
**Purpose**: Overall schedule health indicator. Drives colour-coded font in report cards and tabular views via the `healthFontColors` lookup.
**Values:** `Completed`, `Early`, `On schedule`, `Slipping`, `Late`

> **System-Reserved:** All five values are hardcoded keys in `healthFontColors` in `tbmain.js`.

---

**Field Name**: `tbMDHealthOverall`, `tbMDHealthScope`, `tbMDHealthSchedule`, `tbMDHealthCost`, `tbMDHealthHours`, `tbMDHealthRisk`, `tbMDHealthIssues`
**Picklist Name:** Health — (dimension)
**Purpose**: Individual project health indicators rendered as colour-coded dots in the health indicator grid on PPM and project status cards. `Scope`, `Schedule`, and `Issues` additionally feed the In-Flight AE Score health component (Green = 2 pts, Yellow = 1 pt, Red = 0 pts, converted to 0–100 over max 6 points).
**Values:** `Green`, `Yellow`, `Red`

> **System-Reserved:** Values are hardcoded in the health scoring function and in the `getHealthColor()` colour lookup.

---

**Field Name**: `tbMDRiskVsSizeAndComplexity`
**Picklist Name:** Risk vs Size and Complexity
**Purpose**: Risk-adjusted size and complexity assessment. Contributes 20% of the AE Score for both In-Flight and New/On-Hold projects. Each picklist band maps directly to a numeric score.
**Values:** `Not Assessed` (0), `0-10 Very Small and Simple` (95), `11-20 Small and Straightforward` (85), `21-30 Medium with Some Complexity` (75), `31-40 Large with Moderate Complexity` (65), `41-50 Complex but Manageable` (55), `51-60 Significant Complexity` (45), `61-70 Large and Complex` (35), `71-80 Very Large and Complex` (25), `81-90 Highly Complex and Risky` (15), `91-100 Extremely Complex and Risky` (5)

> **System-Reserved:** All band labels and score mappings are hardcoded in `reportingFunctions.js`.

---

**Field Name**: `tbMDSeniorLevelCommitment`
**Picklist Name:** Senior Level Commitment
**Purpose**: Level of executive buy-in. Contributes 15% (In-Flight) or 20% (New/On-Hold) of the AE Score. Each value maps to a fixed numeric score.
**Values:** `Full` (100), `Strong` (80), `Moderate` (60), `Limited` (40), `Not Clear` (20), `Not Assessed` (0)

> **System-Reserved:** All values and score mappings are hardcoded in `reportingFunctions.js`.

---

**Field Name**: `tbMDROMEstimate`
**Picklist Name:** ROM Estimate
**Purpose**: Rough Order of Magnitude cost band used as a fallback budget value for New/On-Hold projects when `tbBudgetCost` is not set. The upper bound of the selected band is used in the Budget Variance component (15% weight) of the New Project AE Score.
**Values:** `0 to 100K` → $100,000 · `101K to 300K` → $300,000 · `301K to 1000K` → $1,000,000 · `1001K to 5000K` → $5,000,000 · `5000K Plus` → $5,000,000

> **System-Reserved:** All band labels and their numeric upper bounds are hardcoded in `reportingFunctions.js` (`getBudgetForScoring()`).

---

**Field Name**: `tbMDEstimationClass`
**Picklist Name:** Estimation Class
**Purpose**: Methodology used to estimate cost and effort for New/On-Hold projects. Contributes 10% of the New Project AE Score. More rigorous methods score higher.
**Values:** `SWAG` (25), `Based on History` (75), `Resource Driven` (100)

> **System-Reserved:** All three values and their score mappings are hardcoded in `reportingFunctions.js`.

---

**Field Name**: `tbMDPriorityStrategic`
**Picklist Name:** *(System-calculated)*
**Purpose**: The Strategic Priority (SV) Score (0–100). Weighted 60% in the Final Score used for portfolio selection. Written by the Prioritise engine, displayed in report cards and tabular views.
**Values:** Numeric 0–100, system-calculated

---

**Field Name**: `tbMDCostbarsScore`
**Picklist Name:** *(System-calculated)*
**Purpose**: The Ability to Execute (AE) Score (0–100). Weighted 40% in the Final Score. Written by the AE Score engine, displayed across PPM reports.
**Values:** Numeric 0–100, system-calculated

---

**Field Name**: `tbMDDecisionStrategic`
**Picklist Name:** *(System-generated)*
**Purpose**: System recommendation written after each scoring run. Displayed as the System Decision on PPM cards and the comprehensive portfolio report.
**Values:** `Continue`, `Review`, `Reject` (In-Flight) · `PROCEED`, `REJECT` (New)

---

**Field Name**: `tbMDDecisionNotes`
**Picklist Name:** *(System-generated — free text)*
**Purpose**: Detailed scoring breakdown appended by the system each time the Prioritise or AE Score process runs. Displayed in the portfolio report and PPM cards.
**Values:** Free text, system-appended

---

**Field Name**: `tbMDYesNoSelector`
**Picklist Name:** YesNo
**Purpose**: Portfolio selection decision — whether the project has been selected to proceed. Set automatically by the selection engine or manually by management. Used as a filter in portfolio reports.
**Values:** `Yes`, `No`

---

**Field Name**: `tbMDInvestmentCategory`, `tbMDInvestmentObjective`, `tbMDInvestmentStrategy`, `tbMDInvestmentInitiative`
**Picklist Name:** Investment Category / Objective / Strategy / Initiative
**Purpose**: Four strategic alignment dimensions. Each feeds one of the four equally-weighted components of the Strategic Priority (SV) Score, scored by `tbTagSortOrder`. Also used as filter dropdowns in the PPM filter manager.
**Values:** *(Configurable — scored by tag sort order)*

---

**Field Name**: `tbMDProjectType`
**Picklist Name:** Type of Initiative
**Purpose**: Nature or type of the project initiative. Displayed on project timeline and PPM cards — no scoring logic.
**Values:** *(Configurable)*

---

**Field Name**: `tbMDExSponsor`
**Picklist Name:** Executive Sponsor
**Purpose**: Executive sponsoring the project. Displayed and used as a filter grouping dimension in the project timeline report.
**Values:** *(Configurable)*

---

**Financial Metric Fields** — all feed the Financial Component of the SV Score when ≥ 4 of 7 are populated:

| Field                      | Picklist Name           | Weight in Formula                    |
| -------------------------- | ----------------------- | ------------------------------------ |
| `tbMDNetPresentValue`      | Net Present Value       | 40% of Revenue Score                 |
| `tbMDInternalRateOfReturn` | Internal Rate of Return | 35% of Revenue Score                 |
| `tbMDBenefitCostRatio`     | Benefit Cost Ratio      | 25% of Revenue Score                 |
| `tbMDEconomicValueAdded`   | Economic Value Added    | 45% of Risk-Adjusted Score           |
| `tbMDPaybackPeriod`        | Payback Period          | 30% of Risk-Adjusted Score           |
| `tbMDOpportunityCost`      | Opportunity Cost        | 25% of Risk-Adjusted Score (inverse) |
| `tbMDSunkCosts`            | Sunk Costs              | Presence check only                  |

---

**Portfolio Rich-Text Fields** (displayed in `tbComprehensivePortfolioReport.js`):

| Field                        | Label                       |
| ---------------------------- | --------------------------- |
| `tbMDDescription`            | Project Description         |
| `tbMDExecutiveSummary`       | Executive Summary           |
| `tbMDNotes`                  | Management Notes            |
| `tbMDBackgroundInfo`         | Background Information      |
| `tbMDObjectivesAndScope`     | Objectives and Scope        |
| `tbMDSuccessCriteria`        | Success Criteria            |
| `tbMDConstraintsAssumptions` | Constraints and Assumptions |
| `tbMDKeyRecommendations`     | Key Recommendations         |
| `tbMDHealthCommentary`       | Health Commentary           |
| `tbMDFinancialCommentary`    | Financial Commentary        |
| `tbMDScheduleCommentary`     | Schedule Commentary         |
| `tbMDScopeCommentary`        | Scope Commentary            |
| `tbMDContingency`            | Contingency Budget Reserve  |
| `tbMDGate`                   | Approval Gate               |

---

### 3. Scheduling Reports Field Usage

---

**Field Name**: `tbStart` / `tbFinish`
**Picklist Name:** None (date — `DD-MMM-YYYY`)
**Purpose**: Planned start and finish dates. Primary sort keys for timeline reports. Drive bar positioning and duration calculation in Gantt and horizontal/vertical timeline views.
**Values:** Date string

---

**Field Name**: `tbAStart` / `tbAFinish`
**Picklist Name:** None (date)
**Purpose**: Actual start and finish dates. Rendered with an indicator flag alongside planned dates in cards and tables via `formatDateWithActualIndicator()`. Used in baseline variance comparisons.
**Values:** Date string or empty `""`

---

**Field Name**: `blStart` / `blFinish`
**Picklist Name:** None (date — from `tbBaseline` store)
**Purpose**: Original baseline start and finish dates. Compared against current scheduled dates to produce variance fields used in `baselinereport.js`.
**Values:** Date string

---

**Field Name**: `blStartVariance` / `blFinishVariance` / `blDurationVariance`
**Picklist Name:** None (numeric — days, system-calculated)
**Purpose**: Variance between current scheduled dates/duration and their baseline equivalents. Used as numeric filter criteria (greater than / less than / equals) in the baseline report filter manager.
**Values:** Integer (positive = behind schedule, negative = ahead), system-calculated

---

**Field Name**: `tbDuration` / `tbRemainingDuration`
**Picklist Name:** None (numeric — working days)
**Purpose**: Planned duration and days remaining. Used in timeline bar sizing, progress calculation, and Gantt rendering. Displayed in the RDD panel.
**Values:** Non-negative integer

---

**Field Name**: `tbPercentComplete`
**Picklist Name:** None (numeric 0–100)
**Purpose**: Percentage of work complete. Drives progress bar rendering in Gantt and timeline reports. Used in DataTable report columns.
**Values:** Integer 0–100

---

**Field Name**: `tbPredecessor`
**Picklist Name:** None (references another bar's `tbID`)
**Purpose**: Defines a finish-to-start dependency. Used in the project timeline report and Gantt view to draw dependency arrows and sequence task rendering.
**Values:** `tbID` string of predecessor, or empty

---

**Field Name**: `tbWork` / `blWork`
**Picklist Name:** None (numeric — hours)
**Purpose**: Planned work hours (`tbWork`) and baseline hours (`blWork`). `blWork` is compared against `tbWork` to calculate the Hours Variance Score (15% weight in In-Flight AE Score). If `blWork` is zero, the score defaults to 50 (mid-range).
**Values:** Non-negative number

---

**Field Name**: `blWorkVariance`
**Picklist Name:** None (numeric — hours, system-calculated)
**Purpose**: Difference between actual and baseline hours. Used as a numeric filter criterion in the baseline report.
**Values:** Numeric, system-calculated

---

**Field Name**: `tbWorkRemaining` / `tbCostRemaining`
**Picklist Name:** None (numeric)
**Purpose**: Remaining work hours and cost. Displayed in DataTable report columns and the RDD panel.
**Values:** Non-negative number, system-calculated

---

**Field Name**: `tbCost` / `tbBudgetCost`
**Picklist Name:** None (numeric — currency)
**Purpose**: Actual cost (`tbCost`) and approved budget (`tbBudgetCost`). Used in budget variance scoring (15% of AE Score). `tbBudgetCost` takes priority; `tbMDROMEstimate` is the fallback for New/On-Hold projects.
**Values:** Non-negative number

---

**Field Name**: `blCostVariance`
**Picklist Name:** None (numeric — currency, system-calculated)
**Purpose**: Cost variance from baseline. Used as a numeric filter criterion in the baseline report.
**Values:** Numeric, system-calculated

---

**Field Name**: `tbConstraintType`
**Picklist Name:** None *(system-reserved)*
**Purpose**: Scheduling lock. When set to `"Pinned"` the scheduling engine skips the bar and a pin icon is displayed on the canvas.
**Values:** `Pinned` or empty

> **System-Reserved:** The exact string `"Pinned"` is hardcoded in scheduling and rendering logic.

---

**Hierarchy Fields** — used for filtering, cascading dropdowns, and breadcrumb display across all scheduling reports:

| Field              | Level       | Purpose                                             |
| ------------------ | ----------- | --------------------------------------------------- |
| `tbL1`             | Portfolio   | Top-level grouping, primary cascade filter          |
| `tbL2`             | Project     | Second-level grouping, resource chart key           |
| `tbL3`             | Sub-Project | Third-level grouping                                |
| `tbL4`             | Task        | Fourth-level                                        |
| `tbL5`             | Allocation  | Fifth-level                                         |
| `tbSelfKey2`       | Parent ID   | Links bar to direct parent for hierarchy navigation |
| `tbHierarchyOrder` | Sort order  | Default sort in tabular reports                     |

---

### 4. Other Reports Field Usage

---

**Field Name**: `tbResID`
**Picklist Name:** None (foreign key to `tbResources`)
**Purpose**: Links a row to a specific resource record. Used in the resource usage DataTable and resource list report to join allocation data to resource attributes.
**Values:** `tbResID` string

---

**Field Name**: `tbOwner`
**Picklist Name:** Resource List
**Purpose**: Display name of the responsible person. Used as a filter and grouping key across all report types. Primary label in the resource stacked chart grouping.
**Values:** Free text (drawn from resource list)

---

**Field Name**: `tbResLabourType`
**Picklist Name:** Labour Type
**Purpose**: Categorises each resource as Human or Generic. Controls which resources appear in separate resource grids and whether they are included in human-only capacity reports.
**Values:** `Human`, `Generic`

> **System-Reserved:** Both values are hardcoded in `tbreportsembeddedgraphs.js` and `tbComprehensivePortfolioReport.js`.

---

**Field Name**: `tbResPrimaryRole`
**Picklist Name:** Primary Role
**Purpose**: Job title or role of the resource. Used as the primary grouping dimension in resource demand stacked bar charts (`ResChartsByRole`).
**Values:** *(Configurable)*

---

**Field Name**: `tbResDepartment` / `tbResLocation`
**Picklist Name:** Department / Location
**Purpose**: Organisational department and geographic location of the resource. Used as secondary grouping and filter dimensions in resource usage reports and the DataTable.
**Values:** *(Configurable)*

---

**Field Name**: `tbResPartTimeFullTime`
**Picklist Name:** Part Time / Full Time
**Purpose**: Employment classification of the resource. Used in the resource usage DataTable to separate full-time from part-time capacity.
**Values:** `Full Time`, `Part Time`

> **System-Reserved:** Both values are hardcoded in `tbResourceUsageDataTable.js`.

---

**Field Name**: `tbResQuantity`
**Picklist Name:** None (numeric — FTE or headcount)
**Purpose**: Quantity of this resource available. Used in supply/demand aggregation in resource capacity reports.
**Values:** Non-negative number

---

**Field Name**: `tbResCalcMonth1` … `tbResCalcMonth32`
**Picklist Name:** None (numeric — hours, system-calculated)
**Purpose**: Monthly resource demand columns in the `tbResCalcs2` store. Each field holds the calculated hours or FTE for that calendar month. Rendered as columns in the resource usage DataTable.
**Values:** Non-negative number per month, system-calculated

---

**Field Name**: `tbResCalcWeek` / `tbResCalcHours` / `tbResCalcMonday`
**Picklist Name:** None (system-calculated)
**Purpose**: Weekly resource calculation fields. `tbResCalcWeek` is the ISO week number, `tbResCalcMonday` anchors the week to a date, and `tbResCalcHours` holds the calculated demand for that week. Used in the burndown chart and weekly resource grids.
**Values:** Numeric / date, system-calculated

---

**Field Name**: `tbTagName` / `tbTagID` / `tbTagSortOrder`
**Picklist Name:** *(Tag store fields)*
**Purpose**: Tag store fields used in strategic priority scoring. `tbTagSortOrder` is the key value — it is converted to a numeric score via the normalise function to produce dimension scores for the SV Score calculation. `tbTagName` is matched against investment category/objective/strategy/initiative field values.
**Values:** `tbTagName` — free text · `tbTagSortOrder` — positive integer

---

**Field Name**: `tbMDShowIn`
**Picklist Name:** Show In
**Purpose**: Controls whether a child task, risk, or resource row is included in the Business Case document view. The value `"Business Case"` is checked as an inclusion filter in `ppmPage.js`. Other reports are listed as values below.
**Values:** Business Case, Investment Plan, Milestone Horizon, Facility Schedule

> **System-Reserved:** The values are hardcoded as the inclusion filter value for respective reports. "Investment Plan" is checked in businessCase.js to include rows in the Investment Plan section

---

**Field Name**: `tbMDSortOrder`
**Picklist Name:** None (numeric)
**Purpose**: Display ordering field used in tag-based priority normalisation. Converted to a numeric value and used in the `normalizePrioritizeScore()` function to rank strategic alignment values.
**Values:** Positive integer

---

**Free-Text / General Fields** (shared across multiple report types):

| Field                  | Label             | Notes                                                    |
| ---------------------- | ----------------- | -------------------------------------------------------- |
| `tbID`                 | Record ID         | Primary key, used in all data attributes and lookups     |
| `tbName`               | Name / Title      | Rendered in all report views; editable in cards          |
| `tbMDDescription`      | Description       | Quill rich text, rendered in cards and portfolio reports |
| `tbMDExecutiveSummary` | Executive Summary | Quill rich text                                          |
| `tbMDNotes`            | Notes             | Quill rich text                                          |
| `tbMDWBS`              | WBS Code          | Work Breakdown Structure identifier                      |
| `tbMDStage`            | Stage             | Workflow stage, display only in reports                  |
| `tbStatus`             | Status            | General status field, used in core bar report            |

