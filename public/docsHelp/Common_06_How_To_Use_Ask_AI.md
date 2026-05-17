# How To Use Ask AI  - Common Across Products
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)

## Table of Contents

- [What This Feature Does](#what-this-feature-does)
- [🚀 Quick Start](#-quick-start)
- [📝 How to Write Effective Requests](#-how-to-write-effective-requests)
- [🎯 Advanced Features](#-advanced-features)
- [📋 What AI Automatically Generates](#-what-ai-automatically-generates)
- [💡 Tips for Best Results](#-tips-for-best-results)
- [🎨 Example Scenarios](#-example-scenarios)
- [🔧 Understanding Defaults](#-understanding-defaults)
- [📊 Content Quality Scale](#-content-quality-scale)
- [⚡ Tips for Complex Projects](#-tips-for-complex-projects)
- [🐛 Troubleshooting](#-troubleshooting)
- [✨ Best Practices Summary](#-best-practices-summary)
- [🎓 Example Progression](#-example-progression)
- [🆘 Need Help?](#-need-help)

---

## What This Feature Does

The AI Project Generator transforms your natural language descriptions into complete project structures with tasks, milestones, and risks. Simply describe what you want, and AI will create a fully-structured project ready to use in your PPM system.

---

## 🚀 Quick Start

### Basic Usage

Just type what you want in the input box and press submit:

```
Create a project called Website Redesign
```

**Result:** AI creates:
- 1 project named "Website Redesign"
- 5 tasks (default)
- 2 milestones (default)
- 3 risks (default)
- Rich descriptions, objectives, and benefits

---

## 📝 How to Write Effective Requests

### 1. **Simple Project Creation**

**Minimal Input:**
```
Create a project: Mobile App Development
```

**What AI Does:**
- Creates project with default quantities (5 tasks, 2 milestones, 3 risks)
- Generates meaningful task names based on the project type
- Writes 1-3 paragraph descriptions for each section
- Sets dates starting next month

---

### 2. **Override Default Quantities**

**Specify Your Own Numbers:**
```
Create a project called Cloud Migration with 10 tasks, 4 milestones, and 5 risks
```

**What AI Does:**
- Creates exactly 10 tasks, 4 milestones, 5 risks
- Names them appropriately for a cloud migration
- Generates detailed content

---

### 3. **Provide Context for Better Results**

**Rich Description:**
```
Create a project to upgrade all Ubuntu servers from version 20.04 to 22.04 LTS. 
We have 50 production servers and 30 development servers. 
The project should include testing phases, backup procedures, and rollback plans.
Create 8 tasks, 3 milestones, and 4 risks.
```

**What AI Does:**
- Creates highly specific, contextual tasks like:
  - "Backup all production server configurations"
  - "Test upgrade on development environment"
  - "Execute rolling upgrade on production servers"
- Writes detailed descriptions mentioning Ubuntu versions, server counts
- Identifies relevant risks like "Rollback complexity" or "Service downtime"

**💡 Rule:** More context = more relevant, specific content

---

## 🎯 Advanced Features

### Project Positioning

**Control Where the Project Appears:**

```
Create a project called Q1 Planning placed 400 pixels from the top
```

```
Place the new project one-third down the page
```

**Default:** Projects appear at 300 pixels from top if not specified

---

### Date Control

**Specify Timeline:**
```
Create a project starting in March 2025 and finishing in August 2025
```

```
Create a 3-month project beginning next quarter
```

**Default:** Starts 1 month from today, ends ~6 months later

---

### Task Details

**Be Specific About Work:**
```
Create a product launch project with these phases:
- Design and prototyping (2 months)
- Development and testing (3 months)  
- Marketing preparation (1 month)
- Launch execution (2 weeks)

Create 12 tasks and 5 milestones.
```

---

## 📋 What AI Automatically Generates

For every project, AI creates:

### Rich Metadata Fields

| Field | Content | Length |
|-------|---------|--------|
| **Description** | Detailed overview of the work, scope, and deliverables | 1-3 paragraphs |
| **Executive Summary** | High-level overview for stakeholders | 1-3 paragraphs |
| **Objectives & Scope** | Goals, boundaries, and success criteria | 1-3 paragraphs |
| **Expected Benefits** | Business value, ROI, and outcomes | 1-3 paragraphs |

**More context in your input = more detailed, relevant content**

### Intelligent Naming

**Tasks:**
- ✅ "Upgrade production database servers"
- ❌ "Task 1"

**Milestones:**
- ✅ "All servers upgraded and validated"
- ❌ "Milestone Complete"

**Risks:**
- ✅ "Legacy application compatibility issues"
- ❌ "Risk 1"

---

## 💡 Tips for Best Results

### ✅ DO:

1. **Be specific about your domain:**
   ```
   Create a healthcare compliance project for HIPAA certification
   ```

2. **Mention key phases or stages:**
   ```
   Include discovery, design, development, testing, and deployment phases
   ```

3. **State numbers if you need specific quantities:**
   ```
   Create 15 tasks, 6 milestones, and 8 risks
   ```

4. **Provide context about scale:**
   ```
   This affects 200 employees across 5 departments
   ```

5. **Mention important constraints:**
   ```
   Must complete before end of Q2, budget is $150K
   ```

### ❌ DON'T:

1. **Be too vague:**
   ```
   Create a project
   ```
   (AI will use defaults, but content will be generic)

2. **Use unclear terminology:**
   ```
   Make some stuff for the thing
   ```

3. **Forget to mention quantity overrides:**
   (You'll get 5 tasks, 2 milestones, 3 risks by default)

---

## 🎨 Example Scenarios

### Scenario 1: Software Development

**Input:**
```
Create an API development project for our new customer portal. 
We need to build RESTful endpoints, implement OAuth2 authentication, 
integrate with our legacy database, and create comprehensive API documentation.
The project should span 4 months starting in February 2025.
Create 10 tasks, 4 milestones, and 3 risks.
```

**AI Creates:**
- Project: "API Development - Customer Portal"
- 10 specific tasks (e.g., "Design RESTful API architecture", "Implement OAuth2 authentication flow")
- 4 milestones (e.g., "Authentication module complete", "All endpoints tested")
- 3 risks (e.g., "Legacy database schema incompatibility")
- Rich descriptions mentioning OAuth2, REST, portal integration

---

### Scenario 2: Infrastructure Upgrade

**Input:**
```
Upgrade our data center network infrastructure. Replace aging switches, 
upgrade firewall firmware, implement new monitoring tools, and migrate to 
10Gb network backbone. 8 tasks, 3 milestones, 5 risks.
```

**AI Creates:**
- Project: "Data Center Network Infrastructure Upgrade"
- 8 tasks covering switch replacement, firmware updates, monitoring, migration
- 3 milestones marking major completion points
- 5 risks including downtime, compatibility, budget overruns
- Technical descriptions with network terminology

---

### Scenario 3: Business Process Improvement

**Input:**
```
Create a project to streamline our invoice approval workflow. 
Currently takes 10 days, goal is 3 days. Involves finance, purchasing, 
and operations departments. Need workflow mapping, system configuration, 
training, and rollout phases. 12 tasks, 5 milestones, 4 risks.
```

**AI Creates:**
- Project: "Invoice Approval Workflow Optimization"
- 12 tasks across mapping, configuration, training, rollout
- 5 milestones for each major phase completion
- 4 risks like resistance to change, system integration issues
- Business-focused descriptions mentioning efficiency gains, stakeholders

---

### Scenario 4: Marketing Campaign

**Input:**
```
Q3 product launch campaign for our new SaaS platform. 
Includes content creation, social media strategy, email campaigns, 
webinar series, and paid advertising. 6-week timeline. 
10 tasks, 4 milestones, 3 risks.
```

**AI Creates:**
- Project: "Q3 SaaS Platform Launch Campaign"
- 10 marketing-specific tasks
- 4 milestones for campaign phases
- 3 risks (budget overrun, low engagement, timeline delays)
- Marketing-focused descriptions with ROI, target audience, channels

---

## 🔧 Understanding Defaults

When you don't specify certain details, AI uses these defaults:

| Element | Default Value | How to Override |
|---------|---------------|-----------------|
| Tasks | 5 | "Create 10 tasks" |
| Milestones | 2 | "Create 6 milestones" |
| Risks | 3 | "Create 8 risks" |
| Start Date | 1 month from today | "Starting in March 2025" |
| End Date | ~6 months from start | "Finishing in 6 months" |
| Project Position | 300 pixels from top | "Place 400 pixels from top" |
| Content Detail | Moderate | Provide more context for richer content |

---

## 📊 Content Quality Scale

The amount of detail you provide directly affects the quality and specificity of AI-generated content:

### Minimal Input
```
Create a project: Server Upgrade
```
**AI Content:** Generic descriptions about server upgrades

---

### Moderate Input
```
Create a project to upgrade Ubuntu servers to version 22.04
```
**AI Content:** Mentions Ubuntu, version numbers, typical upgrade tasks

---

### Rich Input
```
Create a project to upgrade 80 Ubuntu servers (50 production, 30 dev) 
from 20.04 to 22.04 LTS. Must include backup procedures, testing phases, 
rollback plans, and monitoring setup. Timeline is 8 weeks starting April 2025.
Create 12 tasks, 5 milestones, and 6 risks.
```
**AI Content:** 
- Highly specific task names with server counts
- Detailed descriptions mentioning versions, environments, counts
- Risk assessment relevant to your specific scale
- Timeline-appropriate milestone placement

---

## ⚡ Tips for Complex Projects

### Break Down Large Initiatives

Instead of:
```
Create our entire digital transformation program
```

Try sequential projects:
```
Create Phase 1: Infrastructure Assessment and Planning project 
with 8 tasks, 3 milestones, 4 risks
```

Then later:
```
Create Phase 2: Cloud Migration Execution project...
```

### Use Hierarchical Thinking

AI understands project hierarchy:
- **Portfolio** → **Project** → **Sub-Project** → **Task** → **Allocation**

You can request:
```
Create a project with 3 sub-projects, each with 5 tasks
```

---

## 🐛 Troubleshooting

### "Timeout Error"

**Cause:** Very complex requests might take too long

**Solution:**
- Break into smaller projects
- Reduce task/milestone/risk counts
- Simplify the description slightly

### "Not Enough Detail in Descriptions"

**Cause:** Input too brief

**Solution:**
- Add more context about scope, stakeholders, technology
- Mention specific phases or activities
- Include scale information (how many, how long, how much)

### "Tasks Don't Match My Needs"

**Cause:** AI misunderstood domain or context

**Solution:**
- Be more explicit about the type of work
- List key phases or activities you expect
- Mention specific deliverables

---

## ✨ Best Practices Summary

1. **Start with project name and basic description**
2. **Specify quantities if not using defaults** (5 tasks, 2 milestones, 3 risks)
3. **Add context for richer, more relevant content**
4. **Mention timeline if important**
5. **Include stakeholders, technology, or domain details**
6. **Be specific about phases or major activities**
7. **State positioning if you care** (otherwise defaults to 300px)

---

## 🎓 Example Progression

See how adding detail improves results:

### Level 1: Basic
```
Create website project
```

### Level 2: Named + Quantities
```
Create a Website Redesign project with 8 tasks and 3 milestones
```

### Level 3: Contextual
```
Create a Website Redesign project for our e-commerce site. 
Need to update design, improve mobile experience, and add new payment options.
8 tasks, 3 milestones, 4 risks.
```

### Level 4: Comprehensive
```
Create a Website Redesign project for our e-commerce platform serving 10K daily users.
Scope includes:
- Modern responsive design with mobile-first approach
- Integration of Apple Pay and Google Pay
- Performance optimization (target: <2s page load)
- A/B testing framework setup
- SEO improvements
Timeline: 12 weeks starting March 2025
Create 12 tasks, 5 milestones, and 6 risks
Place the project 350 pixels from top
```

**The more detail you provide, the more valuable and actionable your project structure becomes!**

---

## 🆘 Need Help?

If you're not getting the results you expect:
1. Try adding more context to your description
2. Be explicit about numbers (tasks, milestones, risks)
3. Mention the domain or industry for better task naming
4. Break complex projects into phases
5. Review the examples above for inspiration

---

**Ready to create your first AI-generated project? Just type your request and let the AI do the heavy lifting!** 🚀