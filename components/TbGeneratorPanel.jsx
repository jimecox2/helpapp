'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Wand2, FolderOpen, FileText, AlertCircle, Loader2, Download } from 'lucide-react'

// Only these document types can be sent to Gemini for now
const SUPPORTED_EXTS = ['.md', '.csv']

// ─── Doc Picker ───────────────────────────────────────────────────────────────

function DocCheckbox({ docPath, label, disabled, selectedPaths, onToggle }) {
  if (disabled) {
    return (
      <label className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-600 cursor-not-allowed" title="Only .md and .csv files are supported for now">
        <input type="checkbox" checked={false} disabled className="mt-0.5 w-3.5 h-3.5 flex-shrink-0" readOnly />
        <span className="leading-tight line-through decoration-gray-300 dark:decoration-gray-700">{label}</span>
      </label>
    )
  }
  return (
    <label className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white group">
      <input
        type="checkbox"
        checked={selectedPaths.includes(docPath)}
        onChange={() => onToggle(docPath)}
        className="mt-0.5 w-3.5 h-3.5 accent-tbBlue cursor-pointer flex-shrink-0"
      />
      <span className="group-hover:text-tbBlue transition-colors leading-tight">{label}</span>
    </label>
  )
}

function CustomerSection({ customer, selectedPaths, onToggle, onSectionSelect }) {
  const allPaths = customer.docs.filter(d => SUPPORTED_EXTS.includes(d.ext)).map(d => d.path)
  return (
    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          <FolderOpen className="w-3.5 h-3.5" />
          {customer.name}
        </span>
        <span className="flex gap-2">
          <button onClick={() => onSectionSelect(allPaths, true)}  className="text-xs text-tbBlue hover:underline font-medium">All</button>
          <button onClick={() => onSectionSelect(allPaths, false)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:underline">None</button>
        </span>
      </div>
      <div className="space-y-2">
        {customer.docs.map(doc => (
          <DocCheckbox
            key={doc.path}
            docPath={doc.path}
            label={doc.relPath}
            disabled={!SUPPORTED_EXTS.includes(doc.ext)}
            selectedPaths={selectedPaths}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TbGeneratorPanel() {
  const [customers,     setCustomers]     = useState(null)   // null = loading
  const [loadError,     setLoadError]     = useState(null)
  const [selectedPaths, setSelectedPaths] = useState([])
  const [promptValue,   setPromptValue]   = useState('')
  const [isGenerating,  setIsGenerating]  = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [result,        setResult]        = useState(null)   // { data, notes, elapsed }

  const textareaRef = useRef(null)

  // Load the customer document tree from the server
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/customer-docs')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!data.success) throw new Error(data.error || 'Failed to load documents')
        if (!cancelled) setCustomers(data.customers)
      } catch (error) {
        if (!cancelled) setLoadError(error.message || 'Failed to load customer documents')
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const totalDocs = customers ? customers.reduce((n, c) => n + c.docs.length, 0) : 0

  // Selection rules: max three items — one CSV of tasks + one charter/business
  // case + one risk file ("risk" must be in the file name)
  const isRiskFile = p => /risk/i.test(p.split('/').pop())
  const csvCount   = selectedPaths.filter(p => p.toLowerCase().endsWith('.csv')).length
  const mdPaths    = selectedPaths.filter(p => p.toLowerCase().endsWith('.md'))
  const riskCount  = mdPaths.filter(isRiskFile).length
  const plainMd    = mdPaths.length - riskCount
  let selectionError = null
  if (selectedPaths.length > 3)  selectionError = 'Select at most three items — one CSV of tasks, one charter/business case, and one risk file.'
  else if (csvCount > 1)         selectionError = 'Only one CSV file can be selected.'
  else if (riskCount > 1)        selectionError = 'Only one risk file can be selected.'
  else if (plainMd > 1)          selectionError = 'Only one charter/business-case document can be selected — a second doc must have "risk" in its file name.'

  function handleToggle(docPath) {
    setSelectedPaths(prev =>
      prev.includes(docPath) ? prev.filter(p => p !== docPath) : [...prev, docPath]
    )
  }

  // onSectionSelect(paths, add) — add=true adds those paths, add=false removes them
  function handleSectionSelect(paths, add) {
    if (add) {
      setSelectedPaths(prev => [...new Set([...prev, ...paths])])
    } else {
      const remove = new Set(paths)
      setSelectedPaths(prev => prev.filter(p => !remove.has(p)))
    }
  }

  async function handleGenerate() {
    const prompt = promptValue.trim()
    if (!prompt || isGenerating || selectedPaths.length === 0 || selectionError) return

    setIsGenerating(true)
    setStatusMessage(null)
    setResult(null)
    const startTime = Date.now()

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docPaths: selectedPaths, userPrompt: prompt }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error(data.error || `HTTP ${res.status}`)

      setResult({
        data:    data.data,
        notes:   data.notes || [],
        elapsed: ((Date.now() - startTime) / 1000).toFixed(1),
      })
    } catch (error) {
      let text = '❌ '
      if (error.message?.includes('GEMINI_API_KEY')) {
        text += 'Cloud AI is not configured. Check your GEMINI_API_KEY in .env.local.'
      } else if (error.message?.includes('429')) {
        text += 'Rate limit reached — please wait a minute and try again.'
      } else {
        text += error.message || 'Generation failed. Please try again.'
      }
      setStatusMessage({ type: 'error', text })
    } finally {
      setIsGenerating(false)
      textareaRef.current?.focus()
    }
  }

  function handleDownload() {
    if (!result?.data) return
    const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    const now = new Date()
    const pad = n => String(n).padStart(2, '0')
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
    a.download = `transferBarsTbGeneratedData-${stamp}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate() }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Card className="w-full shadow-md border border-gray-200 dark:border-gray-700">

      {/* ── Header ── */}
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-tbBlue flex items-center justify-center flex-shrink-0">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                TB Generator — Customer Data Generation
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Select customer documents, add a prompt, and generate Timebars data
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-tbBlue border-tbBlue font-medium hidden sm:flex">
            Timebars Ltd.
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">

        {/* ── Doc Picker ── */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          {customers === null && !loadError && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading customer documents…
            </div>
          )}

          {loadError && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 py-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {loadError}
            </div>
          )}

          {customers !== null && !loadError && (
            <div className="space-y-5">
              {/* Summary row */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  <FileText className="w-3.5 h-3.5 inline mr-1" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedPaths.length}</span> of {totalDocs} docs selected
                  <span className="ml-1 text-gray-400">(max 3: one CSV + one charter/business case + one risk file)</span>
                  {selectedPaths.length === 0 && (
                    <span className="ml-1 text-red-500 font-medium">— select at least one</span>
                  )}
                  {selectionError && (
                    <span className="ml-1 text-red-500 font-medium">— {selectionError}</span>
                  )}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSectionSelect(
                      customers.flatMap(c => c.docs.filter(d => SUPPORTED_EXTS.includes(d.ext)).map(d => d.path)),
                      true
                    )}
                    className="text-xs text-tbBlue hover:underline font-medium"
                  >
                    Select all
                  </button>
                  <button
                    onClick={() => setSelectedPaths([])}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              </div>

              {customers.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No customer folders found under <code>/public/customers</code>.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {customers.map(customer => (
                    <CustomerSection
                      key={customer.name}
                      customer={customer}
                      selectedPaths={selectedPaths}
                      onToggle={handleToggle}
                      onSectionSelect={handleSectionSelect}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Status / error area ── */}
        {statusMessage && (
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className={statusMessage.type === 'error'
              ? 'flex items-start gap-2 text-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400'
              : 'flex items-start gap-2 text-sm bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-lg p-4 text-gray-700 dark:text-gray-300'}>
              <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${statusMessage.type === 'error' ? 'text-red-500' : 'text-tbBlue'}`} />
              <span>{statusMessage.text}</span>
            </div>
          </div>
        )}

        {/* ── Generated result ── */}
        {result && (
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  📊 {result.data.tbTimebars.length} tbTimebars row{result.data.tbTimebars.length !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  🗂 {result.data.tbMetaData.length} tbMetaData row{result.data.tbMetaData.length !== 1 ? 's' : ''}
                </Badge>
                <span className="text-xs text-gray-400 dark:text-gray-500">⏱ {result.elapsed}s</span>
              </div>
              <Button onClick={handleDownload} variant="outline" size="sm" className="text-tbBlue border-tbBlue">
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>
            </div>

            {result.notes.length > 0 && (
              <ul className="text-xs text-gray-500 dark:text-gray-400 list-disc pl-5 space-y-0.5">
                {result.notes.map((note, i) => <li key={i}>{note}</li>)}
              </ul>
            )}

            <pre className="text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-auto max-h-80 text-gray-700 dark:text-gray-300">
{JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}

        {/* ── Input Area ── */}
        <div className="p-4 space-y-3">
          <Textarea
            ref={textareaRef}
            value={promptValue}
            onChange={e => setPromptValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the Timebars data you want generated from the selected documents…&#10;Example: Generate a phased work package schedule from the project charter."
            rows={3}
            disabled={isGenerating}
            className="resize-none border-gray-400 dark:border-gray-500 focus-visible:ring-tbBlue"
            aria-label="Generation prompt input"
          />

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !promptValue.trim() || selectedPaths.length === 0 || !!selectionError}
              className="bg-tbBlue hover:bg-blue-800 text-white"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating…' : 'Generate'}
            </Button>

            <span className="text-xs text-gray-400 dark:text-gray-500">
              {selectedPaths.length} doc{selectedPaths.length !== 1 ? 's' : ''} · Enter to generate
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
