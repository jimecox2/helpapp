'use client'

// Licences & Accounts. Everything is worked out and checked on the server (../_actions.js); the page
// shows what it is given. One-time passwords are shown once and can be downloaded as a CSV; they are
// never stored here.

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Download, Loader2, RefreshCw, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { parsePool } from '@/lib/licence/parsePool'
import {
  getLicencesPage, setUpOrganisationAction, saveContractAction, accountsFromPoolAction, setSeatAction, newOneTimePasswordAction,
} from '../_actions'

const input = 'rounded border border-gray-300 px-2 py-1'
const STATUS = {
  new: ['New account', 'bg-blue-100 text-blue-800'],
  join: ['Moves in', 'bg-blue-100 text-blue-800'],
  member: ['Already in', 'bg-gray-100 text-gray-700'],
  other: ['In another company', 'bg-yellow-100 text-yellow-800'],
  created: ['Created', 'bg-green-100 text-green-800'],
  'moved in': ['Moved in', 'bg-green-100 text-green-800'],
  'already in': ['Already in', 'bg-gray-100 text-gray-700'],
  skipped: ['Skipped', 'bg-yellow-100 text-yellow-800'],
  failed: ['Failed', 'bg-red-100 text-red-800'],
}
const Status = ({ s }) => { const [label, cls] = STATUS[s] || [s, 'bg-gray-100']; return <span className={`rounded px-2 py-0.5 text-xs ${cls}`}>{label}</span> }

