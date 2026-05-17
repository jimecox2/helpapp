# CLAUDE.md — AI Assistant Guide

> **Project**: Timebars Ltd. Help Assistant (`helpapp`)
> **Version**: 1.0.0
> **Framework**: Next.js 14 (App Router)
> **Deployed At**: `help.timebars.com`
> **Parent Repo**: Extracted from `tbwww` (the main Timebars marketing/customer portal)

This document provides guidance for AI assistants working with the helpapp codebase.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Codebase Structure](#codebase-structure)
4. [Development Setup](#development-setup)
5. [AI Backend Integration](#ai-backend-integration)
6. [Documentation System](#documentation-system)
7. [Styling Conventions](#styling-conventions)
8. [Component Patterns](#component-patterns)
9. [Deployment](#deployment)
10. [Best Practices & Conventions](#best-practices--conventions)

---

## Project Overview

### What This Application Does

`helpapp` is a **standalone, public AI-powered help assistant** for Timebars Ltd.'s three project management products:

- **Timebars** (TB): Resource scheduler for project management
- **Agilebars** (AB): Sprint scheduler for agile teams
- **Costbars** (CB): Project portfolio management tool

Users pick a product, select relevant documentation, and ask questions in natural language. The AI answers **only from the selected documentation** (RAG pattern) — it never fabricates information.

### Key Design Decisions

- **No authentication**: Fully public. Accessible to prospective customers, new users, and existing customers alike.
- **No database**: All documentation is static markdown files bundled in `/public/docsHelp/`. Chat history is ephemeral (localStorage only, per session).
- **Dual AI backend**: Supports Google Gemini (cloud) or Ollama (local LLM) — switchable per request.
- **Documentation-grounded**: The system prompt explicitly instructs the model to answer only from provided docs and say so if the answer isn't there.

### Application Architecture

```
User Browser
     │
     ▼
Next.js 14 App (Port 3002)
     │
     ├── /app/page.jsx              → Homepage (renders HelpChatPanel)
     ├── /app/api/chat/route.js     → POST endpoint: routes to Gemini or Ollama
     │
     ├── HelpChatPanel.jsx          → All UI logic: product tabs, doc picker, chat
     │
     └── /public/docsHelp/*.md      → 35 static markdown documentation files
              │
              ├── Fetched client-side on demand (per-doc cache, 1-hour TTL)
              └── Sent as context in POST body to /api/chat
                           │
                           ├── Gemini 1.5 Flash (cloud, GEMINI_API_KEY)
                           └── Ollama llama3.2 (local, OLLAMA_HOST)
```

---

## Technology Stack

### Core

- **Next.js**: 14.2.12 (App Router, React Server Components)
- **React**: 18.x

### UI & Styling

- **Tailwind CSS**: 3.4.1
- **@tailwindcss/typography**: For prose/markdown rendering
- **tailwindcss-animate**: Animation utilities
- **shadcn/ui**: Component library (Radix UI primitives)
- **Lucide React**: Icons

### Content Processing

- **marked**: 15.0.7 (Markdown → HTML)
- **dompurify**: 3.2.4 (HTML sanitisation before `dangerouslySetInnerHTML`)

### Utilities

- **clsx** + **tailwind-merge**: Class merging via `cn()` helper in `/lib/utils.js`

### AI Providers

- **Google Gemini API**: `gemini-1.5-flash` via REST
- **Ollama**: Local LLM server via HTTP (`/api/chat`)

---

## Codebase Structure

```
helpapp/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js          # POST /api/chat — AI proxy endpoint
│   ├── globals.css               # Tailwind directives + CSS variables
│   ├── layout.jsx                # Root layout (Poppins font, dark mode support)
│   └── page.jsx                  # Homepage — renders HelpChatPanel
├── components/
│   ├── HelpChatPanel.jsx         # Main component (~800 lines) — all UI logic
│   └── ui/                       # shadcn/ui primitives
│       ├── badge.jsx
│       ├── button.jsx
│       ├── card.jsx
│       ├── scroll-area.jsx
│       ├── tabs.jsx
│       └── textarea.jsx
├── config/
│   └── ai.js                     # Gemini model name + Ollama host/model/timeouts
├── lib/
│   └── utils.js                  # cn() helper only
├── public/
│   └── docsHelp/                 # 35 markdown documentation files
│       ├── Timebars_User_Guide.md
│       ├── Agilebars_User_Guide.md
│       ├── Costbars_User_Guide.md
│       ├── Common_*.md           # Shared docs (used by all three products)
│       └── [product-specific docs]
├── jsconfig.json                 # Path alias: @/ → project root
├── next.config.mjs               # Minimal (no special config needed)
├── package.json
└── tailwind.config.js
```

### Key File Locations

| Purpose | Location |
|---------|----------|
| AI proxy endpoint | `/app/api/chat/route.js` |
| All UI logic | `/components/HelpChatPanel.jsx` |
| AI provider config | `/config/ai.js` |
| Documentation files | `/public/docsHelp/*.md` |
| Tailwind theme | `/tailwind.config.js` |
| Global styles | `/app/globals.css` |
| UI primitives | `/components/ui/*` |

---

## Development Setup

### Prerequisites

- **Node.js**: 18+
- **npm**: Comes with Node.js
- **Gemini API key** (optional — only needed if using cloud AI)
- **Ollama** running locally (optional — only needed if using local AI)

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Required for cloud AI (Google Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# No other env vars needed — Ollama host is configured in /config/ai.js
```

If you only use Ollama (local AI), no `.env.local` is needed — just configure the host in `/config/ai.js`.

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server (port 3002)
npm run dev

# Build for production
npm run build

# Start production server (port 3002)
npm start

# Run linter
npm run lint
```

### Port Configuration

- **Development & Production**: Port `3002` (set in `package.json` scripts)
- This was chosen to avoid conflicts with the parent `tbwww` app (port 3001)

### Path Aliases

`@/` resolves to the project root (configured in `jsconfig.json`):

```javascript
import { cn } from '@/lib/utils'
import { AI_CONFIG } from '@/config/ai'
import HelpChatPanel from '@/components/HelpChatPanel'
```

---

## AI Backend Integration

### Overview

The chat endpoint at `/app/api/chat/route.js` is a thin proxy that:
1. Receives `{ userQuestion, productCode, docsContext, useLocalAI }` from the client
2. Builds a product-specific system prompt
3. Routes to Gemini (cloud) or Ollama (local)
4. Returns `{ success: true, answer }` or `{ success: false, error }`

### System Prompt

```
You are a helpful support assistant for {Product}, a project management application by Timebars Ltd.
Answer the user's question using ONLY the documentation provided below.
If the answer is not in the documentation, say so clearly — do not make up information.
Format your answers using markdown where helpful (bullet points, bold, code blocks).
Be concise but complete.
```

Documentation is appended inline between `=== DOCUMENTATION ===` delimiters.

### Gemini (Cloud)

- **Model**: `gemini-1.5-flash` (configured in `/config/ai.js`)
- **Temperature**: 0.2 (deterministic, factual)
- **Max tokens**: 2048
- **API key**: Read from `process.env.GEMINI_API_KEY` at runtime
- No document trimming — Gemini handles large contexts natively

### Ollama (Local)

- **Host**: Configured in `/config/ai.js` (`OLLAMA_HOST`, default `http://10.0.0.152:11434`)
- **Model**: `llama3.2` (configurable in `/config/ai.js`)
- **Context window**: 4096 tokens (`num_ctx` — raise to 8192 for 16GB+ RAM)
- **Docs trimming**: Docs are trimmed to 8000 chars before sending to fit the context window
- **Timeout**: 120 seconds (local models can be slow)
- **Toggle**: The `useLocalAI` boolean in the request body switches backends

### Changing AI Configuration

Edit `/config/ai.js` to:
- Switch Gemini model version
- Change Ollama host, model, context window, or timeout

```javascript
export const AI_CONFIG = {
  gemini: {
    model: 'gemini-1.5-flash',       // Change model here
  },
  ollama: {
    host:         'http://10.0.0.152:11434',  // Ollama server address
    model:        'llama3.2',                  // Local model name
    num_ctx:      4096,                        // Context window tokens
    maxDocsChars: 8000,                        // Doc trim limit
    timeoutMs:    120000,                      // Request timeout (ms)
  },
}
```

---

## Documentation System

### Location

All documentation lives in `/public/docsHelp/` as markdown files. These are served statically by Next.js and fetched client-side.

### Documentation Registry

The `HELP_DOCS` object in `HelpChatPanel.jsx` is the registry of all 35 docs. Each entry defines:

```javascript
{
  title:    'Timebars User Guide',
  category: 'User Guide',
  products: ['TB'],             // TB, AB, CB, or combination
  path:     '/docsHelp/Timebars_User_Guide.md',
  priority: 1,                  // Lower = shown first in picker
}
```

### Adding New Documentation

1. Add the `.md` file to `/public/docsHelp/`
2. Add an entry to the `HELP_DOCS` object in `HelpChatPanel.jsx`
3. Set the correct `products` array so the doc appears for the right product tab

### Doc Fetching (Client-Side)

- Docs are fetched via `fetch('/docsHelp/filename.md')` from the browser
- Cached in memory with a 1-hour TTL
- Multiple docs are fetched in parallel with `Promise.allSettled` (one failure won't break the rest)
- The concatenated content is sent as `docsContext` in the POST body to `/api/chat`

---

## Styling Conventions

### Tailwind CSS

Primary styling solution. Use utility classes exclusively — no inline styles.

### Brand Colors

```javascript
tbBlue:   '#2519cc'   // Timebars primary blue
tbBlue2:  '#4286f3'   // Lighter blue accent
tbBrown:  '#5C4033'   // Brown
tbGreen:  '#4fb258'   // Green
tbOrange: '#ffa726'   // Orange
tbGold:   '#F5cf05'   // Gold
```

### Font

**Poppins** (Google Fonts) — loaded in the root layout, mapped to `font-sans` and `font-poppins`.

### Dark Mode

Class-based dark mode (`darkMode: ['class']` in Tailwind config). Use `dark:` variants:

```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### Typography Plugin

`@tailwindcss/typography` is installed for rendering AI markdown responses. Use `prose` classes:

```jsx
<div
  className="prose prose-sm dark:prose-invert max-w-none"
  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
/>
```

Always sanitise with DOMPurify before `dangerouslySetInnerHTML`.

### shadcn/ui Components

Available in `/components/ui/`:

```jsx
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
```

To add more shadcn/ui components:

```bash
npx shadcn-ui@latest add <component-name>
```

---

## Component Patterns

### HelpChatPanel.jsx

The core component (~800 lines). It is a **client component** (`'use client'`) because it manages extensive state. It handles:

- Product tab switching (TB / AB / CB)
- Doc picker (collapsible, per-product filtered list with select all/none)
- Chat message history (user, assistant, loading, error bubbles)
- Markdown rendering with DOMPurify sanitisation
- Local storage persistence (chat history per product, AI mode preference)
- Copy-to-clipboard for responses
- Keyboard shortcuts (Enter to send, Shift+Enter for newline)
- Error classification (rate limit, missing API key, Ollama timeout, network error)

#### State

```javascript
const [activeProduct, setActiveProduct]       // 'TB' | 'AB' | 'CB'
const [selectedDocKeys, setSelectedDocKeys]   // string[] — checked doc keys
const [messages, setMessages]                 // { role, content, id }[]
const [inputValue, setInputValue]             // textarea content
const [isLoading, setIsLoading]               // fetch in progress
const [useLocalAI, setUseLocalAI]             // Gemini vs Ollama toggle
```

#### Message Roles

| Role | Rendered As |
|------|-------------|
| `user` | Right-aligned bubble |
| `assistant` | Left-aligned bubble with markdown |
| `error` | Red error bubble |
| `loading` | Animated dots |

### Server vs. Client Components

This app is simple: `page.jsx` and `layout.jsx` are Server Components (no directive needed). `HelpChatPanel.jsx` is a Client Component (needs state, effects, browser APIs).

Add `'use client'` only when a component needs hooks, event handlers, or browser APIs.

---

## Deployment

### Container Setup

This app runs in a Docker container at `help.timebars.com`. It is part of the broader Timebars infrastructure but operates independently (no shared database, no shared auth).

### Environment Variables for Production

```bash
# .env.local on the server / passed via Docker env_file
GEMINI_API_KEY=your_production_gemini_key
```

If using Ollama on the production server, update `OLLAMA_HOST` in `/config/ai.js` to point to the correct internal address.

### Dockerfile (create if not present)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["npm", "start"]
```

### docker-compose.yml (example)

```yaml
version: '3.8'
services:
  helpapp:
    container_name: helpapp
    image: jimecox807/helpapp:latest
    ports:
      - "3002:3002"
    env_file:
      - .env.local
    restart: unless-stopped
```

### Deployment Process

```bash
# 1. Build and verify locally
npm run build

# 2. Build Docker image
docker build -t helpapp:latest .

# 3. Tag and push to Docker Hub
docker tag helpapp:latest jimecox807/helpapp:latest
docker push jimecox807/helpapp:latest

# 4. On server: pull and start
docker pull jimecox807/helpapp:latest
docker compose up -d
```

### Pre-Deployment Checklist

- [ ] `GEMINI_API_KEY` is set in the server environment
- [ ] Ollama host in `/config/ai.js` matches server network (if using local AI)
- [ ] `npm run build` completes without errors
- [ ] No ESLint errors (`npm run lint`)
- [ ] Docs in `/public/docsHelp/` are up to date

---

## Best Practices & Conventions

### File Naming

- **Components**: PascalCase (`HelpChatPanel.jsx`, `DocPicker.jsx`)
- **Pages**: lowercase (`page.jsx`, `layout.jsx`)
- **Utilities/Config**: camelCase (`utils.js`, `ai.js`)

### Import Order

```javascript
// 1. React / Next.js
import { useState, useEffect } from 'react'
import Link from 'next/link'

// 2. Third-party
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// 3. Internal (path aliases)
import { cn } from '@/lib/utils'
import { AI_CONFIG } from '@/config/ai'
import { Button } from '@/components/ui/button'

// 4. Relative
import DocPicker from './DocPicker'
```

### Security

- **Always sanitise** AI-generated markdown before rendering:
  ```javascript
  const html = DOMPurify.sanitize(marked.parse(content))
  <div dangerouslySetInnerHTML={{ __html: html }} />
  ```
- **Never expose** `GEMINI_API_KEY` to the client. It is only read server-side in `/app/api/chat/route.js`.
- The `/api/chat` route validates that `userQuestion` is non-empty before calling any AI provider.

### Extending the App

**Adding a new product**:
1. Add a product code (e.g., `NP`) to `productNames` in `/app/api/chat/route.js`
2. Add a new tab in `HelpChatPanel.jsx`
3. Add relevant docs to `/public/docsHelp/` and register them in `HELP_DOCS`

**Adding a new AI provider**:
1. Add configuration to `/config/ai.js`
2. Write a new `callProvider()` function in `/app/api/chat/route.js` following the Gemini/Ollama pattern
3. Add a UI toggle in `HelpChatPanel.jsx`

**Upgrading the Gemini model**:
- Change `model` in `/config/ai.js` — no other changes needed.

### Git Commit Conventions

Follow conventional commit format:

```
feat: Add new product tab for Newbars
fix: Handle Ollama timeout error message correctly
docs: Update documentation registry with new user guide
style: Adjust chat bubble padding for mobile
refactor: Extract DocPicker into separate component
chore: Upgrade marked to latest version
```

---

## Common Commands

```bash
# Development
npm run dev           # Start dev server on :3002
npm run build         # Production build
npm start             # Start production server on :3002
npm run lint          # ESLint check

# Cache clearing
rm -rf .next && npm run build

# Docker
docker build -t helpapp:latest .
docker run -p 3002:3002 --env-file .env.local helpapp:latest
docker logs -f helpapp

# Find docs
ls public/docsHelp/

# Search component code
grep -r "HELP_DOCS" --include="*.jsx" --include="*.js"
grep -r "useLocalAI" --include="*.jsx" --include="*.js"
```

---

**Last Updated**: 2025-11-20
**Maintained By**: Development Team
