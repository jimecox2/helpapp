# Timebars User Guide
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

## Table of Contents

- [Introduction](#introduction)
- [What Makes Timebars Different](#what-makes-timebars-different)
- [Getting Started with Timebars](#getting-started-with-timebars)
- [The Timebars Hierarchy](#the-timebars-hierarchy)
- [The Scheduling Engine](#the-scheduling-engine)
- [Resource Pool Setup](#resource-pool-setup)
- [Resource Allocator](#resource-allocator)
- [Resource Supply vs. Demand Analysis](#resource-supply-vs-demand-analysis)
- [Creating Relationships and Constraints](#creating-relationships-and-constraints)
- [Reporting](#reporting)
- [Scheduling Tips](#scheduling-tips)
- [References to Common Guides](#references-to-common-guides)
- [Quick Reference](#quick-reference)
- [Getting Help](#getting-help)

---

## Introduction

**Timebars** is the traditional project management and resource scheduling edition of the Timebars product family, designed for Waterfall/Traditional Project Management practitioners who need comprehensive resource allocation, multi-level project hierarchies, and sophisticated scheduling capabilities.

While Agilebars focuses on sprint planning with Kanban boards and Costbars provides portfolio management for project selection, Timebars delivers the execution layer—helping you answer critical questions like:

- How do I allocate resources across multiple projects?
- What is my resource capacity vs. demand over the next 6 months?
- Which resources are over-allocated and need workload balancing?
- How do I schedule complex multi-level project hierarchies?
- What happens to dependent tasks when I move predecessor tasks?

---

## What Makes Timebars Different

Timebars extends the core platform with specialized resource scheduling and traditional project management capabilities:

### **Advanced Resource Management**

- **Resource Pool** – Centralized list of named and generic resources with roles, skills, rates, and availability
- **Resource Allocator** – Drag-and-drop resource assignment to tasks with visual availability checking
- **Allocation Bars (Gold L5)** – Visual representation of resource assignments with percent allocation
- **Supply vs. Demand Grids** – Comprehensive capacity planning showing FTE availability vs. project requirements

### **Flexible Project Hierarchy**

- **5-Level Hierarchy** – Portfolio → Project → SubProject → Task → Allocation (color-coded: Dark Grey, Green, Orange, Blue, Gold)
- **4-Level Hierarchy** – Portfolio → Project → Task → Allocation (omit Orange SubProject level)
- **3-Level Hierarchy** – Project → Task → Allocation (omit Portfolio and SubProject levels)
- Hierarchy enforcement prevents structural violations during drag-and-drop operations

### **Sophisticated Scheduling Engine**

- **Automatic Calculation** – Dates, duration, hours, and costs calculated from resource allocations
- **Planned/Forecast/Actual Tracking** – Distinguishes between baseline, forecast, and actual values based on Report Date
- **Task Relationships** – Predecessor-successor links that cascade schedule changes
- **Constraints** – Pin tasks to specific dates while maintaining relationship logic

### **Timephased Canvas**

- **Better than Gantt Charts** – More screen real estate, improved productivity, visual clarity
- **Front-load/Back-load Resources** – Drag allocation bars to schedule resources within task timeframes
- **Weekly or Monthly Timescale** – Switch between granular weekly view and strategic monthly view
- **Percent Allocation Graphs** – Visual indicators of resource availability and utilization

---

## Getting Started with Timebars

### **Prerequisites**

Before creating resource-loaded schedules, familiarize yourself with:

- **[User Interface Guide](https://www.timebars.com/knowledgebase/helparticles/common-02-user-interface-guide)** – Canvas navigation, filters, bar creator, editing, and general interface usage
- **Timebars Presentation** – Review the [comprehensive presentation](https://www.timebars.com/timebars/presentation) and [functional benefits](https://www.timebars.com/timebars) articles


### **Recommended Workflow**

1. **Use Spreadsheet Sync for Efficient Data Entry**
   - Click the **Hamburger Icon** to download Excel or LibreOffice spreadsheet template
   - Populate the spreadsheet with your project data
   - Drag and drop the file onto the Canvas to import

2. **Populate Your Resource Pool** (see Resource Pool Setup below)
   - Use the Resources tab in the spreadsheet
   - Define resource IDs, names, roles, skills, rates, and availability
   - Import via drag-and-drop

3. **Create Your Project Hierarchy**
   - Use the Bar Creator to add Projects (Green L2), SubProjects (Orange L3), and Tasks (Blue L4)
   - Or import via spreadsheet sync

4. **Allocate Resources to Tasks**
   - Use the Resource Allocator to assign resources
   - Create Allocation bars (Gold L5) via drag-and-drop

5. **Review and Optimize**
   - Check resource utilization with Supply vs. Demand grids
   - Adjust schedules to balance resource capacity
   - Create relationships and constraints as needed

---

## The Timebars Hierarchy

Timebars conforms to three different hierarchies with built-in enforcement rules that prevent structural violations during drag-and-drop operations. Each level is color-coded for easy recognition.

### **Color-Coded Hierarchy Levels**

| Level | Color | Name | Description |
|-------|-------|------|-------------|
| **L1** | Dark Grey | Portfolio | Top-level grouping of related programs/projects |
| **L2** | Green | Project/Program | Always a Project in all hierarchies |
| **L3** | Orange | SubProject | Optional intermediate level for complex projects |
| **L4** | Blue | Task | Always a Task in all hierarchies (includes milestones and gates) |
| **L5** | Gold | Allocation | Always a Resource Allocation in all hierarchies |

### **The 5-Level Hierarchy (Maximum)**

**When to use:** Large, complex portfolios with multiple programs and sub-projects

```
L1 - Portfolio (Dark Grey)
  L2 - Project/Program (Green)
    L3 - SubProject (Orange)
      L4 - Task (Blue)
        L5 - Resource Allocation (Gold)
```

**Example:**
- L1: Digital Transformation Portfolio
  - L2: CRM Implementation Program
    - L3: Sales Module SubProject
      - L4: Design Sales Dashboard (Task)
        - L5: Joe Invent @ 50% (Allocation)

### **The 4-Level Hierarchy (Medium)**

**When to use:** Most small and medium-sized projects where sub-projects aren't needed

```
L1 - Portfolio (Dark Grey)
  L2 - Project/Program (Green)
    L4 - Task (Blue)
      L5 - Resource Allocation (Gold)
```

**Same as 5-level except Orange L3 SubProject bars are not used.**

### **The 3-Level Hierarchy (Minimum)**

**When to use:** Simple projects or single-project scheduling

```
L2 - Project/Program (Green)
  L4 - Task (Blue)
    L5 - Resource Allocation (Gold)
```

**Same as 5-level except Dark Grey L1 Portfolio and Orange L3 SubProject bars are not used.**

### **Hierarchy Enforcement**

The system automatically enforces hierarchy rules:
- You cannot place a Task (Blue L4) directly under a Portfolio (Grey L1) – must go under a Project (Green L2) or SubProject (Orange L3)
- You cannot place an Allocation (Gold L5) anywhere except under a Task (Blue L4)
- Drag-and-drop operations that violate hierarchy rules are prevented

---

## The Scheduling Engine

Timebars uses a sophisticated scheduling engine that distinguishes itself from Agilebars through its unique approach to calculating dates, durations, hours, costs, and percent complete.

### **How the Scheduling Engine Works**

The engine behavior changes based on a task's position relative to the **Report Date** (today's date or a baseline date you set):

#### **1. Future Tasks (Start Date > Report Date)**

**When:** You move or resize a bar that starts to the right of the Report Date

**Calculations:**
- Computes **forecast dates** (start and finish)
- Calculates **forecast duration**
- Calculates **forecast work** (hours)
- Calculates **forecast cost**

**Use Case:** Planning future work

#### **2. In-Progress Tasks (Task Straddles Report Date)**

**When:** You move a bar so it straddles the Report Date (starts before, finishes after)

**Calculations:**
- **Start date** becomes an **actual date** (locked in the past)
- **Finish date** remains a **forecast date** (still in the future)
- Calculates **remaining duration** from Report Date to finish
- Calculates **actual work** (hours consumed before Report Date)
- Calculates **actual cost** (costs incurred before Report Date)
- Calculates **percentage completion** based on actual vs. total work

**Use Case:** Tracking active tasks

#### **3. Completed Tasks (Finish Date < Report Date)**

**When:** You move a bar so its finish is before the Report Date

**Calculations:**
- **Start and finish dates** become **actual dates**
- **Remaining duration** becomes zero
- Calculates **actual work** (total hours for completed task)
- Calculates **actual cost** (total cost for completed task)
- Sets **percentage completion to 100%**

**Use Case:** Recording completed work

### **Work Hours Calculation Formula**

By default, the scheduling engine calculates hours using:

```
Hours = Percent Allocated × Work Day Hours × Remaining Duration
```

**Example:**
- Resource is assigned to a task at **50% allocation**
- Resource works an **8-hour day** (from resource calendar)
- Task is **10 days long**
- **Calculation:** 8 × 0.5 × 10 = **40 hours**

### **Percent Allocated**

**Set during assignment:**
- Determined by the **Percent Available** value in the Resource Pool
- Default is typically 50% (resource splits time between this task and other work)
- Can be 100% for dedicated resources

**Changing percent allocated:**
1. Click the **Edit link** at the bottom left of an Allocation bar
2. The **Hours Calculator popup** launches
3. Enter a new **Percent Allocated** value
4. Optionally change the **Workday** hours
5. Hours and costs recalculate automatically

### **Cost Calculation**

Costs are calculated as:

```
Cost = Calculated Hours × Pay Rate
```

- **Pay Rate** comes from the Resource Pool (set per resource in the Resources spreadsheet tab)
- Costs update automatically when hours or pay rates change
- Supports planned, forecast, and actual cost tracking

### **Reviewing Dates, Hours, and Costs**

**Cost Schedule Popup:**
1. Click on the lower left portion of any bar (e.g., "T:3773...")
2. The **Cost Schedule Popup** launches
3. View complete details:
   - **Planned** dates, costs, hours (from baseline)
   - **Forecast** dates, costs, hours (current projection)
   - **Actual** dates, costs, hours (completed work)
4. Traffic light indicators show status (Green/Yellow/Red)
5. Links to Burndown Chart and Metadata View

**Hours Calculator Popup (Gold Allocation bars only):**
1. Click on the Allocation bar second line (e.g., "L5:2101")
2. The popup displays the **Hours Calculator** link
3. Click to see dynamic hours and cost calculations
4. Values update in real-time as you drag the bar
5. Changes save automatically when you drop the bar

---

## Resource Pool Setup

The Resource Pool is your centralized list of resources (people or generic roles) who perform work on tasks. This pool maintains metadata such as role, skill, pay rate, and availability.

### **How to Populate the Resource Pool**

**Step 1: Download the Spreadsheet**
1. Click **Hamburger Icon** > Download Excel or LibreOffice SS
2. Choose the appropriate format for your environment

**Step 2: Open the Resources Tab**
1. Open the downloaded spreadsheet
2. Navigate to the **Resources** tab
3. You'll see column headers for resource metadata

**Step 3: Enter Your Data**
- Type directly into the spreadsheet
- Or paste data from your enterprise system (HR database, ERP, etc.)
- Fill in the required fields (see table below)

**Step 4: Import the Data**
1. Save the spreadsheet
2. Drag and drop the file onto the Canvas
3. The system imports your resource pool

**Step 5: Verify the Import**
1. Click the **Resources icon** on the main menu
2. The Resource Allocator popup opens
3. Verify your resources are listed correctly

### **Resource Pool Fields**

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| **ResID** | Yes | Unique resource identifier | 700, 701, 702 |
| **Name** | Yes | Full resource name | Joe Invent, Ally HR, Julia Finance |
| **Workday Calendar** | Yes | Hours per work day | 8 |
| **Qty Resources (Supply)** | Yes | Number of FTE (typically 1 for named resources) | 1 |
| **Pay Rate** | No | Hourly or daily rate for cost calculations | 50 |
| **Primary Role** | Recommended | Job function or role | R&D, HR SME, Finance SME |
| **Primary Skill** | Recommended | Core competency | Testing, IT Architecture, Procurement |
| **Name Short** | Recommended | Initials or abbreviation | JI, AH, JF |
| **Labour Type** | Yes | Human or Generic | Human, Generic |
| **Default Percent Available** | Recommended | Default allocation percentage | 50 (means 50% available) |

### **Example Resources Spreadsheet Tab**

| ResID | Workday Calendar | Qty Resources | Pay Rate | Name | Primary Role | Primary Skill | Name Short | Labour Type | Default Percent Available |
|-------|------------------|---------------|----------|------|--------------|---------------|------------|-------------|---------------------------|
| 700 | 8 | 1 | 50 | Joe Invent | R&D | Testing | JI | Human | 50 |
| 701 | 8 | 1 | 50 | Ally HR | HR SME | IT Architecture | AH | Human | 50 |
| 702 | 8 | 1 | 50 | Julia Finance | Finance SME | Procurement | JF | Human | 50 |

---

## Resource Allocator

The Resource Allocator is a movable popup that displays your Resource Pool and enables drag-and-drop resource assignment to tasks.

### **Opening the Resource Allocator**

**Method 1: Main Menu**
1. Click **Main Menu > Resources**
2. The Resource Allocator popup opens

**Method 2: Keyboard Shortcut** (if configured)

**What You See:**
- List of all resources from your Resource Pool
- Metadata columns (Name, Role, Skill, Rate, Availability)
- Search box for filtering
- Check boxes to filter by Human/Generic resources
- Width Icon to show/hide additional metadata columns
- Refresh Data button to update usage calculations

### **How to Create an Allocation Bar (Gold L5)**

**Step 1: Open the Resource Allocator**
- Click **Main Menu > Resources**

**Step 2: Find the Desired Resource**
- Use the search box if needed
- Click column headings to sort (e.g., sort by Role to find all Developers)

**Step 3: Drag the Resource**
- Click and hold on a resource row
- Drag it out of the allocator popup

**Step 4: Drop on a Task**
- Drop the resource onto a Task (Blue L4 bar)
- A new **Gold L5 Allocation bar** appears below the task

**Step 5: Position the Allocation**
- The allocation bar spans the same timeframe as the parent task by default
- Drag the allocation bar left/right to front-load or back-load the resource within the task timeframe
- Resize the allocation bar to shorten the assignment duration

### **Resource Allocator Features**

**Search:**
- Not case-sensitive
- Searches all fields (Name, Role, Skill, etc.)
- Returns matching rows instantly

**Filtering:**
- ☑ **Human Resources** – Show only named people
- ☑ **Generic Resources** – Show only role-based placeholders
- ☑ **All Resources** – Show both types

**Sorting:**
- Click any column header to sort by that field
- Click again to reverse sort order
- Useful for grouping by Role, Department, or Skill

**Width Icon:**
- Click to show additional metadata columns
- View Department, Location, Secondary Skills, etc.
- Click again to collapse back to default view

**Refresh Data:**
- Click to recalculate resource demand
- Ensures Resource Demand Charts include latest allocations
- Run before generating usage reports

### **Checking Resource Availability**

**Method 1: Double-Click for Availability Graph**
1. Ensure Canvas is in **Weekly timescale mode**
2. Double-click a resource row in the Resource Allocator
3. Yellow vertical bars appear at the top of the Canvas (below weekly date values)
4. Each bar represents **percent allocated** for that week

**Interpreting the Availability Graph:**
- **Short yellow bar (e.g., 25% high)** – Resource has 75% available capacity
- **Medium yellow bar (e.g., 50% high)** – Resource at 50% utilization
- **Tall yellow bar (e.g., 100% high)** – Resource fully allocated
- **Bar exceeding 100%** – Resource over-allocated (needs rebalancing)

**Method 2: Click Usage Icon**
1. Click the **Usage icon** on the Resource Allocator
2. Opens detailed **Resource Usage** reports
3. Shows Supply vs. Demand grids and charts
4. See [Resource Supply vs. Demand Analysis](#resource-supply-vs-demand-analysis) below for complete details

**Method 3: Resource Usage Reports**
1. Click **Main Menu > Reports > Resource > Resource Usage**
2. View demand by hours or FTE
3. Choose Weekly or Monthly view
4. Group by Resource Name, Project, or Role
5. See tabular grids and colorful bar graphs

---

## Resource Supply vs. Demand Analysis

The Supply vs. Demand grid is a strategic resource management tool that provides visibility into resource capacity planning and allocation across projects.

### **What Are Supply and Demand?**

**Supply** represents the available capacity of resources in your organization:
- Total FTE (Full-Time Equivalent) or hours that resources can work
- Based on employment contracts, calendars, and availability settings
- Sourced from the Resource Pool (tbResources store)

**Demand** represents the actual resource requirements from project allocations:
- How much capacity is being consumed by tasks and projects
- Calculated from resource assignments across all active projects
- Shows where resources are committed

**The Gap:** The difference between supply and demand reveals critical resource management issues:
- **Over-allocation:** When demand exceeds supply (resources over-committed, projects at risk)
- **Under-utilization:** When supply exceeds demand (unused capacity available)
- **Future capacity planning:** Identifying when you'll need to hire, train, or contract additional resources
- **Portfolio decisions:** Understanding if you have capacity to take on new projects

### **Who Uses These Grids?**

**Resource Managers:**
- Balance workloads across the organization
- Identify hiring needs 3-6 months in advance
- Resolve resource conflicts and over-allocations
- Optimize resource utilization rates

**Project Managers:**
- Understand if sufficient resources are available
- Plan schedules based on resource availability
- Request additional resources when gaps identified
- Adjust timelines when resources over-committed

**Portfolio Managers:**
- Assess organizational capacity for new work
- Make go/no-go decisions on project proposals
- Prioritize projects based on resource constraints
- Plan strategic initiatives around availability

**Executive Leadership:**
- Make hiring and budgeting decisions
- Understand organizational capacity at high level
- Evaluate departmental utilization and productivity
- Align business strategy with resource capacity

### **The Five Summary Rows**

At the top of the grid, five critical rows provide aggregated metrics:

#### **1. Supply (FTE) Row – Blue Background**

**What it shows:** Total available resource capacity across all resources in the pool

**Data source:**
- Sourced from `tbResources` store (your Resource Pool)
- Fields: `tbResMonth1` through `tbResMonth24`
- Each resource has monthly FTE availability defined (typically 1.0 for full-time)
- Sums ALL resources regardless of the groupBy selection

**Example:** If you have 6 full-time resources (1.0 FTE each), the supply shows 6.0 FTE per month

**Timing considerations:**
- Resource start dates (`tbResStart`) are factored in – new hires only contribute from their start month
- Resource finish dates (`tbResFinish`) are factored in – departing resources stop contributing
- Allows forward planning for known hiring or departures

#### **2. Demand (FTE) Row – Green Background**

**What it shows:** Total resource requirements from all project allocations

**Data source:**
- Calculated from `tbResCalcsUsage` store
- Generated by aggregating task allocations across all projects
- Fields: `tbResCalcMonth1` through `tbResCalcMonth32`
- Respects the groupBy filter – only sums demand for filtered resources/projects/roles

**Calculation process:**
1. Task allocations split into monthly buckets
2. Each task's total work distributed across its duration
3. Work hours per day calculated: `totalWork / numberOfWorkDays`
4. Monthly hours summed for each resource
5. Converted to FTE: `monthlyHours / (8 hours/day × 20 work days/month)`

#### **3. Variance (S-D) Row – Yellow Background**

**What it shows:** The difference between Supply and Demand (Supply minus Demand)

**Color coding:**
- **Green text (positive variance):** Excess capacity – resources under-utilized
- **Red text (negative variance):** Capacity deficit – resources over-allocated

**Strategic interpretation:**

| Variance | Meaning | Action |
|----------|---------|--------|
| Small negative (< 0.2 FTE) | Minor over-allocation | Manageable with overtime |
| Large negative (> 0.5 FTE) | Serious capacity problem | Hire or delay projects |
| Consistent positive | Opportunity for more work | Take on new projects or reduce headcount |

#### **4. Month Header Row – Gray Background**

**What it shows:** The calendar months for each column

**Format:** "MMM YYYY" (e.g., "Sep 2025", "Oct 2025")

**Start date:** Begins with the `apStatusDate` from Admin Panel configuration
- Typically set to current month or project baseline date
- Allows historical analysis by setting status date in the past
- Enables future planning by projecting 24+ months forward

#### **5. Resource/Project/Role Header Row – White Background**

**What it shows:** The first column header, which changes based on groupBy:
- "Resource ID/Owner" when grouping by ResourceName
- "Project Name" when grouping by Project
- "Role" when grouping by Role

### **View Modes and Configurations**

#### **FTE vs Hours Toggle**

**FTE (Full-Time Equivalent):**
- Standard view for strategic planning
- 1.0 FTE = one full-time resource for one month
- Easier to understand capacity at a glance
- Recommended for executive reporting and high-level planning

**Hours:**
- Detailed view for tactical planning
- Shows actual work hours (e.g., 160 hours/month for 1.0 FTE)
- Useful for detailed project scheduling
- Helps with billing and time-tracking analysis

**Conversion formula:**
```
FTE = Hours / (Calendar hours per day × Working days per period)

For monthly:
FTE = Hours / (8 hours/day × 20 days/month) = Hours / 160

For weekly:
FTE = Hours / (8 hours/day × 5 days/week) = Hours / 40
```

#### **Monthly vs Weekly Toggle**

**Monthly View:**
- Displays resource capacity and demand by calendar month
- Better for long-term strategic planning (6-24 months out)
- Smooths out weekly variations
- Recommended for portfolio planning and hiring decisions
- Supply and demand totals are shown

**Weekly View:**
- Displays resource capacity and demand by work week (Monday-Friday)
- Better for short-term tactical planning (1-3 months out)
- Shows week-to-week fluctuations
- Useful for identifying specific bottleneck weeks
- Currently shows demand data only (no supply totals)

**Why monthly is preferred:** Resource supply data is typically managed monthly (hiring, contracts), monthly aligns with financial cycles, and weekly granularity creates noise in capacity planning.

#### **Group By Options**

The groupBy selection controls how demand rows are organized (does NOT affect supply totals).

**Group By: Project**

**Use case:** Understanding capacity allocated to each project

**What you see:**
- One row per project showing demand
- Supply row shows total capacity across ALL resources
- Variance shows if organization has capacity for all projects combined

**Strategic questions answered:**
- Which projects are consuming the most resources?
- Do we have enough capacity for all active projects?
- Can we take on a new project without hiring?

**Example scenario:** You have 3 projects (CRM Migration, ERP Upgrade, Website Redesign). The grid shows how much FTE each project demands per month, and whether your total resource pool can support all three simultaneously.

**Group By: Resource Name**

**Use case:** Monitoring individual resource utilization

**What you see:**
- One row per named resource (e.g., "Joe Invent", "Ally HR")
- Each row shows that resource's project allocations
- Supply row still shows organizational total (all resources)

**Strategic questions answered:**
- Which individuals are over-allocated?
- Who has available capacity for new work?
- Are workloads balanced across the team?

**Example scenario:** Joe Invent shows 1.2 FTE demand in March (over-allocated by 20%), while Julia Finance shows 0.6 FTE (has 40% available capacity). You can rebalance by moving some of Joe's work to Julia.

**Group By: Role**

**Use case:** Understanding capacity by job function or skillset

**What you see:**
- One row per role (e.g., "Developer", "Engineer", "Finance SME")
- Shows aggregated demand for all resources in that role
- Critical for skills-based capacity planning

**Strategic questions answered:**
- Do we have enough developers vs. testers?
- Which role is the bottleneck in our organization?
- Should we hire for a specific skillset?

**Example scenario:** Your "Developer" role shows 3.5 FTE demand but you only have 3.0 FTE supply of developers. You need to hire an additional 0.5 FTE developer (potentially a contractor) or delay some development work.

### **Named vs. Generic Resources**

The system supports two types of resources that work together for flexible capacity planning:

#### **Named Resources (Humans)**

**What they are:** Individual people with specific identities

**Characteristics:**
- `tbResLabourType: "Human"`
- Unique identifier: `tbResID` (e.g., "700", "701", "702")
- Named individuals: "Joe Invent", "Ally HR", "Julia Finance"
- Assigned a Primary Role: "R&D", "HR SME", "Finance SME"
- Quantity is typically 1

**Why we need them:**
- Track specific people's workloads and allocations
- Manage vacation, training, and individual availability
- Support performance management and utilization reporting
- Enable skills-based assignment to tasks

**Primary Role assignment:** Each named resource is assigned one Primary Role (e.g., Joe Invent has Primary Role = "R&D"). This categorizes the resource by function for reporting and role-based filtering.

#### **Generic Resources**

**What they are:** Placeholder resources representing a pool of similar workers

**Characteristics:**
- `tbResLabourType: "Generic"`
- Role-based identifier: `tbResID` (e.g., "800", "818", "830")
- Generic names matching the role: "R&D", "HR SME", "Finance SME"
- Assigned a Primary Role that matches the resource name
- Quantity can be > 1 (e.g., "2" means 2 FTE of this role)

**Why we need them:**
- Early project planning before specific people are assigned
- Representing contractor pools or offshore teams
- Capacity planning when you don't know who specifically will do the work
- Future hiring – you know you need "3 developers" but haven't hired them yet

**How quantity works:** If Generic Resource "Developer" has `tbResQuantity: "2"` and `tbResMonth1: "2.00"`, this means you have 2.0 FTE of developer capacity available (could be 2 full-time developers, 4 half-time developers, or any combination totaling 2.0 FTE).

#### **Why Have Both Named and Generic?**

This dual approach supports the full project lifecycle:

**Early Planning Phase:**
- Use generic resources ("we need 2 developers and 1 tester")
- Estimate capacity needs without knowing specific people
- Justify hiring or budget requests

**Assignment Phase:**
- Replace generic allocations with named resources
- Assign Joe, Chris, and John to specific tasks
- Track actual people doing the work

**Capacity Planning:**
- Generic resources fill the gap between demand and available named resources
- If named resources show 4.5 FTE demand but only 4.0 FTE supply, the 0.5 FTE gap might be filled by generic "Developer" resource (representing a contractor)

**Reporting Flexibility:**
- Group by Resource Name: See named resources only
- Group by Role: See combined named + generic resources by function
- Supply totals: Includes both named and generic for total capacity

### **Best Practices for Resource Analysis**

**For Accurate Supply Data:**
1. Keep resource pool current – update start/finish dates when people join or leave
2. Set realistic availability – use monthly values to reflect part-time schedules or known vacations
3. Maintain generic resources – keep quantities aligned with actual contractor pools or hiring plans

**For Accurate Demand Data:**
1. Assign resources to all tasks – unassigned tasks don't appear in demand calculations
2. Set realistic task durations – overly long tasks spread demand too thin; overly short tasks create spikes
3. Use appropriate work estimates – review work values to ensure they reflect actual effort
4. Assign Primary Roles – ensure all resources have roles for accurate role-based reporting

**For Effective Analysis:**
1. Review monthly in FTE first – start with monthly FTE view for strategic planning
2. Identify persistent negative variances – months showing red variance consistently indicate structural capacity problems
3. Look ahead 3-6 months – use the grid to identify future capacity needs before they become urgent
4. Compare groupBy views:
   - Project view: Find projects causing over-allocation
   - Resource view: Find specific individuals who are over-committed
   - Role view: Find which job functions need hiring
5. Set the right status date – use apStatusDate to focus on relevant time periods

### **Common Patterns and What They Mean**

| Pattern | Meaning | Action |
|---------|---------|--------|
| Supply and demand equal (variance ≈ 0.0) | Optimal utilization | Monitor closely to maintain balance |
| Consistent negative variance across multiple months | Structural under-capacity | Hire, contract, or reduce project scope |
| Spiky negative variance in specific months | Temporary bottleneck or project crunch time | Shift tasks to other months or bring in temporary contractors |
| Large positive variance | Under-utilization or over-capacity | Take on new projects, reduce headcount, or invest in training/innovation |
| Variance switches from positive to negative | Capacity consumed by project ramp-up | Normal pattern, but verify project schedules are achievable |

---

## Creating Relationships and Constraints

### **Task Relationships (Predecessor-Successor)**

Relationships instruct the scheduling engine to reschedule the successor task by the same amount of time that the predecessor task was moved on the Canvas.

**How to Create a Relationship:**
1. Grab the **beginning** of the desired successor task
2. Drag it over the **ending** of the target predecessor task
3. Wait for the **red dashed box** to appear
4. Drop to create the relationship
5. A visual line connects the two tasks (if relationship lines are enabled)

**How to Remove a Relationship:**
- Repeat the same operation (drag successor beginning over predecessor end and drop)
- The relationship breaks

**What Happens When You Move a Predecessor:**
- All successor tasks automatically reschedule
- The time offset is preserved
- Cascading updates flow through chains of relationships
- Hours and costs recalculate for affected tasks

### **Constraints (Date Pinning)**

Constraints ensure that tasks start or finish on specific dates regardless of predecessor relationships attempting to reschedule them.

**When to Use Constraints:**
- Fixed deadline dates (regulatory, contractual, or business-critical)
- External dependencies (vendor delivery, conference dates, fiscal year-end)
- Milestones that must not move

**How to Add a Constraint:**
1. Locate the **red push pin** on the left-hand side of the Canvas
2. Drag the push pin
3. Drop it near the end of the desired task
4. The task is now constrained to that date

**How to Remove a Constraint:**
- Double-click on the push pin
- The constraint is removed

**Constraint Behavior:**
- If the project start date changes, the task will adjust accordingly (constraint overrides relationships but respects project-level changes)
- If a predecessor tries to reschedule a constrained task, the constraint wins
- Use sparingly – too many constraints reduce scheduling flexibility

---

## Reporting

Timebars provides comprehensive reporting capabilities for tracking project status, resource utilization, and portfolio health.

### **Accessing Reports**

**Main Menu > Reports**

The Reports menu launches editable HTML reports that you can:
- Search and filter
- Sort by any column
- Export to Excel or PDF
- Print for distribution

### **Available Reports**

#### **General Reports**

| Report | Description |
|--------|-------------|
| **General Tabular View** | Tabular view with search and filtering for all bars |
| **General Card View** | Card view with search and filtering |
| **Print WBS** | Work Breakdown Structure in markdown format (copy/paste into markdown editor) – includes number, name, and description |

#### **Portfolio Reports**

| Report | Description |
|--------|-------------|
| **Drilldown from Portfolio** | Portfolio Report with Color Hierarchy – visual drill-down by portfolio/program/project |
| **PPM Tabular Report** | PPM Tabular view with search, filtering, and project selection features |
| **PPM Cards Report** | PPM Cards view with search and filtering |

#### **Project Reports**

| Report | Description |
|--------|-------------|
| **Project Status** | Lists all Projects with Green/Yellow/Red health indicators |
| **All Tabular** | One large table with all columns and all rows available – comprehensive data export |

#### **Task Reports**

| Report | Description |
|--------|-------------|
| **Items Overdue** | Milestones that are past the baseline by one or more days |
| **Milestone Horizon** | Approaching milestones to watch for in the near future |

#### **Resource Reports**

| Report | Description |
|--------|-------------|
| **Resource Usage** | Resource Allocation Supply and Demand Grids and Charts – comprehensive capacity analysis |
| **Shared Resource Pool** | All Resources in the tbResources Store – complete list with metadata |

For detailed local reporting, see **[Common Local Reports and Graphs Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-local-reports-and-graphs-guide)**.

For cloud reporting, see **[Common Enterprise Dashboard Guide](https://www.timebars.com/knowledgebase/helparticles/common-08-enterprise-dashboard-guide)**.

---

## Scheduling Tips

1. **Plan ahead:** Take advantage of Timebars' forecasting capabilities by creating long-term schedules based on future resource availability. This will help you anticipate potential conflicts or bottlenecks before they arise.

2. **Collaborate effectively:** Share schedules with team members or stakeholders using Timebars' collaborative features. This ensures everyone stays on the same page and can make adjustments if necessary.

3. **Optimize resource allocation:** Use Timebars' analytics tools to identify patterns in resource usage over time. By analyzing data such as workload distribution or peak usage periods, you can optimize your resource allocation for maximum efficiency.

4. **Automate repetitive tasks:** Save time by utilizing Timebars' automation features. Set up recurring tasks or automate notifications for upcoming deadlines, ensuring nothing falls through the cracks.

5. **Monitor progress in real-time:** Stay updated on project status with Timebars' real-time tracking capabilities. Visualize progress through interactive dashboards or generate reports to keep stakeholders informed.

---

## References to Common Guides

Timebars shares many features with Agilebars and Costbars. For guidance on these common capabilities, refer to these user guides:

### **Core Functionality**

- **[Common User Interface Guide](https://www.timebars.com/knowledgebase/helparticles/common-02-user-interface-guide)** – Canvas navigation, filters, hierarchy display, bar creator, editing bars, baseline management, view controls
- **[Common Data Structure User Guide](https://www.timebars.com/knowledgebase/helparticles/common-03-data-structure-user-guide)** – How data is organized, IndexedDB details, data hierarchy, backup/restore procedures
- **[Common Spreadsheet Sync User Guide](https://www.timebars.com/knowledgebase/helparticles/common-03-spreadsheet-sync-user-guide)** – 6-step sync cycle, CSV file export/import, template configuration, bidirectional data exchange

### **Project Management Features**

- **[Common Risks Issues Change Requests User Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-risks-issues-change-requests-user-guide)** – Creating and managing RIC items, visual indicators, card/tabular views, progress workflows

### **Reporting and Publishing**

- **[Common Local Reports and Graphs Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-local-reports-and-graphs-guide)** – General Reports, Portfolio Reports, Project Reports, Task Reports, Resource Reports
- **[Common Cloud Reports and Dashboard Guide](https://www.timebars.com/knowledgebase/helparticles/common-08-personal-dashboard-guide)** – Executive Portfolio Reports, Card-Based Drilldown, Interactive dashboards with 7-dimension health tracking
- **[Common Cloud Publishing Guide](https://www.timebars.com/knowledgebase/helparticles/common-07-cloud-publishing-guide)** – Publishing to Timebars Cloud, PubSets, Re-Publish, Re-Hydrate, cross-device sync

---

## Quick Reference

### **Hierarchy Color Guide**

| Level | Color | Type | Always Present? |
|-------|-------|------|-----------------|
| L1 | Dark Grey | Portfolio | No (only in 4-level and 5-level hierarchies) |
| L2 | Green | Project/Program | Yes (all hierarchies) |
| L3 | Orange | SubProject | No (only in 5-level hierarchy) |
| L4 | Blue | Task | Yes (all hierarchies) |
| L5 | Gold | Allocation | Yes (all hierarchies) |

### **Scheduling Engine Summary**

| Task Position | Start Date | Finish Date | Duration | Work & Cost | % Complete |
|---------------|------------|-------------|----------|-------------|------------|
| Future (all dates > Report Date) | Forecast | Forecast | Forecast | Forecast | N/A |
| In Progress (straddles Report Date) | Actual | Forecast | Remaining | Actual + Forecast | Calculated |
| Completed (all dates < Report Date) | Actual | Actual | 0 (complete) | Actual | 100% |

### **Resource Allocator Actions**

| Action | Method |
|--------|--------|
| Open Resource Allocator | Main Menu > Resources |
| Create Allocation | Drag resource from allocator, drop on Task (Blue L4 bar) |
| Check Availability | Double-click resource row (weekly view only) – shows yellow bars |
| View Usage Details | Click Usage icon on Resource Allocator |
| Search Resources | Type in search box (searches all fields) |
| Filter by Type | Check Human/Generic/All Resources boxes |
| Sort Resources | Click column header to sort |
| Show More Metadata | Click Width Icon |

### **Supply vs. Demand Grid Summary**

| View Mode | When to Use | Granularity |
|-----------|-------------|-------------|
| **FTE, Monthly** | Strategic planning, executive reporting | Monthly FTE capacity |
| **Hours, Monthly** | Detailed tactical planning | Monthly work hours |
| **FTE, Weekly** | Short-term resource leveling | Weekly FTE capacity |
| **Hours, Weekly** | Granular task scheduling | Weekly work hours |

| GroupBy | Shows |
|---------|-------|
| **Project** | Resource demand by project |
| **Resource Name** | Individual resource utilization |
| **Role** | Capacity and demand by job function/skill |

### **Work Hours Calculation**

```
Hours = Percent Allocated × Work Day Hours × Remaining Duration
Cost = Calculated Hours × Pay Rate
```

---

## Getting Help

For additional assistance:

- **Common Help Page** – Comprehensive guide for shared functionality across all products
- **Timebars Presentation** – [Comprehensive benefits and features presentation](https://www.timebars.com/timebars/presentation)
- **Support Contact** – Contact your Timebars administrator or support team

---

*Optimize Your Resource Scheduling: Visual planning. Accurate forecasting. Balanced capacity.*
