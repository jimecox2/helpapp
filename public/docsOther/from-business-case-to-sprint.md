# The Data You Lose Between Approval and Delivery

You run a proper selection process. A business case. Strategic scoring against
your investment priorities. A risk-versus-complexity assessment, the level of
executive commitment, an estimate class, a rough order-of-magnitude budget, and a
resource plan showing roughly which roles the work will need.

A committee weighs all of it and approves the project.

Then the project manager opens a scheduling tool and types the name in again.

Everything the decision rested on stays behind in the PPM system. The plan that
gets built has no memory of why the project was approved, what it promised, or
what capacity was assumed when the promise was made. Six months later somebody
asks whether it is delivering the benefit it was funded for, and there is nothing
to compare against — because the two halves of the answer live in two systems
that have never spoken.

## Three boundaries, and data lost at each

**Approval to plan.** The charter, the scores, the ROM estimate and the role-based
resource plan do not travel. What travels is a project name and a budget number.

**Plan to sprint.** The task list becomes a backlog. Resource allocations and
cross-team dependencies do not come with it, because the agile tool has no place
to put them. The team now works from a list that has lost its context.

**Delivery back to the centre.** Progress returns as a status email, a RAG colour
typed into a slide, or a spreadsheet somebody maintains on Friday afternoons.
By the time it reaches the portfolio view it is a week old and one person's
interpretation.

Each boundary is usually a different product from a different vendor, which means
the integration between them is a person doing re-entry. That person is also the
single point of failure for portfolio reporting.

## This is not an integration problem

The instinct is to connect the three systems. It rarely works, because each one
holds a different *shape* of the same project — a scored candidate, a resourced
schedule, a backlog — and keeping three shapes in agreement is harder than the
work they describe.

The alternative is that there is only one record, and the three shapes are three
views of it.

## One hierarchy, three views

All three products use the same five levels:

| Level | Is |
|---|---|
| L1 | Portfolio or programme |
| L2 | Project |
| L3 | Sub-project or work package *(optional)* |
| L4 | Task or milestone |
| L5 | Allocation — a resource on that work |

Costbars and Timebars use all five. **Agilebars uses a two-tier subset** — the
Project and its Tasks — so a sprint team sees a backlog and nothing above or
below it.

{{figure:hierarchy-levels}}

Switching products is a setting, not a transfer. The project scored in Costbars
*is* the project scheduled in Timebars *is* the sprint backlog in Agilebars. The
metadata attached at approval — charter, strategic value score, ability-to-execute
score, ROM estimate, sponsor, investment category — is on that same record, still
there at delivery, because it never went anywhere.

## Kick off in Costbars, even for small work

The habit worth building is that **every project starts in Costbars**, including
the ones that feel too small to justify it. Two minutes of scoring at the start
is what makes the portfolio view real later, and a project that enters delivery
without a charter is one you cannot assess afterwards.

### The resource summary plan

At approval time you do not know who will do the work, and pretending otherwise
produces a precise plan built on names you will change. What you can state is the
*shape* of the need.

Two ways to capture it:

- **Ask AI — Create a Resource Plan.** Adds a task carrying generic role
  placeholders for the people the project will need, giving you an early estimate
  before names exist.
- **A resource summary task.** A consolidated line for the project's resource
  need, which is why establishing one is a prerequisite of the PPM process rather
  than an afterthought.

Both use **generic resources** — a role, not a person. That is exactly right for
portfolio decisions: you are deciding whether the organisation can staff the
shape of this work alongside everything else, not who is free in March.

That summary demand is what the levelling step works on. It is coarse, and it is
honest, which is a better basis for a go/no-go than false precision.

## Detailed scheduling in Timebars

The project is approved. Same record, now worked at L5.

Drag a named resource from the allocator onto a task and the allocation becomes
its own bar, carrying the resource name, percent allocation, pay rate, and
calculated hours and cost. Because that bar moves and resizes independently of
its parent task, you can front-load the designer and put the reviewer at the end
without touching the task dates.

Named people progressively replace the generic placeholders. This is the part
worth being clear about: **replacing a placeholder with a person does not create
demand, it sharpens it.** The portfolio-level estimate and the detailed schedule
are the same demand at two levels of precision — which is why the numbers do not
jump when a project moves from selection into delivery.

