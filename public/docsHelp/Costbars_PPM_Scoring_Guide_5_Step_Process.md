# Costbars PPM Scoring Guide 5 Step Process
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

## Table of Contents

- [Introduction](#introduction)
- [High-Level Process Diagram](#high-level-process-diagram)
- [Prerequisite Workflow: Establish the Data Foundation](#prerequisite-workflow-establish-the-data-foundation)
- [Project Selection Process: 5 Steps to Approve or Terminate Projects](#project-selection-process-5-steps-to-approve-or-terminate-projects)
- [Quick Reference](#quick-reference)
- [Troubleshooting](#troubleshooting)

---

## Introduction

This guide covers the Costbars Project Portfolio Management (PPM) module - a Five-Step Procedure for Project Approval or Termination.

**What you will learn:**
- **Prerequisite Workflow Process** - Prepare project metadata for project selection
- **Project Selection Process** - How to use Costbars Project Pipeline Scheduler and prioritise, approve or kill projects

---

## High-Level Process Diagram

The PPM (Project Portfolio Management) process can start once the Portfolio of Projects has been resource-loaded and is ready for analysis. If resource-loaded schedules are not feasible—which is often the case—ensure that Hours Estimates and/or Cost Estimates have been entered into each Project Bar within the Portfolio.

![PPM Process](https://cdn.timebars.com/costbars/costbars-process-diagram.png)

## Prerequisite Workflow: Establish the Data Foundation

Before running the Project Selection Process, complete these five setup steps.

---

### Prerequisite Step 1: Configure Resource Pool & Metadata

Download the spreadsheet template through the Hamburger Icon menu. Populate the Resources Tab with resource IDs, names, roles, skills, and rates. Then drag and drop onto the Canvas to build your centralized resource pool.

---

### Prerequisite Step 2: Establish Resource Summary Task

Create a resource summary task that serves as the foundation for resource allocation. This task provides a consolidated view and enables accurate resource planning across the project portfolio.

---

### Prerequisite Step 3: Allocate Resources to Tasks

Assign resources from your centralized pool to specific tasks using the Resource Allocator. The system automatically calculates hours, ensuring accurate workload distribution and capacity planning.

---

### Prerequisite Step 4: Set Strategic Metadata

Configure strategic metadata against projects to determine Strategic Value (SV) Scores. This metadata drives portfolio balance decisions and ensures alignment with organizational priorities.

Set values for each project:
- **Investment Category**
- **Investment Initiative**
- **Investment Objective**
- **Investment Strategy**

> **Tip:** Use the Edit Metadata Icon to launch the Core Form from Tabular or Card View, or use the spreadsheet sync process.

---

### Prerequisite Step 5: Complete Project Assessment

Fill in the Project Assessment form to finalize business cases. This comprehensive assessment captures all critical project information, justification, and expected outcomes.

**Project Assessment Form Fields:**

The Project Assessment captures data that feeds into the AE Score calculation:

| Field | Purpose |
|-------|---------|
| Risk vs Size and Complexity | 0-100 scale rating of project complexity |
| Executive Level Commitment | Level of senior leadership support |
| Estimation Class | SWAG / Based on History / Resource Driven |
| ROM Estimate | Rough Order of Magnitude budget range |
| Health Indicators | Issues, Schedule, Scope status (In-Flight projects) |

**For In-Flight Projects, also assess:**
- Health Issues status (Green/Yellow/Red)
- Health Schedule status (Green/Yellow/Red)
- Health Scope status (Green/Yellow/Red)
- Budget Cost
- Baseline Hours

**For New Projects, also assess:**
- Cost estimate
- Work hours estimate
- State (Approved/Awaiting Approval/etc.)

---

## Project Selection Process: 5 Steps to Approve or Terminate Projects

---

### STEP 1: Prioritize Projects (SV Score)

Calculate Strategic Value based on custom Alignment Values and Order of Importance. The SV Score ranges from 0-100, where 100 indicates perfect alignment with operational strategy. This score becomes the foundation for all prioritization decisions.

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

### STEP 2: Score Projects (Risk/Complexity)

Evaluate projects using multiple data points including health indicators, costs, hours, and Size vs Complexity metrics. Incorporate additional project metadata to generate comprehensive risk scores that identify potential challenges and resource requirements.

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

---

### STEP 3: Level Resources

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

---

### STEP 4: Select Projects

Utilize the bubble chart visualization to quickly identify which projects to kill. Bubble size, color, and position are based on SV Score and Risk Score ranges. Enter your thresholds and run the selection algorithm for data-driven recommendations.

**How to Access:**
1. From the PPM Page, click **Select** or **Bubble Chart** in the actions menu
2. The Bubble Chart view opens

**Understanding the Bubble Chart:**
- **X-Axis:** Strategic Value (SV Score)
- **Y-Axis:** Ability to Execute (AE Score)
- **Bubble Size:** Budget Cost or Forecast Hours
- **Bubble Color:** By Status or by Product

**Quadrant Interpretation:**

| Position | Meaning |
|----------|---------|
| Top-Right (High SV + High AE) | Strategically aligned, more likely to succeed |
| Top-Left (Low SV + High AE) | Misaligned low risk projects |
| Bottom-Right (High SV + Low AE) | Strategically aligned, less likely to succeed |
| Bottom-Left (Low SV + Low AE) | Misaligned and risky projects |

**Selection Process:**
1. Enter SV Score threshold
2. Enter AE Score threshold
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

### STEP 5: Balance the Portfolio

Review the Score Card—is it in balance? Discover anomalies and perform project adjustments as necessary to optimize portfolio balance. Re-select killed projects, kill other projects, or reschedule projects to achieve optimal alignment.

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

---

## Quick Reference

### Menu Actions

| Button | Action |
|--------|--------|
| Prioritize | Generate SV Scores |
| Score | Generate AE Scores |
| Level | Open resource leveling view |
| Select/Bubble Chart | Run selection algorithm |
| Balance/Score Card | Review portfolio balance |
| Tabular View | Spreadsheet-style data view |
| Cards View | Visual card-based view |
| Process Help ❓ | Open PPM documentation |

### Score Color Coding

| Color | Score Range | Meaning |
|-------|-------------|---------|
| Green | ≥80 | Strong |
| Yellow | 60-79 | Moderate |
| Red | <60 | Weak |

---

## Troubleshooting

**Missing Data Warnings:**
- Check that Project Assessment fields are populated
- Verify Risk vs Size/Complexity is assessed (not "Not Assessed")
- Ensure Executive Commitment is set
- For In-Flight: Check health indicators and baseline hours
- For New: Check Estimation Class and ROM Estimate

**Projects Not Appearing:**
- Confirm Status is not "Closed"
- Check State is not "Spawned"

**Financial Score Shows Zero:**
- Need at least 4 of 7 financial fields populated
- Values of "Not Assessed" don't count toward the 4-field minimum

---

*Transform Your Portfolio Management: Data-driven decisions. Strategic alignment. Optimized outcomes.*

*For technical details on scoring algorithms, see the Costbars PPM Technical Design Specification.*