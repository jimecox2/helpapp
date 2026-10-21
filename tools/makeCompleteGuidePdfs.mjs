// Make the three Complete Reference Guide PDFs in public/pdf from the .md files that
// tools/buildCompleteGuides.py writes. Run after that script:
//   node tools/makeCompleteGuidePdfs.mjs
// Needs pandoc and Playwright with a Chromium (CHROMIUM_PATH, default /opt/pw-browsers/chromium,
// which a Claude Code cloud session has). Not a project dependency: install Playwright where you run it.
// Images are read from public/images, so no network is needed. A4, page numbers and version in the footer.
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CHROMIUM = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium'
const css = `
body{font-family:'DejaVu Sans',Arial,sans-serif;font-size:10.5pt;line-height:1.45;color:#1f2937;max-width:none;margin:0}
h1{font-size:20pt;color:#1e3a8a;border-bottom:2px solid #1e3a8a;padding-bottom:4px;page-break-before:always;margin-top:0}
h1:first-of-type{page-break-before:avoid}
h2{font-size:15pt;color:#1e3a8a;margin-top:1.4em;page-break-after:avoid}
h3{font-size:12.5pt;color:#1f2937;page-break-after:avoid}
h4,h5,h6{font-size:11pt;page-break-after:avoid}
a{color:#1d4ed8;text-decoration:none}
code{font-family:'DejaVu Sans Mono',monospace;font-size:9pt;background:#f1f5f9;padding:0 3px;border-radius:3px}
pre{background:#f1f5f9;padding:8px;border-radius:4px;white-space:pre-wrap;word-break:break-word;font-size:8.5pt}
pre code{background:none;padding:0}
table{border-collapse:collapse;width:100%;margin:8px 0;font-size:9pt;page-break-inside:auto}
th,td{border:1px solid #cbd5e1;padding:4px 6px;vertical-align:top;text-align:left}
th{background:#e2e8f0}
tr{page-break-inside:avoid}
img{max-width:100%;height:auto}
blockquote{border-left:4px solid #93c5fd;margin:8px 0;padding:2px 12px;color:#334155;background:#f8fafc}
hr{border:none;border-top:1px solid #cbd5e1}
`
const b = await chromium.launch({ executablePath: CHROMIUM })
for (const prod of ['Agilebars', 'Timebars', 'Costbars']) {
  const md = `${ROOT}/public/docsHelp/${prod}_Complete_Reference_Guide.md`
  const text = fs.readFileSync(md, 'utf8')
  const version = (text.match(/\*\*Version\*\*: ([\d.]+)/) || [])[1] || ''
  const updated = (text.match(/\*\*Last Updated\*\*: ([\d-]+)/) || [])[1] || ''
  let html = execFileSync('pandoc', ['-f', 'gfm', '-t', 'html5', md], { maxBuffer: 1 << 28 }).toString()
  html = html.replace(/src="https:\/\/help\.timebars\.com\/images\//g, `src="file://${ROOT}/public/images/`)
  const out = path.join(os.tmpdir(), `${prod}_Complete_Reference_Guide.html`)
  fs.writeFileSync(out, `<!doctype html><html><head><meta charset="utf-8"><title>${prod} — Complete Reference Guide</title><style>${css}</style></head><body>${html}</body></html>`)
  const p = await b.newPage()
  await p.goto(`file://${out}`, { waitUntil: 'load', timeout: 120000 })
  await p.pdf({
    path: `${ROOT}/public/pdf/${prod}_Complete_Reference_Guide.pdf`, format: 'A4', printBackground: true,
    margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' }, displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `<div style="font-size:8px;width:100%;padding:0 16mm;color:#64748b;display:flex;justify-content:space-between"><span>${prod} — Complete Reference Guide · v${version} · ${updated}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  })
  await p.close(); console.log(prod, 'done')
}
await b.close()
