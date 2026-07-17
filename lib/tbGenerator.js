// ─── TB Generator — schema, prompt, and normalization ─────────────────────────
//
// Single source of truth for the Timebars data-generation rules.
// When the official JSON output template is finalised, update the field
// lists and GENERATION_RULES below — nothing else needs to change.

// ─── Field registry (from the Timebars data model) ────────────────────────────

export const TB_TIMEBARS_FIELDS = [
  'tbID', 'tbSelfKey2', 'tbName', 'tbType', 'tbSubType',
  'tbCoordTop', 'tbCoordLeft', 'kbCoordTop', 'kbCoordLeft', 'canvasNo',
  'tbStart', 'tbFinish', 'tbAStart', 'tbAFinish',
  'tbDuration', 'tbRemainingDuration',
  'tbWork', 'tbAWork', 'tbWorkRemaining',
  'tbBudgetHours', 'tbBudgetCost', 'tbCost', 'tbCostRemaining', 'tbACost',
  'tbPercentComplete', 'tbResID', 'tbOwner', 'tbBarHeight',
  'tbPredecessor', 'tbConstraintType', 'tbConstraintDate',
  'tbFloat', 'tbFreeFloat', 'tbStatus',
  'tbL1', 'tbL2', 'tbL3', 'tbL4', 'tbL5', 'tbHierarchyOrder',
]

export const TB_METADATA_FIELDS = [
  'tbMDID', 'tbMDName', 'tbMDStatus', 'tbMDHealth', 'tbMDPriority', 'tbMDDescription',
]

// Numeric fields — must be numbers, default 0, never null/"na" (schema §1.6)
const NUMERIC_FIELDS = [
  'tbWork', 'tbAWork', 'tbWorkRemaining',
  'tbCost', 'tbACost', 'tbCostRemaining', 'tbBudgetCost', 'tbBudgetHours',
  'tbDuration', 'tbRemainingDuration', 'tbPercentComplete',
  'tbPayRate', 'tbPercentTimeOn', 'tbCalendar',
  'tbCoordTop', 'kbCoordTop', 'tbResID', 'tbBarHeight', 'tbFloat', 'tbFreeFloat',
]

// Date fields — DD-MMM-YYYY strings (schema §1.6)
const DATE_FIELDS = ['tbStart', 'tbFinish', 'tbAStart', 'tbAFinish']

const L1_COORD_TOP_DEFAULT = 100
const COORD_TOP_STEP       = 50

// ─── Date helpers ─────────────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatTbDate(date) {
  const dd = String(date.getDate()).padStart(2, '0')
  return `${dd}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`
}

export function defaultDateRange() {
  const start  = new Date()
  const finish = new Date(start)
  finish.setMonth(finish.getMonth() + 4)
  return { start: formatTbDate(start), finish: formatTbDate(finish) }
}

// ─── Generation prompt ────────────────────────────────────────────────────────

export function buildGeneratorPrompt(userPrompt, docsBlock) {
  const { start, finish } = defaultDateRange()

  return `You are a data-generation assistant for Timebars, a project management application by Timebars Ltd.

Your job: read the customer documents below (markdown and/or CSV) plus the user's instructions, and produce project schedule data as a single JSON object with exactly two arrays: "tbTimebars" and "tbMetaData".

Respond with ONLY the JSON object — no prose, no markdown fences.

=== DATA MODEL RULES ===

HIERARCHY (up to 5 levels):
- L1 Portfolio/Program (tbType "Portfolio") — root node, tbSelfKey2 is "".
- L2 Project (tbType "Project") — tbSelfKey2 = the L1 tbID.
- L3 Sub-Project / Work Package (tbType "Sub-Project") — tbSelfKey2 = parent L2 tbID.
- L4 Task or Milestone (tbType "Task" or "Milestone") — tbSelfKey2 = immediate parent (L3 or L2) tbID.
- L5 Resource Allocation (tbType "Allocation") — tbSelfKey2 = parent L4 tbID, plus a valid tbResID. Also requires tbPayRate, tbPercentTimeOn, tbCalendar, tbWork, tbWorkRemaining, tbDuration, tbRemainingDuration, tbPercentComplete.
- Never skip levels. Never create a tbSelfKey2 that does not resolve to an existing row at the correct parent level.

MANDATORY STRUCTURE:
- ALWAYS create exactly one L1 row with tbName "Dummy Portfolio" (unless the documents clearly define a portfolio name).
- ALWAYS create exactly one L2 Project row under it. Take the project name from the user's instructions or the documents; if neither provides one, use "New Project".
- If no dates or durations are available from the documents, the L1 and L2 rows start today (${start}) and finish 4 months later (${finish}).
- If a CSV document is provided: its first row contains column names matching tbTimebars field names. Create one tbTimebars row per CSV data row, mapping columns to fields as name/value pairs, and invent sensible values that fit the schema for anything missing. Attach these rows at the correct hierarchy level under the L2 project (default: L3 work packages, or the level implied by the data).

MANDATORY FIELDS (every tbTimebars row):
- tbID: unique alphanumeric identifier (e.g. "GEN-01", "GEN-02", ...).
- tbName: human-readable label.
- tbStart / tbFinish: planned dates as DD-MMM-YYYY strings (e.g. "15-Jan-2026"). Children must fit within their parent's date range.
- tbType: one of Portfolio, Project, Sub-Project, Task, Milestone, Allocation.
- tbSelfKey2: parent row's tbID ("" only for the L1 root).
- canvasNo: always 1.
- tbCoordTop: L1 row = ${L1_COORD_TOP_DEFAULT}; each subsequent row adds ${COORD_TOP_STEP} in display order.

FIELD TYPES:
- Numeric fields (${NUMERIC_FIELDS.slice(0, 15).join(', ')}, ...): numbers, default 0, never null or "na".
- Date fields (tbStart, tbFinish, tbAStart, tbAFinish): DD-MMM-YYYY strings; use "" for unknown actuals.
- Text fields: "" when empty, never null.

RISKS / ISSUES / CHANGE REQUESTS:
- tbSubType "Risk", "Issue", or "CR" always rides on tbType "Task".

tbMetaData (one record per tbTimebars row, strict one-to-one):
- tbMDID: must exactly match the tbTimebars tbID.
- tbMDName: same as tbName.
- tbMDStatus: default "New". tbMDHealth: default "Not Assessed". tbMDPriority: default "Not Assessed".
- tbMDDescription: a one-sentence description drawn from the documents where possible, else "".

OUTPUT ORDER: rows in tbTimebars must be in hierarchical display order (L1 first, then each branch top-down).

=== DOCUMENTS ===
${docsBlock}
=== END DOCUMENTS ===

User instructions: ${userPrompt}`
}

