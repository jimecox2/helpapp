'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, User, Send, Trash2, Copy, CheckCheck, AlertCircle } from 'lucide-react'
import { MODELS, DEFAULT_MODEL_ID, getModelById } from '@/config/ai'

// ─── Configuration ────────────────────────────────────────────────────────────

const MAX_HISTORY_ITEMS = 10
const DOCS_CACHE_TTL    = 1000 * 60 * 60 // 1 hour

const _docCache = {}

// ─── Help Docs Registry ───────────────────────────────────────────────────────
//
// category values used for layout:
//   'Timebars'         → Timebars product column
//   'Agilebars'        → Agilebars product column
//   'Costbars'         → Costbars product column
//   'Common Help Files'→ shared section below the columns
//   'Advanced'         → advanced/technical section at the bottom

const HELP_DOCS = {

  // ── Timebars column ────────────────────────────────────────────────────────
  'timebars-user-guide.md': {
    title: 'Timebars User Guide',
    category: 'Timebars',
    products: ['TB'],
    path: '/docsHelp/Timebars_User_Guide.md',
    priority: 1,
  },

  // ── Agilebars column ──────────────────────────────────────────────────────
  'agilebars-user-guide.md': {
    title: 'Agilebars User Guide',
    category: 'Agilebars',
    products: ['AB'],
    path: '/docsHelp/Agilebars_User_Guide.md',
    priority: 1,
  },
  'kanban-primer.md': {
    title: 'Kanban Primer',
    category: 'Agilebars',
    products: ['AB'],
    path: '/docsHelp/Agilebars_Kanban_Primer.md',
    priority: 2,
  },

  // ── Costbars column ───────────────────────────────────────────────────────
  'costbars-user-guide.md': {
    title: 'Costbars User Guide',
    category: 'Costbars',
    products: ['CB'],
    path: '/docsHelp/Costbars_User_Guide.md',
    priority: 1,
  },
  'writing-business-case.md': {
    title: 'Writing a Business Case',
    category: 'Costbars',
    products: ['CB'],
    path: '/docsHelp/Costbars_Writing_A_Business_Case.md',
    priority: 2,
  },
  'ppm-portfolio-status-balancing.md': {
    title: 'PPM Portfolio Status & Balancing',
    category: 'Costbars',
    products: ['CB'],
    path: '/docsHelp/Costbars_PPM_Portfolio_Status_And_Balancing_Report.md',
    priority: 3,
  },
  'ppm-project-assessment.md': {
    title: 'PPM Project Assessment Tool',
    category: 'Costbars',
    products: ['CB'],
    path: '/docsHelp/Costbars_PPM_Project_Assessment_Tool.md',
    priority: 4,
  },
  'ppm-scoring-guide.md': {
    title: 'PPM Scoring Guide (5 Steps)',
    category: 'Costbars',
    products: ['CB'],
    path: '/docsHelp/Costbars_PPM_Scoring_Guide_5_Step_Process.md',
    priority: 5,
  },

  // ── Common Help Files ──────────────────────────────────────────────────────
  'getting-started.md': {
    title: 'Getting Started Guide',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_01_Getting_Started.md',
    priority: 1,
  },
  'innovations.md': {
    title: 'Innovations by Timebars Ltd',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_01_Innovations_By_Timebars_Ltd.md',
    priority: 2,
  },
  'product-design-strategy.md': {
    title: 'Product Design Strategy',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_01_Product_Design_Strategy.md',
    priority: 3,
  },
  'user-interface-guide.md': {
    title: 'User Interface Guide',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_02_User_Interface_Guide.md',
    priority: 4,
  },
  'configurable-features.md': {
    title: 'Configurable Features',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_03_Configurable_Features_User_Guide.md',
    priority: 5,
  },
  'data-management.md': {
    title: 'Data Management',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_03_Data_Management_User_Guide.md',
    priority: 6,
  },
  'data-model-scheduling.md': {
    title: 'Data Model & Scheduling Engine',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_03_Data_Model_and_Scheduling_Engine_Guide.md',
    priority: 7,
  },
  'data-structure.md': {
    title: 'Data Structure',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_03_Data_Structure_User_Guide.md',
    priority: 8,
  },
  'metadata-fields.md': {
    title: 'MetaData Fields',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_03_MetaData_Fields_Detail_Report.md',
    priority: 9,
  },
  'picklists-tagging.md': {
    title: 'Picklists & Tagging',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_03_Picklists_And_Tagging_Help.md',
    priority: 10,
  },
  'spreadsheet-sync.md': {
    title: 'Spreadsheet Sync',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_03_Spreadsheet_Sync_User_Guide.md',
    priority: 11,
  },
  'focd-forms.md': {
    title: 'FOCD Forms',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_04_FOCD_Forms_User_Guide.md',
    priority: 12,
  },
  'local-reports-graphs.md': {
    title: 'Local Reports & Graphs',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_05_Local_Reports_And_Graphs_Guide.md',
    priority: 13,
  },
  'risks-issues-change-requests.md': {
    title: 'Risks, Issues & Change Requests',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_05_Risks_Issues_Change_Requests_User_Guide.md',
    priority: 14,
  },
  'ask-ai.md': {
    title: 'How to Use Ask AI',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_06_How_To_Use_Ask_AI.md',
    priority: 15,
  },
  'cloud-publishing.md': {
    title: 'Cloud Publishing',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_07_Cloud_Publishing_Guide.md',
    priority: 16,
  },
  'personal-dashboard-guide.md': {
    title: 'Cloud Reports & Dashboard',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_08_Personal_Dashboard_Guide.md',
    priority: 17,
  },
  'enterprise-dashboard-guide.md': {
    title: 'Enterprise Dashboard',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_09_Enterprise_Dashboard_Guide.md',
    priority: 18,
  },
  'text-notifications.md': {
    title: 'Text Notifications',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_10_Text_Notifications.md',
    priority: 19,
  },
  'supply-demand-grids.md': {
    title: 'Supply & Demand Grids',
    category: 'Common Help Files',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_11_Supply_And_Demand_Grids_User_Guide.md',
    priority: 20,
  },

  // ── Advanced ───────────────────────────────────────────────────────────────
  'text-notifications-technical.md': {
    title: 'Text Notifications — Technical Details',
    category: 'Advanced',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_10_Text_Notifications_Technical_Details.md',
    priority: 1,
  },
  'customer-installation-options.md': {
    title: 'Customer Installation Options',
    category: 'Advanced',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_12_Customer_Installation_Options.md',
    priority: 2,
  },
  'data-migration.md': {
    title: 'Data Migration Assistance',
    category: 'Advanced',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_12_Data_Migration_Assistance.md',
    priority: 3,
  },
  'on-prem-installation.md': {
    title: 'On-Premises Installation',
    category: 'Advanced',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_12_Products_Installation_For_On_Prem.md',
    priority: 4,
  },
}

