'use client'

// Users, Roles & Seats (Jim, 26 Nov 2026). Everything is worked out and checked on the server (../_actions.js);
// the page shows what it is given. One-time passwords are shown once and can be downloaded as a CSV; they are
// never stored here.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Download, Loader2, RefreshCw, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { parsePool } from '@/lib/licence/parsePool'
import { getPeoplePage, setRoleAction, setSeatAction, newOneTimePasswordAction, importPoolAction } from '../_actions'

const RBAC_ROLES = ['Administrator', 'Project Manager', 'Executive', 'Team Member']
const input = 'rounded border border-gray-300 px-2 py-1'

const TONE = {
  'Create account': 'bg-blue-100 text-blue-800',
  'Move in': 'bg-blue-100 text-blue-800',
  'Update role': 'bg-blue-100 text-blue-800',
  'Give seat': 'bg-blue-100 text-blue-800',
  'Update role, give seat': 'bg-blue-100 text-blue-800',
  'No change': 'bg-gray-100 text-gray-700',
  Skip: 'bg-yellow-100 text-yellow-800',
  created: 'bg-green-100 text-green-800',
  'moved in': 'bg-green-100 text-green-800',
  updated: 'bg-green-100 text-green-800',
  'no change': 'bg-gray-100 text-gray-700',
  skipped: 'bg-yellow-100 text-yellow-800',
  other: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
}
const Tag = ({ s }) => <span className={`rounded px-2 py-0.5 text-xs ${TONE[s] || 'bg-gray-100'}`}>{s === 'other' ? 'skipped' : s}</span>

// What the import will do for one row, given the licence chosen for it ('' = none).
function actionOf(r, choice) {
  if (r.status === 'other') return 'Skip'
  const seat = !!choice && !r.has.map(String).includes(String(choice))
  if (r.status === 'new') return choice ? 'Create account' : 'Skip'
  if (r.status === 'join') return choice ? 'Move in' : 'Skip'
  const role = !!r.role && r.role !== r.currentRole
  if (role && seat) return 'Update role, give seat'
  return role ? 'Update role' : seat ? 'Give seat' : 'No change'
}

