// lib/strapiCompat.js — lets this site talk to Strapi 4 and Strapi 5 with no other code change (Jim, Nov 2026).
//
// Strapi 5 changed two things this code relies on:
//   1. Responses are flat. The header `Strapi-Response-Format: v4` brings back `data.attributes` (and `id`).
//   2. A record is addressed by its `documentId`, not its numeric `id`: GET / PUT on /api/orders/12 answer 404,
//      and DELETE answers 204 without deleting anything.
// So every call to API_URL gets the header, and a URL /api/<collection>/<number> is turned into
// /api/<collection>/<documentId> (one look-up by `filters[id]`, then cached). Against Strapi 4 the look-up finds no
// documentId and the URL is left as it is, so the same build runs on both.
// Users, auth and upload keep numeric ids in Strapi 5 and are left alone.
//
// Installed once by config/site.js for fetch and for axios (every instance). Remove this file when the code reads
// the flat Strapi 5 shape and keeps documentId itself. Same file in tbwww lib/strapiCompat.js.

const SKIP = new Set(['users', 'auth', 'upload', 'users-permissions', 'connect', 'email', 'i18n', 'content-type-builder'])
const RECORD = /^\/([a-z0-9-]+)\/(\d+)(?=$|[/?#])/
const cache = new Map() // `${collection}/${id}` -> documentId
let v4Until = 0 // Strapi 4 answered (rows without documentId): skip look-ups for 5 minutes

function splitUrl(url, base) {
  if (typeof url !== 'string' || !base || !url.startsWith(base)) return null
  const rest = url.slice(base.length)
  const m = rest.match(RECORD)
  if (!m || SKIP.has(m[1])) return { rest, record: null }
  return { rest, record: { collection: m[1], id: m[2], tail: rest.slice(m[0].length) } }
}

/** The documentId of /<collection>/<id>, or null (Strapi 4, or not found). `get(url)` returns parsed JSON or null. */
async function lookUp(base, { collection, id }, get) {
  const key = `${collection}/${id}`
  if (cache.has(key)) return cache.get(key)
  if (Date.now() < v4Until) return null
  const q = `filters[id][$eq]=${id}&fields[0]=id`
  // A draft-and-publish record has a published and a draft row with different ids: try both.
  for (const extra of ['', '&status=draft']) {
    const body = await get(`${base}/${collection}?${q}${extra}`).catch(() => null)
    const row = Array.isArray(body?.data) ? body.data[0] : null
    if (row) {
      const doc = row.documentId || null
      if (!doc) v4Until = Date.now() + 5 * 60 * 1000
      if (doc) {
        if (cache.size > 5000) cache.clear()
        cache.set(key, doc)
      }
      return doc
    }
  }
  return null
}

/** The URL to call: the documentId one when Strapi 5 has one for this record, else the URL unchanged. */
export async function strapiCompatUrl(url, base, get) {
  const parts = splitUrl(url, base)
  if (!parts?.record) return url
  const doc = await lookUp(base, parts.record, get)
  return doc ? `${base}/${parts.record.collection}/${doc}${parts.record.tail}` : url
}

function headerValue(headers, name) {
  if (!headers) return undefined
  if (typeof headers.get === 'function') return headers.get(name)
  const k = Object.keys(headers).find(h => h.toLowerCase() === name.toLowerCase())
  return k ? headers[k] : undefined
}

export function installStrapiCompat(base, axios) {
  const g = globalThis
  if (!base || g.__tbStrapiCompat) return
  g.__tbStrapiCompat = true

  // fetch (server and browser)
  if (typeof g.fetch === 'function') {
    const original = g.fetch.bind(g)
    g.fetch = async (input, init = {}) => {
      const isRequest = typeof Request !== 'undefined' && input instanceof Request
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : isRequest ? input.url : null
      if (!url || !url.startsWith(base)) return original(input, init)
      const headers = new Headers(init.headers || (isRequest ? input.headers : undefined))
      if (!headers.has('Strapi-Response-Format')) headers.set('Strapi-Response-Format', 'v4')
      const auth = headers.get('Authorization')
      const get = u => original(u, { headers: { 'Strapi-Response-Format': 'v4', ...(auth ? { Authorization: auth } : {}) }, cache: 'no-store' })
        .then(r => (r.ok ? r.json() : null))
      const target = await strapiCompatUrl(url, base, get)
      if (isRequest) return original(new Request(target, input), { ...init, headers })
      return original(target, { ...init, headers })
    }
  }

  // axios: every instance shares Axios.prototype.request
  const proto = axios?.Axios?.prototype
  if (proto && !proto.__tbStrapiCompat) {
    const request = proto.request
    proto.__tbStrapiCompat = true
    proto.request = async function (configOrUrl, maybeConfig) {
      const config = typeof configOrUrl === 'string' ? { ...(maybeConfig || {}), url: configOrUrl } : { ...(configOrUrl || {}) }
      const baseURL = config.baseURL ?? this.defaults?.baseURL // axios.create({ baseURL }) keeps it in defaults
      const full = baseURL && config.url && !/^https?:/i.test(config.url)
        ? `${baseURL.replace(/\/+$/, '')}/${config.url.replace(/^\/+/, '')}`
        : config.url
      if (typeof full === 'string' && full.startsWith(base)) {
        const headers = { ...(config.headers || {}) }
        if (!headerValue(headers, 'Strapi-Response-Format')) headers['Strapi-Response-Format'] = 'v4'
        const d = this.defaults?.headers || {}
        const auth = headerValue(headers, 'Authorization') || headerValue(d, 'Authorization') || headerValue(d.common, 'Authorization')
        const get = u => request.call(this, { url: u, method: 'get', baseURL: undefined, headers: { 'Strapi-Response-Format': 'v4', ...(auth ? { Authorization: auth } : {}) } })
          .then(r => r.data)
        config.url = await strapiCompatUrl(full, base, get)
        config.baseURL = undefined
        config.headers = headers
      }
      return request.call(this, config)
    }
  }
}
