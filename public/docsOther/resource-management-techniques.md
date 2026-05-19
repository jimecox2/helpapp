# Resource Management Techniques

## Managing Competing Demand Across In-Flight Projects

Resource managers face a specific operational challenge: every project manager wants more of the same people, and most of them want them at the same time. Without a consolidated cross-project view of who is allocated to what, the resource manager is forced to negotiate in the dark — relying on spreadsheets, emails, and memory. Timebars solves this by providing a live, cross-project visibility layer over the entire resource pool, so supply and demand imbalances surface before they become crises.

---

## Building the Resource Pool: Defining Your Supply

The **Resource Pool** is the foundation of all resource analysis in Timebars. It is the authoritative register of every person and role-based capacity your organisation has available. Before any project allocation can be assessed for feasibility, the pool must accurately reflect your supply.

Each resource record holds:
- **Name** — the individual's identity for named resources, or a role label for generic resources
- **FTE availability** — the fraction of full-time capacity allocatable (1.0 = full-time, 0.5 = half-time)
- **Metadata fields** — role, skill, location, department, and any custom fields configured via the Picklists and Tagging system

**Named resources** represent specific individuals. **Generic resources** represent a pool of interchangeable capacity in a given role (e.g. "Senior Developer × 3"), useful for projects where specific assignees are not yet confirmed. Keep generic resources in the pool even alongside named assignments — they let you plan forward demand at role level before hiring decisions are made.

