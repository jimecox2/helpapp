# Personal Dashboard Guide
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

The Timebars Personal Dashboard delivers a focused suite of interactive reports, visualizations, and data management tools for individual project managers and team leads. It connects directly and automatically to your **single active pubset** — the pubset you have marked as Active (or "connected") in your Timebars, Agilebars, or Costbars client application. No additional configuration is needed; publish your data and the Personal Dashboard reflects it immediately.

> **Personal Dashboard vs. Enterprise Dashboard**
> The Personal Dashboard (`/personaldashboard`) is designed for a single-pubset workflow: one user, one active data source, instant access. If your organisation needs to combine data from multiple pubsets across projects or teams into a shared portfolio view, see the [Enterprise Dashboard Guide](Common_10_Enterprise_Dashboard_Guide.md) (`/dashboard`).

---

## Table of Contents

- [Personal Dashboard Guide](#personal-dashboard-guide)
  - [Table of Contents](#table-of-contents)
  - [What is the Personal Dashboard?](#what-is-the-personal-dashboard)
  - [How to Access](#how-to-access)
  - [How Publishing Connects to Your Dashboard](#how-publishing-connects-to-your-dashboard)
  - [Dashboard Navigation](#dashboard-navigation)
    - [Report Categories](#report-categories)
  - [Project Status Report (Dashboard Home)](#project-status-report-dashboard-home)
  - [Project Variance Report](#project-variance-report)
  - [Interactive Card-Based Drilldown](#interactive-card-based-drilldown)
    - [Project Status Cards — Hierarchical Navigation](#project-status-cards--hierarchical-navigation)
    - [Four-Level Hierarchy](#four-level-hierarchy)
    - [Interactive Features](#interactive-features)
  - [Agilebars Burndown Chart](#agilebars-burndown-chart)
  - [Resource Cost \& Usage — Pie Charts](#resource-cost--usage--pie-charts)
  - [Resource Usage — Bar Charts](#resource-usage--bar-charts)
  - [Common Features Across All Reports](#common-features-across-all-reports)
    - [Search \& Filter](#search--filter)
    - [Sorting](#sorting)
    - [Inline Editing](#inline-editing)
    - [Health Indicators](#health-indicators)
    - [Responsive Design](#responsive-design)
    - [Performance](#performance)
  - [Data Export \& Integration](#data-export--integration)
    - [Export Options](#export-options)
    - [Cloud Integration](#cloud-integration)
  - [License Tiers \& Report Availability](#license-tiers--report-availability)
  - [Getting Started with the Personal Dashboard](#getting-started-with-the-personal-dashboard)
  - [Tips for Effective Use](#tips-for-effective-use)
  - [Troubleshooting](#troubleshooting)
    - [Dashboard Not Loading](#dashboard-not-loading)
    - [Reports Show No Data](#reports-show-no-data)
    - [Visualization Not Updating](#visualization-not-updating)
    - [Cannot Edit Data](#cannot-edit-data)
  - [Related Help Topics](#related-help-topics)
  - [Support](#support)

---

## What is the Personal Dashboard?

The Personal Dashboard is a web-based platform that transforms data from your Agilebars, Timebars, or Costbars application into dynamic visualizations — graphs, line charts, pie charts, bar charts, and tabular reports. It is powered by the **one pubset you have set as Active** in your client application. Unlike the client apps, which work offline, the Personal Dashboard requires an internet connection and an active subscription.

**Key Benefits:**
- **Zero Configuration**: No dashboard sources to create or manage — your Active pubset is the data source
- **Real-Time Updates**: Changes sync automatically when you re-publish from your client app
- **Anywhere Access**: View reports from any device with a modern web browser
- **Interactive Intelligence**: Filter, sort, search, and drill down through hierarchical data
- **Seven-Dimension Health Tracking**: Monitor project health across Overall, Scope, Schedule, Cost, Hours, Risk, and Issues

---

## How to Access

**Prerequisites:**
- Active Timebars Ltd. Cloud subscription
- Published data from Agilebars, Timebars, or Costbars client application
- An **Active pubset** set in the client app (the one flagged as connected)
- Internet connection

**Two Ways to Access:**

1. **From Client Applications**:
   - After publishing your data, click the **Dashboard** button in the client app
   - You will be automatically logged in and directed to the Personal Dashboard

2. **Direct Web Access**:
   - Visit `www.timebars.com/personaldashboard`
   - Log in with your credentials

---

## How Publishing Connects to Your Dashboard

The Personal Dashboard is powered exclusively by your **Active pubset** — the pubset you have designated as active (connected) in the Publish panel of your client application. This is the key difference from the Enterprise Dashboard, which lets you combine multiple pubsets.

**Workflow:**
1. Open your Timebars, Agilebars, or Costbars client
2. Navigate to **Main Menu → Publish**
3. Log in to the cloud service
4. Identify the pubset with a blue background (your Dashboard/Active pubset)
5. Click **Re-Publish!** to send updated data to the cloud
6. Your Personal Dashboard reflects the new data automatically

For full details on the publishing process, see the [Cloud Publishing Guide](https://www.timebars.com/knowledgebase/helparticles/common-07-cloud-publishing-guide) - Publish reports to the cloud

---

## Dashboard Navigation

The Personal Dashboard uses a **left sidebar navigation** to browse available reports.

### Report Categories

1. **Executive Portfolio Reports**: Portfolio-wide visibility and variance tracking
2. **Card-Based Drilldown**: Interactive hierarchical navigation with health indicators
3. **Charts and Visualizations**: Burndown charts, pie charts, and bar charts
4. **Resource Reports**: Resource allocation, utilization, and cost analysis

**To View a Report:**
- Click any report name in the sidebar
- The report displays in the main viewing area
- Use filters and search to focus on specific data

---

## Project Status Report (Dashboard Home)


Your command center for portfolio-wide visibility. This comprehensive tabular report displays all portfolios, projects, work packages, tasks, and resource allocations from your active pubset in a unified view.

**Key Features:**
- **Multi-Level Search**: Search by project name or unique ID with instant filtering
- **Advanced Filtering**: Filter by Project (L2), Type, Owner, and Status simultaneously
- **Smart Sorting**: Click any column header to sort ascending/descending
- **Color-Coded Rows**: Visual distinction between:
  - Portfolios (light green background)
  - Projects (light orange background)
  - Tasks (default background)
- **Hierarchical Indentation**: Clear visual hierarchy showing Portfolio → Project → Work Package → Task relationships
- **One-Click Details**: Click any row to open a detailed item dialog with full editing capabilities
- **License-Aware Columns**: Display adapts to show Agilebars, Timebars, or Costbars-specific fields based on your license
- **Real-Time Updates**: Data refreshes automatically using SWR caching

**When to Use:**
- Daily portfolio status reviews
- Executive briefings
- Identifying project bottlenecks
- Tracking ownership and accountability
- Quick access to any project detail

**Export Options:**
- Export to Excel with all filtered/sorted data
- Export to CSV for external analysis
- Maintains column order and formatting

---

## Project Variance Report


Track deviations from baseline plans with variance-specific metrics showing the delta between planned and actual performance across cost, schedule, and scope dimensions.

**Key Features:**
- **Variance-Focused Columns**: Baseline vs. actual comparisons for:
  - Start Date Variance (days early/late)
  - Finish Date Variance (days early/late)
  - Duration Variance (work days)
  - Work Variance (hours)
  - Cost Variance (budget units)
- **Deviation Highlighting**: Quickly identify projects off-track from original plans
- **Same Powerful Filtering**: All search, filter, and sort capabilities from the main report
- **Historical Tracking**: Compare current state against original baseline commitments
- **Performance Indicators**: Visual cues for schedule variance, cost variance, and scope creep

**When to Use:**
- Earned Value Management (EVM) analysis
- Monthly project performance reviews
- Identifying projects requiring corrective action
- Forecasting final project outcomes

> **Note:** Baselines must be set in the client application before publishing for this report to show variance data. The [Enterprise Dashboard](https://www.timebars.com/knowledgebase/helparticles/common-10-enterprise-dashboard-guide) offers an equivalent Variance Report across combined pubset sources.

---

## Interactive Card-Based Drilldown

### Project Status Cards — Hierarchical Navigation


Navigate project data in a visually engaging, click-to-drill format with collapsible cards representing each level of your portfolio hierarchy. Navigate from portfolio to project to work package to individual tasks with interactive health indicators on every card.

### Four-Level Hierarchy

**Level 1 — Portfolio Cards** (Light Brown Background)
- High-level portfolio overview cards
- Aggregated health indicators for all projects within
- Click any portfolio card to reveal its projects

**Level 2 — Project Cards** (Light Green Background)
- All projects within the selected portfolio
- Displays project-level health, dates, owner, status
- Click any project card to reveal work packages and associated Tasks/Risks/Issues

**Level 3 — Work Package Cards** (Light Orange Background)
- Work packages within the selected project
- Click any work package to reveal its Level 4 items

**Level 4 — Tasks, Risks, Issues** (Tabbed Interface)
- Detailed tabular data for individual work items
- Separate tabs for:
  - **Tasks Tab**: All tasks with status, dates, owner, progress
  - **Risks Tab**: Risk probability, impact, mitigation status
  - **Issues Tab**: Issue priority, severity, resolution tracking
- Full editing capabilities on each tab

### Interactive Features

**Breadcrumb Navigation Path:**
- Shows current location: L1 > L2 > L3
- Click breadcrumb levels to navigate back up the hierarchy

**Hide/Show Controls:**
- Toggle visibility of card levels as needed
- Collapse levels to focus on specific areas

**Health Indicator Lights:**
Every card displays 7 color-coded health indicators:
- 🟢 **Green**: On track
- 🟡 **Yellow**: Needs attention
- 🔴 **Red**: Critical issue
- 🟠 **Orange**: Not yet assessed

**Seven Health Dimensions:**
1. Overall Health
2. Cost Health
3. Hours Health
4. Risk Health
5. Schedule Health
6. Scope Health
7. Issues Health

**Planned vs. Current Comparison:**
- See baseline dates and current dates side-by-side
- Variance indicators on each card

**When to Use:**
- Executive presentations requiring visual engagement
- Project health assessment at-a-glance
- Understanding risk/issue context within project structure
- Mobile access (card interface is touch-friendly)

---

## Agilebars Burndown Chart


Track sprint velocity and work completion rates with the classic agile burndown chart showing ideal vs. actual progress over time.

**Chart Components:**
- **Ideal Line** (Blue): Planned work burn rate based on sprint timeline
- **Actual Line** (Red/Green): Actual work completion to date
- **X-Axis**: Sprint timeline (days or iterations)
- **Y-Axis**: Remaining work (hours or story points)

**Key Features:**
- Visual comparison of planned burn rate against actual progress
- Sprint performance evaluation and team velocity assessment
- Forecast completion dates

**Prerequisites:**
- Must publish the Active Pubset from the Agilebars client application
- Must run the Burndown calculation in the client before publishing
- Data must include sprint-based work items

**When to Use:**
- Sprint retrospectives and planning
- Daily standup reference
- Velocity trend analysis across sprints

---

## Resource Cost & Usage — Pie Charts


Visualize cost distribution across your active pubset with interactive pie charts breaking down resource costs and hours by multiple dimensions.

**Four Pie Charts Displayed** (2×2 grid):

1. **By Project (L2)**: Which projects consume the most resources
2. **By Resource Role**: Cost distribution across Developer, Manager, QA, Architect, etc.
3. **By Resource Location**: Geographic cost analysis (Office locations, Remote, Offshore)
4. **By Department**: Departmental resource allocation and spend

**Indicator Cards** (Top of Page):
- **Total Cost Cards**: Prominent cards showing total costs for each dimension
- **Currency Formatting**: Professional $USD formatting with thousands separators

**Interactive Features:**
- **Hover Details**: Hover over pie slices for exact values and percentages
- **Legend**: Color-coded legend with labels
- **Percentage Labels**: Show percentage on larger slices

**When to Use:**
- Monthly financial reviews
- Budget allocation decisions
- Chargeback reporting to business units
- Resource planning and forecasting

---

## Resource Usage — Bar Charts


Detailed bar chart analysis of resource utilization across six critical dimensions showing both hours and cost consumption patterns.

**Six Resource Dimensions:**

1. **By Resource Name**: Individual resource utilization and costs
2. **By Project (L2)**: Project-level resource consumption
3. **By Resource Role**: Role-based allocation analysis (PM, Dev, QA, Architect, BA, etc.)
4. **By Primary Skill**: Skill-based resource distribution (Java, Python, Cloud, Database, etc.)
5. **By Resource Location**: Geographic resource allocation
6. **By Department**: Departmental resource usage

**Chart Features:**
- **Stacked Bar Charts**: Show both hours (blue) and cost (green) in single view
- **Dual Y-Axis**: Left axis for hours, right axis for costs
- **Legend Toggle**: Show/hide hours or cost bars independently
- **Configurable Metadata**: Works with your custom metadata fields from the Timebars client

**When to Use:**
- Resource capacity planning meetings
- Skill gap identification for hiring
- Utilization rate analysis
- Workforce planning decisions

---

## Common Features Across All Reports

### Search & Filter

**Text Search:**
- Search by project name or description, or by unique ID
- Instant filtering as you type (case-insensitive)

**Multi-Select Filters:**
- **By Project**: Filter to specific project (L2 level)
- **By Type**: Portfolio, Project, Sub-Project, Task, Milestone, Allocation
- **By Owner**: Filter by assigned resource
- **By Status**: Active, On Hold, Cancelled, Complete
- **"All" Option**: Clear a specific filter dimension instantly

**Filter Combinations:**
- Combine multiple filters for precise data views
- Filters persist during navigation
- Clear all filters with one click

### Sorting

- Click any column header to sort ascending/descending
- Arrow indicators show current sort direction
- Maintains filter state during sort operations

### Inline Editing

- Click the row action button (pencil icon) to open the edit dialog
- Full CRUD operations directly from reports
- Built-in field validation prevents data errors
- Changes sync immediately to the backend

### Health Indicators

**Seven-Dimensional Health Tracking** — all cards and detail views display:

| Dimension | Green | Red |
|-----------|-------|-----|
| Overall Health | On track | Critical |
| Cost Health | Under budget | Over budget |
| Hours Health | On track | Over hours |
| Risk Health | Low risk | High risk |
| Schedule Health | On schedule | Late |
| Scope Health | Stable | Scope creep |
| Issues Health | No critical issues | Critical issues |

**Color Coding:**
- 🟢 Green: On track / healthy
- 🟡 Yellow: Needs attention / at risk
- 🔴 Red: Critical issue / off track
- 🟠 Orange: Not yet assessed / no baseline

### Responsive Design

- Touch-optimized controls for tablets and phones
- Adaptive column display on smaller screens
- Fixed headers during scroll on desktop

### Performance

- **SWR Caching**: Client-side data caching for instant navigation
- **Automatic Revalidation**: Data stays fresh with background updates
- **Loading States**: Professional loading indicators during data fetch
- **Error Handling**: Graceful error messages with retry options

---

## Data Export & Integration

### Export Options

Available on all tabular reports:

- **Excel Export**: Full data export with formatting
- **CSV Export**: Raw data for external analysis tools
- **Maintains Filters**: Export only filtered/sorted data
- **One-Click Download**: Simple download button

### Cloud Integration

**Seamless Data Flow:**

1. **Publish from Client**: One-click publish from the Timebars/Agilebars/Costbars desktop client selects the Active pubset and sends data to the cloud
2. **Real-Time Sync**: Changes reflect in the dashboard within seconds of publishing
3. **Secure Authentication**: Enterprise-grade JWT security, encrypted data transmission (HTTPS/TLS)
4. **Multi-User Viewing**: Multiple users can view the dashboard simultaneously

See the [Cloud Publishing Guide](https://www.timebars.com/knowledgebase/helparticles/common-07-cloud-publishing-guide) - Publish reports to the cloud for full publishing instructions.

---

## License Tiers & Report Availability

| Report | Basic (T01) | Standard (T02) | Professional (T03) |
|--------|:-----------:|:--------------:|:-----------------:|
| Project Status Report | ✓ | ✓ | ✓ |
| Export to Excel/CSV | ✓ | ✓ | ✓ |
| Project Variance Report | — | ✓ | ✓ |
| Resource Pie Charts | — | ✓ | ✓ |
| Resource Bar Charts | — | ✓ | ✓ |
| Card-Based Drilldown | — | ✓ | ✓ |
| Burndown Charts (Agilebars) | — | — | ✓ |
| Advanced analytics | — | — | ✓ |

**Check Your License:**
- View license details in the client app: **Main Menu → Publish → Show License**
- Upgrade at `www.timebars.com/pricing`

---

## Getting Started with the Personal Dashboard

**Step-by-Step:**

1. **Publish Your Data**:
   - Open your Timebars, Agilebars, or Costbars client
   - Navigate to **Main Menu → Publish**
   - Log in to the cloud service
   - Click **Activate** if this is your first time (one-time setup)
   - Identify the pubset with a blue background (your Active/Dashboard pubset)
   - Click **Re-Publish!** to send data to the cloud

2. **Access the Personal Dashboard**:
   - Visit `www.timebars.com/personaldashboard`
   - Sign in with your credentials

3. **Explore Reports**:
   - Use the sidebar navigation to browse reports
   - Start with the Dashboard Home for a portfolio overview
   - Try Card-Based Drilldown for visual navigation

4. **Filter & Search**:
   - Use search boxes to find specific projects
   - Apply filters to focus on project types, owners, or status
   - Combine filters for precise views

5. **Analyze with Charts**:
   - View Resource charts for capacity planning
   - Use Pie charts for cost distribution analysis
   - Track sprint progress with Burndown charts (Agilebars)

---

## Tips for Effective Use

1. **Regular Publishing**: Publish data daily or weekly to keep the dashboard current
2. **Consistent Metadata**: Use consistent tagging and naming for better filtering
3. **Baseline First**: Set baselines in the client before using the Variance Report
4. **Health Tracking**: Update health indicators regularly for accurate status
5. **Use Cards for Presentations**: Card view is excellent for executive briefings
6. **Export for Offline**: Create Excel exports for offline analysis or board meetings
7. **Check License**: Ensure your license is current for uninterrupted access
8. **Need Multi-Pubset Views?**: If you need to combine multiple pubsets (e.g., across teams or products), use the [Enterprise Dashboard](https://www.timebars.com/knowledgebase/helparticles/common-10-enterprise-dashboard-guide) instead

---

## Troubleshooting

### Dashboard Not Loading

**Possible Causes:** Internet connection issue, subscription expired, or no data published yet.

**Solutions:**
- Check your internet connection
- Verify subscription status at `www.timebars.com/login`
- Publish data from the client application

---

### Reports Show No Data

**Possible Causes:** Data not published from client, filters excluding all data, or wrong pubset published.

**Solutions:**
- Publish from the client using the Active pubset (blue background)
- Click **All** to clear all filters
- Verify data exists in the client before publishing

---

### Visualization Not Updating

**Possible Causes:** Browser cache, old SWR cache, or publishing to the wrong pubset.

**Solutions:**
- Refresh the browser page (F5 or Ctrl+R)
- Clear the browser cache
- Re-publish from the client to the Active pubset

---

### Cannot Edit Data

**Possible Causes:** Network connectivity issue or session expired.

**Solutions:**
- Check your internet connection
- Log out and log back in
- Verify your subscription is active

---

## Related Help Topics
- [Enterprise Dashboard Guide](https://www.timebars.com/knowledgebase/helparticles/common-10-enterprise-dashboard-guide) — Combine multiple pubsets into shared portfolio views with RBAC
- [Cloud Publishing Guide](https://www.timebars.com/knowledgebase/helparticles/common-07-cloud-publishing-guide) — How to publish data to the cloud and manage pubsets
- [Local Reports Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-local-reports-and-graphs-guide) — Reports available within client applications
- [Data Structure Guide](https://www.timebars.com/knowledgebase/helparticles/common-03-data-structure-user-guide) — Understanding the data model
- [User Interface Guide](https://www.timebars.com/knowledgebase/helparticles/common-02-user-interface-guide) — Navigate the client apps

---

## Support

**Need Help?**
- Knowledge Base: `www.timebars.com/knowledgebase`
- Email Support: jcox@tbcox.com
- Feature Requests: jcox@tbcox.com
- Phone: (613) 255-5374

---

**The Personal Dashboard transforms your active project data into strategic intelligence — accessible anytime, anywhere, on any device.**
