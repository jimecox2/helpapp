# Own the Code: AI-Assisted Content Management Workflow
![Timebars Logo](https://cdn.timebars.com/common/logos/timebars-ltd-logo-final.png)
This guide explains how to manage and update the marketing and help article content on the Timebars website using the workflow established by Timebars Ltd. It is written for developers and content owners who have acquired the source code and want to continue maintaining and evolving the site's content with the same tools and process used to build it.

The workflow combines Claude Code (AI-assisted editing), Git branching, VS Code with GitHub integration, pull requests for review, and a deliberate manual step before production — giving you full creative leverage without sacrificing control over the live site.

---

## Table of Contents
- [Own the Code: AI-Assisted Content Management Workflow](#own-the-code-ai-assisted-content-management-workflow)
  - [Table of Contents](#table-of-contents)
  - [How Content Is Organized](#how-content-is-organized)
    - [Marketing Articles (docsOther)](#marketing-articles-docsother)
    - [Help Articles (docsHelp)](#help-articles-docshelp)
    - [The Slug Registry](#the-slug-registry)
  - [The Content Management Workflow](#the-content-management-workflow)
    - [Step 1: Open a Claude Code Session](#step-1-open-a-claude-code-session)
    - [Step 2: Work on a Feature Branch](#step-2-work-on-a-feature-branch)
    - [Step 3: Edit or Create Content with Claude Code](#step-3-edit-or-create-content-with-claude-code)
    - [Step 4: Review in VS Code with GitHub Integration](#step-4-review-in-vs-code-with-github-integration)
    - [Step 5: Create a Pull Request](#step-5-create-a-pull-request)
    - [Step 6: Merge and Copy to Production Manually](#step-6-merge-and-copy-to-production-manually)
    - [Step 7: Sync to Strapi via the Admin Panel](#step-7-sync-to-strapi-via-the-admin-panel)
  - [The edit-docsother Skill](#the-edit-docsother-skill)
  - [Registering a New Article](#registering-a-new-article)
  - [Tips and Best Practices](#tips-and-best-practices)

---

## How Content Is Organized

The site has two content layers, stored as Markdown files in the `public/` directory and served through Strapi CMS. The files in `public/` are the **source of truth** — Strapi is populated from them, not the other way around.

### Marketing Articles (docsOther)

**Location:** `public/docsOther/`

These are buyer-facing articles: product feature pages, comparison guides, benefit explainers, FAQs, and blog posts. They are displayed in the `/articles/` and `/knowledgebase/` sections of the site. Filenames use lowercase kebab-case and the filename (without `.md`) is the Strapi slug.

Examples:
```
public/docsOther/common-functionality-across-all-products.md
public/docsOther/agilebars-specific-functionality.md
public/docsOther/costbars-specific-functionality.md
```

### Help Articles (docsHelp)

**Location:** `public/docsHelp/`

These are user-facing guides: product user guides, reference documents, and how-to articles. Filenames use PascalCase with underscores. The Strapi slug is the lowercase kebab-case equivalent of the filename without the extension.

Examples:
```
public/docsHelp/Agilebars_User_Guide.md
public/docsHelp/Common_07_Cloud_Publishing_Guide.md
public/docsHelp/Costbars_PPM_Project_Assessment_Tool.md
```

### The Slug Registry

Every article that appears in the Knowledge Base section must be registered in the slug registry at:

```
app/knowledgebase/page.jsx
```

This file contains arrays for each content category — `commonFiles`, `agilebarsFiles`, `timebarsFiles`, `costbarsFiles`, `marketingCommonFiles`, `marketingAgilebarsFiles`, `marketingTimebarsFiles`, `marketingCostbarsFiles`, and `marketingBlogFiles`. Each entry is an object with a `name` (display label) and `slug` (matches the Strapi slug):

```javascript
const marketingCostbarsFiles = [
  { name: 'Costbars Benefits and Features', slug: 'costbars-benefits-and-features' },
  { name: 'Costbars Specific Functionality', slug: 'costbars-specific-functionality' },
  // ...
]
```

When you create a new article, you add an entry here as part of the same commit. When you delete or rename one, you update or remove its entry here too.

---

## The Content Management Workflow

The full workflow from idea to published article has seven steps. Steps 1–5 happen in your development environment; steps 6–7 are the production deployment.

### Step 1: Open a Claude Code Session

Open the project in Claude Code — either the web app at [claude.ai/code](https://claude.ai/code) or the Claude Code CLI in your terminal. The project's `CLAUDE.md` file provides Claude with complete context about the codebase architecture, conventions, and content structure, so it understands the project immediately without needing a briefing.

For content work, the web app is often the most convenient: you can describe what you want written, review the output in conversation, iterate on tone and structure, and approve the final version before any file is touched.

### Step 2: Work on a Feature Branch

All content changes should be made on a dedicated feature branch, not directly on `main`. Claude Code will create the branch for you if you ask, or you can create it yourself:

```bash
git checkout -b content/update-costbars-features
```

Working on a branch means the `main` branch always reflects the last reviewed, approved content state. It also means you can have multiple content work streams in progress simultaneously — one branch for a marketing update, another for a new help article — without them interfering with each other.

### Step 3: Edit or Create Content with Claude Code

This is where Claude Code does the heavy lifting. Describe what you want — the topic, the audience (buyer vs. user), the source material to draw from, the level of detail — and Claude will draft the Markdown, edit an existing file, restructure a document, or fix a specific section.

For marketing articles, good prompts describe the business purpose: "Write a buyer-focused explainer for the Costbars PPM process, no step-by-step instructions, focus on the strategic value." For help articles, you can provide the technical content and ask Claude to turn it into clear user documentation with consistent structure.

Claude Code also handles the mechanical tasks: creating the file in the right location with the right filename, registering the slug in `page.jsx`, and writing a clear commit message. You review and approve each step.

**The `edit-docsother` skill** (see below) is a pre-configured context specifically for editing files in `public/docsOther/`. Invoke it with `/edit-docsother` in Claude Code to get the right conventions and link verification applied automatically.

### Step 4: Review in VS Code with GitHub Integration

Once Claude Code has made the changes and committed them to the feature branch, open VS Code. The GitHub integration (GitHub Pull Requests and Issues extension, or the built-in Source Control view) lets you:

- **Review the diff** for every changed file before it leaves your machine — seeing exactly what was added, removed, or restructured
- **Stage and unstage individual changes** if you want to split a batch of edits across multiple commits
- **Open a GitHub Pull Request** directly from VS Code without switching to the browser

This review step is where you read the content as a human, check the links, verify the tone is right for the audience, and catch anything that needs adjustment before it goes through the PR process.

### Step 5: Create a Pull Request

Push the feature branch and open a Pull Request against `main`. Claude Code creates draft PRs automatically when it pushes a branch; you can also create them from VS Code or the GitHub web interface.

The PR is your quality gate. It provides:
- A permanent record of what changed and why (the PR description captures the intent)
- A place to request review from a colleague or content approver before anything merges
- A diff view where reviewers can leave line-level comments
- CI checks (linting, build verification) that run automatically and catch any technical issues before merge

For solo content work you may self-review and merge quickly; for team content work the PR is where editorial review happens. Either way, nothing reaches `main` without passing through the PR.

### Step 6: Merge and Copy to Production Manually

Once the PR is approved and merged to `main`, the Markdown files are correct in the repository. The production deployment step is deliberately manual for the website content: rather than having a CI pipeline push directly to the live site, you copy the updated `.md` files to the production server yourself.

**Why manual?** Because the production Next.js build is a running Docker container that you do not want to restart automatically every time a content file changes. A manual copy lets you:
- Choose exactly when the new content goes live (e.g., not mid-day on a busy trading day)
- Copy only the specific files that changed, with no risk of an unintended full redeploy
- Verify the files landed correctly before syncing to Strapi
- Keep the production build stable and under your control at all times

The typical approach is to `scp` or `rsync` just the changed `.md` files to the corresponding directory on the production server, or to SSH in and `git pull` the `public/` directory from your repository if the server has a git checkout.

### Step 7: Sync to Strapi via the Admin Panel

Once the `.md` files are on the production server, the final step is syncing them into Strapi CMS so the Next.js frontend can serve them. Log into the site as an administrator and navigate to the `/sysadmin` route. This admin panel provides file-by-file sync controls that read each Markdown file, create or update the corresponding Strapi record, and make the content available to the frontend immediately — no server restart required.

Sync only the files you changed in this deployment. The sync is idempotent: running it again on an unchanged file has no effect, but syncing a file that did not change is a harmless no-op.

---

## The edit-docsother Skill

Claude Code supports **skills** — pre-configured instruction sets that give Claude the right context for a specific category of task. The `edit-docsother` skill is specifically for editing files in `public/docsOther/` and encodes the conventions for that content type:

- Buyer-focused language (not step-by-step user instructions)
- Correct link format for help articles: `https://www.timebars.com/knowledgebase/helparticles/{slug}`
- Correct link format for marketing articles: `https://www.timebars.com/articles/{slug}`
- Slug verification against `app/knowledgebase/page.jsx` before any link is written
- Consistent heading structure and Markdown formatting

Invoke it at the start of a marketing content session:

```
/edit-docsother
```

You do not need the skill for `docsHelp` files — those are technical user guides where step-by-step content is appropriate and the conventions are straightforward.

---

## Registering a New Article

When you create a new Markdown file, it will not appear in the Knowledge Base until its slug is registered. The process is:

1. Create the file in `public/docsOther/` or `public/docsHelp/`
2. Note the slug: for `docsOther`, the slug is the filename without `.md`; for `docsHelp`, it is the lowercase kebab-case of the filename without `.md` (e.g., `Own_The_Code_Content_Management_Guide.md` → `own-the-code-content-management-guide`)
3. Open `app/knowledgebase/page.jsx`
4. Add an entry to the appropriate array:

```javascript
{ name: 'Display Name for the Article', slug: 'the-slug-from-step-2' }
```

5. Include this change in the same commit as the new file

Claude Code handles this automatically when creating new marketing articles. For help articles, you may need to prompt it explicitly: "Also register the slug in `page.jsx`."

---

## Tips and Best Practices

**Use the source files as the source of truth.** Never edit content directly in the Strapi admin interface — those edits will be overwritten the next time a sync runs from the Markdown files. The `.md` files are canonical; Strapi is the delivery layer.

**Keep commits focused.** A commit that creates one new article and registers its slug is easy to review and easy to revert if something is wrong. A commit that updates fifteen articles is hard to review and a debugging problem if one of them has an issue.

**Write for the audience, not the tool.** `docsOther` is for buyers who are evaluating whether to purchase — they want to understand value and capability, not how to click through a UI. `docsHelp` is for users who already have the product — they want clear, accurate instructions. Claude Code will apply the right tone if you specify the audience clearly in your prompt.

**Let Claude verify the links.** Before asking Claude to write an article with links to other help or marketing articles, ask it to check `app/knowledgebase/page.jsx` first to confirm the slugs exist. A link to a non-existent slug produces a 404; verifying before writing avoids the problem entirely.

**Draft PRs are your safety net.** Claude Code opens PRs as drafts by default. A draft PR triggers CI and allows review but cannot be accidentally merged. Promote it to a regular PR only when you are satisfied with the content.

**The manual production copy is a feature, not a limitation.** The deliberate gap between merging to `main` and content going live means you always have a window to catch a problem that made it through review. A broken production deploy is recovered by reverting the file copy and re-syncing — no rollback of a container build required.
