// lib/help/helpDocs.js
// THE help registry and table of contents. helpapp is the master of the help files
// (public/docsHelp/); this list says which file belongs to which product, in what order.
// Used by: the help library (/help), the guide pages (/help/<slug>), Ask AI (/help/ask),
// the AI Help beta panel (/aitemp) and the TOC file (`npm run toc` writes public/docsHelp/a1 TOC).
//
// Every path must exist in public/docsHelp/ (`npm run check:help` fails otherwise). The
// *_Complete_Reference_Guide.md files are not guides here: they repeat the other guides, so Ask AI
// leaves them out and the library offers them as PDFs (HELP_DOWNLOADS).
// tbrunp keeps its own copy of the guide list for the in-app Ask AI (scripts/ai/helpDocsLoader.js):
// when a guide is added, renamed or deleted, change that list too.
// No server-only imports here: client components use this file.

export const PRODUCTS = {
  TB: 'Timebars',
  AB: 'Agilebars',
  CB: 'Costbars',
}

export const HELP_DOCS = {

  // ═══════════════════════════════════════════════════════════════
  // COMMON - All Products (15 files, 13 for Agilebars)
  // ═══════════════════════════════════════════════════════════════

  'getting-started.md': {
    title: 'Getting Started, including Data Migration',
    category: 'User Guide',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_01_Getting_Started.md',
    priority: 1,
  },
  'user-interface-guide.md': {
    title: 'User Interface Guide',
    category: 'User Guide',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_02_User_Interface_Guide.md',
    priority: 2,
  },
  'data-model-scheduling.md': {
    title: 'Data Model and Scheduling Engine Guide',
    category: 'User Guide',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_03_Data_Model_and_Scheduling_Engine_Guide.md',
    priority: 3,
  },
  'data-sync-backup-recovery.md': {
    title: 'Data Synchronization, Backup, Recovery and Retention Guide',
    category: 'User Guide',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_04_Data_Synchronization_Backup_Recovery_And_Retention_User_Guide.md',
    priority: 3,
  },
  'forms-reports-graphs.md': {
    title: 'Forms, Reports and Graphs Guide',
    category: 'User Guide',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_05_Forms_Reports_And_Graphs_Guide.md',
    priority: 3,
  },
  'risks-issues-change-requests.md': {
    title: 'Risks, Issues and Change Requests User Guide',
    category: 'User Guide',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_05_Risks_Issues_Change_Requests_User_Guide.md',
    priority: 4,
  },
  'ask-ai.md': {
    title: 'How to Use Ask AI',
    category: 'User Guide',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_06_How_To_Use_Ask_AI.md',
    priority: 4,
  },
  'cloud-publishing.md': {
    title: 'Cloud Publishing Guide',
    category: 'Cloud',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_07_Cloud_Publishing_Guide.md',
    priority: 5,
  },
  'personal-dashboard-guide.md': {
    title: 'Personal Dashboard Guide',
    category: 'Cloud',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_08_Personal_Dashboard_Guide.md',
    priority: 5,
  },
  'enterprise-dashboard-guide.md': {
    title: 'Enterprise Dashboard Guide',
    category: 'Cloud',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_09_Enterprise_Dashboard_Guide.md',
    priority: 6,
  },
  // Text Notifications and the Supply/Demand Grids are TB/CB only - Agilebars
  // uses neither, so they are filtered out of an AB assistant's corpus.
  'text-notifications.md': {
    title: 'Text Notifications User Guide',
    category: 'Cloud',
    products: ['TB', 'CB'],
    path: '/docsHelp/Common_10_Text_Notifications_User_Guide.md',
    priority: 6,
  },
  'supply-demand-grids.md': {
    title: 'Supply and Demand Grids User Guide',
    category: 'User Guide',
    products: ['TB', 'CB'],
    path: '/docsHelp/Common_11_Supply_And_Demand_Grids_User_Guide.md',
    priority: 4,
  },
  'customer-ownership-installation.md': {
    title: 'Customer Ownership and Installation Options',
    category: 'Installation',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_12_Customer_Ownership_Installation_Options.md',
    priority: 9,
  },
  'offline-mode-security.md': {
    title: 'Offline Mode and Security',
    category: 'Installation',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Common_13_Offline_Mode_And_Security.md',
    priority: 9,
  },
  'administrators-guide.md': {
    title: 'Administrators Guide (hosting, deployment, containers, secrets, air-gapped installs)',
    category: 'Installation',
    products: ['TB', 'AB', 'CB'],
    path: '/docsHelp/Administrators_Guide.md',
    priority: 9,
  },

  // ═══════════════════════════════════════════════════════════════
  // PRODUCT-SPECIFIC - one master guide each
  // ═══════════════════════════════════════════════════════════════

  'costbars-user-guide.md': {
    title: 'Costbars User Guide',
    category: 'User Guide',
    products: ['CB'],
    path: '/docsHelp/Costbars_User_Guide.md',
    priority: 1,
  },
  'timebars-user-guide.md': {
    title: 'Timebars User Guide',
    category: 'User Guide',
    products: ['TB'],
    path: '/docsHelp/Timebars_User_Guide.md',
    priority: 1,
  },
  'agilebars-user-guide.md': {
    title: 'Agilebars User Guide',
    category: 'User Guide',
    products: ['AB'],
    path: '/docsHelp/Agilebars_User_Guide.md',
    priority: 1,
  },
};

