# Understanding Agilebars Timescale and Kanban Integration


Agilebars provides dual project management perspectives—Timescale and Kanban views—that work in tandem to streamline task scheduling, progress visibility, and resource planning.

## How The Two Modes Work Together

The Timescale and Kanban views share the same underlying data, ensuring that changes made in one view are immediately reflected in the other:

- When you drag a task bar on the Timescale, its position on the Kanban board updates automatically
- When you move a task between lanes on the Kanban board, its dates and progress on the Timescale update to match

This integration allows you to use whichever view best suits your current need while maintaining complete data consistency. [Understand how data is structured](https://www.timebars.com/knowledgebase/helparticles/common-03-data-structure-user-guide)


## Kanban View Organization

The Kanban board features four main lanes, plus a specialized "Finalizing" sublane:

1. **Backlog (Lane 0)**: Tasks that are planned but not yet ready to be worked on
2. **Will Do (Lane 1)**: Tasks that are scheduled and ready to begin
3. **Doing (Lane 2)**: Tasks that are currently in progress (25% complete)
4. **Finalizing (Sublane 2.75)**: Tasks that are nearly complete (75% complete)
5. **Done (Lane 3)**: Tasks that are 100% complete

[Explore Agilebars Kanban features](https://www.timebars.com/knowledgebase/helparticles/agilebars-user-guide)

## Progress Calculation in Each View

### Kanban Board Progress

Each lane on the Kanban board corresponds to a specific progress percentage:

- **Backlog/Will Do**: 0% complete, no actual hours logged
- **Doing**: 25% complete, actual start date set to status date
- **Finalizing**: 75% complete, actual start date set, approaching completion
- **Done**: 100% complete, both actual start and finish dates are set

# How to Analyze the Sprint Burndown Chart

Analyze the sprint burndown to understand current status or progress to date, and you’ll be able to estimate when the project will be complete. Also analyze the sprint burndown to improve the planning of future sprints in Agile product development. The sprint burndown graph captures planned hours from the project plan and calculated actual hours from the progress reported by team members. In simple terms you are continually calculating the work remaining in a sprint over time.

## Sprint Burndown Analysis Requirements

To analyze sprint burndown, you must have:

* Sprint Backlog linked to your organization's backlog
* Defined sprint timeframe
* Task estimates (sizing)
* Actual progress updates from team members
* Current burndown graph data

## Sprint Burndown Scenarios

Burndown analysis is based on sizing assigned at sprint start.

### Actual Hours Exceed Planned Hours

**Indicator**: Actual hours remaining line is above and increasing distance from ideal line.

**Meaning**: Backlog items were overestimated; some won't complete in the current sprint.

**Action**: Move incomplete items to the next sprint and reprioritize.

**Possible causes:**
* Underestimated item complexity
* Unforeseen issues or blockers
* External team dependencies

### Actual Hours Match Planned Hours

**Indicator**: Actual hours remaining line overlaps ideal line.

**Meaning**: Estimates are accurate; planned work will complete as scheduled.

**Insight**: Team demonstrates consistent estimation accuracy for sprint planning.

### Actual Hours Are Less Than Planned

**Indicator**: Actual hours remaining line is below and increasing distance from ideal line.

**Meaning**: Backlog items completed early; team has capacity for additional work.

**Action**: Collaborate with product owner to pull next priority items.

**Possible cause**: Underestimated task complexity; planned more time than needed.

---

## Timescale Progress Calculation

Progress is determined by a task's position relative to the status date (vertical timeline marker):

* **Not started** (right of status date): 0% complete
* **In progress** (crosses status date): Percentage based on elapsed duration
* **Completed** (left of status date): 100% complete


## Key Scenarios and Behaviors

### Scenario 1: Moving Tasks on the Timescale

When you drag a task on the Timescale, its dates and progress are recalculated based on its new position relative to the status date:

- **Moving a task to start before and end after the status date**: The task becomes "in progress" with a percentage complete based on elapsed time. Its Kanban position will update to either the Doing or Finalizing lane depending on the calculated percentage.

- **Moving a task completely before the status date**: The task becomes 100% complete, and automatically moves to the Done lane in the Kanban board.

- **Moving a task completely after the status date**: The task is reset to 0% progress, but its Kanban lane position doesn't change automatically.

### Scenario 2: Moving Tasks on the Kanban Board

When you move a task between lanes on the Kanban board:

- **Moving to Backlog or Will Do lanes**: Progress is reset to 0%, actual dates are cleared.

- **Moving to Doing lane**: The task is set to 25% complete, actual start date is set to the status date, and forecast finish date is adjusted accordingly.

- **Moving to Finalizing sublane**: The task is set to 75% complete, with dates adjusted to reflect this progress.

- **Moving to Done lane**: The task is set to 100% complete, actual finish date is set to the status date, remaining duration becomes 0.


### Scenario 3: Updating the Status Date

When the status date is updated (either through the admin panel or by using the current date):

- All in-progress tasks will be recalculated based on the new status date
- Tasks that now fall completely before the status date will be marked as complete
- Tasks that now fall completely after the status date will be reset to 0% progress

## Working with Durations and Hours

### Duration Calculation

Task durations are always calculated in working days, automatically excluding weekends and holidays:

- When resizing a task on the Timescale, its duration is recalculated based on working days
- If a task spans a weekend or holiday, these non-working days don't count toward the duration
- All dates (start, finish, etc.) will automatically adjust to fall on working days

### Hours and Costs

The system maintains four key metrics for each task:

1. **Forecast Hours**: The total estimated hours for the task
2. **Actual Hours**: Hours already spent (calculated based on % complete)
3. **Remaining Hours**: Hours left to complete (Forecast - Actual hours)
4. **Percent Complete**: Derived from actual hours / forecast hours

Costs follow the same pattern and are calculated based on hours.

## Fixed Sizing vs. Flexible Sizing

The system can operate in two modes:

- **Fixed Sizing**: The forecast hours never change when a task is resized or progress is updated. Only actual and remaining hours are recalculated.

- **Flexible Sizing**: The forecast hours can increase or decrease when a task's duration changes (e.g., when resizing a task).


## Tips for Effective Use

- **Use the Timescale view** for detailed scheduling, adjusting dates, and visualizing the project timeline
- **Use the Kanban board** for quick progress updates and workflow management
- **The status date** is your reference point for all progress calculations - keep it updated
- **Finalize tasks** using the specialized lane when they're nearly complete to better track closing efforts
- **Resize tasks** on the Timescale to adjust their duration as estimates change

By understanding the integration between these views, you can take full advantage of this tool to manage your agile projects efficiently and with maximum visibility.

[Learn about our product innovations](https://www.timebars.com/knowledgebase/helparticles/common-01-innovations-by-timebars-ltd)

[See the Common User Interface Guide](https://www.timebars.com/knowledgebase/helparticles/common-02-user-interface-guide)
