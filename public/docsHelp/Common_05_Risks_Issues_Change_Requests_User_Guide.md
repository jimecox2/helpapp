![Timebars Logo](../tbimages/logos/timebars-ltd-logo-final.png)
---

# Risks, Issues & Change Requests User Guide

This guide explains how to track and manage Risks, Issues, and Change Requests (RIC) in Agilebars, Timebars, and Costbars applications. The RIC system helps you identify potential problems, log current issues, and manage proposed changes—all directly on your project timeline.

## Table of Contents

1. [Overview: What is the RIC System?](#overview-what-is-the-ric-system)
2. [Quick Start: Creating Your First RIC Item](#quick-start-creating-your-first-ric-item)
3. [Visual Indicators on the Canvas](#visual-indicators-on-the-canvas)
4. [Accessing the RIC Management Page](#accessing-the-ric-management-page)
5. [Card View: Visual Management](#card-view-visual-management)
6. [Tabular View: Data Analysis](#tabular-view-data-analysis)
7. [Search and Filter](#search-and-filter)
8. [Editing with FOCD Forms](#editing-with-focd-forms)
9. [Managing Risks](#managing-risks)
10. [Managing Issues](#managing-issues)
11. [Managing Change Requests](#managing-change-requests)
12. [Customizing Forms and Picklists](#customizing-forms-and-picklists)
13. [Tips and Best Practices](#tips-and-best-practices)
14. [Troubleshooting](#troubleshooting)
15. [Data Storage](#data-storage)
16. [Related Help Topics](#related-help-topics)
17. [Summary](#summary)

---

## Overview: What is the RIC System?

The **RIC (Risks, Issues, Change Requests) system** allows you to:

- **Track Risks**: Potential problems that might occur in the future
- **Manage Issues**: Problems that are happening right now
- **Handle Change Requests**: Proposed changes to project scope, schedule, or budget

**Key Concepts:**
- RIC items are created as regular tasks using the Bar Creator
- Each item is classified by changing the **SubType** field (Risk, Issue, or CR)
- Visual indicators appear automatically on the Canvas (R, I, or CR prefix)
- Dedicated views provide filtering, searching, and detailed tracking
- Customize forms to match your organization's methodology

---

## Quick Start: Creating Your First RIC Item

### Step-by-Step Creation

1. **Create a Task Bar:**
   - Click **Main Menu > New Bar**
   - Drag the Task Creator Bar (blue) onto a Project Bar (green)
   - Drop to create the task

2. **Open the Form:**
   - Click on the **bar name** to open the Slide Out Right Form

3. **Change Name:**
   - Update the task name to describe your Risk, Issue, or CR
   - Examples:
     - "R-Database Migration Failure Risk"
     - "I-Server Outage on Production"
     - "CR-Add Mobile App Support"

4. **Set SubType:**
   - Find the **SubType** field in the form
   - Change from "Task" to **"Risk"**, **"Issue"**, or **"CR"**

5. **Visual Indicator Appears:**
   - **Risk**: Bold **R** prefix appears before bar name
   - **Issue**: Bold **I** prefix appears before bar name
   - **Change Request**: Bold **CR** prefix appears before bar name

6. **Save and Close:**
   - Data saves automatically
   - Close the form

**That's it!** You've created a RIC item. Now let's explore how to track and manage it.

---

## Visual Indicators on the Canvas

RIC items display with automatic visual indicators to help you quickly identify them:

### Prefix Letters

- **R** = Risk
- **I** = Issue
- **CR** = Change Request

### Color Coding by Status

When you set the **Status** field to specific values, the visual indicator changes:

| Status | Visual Effect | When to Use |
|--------|---------------|-------------|
| **Normal** | Black bold letter | Standard priority |
| **Concerned** | **Red letter** with thin red border | Needs attention |
| **Critical** | **RED letter** with thick red border | Urgent action required |

**Example:**
- Normal Risk: **R** Database Migration Failure (black)
- Concerned Issue: **I** Server Outage on Production (red letter, thin border)
- Critical Risk: **R** Security Vulnerability Discovered (red letter, thick border)

---

## Accessing the RIC Management Page

To view and manage all your Risks, Issues, and Change Requests in one place:

1. Choose **Main Menu > RIC** (or **Main Menu > Risks/Issues**)
2. The RIC page opens with **Card View** as the default

**Two View Options:**
- **Card View**: Visual cards with expandable details (recommended for viewing)
- **Tabular View**: Sortable table with all fields (recommended for bulk analysis)

---

## Card View: Visual Management

Card View displays your RIC items as color-coded, expandable cards in a two-column responsive grid.

### Card Colors by Type

- **Risk Cards**: Blue gradient background
- **Issue Cards**: Red gradient background
- **Change Request Cards**: Pink/Purple gradient background

### Card Structure

Each card shows:

**1. Header Section:**
- **Breadcrumb**: Project hierarchy (Portfolio > Program > Project)
- **SubType Chip**: Colored badge (Risk/Issue/CR)
- **ID and Name**: Item identifier and title
- **Action Buttons**:
  - **Edit** (pencil icon) - Opens full FOCD form
  - **Print** (printer icon) - Prints this card

**2. Metadata Section** (Always visible):
- **Parent Project**: Which project this belongs to
- **Dates**: Start/Finish (planned) and Actual dates (if started/completed)
- **Schedule Health**: Color-coded indicator (Green/Yellow/Red)
- **Risk-Specific**:
  - **Probability**: Likelihood rating
  - **Impact**: Severity rating
  - **Score**: Auto-calculated (Probability × Impact) with color coding
  - **Mitigation Status**: Current mitigation progress
- **Escalation Level**: Color-coded (e.g., red for Executives)
- **Owner**: Person responsible
- **Status**: Current status (New, In Progress, Closed, etc.)
- **State**: Workflow state (Awaiting Approval, Approved, etc.)
- **Category**: Classification type
- **Priority**: Color-coded (Immediate, High, Normal, Low)

**3. Details Section** (Expandable - Click "Show Details"):

**For Risks:**
- Description
- Executive Summary
- Notes
- Risk Response Strategy (rich text)
- Mitigation Plan (rich text)
- Contingency Plan (rich text)

**For Issues:**
- Description
- Executive Summary
- Notes

**For Change Requests:**
- **Tabbed Interface** with 4 tabs:
  - **Overview**: Description, Executive Summary, Problem/Opportunity
  - **Impact Assessment**: Schedule, Budget, Scope, Resource Commentary
  - **Benefits & Justification**: Expected Benefits, Cost-Benefit Analysis, Options Analysis
  - **Notes**: Implementation Approach, Next Steps, Dependencies

### Inline Editing in Cards

You can edit text fields directly in the cards:

1. Click "Show Details" to expand the card
2. Click on any text field
3. Edit the content
4. Click outside the field to save automatically
5. Rich text editors available for Risk strategy/plan fields

**Note:** Some fields require opening the full FOCD form to edit.

---

## Tabular View: Data Analysis

Tabular View displays all RIC items in a sortable, scrollable table—ideal for analysis and reporting.

### Features

- **Sortable Columns**: Click any column header to sort ascending/descending
- **Fixed Actions Column**: Edit button always visible on the left
- **Horizontal Scrolling**: Scroll right to see all columns
- **Compact View**: See many items at once
- **Quick Access**: Click Edit button to open FOCD form

### Available Columns

The table includes columns for:
- Actions (Edit button)
- Hierarchy (L1, L2, L3)
- ID, Name, SubType
- Start Date, Finish Date, Actual Start, Actual Finish
- Owner, Status, State, Priority
- **Risk Fields**: Probability, Impact, Score, Category, Mitigation Status, Escalation Level
- **Health Indicators**: Schedule Health (color-coded)
- Description, Executive Summary, Notes

### Sorting Data

1. Click any column header (e.g., "Priority")
2. Data sorts ascending
3. Click again to sort descending
4. Default sort: Hierarchy Order (top to bottom as on Canvas)

---

## Search and Filter

Both Card View and Tabular View include powerful search and filter tools at the top of the page.

### Free-Text Search

**Search Box** (top of page):
- Type any text to search across all fields
- Results filter in real-time as you type
- Searches: Names, Descriptions, Notes, all text content

**Example:**
- Type "database" to find all items mentioning database
- Type "migration" to find migration-related items

### Picklist Filters

**Filter Dropdowns**:
- Multiple dropdown filters available
- Filter by any picklist field:
  - **SubType**: Show only Risks, Issues, or CRs
  - **Status**: Active, Closed, On Hold, etc.
  - **Priority**: Immediate, High, Normal, Low
  - **Owner**: Filter by responsible person
  - **Category**: Filter by classification
  - **Escalation Level**: Show only escalated items
  - **State**: Filter by workflow state

**Combining Filters:**
- Select multiple filters to narrow results
- Example: Show only "High Priority Risks" with "Critical Status"

### Recalculate All Button

Click **"Recalculate All"** to:
- Refresh all calculated fields
- Recalculate every Risk Score from its current Probability and Impact (use this after any change to those picklists, and to clear scores left over from the old 0-100 scale)
- Ensure data consistency across views
- Rebuild system-generated data

---

## Editing with FOCD Forms

FOCD (Field-Oriented Control Design) forms provide detailed editing of all RIC metadata.

### Opening a FOCD Form

**Three Ways to Open:**
1. Click **Edit button** (pencil icon) on any card
2. Click **Edit button** in Tabular View row
3. Click on a bar on the Canvas, then click **Edit** in the popup

**Two Form Types:**
- **Risk Edit Form (dfRisk)**: For Risks and Change Requests
- **Issue Edit Form (dfIssue)**: For Issues

### Form Features

**Auto-Save:**
- Changes save automatically to the database when you move off a field
- No "Save" button needed for most edits

**Rich Text Editors (Risks Only):**
Three fields use rich text editors:
- **Risk Response Strategy**: Formatted text with bold, italic, lists
- **Mitigation Plan**: Detailed action plans with formatting
- **Contingency Plan**: Backup plans with formatting

**Risk Score Calculator:**
- When you change **Probability** or **Impact**, the **Score** field updates automatically
- Formula: Score = Probability (1-5) x Impact (1-5) = 1 to 25, higher is worse

**Field Types:**
- **Text Inputs**: Standard single-line text
- **Dropdowns**: Picklist selections
- **Text Areas**: Multi-line text with auto-resize
- **Rich Editors**: Formatted text (Risks only)
- **Date Pickers**: Calendar date selection
- **Section Headers**: Organize fields into groups

### Form Actions

**Save Button:**
- Click to explicitly save all changes
- Returns to Card or Tabular View

**Move/Resize Fields Button:**
- Click to enter customization mode
- Drag fields to reposition
- Resize using edge handles
- Click "Stop" to save layout

**Close Button (X):**
- Saves changes and closes form
- Reloads application with updated data

---

## Managing Risks

Risks are potential problems that might occur in the future. Effective risk management helps you prevent issues before they happen.

### Core Risk Fields

When managing a Risk, you'll work with these key fields:

#### 1. **Probability** (Likelihood)
How likely is this risk to occur? Each value carries a weight of 1 to 5, used to
calculate the Score:

| Value | Weight |
|---|---|
| Very Unlikely | 1 |
| Unlikely | 2 |
| Likely | 3 |
| Very Likely | 4 |
| Certain | 5 |
| Not Assessed | *no weight — the risk scores 0* |

> **Do not rename these five values.** The weights are held in the application
> code and matched by exact text, so a renamed value stops scoring altogether and
> the risk silently reads Not Assessed. You may add values, but only these five
> produce a score. See *Customizing picklists* below.

---

#### 2. **Impact** (Severity)
How severe would the consequences be if this risk occurs? Consider schedule,
budget, scope and quality. Each value carries a weight of 1 to 5:

| Value | Weight |
|---|---|
| Very Low | 1 |
| Low | 2 |
| Medium | 3 |
| High | 4 |
| Very High | 5 |
| Not Assessed | *no weight — the risk scores 0* |

> The same warning applies: these five values are matched by exact text and must
> not be renamed.

---

#### 3. **Score** (Auto-Calculated)

The Score follows the standard **5x5 probability-impact matrix** used by PMBOK,
ISO 31000, PRINCE2 and M_o_R:

> **Score = Probability (1-5) x Impact (1-5) → 1 to 25, where higher is worse.**

It is calculated for you the moment you set both axes, on every surface — the
risk form, the cards, the tabular view and the inline grid.

**Set only one axis and the score stays 0.** So does setting either to
*Not Assessed*. A score of 0 means *not assessed*, and is deliberately outside
the valid 1-25 range so it can never be mistaken for a real, low assessment.

**The four bands:**

| Band | Score | Reading |
|---|---|---|
| **Low** | 1-4 | green |
| **Moderate** | 5-9 | amber |
| **High** | 10-14 | orange |
| **Extreme** | 15-25 | red |
| *Not Assessed* | 0 | grey |

The score displays as the number and its band together — `12 - High` — so the
reading never depends on remembering where the boundaries fall.

**Worked examples:**

| Probability | Impact | Score | Band |
|---|---|---|---|
| Certain | Very High | 25 | Extreme |
| Likely | High | 12 | High |
| Unlikely | Medium | 6 | Moderate |
| Very Unlikely | Very Low | 1 | Low |
| Likely | *(not set)* | 0 | Not Assessed |

##### The risk matrix panel

The risk form carries a **5x5 heat map** showing all 25 combinations, with your
assessed cell ringed. Probability runs down the rows worst-first and Impact
across the columns, so it reads like any published risk heat map. Hovering a cell
tells you its combination, score and band, and a legend underneath shows the four
band ranges.

**The panel is draggable** — move it aside if it covers a field you are working
on.

> **A note if you have used earlier versions.** The score used to run the other
> way: it was normalised to 0-100 and inverted, so 100 meant *safest*. Most of
> the product read it as higher-is-worse, which meant the safest risk on a card
> rendered in the loudest red and the most dangerous one in plain small text.
> The scale, the colours and the matrix now all run the same direction. **Scores
> recorded under the old scale are meaningless on the new one** — reassess, or
> run **Recalculate All**, which recalculates every score from its Probability
> and Impact.

---

#### 4. **Category**
Classify the type of risk:

**Default Values for Risks:**
- Strategic: Alignment with business goals
- Financial: Budget and funding risks
- Operational: Day-to-day operations
- Technical: Technology and system risks
- Organizational: People and structure risks

---

#### 5. **Risk Response Strategy**
Your written approach to handling the risk.

**Common Strategies:**
- **Avoid**: Change plans to eliminate the risk
- **Mitigate**: Reduce likelihood or impact
- **Transfer**: Shift risk to third party (insurance, vendor)
- **Accept**: Acknowledge risk and prepare to deal with it

**Field Type:** Rich text editor (supports formatting)

---

#### 6. **Mitigation Plan**
Detailed actions to reduce the risk.

**What to Include:**
- Specific steps to take
- Who is responsible for each step
- Timeline for completion
- Resources needed
- Success metrics

**Field Type:** Rich text editor (supports formatting)

---

#### 7. **Mitigation Status**
Track progress of your mitigation efforts.

**Default Values:**
- Identified: Risk recognized but not yet assessed
- Assessed: Analysis complete
- Mitigation Planned: Plan created
- In Progress: Executing mitigation
- Mitigated: Risk reduced to acceptable level
- Under Review: Evaluating effectiveness
- Accepted: Acknowledged without mitigation
- Transferred: Shifted to third party
- Escalated: Raised to higher management
- Closed: Risk no longer relevant
- Deferred: Postponed to later

---

#### 8. **Contingency Plan**
Backup plan if the risk occurs despite mitigation.

**What to Include:**
- Fallback actions
- Resources reserved for response
- Decision triggers
- Communication plan

**Field Type:** Rich text editor (supports formatting)

---

#### 9. **Escalation Level**
Who needs to be informed if this risk materializes?

**Default Values:**
- Executives: C-level notification
- Directors: Department heads
- Project Office: PMO oversight
- Not Assessed

**Display:** Color-coded based on level

---

#### 10. **Trigger Event**
What event or condition signals this risk is occurring?

**Examples:**
- "Server CPU usage exceeds 80% for 24 hours"
- "Project spend reaches 90% of budget with 40% work remaining"
- "Key vendor misses two consecutive delivery dates"

**Field Type:** Plain text area

---

#### 11. **Early Warning Indicators**
Metrics or signals to detect the risk early.

**Examples:**
- Weekly defect trend increasing
- Resource availability dropping below threshold
- Velocity declining for two sprints
- Stakeholder engagement score decreasing

**Field Type:** Plain text area

---

### Risk Management Workflow

**Step 1: Identify**
1. Create Risk item on Canvas (SubType = Risk)
2. Give it a clear, descriptive name
3. Set Category for classification

**Step 2: Assess**
1. Open RIC page (Main Menu > RIC)
2. Find your risk and click Edit
3. Set **Probability** and **Impact**
4. Review calculated **Score**
5. Set **Escalation Level** if needed

**Step 3: Plan Response**
1. Write **Risk Response Strategy** (Avoid/Mitigate/Transfer/Accept)
2. Detail **Mitigation Plan** with specific actions
3. Write **Contingency Plan** as backup
4. Set **Trigger Event** and **Early Warning Indicators**
5. Assign **Owner**
6. Set **Mitigation Status** to "Mitigation Planned"

**Step 4: Execute Mitigation**
1. Update **Mitigation Status** to "In Progress"
2. Add progress **Notes** regularly
3. Monitor early warning indicators
4. Update **Status** to "Concerned" or "Critical" if risk increases

**Step 5: Monitor and Close**
1. Review risk regularly (weekly/monthly)
2. Update Probability/Impact if conditions change
3. When risk is addressed:
   - Set **Mitigation Status** to "Mitigated" or "Closed"
   - Set **Status** to "Closed"
   - Document outcome in **Notes**

---

## Managing Issues

Issues are problems that are happening right now and require immediate attention.

### Core Issue Fields

Issues use simpler fields than Risks since the problem has already occurred:

#### Key Fields:
- **Description**: What is the problem?
- **Executive Summary**: High-level summary for management
- **Notes**: Updates on resolution progress
- **Status**: Current state (New, In Progress, Closed, etc.)
- **State**: Workflow tracking (Awaiting Input, Under Review, etc.)
- **Priority**: Urgency level (Immediate, High, Normal, Low)
- **Owner**: Person responsible for resolving
- **Escalation Level**: Who needs to know (Executives, Directors, Project Office)
- **Category**: Type of issue

**Category Values for Issues:**
- Product: Product defects or problems
- Financial: Budget or cost issues
- Operational: Process or operational problems
- Technical: Technical failures or bugs
- Schedule: Timeline delays

### Issue Management Workflow

**Step 1: Log the Issue**
1. Create Issue item on Canvas (SubType = Issue)
2. Give it a clear name describing the problem
3. Set **Priority** based on urgency
4. Set **Category** for classification

**Step 2: Assess**
1. Open RIC page and click Edit
2. Write detailed **Description** of the problem
3. Write **Executive Summary** for stakeholders
4. Set **Escalation Level** if critical
5. Assign **Owner** to resolve

**Step 3: Resolve**
1. Update **Status** to "In Progress"
2. If urgent: Set Status to "Concerned" or "Critical" (triggers red visual indicator)
3. Add **Notes** with resolution activities
4. Update **State** as it moves through workflow (e.g., "Awaiting Approval")

**Step 4: Close**
1. When resolved:
   - Set **Status** to "Closed"
   - Document resolution in **Notes**
   - Set **Actual Finish** date
2. Review **Notes** to capture lessons learned

---

## Managing Change Requests

Change Requests (CRs) track proposed changes to project scope, schedule, budget, or resources.

### Core CR Fields

CRs have extensive fields to justify and analyze the proposed change:

#### Overview Tab:
- **Description**: What is the change?
- **Executive Summary**: High-level summary
- **Problem/Opportunity**: What drives this change?

#### Impact Assessment Tab:
- **Schedule Commentary**: How does this affect timeline?
- **Budget Commentary**: Cost impact
- **Scope Commentary**: How does scope change?
- **Resource Commentary**: Resource needs

#### Benefits & Justification Tab:
- **Expected Benefits**: What do we gain? (Rich text editor)
- **Cost-Benefit Analysis**: Is it worth the investment?
- **Options Analysis**: What alternatives were considered?

#### Notes Tab:
- **Implementation Approach**: How will we execute?
- **Next Steps**: Immediate actions
- **Key Dependencies**: What's needed to proceed?

#### Common Fields:
- **Owner**: CR sponsor/requestor
- **Status**: Approval status
- **State**: Workflow state (Awaiting Approval, Approved, etc.)
- **Priority**: Importance level

### Change Request Workflow

**Step 1: Submit CR**
1. Create CR item (SubType = CR)
2. Name it clearly (e.g., "CR-Add Mobile App Support")
3. Open RIC page, find CR, click Edit

**Step 2: Document Justification**
1. **Overview Tab**:
   - Write detailed **Description**
   - Write **Executive Summary**
   - Explain **Problem/Opportunity**
2. **Benefits Tab**:
   - Document **Expected Benefits** (use rich text formatting)
   - Complete **Cost-Benefit Analysis**
   - Describe **Options Analysis** (alternatives considered)

**Step 3: Assess Impact**
1. **Impact Assessment Tab**:
   - **Schedule Commentary**: Add X weeks? Delay milestone?
   - **Budget Commentary**: Cost increase? Source of funds?
   - **Scope Commentary**: What's added/removed?
   - **Resource Commentary**: Need additional people/skills?

**Step 4: Plan Implementation**
1. **Notes Tab**:
   - **Implementation Approach**: How will we execute?
   - **Key Dependencies**: What must happen first?
   - **Next Steps**: Immediate actions
2. Set **Owner** (requestor)
3. Set **Priority**

**Step 5: Approval Process**
1. Set **State** to "Requested Approval"
2. Update **Status** and **State** as it moves through workflow:
   - Awaiting Approval
   - Approved / Rejected
   - Awaiting Implementation
3. Add **Notes** with decision rationale

**Step 6: Implementation or Closure**
- If Approved: Create tasks to implement, link to CR
- If Rejected: Set **Status** to "Rejected", document reason
- If Complete: Set **Status** to "Closed"

---

## Customizing Forms and Picklists

The Risk and Issue forms, and every picklist behind them, are configured the same
way as everything else in the product. The **Forms, Reports and Graphs Guide** is the
full reference; this section covers only what is specific to Risks, Issues and CRs.

> Earlier versions of this guide routed you through *Reports > Data Management
> Grids*. **That screen no longer exists.** Configuration now lives on five
> reports under **Report Menu > Other**.

### Show, hide, move and add fields

**Report Menu > Other > Fields Values.** Filter the **Form** column to `dfRisk` or
`dfIssue` and you have every field on that form, one per row.

| To do this | Do this |
|---|---|
| Hide a field | open it on the form and set **Show** to `No` |
| Show it again | set **Show** back to `Yes` |
| Reposition or resize | edit **Top**, **Left** and **Width** directly in the grid |
| Add a field | filter to the form first, click **Add**, then pick the field name |
| Remove a field | delete its row |

The layout columns are the only cells in that report you edit in the grid rather
than on the form — because laying out a form means comparing one field's numbers
against its neighbours'.

**Or move fields by hand.** Open a Risk or Issue form, click the
**Move/Resize Fields** button, drag the fields where you want them, and click
**Stop** to save. Easier than typing coordinates for small adjustments.

### Which picklists drive Risks, Issues and CRs

**Report Menu > Other > Picklist Values.** Filter to the picklist, open a value,
edit it.

| Picklist | Field | Notes |
|---|---|---|
| **Risk Probability** | `tbMDProbability` | **Do not rename the five scoring values** — see below |
| **Risk Impact** | `tbMDImpact` | **Do not rename the five scoring values** |
| **Risk Category** | `tbMDCategory` | free to customise; add your own |
| **Issue Category** | `tbMDCategory` | free to customise |
| **CR Category** | `tbMDCategory` | free to customise |
| **Mitigation Status** | `tbMDMitigationStatus` | free to customise, with one exception: **`Escalated`** is read by the health rules |
| **Escalation Level** | `tbMDEscalationLevel` | **`Executives`, `Directors`, `Project Office`** are read by the health rules |
| **Timebar Status** | `tbMDStatus` | **`Closed`** and **`Rejected`** are what make an item stop counting |
| **Approval State** | `tbMDState` | the workflow states |
| **Timebar Priority** | `tbMDPriority` | free to customise |
| **RandIStage**, **RandIState**, **RandIStatus** | R&I workflow | free to customise |

> **Values in bold are locked.** They carry a padlock in Picklist Values and
> cannot be renamed there, because the application compares against that exact
> text. You may always **add** your own values to any of these lists.

### Why the locked values matter here specifically

Risks, Issues and Change Requests do not just describe themselves — they drive
their parent project's **Scope, Risk and Issue health indicators**. Those rules
read your items by exact value:

- An item stops counting toward health once its Status is **`Closed`** or
  **`Rejected`**.
- An open item escalated to **`Executives`** or **`Directors`**, or a risk whose
  Mitigation Status is **`Escalated`**, turns the parent's indicator **Red**.
- An open item escalated to **`Project Office`**, or three or more open items,
  turns it **Yellow**.

Rename one of those values and the health rules stop seeing your escalations —
without any error. The *Forms, Reports and Graphs Guide* covers the full rule set.

### People fields come from the Resource Pool

**Contact / Requestor**, and the other person-named fields on these forms, no
longer read a picklist of typed names. They read the **live Resource Pool** — the
`Human` rows in Resources. To change who can be picked, maintain the resource
pool, not the Tags table.

---

## Tips and Best Practices

### Risk Management

1. **Regular Reviews**: Review risks weekly or bi-weekly
2. **Update Probability/Impact**: Reassess as conditions change
3. **Monitor Early Warnings**: Track indicators proactively
4. **Document Triggers**: Define clear conditions that signal risk is occurring
5. **Keep Plans Current**: Update mitigation plans as you learn more
6. **Use Visual Indicators**: Set Status to "Concerned" or "Critical" for urgent risks

### Issue Management

1. **Log Immediately**: Create issues as soon as problems occur
2. **Escalate Appropriately**: Set Escalation Level for critical issues
3. **Update Progress**: Add Notes regularly with resolution activities
4. **Set Clear Ownership**: Always assign an Owner
5. **Close Properly**: Document resolution and lessons learned
6. **Use Red Indicators**: Set Status to "Critical" for urgent issues to trigger visual alerts

### Change Request Management

1. **Complete Justification**: Fill all Impact Assessment fields
2. **Quantify Benefits**: Use specific metrics in Expected Benefits
3. **Consider Alternatives**: Document Options Analysis thoroughly
4. **Track Through Workflow**: Update State as approval progresses
5. **Link to Implementation**: Create implementation tasks and link to CR

### General Best Practices

1. **Consistent Naming**: Use prefixes (R-, I-, CR-) in names
2. **Use Categories**: Classify items for better filtering
3. **Set Priorities**: Helps sort and filter critical items
4. **Leverage Search**: Use search box to find items quickly
5. **Print Cards**: Print individual cards for meetings or reviews
6. **Regular Recalculation**: Click "Recalculate All" periodically to ensure data accuracy
7. **Customize Forms**: Remove unused fields to simplify forms
8. **Standardize Picklists**: Ensure team uses consistent terminology

---

## Troubleshooting

### Visual Indicator Not Appearing

**Problem:** R, I, or CR prefix doesn't show on Canvas

**Solution:**
1. Verify **SubType** field is set to "Risk", "Issue", or "CR" (exact spelling)
2. Refresh Canvas (click Refresh icon on top menu)
3. If still missing, Right-click Canvas > Recalculate All

---

### Status Not Turning Red

**Problem:** Set Status to "Concerned" but letter doesn't turn red

**Solution:**
1. Ensure exact spelling: "Concerned" or "Critical"
2. Check tbTags store has these values defined
3. Refresh Canvas after changing Status

---

### Risk Score Not Calculating

**Cause:** One axis is missing, or a value has been renamed.

**Solution:**
1. Set **both** Probability **and** Impact — one alone always scores 0.
2. Check neither is set to **Not Assessed**, which also scores 0.
3. If both are set and the score is still 0, the picklist value has been renamed.
   The five scoring values in each list are matched by exact text: `Very Unlikely`,
   `Unlikely`, `Likely`, `Very Likely`, `Certain` and `Very Low`, `Low`, `Medium`,
   `High`, `Very High`. Restore the original spelling in **Picklist Values**.
4. Run **Recalculate All** to recalculate every score in the database.

**Cause:** The score looks wrong rather than absent — a trivial risk showing red,
or a severe one showing green.

**Solution:** The row is holding a score from the old 0-100 scale, where 100 meant
safest. Run **Recalculate All**; every score is recalculated from its Probability
and Impact on the current 1-25 scale.

### Fields Missing in Form

**Problem:** Expected fields don't appear in Risk or Issue form

**Solution:**
1. Go to **Report Menu > Other > Fields Values**
2. Filter **Form** to `dfRisk` or `dfIssue` and find the field
3. Open it on the form and check **Show** is `Yes`
4. If the field has no row on that form at all, **Add** one and pick the field name
5. Refresh the application after changes

---

### Cannot Edit in Card View

**Problem:** Click on field in card but can't edit

**Solution:**
1. Click **"Show Details"** to expand card first
2. Some fields require full FOCD form—click **Edit button**
3. Ensure you're not in read-only mode

---

### Filters Not Working

**Problem:** Select filter but no results appear

**Solution:**
1. Check that items exist with selected filter value
2. Clear other filters—they may be combining to exclude all results
3. Try Search box to verify items exist
4. Click "Recalculate All" to refresh data

---

## Data Storage

Understanding where RIC data is stored helps with backups, spreadsheet sync, and troubleshooting.

### IndexedDB Stores

**tbTimebars Store:**
- Contains all RIC items as task records
- Key field: **tbSubType** = "Risk", "Issue", or "CR"
- Includes: ID, Name, Type, Start/Finish dates, Hierarchy (L1-L5), Owner

**tbMetaData Store:**
- Contains all metadata fields (100+ fields)
- Links to tbTimebars via **tbMDID** = **tbID**
- Includes: Probability, Impact, Score, Status, Priority, Description, Plans, Commentary

**tbFields Store:**
- Defines FOCD form layouts
- Contains field positions (dfCoordLeft, dfCoordTop)
- Controls field visibility (dfShowYN)
- Filter by **dfFormName** = "dfRisk" or "dfIssue"

### Spreadsheet Sync

RIC items can be exported/imported via spreadsheet:

**Export:**
1. Click **Hamburger Icon > Export to CSV**
2. Files created: `Timebars.csv` and `MetaData.csv`
3. Open tbClientMaster.xlsm spreadsheet
4. Click "Import All" to load data

**Edit in Spreadsheet:**
- Timebars worksheet: ID, Name, SubType, Dates, Hierarchy
- MetaData worksheet: All 100+ metadata fields
- Edit, add rows, copy-paste as needed

**Import:**
- Save spreadsheet
- Drag and drop onto Canvas
- RIC items update from spreadsheet data

---

## Related Help Topics

- [User Interface Guide](https://www.timebars.com/knowledgebase/helparticles/common-02-user-interface-guide) - Creating and editing bars
- [Data Synchronization, Backup, Recovery and Retention Guide](https://www.timebars.com/knowledgebase/helparticles/common-04-data-synchronization-backup-recovery-and-retention-user-guide) - Data stores, backup, import and export
- [Local Reports Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-forms-reports-and-graphs-guide) - Risk and Issue reports
- [Configurable Data Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-forms-reports-and-graphs-guide) - Forms, picklists and the status/health rules

---

## Summary

**Key Takeaways:**

1. **Three Item Types**: Risks (potential problems), Issues (current problems), Change Requests (proposed changes)
2. **Create as Tasks**: Use Bar Creator, then change SubType field
3. **Visual Indicators**: R, I, CR prefixes appear automatically; turn red for Concerned/Critical status
4. **Two Views**: Card View (visual) and Tabular View (analytical)
5. **Powerful Search**: Free-text search plus multiple picklist filters
6. **FOCD Forms**: Detailed editing with auto-save, rich text editors and the risk matrix panel
7. **Risk Management**: Assess Probability and Impact; the Score is the 5x5 matrix product, 1-25, higher is worse
8. **Customizable**: Show/hide fields, move/resize layout, customise picklists - all from Report Menu > Other
9. **Track Workflows**: Use Status and State fields to track approval and resolution
10. **Regular Reviews**: Update items frequently; use visual indicators for urgency

**Effective RIC management helps you prevent problems, resolve issues quickly, and manage changes systematically.**