// ─── Pure Helpers ─────────────────────────────────────────────────────────────

// Returns sorted [key, cfg] pairs for a given category
function getDocsByCategory(category) {
  return Object.entries(HELP_DOCS)
    .filter(([, cfg]) => cfg.category === category)
    .sort((a, b) => a[1].priority - b[1].priority)
}

// Returns all keys for a category
function getKeysByCategory(category) {
  return getDocsByCategory(category).map(([key]) => key)
}

// Default selection: all Timebars column docs + all Common Help Files
function getDefaultDocKeys() {
  return Object.entries(HELP_DOCS)
    .filter(([, cfg]) => cfg.category === 'Timebars' || cfg.category === 'Common Help Files')
    .map(([key]) => key)
}

// Detect the primary product from selected docs to build the right system prompt
function detectProductCode(docKeys) {
  const hasTB = docKeys.some(k => HELP_DOCS[k]?.category === 'Timebars')
  const hasAB = docKeys.some(k => HELP_DOCS[k]?.category === 'Agilebars')
  const hasCB = docKeys.some(k => HELP_DOCS[k]?.category === 'Costbars')
  const count = [hasTB, hasAB, hasCB].filter(Boolean).length
  if (count > 1) return 'ALL'
  if (hasTB)    return 'TB'
  if (hasAB)    return 'AB'
  if (hasCB)    return 'CB'
  return 'TB' // only common/advanced docs selected — default to TB
}

