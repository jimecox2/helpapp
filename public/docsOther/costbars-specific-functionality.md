# Costbars-Specific Functionality
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)
Costbars is the Project Portfolio Management (PPM) application in the Timebars Ltd. suite. While it shares a common platform with Agilebars and Timebars — including the canvas, spreadsheet sync, cloud publishing, and data management features covered in [Common Functionality Across All Products](https://www.timebars.com/articles/common-functionality-across-all-products)


## Table of Contents
- [What Makes Costbars Different](#what-makes-costbars-different)
- [The Five-Step PPM Process](#the-five-step-ppm-process)
- [Step 1: Prioritise — Strategic Value Scores](#step-1-prioritise--strategic-value-scores)
  - [How SV Scores Are Calculated](#how-sv-scores-are-calculated)
  - [Financial Metrics as a Scoring Component](#financial-metrics-as-a-scoring-component)
- [Step 2: Score — Ability to Execute](#step-2-score--ability-to-execute)
  - [What the AE Score Measures](#what-the-ae-score-measures)
  - [Score Thresholds and Recommendations](#score-thresholds-and-recommendations)
- [Step 3: Level Resources](#step-3-level-resources)
- [Step 4: Select — The Bubble Chart](#step-4-select--the-bubble-chart)
  - [Reading the Quadrants](#reading-the-quadrants)
  - [The Selection Formula](#the-selection-formula)
- [Step 5: Balance — The Balanced Scorecard](#step-5-balance--the-balanced-scorecard)
  - [Strategic Alignment](#strategic-alignment)
  - [Risk Balance](#risk-balance)
  - [Investment Mix](#investment-mix)
  - [Timeline Distribution](#timeline-distribution)
- [PPM Metadata: Strategic Classification Fields](#ppm-metadata-strategic-classification-fields)
- [Project Views: Tabular and Card](#project-views-tabular-and-card)
- [The Project Assessment Tool](#the-project-assessment-tool)
- [Portfolio Status and Balancing Report](#portfolio-status-and-balancing-report)

---

## What Makes Costbars Different

Costbars answers the strategic questions that portfolio managers and PMO leaders face every planning cycle: Which projects should we approve, delay, or terminate? Are we investing in the right initiatives? Do we have the resource capacity to deliver everything we have committed to? Is our portfolio balanced across risk, time horizon, and strategic intent? It provides a structured five-step process that transforms subjective portfolio decisions into data-driven ones — scoring each project against your organisation's own strategic priorities, then visualising the results in a way that makes the right choices obvious.

Where Timebars focuses on executing projects with precision and Agilebars on sprint-level delivery, Costbars operates at the portfolio level: above the individual project, across the entire pipeline of proposed, approved, and in-flight work. The same canvas and scheduling engine that power Timebars are present in Costbars, but the primary interface for portfolio decision-making is the PPM page — a command centre for prioritisation, scoring, resource levelling, project selection, and portfolio balancing that sits alongside the canvas rather than replacing it.

---

# The Five-Step PPM Process
-----------

The Costbars PPM process structures portfolio decisions into five sequential steps. Each step builds on the previous one: you cannot select projects meaningfully without scoring them first, and you cannot balance the portfolio without knowing which projects have been selected. Running the full cycle at the start of each planning period — and re-running affected steps whenever project data changes — keeps the portfolio current and defensible.

| Step | Action | Output |
|---|---|---|
| 1 | Prioritise | Strategic Value (SV) Scores for every project |
| 2 | Score | Ability to Execute (AE) Scores for every project |
| 3 | Level | Resource demand brought into alignment with supply |
| 4 | Select | Projects marked Yes or No via the bubble chart |
| 5 | Balance | Portfolio assessed against the balanced scorecard |

---

## Step 1: Prioritise — Strategic Value Scores

The first step asks a single question: how strategically important is each project? Costbars answers it by calculating a **Strategic Value (SV) Score** — a number between 0 and 100 — for every project in the portfolio, based entirely on the strategic classification metadata attached to each project. The score reflects how closely a project aligns with the organisation's stated priorities across four dimensions: Investment Category, Investment Initiative, Investment Objective, and Investment Strategy.

The key insight is that the scoring is relative, not absolute. The portfolio manager sets the **order of importance** for each dimension — which investment categories matter most, which strategic pillars take precedence — and Costbars uses that ordering to weight the scores. A project that lands at the top of every priority list receives a score close to 100; one that sits in low-priority categories across all four dimensions scores near zero. Running the prioritisation step takes seconds; the work is in agreeing on the order of importance, which is a strategic conversation the organisation should be having anyway.

### How SV Scores Are Calculated

Each of the four strategic dimensions contributes to the final SV Score, weighted by its position in the order-of-importance ranking set by the portfolio manager. Projects are evaluated against every dimension simultaneously, and the resulting scores are combined into the 0–100 composite that appears on the bubble chart, in the tabular view, and in the portfolio status report. A test run previews the results before they are saved, allowing the portfolio manager to verify the rankings look right before committing to the scores.

### Financial Metrics as a Scoring Component

When a project has sufficient financial data — at least four of the seven financial fields populated — the SV Score can incorporate a financial metrics component on a 50/50 basis with the strategic alignment score. For projects without adequate financial data, the score defaults to 100% strategic alignment without penalty, so early-stage proposals are not disadvantaged simply because detailed cost estimates are not yet available.

---

## Step 2: Score — Ability to Execute

Strategic value alone is not enough to approve a project. A project can be perfectly aligned with organisational strategy and still fail because the team lacks the capacity, the budget is unrealistic, or the complexity is underestimated. The **Ability to Execute (AE) Score** provides the second dimension: a 0–100 assessment of how feasible and well-positioned the project is for successful delivery.

### What the AE Score Measures

The AE Score draws on multiple data points from the project record: the Risk vs. Size and Complexity assessment (a 0–100 rating of how demanding the project is), the level of executive commitment behind it, the quality of the cost estimate (SWAG, history-based, or resource-driven), and — for projects already in flight — health indicators and budget or hours variance. Together these inputs produce a score that reflects not just whether the project sounds deliverable in theory, but whether the conditions for delivery are actually in place.

### Score Thresholds and Recommendations

The AE Score produces an automated recommendation alongside the number itself:

| AE Score | In-Flight Projects | New Proposals |
|---|---|---|
| 80 and above | Continue | Proceed — strong scoring |
| 60 to 79 | Review | Review — moderate scoring |
| Below 60 | Consider terminating | Reject — weak scoring |

Green, yellow, and red colour coding make the distribution across the portfolio immediately readable. The recommendations are a starting point, not a mandate — the portfolio manager makes the final call — but they surface the projects that need attention and provide an objective basis for those conversations.

---

## Step 3: Level Resources

Before selecting projects, it is worth knowing whether the organisation can actually deliver them. Step 3 opens the resource levelling view on the canvas, where the total resource demand from all candidate projects is plotted against available supply. Over-allocated periods show up in red. The portfolio manager can drag project bars left or right to shift their demand peaks into periods where capacity exists — watching the demand chart recalculate in real time as adjustments are made.

Resource levelling at the portfolio level is qualitatively different from levelling within a single project. The question is not just "when can this person do this task?" but "which combination of start dates for all our projects keeps demand inside supply without delaying anything critical?" Costbars does not automate this decision — the portfolio manager knows which projects have hard constraints and which have flexibility — but it provides the visibility to make informed trade-offs quickly and to see the consequences of each adjustment before committing to it.

---

## Step 4: Select — The Bubble Chart

With SV Scores, AE Scores, and resource demand understood, the selection step uses the **Bubble Chart** to make the approve-or-kill decisions visual. Every project in the portfolio appears as a bubble, positioned by its SV Score on the horizontal axis and its AE Score on the vertical axis, with bubble size representing the project's budget or forecast hours. The result is a portfolio map where the right decisions are immediately apparent.

### Reading the Quadrants

| Quadrant | Position | Action |
|---|---|---|
| Top-right | High SV + High AE | **Approve** — strategically important and highly deliverable |
| Top-left | Low SV + High AE | **Review** — easy to execute but questionable strategic value |
| Bottom-right | High SV + Low AE | **Mitigate** — strategically important but execution risk needs addressing |
| Bottom-left | Low SV + Low AE | **Kill** — neither strategically aligned nor well-positioned to succeed |

The bubble chart makes it easy to spot concentrations — a cluster of large bubbles in the bottom-left is a clear signal that significant budget is committed to low-value, high-risk work. Equally, a chart with nothing in the top-right suggests either that strategic alignment is weak across the portfolio or that the scoring parameters need recalibration.

### The Selection Formula

Once the portfolio manager is satisfied with the visual picture, the selection step applies a weighted formula — SV Score at 60% weight, AE Score at 40% — against a threshold they set. Projects above the threshold are marked **Selected: Yes**; those below are marked **Selected: No**. A test run previews which projects land on each side of the line before the results are saved, allowing the threshold to be adjusted until the selection reflects the portfolio manager's judgement.

---

## Step 5: Balance — The Balanced Scorecard

Selecting the highest-scoring projects does not automatically produce a balanced portfolio. A portfolio that approves only short-duration projects neglects long-term strategic positioning. One that concentrates entirely on innovation starves operational stability. The **Balanced Scorecard** in Step 5 examines the selected portfolio across four dimensions and flags imbalances that might not be visible from scoring alone.

### Strategic Alignment

This section shows how portfolio budget is distributed across the organisation's strategic pillars. The question it answers is whether spending reflects stated priorities — if the top strategic pillar is receiving only a fraction of the budget while a lower-priority one dominates, there is a misalignment between what the organisation says it values and what it is actually funding. KPI indicators flag the gap and prompt a rebalancing conversation.

### Risk Balance

This section displays how the portfolio's budget is distributed across risk categories, from Very Low to Very High. An organisation with a conservative risk appetite that finds 60% of its portfolio budget concentrated in high-risk projects has a structural problem that selection scores alone will not surface. The risk balance view makes that concentration visible and supports a deliberate conversation about whether the current selection reflects an acceptable risk posture.

### Investment Mix

This section evaluates the portfolio's split across initiative types: Maintenance and Operational, Innovation and Transformation, Growth and Enhancement, and Mandatory and Compliance. A healthy portfolio typically maintains investment across all four categories within ranges that reflect the organisation's maturity and strategy. A portfolio dominated by maintenance work is underinvesting in growth; one with insufficient compliance investment carries regulatory exposure. The investment mix scorecard surfaces both.

### Timeline Distribution

This section assesses the balance of the portfolio across time horizons — short-term (under four months), medium-term (four to twelve months), and long-term (over twelve months). A portfolio with no long-term projects has no strategic pipeline; one weighted entirely toward short-term work is in reactive mode. KPI indicators flag when the distribution falls outside healthy ranges and point toward the rebalancing actions — approving or deferring projects — that would restore balance.

---

# PPM Metadata: Strategic Classification Fields
-----------

The entire scoring and balancing process depends on the strategic classification metadata attached to each project. Four fields drive the SV Score calculation:

- **Investment Category** — the functional area or business unit the project belongs to (e.g., Finance, Operations, Customer Experience)
- **Investment Initiative** — the type of initiative (e.g., Innovation, Growth, Maintenance, Compliance)
- **Investment Objective** — the Run / Grow / Transform classification that reflects the project's strategic intent
- **Investment Strategy** — the specific strategic pillar the project supports (e.g., Increase Market Share, Improve Core Products, Ensure Compliance)

These fields are set per project, either through the core metadata form or via spreadsheet sync for bulk data entry. Because the same fields are used to group and aggregate data in the balanced scorecard and portfolio status report, consistent and accurate classification across the portfolio is what makes the PPM outputs trustworthy. Costbars provides picklists and tagging tools to enforce consistent terminology, and the spreadsheet sync process makes it practical to classify an entire pipeline of proposed projects in a single import.

---

# Project Views: Tabular and Card
-----------

The PPM page provides two dedicated views for working with portfolio data outside of the canvas.

The **Tabular View** is a spreadsheet-style grid showing every project with its key metrics in columns: SV Score, AE Score, combined final score, selection status, and decision recommendation alongside the standard project fields. It is the right view for sorting and filtering a large pipeline — quickly identifying all projects above a score threshold, all projects in a particular investment category, or all proposals not yet assessed. Projects can be sorted by any column, and the metadata editor can be launched from any row to update classification fields without leaving the view.

The **Card View** displays each project as a visual card showing the project name, status badge, SV and AE scores with colour coding, budget information, and selection status. It is designed for portfolio reviews with executive stakeholders — a room full of decision-makers can scan the card grid and quickly spot patterns that require discussion. The colour-coded score indicators mean that a portfolio with a concentration of red cards is immediately recognisable without needing to read the numbers.

---

# The Project Assessment Tool
-----------

Before the AE Score can be calculated, each project needs to be evaluated against a consistent feasibility framework. The **Project Assessment Tool** provides that framework: a structured form that examines a project across four dimensions — Technical Risk, Political Risk, Size, and Complexity — and produces an Overall Feasibility Score between 0 and 100.

The assessment covers technology maturity and architectural complexity, team size and stakeholder count, resource availability, change impact and executive commitment, external dependencies and regulatory constraints, and the project's duration and budget magnitude. For each factor, the assessor selects from a defined scale rather than entering free text, which means the results are comparable across projects and assessors. An overall score below 25 indicates low risk and standard project management is sufficient; scores above 50 signal elevated risk requiring mitigation; scores above 75 indicate critical risk and suggest the project should be phased, descoped, or subject to a proof-of-concept before commitment.

The tool is particularly valuable for evaluating new project proposals before they enter the scoring process, because it forces the project sponsor to articulate the risk factors that an SV Score alone cannot capture. A project with a compelling strategic case but an assessment score in the critical risk range needs risk reduction work before approval — not unconditional sign-off.

See the [Costbars PPM Project Assessment Tool](https://www.timebars.com/knowledgebase/helparticles/costbars-ppm-project-assessment-tool) guide for full details.

---

# Portfolio Status and Balancing Report
-----------

The Portfolio Status and Balancing Report is the primary executive output from Costbars — a comprehensive, single-document view of the entire portfolio's health, financial position, strategic alignment, and multi-dimensional balance. It is designed to be the artefact that portfolio managers bring to quarterly reviews, steering committee meetings, and investment approval sessions.

The report opens with an executive summary showing health indicators across seven dimensions: Overall, Scope, Schedule, Cost, Hours, Risk, and Issues — each rated green, yellow, or red to give leadership an immediate sense of where the portfolio stands. This is followed by a financial summary broken down by project status (in-progress, approved, and proposed), then a strategic alignment analysis showing how budget is distributed across strategic pillars. The body of the report covers in-flight projects requiring attention, approved projects assessed for readiness, and new proposals under evaluation. The final sections mirror the balanced scorecard dimensions — risk score distribution, initiative type balance, and time horizon analysis — but in report form with the narrative context that supports a leadership conversation.

The report is generated on demand and always reflects the current state of the portfolio data. It is the clearest answer Costbars provides to the question that portfolio management exists to answer: given everything we know about our projects, our resources, and our strategy, are we making the right investments?

See the [Costbars PPM Portfolio Status and Balancing Report](https://www.timebars.com/knowledgebase/helparticles/costbars-ppm-portfolio-status-and-balancing-report) guide for full details.

See the [Costbars User Guide](https://www.timebars.com/knowledgebase/helparticles/costbars-user-guide) for detailed instructions on every feature covered on this page.
