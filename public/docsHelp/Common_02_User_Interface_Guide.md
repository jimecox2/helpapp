# User Interface Guide - Common Across Products
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

## Table of Contents

- [What You Should Know First](#what-you-should-know-first)
- [The Canvas](#the-canvas)
- [How to Manage your Data](#how-to-manage-your-data)
- [Data Actions Menu](#data-actions-menu)
- [Core Product Functionality](#core-product-functionality)
  - [Automatic Calculations](#automatic-calculations)
  - [How to Create Bars](#how-to-create-bars)
  - [Filter Menu](#filter-menu)
  - [Shortcut Menu](#shortcut-menu)
  - [Toggle Light/Dark Mode](#toggle-lightdark-mode)
  - [Creating Relationships between Tasks](#creating-relationships-between-tasks)
  - [Show/Hide Hierarchy Lines](#showhide-hierarchy-lines)
  - [How to Turn On/Off Bar Relationship Lines](#how-to-turn-onoff-bar-relationship-lines)
  - [Task Bar Lines (Relationships)](#task-bar-lines-relationships)
  - [Drop to Delete Bar Lines](#drop-to-delete-bar-lines)
  - [Manage Constraints](#manage-constraints)
  - [Popup Cost Schedule Form Off of Bar](#popup-cost-schedule-form-off-of-bar)
  - [How to Make Edits to Bar and Metadata](#how-to-make-edits-to-bar-and-metadata)
  - [Metadata Coding](#metadata-coding)
  - [Metadata View](#metadata-view)
  - [How to Create a Baseline](#how-to-create-a-baseline)
  - [How to Update a Baseline for Added Scope](#how-to-update-a-baseline-for-added-scope)
  - [How to Delete Bars](#how-to-delete-bars)
  - [Drop to Duplicate Bars](#drop-to-duplicate-bars)
  - [Bulk Move Tasks](#bulk-move-tasks)
  - [Bulk Move Projects (Costbars Only)](#bulk-move-projects-costbars-only)
  - [Change Creator Bar Names](#change-creator-bar-names)
  - [Metadata View (2)](#metadata-view-1)
  - [Get Started Page](#get-started-page)
  - [FAQ](#faq)
  - [Intro](#intro)
  - [Tour](#tour)
- [Risk & Issues Features](#risk-issues-features)
  - [Overview of Risks and Issues](#overview-of-risks-and-issues)
- [Local Reports Menu](#local-reports-menu)
  - [Schedule Reports](#schedule-reports)
  - [Resource Reports](#resource-reports)
  - [Joining tbTimebars and tbMetaData Stores](#joining-tbtimebars-and-tbmetadata-stores)
- [Burndown Chart](#burndown-chart)
  - [What is a Burndown Chart](#what-is-a-burndown-chart)
  - [How to Calculate the Burndown Chart](#how-to-calculate-the-burndown-chart)
- [Local Dashboard](#local-dashboard)
  - [What is Local Dashboard](#what-is-local-dashboard)
  - [Summary Tab](#summary-tab)
  - [Resources Tab](#resources-tab)
  - [Project Tab](#project-tab)
  - [Financial Tab](#financial-tab)
- [Documents Features](#documents-features)
  - [Overview of Documents](#overview-of-documents)
  - [Create New Documents](#create-new-documents)
  - [Filter Documents](#filter-documents)
  - [Edit Documents](#edit-documents)
  - [Add fields to the Documents Form](#add-fields-to-the-documents-form)
- [Cloud Publishing](#cloud-publishing)
  - [Overview of Publishing](#overview-of-publishing)
  - [Cloud Login](#cloud-login)
  - [Show License](#show-license)
  - [Create Your Pubsets](#create-your-pubsets)
  - [Publish to Update Cloud Dashboard](#publish-to-update-cloud-dashboard)

---

## What You Should Know First

-------------------------------------
The following sub-section describes important Need to Know information First, before you can even get started.
The following help topics describe how to use any Timebars Ltd. products. For help related to an individual product see other tabs in the knowledge base for each product (Timebars, Agilebars, Costbars)

### How to Use for Free
You can try out our products for free without registering, but with data limitations based on the number of projects, tasks and Pubsets. se it for as long as you wishSee sales site for limits. Could put table in here!! No software to install, see how much your productivity will increase. We implement data limits to keep the price down for users with small teams and portfolios.

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
Data limits are enforced by product line and subscription tier.
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

### Data Management Grids and Edit Forms
Sometimes it is necessary to edit data quickly within the application and not have to use the spreadsheet. This is where the Data Management Grids come in handy. To launch the Grids go to the reports page by clicking on the reports iPhone in the main menu. From this page click Data Management Grids to launch all pages, Which will show the data from the stores in a tab based format. Click on each tab and see all the data that’s inside the indexedDB In a tabular format for example click on tags tab and see all the tags I have been configured for your application then click on the pencil icon to launch a static edit form make your changes click save and close.

## Data Actions Menu
On the Admin menu, which is available by clicking the Hamburger icon in the top left of the main menu, there is a Data Actions heading with many buttons available. As shown here. The functionality is described further down in the document.

### Core Demo Data (S)
Click to import a small demo data set.

### Core Demo Data (L)
Click to import a small demo data set.

### Create Full Backup
Click to create a full backup of all data stores inside of one JSON text file.

### Data Import
The best way to import your back up files or other files that are permitted is with drag and drop gestures. You can drag and drop a spreadsheet file or a CSV file on the canvas import that data. Another way to import data is from the admin panel which is available by clicking the hamburger icon in the top left of the main menu there are buttons available that allows to import the back up text files or CSV files without having to drag and drop, you can use the file picker.

### File Importer
Import from spreadsheet

### Delete Database
Deletes the browser based database and will automatically rebuild it with demo data small.

### Data Export to CSV or JSON

Export all thirteen data data stores as CSV file format which will create 13 files in the Downloads folder as per your browser settings. Use the tbClient Spreadsheet to automatically import these files in one click as part of Spreadsheet Sync feature.

On the Admin menu, which is available by clicking the hamburger icon in the top left of the main menu, there is a Data Actions heading with many buttons available. These allow users to export all the data stores to CSV files or to individual JSON files with a single click. These files can be useful for importing to the spreadsheet or to import into your own systems as required.

### Manually clearing data stores
You may want to delete all bars that are on the screen without deleting any of the other application data such as resource list, reports, issues, documents, tags and fields. The browser has a set of tools for this. Hit F12 then choose the application tab in the browser tools and click on indexeddb, click on the Click on the thyme bar store right click then click clear you would have to do the same for the metadata store and the baseline store.
Please note that it is possible to delete the entire database from the F 12 developer tools and if you do no back up will be taken first and when you refresh the screen or the browser a brand new database will be created with the default set of demo data. You can then drag and drop any one of your previous backup text files onto the canvas and you are right back to square one. This is an excellent feature in case something goes wrong with your computer.

### Export as JSON (multi-file)
Export all data stores to JSON format to suit your own custom business processes.

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
- **There is no undo**, so if needed, **make a backup first**:
  - Select **Hamburger Icon > Full Backup**
  - To restore a backup, simply **drag and drop the backup file onto the Canvas**

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
The names and descriptions of the six Creator bars as shown above are configurable in the Tags Store. To view and edit the Tags table click on the Reports Icon in the main menu and click the Editable Grids link as shown below. Search for the desired value and change its Short Name by clicking on the Pencil Icon to load the Editable Form as shown. Tag Purpose can be changed also (Instructions in Creator Bar popup). Do not change other values or the application will break. Please note that you can change these values in the Spreadsheet and sync it back to the App.
Change the text then click save and Close (not shown)

## Metadata View
The metadata view is available from several locations within the application such as the editable grids meta-data table and from each bar on the canvas. This view is a large collapsible report or form that allows for editing metadata based on business driven headings such as business case cost and schedule information etc.

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
The Reports Menu gives access a multitude of tabular reports suited to common methodologies. Also get access the Editable Grids and Static Forms to filter and edit data.

## Schedule Reports
Various reports for scheduling purposes, such as Editable Grids, All Timebars, Print WBS, Items Overdue, Milestone Horizon, and Project Status.

## Resource Reports
Reports related to resource usage, including Resource Usage, Project Usage Simple, Project Usage w/Metadata, and Resource Listing.

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
This form renders data from L1 rows only. User can add and remove fields as needed. The Cost Analysis field can be edited using the Quill Editor.

# Documents Features

## Overview of Documents
The document system has a similar interface as the risks and issues system, but with different data storage and creation methods. Clicking on the Documents button in the main menu opens the document list.

## Create New Documents
Clicking on the Create Documents button in the main menu allows users to create new documents.

## Filter Documents
The filter menu allows users to select a project and view the documents associated with it. In the example graphic, the Private Cloud Phase 1 project is selected, showing two filtered documents.

## Edit Documents
Users can edit document details such as status, title, and content. Clicking on the edit icon enables editing and allows users to enter data in markdown format.

## Add fields to the Documents Form
FOCD (Field-Oriented Control Design) can be used to add or remove fields in the document form, providing customization options.

# Cloud Publishing

## Overview of Publishing
The Cloud Publishing feature is opt-in functionality with secure Cloud login and authentication. The Cloud Dashboard provides customizable and dynamic reports and graphs, for insightful visualizations. Also rehydrate the Cloud data on another device. e.g. work from your PC one minute and on your Ipad the next.

## Cloud Login
Code location and details about the cloud login process.

## Show License
Clicking on the Show License Button displays the license details, including the quantity of PubSets available and the expiry date.

## Create Your Pubsets
Users need to activate PubSets themselves by clicking the activate PubSets button.

## Publish to Update Cloud Dashboard
Publishing PubSets allows updating the cloud dashboard, rendering charts and reports.
