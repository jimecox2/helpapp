# FOCD Forms User Guide - Common Across Products
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

## Table of Contents

- [Introduction to FOCD Forms](#introduction-to-focd-forms)
- [Key Concepts](#key-concepts)
- [Form Configuration Process](#form-configuration-process)
- [Field Positioning and Layout](#field-positioning-and-layout)
- [System Configuration Tags (Do Not Modify)](#system-configuration-tags-do-not-modify)
- [Advanced Configuration](#advanced-configuration)
- [Testing Your Configuration](#testing-your-configuration)
- [Support and Additional Resources](#support-and-additional-resources)

---

## Introduction to FOCD Forms

FOCD (Forms on Cached Data) is a technology developed by Timebars Ltd. These forms utilize IndexedDB for storing data locally in the user's browser and integrate with the Spreadsheet sync feature.

FOCD Forms allows users to add and remove fields from forms within our applications without writing code or requiring assistance from IT administrators. Users configure forms by entering data into a spreadsheet and synchronizing it with the application. This users to quickly adapt to business needs while reducing costs associated with software development.

## Key Concepts

### Configuration Method
FOCD Forms are configured primarily through a spreadsheet interface, which interacts with the forms via pre-configured JavaScript. The forms and their fields are dynamically generated based on the data entered in the spreadsheet, allowing for a high degree of customization.

### Technology Foundation
- **IndexedDB**: Utilized for offline storage of form data, enabling fast and secure data handling directly within the user's browser.
- **Spreadsheet Configuration**: Users configure forms by modifying a provided Spreadsheet file, which details the field names, types, and other attributes necessary for field creation.
- **No-code GUI**: The user-friendly GUI supports field postioning and testing without writing any code, directly through drag-and-drop interfaces and simple button actions.

### Application Structure
The application includes several built-in forms where users can add or remove fields. However, the number of available forms is fixed—users cannot create new forms but can configure existing ones to suit their business processes, including customizing field labels in the UI.

## Form Configuration Process

### Understanding Form Names

Each form in the system has a specific identifier. You must use the correct form name when configuring fields in the spreadsheet. Below are the available forms:

Sure! Here's that table converted into a simple list with headings, no horizontal lines:

### Spreadsheet Form Name List

- **PF1**  
  L1 Flyout Right Form

- **PJ1**  
  L2 Flyout Right Form

- **SPJ1**  
  L3 Flyout Right Form

- **TASK1**  
  L4 Flyout Right Form

- **ALLOC1**  
  L5 Flyout Right Form

- **dfRisk**  
  Risk Form

- **dfIssue**  
  Issues Form
### Dynamic Fields Spreadsheet Configuration

The spreadsheet is the primary tool for configuring FOCD Forms. Here's an example of how the spreadsheet is structured:

| ID  | Coord Top | Coord Left | Width | Name   | Type       | Form Name | Label                   |
| --- | --------- | ---------- | ----- | ------ | ---------- | --------- | ----------------------- |
| 1   | 192.43    | 289.95     | 75    | tbID   | NoPicklist | ALLOC1    | UID                     |
| 2   | 46        | 8          | 567   | pfBand | Band       | ALLOC1    | Allocation Key Metadata |
| 3   | 100       | 8          | 225   | tbName | NoPicklist | ALLOC1    | Allocation Name         |

#### Key Spreadsheet Columns Explained:

- **ID**: Unique identifier for the field in the data store
- **Coord Top** and **Coord Left**: Estimated position of the field on the form in pixels
- **Width**: The width of the field in pixels
- **Name**: Must match an existing field name in the data store
- **Type**: Indicates whether the field has a picklist or not (e.g., "NoPicklist" or "With Picklist")
- **Form Name**: Specifies which form the field appears on (e.g., "ALLOC1")
- **Label**: The text that will display in the UI for this field

### Step-by-Step Configuration

1. **Form Identification**:
   - Determine which form you need to customize
   - Note the correct SS Form Name from the table above

2. **Adding Fields**:
   - Open the provided Spreadsheet spreadsheet
   - Navigate to the Fields tab
   - Add a new row for each field you want to add
   - Fill in all required columns as described above
   - Save your changes to the spreadsheet

3. **Synchronization**:
   - Upload the updated spreadsheet to your currently running application (Agilebars, Timebars or Costbars)
   - The system will process your configurations and update the field configurations accordingly

4. **Testing and Adjustment**:
   - Visit the target form to test your changes
   - You may need to adjust the estimated field positions for better alignment by using the blue buttons at the top of the form.

## Field Positioning and Layout

### Adjusting Fields Position

FOCD Forms provide four blue icons/buttons at the top of the interface for moving and resizing fields:

1. Click the second icon from the left to move one field at a time
2. Click the third icon from the left to move multiple fields at once

When these tools are activated, dotted lines will appear around the fields to indicate they can be moved. Simply:
- Click and drag fields to new positions
- When finished, click the blue Square icon to save your sizing and positioning changes

This visual interface makes it easy to fine-tune the form layout without editing the spreadsheet directly.

## System Configuration Tags (Do Not Modify)

The `tbTag` store contains two distinct categories of data:

1. **User-facing picklist tags** — the dropdown values you see in forms (e.g., "High", "Low", "Active", "On Hold"). These are safe to add, edit, or delete.

2. **System configuration tags** — special entries that the FOCD engine reads at runtime to know how to render forms. **These must never be deleted or renamed.**

### The Five Protected Tag Groups

The following five `tbTagGroup` values are reserved for internal use. Their entries in the `tbTag` store act as configuration data, not user data:

| `tbTagGroup` value | What the `tbTagName` entries represent | What breaks if removed |
|---|---|---|
| **Tag Group** | The list of valid tag group names (e.g., "Primary Role", "Risk Category") — populates the Tag Group dropdown when creating/editing tags | Tag management UI breaks; cannot create or categorize new tags |
| **Form Name** | Identifiers for each dynamic form (e.g., "PF1", "PJ1", "Task1") | Dynamic forms fail to load entirely |
| **Field Name** | Internal IndexedDB field names (e.g., `tbMDStatus`, `tbMDPriority`) | Bulk update field filter dropdowns break; field metadata management grid breaks |
| **Field Type** | Rendering type for each field: `NoPicklist`, `WithPicklist`, `Editor`, `Band`, `TextArea` | Form fields do not render — the engine cannot determine how to build the HTML |
| **Field State** | Interaction state: `Disabled` or `Editable` | All fields lose their read-only/disabled distinction and become editable regardless of configuration |

### How These Tags Are Used at Runtime

When the FOCD engine builds a form, it:

1. Looks up the **Form Name** tag to identify which fields belong to the form
2. Reads each field's **Field Type** tag to decide which HTML component to render (`NoPicklist` input, `WithPicklist` dropdown, `Editor`, `Band`, or `TextArea`)
3. Reads the **Field State** tag to apply the `Disabled` or `Editable` attribute to each field
4. Uses **Field Name** tags to populate the field-level bulk update selectors
5. Uses **Tag Group** tags to populate the "Tag Group" dropdown in the tag management interface

If any entry in these groups is missing, the corresponding form, field, or UI component will fail silently or not appear at all.

### Where to Find Them

In the application, go to **Reports > Data Management Grids > Tags tab**. Filter the `tbTagGroup` column by any of the five names above to see the protected entries. Do not edit the `tbTagGroup` or `tbTagName` values of these rows.

In the spreadsheet, these entries appear on the **Tags** worksheet. They are identifiable by their `tbTagGroup` value being one of the five names above.

> **Warning:** These system configuration entries look like ordinary tag rows in both the application grid and the spreadsheet. There is no visual lock or colour coding to distinguish them from user tags. You must rely on the `tbTagGroup` value to identify them. Treat any row with `tbTagGroup` equal to "Tag Group", "Form Name", "Field Name", "Field Type", or "Field State" as read-only system data.

---

## Advanced Configuration

### Picklist Configuration

If your fields require dropdown options (picklists), follow these steps:

1. In the Fields spreadsheet tab, set the "Type" column to "With Picklist"
2. In the "Picklist Name" column, enter a value that exists in the Tags spreadsheet
3. You can either:
   - Use an existing picklist name from the Tags Spreadsheet Tab
   - Create a new picklist by adding entries to the Tags table

### Quill Text Editor Integration

A rich text editor (Quill) is available for certain fields, allowing users to enter and format text with options like bold, italics, and more. The Quill editor is an open-source framework that has been integrated into the application but is only available on specific fields (TBD to be determined).

## Testing Your Configuration

- **Field Behavior**: Enter test data into each field to ensure it behaves as configured
- **Data Validation**: Check that validation rules in the spreadsheet work as expected
- **Field Visibility**: Test any conditional display logic you've configured
- **Layout**: Confirm that the visual layout meets your requirements

## Support and Additional Resources

For additional support, consult the detailed help documentation available online or contact our technical support team. Training videos and FAQs are also available to guide you through more complex configurations and troubleshooting.

---

This user guide serves as a comprehensive framework to start using FOCD Forms effectively, emphasizing the ease with which forms can be customized and managed without coding skills.