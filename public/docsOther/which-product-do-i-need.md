# Which Product Do I Need?

Three products, one codebase, one database. They are not three tools that pass
work to each other — they are three views of the same records, which is why
adding the second one later costs you nothing.

Most organisations start with one. Here is how to tell which.

## Start from what is going wrong

**"We keep committing people who are already committed."**
You need **Timebars**. Drag-and-drop allocation across multiple projects,
working-day arithmetic rather than calendar days, and overallocation visible
before you promise the work rather than after.

**"The board says one thing and the schedule says another."**
You need **Agilebars**. A Kanban board and a timescale that are two views of the
same data, so moving a card to Done and marking a task complete are the same act.
Burndown charts come out of the plan rather than out of a separate spreadsheet.

**"Projects keep starting and nobody decided they should."**
You need **Costbars**. Score projects against criteria you define, see which rise
to the top, level the demand they create, and make the start/stop decision with
numbers instead of volume.

## Start from your job title

| If you are | Start with |
|---|---|
| A Scrum Master or Agile delivery lead | Agilebars |
| A resource manager or delivery manager across several projects | Timebars |
| A PMO lead, portfolio manager or anyone who owns the pipeline | Costbars |
| A project manager on traditional plans | Timebars |
| An executive who needs the portfolio picture, not the detail | Costbars, plus the dashboards |

## How the three fit together

If you eventually run all three, the sequence is:

1. **Decide with Costbars.** List the candidates, define your criteria, score
   them, and pick what starts.
2. **Resource with Timebars.** The approved projects are already there. Add real
   schedules and named people, and find the overallocation before it happens.
3. **Execute with Agilebars.** The same projects again, now as sprint backlogs,
   with burndown that comes out of the plan.

Nothing is exported or re-keyed between those steps, because all three work the
same five levels of the same hierarchy:

{{figure:hierarchy-levels}}

Two things follow from that picture, and they matter when you are choosing.

**Adding a product later is a setting, not a migration.** Start with one; the
others read the same records whenever you switch them on.

**Agilebars has no allocation level.** It shows Projects and Tasks, which is
right for a sprint team but means it cannot on its own tell you whether the
people in that sprint are also committed elsewhere. If that question matters to
you, you want Timebars alongside it — see
[agile and waterfall against one resource pool](/learn/blog-agile-and-resource-management-is-there-an-conflict).

What the sequence is really protecting is the data collected at approval — the
charter, the scores, the estimate and the resource plan — which in most
organisations is lost the moment a project leaves the PPM system. See
[the data you lose between approval and delivery](/learn/from-business-case-to-sprint).

## What you get regardless of which you pick

Every product ships with the same platform underneath: risks, issues and change
requests; supply and demand grids; reports and graphs; personal and enterprise
dashboards; [spreadsheet-driven
configuration](/learn/configuration-is-data-not-code); [two-way OpenProject
sync](/learn/two-way-openproject-sync); and Ask AI for help and for drafting
projects and business cases.

There are no feature tiers to compare and nothing to bolt on later.

## Still not sure?

Open all three and spend twenty minutes in each — they run in the browser with
nothing to install. Or read [the case for running all
three](/learn/common-benefits-agilebars-timebars-costbars), which lays out where
the boundaries between them actually fall.
