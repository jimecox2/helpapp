
# Local Reports and Graphs Guide - Common Across Products
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

The Reports and Graphs page transforms your project data into actionable insights. Access comprehensive reports, interactive visualizations, and dynamic card views designed for portfolio managers, project leaders, resource planners, and executives across Agilebars, Timebars, and Costbars applications.

## Table of Contents

- [How to Access Reports](#how-to-access-reports)
- [Report Categories](#report-categories)
- [Special Reports](#special-reports)
- [Common Report Features](#common-report-features)
- [Technical Details](#technical-details)
- [Integration with Cloud Dashboard](#integration-with-cloud-dashboard)
- [Tips for Effective Report Use](#tips-for-effective-report-use)
- [Troubleshooting](#troubleshooting)
- [Related Help Topics](#related-help-topics)

---

## How to Access Reports

- Choose **Main Menu > Reports** to launch the Reports menu
- The Reports menu is organized into 5 main categories: General, Portfolio, Project, Task, and Resource
- All reports feature search, filtering, sorting, and export capabilities
- Reports can be published to the Timebars Cloud Dashboard with one click

## Report Categories

### General Reports

**General Tabular View**
- Comprehensive data table displaying all projects, tasks, milestones, and allocations
- Powerful search, filter, and sort capabilities across all fields
- Multiple column presets available:
  - Default Fields: Essential project information
  - Common Fields: Frequently accessed metadata
  - Notes & Descriptions: Detailed project narratives
  - Allocation Fields: Resource assignment details
  - KPI Fields: Key performance indicators
  - Variance Fields: Baseline comparison metrics
  - Investment Fields: Strategic alignment (Costbars)
  - Business Case Fields: Comprehensive investment analysis
- Export to Excel/CSV with one click
- Color-coded rows by type (Portfolio, Project, Task, Milestone)
- Click any row to open the edit form

**General Card View**
- Visual card layout showing projects and tasks
- Each card displays health indicators, status, priority, and key metadata
- Expandable sections for descriptions and notes
- Filter and search across all visible cards
- Color-coded by hierarchy level (Portfolio, Project, Sub-Project, Task)

**Print WBS (Work Breakdown Structure)**
- Professional WBS reports organized by hierarchy
- Shows parent-child relationships with indentation
- Includes WBS number, name, and description
- Copy and paste into markdown editors for sharing
- Export as documentation for project charters or scope baselines

**All Drilldown (Portfolio Hierarchy)**
- Interactive 5-tier hierarchy visualization
- Shows complete structure: Portfolio → Program → Project → Task/Milestone → Allocation
- Collapse and expand any level to focus on specific areas
- Color-coded levels for instant recognition
- Validates parent-child relationships and identifies orphaned items
- Export hierarchy as diagrams (Mermaid or GraphViz formats)

### Portfolio Reports

**PPM Tabular Report**
- Strategic portfolio analysis with dual scoring dimensions
- **Strategic Value (SV) Score**: Alignment with organizational objectives
- **Ability to Execute (AE) Score**: Resource availability and capability
- **Final Decision Score**: Weighted combination for prioritization
- Weekly resource demand grid (32 weeks visibility)
- Investment category, objective, strategy, and initiative fields
- System-generated decision notes
- Search and filter by project selection criteria
- Export for portfolio review meetings

**PPM Cards Report**
- Card-based view of portfolio projects with visual indicators
- Expandable tabs for Benefits, Impact Analysis, and Notes
- Health dashboard with 7 dimensions
- Filter by investment category, status, priority
- Ideal for executive briefings and portfolio planning

**Drilldown from Portfolio**
- Portfolio report with color hierarchy showing all levels
- Visual representation of portfolio structure
- Click to drill down into specific portfolios or programs
- Shows relationships between portfolios, programs, and projects

**PPM Stop Light Report**
- Visual health dashboard with color-coded status indicators
- Red/Yellow/Green indicators across all portfolio dimensions
- Quickly identify projects requiring attention
- Exception-based management view
- Perfect for executive briefings and status meetings

### Project Reports

**Project Status**
- High-level summary of all projects
- Green, yellow, and red health indicators
- Key metrics: schedule variance, cost variance, budget utilization
- Resource allocation status
- Risk and issue counts
- Escalation flags
- Sortable by any column
- Export for weekly status reporting

**Project Core Report**
- Command center for project data in customizable card layout
- **7-Dimension Health Dashboard**: Overall, Scope, Schedule, Cost, Hours, Risk, Issues
- Expandable rich text sections: Executive summaries, descriptions, notes
- Inline editing: Update project fields without leaving the report
- Print-ready layouts for stakeholder distribution
- Real-time health monitoring
- Color-coded cards by project status

**All Tabular**
- One large table showing all columns and all rows available
- Complete dataset with every field in the system
- Advanced filtering across 100+ fields
- Export entire dataset to Excel or CSV
- Useful for comprehensive data analysis

**Project Stop Light Report**
- Individual project health metrics with color indicators
- Drill-down into specific performance areas
- Track trends over time
- Early warning system for project issues
- Ideal for project review meetings

**Baseline Variance Report**
- Compare actual performance against approved baselines
- Variance calculations for:
  - Start Date Variance (days early/late)
  - Finish Date Variance (days early/late)
  - Duration Variance (work days)
  - Work Variance (hours)
  - Cost Variance (budget units)
- Advanced filtering with operators (>, <, =, >=, <=)
- Filter by hierarchy level (L1-L5)
- Type, status, priority, owner filters
- Earned value analysis support

**Business Case Document**
- Comprehensive investment analysis report
- Strategic alignment (category, objective, strategy, initiative)
- Risk and complexity scoring with automated calculations
- Financial metrics (cost, hours, ROI indicators)
- Baseline comparison metrics
- Health indicators (7 dimensions)
- Resource demand by role and project
- Timeline visualization
- Export to PDF for board presentations

### Task Reports

**Items Overdue**
- Automatic identification of overdue tasks and milestones
- Shows items with:
  - Planned finish dates in the past
  - No actual completion date recorded
- Filter by owner, priority, or project
- Sort by days overdue
- Accountability tracking for status meetings
- Escalation identification

**Milestone Horizon**
- Timeline visualization of approaching milestones
- Shows planned completion dates across your portfolio
- Filter by date range, priority, or hierarchy level
- Visual timeline representation
- Dependency planning support
- Critical path visibility
- Delivery forecasting

### Resource Reports

**Resource Usage**
- Comprehensive resource demand visualization
- Multiple rollup options available
- Stacked bar charts showing allocation over time
- 32-week visibility window
- Identify over/under allocation patterns
- Forecast hiring needs
- Balance workloads across teams

**Resource Usage Stacked Charts By:**
- **Resource Name**: Individual allocation patterns
- **Primary Role**: Developer, Architect, PM, Tester, etc.
- **Primary Skill**: Technical skills distribution
- **Location/Office**: Geographic resource distribution
- **Department**: Organizational unit allocation
- **Project**: Project-based resource demand
- **Initials**: Condensed view for large teams

**Resource Usage Detail Table**
- Tabular view with 32-week visibility
- Weekly hours breakdown
- Resource metadata (location, role, skill, department)
- Sortable and exportable
- Supports capacity planning analysis

**Shared Resource Pool**
- Complete resource pool management view
- All resources in the tbResources store
- Shows all resources added by Administrator
- Typically managed via Spreadsheet integration
- Includes:
  - Skills, roles, and competencies
  - Department, location, organizational structure
  - Pay rates, cost codes, financial attributes
  - Availability calendars and capacity
  - Manager, team leader, reporting relationships
- Click any resource to open full resource form for updates
- Skills gap analysis support
- Organization chart maintenance

## Special Reports

### Risk, Issue & Change Management Reports

**Risks and Issues Report (Card View)**

**Risk Cards** (Blue):
- Probability × Impact scoring matrix
- Automated risk score calculation
- Mitigation status and plans
- Escalation tracking
- Assign owners and track mitigation activities

**Issue Cards** (Red):
- Priority and severity classification
- Assignment and ownership
- Resolution tracking
- Impact assessment

**Change Request Cards** (Gradient Blue):
- Requestor and department
- Impact assessment (cost, hours, schedule)
- Benefits and justification
- Options analysis
- Version tracking

All cards support:
- Rich text editor (Quill) for detailed descriptions
- Expandable sections for plans and strategies
- Filter by status, priority, owner
- Search across all text fields
- Export for audit trails

**Risks and Issues Report (Tabular View)**
- Same data as card view in table format
- Sortable columns
- Multi-row selection
- Bulk export capabilities

### Timeline Visualizations

**Horizontal Timeline Report**
- Interactive timeline with draggable event cards
- Events positioned along horizontal date axis
- Persistent positioning (saved in browser)
- Filter and search by name, type, status
- Connector lines from timeline to event details
- Reset positions for fresh layouts
- Perfect for presentations and stakeholder communications

**Vertical Timeline Report**
- Similar to horizontal but oriented vertically
- Project chronologies and milestone sequences flow downward
- Ideal for project storytelling
- Milestone planning visualization
- Dependency relationships

## Common Report Features

All reports in the system share these capabilities:

### Search & Filter
- Free text search across names and descriptions
- Filter by hierarchy level (L1-L5)
- Filter by type (Portfolio, Project, Sub-Project, Task, Milestone, Allocation)
- Filter by status (Active, On Hold, Cancelled, Complete)
- Filter by priority (High, Medium, Low)
- Filter by owner (Resource names)
- Multiple filters can be combined

### Data Export
- **Excel**: Full data export with formatting
- **CSV**: Raw data for external analysis
- **Print**: Print-ready layouts with proper page breaks
- **Copy**: Copy to clipboard for quick sharing

### Visual Indicators
- **Color Coding**: By type, status, priority, health
- **Health Indicators**: Red/Yellow/Green status
- **Icons**: Visual markers for risks, issues, milestones
- **Progress Bars**: Completion percentage visualization

### Direct Editing
- Click any row or card to open edit form
- Inline editing for quick updates
- Changes reflected immediately after saving
- No need to switch between screens

### Report Persistence
- Last viewed report is remembered
- Filter settings saved per report
- Return to your exact view next session

## Technical Details

### Data Sources

Reports query data from IndexedDB stores:
- **tbTimebars**: Core scheduling items (projects, tasks, milestones)
- **tbMetaData**: Extended metadata (status, priority, health, descriptions)
- **tbMdJoined**: Cached join of tbTimebars + tbMetaData for performance
- **tbBaseline**: Baseline snapshots for variance analysis
- **tbResCalcs2**: Weekly/monthly resource demand calculations
- **tbResources**: Resource pool with skills and attributes

### Report Types

1. **Card Reports**: Visual card layouts with health dashboards and expandable sections
2. **DataTable Reports**: Sortable, filterable tabular views using DataTables.net
3. **Chart Reports**: Visualizations using Chart.js and C3.js libraries
4. **Timeline Reports**: Interactive timeline views with drag-and-drop positioning
5. **Hierarchy Reports**: Tree structures with collapse/expand navigation

### Performance

- Reports load asynchronously for smooth user experience
- Data is cached locally for fast subsequent access
- Large datasets are paginated automatically
- Export operations run in background

## Integration with Cloud Dashboard

**One-Click Publishing**: All reports can be published to the Timebars Cloud Dashboard:
- No configuration required
- Customize graph types and filter data sets
- Share with stakeholders via secure links
- Access from any device with internet connection
- Real-time updates when you publish new data

Learn more in the [Cloud Dashboard Guide](common-timebars-cloud-dashboard-and-publishing-guide.md).

## Tips for Effective Report Use

1. **Use Filters**: Start with filters to narrow down large datasets
2. **Bookmark Views**: Save filter combinations for recurring reports
3. **Export Regularly**: Create Excel exports for offline analysis
4. **Leverage Cards**: Use card views for executive presentations
5. **Monitor Health**: Check stop light reports daily for early warnings
6. **Track Variance**: Review baseline variance weekly to maintain control
7. **Resource Planning**: Use stacked charts for capacity planning meetings
8. **Combine Reports**: Use multiple reports together for comprehensive analysis

## Troubleshooting

**Report is Empty or Shows No Data:**
- Check that you have data loaded in the application
- Verify filters are not excluding all results
- Click "Reset Filters" to clear all filter settings
- Ensure you're logged in if using licensed features

**Export Not Working:**
- Check browser pop-up blocker settings
- Verify sufficient disk space for downloads
- Try a different export format (Excel vs CSV)
- Check browser download folder location

**Report Loads Slowly:**
- Large datasets may take time to process
- Close other browser tabs to free memory
- Clear browser cache if persistent
- Consider filtering data before loading report

**Cannot Edit from Report:**
- Ensure you have edit permissions
- Check that the item isn't locked or archived
- Verify browser JavaScript is enabled
- Try refreshing the page

## Related Help Topics

- [How to Use the Spreadsheet Sync](https://www.timebars.com/knowledgebase/helparticles/common-03-spreadsheet-sync-user-guide) - Import/export data for bulk editing
- [Cloud Publishing Guide](https://www.timebars.com/knowledgebase/helparticles/common-07-cloud-publishing-guide) - Publish reports to the cloud
- [User Interface Guide](https://www.timebars.com/knowledgebase/helparticles/common-02-user-interface-guide) - Navigate the application
- [Data Structure Guide](https://www.timebars.com/knowledgebase/helparticles/common-03-data-structure-user-guide) - Understand the data model

---

**The Reports and Graphs system gives you the power to transform raw project data into strategic intelligence—where information meets action.**
