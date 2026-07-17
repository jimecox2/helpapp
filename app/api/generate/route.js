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

// Gemini in JSON mode; fences stripped as a fallback for models that add them
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
        maxOutputTokens:  model.maxOutputTokens,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Gemini API error: HTTP ${res.status}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini returned an empty response')

  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
  try {
    return JSON.parse(cleaned)
  } catch {
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

    const { docs, skipped } = await readSelectedDocs(docPaths)
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
