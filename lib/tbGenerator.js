// ─── TB Generator — schema, prompt, and normalization ─────────────────────────
//
// The authoritative output structure is lib/barTemplateForAi.json: each JSON
// name is the field id and its value documents the population rule. Field
// lists and default rows are derived from it — to change the output shape,
// edit the template, not this file.
//
// Gemini is asked for SPARSE rows (only fields with meaningful values) to
// keep the response small; normalizeGeneratedData() expands every row to the
// full template shape with schema defaults.

import template from './barTemplateForAi.json'

const TIMEBARS_TEMPLATE = template.tbTimebars[0]
const METADATA_TEMPLATE = template.tbMetaData[0]

export const TB_TIMEBARS_FIELDS = Object.keys(TIMEBARS_TEMPLATE)
export const TB_METADATA_FIELDS = Object.keys(METADATA_TEMPLATE)

// Numeric fields — must be numbers, default 0, never null/"na" (schema §1.6)
const NUMERIC_FIELDS = [
  'tbCoordTop', 'kbCoordTop', 'kbCoordLeft', 'canvasNo',
  'tbDuration', 'tbRemainingDuration',
  'tbBudgetHours', 'tbWork', 'tbAWork', 'tbWorkRemaining',
  'tbBudgetCost', 'tbCost', 'tbCostRemaining', 'tbACost',
  'tbResID', 'tbBarHeight', 'tbPercentComplete',
  'tbCalendar', 'tbExpHoursPerWeek', 'tbPercentTimeOn', 'tbPayRate',
  'tbFloat', 'tbFreeFloat',
  'tbMDCostbarsScore',
]

// tbMetaData fields that must mirror their tbTimebars counterpart (per template)
const META_MIRRORS = {
  tbMDName:       'tbName',
  tbMDTypes:      'tbType',
  tbMDSubtype:    'tbSubType',
  tbMDCustomerID: 'tbCustomerID',
}

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

Read the customer documents below (markdown and/or CSV) plus the user's instructions, and produce project schedule data as a single JSON object with exactly two arrays: "tbTimebars" and "tbMetaData".

Respond with ONLY the JSON object — no prose, no markdown fences.

=== FIELD REFERENCE ===
The complete field catalogue for both tables. Each JSON name is a field id and its value describes the population rule ("not used, leave empty" fields must be omitted):
${JSON.stringify(template)}
=== END FIELD REFERENCE ===

=== OUTPUT SIZE — CRITICAL ===
Output SPARSE rows: include ONLY fields you have a meaningful value for (always include tbID, tbSelfKey2, tbName, tbType, tbStart, tbFinish). NEVER echo empty strings, zeros, or "not used" fields — every omitted field is filled with schema defaults automatically after you respond.

=== HIERARCHY RULES (up to 5 levels) ===
- L1 Portfolio (tbType "Portfolio") — root, tbSelfKey2 "".
- L2 Project (tbType "Project") — tbSelfKey2 = L1 tbID.
- L3 Sub-Project / Work Package (tbType "Sub-Project") — tbSelfKey2 = parent L2 tbID.
- L4 Task or Milestone (tbType "Task"/"Milestone") — tbSelfKey2 = immediate parent (L3 or L2) tbID.
- L5 Allocation (tbType "Allocation") — tbSelfKey2 = parent L4 tbID, requires tbResID, tbPayRate, tbPercentTimeOn, tbCalendar, tbWork, tbWorkRemaining, tbDuration, tbRemainingDuration, tbPercentComplete.
- Never skip levels; every tbSelfKey2 must resolve to an existing row at the correct parent level.
- Risks/Issues/CRs: tbSubType "Risk"/"Issue"/"CR" always rides on tbType "Task".

=== MANDATORY STRUCTURE ===
- Create exactly one L1 row named "Dummy Portfolio" (unless the documents clearly name a portfolio).
- Create exactly one L2 Project row under it. Take the project name from the user's instructions or the documents; fallback "New Project".
- If no dates/durations are available, L1 and L2 run from today (${start}) to 4 months out (${finish}). Children must fit inside their parent's date range; use durations from the data to place realistic start/finish dates in DD-MMM-YYYY format.

