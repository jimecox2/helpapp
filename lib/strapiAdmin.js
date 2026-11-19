// Copy of tbwww lib/strapiAdmin.js (Phase 3, 15 Nov 2026). Keep the two the same; only the import paths differ.
// lib/strapiAdmin.js — Strapi calls with STRAPI_ADMIN_TOKEN. SERVER ONLY: import it only from server
// actions, route handlers and server components, never from a client component.
//
// Every order and organisation write goes through here (Jim, 14 Nov 2026), so the Strapi
// Authenticated role needs no create / update / delete permission on Order.
import { API_URL } from '@/config/site'

/** Parsed JSON, or throws an Error with `.status` (and Strapi's message when there is one). */
export async function strapiAdmin(path, init = {}) {
  const token = process.env.STRAPI_ADMIN_TOKEN
  if (!token) throw new Error('STRAPI_ADMIN_TOKEN is not set on the server')
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(init.headers || {}) },
    cache: 'no-store',
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(`Strapi ${res.status} on ${path.split('?')[0]}${body?.error?.message ? `: ${body.error.message}` : ''}`)
    err.status = res.status
    throw err
  }
  return body
}

/**
 * A message a person can act on, for the errors that come from setup rather than from what they did.
 * Everything else gets `fallback`. The full error always goes to the server log.
 */
export function strapiProblem(e, fallback) {
  const msg = String(e?.message || '')
  if (/STRAPI_ADMIN_TOKEN is not set/.test(msg)) return 'The website is not set up yet: STRAPI_ADMIN_TOKEN is missing on the server. Please contact support.'
  if (e?.status === 401 || e?.status === 403) {
    return 'The website could not read the licence records: Strapi did not accept the server key (STRAPI_ADMIN_TOKEN). Please contact support.'
  }
  const key = msg.match(/Invalid key (\w+)/i)
  if (e?.status === 400 && key) return `The licence records are missing the field "${key[1]}" in Strapi. Please contact support.`
  return fallback
}
