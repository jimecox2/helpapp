# Enterprise Dashboard Guide - Common Across Products
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

The Timebars Enterprise Dashboard provides a consolidated, organisation-wide view of your project portfolio. It draws data from one or more published datasets (pubsets) — from Agilebars, Timebars, or Costbars — that are combined into a **Dashboard Source**: a single, unified snapshot that powers all reports, charts, and visualizations in the enterprise view.

> **Enterprise Dashboard vs. Personal Dashboard**
> The Enterprise Dashboard (`/dashboard`) is designed for teams and organisations that need to combine data across multiple pubsets — for example, rolling up projects from different teams, products, or time periods into one portfolio view. Role-based access control (RBAC) governs who can see which pubsets and sources.
>
> If you work with a single active pubset and want an instant, zero-configuration view of your own data, see the [Personal Dashboard Guide](Common_08_Cloud_Reports_And_Dashboard_Guide.md) (`/personaldashboard`).

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Understanding Dashboard Sources](#understanding-dashboard-sources)
3. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
4. [Creating and Managing Dashboard Sources](#creating-and-managing-dashboard-sources)
5. [Managing Pubsets](#managing-pubsets)
6. [The Executive Dashboard Home](#the-executive-dashboard-home)
7. [Reports](#reports)
8. [Visualizations](#visualizations)
9. [Drilldown](#drilldown)
10. [Analytics](#analytics)
11. [Shop Schedule (Gantt)](#shop-schedule-gantt)
12. [Preprocessing Resource Data](#preprocessing-resource-data)
13. [Quick Reference](#quick-reference)

---

## Getting Started

To access the Enterprise Dashboard, sign in and navigate to **Dashboard** in the main navigation menu. You will land on the Executive Dashboard home page at `/dashboard`.

If you see a message saying you have no access, contact your **Administrator** to have your role assigned or a pubset shared with you (see [RBAC](#role-based-access-control-rbac) below).

### What you need before using the Enterprise Dashboard

1. A user account with a role of **Administrator**, **Project Manager**, or **Team Member**
2. At least one **pubset** published from Timebars, Agilebars, or Costbars (see the [Cloud Publishing Guide](Common_07_Cloud_Publishing_Guide.md))
3. At least one **Dashboard Source** created from your pubsets (see [Creating and Managing Dashboard Sources](#creating-and-managing-dashboard-sources))

> **Coming from the Personal Dashboard?** The Enterprise Dashboard requires an extra step — you must create a Dashboard Source before reports will display data. This is because the Enterprise Dashboard lets you combine multiple pubsets, and you choose which combination to activate. The [Personal Dashboard](Common_08_Cloud_Reports_And_Dashboard_Guide.md) skips this step by automatically connecting to your single active pubset.

---

## Understanding Dashboard Sources

A **Dashboard Source** is the data backbone of the Enterprise Dashboard. It is a consolidated snapshot built from one or more pubsets and stored in the system. All reports, charts, and visualizations draw from the currently active source.

### Key facts

- Each source has a **name**, creation date, and an `isActive` flag
- Only **one source can be active at a time** for your organisation
- Sources are created by selecting pubsets at `/dashboard/pubsets`
- You can switch the active source at `/dashboard/sources`
- Sources are **snapshots** — they do not update automatically; create a new source each time your data changes

### How this differs from the Personal Dashboard

| | Personal Dashboard | Enterprise Dashboard |
|---|---|---|
| **Data source** | Your single Active pubset (auto-connected) | One or more pubsets combined into a Dashboard Source |
| **Source creation** | None required | Must create a Dashboard Source |
| **Pubset selection** | Automatic (flagged as Active in client) | Manual — choose which pubsets to combine |
| **Multi-pubset support** | No | Yes |
| **Access control** | Per-user | RBAC (Admin, PM, Team Member) |

### Source naming convention

When a source is generated, the system proposes a name in this format:

```
{Product} — {PubsetNames} [{IDs}] — MMM DD, YYYY HH:MM
```

Example:
```
Timebars — Q1 Portfolio, Infrastructure Refresh [12-14] — Apr 06, 2026 09:30
```

Edit this name before saving to choose something meaningful that lets you identify snapshots later.

---

## Role-Based Access Control (RBAC)

The Enterprise Dashboard uses RBAC to control which pubsets and dashboard sources each user can see.

### Roles

| Role | What they can see |
|------|-------------------|
| **Administrator** | All pubsets and sources in the organisation |
| **Project Manager** | Their own pubsets + any pubsets where they have been granted PM access |
| **Team Member** | Their own pubsets + any pubsets where they have been granted TM access |
| *(No role)* | No access to the Enterprise Dashboard |

### How access is granted

- **Ownership**: If you created (own) a pubset, you always have access to it
- **Admin grant**: An Administrator can see all org pubsets by default
- **Explicit grant**: In Timebars/Agilebars/Costbars, the pubset owner can add a user's email to the `grant_pm_access_to` or `grant_tm_access_to` fields when publishing

### Changing a user's role

Roles are managed in **Strapi** (the backend CMS) by an Administrator:

1. Log in to the Strapi admin panel
2. Navigate to **Content Manager → Users**
3. Find the user and edit their `primary_role` field
4. Set to `Administrator`, `Project Manager`, or `Team Member`
5. Save — the change takes effect on the user's next page load

---

## Creating and Managing Dashboard Sources

### Step 1 — Publish your data

Before creating a dashboard source, project data must be **published as a pubset** from within Timebars, Agilebars, or Costbars. See the [Cloud Publishing Guide](Common_07_Cloud_Publishing_Guide.md) for full publishing instructions. Each publish creates a new pubset record.

### Step 2 — Browse and select pubsets

Navigate to **Dashboard → Manage Pubsets** (`/dashboard/pubsets`). You will see all pubsets your RBAC role grants you access to. Use the checkboxes to select one or more pubsets to consolidate.

### Step 3 — Generate a dashboard source

With pubsets selected, click **Generate Dashboard Source**. You will be taken to the consolidation page (`/dashboard/pubsets/consolidated`) where you can:

- Review which pubsets are included
- Edit the auto-generated source name
- Click **Save Dashboard Source** to create the source

### Step 4 — Set the active source

Navigate to **Dashboard → Manage Sources** (`/dashboard/sources`). You will see a list of all sources accessible to you. Click **Set Active** on the source you want to use. All reports will now draw from this source.

### Managing existing sources

From the Sources page you can:

- **View** source details (which pubsets are included, creation date)
- **Set active** to switch which source powers the dashboard
- **Delete** sources you no longer need

---

## Managing Pubsets

Navigate to **Dashboard → Manage Pubsets** (`/dashboard/pubsets`) to manage your enterprise pubsets.

### What you can do here

- Browse all pubsets you have access to (RBAC-filtered)
- See pubset status, product, owner, and creation date
- Select multiple pubsets and generate a consolidated dashboard source
- View an individual pubset report

### Pubset report

Click **View Report** on any pubset to open a read-only report for that single dataset at `/dashboard/pubsets/report/{id}`.

---

## The Executive Dashboard Home

**Route:** `/dashboard`

The home page provides an executive-level summary of your active dashboard source. It shows:

- Key portfolio metrics and health indicators
- Summary cards with quick-access links to reports
- Status of the currently active dashboard source

If no source is active, you will be guided to create one via the Manage Pubsets page.

---

## Reports

Navigate to **Dashboard → Reports** (`/dashboard/reports`) to access the full report catalogue.

### Project Status Report
**Route:** `/dashboard/reports/projects`

Detailed project and portfolio status drawn from the active dashboard source. Shows timelines, budgets, and health indicators for every project in the portfolio — spanning all pubsets included in the active source. Use this report for regular project review meetings.

---

### Portfolio Status Report
**Route:** `/dashboard/reports/portfolio`

Portfolio-level insights and strategic analysis across all projects in the active source. Provides cross-project comparisons and helps identify which projects are on track, at risk, or in trouble. Ideal for portfolio review sessions.

---

### Variance Report
**Route:** `/dashboard/reports/variance`

Compares current project data against baseline plans to identify schedule and cost deviations across all pubsets in the active source. Quickly highlights where projects are running ahead or behind plan, and by how much.

> This report is unique to the Enterprise Dashboard in that it covers all pubsets in your Dashboard Source.

---

### Risk Register
**Route:** `/dashboard/reports/risks`

A consolidated view of all identified risks across the entire portfolio (all pubsets in the active source). Each risk is scored for probability and impact. Includes mitigation plans and escalation tracking so risk owners can take action before issues materialise.

---

### Issues Log
**Route:** `/dashboard/reports/issues`

Tracked issues across the entire portfolio, including impact assessment, mitigation status, and escalation levels. Use this log to ensure open issues are being actively managed and resolved.

---

### Change Requests
**Route:** `/dashboard/reports/change-requests`

Formal change requests affecting project scope, schedule, or budget. Tracks approval status and the financial or schedule impact of each change. Useful for governance and audit purposes.

---

### Resource Pool Report
**Route:** `/dashboard/reports/resources`

Comprehensive resource capacity and allocation data drawn from all pubsets in the active source. Shows availability by role, location, and department alongside current assignments. Use this report to understand where your resource capacity sits across the organisation.

---

### Capacity vs Demand
**Route:** `/dashboard/reports/capacity-demand`

Side-by-side view of resource supply and demand by week and role, consolidated across all included pubsets. Highlights overloaded or underutilised resource pools so you can rebalance allocations or plan hiring decisions proactively.

---

### Executive Portfolio Summary
**Route:** `/dashboard/reports/executive-summary`

An at-a-glance summary built for executive audiences. Presents portfolio health across seven key dimensions and includes a financial summary. Designed to be shared in board-level or steering committee meetings with minimal preparation.

---

### Project Prioritization Matrix
**Route:** `/dashboard/reports/prioritization`

Composite scoring of every project based on health, cost performance, schedule performance, and risk level. Helps leadership decide which projects to continue as-is, restructure, or terminate. Output is a ranked list with a recommended action for each project.

---

### Project Selection Bubble Chart
**Route:** `/dashboard/reports/bubble-chart`

A strategic scatter plot of **Strategic Value** vs **Ability to Execute** with bubble size representing project cost. Includes a selection algorithm and quadrant analysis to guide portfolio optimisation decisions. Adjust weights and thresholds interactively to simulate different selection scenarios.

---

### Balanced Scorecard
**Route:** `/dashboard/reports/balanced-scorecard`

Assesses portfolio balance across eight KPI dimensions including investment strategy alignment, objectives coverage, risk distribution, resource mix, and project duration spread. Surfaces imbalances that may not be visible from individual project views.

---

### Portfolio Financial Summary
**Route:** `/dashboard/reports/financial-summary`

Aggregates financial data across the entire portfolio including NPV, IRR, Payback Period, and ROM Estimates. Provides a single source of truth for portfolio cost analysis and investment return tracking across all included pubsets.

---

### Strategic Alignment Heatmap
**Route:** `/dashboard/reports/strategic-alignment`

A heatmap of **Investment Objective vs Category** showing where portfolio spend is concentrated. Quickly reveals whether the portfolio is aligned to your organisation's strategic priorities or skewed towards certain objectives.

---

### What-If Scenario Dashboard
**Route:** `/dashboard/reports/what-if`

An interactive simulation tool. Adjust Strategic Value and Ability to Execute weights and scoring thresholds to model different portfolio decisions and see the financial and health impact of each scenario. Useful for pre-planning workshops and scenario analysis.

---

## Visualizations

Navigate to **Dashboard → Visualizations** (`/dashboard/visualizations`) to access interactive chart views. All visualization data is drawn from the active Dashboard Source.

### Resource Cost Charts
**Route:** `/dashboard/visualizations/cost-charts`

Interactive pie charts showing resource cost distribution across four dimensions: by project, by role, by location, and by department. Drill into any segment to see the contributing detail. Covers all pubsets in the active source.

> **Prerequisite:** Resource data must be preprocessed before these charts will display. See [Preprocessing Resource Data](#preprocessing-resource-data).

---

### Resource Usage Charts
**Route:** `/dashboard/visualizations/usage-charts`

Bar charts showing resource utilization across six dimensions with weekly breakdowns. Use these alongside the Resource Pool Report and Capacity vs Demand report to understand allocation patterns across the organisation.

> **Prerequisite:** Resource data must be preprocessed. See [Preprocessing Resource Data](#preprocessing-resource-data).

---

### Burndown Charts
**Route:** `/dashboard/visualizations/burndown`

Sprint burndown charts comparing planned vs forecast progress over time. Includes both computed project burndown from Timebars data and sprint-level charts from Agilebars. Covers all included pubsets in the active source.

---

## Drilldown

Navigate to **Dashboard → Drilldown** (`/dashboard/drilldown`) to explore the portfolio hierarchy interactively.

### Project Cards Drilldown
**Route:** `/dashboard/drilldown/cards`

Navigate through your combined portfolio in four levels: **Portfolio → Project → Work Package → Task**. Each card displays health indicators, status, and key metrics. At the task level, tabbed sections show related risks and issues. This view covers all pubsets consolidated in the active Dashboard Source.

> The [Personal Dashboard](Common_08_Cloud_Reports_And_Dashboard_Guide.md#interactive-card-based-drilldown) offers an equivalent drilldown scoped to your single active pubset.

---

## Analytics

**Route:** `/dashboard/analytics`

The Analytics section is planned for a future phase. It will provide performance and cost analytics for data-driven project decisions. Check this section for updates as new capabilities are released.

---

## Shop Schedule (Gantt)

**Route:** `/dashboard/facilities`

The Shop Schedule presents facility and shop tasks as a Gantt chart. Filter by schedule type and task status to focus on specific workstreams. Use this view for operational planning when projects involve physical facilities, workshops, or lab schedules.

---

## Preprocessing Resource Data

**Route:** `/dashboard/settings/preprocess`

Before the Resource Cost Charts and Resource Usage Charts can display data, the allocation rows in your active dashboard source must be extracted and reshaped into the resource calculations format (`tbrescalcs2`).

### When to preprocess

- After setting a new active dashboard source
- If resource charts show no data or stale data

### How to preprocess

1. Navigate to **Dashboard → Settings → Preprocess Resource Data**
2. Confirm the active dashboard source shown is the correct one
3. Click **Run Preprocess**
4. Wait for the operation to complete (a confirmation message will appear)
5. Return to the visualization pages — charts should now display updated data

> **Note:** Preprocessing overwrites the previous resource calculations data for your organisation. If you switch the active source, run preprocess again before viewing resource charts.

---

## Quick Reference

| Task | Where to go |
|------|-------------|
| View executive summary | `/dashboard` |
| Browse all reports | `/dashboard/reports` |
| Create a dashboard source | `/dashboard/pubsets` |
| Switch active source | `/dashboard/sources` |
| View resource cost charts | `/dashboard/visualizations/cost-charts` |
| View resource usage charts | `/dashboard/visualizations/usage-charts` |
| View burndown charts | `/dashboard/visualizations/burndown` |
| Explore project hierarchy | `/dashboard/drilldown/cards` |
| View shop/Gantt schedule | `/dashboard/facilities` |
| Refresh resource chart data | `/dashboard/settings/preprocess` |
| Manage user roles | Strapi Admin → Content Manager → Users |

### Roles at a glance

| Role | Create Sources | See All Pubsets | See Own Pubsets | See Granted Pubsets |
|------|:--------------:|:---------------:|:---------------:|:-------------------:|
| Administrator | ✓ | ✓ | ✓ | ✓ |
| Project Manager | ✓ | — | ✓ | ✓ |
| Team Member | — | — | ✓ | ✓ |
| No role | — | — | — | — |

---

## Related Help Topics

- [Personal Dashboard Guide](C[ommon_08_Cloud_Reports_And_Dashboard_Guide.md](https://www.timebars.com/knowledgebase/helparticles/common-08-personal-dashboard-guide)) — Single-pubset dashboard with zero configuration

- [Cloud Publishing Guide](https://www.timebars.com/knowledgebase/helparticles/common-07-cloud-publishing-guide) — How to publish data to the cloud and manage pubsets
- [Local Reports Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-local-reports-and-graphs-guide) — Reports available within client applications
- [Data Structure Guide](https://www.timebars.com/knowledgebase/helparticles/common-03-data-structure-user-guide) — Understanding the data model
- [User Interface Guide](https://www.timebars.com/knowledgebase/helparticles/common-02-user-interface-guide) — Navigate the client apps
---

## Support

**Need Help?**
- Knowledge Base: `www.timebars.com/knowledgebase`
- Email Support: jcox@tbcox.com
- Phone: (613) 255-5374

---

*For technical issues, contact your system administrator or the Timebars support team.*
