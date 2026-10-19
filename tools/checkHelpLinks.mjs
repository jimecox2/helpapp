// tools/checkHelpLinks.mjs - `npm run check:help`
// Fails when the help registry or a link in a help file points at something that is not there:
// a registry path or download with no file, a link to another guide that is not a file in
// public/docsHelp, a #anchor with no matching heading, or an image or download path with no file.
// Run it after editing a help file; it reads files only (no network).
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { HELP_GUIDES, HELP_DOWNLOADS } from '../lib/help/helpDocs.js'
import { renderGuide } from '../lib/help/renderGuide.js'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const PUBLIC = path.join(ROOT, 'public')
const DOCS = path.join(PUBLIC, 'docsHelp')

const problems = []
const files = readdirSync(DOCS).filter(f => f.endsWith('.md') && !f.includes('_Complete_Reference_Guide'))

for (const g of HELP_GUIDES) if (!existsSync(path.join(DOCS, g.file))) problems.push(`registry: ${g.file} not found`)
for (const d of HELP_DOWNLOADS) if (!existsSync(path.join(PUBLIC, d.href))) problems.push(`registry: download ${d.href} not found`)
for (const f of files) if (!HELP_GUIDES.some(g => g.file === f)) problems.push(`registry: ${f} is in docsHelp but not in the registry`)

const source = Object.fromEntries(files.map(f => [f, readFileSync(path.join(DOCS, f), 'utf8')]))
const anchors = Object.fromEntries(
  files.map(f => [f, new Set([...renderGuide(source[f]).html.matchAll(/<h\d id="([^"]*)"/g)].map(m => m[1]))]),
)

// Links outside fenced code blocks: [text](target) and ![alt](target)
const LINK = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
for (const f of files) {
  const text = source[f].replace(/```[\s\S]*?```/g, '')
  for (const [, target] of text.matchAll(LINK)) {
    const [file, hash] = target.split('#')
    if (/^[A-Za-z0-9_]+\.md$/.test(file)) {
      if (!anchors[file]) problems.push(`${f}: link to missing guide ${file}`)
      else if (hash && !anchors[file].has(hash)) problems.push(`${f}: ${file}#${hash} - no such heading`)
    } else if (file === '' && hash) {
      if (!anchors[f].has(hash)) problems.push(`${f}: #${hash} - no such heading`)
    } else if (file.startsWith('/') && !existsSync(path.join(PUBLIC, decodeURI(file)))) {
      problems.push(`${f}: ${file} - no such file in public/`)
    } else if (!/^(https?:|mailto:|\/)/.test(file)) {
      problems.push(`${f}: ${target} - not a guide, site path or web link`)
    }
  }
}

if (problems.length) {
  console.error(`Help check: ${problems.length} problem(s)\n  ` + problems.join('\n  '))
  process.exit(1)
}
console.log(`Help check: ${files.length} guides, all links and anchors resolve.`)
