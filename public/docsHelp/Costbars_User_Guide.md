# Costbars User Guide
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

## Table of Contents

- [Introduction](#introduction)
- [What Makes Costbars Different](#what-makes-costbars-different)
- [Getting Started with PPM](#getting-started-with-ppm)
- [The Five-Step PPM Process](#the-five-step-ppm-process)
- [Resource Management (Supply vs. Demand)](#resource-management-supply-vs-demand)
- [Project Views (Tabular and Card)](#project-views-tabular-and-card)
- [Portfolio Balancing with the Balanced Scorecard](#portfolio-balancing-with-the-balanced-scorecard)
- [Advanced Features](#advanced-features)
- [Troubleshooting](#troubleshooting)
- [References to Common Guides](#references-to-common-guides)
- [Quick Reference](#quick-reference)
- [Getting Help](#getting-help)

---

## Introduction

**Costbars** is the Project Portfolio Management (PPM) edition of the Timebars product family, designed specifically for portfolio managers, PMO leaders, and executives who need to make strategic decisions about project selection, resource allocation, and portfolio balance.

While Timebars focuses on project execution and Agilebars on sprint planning, Costbars provides the strategic layer above individual projects—helping you answer critical questions like:

- Which projects should we approve, delay, or kill?
- How do we balance our portfolio across strategic objectives?
- Are we investing in the right initiatives?
- Do we have the resource capacity to deliver our committed projects?
- How do we ensure our portfolio aligns with organizational strategy?

---

## What Makes Costbars Different

Costbars extends the core Timebars platform with specialized PPM capabilities:

### **Strategic Scoring and Prioritization**

- **Strategic Value (SV) Scores** – Calculate 0-100 scores based on alignment with investment categories, initiatives, objectives, and strategies
- **Ability to Execute (AE) Scores** – Evaluate project feasibility based on risk, size, complexity, and organizational capacity
- **Automated Recommendations** – Data-driven guidance on which projects to approve, review, or reject

### **Portfolio-Level Views**

- **Bubble Chart Selection** – Visual quadrant analysis showing SV Score vs. AE Score with bubble size representing budget/hours
- **Balanced Scorecard** – Portfolio balance analysis across strategic alignment, risk distribution, investment mix, and timeline spread
- **Tabular and Card Views** – Multiple viewing modes for analyzing project portfolios

### **Resource Capacity Management**

- **Supply vs. Demand Grids** – See resource availability compared to project demand across time periods
- **Resource Leveling** – Optimize project schedules to align demand with available capacity
- **Multiple View Modes** – Switch between FTE/Hours, Monthly/Weekly, and various GroupBy options

### **Executive Reporting**

- **Portfolio Status Reports** – Comprehensive portfolio health, balance, and strategic alignment reporting
- **Notification and Escalation** – Configurable alerts when projects exceed defined thresholds
- **Project Assessment Tool** – Standardized framework for evaluating project complexity and risk

---

## Getting Started with PPM

Before running the Costbars PPM process, you need to establish your data foundation.

### **Prerequisite: Configure Your Resource Pool**

Download the spreadsheet template through the Hamburger Icon menu. Populate the Resources Tab with:
- Resource IDs and names
- Roles and skills
- Resource rates

Then drag and drop onto the Canvas to build your centralized resource pool.

### **Prerequisite: Allocate Resources to Tasks**

Assign resources from your pool to specific tasks using the Resource Allocator. The system automatically calculates hours, ensuring accurate workload distribution and capacity planning.

### **Prerequisite: Set Strategic Metadata**

Configure strategic metadata to determine Strategic Value (SV) Scores. Set values for each project:

- **Investment Category** – Functional area or business unit
- **Investment Initiative** – Type of initiative (Innovation, Growth, Maintenance, Compliance)
- **Investment Objective** – Run/Grow/Transform classification
- **Investment Strategy** – Strategic pillar alignment

**Tip:** Use the Edit Metadata Icon to launch the Core Form from Tabular or Card View, or use the spreadsheet sync process.

### **Prerequisite: Complete Project Assessments**

Fill in the Project Assessment form to capture critical project information:

| Field | Purpose |
|-------|---------|
| Risk vs Size and Complexity | 0-100 scale rating of project complexity |
| Executive Level Commitment | Level of senior leadership support |
| Estimation Class | SWAG / Based on History / Resource Driven |
| ROM Estimate | Rough Order of Magnitude budget range |
| Health Indicators | Issues, Schedule, Scope status (In-Flight projects) |

For detailed guidance on completing project assessments, see [Project Assessment Tool](#project-assessment-tool) below.

---

## The Five-Step PPM Process

![PPM Process](https://cdn.timebars.com/costbars/costbars-process-diagram.png)

The Costbars PPM process helps you make data-driven decisions about project approval and termination through five sequential steps.

---

### **STEP 1: Prioritize Projects (Generate SV Scores)**

Calculate Strategic Value based on custom Alignment Values and Order of Importance. The SV Score ranges from 0-100, where 100 indicates perfect alignment with operational strategy.

**How to Access:**
1. From the PPM Page, click **Prioritize** in the actions menu
2. The Prioritize popup opens

**Process:**
1. **Set Order of Importance** by dragging items in each list (most important at top):
   - Investment Categories
   - Investment Initiatives
   - Investment Objectives
   - Investment Strategies

2. Click **"Prioritize Test!"** to preview results without saving

3. Click **"Prioritize Finalize!"** to save scores to the database

**Database Field Updated:** `tbMDPriorityStrategic`

**Scoring Methods:**
- **Strategic + Financial (50/50):** Projects with ≥4 financial fields populated
- **Strategic Only (100%):** Projects with insufficient financial data (no penalty applied)

---

### **STEP 2: Score Projects (Generate AE Scores)**

Evaluate projects using multiple data points including health indicators, costs, hours, and Size vs Complexity metrics. The Ability to Execute (AE) Score identifies potential challenges and resource requirements.

**How to Access:**
1. From the PPM Page, click **Score** in the actions menu
2. The Scoring popup opens

**Process:**
1. Review "Data Requirements & Formula Descriptions" section
2. Click **"Generate Ability to Execute Scores - Test"** to preview
3. Click **"Generate Ability to Execute Scores - Final"** to save

**Database Fields Updated:** `tbMDCostbarsScore`, `tbMDDecisionStrategic`

**AE Score Recommendations:**

| Score | In-Flight Projects | New Projects |
|-------|-------------------|--------------|
| ≥80 | Continue | PROCEED: Strong scoring |
| 60-79 | Review | REVIEW: Moderate scoring |
| <60 | Consider Terminating | REJECT: Weak scoring |

**Score Color Coding:**

| Color | Score Range | Meaning |
|-------|-------------|---------|
| Green | ≥80 | Strong |
| Yellow | 60-79 | Moderate |
| Red | <60 | Weak |

---

### **STEP 3: Level Resources**

Optimize resource demand to align with resource supply by adjusting project start and finish dates. View in real-time the resource demand comparison across the timeline as projects are manually rescheduled on the Timebars Canvas.

**How to Access:**
1. From the PPM Page, click **Level** in the actions menu
2. The Leveling View opens on the Timebars Canvas

**Process:**
1. View total resource demand chart
2. Identify over-allocations (red areas)
3. Drag and drop project bars to adjust schedules
4. Monitor real-time demand updates
5. Continue until demand aligns with supply

For detailed resource capacity analysis, see [Resource Management](#resource-management-supply-vs-demand) below.

---

### **STEP 4: Select Projects (Bubble Chart)**

Utilize the bubble chart visualization to quickly identify which projects to approve or kill. Bubble size, color, and position are based on SV Score and AE Score ranges.

**How to Access:**
1. From the PPM Page, click **Select** or **Bubble Chart** in the actions menu
2. The Bubble Chart view opens

**Understanding the Bubble Chart:**
- **X-Axis:** Strategic Value (SV Score)
- **Y-Axis:** Ability to Execute (AE Score)
- **Bubble Size:** Budget Cost or Forecast Hours
- **Bubble Color:** By Status or by Product

**Quadrant Interpretation:**

| Position | Meaning | Action |
|----------|---------|--------|
| Top-Right (High SV + High AE) | Strategically aligned, likely to succeed | **APPROVE** – High-value, low-risk projects |
| Top-Left (Low SV + High AE) | Misaligned but low-risk projects | **REVIEW** – Easy to execute but questionable value |
| Bottom-Right (High SV + Low AE) | Strategically aligned, risky execution | **MITIGATE** – Important but needs risk reduction |
| Bottom-Left (Low SV + Low AE) | Misaligned and risky projects | **KILL** – Poor candidates for approval |

**Selection Process:**
1. Enter SV Score threshold (e.g., 60)
2. Enter AE Score threshold (e.g., 70)
3. Click **"Select Test"** to preview
4. Click **"Select Final"** to save

**Database Field Updated:** `tbMDYesNoSelector` (Yes/No)

**Selection Formula:**
```
Final Score = (SV Score × 60%) + (AE Score × 40%)
If Final Score > Average Threshold → Selected: Yes
If Final Score ≤ Average Threshold → Selected: No
```

---

### **STEP 5: Balance the Portfolio**

Review the Score Card to assess portfolio balance. Discover anomalies and perform project adjustments to optimize portfolio alignment across strategic dimensions.

**How to Access:**
1. From the PPM Page, click **Balance** or **Score Card** in the actions menu
2. The Portfolio Score Card view opens

**Score Card KPI Sections:**

| Section | What It Measures |
|---------|------------------|
| SV Score Distribution | Very High (80-100) to Very Low (0-19) |
| AE Score Distribution | Same ranges as SV Score |
| Investment Strategy | Projects by strategy alignment |
| Investment Objectives | Run/Grow/Transform balance |
| Investment Category | Category concentration |
| Risk Balance | Risk coverage across priorities |
| Resource Balance | Allocation by priority level |
| Duration Balance | Short (0-4mo) / Medium (4-12mo) / Long (12+mo) |

**KPI Indicators:**
- 🟢 **Green:** Balanced
- 🟡 **Yellow:** Needs attention
- 🔴 **Red:** Action required

**Balancing Actions:**
1. Review KPI indicators for problem areas
2. Re-select killed projects if needed
3. Kill additional projects to free resources
4. Reschedule projects to improve timing
5. Re-run scoring if metadata changes

For comprehensive portfolio balancing guidance, see [Portfolio Balancing with the Balanced Scorecard](#portfolio-balancing-with-the-balanced-scorecard) below.

---

## Resource Management (Supply vs. Demand)

Costbars provides powerful resource capacity planning through Supply and Demand grids that show resource availability compared to project demand across time periods.

### **Understanding the Supply vs. Demand Grid**

The grid displays **5 summary rows** that help you identify over-allocation and resource constraints:

1. **Supply (FTE)** – Available resource capacity in Full-Time Equivalents
2. **Demand (FTE)** – Required resource capacity from all projects
3. **Variance (S-D)** – Supply minus Demand (negative = over-allocated)
4. **Month Header** – Time period labels (Monthly or Weekly view)
5. **Resource/Project/Role** – The dimension being analyzed

### **View Modes**

**FTE vs Hours:**
- **FTE (Full-Time Equivalent)** – Shows capacity as decimal (e.g., 0.5 = half-time)
- **Hours** – Shows actual hours required/available

**Monthly vs Weekly:**
- **Monthly** – Aggregates capacity across entire months
- **Weekly** – Provides granular week-by-week analysis

**GroupBy Options:**

| GroupBy | What It Shows |
|---------|---------------|
| **Project** | Resource demand organized by project |
| **Resource Name** | Workload for each named resource |
| **Role** | Capacity and demand by role/skill |

### **Named vs Generic Resources**

**Named Resources:**
- Specific individuals (e.g., "John Smith, Senior Developer")
- Allocated by person
- Shows individual capacity and workload

**Generic Resources:**
- Role-based allocation (e.g., "Developer", "Business Analyst")
- Represents pools of similar resources
- Useful for planning before specific assignments

### **Interpreting Variance Values**

| Variance | Meaning | Action |
|----------|---------|--------|
| **Positive (e.g., +2.5)** | Supply exceeds demand | Capacity available for new projects |
| **Zero or Near-Zero** | Balanced allocation | Optimal utilization |
| **Negative (e.g., -1.5)** | Over-allocated | Delay projects, hire resources, or reduce scope |

### **Using Supply vs. Demand for Resource Leveling**

1. **Identify Over-Allocations** – Look for negative variance (red) in any time period
2. **Adjust Project Schedules** – Drag project bars on the canvas to shift demand
3. **Monitor Real-Time Updates** – Watch variance recalculate as you move projects
4. **Balance Across Time** – Smooth resource demand to avoid peaks and valleys

**Best Practice:** Aim for slight under-allocation (positive variance) to allow for unexpected work and planning buffers.

---

## Project Views (Tabular and Card)

Costbars provides two specialized views for analyzing your project portfolio: Tabular View and Card View.

### **Tabular View**

A spreadsheet-style interface for data-intensive portfolio analysis.

**How to Access:**
1. From the PPM Page, click **Tabular View** in the actions menu
2. The spreadsheet-style grid opens

**Key Columns:**

| Column | Description |
|--------|-------------|
| ID | Project identifier (e.g., L2:PJ01) |
| Type | Project type classification |
| Name | Project name |
| Product | Timebars/Agilebars/Costbars |
| Status | In-Flight, Approved, Proposed, etc. |
| SV Score | Strategic Value Score (0-100) |
| AE Score | Ability to Execute Score (0-100) |
| F Score | Final Combined Score |
| Selected | Yes/No indicator from selection process |
| Decision | Approve/Review/Reject recommendation |

**Use Cases:**
- Quickly sort and filter large project lists
- Export to Excel for further analysis
- Bulk edit project metadata
- Review scoring results across entire portfolio

### **Card View**

A visual, card-based interface for intuitive portfolio review.

**How to Access:**
1. From the PPM Page, click **Cards View** in the actions menu
2. The card grid displays

**Card Elements:**

Each card displays:
- Project name and ID
- Product type (Costbars/Timebars/Agilebars)
- Status badge (color-coded)
- SV Score and AE Score (with color indicators)
- Budget/forecast information
- Selection status (Yes/No)
- Decision recommendation

**Use Cases:**
- Executive presentations and portfolio reviews
- Visual pattern recognition (e.g., many red scores)
- Quick scanning of portfolio health
- Stakeholder communication

### **Editing Metadata from Views**

**From Tabular View:**
- Click the **Edit Metadata Icon** on any row
- Core Form launches with full project details
- Make changes and save

**From Card View:**
- Click any card to expand
- Access editing options
- Update fields and save

---

## Portfolio Balancing with the Balanced Scorecard

The Balanced Scorecard helps you assess whether your portfolio is balanced across multiple strategic dimensions.

### **What is Portfolio Balance?**

A balanced portfolio means:
- Investment is distributed appropriately across strategic objectives
- Risk is managed within organizational tolerance
- Resources are allocated to the right priorities
- Projects span appropriate time horizons

An **unbalanced portfolio** creates strategic risk, operational problems, and misalignment with organizational goals.

### **The Four Scorecard Quadrants**

#### **1. Strategic Alignment**

Shows how portfolio budget is distributed across strategic pillars (e.g., "Increase market share", "Improve core products", "Ensure compliance").

**What to Look For:**
- Does budget allocation match strategic priorities?
- Are top strategic pillars adequately funded?
- Are low-priority areas consuming too many resources?

**Example Problem:**
- Strategic Pillar #1 receives only 15% of budget
- Strategic Pillar #5 receives 45% of budget
- **Action:** Reallocate budget to match stated priorities

#### **2. Risk Balance**

Displays portfolio distribution across risk categories (Very High, High, Medium, Low, Very Low).

**What to Look For:**
- Does risk distribution match organizational risk tolerance?
- Are you over-concentrated in high-risk projects?
- Do you have enough low-risk quick wins?

**Example Problem:**
- 60% of budget allocated to High/Very High risk projects
- Organization has conservative risk appetite
- **Action:** Kill or defer high-risk projects; approve safer alternatives

#### **3. Investment Mix**

Shows portfolio breakdown by initiative type:

| Initiative Type | Typical Range |
|----------------|---------------|
| **Maintenance & Operational** | 20-35% |
| **Innovation & Transformation** | 20-40% |
| **Growth & Enhancement** | 25-35% |
| **Mandatory & Compliance** | 10-20% |

**What to Look For:**
- Over-investment in Maintenance (starving innovation)
- Under-investment in Compliance (regulatory risk)
- Appropriate balance for your organizational strategy

**Example Problem:**
- 50% of budget in Maintenance & Operational
- Only 15% in Innovation & Transformation
- **Action:** Defer low-value maintenance; approve innovation projects

#### **4. Timeline Distribution**

Evaluates balance across time horizons:

| Time Horizon | Typical Range | Examples |
|-------------|---------------|----------|
| **Short-term (0-4 months)** | 20-30% | Quick wins, bug fixes |
| **Medium-term (4-12 months)** | 40-50% | Standard projects |
| **Long-term (12+ months)** | 20-30% | Strategic transformations |

**What to Look For:**
- Zero long-term projects (no strategic positioning)
- Too many short-term projects (reactive mode)
- Balanced distribution across horizons

**Example Problem:**
- 0% long-term projects
- 80% medium-term projects
- **Action:** Approve strategic long-term initiatives

### **How to Use the Balanced Scorecard**

**Step 1: Review Each Quadrant**
- Check KPI indicators (🟢 Green, 🟡 Yellow, 🔴 Red)
- Identify problem areas (red or yellow)

**Step 2: Analyze Imbalances**
- Understand why imbalances exist
- Consider organizational context
- Determine acceptable vs. problematic imbalances

**Step 3: Take Rebalancing Actions**
- **Kill Projects:** Remove low-priority projects in over-represented categories
- **Approve Projects:** Fast-track projects in under-represented categories
- **Reschedule Projects:** Shift timelines to smooth resource demand
- **Adjust Metadata:** Correct misclassified projects

**Step 4: Re-Run the Five-Step Process**
- Re-prioritize if strategic rankings changed
- Re-score if project complexity changed
- Re-select with new thresholds
- Review updated Balanced Scorecard

**Step 5: Monitor Over Time**
- Generate scorecard monthly
- Track progress toward target balance
- Adjust approval criteria to maintain balance

---

## Advanced Features

The following advanced features provide additional depth for sophisticated portfolio management. Click the links below for detailed guides.

### **Project Assessment Tool**

A comprehensive evaluation framework that helps you objectively evaluate project feasibility, complexity, and risk before committing resources.

**What It Does:**
- Analyzes projects across four dimensions: Technical Risk, Political Risk, Size, and Complexity
- Generates an Overall Feasibility Score (0-100)
- Provides tailored recommendations based on risk category
- Helps compare projects objectively using consistent criteria

**When to Use:**
- Before approving new projects
- During portfolio reviews
- When requesting additional resources
- To justify timeline or budget negotiations

**Key Sections:**
- Technology Assessment (maturity, team expertise, architecture complexity, integrations)
- Team & Resources Assessment (team size, stakeholder count, resource availability)
- Organizational & Political Factors (change impact, executive Comittment, stakeholder alignment)
- External Factors & Constraints (regulatory requirements, external dependencies, market timing)
- Project Scope & Scale (duration, budget magnitude)

**Risk Categories:**

| Score | Risk Level | Recommended Action |
|-------|-----------|-------------------|
| 0-25 | LOW RISK (Green) | Proceed with standard project management |
| 26-50 | MEDIUM RISK (Yellow) | Enhanced monitoring and risk mitigation |
| 51-75 | HIGH RISK (Orange) | Consider phasing or scope reduction |
| 76-100 | CRITICAL RISK (Red) | Reconsider or start with proof-of-concept |

**For complete assessment guidance:** See [Costbars PPM Project Assessment Tool How to Use](https://www.timebars.com/knowledgebase/helparticles/costbars-ppm-project-assessment-tool)

---

### **Portfolio Status and Balancing Report**

A comprehensive portfolio-wide report providing health indicators, financial analysis, strategic alignment assessment, and multi-dimensional balance evaluation.

**What It Provides:**
- Executive Summary with health indicators (Overall, Scope, Schedule, Cost, Hours, Risk, Issues)
- Financial Summary by category (In Progress, Approved, Proposals)
- Strategic Alignment Analysis (budget distribution across strategic pillars)
- In-Flight Projects Status (with critical projects requiring attention)
- Approved Projects Readiness Assessment
- New Proposals Evaluation
- Risk Score Portfolio Analysis (budget distribution by risk level)
- Initiative Type Balance Analysis (Maintenance, Innovation, Growth, Compliance)
- Time Horizon Balance Analysis (Short/Medium/Long-term mix)

**When to Use:**
- Before quarterly portfolio review meetings
- When evaluating new project proposals
- When needing to free up resources
- For executive leadership reporting
- To assess strategic alignment

**Key Metrics:**

| Metric | Purpose |
|--------|---------|
| Portfolio Health Indicators | Quick overview of portfolio status |
| Budget Variance Analysis | Spending vs. planned budgets |
| Strategic Pillar Allocation % | Does spending match strategic priorities? |
| Risk Distribution % | Is portfolio within risk tolerance? |
| Initiative Type Balance Score | Balanced across project types? |
| Time Horizon Balance Score | Appropriate short/medium/long-term mix? |

**For complete report guide:** See [Costbars PPM Pf Detail Report for Balancing How To](https://www.timebars.com/knowledgebase/helparticles/costbars-ppm-portfolio-status-and-balancing-report)

---

### **Configuring Notification Thresholds and Alerts**

Configure automated notifications to alert stakeholders when projects exceed defined thresholds for schedule, budget, risk, or health indicators.

**What It Does:**
- Define threshold rules for triggering notifications
- Set delivery preferences (SMS, Push, Email)
- Configure escalation paths for critical projects
- Customize quiet hours and cooldown periods

**Threshold Rules:**

| Rule | What It Monitors | Example |
|------|------------------|---------|
| Days Overdue Threshold | Schedule slippage | Alert if >5 days late |
| Budget Overrun % | Cost variance | Notify if costs exceed budget by 15% |
| Overall Health | Project health status | Flag any project marked Red |
| Executive Commitment | Sponsor support level | Alert if Comittment drops |
| Strategic Value % | Strategic alignment | Flag high-value at-risk projects |
| Likelihood of Success % | Risk scoring | Alert if likelihood <40% |

**Configuration Steps:**
1. Open Admin → Notifications
2. Add or Edit Notification Profile
3. Set contact details and delivery channels
4. Configure threshold values
5. Test configuration before activating
6. Enable automated alerts

**For complete configuration guide:** 
[Text Notifications Guide](https://www.timebars.com/knowledgebase/helparticles/common-10-text-notifications)

[Text Notifications — Technical Details](https://www.timebars.com/knowledgebase/helparticles/common-10-text-notifications-technical-details)

---

### **Five-Step Scoring Process (Technical Details)**

Deep dive into the scoring methodology, data requirements, and formula specifications for both Strategic Value (SV) and Ability to Execute (AE) scoring.

**SV Score Components:**
- Investment Category alignment
- Investment Initiative alignment
- Investment Objective alignment
- Investment Strategy alignment
- Financial metrics (if sufficient data available)

**AE Score Components:**
- Risk vs. Size and Complexity assessment
- Executive Commitment level
- Estimation Class quality
- Health Indicators (for In-Flight projects)
- Budget and hours variance (for In-Flight projects)

**Data Requirements:**
- Minimum required fields for scoring
- Data quality thresholds
- Handling of missing data
- "Not Assessed" handling

**For complete technical specifications:** See [Costbars PPM Scoring Guide 5 Step Process](https://www.timebars.com/knowledgebase/helparticles/costbars-ppm-scoring-guide-5-step-process)

---

## Troubleshooting

### **Missing Data Warnings**

**Problem:** Scoring fails with data requirement errors

**Solutions:**
- Check that Project Assessment fields are populated
- Verify Risk vs Size/Complexity is assessed (not "Not Assessed")
- Ensure Executive Commitment is set
- For In-Flight: Check health indicators and baseline hours
- For New: Check Estimation Class and ROM Estimate

---

### **Projects Not Appearing in Views**

**Problem:** Expected projects don't show in Tabular/Card/Bubble Chart

**Solutions:**
- Confirm Status is not "Closed"
- Check State is not "Spawned"
- Verify project is within selected filter criteria
- Refresh the view

---

### **Financial Score Shows Zero**

**Problem:** SV Score shows 0 or projects not getting financial component

**Solution:**
- Need at least 4 of 7 financial fields populated
- Values of "Not Assessed" don't count toward the 4-field minimum
- Enter actual budget, baseline, forecast, or cost values

---

### **Resource Variance Always Negative**

**Problem:** Supply vs. Demand grid shows constant over-allocation

**Solutions:**
- Verify resource supply is configured correctly
- Check that resource pool includes all available resources
- Consider whether project resource estimates are realistic
- Use resource leveling to shift project timelines

---

## References to Common Guides

Costbars shares many features with Timebars and Agilebars. For guidance on these common capabilities, refer to these user guides:

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

### **PPM Menu Actions**

| Button | Action |
|--------|--------|
| Prioritize | Generate SV Scores based on strategic alignment |
| Score | Generate AE Scores based on feasibility assessment |
| Level | Open resource leveling view for capacity optimization |
| Select / Bubble Chart | Run selection algorithm with visual quadrant analysis |
| Balance / Score Card | Review portfolio balance across multiple dimensions |
| Tabular View | Spreadsheet-style data view for analysis |
| Cards View | Visual card-based view for reviews |
| Process Help ❓ | Open PPM documentation |

### **Score Interpretation**

| Score Range | Color | SV Score Meaning | AE Score Meaning |
|------------|-------|------------------|------------------|
| 80-100 | Green | Very High Strategic Value | Very High Ability to Execute |
| 60-79 | Yellow | High Strategic Value | High Ability to Execute |
| 40-59 | Orange | Moderate Strategic Value | Moderate Ability to Execute |
| 0-39 | Red | Low Strategic Value | Low Ability to Execute |

### **Decision Matrix**

| SV Score | AE Score | Recommendation |
|----------|----------|----------------|
| High | High | **APPROVE** – Strategic and feasible |
| High | Low | **MITIGATE** – Important but risky; reduce scope or phase |
| Low | High | **REVIEW** – Easy to execute but questionable value |
| Low | Low | **KILL** – Neither strategic nor feasible |

---

## Getting Help

For additional assistance:

- **Process Help Button (❓)** – Context-sensitive help within the PPM interface
- **Advanced Feature Guides** – See links in [Advanced Features](#advanced-features) section above
- **Common Feature Guides** – See links in [References to Common Guides](#references-to-common-guides) section above
- **Support Contact** – Contact your Timebars administrator or support team

---

*Transform Your Portfolio Management: Data-driven decisions. Strategic alignment. Optimized outcomes.*
