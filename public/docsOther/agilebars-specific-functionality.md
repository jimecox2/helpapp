# Agilebars-Specific Functionality
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)
Agilebars is the sprint scheduling application in the Timebars Ltd. suite. While it shares a common scheduling engine, cloud publishing platform, spreadsheet sync, and data management capabilities with Timebars and Costbars (covered in [Common Functionality Across All Products](https://www.timebars.com/articles/common-functionality-across-all-products))



## Table of Contents
- [Agilebars-Specific Functionality](#agilebars-specific-functionality)
  - [Table of Contents](#table-of-contents)
  - [What Makes Agilebars Different](#what-makes-agilebars-different)
- [The Agilebars Hierarchy](#the-agilebars-hierarchy)
  - [Projects (Sprint Backlogs)](#projects-sprint-backlogs)
  - [Tasks (Work Items and User Stories)](#tasks-work-items-and-user-stories)
- [Dual-Mode Canvas](#dual-mode-canvas)
  - [Timescale Mode](#timescale-mode)
  - [Kanban Mode](#kanban-mode)
  - [Switching Between Modes Instantly](#switching-between-modes-instantly)
- [The Kanban Board](#the-kanban-board)
  - [The 5 Swim Lanes](#the-5-swim-lanes)
  - [Definition of Done Rules and Automatic Progress](#definition-of-done-rules-and-automatic-progress)
  - [Automatic Date Tracking](#automatic-date-tracking)
- [The Earned Value Scheduling Engine](#the-earned-value-scheduling-engine)
  - [How Progress is Calculated, Not Entered](#how-progress-is-calculated-not-entered)
  - [Task Sizing](#task-sizing)
- [Burndown Charts](#burndown-charts)
  - [What a Burndown Chart Shows](#what-a-burndown-chart-shows)
  - [Generating and Refreshing the Chart](#generating-and-refreshing-the-chart)
  - [Planned Baseline vs. Forecast](#planned-baseline-vs-forecast)
  - [Reading the Chart](#reading-the-chart)
  - [Sprint KPIs: Velocity, Predictability, and Utilization](#sprint-kpis-velocity-predictability-and-utilization)

---

## What Makes Agilebars Different

Most Agile tools force a choice between a visual Kanban board and a time-phased schedule — Agilebars gives you both in a single application, switching between them instantly without any import or export step. At the core is a scheduling engine purpose-built for Agile Earned Value Management: tasks earn progress automatically as work moves through workflow stages, eliminating the daily admin burden of manual time entry and percent-complete updates. The result is a sprint management tool that produces accurate forecasts with minimal overhead, and burndown charts you can actually trust.

---

# The Agilebars Hierarchy
-----------

## Projects (Sprint Backlogs)

In Agilebars the top-level bar is the Project — a green bar that represents a sprint backlog or sprint cycle. Every Project has a start and finish date that defines the sprint window, and all tasks within it are planned and tracked against that timeframe. You can run multiple Projects simultaneously, making it straightforward to manage parallel sprints across teams or products on a single canvas.

## Tasks (Work Items and User Stories)

Below each Project sit Tasks — blue bars representing user stories, features, bugs, or any individual work item the team commits to in a sprint. Tasks are sized with an effort estimate (hours or story points) in Timescale mode and then tracked through the Kanban workflow. Unlike Timebars and Costbars, Agilebars has no Portfolio level above Projects and no separate Allocation bars below Tasks — keeping the structure intentionally lean for sprint-paced work.

---

# Dual-Mode Canvas
-----------

## Timescale Mode

Timescale mode is the default view and the place where sprint planning happens. Projects and tasks are displayed as horizontal bars on a calendar timeline, allowing teams to set start and finish dates, size work items, and visualize the full sprint at a glance. Time-phasing tasks in this mode is what enables accurate burndown charts — Agilebars needs to know not just how much work exists, but when it is planned across the sprint days.

## Kanban Mode

Kanban mode transforms the same data into a visual workflow board, organized into five swim lanes that represent stages of work. This is the mode used during sprint execution — daily standups, progress updates, and work-in-progress tracking. Every task is represented as a card that can be dragged between lanes, with progress and dates recording automatically based on where each card sits.

## Switching Between Modes Instantly

Switching between Timescale and Kanban requires a single click on the Switch Modes icon in the main menu. There is no import, export, or save required — both views draw from the same underlying data, so a task sized in Timescale mode appears immediately on the Kanban board, and progress earned in Kanban mode is immediately reflected in Timescale reports and burndown calculations.

---

# The Kanban Board
-----------

## The 5 Swim Lanes

The Agilebars Kanban board uses five swim lanes that map to the natural stages of Agile sprint execution:

- **Backlog** — Work items identified but not yet committed to the sprint. Items live here during backlog grooming and sprint planning, waiting to be promoted into active work.
- **Will Do** — Work committed to the current sprint but not yet started. Moving a task here signals sprint commitment; no progress is earned at this stage.
- **Doing** — Work actively in progress. Dragging a task into this lane records the actual start date and earns 10% progress — representing the planning and set-up effort for that item.
- **Finalizing** — Work in the final stages of testing, review, or approval. Moving here earns an additional 65%, bringing total progress to 75% and signalling that the core work is complete and the item is being verified.
- **Done** — Work fully completed and accepted. Moving here earns the final 25% (100% total) and records the actual finish date automatically.

Each lane transition is a deliberate decision, not a percentage guess. Teams answer simple questions at standup — "Has this started? Is the development done? Is it accepted?" — and Agilebars handles all the calculations.

## Definition of Done Rules and Automatic Progress

Progress in Agilebars is never entered manually. The scheduling engine applies fixed progress rules to each lane transition: Doing earns 10%, Finalizing earns 75% cumulative, Done earns 100%. These percentages are deliberate — they reflect planning effort, active work, and final acceptance as proportions of total task size. Because every task follows the same rules, progress across the entire sprint is objective and consistent, not dependent on individual developers' interpretations of "percent complete."

Moving a task backwards reverses the progress calculation automatically. If a "Done" item is found to have a defect and moved back to Finalizing, the progress correctly reverts to 75% and the burndown chart reflects the change on the next refresh.

## Automatic Date Tracking

Two actual dates are recorded without any user action. When a task is dragged into the **Doing** lane, the actual start date is set to the current Report Date. When it is dragged into **Done**, the actual finish date is set. This gives every sprint a complete historical record of when work actually started and finished — data that is invaluable for retrospectives, velocity analysis, and improving estimates over time.

---

# The Earned Value Scheduling Engine
-----------

## How Progress is Calculated, Not Entered

The Agilebars scheduling engine is modelled on Earned Value Management principles adapted for Agile sprint execution. Rather than asking team members to self-report progress percentages — a process that is both time-consuming and unreliable — the engine earns progress on behalf of each task based on which workflow stage it occupies. The Scrum Master or project manager simply keeps the Kanban board current during daily standups, and the engine maintains all progress calculations, remaining work totals, and burndown data automatically.

This approach eliminates the most common source of inaccuracy in sprint reporting: subjective percent-complete estimates. A task is either in planning, in progress, in review, or done — and the system assigns the corresponding progress value. The result is a burndown chart that reflects real workflow movement, not optimistic self-assessments.

## Task Sizing

Accurate burndown charts begin with accurate task sizing. Each task bar carries a **Work** field — the effort estimate in hours or story points assigned before the sprint begins. The best results come from sizing each item with the person who will actually do the work, because the scheduling engine uses these values to calculate how much work is burned down each day as tasks move through the lanes. Consistent units (all hours or all story points) across all tasks in a sprint are the only requirement — the engine handles the rest.

---

# Burndown Charts
-----------

## What a Burndown Chart Shows

A burndown chart plots **remaining work over time** for a sprint. The horizontal axis is the sprint timeline in days; the vertical axis is work remaining in the units used for task sizing. Two lines are displayed: the **Planned (Ideal) line** — a straight diagonal from total sprint work at day zero down to zero at the sprint end date — and the **Forecast (Actual) line**, which plots real remaining work day by day as tasks are completed. The gap between the two lines tells the story of the sprint at a glance: is the team ahead, on track, or falling behind?

## Generating and Refreshing the Chart

The burndown chart is generated from the Project bar's Cost Schedule form with a single Refresh button click. Agilebars reads all task sizes, their time-phased dates from Timescale mode, and the progress earned through Kanban lane movements, then calculates remaining work for every day of the sprint. The chart renders immediately. As the sprint progresses, clicking Refresh at any time recalculates the Forecast line, keeping the chart current without any manual data entry.

## Planned Baseline vs. Forecast

Before sprint work begins, a **Planned baseline** can be saved with one click — this locks the original sprint plan as a permanent reference line. As tasks move through lanes and the Forecast line updates, the Planned line stays fixed, making it possible to see at any point exactly how the sprint is tracking against the original commitment. Multiple additional baselines can also be saved to capture mid-sprint re-plans, scope changes, or snapshots for retrospective analysis.

## Reading the Chart

When the Forecast line tracks below the Planned line the team is ahead of schedule. When it runs above, work is falling behind and the sprint is at risk. A flat Forecast line — no downward movement over several days — is the most important signal: it means no tasks have moved to Done and the team should investigate blockers immediately. A step-function pattern (flat periods followed by sharp drops) indicates batch completions rather than continuous delivery, which is a useful insight for retrospectives. The closer the Forecast line tracks the Planned line throughout the sprint, the more predictable the team's delivery has become.

## Sprint KPIs: Velocity, Predictability, and Utilization

Burndown data feeds three key metrics that help Agile teams improve over time. **Velocity** is the total story points or hours completed in a sprint (all tasks in the Done lane) — tracking this across sprints gives the team a reliable basis for planning future sprint capacity. **Predictability** is measured by how closely the Forecast line tracked the Planned line — consistent tracking indicates mature estimation and reliable delivery, which builds stakeholder confidence. **Utilization** can be inferred from burndown shape: a steep early decline that flattens suggests easy tasks are tackled first and harder ones accumulate; consistently smooth declines indicate well-balanced workloads and realistic sprint planning.

See the [Agilebars User Guide](https://www.timebars.com/knowledgebase/helparticles/agilebars-user-guide) for detailed instructions on every feature covered on this page.
