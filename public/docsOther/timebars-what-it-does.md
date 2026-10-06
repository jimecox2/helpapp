# Timebars — Resource Scheduling Across Projects

The question that sinks delivery is rarely "what is the plan". It is "is the
person we just committed already committed somewhere else" — and in most
organisations the honest answer arrives a month too late, from a spreadsheet
somebody rebuilt by hand.

Timebars is built to answer that question before you make the promise.

## Who it is for

Resource managers, delivery managers and project managers running several
projects against one pool of people, who need to see over-commitment coming
rather than discover it.

## Allocation is a bar you can move

Most scheduling tools assign a person to a task and assume their effort spreads
evenly across it. Real work does not behave that way.

In Timebars, the resource assignment is its **own bar** — gold, sitting under the
task, carrying the resource name, percent allocation, pay rate, and calculated
hours and cost. A task can carry several, one per person.

Because each allocation bar can be moved and resized **independently of its
parent task**, you can model how effort actually flows. The designer who does the
bulk of a three-week task in week one gets a short, high-allocation bar at the
front. The reviewer who signs off at the end gets a brief bar at the close.
Front-load, back-load or level-load — the task dates never move.

That produces forecasts that match reality instead of forecasts that assume
everyone works at a constant rate for the whole of every task.

## Supply, demand, and the row that makes the decision

The resource grids are anchored by summary rows across the top. Three of them
carry the argument, and the last is the one people actually act on.

- **Supply** (blue) — total available FTE from the resource pool, factoring in
  each person's availability and their start and finish dates. Planned hires
  contribute supply from the month they join; leavers drop off when they go.
- **Demand** (green) — total FTE required by every project allocation over the
  same period.
- **Variance** (yellow) — the difference. Positive means spare capacity, negative
  means over-commitment.

How to read it:

- A **small negative variance for one month** is usually manageable.
- A **persistent large negative variance** is a structural capacity problem. Hire,
  descope, or move the timeline — but do not pretend.
- A **consistently positive variance** is equally actionable. That is headcount
  you could redeploy, or room to take on more work.

View it by hours or FTE, weekly or monthly, grouped by project, by person or by
role. Before you commit anyone, double-click their name to see what they are
already carrying.

## Named people and generic roles, together

Early planning does not know who will do the work, only what kind of person is
needed. So the pool holds both **generic resources** — a role, a skill, a
placeholder — and **named people**.

You plan with generics, then swap in names as projects move into execution. The
grids show either view by changing one setting, so a resource manager looking at
individual utilisation and a portfolio lead looking at role-based capacity are
reading the same data.

## A hierarchy that fits the project

Five levels, and you use the ones you need:

| Level | Colour | Is |
|---|---|---|
| L1 | Dark grey | Portfolio — groups programmes and projects |
| L2 | Green | Project or programme |
| L3 | Orange | Sub-project or work package |
| L4 | Blue | Task or milestone |
| L5 | Gold | Allocation — a resource on that work |

Costs and hours roll up automatically from allocations to portfolio as work
changes, so every level stays accurate without anyone recalculating anything.
A simple project can run three levels; a complex programme uses all five.

## Progress that calculates itself, until you say otherwise

The engine works from a **report date** rather than today's date, which is what
makes a status pack reproducible. Against that date, work in the future is
forecast, work that straddles it is actuals plus remaining, and work behind it is
complete.

Percent complete is calculated — but you can override it. Once work has started,
the useful question changes from "what percent is done" to "when will it finish",
so setting a finish date and letting hours follow gives better forecasts than
arguing about percentages.

## Baselines that make variance reporting trivial

One click snapshots the plan, and baselines are unlimited. Compare the current
forecast against any of them on screen, in reports, and on the dashboards. This
is the part that usually costs people a weekend somewhere else.

## Getting data in and out

Build schedules and the resource list in your spreadsheet, then drop the workbook
onto the canvas. Bulk resource allocation changes are far faster in a spreadsheet
than in any web form, so
[the workbook stays in charge](/learn/why-synchronize-with-a-spreadsheet) —
including of your field definitions, picklists and form layouts, which are
[data rather than code](/learn/configuration-is-data-not-code).

If the rest of your organisation runs OpenProject, projects move
[both ways](/learn/two-way-openproject-sync) with their custom fields intact.

Nothing installs — it opens from a URL, and
[your plan stays in your browser](/learn/your-plan-lives-in-your-browser) until
you publish it.

## Where it sits among the three

A project scored and approved in [Costbars](/learn/costbars-what-it-does) comes
into Timebars to be resourced. Work that then needs sprint execution moves to
[Agilebars](/learn/agilebars-what-it-does). One codebase, one data model — moving
between them is a setting, not a migration.
