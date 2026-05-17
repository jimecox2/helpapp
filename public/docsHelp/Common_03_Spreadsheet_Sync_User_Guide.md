# Spreadsheet Sync User Guide - Common Across Products
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

The Spreadsheet Sync feature provides seamless data synchronization between Agilebars, Timebars, or Costbars applications and Microsoft Excel or LibreOffice Calc spreadsheets. This powerful feature enables bulk editing, advanced analysis, and efficient data management using familiar spreadsheet tools.

## Table of Contents

- [What is Spreadsheet Sync?](#what-is-spreadsheet-sync)
- [How Spreadsheet Sync Works](#how-spreadsheet-sync-works)
- [Spreadsheet Template Files](#spreadsheet-template-files)
- [Step-by-Step: Complete Sync Workflow](#step-by-step-complete-sync-workflow)
- [Data Validation and Quality](#data-validation-and-quality)
- [Important Rules and Warnings](#important-rules-and-warnings)
- [Common Use Cases](#common-use-cases)
- [Data Transformations During Sync](#data-transformations-during-sync)
- [Technical Details](#technical-details)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Summary](#summary)
- [Related Help Topics](#related-help-topics)
- [Template Download Links](#template-download-links)

---

## What is Spreadsheet Sync?

Spreadsheet Sync is an **optional feature** that allows you to move data in and out of the application quickly and efficiently. It provides **bidirectional synchronization** between the browser-based application and specially designed spreadsheets.

**Key Benefits:**
- **Bulk Data Operations**: Create, Read, Update, and Delete (CRUD) multiple items at once
- **Spreadsheet Power**: Use copy-paste, fill-down, formulas, filtering, sorting, and conditional formatting
- **Data Validation**: Built-in spreadsheet validators highlight data quality issues
- **Offline Editing**: Work on data offline in your preferred spreadsheet application
- **No Vendor Lock-In**: Standard Excel/LibreOffice formats ensure data portability
- **Backup and Recovery**: Spreadsheet serves as an additional backup of your data
- **Available to All Users**: Works with both licensed and free accounts

---

## How Spreadsheet Sync Works

Spreadsheet Sync operates through a simple cycle that leverages CSV file exports and custom spreadsheet code:

### The Sync Cycle

```
1. Export from App (CSV files)
    ↓
2. Import to Spreadsheet (using Import buttons)
    ↓
3. Edit in Spreadsheet (bulk changes, analysis)
    ↓
4. Save Spreadsheet
    ↓
5. Import to App (drag & drop onto Canvas)
    ↓
6. Repeat as needed (daily, weekly, monthly)
```

### Data Flow Pattern

```
IndexedDB (Browser)
    ↓
Export to CSV Files (12 files)
    ↓
Spreadsheet Import (configurable location)
    ↓
[Edit in Excel/LibreOffice Calc]
    ↓
Save Spreadsheet
    ↓
Drag & Drop onto Canvas
    ↓
IndexedDB Updated
```

---

## Spreadsheet Template Files

Two template files are available, both specially designed to sync with all Timebars products:

### Download Options

**Excel Template:**
- Choose **Hamburger Icon > Download Excel SS**
- File: `tbClientMaster.xlsm` (macro-enabled workbook)
- Format: XLSX (Office Open XML)
- Download URL: https://cdn.timebars.com/common/tbClient2023v1.xlsm.removeMe
- Compatible with: Microsoft Excel

**LibreOffice Calc Template:**
- Choose **Hamburger Icon > Download Libre Office Calc SS**
- File: `tbClientAllSheetsMasterDec30.ods`
- Format: ODS (OpenDocument Spreadsheet)
- Download URL: https://cdn.timebars.com/common/tbClientAllSheetsMasterDec30.ods
- Compatible with: LibreOffice Calc, OpenOffice Calc

**Important File Naming Rule:**
The filename must begin with **"tbClient"** for the import to function correctly. Do not rename the downloaded file to something that doesn't start with "tbClient".

### File Location

Downloaded files save to your browser's download folder:
- **Windows**: `C:\Users\<YourUsername>\Downloads`
- **Mac**: `/Users/<YourUsername>/Downloads`
- **Linux**: `/home/<YourUsername>/Downloads`

---

## Step-by-Step: Complete Sync Workflow

### Step 1: Export Data from App

Export your application data as CSV files:

1. Click **Hamburger Icon > Export to CSV**
2. **12 CSV files** are created in your browser's download folder
3. Wait for all files to finish downloading

**CSV Files Generated:**

| File Name | Data Store | Description |
|-----------|------------|-------------|
| `tbTimebars.csv` | tbTimebars | Core scheduling data (bars, dates, hierarchy) |
| `tbMetaData.csv` | tbMetaData | Core metadata fields for tagging bars |
| `tbResources.csv` | tbResources | Resource Pool (people, skills, roles) |
| `tbTags.csv` | tbTags | Picklist data (dropdown values) |
| `tbFields.csv` | tbFields | FOCD form field configuration |
| `tbCoreReport.csv` | tbCoreReport | Metadata field visibility control |
| `tbAdminPanel.csv` | tbAdminPanel | Canvas settings and holiday exceptions |
| `tbBaseline.csv` | tbBaseline | Baseline for core scheduling data |
| `tbMdJoined.csv` | tbMdJoined | System-generated for reports and graphs |
| `tbResCalcs.csv` | tbResCalcs | System-generated for reports and graphs |
| `tbResCalcs2.csv` | tbResCalcs2 | System-generated for reports and graphs |
| `tbDocuments.csv` | tbDocuments | Not currently used |

**Note:** System-generated CSV files (tbBaseline, tbMdJoined, tbResCalcs, tbResCalcs2) are included for reference but should not be edited. These regenerate automatically from source data.

---

### Step 2: Configure Spreadsheet Import Location

Before importing CSV files into the spreadsheet, configure the import location:

1. **Open the Spreadsheet** template file you downloaded
2. **Navigate to Setup Tab** (first tab in workbook)
3. **Find the "Import / Export Configuration Sheet"** section
4. **Set the Location column** to match your browser's download directory

**Examples:**
- Windows: `C:\Users\jcox\Downloads`
- Mac: `/Users/jcox/Downloads`
- Linux: `/home/jcox/Downloads`

**Important:** Use the exact path to your Downloads folder where the CSV files were saved.

---

### Step 3: Import CSV Files into Spreadsheet

Import the CSV data into the spreadsheet worksheets:

#### Option 1: Import All Data (Recommended)
1. On the **Setup Tab**, click the **"Import All"** button
2. Spreadsheet code reads all CSV files from configured location
3. Data populates across multiple worksheet tabs
4. Wait for import to complete

#### Option 2: Import Individual Stores
1. Navigate to specific worksheet tab (e.g., **Timebars** tab, **MetaData** tab)
2. Click the individual **Import** button on that tab
3. Data from corresponding CSV file imports to that worksheet only

**Import Control:**
The Setup page includes an "Import Yes/No" column that controls which stores import when using "Import All". Only stores marked "Yes" will import.

---

### Step 4: Edit Data in Spreadsheet

Now you have full spreadsheet power to manage your data:

#### Spreadsheet Structure

Each worksheet mirrors an IndexedDB data store:

- **Row 1**: Database field names (e.g., `tbID`, `tbName`, `tbStart`)
- **Row 3**: User-friendly labels (e.g., "ID", "Name", "Start Date")
- **Row 4+**: Your data rows

**Do not modify Row 1 or Row 3**—these headers are required for import validation.

#### Powerful Editing Capabilities

**Copy and Paste:**
- Copy data from other sources
- Copy rows to create similar items
- Paste multiple values at once

**Fill-Down:**
- Select a cell and drag down to fill multiple rows
- Quickly assign same value to many items

**Formulas and Calculations:**
- Use Excel/Calc formulas for calculations
- Derive values from other columns
- Aggregate data with SUM, AVERAGE, etc.

**Filtering and Sorting:**
- Filter to show specific items (e.g., only "High Priority" tasks)
- Sort by any column to organize data
- Multi-level sorting supported

**Conditional Formatting:**
- Highlight rows based on criteria
- Color-code by status, priority, or health
- Visual identification of problem areas

**Data Validation:**
- Built-in dropdown lists for picklist fields
- Date pickers for date fields
- Numeric constraints prevent invalid entries

**Bulk Edits:**
- Change status for multiple items at once
- Reassign owner across many tasks
- Update dates for entire project

**Add New Rows:**
- Create new tasks, resources, or metadata entries
- Add new picklist values to Tags tab
- Define new custom fields in Fields tab

**Delete Rows:**
- Remove unwanted items by deleting rows
- Clean up old data quickly

---

### Step 5: Save Spreadsheet

After making edits:

1. **Save the spreadsheet file** using your spreadsheet application's Save function
   - Excel: File > Save or Ctrl+S (Cmd+S on Mac)
   - LibreOffice: File > Save or Ctrl+S

2. **Keep the filename** starting with "tbClient"

**Important Note:**
The spreadsheet automatically exports updated CSVs to your configured location when you save (if macros are enabled). This prepares the data for import back into the application.

---

### Step 6: Import Spreadsheet Back to Application

Return your edited data to the application:

1. Open your Timebars application in the browser
2. **Drag and drop** the saved spreadsheet file onto the **Canvas**
3. Application processes the file
4. **Automatic backup** is created before import
5. IndexedDB updates with new data
6. Canvas refreshes to display updated bars
7. All changes are now live in the application

**Alternative Import Method:**
If you prefer not to drag-and-drop:
1. Click **Hamburger Icon > File Importer**
2. Click **Browse** button
3. Select the spreadsheet file
4. Click import

---

## Data Validation and Quality

### Built-In Validators

The spreadsheet includes **macro-based validators** that check data quality:

**Validation Checks:**
- **Required fields present**: Ensures mandatory columns have values
- **Data types match**: Verifies dates are dates, numbers are numbers
- **Foreign key references exist**: Checks that referenced items (e.g., resources, tags) exist
- **Unique constraints satisfied**: Prevents duplicate IDs
- **Business rule validation**: Validates date ranges, hierarchy rules

**Visual Indicators:**
- **Red highlighting**: Indicates potential issues or missing mandatory columns
- **Dropdown lists**: Ensure valid picklist values
- **Conditional formatting**: Shows data quality problems

**Validation Range Reference:**
The spreadsheet includes a `BulkOperations` worksheet containing validation metadata:
- Location: `BulkOperations!$A$1:$H$374`
- Contains: Field names, data types, mandatory flags, validation rules
- Purpose: Ensures data integrity during import operations
- Note: BulkOperations worksheet is reference data, not a data store to edit

---

## Important Rules and Warnings

### Critical Rules

**Rule 1: Do Not Edit in Both Places Simultaneously**

⚠️ **Warning:** Do not make edits in the application while data is in the spreadsheet. This could lead to **overwriting and loss of changes**.

**Best Practice:**
- Export to spreadsheet
- Close or don't use the application
- Edit in spreadsheet
- Save spreadsheet
- Import back to application
- Resume using application

---

**Rule 2: Always Backup Before Major Changes**

Importing a spreadsheet overwrites existing application data. The application **automatically creates a backup** before import, but you can manually backup too:

- Click **Hamburger Icon > Full Backup** before exporting to spreadsheet
- Backup file: `tbFullBackup_YYYY-MM-DD_HH-MM-SS.js`
- Restore by dragging backup file onto Canvas

---

**Rule 3: Preserve Row 1 and Row 3 Headers**

- **Row 1**: Database field names (must match exactly for import to work)
- **Row 3**: User-friendly labels (for your reference)
- **Do not modify** these rows or import will fail

---

**Rule 4: System-Generated Stores Are Read-Only**

Do not edit these worksheets—they regenerate automatically:
- tbBaseline (regenerated when you set baselines)
- tbMdJoined (joined view of tbTimebars + tbMetaData)
- tbResCalcs (burndown chart calculations)
- tbResCalcs2 (resource demand calculations)

---

## Common Use Cases

### Use Case 1: Bulk Create Tasks

**Scenario:** You need to add 50 tasks to a project

**Steps:**
1. Export to CSV
2. Import to spreadsheet
3. Go to **Timebars** tab
4. Copy an existing task row
5. Paste 50 times
6. Edit task names using Fill-Down and manual changes
7. Update dates, owners, status
8. Save spreadsheet
9. Import to app

**Result:** 50 tasks created in minutes instead of hours of manual entry.

---

### Use Case 2: Resource Pool Management (Timebars & Costbars)

**Scenario:** Maintain your organization's resource pool

The resource pool is managed in the **Resources** tab of the spreadsheet.

**Add Resources:**
1. Export to CSV, import to spreadsheet
2. Go to **Resources** tab
3. Add rows with resource data:
   - Name, Email
   - Primary Role (Developer, Architect, PM, QA, etc.)
   - Primary Skill (Java, Python, Cloud, Database, etc.)
   - Location/Office
   - Department
   - Pay Rate, Cost Code
   - Availability, Capacity
   - Manager, Team Leader
4. Save and import back

**Update Resources:**
- Bulk update pay rates
- Change departments for multiple resources
- Update skills and roles
- Adjust availability calendars

**Result:** Efficient resource pool maintenance for allocation to tasks.

---

### Use Case 3: Metadata Coding and Tagging

**Scenario:** Assign custom metadata tags to categorize and report on project work

**Metadata Coding Structure:**
There are over 100 metadata fields that can be configured for tagging bars at various levels, enabling flexible reporting and organization.

**Steps:**
1. Export to CSV, import to spreadsheet
2. Go to **MetaData** tab
3. Edit metadata columns:
   - Status, Priority, Health indicators
   - Category, Department, Investment Type
   - Custom fields specific to your organization
4. Use Fill-Down to assign same value to multiple items
5. Use formulas to derive values
6. Save and import back

**Maintain Picklist Values:**
1. Go to **Tags** tab
2. Add or modify picklist values
3. Tags are pre-determined within the application but can be changed to suit your needs
4. No complex code tables—just spreadsheet maintenance

**Result:** Organize and break down project work by any structure. Assign codes to bars enabling virtually any view or report of your project information.

---

### Use Case 4: Seed Data and Custom Configuration

**Scenario:** Configure custom picklists and field settings

**Seed Data Included:**
The spreadsheets come preloaded with seed data allowing the app to function. You can change this data to customize the application:

**Custom Picklist Data:**
1. Edit **Tags** tab
2. Add custom status values, priorities, categories
3. Define organization-specific terminology
4. Save and import to see custom metadata in action

**Field Configuration:**
1. Edit **Fields** tab (tbFields)
2. Add or remove fields from FOCD forms
3. Configure field visibility, types, positions
4. Customize Core Report field visibility per hierarchy level

**Core Report Configuration:**
1. Edit **CoreReport** tab
2. Control which metadata fields show at each hierarchy level (L1-L5)
3. Example: Show "Project Number" at L2 (Project) but not at L4 (Task)

**Result:** Application customized to your organization's terminology and processes.

---

### Use Case 5: Data Analysis and Reporting

**Scenario:** Analyze project data using advanced spreadsheet features

**Analysis Capabilities:**
- Create pivot tables to summarize data
- Build custom charts and graphs
- Use formulas to calculate KPIs
- Conditional formatting for visual dashboards
- Export to PDF for distribution

**Portfolio Tab (Macros Enabled):**
The spreadsheet includes a Portfolio tab that enables further analysis and custom reporting when macros are enabled.

**Result:** Leverage spreadsheet power for analysis beyond application's built-in reports.

---

### Use Case 6: Offline Editing

**Scenario:** Work on project data without internet connection

**Steps:**
1. Export to CSV while online
2. Import to spreadsheet
3. Work offline on airplane, remote location, etc.
4. Make all changes in spreadsheet
5. Save spreadsheet
6. When back online, import to application

**Result:** Productivity continues even without internet access.

---

### Use Case 7: Data Migration and Integration

**Scenario:** Import project data from other systems

**Steps:**
1. Export data from other system as CSV
2. Open Timebars spreadsheet template
3. Map other system's columns to Timebars columns
4. Paste data into appropriate worksheets
5. Adjust data to match Timebars format (dates, IDs, hierarchy)
6. Validate data using built-in validators
7. Save and import to Timebars application

**Result:** Migrate project data from legacy systems or integrate with other tools.

---

## Data Transformations During Sync

Understanding how data transforms during export/import helps troubleshoot issues:

### Export Transformations (App → Spreadsheet)

When exporting from application to CSV/spreadsheet:

- **Date Objects** → Excel date serial numbers
- **Boolean Values** → "Yes"/"No" text
- **Null Values** → Empty cells
- **Foreign Keys** → Human-readable lookup values (where applicable)

### Import Transformations (Spreadsheet → App)

When importing spreadsheet back to application:

- **Excel Date Serial Numbers** → Date objects
- **"Yes"/"No" Text** → Boolean values
- **Empty Cells** → Null values
- **Human-Readable Values** → Foreign key IDs (where applicable)

---

## Technical Details

### Spreadsheet Technology

**Export Engine:**
- Client-side JavaScript using SheetJS/xlsx library
- Generates XLSX file structure in browser
- No server processing required

**Import Engine:**
- SheetJS library parses XLSX file structure
- Each worksheet mapped to corresponding IndexedDB store
- Validation occurs before data writes to database

**Custom Code:**
The spreadsheet template includes embedded custom code (macros) that:
- Imports CSV files when Import buttons are clicked
- Exports updated CSVs when spreadsheet is saved
- Validates data quality
- Highlights errors in red

---

### Encoding and Compatibility

**Character Encoding:**
- UTF-8 encoding for international character support
- Supports all languages and special characters

**File Format Compatibility:**
- XLSX: Office Open XML format (Microsoft Excel)
- ODS: OpenDocument Spreadsheet (LibreOffice Calc)
- Both formats fully supported

---

### Data Store Mapping

The spreadsheet worksheets directly mirror IndexedDB data stores:

| Worksheet Tab | IndexedDB Store | Editable | Purpose |
|---------------|-----------------|----------|---------|
| AdminPanel | tbAdminPanel | Yes | Canvas settings, holidays |
| Timebars | tbTimebars | Yes | Core bars (portfolios, projects, tasks) |
| MetaData | tbMetaData | Yes | 100+ metadata fields |
| Resources | tbResources | Yes | Resource pool |
| Tags | tbTags | Yes | Picklist dropdown values |
| Fields | tbFields | Yes | FOCD form field configuration |
| CoreReport | tbCoreReport | Yes | Core Report field visibility |
| Baseline | tbBaseline | No | Baseline snapshot (system-generated) |
| MdJoined | tbMdJoined | No | Joined view (system-generated) |
| ResCalcs | tbResCalcs | No | Burndown data (system-generated) |
| ResCalcs2 | tbResCalcs2 | No | Resource demand data (system-generated) |
| Documents | tbDocuments | No | Not currently used |

---

## Troubleshooting

### Import Fails with Validation Errors

**Problem:** Spreadsheet won't import, shows validation errors

**Possible Causes:**
- Modified Row 1 field names
- Data type mismatch (text in date field, etc.)
- Foreign key references don't exist (e.g., assigned non-existent resource)
- Unique constraint violation (duplicate IDs)

**Solutions:**
1. Check validation error messages in import dialog
2. Verify Row 1 field names match exactly (case-sensitive)
3. Ensure dates are formatted correctly
4. Check that referenced items exist (resources in tbResources, tags in tbTags)
5. Verify no duplicate IDs in tbID column
6. Check red-highlighted cells in spreadsheet for issues

---

### Spreadsheet File Won't Import

**Problem:** Drag-drop does nothing or shows error

**Possible Causes:**
- Filename doesn't start with "tbClient"
- File is not .xlsx or .ods format
- File is corrupted

**Solutions:**
1. Verify filename starts with **"tbClient"** (e.g., `tbClientMaster.xlsm`)
2. Ensure file extension is .xlsx or .ods
3. Try re-downloading template and re-importing CSV data
4. Use File Importer instead of drag-drop: Hamburger Icon > File Importer

---

### Changes Not Appearing After Import

**Problem:** Imported spreadsheet but changes don't show on Canvas

**Possible Causes:**
- Edited system-generated worksheets instead of user-controlled ones
- Forgot to save spreadsheet before import
- Canvas needs refresh

**Solutions:**
1. Verify you edited the correct worksheets (Timebars, MetaData, Resources, Tags, Fields, CoreReport, AdminPanel)
2. Ensure you saved spreadsheet before drag-drop
3. Click **Refresh** button on top menu
4. If still not appearing, click **Recalculate All** (Right-click Canvas > Recalculate All)

---

### Import Overwrote Recent Changes

**Problem:** Imported spreadsheet but lost recent work done in application

**Possible Causes:**
- Edited in both places (application and spreadsheet) simultaneously
- Imported old spreadsheet instead of current one

**Solutions:**
1. Restore from automatic backup created before import:
   - Check Downloads folder for `tbFullBackup_YYYY-MM-DD_HH-MM-SS.js`
   - Drag backup file onto Canvas to restore
2. Next time: Follow Rule 1 (don't edit in both places)

---

### CSV Files Not Found During Spreadsheet Import

**Problem:** Click "Import All" in spreadsheet but no data imports

**Possible Causes:**
- Setup Tab location path is incorrect
- CSV files not in the specified location
- Permission issues accessing folder

**Solutions:**
1. Verify **Setup Tab > Location** column matches your Downloads folder exactly
2. Check that 12 CSV files are in that folder
3. Use full absolute path (e.g., `C:\Users\jcox\Downloads` not `Downloads`)
4. On Mac/Linux, ensure correct path format: `/Users/jcox/Downloads`
5. Try copying CSV files to a simpler location (e.g., `C:\Temp`) and update Setup Tab

---

### Macros Not Working in Spreadsheet

**Problem:** Import/Export buttons don't work in spreadsheet

**Possible Causes:**
- Macros disabled in Excel/LibreOffice
- Opened spreadsheet in "Protected View"

**Solutions:**
1. **Excel**: Enable macros when prompted, or go to File > Options > Trust Center > Trust Center Settings > Macro Settings > Enable all macros
2. **Excel**: If in Protected View, click "Enable Editing" banner at top
3. **LibreOffice**: Tools > Options > Security > Macro Security > Medium or Low
4. Close and reopen spreadsheet after changing settings

---

## Best Practices

### Regular Sync Schedule

Establish a regular sync schedule based on your needs:

**Daily Sync:**
- For active projects with frequent changes
- At end of each workday
- Ensures spreadsheet backup is recent

**Weekly Sync:**
- For stable, ongoing projects
- Every Friday afternoon
- Balances effort and data freshness

**Monthly Sync:**
- For portfolio-level analysis
- Before executive reviews
- Resource capacity planning updates

---

### Safe Editing Workflow

**Recommended Workflow:**
1. **Backup**: Manually backup first (Hamburger Icon > Full Backup)
2. **Export**: Export to CSV
3. **Import**: Import CSVs to spreadsheet
4. **Close App**: Close browser tab or don't use application
5. **Edit**: Make changes in spreadsheet
6. **Save**: Save spreadsheet
7. **Verify**: Check automatic backup exists in Downloads folder
8. **Import**: Drag spreadsheet to Canvas
9. **Verify**: Check changes appear correctly
10. **Resume**: Continue using application

---

### Version Control

Maintain spreadsheet versions for tracking changes:

**Naming Convention:**
- `tbClient_ProjectName_2025-03-06.xlsm`
- Include date in filename
- Keep recent 3-5 versions

**Benefits:**
- Track changes over time
- Restore previous state if needed
- Historical record of project evolution

---

### Collaborative Editing

If multiple people need to edit data:

**Option 1: Serial Editing**
- Person A exports, edits, imports
- Person A notifies Person B
- Person B exports, edits, imports

**Option 2: Divide by Data Store**
- Person A edits Timebars and MetaData
- Person B edits Resources and Tags
- Export, edit, import separately

**Option 3: Use Cloud Publishing**
- For real-time collaboration, use Cloud Publishing feature
- See [Cloud Publishing Guide](https://www.timebars.com/knowledgebase/helparticles/common-07-cloud-publishing-guide)

---

### Data Hygiene

Keep spreadsheet data clean:

**Before Import:**
- Remove test data rows
- Delete unused picklist values
- Verify dates are in correct format
- Check for duplicate IDs

**During Edit:**
- Use consistent naming conventions
- Maintain hierarchy rules (L1-L5)
- Validate foreign key references
- Fill mandatory fields

---

## Summary

**Key Takeaways:**

1. **Bidirectional Sync**: Export to spreadsheet, edit, import back—repeat as needed
2. **Bulk Power**: Use spreadsheet features for efficient data management (copy-paste, fill-down, formulas)
3. **Two Templates**: Excel (.xlsm) and LibreOffice Calc (.ods) both supported
4. **12 CSV Files**: Export generates 12 files; 7 are user-editable, 5 are system-generated
5. **Configure Location**: Set import path in Setup Tab to your Downloads folder
6. **Automatic Backup**: Application backs up before import for safety
7. **Rule #1**: Don't edit in both places simultaneously—prevents overwrites
8. **Filename Matters**: Must start with "tbClient" for import to work
9. **Validation Built-In**: Spreadsheet validators highlight data issues in red
10. **Flexible Schedule**: Sync daily, weekly, or monthly based on needs

**Spreadsheet Sync transforms data management from tedious form entry into efficient bulk operations, leveraging the full power of spreadsheet tools while maintaining data integrity.**

---

## Related Help Topics

- [Data Structure Guide](https://www.timebars.com/knowledgebase/helparticles/common-03-data-structure-user-guide) - Understanding data stores and hierarchy
- [User Interface Guide](https://www.timebars.com/knowledgebase/helparticles/common-02-user-interface-guide) - Creating and editing bars on Canvas
- [Cloud Publishing Guide](https://www.timebars.com/knowledgebase/helparticles/common-07-cloud-publishing-guide) - Publishing to Timebars Cloud
- [Local Reports Guide](https://www.timebars.com/knowledgebase/helparticles/common-05-local-reports-and-graphs-guide) - Reports and analysis
- [Data Migration Assistance Guide](https://www.timebars.com/knowledgebase/helparticles/common-12-data-Migration-Assistance) - Migrating from a legacy system using Spreadsheet Sync as the import mechanism. Read this guide alongside the Bulk Operations import section when planning a migration.

---

## Template Download Links

- **Excel Template**: https://cdn.timebars.com/common/tbClient2023v1.xlsm.removeMe
- **LibreOffice Calc Template**: https://cdn.timebars.com/common/tbClientAllSheetsMasterDec30.ods

**Support:**
- Email: jcox@tbcox.com
- Knowledge Base: www.timebars.com/knowledgebase
- Phone: (613) 255-5374
