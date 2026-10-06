// Contract test for the /api/ai/* routes. No real Gemini key or Strapi needed: both are stubbed.
// Run:  npm run build && npm run test:ai
import http from 'node:http'
import { spawn } from 'node:child_process'
import assert from 'node:assert/strict'

const listen = handler => new Promise(res => {
  const s = http.createServer(handler).listen(0, '127.0.0.1', () => res({ s, port: s.address().port }))
})

const geminiCalls = []
const gemini = await listen((req, res) => {
  let b = ''
  req.on('data', c => (b += c))
  req.on('end', () => {
    geminiCalls.push({ url: req.url, body: b })
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"ok":true}' }] } }] }))
  })
})
const strapi = await listen((req, res) => {
  const ok = req.url === '/api/users/me' && req.headers.authorization === 'Bearer good-token'
  res.statusCode = ok ? 200 : 401
  res.end('{}')
})

let n = 0
async function startServer(extraEnv) {
  const port = 3200 + n++
  const env = {
    ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1',
    GEMINI_API_KEY: 'TESTKEY', GEMINI_BASE_URL: `http://127.0.0.1:${gemini.port}`,
    STRAPI_URL: `http://127.0.0.1:${strapi.port}/api`, ...extraEnv,
  }
  for (const k of Object.keys(env)) if (env[k] === undefined) delete env[k]
  const p = spawn('npx', ['next', 'start', '-p', String(port), '-H', '127.0.0.1'], { env, stdio: 'ignore' })
  const base = `http://127.0.0.1:${port}`
  for (let i = 0; i < 60; i++) {
    try { await fetch(base + '/api/ai/help', { method: 'OPTIONS' }); return { base, stop: () => p.kill() } } catch { await new Promise(r => setTimeout(r, 500)) }
  }
  p.kill(); throw new Error('server did not start')
}

const post = (base, path, body, headers = {}) =>
  fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) })
const auth = { Authorization: 'Bearer good-token' }

const bodies = {
  'create-project': { userAsk: 'Build a data lake', contextData: { parentData: {}, statusDate: '01-Oct-2026', childrenSummary: { items: [] } } },
  'create-wbs': { userAsk: 'x', mode: 'taskChildren', contextData: { parentData: {}, childrenSummary: { items: [] } } },
  'staff-tasks': { userAsk: 'x', tasks: [], candidates: [], rules: {} },
  'resource-plan': { projectData: {}, resourcePool: [] },
  bcase: { projectData: {}, resultFields: [] },
}
let failed = 0
const t = async (name, fn) => { try { await fn(); console.log('ok  ', name) } catch (e) { failed++; console.log('FAIL', name, '-', e.message) } }

// 1. Normal server: login required (default)
let s = await startServer({})
for (const [route, body] of Object.entries(bodies)) {
  await t(`${route}: 401 without login`, async () => assert.equal((await post(s.base, `/api/ai/${route}`, body)).status, 401))
  await t(`${route}: 401 with bad token`, async () => assert.equal((await post(s.base, `/api/ai/${route}`, body, { Authorization: 'Bearer nope' })).status, 401))
  await t(`${route}: 200 with login, Gemini model and key sent`, async () => {
    geminiCalls.length = 0
    const r = await post(s.base, `/api/ai/${route}`, body, auth)
    assert.equal(r.status, 200)
    const j = await r.json()
    assert.ok(j && typeof j === 'object')
    assert.match(geminiCalls[0].url, /^\/v1beta\/models\/gemini-2\.5-flash:generateContent\?key=TESTKEY$/)
  })
}
await t('help: success shape', async () => {
  const r = await post(s.base, '/api/ai/help', { userQuestion: 'How?', productCode: 'TB', docsContext: '# doc' }, auth)
  assert.equal(r.status, 200)
  const j = await r.json()
  assert.equal(j.success, true); assert.equal(j.answer, '{"ok":true}'); assert.equal(j.metadata.model, 'gemini-2.5-flash'); assert.equal(j.metadata.productCode, 'TB')
})
await t('help: 400 missing userQuestion', async () => assert.equal((await post(s.base, '/api/ai/help', { docsContext: 'x' }, auth)).status, 400))
await t('help: 400 missing docsContext', async () => assert.equal((await post(s.base, '/api/ai/help', { userQuestion: 'x' }, auth)).status, 400))
await t('help: GET gives the worker 405 body', async () => {
  const r = await fetch(s.base + '/api/ai/help'); assert.equal(r.status, 405); assert.deepEqual(await r.json(), { error: 'Method not allowed. Use POST.' })
})
await t('no CORS headers by default', async () => {
  const r = await post(s.base, '/api/ai/help', { userQuestion: 'x', docsContext: 'x' }, { ...auth, Origin: 'https://evil.example' })
  assert.equal(r.headers.get('access-control-allow-origin'), null)
})
s.stop()

// 2. Login off, CORS allowlist, key missing
s = await startServer({ AI_REQUIRE_LOGIN: 'false', AI_ALLOWED_ORIGINS: 'https://tb.timebars.com', GEMINI_API_KEY: undefined })
await t('AI_REQUIRE_LOGIN=false: no token needed; missing key gives 500 {error}', async () => {
  const r = await post(s.base, '/api/ai/bcase', bodies.bcase); assert.equal(r.status, 500); assert.match((await r.json()).error, /GEMINI_API_KEY/)
})
await t('CORS: allowed origin echoed, preflight ok', async () => {
  const r = await fetch(s.base + '/api/ai/bcase', { method: 'OPTIONS', headers: { Origin: 'https://tb.timebars.com' } })
  assert.equal(r.headers.get('access-control-allow-origin'), 'https://tb.timebars.com')
})
s.stop()

// 3. Rate limit
s = await startServer({ AI_REQUIRE_LOGIN: 'false', AI_RATE_LIMIT_PER_MIN: '3' })
await t('rate limit: 4th request in a minute gets 429', async () => {
  const codes = []
  for (let i = 0; i < 4; i++) codes.push((await post(s.base, '/api/ai/bcase', bodies.bcase)).status)
  assert.deepEqual(codes, [200, 200, 200, 429])
})
s.stop()

gemini.s.close(); strapi.s.close()
console.log(failed ? `\n${failed} FAILED` : '\nall passed')
process.exit(failed ? 1 : 0)
