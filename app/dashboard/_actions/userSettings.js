'use server'

// Per-user dashboard settings stored on the Strapi users row. A user may only change their own row,
// and only the fields named here. The row id comes from Strapi by the session email, never from the
// request. Uses STRAPI_ADMIN_TOKEN because users-permissions does not let users update themselves.

import { auth } from '@/auth/auth'
import { API_URL } from '@/config/site'
import { getUserByEmail } from '@/lib/crud/coreCrud'
import { strapiErrorMessage } from '@/lib/strapiError'

const adminToken = () => {
  const token = process.env.STRAPI_ADMIN_TOKEN
  if (!token) throw new Error('STRAPI_ADMIN_TOKEN is not set on the server')
  return token
}

async function setUseConnectedPubsetImpl(value) {
  const session = await auth()
  if (!session?.user?.email || !session.jwt) throw new Error('Please sign in again')
  const me = await getUserByEmail(session.user.email, session.jwt)
  if (!me?.id) throw new Error('User not found')
  const res = await fetch(`${API_URL}/users/${me.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken()}` },
    body: JSON.stringify({ use_connected_pubset: value === true }),
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(`Strapi ${res.status}${body?.error?.message ? `: ${body.error.message}` : ''}`)
  }
  return { use_connected_pubset: value === true }
}

// Server-action errors are hidden in production builds, so return { data } or { error }.
export async function setUseConnectedPubsetAction(value) {
  try {
    return { data: await setUseConnectedPubsetImpl(value) }
  } catch (e) {
    const message = strapiErrorMessage(e)
    console.error('user settings action:', message)
    return { error: message }
  }
}