function downloadPasswords(rows, name) {
  const lines = [['email', 'one_time_password'], ...rows.filter(r => r.password).map(r => [r.email, r.password])]
  const blob = new Blob([lines.map(l => l.join(',')).join('\n') + '\n'], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${(name || 'organisation').replace(/[^\w-]+/g, '_')}-one-time-passwords.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function People() {
  const [page, setPage] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')
  const [password, setPassword] = useState(null)
  const [pool, setPool] = useState(null) // { rows, choice: { email: contractId | '' } }
  const [result, setResult] = useState(null)

  const load = async () => {
    const r = await getPeoplePage()
    if (!r?.ok) { setError(r?.error || 'Could not load this page.'); return }
    setError('')
    setPage(r)
  }
  useEffect(() => { load() }, [])

  if (error) return <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>
  if (!page) return <p className="flex items-center gap-2 text-gray-600"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>

  const { organisation: org, contracts, members } = page
  const group = page.mode === 'self-managed' ? 'account group' : 'organisation'

  const changeRole = async (m, role) => {
    setBusy(`role-${m.id}`)
    try {
      const r = await setRoleAction({ userId: m.id, role })
      if (!r?.ok) { toast.error(r?.error || 'Could not change the role.'); return }
      toast.success(`${m.email} is now ${role}. It applies on their next sign-in.`)
      await load()
    } finally { setBusy('') }
  }
  const seat = async (m, c, on) => {
    setBusy(`seat-${m.id}-${c.id}`)
    try {
      const r = await setSeatAction({ userId: m.id, contractId: c.id, on })
      if (!r?.ok) toast.error(r?.error || 'Could not change the seat.')
      await load()
    } finally { setBusy('') }
  }
  const resetPw = async m => {
    setBusy(`pw-${m.id}`)
    try {
      const r = await newOneTimePasswordAction(m.id)
      if (!r?.ok) { toast.error(r?.error || 'Could not set a password.'); return }
      setPassword(r)
    } finally { setBusy('') }
  }

  const onFile = async e => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setResult(null)
    setBusy('pool')
    try {
      const rows = parsePool(await file.text())
      if (!rows.length) throw new Error('No Human resources with an email in that file.')
      const r = await importPoolAction({ rows })
      if (!r?.ok) throw new Error(r?.error || 'Could not read the accounts.')
      // The server's choice: the seat a person already holds, else the default (Timebars when live), else none.
      setPool({ rows: r.rows, choice: Object.fromEntries(r.rows.map(x => [x.email, x.status === 'other' || !x.contractId ? '' : String(x.contractId)])) })
    } catch (err) {
      toast.error(err.message)
      setPool(null)
    } finally { setBusy('') }
  }
  const choose = (email, contractId) => setPool(p => ({ ...p, choice: { ...p.choice, [email]: contractId } }))

  // Seats each product would use, row by row in file order: a row past the free seats is flagged before apply.
  const plan = (() => {
    if (!pool) return { left: {}, over: new Set(), count: 0 }
    const left = Object.fromEntries(contracts.map(c => [String(c.id), c.free]))
    const over = new Set()
    let count = 0
    for (const r of pool.rows) {
      const id = pool.choice[r.email]
      const action = actionOf(r, id)
      if (action === 'Skip' || action === 'No change') continue
      if (id && !r.has.map(String).includes(id)) {
        if (left[id] > 0) left[id]--
        else { over.add(r.email); if (r.status !== 'member') continue }
      }
      count++
    }
    return { left, over, count }
  })()

  const apply = async () => {
    setBusy('apply')
    try {
      const rows = pool.rows.filter(r => !['Skip', 'No change'].includes(actionOf(r, pool.choice[r.email])))
        .map(r => ({ email: r.email, name: r.name, role: r.role, contractId: pool.choice[r.email] }))
      const r = await importPoolAction({ rows, apply: true })
      if (!r?.ok) { toast.error(r?.error || 'Could not import.'); return }
      setResult(r.rows)
      setPool(null)
      await load()
    } finally { setBusy('') }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{org.name}</CardTitle>
            <CardDescription>
              Customer ID <span className="font-mono">{org.customerId}</span>{org.joinCode && <> · join code <span className="font-mono">{org.joinCode}</span></>}
              {' '}· {members.length} {members.length === 1 ? 'account' : 'accounts'}. A role change is saved at once and applies on the person&apos;s next sign-in.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4 mr-1" /> Refresh</Button>
        </CardHeader>
        <CardContent className="space-y-4 overflow-x-auto">
          {contracts.length === 0
            ? <p className="text-sm text-gray-600">No products for this {group} yet, so there are no seats to give. See <Link className="text-blue-700 underline" href="/admin/licences">{page.mode === 'self-managed' ? 'Account Groups' : 'Licences & Accounts'}</Link>.</p>
            : <p className="text-sm text-gray-600">
                Seats: {contracts.map(c => `${c.productCode} ${c.used} of ${c.seats} used`).join(' · ')}, until {contracts[0].expiresOn}. Tick the seats each person needs.
              </p>}
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Role</th>
                {contracts.map(c => <th key={c.id} className="py-2 pr-4">{c.productCode} seat</th>)}
                <th className="py-2 pr-4">Account</th><th className="py-2">Password</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => {
                const options = RBAC_ROLES.includes(m.role) || !m.role ? RBAC_ROLES : [m.role, ...RBAC_ROLES]
                return (
                  <tr key={m.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{m.username}</td>
                    <td className="py-2 pr-4">{m.email}{m.you && <span className="ml-1 text-xs text-gray-500">(you)</span>}</td>
                    <td className="py-2 pr-4">
                      <select aria-label={`Role of ${m.email}`} value={m.role} disabled={m.you || !!busy} onChange={e => changeRole(m, e.target.value)}
                        className="rounded border border-gray-300 px-2 py-1 disabled:bg-gray-100">
                        {!m.role && <option value="">(none)</option>}
                        {options.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    {contracts.map(c => {
                      const has = m.seats.includes(c.productCode)
                      return (
                        <td key={c.id} className="py-2 pr-4">
                          {m.you
                            ? <Badge variant="secondary">Your seat</Badge>
                            : <input type="checkbox" aria-label={`${c.productCode} seat for ${m.email}`} checked={has}
                                disabled={!!busy || (!has && c.free === 0)} onChange={() => seat(m, c, !has)} />}
                        </td>
                      )
                    })}
                    <td className="py-2 pr-4">
                      {m.blocked ? <Badge variant="destructive">Blocked</Badge> : m.confirmed ? <Badge variant="secondary">Active</Badge> : <Badge variant="outline">Not confirmed</Badge>}
                    </td>
                    <td className="py-2">
                      {!m.you && (
                        <button type="button" disabled={!!busy} onClick={() => resetPw(m)} className="text-sm text-blue-700 hover:underline disabled:opacity-50">
                          {busy === `pw-${m.id}` ? 'Please wait…' : 'New one-time password'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {password && (
            <p className="rounded border border-green-300 bg-green-50 p-3 text-sm">
              New one-time password for {password.email}, shown once: <span className="font-mono text-base">{password.password}</span>.
              They sign in with it, then change it on Change password.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import people from the resource pool</CardTitle>
          <CardDescription>
            Upload a backup from Timebars, Agilebars or Costbars (Start → Data Actions → Make Backup), a tbResources.json or
            tbResources.js, or a CSV with <code>tbResEmail</code>, <code>tbResName</code> and <code>tbResPrimaryRole</code> columns.
            For each Human resource with an email you see what will happen before anything is saved: a new person gets an
            account with a one-time password and a seat (Timebars by default); an account on its own moves into {org.name};
            someone already here gets the pool&apos;s role and a seat if they have none. Nobody gets an account without a seat,
            and the pool never makes anyone Administrator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
            <Upload className="h-4 w-4" /> Choose file
            <input type="file" accept=".js,.json,.csv" onChange={onFile} className="hidden" />
          </label>
          {busy === 'pool' && <p className="flex items-center gap-2 text-sm text-gray-600"><Loader2 className="h-4 w-4 animate-spin" /> Checking accounts…</p>}

          {pool && (
            <>
              {contracts.length > 0 && (
                <p className="flex flex-wrap gap-4 text-sm text-gray-700">
                  Seats left after this import:
                  {contracts.map(c => <span key={c.id}><b>{c.productCode}</b> {plan.left[String(c.id)]} of {c.free} free</span>)}
                </p>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500 border-b">
                    <tr><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Role</th><th className="py-2 pr-4">Seat</th><th className="py-2">What happens</th></tr>
                  </thead>
                  <tbody>
                    {pool.rows.map(r => {
                      const action = plan.over.has(r.email) && r.status !== 'member' ? 'Skip' : actionOf(r, pool.choice[r.email])
                      return (
                        <tr key={r.email} className="border-b last:border-0">
                          <td className="py-1 pr-4">{r.email}</td>
                          <td className="py-1 pr-4">{r.name || '—'}</td>
                          <td className="py-1 pr-4">
                            {r.currentRole && r.role && r.currentRole !== r.role ? <>{r.currentRole} → {r.role}</> : (r.role || r.currentRole || '—')}
                            {r.roleNote && <div className="text-xs text-gray-500">{r.roleNote}</div>}
                          </td>
                          <td className="py-1 pr-4">
                            {r.status === 'other' || contracts.length === 0 ? '—' : (
                              <select aria-label={`Seat for ${r.email}`} className={input} value={pool.choice[r.email]} onChange={e => choose(r.email, e.target.value)}>
                                {contracts.map(c => <option key={c.id} value={String(c.id)}>{c.productCode}{r.has.map(String).includes(String(c.id)) ? ' (has it)' : ''}</option>)}
                                <option value="">{r.status === 'member' ? 'No new seat' : 'Skip'}</option>
                              </select>
                            )}
                            {plan.over.has(r.email) && <div className="text-xs text-red-700">No free seat{r.status === 'member' ? '' : ': skipped'}</div>}
                          </td>
                          <td className="py-1"><Tag s={action} />{r.note && <span className="ml-2 text-xs text-gray-500">{r.note}</span>}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Button onClick={apply} disabled={!!busy || plan.count === 0}>
                {busy === 'apply' ? 'Please wait…' : `Apply to ${plan.count} ${plan.count === 1 ? 'person' : 'people'}`}
              </Button>
            </>
          )}

          {result && (
            <div className="space-y-3 rounded border border-green-300 bg-green-50 p-4">
              <p className="text-sm">Done. One-time passwords are shown only now: download them before you leave this page.</p>
              <Button variant="outline" size="sm" onClick={() => downloadPasswords(result, org.name)} disabled={!result.some(r => r.password)}>
                <Download className="h-4 w-4 mr-1" /> Download one-time passwords (CSV)
              </Button>
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500 border-b">
                  <tr><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Result</th><th className="py-2 pr-4">One-time password</th><th className="py-2">New seats</th></tr>
                </thead>
                <tbody>
                  {result.map(r => (
                    <tr key={r.email} className="border-b last:border-0">
                      <td className="py-1 pr-4">{r.email}</td>
                      <td className="py-1 pr-4"><Tag s={r.status} />{r.roleChanged && <span className="ml-2 text-xs text-gray-600">role {r.role}</span>}{r.note && <span className="ml-2 text-xs text-gray-600">{r.note}</span>}{r.error && <div className="text-xs text-red-700">{r.error}</div>}</td>
                      <td className="py-1 pr-4 font-mono">{r.password || '—'}</td>
                      <td className="py-1">{r.seats?.join(', ') || '—'}{r.noSeat?.length ? <span className="ml-2 text-xs text-red-700">no free {r.noSeat.join(', ')} seat</span> : null}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
