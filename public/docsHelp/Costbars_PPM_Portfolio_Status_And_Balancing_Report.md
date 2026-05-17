# Costbars - Portfolio Status and Balancing Report: User Guide
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

## Table of Contents
1. [Introduction](#introduction)
2. [Generating the Report](#generating-the-report)
3. [Understanding the Executive Summary](#understanding-the-executive-summary)
4. [Reading Financial Summary Sections](#reading-financial-summary-sections)
5. [Strategic Alignment Analysis](#strategic-alignment-analysis)
6. [In-Flight Projects Section](#in-flight-projects-section)
7. [Approved Projects Analysis](#approved-projects-analysis)
8. [New Proposals Evaluation](#new-proposals-evaluation)
9. [Risk Score Portfolio Analysis](#risk-score-portfolio-analysis)
10. [Initiative Type Balance Analysis](#initiative-type-balance-analysis)
11. [Time Horizon Balance Analysis](#time-horizon-balance-analysis)
12. [Using the Report for Portfolio Decisions](#using-the-report-for-portfolio-decisions)
13. [Portfolio Rebalancing Actions](#portfolio-rebalancing-actions)
14. [Best Practices](#best-practices)

---

## Introduction

The Portfolio Status and Balancing Report is your comprehensive tool for understanding portfolio health, strategic alignment, and balance across multiple dimensions. Unlike project-level reports that focus on individual initiative status, this report provides the portfolio-wide intelligence you need to make strategic decisions about what to start, what to continue, what to delay, and what to kill.

**When to use this report:**
- Before quarterly portfolio review meetings
- When evaluating new project proposals for approval
- When you need to free up resources and must identify projects to kill or delay
- When assessing whether your portfolio aligns with organizational strategy
- When reporting portfolio status to executive leadership
- When determining whether portfolio risk exposure is acceptable

**What you'll learn from this report:**
- Where your investment dollars are allocated (by strategic pillar, benefit type, initiative type, risk level)
- Whether your portfolio is balanced across time horizons and initiative types
- Which projects need immediate attention
- How your portfolio risk exposure compares to your organizational risk tolerance
- Specific recommendations for rebalancing your portfolio

---

## Generating the Report

### **Step 1: Ensure Your Data is Current**

Before generating the report, make sure your project data is up-to-date:

- Project health indicators (scope, schedule, cost, hours, risk, issues) have been updated
- Budget, baseline, and forecast values are current
- Strategic priority scores are assigned to all active projects
- Risk scores have been calculated (ideally using the Project Assessment Tool)
- Project phases and states are accurate (Planning, Executing, Closing, etc.)
- Strategic pillar assignments are complete

**Why this matters:** The report's analysis is only as good as the underlying data. Outdated information leads to incorrect conclusions and poor decisions.

### **Step 2: Navigate to the Report**

Access the Portfolio Status and Balancing Report through:
- The Reports menu in Costbars
- The dashboard view, if configured
- The main navigation under "Portfolio Reports"

### **Step 3: Configure Report Parameters** (if applicable)

Depending on your Costbars configuration, you may be able to filter the report by:
- **Date range** – Focus on a specific quarter or fiscal year
- **Portfolio** – If you manage multiple portfolios, select which to analyze
- **Project states** – Include or exclude certain project states
- **Include proposals** – Choose whether to include new project proposals in the analysis

### **Step 4: Generate and Export**

- Click "Generate Report" to create the current portfolio analysis
- Export to PDF for executive distribution or meeting materials
- Export to Excel if you want to perform additional custom analysis
- Save a timestamped version for historical comparison

**Best practice:** Generate the report at consistent intervals (e.g., start of each month) so you can track how portfolio balance evolves over time.

---

## Understanding the Executive Summary

The report opens with an Executive Summary designed to give you an immediate sense of overall portfolio health without requiring you to read the entire document.

### **Portfolio Performance Summary**

You'll see a table with health indicators for:

**Overall** – Composite indicator synthesizing all other dimensions
**Scope** – Are projects delivering their planned scope?
**Schedule** – Are projects meeting their timeline commitments?
**Cost** – Is spending aligned with budgets?
**Hours** – Is work effort tracking to estimates?
**Risk** – What's the aggregate portfolio risk profile?
**Issues** – Are active issues impacting delivery?

Each indicator shows a color-coded status:
- **🟢 Green** – Performing well, no significant concerns
- **🟡 Yellow** – Some concerns, requires monitoring
- **🔴 Red** – Significant problems requiring immediate attention
- **⚪ White/Gray** – Not assessed or insufficient data

### **How to Interpret Health Indicators**

**If Overall is Red:**
Your portfolio has systemic problems affecting multiple dimensions. This requires executive attention and likely a portfolio review meeting to identify root causes and corrective actions.

**If Schedule is Red but Cost is Green:**
Projects are running late but not over budget. This suggests schedule pressure, potentially due to optimistic planning, resource constraints, or underestimated complexity. Consider whether deadlines are realistic or need adjustment.

**If Cost is Red but Scope is Green:**
You're spending more than planned but delivering planned scope. This could indicate poor initial estimates, scope creep that wasn't captured in scope metrics, or inefficient execution. Dig into individual project cost overruns.

**If Risk is Red:**
Your portfolio contains too many high-risk projects or individual projects with extreme risk levels. This may be acceptable if it aligns with organizational strategy (e.g., transformation initiatives), but if it's unintentional, you need to de-risk the portfolio.

**If Issues is Red:**
Active issues are accumulating across projects. This suggests inadequate issue resolution processes, resource constraints preventing issue closure, or systemic organizational problems creating issues faster than they can be resolved.

### **What to Do With Red Indicators**

1. **Read the detailed section** for that dimension later in the report
2. **Prepare discussion topics** for your next portfolio review meeting
3. **Identify specific projects** contributing most to the red status
4. **Develop action plans** to address the root causes
5. **Set a timeline** for when you expect the indicator to return to yellow or green

---

## Reading Financial Summary Sections

The Financial Summary provides three critical views into portfolio spending:

### **Portfolio Investment by Category**

This table shows spending across three project categories:

**"In Progress" Projects** – Currently executing
**"New and Approved" Projects** – Approved but not yet started
**"New and Not Approved" Projects** – Proposals under evaluation

For each category, you see:

**Budget** – Original planned investment
**Baseline** – Committed investment after planning (often $0 if not baselined)
**Forecast** – Current expected total cost
**Budget Variance** – How much forecast differs from budget
**Forecast Variance** – How much forecast differs from baseline
**Status** – Whether the category is on track

### **How to Read the Numbers**

Let's use an example:

```
"In Progress" Projects Budget: $1.4M
Baseline: $0.0M
Forecast: $0.4M
Budget Variance: $-0.9M (-68.6%)
```

**What this tells you:**

You originally budgeted $1.4M for in-progress projects, but your current forecast shows you'll only spend $0.4M—a $900K underspend. This massive variance (-68.6%) suggests:

- Projects were cancelled or descoped after budget approval
- Initial budgets were extremely optimistic
- Projects are delayed and costs are being deferred
- Some "in progress" projects haven't actually consumed significant resources yet

**Action required:** Investigate why actual spending is so far below budget. If projects were cancelled, ensure those budget dollars are reallocated. If projects are delayed, update schedules accordingly.

### **Example: Healthy Variance**

```
"New and Approved" Projects Budget: $3.3M
Forecast: $3.1M
Budget Variance: $-0.2M (-6.1%)
Status: 🟢
```

This shows a small favorable variance (-6.1%), indicating your approved projects are forecast to come in slightly under budget—a healthy outcome suggesting good planning and execution.

### **Example: Concerning Variance**

```
"In Progress" Projects Budget: $2.0M
Forecast: $2.8M
Budget Variance: $+0.8M (+40%)
Status: 🔴
```

This shows significant cost overruns. Your in-progress projects were budgeted at $2.0M but are now forecast to cost $2.8M—a 40% overrun. This requires immediate investigation and corrective action.

### **Financial-Benefits Forecast**

This section shows expected benefits by category, such as:

- Source cloud services for core products
- Improve product reliability
- Improve productivity with Agile teams
- Strengthen cybersecurity infrastructure
- Build AI/ML capabilities

For each benefit type, you see budget, baseline, forecast, variances, and status.

**Why this matters:** It's not enough to track costs—you must also verify that your portfolio is delivering the strategic benefits that justified the investment. If "Build AI/ML Capabilities" shows a large negative variance, you're underinvesting in an area that may be strategically critical.

**How to use this section:**

1. **Identify benefit categories with large negative variances** – These are areas where you're delivering less benefit than planned
2. **Investigate why benefits are not materializing** – Are projects cancelled? Descoped? Not delivering expected value?
3. **Reallocate budget if needed** – If a benefit category is strategic, consider approving more projects in that area
4. **Question benefit assumptions** – If benefits consistently exceed forecasts across all categories, your benefit estimation methodology may be flawed

### **Financial-Strategic Alignment**

This critical section shows how portfolio budget is distributed across your strategic pillars, such as:

- Increase share of market
- Build recurring revenue streams
- Improve our core products
- Improve customer service
- Reduce waste
- Ensure compliance
- Serve more customers

For each strategic pillar:

**Budget** – Total budget allocated to projects supporting this pillar
**% Budget Allocated** – What percentage of total portfolio budget goes to this pillar
**Baseline, Forecast, Variances** – Standard financial tracking
**Status** – Whether the pillar is adequately funded

### **The Critical Metric: % Budget Allocated**

This percentage reveals whether your portfolio spending matches your strategic priorities. Let's interpret an example:

```
Strategic Pillar: "Increase share of market"
Budget: $5.0M
% Budget Allocated: 82.1%
Status: 🔴
```

This says that 82.1% of your portfolio budget is allocated to projects supporting "Increase share of market." If this is your #1 strategic priority, that might be appropriate. But if it's one of seven equal priorities, this is a massive over-allocation that starves other strategic areas.

**Common problems revealed by this section:**

**Problem: Over-concentration in one pillar**
- One strategic pillar receives 70%+ of budget
- Other pillars are starved for resources
- Portfolio is not balanced across strategic objectives

**Action:** Identify lower-priority projects in the over-funded pillar and reallocate budget to under-funded pillars.

**Problem: Strategic priority mismatch**
- Your #1 strategic priority receives only 15% of budget
- Your #3 strategic priority receives 45% of budget
- Portfolio spending doesn't reflect stated strategy

**Action:** Either adjust portfolio composition to match strategy, or acknowledge that your actual strategy differs from your stated strategy and update strategic communications accordingly.

**Problem: Red status on critical pillars**
- Strategic pillars marked 🔴 indicate problems
- May indicate large variances between budget and forecast
- Suggests projects in that strategic area are struggling

**Action:** Investigate projects supporting that strategic pillar to understand root causes of variance or performance issues.

---

## Strategic Alignment Analysis

(This section is covered above in Financial-Strategic Alignment)

---

## In-Flight Projects Section

This section focuses on projects currently in execution, providing both overall status and specific project details.

### **Status Summary**

You'll see a breakdown like:

```
🟢 GREEN: 7 projects (54%)
🟡 YELLOW: 1 project (8%)
🔴 RED: 2 projects (15%)
⚪ NOT ASSESSED: 3 projects (23%)
TOTAL PROJECTS: 13
```

### **How to Interpret Status Distribution**

**Healthy Portfolio:**
- 60-80% of projects in Green status
- 15-25% in Yellow status (some challenges are normal)
- 0-10% in Red status
- 0-15% not assessed

**Concerning Portfolio:**
- Less than 50% Green
- More than 20% Red
- More than 25% not assessed (suggests inadequate monitoring)

### **Critical Projects Requiring Attention**

The report automatically identifies projects that meet specific risk criteria. The standard criterion is:

**"Project Priority is Immediate, and Overall Health is not Green"**

These are your fires that need fighting—high-priority projects that are struggling. The report lists them explicitly so you don't have to search for them in the full project list.

**If you see "No Projects are requiring attention at this time":**
This is good news. It doesn't mean you have no struggling projects—it means your highest-priority projects are on track. You may still have lower-priority red projects, but they're not mission-critical.

**If you see multiple critical projects listed:**
This requires executive intervention. High-priority projects that are red need one of:
- Additional resources to get them back on track
- Scope reduction to make them achievable
- Risk mitigation plans and executive sponsorship
- Possible termination if they can't be rescued

### **Key Project Milestones**

This table shows major milestones across all in-flight projects, with:

**Milestone** – Name of the milestone
**Baseline** – Original committed date
**Forecast** – Current expected completion date
**Status** – Whether milestone is on track

Pay attention to:

**⚪ No Baseline** – Milestone has no committed date yet
- If this is early in the project, that's normal
- If the project is well underway, this suggests poor planning

**Forecast significantly later than Baseline:**
- Indicates schedule slippage
- May signal broader project problems
- Could cascade delays to downstream projects

**Best practice:** For critical path milestones, investigate any forecast date that's more than 2 weeks later than baseline.

---

## Approved Projects Analysis

This section covers projects that have been approved but not yet started—your launch pipeline.

### **Readiness Status Categories**

**✅ READY TO START** – All prerequisites met
- Status is New, State is Approved, Awaiting Approval, or Requested Approval
- In Planning Phase
- Can launch as soon as resources become available

**⚠️ AWAITING INFORMATION** – Need inputs before launch
- Missing key requirements, dependencies, or decisions
- Cannot proceed until information is provided
- May require stakeholder engagement or additional analysis

**❌ BLOCKED** – Schedule Health indicates the project cannot progress
- Set via the Schedule Health (tbMDHealth) field, not the Status field
- Allows a project to be "In Progress" AND blocked simultaneously
- May be technical, organisational, or resource-related
- Requires active intervention to unblock

**🔷 INITIATING PHASE** – In early planning
- Still in PMI Initiating Phase
- Not yet ready for launch
- Expected to move to Planning Phase soon

### **Project Inventory & Readiness Assessment Table**

For each approved project, the table shows:

**Project Name** – The approved initiative
**State** – Current approval state (Approved, Awaiting Approval, etc.)
**PMI Phase** – Project management phase (Initiating, Planning, Executing, etc.)
**Strategic Priority** – Priority score (0-100 scale)
**Est. Duration** – Expected project length in months
**Budget/Forecast** – Budgeted amount and current forecast
**Readiness Status** – Visual indicator of launch readiness
**Earliest Start** – First possible start date based on dependencies
**Key Dependencies** – Predecessor projects that must complete first

### **How to Use This Table**

**Scenario 1: Selecting next projects to launch**

1. Filter for "✅ READY TO START" projects
2. Sort by Strategic Priority (highest first)
3. Check Earliest Start dates for any in the past or near-term
4. Verify no blocking dependencies
5. Confirm resources will be available (check Resource Capacity Analysis)
6. Approve launch for highest-priority ready projects

**Scenario 2: Unblocking projects**

1. Identify "⚠️ AWAITING INFORMATION" and "❌ BLOCKED" projects
2. For each project, identify what's missing or what's blocking it
3. Assign ownership for resolving each blocker
4. Set target dates for unblocking
5. Follow up until projects move to "✅ READY" status

**Scenario 3: Sequencing projects with dependencies**

Some projects show "Predecessor ID: A030" or similar in the Key Dependencies column. This means:

- The project cannot start until another project (ID A030) completes
- Launching it before its predecessor would create problems
- You need to respect this sequencing in your launch plan

**How to handle dependencies:**

1. Find the predecessor project in your portfolio
2. Check its forecast completion date
3. Set the dependent project's start date after the predecessor completes
4. Add buffer time for any handoff or knowledge transfer needed

### **Recommended Start Sequence**

The report provides a prioritized launch sequence like:

```
1. L2:PJ13 Private Cloud Phase 1
2. L2:PJ06 Constant Internal Delivery Enablement
3. L2:PJ04 Digital Desktop - Transformation
4. L2:PJ12 Partner Portal Platform
```

This sequence is calculated based on:
- Strategic priority scores
- Project dependencies
- Readiness status
- Earliest start dates

**How to use this:**

- Treat this as a suggested sequence, not a mandate
- Override the sequence if you have reasons (e.g., resource availability, stakeholder pressure, changing priorities)
- Use it as a starting point for discussion in portfolio planning meetings
- Validate that resource capacity supports this sequence (check Resource Capacity Analysis)

### **Resource Capacity Analysis**

This table shows monthly resource demand (in FTE or hours) for each approved project across future months. It's presented as a grid:

```
Project Name    | Sep 2025 | Oct 2025 | Nov 2025 | ...
----------------|----------|----------|----------|-
Project A       | 0.5      | 0.5      | 0.5      |
Project B       | 0        | 0        | 1.0      |
```

Numbers represent required FTE (full-time equivalent) resources in each month.

**How to interpret:**

**0.5 FTE** = Half of one person's time for that month
**1.0 FTE** = One full person for that month
**2.5 FTE** = Two and a half people for that month

**Sum the columns** to see total demand in each month. If total demand exceeds your available capacity, you have an over-allocation problem.

**Example interpretation:**

```
Total Demand:
Sep 2025: 3.5 FTE
Oct 2025: 5.0 FTE
Nov 2025: 7.5 FTE
Dec 2025: 8.0 FTE

Available Capacity: 5.0 FTE
```

This shows you'll be over-allocated starting in November (7.5 FTE demand with 5.0 FTE capacity). You need to either:

- Delay some project starts
- Hire additional resources
- Reduce scope to lower resource demand
- Accept that some projects will take longer than planned

**Smoothing resource demand:**

If you see sharp spikes in demand followed by valleys, consider:
- Shifting lower-priority project starts to fill the valleys
- Spreading project work more evenly over time
- Staggering project starts rather than launching many simultaneously

---

## New Proposals Evaluation

This section covers project proposals that haven't been approved yet—your intake pipeline.

### **Proposal Status Categories**

**✅ READY for Planning Phase** – Approved to move forward
**⚠️ AWAITING INPUT** – Need more information before decision
**⚠️ AWAITING REVIEW** – Pending evaluation by decision-makers
**🔷 Spawned State** – Initial creation, no progress in workflow

### **Proposal Inventory & Assessment Table**

Similar to approved projects table, but shows proposals with:

**Proposal Status** – Visual indicator of where it stands in approval process
**Estimated values** – Since these aren't approved, budget/duration are estimates

### **How to Evaluate Proposals**

**Step 1: Review proposals in "⚠️ AWAITING REVIEW" status**

These are proposals waiting for your decision. For each:

1. Check Strategic Priority score – Does this align with current priorities?
2. Review Budget/Forecast – Is this investment level appropriate?
3. Check Est. Duration – Does timeline fit portfolio capacity?
4. Look for Key Dependencies – Will this create sequencing problems?
5. Consider portfolio balance – Will approving this improve or worsen portfolio balance?

**Step 2: Use portfolio context for go/no-go decisions**

Don't evaluate proposals in isolation. Consider:

**Risk balance:** If your portfolio is already 40% high-risk projects, do you want to approve another high-risk proposal?

**Initiative type balance:** If you're under-invested in Innovation & Transformation and this proposal falls in that category, it's more valuable than a similar Maintenance project.

**Time horizon balance:** If you have zero long-term projects, approve some long-duration proposals even if they're not the highest priority.

**Strategic alignment:** If a strategic pillar is under-funded, prioritize proposals supporting that pillar.

**Resource capacity:** If your resource capacity analysis shows over-allocation, don't approve resource-intensive proposals until capacity becomes available.

**Step 3: Reject or defer proposals that cannot proceed**

Proposals that cannot move forward due to unavailable budget, missing resources, unresolved dependencies, or strategic conflicts should be either formally **rejected** (removing them from the pipeline) or returned to **Awaiting Input** with a clear description of what must be resolved before re-submission. Do not use a Blocked health indicator on proposals — Blocked is a schedule health condition that applies to active projects only.

**Step 4: Request additional information for "⚠️ AWAITING INPUT" proposals**

These proposals need more details before you can decide. Common missing information:

- Detailed cost breakdown
- Resource requirements by month
- Strategic benefit quantification
- Risk assessment
- Technical feasibility study
- Regulatory impact analysis

Assign someone to gather this information and move the proposal to "AWAITING REVIEW" status.

---

## Risk Score Portfolio Analysis

This is one of the most valuable sections for portfolio rebalancing. It shows how risk is distributed across your portfolio.

### **Overall Risk Metrics**

**Average Risk Score:** Mean risk score across all projects
- 0-25: Very low average risk (conservative portfolio)
- 26-50: Low to moderate average risk (balanced portfolio)
- 51-75: High average risk (aggressive portfolio)
- 76-100: Very high average risk (extremely risky portfolio)

**Projects Without Risk Score:** Number of projects missing risk assessments
- Ideally this should be 0
- High numbers indicate inadequate risk assessment
- Use Project Assessment Tool to score these projects

**Projects With Very High Score:** Count of projects in 80-100 range
- These are your highest-risk initiatives
- Monitor closely and consider enhanced governance

### **Budget Distribution by Risk Score**

This shows what percentage of your total portfolio budget is allocated to each risk category:

```
Very High (80-100): 24.4% ($1.5M)
High (60-79): 17.9% ($1.1M)
Medium (40-59): 20.3% ($1.25M)
Low (20-39): 30.9% ($1.9M)
Very Low (0-19): 6.5% ($400K)
```

### **Interpreting Risk Distribution**

**Question 1: What's your organizational risk tolerance?**

Different organizations should have different risk distributions based on their strategy and risk appetite:

**Conservative Organization** (risk-averse, regulated industry, limited resources):
- Target: 10-15% in Very High/High risk
- Target: 60-70% in Low/Very Low risk
- Accept fewer but safer projects

**Balanced Organization** (typical mid-size company):
- Target: 20-30% in Very High/High risk
- Target: 30-40% in Medium risk
- Target: 30-40% in Low/Very Low risk
- Mix of innovation and safe bets

**Aggressive Organization** (growth-focused startup, transformation initiative):
- Target: 40-50% in Very High/High risk
- Target: 30-40% in Medium risk
- Target: 10-20% in Low/Very Low risk
- Taking calculated risks for high rewards

**Question 2: Does your actual distribution match your target?**

Compare your actual distribution to your organizational target. If they don't match, you need to rebalance.

**Example problem:**

Your organization says it's conservative, but analysis shows:
- 42% in Very High/High risk
- 20% in Medium risk
- 38% in Low/Very Low risk

This mismatch means either:
1. Your portfolio is riskier than your risk appetite allows (fix: kill or delay high-risk projects)
2. Your stated risk tolerance doesn't match reality (fix: acknowledge you're actually risk-seeking)

### **Top Risk Score Projects**

The report lists your highest-risk projects:

```
Public Cloud Phase 1: 100.0
Database Upgrade Market Datamart: 93.0
Private Cloud Phase 1: 93.0
```

**Why this matters:** These projects have the highest probability of failure, delays, or cost overruns. They require:

- **Enhanced governance** – More frequent status reviews
- **Executive sponsorship** – Remove blockers quickly
- **Risk mitigation resources** – Extra budget and time
- **Contingency plans** – What happens if they fail?
- **Possible kill decisions** – If risk is unacceptable

**Questions to ask about each top-risk project:**

1. **Is this risk score accurate?** – Should we reassess using the Project Assessment Tool?
2. **Is this risk acceptable?** – Does the strategic value justify this level of risk?
3. **Can we de-risk it?** – Can we reduce scope, phase it, or add resources to lower risk?
4. **Do we have the right team?** – Are we staffing high-risk projects with our best people?
5. **Should we kill it?** – Would organizational resources be better deployed elsewhere?

### **Risk Score by Project Characteristics**

This analysis shows whether risk correlates with project size:

**By Project Size:**

```
Large (>$500K): 7 projects, Avg Risk Score 54.7, $4.0M (65% of budget)
Medium ($100K-$500K): 6 projects, Avg Risk Score 63.8, $2.15M (35% of budget)
Small ($10K-$100K): 0 projects
```

**What this tells you:**

Your medium-sized projects (63.8 avg risk) are riskier on average than your large projects (54.7 avg risk). This is unusual—typically larger projects are riskier. This could mean:

- You're managing large projects well but struggling with medium ones
- Medium projects are in unfamiliar territory (new technologies, new markets)
- Large projects have more resources and oversight, reducing risk
- Your risk assessment methodology may under-score large project risks

**By Risk Level** (Project Health Status):

This shows actual project health status (green/yellow/red) vs. risk scores, helping you identify:

- High-risk projects that are currently green (still risky, just performing well so far)
- Low-risk projects that are red (something unexpected is going wrong)

### **Risk Score Distribution Table**

This provides the detailed breakdown:

```
Risk Score Range    | Projects | % of Projects | Total Budget | % of Budget
Very High (80-100)  | 4        | 30.8%        | $1.5M        | 24.4%
High (60-79)        | 2        | 15.4%        | $1.1M        | 17.9%
Medium (40-59)      | 3        | 23.1%        | $1.25M       | 20.3%
Low (20-39)         | 3        | 23.1%        | $1.9M        | 30.9%
Very Low (0-19)     | 1        | 7.7%         | $400K        | 6.5%
```

Use this to calculate:

**Combined High Risk Exposure:** Very High + High = 30.8% + 15.4% = 46.2% of projects
**Combined High Risk Budget:** Very High + High = 24.4% + 17.9% = 42.3% of budget

If your target is 25% high-risk budget, you're substantially over-allocated (42.3% vs. 25%).

### **Risk Score Balance Analysis & Recommendations**

The report automatically generates insights and recommendations, such as:

**Key Insights:**
- "Strong portfolio with 4 projects in the very high Risk Score range"
- "3 large budget projects have low Risk Scores (below 40)"

**Recommendations:**
- "Review and potentially restructure large projects with low Risk Scores to improve their viability"
- "Aim for a more balanced Risk Score distribution with most projects in the 40-79 range"
- "Regularly review Risk Score calculation methodology to ensure it accurately reflects project characteristics"

**How to act on recommendations:**

1. **If told to reduce high-risk projects:** Identify lowest-priority high-risk projects for kill or delay decisions
2. **If told to add more risk:** Consider whether you're being too conservative and missing strategic opportunities
3. **If told large projects have low scores:** Reassess those projects—are you under-estimating risks on important initiatives?
4. **If told to balance distribution:** Adjust approval criteria to favor projects that balance out your current distribution

---

## Initiative Type Balance Analysis

This section evaluates whether your portfolio has the right mix of project types.

### **The Four Initiative Types**

**Maintenance & Operational** – Keep-the-lights-on projects
- System upgrades, bug fixes, operational improvements
- Necessary but not strategic
- Low risk, low reward
- Examples: Server upgrades, license renewals, routine maintenance

**Innovation & Transformation** – Game-changing initiatives
- New business models, major process changes, emerging technologies
- High risk, high reward
- Strategic importance
- Examples: Digital transformation, AI implementation, new product lines

**Growth & Enhancement** – Expand capabilities
- New markets, new features, incremental improvements
- Moderate risk, moderate reward
- Strategic execution
- Examples: Market expansion, feature development, capability building

**Mandatory & Compliance** – Required by regulation or policy
- Can't be avoided regardless of strategic value
- Risk of non-compliance
- Must-do projects
- Examples: GDPR compliance, security upgrades, regulatory reporting

### **Initiative Balance Score**

The report calculates an overall balance score (0-100) with sub-scores:

**Project Count Balance (93.7%)** – How evenly projects are distributed
**Budget Allocation Balance (96.0%)** – How evenly budget is distributed
**Strategic Priority Balance (93.4%)** – How evenly priority is distributed

**Interpretation:**

- **90-100%** – Well balanced, no significant imbalances
- **70-89%** – Moderately balanced, some imbalances present
- **50-69%** – Imbalanced, needs attention
- **Below 50%** – Severely imbalanced, requires immediate correction

A score of 94.8/100 indicates your portfolio is very well balanced across initiative types.

### **Distribution by Initiative Type**

For each initiative type, the report shows:

**Projects:** Count and percentage of total
**Budget:** Dollar amount and percentage
**Cost:** Actual spending to date
**Priority Score:** Sum of strategic priorities

**Example:**

```
Maintenance Operational
Projects: 5 (38.5%)
Budget: $2,100,000 (34.1%)
Cost: $1,115,500
Priority Score: 184.0
```

### **Interpreting Initiative Type Distribution**

**Ideal distribution (varies by organization):**

**Growth-Stage Company:**
- Maintenance: 20-25%
- Innovation: 35-45%
- Growth: 30-40%
- Compliance: 5-10%

**Mature Enterprise:**
- Maintenance: 30-40%
- Innovation: 20-30%
- Growth: 20-30%
- Compliance: 10-20%

**Regulated Industry:**
- Maintenance: 25-35%
- Innovation: 15-25%
- Growth: 20-30%
- Compliance: 20-30%

**Common Problems Identified:**

**Problem: Over-invested in Maintenance (40%+ of budget)**
- Consuming resources on operational work
- Under-investing in strategic initiatives
- Risk of competitive decline

**Action:** Identify lower-value maintenance projects to defer or eliminate. Redirect freed resources to Innovation and Growth initiatives.

**Problem: Under-invested in Compliance (< 5% when it should be 15%)**
- Regulatory risk exposure
- Potential fines or operational disruptions
- Audit findings will force corrective action

**Action:** Identify mandatory compliance projects that aren't in the portfolio. Assess regulatory risk. Add compliance projects or accept documented risk.

**Problem: Too much Innovation (50%+ of budget)**
- High portfolio risk
- Neglecting operational stability
- Potential for many projects to fail

**Action:** Be realistic about organizational change capacity. Defer some innovation projects to future periods. Ensure adequate maintenance to keep operations stable.

### **Visualizations**

The report includes pie charts showing:

- **Project Count Distribution** – How many projects in each category
- **Budget Allocation Distribution** – How budget is distributed
- **Cost Distribution** – How actual spending is distributed
- **Strategic Priority Distribution** – How priority points are allocated

Compare these charts:

**If Project Count and Budget Allocation are misaligned:**
- Example: 40% of projects are Maintenance, but only 20% of budget
- This means Maintenance projects are smaller on average
- May indicate you're running too many small Maintenance projects

**If Budget Allocation and Priority Distribution are misaligned:**
- Example: 30% of budget to Innovation, but only 10% of priority points
- This means you're spending money on Innovation but not prioritizing it
- Suggests strategic confusion

### **Initiative Type Analysis Recommendations**

The report provides insights like:

**Key Insights:**
- "Low representation of Mandatory Compliance initiatives in the portfolio"

**Recommendations:**
- "Establish target allocation percentages for each initiative type based on organizational strategy"
- "Regularly review initiative type balance during portfolio planning sessions"

**How to implement recommendations:**

1. **Establish targets:**
   - Work with leadership to define ideal initiative type distribution
   - Document target percentages for each category
   - Get executive agreement on targets

2. **Review regularly:**
   - Add initiative type balance to portfolio review meeting agendas
   - Track trends over time (are you improving or worsening?)
   - Adjust approval criteria to maintain balance

3. **Use as decision filter:**
   - When evaluating new proposals, consider current balance
   - If over-invested in Maintenance, defer new Maintenance proposals
   - If under-invested in Compliance, fast-track Compliance proposals

---

## Time Horizon Balance Analysis

This section evaluates whether your portfolio has appropriate short-term, medium-term, and long-term balance.

### **The Three Time Horizons**

**Short-term (0-4 months)** – Quick wins
- Fast delivery, immediate value
- Low risk of scope creep or changing requirements
- High visibility and momentum
- Examples: Bug fixes, small enhancements, quick deployments

**Medium-term (4-12 months)** – Standard projects
- Typical project duration for most organizations
- Manageable scope and risk
- Deliver meaningful capabilities
- Examples: System implementations, process improvements, new features

**Long-term (12+ months)** – Strategic initiatives
- Major transformations, large-scale programs
- High complexity and coordination requirements
- Strategic positioning for the future
- Examples: Platform migrations, market expansions, organizational transformations

### **Time Horizon Balance Score**

Similar to Initiative Type Balance, this shows:

**Overall Score (67.0/100)** – How balanced your time horizon mix is
**Project Count Balance (70.0%)** – Distribution of project counts
**Budget Allocation Balance (65.4%)** – Distribution of budget
**Strategic Priority Balance (70.0%)** – Distribution of priority

A score of 67/100 indicates moderate imbalance requiring attention.

### **Ideal vs. Actual Distribution**

The report shows recommended vs. actual mix:

**Recommended Portfolio Mix:**
- Short-term: 20%
- Medium-term: 50%
- Long-term: 30%

**Your Current Portfolio Mix:**
- Short-term: 23.1%
- Medium-term: 76.9%
- Long-term: 0%

### **Interpreting Time Horizon Imbalances**

**Your Example Problem:**

You have zero long-term projects. This is a significant strategic risk because:

- You're not building future capabilities
- No projects positioning you for 2-3 years out
- Over-focused on tactical execution
- Competitors investing in long-term may leap ahead

Additionally, you're over-weighted in medium-term (76.9% vs. recommended 50%), which means:

- Too many projects in the 4-12 month range
- May be breaking up what should be long-term initiatives into smaller chunks
- Missing both quick wins and strategic bets

**Common Time Horizon Problems:**

**Problem: No long-term projects (0% when should be 30%)**
- **Why it happens:** Long-term projects are risky and don't show immediate results
- **Consequence:** Competitive decline, strategic drift, future capability gaps
- **Action:** Approve strategic initiatives even if ROI is distant

**Problem: Too many short-term projects (40% when should be 20%)**
- **Why it happens:** Quick wins are appealing, easy to justify
- **Consequence:** Constantly reacting, never building transformational capabilities
- **Action:** Consolidate fragmented short-term work into fewer, more substantial projects

**Problem: Too many medium-term projects (80% when should be 50%)**
- **Why it happens:** This is the "safe" duration—not too short, not too long
- **Consequence:** Missing both quick wins and strategic positioning
- **Action:** Break some medium-term projects into quick wins; extend others into strategic initiatives

**Problem: Only long-term projects (60% when should be 30%)**
- **Why it happens:** Large transformation programs, limited project count
- **Consequence:** No near-term value delivery, stakeholder patience wears thin
- **Action:** Add short-term projects to show progress and momentum

### **Project Timeline Overview**

The report includes a visual timeline showing when projects are scheduled across future months. Use this to:

**Identify gaps:**
- Months with no project completions
- Periods where nothing is delivering
- Stakeholders see no value for extended periods

**Identify congestion:**
- Too many projects completing simultaneously
- Resource bottlenecks for deployment/rollout
- Risk of quality issues from rushing

**Validate sequencing:**
- Ensure dependencies are respected
- Check that project order makes sense
- Verify no impossible overlaps

### **Time Horizon Analysis Recommendations**

**Key Insights from your example:**

- "Portfolio lacks long-term projects (12+ months), which may affect strategic future positioning"
- "Portfolio is heavily weighted toward Medium-term (4-12 months) projects (76.9% of total projects)"
- "Budget allocation is concentrated in Medium-term (4-12 months) projects (84.6% of total budget)"

**Recommendations:**

- "Consider reducing focus on Medium-term projects from current 76.9% toward the recommended 50% of portfolio"
- "Increase the number of Long-term projects to approach the recommended 30% of portfolio (currently at 0%)"
- "Include long-term projects to support strategic objectives and future positioning"

**How to act on these recommendations:**

1. **Identify potential long-term projects:**
   - Review new proposals for long-duration initiatives
   - Consider whether some approved medium-term projects could be extended into long-term strategic initiatives
   - Brainstorm strategic capabilities needed 2-3 years out

2. **Reassess medium-term projects:**
   - Can any be accelerated into short-term quick wins?
   - Should any be expanded into long-term strategic initiatives?
   - Are any actually delivering less value than their cost, making them candidates for cancellation?

3. **Set time horizon targets:**
   - Establish organizational targets for time horizon distribution
   - Create approval criteria that favor projects balancing toward targets
   - Track progress toward targets over multiple quarters

---

## Using the Report for Portfolio Decisions

### **Scenario 1: Quarterly Portfolio Review Meeting**

**Before the meeting:**

1. Generate the most current Portfolio Status and Balancing Report
2. Distribute to all attendees 24-48 hours in advance
3. Ask attendees to review and come prepared with questions

**During the meeting:**

**Agenda Item 1: Executive Summary Review (10 min)**
- Review health indicators
- Discuss any red or yellow indicators
- Identify which detailed sections need deep discussion

**Agenda Item 2: Financial Performance (15 min)**
- Review portfolio investment vs. budget
- Discuss significant variances
- Assess whether spending aligns with expectations

**Agenda Item 3: Strategic Alignment Check (15 min)**
- Review strategic pillar budget distribution
- Confirm spending matches priorities
- Identify any strategic misalignments

**Agenda Item 4: In-Flight Project Status (15 min)**
- Review critical projects requiring attention
- Discuss red and yellow projects
- Decide on interventions needed

**Agenda Item 5: Portfolio Balance Review (20 min)**
- Review Risk Score Distribution
- Review Initiative Type Balance
- Review Time Horizon Balance
- Identify specific imbalances requiring correction

**Agenda Item 6: New Project Approvals (20 min)**
- Review proposals awaiting decision
- Consider portfolio context (balance, capacity, risk)
- Make approval decisions

**Agenda Item 7: Rebalancing Decisions (15 min)**
- Based on balance analysis, what needs to change?
- Identify projects to delay, descope, or kill
- Commit to specific actions

**Agenda Item 8: Action Items and Next Steps (10 min)**
- Document decisions made
- Assign action item owners
- Set follow-up timelines

### **Scenario 2: Approving a New High-Risk Project**

**Question:** Should we approve this new AI/ML project with a risk score of 85?

**Step 1: Check current risk exposure**

Look at Risk Score Portfolio Analysis:
- Current High + Very High Risk budget: 42% of portfolio
- Organizational target: 30% max

**Step 2: Calculate impact of approval**

If this project is budgeted at $500K and portfolio is $6M:
- Adding it: ($2.6M + $500K) / ($6M + $500K) = 47.7% high-risk
- This exceeds target even more

**Step 3: Make context-informed decision**

**Option A: Reject the project**
- "We're already over-allocated in high-risk projects at 42% vs. our 30% target. Adding another high-risk project would push us to 48%, which is unacceptable."

**Option B: Approve with risk mitigation**
- "We'll approve this project, but only after implementing these risk mitigation actions: [specific actions]. We expect these to reduce the risk score from 85 to 65."

**Option C: Approve and kill a different high-risk project**
- "We'll approve this project because it's strategically critical. To maintain portfolio balance, we'll kill Project X (risk score 92, budget $600K), which is lower priority."

**Option D: Defer approval**
- "This project has merit, but our portfolio can't absorb more risk right now. We'll revisit approval in Q3 after some current high-risk projects complete."

### **Scenario 3: Forced Budget Cut of 20%**

**Question:** Executive leadership mandates 20% portfolio budget reduction. How do we decide what to cut?

**Step 1: Calculate total reduction needed**

Portfolio budget: $6.2M
Required cut: 20% = $1.24M

**Step 2: Use portfolio analysis to identify candidates**

**First, protect critical projects:**
- Mandatory Compliance projects (regulatory requirement)
- Critical Projects identified in the report
- Projects with high strategic priority AND low risk

**Second, identify kill candidates:**

**Low-hanging fruit:**
- Projects with low strategic priority scores (<30)
- Projects with high risk scores (>80) AND low strategic value
- Projects in red health status that are struggling anyway
- Projects where benefits are not materializing (large negative variance)

**Look at Initiative Type Balance:**
- If over-invested in Maintenance & Operational (38.5% vs. target 25%), cut there first
- Protect under-represented categories

**Look at Time Horizon Balance:**
- If over-invested in medium-term (76.9% vs. target 50%), cut medium-term projects
- Protect the few long-term strategic initiatives you have

**Step 3: Create cut scenarios**

**Scenario A: Kill 4 low-priority maintenance projects**
- Total savings: $1.2M
- Impact: Reduces Maintenance category to 28% (closer to target 25%)
- Risk: Some operational debt accumulates

**Scenario B: Kill 1 large high-risk project + 2 small projects**
- Total savings: $1.3M
- Impact: Reduces high-risk exposure from 42% to 35%
- Risk: May affect strategic initiative

**Scenario C: Descope 6 projects by 20% each**
- Total savings: $1.25M
- Impact: All projects continue but with reduced scope
- Risk: May reduce delivered value, create scope creep pressure

**Step 4: Model the impact**

For each scenario, calculate the resulting:
- Risk score distribution
- Initiative type balance
- Time horizon balance
- Strategic alignment

Choose the scenario that maintains best overall portfolio balance.

### **Scenario 4: Rebalancing for Strategic Shift**

**Question:** Leadership announces new strategy emphasizing Innovation & Transformation. How do we rebalance the portfolio?

**Step 1: Understand current state**

Current Initiative Type Distribution:
- Maintenance: 38.5% of projects, 34.1% of budget
- Innovation: 30.8% of projects, 26.8% of budget
- Growth: 23.1% of projects, 26.0% of budget
- Compliance: 7.7% of projects, 13.0% of budget

**Step 2: Define target state**

New strategy targets:
- Maintenance: 25% of budget
- Innovation: 40% of budget
- Growth: 25% of budget
- Compliance: 10% of budget

**Step 3: Calculate required changes**

Current Innovation budget: $1.65M (26.8%)
Target Innovation budget: $2.48M (40%)
Gap: Need +$830K in Innovation projects

Current Maintenance budget: $2.1M (34.1%)
Target Maintenance budget: $1.55M (25%)
Excess: Need -$550K in Maintenance projects

**Step 4: Take rebalancing actions**

**Over next two quarters:**

1. **Defer or kill lower-priority Maintenance projects** worth $550K
2. **Fast-track Innovation proposals** currently in intake pipeline
3. **Approve new Innovation projects** to reach $830K additional investment
4. **Adjust approval criteria** to favor Innovation over Maintenance going forward

**Step 5: Monitor progress**

- Generate Portfolio Status and Balancing Report monthly
- Track Initiative Type Balance Score
- Confirm moving toward 40% Innovation target
- Adjust approvals as needed to maintain trajectory

---

## Portfolio Rebalancing Actions

When the report identifies imbalances, here are specific actions you can take:

### **Action 1: Kill Projects**

**When to use:** Severe imbalances, forced budget cuts, portfolio risk too high

**Process:**
1. Identify kill candidates using report analysis
2. Calculate impact of killing each candidate on portfolio balance
3. Notify stakeholders and project teams
4. Execute orderly wind-down
5. Reallocate freed resources to higher-priority work

**Selection criteria:**
- Low strategic priority + High risk = Top kill candidate
- Red health status + Low priority = Project is failing anyway
- Projects not aligned with strategic pillars = Misaligned with strategy
- Projects in over-represented categories = Helps rebalance

### **Action 2: Delay Projects**

**When to use:** Resource capacity constraints, temporary imbalances, sequencing issues

**Process:**
1. Identify approved-not-started projects that could be delayed
2. Check dependencies—don't delay if other projects depend on it
3. Set new target start date (e.g., delay by one quarter)
4. Communicate to stakeholders
5. Use freed near-term capacity for higher-priority work

**Selection criteria:**
- Projects with flexible timelines (not time-sensitive)
- Projects in categories you're over-invested in
- Projects waiting on dependencies that aren't ready yet
- Projects that could benefit from more planning time

### **Action 3: Descope Projects**

**When to use:** Need to reduce budget/risk but want to keep project alive

**Process:**
1. Identify projects that could deliver value with reduced scope
2. Work with project teams to identify nice-to-have vs. must-have features
3. Remove nice-to-have features to reduce cost/duration/risk
4. Update project budgets and timelines
5. Recalculate portfolio balance with new numbers

**Selection criteria:**
- Projects with "gold-plating" or unnecessary complexity
- Projects where 80% of value comes from 50% of scope
- High-risk projects that could become medium-risk with reduced scope
- Large projects that could be broken into phases

### **Action 4: Accelerate Projects**

**When to use:** Categories are under-represented, need near-term wins

**Process:**
1. Identify approved-not-started projects that could launch earlier
2. Verify resources are available
3. Confirm readiness to start
4. Fast-track through any remaining approval gates
5. Launch project

**Selection criteria:**
- Projects in under-represented initiative types
- Projects that improve time horizon balance (add long-term if missing)
- Projects that could be quick wins (short-term)
- Projects supporting under-funded strategic pillars

### **Action 5: Phase Projects**

**When to use:** Large projects, high-risk projects, long-duration projects

**Process:**
1. Identify large or high-risk projects
2. Break into phases (e.g., Phase 1: Pilot, Phase 2: Rollout)
3. Approve Phase 1 only
4. Gate Phase 2 approval on Phase 1 success
5. Reduces committed budget and risk exposure

**Benefits:**
- Reduces risk by proving feasibility in Phase 1
- Allows learning before full Comittment
- Spreads cost over longer time period
- Provides natural kill points if project doesn't prove value

### **Action 6: Adjust Approval Criteria**

**When to use:** Preventing future imbalances, guiding intake decisions

**Process:**
1. Based on current imbalances, create weighted approval criteria
2. Give extra weight to proposals in under-represented categories
3. Give negative weight to proposals in over-represented categories
4. Use criteria consistently in approval decisions

**Example criteria:**

```
Base Score = Strategic Priority Score

Adjustments:
+10 points if project is Innovation (currently under-invested)
+10 points if project is Long-term duration (currently 0%)
-10 points if project is Maintenance (currently over-invested)
-10 points if project is Medium-term (currently 76.9%)
+15 points if project supports under-funded strategic pillar
-5 points if risk score > 80 (already over-exposed to high risk)

Final Score = Base Score + Adjustments
```

Approve projects with highest Final Scores until budget/capacity exhausted.

---

## Best Practices

### **Generate Reports Consistently**

**Monthly generation:** Create report at start of each month
- Track trends over time
- Identify emerging imbalances before they become severe
- Document portfolio evolution

**Before key decisions:** Always generate fresh report before:
- Quarterly portfolio reviews
- New project approval decisions
- Budget planning cycles
- Strategic planning sessions

**Save historical versions:** Archive each report with date stamp
- Compare current to past quarters
- Show stakeholders how portfolio has evolved
- Demonstrate that rebalancing actions are working

### **Ensure Data Quality**

The report is only as good as your underlying data. Maintain quality by:

**Regular project updates:**
- Update health indicators monthly (minimum)
- Keep budgets, forecasts, and schedules current
- Record actual costs and hours

**Complete risk assessments:**
- Use Project Assessment Tool for all active projects
- Reassess risk when project circumstances change
- Don't leave projects un-assessed

**Accurate strategic tagging:**
- Assign correct initiative types (Maintenance, Innovation, etc.)
- Tag projects with supported strategic pillars
- Maintain consistent strategic priority scores

**Proper project phasing:**
- Keep PMI phase current (Initiating, Planning, Executing, etc.)
- Update project states (Approved, In Progress, Closed, etc.) and health indicators (Blocked, Slipping, Late, etc.)
- Don't let project status become stale

### **Share Widely**

Don't keep the report in portfolio management only:

**Executive leadership:** Provides portfolio-level visibility they need for strategic decisions

**Project sponsors:** Shows portfolio context for their projects

**Resource managers:** Helps understand upcoming demand

**Project managers:** Understand where their project fits in the bigger picture

**Finance:** Aligns financial planning with portfolio reality

### **Use as Discussion Tool, Not Mandate**

The report provides data and recommendations, but humans make decisions:

- Don't blindly follow recommendations without considering context
- Use recommendations as starting point for discussion
- Override recommendations when you have good reasons
- Document why you chose to override (for future reference)

### **Act on Insights**

Generating the report without acting on it wastes time:

- Identify top 3 imbalances from each report
- Create action plans to address imbalances
- Assign ownership for each action
- Follow up on action completion in next portfolio review
- Verify next month's report shows improvement

### **Establish Portfolio Targets**

Define organizational targets for:

**Risk exposure:**
- Maximum % of budget in High + Very High risk: ___%
- Minimum % of budget in Low + Very Low risk: ___%

**Initiative type distribution:**
- Target % for Maintenance: ___%
- Target % for Innovation: ___%
- Target % for Growth: ___%
- Target % for Compliance: ___%

**Time horizon distribution:**
- Target % for Short-term: ___%
- Target % for Medium-term: ___%
- Target % for Long-term: ___%

Document these targets and reference them when reviewing reports.

### **Calibrate Your Methodology**

Periodically validate that your assessment methodologies are accurate:

**Risk score validation:**
- Do projects with high risk scores actually experience more problems?
- Do low-risk projects typically succeed as expected?
- Adjust assessment criteria if scores don't predict reality

**Strategic priority calibration:**
- Do high-priority projects actually deliver more strategic value?
- Are priority scores consistent across different evaluators?
- Adjust priority methodology if scores don't reflect true importance

**Initiative type classification:**
- Are projects properly categorized?
- Do team members agree on classifications?
- Update classification guidelines if confusion exists

---

## Conclusion

The Portfolio Status and Balancing Report is your most powerful tool for strategic portfolio management. It transforms raw project data into actionable intelligence about portfolio health, strategic alignment, and balance across multiple dimensions.

**Use this report to:**
- Make informed approval decisions that consider portfolio context
- Identify and correct dangerous imbalances before they cause problems
- Defend difficult kill decisions with objective data
- Communicate portfolio status clearly to executives
- Maintain portfolio alignment with organizational strategy and risk tolerance

**Remember the key principles:**

1. **Generate regularly** – Monthly minimum, before key decisions always
2. **Ensure data quality** – Report is only as good as underlying data
3. **Share widely** – Portfolio management is a team sport
4. **Act on insights** – Reports without action are wasted effort
5. **Track progress** – Compare over time to verify improvements
6. **Balance competing priorities** – Use the report to make explicit trade-offs

Your portfolio represents your organization's future. This report ensures that future is balanced, strategic, and aligned with your objectives.