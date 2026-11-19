'use client'

// Change password (Phase 3). For everyone, and the way to replace a one-time password.
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { changePassword } from './_actions'

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ currentPassword: '', password: '', passwordConfirmation: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const field = 'w-full rounded border border-gray-300 px-3 py-2'

  const submit = async e => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const r = await changePassword(form)
      if (!r?.ok) { setError(r?.error || 'Could not change the password.'); return }
      setDone(true)
      setForm({ currentPassword: '', password: '', passwordConfirmation: '' })
    } finally { setBusy(false) }
  }

  return (
    <div className="mx-auto my-10 max-w-md space-y-5 rounded-lg bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800">Change password</h1>
      <p className="text-sm text-gray-600">Got a one-time password from your Administrator? Enter it as your current password and choose your own.</p>
      {done
        ? <p role="status" className="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-800">Your password is changed. Use it the next time you sign in, here and in the apps.</p>
        : (
          <form onSubmit={submit} className="space-y-3">
            <label className="block text-sm text-gray-700">Current password
              <input type="password" autoComplete="current-password" className={field} value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} required />
            </label>
            <label className="block text-sm text-gray-700">New password (at least 8 characters)
              <input type="password" autoComplete="new-password" minLength={8} className={field} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </label>
            <label className="block text-sm text-gray-700">New password again
              <input type="password" autoComplete="new-password" minLength={8} className={field} value={form.passwordConfirmation} onChange={e => setForm({ ...form, passwordConfirmation: e.target.value })} required />
            </label>
            <Button type="submit" disabled={busy}>{busy ? 'Please wait…' : 'Change password'}</Button>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          </form>
        )}
    </div>
  )
}
