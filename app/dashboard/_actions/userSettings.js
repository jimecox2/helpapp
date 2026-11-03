'use server'

// Per-user dashboard settings stored on the Strapi users row. A user may only change their own row,
// and only the fields named here. The row id comes from Strapi by the session email, never from the
// request. Uses STRAPI_ADMIN_TOKEN because users-permissions does not let users update themselves.

import { auth } from '@/auth/auth'
import { API_URL } from '@/config/site'
import { getUserByEmail } from '@/lib/crud/coreCrud'
import { strapiErrorMessage } from '@/lib/strapiError'
import { DASHBOARD_PRODUCTS } from '@/lib/crud/connectedPubset'

const adminToken = () => {
  const token = process.env.STRAPI_ADMIN_TOKEN
  if (!token) throw new Error('STRAPI_ADMIN_TOKEN is not set on the server')
  return token
}

// Write named fields on the signed-in user's own Strapi users row.
async function saveOwnUserFields(fields) {
  const session = await auth()
  if (!session?.user?.email || !session.jwt) throw new Error('Please sign in again')
  const me = await getUserByEmail(session.user.email, session.jwt)
  if (!me?.id) throw new Error('User not found')
  const res = await fetch(`${API_URL}/users/${me.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken()}` },
    body: JSON.stringify(fields),
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(`Strapi ${res.status}${body?.error?.message ? `: ${body.error.message}` : ''}`)
  }
  return fields
}

const setUseConnectedPubsetImpl = value => saveOwnUserFields({ use_connected_pubset: value === true })

// users.dashboard_product: which product's connected pubset the dashboard shows ('' = default order).
const setDashboardProductImpl = value => {
  const product = value || ''
  if (product && !DASHBOARD_PRODUCTS.includes(product)) throw new Error(`Unknown product "${product}"`)
  return saveOwnUserFields({ dashboard_product: product })
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

export async function setDashboardProductAction(value) {
  try {
    return { data: await setDashboardProductImpl(value) }
  } catch (e) {
    const message = strapiErrorMessage(e)
    console.error('user settings action:', message)
    return { error: message }
  }
}