// ─── Normalization ────────────────────────────────────────────────────────────
//
// Deterministic post-processing of the AI response so the download always
// honours the schema, whatever the model returned:
//   §1.3  canvasNo = 1, tbCoordTop stacking (L1 = 100, +50 per row)
//   §1.5  drop rows whose tbSelfKey2 doesn't resolve (orphans)
//   §1.6  numeric coercion (default 0), null/undefined text → ""
//   §1.4/§1.7  one-to-one tbMetaData with defaults

function toNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const n = parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

function normalizeRow(row, allowedFields) {
  const out = {}
  for (const field of allowedFields) {
    const value = row[field]
    if (NUMERIC_FIELDS.includes(field)) {
      out[field] = toNumber(value)
    } else if (value === null || value === undefined) {
      out[field] = ''
    } else {
      out[field] = String(value)
    }
  }
  return out
}

export function normalizeGeneratedData(raw) {
  const notes = []
  const { start, finish } = defaultDateRange()

  let bars = Array.isArray(raw?.tbTimebars) ? raw.tbTimebars : []
  const metaIn = Array.isArray(raw?.tbMetaData) ? raw.tbMetaData : []

  bars = bars.map(row => normalizeRow(row, TB_TIMEBARS_FIELDS))

  // Guarantee an L1 root exists
  if (!bars.some(b => b.tbType === 'Portfolio')) {
    bars.unshift(normalizeRow({
      tbID: 'GEN-L1', tbName: 'Dummy Portfolio', tbType: 'Portfolio',
      tbSelfKey2: '', tbStart: start, tbFinish: finish, tbStatus: 'Active',
    }, TB_TIMEBARS_FIELDS))
    notes.push('Added missing L1 "Dummy Portfolio" root row.')
  }

  // Mandatory technical fields and date fallbacks
  bars.forEach(row => {
    row.canvasNo = 1
    DATE_FIELDS.forEach(f => { if (row[f] === undefined) row[f] = '' })
    if (!row.tbStart)  row.tbStart  = start
    if (!row.tbFinish) row.tbFinish = finish
    if (!row.tbStatus) row.tbStatus = 'Active'
  })

  // Drop orphaned rows (tbSelfKey2 that doesn't resolve — schema §1.5)
  const ids = new Set(bars.map(b => b.tbID))
  const kept = bars.filter(b => b.tbSelfKey2 === '' || ids.has(b.tbSelfKey2))
  if (kept.length < bars.length) {
    notes.push(`Removed ${bars.length - kept.length} orphaned row(s) with unresolved tbSelfKey2.`)
  }
  bars = kept

  // tbCoordTop stacking: L1 = 100, each row below adds 50, in array order
  bars.forEach((row, i) => {
    row.tbCoordTop = L1_COORD_TOP_DEFAULT + i * COORD_TOP_STEP
    row.kbCoordTop = row.tbCoordTop
  })

  // One-to-one tbMetaData with defaults
  const metaById = new Map(
    metaIn.filter(m => m && m.tbMDID != null).map(m => [String(m.tbMDID), m])
  )
  let createdMeta = 0
  const tbMetaData = bars.map(bar => {
    const src = metaById.get(bar.tbID) || {}
    if (!metaById.has(bar.tbID)) createdMeta++
    const meta = normalizeRow(src, TB_METADATA_FIELDS)
    meta.tbMDID = bar.tbID
    if (!meta.tbMDName)     meta.tbMDName     = bar.tbName
    if (!meta.tbMDStatus)   meta.tbMDStatus   = 'New'
    if (!meta.tbMDHealth)   meta.tbMDHealth   = 'Not Assessed'
    if (!meta.tbMDPriority) meta.tbMDPriority = 'Not Assessed'
    return meta
  })
  if (createdMeta > 0) notes.push(`Created ${createdMeta} missing tbMetaData record(s).`)

  return { data: { tbTimebars: bars, tbMetaData }, notes }
}
