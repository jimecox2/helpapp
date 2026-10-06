![Timebars Logo](../tbimages/logos/timebars-ltd-logo-final.png)
---

# Product Help - Common Across Products

## Table of Contents

1. [Why These Products Work the Way They Do](#why-these-products-work-the-way-they-do)
2. [What You Should Know First](#what-you-should-know-first)
3. [The Canvas](#the-canvas)
4. [How to Manage your Data](#how-to-manage-your-data)
5. [Data Actions Menu](#data-actions-menu)

**Core Product Functionality**

1. [Automatic Calculations](#automatic-calculations)
2. [How to Create Bars](#how-to-create-bars)
3. [Filter Menu](#filter-menu-1)
4. [Shortcut Menu](#shortcut-menu)
5. [Toggle Light/Dark Mode](#toggle-lightdark-mode)
6. [Creating Relationships between Tasks](#creating-relationships-between-tasks)
7. [Show/Hide Hierarchy Lines](#showhide-hierarchy-lines)
8. [How to Turn On/Off Bar Relationship Lines](#how-to-turn-onoff-bar-relationship-lines)
9. [Task Bar Lines (Relationships)](#task-bar-lines-relationships)
10. [Drop to Delete Bar Lines](#drop-to-delete-bar-lines)
11. [Manage Constraints](#manage-constraints)
12. [Popup Cost Schedule Form Off of Bar](#popup-cost-schedule-form-off-of-bar)
13. [How to Make Edits to Bar and Metadata](#how-to-make-edits-to-bar-and-metadata)
14. [Metadata Coding](#metadata-coding)
15. [Metadata View](#metadata-view)
16. [How to Create a Baseline](#how-to-create-a-baseline)
17. [How to Update a Baseline for Added Scope](#how-to-update-a-baseline-for-added-scope)
18. [How to Delete Bars](#how-to-delete-bars)
19. [Drop to Duplicate Bars](#drop-to-duplicate-bars)
20. [Bulk Move Tasks](#bulk-move-tasks)
21. [Bulk Move Projects (Costbars Only)](#bulk-move-projects-costbars-only)
22. [Change Creator Bar Names](#change-creator-bar-names)
23. [Metadata View](#metadata-view-1)
24. [Get Started Page](#get-started-page)
25. [FAQ](#faq)
26. [Intro](#intro)
27. [Tour](#tour)

**Risk & Issues Features**

1. [Overview of Risks and Issues](#overview-of-risks-and-issues)

**Local Reports Menu**

1. [Portfolio, Project and Task Reports](#portfolio-project-and-task-reports)
2. [Resource Reports](#resource-reports)
3. [Other](#other)
4. [Joining tbTimebars and tbMetaData Stores](#joining-tbtimebars-and-tbmetadata-stores)

**Burndown Chart**

1. [What is a Burndown Chart](#what-is-a-burndown-chart)
2. [How to Calculate the Burndown Chart](#how-to-calculate-the-burndown-chart)

**Local Dashboard**

1. [What is Local Dashboard](#what-is-local-dashboard)
2. [Summary Tab](#summary-tab)
3. [Resources Tab](#resources-tab)
4. [Project Tab](#project-tab)
5. [Financial Tab](#financial-tab)

**Cloud Publishing**

1. [Overview of Publishing](#overview-of-publishing)
2. [Cloud Login](#cloud-login)
3. [Show License](#show-license)
4. [Create Your Pubsets](#create-your-pubsets)
5. [Publish to Update Cloud Dashboard](#publish-to-update-cloud-dashboard)

---

## Why These Products Work the Way They Do

*New here? Read this first. It is short, and it explains the decisions behind
almost everything else in this guide — why there is no software to install, why
your data lives in your browser rather than on our servers, and why the products
keep working when your connection does not.*

At the heart of Agilebars, Timebars, Costbars and our Cloud Dashboard is a bold
idea: management tools should not be clunky, device-specific, or tethered to
outdated technology. We set out to rethink how software supports Agile, resource
and project managers — building something that is not just functional but
genuinely different. Here is what we did differently.

### A Web Application, Not an Installed App

We did not settle for desktop-only software or a rigid cloud platform. Our tools
are built from the ground up as web-native applications on open-source
technologies — HTML5, JavaScript and CSS.

Why? Because the web is universal. The software runs on any device with a modern
browser, from your iPad to a large desktop monitor. There are no apps to install
and no proprietary ecosystem to join — just a secure web page that adapts to your
screen, whether you are tapping a touchscreen or clicking a mouse.

**The bigger the screen, the more you see**, but the experience stays smooth on
smaller devices too. This is what lets a browser deliver desktop-level power
without a dedicated application.

### Your Data Moves Freely In and Out

Forget complex imports and locked-in formats. Drag a spreadsheet from Excel or
LibreOffice Calc onto the canvas and it is instantly part of your project. Our
tools speak **JSON and CSV** natively, so you can pull data in and push it back
out without wrestling with converters.

This is not just convenience. It is what keeps your existing data alive and your
workflow fluid — your plan is never trapped inside our product.

### Security: No Cookies, Nothing Stored on Our Servers

We did not simply add encryption and call it done.

- **End-to-end HTTPS/TLS** — the same level of encryption banking websites use,
  on every interaction
- **No browser cookies at all.** Rather than storing a login token on your device
  where an attacker could reach it, we deliver a **JSON Web Token (JWT)**
  securely at login, held server-side and encrypted with your password
- **Your data stays in your browser** unless *you* choose to publish it to the
  Cloud Dashboard

This is a deliberate rethink of where trust and control should sit: with you, not
with us.

### The Cloud Dashboard Publishes, It Does Not Host

The optional Cloud Dashboard is not a typical cloud service — it is a
**publishing platform**. You push your data up securely with a single click,
where it is stored in a shared database isolated by your credentials. No one
reaches your data without your username and password.

This is not about locking you into the cloud. It is an optional hub for
dashboards and insights, while the core experience stays offline-first.

### Offline by Design

We flipped the script on cloud dependency. The tools work **fully offline**,
storing data locally in your browser's cache, available any time, anywhere, with
no internet connection required.

This is not a fallback for when the network drops. It is a deliberate choice to
put flexibility and resilience first, in a world where connectivity is not
guaranteed.

### What Each Product Adds

| Product | The rethink |
|---|---|
| **Agilebars** | Sprint planning reimagined by blending Kanban and time-scaled views into one web-based tool. Switch modes instantly — no imports, no exports |
| **Timebars** | Traditional project management given a web-native overhaul, with a scheduling engine that adapts to resource demand, all inside a browser |
| **Costbars** | Pipeline management plus analytics and selection tools, turning a scheduler into a strategic instrument while staying lightweight |

### Comfort and Accessibility

**Dark mode** cuts eye strain during long or late sessions, and accessibility
features are there so everyone can use the tools, not only the technically
confident. We optimised for touch and mouse across screen sizes, because web
software can rival native apps without compromise.

It is not perfect on every Apple device yet — web technology moves quickly — but
staying ahead of it is a standing commitment.

### The Design Goals We Build To

These goals guided the products throughout development. We do not guarantee they
will all be met to your satisfaction at all times, because web technology
constantly changes.

| Area | What we committed to |
|---|---|
| **Devices and browsers** | Work on any device shipping the latest browsers from Apple, Google, Firefox and Microsoft |
| **Technology** | Standard web page architecture built on open-source technologies — HTML5, JavaScript and CSS |
| **Access** | Reached with a supported browser like any other secure web page |
| **Interface** | Touch screen and mouse-driven, adapting to screens of any size |
| **Apple devices** | Work on iPads as it does on the desktop (it works on Apple devices, though not perfectly) |
| **Screen size** | The bigger the screen, the better the experience and the productivity gain |
| **Data portability** | Move existing data in and back out easily using JSON and CSV |
| **Spreadsheets** | Synchronise with Excel and LibreOffice Calc through drag-and-drop gestures |
| **Encryption** | Full end-to-end HTTPS encryption at the level banking websites use |
| **Login** | A secure standard web token (JWT) login for the paid versions |
| **Tokens** | JWTs delivered automatically at login and never stored in the local browser as cookies |
| **Your data** | Never stored on our servers unless you publish it to the Cloud Dashboard |
| **Publishing** | The optional Cloud Dashboard and the Pubset feature do publish data stored on our servers, secured by HTTPS and JWT in the same way |
| **Dashboard database** | All customers share one physical Dashboard database. The only way to reach another customer's data is by knowing their username and password |
| **Dark mode** | Available to reduce eye strain during extended use in low light |
| **Offline** | Offline access to essential features, so critical tasks continue without a connection |
| **Accessibility** | Features ensuring all users, including those with disabilities, can use the product effectively |

### On the Roadmap

- Support for voice commands and natural language processing, for richer
  interaction with the products

### Why This Matters

We did not build another me-too tool. We harnessed the openness of the web, broke
free of old software traps, and gave you control — over your data, your device
and your workflow. This is management software rethought for a connected,
flexible, secure future.

## What You Should Know First

-------------------------------------
The following sub-section describes important Need to Know information First, before you can even get started.
The following help topics describe how to use any Timebars Ltd. products. For help related to an individual product see other tabs in the knowledge base for each product (Timebars, Agilebars, Costbars)

### How to Use for Free
You can try our products for free without registering. The free version limits how many projects, tasks and Pubsets you can hold, and there is no time limit — use it for as long as you like. The current limits are on the sales site.

There is no software to install. We apply data limits rather than a trial period so that users with small teams and portfolios can keep the price down.

Important Note: We don't install cookies on your device. Our management software products are secure web pages. Your data in stored in the browser cache, not on our servers (unless you choose to use the Pubset feature).

### How to Get a License
After registering and purchasing a subscription you can begin using our Apps as a licensed user. See video: how to purchase a subscription. In summary, your new license will automatically install when you log into one of our Apps.

If you wish to purchase a subscription, use the Quick Buy button found through out the site. Subscriptions are single person monthly purchases. Register with an email and password, purchase your desired subscription, then use the email/password combination as your license to log in and use our products with the desired data limits.

Our monthly subscription model has three pricing tiers. Each tier increases the data limits to suit your needs. After you purchase a subscription and log in, it automatically alters the data limits imposed by the free version to suit your new subscription, your project and resource data remains unchanged. You can buy one month at a time or up to 12 months in one credit card transaction. Read the Pricing Table & Sales FAQ at the Sales Site!

### How to Login/Logout
Click the Yellow Icon in the top most menu, right side, enter user name and password, same ones used when registering. That is it you are now logged in as a licensed user.

### Switching Products
There are scenarios where you may be running agile bars product and you drag and drop a Time bars based spreadsheet onto the canvas and you will find you may get an error about the license not being valid or correct. this may be normal And it requires you to log in again with the username and password from the desired product subscription.

### About Security and Product Limits
Data limits are enforced by product line and subscription tier. The limits — bars (every row below the Project level: Sub-Projects, Tasks, Allocations, Milestones, Gates, Risks, Issues and Notes), projects (backlogs in Agilebars) and cloud pubsets — come from the product you purchased and are downloaded when you log in. Tier-1 subscriptions include no cloud pubsets, so the Publish icons are hidden; OpenProject sync is included with Tier-3 only.
It calculates the number of days remaining until the license expires by comparing the current date with the expiration date store with the license. If the license is valid, it checks to determine the type of license and performs additional UI trimming based on the license type. For each product and license type, it checks if the bar count exceeds certain limits. If the limits are exceeded, it displays the appropriate user information message and re-establishes a demo license status so the user can continue with nag screens until a valid license is established.

### About Demo Data
When the App is loaded for the first time, the demo data is populated as part of the page loading process. This is a one-time thing and it's done only only the very first time you use the product you can and start new with fresh new demo data.

It is important to always start off with demo data because the mandatory seed data is installed. Seed data for the default pick lists (tags/metadata), timescale settings etc. The demo data consists of a demo license for free access to the product for life with data limits as stated in the sales site at www.Timebars.com.

There are two demo data sets, a small demo data set with a few Timebars and there is a large data set with over 350 bars. To load switch demo data, click on the hamburger icon on the top left of the screen to load the admin menu, click Data Actions, click clear demo data. Click either load demo data Small or load core demo data large defined by S or L in Brackets. 

The population of demo data includes not only project data but all the seed data. If you make changes to your time Bars by dragging them around the screen and if you create custom fields and other operations you will lose them all when you clear demo data and restore demo data from scratch so you have to be careful.


### Top Menu and the Main Menu
The top menu shows the product icon and name, import and export arrows, bar refresh icon, shopping cart icon and login icon. In the middle of the top menu is the currently logged in user, if the license is invalid or not downloaded yet it will show license status instead.

The Main Menu is a row of icons for launching core functionality of the application, an explanation of each follows within the Core Product Functionality section.

### The Hamburger Icon
Click the hamburger icon in the Main Menu to access links to various features, including the Filter Menu, Getting Started Page, AI Search, FAQ, WBS Generator, and Data Actions (such as Import, Export, Backup, and more).


## The Canvas
------------
Our application comprises two key components: the Kanban and Timescale canvases. The Timescale canvas, featuring Timebars, offers distinct advantages over traditional Gantt charts. Unlike Gantt charts, Timebars on the Timescale canvas empower users to effortlessly drag and drop bars to any position they desire. In contrast to the rigid one-row-per-bar format of Gantt charts, Timebars allow for greater flexibility in bar placement. 

This flexibility not only accommodates a larger number of bars on the screen but also enhances resource allocation and project scheduling, ultimately boosting the productivity of project management personnel.


### About the Timescale Canvas
The first thing you encounter when logging in with fresh demo data is the Getting Started Page. Once closed, the Timescale Canvas becomes visible by default. The Switch Modes icon on the Main Menu offers a choice between the Timescale Canvas and the Kanban Canvas.

The Timescale Canvas comprises a series of vertical lines that can be separated by either weeks or months. You have the flexibility to select the timescale (weeks or months) from the canvas settings window. Click Tools > Set Canvas to load the window. A flyout menu will appear, with the Set Canvas icon at the top. Click on it to adjust your time scale preferences such as either a weekly or monthly view. Furthermore, you can zoom in and and out buy selecting a zoom factor. The default zoom factor is 1.5, but alternatives include 0.5, 1.5, 2, and so forth. Be sure to save and close to apply your chosen settings. The Canvas will automatically reload.

Numerous other Canvas settings await exploration, such as toggling between light and dark modes, displaying baseline bars or ghost bars, and adjusting levels. We will delve into these topics later, as they are somewhat more intricate and warrant further documentation immediately following the Kanban discussion.


### About the Kanban Canvas

Kanban is a potent visual management tool that empowers teams to plan, track, and manage their work with exceptional efficiency. Its visual representation of project workflows fosters collaboration and transparency.

To switch to Kanban mode, simply locate the "Switch Modes" icon on the main menu at the top center of the screen. Clicking it again will return you to the Timescale mode.

The Kanban board is available in all our products, but each functions differently to cater to either Agile or Classic management processes. For more specific information, please refer to the dedicated help topics for the product you are interested in.


### The Timebar Hierarchy
Timebars conforms to 3 different hierarchies. The minimum is a 3 level hierarchy, and maximum is a 5 level hierarchy with a 4 level hierarchy in the middle. The rules are built into the tool to not allow violation of these hierarchies as you drag and drop Timebars to create schedules. Each level is color coded to make it easy to remember the levels in the hierarchy and to allow choice as to what levels are needed.

L1 - Dark Grey
L2 - Green (Always a Project for all 3 hierarchies)
L3 - Orange
L4 - Blue (Always a Task for all 3 hierarchies)
L5 - Gold (Always an Allocation for all 3 hierarchies)

#### The maximum 5 Levels:
You can optionally look at the 5 level hierarchy as follows:

L1-Portfolio
L2--Project/Program
L3---SubProject
L4----Task (incl milestones and gates)
L5-----Resource Allocation

#### The medium is a L4 level hierarchy:
For most small and medium sized projects 4 levels is sufficient. This one is the same a the 5 level except it allows a user to not use the Orange bars.

L1-Portfolio
L2--Project/Program
L3----Task (incl milestones and gates)
L4-----Resource Allocation

#### The minimum is a L3 level hierarchy:
For most small and medium sized projects 4 levels is sufficient. This one is the same as the 5 level and 4 level except it allows a user to not use the Dark Grey L1 bars.

L1--Project/Program
L2---Task (incl milestones and gates)
L3---Resource Allocation

### Canvas Settings

**Adjusting the Weekly/Monthly Settings:**
  - To switch to a weekly timescale:
    1. Click on the wrench icon on the Main Menu.
    2. Click on "Canvas Settings".
    3. Change the radio button to "weekly".
    4. Click "save and close".

  - For optimal viewing, it's recommended to set the Zoom Factor to 1. Click and drag the slider icon and drop it to see the zoom factor.

**Adjusting the Time Scale Start, Report Date**
The timescale must always start on a Monday so that the scheduling engine has a work week reference point. The Report Date is one of the most important settings for the automatic cost, hours and date calculations to be accurate. It must be set to a work week day, not a weekend to improve accuracy. When you change the Time Scale Start, Report Date, the settings stored in IndexedDB and reused when the page loads.

The general rule is that if a bar is visually behind the Report Date line on the Timescale canvas, it will automatically set actual dates, costs and hours based on the configurations. You will learn about how to configure this later.

**Show Baseline, Ghost and Visible Levels**
Show Baseline Bars: Yes/No - If the user has set a baseline and this value is set to Yes, it will show Baseline Bars on the Canvas as thin bars below each timebar

Show Ghost Bars: Yes/No - If the user has this value is set to Yes, the dit will show Ghost Bars on the Canvas. This is useful to see the original position of the bar as a light ghostly bar.

Visible Levels, L1, L2, L3, L4 or L5 - The user can check off which levels in the hierarchy to hide on the Canvas. For example if L2 is checked, bars at levels L1 and L2 are shown, hiding the levels below. This is useful to reduce clutter on the screen for large data sets.

Hide Completed Bar True/False - If set to true, bars in the past (before the Report Date) are hidden.

### L3 / L4 / L5 Level Tick Boxes on the Main Menu

Three tick boxes sit in the Main Menu, beside the timescale changer, and decide
how far down the hierarchy the canvas draws:

| Tick box | Hides when cleared |
|---|---|
| **L3** | Sub-Projects |
| **L4** | Tasks, Milestones and Gates |
| **L5** | Allocations |

**L1 Portfolio and L2 Project bars are always shown** — only the three lower
levels are optional. Clearing L5 on a large plan is usually the quickest way to
turn a wall of allocations back into a readable portfolio.

They apply to the **Timebar View, Modern View, Filters View, and the Vertical and
Horizontal Timelines**. They do not appear on the Gantt Schedule View, which has
its own tick boxes in its filter panel, and not in Agilebars, which has no L1,
L3 or L5 hierarchy. They are also hidden while the Filter Menu is loaded — that
menu already decides which rows are on screen, so the tick boxes would do
nothing there.

Your choice is saved with your settings, so it survives a page refresh and rides
along with a backup and restore.

### Bar Spacing and the "Fit" Tick Box

Next to the level tick boxes are a **spacing picklist** (Small, Medium, Large)
and a **Fit** tick box. This is the one place in the application where vertical
bar spacing is chosen.

**Spacing** means different things depending on how a view places its bars:

| View | What the spacing setting does |
|---|---|
| Modern View, Filters View | Sets the row height. Bars always sit on even rows |
| **Timebar View** | Nothing *until you tick Fit* — see below |
| Vertical and Horizontal Timelines | Sets the spacing between points |
| Gantt Schedule View, Kanban | Ignored — these lay themselves out |

**Fit** is the trade-off tick box, and it only appears on the Timebar View.

The Timebar View's defining feature is that you place bars wherever you like
vertically — that freedom is what lets you fit far more work on one screen than
a conventional Gantt chart. The cost is that a plan built that way can end up
looking ragged.

Tick **Fit** and the Timebar View lays every bar out on even rows at the spacing
you picked, cleaning the view up instantly. You keep horizontal drag and resize,
so you can still reschedule; what you give up is **vertical reorder** — bars are
on their rows and cannot be dragged up or down. Clear the tick box and your
hand-placed positions come back, because they were never discarded.

Use it to tidy a plan for a screenshot or a review, and clear it when you go back
to laying bars out by hand.

Both the spacing and the Fit setting are saved with your settings and survive a
refresh, backup and restore.

The picklist hides in the two cases where there is no spacing to pick — while the
Filter Menu is in use (it draws bars at the exact position stored on each row),
and in Agilebars.

### Refresh the Canvas
Quickly refresh the Canvas and bars without a full browser page reload.

* Click the Refresh icon on the top menu (black)
* Will invoke a full cost schedule rollup

### Reload the Canvas (Full Browser Page Reload)
Sometimes you may want a full browser page reload if the page seems to be rendering something unexpected.

* Right click on Canvas > Reload Page or
* Use the standard browser page reload that is available on all browsers, typically located to the left of the URL (e.g., tb.timebars.com)

### Recalculate All System Generated Data
The System can perform a complete recalculation: hours/cost rollup, updates L1 to L5 hierarchy names, hierarchy numbers (WBS), and re-populates the tbMDJoined data store if you notice data anomalies.

* Right click on Canvas > Recalculate All
* There are other Recalculate All buttons, such as on the Reports Page, to ensure that the system data has complete and updated information


## How to Manage your Data
-------------------------------------
### Download Open Office Spreadsheet
This OpenOffice Calc spreadsheet is specially designed to sync with all Timebars products with the ability to optionally synchronize your data with OpenOffice Calc to move data in and out of our products in a fast, clean and simple manner. Click on the Hamburger icon to launch the Admin menu, near the bottom is the link to download the spreadsheet. See the Spreadsheet syncing topic below for further details on how to use it.

### Download Excel Spreadsheet
This Excel spreadsheet is specially designed to sync with all Timebars products with the ability to optionally synchronize your data with Excel to move data in and out of our products in a fast, clean and simple manner. See the Spreadsheet syncing topic below for further details on how to use it.

### Spreadsheet Syncing
tbClient Pre-configured Spreadsheet Syncing: How It Works

Licensed users will have access to our spreadsheet, which contains custom code that facilitates the synchronization of data between exported CSV files and the spreadsheet. To achieve this synchronization, the code inside the spreadsheet imports CSV files stored in a user-configurable location on the hard drive.

From the app, users should first click the export button to save CSV files to this designated location. Once saved, the data in these CSV files can be imported into the spreadsheet by clicking the "import all" button located on the setup page.

Below is a description of the setup page inside the spreadsheet (a screenshot would typically be here). Notably, both the import and export locations can be adjusted to fit any directory on your hard drive. On the setup page, you can utilize the "import all" button to pull data from all stores that have a "yes" marked in the "import yes/no" column. However, if you prefer to selectively import specific data, such as time bars and metadata, you can navigate to the respective tabs and use the individual import buttons.

Within the spreadsheet, users have the flexibility to manually edit data. This includes adding new tasks, modifying resources, changing tag data, and using common Excel functionalities like drag-and-drop, copy-paste, and fill-down.

When you've finished making your edits, ensure you save your changes. After saving, simply drag and drop the spreadsheet onto the application canvas, and the app will update to reflect the modifications. It's crucial to remember not to make edits in the app while the data is in the spreadsheet, as doing so could lead to overwriting and loss of your changes.

### Export as CSV (multi-file)
Export all data stores to csv for import into spreadsheet

### Database Backup and Restore
Drag and drop the spread sheets or the JSON backup file for full restore of all data

### Editing Data Inside the Application
Sometimes it is quicker to edit data in the application than to go out to the
spreadsheet. Every store now has its own **tabular report** on the Report Menu,
rather than one combined grid:

| To edit | Go to |
|---|---|
| Bars, tasks, metadata | **Report Menu > Project > General Tabular View**, or the Gantt Report |
| The resource pool | **Report Menu > Resource > Shared Resource Pool** |
| Picklist values | **Report Menu > Other > Picklist Values** |
| Form and layout configuration | **Report Menu > Other >** Fields Values, Schema Values, CoreReport Values |

The schedule and metadata grids are edited **in place** — click a cell and type.
The four configuration reports are read-only in the grid and edited on their
form; see the *Forms, Reports and Graphs Guide* for why.

> The old **Data Management Grids** screen, which put every store behind one set
> of tabs, has been removed. Each of its tabs is now a proper report in the list
> above.

## Data Actions Menu
The Admin menu — the **Hamburger icon** at the top left of the main menu — carries
the data actions. Each one is covered in full in the *Synchronization and Data
Control User Guide*; this is the summary.

| Menu item | What it does |
|---|---|
| **Full Backup** | writes every store to one JSON file — your restore point |
| **Export to CSV (SpreadSheet sync.)** | writes 15 CSV files, one per store, for the workbook round trip |
| **Export to JSON** | writes 15 JSON files, one per store, for integrations |
| **Import SpreadSheet, CSV or JSON** | opens the drop panel — drop a file, or browse for one |
| **Bulk Manage Bars** | duplicate a bar and its children, or transfer bars to another product |
| **Migrate Rich Text** | converts legacy rich text to the current editor format; safe to run any time |
| **Clear Timebars & Metadata** | a clean canvas, keeping your resources, picklists and configuration |
| **Load Demo Data** | replaces the data with a demo set for this product |
| **Delete Database** | destroys everything; refresh afterwards to rebuild with demo data |
| **Download Excel SS / Libre Office Calc SS** | the workbook template |

Two things are worth knowing before you use any of them:

- **A Full Backup is taken automatically** before an import, a demo data load, or
  Clear Timebars & Metadata. **Delete Database is the exception** — it does not
  back up for you.
- **An import replaces each store rather than merging into it.** If you have
  edits in the application that are not yet in the spreadsheet, the application
  **blocks the import** and shows a warning icon on the top menu. Double-click
  that icon for the way out. This is covered properly in the
  *Data Synchronization Backup Recovery And Retention User Guide*.

### Clearing data by hand

You can clear individual stores from the browser's own developer tools — F12,
Application tab, IndexedDB, right-click a store, Clear. Deleting the whole
database there works too, but **no backup is taken first**. Refresh afterwards
and a new database is built with demo data; drop one of your backup files on the
import panel to get back to where you were.

Prefer **Clear Timebars & Metadata** on the menu for the everyday case — it backs
up first and keeps your configuration.

# Core Product Functionality
This section provides details about the user interface that enhances your productivity and serves as the core functionality across all our products.

## Automatic Calculations
-------------

### Scheduling Engine
The scheduling engine is at the heart of the application and it is proprietary. It is not something that you can see or hear but it is listening and running in the background. With its advanced algorithms, it can recalculate your schedule in a matter of seconds when you make any changes to your project such as when you drag and drop a bar, adding resources, changing the percent allocated or changing the time scale.

For example if you have a set of bars on the timescale and one bar is moved, this bar and the child bars will have new dates, costs and hours calculated by the scheduling Engine. Tasks with relationships to other tasks also calculate new dates for the successors in addition to the child bars. If a bar has a constraint on it it states will not be recalculated by the scheduling engine.

### Automatic Cost and Schedule Rollup
In order for the reports graphs and charts to be accurate we have to continually roll up or sum up the data as it's being created or modified. The process of automatically rolling up data is to aggregate cost and hours data from lower levels of a hierarchy into higher levels. All products enforce a 5 tier hierarchy also known as levels which are abbreviated like this: L1, L2, L3, L4 and L5. 




### Switch Modes (Timescale/Kanban)

Switch to Kanban mode from the Main Menu by selecting the "Switch Modes" option. 

Imagine a project represented as a green bar. In Kanban mode, this project is managed using swim lanes. The blue bars signify individual work items or tasks, representing the backlog items chosen for the current Sprint. 

There's also a filter option which allows users to transition between different projects. Using this filter, one can view various work items in the project's backlog. The project team then decides which tasks they'll undertake. Once these are selected, a burn down chart can be plotted to visualize progress. As tasks shift between stages like 'doing' and 'done', progress is tracked automatically. The burn down chart can be revisited at any time to compare the initial plan with the ongoing progress.

Additionally, users have the option to toggle between viewing tasks as bars or text boxes in the Kanban view.


### Filter Menu
The Filter Menu is derived from the underlying hierarchical data. Each row is a hyperlink that allows drill-down or filtering at specific levels of the bar hierarchy to reduce clutter. Double-click the pink FM tab to launch the Filter Menu. Click the Filter Icon to remove the filter completely and hide it.

The menu renders three levels: L1 (brown bars), L2 (green bars), and L3 (orange bars). Agilebars renders one level: Project. When a level is clicked, a filter is applied. The selected level is saved so that when the user returns it will show the filter menu and the filtered project by default.

### Main Filter Panel
The Main Filter Panel helps users refine and focus on specific projects and tasks based on freeform search or metadata picklists.

* Choose Main Filters on the Main Menu
* Click button to Reset filters to get back to an unfiltered state
* Click the X to close the Filter Panel and go back to the Canvas with all bars loaded
* Notice that the bars are all shown on individual lines, not beside each other as shown when the Filter Panel is closed



## How to Create Bars

Launch the **Creator Bars** popup to create new bars. Drag a bar from the popup and drop it onto an existing bar to establish a hierarchical structure.

* Choose **Main Menu > New Bar**

### Steps to Create a New Bar

1. If there are no existing bars, a special step is required to create the first bar at the top of the hierarchy
2. Begin dragging a **Creator Bar**, and follow the instructions displayed in the **dashed box** before dropping it as instructed

Create new L1 Portfolios, L2 Projects, L3 Sub-projects, L4 Tasks and Milestones and L5 Allocations. Also create Gate Notes to link and show notes on the Canvas.

Bars are created by drag and drop that forces the hierarchy of L1 to L5. When you drag the L2 Project Creator Bar, instructions pop up on the right. If an L1 exists, drop it on top to create and link the L2 bar. Or you can decide not to link it to the L1, this could be considered as a standalone project, not belonging to a Portfolio L1 bar if you choose.

The Filter Menu will show it as such. We recommend always using an L1 bar as a scheduling best practice. L3 orange bars can only be created by dropping the Creator Bar on an L3 bar, dropping it anywhere else is not allowed and the user is notified. Task and Milestone Creator Bars can only be dropped on L2 or L3. Gate Notes can be dropped at any level, L1 to L5.

### Example in Agilebars

- **Task bars** can only be created by **dropping the Task Creator Bar (blue) onto a Project Bar (green)**
- Dropping the Task Creator Bar elsewhere will trigger a **user notification** and prevent the action

## Filter Menu
The filter allows the user to drill down into specific levels in the hierarchy. All products enforce a 5 tier hierarchy known as levels abbreviated like this: L1, L2, L3, L4 and L5. In the graphic above the pink FM tab, when its double clicked it opens the Filter Menu and the user can click to drill and filter. When they click, the “isFilteredFrom” value is stored in indexedDB, so the next page reload it will hit drawBarsFromP3Menu(isFilteredFrom, tbID) function more on this later. The graphic below shows the Filter Menu, it can only render L1, L2 and L3 items. In this case the brown bar indicates it is an L1, Green is L2 and Orange is an L3 (See the “L” at bottom left of all bars). For example If the user clicks on an orange bar, the filtering will look like this:

## Shortcut Menu
The Shortcut Menu is standard “Right Click” functionality like in any app. Right click on the canvas and the shortcut menu will pop up. There is a different shortcut menu for the kanban View.

Right-click anywhere on the Canvas to bring up the Shortcut Menu for quick access to: Canvas Settings, Bulk Move, Refresh Bars, Filter Menu and Toggle Bars vs Time Boxes on the Kanban Board. Bulk Move allows moving many bars at once to a new position on the Canvas.

## Toggle Light/Dark Mode
In software development, "dark mode" and "light mode" refer to two different color schemes or visual styles that can be applied to user interfaces. 1. Dark Mode: Dark mode, also known as night mode or dark theme, is a design option where the user interface predominantly uses dark or black backgrounds with lighter text and elements. This color scheme is intended to reduce the amount of light emitted by the screen, making it more comfortable to view in low-light environments. Dark mode is often preferred by users who find it easier on the eyes or who want to reduce eye strain, particularly in dimly lit conditions. 2. Light Mode: Light mode, on the other hand, is the default or traditional design option in many software applications. In light mode, the user interface typically uses light or white backgrounds with darker text and elements. This color scheme is more reminiscent of the classic paper-like appearance and is often the default choice for readability in well-lit environments. The choice between dark mode and light mode is largely a matter of personal preference and user experience. Some individuals may find dark mode more visually appealing or less intrusive, while others may prefer the traditional light mode. Many software applications and operating systems now provide the option to switch between these modes to accommodate different user preferences and environments.

## Creating Relationships between Tasks
To create relationships between Tasks, this tells the scheduling engine to reschedule the successor bar as well, by the same amount of time. Te create a relationship drag a task by grabbing the beginning of it and dragging it over the ending of the target bar and droppin it as shown below.

## Show/Hide Hierarchy Lines
To show the hierarchy lines on the Canvas:

* Right click on the Canvas to show the Shortcut Menu and click "Hierarchy Lines" or
* Choose Tools > "Hierarchy Lines"

For example to see the hierarchy through the lines: The Gold Bar (L5) is linked to the Blue Bar (L4), the Blue Bars are linked to the Orange Bar (L3), Green Bar (L2) is linked to the Brown Bar at L1. The Brown bar is the top of the hierarchy.


## How to Turn On/Off Bar Relationship Lines
To toggle relationship lines between tasks:

* Right click on the Canvas to show the Shortcut Menu and click "Bar Relationships" or
* Choose Tools > Bar Relationships

## Task Bar Lines (Relationships)
To show the Task Lines on screen, turn on Task Bar lines as described above. Relationship lines visually connect predecessor and successor tasks, showing task dependencies in your schedule.

## Drop to Delete Bar Lines
To remove a relationship, drag and drop the successor bar on the “Drop to Delete Task Lines” Pad.

## Manage Constraints
Add constraints to tasks so they are not rescheduled ever. Click the Edit Menu button on the Main Menu then click on the Manage Constraints link.
The pin now shows and the Canvas has been darkened.
The pin can be dragged and dropped on a task to constrain it.
Remove the constraint by clicking on the pin on the bar and dragging it off the bar and dropping it on the Canvas.

## Popup Cost Schedule Form Off of Bar
To load the popup the user clicks on the lower portion of the bar e.g. T:3773… it will load the form below the bar associated with the bar, works at all levels.

## How to Make Edits to Bar and Metadata

There are multiple ways to edit bars and metadata throughout the application:

### Method 1: Flyout Form
* Click on the **bar Name** to open the right side flyout form
* Click on Name Field, make changes
* Data is saved automatically when you move off the field
* Close the form when done

### Method 2: Freeze Bars for Quick Edits
* Click the **pink FZ Tab** on the left side of the Canvas to freeze the Bars so they cannot be moved
* Simply change the bar name directly on the Canvas
* Click on another bar to save your changes
* Click the **Refresh Icon** on top black menu to remove the freeze

### Method 3: Core Report
Launch the Core Report from multiple locations:
* Click on a **bar ID** (bottom left of any bar) to launch the Cost Schedule popup, click "Core Report"
* Launch the Core Report from rows in the **Risk and Issues page**
* Launch the Core Report from rows in **Tabular and Card View reports** available from the Reports Menu

### Method 4: Spreadsheet Sync Feature
* Use the Spreadsheet Sync Feature to change metadata in bulk
* Export data to spreadsheet, make changes, and load it back into the application
* See Data Management section above for details

**Note:** Edits are saved automatically when you move off a field throughout all editable fields in the applications.

## Metadata Coding

Metadata coding is a flexible way to organize and break down a project into groups of activities. By establishing a coding structure and assigning codes to Timebars it will allow virtually any view or report of your project information.

The metadata codes are maintained in the custom spreadsheet template and are updated in the Timebars Web App by drag and drop gestures on the Canvas. There is no complex code tables and look up tables to maintain, just spread sheet maintenance and Timebars does the rest saving you time.

## Metadata View
Available from the Cost/Schedule Popup form.

## How to Create a Baseline

When planning is complete and before work begins, create a baseline to generate your Planned data. Use the Planned data to compare with current data and actuals for variance reporting.

Easy Baseline Management: When Sprint planning is done and before the work starts, set a baseline or snapshot with one click. Compare current forecast to the baseline (original plan) with the burndown chart and other reports with one click. Unlimited baselines supported.

### Steps to Create a Baseline

1. Click on a **Bar ID** (bottom left of any bar) to open the Cost Schedule popup
2. From the popup, click the **"Set Baseline"** button to create a baseline for this bar and all its child bars
3. The checkbox is enabled by default, so it will **overwrite an existing baseline**
4. You can set a baseline at the **L2 Project Level (green bar)** or any level below it, but **not at the L1 (brown bars) level**

When the Set Baseline button is clicked and the check mark is on, the previous baseline is lost. The baseline will be created at the current level and all child bars below it in the hierarchy.

## How to Update a Baseline for Added Scope

If the checkbox is unchecked, this Timebar and any child Timebars without an existing baseline will not delete existing baseline data. This is necessary for scenarios where the baseline is initially set, and later a new bar and/or its children need to be added to the baseline.

**Use Case:** The Baseline is initially set at L1, then later, an individual bar and its children need to be re-baselined without affecting existing baselines.

## How to Delete Bars

To delete a bar, **drag and drop it onto the Trash Can** located on the **left side of the Canvas**. This will remove the bar along with all of its child bars.

When a bar is dragged, the Edit Menu shows automatically, allowing you to delete one bar at a time or the dropped bar and all child bars, one level below. For example if you delete a Task, the Allocations will be deleted also, if you wish to delete just the Task and keep the Allocations, drop the bar on the Delete One pad.

### Important Notes

- If you want to delete a bar and keep the child bars, first move the children to another bar in the hierarchy using **drag and drop**
- **Deleting cannot be undone**, so if needed, **make a backup first**:
  - Select **Hamburger Icon > Full Backup**
  - To restore a backup, simply **drag and drop the backup file onto the Canvas**
- **Undo Bar Move does not cover deletion.** It puts *moved* bars back where they
  were; it cannot bring a deleted bar back. A backup is the only way back from a
  delete. See *Undo Bar Move* in the **Data Synchronization, Backup, Recovery and Retention Guide**

## Drop to Duplicate Bars
Below is the result of duplicating a project. After dragging and dropping the duplicate onto the L1 bar (brown), it shows in the Filter Menu as a new project. The child bars were not duplicated. There are other ways to do this such as the SpreadSheet. More on this later.

## Bulk Move Tasks
To Bulk Move Tasks or to drag and drop many tasks at one time, click the Edit Menu button on the main menu then click on the Bulk Move Tasks link.
Now click on each task that is to be moved, then click again and drag and drop to the right place on the timescale. Notice that selected bar are highlighted with blue dotted lines. When done, screen refreshes and bars have been rescheduled including child bars or Allocations.

* Tip: When you get to the last bar that you plan to move, double-click it then drag.

## Bulk Move Projects (Costbars Only)
To bulk move Projects (green bars) in Costbars:

* Choose Tools Menu > Bulk Move Projects link to reschedule Projects (green Bars) in bulk
* Click on two or more projects to highlight them, then drag and drop to reposition them

Notice that selected bars are highlighted with green dotted lines. When done, refresh the screen and confirm they have been rescheduled including the child bars.

* Tip: When you get to the last bar that you plan to move, double-click it then drag.

## Change Creator Bar Names
The names and descriptions of the six Creator bars are configurable, and they live
in the Tags store.

Go to **Report Menu > Other > Picklist Values**, filter the **Picklist** column to
the relevant list, then click the edit icon on the value you want. Change its
**Short Name** — that is the text shown on the Creator bar — and its **Purpose**,
which is the instruction text in the Creator Bar popup. Changes save as you type.

Leave the other columns alone. A value that carries a **padlock** cannot be
renamed at all: the application compares against that exact text, and renaming it
would break a calculation silently. Adding your own values is always safe.

You can also change these in the Tags worksheet and sync back to the app.

## Metadata View
The metadata view is available from several locations within the application, such as the General Tabular View and from each bar on the canvas. This view is a large collapsible report or form that allows for editing metadata based on business driven headings such as business case cost and schedule information etc.

## Get Started Page
From the main menu click on the hamburger icon to launch the admin menu. The "Getting Started" menu graphic is shown below. From there you can fire up the getting started page.
Below is a view of the getting started page which can be configured to fire up by default every time the application loads for the first time.

## FAQ
The FAQ can be launched by the link on the Admin Menu similar to how the Getting Started page is set up and called. The graphic below shows the frequently asked questions page each question is in a drop-down when you click on another next question the current one collapses.

## Intro
The intro can be launched from the right side tools menu. Each of the three applications has been configured so that the intro is launched whenever a new database is created in other words when a user first uses the app. Most users will read the intro once and click close don't show the intro again or if you click skip intro it will close and fire up the next time you relaunch the page.

## Tour
The tour can be launched from the tools menu slide out right tools menu by clicking on the tour link when the tour is fired it starts at the hamburger icon and you just keep clicking next and the tour stops off at each of the visible UI portions of the application it's a nice little tool to inform the users quickly who are new about the usability and features.

# Risk & Issues Features

## Overview of Risks and Issues
The risk system has the same look and feel as the risks and issues system but data storage is different. Click on the Risks and Issues button on the main menu to launch the risk list. From the filter menu, find the project you want and click on it to view linked Risks and Issues.

### Create New Risks and Issues
Risks and Issues are created by adding a task with the Bar Creator and launching the Slide Out Right Form. The SubType can be set as Risk or Issue, and additional metadata fields can be configured for filtering and grouping.

### Filter Risks and Issues
Use the Risks/Issues page to track and manage lists of risks and issues. Filter by project and view the status of each item. Edit details of a Risk or Issue by launching the FOCD Form.

### Edit Risks and Issues
Edit the status, title, and content of a Risk or Issue by clicking on the edit icon and entering data in markdown format.

### Add fields to the Form
Use FOCD to add or remove fields in the form to customize it according to specific needs or methodologies.

# Local Reports Menu
The Reports Menu gives access to tabular reports, charts and the configuration
tables. It is grouped into five menus: **Portfolio**, **Project**, **Task**,
**Resource** and **Other**.

## Portfolio, Project and Task Reports
Projects by Portfolio, Drilldown from Portfolio and Portfolio Detail at portfolio
level; the General Tabular View and Baseline Variance at project level; the Task
Tabular Report and the Gantt Report at task level.

## Resource Reports
Resource Usage — the supply and demand grids and charts — and the Shared Resource
Pool.

## Other
Print WBS, and the five configuration reports: Picklist Values, Fields Values,
Schema Values, CoreReport Values and Config Integrity.

See the *Forms, Reports and Graphs Guide* for what each one does.

## Joining tbTimebars and tbMetaData Stores
The function in scripts/tbdatabase.js joins the tbTimebars store and the tbMetaData store, creating a new store called tbMDJoined. This combined data store is useful for reporting, dashboard code, and integration with other tools.

# Burndown Chart

## What is a Burndown Chart

Easily generate Burndown Charts with one click that are based on Agilebars data in the browser that was generated while using the Kanban Board canvas and/or the Timebars Timescale canvas. Switching lanes in Kanban mode updates the progress of sprint work based on internal rules. For example dropping an Agilebar in the Done lane, sets the work item to 100% complete which feeds the burndown chart.


To launch the burndown chart click on the Project ID, in this case Pj:40 and launch the Burndown Chart. Click the “Refresh Button” to calculate the graph, then click Run to launch it.

## How to Calculate the Burndown Chart
The graphic below shows the core function that will timephase the data for the burndown chart. It calls many other functions, not shown. There are 2500 lines in kanvanv2.js file.

# Local Dashboard

## What is Local Dashboard

The Local Dashboard, (not to be confused with the Cloud Dashboard), is the place where your data is transformed into information. It has four tabs for the Agilebars and Timebars Apps (Summary, Resource Demand Charts, Project Status and Finance), and three additional tabs for the Costbars PPM functionality (Programs, Priorities and Strategy). The filter menu drives the dashboard at the L1 level. Each page of the Dashboard is a FOCD form so the user can add and remove fields to suit, there are up to 150 different fields available.

Timebars Ltd. Products provides two dashboards because many customers will not be allowed to store their data in the cloud due to security reasons. Corporate data is often proprietary and if exposed to unwanted eyes it could pose serious threats to the organization. Therefore there is a local dashboard that is available on the main menu that pulls data from the index DB inside the browser. 

In the example below the L1 title “Digital Works Space - Transformation” is available because there is one L1 in the data set. Each page of the Dashboard is a FOCD form so the user can add and remove fields to suit, there are up to 150 different fields available.

## Summary Tab
Currently shows the following fields as part of the Demo Data. This form renders data from L1 rows only. User can add and remove fields as needed.

## Resources Tab
Shows the same set of buttons as on the Resource Allocator to show Weekly Demand by various metadata. This form renders data from ResCalcs2 store.

## Project Tab
Shows the projects which are children of the L1 (Digital Workspace - Transformation). Multiple L1 bars would be listed in the Filter Menu. This form renders data from L2 rows only in the tbTimebars store.

## Financial Tab
This form renders data from L1 rows only. User can add and remove fields as needed. The Cost Analysis field can be edited using the rich text editor.

# Cloud Publishing

## Overview of Publishing
The Cloud Publishing feature is opt-in functionality with secure Cloud login and authentication. The Cloud Dashboard provides customizable and dynamic reports and graphs, for insightful visualizations. Also rehydrate the Cloud data on another device. e.g. work from your PC one minute and on your Ipad the next.

## Cloud Login
Code location and details about the cloud login process.

## Show License
Clicking on the Show License Button displays the license details, including the quantity of PubSets available and the expiry date.

## Create Your Pubsets
PubSets are created automatically on cloud login and topped up to the number the license includes (none for Tier-1). They are never deleted automatically.

## Publish to Update Cloud Dashboard
Publishing PubSets allows updating the cloud dashboard, rendering charts and reports.
