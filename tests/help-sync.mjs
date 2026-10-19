// Test for /update-help's API (/api/help-sync). Strapi is stubbed; the login cookie is minted here.
// Run:  npm run build && npm run test:help
import http from 'node:http'
import { spawn } from 'node:child_process'
import assert from 'node:assert/strict'
import { encode } from 'next-auth/jwt'

const SECRET = 'test-secret-for-help-sync-0123456789'
const COOKIE = '__Secure-tbcloud.session-token' // next start runs as production
const ROLES = { 'jcox@tbcox.com': 'Administrator', 'admin@customer.com': 'administrator', 'pm@tbcox.com': 'Project Manager' }

// --- Strapi stub ---------------------------------------------------------------------------
const articles = [{ id: 7, attributes: { slug: 'common-01-getting-started', title: 'Getting Started' } }]
const writes = []
const listen = handler => new Promise(res => {
  const s = http.createServer(handler).listen(0, '127.0.0.1', () => res({ s, port: s.address().port }))
})
const strapi = await listen((req, res) => {
  let b = ''
  req.on('data', c => (b += c))
  req.on('end', () => {
    res.setHeader('Content-Type', 'application/json')
    const url = new URL(req.url, 'http://x')
    if (process.env.DEBUG_STUB) console.log('stub', req.method, req.url, req.headers.authorization)
    if (url.pathname === '/api/users') {
      const email = url.searchParams.get('filters[email][$eq]')
      if (req.headers.authorization !== `Bearer jwt-${email}`) { res.statusCode = 401; return res.end('{}') }
      return res.end(JSON.stringify(ROLES[email] ? [{ id: 1, email, primary_role: ROLES[email] }] : []))
    }
    if (req.headers.authorization !== 'Bearer admin-token') { res.statusCode = 403; return res.end('{}') }
    if (url.pathname === '/api/help-articles' && req.method === 'GET') return res.end(JSON.stringify({ data: articles }))
    if (url.pathname.startsWith('/api/help-articles')) {
      writes.push({ method: req.method, path: url.pathname, body: JSON.parse(b || '{}') })
      return res.end(JSON.stringify({ data: { id: 99 } }))
    }
    res.statusCode = 404
    res.end('{}')
  })
})

// --- App -----------------------------------------------------------------------------------
const port = 3290
const env = {
  ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1', AUTH_SECRET: SECRET,
  CLOUD_API_URL: `http://127.0.0.1:${strapi.port}/api`, STRAPI_ADMIN_TOKEN: 'admin-token',
  HELP_EDITORS: 'jcox@tbcox.com, admin@other.com,pm@tbcox.com', CLOUD_HELP_URL: 'https://helps.timebars.com',
}
// detached + kill(-pid): stop next-server too, not only the npx wrapper
const app = spawn('npx', ['next', 'start', '-p', String(port), '-H', '127.0.0.1'], { env, stdio: 'ignore', detached: true })
const base = `http://127.0.0.1:${port}`
for (let i = 0; i < 60; i++) {
  try { await fetch(base + '/robots.txt'); break } catch { await new Promise(r => setTimeout(r, 500)) }
}

const cookieFor = async email =>
  `${COOKIE}=${await encode({ token: { email, name: email, jwt: `jwt-${email}` }, secret: SECRET, salt: COOKIE })}`
const call = async (email, init = {}) =>
  fetch(base + '/api/help-sync', {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(email ? { Cookie: await cookieFor(email) } : {}) },
  })

let failed = 0
const t = async (name, fn) => { try { await fn(); console.log('ok  ', name) } catch (e) { failed++; console.log('FAIL', name, '-', e.message) } }

await t('no login -> 401', async () => assert.equal((await call(null)).status, 401))
await t('Administrator not in HELP_EDITORS -> 403', async () => assert.equal((await call('admin@customer.com')).status, 403))
await t('in HELP_EDITORS but not Administrator -> 403', async () => assert.equal((await call('pm@tbcox.com')).status, 403))
await t('editor lists every docsHelp file, matched by slug', async () => {
  const r = await call('jcox@tbcox.com')
  assert.equal(r.status, 200)
  const list = await r.json()
  const ui = list.find(i => i.filename === 'Common_01_Getting_Started.md')
  assert.equal(ui.exists, true)
  assert.equal(ui.strapiId, 7)
  assert.ok(list.some(i => !i.exists))
})
await t('update = content only, links absolute on CLOUD_HELP_URL', async () => {
  writes.length = 0
  const r = await call('jcox@tbcox.com', { method: 'POST', body: JSON.stringify({ action: 'update', filename: 'Common_01_Getting_Started.md', strapiId: 7 }) })
  assert.equal(r.status, 200)
  const { method, path, body } = writes[0]
  assert.equal(`${method} ${path}`, 'PUT /api/help-articles/7')
  assert.deepEqual(Object.keys(body.data), ['content'])
  assert.match(body.data.content, /\]\(https:\/\/helps\.timebars\.com\/common-0\d-[a-z0-9-]+(#[^)]*)?\)/)
  assert.doesNotMatch(body.data.content, /\]\([A-Za-z0-9_]+\.md[#)]/)
  assert.ok(!body.data.content.includes('# Welcome!'), 'title line left in content')
})
await t('update with withMeta also sends title, description, tags, SEO', async () => {
  writes.length = 0
  await call('jcox@tbcox.com', { method: 'POST', body: JSON.stringify({ action: 'update', filename: 'Common_01_Getting_Started.md', strapiId: 7, withMeta: true }) })
  assert.deepEqual(Object.keys(writes[0].body.data).sort(), ['content', 'description', 'seo_keywords', 'seo_title', 'tags', 'title'])
})
await t('create posts slug, category and product tags', async () => {
  writes.length = 0
  const r = await call('jcox@tbcox.com', { method: 'POST', body: JSON.stringify({ action: 'create', filename: 'Agilebars_User_Guide.md' }) })
  assert.equal((await r.json()).id, 99)
  const d = writes[0].body.data
  assert.equal(d.slug, 'agilebars-user-guide')
  assert.deepEqual(d.category, { id: 8 })
})
await t('path traversal refused', async () => {
  const r = await call('jcox@tbcox.com', { method: 'POST', body: JSON.stringify({ action: 'update', filename: '../x.md', strapiId: 7 }) })
  assert.equal(r.status, 400)
})

process.kill(-app.pid)
strapi.s.close()
console.log(failed ? `\n${failed} failed` : '\nall passed')
process.exit(failed ? 1 : 0)
