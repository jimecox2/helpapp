// Copy of tbwww tests/fakeStrapi.mjs (Phase 3, 15 Nov 2026). Keep the two the same; only the import paths differ.
// In-memory Strapi for tests: users (users-permissions, flat), organisations, orders, products
// (v4 { id, attributes }), with the filters and relations lib/org and lib/orders use.
// Used by tests/seats.mjs; serve() puts it behind HTTP for a browser run.
import http from 'node:http'

// --- fake Strapi ----------------------------------------------------------------------------------
const RELATIONS = { orders: ['product', 'contract', 'organisation', 'user'] }
export function fakeStrapi() {
  const db = { users: new Map(), orgs: new Map(), orders: new Map(), products: new Map(), next: { org: 1, order: 1 } }
  const err = (status, message) => Object.assign(new Error(`Strapi ${status}: ${message}`), { status })
  const tables = { organisations: db.orgs, orders: db.orders, products: db.products }
  const row = (table, o) => {
    const attributes = { ...o }
    delete attributes.id
    for (const r of RELATIONS[table] || []) {
      const target = { product: db.products, contract: db.orders, organisation: db.orgs, user: db.users }[r]
      const t = o[r] ? target.get(o[r]) : null
      attributes[r] = { data: t ? { id: t.id, attributes: { ...t, id: undefined } } : null }
    }
    return { id: o.id, attributes }
  }
  const matches = (o, params) => {
    for (const [key, value] of params) {
      const m = key.match(/^filters\[(\w+)\](?:\[id\])?\[\$eq\]$/)
      if (!m) continue
      const v = o[m[1]]
      if (typeof v === 'boolean') { if (String(v) !== value) return false } else if (String(v ?? '') !== value) return false
    }
    return true
  }
  const strapi = async (path, init = {}) => {
    const method = init.method || 'GET'
    const body = init.body ? JSON.parse(init.body) : null
    const url = new URL(path, 'http://x')
    const p = url.pathname
    let m
    if ((m = p.match(/^\/users\/(\d+)$/))) {
      const u = db.users.get(Number(m[1]))
      if (!u) throw err(404, 'not found')
      if (method === 'PUT') { Object.assign(u, body); return u }
      const org = u.organisation ? db.orgs.get(u.organisation) : null
      return { ...u, organisation: org ? { ...org } : null }
    }
    if (p === '/users/count') {
      const id = Number(url.searchParams.get('filters[organisation][id][$eq]'))
      return [...db.users.values()].filter(u => u.organisation === id).length
    }
    if ((m = p.match(/^\/(organisations|orders|products)(?:\/(\d+))?$/))) {
      const [, table, id] = m
      const map = tables[table]
      if (id) {
        const o = map.get(Number(id))
        if (!o) throw err(404, 'not found')
        if (method === 'PUT') Object.assign(o, body.data)
        if (method === 'DELETE') { map.delete(o.id); return {} }
        return { data: row(table, o) }
      }
      if (method === 'POST') {
        const d = body.data
        if (table === 'organisations') {
          for (const o of db.orgs.values()) if (o.org_customer_id === d.org_customer_id || o.org_join_code === d.org_join_code) throw err(400, 'must be unique')
        }
        const key = table === 'organisations' ? 'org' : 'order'
        const o = { id: db.next[key]++, ...d }
        if (table === 'organisations') { o.org_members = undefined; for (const uid of d.org_members || []) db.users.get(uid).organisation = o.id }
        map.set(o.id, o)
        return { data: row(table, o) }
      }
      return { data: [...map.values()].filter(o => matches(o, url.searchParams)).map(o => row(table, o)) }
    }
    throw err(404, `no route ${method} ${p}`)
  }
  const addUser = (id, extra = {}) => db.users.set(id, { id, username: `user${id}`, email: `u${id}@x.com`, customer_id: null, primary_role: null, organisation: null, ...extra })
  db.products.set(8, { id: 8, name: 'Costbars Enterprise', product_code: 'CBT03', price: 50, discount_price: null })
  db.products.set(9, { id: 9, name: 'Timebars Enterprise', product_code: 'TBT03', price: 40, discount_price: 30 })
  db.products.set(2, { id: 2, name: 'Costbars Basic', product_code: 'CBT01', price: 10 })
  return { strapi, db, addUser }
}


/** The same fake on http://127.0.0.1:<port>/api (only the JSON calls the app makes). */
export async function serve(fake) {
  const server = http.createServer((req, res) => {
    let body = ''
    req.on('data', c => { body += c })
    req.on('end', async () => {
      res.setHeader('Content-Type', 'application/json')
      try {
        const out = await fake.strapi(req.url.replace(/^\/api/, ''), { method: req.method, body: body || undefined })
        res.end(JSON.stringify(out))
      } catch (e) {
        res.statusCode = e.status || 500
        res.end(JSON.stringify({ data: null, error: { status: res.statusCode, message: e.message } }))
      }
    })
  }).listen(0, '127.0.0.1')
  await new Promise(r => server.on('listening', r))
  return { server, url: `http://127.0.0.1:${server.address().port}/api` }
}
