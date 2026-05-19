# Timebars-Specific Functionality
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)
Timebars is the resource scheduling and traditional project management application in the Timebars Ltd. suite. While it shares a common platform with Agilebars and Costbars — including the canvas, spreadsheet sync, cloud publishing, and data management features covered in [Common Functionality Across All Products](https://www.timebars.com/articles/common-functionality-across-all-products)


## Table of Contents
- [What Makes Timebars Different](#what-makes-timebars-different)
- [The Timebars Hierarchy](#the-timebars-hierarchy)
  - [Configurable Hierarchy Depth](#configurable-hierarchy-depth)
  - [The Five Levels Explained](#the-five-levels-explained)
  - [Allocation Bars: Scheduling Resources at the Work Level](#allocation-bars-scheduling-resources-at-the-work-level)
- [The Timebars Scheduling Engine](#the-timebars-scheduling-engine)
  - [How It Differs from Agilebars](#how-it-differs-from-agilebars)
  - [The Report Date: The Engine's Reference Point](#the-report-date-the-engines-reference-point)
  - [Future Tasks: Forecast Mode](#future-tasks-forecast-mode)
  - [In-Progress Tasks: Actuals Plus Remaining Work](#in-progress-tasks-actuals-plus-remaining-work)
  - [Completed Tasks: Full Actuals](#completed-tasks-full-actuals)
  - [Hours and Cost Calculation](#hours-and-cost-calculation)
  - [Front-Loading and Back-Loading Resources](#front-loading-and-back-loading-resources)
- [The Resource Pool](#the-resource-pool)
  - [Named Resources](#named-resources)
  - [Generic Resources](#generic-resources)
  - [Why Both Matter](#why-both-matter)
- [The Resource Allocator](#the-resource-allocator)
  - [Assigning Resources to Tasks](#assigning-resources-to-tasks)
  - [Checking Individual Availability](#checking-individual-availability)
- [Resource Supply and Demand Analysis](#resource-supply-and-demand-analysis)
  - [Supply, Demand, and the Variance Row](#supply-demand-and-the-variance-row)
  - [FTE vs Hours](#fte-vs-hours)
  - [Monthly vs Weekly Views](#monthly-vs-weekly-views)
  - [Group By: Project, Resource Name, and Role](#group-by-project-resource-name-and-role)
  - [Named and Generic Resources in the Grid](#named-and-generic-resources-in-the-grid)
- [Task Relationships and Constraints](#task-relationships-and-constraints)
  - [Predecessor-Successor Relationships](#predecessor-successor-relationships)
  - [Constraints: Pinning Tasks to Fixed Dates](#constraints-pinning-tasks-to-fixed-dates)

---

## What Makes Timebars Different

Timebars answers the questions that project managers live with every day: How do I allocate the right people across multiple concurrent projects? Which resources are over-committed and by how much? What happens to dependent tasks when I slip a deadline? Can I take on a new project given current capacity? It delivers a time-phased canvas where every bar is connected to a resource, a rate, and a schedule — and where the scheduling engine silently maintains the relationships between them as you work.

Where Agilebars uses lane-based Kanban progress to drive its calculations, Timebars uses the **Report Date** as its reference point: the engine knows which tasks are in the future (forecast), which straddle today (in progress with actuals accumulating), and which are done (fully closed out) — and it calculates dates, hours, costs, and percent complete accordingly across up to five levels of project hierarchy.

---

# The Timebars Hierarchy
-----------

## Configurable Hierarchy Depth

Timebars supports three hierarchy configurations, chosen to match the complexity of the work being managed. All three use the same colour-coded bar levels and enforce structural rules — you cannot place a Task directly under a Portfolio, or an Allocation anywhere except under a Task — so the hierarchy remains consistent regardless of which configuration is in use.

- **3-Level** (Project → Task → Allocation): For simple or single-project scheduling where portfolio grouping is not needed.
- **4-Level** (Portfolio → Project → Task → Allocation): The most common configuration, grouping multiple projects under a portfolio without the additional sub-project layer.
- **5-Level** (Portfolio → Project → Sub-Project → Task → Allocation): For large, complex programmes where projects contain distinct work packages or phases that benefit from their own intermediate level.

Switching between configurations is a matter of whether Orange (L3) and/or Dark Grey (L1) bars are used — the underlying rules, colours, and rollup logic remain identical.

## The Five Levels Explained

| Level | Colour | Role | Notes |
|---|---|---|---|
| L1 | Dark Grey | Portfolio | Groups related programmes and projects; not used in 3-level hierarchy |
| L2 | Green | Project / Programme | Present in all configurations; always represents a project |
| L3 | Orange | Sub-Project / Work Package | Optional; used in 5-level hierarchy for complex projects |
| L4 | Blue | Task | Present in all configurations; always represents a task or milestone |
| L5 | Gold | Allocation | Present in all configurations; always represents a resource assignment |

Costs and hours roll up automatically from L5 to L1 as allocations are created or modified, keeping every level of the hierarchy financially and temporally accurate without manual recalculation.

## Allocation Bars: Scheduling Resources at the Work Level

The gold Allocation bar (L5) is the fundamental unit of resource scheduling in Timebars. Each Allocation sits directly under a Task and represents a single resource assigned to that work — carrying the resource name, percent allocation, pay rate, and calculated hours and costs. A single Task can have multiple Allocation bars, one per resource assigned, and each can span a different portion of the task's timeframe to model how resource effort is distributed across the work.

Allocation bars are created by dragging a resource from the Resource Allocator and dropping it onto a Task bar. Once placed, they can be repositioned and resized on the canvas independently of the parent Task, enabling front-loading and back-loading of effort within the task window without changing the task's start or finish dates.

---

# The Timebars Scheduling Engine
-----------

## How It Differs from Agilebars

The Agilebars scheduling engine is designed around workflow stages — progress is earned as tasks move through Kanban lanes, and the engine converts those stage transitions into burndown data. The Timebars engine works on a fundamentally different principle: it uses the position of each bar on the timeline relative to the **Report Date** to determine whether work is forecast, in progress, or complete, and it calculates planned, forecast, and actual values for dates, hours, and costs accordingly. This makes it suited to traditional project management where tasks have resource assignments, durations, and budgets that need to be tracked precisely over time — not just whether something has started, is in review, or is done.

## The Report Date: The Engine's Reference Point

The Report Date (also called the Status Date) is the single most important parameter in the Timebars scheduling engine. Set once in Canvas Settings, it represents the point in time at which project status is considered current. The engine uses it to classify every bar into one of three states — future, in progress, or complete — and applies a different calculation model to each. Keeping the Report Date current as the project progresses is what keeps forecasts, actuals, and percent-complete values accurate throughout the project lifecycle.

## Future Tasks: Forecast Mode

A task whose start date falls entirely to the right of the Report Date is a **future task**. The engine calculates forecast dates, forecast duration, forecast hours based on resource allocations and percent allocation, and forecast cost based on hours multiplied by pay rates. All values are projections — nothing has been incurred yet. Moving the bar left or right on the canvas immediately updates all forecast values, making it simple to model schedule changes and see their cost and effort implications before committing to them.

## In-Progress Tasks: Actuals Plus Remaining Work

When a bar is positioned so that it straddles the Report Date — its start date is in the past and its finish date is in the future — the engine enters its most powerful mode. The start date is locked as an **actual date** (work has genuinely begun), while the finish date remains a forecast. The engine calculates actual hours and actual cost for the portion of work completed before the Report Date, remaining hours and remaining cost for the work still to be done, and percent complete as the ratio of actual to total work. This split between what has happened and what is still planned is what enables meaningful earned value analysis without any manual data entry.

## Completed Tasks: Full Actuals

A task whose finish date falls entirely to the left of the Report Date is **complete**. Both start and finish dates are recorded as actuals, remaining duration and remaining work become zero, and percent complete is set to 100%. Actual hours and costs are calculated from the full task duration and resource allocation, providing a closed financial record for the work that flows up through the hierarchy into project and portfolio totals.

## Hours and Cost Calculation

The engine derives hours from a straightforward formula applied to each Allocation bar:

**Hours = Percent Allocated × Work Day Hours × Duration**

For example, a resource allocated at 50% to an 8-hour workday for a 10-day task contributes 40 hours. Cost is then **Hours × Pay Rate**, where the pay rate is sourced from the resource's entry in the Resource Pool. Both values are recalculated automatically whenever the allocation bar is moved, resized, or its percent allocation is changed via the Hours Calculator — there is no separate step to trigger the update.

## Front-Loading and Back-Loading Resources

Because Allocation bars can be positioned and resized independently within their parent Task's timeframe, resource effort can be deliberately concentrated at the start or end of a task rather than distributed evenly across it. A resource who does the bulk of the design work in the first week of a three-week task can be represented with a short, high-allocation bar at the beginning; a reviewer who provides sign-off at the end can have a brief Allocation bar at the task's conclusion. This granularity allows project managers to model how effort actually flows through a task, producing more accurate cost and schedule forecasts than tools that assume uniform resource distribution.

---

# The Resource Pool
-----------

## Named Resources

Named resources represent individual people — specific members of staff or contractors — identified by name and assigned a primary role and skill. Each named resource carries a workday calendar (hours per day), a default percent availability, and a pay rate. When allocated to tasks, the engine uses these values to calculate hours and costs for that individual's contribution. Over time, the collection of named resource allocations across all projects forms a complete picture of who is doing what and when — the foundation of reliable utilisation reporting.

## Generic Resources

Generic resources represent pools of capacity rather than specific individuals: "Developer", "Infrastructure Engineer", "Finance SME". They carry a quantity value (e.g., 3.0 FTE of Developer capacity) rather than a single person's allocation, and their monthly availability values reflect the total FTE available from that pool. Generic resources are particularly valuable in the early planning stages of a project, before specific people have been assigned, and for modelling contractor or offshore capacity where individual identities are less important than the role and volume of work.

## Why Both Matter

The combination of named and generic resources is what makes the Supply vs. Demand grids meaningful across the full project lifecycle. In early planning, generic resources define what capacity is needed by role and skill. As projects move into execution, named resources replace generic placeholders at the allocation level. The grids can show either view — individual utilisation or role-based capacity — by changing the Group By setting, giving resource managers and project managers the level of detail they need at any stage.

---

# The Resource Allocator
-----------

## Assigning Resources to Tasks

The Resource Allocator is a movable popup panel that lists every resource in the Resource Pool, with columns for name, role, skill, pay rate, and availability. Finding the right resource is a matter of typing in the search box or sorting by any column — by role to find all available developers, by skill to find a specific competency, or by default percent available to identify who has capacity. Once located, the resource is dragged from the Allocator and dropped onto any Task bar on the canvas, creating a new Gold Allocation bar beneath it instantly.

The Allocator also supports filtering by labour type — showing only named human resources, only generic pool resources, or both — and an expandable metadata view that reveals additional columns such as department, location, and secondary skills when needed.

## Checking Individual Availability

Before committing a resource to a new task, double-clicking a resource row in the Resource Allocator overlays a row of yellow vertical bars at the top of the canvas, one per week in the current timescale view. The height of each bar represents that resource's percent allocation for that week across all current assignments — a bar at 50% means the resource is already half-committed, a bar at or above 100% means they are over-allocated. This visual check takes two seconds and prevents over-commitment without requiring a separate report or system.

For a more comprehensive view across all resources simultaneously, the Resource Allocator's Usage icon opens the full Supply vs. Demand grid — the same view accessible from the Reports menu.

---

# Resource Supply and Demand Analysis
-----------

The Supply vs. Demand grids are the strategic resource management capability that sets Timebars apart from basic scheduling tools. Where most tools can show you what is scheduled, Timebars compares what is scheduled (demand) against what is actually available (supply) — month by month, role by role, person by person — and surfaces the variance in a format that is immediately actionable for resource managers, project managers, and executive leadership.

## Supply, Demand, and the Variance Row

The grid is anchored by three summary rows at the top. The **Supply row** (blue) shows total available FTE from the Resource Pool, factoring in each resource's monthly availability values and their start and finish dates — so planned new hires contribute supply from the month they join, and departing resources drop off in the month they leave. The **Demand row** (green) shows total FTE required by all project allocations across the same time period. The **Variance row** (yellow) shows the difference: positive values (green text) indicate spare capacity, negative values (red text) indicate over-commitment.

The variance row is where resource decisions get made. A small negative variance for one month may be manageable with overtime; a persistent large negative variance across multiple months signals a structural capacity problem that requires hiring, descoping, or timeline adjustment. A consistently positive variance across several months is equally actionable — it points to headcount that could be redeployed, or capacity to take on additional project demand.

## FTE vs Hours

The grids can be viewed in either FTE (Full-Time Equivalent) or hours. FTE is the default and preferred mode for strategic planning and executive communication — "we have a shortfall of 1.5 FTE developers in Q3" is a clearer message than a raw hours deficit. The hours view is useful for detailed tactical scheduling and billing analysis, where actual time values matter. Switching between the two is a single toggle; the underlying data is the same.

## Monthly vs Weekly Views

The monthly view covers up to 24 months and is the right tool for portfolio planning, hiring decisions, and quarterly reviews — it smooths out short-term variation and aligns with the financial planning cycle. The weekly view shows demand at a granular level for the near term, identifying specific bottleneck weeks where a resource is briefly over-committed even if their monthly average looks healthy. Resource managers typically use the monthly view for strategic decisions and the weekly view for short-term levelling before a project milestone or phase kick-off.

## Group By: Project, Resource Name, and Role

The Group By setting controls how demand rows are displayed below the summary rows, without affecting the supply totals. Three views serve different management needs:

- **Group by Project** — one demand row per project, showing how much resource capacity each project is consuming month by month. This is the right view for asking "which projects are driving our capacity crunch?" and "can we take on a new project given current commitments?"
- **Group by Resource Name** — one demand row per named individual, showing each person's project allocations across the timeline. This is the right view for workload balancing — identifying who is over-committed and who has capacity to absorb additional work.
- **Group by Role** — one demand row per role (Developer, Infrastructure Engineer, Finance SME, etc.), aggregating named and generic resources of the same function. This is the right view for skills-based hiring decisions: "we need an additional 0.5 FTE Developer from April through September."

## Named and Generic Resources in the Grid

When viewing by Role, the grid combines both named resources assigned to that role and any generic resource pool entries of the same role into a single demand row. This gives a complete picture of role-based capacity — actual named individuals plus contractor or unassigned capacity — without requiring separate analysis. Supply totals always include both named and generic resources regardless of the Group By setting, ensuring the variance calculation reflects total organisational capacity.

---

# Task Relationships and Constraints
-----------

## Predecessor-Successor Relationships

Task relationships tell the scheduling engine that when a predecessor task moves, all of its successors must move by the same amount. A relationship is created by dragging the beginning of a task bar over the end of another and dropping when the red dashed box appears — the same gesture used to resize a bar, but directed at another bar. A connecting line between the two tasks appears on canvas when relationship lines are enabled via the Shortcut Menu.

The power of relationships is in cascading changes. Moving a predecessor task two weeks to the right automatically reschedules all successors — and their successors — by two weeks, propagating the change through the entire dependency chain without any manual adjustment. Hours and costs on affected tasks recalculate automatically based on their new positions relative to the Report Date. This makes Timebars behave like a real scheduling engine rather than a drawing tool: the plan stays internally consistent as changes are made.

## Constraints: Pinning Tasks to Fixed Dates

A constraint overrides the relationship logic for a specific task, locking it to a date that must not change regardless of what happens to its predecessors. Constraints are created by dragging the red push pin from the canvas edge and dropping it onto a task; removing a constraint is a double-click on the pin. They are the right tool for tasks that are anchored to external realities — a regulatory deadline, a vendor delivery date, a go-live window that cannot move — where the scheduling flexibility that relationships provide should not apply.

When a constrained task's predecessors slip and the relationship would normally push the constrained task forward, the constraint holds. The resulting schedule shows the gap between where the predecessor ends and where the constrained task must begin, making the squeeze immediately visible on the canvas. Used sparingly and intentionally, constraints are a powerful way to model real-world scheduling boundaries without losing the benefits of relationship-driven planning everywhere else.

See the [Timebars User Guide](https://www.timebars.com/knowledgebase/helparticles/timebars-user-guide) for detailed instructions on every feature covered on this page.