async function fetchDoc(path) {
  const now    = Date.now()
  const cached = _docCache[path]
  if (cached && (now - cached.ts) < DOCS_CACHE_TTL) return cached.content
  const res = await fetch(path)
  if (!res.ok) throw new Error(`${path}: ${res.status}`)
  const content = await res.text()
  _docCache[path] = { content, ts: now }
  return content
}

async function loadSelectedDocs(docKeys) {
  if (!docKeys.length) return ''
  const entries = docKeys
    .map(key => [key, HELP_DOCS[key]])
    .filter(([, cfg]) => cfg)
    .sort((a, b) => a[1].priority - b[1].priority)

  const results = await Promise.allSettled(
    entries.map(async ([, cfg]) => {
      const content = await fetchDoc(cfg.path)
      return { title: cfg.title, category: cfg.category, content }
    })
  )

  const loaded = results.filter(r => r.status === 'fulfilled').map(r => r.value)
  const failed = results.filter(r => r.status === 'rejected').length
  if (failed > 0) console.warn(`⚠️ Failed to load ${failed} doc(s)`)

  return loaded.map(doc =>
    `═══════════════════════════════════════\n` +
    `📄 ${doc.title}\nCategory: ${doc.category}\n` +
    `═══════════════════════════════════════\n\n${doc.content}\n\n`
  ).join('\n\n')
}

function renderMarkdown(text) {
  const raw = marked.parse(text)
  return DOMPurify.sanitize(typeof raw === 'string' ? raw : String(raw))
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

// ─── Doc Picker ───────────────────────────────────────────────────────────────

function DocCheckbox({ docKey, cfg, selectedDocKeys, onToggle }) {
  return (
    <label className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white group">
      <input
        type="checkbox"
        checked={selectedDocKeys.includes(docKey)}
        onChange={() => onToggle(docKey)}
        className="mt-0.5 w-3.5 h-3.5 accent-tbBlue cursor-pointer flex-shrink-0"
      />
      <span className="group-hover:text-tbBlue transition-colors leading-tight">{cfg.title}</span>
    </label>
  )
}

function SectionHeader({ label, onSelectAll, onSelectNone }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="flex gap-2">
        <button onClick={onSelectAll}  className="text-xs text-tbBlue hover:underline font-medium">All</button>
        <button onClick={onSelectNone} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:underline">None</button>
      </span>
    </div>
  )
}