## How supply and demand is actually calculated across all of it

This is the mechanism that makes one grid possible across a portfolio in
selection and projects already running.

**Supply** comes from the resource pool. Each resource carries monthly FTE
availability. Start and finish dates are honoured, so a planned hire contributes
from the month they join and a leaver stops contributing when they go — which is
what lets you plan against a workforce that is changing.

**Demand** is computed from allocations, not entered:

1. Each allocation's total work is spread across its duration — work divided by
   the number of working days gives hours per day.
2. Those hours are summed into monthly buckets.
3. Each bucket is converted to FTE: monthly hours ÷ (8 hours × 20 working days).

**Variance** is supply minus demand, colour coded, and it is the row people
actually act on.

<figure>
<div style="overflow-x:auto">
<svg viewBox="0 0 900 336" role="img" aria-label="The resource pool feeds the Supply row directly, honouring joiner and leaver dates. Three kinds of allocation — Costbars generic roles, Timebars named people, and an Agilebars squad as standing capacity — all pass through the same conversion: work divided by working days gives hours per day, summed into monthly buckets, divided by eight hours times twenty days to give FTE. That result is the Demand row. Variance is supply minus demand." style="display:block;width:100%;min-width:720px;height:auto;font-family:inherit">
  <defs>
    <marker id="sd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
  </defs>
  <rect x="8" y="10" width="236" height="46" rx="4" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-opacity="0.45"/>
  <text x="22" y="30" font-size="12" font-weight="600" fill="currentColor">Resource pool</text>
  <text x="22" y="46" font-size="11" fill="currentColor" opacity="0.7">monthly FTE, joiner and leaver dates</text>
  <rect x="8" y="88" width="236" height="44" rx="4" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-opacity="0.45"/>
  <rect x="8" y="88" width="4" height="44" fill="#F5cf05"/>
  <text x="22" y="108" font-size="12" fill="currentColor">Costbars</text>
  <text x="22" y="124" font-size="11" fill="currentColor" opacity="0.7">generic role allocations</text>
  <rect x="8" y="146" width="236" height="44" rx="4" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-opacity="0.45"/>
  <rect x="8" y="146" width="4" height="44" fill="#4286f3"/>
  <text x="22" y="166" font-size="12" fill="currentColor">Timebars</text>
  <text x="22" y="182" font-size="11" fill="currentColor" opacity="0.7">named allocations</text>
  <rect x="8" y="204" width="236" height="44" rx="4" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-opacity="0.45"/>
  <rect x="8" y="204" width="4" height="44" fill="#4fb258"/>
  <text x="22" y="224" font-size="12" fill="currentColor">Agilebars squad</text>
  <text x="22" y="240" font-size="11" fill="currentColor" opacity="0.7">standing capacity, generic</text>
  <g stroke="currentColor" stroke-width="1.4" fill="none" marker-end="url(#sd-arrow)">
    <path d="M244,33 L300,33 L300,26 L636,26 L636,62"/>
    <path d="M244,110 L280,110 L280,166 L306,166"/>
    <line x1="244" y1="168" x2="306" y2="168"/>
    <path d="M244,226 L280,226 L280,170 L306,170"/>
  </g>
  <rect x="312" y="96" width="250" height="144" rx="4" fill="none" stroke="currentColor" stroke-opacity="0.55"/>
  <text x="326" y="120" font-size="12" font-weight="600" fill="currentColor">Allocation to monthly FTE</text>
  <text x="326" y="148" font-size="11" fill="currentColor" opacity="0.8">1. work / working days = hours per day</text>
  <text x="326" y="172" font-size="11" fill="currentColor" opacity="0.8">2. sum the hours into monthly buckets</text>
  <text x="326" y="196" font-size="11" fill="currentColor" opacity="0.8">3. divide by 8 hours x 20 days</text>
  <text x="326" y="224" font-size="11" fill="currentColor" opacity="0.55">computed, never typed in</text>
  <line x1="562" y1="168" x2="636" y2="168" stroke="currentColor" stroke-width="1.4" marker-end="url(#sd-arrow)"/>
  <rect x="644" y="62" width="248" height="212" rx="4" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.55"/>
  <text x="658" y="86" font-size="12" font-weight="600" fill="currentColor">Supply and demand grid</text>
  <rect x="658" y="100" width="220" height="44" rx="3" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-opacity="0.35"/>
  <text x="670" y="120" font-size="12" fill="currentColor">Supply</text>
  <text x="670" y="136" font-size="11" fill="currentColor" opacity="0.7">what the pool can give</text>
  <rect x="658" y="152" width="220" height="44" rx="3" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-opacity="0.35"/>
  <text x="670" y="172" font-size="12" fill="currentColor">Demand</text>
  <text x="670" y="188" font-size="11" fill="currentColor" opacity="0.7">every allocation, all three sources</text>
  <rect x="658" y="204" width="220" height="44" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.7" stroke-width="1.5"/>
  <text x="670" y="224" font-size="12" font-weight="600" fill="currentColor">Variance</text>
  <text x="670" y="240" font-size="11" fill="currentColor" opacity="0.7">supply minus demand</text>
  <text x="644" y="296" font-size="11" fill="currentColor" opacity="0.7">Read as FTE or hours, weekly or monthly,</text>
  <text x="644" y="312" font-size="11" fill="currentColor" opacity="0.7">grouped by project, person or role.</text>
  <text x="8" y="296" font-size="11" fill="currentColor" opacity="0.7">A project still being scored and a project</text>
  <text x="8" y="312" font-size="11" fill="currentColor" opacity="0.7">halfway through delivery land in one grid.</text>
