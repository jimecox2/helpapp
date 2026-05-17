# Risks, Issues & Change Requests User Guide - Common Across Products
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

This guide explains how to track and manage Risks, Issues, and Change Requests (RIC) in Agilebars, Timebars, and Costbars applications. The RIC system helps you identify potential problems, log current issues, and manage proposed changes—all directly on your project timeline.

## Table of Contents

- [Overview: What is the RIC System?](#overview-what-is-the-ric-system)
- [Quick Start: Creating Your First RIC Item](#quick-start-creating-your-first-ric-item)
- [Visual Indicators on the Canvas](#visual-indicators-on-the-canvas)
- [Accessing the RIC Management Page](#accessing-the-ric-management-page)
- [Card View: Visual Management](#card-view-visual-management)
- [Tabular View: Data Analysis](#tabular-view-data-analysis)
- [Search and Filter](#search-and-filter)
- [Editing with FOCD Forms](#editing-with-focd-forms)
- [Managing Risks](#managing-risks)
- [Managing Issues](#managing-issues)
- [Managing Change Requests](#managing-change-requests)
- [Customizing Forms](#customizing-forms)
- [Customizing Picklists](#customizing-picklists)
- [Tips and Best Practices](#tips-and-best-practices)
- [Troubleshooting](#troubleshooting)
- [Data Storage](#data-storage)
- [Related Help Topics](#related-help-topics)
- [Summary](#summary)

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
5. Rich text editors (Quill) available for Risk strategy/plan fields

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
- Update Risk Scores based on current Probability/Impact
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
Three fields use Quill rich text editors:
- **Risk Response Strategy**: Formatted text with bold, italic, lists
- **Mitigation Plan**: Detailed action plans with formatting
- **Contingency Plan**: Backup plans with formatting

**Risk Score Calculator:**
- When you change **Probability** or **Impact**, the **Score** field updates automatically
- Formula: Score = Probability × Impact

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
How likely is this risk to occur?

**Default Values:**
- Very Unlikely
- Unlikely
- Likely
- Very Likely
- Certain
- Not Assessed

**Tip:** Your organization may customize these values to match your methodology.

---

#### 2. **Impact** (Severity)
How severe would the consequences be if this risk occurs?

**Default Values:**
- Very Low
- Low
- Medium
- High
- Very High
- Not Assessed

**Tip:** Consider impact to schedule, budget, scope, and quality.

---

#### 3. **Score** (Auto-Calculated)
**Formula:** Score = Probability × Impact

The system automatically calculates the Risk Score when you set Probability and Impact. This score helps prioritize which risks need the most attention.

**Color Coding:**
- Scores display with color coding (e.g., green for low, red for high)
- Your organization defines the color thresholds

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

## Customizing Forms

You can customize the Risk Edit Form and Issue Edit Form to match your organization's methodology.

### Show/Hide Fields

Not all fields are relevant to every organization:

**To Hide a Field:**
1. Navigate to **Reports > Data Management Grids**
2. Click **Fields** tab
3. Find the field (search by name, e.g., "Contingency Plan")
4. Click **Edit** (pencil icon)
5. Change **dfShowYN** to "No"
6. Click Save

**To Show a Field:**
- Follow same steps but set **dfShowYN** to "Yes"

### Move and Resize Fields

Arrange fields to match your workflow:

1. Open any FOCD form (Risk or Issue)
2. Click **"Move/Resize Fields"** button
3. **To Move**: Click and drag field to new position
4. **To Resize**: Click field edge and drag to resize width
5. Click **"Stop"** button to save layout
6. Layout saves permanently for your user/organization

**Tip:** Arrange most important fields at the top for quick access.

### Add Custom Fields

Advanced users can add new fields:

1. Navigate to **Reports > Data Management Grids > Fields**
2. Click **Add New** (or import via spreadsheet)
3. Set these properties:
   - **dfName**: Field database name (e.g., "tbMDCustomField")
   - **dfFormName**: "dfRisk" or "dfIssue"
   - **dfType**: NoPicklist, WithPicklist, TextArea, Editor, Band
   - **dfShowYN**: "Yes"
   - **dfCoordLeft**: X position (pixels)
   - **dfCoordTop**: Y position (pixels)
   - **dfWidth**: Width (pixels)
4. Save
5. Field appears in form

---

## Customizing Picklists

Tailor dropdown values to match your organization's terminology.

### How to Edit Picklist Values

1. Navigate to **Reports > Data Management Grids**
2. Click **Tags** tab
3. Search for the picklist name (e.g., "Probability")
4. Click **Edit** (pencil icon) on each value
5. Change the **Short Name** (display text)
6. Save

### Risk-Related Picklists

**Probability:**
- Default: Very Unlikely, Unlikely, Likely, Very Likely, Certain, Not Assessed
- Customize to your scale: (e.g., 0-20%, 21-40%, 41-60%, 61-80%, 81-100%)

**Impact:**
- Default: Very Low, Low, Medium, High, Very High, Not Assessed
- Customize to your scale or dollar ranges

**Category (Risks):**
- Default: Strategic, Financial, Operational, Technical, Organizational
- Add custom categories (e.g., Regulatory, Environmental)

**Mitigation Status:**
- Default: Identified, Assessed, Mitigation Planned, In Progress, Mitigated, Under Review, Accepted, Transferred, Escalated, Closed, Deferred
- Customize to your process stages

### Issue-Related Picklists

**Category (Issues):**
- Default: Product, Financial, Operational, Technical, Schedule
- Add custom categories for your domain

### Common Picklists (All Types)

**Escalation Level:**
- Default: Executives, Directors, Project Office, Not Assessed
- Customize to your org structure

**Status:**
- Default: New, In progress, Closed, On Hold, Rejected
- Add custom: Concerned, Critical (for visual indicators)

**State (Workflow):**
- Default: Spawned, Awaiting Input, Requested Approval, Awaiting Approval, Approved, Awaiting Review
- Customize to your approval workflow

**Priority:**
- Default: Immediate, High, Normal, Low, Not Assessed
- Customize importance levels

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

**Problem:** Score field shows 0 or doesn't update

**Solution:**
1. Ensure you're using the **FOCD form** (not inline editing)
2. Set both **Probability** AND **Impact** fields
3. Values must be numeric (e.g., 1-5 scale)
4. Click "Recalculate All" on RIC page

---

### Fields Missing in Form

**Problem:** Expected fields don't appear in Risk or Issue form

**Solution:**
1. Go to **Reports > Data Management Grids > Fields**
2. Search for field name
3. Check **dfShowYN** = "Yes"
4. Verify **dfFormName** = "dfRisk" or "dfIssue"
5. Refresh application after changes

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
- [Data Structure Guide](https://www.timebars.com/knowledgebase/helparticles/common-03-data-structure-user-guide) - Understanding data stores
- [Local Reports Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-local-reports-and-graphs-guide) - Risk and Issue reports
- [FOCD Forms Guide](https://www.timebars.com/knowledgebase/helparticles/common-04-focd-forms-user-guide) - Form customization

---

## Summary

**Key Takeaways:**

1. **Three Item Types**: Risks (potential problems), Issues (current problems), Change Requests (proposed changes)
2. **Create as Tasks**: Use Bar Creator, then change SubType field
3. **Visual Indicators**: R, I, CR prefixes appear automatically; turn red for Concerned/Critical status
4. **Two Views**: Card View (visual) and Tabular View (analytical)
5. **Powerful Search**: Free-text search plus multiple picklist filters
6. **FOCD Forms**: Detailed editing with auto-save and rich text editors
7. **Risk Management**: Assess Probability/Impact, calculate Score, plan Mitigation
8. **Customizable**: Show/hide fields, move/resize layout, customize picklists
9. **Track Workflows**: Use Status and State fields to track approval and resolution
10. **Regular Reviews**: Update items frequently; use visual indicators for urgency

**Effective RIC management helps you prevent problems, resolve issues quickly, and manage changes systematically.**
