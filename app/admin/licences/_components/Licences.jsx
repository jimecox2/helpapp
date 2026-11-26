'use client'

// Licences & Accounts (Account Groups on a self-managed server): the products and, for a licence manager,
// the account groups. People, roles and seats are on Users, Roles & Seats (/admin/users). Everything is
// worked out and checked on the server (../_actions.js); the page shows what it is given.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Loader2, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getLicencesPage, createAccountGroupAction, saveContractsAction } from '../_actions'

const input = 'rounded border border-gray-300 px-2 py-1'
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
          Licensing on this server: <b>{page.mode === 'self-managed' ? 'self-managed (account groups, no payment)' : 'sales (contracts are bought on the website)'}</b>
          {page.manager && ', you are a licence manager'}.
        </p>
        <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4 mr-1" /> Refresh</Button>
      </div>
      {page.manager && <Manager view={page.managerView} reload={load} />}
      {page.company
        ? <Company company={page.company} selfManaged={page.mode === 'self-managed'} />
        : !page.manager && <p className="rounded border border-gray-200 bg-gray-50 p-4 text-gray-700">{page.companyError}</p>}
    </div>
  )
}

// --- Licence manager: account groups -------------------------------------------------------------------------------

function Manager({ view, reload }) {
  // Account groups (Jim, 26 Nov 2026): one form makes a group, its Administrator and its products; the same form
  // changes an existing group's products (seats and date).
  const blankSeats = () => Object.fromEntries(view.products.map(p => [p.code, 0]))
  const blank = () => ({ orgId: '', name: '', adminEmail: '', adminName: '', seats: blankSeats(), expiresOn: '' })
  const [form, setForm] = useState(blank)
  const [made, setMade] = useState(null)
  const [busy, setBusy] = useState(false)
  const editing = view.organisations.find(o => String(o.id) === form.orgId)
  const inUse = code => editing?.contracts.find(c => c.productCode === code)

  const edit = o => {
    setMade(null)
    setForm({
      ...blank(), orgId: String(o.id),
      seats: Object.fromEntries(view.products.map(p => [p.code, o.contracts.find(c => c.productCode === p.code)?.seats || 0])),
      expiresOn: o.expiresOnInput || '',
    })
  }
  const submit = async e => {
    e.preventDefault()
    setBusy(true)
    try {
      if (editing) {
        const r = await saveContractsAction({ orgId: form.orgId, seats: form.seats, expiresOn: form.expiresOn })
        if (!r?.ok) { toast.error(r?.error || 'Could not save the products.'); return }
        const said = [r.made.length && `added: ${r.made.join(', ')}`, r.changed.length && `changed: ${r.changed.join(', ')}`, r.ended.length && `ended: ${r.ended.join(', ')}`].filter(Boolean)
        toast.success(`${editing.name} saved (${said.join('; ')}), all until ${r.expiresOn}.`)
        setForm(blank())
      } else {
        const { orgId, ...input } = form
        const r = await createAccountGroupAction(input)
        if (!r?.ok) { toast.error(r?.error || 'Could not create the account group.'); return }
        setMade(r)
        if (r.productsError) toast.error(r.productsError)
        setForm(blank())
      }
      await reload()
    } finally { setBusy(false) }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Account Groups</CardTitle>
        <CardDescription>
          Each group has its own Administrator, its people and its seats of each product. Runs on your own servers; no payment is taken.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr><th className="py-2 pr-4">Account group</th><th className="py-2 pr-4">Customer ID</th><th className="py-2 pr-4">Administrator</th><th className="py-2 pr-4">People</th><th className="py-2">Products</th></tr>
            </thead>
            <tbody>
              {view.organisations.length === 0 && <tr><td colSpan={5} className="py-3 text-gray-500">No account groups yet.</td></tr>}
              {view.organisations.map(o => (
                <tr key={o.id} className="border-b last:border-0 align-top">
                  <td className="py-2 pr-4 font-semibold">{o.name}</td>
                  <td className="py-2 pr-4 font-mono">{o.customerId}</td>
                  <td className="py-2 pr-4">{o.administrator || <span className="text-red-700">none</span>}</td>
                  <td className="py-2 pr-4">{o.members}</td>
                  <td className="py-2 space-y-1">
                    {o.contracts.map(c => <div key={c.id}>{c.productName}: {c.used} of {c.seats} seats</div>)}
                    {o.expiresOn && <div className="text-gray-500">until {o.expiresOn}</div>}
                    <button type="button" onClick={() => edit(o)} className="text-sm text-blue-700 hover:underline">Change products</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={submit} className="space-y-3 rounded border border-gray-200 p-4 max-w-2xl">
          <h3 className="font-semibold">{editing ? `Change products: ${editing.name}` : 'Create Account Group & Product Seats'}</h3>
          {!editing && (
            <>
              <label className="block text-sm">Account group name, for example a department<input className={`${input} w-full`} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength={100} placeholder="e.g. Human Resources" /></label>
              <label className="block text-sm">Administrator&apos;s email<input type="email" className={`${input} w-full`} value={form.adminEmail} onChange={e => setForm({ ...form, adminEmail: e.target.value })} required /></label>
              <label className="block text-sm">Administrator&apos;s name (new account only)<input className={`${input} w-full`} value={form.adminName} onChange={e => setForm({ ...form, adminName: e.target.value })} maxLength={100} /></label>
            </>
          )}
          {view.products.length === 0 && <p className="text-xs text-red-700">No Enterprise products (CBT03, TBT03, ABT03) in Strapi. Add the product rows first.</p>}
          <div className="flex flex-wrap gap-4">
            {view.products.map(p => (
              <label key={p.code} className="block text-sm">{p.name} seats
                {inUse(p.code) && <span className="text-gray-500"> ({inUse(p.code).used} in use)</span>}
                <input type="number" min={0} max={1000} aria-label={`${p.name} seats`} className={`${input} ml-2 w-24`}
                  value={form.seats[p.code] ?? 0}
                  onChange={e => setForm({ ...form, seats: { ...form.seats, [p.code]: e.target.value } })} />
              </label>
            ))}
          </div>
          <label className="block text-sm">Expires on (every product)<input type="date" className={`${input} ml-2 w-48`} value={form.expiresOn} onChange={e => setForm({ ...form, expiresOn: e.target.value })} required /></label>
          <p className="text-xs text-gray-500">
            {editing
              ? 'A product can be 0; one in use keeps at least the seats in use, and 0 ends it only when nobody but the Administrator holds a seat. A new date moves every seat with it.'
              : 'A new email gets an account with a one-time password. An existing account may only come from its own individual organisation. The Administrator holds one seat of each product with seats; at least 2 seats in total.'}
          </p>
          <div className="flex gap-2">
            <Button type="submit" disabled={busy}>{busy ? 'Please wait…' : editing ? 'Save products' : 'Create'}</Button>
            {editing && <Button type="button" variant="outline" onClick={() => setForm(blank())}>Cancel</Button>}
          </div>
          {made && (
            <div className="rounded border border-green-300 bg-green-50 p-3 text-sm">
              <p><b>{made.organisation.name}</b> is created, Customer ID <span className="font-mono">{made.organisation.customerId}</span>{made.products ? `, products until ${made.products.expiresOn}` : ''}.</p>
              {made.administrator.password
                ? <p>Give {made.administrator.email} this one-time password now, it is not shown again: <span className="font-mono text-base">{made.administrator.password}</span></p>
                : <p>{made.administrator.email} keeps their own password.</p>}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

// --- A company's Administrator ---------------------------------------------------------------------

function Company({ company, selfManaged }) {
  // People, roles and seats are on Users, Roles & Seats (Jim, 26 Nov 2026); this card shows only the products.
  const { organisation: org, contracts, members } = company
  return (
    <Card>
      <CardHeader>
        <CardTitle>{org.name}</CardTitle>
        <CardDescription>
          Customer ID <span className="font-mono">{org.customerId}</span>{org.joinCode && <> · join code <span className="font-mono">{org.joinCode}</span></>} · {members.length} {members.length === 1 ? 'account' : 'accounts'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {contracts.length === 0 && selfManaged && <p className="text-gray-600">No products for {org.name} yet. Your licence manager adds them.</p>}
        {contracts.length === 0 && !selfManaged && <p className="text-gray-600">No live Enterprise contract yet. Enterprise licences are bought on Costbars Enterprise (CBT03) on the website, with seats of Costbars, Timebars and Agilebars in one order.</p>}
        {contracts.map(c => (
          <p key={c.id} className="text-sm"><b>{c.productName}</b> <span className="font-mono text-gray-500">{c.productCode}</span>: {c.used} of {c.seats} seats in use, {c.free} free, until {c.expiresOn}</p>
        ))}
        {contracts.length > 0 && !selfManaged && <p className="text-sm text-gray-600">To renew or add seats, use Your organisation on the website.</p>}
        <Link href="/admin/users" className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
          Add people and give seats on Users, Roles &amp; Seats
        </Link>
      </CardContent>
    </Card>
  )
}
