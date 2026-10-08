'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Wand2, FolderOpen, FileText, AlertCircle, Download } from 'lucide-react'

// ─── Sample documents (public/projectArtifacts) ───────────────────────────────
// Examples of the kinds of documents the AI can read. Users download them to
// see the format, then paste their own text into the box below.

const ARTIFACTS_BASE = '/projectArtifacts'

const ARTIFACT_GROUPS = [
  {
    title: 'Project Management',
    files: ['Business_Case.md', 'Contract.md', 'Proposal.md', 'Project_Charter.md', 'Risk_Register.md'],
  },
  {
    title: 'Business Management',
    files: ['Cost_Estimate.xlsx', 'Scope_Of_Supply_Summary.md', 'Cost_Estimate_Schedule.csv', 'Equipment_Description.md'],
  },
]

function ArtifactSection({ group }) {
  return (
    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-lg p-3">
      <span className="flex items-center gap-1.5 mb-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        <FolderOpen className="w-3.5 h-3.5" />
        {group.title}
      </span>
      <ul className="space-y-2">
        {group.files.map(file => (
          <li key={file}>
            <a
              href={`${ARTIFACTS_BASE}/${encodeURIComponent(file)}`}
              download
              className="flex items-start gap-2 text-xs text-tbBlue hover:underline leading-tight"
            >
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              {file}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TbGeneratorPanel() {
  const [promptValue,   setPromptValue]   = useState('')
  const [isGenerating,  setIsGenerating]  = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [result,        setResult]        = useState(null)   // { data, notes, elapsed }

  const textareaRef = useRef(null)

  async function handleGenerate() {
    const prompt = promptValue.trim()
    if (!prompt || isGenerating) return

    setIsGenerating(true)
    setStatusMessage(null)
    setResult(null)
    const startTime = Date.now()

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: prompt }),
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
                TB Generator — Timebars Data Generation
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Paste the text of a charter, business case, risk register, task list or cost estimate into the box, say what you want, and the AI builds a Timebars file you can download and import into the app. Download the sample documents below to see what works well.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-tbBlue border-tbBlue font-medium hidden sm:flex">
            Timebars Ltd.
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">

        {/* ── Sample documents ── */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ARTIFACT_GROUPS.map(group => <ArtifactSection key={group.title} group={group} />)}
          </div>
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
            placeholder="Paste your document text here and say what you want generated…&#10;Example: Generate a phased work package schedule from this project charter."
            rows={6}
            disabled={isGenerating}
            className="min-h-[160px] resize-none border-gray-400 dark:border-gray-500 focus-visible:ring-tbBlue"
            aria-label="Generation prompt input"
          />

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !promptValue.trim()}
              className="bg-tbBlue hover:bg-blue-800 text-white"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating…' : 'Generate'}
            </Button>

            <span className="text-xs text-gray-400 dark:text-gray-500">
              Enter to generate · Shift+Enter for a new line
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
