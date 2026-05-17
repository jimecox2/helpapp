# Configurable Features User Guide - Common Across Products
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

This guide is intended for organisation administrators and power users responsible for
configuring Timebars Ltd. products to suit their business processes. It covers the full
scope of user-configurable features across **Timebars**, **Agilebars**, and **Costbars**,
and provides the reference information needed to tailor the platform confidently and safely.

Important: Use this guide in conjunction with Common_03_MetaData_Fields_Report_by_Module document. It is much more detailed.

## Table of Contents

- [1. High-Level Overview](#1-high-level-overview)
  - A summary of configurable features by product, with shared features across
    Timebars, Agilebars, and Costbars clearly identified.

- [2. System-Reserved Metadata Fields and Values](#2-system-reserved-metadata-fields-and-values)
  - Metadata fields and picklist values built into the software that must not be
    modified. Changing these values will cause reports, filters, and views to fail
    without warning.

- [3. Configurable Picklist Reference](#3-configurable-picklist-reference)
  - Detailed documentation of fields that can be adapted to align with your
    organisation's terminology, workflows, and reporting requirements.

---

> **Before making any changes**, review the System-Reserved Metadata Fields and Values
> section to confirm whether a field or picklist value is safe to modify.

---

## 1. High-Level Overview

**Scheduling & Calendar**
- Status/Report date (controls the "as-of" date for all progress calculations)
- Timescale start and finish date (defines the visible date range)
- Weekly vs. monthly view toggle
- Weekly and monthly zoom level (pixels-per-period factor)


**Canvas Display Controls**
- Dark / light theme toggle
- Bar row spacing — Small, Medium, Large
- Hide/show completed bars
- Hide/show baseline bars (comparison snapshots)
- Hide/show ghost bars (original forecast overlay)
- Hide/show relationship/dependency lines between bars
- Hide/show hierarchy connection lines
- Visible hierarchy level filter (L1 Portfolio → L5 Allocation)

**Bar Type Visibility Filters**
- Hide/show Risk bars
- Hide/show Issue bars
- Hide/show Change Request bars

**Metadata & Tagging**
- Full set of project/task metadata fields (status, health, priority, stage, phase, category, PM, sponsor, department, etc.)
- Rich-text business-case sections (background, benefits, options analysis, stakeholders, constraints, cost-benefit, next steps, success criteria)
- Custom tag groups and picklist values for any dropdown field (status, priority, health, department, product, role, etc.)
- Custom sort order per item

**Dynamic Form Configuration (FOCD)**
- Show or hide individual fields on any form
- Rename field labels
- Set field tooltips/help text
- Link fields to custom picklist groups
- Reposition fields on the form (left/top coordinates and width)
- Mark fields as read-only/disabled

**Data & Export**
- Full JSON backup and restore of all data stores
- CSV export of individual stores (timebars, metadata, resources, tags, charts, fields, documents)
- Baseline snapshot creation for schedule comparison

**License & Tenant Info** (display/configuration, not user-editable post-install)
- Licensed user/org ID
- Expiry date
- Bar and project count limits (enforced automatically)

---

### Agilebars (AB) — Agile / Scrum Sprint Scheduling

**Kanban Board**
- Show card content as text vs. bar chart per card
- Five-lane Kanban (Backlog → Will Do → Doing → Finalizing → Done) with automatic % complete mapping
- Use status date or today for progress calculation on Kanban lane drops

**Sprint / Agile Planning**
- Sprint name assignment per task/story
- Fixed-sizing mode (hours never change when bars are dragged)
- Burndown chart view (progress tracked against status date)
- Per-sprint Kanban board selection (multiple boards supported)

**Hierarchy Limits**
- Supports L2 (Project) and L4 (Task) only — L1, L3, L5 hidden by product trim

---

### Timebars (TB) — Resource Scheduling & Project Timeline Management

**Timescale / Gantt**
- Full five-level hierarchy (Portfolio → Project → Sub-Project → Task → Allocation)
- Drag-to-schedule bars on the canvas with automatic work-day calculations using the calendar exceptions (Spreadsheet AdminPanel B6:C6 to B100:C100 ).
- Horizontal and vertical timeline views
- Leveling/resource loading view

**Resource Management**
- Resource pool creation (name, primary role, primary skill, department, manager, location, team leader)
- Work calendar per resource (hours per day/week)
- General availability percentage per resource
- External system ID per resource (for integration)
- Number of resources per line in allocation view
- Pixels-per-person display scaling
- Custom Standard Holiday Exceptions (Spreadsheet AdminPanel B6:C6 to B100:C100 )

**Resource Calculation Views**
- Weekly demand charts by resource name
- Weekly demand charts by primary role
- Monthly rollup capacity views

**Baseline & Comparison**
- Create and name baseline snapshots
- Toggle baseline bar overlay on canvas


---

##3 Costbars (CB) — Project Portfolio Pipeline & Cost Management

**Portfolio Management (PPM)**
- PPM tabular view
- PPM card view
- PPM scorecard view
- Prioritisation and scoring configuration
- Demand grid views

**Financial & Investment Metadata Fields**

- Investment category, objective, strategy, and initiative classification
- Primary Line of Business, Sponsoring Department
- ROM (Rough Order of Magnitude) estimate, Estimation Class, Size, Weighting
- Budget cost and hours at task/project level
- Optional PPM Scoring for project kill decisions bases on: Net Present Value, Internal Rate of Return, Payback Period, Economic Value Added, Benefit-Cost Ratio, Opportunity Cost, Sunk Costs

**Portfolio Structuring**
- Full five-level hierarchy for portfolio pipelines
- Risk vs. Size & Complexity assessment field
- Portfolio and programme assignment tags

---

### Data Gathering Considerations

1. Analyze incoming information from user thoroughly
2. Create strategic breakdown of project information (Project, Task, Risks, etc.)
3. Ensure tasks are actionable and specific; risks relate to associated descriptions
4. Include key milestones representing significant project achievements
5. Consider dependencies, priorities, and logical predecessor/successor sequencing
6. Limit total rows to necessary items only
7. Focus on most critical and impactful items
8. Always provide executive summary and project description (not for tasks/risks)
9. Include a mix of tasks and milestones providing comprehensive project schedule coverage.

---

## 2. System-Reserved Metadata Fields and Values

System-reserved metadata fields are fields whose picklist values are **hard-coded into the software**. They are required for the application to function correctly and cannot be renamed, removed, or reordered.

> **Important:** Do not delete or rename any system-reserved picklist value listed in this section.
> Doing so will cause filters, reports, and views that depend on those values to stop
> working properly. You may safely **add** new values to
> these picklists to support custom reporting or display requirements, but existing
> system-reserved values must remain intact. In some cases the application may fail and in other cases they will fail silently for example an element that should show status indicator may show the indicator without color, the application did not fail or crash.


### **System-reserved Core Fields**

**Field Name**: tbType
**Picklist Name:** tbType
**Purpose**: Used by the internal scheduling engine to determine if a row is a Project, Task etc.
**Values:** Portfolio, Project, Sub-Project, Milestone, Task, Allocation

**Field Name**: tbSubType
**Picklist Name:** SubType
**Purpose**: For changing a Task to a Risk, Issue or CR.
**Values:** Issue, Other, Risk, Task, CR

**Field Name**: tbMDStatus
**Picklist Name:** Timebar Status
**Purpose**: Key component of the three products to indicate highlevel status at a glance. Is used extensivly in PPM to determine new initiatives (proposals), in-flight projects, closed etc. 
**Values:** Rejected, In progress, New, Closed, On Hold

**Field Name**: tbMDPhase
**Picklist Name:** Phase
**Purpose**: High-level Phase of Project or Program
**Values:** Closing, Executing, Initiating, Planning


**Field Name**: tbMDHealth
**Picklist Name:** Schedule Status
**Purpose**: Fixed set of status indicators mainly for Project and PPM reportin color indicators
**Values:** Completed, Early, Late, On schedule, Slipping, Not Assessed, Blocked


**Field Name**: tbMDPriority
**Picklist Name:** Timebar Priority
**Purpose**: Fixed set of priority indicators mainly for Project and PPM reporting with color indicators
**Values:** High, Immediate, Low, Normal, Not Assessed


**Field Name**: tbMDEstimationClass
**Picklist Name:** Estimation Class
**Purpose**: How was the estimate derived, guess, history or from the bottom up with resources.
**Values:** SWAG, Based on History, Resource Driven

**Field Name**: tbMDSeniorLevelCommitment
**Picklist Name:** Executive Commitment
**Purpose**: Used in PPM scoring and notifications calculations.
**Values:** Full, Strong, Moderate, Limited, Not Clear, Not Assessed

**Field Name**: tbMDRiskVsSizeAndComplexity
**Picklist Name:** Risk Vs Size
**Purpose**: A calculated value when completing the Project Assessment Form. Can be overidden manually. Used in the internal PPM select/kill decision making.
**Values:** Not Assessed, 0-10 Very Small and Simple, 11-20 Small and Straightforward, 21-30 Medium with Some Complexity, 31-40 Large with Moderate Complexity, 41-50 Complex but Manageable, 51-60 Significant Complexity, 61-70 Large and Complex, 71-80 Very Large and Complex, 81-90 Highly Complex and Risky, 91-100 Extremely Complex and Risky


**Field Name**: tbMDROMEstimate
**Picklist Name:** Budget Estimate
**Purpose**: The random order of magnitude size of a project or sub-project aka work package, Used as fallback when tbBudgetCost is zero or missing in the PPM Select/Kill automated process.
**System reserved values** "0 to 100K", "101K to 300K", "301K to 1000K", "1001K to 5000K", "5000K Plus"

**Field Name**: tbMDEscalationLevel
**Picklist Name:** Escalation Level
**Purpose**: The Escalation Level is a way to tag Projects, Tasks, Risks and Issues so that the vusually right level is identified when a project needs attention. The Notifications feature in the Enterprise Dashboard leverages this to automatically Escalate a notification to higher levels.
**Values:** Executives, Directors, Project Office, Not Assessed


**Field Name**: tbMDSelectedYesNo
**Picklist Name:** Selected
**Purpose**: Determined by the PPM Select/Kill decision making process, can be manually overidden
**Values:** Yes, No, Not Assessed


**Field Name**: tbMDShowIn
**Picklist Name:** Show In Reports
**Purpose**: For tagging Tasks and Milestones for targeted reporting.
**Values:** Investment Plan, Milestone Horizon, Business Case, Facility Schedule


---


### **System-reserved Resource Pool Picklists**

**Field Name**: tbResLabourType
**Picklist Name:** Labour Type
**Purpose**: The type of resource Human or Generic, important value in the resource Supply and Demand analysis and reporting components.
**Values:** Generic, Human, Other

**Field Name**: tbResPartTimeFullTime
**Picklist Name:** Part-time Full-time
**Purpose**: Fxed values for Supply and Demand analysis, filtering and sorting resource pool and reports
**Values:** Full Time, Part Time

**Field Name**: tbResResourceType
**Picklist Name:** Resource Type
**Purpose**: Important value in the resource analysis and cost reporting.
**Values:** Equipment, Labour, Material

---

### **System-reserved Risks Issues & CRs Picklists**

Note that the Risk and Issues Module piggybacks on other existing picklists. See the document Common_03_MetaData_Fields_Report_by_Module for complete details

**Field Name**: tbMDImpact
**Picklist Name:** Risk Impact
**Purpose**: For tagging risks to indicate the severity of the consequences if the risk occurs. It's part of the risk scoring result.
**Values:** Very Low, Low, Medium, High, Very High, Not Assessed

**Field Name**: tbMDProbability
**Picklist Name:** Risk Probability
**Purpose**: Likelyhood a risk will happen. This, along with the impact field, is used to calculate the overall risk score.
**Values:** Very Unlikely, Unlikely, Likely, Very Likely, Certain, Not Assessed

**Field Name**: tbMDMitigationStatus
**Picklist Name:** Mitigation Status
**Purpose**: Manually control the indicator that the risk has been recognized??

---

### **System-reserved Health Picklists**

The following health fields are used across all three products and have fixed picklist values and cannot be changed.

**Field Name**: tbMDHealthCost
**Picklist Name:** Health Cost
**Purpose**: Cost Health indicator picklist
**Values:** Green, Yellow, Not Assessed, Red

**Field Name**: tbMDHealthHours
**Picklist Name:** Health Hours
**Purpose**: Hours Health indicator picklist
**Values:** Green, Yellow, Not Assessed, Red

**Field Name**: tbMDHealthIssues
**Picklist Name:** Health Issues
**Purpose**: Issues Health indicator picklist
**Values:** Green, Yellow, Not Assessed, Red

**Field Name**: tbMDHealthOverall
**Picklist Name:** Health Overall
**Purpose**: Overall Health indicator picklist
**Values:** Green, Yellow, Not Assessed, Red

**Field Name**: tbMDHealthRisk
**Picklist Name:** Health Risk
**Purpose**: Risk Health indicator picklist
**Values:** Green, Yellow, Not Assessed, Red

**Field Name**: tbMDHealthSchedule
**Picklist Name:** Health Schedule
**Purpose**: Schedule Health indicator picklist
**Values:** Green, Yellow, Not Assessed, Red

**Field Name**: tbMDHealthScope
**Picklist Name:** Health Scope
**Purpose**: Scope Health indicator picklist
**Values:** Green, Yellow, Not Assessed, Red

---

### **System-reserved Project Assessment Picklists**

**Field Name**: tbPASCrossTeamCollaboration
**Picklist Name:** Cross Team Collaboration
**Purpose**: Fixed set of values for filling in the Project Assessment Form
**Values:** Single team, 2-3 teams, 4-6 teams, 7-10 teams, Many teams/departments

**Field Name**: tbPASDomainExperience
**Picklist Name:** Domain Experience
**Purpose**: Fixed set of values for filling in the Project Assessment Form
**Values:** Extensive experience, Good experience, Some experience, Limited experience, New domain

**Field Name**: tbPASExternalIntegrations
**Picklist Name:** External Integrations
**Purpose**: Fixed set of values for filling in the Project Assessment Form
**Values:** None, 1-2 simple integrations, 3-5 moderate integrations, 5+ complex integrations, Many critical integrations

**Field Name**: tbPASMarketTiming
**Picklist Name:** Market Timing
**Purpose**: Fixed set of values for filling in the Project Assessment Form
**Values:** Perfect timing, Good timing, Acceptable timing, Challenging timing, Poor timing

**Field Name**: tbPASStatus
**Picklist Name:** Project Assessment Status
**Purpose**: Fixed set of values for filling in the Project Assessment Form
**Values:** Draft, Completed, Approved, Rejected, On Hold

**Field Name**: tbPASProjectType
**Picklist Name:** Project Assessment Type
**Purpose**: Fixed set of values for filling in the Project Assessment Form
**Values:** Incremental Improvement, Enhancement, New Feature, New Product, Breakthrough Innovation

**Field Name**: tbPASProjectSimilarity
**Picklist Name:** Project Similarity
**Purpose**: Fixed set of values for filling in the Project Assessment Form
**Values:** Very Similar, Somewhat Similar, Moderately Different, Quite Different, Completely New

**Field Name**: tbPASRegulatoryApprovals
**Picklist Name:** Regulatory Approvals
**Purpose**: Fixed set of values for filling in the Project Assessment Form
**Values:** None required, Internal approvals, Industry standards, Government approvals, Multiple regulatory bodies


**Field Name**: tbPASStakeholderCount
**Picklist Name:** Stakeholder Count
**Purpose**: Fixed set of values for filling in the Project Assessment Form
**Values:** 1-5 stakeholders, 6-10 stakeholders, 11-20 stakeholders, 21-50 stakeholders, Over 50 stakeholders

**Field Name**: tbPASTeamSize
**Picklist Name:** Team Size
**Purpose**: Fixed set of values for filling in the Project Assessment Form
**Values:** 1-3 people, 4-8 people, 9-15 people, 16-30 people, Over 30 people

**Field Name**: tbPASTeamTechExperience
**Picklist Name:** Team Tech Experience
**Purpose**: Fixed set of values for filling in the Project Assessment Form
**Values:** Expert level, Advanced, Intermediate, Basic, No experience

**Field Name**: tbPASTechnologyNovelty
**Picklist Name:** Technology Novelty
**Purpose**: Fixed set of values for filling in the Project Assessment Form
**Values:** Proven/Mature, Established, Emerging, Cutting-edge, Experimental

---



## 3. Configurable Picklist Reference

*Tag values are not shown for Configurable Picklists — only the Picklist Name, internal field name, and purpose. Configurable picklists have default values that ship with the Spreadsheet and demo data but can be edited by users; values can organisation-specific. Labels for display to the user can be customized but not the internal field names.*  

---

### **Configurable General Picklists**


**Field Name**: tbMDStage
**Picklist Name:** Stage
**Purpose**: Manual indicators of the project life-cycle workflow
**Recommended Values:** 1 Proposed, 2 Triaged, 3 Prioritized, 4 Selected, 5 Assigned, 6 Delivering, 7 Delivered, 8 Closed

**Field Name**: tbMDSize
**Picklist Name:** Size
**Purpose**: Project or Task Size Tagging for sorting and reporting

**Field Name**: tbMDCategory
**Picklist Name:** Category
**Purpose**: Custom catorisation of project or initiatives

**Field Name**: tbOwner
**Picklist Name:** Owner
**Purpose**: Who owns and is responsible overall for the item


**Field Name**: tbMDProduct
**Picklist Name:** Product
**Purpose**: The key product inside the organisaton that that may be impacted by this project


**Field Name**: tbMDPM
**Picklist Name:** Project Manager
**Purpose**: Who is the Project Manager

**Field Name**: tbMDBusinessAdvisor
**Picklist Name:** Business Advisor
**Purpose**: The business point of contact person mainly used in PPM processses

**Field Name**: tbMDContact
**Picklist Name:** CR Requestor
**Purpose**: Identify who is requesting the CR

**Field Name**: tbCostType
**Picklist Name:** Cost Type
**Purpose**: Cost type field in Timebars table not used much

**Field Name**: tbMDDeliveryManager
**Picklist Name:** Delivery Manager
**Purpose**: Who is responsible for delivery of this item

**Field Name**: tbMDDepartment
**Picklist Name:** Department
**Purpose**: What department does this project or portfolio belong to


**Field Name**: tbMDPrimaryLineOfBusiness
**Picklist Name:** Primary LOB
**Purpose**: Which business line in the organisation owns this project or portfolio


**Field Name**: tbMDResponsibility
**Picklist Name:** Responsible Person
**Purpose**: Define persone who is responsible, person doing the work, usually not the owner

**Field Name**: tbMDResponsibleTeam
**Picklist Name:** Responsible Team
**Purpose**: Define Team who is responsible, person doing the work, usually not the owner

**Field Name**: tbMDSponsoringDepartment
**Picklist Name:** Sponsoring Department
**Purpose**: What department is providing the funding for this initiative


**Field Name**: tbMDPortfolio
**Picklist Name:** Portfolios
**Purpose**: Not used in any specific calculations or reports.

**Field Name**: tbMDGate
**Picklist Name:** Gate
**Purpose**: Not used in any specific calculations or reports.

---

### **Configurable Resource Pool Picklists**

**Field Name**: tbResResourceCalendar
**Picklist Name:** Calendar
**Purpose**: The resource calendar (`tbResResourceCalendar`) defines the workday hours and is used for calculating work on an allocation.
**Values:** 4, 7.5, 8, 24

**Field Name**: tbResPercentGeneralAvailability
**Picklist Name:** Percent Available
**Purpose**: A Picklist for PercentTimeAllocated` (or `tbPercentTimeOn`) can be used to override the percent allocated on the Allocation.


**Field Name**: tbResPrimaryRole
**Picklist Name:** Primary Role
**Purpose**: Tag resources for resource demand calculations

**Field Name**: tbResPrimarySkill
**Picklist Name:** Primary Skill
**Purpose**: Set skill for filtering resources


**Field Name**: tbResCostCode
**Picklist Name:** Cost Code
**Purpose**: Resources Custom Cost Code Metadata for reporting costs, mainly used at Task or Allocation level

**Field Name**: tbResLocation
**Picklist Name:** Location
**Purpose**: Where is resource located for sorting and reporting

**Field Name**: tbResManager
**Picklist Name:** Manager
**Purpose**: Who does the resource report to, used for sorting and reporting

**Field Name**: tbResResourceClass
**Picklist Name:** Resource Class
**Purpose**: Resource or person tagging

**Field Name**: tbResDepartment
**Picklist Name:** Resource Department
**Purpose**: Resource or person tagging

**Field Name**: tbResSupervisor
**Picklist Name:** Supervisor
**Purpose**: Who is the resources supervisor

**Field Name**: tbResTeamLeader
**Picklist Name:** Team Leader
**Purpose**: Resource or person tagging

---









### **Configurable PPM Picklists**

**Field Name**: tbMDPriorityStrategic
**Picklist Name:** Strategic Priority
**Purpose**: Calculated value in the PPM process for select/kill decision, overides manual selections. you can add custom pick list values and use them if you are not using the automated PPM Select/Kill decision process.

These next 4 fields are the core values for the Strategic Priority calculations inside the PPM scheduling engine. They are fully configurable to suit business needs. 

**Field Name**: tbMDInvestmentCategory
**Picklist Name:** Investment Category
**Purpose**: Key category values for calculating SV Score

**Field Name**: tbMDInvestmentInitiative
**Picklist Name:** Investment Initiative
**Purpose**: Internal Initiatiative values for calculating SV Score

**Field Name**: tbMDInvestmentObjective
**Picklist Name:** Investment Objective
**Purpose**: Business Objective values for calculating SV Score

**Field Name**: tbMDInvestmentStrategy
**Picklist Name:** Investment Strategy
**Purpose**: Business Strategy values for calculating SV Score

The following 4 financial based fields are optional in terms of the calculation of the Strategic Priority and the system driven project Select/Kill decision process. These values can be used in the Tabular reports to assist in manual override of Select/Kill decisions.

**Field Name**: tbMDBenefitCostRatio
**Picklist Name:** Benefit Cost Ratio
**Purpose**: Tagging financial values on business case.

**Field Name**: tbMDInternalRateOfReturn
**Picklist Name:** Internal Rate of Return
**Purpose**: Tagging financial values on business case.


**Field Name**: tbMDNetPresentValue
**Picklist Name:** Net Present Value
**Purpose**: Tagging financial values on business case.

**Field Name**: tbMDPaybackPeriod
**Picklist Name:** Payback Period
**Purpose**: Tagging financial values on business case.