=== CSV HANDLING ===
A CSV document's first row contains column names matching tbTimebars/tbMetaData field names (match case-insensitively, e.g. TBID → tbID). Create one tbTimebars row per CSV data row.
- Columns starting with tbMD go into that row's tbMetaData record.
- A grouping column (e.g. "Sub-Project or WorkPackage") means: create one L3 Sub-Project row per distinct value under the L2 project, and attach each CSV row as an L4 Task under its group.
- Map near-miss columns sensibly (e.g. "tbBudget" → tbBudgetCost). Currency strings like "$4,000" become numbers (4000). Invent sensible schema-fitting values for anything missing.

=== PROJECT CHARTER / BUSINESS CASE MAPPING (when a markdown document is selected) ===
You are also an expert PMO analyst. The markdown document may be a Project Charter, a formal Business Case, a rough one with non-standard or missing headings, or just a few sentences. Distribute its content into the L2 Project row and that row's tbMetaData record BY MEANING, not by matching heading text — a section titled "Why now", "Rationale" or "The ask" still maps to Problem/Opportunity or Objectives. Headings are hints only, EXCEPT markdown "## " headings, which follow the MARKDOWN HEADING RULES below.
When BOTH a document and a CSV are selected: the document fills the L2 Project row's fields; the CSV produces the task rows beneath it.

