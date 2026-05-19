# PPM Resource Supply and Demand Techniques

## Forecasting the Project Pipeline: A Quarter-by-Quarter View

Portfolio managers operate at a different altitude from resource managers. Where the resource manager is resolving today's allocation conflicts on active projects, the portfolio manager is asking: which projects can we commit to starting next quarter — and which must wait? The answer depends on a single supply-and-demand equation applied at role level, across all active and planned projects, looking 12 months or more ahead.

Costbars provides the analytical engine for portfolio-level planning: the Supply vs. Demand Grid, the Five-Step PPM Process, and the Balanced Scorecard. Together these tools allow the portfolio manager to run the entire annual planning cycle with confidence, matching project commitments to the organisation's real resource capacity.

This approach acknowledges different levels of detail across the planning hierarchy. Resource Managers can use Timebars to manage inflight projects at whatever granularity suits their operational needs. Portfolio Managers, however, require a more structured view for future or not-yet-started projects—one defined by roles and required quantities rather than individual resource assignments. Costbars bridges this gap, enabling portfolio-level decisions on resource allocation without requiring the tactical detail that Timebars handles.

---

## The Portfolio Manager's Starting Point: Defining Available Supply

Supply at portfolio level is defined in the **Resource Pool** as total FTE capacity by role. For example:
- 2 × Developer (each at 1.0 FTE)
- 2 × HR SME (each at 1.0 FTE)
- 2 × Tester (each at 1.0 FTE)

![Supply vs. Demand Grid](../images/costbars/resource-pool-supply.png)

…means the organisation's annual supply budget is 8 FTE-years of Senior Developer time, 4 FTE-years of Business Analyst time, and so on. The **Supply (FTE)** row in the Supply vs. Demand Grid distributes this capacity across the year by month.

**Generic resources** are the primary vehicle for portfolio-level demand forecasting. Rather than assigning specific individuals to projects that have not yet started, the portfolio manager assigns generic resources by role (e.g. "Senior Developer × 2") to each planned project's task structure. This creates a demand profile for the project without requiring named assignments — which are made at execution stage in Timebars, once the project is formally approved and resourced.

