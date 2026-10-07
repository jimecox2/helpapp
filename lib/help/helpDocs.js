// lib/help/helpDocs.js
// Help-document registry and loader for the Ask AI help page (/help).
// Ported from tbrunp scripts/ai/helpDocsLoader.js. The registry is a copy of tbrunp's: when the
// help files change there (tbrunp is the master, the owner copies them to public/docsHelp/),
// copy the HELP_DOCS block over too. Every path must exist in public/docsHelp/.

export const PRODUCTS = {
  TB: 'Timebars',
  AB: 'Agilebars',
  CB: 'Costbars',
}

export const HELP_DOCS = {

  // ═══════════════════════════════════════════════════════════════
  // COMMON - All Products (12 files)
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
