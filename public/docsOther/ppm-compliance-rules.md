# PPM Compliance Rules

## 1. Compliance to PPM Business Rules

### 1.1 Proper Approvals
- **1.1.1**: Number of Projects in Selected to Implemented Stages for Gate 2 approvals
  - Please determine subset of projects to count per your system metadata

- **1.1.2**: Number of Projects in Delivering to Implemented Stages for Gate 3 approvals
  - Please determine subset of projects to count per your system metadata

- **1.1.3**: Number of Projects missing evidence of Gate 2 Approval
  - Rule is met if:  Depending your the business process

- **1.1.4**: Number of Projects that do not have Baseline 1 Set in PPM System
  - Rule is met if: ProjectBaseline1Work is NULL, if project is in flight

- **1.1.5**: Number of Projects that do not have Baseline 2 Set in PPM System
  - ProjectBaseline2Work is NULL if project is in flight

## 2. Data Quality in PPM System

### 2.1 Enterprise Resource Pool
- **2.1.1**: Total People Resources
  - No additional constraints or calculations.

- **2.1.2**: Has One or More Data Quality Issues
  - Rule is met if one of or both 2.1.3 or 2.1.4 is met.

- **2.1.3**: Number of Active Resources with Missing Data in User Profile
  - This section was revised July 14 to show individual fields with missing data, instead of one single compliant/non compliant rule.

- **2.1.4**: Resource Contract Date is in the Past
  - Rule is met if Resource Contract End Field is in the Past per this rule: [Resource Contract End] is less than today and [Labour Type] is one of Consultant, Contractor or Student and [Resource Is Active] is true.

## 3. Initiative Pipeline Health (Defined - Selected)
- **3.1**: Total Initiatives in Defined to Selected Stage
  - No additional constraints or calculations apply

- **3.2**: Initiatives with Data Quality Issues
  - Rule is met if any any combination of the following four rules are met 3.3, 3.4, 3.5 or 3.6.

- **3.3**: Number of Items With Start Date in the Past
  - The start date [ProjectStartDate] < Now, OR finish date [ProjectFinishDate] < Now (Now is the time the report is executed to get fresh data from the system)

- **3.4**: Items Assigned to "Inactive" Resources (DM and/or PM)
  - Each project has a Project Owner in PWA, and in turn is the Project Manager, the Delivery Manager is a separate field in PWA, both people must but be set as Active in "Enterprise Resource Pool (ERP)".

- **3.5**: Initiatives Pre-Assigned with With Actual Costs
  - ProjectActualCost > 0

- **3.6**: Number of Projects without a Class C+ with a start date within 18 months
  - The projects Current Project Status field is Active, Project Cost field is 0 and the Project Start date is between Now and less than 18 months from now.

## 4. Project Pipeline Health
- **4.1**: Number of Projects in Assigned to Implemented Stages
  - No additional constraints or calculations.

- **4.2**: Number of Initiatives With Data Quality Issues
  - Rule is met if any one of the following 6 rules are met (4.3 to 4.8)

- **4.3**: Number of Projects With Remaining Work Allocated to Inactive Resources
  - ResourceIsActive field is False and AssignmentRemainingWork > 0. Note: Can include "Generic Local Resource" Work

- **4.4**: Number of Projects With End Dates in the Past
  - ProjectFinishDate Field is earlier than Now.

- **4.5**: Number of Projects With Actual Costs in the Future Months
  - AssignmentActualCost field is greater than 0 and the Assignment By Day Date is greater than today.

- **4.6**: Number of Project Plans in Delivering Stage That Have Not Been Published in More Than 2 Weeks
  - StageName Field is 'Delivering' and [Current Project Status] = 'Active' and ProjectModifiedDate is older than two weeks ago.

- **4.7**: Number of Cancelled Projects With Actual Costs in the Future Months
  - [Current Project Status] = 'Cancelled' and AssignmentActualCost field is greater than 0 and the Assignment By Day Date is greater than today.

- **4.8**: Number of Projects With Status Inactive or Cancelled
  - [Current Project Status] field is either 'Inactive' or 'Cancelled'