</svg>
</div>
<figcaption>Demand is calculated from allocations rather than estimated, which is why selection-stage generic roles and delivery-stage named people can be compared in the same unit. Group by role and a placeholder and a person count as the same kind of thing.</figcaption>
</figure>

Because the Costbars generic-role plan and the Timebars named allocations are
both allocations on the same hierarchy, **they land in the same demand
calculation**. A candidate project still being scored and a project halfway
through delivery appear in one grid, in one unit.

Read it as FTE or hours, weekly or monthly, grouped by project, by person, or by
role. **Group by role is the one that works across the whole estate**, because it
is the only grouping that compares a generic placeholder and a named person as
the same kind of thing.

## Where sprint work fits in that calculation

Agilebars has no allocation level — work is sized at the task. So a sprint team's
consumption is not expressed as per-task allocations, and trying to force it
produces a forecast nobody believes.

Represent the squad as **standing capacity** in the pool instead: a generic
allocation of so many FTE per role per month, for as long as the team exists.
That is accurate, it is stable even when the backlog is not, and it puts agile
demand into the same variance row as everything else. The reasoning is worked
through in
[agile and waterfall against one resource pool](/learn/blog-agile-and-resource-management-is-there-an-conflict).

## Progress comes back on its own

Because it is one record, progress does not have to be *reported* to the centre.
It is already there.

Percent complete is earned from Kanban lane movement on the agile side, and
calculated against the report date on the scheduled side. Costs and hours roll up
from allocations to portfolio automatically. Publish a snapshot and the
dashboards read it.

And since the approval-time data never left the record, the question that started
this page becomes answerable: ROM estimate against current forecast cost, the
charter's success criteria against today's status, the baseline you took at
kickoff against where the project actually is.

## The habit, in order

1. **Kick off in Costbars.** Charter, strategic metadata, project assessment.
2. **Build the resource summary** with generic roles — Ask AI will draft it.
3. **Run the five steps** — prioritise, score, level, select, balance.
4. **Approve, then switch to Timebars.** Same record; add named allocations and
   real dates.
5. **Move sprint work to Agilebars.** Same record again; the team sees a backlog.
6. **Read one supply and demand grid**, grouped by role, across all of it.

## One honest limitation

This works because everything is in one dataset. Work that lives entirely in
another system — a vendor's delivery, a team on a platform you do not control —
is not in the grid unless somebody represents it there, usually as a standing
generic allocation.

That is a modelling job, not a technical one, and it takes a morning. But a
capacity picture that quietly omits a third of the demand is worse than no
picture, so it is worth doing before you trust the variance row.
