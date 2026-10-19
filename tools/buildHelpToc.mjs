// tools/buildHelpToc.mjs - `npm run toc`
// Writes public/docsHelp/a1 TOC from the help registry (lib/help/helpDocs.js), which is the real
// table of contents. Edit the registry, then run this; never edit "a1 TOC" by hand.
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { PRODUCTS, librarySections, downloadsForProduct } from '../lib/help/helpDocs.js'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const OUT = path.join(ROOT, 'public', 'docsHelp', 'a1 TOC')

// History of documents that were merged or renamed. Kept so older notes can be traced.
const HISTORY = `# WHAT CHANGED, AND WHERE IT WENT

Documents that no longer exist, and the guide that absorbed each one. Use this when an
older note or an older complete guide refers to something not in the list above.

| Deleted document | Where its content is now |
|---|---|
| Innovations By Timebars Ltd | User Interface Guide — opening chapter, "Why These Products Work the Way They Do" |
| Product Design Strategy | the same chapter — the design-goals table and the roadmap note |
| timebars-data-schema (docsOther) | Data Model guide (field rules, mandatory fields, typing, coordinates, the Risk/Issue/CR convention); Sync guide (sheet layout, pre-import checks) |
| Configurable Data User Guide | Forms, Reports and Graphs Guide — Part B, plus Appendix A. Its "Values the code depends on" and "Status and health automation" went to the Data Model guide |
| MetaData Fields Detail Report | **Not replaced by a document.** Field definitions are live in the app: Report Menu → Other → Schema Values, which carries each field's purpose, picklist, type and sheet, and is searchable and filterable |
| Spreadsheet Sync / Data Management / Data Structure | Data Synchronization, Backup, Recovery and Retention User Guide |
| FOCD Forms / Picklists and Tagging / Configurable Items / Picklist Values Locked By Code | Forms, Reports and Graphs Guide — Part B |
| Kanban Primer | Agilebars User Guide |
| The four Costbars PPM documents | Costbars User Guide |
| Data Migration Assistance | Getting Started — folded in as its data-migration chapter |

Two guides were renamed. Older references to *Local Reports and Graphs Guide* mean
**Forms, Reports and Graphs Guide**; references to *Synchronization and Data Control
User Guide* mean **Data Synchronization, Backup, Recovery and Retention User Guide**.`

const lines = [
  '# Timebars Ltd. Help Files',
  '',
  'Generated from lib/help/helpDocs.js by `npm run toc` - do not edit by hand.',
  '',
  'helpapp (tbhelp) is the master of the help files: public/docsHelp/. Every file listed is',
  'current. Superseded documents were deleted, not archived; the full history is in git.',
  'The library at /help shows the same lists, one tab per product.',
  '',
]

for (const [code, name] of Object.entries(PRODUCTS)) {
  lines.push(`## ${name} (${code})`, '')
  for (const s of librarySections(code)) {
    lines.push(`### ${s.title}`, '')
    for (const g of s.guides) lines.push(`- ${g.title} - \`${g.file}\``)
    lines.push('')
  }
  lines.push('### Downloads', '')
  for (const d of downloadsForProduct(code)) lines.push(`- ${d.title} - \`${d.href}\``)
  lines.push('')
}

lines.push(
  '---',
  '',
  HISTORY,
  '',
  '---',
  '',
  '# HOW THE COMPLETE REFERENCE GUIDES ARE MADE',
  '',
  'Run `python3 tools/buildCompleteGuides.py` in this repo. It compiles the three',
  '*_Complete_Reference_Guide.md files from the guides above; its RECIPES list says which guides go',
  'into each. The PDFs in public/pdf/ are then made from them by hand and are what /help offers.',
  '',
  '**Generated content:** Appendix A of the Forms, Reports and Graphs Guide (the A-Z picklist',
  'reference) is produced from live app data by tbrunp `tools/buildPicklistReference.py`; paste its',
  'output into the guide rather than editing that appendix by hand.',
  '',
)

writeFileSync(OUT, lines.join('\n'), 'utf8')
console.log(`Wrote ${path.relative(ROOT, OUT)}`)