See the [Supply and Demand Grids User Guide](https://www.timebars.com/knowledgebase/helparticles/common-11-supply-and-demand-grids-user-guide) and the [Costbars User Guide](https://www.timebars.com/knowledgebase/helparticles/costbars-user-guide) for detailed configuration instructions.

---

## Reading the Supply vs. Demand Grid: The Portfolio View

In Costbars, configure the Supply vs. Demand Grid as follows for portfolio planning:

- **View: Monthly** — to see demand by calendar month, making it straightforward to read in quarters (Jan–Mar = Q1, Apr–Jun = Q2, etc.)
- **Group By: Role** — to aggregate supply and demand at role level across all projects in the portfolio simultaneously

This gives the portfolio manager the year at a glance, role by role. The three critical rows:

| Row | Colour | What It Shows |
|-----|--------|---------------|
| **Supply (FTE)** | Blue | Total role capacity available each month |
| **Demand (FTE)** | Green | Total FTE demanded from all active and pipeline projects |
| **Variance (S−D)** | Yellow | Remaining headroom. Positive = capacity to accept more projects. Negative = overcommitted. |

The **Variance row** is the decision gate. A project can only start when the Variance is non-negative across the roles it requires, for the full duration it needs them. If the Variance is negative for any critical role during the proposed project window, that project cannot start at the planned date without deferring something else.

### Reading the Year by Quarter

With monthly data visible, the portfolio manager reads each quarter as a planning block:

| Quarter | Months | Planning Question |
|---------|--------|------------------|
| Q1 | Jan–Mar | Which projects are ramping up? Is supply sufficient to start them simultaneously? |
| Q2 | Apr–Jun | Are Q1 project demands easing, freeing capacity for new starts? |
| Q3 | Jul–Sep | Where are the mid-year bottlenecks by role? Which pipeline projects are viable? |
| Q4 | Oct–Dec | Which projects scheduled for year-end have realistic resource availability? |

---

## The Five-Step PPM Process in Costbars

Costbars organises portfolio management into a structured **Five-Step PPM process**. Resource leveling is the third step, but it is informed by everything that precedes it.

### Step 1: Prioritise — Generate Strategic Value (SV) Scores

Before any resource conversation, projects are ranked by strategic value. The **SV Score** is calculated from four strategic dimensions configured by the organisation (e.g. strategic alignment, financial return, regulatory compliance, market opportunity). Projects with higher SV scores take priority in the resource allocation queue.

This matters directly for supply and demand: when the Variance is negative and something must give, the lower-SV project is always deferred, not the higher one. SV scoring makes that decision defensible and transparent.

### Step 2: Score — Generate Ability to Execute (AE) Scores

The **AE Score** (Ability to Execute) assesses each project's delivery feasibility — including whether the resources required to deliver it are realistically available. Projects with low AE scores, particularly those flagged for resource unfeasibility, are strong candidates for deferral before they even enter the resource leveling step.

The **Project Assessment Tool** supports this step by providing a structured evaluation framework where resource availability is one of several scored dimensions. Running this assessment for every proposed project before including it in the supply/demand analysis prevents the grid from being cluttered with projects that are never going to be resourceable at any point in the year.

### Step 3: Level Resources — The Core Portfolio Planning Activity

**Resource Leveling** is where the portfolio manager makes concrete scheduling decisions based on the Supply vs. Demand Grid. The process:

1. Load all active and pipeline projects into the grid.
2. Set the view to **Monthly, Group By Role**.
3. Identify demand peaks — months where the Variance row goes negative for one or more roles.
4. For the lowest-priority project(s) contributing to the overloaded period, **move their start date later**. The demand profile shifts with the project, relieving the peak.
5. Repeat until the Variance row is non-negative across the entire planning horizon.

This is **what-if scenario planning** in practice. Costbars allows the portfolio manager to move project start dates and immediately see the updated Variance row — no commitment is made until the portfolio manager is satisfied with the leveled schedule.

The output of Step 3 is a set of **committed project start and finish dates** that fit within the organisation's resource supply, quarter by quarter.

### Step 4: Select — The Bubble Chart

With the resource-leveled schedule confirmed, the **Bubble Chart** provides a visual project selection view. Each project is plotted on two axes:

- **X-axis** — Strategic Value (SV Score)
- **Y-axis** — Ability to Execute (AE Score)

The chart divides into four quadrants. Projects in the upper-right quadrant (high SV, high AE) are the priority investments. Projects in the lower-left (low SV, low AE) are candidates for cancellation or indefinite deferral. The Bubble Chart makes the selection decision transparent and defensible for executive audiences.

### Step 5: Balance — The Balanced Scorecard

After selection, the **Balanced Scorecard** validates that the portfolio as a whole is strategically balanced across four dimensions:

- **Strategic alignment** — are selected projects aligned to the organisation's stated objectives?
- **Risk balance** — is the portfolio appropriately spread across risk levels?
- **Investment mix** — are different investment categories (run/grow/transform) represented in the right proportions?
- **Timeline distribution** — are projects spread sensibly across the planning year, rather than all starting in the same quarter?

The Balanced Scorecard is particularly important after resource leveling, because leveling can inadvertently cluster projects into the same quarter. The scorecard surfaces a lopsided timeline distribution immediately, prompting further adjustment.

See the [Costbars Specific Functionality](https://www.timebars.com/articles/costbars-specific-functionality) article and the [Costbars User Guide](https://www.timebars.com/knowledgebase/helparticles/costbars-user-guide) for a detailed walkthrough of all five steps.

---

## Named vs. Generic Resources at Portfolio Level

At pipeline planning level, the portfolio manager works almost exclusively with **generic resources**. Specific people have not yet been assigned to projects that start in Q3 or Q4. Generic resources allow the portfolio manager to:

- Create a demand profile for each pipeline project based on the roles it will require
- Assess whether enough of each role is available across the year before committing to a start date
- Make go/no-go scheduling decisions without waiting for named assignments

When a project moves from pipeline to active execution in Timebars, generic resource allocations are replaced by named resources — real individuals from the Resource Pool assigned to specific tasks. The Supply vs. Demand Grid in Timebars then shows named utilisation for active projects while Costbars continues to show generic demand for upcoming ones.

This two-layer model — **generic at portfolio, named at execution** — allows the portfolio manager and the resource manager to work simultaneously from the same data without conflict. See [Resource Management Techniques](https://www.timebars.com/articles/resource-management-techniques) for how the resource manager handles the named/in-flight side of this picture.

---

## Common Annual Demand Patterns

Some patterns the portfolio manager will encounter regularly in the Supply vs. Demand Grid:

**Q1 overload, Q3 headroom** — projects launched in the previous year are all in full execution simultaneously in Q1, consuming maximum capacity. By Q3, completions free up significant FTE. New Q3 or Q4 starts are viable; Q2 starts are not without deferring existing work.

**Role-specific bottleneck** — the Variance for Senior Developer is negative throughout Q2–Q3, while Business Analyst has positive variance in the same period. The constraint is in development, not analysis. Projects requiring heavy development must be pushed to Q4; analysis-heavy projects could start earlier.

**Demand cliff at year-end** — multiple projects are scheduled to close simultaneously in Q4, creating a sudden demand drop. This is an opportunity to bring forward a lower-priority project that was previously deferred, capturing freed capacity before it dissipates into the new year.

**Persistent role gap** — a particular role shows negative Variance across multiple quarters with no path to leveling by rescheduling alone. This is a resourcing escalation signal: the organisation needs to hire, contract, or reduce scope for that role-type across the portfolio.

---

## The Project Assessment Tool: Pre-Screening for Resource Feasibility

Before a project enters the formal leveling process, the **Project Assessment Tool** in Costbars provides a structured feasibility check. One of its scored dimensions is resource availability — specifically whether the roles and quantities required by the project exist in the pool in sufficient FTE during the proposed delivery window.

Projects that score poorly on resource feasibility at this stage should be flagged before the resource leveling exercise. Including unresourceable projects in the leveling run wastes planning time and distorts the grid, making it harder to identify which constraints are real.

---

## Portfolio Status Report and Cloud Dashboard

The **Portfolio Status Report** in Costbars generates a comprehensive executive summary of the portfolio, including resource utilisation, project health indicators, and strategic alignment metrics. It is the standard deliverable for monthly or quarterly portfolio review meetings.

The **Cloud Dashboard** allows the portfolio manager to publish the Supply vs. Demand Grid, Bubble Chart, and Balanced Scorecard as a shared, live view for executives and steering committees — without requiring them to log in to the application. For organisations using both products, the in-flight resource picture from Timebars and the pipeline forecast from Costbars can be published to the same dashboard, giving executives a single consolidated source of truth.

See the [Cloud Publishing Guide](https://www.timebars.com/knowledgebase/helparticles/common-07-cloud-publishing-guide), [Enterprise Dashboard Guide](https://www.timebars.com/knowledgebase/helparticles/common-09-enterprise-dashboard-guide), and the [Portfolio Status and Balancing Report](https://www.timebars.com/knowledgebase/helparticles/costbars-ppm-portfolio-status-and-balancing-report) help article for details.

---

## Text Notifications and Executive Alerts

For portfolios with aggressive timelines or high-risk projects, Costbars supports **Text Notifications** (SMS alerts) that fire when specific thresholds are breached — for example, when a key role's Variance drops below a defined level, or when a high-priority project's health indicator turns red. This transforms the Supply vs. Demand Grid from a passive reporting tool into an active early-warning system.

See the [Costbars Executive Notification and Alert Hub](https://www.timebars.com/articles/costbars-executive-notification-and-alert-hub) article for configuration details.

---

## Connecting Costbars to Timebars: The Execution Handoff

The Costbars pipeline forecast and the Timebars in-flight execution view are two phases of the same resource management cycle:

1. **Costbars** establishes committed project start and finish dates through the Five-Step PPM process, based on generic resource demand vs. role supply.
2. Projects move from pipeline to active when their committed start date arrives.
3. **Timebars** takes over: generic allocations are replaced by named resources, and the resource manager begins managing day-to-day allocation conflicts using the Supply vs. Demand Grid at the individual level.
4. The Costbars grid continues to update as projects complete in Timebars, showing the resulting demand reduction and the headroom it creates for the next pipeline projects.

This closed loop ensures that portfolio planning decisions are grounded in real execution data, and that execution-level resource conflicts which cannot be resolved locally are escalated to portfolio level where project start dates can be adjusted.

---

## Summary: The Portfolio Manager's Quarterly Workflow

| Step | Tool | Purpose |
|------|------|---------|
| Pre-screen pipeline projects | Project Assessment Tool | Filter out unresourceable projects before leveling |
| Score SV and AE | Costbars Steps 1 & 2 | Rank projects by strategic priority and feasibility |
| Load Supply vs. Demand Grid | Grid, Monthly, Group By Role | Visualise full-year demand profile by role |
| Identify demand peaks by quarter | Grid — Variance row | Find when and where capacity is overcommitted |
| Adjust start dates (what-if) | Grid — project date controls | Level the schedule within available supply |
| Commit project start/finish dates | Step 3 output | Lock the leveled pipeline |
| Select projects via Bubble Chart | Costbars Step 4 | Validate selection with SV/AE visualisation |
| Validate portfolio balance | Costbars Step 5 — Balanced Scorecard | Check strategic, risk, investment, and timeline balance |
| Generate Portfolio Status Report | Reports — Portfolio Status Report | Executive review deliverable |
| Publish to Cloud Dashboard | Cloud Publishing | Share the pipeline forecast with stakeholders |

---

## Related Articles

- [Costbars Specific Functionality](https://www.timebars.com/articles/costbars-specific-functionality)
- [Costbars Benefits and Features](https://www.timebars.com/articles/costbars-benefits-and-features)
- [Costbars: How to Design a PPM Process](https://www.timebars.com/articles/costbars-how-to-design-a-ppm-process)
- [Costbars: Solving Problems with Our Project Pipeline Scheduler](https://www.timebars.com/articles/costbars-solving-problems-with-our-project-pipeline-scheduler)
- [What Is a Balanced Project Portfolio Process](https://www.timebars.com/articles/what-is-a-balanced-project-portfolio-process-for-a-typical-organisation)
- [Resource Management Techniques](https://www.timebars.com/articles/resource-management-techniques)
- [PPM Compliance Rules](https://www.timebars.com/articles/ppm-compliance-rules)

---

## Original Content (Legacy Reference)

### Assign Resources to Projects
With the resource pool in place, you can assign resources to individual projects in Microsoft Project Server. This allows you to allocate resources based on their availability, skills, and other attributes captured in the metadata.

Monitor Resource Utilization: Continuously monitor and update resource utilization. Keep track of resource allocations, remaining availability, and any changes in their metadata or custom field values. 

### Resource allocation
Project managers can assess the supply and demand of resources by reviewing the availability column in the resource pool board. They can assign resources based on their skillset, location, and availability, ensuring that the right resources are allocated to the right projects. 

### Filtering and sorting
Monday.com provides filtering and sorting options, allowing managers to filter resources by role, skill, location, or availability. This helps in identifying the resources that match specific project requirements and optimizing resource allocation. 

### Capacity planning
Resource managers can use the resource pool board to analyze resource availability across different projects and timeframes. They can identify periods of high or low demand and make informed decisions regarding resource allocation or hiring. 

### Detecting Overallocated Resources 
Workload overview: Monday.com offers various views, such as Gantt charts or timeline views, to visualize resource allocation across projects. These views help project and resource managers identify instances where a resource may be assigned to tasks that exceed their available hours. 

### Resource utilization reports
Utilize the reporting and analytics features within Monday.com to generate reports on resource utilization. These reports can highlight instances where a resource's allocated hours exceed their available capacity, indicating overallocation. 
