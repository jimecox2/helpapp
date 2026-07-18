import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { getModelById, DEFAULT_MODEL_ID } from '@/config/ai'
import { buildGeneratorPrompt, normalizeGeneratedData } from '@/lib/tbGenerator'

// POST /api/generate
//
// Body: { docPaths: string[], userPrompt: string, modelId?: string }
//   docPaths — public URLs under /customers/ (as returned by /api/customer-docs)
//
// Reads the selected .md/.csv documents server-side, sends them to Gemini with
// the Timebars data-model rules, normalizes the response, and returns
// { success, data: { tbTimebars, tbMetaData }, notes }.

export const dynamic = 'force-dynamic'

const CUSTOMERS_ROOT = path.resolve(process.cwd(), 'public', 'customers')
const SUPPORTED_EXTS = ['.md', '.csv']

async function readSelectedDocs(docPaths) {
  const docs = []
  const skipped = []

  for (const docPath of docPaths) {
    const rel = String(docPath).replace(/^\/+/, '')
    const abs = path.resolve(process.cwd(), 'public', rel)
    // Only files inside public/customers may be read
    if (!abs.startsWith(CUSTOMERS_ROOT + path.sep)) {
      skipped.push(`${docPath} (outside /customers)`)
      continue
    }
    const ext = path.extname(abs).toLowerCase()
    if (!SUPPORTED_EXTS.includes(ext)) {
      skipped.push(`${path.basename(abs)} (only .md and .csv are supported for now)`)
      continue
    }
    try {
      const content = await fs.readFile(abs, 'utf8')
      docs.push({ name: path.basename(abs), ext, content })
    } catch {
      skipped.push(`${path.basename(abs)} (could not be read)`)
    }
  }

  return { docs, skipped }
}

function docKind(doc) {
  if (doc.ext === '.csv') return 'CSV — first row is tbTimebars field names'
  if (/risk/i.test(doc.name)) return 'RISK LIST — standalone list of known risks, see RISK EXTRACTION'
  return 'Markdown — charter / business case'
}

function buildDocsBlock(docs) {
  return docs.map(doc =>
    `═══════════════════════════════════════\n` +
    `📄 ${doc.name} (${docKind(doc)})\n` +
    `═══════════════════════════════════════\n\n${doc.content}\n`
  ).join('\n\n')
}

// Generation needs far more output headroom than chat: rows are wide and a
// CSV can produce 40+ of them. Thinking is disabled so the whole budget goes
// to the JSON itself.
const GEN_MAX_OUTPUT_TOKENS = 65536

// Forgiving JSON parse (pattern from the aiCreateWbs worker): strip fences,
// drop trailing commas, and as a last resort salvage the complete rows from a
// response truncated mid-object.
function tryParseJSONLoose(text) {
  const cleaned = String(text)
    .replace(/```json\s*([\s\S]*?)```/gi, '$1')
    .replace(/```([\s\S]*?)```/g, '$1')
    .trim()
  try { return JSON.parse(cleaned) } catch { /* next */ }
  const noTrailingCommas = cleaned.replace(/,\s*([}\]])/g, '$1')
  try { return JSON.parse(noTrailingCommas) } catch { /* next */ }
  const first = cleaned.indexOf('{')
  const last  = cleaned.lastIndexOf('}')
  if (first !== -1 && last > first) {
    try { return JSON.parse(cleaned.slice(first, last + 1)) } catch { /* next */ }
  }
  const salvaged = salvageTruncatedArrays(cleaned)
  if (salvaged) {
    try { return JSON.parse(salvaged) } catch { /* fall through */ }
  }
  return null
}

// Rebuild valid JSON from a response truncated inside the tbTimebars/
// tbMetaData arrays: walk the text tracking string/brace depth, cut at the
// last fully closed row object, and re-close the open arrays and root.
function salvageTruncatedArrays(text) {
  const start = text.indexOf('{')
  if (start === -1) return null
  let depth = 0, inStr = false, esc = false, lastCompleteRow = -1
  for (let i = start; i < text.length; i++) {
    const ch = text[i]
    if (inStr) {
      if (esc) esc = false
      else if (ch === '\\') esc = true
      else if (ch === '"') inStr = false
      continue
    }
    if (ch === '"') { inStr = true; continue }
    if (ch === '[' || ch === '{') depth++
    else if (ch === ']' || ch === '}') {
      depth--
      if (depth === 0) return null // fully closed — plain parse should have worked
      if (depth === 2) lastCompleteRow = i // a row object inside a table array just closed
    }
  }
  if (lastCompleteRow === -1) return null
  return text.slice(0, lastCompleteRow + 1) + ']}'
}

