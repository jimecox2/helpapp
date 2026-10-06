# Two-Way OpenProject Sync

If your organisation already runs OpenProject, you have work packages, a type
hierarchy and a team that knows where things live. What you almost certainly do
not have is a resource view that shows who is overloaded before the month
starts, or a portfolio score that decides which project should start next.

That is the gap this sync closes. It moves a project and everything beneath it
between OpenProject and the Timebars suite, in whichever direction you choose,
one project at a time — so you can bring a plan into Timebars, resource it
properly, and push the result back without anybody re-keying anything.

## One project at a time, and you choose the direction

Every project carries a **sync master**: the side that owns it. The create steps
set it; the update steps refuse to run against a project owned by the other side
and tell you which button to press instead. Changing master is a deliberate edit
on the project, never something a run does behind your back.

That gives four straightforward scenarios:

| | Timebars owns it | OpenProject owns it |
|---|---|---|
| **Create** | Create the project and every row beneath it in OpenProject | Create the project and every bar beneath it in Timebars |
| **Update** | Update OpenProject, creating anything missing | Update Timebars, creating anything missing |

There is no separate bulk-create step. The update runs create whatever is
missing as they go, so a project that has grown since the last run does not need
a different button.

## What travels

OpenProject calls everything beneath a project a work package. The suite does
not — it has levels, and the level decides where a row goes.

| In Timebars | Becomes, in OpenProject |
|---|---|
| Project | an OpenProject **project** |
| Sub-Project | a work package of type **L3 SP/WP** |
| Task | **L4 Task** |
| Task with subtype Risk, Issue or Change Request | **L4 Risk**, **L4 Issue**, **L4 CR** |
| Milestone | **L4 Milestone** |
| Allocation | **L5 Allocation**, carrying the assignee |

Custom fields travel with them. Over 150 fields are mapped as shipped, and the
mapping is yours to change — see
[Your configuration is data, not code](/learn/configuration-is-data-not-code).

One honest limitation: **Portfolio rows do not travel.** OpenProject has no
equivalent type, so a run always starts at a project and covers everything
underneath it.

## What it refuses to do

Most of the engineering in a two-way sync is not in moving data. It is in
refusing to move data when moving it would lose something.

- **Every run previews before it writes**, and asks once.
- **A row deleted on one side is reported, never deleted on the other.** Removals
  stay a human decision, always.
- **Every row it could not carry is named, with the reason** — printed where you
  are already looking, and downloadable as a CSV. A run whose only entries are
  notes is a clean run.
- **Conflicts are detected against OpenProject's own clock**, so the comparison
  is exact rather than a guess about whose copy is newer. A conflicted row is
  logged and the master side wins.
- **An update against a project owned by the other side simply will not run.** It
  names the button you wanted instead.

## Field mapping without typing an id

OpenProject numbers its custom fields per instance — your `customField107` is not
another customer's. So the suite never asks you to type one.

**Discover** walks the project, work package and user schemas and writes nothing
at all, so it is safe to run whenever you like. **Reconcile** then matches every
field and every picklist value by name and records the ids it finds. It previews,
asks, and changes only your local database — it never writes to OpenProject,
because OpenProject's API cannot create a custom field or a picklist value
anyway. What it does instead is tell you exactly which ones are missing and hand
you the list to paste into its admin screens.

Reconcile also never decides whether a field travels. That switch is yours, held
in your workbook, because it is a configuration decision that has to survive the
next import.

## Getting started

1. Point the suite at your instance and run **Test Connection**. It reads your
   identity and the instance's type list, and prints the work package type ids
   you actually have. Almost every "nothing happened" report starts here.
2. Run **Discover**, then **Reconcile**. Fix anything Reconcile reports missing in
   OpenProject's admin screens, then reconcile again.
3. Pick one project, choose a direction, and run the create step. Read the
   feedback list before assuming it worked.

Types are matched **by name at run time, never by id**, so a type renamed in
OpenProject admin stops resolving until the name matches again. That is
deliberate: names are stable across instances, ids are not.
