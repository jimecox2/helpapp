'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Loader2, RefreshCw, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { listCustomerUsers, setUserRole, syncRolesFromPool } from '../_actions'

const RBAC_ROLES = ['Administrator', 'Project Manager', 'Executive', 'Team Member']

// Reads a resource pool export: a tbrunp backup (.js/.json with a tbResources store),
// a tbResources.json, a plain array, or a CSV with tbResEmail and tbResPrimaryRole columns.
function parsePool(text) {
  const trimmed = text.trim()
  let list = null
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const data = JSON.parse(trimmed)
    list = Array.isArray(data) ? data : data.tbResources
  } else {
    const [head, ...lines] = trimmed.split(/\r?\n/)
    const cols = head.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
    list = lines.filter(Boolean).map(line => {
      const cells = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
      return Object.fromEntries(cols.map((c, i) => [c, cells[i]]))
    })
  }
  if (!Array.isArray(list)) throw new Error('No tbResources rows found in that file')
  return list
    .filter(r => r && r.tbResEmail && r.tbResPrimaryRole && (r.tbResLabourType || 'Human') === 'Human')
    .map(r => ({ email: String(r.tbResEmail), role: String(r.tbResPrimaryRole) }))
}

const statusColor = {
  update: 'bg-blue-100 text-blue-800',
  updated: 'bg-green-100 text-green-800',
  'no change': 'bg-gray-100 text-gray-700',
}

export default function UsersAndRoles() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [poolRows, setPoolRows] = useState(null)
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setError('')
    try {
      const result = await listCustomerUsers()
      if (result.error) throw new Error(result.error)
      setData(result.data)
    } catch (e) {
      setError(e.message)
    }
  }
  useEffect(() => { load() }, [])

  const changeRole = async (user, role) => {
    setSavingId(user.id)
    try {
      const result = await setUserRole(user.id, role)
      if (result.error) throw new Error(result.error)
      const updated = result.data
      setData(d => ({ ...d, users: d.users.map(u => (u.id === updated.id ? updated : u)) }))
      toast.success(`${user.email} is now ${role}`)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSavingId(null)
    }
  }

  const onFile = async e => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPreview(null)
    try {
      const rows = parsePool(await file.text())
      if (!rows.length) throw new Error('No Human resources with an email and a primary role in that file')
      setPoolRows(rows)
      setBusy(true)
      const result = await syncRolesFromPool(rows, false)
      if (result.error) throw new Error(result.error)
      setPreview(result.data)
    } catch (err) {
      toast.error(err.message)
      setPoolRows(null)
    } finally {
      setBusy(false)
    }
  }

  const applyPool = async () => {
    setBusy(true)
    try {
      const result = await syncRolesFromPool(poolRows, true)
      if (result.error) throw new Error(result.error)
      setPreview(result.data)
      toast.success(`${result.data.filter(r => r.status === 'updated').length} roles updated`)
      await load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (error) return <p className="rounded border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>
  if (!data) return <p className="flex items-center gap-2 text-gray-600"><Loader2 className="h-4 w-4 animate-spin" /> Loading users…</p>

  const toUpdate = preview?.filter(r => r.status === 'update').length || 0

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Users in organisation {data.customerId}</CardTitle>
            <CardDescription>{data.users.length} accounts. Change a role and it is saved at once; it applies on the user's next sign-in.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4 mr-1" /> Refresh</Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr><th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Role</th><th className="py-2">Account</th></tr>
            </thead>
            <tbody>
              {data.users.map(u => {
                const isMe = u.email?.toLowerCase() === data.me
                const options = RBAC_ROLES.includes(u.role) || !u.role ? RBAC_ROLES : [u.role, ...RBAC_ROLES]
                return (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{u.username}</td>
                    <td className="py-2 pr-4">{u.email}{isMe && <span className="ml-1 text-xs text-gray-500">(you)</span>}</td>
                    <td className="py-2 pr-4">
                      <select
                        value={u.role}
                        disabled={isMe || savingId === u.id}
                        onChange={e => changeRole(u, e.target.value)}
                        className="rounded border border-gray-300 px-2 py-1 disabled:bg-gray-100"
                      >
                        {!u.role && <option value="">(none)</option>}
                        {options.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="py-2">
                      {u.blocked ? <Badge variant="destructive">Blocked</Badge> : u.confirmed ? <Badge variant="secondary">Active</Badge> : <Badge variant="outline">Not confirmed</Badge>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update roles from the resource pool</CardTitle>
          <CardDescription>
            Upload a backup from Timebars, Agilebars or Costbars (Start → Data Actions → Make Backup), a tbResources.json,
            or a CSV with <code>tbResEmail</code> and <code>tbResPrimaryRole</code> columns. Each Human resource's primary role is
            copied to the matching account in your organisation. You see the changes before anything is saved. No accounts are created.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
            <Upload className="h-4 w-4" /> Choose file
            <input type="file" accept=".js,.json,.csv" onChange={onFile} className="hidden" />
          </label>
          {busy && <p className="flex items-center gap-2 text-sm text-gray-600"><Loader2 className="h-4 w-4 animate-spin" /> Checking accounts…</p>}
          {preview && (
            <>
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500 border-b">
                  <tr><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Current role</th><th className="py-2 pr-4">Pool role</th><th className="py-2">Result</th></tr>
                </thead>
                <tbody>
                  {preview.map(r => (
                    <tr key={r.email} className="border-b last:border-0">
                      <td className="py-1 pr-4">{r.email}</td>
                      <td className="py-1 pr-4">{r.from || '—'}</td>
                      <td className="py-1 pr-4">{r.to}</td>
                      <td className="py-1"><span className={`rounded px-2 py-0.5 text-xs ${statusColor[r.status] || 'bg-yellow-100 text-yellow-800'}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button onClick={applyPool} disabled={busy || toUpdate === 0}>
                Apply {toUpdate} change{toUpdate === 1 ? '' : 's'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
