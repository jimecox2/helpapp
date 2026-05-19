# Common Functionality Across all Products

## Table of Contents
- [Introduction](#introduction)
  - [Welcome and Discover](#welcome-and-discover)
  - [Eliminating the Guess Work](#eliminating-the-guess-work)
- [Getting Started](#getting-started)
  - [Get Started Page](#get-started-page)
  - [Knowledge Base](#knowledge-base)
  - [Intro Animation](#intro-animation)
  - [Guided Tour](#guided-tour)
  - [Demo Data](#demo-data)
- [AI-Powered Project Creation](#ai-powered-project-creation)
  - [Ask AI: Project Generator](#ask-ai-project-generator)
- [The Scheduling Engine](#the-scheduling-engine)
  - [Data Hierarchy Across Products](#data-hierarchy-across-products)
  - [Automatic Cost and Schedule Rollup](#automatic-cost-and-schedule-rollup)
  - [Timescale and Scheduling Engine](#timescale-and-scheduling-engine)
  - [License Limits and Trimming](#license-limits-and-trimming)
- [User Interface](#user-interface)
  - [Login Page](#login-page)
  - [Timescale and Canvas Settings](#timescale-and-canvas-settings)
  - [Bar Creator](#bar-creator)
  - [Delete Bars](#delete-bars)
  - [Resource Allocator](#resource-allocator)
  - [Resource % Allocated Vertical Bars](#resource--allocated-vertical-bars)
  - [Cost Schedule Form](#cost-schedule-form)
  - [Hours Calculator](#hours-calculator)
  - [Set Baseline](#set-baseline)
  - [Task Relationships](#task-relationships)
  - [Show/Hide Hierarchy Lines](#showhide-hierarchy-lines)
  - [Show/Hide Relationship Lines](#showhide-relationship-lines)
  - [Manage Constraints](#manage-constraints)
  - [Bulk Move Tasks](#bulk-move-tasks)
  - [Bulk Move Projects (Costbars)](#bulk-move-projects-costbars)
  - [Refresh Canvas and Recalculate](#refresh-canvas-and-recalculate)
  - [Filter Menu](#filter-menu)
  - [Main Filters](#main-filters)
  - [Shortcut Menu](#shortcut-menu)
  - [Toggle Light/Dark Mode](#toggle-lightdark-mode)
  - [Freeze Bars](#freeze-bars)
  - [Risk, Issues & Change Requests](#risk-issues--change-requests)
  - [Local Reports and Graphs](#local-reports-and-graphs)
- [Cloud Publishing & Dashboards](#cloud-publishing--dashboards)
  - [Cloud Publishing](#cloud-publishing)
  - [Personal Dashboard](#personal-dashboard)
  - [Enterprise Dashboard](#enterprise-dashboard)
  - [Push Notifications & Alerts](#push-notifications--alerts)
- [Bar Data Management](#bar-data-management)
  - [Bulk Manage Bars](#bulk-manage-bars)
  - [Duplicate Bars](#duplicate-bars)
  - [Transferring Bars Between Products](#transferring-bars-between-products)
  - [File Importer](#file-importer)
  - [Data Export (CSV and JSON)](#data-export-csv-and-json)
  - [Full Backup and Restore](#full-backup-and-restore)
- [Spreadsheet Sync & No-Code Form Configuration](#spreadsheet-sync--no-code-form-configuration)
  - [Introduction to Spreadsheet Sync](#introduction-to-spreadsheet-sync)
  - [How Spreadsheet Sync Works](#how-spreadsheet-sync-works)
    - [Spreadsheet Sync Summary](#spreadsheet-sync-summary)
  - [Resource Pool Management](#resource-pool-management)
  - [Metadata Coding Structure](#metadata-coding-structure)
  - [No-Code Form Configuration (FOCD)](#no-code-form-configuration-focd)
  - [Metadata Lookup Tables (Picklists)](#metadata-lookup-tables-picklists)
  - [Core Report (Dynamic Form)](#core-report-dynamic-form)

# Introduction

## Welcome and Discover
Welcome to the Core Product Functionality page, where you'll discover the foundational features that drive productivity across Agilebars, Timebars, and Costbars. At the heart of our products lies a proprietary internal scheduling engine, seamlessly integrated with intuitive user interface elements, designed to enhance efficiency and streamline workflows.

## Eliminating the Guess Work
These common product concept descriptions should eliminate guesswork, empowering you to understand and leverage our tools quickly. Whether you're managing projects, sprints, or costs, this page provides the essential knowledge to maximize your productivity and achieve your goals effectively.


# Getting Started
-----------

## Get Started Page
To launch the Get Started Page choose Hamburger Icon > Getting Started Page. This page may be all you need to get using our products quickly. Here is what you can find on this page.

We offer monthly subscriptions for our products, with product technical support via email included in the pricing. For additional management consulting services, reach out on an ad-hoc basis by [contacting us](https://www.timebars.com/sales/contact-us).

Subscriptions are single-person monthly licenses. You can buy one month at a time or up to 12 months in one credit card transaction. Check the Pricing Table & Sales FAQ at our [Sales Site](https://www.timebars.com/sales/pricing).

## Knowledge Base
Access the Knowledge Base for sales information, user support, and helpful resources to guide you through features, troubleshooting, and best practices.

## Intro Animation
The Intro Animation can be launched from the Hamburger Icon in the left-side menu. Each of the three applications is configured to display the intro whenever a new database is created—essentially, the first time a user accesses the app. Most users will read the intro once, then click "Close" or "Don't Show the Intro Again," or they can click "Skip Intro" to dismiss it. The intro will reappear the next time the page is relaunched if not disabled.

## Guided Tour
The Guided Tour can be launched from the Hamburger Icon in the left-side menu. Once activated, the tour begins at the Hamburger Icon, and users can progress by clicking "Next." It systematically highlights each visible UI element of the application, providing a quick and effective way to familiarize new users with the app's usability and features.

## Demo Data
When the app is loaded for the first time the demo data is populated as part of the seed data loading process. There is a small demo data set of project data and there is a large data set demo for each product. It is important to always start off with demo data because mandatory seed data is installed that makes the application work such as the administration panel data, tags and Default field configuration for the forms. The demo data consists of a demo license for free access to the product for life.


# AI-Powered Project Creation
-----------

Gone are the days of staring at a blank canvas when starting a new project. Every product in the suite includes an AI-powered project generator that turns a plain-English description into a fully structured project — tasks, milestones, risks, descriptions, and all — ready to work with on the timeline immediately.

## Ask AI: Project Generator

Describe your project in natural language and the AI generates a complete, meaningful project structure in seconds. Type something like *"Create a 10-week cloud migration project with testing phases and rollback plans"* and the generator produces task names relevant to your domain, writes 1–3 paragraph descriptions, executive summaries, objectives, and risk assessments — not generic placeholders, but content that reflects the specific work you described. Default quantities (5 tasks, 2 milestones, 3 risks) apply when you don't specify, so there is no friction getting started, but you can override any of them.

The more context you provide, the better the output. Mention team size, budget constraints, key phases, or specific technology and the AI incorporates all of it. It understands the product hierarchy and can position the new project on the canvas, set dates based on natural language ("starting next quarter"), and create nested sub-projects within a program. Whether you are onboarding a new client, building a reusable template, or simply saving setup time, Ask AI takes you from a blank screen to an actionable project plan in under a minute. See the [Ask AI User Guide](https://www.timebars.com/knowledgebase/helparticles/common-06-how-to-use-ask-ai) for detailed usage examples.


# The Scheduling Engine

This section provides details about the hidden functionality behind the canvas that enables automatic calculations to support scheduling concepts within each application. The proprietary Scheduling Engine is the heart of Agilebars, Timebars, and Costbars, running silently in the background to recalculate schedules instantly when changes occur. While documenting its full operation would require a separate document due to its complex and proprietary CodeBase, its advanced algorithms ensure rapid updates—within seconds—whenever users interact with the application. These interactions include dragging and dropping bars, adding resources, adjusting allocation percentages, or modifying the timescale.

For example, moving a bar on the timescale triggers recalculations of its dates, costs, and hours, as well as those of its child bars. Tasks with relationships to other tasks also update their successors' dates accordingly. However, if a bar has a constraint, the Scheduling Engine respects it and leaves its dates unchanged, enforcing business rules unique to Agile Project Management, Traditional Project Management, and Project Portfolio Management.

## Data Hierarchy Across Products
To understand how the Scheduling Engine operates, it's essential to grasp the data hierarchy, a data structure that our products depend on and enforce. This hierarchy, represented by bars on a timescale, governs how data is filtered, scheduled, and aggregated, enabling the engine to automate and maintain business rules.

- **Timebars and Costbars**: These products organize data into a 5-tier hierarchy, abbreviated as L1, L2, L3, L4, and L5, with each level reflecting increasing granularity. L1 represents the broadest scope (e.g., portfolios or programs), while L5 denotes the most granular (e.g., allocations). The mandatory color scheme is as follows:
  - L1: Brown Bars (e.g., Portfolio or Program—not available in Agilebars)
  - L2: Green Bars (Must always be a Project, across all products)
  - L3: Orange Bars (Optional, could be a sub-project, work package, or similar—not available in Agilebars)
  - L4: Blue Bars (Must always be a Task, across all products)
  - L5: Gold Bars (Must be an Allocation—not available in Agilebars)
  The only exception to this hierarchy is that L3 is optional; users can choose not to use it, effectively creating a 4-tier hierarchy by dropping Tasks (L4) directly onto Projects (L2).

- **Agilebars**: This product organizes data into a 2-tier hierarchy, consisting of Project and Task levels, also represented by bars on a timescale. The mandatory color scheme is:
  - L2: Green Bars (Must always be a Project, across all products)
  - L4: Blue Bars (Must always be a Task, across all products)
  There is no Allocation level below Tasks, so task or work item sizing (in terms of cost or hours) is captured at the Task level and rolled up to the Project level. This structure has no exceptions and ensures consistency in Agile Project Management workflows.

## Automatic Cost and Schedule Rollup
To ensure accurate reports, graphs, and charts, the application continuously aggregates data from lower to higher levels of the data hierarchy using an automatic rollup process. This involves a mathematical formula that sums costs and hours as data is created or modified, maintaining consistency across the timescale without manual intervention.

- For Timebars and Costbars, the rollup aggregates data from L5 (Allocations) up to L1 (Portfolios or Programs), appending or summing new task allocations, costs, and hours to the top of the hierarchy.
- For Agilebars, the rollup occurs from Tasks to Projects, capturing sizing data (e.g., cost or hours) at the Task level and rolling it up to the Project level.

This automated process supports the Scheduling Engine's real-time calculations, ensuring that all hierarchical data remains synchronized and accurate for reporting and decision-making.

## Timescale and Scheduling Engine

The starting date for the timeline combined with the Report Date, also known as the Status Date, is a critical parameter used by the internal scheduling engine to calculate progress, including actuals and remaining work, representing the point in time at which progress is considered valid. Read more under the User Interface section below.


## License Limits and Trimming

When the application page loads, data limits are enforced based on the product line and subscription. Upon page load, it retrieves information about the user's license, including details such as the owner, product code, expiration date, bar count, project count, and more. It calculates the number of days remaining until the license expires by comparing the current date with the expiration date.

The system defines several error message strings, including notifications for exceeding the project limit, bar limit, or an expired license. If the license has expired (i.e., the difference in days, ddif, is less than 0), it displays the expired license message using a toast notification (e.g., M.toast). It also performs UI modifications, such as hiding elements, disabling buttons, and applying specific styles.

If the license is valid, the application checks the licenseCode to determine the license type and conducts additional validations based on that type. For each license code, it verifies whether the bar count or project count exceeds predefined limits. If these limits are surpassed, it displays the appropriate error message and applies similar UI modifications as in the expired license scenario.

# User Interface

## Login Page
Login into the app (Licensed users only), change password, extend your license, obtain your license status or Log Out. You can use the applications for free with no need to log in but you will be limited as to how many bars you can have. The Login is integrated with our Sales and Support site to obtain the license after you purchase one. The license is cached or stored inside the application so you should only have to log in once.




## Timescale and Canvas Settings

The Timescale, implemented as an HTML 5 canvas, serves as a visual representation of dates and lines, forming the timeline for managing and visualizing time-based data across Agilebars, Timebars, and Costbars. It is highly configurable to meet diverse scheduling needs, rendering bars in either a weekly or monthly view based on user settings.

The Canvas Settings popup form provides control over key Timescale parameters. Users can adjust the zoom factor by dragging a slider to zoom in or out of the timeline view. They can also set the starting date for the timeline to align with standard scheduling practices. The Report Date, also known as the Status Date, is a critical parameter used by the internal scheduling engine to calculate progress, including actuals and remaining work, representing the point in time at which progress is considered valid.

Additional customization options include selecting between weekly or monthly intervals to define the timeline's granularity, toggling the visibility of baseline bars as thin lines below the main bars for comparison, and enabling or disabling ghost bars. Ghost bars are faint visual references left on the canvas to assist users in repositioning bars during drag-and-drop operations. Users can control which levels of the data hierarchy—ranging from L1 to L5—are displayed, allowing focus on specific tiers, such as hiding L3, L4, and L5 bars to emphasize L1 (Portfolio) and L2 (Project) bars. Users can also opt to hide completed Timebars from view, streamlining the timeline to focus on active or ongoing elements.

The Canvas Settings on the bottom right of the Canvas can also be used to change the view to weekly or monthly, or adjust the scale factor (zoom in or out) to increase the spacing between lines. You can also refresh the page and navigate back to the top, resetting any scrolled position.

## Bar Creator
The Bar Creator enables users to generate new bars via drag-and-drop, enforcing the data hierarchy. To create a bar at the top of the hierarchy, drag a Creator Bar and follow the instructions that pop up on the right, then drop it. Users must drop a Creator Bar on an existing bar to create new bars, this enforces the hierarchy described above.

For example in Agilebars: Task bars can only be created by dropping the Task Creator Bar onto a Project bar, dropping elsewhere will prompt a user notification and not allow it.

## Delete Bars
When a bar is dropped on the Trash Can (left hand side of Canvas) the dropped bar and all child bars below will be deleted. For example if you delete a Task, the Allocations will be deleted also, if you wish to delete just the Task and keep the Allocations, move them to another bar in the hierarchy using drag and drop. There is no undo, if needed make a backup first choose Hamburger Icon > Full Backup. To restore the backup, just drag and drop the backup file on the Canvas.

## Resource Allocator
Easily allocate resources to tasks using drag-and-drop gestures. Assign resources from the Resource Pool to specific tasks or activities based on availability, skills, and priorities. Double-click a resource to view embedded availability bars. You can also launch Resource Demand Charts from here. See Spreadsheet Sync section for more information about Resource Pool Management.

## Resource % Allocated Vertical Bars
Double click on a resource name in the Resource Allocator pop up to see the percent allocated a vertical yellow bars on the top of the timescale. e.g. If the timescale is set to weekly you will see percent allocated for that week.

## Cost Schedule Form
To load the popup the user clicks on the lower portion of the bar e.g. T:3773… it will load the form below the bar associated with the bar, works at all levels. This form shows relevant scheduling information for planned, forecast and actual dates, hours and costs, includes remaining cost and hours and percent complete.

## Hours Calculator
To load the Hours Calculator popup click the Edit link at the bottom left of an Allocation bar. It will load a form that shows how the hours were calculated and allows you to override how the hours are derived. Here you can adjust the duration, Workday (e.g. 8 hours per day) and % Allocated so the scheduling engine can generate the forecast or actual hours, remaining hours and percent complete. There is also a shortcut to launching the usage view to inspect the allocation for over/under allocation.


## Set Baseline

Easy Baseline Management: When planning is done and before the work starts, set a baseline or snapshot with one click. Compare current forecast to the baseline (Planned or the original plan). You can set a baseline at the Project Level or at any level below the project.

To set a Baseline open the Cost Schedule Form (click on a bar ID, bottom left of bar). click the Set Baseline button and re-open the Cost Schedule Form an you will see the Planned row is filled in. If the button is clicked and the check mark is on, the previous baseline is lost. The baseline will be created at the current level and all child bars below it in the hierarchy. If the checkmark is off, this Timebar and any child Timebars where no baseline exists yet, will NOT delete existing baseline data, this is necessary for the scenario where the Baseline is initially set then later a new bar and/or children need to be added to the baseline.

## Task Relationships
Create relationships between Tasks, this tells the scheduling engine to reschedule the successor bar as well, by the same amount of time. To create a relationship drag a task by grabbing the ending of it and dragging it over the beginning of the predecessor bar and dropping after the red dashed box appears. To remove a relationship between tasks repeat the operation.

## Show/Hide Hierarchy Lines
To show the hierarchy on screen, turn on Main Bar lines. Right click on the Canvas to show the Shortcut Menu and click Main Bar Lines and notice that the Yellow Bar (L5) is linked to the Blue Bar (L4), the Blue Bars are linked to the Orange Bar (L3), Green Bar (L2) is linked to the Brown Bar at L1. The Brown bar is the top of the hierarchy.

## Show/Hide Relationship Lines
To show the Task Lines on screen, turn on Task Bar lines > Right click on the Canvas to show the Shortcut Menu and click Task Bar Lines.

## Manage Constraints
Constraints help ensure that tasks start or finish within a specific timeframe, even if other scheduling changes occur. To add a constraint, drag and drop the pin near the end of a task. This will lock its dates, preventing changes caused by task predecessors while maintaining scheduling accuracy. However, if the project start date changes, the task will adjust accordingly and override the constraint. Remove the constraint by double clicking on the pin.

## Bulk Move Tasks
Choose Tools Menu > Bulk Move Tasks link to reschedule tasks in bulk. Click on two or more tasks to highlight them, then drag and drop to reposition them. Notice that selected bar are highlighted with blue dotted lines. When done refresh the screen and confirm they have been rescheduled including any associated Allocations. Tip: When you get to the last bar that you plan to move, double-click it then drag.

## Bulk Move Projects (Costbars)
Choose Tools Menu > Bulk Move Project link to reschedule Project in your pipeline in bulk. Click on two or more projects to highlight them, then drag and drop to reposition them. Notice that selected bar are highlighted with green dotted lines. When done refresh the screen and confirm they have been rescheduled including any associated child bars. Tip: When you get to the last project bar that you plan to move, double-click it then drag.

## Refresh Canvas and Recalculate
Quickly refresh the Canvas and bars without a full browser page reload, this will also invoke a full cost schedule rollup.

Recalculate All performs a complete recalculation: hours/cost rollup, updates L1 to L5 hierarchy names, hierarchy numbers (WBS) and re-populates the tbMDJoined data store.

## Filter Menu
The Filter Menu utilizes the 5-tier data hierarchy (2-tier for Agilebars) to enable users to drill down and filter bars on the timescale. Click the pink FM tab on the left hand side of the Canvas to open the menu, where users can click hyperlinks to focus on specific levels, reducing clutter.

The menu renders three levels: L1 (brown bars), L2 (green bars), and L3 (orange bars), Agilebars renders one level: Project. When a level is clicked, a filter is applied. The selected level is saved so that when the user returns it will show the filter menu and the filtered project by default.

## Main Filters
The Main Filter Panel can be used instead of the Filter Menu. The feature helps users refine and focus on specific projects and tasks based on metadata. It supports free-form search for quick keyword-based filtering and pre-populated pick lists to filter by status, health, state, priority level, and escalation level.

## Shortcut Menu
The Shortcut Menu is standard "Right Click" functionality like in any app. Right click on the canvas and the shortcut menu will pop up. There is a different shortcut menu for the based on the product.

Right-click anywhere on the Canvas to bring up the Shortcut Menu for quick access to: Canvas Settings, Bulk Move, Refresh Bars, Filter Menu and Toggle Bars vs Time Boxes on the Kanban Board. Bulk Move allows moving many bars at once to a new position on the Canvas.

## Toggle Light/Dark Mode
The choice between dark mode and light mode is largely a matter of personal preference and user experience. Some individuals may find dark mode more visually appealing or less intrusive, while others may prefer the traditional light mode. Many software applications and operating systems now provide the option to switch between these modes to accommodate different user preferences and environments.

## Freeze Bars
Disable the ability to drag and drop bars. This can help accidental rescheduling.


## Risk, Issues & Change Requests

The RIC system gives project teams a single, integrated place to manage the three most common sources of project disruption. Risks, Issues, and Change Requests are created directly on the project timeline using the same Bar Creator as any other bar — simply set the SubType field to Risk, Issue, or CR and the canvas immediately displays the appropriate visual indicator so status is always visible at a glance without opening a separate tool.

A dedicated RIC view lets managers filter and search across all active items, track escalation levels, and drill into the detail of any item. Change Requests in particular allow teams to capture the scope, schedule, and budget implications of a proposed change before it is approved — ensuring nothing slips through informally and that the project baseline remains the authoritative record of what was originally agreed. Forms are fully configurable (see No-Code Form Configuration below) so the fields shown for a Risk can differ from those shown for a Change Request, matching whatever methodology your organisation uses. See the [Risks, Issues & Change Requests User Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-risks-issues-change-requests-user-guide) for full details.


## Local Reports and Graphs

The Reports and Graphs page is the place where your data is transformed into information. Gain access to a wide range of tabular reports and card view reports designed for portfolio, project, task, and resource management, as well as general reports like WBS. View and edit your data through the Core Report (static forms) accessible from the report.

The following reports are available, with more to come later:

- All Tabular
- All Drilldown
- Print WBS
- Project Status
- Project Stop Light
- PPM Stop Light
- Project Core
- PPM Report
- Tasks Overdue
- Milestone Horizon
- Usage Reports
- Resource Listing

See the [Local Reports and Graphs Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-local-reports-and-graphs-guide) for detailed guidance on each report.


# Cloud Publishing & Dashboards
-----------

Publishing your data to the cloud transforms the Timebars suite from a powerful local scheduling tool into a connected portfolio management platform. With a single click you securely push your project data to our cloud service, making it instantly available in web-based dashboards from any browser on any device. The publishing model is opt-in and non-destructive: your local data remains your primary working copy and you control exactly when the cloud view is refreshed.

## Cloud Publishing

The Cloud Publishing feature enables secure, on-demand synchronisation of your project data to the Timebars cloud service. Once you log in and click Publish, all project, task, resource, and metadata information is encrypted and transmitted to our servers. Your data then powers the Personal Dashboard, the Enterprise Dashboard, and the Push Notification system — and enables cross-device continuity so you can pick up on a tablet exactly where you left off on your desktop.

Publishing supports multiple named pubsets, which are independent snapshots of your data. This lets you maintain separate views for different audiences — for example, a detailed working dataset for your team and a summarised snapshot for executive reporting — without duplicating any work in the client application. See the [Cloud Publishing Guide](https://www.timebars.com/knowledgebase/helparticles/common-07-cloud-publishing-guide) for full setup instructions.

## Personal Dashboard

The Personal Dashboard is a web-based reporting portal that connects automatically to your single active pubset — no configuration required. Publish your data and your dashboard is live at www.timebars.com/personaldashboard or via a direct link from the Publish panel in the client application.

Reports include a portfolio-wide Project Status report, a Project Variance report that tracks deviations from your baseline, interactive card-based drilldowns with seven-dimension health indicators (Overall, Cost, Hours, Risk, Schedule, Scope, and Issues), Agilebars burndown charts, and resource utilisation visualisations broken down by project, role, skill, location, and department. Every report supports search, multi-dimension filtering, sorting, and inline editing — so managers can update project health status and metadata directly from the dashboard without returning to the client application. All tabular reports export to Excel or CSV for board packs or offline analysis. See the [Personal Dashboard Guide](https://www.timebars.com/knowledgebase/helparticles/common-08-personal-dashboard-guide) for full details.

## Enterprise Dashboard

For organisations with multiple users, teams, or products, the Enterprise Dashboard provides a consolidated portfolio view that combines data from more than one published dataset. Where the Personal Dashboard connects to a single user's active pubset, the Enterprise Dashboard lets an administrator create a Dashboard Source by selecting and merging pubsets from across the organisation — for example, rolling up Costbars portfolio data from multiple regional project managers into a single executive view, or combining Timebars resource data from different teams into one capacity report.

The Enterprise Dashboard is included with your subscription at no additional charge. It adds Role-Based Access Control (RBAC) so that administrators, project managers, and team members each see only the pubsets and data sources they have been granted access to. The report set mirrors the Personal Dashboard but operates across the combined dataset, making it the right choice for any organisation that has outgrown a single-user view and needs a shared, governed window into portfolio performance. See the [Enterprise Dashboard Guide](https://www.timebars.com/knowledgebase/helparticles/common-10-enterprise-dashboard-guide) for setup and configuration.

## Push Notifications & Alerts

The notification system monitors your published project data automatically and pushes an alert to your phone when projects need attention — without you having to log in to check. Running every four hours around the clock, the system evaluates all in-progress projects against thresholds you configure: overall health status, senior-level commitment, and risk and complexity score. Costbars adds three further conditions — strategic value, budget overrun percentage, and work hours overrun percentage — for a total of five independent alert scenarios.

Alerts are delivered via the Pushover app (iOS and Android, one-time ~$5 fee) and also fire immediately when you publish a new dataset, so managers are informed the moment updated data is available. Each manager has their own independent configuration covering thresholds, business hours, quiet hours, cooldown periods, and daily send limits. Costbars additionally supports SMS escalation via Twilio for projects flagged at executive escalation level. The result is a proactive early-warning system that surfaces the projects that need human attention before they become crises. See the [Text Notifications Guide](https://www.timebars.com/knowledgebase/helparticles/common-10-text-notifications) for setup instructions.


# Bar Data Management

## Bulk Manage Bars
A popup tool used to duplicate bars, transfer bars and to create bars in bulk for testing.

## Duplicate Bars
To duplicate a bar and its children enter the bar id (bottom left of bar) into the Bulk Manage Bars tool and refresh the canvas. Choose Hamburger Icon > Bulk Manage Bars to launch the tool.

## Transferring Bars Between Products

The Transfer Bars feature enables seamless data migration between products within the tbClient ecosystem, such as moving a project from Timebars to Agilebars for sprint-based management. This functionality enhances flexibility, allowing users to adapt their data to different product workflows efficiently.

By facilitating data transfer between products, this feature eliminates the need for manual re-entry, reduces errors, and enhances productivity. It empowers users to adapt projects to specialized workflows—such as shifting from Timebars' time-based tracking to Agilebars' sprint-focused management—while maintaining data integrity and hierarchy.

## File Importer
Opens a Window with file picker to import SpreadSheet data, JSON files, and backup files.
The best way to import your back up files or other files that are permitted is with drag and drop gestures. You can drag and drop a spreadsheet file or a CSV file on the canvas import that data. Another way to import data is from the admin panel which is available by clicking the hamburger icon in the top left of the main menu there are buttons available that allows to import the back up text files or CSV files without having to drag and drop, you can use the file picker.

## Data Export (CSV and JSON)
Export all data stores as CSV files, specifically designed for use with the Spreadsheet Sync feature. Also useful for easy backup, analysis, or integration with other tools.

On the Admin menu, which is available by clicking the hamburger icon in the top left of the main menu, there is a Data Actions heading with many buttons available. These allow users to export all the data stores to CSV files or to individual JSON files with a single click. These files can be useful for importing to the spreadsheet or to import into your own systems as required.

You may want to delete all bars that are on the screen without deleting any of the other application data such as resource list, reports, issues, documents, tags and fields. The browser has a set of tools for this. Hit F12 then choose the application tab in the browser tools and click on indexeddb, click on the thyme bar store, right click then click clear — you would have to do the same for the metadata store and the baseline store.

## Full Backup and Restore
Create a complete backup of all data stores in a single JSON file, providing the closest thing to an undo option. Before deleting multiple bars or making a major reschedule, click Backup to save your current data. This file can be imported at any time to restore your data.

The indexed database is backed up constantly to the user's hard drive in the downloads directory as one text file. This text file is in JSON format and consists of all the data in the application, all 13 tables as described in the data model section. From the admin panel the user can invoke a database backup manually with a single click at any time. The application also provides automatic backups before major data operations such as deleting demo data, doing a spreadsheet sync, and many other scenarios. This is essential because there is no undo — ghost bars exist to help users reposition accidentally moved bars, but a backup is the only way to fully recover a previous state.

To restore the database you simply drag and drop the backup text file on top of the canvas and it will automatically update and bring the application back to the exact state as when the backup was taken. This is also the best way to archive completed projects — take a backup, store it in your document management system, and restore it at any time with a drag and drop.


# Spreadsheet Sync & No-Code Form Configuration

## Introduction to Spreadsheet Sync

The Spreadsheet Sync feature enhances data management by enabling seamless synchronization between the application and pre-configured spreadsheets, whether users are licensed or not. This functionality leverages custom code embedded within the spreadsheets to facilitate bidirectional data exchange with exported CSV files, streamlining workflows and boosting productivity.

## How Spreadsheet Sync Works

At its core, Spreadsheet Sync operates by integrating CSV files exported from the app with a specially designed spreadsheet. Users export data via the app's export button, saving CSV files to a configurable location on their hard drive. The spreadsheet, equipped with custom code, imports these files when users interact with the setup page—specifically, by clicking the "Import All" button or individual import buttons for specific data types (e.g., Time Bars or metadata).

The setup page within the spreadsheet allows users to configure import and export locations flexibly, accommodating any directory on their hard drive. The spreadsheet's code, invoked by a button dynamically imports data from marked stores (indicated by "Yes" in the "Import Yes/No" column), enabling users to manage data holistically or selectively.

Once imported, the spreadsheet serves as a powerful editing environment where users can manually adjust data, adding new tasks, resources, or metadata without the limitations of traditional data entry forms in a web page. After edits, users save the spreadsheet and drag and drop it back onto the app's Canvas, triggering an update that aligns the app's data with the spreadsheet's changes.

Important Note: users must avoid editing data in the app while it resides in the spreadsheet to prevent overwrites and ensure data integrity.

### Spreadsheet Sync Summary

- **Bidirectional Synchronization**: The feature supports a continuous sync cycle, allowing users to export data for bulk edits, analyze it in the spreadsheet, and re-import it into the app. This cycle can be repeated daily, weekly, or monthly, eliminating the need for cumbersome data entry forms and enhancing efficiency.

- **Data Validation and Visualization**: The spreadsheet includes macro-based validators that highlight potential issues, such as missing mandatory columns, in red. This ensures data quality before re-importing. Dropping the spreadsheet onto the Canvas visualizes the data as bars on the timescale, while exporting it back enables further analysis or custom reporting via the Portfolio tab (with macros enabled).

- **Backup and Recovery**: With your data in two places, the Spreadsheet and in the application can be treated like a backup of the information. For extra backup safety, importing the spreadsheet automatically creates another backup of existing app data. Users can restore this backup by dragging it back onto the Canvas, providing a safety net for data management.

- **Accessibility and Customization**: The feature supports both LibreOffice Calc and Microsoft Excel formats, with downloadable templates available:
  - [LibreOffice Calc SS File](https://cdn.timebars.com/common/tbClientAllSheetsMasterDec30.ods)
  - [MS Office Excel File](https://cdn.timebars.com/common/tbClient2023v1.xlsm.removeMe)
  Note that the file name must begin with "tbClient" for the import to function correctly.

- **Seed Data and Demo Projects**: The spreadsheets come preloaded with seed data allowing the app to function. Users can change this data such as custom picklist data and load it into the app via the Canvas to see their custom metadata in action.

## Resource Pool Management
The resource pool is maintained in the Spreadsheet on the Resources Tab. Add and remove resources to this list as required by your processes.

## Metadata Coding Structure

Metadata coding is a flexible way to organize, break down and report on project work by other structures. By establishing a coding (tagging) structure and assigning codes to bars at various levels it will allow virtually any view or report of your project information. There are over 100 metadata fields that can be configured as part of the coding structure.

The metadata codes values are pre-determined within the application and can be changed to suit the needs at hand. The data is maintained in the custom spreadsheet provided. When codes are changed in the spreadsheet you drag and drop the spreadsheet on the Canvas to load the changes. There is no complex code tables and look up tables to maintain, just spreadsheet maintenance and the product does the rest saving you time.

## No-Code Form Configuration (FOCD)

One of the most powerful capabilities across all three products is the ability to customise data entry forms without writing a single line of code. FOCD (Forms on Cached Data) is proprietary technology developed by Timebars Ltd. that lets users add, remove, reposition, and relabel fields on any slide-out form by editing the provided spreadsheet and syncing it back to the application.

Each product ships with configurable forms for every level of the data hierarchy — Portfolio, Project, Sub-Project, Task, and Allocation — plus dedicated forms for Risks, Issues, and Change Requests. Fields can be shown or hidden per hierarchy level independently, so your Project form can present a different set of fields to your Task form. Custom picklist values, field labels, and layout positions are all defined in the spreadsheet, loaded with a drag-and-drop onto the canvas, and immediately reflected in the UI. Changes that would normally require an IT developer — renaming a field, adding a custom attribute, adapting to a new client's methodology — take minutes instead of days. See the [FOCD Forms User Guide](https://www.timebars.com/knowledgebase/helparticles/common-04-focd-forms-user-guide) for configuration details.

## Metadata Lookup Tables (Picklists)

Notice that in the Core Report, Slide Out, and other reports, when you click on a field to edit the data, if the field is a lookup table, a list of available values will pop up for selection. This data is sourced from the tags table and stored in the associated metadata table or the resources table.


## Core Report (Dynamic Form)
The Core Report is another way to assign Metadata to bars using the Metadata Coding Structure. The Core Report is available from the Cost Schedule Form on any Bar at any level (click on bar id bottom left of any bar). The Core Report can be launched from items in the Risk and Issues page and from most Reports in the Reports page.

The metadata fields required for population at a certain level may differ at other levels. For example at the Project level you may need to identify a custom project number and you would not need to assign that at the Task level. This is why the Core Report has been configured to show necessary fields based on the hierarchy. Control is maintained by the user configuring the spreadsheet called Core Report.

Here is a subset of data from the Core Report spreadsheet, the user would choose show or hide to control visibility of the fields.

| MD Form Section        | Field ID      | Portfolio | Project | Sub-Project | Task | Allocation | NoOfColumns |
| ---------------------- | ------------- | --------- | ------- | ----------- | ---- | ---------- | ----------- |
| coreFormSection1-Notes | tbID          | show      | show    | show        | show | show       | 3           |
| coreFormSection1-Notes | tbSubType     | show      | show    | show        | show | show       | 3           |
| coreFormSection1-Notes | tbMDNameShort | show      | show    | show        | show | show       | 3           |