function downloadPasswords(rows, company) {
  const lines = [['email', 'one_time_password'], ...rows.filter(r => r.password).map(r => [r.email, r.password])]
  const blob = new Blob([lines.map(l => l.join(',')).join('\n') + '\n'], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${(company || 'company').replace(/[^\w-]+/g, '_')}-one-time-passwords.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function Licences() {
  const [page, setPage] = useState(null)
  const [error, setError] = useState('')
  const load = async () => {
    const r = await getLicencesPage()
    if (!r?.ok) { setError(r?.error || 'Could not load this page.'); return }
    setError('')
    setPage(r)
  }
  useEffect(() => { load() }, [])

  if (error) return <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>
  if (!page) return <p className="flex items-center gap-2 text-gray-600"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Licensing on this server: <b>{page.mode === 'self-managed' ? 'self-managed (no payment)' : 'sales (contracts are bought on the website)'}</b>
          {page.manager && ', you are a licence manager'}.
        </p>
        <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4 mr-1" /> Refresh</Button>
      </div>
      {page.manager && <Manager view={page.managerView} reload={load} />}
      {page.company
        ? <Company company={page.company} reload={load} />
        : !page.manager && <p className="rounded border border-gray-200 bg-gray-50 p-4 text-gray-700">{page.companyError}</p>}
    </div>
  )
}

// --- Licence manager -------------------------------------------------------------------------------

function Manager({ view, reload }) {
  const [org, setOrg] = useState({ name: '', adminEmail: '', adminName: '' })
  const [made, setMade] = useState(null)
  const [contract, setContract] = useState({ orgId: '', productId: '', seats: 5, expiresOn: '' })
  const [busy, setBusy] = useState('')

  const setUp = async e => {
    e.preventDefault()
    setBusy('org')
    try {
      const r = await setUpOrganisationAction(org)
      if (!r?.ok) { toast.error(r?.error || 'Could not set up the company.'); return }
      setMade(r)
      setOrg({ name: '', adminEmail: '', adminName: '' })
      await reload()
    } finally { setBusy('') }
  }
  const save = async e => {
    e.preventDefault()
    setBusy('contract')
    try {
      const r = await saveContractAction({ ...contract, seats: Number(contract.seats) })
      if (!r?.ok) { toast.error(r?.error || 'Could not save the contract.'); return }
      toast.success(r.changed ? 'Contract changed.' : 'Contract made.')
      await reload()
    } finally { setBusy('') }
  }
  const pick = (orgId, c) => setContract({ orgId: String(orgId), productId: String(c?.productId || ''), seats: c?.seats || 5, expiresOn: '' })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Companies on this server</CardTitle>
        <CardDescription>Self-managed licensing: you set up each company and its contracts. No payment is taken.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr><th className="py-2 pr-4">Company</th><th className="py-2 pr-4">Customer ID</th><th className="py-2 pr-4">Administrator</th><th className="py-2 pr-4">People</th><th className="py-2">Contracts</th></tr>
            </thead>
            <tbody>
              {view.organisations.length === 0 && <tr><td colSpan={5} className="py-3 text-gray-500">No companies yet.</td></tr>}
              {view.organisations.map(o => (
                <tr key={o.id} className="border-b last:border-0 align-top">
                  <td className="py-2 pr-4 font-semibold">{o.name}</td>
                  <td className="py-2 pr-4 font-mono">{o.customerId}</td>
                  <td className="py-2 pr-4">{o.administrator || <span className="text-red-700">none</span>}</td>
                  <td className="py-2 pr-4">{o.members}</td>
                  <td className="py-2 space-y-1">
                    {o.contracts.map(c => (
                      <button key={c.id} type="button" onClick={() => pick(o.id, c)} className="block text-left text-blue-700 hover:underline">
                        {c.productName}: {c.used} of {c.seats} seats, until {c.expiresOn}
                      </button>
                    ))}
                    <button type="button" onClick={() => pick(o.id)} className="text-sm text-gray-600 hover:underline">+ contract</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <form onSubmit={setUp} className="space-y-2 rounded border border-gray-200 p-4">
            <h3 className="font-semibold">Set up a company</h3>
            <label className="block text-sm">Company name<input className={`${input} w-full`} value={org.name} onChange={e => setOrg({ ...org, name: e.target.value })} required maxLength={100} /></label>
            <label className="block text-sm">Administrator&apos;s email<input type="email" className={`${input} w-full`} value={org.adminEmail} onChange={e => setOrg({ ...org, adminEmail: e.target.value })} required /></label>
            <label className="block text-sm">Administrator&apos;s name (new account only)<input className={`${input} w-full`} value={org.adminName} onChange={e => setOrg({ ...org, adminName: e.target.value })} maxLength={100} /></label>
            <p className="text-xs text-gray-500">A new email gets an account with a one-time password. An existing account may only come from its own individual organisation, and keeps its Customer ID.</p>
            <Button type="submit" disabled={!!busy}>{busy === 'org' ? 'Please wait…' : 'Set up'}</Button>
            {made && (
              <div className="rounded border border-green-300 bg-green-50 p-3 text-sm">
                <p><b>{made.organisation.name}</b> is set up, Customer ID <span className="font-mono">{made.organisation.customerId}</span>.</p>
                {made.administrator.password
                  ? <p>Give {made.administrator.email} this one-time password now, it is not shown again: <span className="font-mono text-base">{made.administrator.password}</span></p>
                  : <p>{made.administrator.email} keeps their own password.</p>}
              </div>
            )}
          </form>

          <form onSubmit={save} className="space-y-2 rounded border border-gray-200 p-4">
            <h3 className="font-semibold">Contract</h3>
            <label className="block text-sm">Company
              <select className={`${input} w-full`} value={contract.orgId} onChange={e => setContract({ ...contract, orgId: e.target.value })} required>
                <option value="">Choose…</option>
                {view.organisations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </label>
            <label className="block text-sm">Product
              <select className={`${input} w-full`} value={contract.productId} onChange={e => setContract({ ...contract, productId: e.target.value })} required>
                <option value="">Choose…</option>
                {view.products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
              </select>
            </label>
            {view.products.length === 0 && <p className="text-xs text-red-700">No Enterprise (T03) products in Strapi. Add the product rows first.</p>}
            <label className="block text-sm">Seats (the Administrator&apos;s included)<input type="number" min={2} max={1000} className={`${input} w-32`} value={contract.seats} onChange={e => setContract({ ...contract, seats: e.target.value })} required /></label>
            <label className="block text-sm">Expires on<input type="date" className={`${input} w-48`} value={contract.expiresOn} onChange={e => setContract({ ...contract, expiresOn: e.target.value })} required /></label>
            <p className="text-xs text-gray-500">A company with a live contract of this product gets that contract changed: new seats and date, never fewer seats than are in use.</p>
            <Button type="submit" disabled={!!busy}>{busy === 'contract' ? 'Please wait…' : 'Save contract'}</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

// --- A company's Administrator ---------------------------------------------------------------------

function Company({ company, reload }) {
  const { organisation: org, contracts, members } = company
  const [busy, setBusy] = useState('')
  const [password, setPassword] = useState(null)
  const [pool, setPool] = useState(null) // { rows, choice: { email: contractId | '' } }
  const [result, setResult] = useState(null)

  const seat = async (m, c, on) => {
    setBusy(`seat-${m.id}-${c.id}`)
    try {
      const r = await setSeatAction({ userId: m.id, contractId: c.id, on })
      if (!r?.ok) toast.error(r?.error || 'Could not change the seat.')
      await reload()
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
      const r = await accountsFromPoolAction({ rows })
      if (!r?.ok) throw new Error(r?.error || 'Could not read the accounts.')
      // Each person's licence: the default (TBT03 when live), or nothing when they already hold one or are elsewhere.
      const choice = Object.fromEntries(r.rows.map(x => [x.email,
        x.status === 'other' ? '' : x.has.length ? String(x.has[0]) : String(r.defaultContractId)]))
      setPool({ rows: r.rows, choice })
    } catch (err) {
      toast.error(err.message)
      setPool(null)
    } finally { setBusy('') }
  }
  const choose = (email, contractId) => setPool(p => ({ ...p, choice: { ...p.choice, [email]: contractId } }))
  const apply = async () => {
    setBusy('apply')
    try {
      const rows = pool.rows.filter(r => r.status !== 'other' && pool.choice[r.email])
        .map(r => ({ email: r.email, name: r.name, role: r.role, contractId: pool.choice[r.email] }))
      const r = await accountsFromPoolAction({ rows, apply: true })
      if (!r?.ok) { toast.error(r?.error || 'Could not make the accounts.'); return }
      setResult(r.rows)
      setPool(null)
      await reload()
    } finally { setBusy('') }
  }

  // Seats each licence would use, row by row in file order: a row past the free seats is flagged before apply.
  const plan = (() => {
    if (!pool) return { left: {}, over: new Set(), count: 0 }
    const left = Object.fromEntries(contracts.map(c => [String(c.id), c.free]))
    const over = new Set()
    let count = 0
    for (const r of pool.rows) {
      const id = pool.choice[r.email]
      if (r.status === 'other' || !id) continue
      if (r.has.map(String).includes(id)) { count++; continue }
      if (left[id] > 0) { left[id]--; count++ } else over.add(r.email)
    }
    return { left, over, count }
  })()

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{org.name}</CardTitle>
          <CardDescription>
            Customer ID <span className="font-mono">{org.customerId}</span>{org.joinCode && <> · join code <span className="font-mono">{org.joinCode}</span></>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 overflow-x-auto">
          {contracts.length === 0 && <p className="text-gray-600">No live Enterprise contract yet.</p>}
          {contracts.map(c => (
            <p key={c.id} className="text-sm"><b>{c.productName}</b> <span className="font-mono text-gray-500">{c.productCode}</span>: {c.used} of {c.seats} seats in use, {c.free} free, until {c.expiresOn}{c.selfManaged ? ' (self-managed)' : ''}</p>
          ))}
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Role</th>
                {contracts.map(c => <th key={c.id} className="py-2 pr-4">{c.productCode} seat</th>)}
                <th className="py-2">Password</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{m.username}</td>
                  <td className="py-2 pr-4">{m.email}{m.you && <span className="ml-1 text-xs text-gray-500">(you)</span>}</td>
                  <td className="py-2 pr-4">{m.role || '—'}</td>
                  {contracts.map(c => {
                    const has = m.seats.includes(c.productCode)
                    return (
                      <td key={c.id} className="py-2 pr-4">
                        {m.you
                          ? <Badge variant="secondary">Your licence</Badge>
                          : <input type="checkbox" aria-label={`${c.productCode} seat for ${m.email}`} checked={has}
                              disabled={!!busy || (!has && c.free === 0)} onChange={() => seat(m, c, !has)} />}
                      </td>
                    )
                  })}
                  <td className="py-2">
                    {!m.you && (
                      <button type="button" disabled={!!busy} onClick={() => resetPw(m)} className="text-sm text-blue-700 hover:underline disabled:opacity-50">
                        {busy === `pw-${m.id}` ? 'Please wait…' : 'New one-time password'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
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
          <CardTitle>Accounts from the resource pool</CardTitle>
          <CardDescription>
            Upload a backup from Timebars, Agilebars or Costbars (Start → Data Actions → Make Backup), a tbResources.json or
            tbResources.js, or a CSV with <code>tbResEmail</code>, <code>tbResName</code> and <code>tbResPrimaryRole</code> columns. Each Human
            resource with an email gets an account in {org.name} with a one-time password and a seat of the licence you choose for them
            (TBT03 by default). Nobody gets an account without a seat. You see the list before anything is made.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contracts.length === 0
            ? <p className="rounded border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">Import needs a live Enterprise contract: every person imported takes one of its seats.</p>
            : (
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
                <Upload className="h-4 w-4" /> Choose file
                <input type="file" accept=".js,.json,.csv" onChange={onFile} className="hidden" />
              </label>
            )}
          {busy === 'pool' && <p className="flex items-center gap-2 text-sm text-gray-600"><Loader2 className="h-4 w-4 animate-spin" /> Checking accounts…</p>}

          {pool && (
            <>
              <p className="flex flex-wrap gap-4 text-sm text-gray-700">
                Seats left after this import:
                {contracts.map(c => <span key={c.id}><b>{c.productCode}</b> {plan.left[String(c.id)]} of {c.free} free</span>)}
              </p>
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500 border-b">
                  <tr><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Role</th><th className="py-2 pr-4">Licence</th><th className="py-2">What happens</th></tr>
                </thead>
                <tbody>
                  {pool.rows.map(r => (
                    <tr key={r.email} className="border-b last:border-0">
                      <td className="py-1 pr-4">{r.email}</td>
                      <td className="py-1 pr-4">{r.name || '—'}</td>
                      <td className="py-1 pr-4">{r.role || '—'}{r.roleNote && <div className="text-xs text-gray-500">{r.roleNote}</div>}</td>
                      <td className="py-1 pr-4">
                        {r.status === 'other' ? '—' : (
                          <select aria-label={`Licence for ${r.email}`} className={input} value={pool.choice[r.email]} onChange={e => choose(r.email, e.target.value)}>
                            {contracts.map(c => <option key={c.id} value={String(c.id)}>{c.productCode}{r.has.includes(c.id) ? ' (has it)' : ''}</option>)}
                            <option value="">Skip</option>
                          </select>
                        )}
                        {plan.over.has(r.email) && <div className="text-xs text-red-700">No free seat: skipped</div>}
                      </td>
                      <td className="py-1"><Status s={r.status} />{r.note && <span className="ml-2 text-xs text-gray-500">{r.note}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button onClick={apply} disabled={!!busy || plan.count === 0}>
                {busy === 'apply' ? 'Please wait…' : `Make accounts and seats for ${plan.count} ${plan.count === 1 ? 'person' : 'people'}`}
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
                  <tr><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Result</th><th className="py-2 pr-4">One-time password</th><th className="py-2">Seats</th></tr>
                </thead>
                <tbody>
                  {result.map(r => (
                    <tr key={r.email} className="border-b last:border-0">
                      <td className="py-1 pr-4">{r.email}</td>
                      <td className="py-1 pr-4"><Status s={r.status} />{r.note && <span className="ml-2 text-xs text-gray-600">{r.note}</span>}{r.error && <div className="text-xs text-red-700">{r.error}</div>}</td>
                      <td className="py-1 pr-4 font-mono">{r.password || '—'}</td>
                      <td className="py-1">{r.seats?.join(', ') || '—'}{r.noSeat?.length ? <span className="ml-2 text-xs text-red-700">no free {r.noSeat.join(', ')} seat, no account made</span> : null}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
