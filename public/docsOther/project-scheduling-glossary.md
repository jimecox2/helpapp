# Project Scheduling Glossary

Plain definitions of the terms used in project scheduling, resource management
and project portfolio management — the classic critical-path vocabulary, and the
newer language of sprints, capacity and portfolio scoring that sits alongside it.

Terms are alphabetical. Where a word means something specific in the Timebars
suite as well as in general practice, that is said explicitly.

## Actual Cost and Actual Work

What a task has genuinely consumed, as opposed to what was forecast. Most tools
hold both: forecast work against actual work, forecast cost against actual cost.
The difference between them, over time, is what produces a variance report.

## Allocation

A named or generic resource assigned to a piece of work, for a period, at a
percentage of their time. In the Timebars suite an allocation is its own bar
beneath the task, carrying the resource, the percentage, the pay rate and the
calculated hours — which is what lets effort be front-loaded or back-loaded
inside a task without moving the task's dates.

## Backlog

The ordered list of work not yet started. A product backlog spans everything
wanted; a sprint backlog is the subset a team has committed to for one
iteration. Ordering a backlog is a prioritisation decision, not an
administrative one.

## Baseline

A saved snapshot of a plan, kept so that later progress can be compared against
the original commitment. Without a baseline, "are we late?" has no answer —
only the current plan exists, and the current plan always looks achievable.

## Burndown Chart

A chart of work remaining against time for a sprint. Two lines: the planned
diagonal from total work down to zero, and the actual remaining work day by day.
A flat actual line is the signal worth acting on — it means nothing has reached
done for several days.

## Business Case

The argument for doing a project: the problem, the options, the expected
benefit, the cost, and the risk. In portfolio management it is also the input to
scoring, which is why a thin business case tends to produce a low score rather
than a fast approval.

## Capacity Planning

Working out whether the people available can deliver the work committed, usually
by role and by month. Distinct from scheduling: scheduling asks when a task
happens, capacity planning asks whether anyone is free to do it.

## Crashing

A schedule compression approach that adds resources to activities on the
critical path to finish earlier. Crashing adds cost, because the extra labour
and sometimes faster equipment cost money.

## Critical Path

The longest path through the network diagram, and therefore the one that cannot
slip without the project finishing late. There can be more than one, and
activities on it have no float.

## Demand Management

The discipline of receiving, categorising and prioritising requests for work
before they become projects. Usually an intake funnel — a ticket queue, a
request form — feeding a decision process. Without it, work is prioritised by
arrival order or by whoever escalates hardest.

## Discretionary Dependencies

The preferred, rather than required, order of activities — based on best
practice, local conditions or external events. Also called preferential or soft
logic. The reasoning behind them should be written down, because it is not
obvious later.

## Earned Value Management

Measuring progress by the value of work completed rather than by time elapsed or
by self-reported percentages. Progress is *earned* when something verifiable
happens. Applied to agile delivery, this is what lets a board movement rather
than an opinion drive the numbers.

## Early Finish

The earliest a project activity can finish. Used in the forward pass to discover
the critical path and the project float.

## Early Start

The earliest a project activity can begin. Used in the forward pass to discover
the critical path and the project float.

## Fast Tracking

A schedule compression method that changes the relationship between activities
so work normally done in sequence overlaps instead. Achieved by changing
finish-to-start relationships to start-to-start or finish-to-finish, or by adding
lead time. It adds risk.

## Finish-to-Finish

An activity relationship requiring the current activity to finish before its
successor can finish.

## Finish-to-Start

An activity relationship requiring the current activity to finish before its
successor can start. The most common relationship type.

## Fragnet

A fragment of a project network diagram, often used for an outsourced portion of
a project, repetitive work, or a subproject. Also called a subnet.

## Free Float

The time a single activity can be delayed without affecting the early start of
the activity immediately following it.

## FTE

Full-Time Equivalent — one person working full time for the period in question.
The unit that makes capacity comparable across people, roles and months. In the
Timebars supply and demand grids, hours convert to FTE at eight hours a day
across twenty working days a month.

## Generic Resource

A role or skill used as a placeholder before anyone is named — "senior
integration developer" rather than a person. Generic resources are what make
long-range capacity planning honest: you can state the shape of the need months
out without pretending to know who will be free.

## Hard Logic

Activities that must happen in a particular order because reality requires it —
the foundation before the framing. Also called a mandatory dependency.

## Internal Dependencies

Dependencies inside the project or the organisation, as opposed to on an outside
party. For example, software must be built before it can be tested.

## Kanban

A workflow method in which work items move through visible stages, with the
board itself carrying the state of the work. Distinguished from a sprint board
by being continuous rather than time-boxed, though the two are often combined.

## Lag Time

Positive time inserted between activities, moving them further apart.

## Late Finish

The latest a project activity could finish without delaying the project. Used in
the backward pass to discover the critical path and the project float.

## Late Start

The latest a project activity can begin without delaying the project. Used in
the backward pass.

## Lead Time

