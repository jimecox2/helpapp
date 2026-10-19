// lib/help/editors.js — who may push help content to Strapi (/update-help). Server only.
//
// Two checks, both from the server, never from the request: the user's primary_role in Strapi is
// Administrator (any casing), and their email is in HELP_EDITORS (.env.local, comma separated).
// Customer Administrators have the role too, so the list is what keeps them out. Empty list = nobody.
import { auth } from '@/auth/auth'
import { getUserByEmail } from '@/lib/crud/coreCrud'
import { isAdminRole } from '@/lib/auth/roles'

export function helpEditors() {
  return (process.env.HELP_EDITORS || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
}

// { ok: true, email } or { ok: false, status, error }
export async function checkHelpEditor() {
  const session = await auth()
  const email = session?.user?.email?.toLowerCase()
  if (!email || !session.jwt) return { ok: false, status: 401, error: 'Please sign in' }
  if (!helpEditors().includes(email)) {
    return { ok: false, status: 403, error: 'Your email is not in HELP_EDITORS on this server' }
  }
  let me
  try {
    me = await getUserByEmail(email, session.jwt)
  } catch {
    return { ok: false, status: 401, error: 'Could not check your role in Strapi. Please sign in again' }
  }
  if (!me || !isAdminRole(me.primary_role)) {
    return { ok: false, status: 403, error: 'Only an Administrator can update help content' }
  }
  return { ok: true, email }
}
