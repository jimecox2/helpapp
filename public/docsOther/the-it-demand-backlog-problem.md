# Hundreds of Requests, One Delivery Team

Every line of business is raising changes through the same intake funnel. The
ticket queue has hundreds of items in it. Some are quick configuration changes
that never need to touch the software development lifecycle at all; some are
small changes that do; some are full projects running three to six months; and
once or twice a year something arrives that is really a programme with
sub-projects underneath it.

Meanwhile the teams are already full. Important work sits untouched while less
important work somehow makes it through development and lands on the business
for acceptance — not because anyone decided it should, but because it was easier
to start.

And underneath all of it sits the constraint nobody can engineer around: **the
people who can build internal systems are the same people delivering
customer-facing work.** That work is revenue. It is priority one by default and
it should be. But it means every internal commitment you make is really a bet
against capacity you do not fully control.

This page is about getting that under control. It is a process problem before it
is a tooling problem, so the process comes first.

## Step 1 — Get the backlog into a spreadsheet

Before any tool can help, the queue has to become a list you can sort. Export
the ticket system. One row per item. Do not clean it up yet.

This sounds trivial and it is the step most organisations skip, because the
ticketing system feels like it already *is* the list. It is not — it is a queue
ordered by arrival, which is exactly the ordering you are trying to escape.

The spreadsheet is also where the suite expects to meet you. Field definitions,
picklists, the resource pool and the work itself all
[round-trip through a workbook](/learn/why-synchronize-with-a-spreadsheet), so
the list you build here becomes the plan rather than being re-keyed into one.

## Step 2 — Categorise by shape, not by requester

Three shapes cover almost everything in an intake funnel, and they behave
differently enough that mixing them is what makes the backlog unmanageable:

| Shape | What it is | Where it lives |
|---|---|---|
| **Small items** | Configuration, no-code, quick fixes. Never enter the SDLC | Tasks under a standing business-as-usual project |
| **Projects** | Real delivery with work packages, weeks to months | A project, with sub-projects and tasks beneath it |
| **Programmes** | Large initiatives with several sub-projects feeding the SDLC | A portfolio, with projects beneath it |

The suite's hierarchy is built for exactly this: Portfolio, Project,
Sub-Project or work package, Task, and Allocation. You use the levels you need —
a small item is one task; a programme uses all five.

The point of sorting by shape is that it separates two different decisions.
Small items need a *who looks after these* answer. Projects and programmes need a
*should we do this at all* answer. Trying to make both decisions in one meeting is
why the meeting never ends.

## Step 3 — Prioritise on something other than volume

This is what [Costbars](/learn/costbars-what-it-does) is for, and the five steps
map directly onto the problem.

**Score strategic value.** Every project and programme gets a 0–100 score based on
how it aligns with your investment categories, initiatives, objectives and
strategy. Crucially the scoring is *relative* — you set the order of importance,
and the tool weights against it. The scoring takes seconds; agreeing the order is
the real work, and it is a conversation you should be having anyway.

**Score ability to execute.** Separately, rate how deliverable each one actually
is: risk against size and complexity, executive commitment, quality of the
estimate, and for anything in flight, health and variance. Anything below 60
gets a reject or terminate recommendation.

**Plot them.** The bubble chart puts strategic value across and deliverability up,
with bubble size showing budget or hours. The top-right quadrant is approve. The
bottom-left is kill. A cluster of large bubbles bottom-left tells you, visually
and without argument, how much of your capacity is committed to work that is
neither valuable nor likely to succeed.

**Check the balance.** Highest-scoring is not the same as balanced. The scorecard
checks whether budget actually flows to your stated top priority, whether risk is
concentrated, and whether everything lands in the same quarter.

Re-prioritising is re-running the affected steps. That matters more than it
sounds: if reprioritisation is expensive, it does not happen, and the portfolio
silently drifts back to whatever arrived most recently.

## Step 4 — Resource-load against *all* the demand

This is the step that decides whether any of the above survives contact with
reality, and it is where most planning exercises quietly fail.

The rule is simple and uncomfortable: **customer-facing work has to be in the
same resource pool as internal demand.** If revenue work sits outside the model,
your variance row is fiction and every internal commitment you make is an
optimistic guess.

[Timebars](/learn/timebars-what-it-does) gives you summary rows that make the
position honest:

- **Supply** — available capacity, accounting for each person's availability and
  their start and leave dates, so planned hires contribute from the month they
  join.
- **Demand** — everything allocated, revenue work included.
- **Variance** — the difference. Red means you have already over-committed.

Group by **role** rather than by name, and plan early work with **generic
resources** — "senior integration developer", not a person — swapping in names as
things firm up. That solves the specific bind you are in: you need to plan
capacity by skillset months ahead, but you cannot name the individual until you
know what the customer work looks like.

A persistent negative variance is not a scheduling problem to be solved by
cleverness. It is a hiring, descoping or timeline decision, and the value of
seeing it in a grid is that it forces that decision to be made by someone with
the authority to make it.

## Step 5 — Hand the approved work to the teams that will do it

Approved items flow into delivery. Small items go to whoever owns the
business-as-usual lane. Projects get schedules and named allocations. Work
suitable for monthly sprints moves to
[Agilebars](/learn/agilebars-what-it-does), where progress is earned from board
movement rather than reported, and burndown comes out of the plan.

Because it is one codebase and one data model, that hand-off is a setting rather
than a migration — the item scored in Costbars and resourced in Timebars is the
same record the sprint team is working on.

Two things that specifically help in an interrelated systems estate:

**Dependencies are modelled, not remembered.** Predecessors and constraints let you
express that a change to one platform cannot ship before work on another. This is
what stops the classic failure — an agile team delivering on time into an
environment that is not ready, and taking an outage for it.

**Cross-team work stays visible.** When an approved item needs effort from another
team under a different strategy, that effort is an allocation in the same plan,
counted in the same variance row, rather than a favour asked over chat.

## Where AI actually helps

Not in deciding. In removing the drudgery that stops decisions being made at all.

Ask AI drafts business cases, generates resource-loaded project outlines, and
builds risk plans from a description. The realistic value is that it makes the
cost of *putting a proposal into the process properly* low enough that people
actually do it — which is what stops work entering through side doors.

## What this gets you

- A backlog that is sorted by value and deliverability rather than arrival date.
- One capacity picture covering revenue work and internal demand together.
- A defensible answer to "why is my request not being done yet".
- Re-prioritisation that is cheap enough to do every cycle rather than annually.

None of it removes the underlying constraint — you still have more demand than
people. What it removes is the pretence that you do not.
