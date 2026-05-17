# Costbars - Project Assessment Tool User Guide
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

## Table of Contents
1. [Introduction](#introduction)
2. [Why Use the Project Assessment Tool](#why-use-the-project-assessment-tool)
3. [Understanding the Scoring System](#understanding-the-scoring-system)
4. [How to Launch an Assessment](#how-to-launch-an-assessment)
5. [Completing Each Section](#completing-each-section)
6. [Interpreting Your Results](#interpreting-your-results)
7. [What to Do With Your Assessment](#what-to-do-with-your-assessment)
8. [Best Practices](#best-practices)

---

## Introduction

The Project Assessment Tool is a comprehensive evaluation framework built into Costbars that helps you objectively evaluate project feasibility, complexity, and risk before committing resources. It analyzes your project across four critical dimensions—technical risk, political risk, size, and complexity—to generate an Overall Feasibility Score ranging from 0 (low risk) to 100 (critical risk).

This guide will walk you through how to complete an assessment, explain what to consider for each question, and show you how to use the results to make better project decisions.

---

## Why Use the Project Assessment Tool

### **Before You Commit Resources**

Complete an assessment when you're evaluating whether to green-light a new project or add it to your portfolio. The assessment helps you:

- **Identify hidden complexity** that isn't obvious from the project proposal
- **Surface risk factors** across technical, political, organizational, and market dimensions
- **Compare projects objectively** using consistent criteria rather than gut feelings
- **Generate talking points** for portfolio review meetings and gate reviews
- **Set realistic expectations** with stakeholders about project difficulty

### **During Portfolio Reviews**

Use assessment scores to:

- **Balance your portfolio risk** by mixing low-risk and high-risk initiatives appropriately
- **Prioritize projects** based on both strategic value and feasibility
- **Justify decisions** with objective data when stakeholders challenge project selections
- **Identify projects** that need additional risk mitigation planning before launch

### **When Requesting Resources**

Assessment results provide evidence when negotiating for:

- **Extended timelines** for complex projects
- **Additional budget** to address high-risk technical components
- **More experienced team members** when expertise gaps are identified
- **Executive sponsorship** for politically complex initiatives

---

## Understanding the Scoring System

### **The Four Risk Dimensions**

Your project receives four component scores, each ranging from 0-100:

1. **Technical Risk Score** – Measures technology maturity, team expertise, architectural complexity, and integration challenges
2. **Political Risk Score** – Evaluates stakeholder alignment, decision-maker complexity, and organizational change impact
3. **Size Score** – Quantifies project duration, team size, budget, and number of integrations
4. **Complexity Score** – Assesses regulatory requirements, external dependencies, organizational experience, and market factors

### **Overall Feasibility Score**

These four component scores are combined into a single Overall Feasibility Score (0-100) that determines your project's risk category:

- **0-25: LOW RISK** (Green) – "Very Small and Simple" to "Medium with Some Complexity"
  - Highly feasible with manageable complexity
  - Proceed with standard project management practices
  - Expected success rate is high

- **26-50: MEDIUM RISK** (Yellow) – "Large with Moderate Complexity" to "Complex but Manageable"
  - Moderate feasibility requiring careful planning
  - Enhanced monitoring and stakeholder communication needed
  - Success likely with proper risk management

- **51-75: HIGH RISK** (Orange) – "Significant Complexity" to "Very Large and Complex"
  - Significant feasibility challenges present
  - Consider phased approach or scope reassessment
  - Requires executive sponsorship and dedicated risk resources

- **76-100: CRITICAL RISK** (Red) – "Highly Complex and Risky" to "Extremely Complex and Risky"
  - Extremely challenging feasibility
  - Recommend reconsidering or significant scope reduction
  - If proceeding, consider proof-of-concept or pilot first

### **What Higher Scores Mean**

**Important:** Higher scores indicate higher risk and lower feasibility. A project scoring 85 is significantly riskier than a project scoring 35. Don't confuse this with a "grade" where higher is better—in risk assessment, lower scores are more favorable.

---

## How to Launch an Assessment

### **Step 1: Navigate to Your Project**

Open your Costbars Project Pipeline view and locate the project you want to assess.

### **Step 2: Open the Assessment Tool**

Click the actions menu for your project and select **"Project Assessment"** (or the assessment icon, depending on your interface configuration). The Project Assessment Tool modal will open.

### **Step 3: Review the Project Assessment Guide**

At the top of the assessment form, you'll see a collapsible **"Project Assessment Guide"** section (green header). Click it to expand helpful context about:

- The purpose of the assessment
- Quick start tips
- How to approach each section honestly
- What to do with your results

### **Step 4: Verify Project Information**

Confirm the project details shown at the top:
- **Project Name** – The project you're assessing
- **tbID** – Your project's unique identifier
- **Type/Sub-Type** – Project classification
- **Duration** – Calculated project duration in months

---

## Completing Each Section

The assessment form is organized into logical sections. For each question, select the option that most accurately reflects your current project reality—not what you hope will be true, but what you know today.

### **Section 1: Technology Assessment**

This section evaluates technical risk factors.

#### **Technology Maturity**
*"How mature and proven is the core technology?"*

**What to consider:**
- Has this technology been used successfully in production environments?
- Are there established best practices and vendor support?
- Is the technology cutting-edge or bleeding-edge?

**Scoring guidance:**
- **Well-established and mature** – Choose this if you're using proven, widely-adopted technology with years of production use (e.g., standard relational databases, established web frameworks)
- **Mature but evolving** – Technology has been around but is still adding major features or undergoing significant updates
- **Relatively new but tested** – Technology has production users but limited track record (e.g., framework that's 2-3 years old)
- **Emerging/early adoption** – Very few production implementations, mostly early adopters
- **Cutting-edge/unproven** – Brand new technology, experimental, or still in beta

**Why it matters:** Unproven technology increases technical risk exponentially. You may encounter undocumented bugs, lack of community knowledge, and limited vendor support.

#### **Team Technical Expertise**
*"Does your team have experience with this technology stack?"*

**What to consider:**
- How many team members have hands-on production experience?
- Have they built similar systems before, or will they be learning?
- Is this a completely new technology area for your organization?

**Scoring guidance:**
- **Extensive expertise** – Multiple team members have 2+ years production experience
- **Solid understanding** – Team has worked with similar technologies and can adapt
- **Some experience** – 1-2 team members have experience, others will learn
- **Limited knowledge** – No one has significant experience, but fundamentals are understood
- **Learning on the job** – Completely new to everyone, requires extensive training

**Why it matters:** Even mature technology becomes risky when your team lacks experience. Learning curves delay projects and increase the probability of architectural mistakes.

#### **System Architecture Complexity**
*"How complex is the technical architecture?"*

**What to consider:**
- How many moving parts does the system have?
- Are you building microservices, monoliths, or distributed systems?
- How many different technologies need to work together?

**Scoring guidance:**
- **Simple/straightforward** – Single application, minimal components
- **Moderate complexity** – A few integrated components with clear boundaries
- **Multiple interconnected systems** – Several systems that need to coordinate
- **Complex distributed architecture** – Microservices, event-driven, multiple data stores
- **Highly complex/novel** – Cutting-edge architecture patterns, complex state management

**Why it matters:** Architectural complexity multiplies integration points, increases debugging difficulty, and makes changes ripple across systems.

#### **Integration Requirements**
*"How many systems will this project need to integrate with?"*

**What to consider:**
- Count both internal systems and external third-party services
- Include APIs, databases, authentication systems, and data pipelines
- Consider real-time vs. batch integrations

**Scoring guidance:**
- **None or 1-2** – Standalone or minimal integrations
- **3-5 integrations** – Multiple but manageable
- **6-10 integrations** – Significant integration effort required
- **11-15 integrations** – Complex integration landscape
- **More than 15** – Extremely complex integration requirements

**Why it matters:** Each integration point is a potential failure point. Testing complexity grows exponentially with integration count, and coordinating across teams becomes a project management challenge.

### **Section 2: Team & Resources Assessment**

This section evaluates whether you have the right people and resources.

#### **Project Team Size**
*"How many people will actively work on this project?"*

**What to consider:**
- Count everyone who will contribute significant effort (developers, designers, analysts, etc.)
- Don't count occasional reviewers or advisors
- Consider both full-time and part-time contributors

**Scoring guidance:**
- **1-3 people** – Small, agile team
- **4-7 people** – Medium team size
- **8-15 people** – Large team requiring coordination
- **16-30 people** – Very large team with management overhead
- **More than 30** – Extremely large team, high coordination complexity

**Why it matters:** Larger teams require more communication, coordination meetings, and management overhead. Brooks' Law suggests that "adding people to a late project makes it later" due to communication complexity.

#### **Decision-Maker/Stakeholder Count**
*"How many people have decision-making authority or significant input?"*

**What to consider:**
- Include everyone who can veto decisions or require design changes
- Count executive sponsors, product owners, compliance officers, etc.
- Include external stakeholders like regulators or partners

**Scoring guidance:**
- **1-2 stakeholders** – Clear decision-making authority
- **3-5 stakeholders** – Manageable stakeholder group
- **6-10 stakeholders** – Requires active stakeholder management
- **11-20 stakeholders** – Complex stakeholder ecosystem
- **More than 20** – Extremely complex stakeholder coordination

**Why it matters:** More stakeholders means more opinions, longer approval cycles, and higher probability of conflicting requirements. This increases political risk dramatically.

#### **Resource Availability**
*"How certain are you that resources will be available when needed?"*

**What to consider:**
- Are team members dedicated to this project or splitting time?
- Do you have confirmed budget approvals?
- Are there competing priorities that could pull people away?

**Scoring guidance:**
- **Fully committed and secured** – Dedicated team, approved budget, no conflicts
- **Generally available** – Resources committed but some flexibility needed
- **Partially available** – Significant time-sharing with other projects
- **Uncertain/competing priorities** – Resources are in high demand across projects
- **Highly uncertain** – No confirmed commitments, speculative team

**Why it matters:** Resource uncertainty creates schedule risk. Projects with part-time team members take 2-3x longer than projects with dedicated resources due to context-switching and coordination delays.

### **Section 3: Organizational & Political Factors**

This section assesses "soft" factors that often determine project success.

#### **Organizational Change Impact**
*"How much organizational change will this project require?"*

**What to consider:**
- Will people need to change how they work?
- Are you replacing existing systems that people are comfortable with?
- Does this affect organizational structure or reporting lines?

**Scoring guidance:**
- **Minimal/none** – Small improvement to existing processes
- **Some process adjustments** – Minor workflow changes
- **Moderate change** – Significant process changes, training required
- **Significant organizational change** – Major shifts in how work gets done
- **Transformational change** – Fundamental changes to business model or culture

**Why it matters:** Resistance to change is a leading cause of project failure. The more you disrupt existing workflows, the more change management effort is required.

#### **Executive/Sponsor Commitment**
*"How committed is executive leadership to this project?"*

**What to consider:**
- Is there an active executive sponsor who attends meetings?
- Has leadership allocated appropriate budget and resources?
- Is this a strategic priority or a nice-to-have?

**Scoring guidance:**
- **Strongly committed and visible** – Active sponsor, clear priority, visible support
- **Committed and supportive** – Sponsor engaged, project prioritized
- **Neutral/passive support** – Approved but not actively championed
- **Lukewarm interest** – Approved reluctantly, could be deprioritized
- **Minimal/unclear** – No clear sponsor, questionable Comittment

**Why it matters:** Projects without executive air cover stall when they hit obstacles. Strong sponsorship unblocks resources, resolves cross-functional conflicts, and protects the project during budget reviews.

#### **Stakeholder Alignment**
*"How aligned are stakeholders on project goals and approach?"*

**What to consider:**
- Do stakeholders agree on what success looks like?
- Are there competing visions for the project?
- Have major conflicts been resolved or are they still simmering?

**Scoring guidance:**
- **Fully aligned** – Clear shared vision, no significant disagreements
- **Mostly aligned** – General agreement with minor differences
- **Some disagreement** – Different priorities but willing to compromise
- **Significant conflicts** – Major unresolved disagreements
- **Highly conflicted** – Fundamental disagreements about goals or approach

**Why it matters:** Misaligned stakeholders create project whiplash—constant direction changes, rework, and scope creep as different factions push their agendas.

### **Section 4: External Factors & Constraints**

This section evaluates factors outside your direct control.

#### **Regulatory/Compliance Requirements**
*"What regulatory or compliance requirements apply?"*

**What to consider:**
- Are there industry regulations (HIPAA, GDPR, SOX, etc.)?
- Do you need government approvals or certifications?
- Are there internal security/compliance requirements?

**Scoring guidance:**
- **None or minimal** – No significant regulatory requirements
- **Standard compliance** – Well-understood requirements, established processes
- **Moderate regulatory oversight** – Multiple requirements, some coordination needed
- **Significant regulatory burden** – Complex requirements, extensive documentation
- **Extensive and complex** – Heavy regulatory scrutiny, potential for delays

**Why it matters:** Regulatory requirements add time, cost, and risk. They often involve external parties (auditors, regulators) whose timelines you can't control.

#### **External Dependencies**
*"How dependent is success on external parties?"*

**What to consider:**
- Are you waiting on vendor deliveries or third-party integrations?
- Do you need approvals from partners or customers?
- Are external market conditions critical to success?

**Scoring guidance:**
- **Fully self-contained** – Everything needed is under your control
- **Minor external dependencies** – A few external factors, manageable
- **Moderate dependencies** – Success requires coordination with external parties
- **Significant external factors** – Heavy reliance on third parties
- **Critical external dependencies** – Success completely dependent on external parties

**Why it matters:** External dependencies introduce schedule risk you can't control. Vendor delays, partner priorities, or market timing can derail projects regardless of your team's execution.

#### **Organizational Experience**
*"Has your organization done something like this before?"*

**What to consider:**
- Have you delivered similar projects successfully?
- Is this a completely new type of initiative?
- Do you have established playbooks and processes?

**Scoring guidance:**
- **Highly experienced** – Done this many times, established processes
- **Experienced** – Several similar projects completed successfully
- **Some experience** – Attempted similar projects with mixed results
- **Limited experience** – Different from anything attempted recently
- **No experience** – Completely new territory for the organization

**Why it matters:** Organizations learn from experience. Your first e-commerce platform, first AI project, or first global rollout will encounter unknown challenges that experienced teams anticipate and mitigate.

#### **Market/Timing Sensitivity**
*"How time-sensitive is this project?"*

**What to consider:**
- Is there a narrow market window?
- Are competitors launching similar offerings?
- Are there regulatory deadlines or contractual commitments?

**Scoring guidance:**
- **Not time-sensitive** – Flexible timeline, no urgency
- **Moderate timing preference** – Better sooner but not critical
- **Important timing** – Significant advantage to hitting target date
- **Critical timing** – Missing deadline has major consequences
- **Extremely time-sensitive** – Narrow window, delay means failure

**Why it matters:** Time pressure increases risk by forcing shortcuts, reducing testing time, and preventing proper risk mitigation. Critical deadlines eliminate flexibility to address unexpected problems.

### **Section 5: Project Scope & Scale**

This section quantifies the magnitude of your project.

#### **Project Duration**
*This is automatically calculated based on your project's start and finish dates.*

**What it measures:**
- Projects under 3 months are lower risk from a schedule management perspective
- Projects over 12 months face higher risk due to:
  - Team turnover during the project
  - Technology and market changes
  - Requirement drift over time
  - Sustained momentum and stakeholder engagement

**Why it matters:** Longer projects have more opportunities to go wrong. Requirements change, people leave, priorities shift, and technologies evolve.

#### **Budget Magnitude**
*"What is the total project budget?"*

**What to consider:**
- Include all costs: labor, software, hardware, consulting, training
- Consider fully-loaded costs including overhead
- Don't just count incremental expenses

**Scoring guidance:**
- **Under $50K** – Small investment, low financial risk
- **$50K-$250K** – Moderate investment
- **$250K-$1M** – Significant investment, requires careful management
- **$1M-$5M** – Major investment, executive visibility
- **Over $5M** – Strategic investment, board-level visibility

**Why it matters:** Larger budgets increase visibility and scrutiny, but also provide more resources to address problems. They also increase the consequence of failure.

---

## Interpreting Your Results

### **After You Click "Calculate Scores"**

Once you complete all sections and click **"Calculate Scores"**, the tool processes your inputs and displays:

1. **Overall Feasibility Score** – The central risk score (0-100) with color-coded risk level
2. **Four Component Scores** – Individual scores for Technical Risk, Political Risk, Size, and Complexity
3. **Risk Level Badge** – Visual indicator (Green/Yellow/Orange/Red) showing your risk category
4. **Tailored Recommendations** – Specific guidance based on your project's risk profile

### **Understanding Component Scores**

Look at which components are driving your overall score:

**If Technical Risk is highest:**
- Your challenges are primarily about technology execution
- Consider technical prototypes or proof-of-concept phases
- Allocate more time for R&D and technical validation
- Ensure you have the right technical expertise on the team

**If Political Risk is highest:**
- Your challenges are about people, alignment, and organizational dynamics
- Invest heavily in stakeholder management and communication
- Ensure strong executive sponsorship
- Create clear decision-making frameworks upfront

**If Size Score is highest:**
- Your challenges are about project management and coordination
- Consider phased delivery to reduce team size and duration
- Implement robust project management practices
- Plan for extensive communication and coordination

**If Complexity Score is highest:**
- Your challenges are about external factors and unknowns
- Plan for contingencies and longer timelines
- Engage experts early (regulatory, integration, etc.)
- Build in flexibility to adapt as you learn

### **Using the Recommendations**

The tool generates specific recommendations based on your scores. Common recommendations include:

- **For projects with high technical risk:** Allocate extra time for R&D and consider technical pilots
- **For projects with high political risk:** Ensure strong executive sponsorship and stakeholder alignment
- **For large projects:** Consider phased approach and robust project management
- **For complex projects:** Plan for extensive integration testing and coordination
- **For cutting-edge technology:** Establish innovation labs and prototype early
- **For large teams:** Implement robust communication protocols and team coordination
- **For complex integrations:** Plan extensive testing phases and fallback strategies
- **For significant regulatory requirements:** Engage compliance experts from project start

### **Risk Level Interpretation**

**LOW RISK (0-25) – GREEN**
- **What it means:** Straightforward project with manageable complexity
- **Typical action:** Approve with standard project management practices
- **Watch for:** Don't become complacent—even "easy" projects need proper execution

**MEDIUM RISK (26-50) – YELLOW**
- **What it means:** Feasible but requires careful attention to risk factors
- **Typical action:** Approve with enhanced monitoring and risk mitigation plans
- **Watch for:** Specific component scores that are elevated—address those areas specifically

**HIGH RISK (51-75) – ORANGE**
- **What it means:** Significant challenges that could jeopardize success
- **Typical action:** Consider scope reduction, phasing, or additional resources before approval
- **Watch for:** Whether you have the organizational appetite for this level of risk

**CRITICAL RISK (76-100) – RED**
- **What it means:** Extreme challenges with low probability of success as scoped
- **Typical action:** Seriously reconsider; if proceeding, start with proof-of-concept
- **Watch for:** Pressure to proceed anyway due to political factors—resist if possible

---

## What to Do With Your Assessment

### **For Portfolio Managers**

**Document the Decision**
- Save the assessment as part of your project intake documentation
- Reference scores when explaining portfolio decisions to stakeholders
- Use assessments to justify resource allocation recommendations

**Balance Your Portfolio**
- Track the risk distribution across your entire portfolio
- Avoid concentrating too many high-risk projects simultaneously
- Balance high-risk/high-reward projects with safer initiatives

**Set Monitoring Thresholds**
- Configure executive alerts based on assessment scores
- Schedule more frequent reviews for higher-risk projects
- Establish early warning indicators tied to the risk dimensions

**Compare Projects**
- Use assessment scores to rank competing projects for resource allocation
- Consider both strategic value AND feasibility when prioritizing
- Identify projects that may need descoping to reduce risk scores

### **For Project Managers**

**Create Your Risk Management Plan**
- Focus mitigation efforts on the highest-scoring risk dimensions
- Identify specific actions to address each elevated component
- Build contingency plans for the highest-risk areas

**Negotiate for Resources**
- Use assessment scores as evidence when requesting additional time or budget
- Show stakeholders why complex projects need more resources
- Push back on unrealistic timelines with objective risk data

**Communicate with Stakeholders**
- Share assessment results with your team and sponsors
- Ensure everyone understands the project's complexity
- Use scores to set realistic expectations about challenges ahead

**Plan for Phases**
- If your score is high, propose a phased approach
- Start with proof-of-concept or pilot to de-risk before full investment
- Use early phases to validate assumptions and reduce uncertainty

### **For Executive Sponsors**

**Make Informed Investment Decisions**
- Consider both strategic value and feasibility when approving projects
- Understand what level of risk your organization can handle
- Don't approve projects where scores exceed your risk tolerance

**Allocate Sponsorship Time Appropriately**
- High-risk projects need more executive attention and intervention
- Plan to spend more time removing blockers for complex projects
- Schedule regular check-ins proportional to risk level

**Set Portfolio Risk Limits**
- Establish acceptable thresholds for aggregate portfolio risk
- Limit the number of critical-risk projects running simultaneously
- Ensure your organization has capacity to handle high-risk projects

---

## Best Practices

### **Be Brutally Honest**

The assessment is only as valuable as the honesty of your inputs. Don't let optimism bias or political pressure cause you to underestimate risk factors.

**Common honesty pitfalls:**
- "The team will learn quickly" (underestimating expertise gaps)
- "Stakeholders will align once we start" (ignoring current conflicts)
- "The technology should work fine" (hoping unproven tech magically succeeds)
- "We can probably get it done in 6 months" (ignoring historical data)

**Instead, be realistic:**
- "The team has never used this technology in production"
- "Stakeholders currently have conflicting requirements"
- "This technology has limited production track record"
- "Similar projects at our organization took 12-18 months"

### **Complete Assessments Early**

Don't wait until you've already committed resources. The assessment is most valuable **before** you approve the project, not after you're already underway.

**Ideal timing:**
- During initial project proposal evaluation
- Before portfolio review meetings
- When comparing multiple project proposals
- Before making final go/no-go decisions

### **Involve Multiple Perspectives**

Have several people complete the assessment independently, then compare and discuss differences. Different stakeholders often see different risk factors.

**Who should provide input:**
- Technical leads (for technology and architecture questions)
- Business owners (for stakeholder and organizational questions)
- Project managers (for resource and schedule questions)
- Compliance/legal (for regulatory questions)

### **Reassess Periodically**

Risk profiles change as projects progress. Reassess at major milestones:

- After requirements are finalized
- When technology choices are locked in
- If key team members leave or join
- When major scope changes are proposed
- At phase-gate reviews

### **Don't Ignore Critical Risk Scores**

If your project scores in the critical risk range (76-100), take it seriously. These scores indicate a very high probability of failure or major overruns.

**Your options:**
1. **Descope significantly** – Remove the highest-risk components to reduce score
2. **Start with a pilot** – Prove feasibility on a smaller scale first
3. **Wait for conditions to improve** – Delay until technology matures or expertise is acquired
4. **Accept the risk consciously** – Proceed knowing this is a high-risk bet

What you shouldn't do: Ignore the score and hope for the best.

### **Use Scores in Context**

Assessment scores don't make decisions for you—they inform your decision-making. A high-risk project might still be worth pursuing if:

- The strategic value is extraordinarily high
- You have no alternative path to achieve the goal
- You're willing to invest heavily in risk mitigation
- Failure wouldn't be catastrophic to the organization

Conversely, a low-risk project might not be worth doing if:

- The strategic value is minimal
- Opportunity cost is high (you'd have to pass on better projects)
- Even "easy" execution doesn't justify the benefit

### **Document Your Assumptions**

When completing the assessment, note any assumptions or uncertainties. This helps when reassessing later or explaining your reasoning.

**Example notes to capture:**
- "Assumed vendor delivers API on time (high uncertainty)"
- "Stakeholder count based on initial discussions, may increase"
- "Technology choice not final, could change to more mature option"
- "Resource availability depends on Project X completing on schedule"

### **Share Results Broadly**

Don't keep assessment results in a drawer. Share them with:

- Your project team (so they understand the challenges)
- Executive sponsors (so they know what they're signing up for)
- Other stakeholders (to set realistic expectations)
- Portfolio reviewers (to support portfolio decisions)

Transparency about risk builds trust and alignment.

---

## Conclusion

The Project Assessment Tool transforms subjective project evaluation into objective, data-driven analysis. By systematically evaluating technical, political, size, and complexity dimensions, you gain clear visibility into project feasibility before committing resources.

Remember: The goal isn't to only approve low-risk projects. Organizations need to take calculated risks to achieve strategic objectives. The goal is to **know** what risks you're taking, **choose** which risks are worth taking, and **plan** appropriately for the risks you accept.

Use the assessment tool early and often. Complete honest evaluations. Share results broadly. Make informed decisions. And build a portfolio that balances ambition with achievability.

Your future self (and your organization) will thank you for the time invested in thorough project assessment.