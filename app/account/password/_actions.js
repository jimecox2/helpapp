'use server'

// Change password with no email (Phase 3): air-gapped servers may have no SendGrid, and people get a
// one-time password from their Administrator. Strapi's own /auth/change-password with the user's login,
// so Strapi checks the current password. The Authenticated role needs the users-permissions
// "changePassword" permission.

import { auth } from '@/auth/auth'
import { API_URL } from '@/config/site'

export async function changePassword({ currentPassword, password, passwordConfirmation } = {}) {
  try {
    const session = await auth()
    if (!session?.jwt) return { ok: false, error: 'Please sign in again.' }
    if (!password || password.length < 8) return { ok: false, error: 'The new password needs at least 8 characters.' }
    if (password !== passwordConfirmation) return { ok: false, error: 'The two new passwords are not the same.' }
    const res = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.jwt}` },
      body: JSON.stringify({ currentPassword, password, passwordConfirmation }),
      cache: 'no-store',
    })
    if (res.ok) return { ok: true }
    const body = await res.json().catch(() => null)
    const msg = body?.error?.message || ''
    if (res.status === 403) return { ok: false, error: 'Strapi does not let accounts change their password yet: a Strapi administrator must allow "changePassword" for the Authenticated role.' }
    if (/current password/i.test(msg)) return { ok: false, error: 'Your current password is not right.' }
    return { ok: false, error: msg ? `Strapi: ${msg}` : `Could not change the password (Strapi ${res.status}).` }
  } catch (e) {
    console.error('account: change password failed', e.message)
    return { ok: false, error: 'Could not reach Strapi. Please try again.' }
  }
}
