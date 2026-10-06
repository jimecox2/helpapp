# When the Sprint Report and the Project Schedule Disagree

The sprint team publishes a burndown and a board full of moved cards. The
project manager maintains a schedule with dates, durations, hours, costs and a
milestone the business is holding them to.

Both describe the same work. They rarely agree, and when they don't, the steering
pack has to pick one — usually whichever the person assembling it trusts more.

That is not a reporting failure. It is four gaps between the two, and each one is
fixable.

## Gap one: different units

The team reports in story points and velocity. The schedule needs hours, dates
and cost, because that is what a business case, a resource plan and a forecast
are made of.

Nothing converts one into the other reliably, so the project manager re-estimates
in their own units. From that moment there are two forecasts, maintained by two
people, drifting apart at whatever rate the sprint changes.

## Gap two: different cadence

A board is a picture of **now**. A project schedule is measured against a
**report date** — the date the status was taken — which is what makes a status
pack reproducible a month later.

Ask a board "where were we on 31 March" and it cannot answer. It only knows where
the cards are today. So the historical position gets reconstructed from memory,
or from whatever the last pack happened to say.

## Gap three: different systems

The team's tool and the PM's schedule are separate databases. Progress crosses
that boundary by somebody typing it in, weekly, under time pressure.

Every re-entry is a chance for the two to diverge, and the person doing it is the
single point of failure for portfolio reporting.

## Gap four: percentages are opinions

Somebody is asked what percent complete their task is. They say seventy. Seventy
against what? Against their own mental model, which differs from their
colleague's and was optimistic the last four times.

The number is not dishonest. It is simply not comparable to any other number in
the sprint, so summing them produces something that looks like data.

---

## How the suite closes all four

### The sprint task is the schedule task

Agilebars shows the **Project and its Tasks** — L2 and L4 of the same hierarchy
the project schedule uses. It is not an integration or a nightly sync. The card
the team drags and the task the PM schedules are one record.

That removes gap three outright. There is no boundary, so there is nothing to
re-enter and nothing to reconcile.

### Progress is earned, not stated

Nobody types a percentage. Each lane transition earns a fixed amount:

| Lane | The question at standup | Earns | Records |
|---|---|---|---|
| Backlog | — | — | — |
| Will Do | Committed to this sprint? | 0% | — |
| Doing | Has it started? | 25% | actual start |
| Finalizing | Is the build done and in review? | 75% | — |
| Done | Is it accepted? | 100% | actual finish |

Three yes-or-no questions, and every task in the sprint is measured the same way.
Move a card back because a defect appeared and the progress reverses correctly.

Because that percentage lands on the shared task, it is the same percentage the
schedule rolls up to the project and the portfolio. The team does not report
progress to the PM. The PM is reading the team's board.

That closes gap four, and it closes gap one for everything except sizing — see
the honest limits below.

### One report date for both

This is the part most people miss, and it is what closes gap two.

**Set the Report Date before you move cards.** The actual start and actual finish
stamped by a lane transition use that date, not today's — so if you take
Thursday's standup on Friday morning, Thursday is what gets recorded.

It is also the date the project schedule calculates against. Work ahead of it is
forecast, work straddling it is actuals plus remaining, work behind it is
complete. One date drives both engines.

The consequence is the one that matters at a steering meeting: ask "where were we
on 31 March" and the board and the schedule give the same answer, because they
were both measured against 31 March.

### The pack assembles itself

Task progress rolls up to the project and the portfolio automatically. Costs and
hours roll up from the allocations on the schedule side. Publish a snapshot and
the dashboards read it.

Nobody spends Friday afternoon building the number, which means nobody can build
it differently from last week.

## The one habit this requires

Set the Report Date on every day you move bars into Doing, Finalizing or Done,
and set it to the date the progress actually happened rather than the date you
are entering it.

That is the whole discipline. Skip it and the actual dates drift to whenever the
PM did the admin, which reintroduces gap two by the back door.

## What this does not fix

**Sizing is still yours.** The engine earns progress against the size you gave a
task. If the estimates are poor, the burndown is confidently wrong. Size each
item with the person who will do it, and keep the units consistent across the
sprint — all hours or all points, not a mix.

**Points do not become hours by themselves.** If the business case is in money and
the team plans in points, somebody still has to hold the conversion. What the
suite guarantees is that both sides are describing the same tasks at the same
dates, not that they are denominated in the same currency.

**Resource detail lives on the schedule side.** Agilebars has no allocation level,
so who is assigned and at what rate sits at L5 in Timebars. Task progress is
shared; resource cost is not something a sprint board carries.

**Cross-team dependencies still need modelling.** A board will happily show a team
delivering on time into an environment that is not ready. Those belong on the
schedule as predecessors, where they are visible.

## Related

If the disagreement is about **capacity** rather than progress — agile teams and
scheduled programmes competing for the same people — see
[agile and waterfall against one resource pool](/learn/blog-agile-and-resource-management-is-there-an-conflict).
For how the record survives the whole journey from approval to delivery, see
[the data you lose between approval and delivery](/learn/from-business-case-to-sprint).
For what Agilebars does in full, see
[the product page](/learn/agilebars-what-it-does).