function DocPicker({ selectedDocKeys, onToggle, onSectionSelect }) {
  const tbDocs     = getDocsByCategory('Timebars')
  const abDocs     = getDocsByCategory('Agilebars')
  const cbDocs     = getDocsByCategory('Costbars')
  const commonDocs = getDocsByCategory('Common Help Files')
  const advDocs    = getDocsByCategory('Advanced')

  const totalSelected = selectedDocKeys.length
  const totalDocs     = Object.keys(HELP_DOCS).length

  return (
    <div className="space-y-5">

      {/* Summary row */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          📚 <span className="font-semibold text-gray-700 dark:text-gray-300">{totalSelected}</span> of {totalDocs} docs selected
          {totalSelected === 0 && (
            <span className="ml-1 text-red-500 font-medium">— select at least one</span>
          )}
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => onSectionSelect(Object.keys(HELP_DOCS), true)}
            className="text-xs text-tbBlue hover:underline font-medium"
          >
            Select all
          </button>
          <button
            onClick={() => onSectionSelect([], false)}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:underline"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Three product columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Timebars */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-lg p-3">
          <SectionHeader
            label="Timebars"
            onSelectAll={() => onSectionSelect(getKeysByCategory('Timebars'), true)}
            onSelectNone={() => onSectionSelect(getKeysByCategory('Timebars'), false)}
          />
          <div className="space-y-2">
            {tbDocs.map(([key, cfg]) => (
              <DocCheckbox key={key} docKey={key} cfg={cfg} selectedDocKeys={selectedDocKeys} onToggle={onToggle} />
            ))}
          </div>
        </div>

        {/* Agilebars */}
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40 rounded-lg p-3">
          <SectionHeader
            label="Agilebars"
            onSelectAll={() => onSectionSelect(getKeysByCategory('Agilebars'), true)}
            onSelectNone={() => onSectionSelect(getKeysByCategory('Agilebars'), false)}
          />
          <div className="space-y-2">
            {abDocs.map(([key, cfg]) => (
              <DocCheckbox key={key} docKey={key} cfg={cfg} selectedDocKeys={selectedDocKeys} onToggle={onToggle} />
            ))}
          </div>
        </div>

        {/* Costbars */}
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-lg p-3">
          <SectionHeader
            label="Costbars"
            onSelectAll={() => onSectionSelect(getKeysByCategory('Costbars'), true)}
            onSelectNone={() => onSectionSelect(getKeysByCategory('Costbars'), false)}
          />
          <div className="space-y-2">
            {cbDocs.map(([key, cfg]) => (
              <DocCheckbox key={key} docKey={key} cfg={cfg} selectedDocKeys={selectedDocKeys} onToggle={onToggle} />
            ))}
          </div>
        </div>

      </div>

      {/* Common Help Files */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
        <SectionHeader
          label="Common Help Files"
          onSelectAll={() => onSectionSelect(getKeysByCategory('Common Help Files'), true)}
          onSelectNone={() => onSectionSelect(getKeysByCategory('Common Help Files'), false)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
          {commonDocs.map(([key, cfg]) => (
            <DocCheckbox key={key} docKey={key} cfg={cfg} selectedDocKeys={selectedDocKeys} onToggle={onToggle} />
          ))}
        </div>
      </div>

      {/* Advanced */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
        <SectionHeader
          label="Advanced"
          onSelectAll={() => onSectionSelect(getKeysByCategory('Advanced'), true)}
          onSelectNone={() => onSectionSelect(getKeysByCategory('Advanced'), false)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {advDocs.map(([key, cfg]) => (
            <DocCheckbox key={key} docKey={key} cfg={cfg} selectedDocKeys={selectedDocKeys} onToggle={onToggle} />
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── Chat Sub-Components ──────────────────────────────────────────────────────

function WelcomeContent({ selectedCount, model }) {
  const isLocal = model?.provider === 'ollama'
  return (
    <div className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900">
      <div className="flex items-center gap-3 mb-3">
        <Bot className="w-8 h-8 text-tbBlue flex-shrink-0" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Timebars Help Assistant
        </h3>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
        Ask me anything about Timebars, Agilebars, or Costbars. I answer only from the selected documentation — tick the docs most relevant to your question above.
      </p>
      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1 mb-4">
        <li>Creating and managing projects, tasks, and milestones</li>
        <li>Reports, graphs, and dashboards</li>
        <li>Resource allocation and scheduling</li>
        <li>Field definitions and data management</li>
        <li>Product-specific features and workflows</li>
      </ul>
      <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
        <Badge variant="secondary" className="text-xs">
          📚 {selectedCount} doc{selectedCount !== 1 ? 's' : ''} selected
        </Badge>
        <span>•</span>
        <span>{isLocal ? '🖥️' : '☁️'} {model?.label ?? 'AI'}</span>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800/60 rounded p-3 border border-gray-200 dark:border-gray-700">
        <strong>💡 Tips:</strong>{' '}
        {isLocal
          ? 'Local models have a smaller context window — select only the docs relevant to your question.'
          : 'Cloud AI handles large doc selections with no slowdown.'}
        {' '}Press{' '}
        <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd> to send,{' '}
        <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Shift+Enter</kbd> for a new line.
      </div>
    </div>
  )
}

function LoadingBubble() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-tbBlue flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

function UserBubble({ content }) {
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="bg-tbBlue text-white rounded-lg px-4 py-3 max-w-[80%]">
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
        <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </div>
    </div>
  )
}

function AssistantBubble({ id, content, copiedId, onCopy }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-tbBlue flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 max-w-[80%]">
        <div
          className="text-sm text-gray-800 dark:text-gray-200 prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
        <button
          onClick={() => onCopy(id, content)}
          className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Copy response"
        >
          {copiedId === id ? (
            <><CheckCheck className="w-3 h-3 text-green-500" /><span className="text-green-500">Copied!</span></>
          ) : (
            <><Copy className="w-3 h-3" /><span>Copy</span></>
          )}
        </button>
      </div>
    </div>
  )
}

function ErrorBubble({ content }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
      </div>
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 max-w-[80%]">
        <p className="text-sm text-red-700 dark:text-red-400">{content}</p>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HelpChatPanel() {
  const [selectedDocKeys, setSelectedDocKeys] = useState(getDefaultDocKeys)
  const [messages,        setMessages]        = useState([])
  const [inputValue,      setInputValue]      = useState('')
  const [isLoading,       setIsLoading]       = useState(false)
  const [copiedId,        setCopiedId]        = useState(null)
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID)

  const textareaRef    = useRef(null)
  const messagesEndRef = useRef(null)

  const activeModel = getModelById(selectedModelId)

  // Restore saved model preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('helpSelectedModel')
      if (saved && MODELS.some(m => m.id === saved)) setSelectedModelId(saved)
    } catch { /* ignore */ }
  }, [])

  // Restore chat history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('helpAiHistory')
      if (!saved) return
      const history = JSON.parse(saved)
      const restored = history.slice(-5).flatMap(item => [
        { id: `h-u-${item.ts}`, role: 'user',      content: item.question },
        { id: `h-a-${item.ts}`, role: 'assistant', content: item.answer },
      ])
      if (restored.length > 0) setMessages(restored)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleModelChange(e) {
    const id = e.target.value
    setSelectedModelId(id)
    try { localStorage.setItem('helpSelectedModel', id) } catch { /* ignore */ }
  }

  function handleDocToggle(key) {
    setSelectedDocKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  // onSectionSelect(keys, add) — add=true adds those keys, add=false removes them
  function handleSectionSelect(keys, add) {
    if (add) {
      setSelectedDocKeys(prev => [...new Set([...prev, ...keys])])
    } else {
      const remove = new Set(keys)
      setSelectedDocKeys(prev => prev.filter(k => !remove.has(k)))
    }
  }

  function saveToHistory(question, answer) {
    try {
      const saved   = localStorage.getItem('helpAiHistory')
      const history = saved ? JSON.parse(saved) : []
      history.push({ question, answer, ts: Date.now() })
      if (history.length > MAX_HISTORY_ITEMS) history.splice(0, history.length - MAX_HISTORY_ITEMS)
      localStorage.setItem('helpAiHistory', JSON.stringify(history))
    } catch { /* ignore */ }
  }

  const handleSend = useCallback(async () => {
    const question = inputValue.trim()
    if (!question || isLoading) return

    if (selectedDocKeys.length === 0) {
      setMessages(prev => [...prev, {
        id: `e-${makeId()}`, role: 'error',
        content: 'Please select at least one documentation file before asking a question.',
      }])
      return
    }

    setInputValue('')
    const loadingId = `l-${makeId()}`
    setMessages(prev => [
      ...prev,
      { id: `u-${makeId()}`, role: 'user',    content: question },
      { id: loadingId,        role: 'loading', content: '' },
    ])
    setIsLoading(true)

    try {
      const docsContext   = await loadSelectedDocs(selectedDocKeys)
      const productCode   = detectProductCode(selectedDocKeys)

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion: question,
          productCode,
          docsContext,
          modelId: selectedModelId,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Unknown error from AI service')

      const answerId = `a-${makeId()}`
      setMessages(prev =>
        prev.filter(m => m.id !== loadingId)
            .concat({ id: answerId, role: 'assistant', content: data.answer })
      )
      saveToHistory(question, data.answer)

    } catch (error) {
      let errorText = '❌ '
      if (error.message?.includes('429')) {
        errorText += 'Rate limit reached — please wait a minute and try again.'
      } else if (error.message?.includes('GEMINI_API_KEY')) {
        errorText += 'Cloud AI is not configured. Check your GEMINI_API_KEY in .env.local.'
      } else if (error.message?.includes('timed out')) {
        errorText += `${activeModel.label} took too long. Try a cloud model or select fewer docs.`
      } else if (error.message?.includes('ECONNREFUSED') || error.message?.includes('fetch failed') || error.message?.includes('Failed to fetch')) {
        errorText += `Cannot connect to Ollama at the configured host. Check that Ollama is running and OLLAMA_HOST in config/ai.js is correct.`
      } else if (error.message?.includes('Ollama error:')) {
        // Ollama is reachable but returned an API error — show the real message
        errorText += `Ollama rejected the request: ${error.message.replace('Ollama error: ', '')}`
      } else {
        errorText += error.message || 'Please try again later.'
      }
      setMessages(prev =>
        prev.filter(m => m.id !== loadingId)
            .concat({ id: `e-${makeId()}`, role: 'error', content: errorText })
      )
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }, [inputValue, isLoading, selectedDocKeys, selectedModelId, activeModel])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  function handleClear() {
    setMessages([])
    try { localStorage.removeItem('helpAiHistory') } catch { /* ignore */ }
  }

  async function handleCopy(messageId, content) {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch { /* ignore */ }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Card className="w-full shadow-md border border-gray-200 dark:border-gray-700">

      {/* ── Header ── */}
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-tbBlue flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                Ask questions about Agilebars, Timebars or Costbars
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activeModel.provider === 'ollama' ? '🖥️' : '☁️'} {activeModel.label} · Official documentation only
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-tbBlue border-tbBlue font-medium hidden sm:flex">
            Timebars Ltd.
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">

        {/* ── Doc Picker (always visible) ── */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <DocPicker
            selectedDocKeys={selectedDocKeys}
            onToggle={handleDocToggle}
            onSectionSelect={handleSectionSelect}
          />
        </div>

        {/* ── Messages ── */}
        <ScrollArea className="h-[420px]">
          <div className="px-6 py-5 space-y-4">
            {messages.length === 0 ? (
              <WelcomeContent
                selectedCount={selectedDocKeys.length}
                model={activeModel}
              />
            ) : (
              messages.map(msg => {
                if (msg.role === 'loading')   return <LoadingBubble key={msg.id} />
                if (msg.role === 'user')      return <UserBubble key={msg.id} content={msg.content} />
                if (msg.role === 'error')     return <ErrorBubble key={msg.id} content={msg.content} />
                return (
                  <AssistantBubble
                    key={msg.id}
                    id={msg.id}
                    content={msg.content}
                    copiedId={copiedId}
                    onCopy={handleCopy}
                  />
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* ── Input Area ── */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-4 space-y-3">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about any of the selected products…&#10;Example: How do I create a new project?"
            rows={3}
            disabled={isLoading}
            className="resize-none focus-visible:ring-tbBlue"
            aria-label="Help question input"
          />

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim() || selectedDocKeys.length === 0}
                className="bg-tbBlue hover:bg-blue-800 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? 'Thinking…' : 'Ask'}
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={isLoading || messages.length === 0}
                aria-label="Clear conversation"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>

              {/* Model picker */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Model:</span>
                <select
                  value={selectedModelId}
                  onChange={handleModelChange}
                  disabled={isLoading}
                  className="text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-tbBlue disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Select AI model"
                >
                  {MODELS.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.provider === 'ollama' ? '🖥️' : '☁️'} {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <span className="text-xs text-gray-400 dark:text-gray-500">
              {selectedDocKeys.length} doc{selectedDocKeys.length !== 1 ? 's' : ''} · Enter to send
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
