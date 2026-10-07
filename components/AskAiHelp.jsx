'use client'

// Ask AI help assistant — the full-page version of the "Ask AI" box in the Timebars apps
// (tbrunp scripts/ai/askHelp.js). Same documents, same route (/api/ai/help) and the same
// request/response JSON; the product is picked with tabs instead of read from IndexedDB.

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { Bot, User, Send, Trash2, Copy, CheckCheck, AlertCircle, Loader2 } from 'lucide-react'
import { PRODUCTS, loadProductDocs, estimateQueryCost } from '@/lib/help/helpDocs'
import { cn } from '@/lib/utils'

const MAX_HISTORY_ITEMS = 10
const HISTORY_KEY = 'helpAiHistory'
const PRODUCT_KEY = 'helpAiProduct'

const readStore = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
const writeStore = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage blocked */ }
}

const renderMarkdown = text => DOMPurify.sanitize(marked.parse(text || ''))

function errorText(err) {
  const msg = err?.message || ''
  if (msg.includes('429') || /too many/i.test(msg)) return 'The AI service is busy (rate limit). Please wait a minute and try again.'
  if (/log in|expired|401/i.test(msg)) return 'Your login has expired. Please sign out and sign in again.'
  if (msg.includes('GEMINI_API_KEY')) return 'The AI service is not configured. Please contact support.'
  return msg || 'Please try again later.'
}

