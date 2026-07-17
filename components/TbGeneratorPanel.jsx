'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Wand2, FolderOpen, FileText, AlertCircle, Loader2 } from 'lucide-react'

// ─── Doc Picker ───────────────────────────────────────────────────────────────

function DocCheckbox({ docPath, label, selectedPaths, onToggle }) {
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
  const allPaths = customer.docs.map(d => d.path)
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
    if (!prompt || isGenerating || selectedPaths.length === 0) return

    setIsGenerating(true)
    setStatusMessage(null)

    // TODO: push selected doc content + prompt to Gemini via a new
    // /api/generate endpoint. The response format spec will be provided later.
    setStatusMessage({
      type: 'info',
      text: `Generation logic is not wired up yet. When it is, ${selectedPaths.length} selected document${selectedPaths.length !== 1 ? 's' : ''} and your prompt will be sent to Gemini.`,
    })

    setIsGenerating(false)
    textareaRef.current?.focus()
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
                  {selectedPaths.length === 0 && (
                    <span className="ml-1 text-red-500 font-medium">— select at least one</span>
                  )}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSectionSelect(customers.flatMap(c => c.docs.map(d => d.path)), true)}
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

        {/* ── Status / result area ── */}
        {statusMessage && (
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-start gap-2 text-sm bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-lg p-4 text-gray-700 dark:text-gray-300">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-tbBlue" />
              <span>{statusMessage.text}</span>
            </div>
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
              disabled={isGenerating || !promptValue.trim() || selectedPaths.length === 0}
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