// Files people download from the library, per product (served from public/pdf and public/spreadsheets).
export const HELP_DOWNLOADS = [
  { title: 'Agilebars Complete Reference Guide (PDF)', products: ['AB'], href: '/pdf/Agilebars_Complete_Reference_Guide.pdf' },
  { title: 'Timebars Complete Reference Guide (PDF)', products: ['TB'], href: '/pdf/Timebars_Complete_Reference_Guide.pdf' },
  { title: 'Costbars Complete Reference Guide (PDF)', products: ['CB'], href: '/pdf/Costbars_Complete_Reference_Guide.pdf' },
  { title: 'Client Master Spreadsheet (Excel)', products: ['TB', 'AB', 'CB'], href: '/spreadsheets/tbClientMaster_v1.xlsm' },
  { title: 'Client Master Spreadsheet (LibreOffice Calc)', products: ['TB', 'AB', 'CB'], href: '/spreadsheets/tbClientMaster_v1.ods' },
]

// Library sections, in display order. A guide's section is its category; the product's own
// guide is lifted into the first section.
export const LIBRARY_SECTIONS = [
  { key: 'Product', title: 'Product Guide' },
  { key: 'User Guide', title: 'Common Guides' },
  { key: 'Cloud', title: 'Cloud' },
  { key: 'Installation', title: 'Installation and Administration' },
]

// Docs file name -> URL slug: Common_02_User_Interface_Guide.md -> common-02-user-interface-guide.
// The same rule names the Strapi help-article, so a slug is the same everywhere.
export function fileToSlug(file) {
  return file.replace(/^.*\//, '').replace(/\.md$/, '').replace(/_/g, '-').toLowerCase()
}

// Every guide with its file name and slug, in registry order.
export const HELP_GUIDES = Object.entries(HELP_DOCS).map(([key, d]) => {
  const file = d.path.replace(/^\/docsHelp\//, '')
  return { key, ...d, file, slug: fileToSlug(file) }
})

export function guideBySlug(slug) {
  return HELP_GUIDES.find(g => g.slug === slug) || null
}

export function guideByFile(file) {
  return HELP_GUIDES.find(g => g.file === file) || null
}

// The library's sections for one product: [{ key, title, guides }], empty sections left out.
export function librarySections(productCode) {
  const guides = HELP_GUIDES
    .filter(g => g.products.includes(productCode))
    .sort((a, b) => a.priority - b.priority || a.file.localeCompare(b.file))
  return LIBRARY_SECTIONS
    .map(s => ({
      ...s,
      guides: guides.filter(g => (g.products.length === 1 ? 'Product' : g.category) === s.key),
    }))
    .filter(s => s.guides.length)
}

export function downloadsForProduct(productCode) {
  return HELP_DOWNLOADS.filter(d => d.products.includes(productCode))
}

const cache = {}
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

export function docsForProduct(productCode) {
  return Object.entries(HELP_DOCS)
    .filter(([, d]) => d.products.includes(productCode))
    .sort((a, b) => a[1].priority - b[1].priority)
}

// Fetches every doc for the product and joins them into one context string (same format as tbrunp).
export async function loadProductDocs(productCode) {
  const hit = cache[productCode]
  if (hit && Date.now() - hit.at < CACHE_TTL) return hit.value

  const entries = docsForProduct(productCode)
  const results = await Promise.allSettled(
    entries.map(async ([filename, d]) => {
      const res = await fetch(d.path)
      if (!res.ok) throw new Error(`${d.path}: ${res.status}`)
      return { filename, ...d, content: await res.text() }
    }),
  )
  const loaded = results.filter(r => r.status === 'fulfilled').map(r => r.value)
  const failed = results.filter(r => r.status === 'rejected').map(r => r.reason?.message)
  if (failed.length) console.error('Help docs failed to load:', failed)

  const context = loaded.map(doc => `
═══════════════════════════════════════════════════════════════
📄 ${doc.title}
Category: ${doc.category}
File: ${doc.filename}
═══════════════════════════════════════════════════════════════

${doc.content}
`).join('\n\n')

  const value = { context, loaded: loaded.length, expected: entries.length }
  cache[productCode] = { at: Date.now(), value }
  return value
}

// Rough cost per question with Gemini context caching (same formula as tbrunp).
export function estimateQueryCost(contextChars) {
  const contextTokens = Math.ceil(contextChars / 4)
  const perQuery =
    (contextTokens / 1_000_000) * 0.01875 + (50 / 1_000_000) * 0.075 + (300 / 1_000_000) * 0.3
  return { contextTokens, perQuery, perDollar: Math.floor(1 / perQuery) }
}