export default function AskAiHelp({ initialProduct }) {
  const { data: session } = useSession()
  const [product, setProduct] = useState(initialProduct || 'TB')
  const [docs, setDocs] = useState(null) // { context, loaded, expected }
  const [messages, setMessages] = useState([]) // { id, role, content, productCode }
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const logRef = useRef(null)

  // Restore the last product and the conversation.
  useEffect(() => {
    if (!initialProduct) {
      const saved = readStore(PRODUCT_KEY, null)
      if (saved && PRODUCTS[saved]) setProduct(saved)
    }
    const history = readStore(HISTORY_KEY, [])
    setMessages(
      history.slice(-5).flatMap((h, i) => [
        { id: `h${i}q`, role: 'user', content: h.question, productCode: h.productCode },
        { id: `h${i}a`, role: 'assistant', content: h.answer, productCode: h.productCode },
      ]),
    )
  }, [initialProduct])

  // Load the documents for the chosen product.
  useEffect(() => {
    let live = true
    setDocs(null)
    writeStore(PRODUCT_KEY, product)
    loadProductDocs(product).then(d => live && setDocs(d)).catch(() => live && setDocs({ context: '', loaded: 0, expected: 0 }))
    return () => { live = false }
  }, [product])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages])

  const ask = useCallback(async () => {
    const question = input.trim()
    if (!question || busy || !docs) return
    setInput('')
    setBusy(true)
    const qid = `q${Date.now()}`
    setMessages(m => [...m, { id: qid, role: 'user', content: question, productCode: product }])

    try {
      const res = await fetch('/api/ai/help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.jwt ? { Authorization: `Bearer ${session.jwt}` } : {}),
        },
        body: JSON.stringify({ userQuestion: question, productCode: product, docsContext: docs.context, includeDebugInfo: false }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error(data.error || data.message || `HTTP ${res.status}`)

      setMessages(m => [...m, { id: `a${Date.now()}`, role: 'assistant', content: data.answer, productCode: product }])
      const history = [...readStore(HISTORY_KEY, []), { question, answer: data.answer, timestamp: new Date().toISOString(), productCode: product }]
      writeStore(HISTORY_KEY, history.slice(-MAX_HISTORY_ITEMS))
    } catch (err) {
      setMessages(m => [...m, { id: `e${Date.now()}`, role: 'error', content: errorText(err) }])
    } finally {
      setBusy(false)
    }
  }, [input, busy, docs, product, session])

  const clear = () => {
    setMessages([])
    writeStore(HISTORY_KEY, [])
  }

  const copy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch { /* clipboard blocked */ }
  }

  const productName = PRODUCTS[product]
  const cost = docs?.context ? estimateQueryCost(docs.context.length) : null
  const missing = docs ? docs.expected - docs.loaded : 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
      {/* Header with product tabs */}
      <div className="bg-gradient-to-r from-tbBlue to-blue-700 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          <h2 className="text-lg font-bold">Help Assistant</h2>
        </div>
        <div className="flex rounded-lg bg-white/15 p-1" role="tablist" aria-label="Product">
          {Object.entries(PRODUCTS).map(([code, name]) => (
            <button
              key={code}
              role="tab"
              aria-selected={product === code}
              onClick={() => setProduct(code)}
              className={cn(
                'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                product === code ? 'bg-white text-tbBlue' : 'text-white hover:bg-white/20',
              )}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div ref={logRef} className="h-[50vh] min-h-[320px] overflow-y-auto bg-gray-50 p-5 space-y-3">
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
          <h3 className="font-bold text-base mb-1">💡 {productName} Help Assistant</h3>
          <p className="mb-2">Ask me anything about how to use {productName}. I can help with:</p>
          <ul className="list-disc ml-5 mb-2 space-y-0.5">
            <li>Creating and managing projects, tasks and milestones</li>
            <li>Understanding reports and graphs</li>
            <li>Resource allocation and scheduling</li>
            <li>Field definitions and data management</li>
            <li>Features specific to {productName}</li>
          </ul>
          <p className="text-xs text-blue-700">
            {docs
              ? <>📚 <strong>{docs.loaded}</strong> {productName} documentation files loaded{cost && <> · 💰 about ${cost.perQuery.toFixed(4)} per question</>}</>
              : <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Loading documentation…</span>}
          </p>
          {missing > 0 && (
            <p className="mt-2 rounded border border-yellow-300 bg-yellow-50 p-2 text-xs text-yellow-800">
              ⚠️ {missing} documentation file{missing > 1 ? 's' : ''} could not be loaded. Some questions may not be answered.
            </p>
          )}
        </div>

        {messages.map(msg => (
          <div
            key={msg.id}
            className={cn(
              'rounded-lg p-3 text-sm',
              msg.role === 'user' && 'bg-blue-100 text-blue-950 ml-8',
              msg.role === 'assistant' && 'bg-white border border-green-200 text-gray-900 mr-8',
              msg.role === 'error' && 'bg-red-50 border border-red-200 text-red-800',
            )}
          >
            <div className="mb-1 flex items-center gap-1 text-xs font-bold">
              {msg.role === 'user' && <><User className="h-3 w-3" /> You</>}
              {msg.role === 'assistant' && <><Bot className="h-3 w-3" /> Assistant{msg.productCode && msg.productCode !== product ? ` (${PRODUCTS[msg.productCode]})` : ''}</>}
              {msg.role === 'error' && <><AlertCircle className="h-3 w-3" /> Error</>}
            </div>
            {msg.role === 'assistant' ? (
              <>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                <button onClick={() => copy(msg.id, msg.content)} className="mt-2 inline-flex items-center gap-1 text-xs text-green-700 hover:underline">
                  {copiedId === msg.id ? <><CheckCheck className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                </button>
              </>
            ) : (
              <div className="whitespace-pre-wrap">{msg.content}</div>
            )}
          </div>
        ))}

        {busy && (
          <div className="mr-8 rounded-lg bg-white border border-gray-200 p-3 text-sm text-gray-500 inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              ask()
            }
          }}
          rows={4}
          placeholder={`Ask a question about ${productName}…\nExample: How do I create a new project?`}
          className="w-full resize-y rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-tbBlue"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={ask}
            disabled={busy || !docs || !input.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-tbBlue px-5 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Ask
          </button>
          <button
            onClick={clear}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
          <span className="ml-auto text-xs text-gray-500">
            Enter to send · Shift+Enter for a new line · Powered by Google Gemini, answers from the official documentation
          </span>
        </div>
      </div>
    </div>
  )
}
