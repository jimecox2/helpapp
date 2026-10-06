# Agilebars — Sprint Planning for Scrum Teams

Most Agile tools make you choose. Either you get a visual Kanban board, or you
get a time-phased schedule — and if you want both, you get an export, an import,
and two versions of the truth that drift apart by Wednesday.

Agilebars gives you both views of the same data, switched with one click. And
underneath them sits the part that actually matters: **a scheduling engine that
earns progress rather than asking for it.**

## Who it is for

Scrum Masters, product managers and delivery leads running sprint-paced work who
need burndown charts they can put in front of stakeholders without caveats.

## Progress is calculated, not entered

This is the idea the whole product is built on. Nobody types a percentage.

The board has five lanes, and each transition earns a fixed amount of progress:

| Lane | Means | Earns |
|---|---|---|
| **Backlog** | Identified, not committed | — |
| **Will Do** | Committed to this sprint, not started | 0% |
| **Doing** | Active work; records the actual start date | 25% |
| **Finalizing** | In test, review or approval | 75% cumulative |
| **Done** | Accepted; records the actual finish date | 100% |

At standup, the team answers three questions — has it started, is the build done,
is it accepted — and the engine handles everything downstream. Move a card
backwards because a defect turned up, and the progress reverses correctly too.

This removes the single largest source of error in sprint reporting: subjective
percent-complete estimates. A task is in planning, in progress, in review, or
done. There is no fourth answer and nothing to argue about.

Two actual dates get recorded without anyone touching them — the start when a
card enters Doing, the finish when it reaches Done. That gives every sprint a
real history for retrospectives and for improving the next round of estimates.

## Two views, one set of data

**Timescale mode** is where planning happens. Projects and tasks are bars on a
calendar, sized with an effort estimate in hours or story points. Time-phasing
the work here is what makes the burndown chart accurate — the engine needs to
know not just how much work exists but when it is planned across the sprint.

**Kanban mode** is where execution happens. The same tasks become cards in the
five lanes, dragged as work moves.

Switching is one click on the Switch Modes icon. No import, no export, no save.
A task sized in Timescale appears instantly on the board, and progress earned on
the board is immediately in the burndown maths.

Kanban mode on a large screen also does something a whiteboard cannot: it is the
real plan, so the standup and the report never disagree.

## Burndown charts you can defend

The chart plots remaining work against the sprint timeline, with two lines: the
**Planned** line running straight from total sprint work down to zero, and the
**Forecast** line plotting what is actually left, day by day.

Generate it from the project bar with one Refresh click. It reads every task
size, the time-phased dates from Timescale mode, and the progress earned through
lane movements, then draws.

Reading it is quick once you know the shapes:

- **Forecast below Planned** — ahead of schedule.
- **Forecast above Planned** — behind, and the sprint is at risk.
- **A flat Forecast line** — the important one. Nothing has reached Done for
  several days. Go and find the blocker now.
- **Steps rather than a slope** — batch completion instead of continuous
  delivery. Worth raising at the retrospective.

Save a **Planned baseline** before work starts and it stays fixed while the
forecast moves, so you can always see the sprint against its original
commitment. Baselines are one click and unlimited, so mid-sprint re-plans and
scope changes can be captured too.

## The KPIs that come out of it

**Velocity** — total points or hours completed, tracked across sprints to give
capacity planning a real basis. **Predictability** — how closely forecast tracked
plan, which is what builds stakeholder confidence over time. **Utilization** —
inferred from the burndown shape; a steep early drop that flattens means the easy
work went first and the hard work is piling up.

## The deliberately lean structure

Agilebars has Projects (a sprint backlog, green) and Tasks beneath them (user
stories, features, bugs — blue). That is it. No portfolio level above, no
allocation bars below.

That is a choice, not an omission. Sprint-paced work does not need five levels of
hierarchy, and every level you add is a level somebody has to maintain. If you do
need portfolio structure and named-resource allocation, that is what
[Timebars](/learn/timebars-what-it-does) and
[Costbars](/learn/costbars-what-it-does) are for — and because it is one codebase
and one data model, a project moves between them without rework.

## What else comes with it

Risks, issues and change requests logged against the sprint without leaving the
board. Spreadsheet templates for fast bulk backlog entry, with
[the workbook staying in charge](/learn/why-synchronize-with-a-spreadsheet) of
your configuration. Optional personal and enterprise dashboards. Ask AI for help
and for drafting work. And
[two-way OpenProject sync](/learn/two-way-openproject-sync) if that is where the
rest of your organisation lives.

Nothing to install — it opens from a URL, and
[your data stays in your browser](/learn/your-plan-lives-in-your-browser) until
you choose to publish it.
