// Shared gate for the /api/ai/* routes (ported Cloudflare Workers).
// Order: body size -> per-IP rate limit -> Strapi login. All settings come from the server
// environment at request time (see .env.example); nothing here is readable by the browser.
import { createHash } from 'node:crypto'

const num = (v, d) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d)

// --- CORS ----------------------------------------------------------------------------------
// The app normally reaches this service through its own nginx (/ai/), same origin, so no CORS
// headers are needed. Only origins listed in AI_ALLOWED_ORIGINS (comma separated) get them.
export function corsHeaders(request) {
  const origin = request?.headers?.get('origin')
  const allowed = (process.env.AI_ALLOWED_ORIGINS || '')
    .split(',').map(s => s.trim().replace(/\/+$/, '')).filter(Boolean)
  if (!origin || !allowed.includes(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  }
}

export function optionsResponse(request) {
  return new Response(null, { headers: { Allow: 'GET, POST, OPTIONS', ...corsHeaders(request) } })
}

function deny(request, status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders(request), 'Content-Type': 'application/json' },
  })
}

// --- Rate limit (per client IP, in memory, fixed one-minute window) ------------------------
const hits = new Map()

function clientIp(request) {
  const xff = request.headers.get('x-forwarded-for')
  return (xff ? xff.split(',')[0].trim() : request.headers.get('x-real-ip')) || 'unknown'
}

function rateLimited(request) {
  const limit = num(process.env.AI_RATE_LIMIT_PER_MIN, 30)
  const now = Date.now()
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v.start > 60000) hits.delete(k)
  const ip = clientIp(request)
  let h = hits.get(ip)
  if (!h || now - h.start > 60000) { h = { start: now, count: 0 }; hits.set(ip, h) }
  h.count += 1
  return h.count > limit
}

// --- Strapi login --------------------------------------------------------------------------
// The browser sends the user's Strapi JWT as `Authorization: Bearer`. It is checked against
// GET {STRAPI_URL}/users/me (STRAPI_URL = the same address as the app's API_URL, e.g.
// https://be2.example.com/api). Good tokens are remembered for a minute, keyed by hash.
// AI_REQUIRE_LOGIN=false switches the check off (sites with no Strapi, e.g. air-gapped LAN).
const good = new Map()

async function loginProblem(request) {
  if (process.env.AI_REQUIRE_LOGIN === 'false') return null
  const strapi = (process.env.STRAPI_URL || '').replace(/\/+$/, '')
  if (!strapi) return { status: 500, message: 'STRAPI_URL is not set on the server (.env.local). Set it, or set AI_REQUIRE_LOGIN=false.' }

  const m = /^Bearer\s+(\S+)$/i.exec(request.headers.get('authorization') || '')
  if (!m) return { status: 401, message: 'Please log in to the Timebars Cloud to use AI.' }

  const key = createHash('sha256').update(m[1]).digest('hex')
  const now = Date.now()
  if ((good.get(key) || 0) > now) return null

  try {
    const res = await fetch(`${strapi}/users/me`, {
      headers: { Authorization: `Bearer ${m[1]}` },
      signal: AbortSignal.timeout(5000),
    })
    if (res.status === 401 || res.status === 403) return { status: 401, message: 'Your login has expired. Please log in again.' }
    if (!res.ok) return { status: 503, message: 'Could not check your login right now.' }
  } catch {
    return { status: 503, message: 'Could not check your login right now.' }
  }
  if (good.size > 5000) good.clear()
  good.set(key, now + 60000)
  return null
}

// Returns a Response to send back when the request must stop, or null to carry on.
export async function guard(request) {
  const maxBytes = num(process.env.AI_MAX_BODY_BYTES, 10 * 1024 * 1024)
  if (Number(request.headers.get('content-length') || 0) > maxBytes) return deny(request, 413, 'Request too large.')
  if (rateLimited(request)) return deny(request, 429, 'Too many requests. Please wait a minute.')
  const problem = await loginProblem(request)
  if (problem) return deny(request, problem.status, problem.message)
  return null
}
