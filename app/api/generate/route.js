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

function buildDocsBlock(docs) {
  return docs.map(doc =>
    `═══════════════════════════════════════\n` +
    `📄 ${doc.name} (${doc.ext === '.csv' ? 'CSV — first row is tbTimebars field names' : 'Markdown'})\n` +
    `═══════════════════════════════════════\n\n${doc.content}\n`
  ).join('\n\n')
}

// Generation needs far more output headroom than chat: rows are wide and a
// CSV can produce 40+ of them. Thinking is disabled so the whole budget goes
// to the JSON itself.
const GEN_MAX_OUTPUT_TOKENS = 32768

async function callGeminiJson(prompt, model) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment')

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model.geminiModel}:generateContent?key=${apiKey}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Gemini API error: HTTP ${res.status}`)
  }

  const data = await res.json()
  const candidate = data?.candidates?.[0]
  const text = candidate?.content?.parts?.map(p => p.text || '').join('')
  if (!text) throw new Error('Gemini returned an empty response')

  // Strip fences, then parse; fall back to the outermost {...} block
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
  try {
    return JSON.parse(cleaned)
  } catch {
    const first = cleaned.indexOf('{')
    const last  = cleaned.lastIndexOf('}')
    if (first !== -1 && last > first) {
      try { return JSON.parse(cleaned.slice(first, last + 1)) } catch { /* fall through */ }
    }
    if (candidate?.finishReason === 'MAX_TOKENS') {
      throw new Error('Gemini\'s response was cut off at the output limit — try selecting fewer documents or a smaller CSV')
    }
    throw new Error('Gemini did not return valid JSON — please try again')
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
    if (docPaths.length > 2) {
      return NextResponse.json(
        { success: false, error: 'Select at most two items — one CSV of tasks and one charter/business-case document' },
        { status: 400 }
      )
    }

    const { docs, skipped } = await readSelectedDocs(docPaths)
    const csvCount = docs.filter(d => d.ext === '.csv').length
    const mdCount  = docs.filter(d => d.ext === '.md').length
    if (csvCount > 1 || mdCount > 1) {
      return NextResponse.json(
        { success: false, error: 'Select at most one CSV and one markdown document' },
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
