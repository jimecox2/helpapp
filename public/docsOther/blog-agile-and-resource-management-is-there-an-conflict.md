# Agile and Waterfall Against One Resource Pool

Most organisations do not get to choose one methodology. The product teams run
sprints. The infrastructure programme, the regulatory work and the customer
implementations run to plans with dates and dependencies. Both draw on the same
people.

The conflict this creates is usually described as cultural — agile people and
waterfall people not getting along. It is not. It is arithmetic, and it comes
from one specific mismatch.

## The problem is the planning horizon, not the methodology

**Agile plans capacity one sprint at a time.** That is by design and it works well
inside the sprint: the team knows its velocity, sizes the work, and commits. What
it does not produce is a forward demand curve. Ask an agile team what capacity
they will need in five months and the honest answer is that the framework does
not ask that question.

**Waterfall plans months out.** A resourced plan says which skills are needed, in
what volume, in which week, for the next two or three quarters.

Put both against one pool of people and you get a demand picture that is precise
for the next four weeks and blank after that — for exactly the people the
long-range plan is counting on.

## What actually happens in the gap

Nobody plans the gap, so it gets filled informally:

- **Allocation by gut feel.** The resource manager assigns people to teams based on
  a sense of where the pressure is.
- **Allocation by volume.** Whoever escalates hardest gets the developer. This is
  not anybody behaving badly; it is the only signal available.
- **Double-counting.** A named person sits in a sprint team *and* on a project
  plan, each owner believing they have most of that person's time.
- **Discovery at the worst moment.** The clash surfaces when the sprint commitment
  and the project milestone land in the same fortnight.

And the corrective conversation is hard to have, because the two sides do not
share a unit. One is talking in story points per sprint, the other in
person-hours per week.

## Put both kinds of demand in one pool

The fix is not to make the agile teams plan like a waterfall programme, or to
force the programme into sprints. It is to represent both in the same capacity
model, in the same unit, and let the variance row tell the truth.

**Model an agile team as standing capacity, not as tasks.** You do not need to
forecast individual user stories six months out — that would be a fiction anyway.
What you can state is that the platform squad consumes six FTE of senior backend
and two of QA, every month, indefinitely. That is a standing allocation, and it
is accurate.

**Plan by role, not by name, past the near horizon.** Generic resources — "senior
integration developer", "test automation engineer" — carry the forward demand.
Named people replace them as work firms up. This is what lets you plan capacity
by skillset for next year without pretending to know who will be on which squad.

**Use one unit for the comparison.** FTE per month is the one that works across
both, because it maps onto an agile team's monthly cadence and onto a plan's
staffing profile. Switch to hours and weeks when you need the detail on the
scheduled side.

**Then read the variance.** Supply is what you have, accounting for availability,
joiners and leavers. Demand is everything — sprint capacity and project
allocations together. Variance is the difference, by role, by month. Negative
variance on senior backend in Q3 is a fact both sides can act on, and neither can
argue with.

## What this gives each side

**The agile teams get protected.** Their standing capacity is visible in the model,
so project demand cannot quietly erode it. A programme that needs two of their
developers in March has to show up in the variance row and ask for them.

**The programme gets a real forecast.** It can see which months are feasible before
committing dates, rather than finding out in delivery.

**The resource manager gets a defensible answer.** "We are four senior developers
short in Q3 across everything we have committed" is a hiring conversation. "The
teams feel stretched" is not.

## The honest limits

Three things worth saying plainly.

**This does not make agile teams estimate further out.** It models their capacity,
not their backlog. That is the point — the capacity is stable even when the
contents are not.

**Standing allocations need maintaining.** When a squad changes shape, somebody has
to update it. It is a monthly habit, not a one-off exercise.

**Negative variance is still negative variance.** Seeing it in a grid does not
create capacity. It moves the decision — hire, descope, or move the date — to
someone with the authority to make it, before the clash rather than after.

## Where the products fit

[Timebars](/learn/timebars-what-it-does) holds the pool and the supply, demand and
variance grids, with generic and named resources, grouped by role, weekly or
monthly. [Agilebars](/learn/agilebars-what-it-does) runs the sprint execution, on
the same data model, so a team's work is not in a separate system from the
capacity model that accounts for it. [Costbars](/learn/costbars-what-it-does)
levels demand at the portfolio level, before anything is committed.

If this sits inside a larger backlog problem — hundreds of intake requests across
both delivery styles — start with
[hundreds of requests, one delivery team](/learn/the-it-demand-backlog-problem).
