import { NextResponse } from 'next/server'
import { getModelById, OLLAMA_HOST } from '@/config/ai'

function buildSystemPrompt(productCode) {
  const productNames = { TB: 'Timebars', AB: 'Agilebars', CB: 'Costbars' }
  const product = productNames[productCode] || 'the product'
  return (
    `You are a helpful support assistant for ${product}, a project management application by Timebars Ltd. ` +
    `Answer the user's question using ONLY the documentation provided below. ` +
    `If the answer is not in the documentation, say so clearly — do not make up information. ` +
    `Format your answers using markdown where helpful (bullet points, bold, code blocks). ` +
    `Be concise but complete.`
  )
}

async function callGemini(systemPrompt, userQuestion, docsContext, model) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment')

  const trimmedDocs = docsContext.length > model.maxDocsChars
    ? docsContext.slice(0, model.maxDocsChars) + '\n\n[Documentation trimmed]'
    : docsContext

  const fullPrompt =
    `${systemPrompt}\n\n` +
    `=== DOCUMENTATION ===\n${trimmedDocs}\n` +
    `=== END DOCUMENTATION ===\n\n` +
    `User question: ${userQuestion}`

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model.geminiModel}:generateContent?key=${apiKey}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature:     model.temperature,
        maxOutputTokens: model.maxOutputTokens,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Gemini API error: HTTP ${res.status}`)
  }

  const data = await res.json()
  const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!answer) throw new Error('Gemini returned an empty response')
  return answer
}

async function callOllama(systemPrompt, userQuestion, docsContext, model) {
  const { ollamaModel, num_ctx, maxDocsChars, timeoutMs, temperature } = model

  const trimmedDocs = docsContext.length > maxDocsChars
    ? docsContext.slice(0, maxDocsChars) + '\n\n[Documentation trimmed to fit local model context]'
    : docsContext

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model:  ollamaModel,
        stream: false,
        messages: [
          {
            role: 'system',
            content:
              `${systemPrompt}\n\n` +
              `=== DOCUMENTATION ===\n${trimmedDocs}\n` +
              `=== END DOCUMENTATION ===`,
          },
          { role: 'user', content: userQuestion },
        ],
        options: { temperature, num_ctx },
      }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Ollama error: HTTP ${res.status}${text ? ' — ' + text : ''}`)
    }

    const data = await res.json()
    const answer = data?.message?.content
    if (!answer) throw new Error('Ollama returned an empty response')
    return answer

  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(
        `Local AI timed out after ${Math.round(timeoutMs / 1000)}s — ` +
        `the model may be busy or overloaded`
      )
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export async function POST(request) {
  try {
    const { userQuestion, productCode, docsContext, modelId } = await request.json()

    if (!userQuestion?.trim()) {
      return NextResponse.json({ success: false, error: 'No question provided' }, { status: 400 })
    }

    const model = getModelById(modelId)
    const systemPrompt = buildSystemPrompt(productCode)

    const answer = model.provider === 'ollama'
      ? await callOllama(systemPrompt, userQuestion, docsContext, model)
      : await callGemini(systemPrompt, userQuestion, docsContext, model)

    return NextResponse.json({ success: true, answer })

  } catch (error) {
    console.error('[/api/chat]', error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