Charter section -> field(s) (tbMD fields go on the Project's tbMetaData record):
- Purpose / justification          -> tbMDProblemOpportunity, tbMDBackgroundInfo
- Objectives & success criteria    -> tbMDObjectivesAndScope, tbMDSuccessCriteria, tbMDKeyProjectMetrics
- High-level requirements          -> tbMDCapabilitiesNeeded
- Description & boundaries (scope) -> tbMDScopeCommentary (plus tbMDObjectivesAndScope)
- High-level risks                 -> tbMDConsequence
- Summary milestone schedule       -> tbStart, tbFinish, tbDuration, tbMDScheduleCommentary
- Summary budget                   -> tbBudgetCost, tbMDBudgetCommentary, tbMDCostBenefitAnalysis, tbMDFinancialCommentary
- Expected benefits / value        -> tbMDExpectedBenefits, tbMDValueProposition
- Constraints & assumptions        -> tbMDConstraintsAssumptions
- Key stakeholders                 -> tbMDStakeholderDescription
- Sponsor & authority              -> tbMDExSponsor, tbMDSponsoringDepartment, tbMDSeniorLevelCommitment
- Approval requirements            -> tbMDDecisionsRequired
- Assigned Project Manager         -> tbMDPM
Supporting fields (fill ONLY when the source provides the content): tbMDNotesProject, tbMDOptionsAnalysis, tbMDKeyDependencies, tbMDMarketAnalysis, tbMDImplementationApproach, tbMDPrerequisitesChecklist, tbMDPortfolioImpactAnalysis, tbMDKeyRecommendations, tbMDNextSteps, tbMDWrittenBy, tbMDBusinessOwner, tbMDPrimaryContact, tbMDContactNumber, tbMDResourceCommentary, tbMDCharterDateApproved, tbMDVersion.

MARKDOWN HEADING RULES (when the document uses "## " headings):
- Treat each level-2 heading as ONE content block: ALL text under it, up to the next "## " heading, belongs together and must land in ONE field — tables, lists and sub-headings included, kept as markdown.
- Match a heading to a field by reading the field name's camel-case words: tbMDObjectivesAndScope reads as "Objectives And Scope", so "## Objectives", "## Scope" or "## Scope of Supply" all map to it. A heading matches a field when it shares a significant word with the field name (ignore case, singular/plural and filler words like "of", "the", "and").
- When SEVERAL headings map to the SAME field, APPEND them in source order, each block kept under its original heading.
- A heading that matches no field name is mapped BY MEANING using the table above; when still in doubt, use the COMMENTARY FIELD RULES or tbMDNotes.

COMMENTARY FIELD RULES (tbMDScheduleCommentary, tbMDBudgetCommentary, tbMDScopeCommentary, tbMDFinancialCommentary, tbMDResourceCommentary):
- NEVER write, author or invent content for these fields yourself.
- Use them ONLY to preserve source content that has no better field: date/milestone tables -> tbMDScheduleCommentary; budget assumptions -> tbMDBudgetCommentary; scope exclusions -> tbMDScopeCommentary; funding remarks -> tbMDFinancialCommentary; resourcing remarks -> tbMDResourceCommentary. Otherwise leave them out.

CATCH-ALL RULE (never drop the user's source text):
- Any document content you CANNOT confidently place in a field above must be preserved in the Project's tbMDNotes, each chunk under its own markdown heading (the source's own heading where it had one). Begin tbMDNotes with: "## Notes captured from the source (not mapped to a field)".
- Do NOT repeat in tbMDNotes content you already placed in a specific field. When unsure where text belongs, it goes in tbMDNotes rather than being lost.

INFERENCE & DEFAULTS (for the Project row):
- Clear professional language; you may tidy wording but NEVER add facts, names, dates or numbers the source does not support — leave a field out when the source says nothing about it.
- Dates: use the source's dates if given; else the default window above. tbDuration is WORK DAYS (calendar days × 5/7).
- Numeric fields are plain numbers — no $ signs, no commas. Budget/effort 0 when unknown.
- Investment picklist fields (tbMDInvestmentCategory / tbMDInvestmentObjective / tbMDInvestmentStrategy / tbMDInvestmentInitiative / tbMDProjectType): set ONLY when the source states them clearly.

=== tbMetaData ===
One record per tbTimebars row (strict one-to-one). tbMDID must exactly equal the row's tbID. Include tbMDID plus only meaningful fields (e.g. tbMDNotes, tbMDWBS, tbMDPhase from the data; a one-sentence descriptive note in tbMDNotes if the documents support it). Defaults (tbMDStatus "New", tbMDHealth "Not Assessed", mirrors of tbName/tbType) are applied automatically.

=== OUTPUT ORDER ===
tbTimebars rows in hierarchical display order: L1 first, then each branch top-down.

=== DOCUMENTS ===
${docsBlock}
=== END DOCUMENTS ===

User instructions: ${userPrompt}`
}

// ─── Normalization ────────────────────────────────────────────────────────────
//
// Deterministic post-processing so the download always honours the schema:
//   full-template expansion of sparse rows, canvasNo = 1, tbCoordTop stacking
//   (L1 = 100, +50 per row), orphan removal, numeric coercion (default 0),
//   null/undefined text → "", one-to-one tbMetaData with defaults + mirrors.

function toNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const n = parseFloat(String(value).replace(/[$,]/g, ''))
  return Number.isFinite(n) ? n : 0
}

// Expand a sparse row to the full template shape with typed defaults
function expandRow(row, fields) {
  const out = {}
  for (const field of fields) {
    const value = row?.[field]
    if (NUMERIC_FIELDS.includes(field)) {
      out[field] = value === undefined || value === null || value === '' ? 0 : toNumber(value)
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

  bars = bars.map(row => expandRow(row, TB_TIMEBARS_FIELDS))

  // Guarantee an L1 root exists
  if (!bars.some(b => b.tbType === 'Portfolio')) {
    bars.unshift(expandRow({
      tbID: 'GEN-L1', tbName: 'Dummy Portfolio', tbType: 'Portfolio',
      tbSelfKey2: '', tbStart: start, tbFinish: finish,
    }, TB_TIMEBARS_FIELDS))
    notes.push('Added missing L1 "Dummy Portfolio" root row.')
  }

  // Mandatory technical fields and date fallbacks
  bars.forEach(row => {
    row.canvasNo = 1
    DATE_FIELDS.forEach(f => { if (row[f] === undefined) row[f] = '' })
    if (!row.tbStart)  row.tbStart  = start
    if (!row.tbFinish) row.tbFinish = finish
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

  // One-to-one tbMetaData with defaults and template-mandated mirrors
  const metaById = new Map(
    metaIn.filter(m => m && m.tbMDID != null).map(m => [String(m.tbMDID), m])
  )
  let createdMeta = 0
  const tbMetaData = bars.map(bar => {
    const src = metaById.get(bar.tbID) || {}
    if (!metaById.has(bar.tbID)) createdMeta++
    const meta = expandRow(src, TB_METADATA_FIELDS)
    meta.tbMDID = bar.tbID
    meta.canvasNo = 1
    Object.entries(META_MIRRORS).forEach(([mdField, tbField]) => {
      meta[mdField] = bar[tbField]
    })
    if (!meta.tbMDStatus) meta.tbMDStatus = 'New'
    if (!meta.tbMDHealth) meta.tbMDHealth = 'Not Assessed'
    return meta
  })
  if (createdMeta > 0) notes.push(`Created ${createdMeta} missing tbMetaData record(s).`)

  return { data: { tbTimebars: bars, tbMetaData }, notes }
}
