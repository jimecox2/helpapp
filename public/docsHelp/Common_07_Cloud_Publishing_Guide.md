# Cloud Publishing Guide - Common Across Products
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

## Table of Contents

1. [Overview](#1-overview)
2. [Account Registration & Subscription](#2-account-registration--subscription)
3. [Logging In to Timebars Cloud](#3-logging-in-to-timebars-cloud)
4. [Publishing Page Interface](#4-publishing-page-interface)
5. [Viewing Pubsets](#5-viewing-pubsets)
6. [Publishing to the Cloud](#6-publishing-to-the-cloud)
7. [Downloading from Cloud to Local (Re-Hydrate)](#7-downloading-from-cloud-to-local-re-hydrate)
8. [Clearing a Published Dataset](#8-clearing-a-published-dataset)
9. [License and Activation](#9-license-and-activation)
10. [Cross-Device Synchronization](#10-cross-device-synchronization)
11. [OpenProject Sync](#11-openproject-sync)
12. [Bulk Update](#12-bulk-update)
13. [Re-Publish with Scheduling Engine](#13-re-publish-with-scheduling-engine)
14. [Support Resources](#14-support-resources)
15. [Quick Reference](#15-quick-reference)

---

## 1. Overview

Cloud Publishing is an **optional feature** that allows you to securely upload your project data from the client applications (Agilebars, Timebars, or Costbars) to the Timebars Cloud. The Cloud Publishing page is the central hub for managing data between your local browser (IndexedDB) and the Timebars Cloud. From here you can:

- **Publish** your local project data to the cloud for sharing and dashboards
- **Download** a published dataset back into your local browser
- **Clear** published data from the cloud
- **Bulk Update** specific fields across multiple published datasets at once
- **Re-Publish** datasets with recalculated scheduling engine data
- **Sync** with OpenProject (external PM system)

Published datasets are called **Pubsets**. Each pubset is a complete snapshot of your project data stored in the cloud. The active pubset feeds your Personal Cloud Dashboard.

**Key Benefits:**
- **Cloud Dashboard Access**: View interactive reports and charts from any device
- **Cross-Device Sync**: Work on one device, continue on another
- **Data Backup**: Secure cloud storage for your project data
- **Team Collaboration**: Share data with stakeholders (requires individual licenses)
- **Real-Time Updates**: Publish changes instantly to the cloud

**Important Notes:**
- Publishing is entirely optional—client apps work fully offline
- Your local data remains in the browser unless you choose to publish
- Cloud Publishing requires an active subscription
- Data is encrypted during transmission (HTTPS/TLS)
- You must log in each session — credentials are not saved or persisted

---

## 2. Account Registration & Subscription

### Create an Account

1. **Register**: Visit www.timebars.com/auth/new-user, provide your email address and create a secure password, then click "Register"
2. **Verify Email**: Check your email for the verification link and click it to confirm your account

### Choose a Subscription Plan

1. Navigate to www.timebars.com/pricing and review available subscription tiers
2. Select a plan based on your needs — you can purchase up to 10 PubSets depending on tier
3. Complete the credit card transaction; your license activates automatically
4. Log in at www.timebars.com/login to view subscription details and manage PubSets

**Subscription Includes:**
- Client application license (Agilebars, Timebars, or Costbars)
- Cloud Publishing capabilities
- Cloud Dashboard access
- Number of PubSets based on tier
- Technical support

---

## 3. Logging In to Timebars Cloud

### Steps

1. Navigate to the publishing page from the main menu (**Main Menu > Publish**)
2. You will land on the **Login** tab
3. Enter your **Email** and **Password**
4. Click **Cloud Login!**

### What Happens

- Your credentials are validated against the Timebars Cloud authentication service
- On success, a green message appears: *"Login successful! Your pubsets are loaded."*
- After 1 second the page switches to the **Pubsets** tab showing your datasets
- The Pubsets (Cards) and Pubsets (Table) tabs become visible

**Note:** The cloud login is a **secondary login** separate from your local app login, providing an additional security layer. Your data requires both local app login AND cloud login to access.

### Important Notes

- You must log in each session — credentials are not saved or persisted
- No cookies or tokens are stored between sessions
- If you try to access other tabs before logging in, you will be redirected back to the Login tab

---

## 4. Publishing Page Interface

### Tab Navigation

The publishing page has six tabs:

| Tab | Visible | Purpose |
|-----|---------|---------|
| **Login** | Always | Cloud authentication |
| **Pubsets (Cards)** | After login | Card-style view of your pubsets |
| **Pubsets** | After login | Table view with sorting and filtering |
| **OpenProject** | Always | Sync with external OpenProject system |
| **Bulk Update** | Always | Bulk data operations across pubsets |
| **Re-Publish** | Always | Download, recalculate, and republish |

Click any tab button to switch. The active tab is highlighted with a blue underline.

### Top Navigation Bar

The blue navigation bar at the top of the publishing page provides quick actions:

| Button | Action |
|--------|--------|
| **Show License** | Displays your current license tier, product code, and expiration date |
| **Recalculate All** | Runs all system calculations (hierarchy names, rollups) to ensure data accuracy before publishing |
| **Dashboard** | Opens your Personal Cloud Dashboard in a new browser tab |
| **Purchase** | Opens the Timebars pricing page to buy or upgrade a license |
| **Activate** | One-time setup to create your pubset containers (Tier-2 and Tier-3 only) |
| **Sync Users** | Admin-only: syncs resource pool data to portal user accounts |
| **Close** (X icon) | Closes the publishing page and returns to the main application |

---

## 5. Viewing Pubsets

After logging in, your pubsets are displayed in two views:

### Card View

- Shows each pubset as a card with its name and action buttons
- The **active pubset** (the one feeding your Cloud Dashboard) has a **blue background**
- Use this view for a quick visual overview

### Table View

- Shows all pubsets in a sortable, searchable table
- Columns: Active status, Pubset Name, ID, Published Date, Published By, Customer ID, Actions
- Click column headers to sort; use the search box to filter by name, owner, or customer ID
- The active pubset is highlighted in blue
- Action buttons for each pubset: **Download**, **Publish**, **Clear**

---

## 6. Publishing to the Cloud

Publishing takes all your local project data and uploads it to a pubset in the cloud.

### Prerequisites

- Active Timebars Ltd. subscription
- Client application installed and running
- Project data created in the client application
- Internet connection
- Logged into the client app locally (gold icon, top right) AND the cloud (see Section 3)

### Steps

1. Go to the **Pubsets** tab after logging in
2. Click the **Publish** button next to the target pubset
3. Enter a name for the pubset when prompted (or keep the existing name)
4. Wait 3–5 seconds for publishing to complete

### What Gets Published

All six data stores are uploaded:

| Store | Content |
|-------|---------|
| **tbTimebars** | Tasks, projects, milestones, allocations (scheduling data) |
| **tbMetaData** | Extended metadata: descriptions, status, priority, assessments |
| **tbResources** | Resource definitions (people, roles, teams) |
| **tbTags** | Picklist tag definitions with colours and groupings |
| **tbFields** | Dynamic form field configurations |
| **tbCoreReport** | Report configurations and settings |

After the stores are published, the system also updates RBAC fields (role-based access control) and enterprise metadata (customer ID, access grants).

### Dashboard PubSet vs Storage PubSets

- **Blue Background PubSet** — your **Dashboard PubSet**: directly connected to the Cloud Dashboard. Publishing here updates all dashboard reports and charts immediately.
- **White Background PubSets** — **Storage PubSets**: used for backup and cross-device synchronization. Publishing here does **not** update the dashboard.

**Best Practice:** Use the blue Dashboard PubSet for day-to-day work. Use white PubSets for backups and snapshots.

### After Publishing

- A green toast notification confirms: *"Publishing complete, go to dashboard to see results!"*
- Your data is immediately available in the Personal Cloud Dashboard

---

## 7. Downloading from Cloud to Local (Re-Hydrate)

Downloading restores a published dataset from the cloud into your local browser.

### Steps

1. Go to the **Pubsets** tab
2. Click the **Download** button next to the pubset you want to restore
3. Confirm by entering **y** when prompted: *"Over-write local data?"*
4. Wait for the download to complete

### Important

- **This overwrites all your local data** with the cloud pubset's data
- If you cancel (enter **n**), your local data is not affected
- All six stores are replaced with the downloaded data
- The tbMdJoined table is automatically rebuilt after download
- No page reload is required — views update automatically
- Ensure you have published any unsaved local work before re-hydrating

---

## 8. Clearing a Published Dataset

Clearing removes all data content from a pubset in the cloud while keeping the pubset container.

### Steps

1. Go to the **Pubsets** tab
2. Click the **Clear/Delete** button next to the pubset
3. Confirm the action when prompted

### What Happens

- All six store fields are set to empty arrays
- The pubset container (name, owner, dates) is preserved
- You can publish new data to the same pubset later
- Your local IndexedDB data is **not affected**
- If the cleared pubset was the active pubset, the Cloud Dashboard will show empty data

---

## 9. License and Activation

### License Tiers

| Tier | Products | Pubsets | Features |
|------|----------|---------|----------|
| **Tier-1** | ABT01, TBT01, CBT01 | 0 | Local only, no cloud publishing |
| **Tier-2** | ABT02, TBT02, CBT02 | 2 | Cloud publishing with 2 pubsets |
| **Tier-3** | ABT03, TBT03, CBT03 | 5–8 | Full cloud features with multiple pubsets |

### Activation (One-Time Setup)

Tier-2 and Tier-3 users must activate pubsets before first use:

1. Click **Activate** in the top navigation bar
2. The system creates your pubset containers based on your tier
3. One pubset is marked as active (feeds the Cloud Dashboard)
4. Remaining pubsets are inactive (for backup or testing)
5. Tier-1 users will see an alert that activation is not available

**You only need to activate once.** After activation, your PubSets are permanent until you manually clear them.

### Viewing Your License

Click **Show License** to see your product code, expiration date, and tier information.

```
License Type: TBT03
Expires: December 31, 2025
PubSets Available: 5
PubSets Used: 3
```

---

## 10. Cross-Device Synchronization

The Timebars Cloud enables seamless work across multiple devices.

### Scenario: Work on PC, Continue on iPad

**On Your PC (Primary Device):**
1. Work on your project data normally
2. Choose **Main Menu > Publish** and log in to cloud service
3. Click **Publish** on your Dashboard PubSet (blue background)

**On Your iPad (Secondary Device):**
1. Open the same client app and log in locally (gold icon, top right)
2. Choose **Main Menu > Publish** and log in to cloud service
3. Click **Download** on the Dashboard PubSet — your project data loads
4. Continue working where you left off

**Syncing Changes Back:**
- After making changes on the iPad, click **Publish** to sync back to the cloud
- Back on the PC, click **Download** to get the latest changes

**Key Rules:**
- Always publish after making changes
- Always download before starting work on a different device
- Downloading will overwrite local data — save any local work first

### Real-Time Dashboard Access

After publishing, click the **Dashboard** button in the top nav bar, or visit www.timebars.com/dashboard from any browser. The dashboard is touch-optimized and works on tablets and phones.

---

## 11. OpenProject Sync

The OpenProject tab provides bidirectional synchronization between Timebars and OpenProject.

### Scenario A: Timebars is Master (sync to OpenProject)

- **A1**: Create projects and work packages in OpenProject from Timebars data
- **A2**: Update OpenProject when Timebars data changes
- **A3**: Bulk create work packages in OpenProject
- **A4**: Create OpenProject work packages after manual edits in OpenProject

### Scenario B: OpenProject is Master (sync from OpenProject)

- **B1**: Create Timebars projects/tasks from OpenProject (fresh start)
- **B2**: Update Timebars when OpenProject data changes
- **B3**: Create Timebars items for OpenProject items not yet in Timebars
- **B4**: Create OpenProject work packages to match Timebars items

Each scenario has numbered steps with hover-over instructions. Follow the steps in order and check the feedback messages after each operation.

---

## 12. Bulk Update

The Bulk Update tab lets you modify data across multiple pubsets simultaneously without downloading and re-publishing each one individually.

### Getting Started

1. Go to the **Bulk Update** tab
2. Choose an **Update Mode** (see modes below)
3. Select the **Target Store** you want to update
4. Optionally set a **Published Since** date to filter which pubsets are shown
5. Click **Load Pubsets** to fetch your available pubsets from the cloud
6. Check the boxes next to the pubsets you want to update (or use Select All)
7. Configure the mode-specific options (see below)
8. Click **Apply Bulk Update**
9. Confirm the operation in the dialog

---

### Mode 1: Complete Replacement (JSON File)

**Use case**: Replace the entire contents of a store with data from a prepared JSON file.

**Steps**:
1. Select **Complete Replacement (JSON file)** mode
2. Choose the target store from the dropdown
3. Click **Load Pubsets** and select which pubsets to update
4. Upload a JSON file containing the replacement data
5. The preview shows: file name, size, and record count
6. Click **Apply Bulk Update** and confirm

**JSON file format**:
```json
[
  { "tbID": "A001", "tbName": "Task One", "tbWork": 40 },
  { "tbID": "A002", "tbName": "Task Two", "tbWork": 80 }
]
```

The file must contain a JSON array of objects. The entire store content on each selected pubset is replaced with this array.

---

### Mode 2: Filter and Set

**Use case**: Find records matching a specific value in a field and change that field to a new value. Ideal for bulk metadata updates like changing status, priority, or category across many pubsets at once.

**Available stores**: tbMetaData and tbResources only.

**Steps**:
1. Select **Filter & Set (no file needed)** mode
2. The **Target Store** defaults to tbMetaData
3. The **Published Since** date defaults to one month ago
4. Click **Load Pubsets** and select which pubsets to update
5. If tbMetaData is selected, a **Set Values by Type** filter appears — choose All Types or a specific type (Portfolio, Project, Sub-Project, Task, Milestone, or Allocation)
6. Select a **Field Name** from the dropdown (populated from your Tags definitions in the local database)
7. Select the current value in **Where Value Equals**
8. Select the replacement value in **Set To New Value**
9. Click **Apply Bulk Update** and confirm

**Example**: Change the priority of all Tasks from "Low" to "Medium" across 5 pubsets:
- Store: tbMetaData | Type filter: Task | Field Name: tbMDPriority | Where Value Equals: Low | Set To New Value: Medium

**How the dropdowns are populated**:

| Dropdown | Data Source |
|----------|------------|
| **Field Name** | Local tbTags store, filtered by prefix (tbMD for tbMetaData, tbRes for tbResources) |
| **Where Value Equals** | Unique values found in the actual pubset data for the selected field. Includes **(Blank)** for empty/null values. Respects the type filter. |
| **Set To New Value** | Tag values from the local tbTags store where tbTagTbInternalName matches the selected field |

---

### Mode 3: Row-Level Patch (CSV File)

**Use case**: Update specific rows identified by their unique ID, changing one or more fields per row.

**Steps**:
1. Select **Row-Level Patch (CSV file)** mode
2. Choose the target store from the dropdown
3. Click **Load Pubsets** and select which pubsets to update
4. Upload a CSV file with your updates
5. The preview shows: file name, size, row count, column names, and a sample row
6. Click **Apply Bulk Update** and confirm

**CSV file format**:
```
tbMDID,tbMDStatus,tbMDPriority
A001,Complete,High
A002,In Progress,Medium
A003,Not Started,Low
```

**Rules**:
- The first column must be the store's unique key (tbID for tbTimebars, tbMDID for tbMetaData, tbResID for tbResources, etc.)
- Only the fields listed in the CSV are changed; all other fields on the record are preserved
- Rows in the pubset that don't match any CSV key are left unchanged

---

### Bulk Update Results

After execution, a results table appears:

| Column | Content |
|--------|---------|
| **Pubset Name** | Name of the pubset |
| **ID** | Strapi record ID |
| **Status** | success or failed |
| **Detail** | "Replaced" (Mode 1), "X rows matched" (Mode 2), "X rows patched" (Mode 3), or error message |

- Green background: all pubsets succeeded
- Red background: one or more pubsets failed (check Detail column for error)

---

## 13. Re-Publish with Scheduling Engine

The Re-Publish feature downloads pubsets from the cloud, runs the PM scheduling engine to recalculate all derived data (dates, hours, costs, percent complete, rollups, resource demand), then publishes the refreshed data back to the cloud.

### When to Use

- After a bulk update that changed fields affecting calculations (e.g. status, work hours, dates)
- To refresh derived data across many pubsets without manually opening each one
- When the scheduling engine or rollup logic has been updated and you want all pubsets recalculated

### Steps

1. Go to the **Re-Publish** tab
2. Optionally set a **Published Since** date filter
3. Click **Load Pubsets**
4. Select the pubsets you want to re-publish (checkboxes or Select All)
5. Choose which calculation steps to run (all checked by default):
   - **Scheduling Engine** — recalculates dates, hours, costs, and percent complete for allocations
   - **Rollups & Hierarchy** — rolls up costs and hours from children to parents, rebuilds L1–L5 hierarchy names, regenerates the tbMdJoined table
   - **Resource Calculations** — regenerates weekly and monthly resource demand data (tbResCalcs2, tbResCalcsUsage)
6. Click **Execute Re-Publish**
7. Confirm the operation in the dialog
8. Watch the progress log as each pubset is processed

### The 5-Step Pipeline (per pubset)

| Step | Operation | Description |
|------|-----------|-------------|
| **1** | Download to IDB | Fetches the pubset from cloud and loads all stores into local IndexedDB |
| **2** | Scheduling Engine | Runs `calcCostWorkTBCB()` on allocations to recalculate dates, hours, costs, and percent complete |
| **3** | Rollups & Hierarchy | Runs `performFullSystemUpdate()` to roll up values through the hierarchy and rebuild joined tables |
| **4** | Resource Calculations | Runs `createUnifiedWeeklyUsageData()` to regenerate weekly/monthly resource demand splits |
| **5** | Publish Back | Runs `publishToTimebarsCloud()` to upload all stores, then updates RBAC and enterprise metadata |

Steps 2, 3, and 4 can be individually enabled or disabled via the checkboxes.

### Progress Log

A dark terminal-style log panel shows timestamped entries as each step executes:

```
[14:23:45] --- Starting pubset: Project Q4 (ID: 123) ---
[14:23:46] Step 1: Downloading pubset data to IndexedDB...
[14:23:48] Step 1 complete: Data loaded into IDB
[14:23:50] Step 2: Running scheduling engine on allocations...
[14:23:53] Step 2 complete: Scheduling engine finished
[14:23:54] Step 3: Running rollups, hierarchy, and joined table rebuild...
[14:23:56] Step 3 complete: Rollups and hierarchy rebuilt
[14:23:57] Step 4: Regenerating resource calculations...
[14:23:59] Step 4 complete: Resource calculations regenerated
[14:24:00] Step 5: Publishing all stores back to cloud...
[14:24:04] Step 5b: Updating RBAC and enterprise metadata...
[14:24:05] Pubset "Project Q4" re-published successfully!
```

- **Blue text**: Start/end markers | **Green text**: Successful step | **Orange text**: Warnings | **Gray text**: Skipped steps | **Red text**: Fatal errors

### Processing Notes

- Pubsets are processed **one at a time** (sequential) to avoid database conflicts
- Typical time per pubset: 20–25 seconds with all calculation options enabled
- Your local IndexedDB will contain the data from the last processed pubset when complete
- Toast notifications confirm each pubset as it completes

---

## 14. Support Resources

### Knowledge Base
- Browse articles at www.timebars.com/knowledgebase
- Search for specific topics or error messages
- View step-by-step tutorials and videos

### Customer Support
- **Email**: jcox@tbcox.com
- **Support Tickets**: www.timebars.com/support
- **Response Time**: 24–48 hours (varies by subscription level)
- **Phone**: (613) 255-5374

### Feature Requests
- Email: jcox@tbcox.com with a detailed description and use case
- All requests are reviewed for the product roadmap

---

## 15. Quick Reference

### Publishing Workflow

```
1. Log in to client app (gold icon, top right)
2. Main Menu > Publish
3. Cloud Login (email + password)
4. Activate PubSets (first time only)
5. Click Publish next to blue PubSet (Dashboard PubSet)
6. View Dashboard button or www.timebars.com/dashboard
```

### Cross-Device Workflow

```
Device A:
1. Make changes
2. Main Menu > Publish → Publish (to save to cloud)

Device B:
1. Main Menu > Publish → Download (to get latest from cloud)
2. Make changes
3. Main Menu > Publish → Publish (to save changes back)

Device A:
1. Main Menu > Publish → Download (to get Device B's changes)
```

### Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| Cannot log in to cloud | Check email/password; verify subscription at www.timebars.com/login |
| Publishing hangs | Wait 10+ seconds; check browser console for errors |
| Data not in dashboard | Ensure you published to the **active** pubset (blue highlight) |
| Re-Hydrate fails | Check "Last Published" date on pubset — if empty, pubset has no data |
| "No pubsets found" (Bulk Update) | Adjust or clear the Published Since date filter |
| Field Name dropdown empty (Bulk Update) | Ensure local tbTags store has definitions with matching tbTagTbInternalName prefix |
| Pubset is empty (Re-Publish) | Pubset has been cleared — publish data to it first |

---

*Cloud Publishing and Bulk Operations Guide v2.0 — Timebars Ltd.*