Negative time that allows two activities to overlap where they would ordinarily
be sequential.

## Management Reserve

A percentage of project duration or budget held back to absorb lateness. When
activities run late, the lateness is drawn from the reserve rather than
immediately moving the end date.

## Mandatory Dependencies

The natural order of activities, where one genuinely cannot begin until another
is complete. Also called hard logic.

## Milestone

A point in a schedule with no duration, marking that something has been reached
— a gate, a delivery, an approval. Milestones are what stakeholders track when
they do not want the detail.

## Named Resource

An actual person in the resource pool, as opposed to a generic role placeholder.
Named resources are what turn a capacity estimate into a schedule somebody can
be held to.

## Overallocation

A resource committed beyond their available capacity in a period — the same
person promised to two projects at once. Overallocation discovered during
delivery is a crisis; discovered during planning it is a decision.

## Percent Complete

How much of a task is done, expressed as a proportion. The weakness of the
measure is that it is usually self-reported and therefore not comparable between
tasks. Deriving it instead — from work done against work planned, or from a
workflow stage — makes totals meaningful.

## Planning Package

A work breakdown structure entry below a control account and above the work
packages, signalling that more planning is still required for that deliverable.

## Portfolio

The full set of projects and programmes an organisation is running or
considering, viewed together so they can be compared, funded and balanced
against one another rather than approved one at a time.

## Precedence Diagramming

A network diagram showing activities as nodes and the relationships between
them. Predecessors come before the current activity; successors come after.

## Project Float

The total time a project can be delayed without passing the completion date the
customer expects.

## Project Network Diagram

A visualisation of the flow of project activities and their relationships to one
another.

## Project Portfolio Management

Often shortened to PPM. Choosing which projects to run, in what order, with what
resources — and stopping the ones that no longer earn their place. Distinct from
project management, which is concerned with delivering a project well rather
than with whether it should exist.

## RAG Status

Red, amber, green — a traffic-light summary of a project's health. Useful as a
prompt for a conversation, unreliable as a measurement, because the colour is
usually chosen rather than calculated.

## Report Date

The date a status is taken as at, also called the status date. It is what makes
a progress report reproducible: asked again next month, the same question about
the same date gives the same answer. Scheduling engines compare work against the
report date rather than against today, which is why setting it before recording
progress matters.

## Resource Levelling

Adjusting a schedule so that resource demand fits within available supply,
usually by moving work rather than by adding people. At portfolio level the
question changes from "when can this person do this task" to "which combination
of project start dates keeps demand inside supply".

## Resource Pool

The central list of people and generic roles available to be scheduled, with
their availability, skills, rates and start and leave dates. One pool shared
across projects is what makes overallocation visible; separate pools per project
guarantee it stays hidden.

## ROM Estimate

Rough Order of Magnitude — an early, deliberately approximate cost or effort
estimate, produced before enough is known for precision. Its purpose is to
support a go or no-go decision, not to be held to.

## Scrum

An agile framework in which a cross-functional team delivers work in fixed
iterations called sprints, with defined roles and ceremonies. One of several
agile approaches, and the most commonly adopted.

## Soft Logic

Activities that do not have to happen in a specific order, where the sequence is
a choice rather than a constraint. Also called discretionary dependency.

## Sprint

A fixed, repeating period — commonly two or four weeks — in which a team commits
to a set of work and delivers it. The fixed length is the point: it makes
velocity measurable and therefore makes future capacity predictable.

## Start-to-Finish

An activity relationship requiring an activity to start before its successor can
finish. The rarest of the four relationship types.

## Start-to-Start

An activity relationship requiring the current activity to start before its
successor can start.

## Story Point

A relative measure of effort used instead of hours, sized by comparison with
other work rather than by estimating duration. Points work within a team and do
not transfer between teams, which is why converting them to money always needs a
human decision.

## Subnet

A representation of part of a project network diagram, used for outsourced work,
repetitive work or a subproject. Also called a fragnet.

## Supply, Demand and Variance

The three figures a capacity view rests on. Supply is what the resource pool can
provide in a period; demand is what the committed work requires; variance is the
difference. Persistent negative variance is not a scheduling problem to be
solved by cleverness — it is a hiring, descoping or timeline decision.

## Template

A previous project adapted for a current one, or a form pre-populated with
organisation-specific information.

## Time-Phased

Spread across time rather than held as a single total. A time-phased estimate
says not only how much work a task needs but when that work falls, which is what
makes capacity forecasts and burndown charts possible.

## Total Float

The total time an activity can be delayed without delaying project completion.

## Velocity

The amount of work a team completes in a sprint, measured in points or hours.
Tracked across several sprints it becomes the basis for planning how much to
commit to next — which is its only real purpose.

## Work Breakdown Structure

Often shortened to WBS. A hierarchical decomposition of a project into
progressively smaller pieces, ending in work packages. It defines scope: if it
is not in the WBS, it is not in the project.

## Work Package

The smallest item in the work breakdown structure — the level at which work is
assigned, estimated and tracked.
