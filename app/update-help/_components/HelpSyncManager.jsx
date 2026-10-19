'use client'

// The help-articles sync table (ported from tbwww's DocsHelpSync). Create a missing article,
// Update one, or Update All: every file that already has an article, one after another.
// Update All never creates. The checkbox adds title, description, tags and SEO to an update.

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const PRODUCT_BADGE = {
  Agilebars: 'bg-blue-100 text-blue-800',
  Timebars: 'bg-green-100 text-green-800',
  Costbars: 'bg-purple-100 text-purple-800',
  Common: 'bg-slate-100 text-slate-700',
}

async function post(body) {
  const res = await fetch('/api/help-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok || result.error) throw new Error(result.error || `HTTP ${res.status}`)
  return result
}

export default function HelpSyncManager({ strapiUrl, helpUrl }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState(null)
  const [rowStatus, setRowStatus] = useState({})
  const [withMeta, setWithMeta] = useState(false)
  const [running, setRunning] = useState(false)
  const [summary, setSummary] = useState(null)

  const loadList = async () => {
    setLoading(true)
    setListError(null)
    try {
      const res = await fetch('/api/help-sync', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || `Failed to load: ${res.status}`)
      setItems(data)
    } catch (e) {
      setListError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadList() }, [])

  const setRow = (filename, update) =>
    setRowStatus(prev => ({ ...prev, [filename]: { ...prev[filename], ...update } }))

  const createRow = async item => {
    setRow(item.filename, { loading: true, message: '', success: null })
    try {
      const r = await post({ action: 'create', filename: item.filename })
      setRow(item.filename, { loading: false, message: `Created - ID ${r.id}`, success: true })
      setItems(prev => prev.map(i => (i.filename === item.filename ? { ...i, exists: true, strapiId: r.id, strapiTitle: r.title } : i)))
    } catch (e) {
      setRow(item.filename, { loading: false, message: `Error: ${e.message}`, success: false })
    }
  }

  const updateRow = async item => {
    setRow(item.filename, { loading: true, message: '', success: null })
    try {
      await post({ action: 'update', filename: item.filename, strapiId: item.strapiId, withMeta })
      setRow(item.filename, { loading: false, message: withMeta ? 'Content and details updated' : 'Content updated', success: true })
      return true
    } catch (e) {
      setRow(item.filename, { loading: false, message: `Error: ${e.message}`, success: false })
      return false
    }
  }

  const updateAll = async () => {
    setRunning(true)
    setSummary(null)
    let updated = 0
    let failed = 0
    for (const item of items.filter(i => i.exists)) {
      if (await updateRow(item)) updated++
      else failed++
    }
    setSummary({ updated, failed, skipped: items.filter(i => !i.exists).map(i => i.filename) })
    setRunning(false)
  }

  const existsCount = items.filter(i => i.exists).length
  const missingCount = items.length - existsCount

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Help Articles Sync</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Push <code className="rounded bg-slate-100 px-1">public/docsHelp</code> into Strapi help-articles at{' '}
              <code className="rounded bg-slate-100 px-1">{strapiUrl}</code>. Links are written for{' '}
              <code className="rounded bg-slate-100 px-1">{helpUrl}</code>.
            </p>
          </div>
          {!loading && (
            <span className="text-sm text-slate-500">
              <span className="font-semibold text-green-600">{existsCount}</span> in Strapi &nbsp;·&nbsp;
              <span className="font-semibold text-amber-500">{missingCount}</span> missing
            </span>
          )}
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
          <Button size="sm" onClick={updateAll} disabled={loading || running || existsCount === 0}>
            {running ? 'Updating all…' : `Update All (${existsCount})`}
          </Button>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={withMeta} onChange={e => setWithMeta(e.target.checked)} disabled={running} />
            Also update title, description, tags and SEO
          </label>
          <Button variant="outline" size="sm" onClick={loadList} disabled={loading || running} className="ml-auto">
            {loading ? 'Loading…' : 'Refresh'}
          </Button>
        </div>

        {summary && (
          <div className="mb-4 rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            {summary.updated} updated, {summary.failed} failed, {summary.skipped.length} skipped (not in Strapi)
            {summary.skipped.length > 0 && <>: {summary.skipped.join(', ')}</>}
          </div>
        )}

        {listError && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{listError}</div>
        )}

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-400">Loading file list…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-2 pr-6 font-semibold">File</th>
                  <th className="pb-2 pr-6 font-semibold">Product</th>
                  <th className="pb-2 pr-6 font-semibold">Slug</th>
                  <th className="pb-2 pr-6 font-semibold">Strapi</th>
                  <th className="pb-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const rs = rowStatus[item.filename] || {}
                  return (
                    <tr key={item.filename} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="max-w-[220px] truncate py-2.5 pr-6 font-mono text-xs text-slate-600" title={item.filename}>
                        {item.filename}
                      </td>
                      <td className="py-2.5 pr-6">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${PRODUCT_BADGE[item.product] || PRODUCT_BADGE.Common}`}>
                          {item.product}
                        </span>
                      </td>
                      <td className="max-w-[200px] truncate py-2.5 pr-6 font-mono text-xs text-slate-400" title={item.slug}>
                        {item.slug}
                      </td>
                      <td className="py-2.5 pr-6 text-xs">
                        {item.exists
                          ? <span className="font-medium text-green-600">✓ ID {item.strapiId}</span>
                          : <span className="text-amber-500">— missing</span>}
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-3">
                          {item.exists ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 border-blue-300 px-3 text-xs text-blue-600 hover:bg-blue-50"
                              disabled={rs.loading || running}
                              onClick={() => updateRow(item)}
                            >
                              {rs.loading ? 'Updating…' : 'Update'}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="h-7 bg-green-600 px-3 text-xs text-white hover:bg-green-700"
                              disabled={rs.loading || running}
                              onClick={() => createRow(item)}
                            >
                              {rs.loading ? 'Creating…' : 'Create'}
                            </Button>
                          )}
                          {rs.message && (
                            <span className={`text-xs ${rs.success ? 'text-green-600' : 'text-red-500'}`}>{rs.message}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