See the [Timebars User Guide](https://www.timebars.com/knowledgebase/helparticles/timebars-user-guide#resource-pool-setup) and [Supply and Demand Grids User Guide](https://www.timebars.com/knowledgebase/helparticles/common-11-supply-and-demand-grids-user-guide) for detailed setup instructions.

---

## The Supply vs. Demand Grid: Your Master View

The Supply vs. Demand Grid (Main Menu → People icon → Supply & Demand icon) is the core analytical tool for resource managers in Timebars. It presents a time-phased comparison of your resource supply against the demand placed on it by all active projects simultaneously.
![Supply vs. Demand Grid](../images/timebars/tb-resource-demand-grid2.png)
The grid has five summary rows:

| Row | Background | What It Shows |
|-----|-----------|---------------|
| **Supply (FTE)** | Blue | Total available capacity from the Resource Pool |
| **Demand (FTE)** | Green | Allocated demand from all active project tasks |
| **Variance (S−D)** | Yellow | Supply minus Demand — positive = headroom, negative = overallocation |
| **Month / Week Header** | Gray | Timescale showing the periods covered |
| **Resource / Project / Role Header** | White | Context header based on the current Group By setting |

The Variance row is the resource manager's primary signal. A **positive variance** means capacity is available. A **negative variance** (shown in red) means the resource is overallocated and some project commitments cannot be met simultaneously.

### FTE vs. Hours

The grid toggles between **FTE** and **Hours** mode. FTE is the standard view for portfolio-level conversations ("we need 2.0 FTEs of database architect in Q3"). Hours mode provides the granularity needed when negotiating individual task loads with project managers.

Conversion: FTE × working days in period × hours per working day = hours.

### Weekly vs. Monthly View

- **Monthly view** is the resource manager's primary lens for planning 2–6 months ahead. It smooths day-to-day noise and reveals structural demand patterns by month.
- **Weekly view** is used for near-term firefighting — typically the next 4–8 weeks — where individual task durations and day-by-day gaps matter.

Switch between views using the **Weekly/Monthly toggle** in the grid toolbar.

---

## Group By Options: Three Different Questions

The **Group By** selector reshapes the grid to answer a different management question each time.

### Group By Resource Name
*"Which specific people are overallocated, and on which projects?"*

This is the resource manager's diagnostic view. When a named resource shows a negative variance, expand their row to see every project drawing on their time. You can immediately identify which project is the primary contributor to overallocation and begin the conversation with the relevant project manager.

### Group By Role
*"Is the organisation running short of a particular skill type?"*

When multiple resources share the same role (e.g. "Business Analyst"), Group By Role aggregates their supply and the demand placed on that role across all projects. This reveals structural capacity problems — if all four Business Analysts are simultaneously overallocated across three projects, no individual reassignment will resolve it without a resourcing escalation or a schedule change at portfolio level.

### Group By Project
*"How much resource demand is each project generating, relative to its priority?"*

This view shows which projects are the heaviest consumers. A lower-priority project generating disproportionate demand is a candidate for schedule slippage to free up capacity for higher-priority work.

---

## The Resource Allocator: Assigning and Reassigning

The **Resource Allocator** *(Main Menu → People icon)* is the interactive panel for assigning resources to individual tasks on the timescale canvas. To assign a resource, drag their name from the Allocator panel and drop it directly onto the target task.
![Resource Allocator](../images/timebars/resource-allocator.png)

To check a resource's current availability before assigning them, **double-click their name** in the Allocator — this opens a real-time availability breakdown showing their percent allocated across the full timescale, drawn directly on the canvas.

![Resource Allocator Percent Allocated](../images/timebars/resource-allocator-percent-allocated.png)


When reassigning a resource to resolve an overallocation conflict:

1. Open the Resource Allocator panel.
2. Apply search (role, skill, location, or any custom picklist field) to identify candidates with the right profile and available capacity.
3. Double-click each candidate to verify their availability aligns with the task duration.
4. Assign the replacement and remove the overallocated resource.

The Variance row in the Supply vs. Demand grid updates immediately, confirming the conflict is resolved.

---

## Filtering by Metadata and Picklists

The **Shared Resource Pool** report *(Main Menu → Reports → Shared Resource Pool)* is the full resource pool view, supporting filtering by any metadata field configured in the system. Common filter dimensions:

- **Role** — find all Senior Developers, Business Analysts, QA Engineers, etc.
- **Skill** — filter by technical or domain-specific skills captured in custom metadata fields
- **Location / Department** — for organisations where resources are ring-fenced by geography or business unit
- **Custom fields** — any picklist or tag added via the [Configurable Features User Guide](https://www.timebars.com/knowledgebase/helparticles/common-03-configurable-features-user-guide)

The Resource Allocator draws from the same resource pool data but supports **search only** — use the Shared Resource Pool report when you need to filter by role, skill, or location to identify candidates before assigning. This is particularly valuable in large resource pools (50+ resources) where scrolling is impractical.

---

## Resolving Overallocation: What to Do When Variance Goes Red

When the Variance row turns negative, the resource manager has four options:

1. **Delay a task** — move a lower-priority task's start date forward on the timescale canvas using drag-and-drop. The demand shifts forward in time, relieving the pressure in the overloaded period.

2. **Reassign to an alternative resource** — use the Resource Allocator with metadata filters to find a suitably skilled resource with available capacity and substitute them on the task.

3. **Split the allocation** — reduce one resource's allocation percentage on the task (e.g. from 100% to 50%) and assign a second resource at 50%, distributing the load across two people.

4. **Escalate to the Portfolio Manager** — if no reallocation is possible without dropping scope, the conflict needs resolving at portfolio level by adjusting a project's start date or priority. This is the handoff point to Costbars and the PPM pipeline process (see the companion article [Resource Management Techniques: PPM](https://www.timebars.com/articles/resource-management-techniques-ppm)).

---

## The Scheduling Engine and the Report Date

Timebars uses a **Report Date** to drive the scheduling engine. This date divides all tasks across every project into three categories:

- **Future tasks** — not yet started; their full allocation counts toward the Demand row
- **In-Progress tasks** — partially complete; remaining demand is calculated from the Report Date forward
- **Completed tasks** — finished; they no longer contribute to demand

The following example shows a task spliting the the Report Date so it is an In-Progress Task with cost and work calculated by the scheduling engine.

![Report Date](../images/timebars/report-date.png)
The Supply vs. Demand grid therefore always shows *remaining* demand, not total project scope. As projects progress and tasks complete, demand naturally decreases. Advance the Report Date regularly (typically weekly or on each reporting cycle) to keep the grid current.

See the [Data Model and Scheduling Engine Guide](https://www.timebars.com/knowledgebase/helparticles/common-03-data-model-and-scheduling-engine-guide) for full details on how task calculations work.

---

## Resource Reports

Timebars provides dedicated resource reports accessible from **Main Menu > Reports > Resource Reports**:

- **Resource Usage Report** — a time-phased grid showing each resource's allocated hours or FTE by period. The printable/exportable counterpart to the Supply vs. Demand grid.

- **Shared Resource Pool** — shows cross-project allocations for resources that appear on multiple projects, making multi-project conflict patterns immediately visible.

All reports support search, filter, and data export. See the [Local Reports and Graphs Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-local-reports-and-graphs-guide) for the full list of available reports and how to access them.

---

## Spreadsheet Sync for Bulk Allocation Updates

When large-scale re-planning is needed — for example after an organisational restructure or a major scope change across multiple projects — the **Spreadsheet Sync** feature allows allocation data to be updated in bulk via a familiar spreadsheet interface, then synchronised back into Timebars. This avoids hundreds of individual edits on the timescale canvas.

See the [Spreadsheet Sync User Guide](https://www.timebars.com/knowledgebase/helparticles/common-03-spreadsheet-sync-user-guide) for setup and usage.

---

## Publishing to the Cloud Dashboard

Once the resource picture is stable, the Supply vs. Demand grid and resource reports can be published to the **Cloud Dashboard** via the **Cloud Publishing** feature. This creates a shared, read-only view accessible to stakeholders (project managers, department heads, executives) without requiring them to open the application. Published dashboards update automatically when the source data changes and the dashboard is republished.

See the [Cloud Publishing Guide](https://www.timebars.com/knowledgebase/helparticles/common-07-cloud-publishing-guide) for instructions.

---

## Summary: The Resource Manager's Weekly Workflow

| Step | Tool | Purpose |
|------|------|---------|
| Advance the Report Date | Scheduling Engine | Keep demand calculations current |
| Open Supply vs. Demand Grid (Monthly) | Grid, Group By Resource Name | Identify overallocation trends |
| Drill into red variance rows | Grid, expand resource row | Pinpoint conflicted individuals and projects |
| Check role-level pressure | Grid, Group By Role | Identify structural capacity gaps |
| Resolve conflicts | Resource Allocator + Timescale Canvas | Reassign or reschedule tasks |
| Run Resource Usage Report | Reports > Resource Reports | Generate stakeholder communication |
| Publish to Cloud Dashboard | Cloud Publishing | Share the updated picture |

---

## Related Articles

- [Timebars Specific Functionality](https://www.timebars.com/articles/timebars-specific-functionality)
- [Timebars Product Features](https://www.timebars.com/articles/timebars-product-features)
- [Solving Problems with Timebars](https://www.timebars.com/articles/solving-problems-timebars)
- [Resource Management Techniques: PPM](https://www.timebars.com/articles/resource-management-techniques-ppm)
- [Why Synchronize with a Spreadsheet](https://www.timebars.com/articles/why-synchronize-with-a-spreadsheet)
- [Baseline Management: Why and How](https://www.timebars.com/articles/baseline-management-why-and-how)

---

## Original Content (Legacy Reference)

### Control Supply and Demand
Controlling supply and demand in resource management is crucial for optimizing workforce allocation, ensuring project efficiency, and maintaining operational stability. By effectively balancing resource availability with project demands, organizations can prevent overallocation, minimize bottlenecks, and enhance productivity. 

Techniques such as resource leveling, capacity planning, and demand forecasting help managers align workforce capabilities with workload requirements, avoiding burnout while maximizing efficiency. 

Proper control of supply and demand also enables better decision-making by identifying gaps in resource availability, allowing for proactive hiring, training, or redistribution of tasks. Ultimately, mastering this balance ensures that resources are utilized strategically, reducing waste and improving project outcomes.

### Assign Resources to Projects
After populating the resource pool you assign resources to individual tasks on projects in Timebars and Costbars applications to build up utilization. Allocate resources based on their availability, skills, and other attributes captured in the metadata.

Continuously monitor and update resource utilization. Keep track of resource allocations, remaining availability, and any changes in their metadata or custom field values. 

### Resource allocation
Managers can assess the supply and demand of resources by reviewing the availability in terms of percent allocated on the timescaled canvas or on Resource Usage Report. but first they can assign resources based on their skillset, location, and availability, ensuring that the right resources are allocated to the right projects. 


### Filtering and sorting
The Resource Allocator provides filtering and sorting options, allowing managers to filter resources by role, skill, location and other metadata. This helps in identifying the resources that match specific project requirements and optimizing resource allocation. 

### Capacity planning
Resource managers can use the resource pool to analyze resource availability charts and graphs across different projects and timeframes. They can identify periods of high or low demand and make informed decisions regarding resource allocation or hiring. 

### Detecting Overallocated Resources using Resource utilization reports
Timebars and Costbars offers several views, to visualize resource allocation across projects, where the data is in FTE or Hours, by week or by month and by Name  or Role in grid or bar chart formsts. These views help project and resource managers identify instances where a resource may be assigned to tasks that exceed their available hours. 
