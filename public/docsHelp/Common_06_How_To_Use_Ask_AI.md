![Timebars Logo](../tbimages/logos/timebars-ltd-logo-final.png)
---

# 🤖 How to Use Ask AI

## Table of Contents

1. [What "Ask AI" Is](#what-ask-ai-is)
2. [🚀 Getting Started: the "Get Started" L1 bar](#-getting-started-the-get-started-l1-bar)
3. [🖱️ The two things you click](#-the-two-things-you-click)
4. [🧭 What AI Creates at Each Level](#-what-ai-creates-at-each-level)
5. [🧩 Two kinds of staffing: Resource Plan vs. Assigning People](#-two-kinds-of-staffing-resource-plan-vs-assigning-people)
6. [📋 While the AI Works](#-while-the-ai-works)
7. [💡 Tips for Great Results](#-tips-for-great-results)
8. [🆘 The Ask AI Help Assistant](#-the-ask-ai-help-assistant)
9. [🐛 Troubleshooting](#-troubleshooting)

---

## What "Ask AI" Is

**Ask AI** is the assistant built into your product. It does two things for you:

1. **Creates your project data for you.** Instead of building Projects, Work Packages, Tasks, Milestones and resource Allocations by hand, you describe what you want in plain English and the AI builds the bars on your timeline — at whatever level of the hierarchy you are working in.
2. **Answers your questions.** The **Ask AI** button on the main menu opens a help chat that answers "how do I…" questions about using the app, based on the official documentation.

You do not need to know any technical field names or rules. You write the way a project manager, portfolio manager or engineer would talk, and the AI fills in the rest.

> Ask AI is powered by Google Gemini. After the AI finishes creating data, **refresh the page (press F5)** to see the new bars appear on the canvas.

---

## 🚀 Getting Started: the "Get Started" L1 bar

When you open a brand-new, empty canvas in **Timebars** or **Costbars**, the app automatically places one starter bar near the top for you:

> **L1 Get Started here using AI, click the L1 ID below**

This is your starting point — a top-level **Portfolio (L1)** that runs from today for about six months. You don't have to create anything first; just use it to launch the AI.

> **Agilebars note:** Agilebars uses a simpler two-level structure and does **not** create this starter bar. Agilebars users begin at the Project level (see the Agilebars guide).

---

## 🖱️ The two things you click

Everything in Ask AI starts from a bar on the canvas:

1. **Click the bar's ID** (the little ID label/circle on the bar). This opens that bar's **status pop-up form**.
2. On that form, click the **✨ sparkle icon** (the "Ask AI" button). This opens the **AI Create** dialog for that bar.

The AI Create dialog always knows **which bar you launched it from** — it shows the ID, name and level at the top — so anything it creates is placed correctly underneath that bar.

Some levels also have **named buttons** on the status form (for example **Resource Plan** or **Create Allocations**) that run a specific action directly. These are described below.

---

## 🧭 What AI Creates at Each Level

Think of your plan as a set of nested levels:

**Portfolio (L1) → Project (L2) → Work Package / Sub-Project (L3) → Task (L4) → Allocation (L5 — a person assigned to a task)**

You move down this ladder one step at a time. At each step you click the bar's ID, click the ✨ sparkle icon, and tell the AI what you want.

---

### 1️⃣ From a Portfolio (L1): create a Project

This is where most people begin, using the **Get Started** bar.

1. Click the **ID** of the Portfolio bar, then click the **✨ sparkle icon**.
2. In the big text box, describe the project. You can:
   - paste in a **Business Case** — formal (with headings) or rough — and the AI maps it into the Project Charter fields, or
   - simply type a **project name and a short description**, plus any background you have.
3. Optional tick-boxes:
   - **Fill in Project Charter fields with AI** — after the project is created, the AI also enriches its Project Charter fields (value proposition, benefits, success criteria, and so on).
   - **Create a Resource Plan** — the AI adds one **"Resource Plan"** task with **generic role placeholders** for the kinds of people the project will need (see *Resource Plan* below).
4. Click **Create**.

**Result:** one new **Project (L2)** appears under your Portfolio as a **New** initiative, with its Project Charter fields filled from your Business Case. Anything the AI cannot map to a specific field is preserved under headings in **Management Notes** (`tbMDNotes`) so nothing is lost.

> 💡 The more you tell it — scope, goals, timeline, budget, who is involved — the more specific and useful the result.

---

### 2️⃣ From a Project (L2): create Work Packages, Tasks and Milestones

1. Click the **ID** of the Project bar, then the **✨ sparkle icon**.
2. Describe how the project should be broken down (for example: *"Break this into a design phase, a build phase, and a testing phase"*). If you are not specific, the AI uses sensible project-management judgment.
3. Optional tick-box:
   - **Assign people to the Tasks (Human resources)** — after the Tasks are created, the AI also assigns the best-fit **real person** from your Resource Pool to each Task (see *Assigning people* below).
4. Click **Create**.

**Result:** new **Work Packages (Sub-Projects, L3)** are created under the Project, each containing the **Tasks (L4)** and **Milestones** needed.

**Also on the Project status form:** a **Resource Plan** button. Click it any time to generate the generic-role Resource Plan on demand (handy if you didn't tick the box when the project was first created).

---

### 3️⃣ From a Work Package / Sub-Project (L3): create Tasks and Milestones

1. Click the **ID** of the Work Package bar, then the **✨ sparkle icon**.
2. Describe the work in that package.
3. Optional tick-box:
   - **Create Allocations for the Tasks (assign people)** — the AI assigns a real person to each new Task.
4. Click **Create**.

**Result:** **Tasks (L4)** and **Milestones** are created under the Work Package (up to six tasks per package), optionally staffed with people.

**Also on the Work Package status form:** a **Create Allocations** button. Click it to staff the Work Package's **existing** Tasks with people — useful when you created the tasks earlier without ticking the "assign people" box. (If the Work Package has no tasks yet, the assistant will tell you to create tasks first.)

---

### 4️⃣ From a Task (L4): assign people to it

1. Click the **ID** of the Task bar, then the **✨ sparkle icon**.
2. Describe the roles you need in plain words, for example:
   - *"Add a developer and a tester"*
   - *"I need a business analyst and a project manager"*
3. Click **Create**.

**Result:** the AI finds the matching people in your Resource Pool and adds them as **Allocations (L5)** under the Task. If you ask for "a developer," it includes every matching role (for example *Senior Developer* and *Web Developer*), one allocation each. New allocations always appear neatly **below the task**, so they are easy to see.

---

## 🧩 Two kinds of staffing: Resource Plan vs. Assigning People

It helps to know the difference between the two ways AI adds resources:

| | **Resource Plan** | **Assign People / Create Allocations** |
|---|---|---|
| **What it adds** | Generic **role placeholders** (e.g. "Project Manager", "R&D") | **Real, named people** from your Resource Pool |
| **Answers** | *What kinds of people will this project need?* | *Who specifically will do this work?* |
| **Where** | Portfolio "Create a Resource Plan" tick-box, or the **Resource Plan** button on a Project | "Assign people" tick-box at Project/Work Package level, the **Create Allocations** button, or the ✨ button on a Task |
| **Used when** | Early planning, before you know exact names | Detailed planning, staffing the actual work |

**Resource Plan** is for early estimating — it judges which roles the project needs and, if it is unsure, always includes a Project Manager and an R&D role. It never assigns specific named people.

**Assigning People** picks the best **named person** for each task by matching the task to each person's **role and skill**, and it checks that the person is not already over-committed. It keeps people sensibly loaded and will not pile work onto someone who is already very busy. If no suitable person is free, it drops in a generic role placeholder instead, so the task is never left empty without telling you.

### 🎛️ You control which roles a Resource Plan can use

A Resource Plan does not see your whole Generic resource list. It only sees
Generic resources whose **Quantity is greater than zero**.

That gives you a simple lever. Roles that exist for reporting or org structure
rather than for doing the work — governance boards, steering committees,
management overhead — should be set to **Quantity 0** in the Shared Resource
Pool. They stay in the pool and stay reportable, but the AI will never propose
them as allocations.

| Quantity | Effect |
|---|---|
| **Greater than 0** | The role is real capacity — the AI can plan with it, and it counts towards supply in the Supply and Demand grids |
| **0** | The role is invisible to planning — never proposed, never counted as capacity |

Two things follow from this, and they are the usual surprises:

- **The AI keeps proposing managers you did not want.** Do not rewrite the
  prompt — set those roles to Quantity 0 and generate again
- **A role you expected never appears.** It is almost certainly sitting at
  Quantity 0. Give it a quantity and it becomes available

Keeping the quantities honest is the resource pool manager's job, and it is the
single highest-value thing you can do for the quality of AI resource plans.

---

## 📋 While the AI Works

When you click **Create**, the dialog shows a **running progress log** — gathering context, calling the AI, creating each row — and finishes with a short **summary** of what was created (and a note of anything it adjusted or skipped). If a step has a problem, it is clearly flagged, and any work that did succeed is kept.

When it is done, **refresh the page (F5)** to see the new bars on your timeline.

---

## 💡 Tips for Great Results

✅ **Do:**
- Give the AI real context — paste a Business Case, scope notes, or a solid description.
- Mention timelines, budgets, key phases, and who is involved when you know them.
- Work **top-down**: create the Project first, then break it into Work Packages and Tasks, then assign people.
- Keep a healthy **Resource Pool** (named people with roles, skills, rates and availability) so staffing has good people to choose from.

❌ **Avoid:**
- One-word requests like *"make a project"* — you'll get a generic result.
- Expecting people to be assigned if your Resource Pool is empty — add resources first.

---

## 🆘 The Ask AI Help Assistant

The **Ask AI** button on the main menu (and on the canvas toolbar) opens the **Help Assistant** — a chat window where you can ask questions about how to use the app, such as *"How do I create a baseline?"* or *"How do resource charts work?"*. It answers from the official product documentation for your edition (Agilebars, Timebars or Costbars).

- Type your question and press **Ask** (or press Enter).
- Use **Clear** to start a fresh conversation.
- Click the **×** to close it.

---

## 🐛 Troubleshooting

**"I clicked Create but nothing appears on the canvas."**
Refresh the page (F5). New bars show after a reload.

**"No people were assigned to my tasks."**
Your Resource Pool may have no suitable **named (Human) resources**. Add people with roles and skills, then use the **Create Allocations** button on the Work Package, or the ✨ button on a Task.

**"The tasks don't quite match what I wanted."**
Give more detail — name the phases, deliverables or roles you expect — and try again on the same bar.

**"I don't see the Get Started bar."**
It only appears on an **empty** Timebars or Costbars canvas (when there are no Portfolios yet). Agilebars does not use it. If you already have bars, just use the ✨ button on any existing bar.

---

**Ready to build your plan? Click an ID, click the ✨ sparkle, and tell the AI what you need.** 🚀
