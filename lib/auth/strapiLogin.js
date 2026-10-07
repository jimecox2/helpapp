// lib/auth/strapiLogin.js — server only.
// Checks the `Authorization: Bearer <token>` on a request: either the server's own
// NOTIFICATION_STRAPI_KEY (used by the automated notification run) or a real Strapi user
// login, verified against {API}/users/me. Good user tokens are remembered for a minute.
import { createHash } from 'node:crypto'

const good = new Map()

const strapiBase = () =>
  (process.env.STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '')

export async function verifyStrapiBearer(request) {
  const m = /^Bearer\s+(\S+)$/i.exec(request.headers.get('authorization') || '')
  if (!m) return false
  const token = m[1]

  const systemKey = process.env.NOTIFICATION_STRAPI_KEY
  if (systemKey && token === systemKey) return true

  const key = createHash('sha256').update(token).digest('hex')
  const now = Date.now()
  if ((good.get(key) || 0) > now) return true

  try {
    const res = await fetch(`${strapiBase()}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return false
  } catch {
    return false
  }
  if (good.size > 5000) good.clear()
  good.set(key, now + 60000)
  return true
}