// Streaming endpoint (SSE): the non-streaming generateContent endpoint closes
// the connection at ~60s with nothing sent ("other side closed") when a large
// generation takes longer than that. With streamGenerateContent tokens flow as
// they are produced, so long generations complete.
async function callGeminiJson(prompt, model) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment')

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model.geminiModel}:streamGenerateContent?alt=sse&key=${apiKey}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 300000) // 5 min hard cap

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature:      model.temperature,
          maxOutputTokens:  GEN_MAX_OUTPUT_TOKENS,
          responseMimeType: 'application/json',
          thinkingConfig:   { thinkingBudget: 0 },
        },
      }),
    })

    if (!res.ok) {
      const errBody = await res.text().catch(() => '')
      console.error('Gemini HTTP', res.status, errBody.slice(0, 2000))
      let message = `Gemini API error: HTTP ${res.status}`
      try {
        const parsed = JSON.parse(errBody)
        message = (Array.isArray(parsed) ? parsed[0] : parsed)?.error?.message || message
      } catch { /* keep default */ }
      throw new Error(message)
    }

    // Accumulate the SSE stream: lines of "data: {chunk}"
    let text = ''
    let finishReason = null
    let blockReason  = null
    const raw = await res.text()
    for (const line of raw.split('\n')) {
      const t = line.trim()
      if (!t.startsWith('data:')) continue
      const payload = t.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      try {
        const chunk = JSON.parse(payload)
        const cand = chunk?.candidates?.[0]
        for (const p of cand?.content?.parts || []) text += p.text || ''
        if (cand?.finishReason) finishReason = cand.finishReason
        if (chunk?.promptFeedback?.blockReason) blockReason = chunk.promptFeedback.blockReason
      } catch { /* skip malformed chunk */ }
    }

    if (!text) {
      console.error('Gemini empty stream:', raw.slice(0, 2000))
      const blocked = blockReason || finishReason
      throw new Error(`Gemini returned an empty response${blocked ? ` (${blocked})` : ''}`)
    }

    const parsed = tryParseJSONLoose(text)
    if (parsed) return parsed

    console.error('Gemini unparseable JSON (finishReason:', finishReason, '):', text.slice(0, 2000))
    if (finishReason === 'MAX_TOKENS') {
      throw new Error('Gemini\'s response was cut off at the output limit — try selecting fewer documents or a smaller CSV')
    }
    throw new Error('Gemini did not return valid JSON — please try again')
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Gemini took longer than 5 minutes — try selecting fewer documents or a smaller CSV')
    }
    if (error.message?.includes('fetch failed') || error.cause) {
      const detail = error.cause?.code || error.cause?.message || ''
      throw new Error(`Network error calling Gemini${detail ? ` (${detail})` : ''} — check your connection and try again`)
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { docPaths, userPrompt, modelId } = body || {}

    if (!userPrompt || !String(userPrompt).trim()) {
      return NextResponse.json({ success: false, error: 'A prompt is required' }, { status: 400 })
    }
    if (!Array.isArray(docPaths) || docPaths.length === 0) {
      return NextResponse.json({ success: false, error: 'Select at least one document' }, { status: 400 })
    }
    if (docPaths.length > 3) {
      return NextResponse.json(
        { success: false, error: 'Select at most three items — one CSV of tasks, one charter/business-case document, and one risk file ("risk" in the file name)' },
        { status: 400 }
      )
    }

    const { docs, skipped } = await readSelectedDocs(docPaths)
    const csvCount  = docs.filter(d => d.ext === '.csv').length
    const mdDocs    = docs.filter(d => d.ext === '.md')
    const riskCount = mdDocs.filter(d => /risk/i.test(d.name)).length
    const plainMd   = mdDocs.length - riskCount
    if (csvCount > 1) {
      return NextResponse.json({ success: false, error: 'Select at most one CSV file' }, { status: 400 })
    }
    if (riskCount > 1) {
      return NextResponse.json({ success: false, error: 'Select at most one risk file' }, { status: 400 })
    }
    if (plainMd > 1) {
      return NextResponse.json(
        { success: false, error: 'Select at most one charter/business-case document — a second markdown file must have "risk" in its file name' },
        { status: 400 }
      )
    }
    if (docs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'None of the selected documents could be processed (only .md and .csv are supported for now)' },
        { status: 400 }
      )
    }

    const model = getModelById(modelId || DEFAULT_MODEL_ID)
    if (model.provider !== 'gemini') {
      return NextResponse.json(
        { success: false, error: 'Data generation currently supports Gemini models only' },
        { status: 400 }
      )
    }

    const prompt = buildGeneratorPrompt(String(userPrompt).trim(), buildDocsBlock(docs))
    const raw = await callGeminiJson(prompt, model)
    const { data, notes } = normalizeGeneratedData(raw)

    if (skipped.length > 0) notes.unshift(`Skipped: ${skipped.join('; ')}`)

    return NextResponse.json({ success: true, data, notes })
  } catch (error) {
    console.error('generate failed:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Generation failed' },
      { status: 500 }
    )
  }
}
